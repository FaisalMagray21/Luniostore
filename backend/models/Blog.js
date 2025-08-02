const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const blogSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true, maxlength: 250 },
  image: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Blog", blogSchema);
