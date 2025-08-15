const mongoose = require("mongoose");
const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, required: true }
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["hardware", "software", "services"],
      required: true,
    },
    description: { type: String },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
      ratings: [ratingSchema], 

    salesCount: { type: Number, default: 0 },
    images: [{ type: String }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
