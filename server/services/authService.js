const bcrypt = require("bcrypt");
const React = require("react");
const pool = require("../databases/database");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const {render} = require('@react-email/components');
const MailTemplate = require("../../client/src/emails/MailTemplate.js");

// Function to register a new user
const registerUser = async (userData) => {
    const { firstName, lastName, email, password, confirmPassword } = userData;

    // Validation checks for user input data
    if (!firstName) {
        throw new Error("Please provide a first name");
    }

    if (!email) {
        throw new Error("Please provide an email");
    }

    // Validate email format
    const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailReg.test(email)) {
        throw new Error("Email format not valid");
    }

    if (!password) {
        throw new Error("Please provide a password");
    }

    // Check if a user with the provided email already exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [ email, ]);
    if (user.rows.length > 0) {
        throw new Error("User with this email already exists");
        }

    // Validate password format
    const passwordReg = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passwordReg.test(password)) {
            throw new Error("The password must contain at least 8 characters, including at least one upper case, one lower case, one number and one special character (!,?,#,&,$...)");
        }

    // Check if passwords are matching
    if (password !== confirmPassword) {
        throw new Error("Passwords are not matching");
        }

    // Hashing password for security
    const hashPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const insertSTMT = `INSERT INTO users (firstName, lastName, email, password) VALUES ('${firstName}', '${lastName}', '${email}', '${hashPassword}')`;
    await pool.query(insertSTMT);

};

// Function to authenticate and login a user
const loginUser = async (userData) => {
    const { email, password } = userData;
    
    // Validation checks for user input data
    if (!email) throw new Error("Please provide an email");

    if (!password) throw new Error("Please provide a password");

    // Validate email format
    const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailReg.test(email)) {
        throw new Error("Email format not valid");
    }

    // Check if a user with the provided email exists 
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    console.log(user.rows.length)
    if (user.rows.length === 0) {
        throw new Error("User does not exist")
    }

    // Validate the user's password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) throw new Error("Invalid password");

    const userPayload = { id: user.rows[0].user_id, email: user.rows[0].email };
    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    // Save refresh token in the database or a cache
    await pool.query("UPDATE users SET refresh_token = $1 WHERE user_id = $2", [refreshToken, user.rows[0].user_id]);

    return { userPayload, accessToken, refreshToken };
}

// Function to handle password rester request
const forgotPassword = async (userData) => {
    const {email} = userData;

    // Validation checks for user input data
    if (!email) {
        throw new Error("Please provide an email");
    }

    // Validate email format
    const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailReg.test(email)) {
        throw new Error("Email format not valid");
    }

    // Check if user with the provided email is in the database
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
        ]);
        if (user.rows.length === 0) {
        throw new Error("User does not exist")
        }

    // Generate a reset link using JWT with a temporary token
    const resetSecret = require('config').get("Services")["api"]["RESET_SECRET"]
    const token = jwt.sign({user: user.rows[0].email}, resetSecret, { expiresIn: '30m'});
    
    // Update the user's temporary token in the dB
    const updateResult = await pool.query(`UPDATE users SET temp_token = $1 WHERE user_id = $2`, [token, user.rows[0].user_id]);
    if (updateResult.rowCount === 0) {
        throw new Error("Failed to update the temporary token in the database");
    }

    // Fetch the updated user record to ensure temp_token is updated correctly
    const updatedUser = await pool.query("SELECT * FROM users WHERE user_id = $1", [user.rows[0].user_id]);

    sendEmail(updatedUser.rows[0], token);
}

// Function sending an email after a password reset request
const sendEmail = async(user, token) => {

    // Set Sengrid API key
    sgMail.setApiKey(require('config').get("Services")["api"]["SENDGRID_API_KEY"])

    // Read the content of the HTML email template file
    const firstName = user.firstname;
    const emailHtml = MailTemplate({ url: `http://localhost:3000/auth/reset-password?token=${token}`, firstName: firstName });

    // Compose the email message
    const msg = {
        to: user.email,
        from: "Agathe.Coulombier@gmail.com", 
        subject: "Reset your password",
        html: emailHtml
    };

    // Send the email using SendGrid
    sgMail.send(msg)
        .then(() => {
        console.log("Email sent");
    }).catch((error) => {
        console.error(error);
    })
}

// Function to handle resetting the user's password
const resetPassword = async (req) => {
    const resetLink = req.params.token;
    const newPassword = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const resetSecret = require('config').get("Services")["api"]["RESET_SECRET"]

    // Validate password format
    const passwordReg = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordReg.test(newPassword)) {
        throw new Error("The password must contain at least 8 characters, including at least one upper case, one lower case, one number and one special character (!,?,#,&,$...)");
    }

    // Check if passwords are matching
    if (newPassword !== confirmPassword) {
        throw new Error("Passwords are not matching");
    }

    // Verify the reset token using the secret
    if(resetLink) {
        jwt.verify(resetLink, resetSecret, (error, decodedToken) => {
            if(error) {
                throw new Error ("Your link has expired");
            }
    })
    };

    // Fetch user data based on the temporary token
    const user = await pool.query(`SELECT * FROM users WHERE temp_token = $1`, [resetLink])

    // Hash the new password
    const hashPassword = await bcrypt.hash(newPassword, 10);

    try{
        // Update the user's password and remove the temporary token
        await pool.query(`UPDATE users SET temp_token = null, password=$1 WHERE user_id = $2`, [hashPassword, user.rows[0].user_id]);
    } catch (error) {
        throw new Error("Your link has expired");
    }
}

// Function to generate access token
const generateAccessToken = (user) => {
    return jwt.sign(user, require('config').get("Services")["auth"]["ACCESS_TOKEN_SECRET"], { expiresIn: '15m' });
};

// Function to generate refresh token
const generateRefreshToken = (user) => {
    return jwt.sign(user, require('config').get("Services")["auth"]["REFRESH_TOKEN_SECRET"], { expiresIn: '7d' });
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
};
