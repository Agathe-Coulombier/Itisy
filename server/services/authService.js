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
    if (!email) {
        throw new Error("Please provide your email")
    };

    if (!password) {
        throw new Error("Please provide your password")
        }

    // Validate email format
    const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailReg.test(email)) {
        throw new Error("Email format not valid");
    }

    // Check if a user with the provided email exists 
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
    ]);
    if (user.rows.length === 0) {
    throw new Error("User does not exist")
    }

    // Validate the user's password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
    throw new Error("Invalid password")
    }
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
    const resetLink = jwt.sign({user: user.rows[0].email},
        resetSecret, { expiresIn: '30m'});
    
    // Update the user's temporary token in the dB
    await pool.query(`UPDATE users SET temp_token = $1 WHERE user_id = $2`, [resetLink, user.rows[0].user_id]);
    
    // Send password reset email with the generated reset link
    sendEmail(user.rows[0], resetLink);
}

// Function sending an email after a password reset request
const sendEmail = async(user, token) => {
    // Set Sengrid API key
    sgMail.setApiKey(require('config').get("Services")["api"]["SENDGRID_API_KEY"])

    // Read the content of the HTML email template file
    const firstName = user.firstname;
    const emailHtml = MailTemplate({ url: `http://localhost:3000/auth/reset-password?token=${token}`, firstName: firstName });

    console.log(emailHtml)
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
const resetPassword = async (user) => {
    const resetLink = user.params.token;
    const newPassword = user.body;
    const resetSecret = require('config').get("Services")["api"]["RESET_SECRET"]

    // Verify the reset token using the secret
    if(resetLink) {
        jwt.verify(resetLink, resetSecret, (error, decodedToken) => {
            if(error) {
                throw new Error ('Incorrect token or expired');
            }
    })
    };

    // Fetch user data based on the temporary token
    const userData = await pool.query(`SELECT * FROM users WHERE temp_token = $1`, [resetLink])
    // Check the user has the valid token
    if(!userData) {
        res.status(400).json({ message: 'We could not find a match for this link' });
    } else {
        // Hash the new password
        const hashPassword = await bcrypt.hash(newPassword.password, 10);
        // Update the user's password and remove the temporary token
        await pool.query(`UPDATE users SET temp_token = null, password=$1 WHERE user_id = $2`, [hashPassword, userData.rows[0].user_id]);
    }

}

// Initiates the Facebook Login flow
const fbInit = async (req, res) => {
    const APP_ID = require('config').get("Services")["api"]["facebook"]["APP_ID"];
    const REDIRECT_URL = require('config').get("Services")["api"]["facebook"]["REDIRECT_URL"];
    const url = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${REDIRECT_URL}&scope=email`;
    res.redirect(url);
    };

// Callback URL for handling the Facebook Login response
const fbLogin = async (req, res) => {
    const APP_ID = require('config').get("Services")["api"]["facebook"]["APP_ID"];
    const APP_SECRET = require('config').get("Services")["api"]["facebook"]["APP_SECRET"];
    const { code } = req.query;

    try {
    // Exchange authorization code for access token
    const { data } = await axios.get(`https://graph.facebook.com/v13.0/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}&code=${code}&redirect_uri=${REDIRECT_URI}`);

    const { access_token } = data;

    // Use access_token to fetch user profile
    const { data: profile } = await axios.get(`https://graph.facebook.com/v13.0/me?fields=name,email&access_token=${access_token}`);

    console.log(data.user)
    // Code to handle user authentication and retrieval using the profile data

    res.redirect('/');
    } catch (error) {
    console.error('Error:', error.response.data.error);
    res.redirect('/login');
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    fbInit,
    fbLogin,
};
