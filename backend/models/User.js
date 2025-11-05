const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["buyer", "seller"], default: "buyer" },
// User.js
favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],


  resetOtp: String,
  resetOtpExpires: Date,

});

module.exports = mongoose.model("User", userSchema);
