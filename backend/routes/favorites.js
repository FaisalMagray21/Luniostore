const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth"); // JWT auth middleware

// ✅ Toggle Add/Remove Favorite
router.post("/toggle/:productId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.favorites.indexOf(productId);

    if (index === -1) {
      user.favorites.push(productId);
      await user.save();
      return res.json({ message: "Added to favorites", favorites: user.favorites });
    } else {
      user.favorites.splice(index, 1);
      await user.save();
      return res.json({ message: "Removed from favorites", favorites: user.favorites });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get User Favorites
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
