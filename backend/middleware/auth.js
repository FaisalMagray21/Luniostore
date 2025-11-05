const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // 🔹 Get token from headers
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 Find user and attach it to req.user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found, invalid token" });
    }

    req.user = user; // ✅ now contains full user object (with _id, name, email, role, etc.)

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
