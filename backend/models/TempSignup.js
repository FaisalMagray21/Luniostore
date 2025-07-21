const mongoose = require("mongoose");

const tempSignupSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  otp: String,
  otpExpires: Date,
});

module.exports = mongoose.model("TempSignup", tempSignupSchema);
