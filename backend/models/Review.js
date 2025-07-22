const mongoose = require("mongoose");
const Product = require("./Product");

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: String,
  },
  { timestamps: true }
);

// After save or delete, update product's average rating
async function updateProductRating(productId) {
  const result = await mongoose.model("Review").aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  const avg = result[0] ? result[0].avgRating : 0;
  await Product.findByIdAndUpdate(productId, { rating: avg });
}

reviewSchema.post("save", function () {
  updateProductRating(this.product);
});

reviewSchema.post("remove", function () {
  updateProductRating(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
