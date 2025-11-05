const Order = require("../models/Order");
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
  try {
    const products = await Product.find()
      .sort({ salesCount: -1, rating: -1 })
      .limit(8);
    res.status(200).json(products); // fixed here
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch top products", error: error.message });
  }
};




exports.getSellerStats = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Fetch seller's products
    const products = await Product.find({ seller: sellerId });
    const productIds = products.map(p => p._id);

    // Fetch all orders containing those products
    const orders = await Order.find({ product: { $in: productIds } });

    let totalSales = 0;
    let totalRevenue = 0;

    orders.forEach(order => {
      totalSales += order.quantity;
      totalRevenue += order.totalPrice;
    });

    res.json({
      totalSales,
      totalRevenue,
    });
  } catch (err) {
    console.error("Error in getSellerStats:", err);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

exports.getByCategory = async (req, res) => {
  const categoryParam = req.params.cat.toLowerCase();
  const products = await Product.find({
    category: { $regex: new RegExp(`^${categoryParam}$`, "i") } // case-insensitive match
  });
  res.json(products);
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "name email");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
};




exports.rateProduct = async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Agar user ne pehle rating di hai, update karo
    const existingRating = product.ratings.find(r => r.user.toString() === userId);
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      product.ratings.push({ user: userId, rating });
    }

    // Average rating calculate
    const avgRating =
      product.ratings.reduce((acc, r) => acc + r.rating, 0) / product.ratings.length;
    product.rating = avgRating;

    await product.save();

    res.json({ message: "Rating submitted successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 🔍 Case-insensitive search by product name
exports.searchProducts = async (req, res) => {
  try {
    const q = req.query.q || "";
    const regex = new RegExp(q, "i"); // case-insensitive

    const products = await Product.find({
      $or: [
        { name: regex },
        { category: regex },
        { description: regex }
      ],
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};



