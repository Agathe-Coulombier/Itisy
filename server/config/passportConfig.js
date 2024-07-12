const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../databases/database");
const authService = require("../services/authService");

const authUser = async (email, password, done) => {
    try {
        // Perform the login logic using your loginUser function
        await authService.loginUser({ email, password });

        // Fetch user data from the database to include in the session
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        // If user is found and authenticated, return the user object
        console.log("user rows length : ", user.rows.length)
        if (user.rows.length > 0) {
            return done(null, user.rows[0]);
            
        } else {
            return done(null, false, { message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        return done(null, false, { message: error.message });
    }
};

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, authUser));

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
        if (user.rows.length > 0) {
            done(null, user.rows[0]);
        } else {
            done(null, false);
        }
    } catch (error) {
        done(error, false);
    }
});


module.exports = passport;
