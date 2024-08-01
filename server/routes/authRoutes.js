const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { ensureAuthenticated } = require("../middleware/authMiddleware");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.patch("/send-link", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.get('/check-auth', ensureAuthenticated, authController.checkAuth);
router.post("/token", authController.token);
router.post('/logout', authController.logoutUser);

module.exports = router;
