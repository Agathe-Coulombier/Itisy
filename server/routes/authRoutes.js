const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// router.get("/redirect", authController.redirectHomepage);
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.patch("/send-link", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.get('/check-auth', (req, res) => {
    console.log("check auth")
    try {
        console.log("is auth ? ", req.isAuthenticated())
        if (req.isAuthenticated()) {
            res.status(200).json({ authenticated: true });
        } else {
            res.status(401).json({ authenticated: false });
        }
    } catch (error) {
        console.error("check_auth error", error)
    }

});

module.exports = router;
