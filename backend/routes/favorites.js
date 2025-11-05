const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// Toggle Add/Remove Favorite
router.post("/toggle/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.favorites.indexOf(req.params.productId);
    if (index === -1) {
      user.favorites.push(req.params.productId);
      await user.save();
      return res.json({ message: "Added to favorites", favorites: user.favorites });
    } else {
      user.favorites.splice(index, 1);
      await user.save();
      return res.json({ message: "Removed from favorites", favorites: user.favorites });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get logged-in user's favorites
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
