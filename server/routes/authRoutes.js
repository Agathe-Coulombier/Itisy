const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");


router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.patch("/send-link", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);

// Facebook login
router.get('/facebook', authController.fbInit);
router.get('/facebook/callback', authController.fbLogin);

module.exports = router;
