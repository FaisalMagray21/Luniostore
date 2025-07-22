const Review = require("../models/Review");

exports.createReview = async (req, res) => {
  try {
    const review = new Review({
      ...req.body,
      user: req.user.id,
    });
    await review.save();
    res.status(201).json({ message: "Review added!", review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviewsForProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate("user", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!review) return res.status(404).json({ message: "Review not found or unauthorized" });
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
