const express = require("express");
const authController=require("../controller/authController");
const router = express.Router();
// 🧪 Signup with OTP
router.post("/signup",authController.signup);
// 🧪 Verify OTP & Create User
router.post("/verify-otp",authController.verifyotp);
// 🧪 Resend OTP (for signup)
router.post ("/resend-otp",authController.resendotp);
// 🧪 Login
router.post("/login",authController.login);
// 🧪 Forgot Password → Send OTP
router.post("/forgot-password",authController.forgotPassword);
// 🧪 Verify Forgot Password OTP
router.post("/verify-forgot-otp",authController.verifyforgototp);
// 🧪 Reset Password (no need to send OTP here anymore)
router.post("reset-password",authController.resetPassword);
module.exports = router;
