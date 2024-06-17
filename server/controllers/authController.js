const authService = require("../services/authService");

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

const loginUser = async (req, res) => {
    try {
        // Login user logic
        await authService.loginUser(req.body);
        res.status(200).json({ message: "User logged in successfully" });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}; 

const forgotPassword = async (req, res) => {
    try {
        await authService.forgotPassword(req.body);
        res.status(200).json({message : "Mail sent successfully"})
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

const fbInit = async(req, res) => {
    try{
        await authService.fbInit(req);
        res.status(200).json({message : "Facebook login initiated"})
    }
    catch (error){
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const fbLogin = async(req, res) => {
    try {
        await authService.fbLogin(req);
        res.status(200).json({message : "Facebook login"})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    registerUser, loginUser, forgotPassword, resetPassword, fbInit, fbLogin,
};
