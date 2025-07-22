const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const TempSignup = require("../models/TempSignup");



const transporter = nodemailer.createTransport({
host: process.env.HOST,
port: 465,
secure:true,
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
},
debug:true,
logger:true
});
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 15 * 60 * 1000; // 15 min
    const hashedPassword = await bcrypt.hash(password, 10);

    await TempSignup.deleteOne({ email });

    const temp = new TempSignup({
      name,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpires,
    });
    await temp.save();

    await transporter.sendMail({
      from: '"Faisal" <dev-faisal@breezbyte.com>', // SAME as SMTP auth user
      to: email,
      subject: "Your OTP for Signup",
      html: `<h3>Your OTP is: ${otp}</h3><p>Expires in 15 minutes.</p>`,
    });

    res.json({ message: "OTP sent to email" });

  } catch (err) {
    console.error("🔥 Error in signup:", err);  // print full error to terminal
    res.status(500).json({ message: err.message });
  }
};



exports.verifyotp=async (req, res) => {
  const { email, otp } = req.body;

  const temp = await TempSignup.findOne({
    email,
    otp,
    otpExpires: { $gt: Date.now() },
  });

  if (!temp) return res.status(400).json({ message: "Invalid or expired OTP" });

  const user = new User({
    name: temp.name,
    email: temp.email,
    password: temp.password,
    role: temp.role,
  });
  await user.save();

  await TempSignup.deleteOne({ email });

  res.json({ message: "Signup successful!" });
}


exports.resendotp=async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const temp = await TempSignup.findOne({ email });
  if (!temp) {
    return res.status(404).json({ message: "No pending signup found for this email" });
  }

  // generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 15 * 60 * 1000;

  temp.otp = otp;
  temp.otpExpires = otpExpires;
  await temp.save();

  await transporter.sendMail({
    from: '"Faisal" <dev-faisal@breezbyte.com>',
    to: email,
    subject: "Your New OTP for Signup",
    html: `<h3>Your new OTP is: ${otp}</h3><p>Expires in 15 minutes.</p>`,
  });

  res.json({ message: "New OTP sent to email" });
}




// 🔷 Login

exports.login=async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
}



// 🔷 Forgot Password


exports.forgotPassword=async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "No user found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 15 * 60 * 1000;

  user.resetOtp = otp;
  user.resetOtpExpires = otpExpires;
  await user.save();

  await transporter.sendMail({
    from: '"Faisal" <dev-faisal@breezbyte.com>',
    to: email,
    subject: "Your New OTP for Signup",
    html: `<h3>Your new OTP for password reset  is: ${otp}</h3><p>Expires in 15 minutes.</p>`,
  });

  res.json({ message: "OTP sent to email." });
}


// 🔷 Reset Password
exports.verifyforgototp=async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    resetOtp: otp,
    resetOtpExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

  // ✅ clear OTP now
  user.resetOtp = undefined;
  user.resetOtpExpires = undefined;
  await user.save();

  res.json({ message: "OTP verified" });
}

exports.resetPassword=async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;

  await user.save();

  res.json({ message: "Password reset successful!" });
}

