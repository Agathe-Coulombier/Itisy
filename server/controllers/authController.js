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

const logoutUser = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "Bad Request: userId is required" });
        }

        await authService.logout(userId);
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("logout error", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const checkAuth = async (req, res) => {
    try {
        const user = await authService.checkAuth(req);
        res.status(200).json({ authenticated: true, user });
    } catch (error) {
        console.error("check_auth error", error);
        res.status(500).json({ authenticated: false, message: "Internal Server Error" });
    }
}

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.body.token;
        const user = req.body.user;

        if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { verifiedUser, newAccessToken } = await authService.refreshAccessToken(refreshToken, user);
        if (verifiedUser) {
            res.json({ accessToken: newAccessToken });
        } else {
            res.status(403).json({ message: "Forbidden" });
        }
    } catch (error) {
        console.error("token generation error", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    registerUser, loginUser, logoutUser, forgotPassword, resetPassword, checkAuth, refreshAccessToken
};
