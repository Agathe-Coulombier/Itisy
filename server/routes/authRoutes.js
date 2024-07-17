const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { ensureAuthenticated } = require("../middleware/authMiddleware");


router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.patch("/send-link", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.get('/check-auth', ensureAuthenticated, (req, res) => {

    try {
            res.status(200).json({ authenticated: true, user: req.user});
    } catch (error) {
        console.error("check_auth error", error);
        res.status(500).json({ authenticated: false, message: "Internal Server Error" });
    }
});

router.post("/token", async (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

    // Verify refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ message: "Forbidden" });

        // Check if the refresh token is in the database
        const dbToken = await pool.query("SELECT refresh_token FROM users WHERE user_id = $1", [user.id]);
        if (dbToken.rows.length === 0 || dbToken.rows[0].refresh_token !== refreshToken) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const newAccessToken = generateAccessToken({ id: user.id, email: user.email });
        res.json({ accessToken: newAccessToken });
    });
});

router.post("/logout", async (req, res) => {
    const { userId } = req.body;
    await pool.query("UPDATE users SET refresh_token = null WHERE user_id = $1", [userId]);
    res.status(200).json({ message: "Logged out successfully" });
});


module.exports = router;
