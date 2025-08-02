const Product = require("../models/Product");

exports.addProduct = async (req, res) => {
  const { name, category, description, price } = req.body;

  if (!["hardware", "software", "services"].includes(category)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  const images = req.files.map(file => file.filename);

  const product = new Product({
    name,
    category,
    description,
    price,
    images,
    seller: req.user.id,
  });

  await product.save();
  res.status(201).json({ message: "Product added", product });
};

exports.editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, description, price } = req.body;

  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (product.seller.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (category && !["hardware", "software", "services"].includes(category)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  product.name = name || product.name;
  product.category = category || product.category;
  product.description = description || product.description;
  product.price = price || product.price;

  await product.save();

  res.json({ message: "Product updated", product });
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (product.seller.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  await product.deleteOne();
  res.json({ message: "Product deleted" });
};

exports.getMyProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user.id });
  res.json(products);
};
exports.getallProducts=async(req,res)=>{
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};


exports.getTopProducts = async (req, res) => {
  const products = await Product.find()
    .sort({ salesCount: -1 })
    .limit(5);
  res.json(products);
};

exports.getSellerStats = async (req, res) => {
  const products = await Product.find({ seller: req.user.id });
  const totalSales = products.reduce((acc, p) => acc + p.salesCount, 0);
  const totalRevenue = products.reduce((acc, p) => acc + p.salesCount * p.price, 0);
  res.json({ totalSales, totalRevenue });
};
exports.getByCategory = async (req, res) => {
  const categoryParam = req.params.cat.toLowerCase();
  const products = await Product.find({
    category: { $regex: new RegExp(`^${categoryParam}$`, "i") } // case-insensitive match
  });
  res.json(products);
};

