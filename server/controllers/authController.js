const authService = require("../services/authService");
const passport = require('passport');

const registerUser = async (req, res) => {
    try {
        // Register user logic
        await authService.registerUser(req.body);
        res.status(200).json({ message: "User registered successfully" });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { userPayload, accessToken, refreshToken } = await authService.loginUser(req.body);

        // Return the tokens and user information to the client
        return res.status(200).json({
            message: "User logged in successfully",
            userPayload,
            accessToken,
            refreshToken
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        await authService.forgotPassword(req.body);
        res.status(200).json({message : "A mail has been successfully sent, check your spams if you can't find it"})
    }
    catch (error){
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const resetPassword = async (req, res) => {
    try{
        await authService.resetPassword(req);
        res.status(200).json({message : "Password updated"})
    }
    catch (error){
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    registerUser, loginUser, forgotPassword, resetPassword, 
};
