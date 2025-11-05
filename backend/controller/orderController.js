const Order = require("../models/Order");
const User = require("../models/User");

exports.placeOrder = async (req, res) => {
  try {
    const {
      product,
      quantity,
      totalPrice,
      seller,
      shippingAddress,
      paymentMethod,
    } = req.body;

    // ✅ Validate required fields
    if (!product || !quantity || !totalPrice || !seller || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Create order
    const order = await Order.create({
      buyer: req.user._id,
      product,
      seller,
      quantity,
      totalPrice,
      shippingAddress,
      paymentMethod,
      status: "Pending",
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("❌ Error placing order:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
};

// 🧾 Buyer orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).populate("product seller");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔍 Get single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("product buyer seller");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📈 Seller orders
exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id }).populate("product buyer");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📊 Seller stats
exports.getSellerStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({ seller: req.user._id });
    const totalEarnings = await Order.aggregate([
      { $match: { seller: req.user._id, status: "Delivered" } },
      { $group: { _id: null, earnings: { $sum: "$totalPrice" } } },
    ]);

    res.json({
      totalOrders,
      totalEarnings: totalEarnings[0]?.earnings || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update seller stats after sale
exports.updateOrderStatus = async (req, res) => {
  try {
    const { saleAmount } = req.body;
    const seller = await User.findById(req.params.id);

    if (!seller) return res.status(404).json({ message: "Seller not found" });

    seller.totalSales = (seller.totalSales || 0) + saleAmount;
    await seller.save();

    res.json({ message: "Seller stats updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating seller stats" });
  }
};

// ✅ Buyer can update order status (e.g., mark as received)
exports.updateOrderStatusByBuyer = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Only buyer can change their own order
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    order.status = status || "Delivered";
    await order.save();

    res.json({ message: "Order status updated successfully", order });
  } catch (err) {
    console.error("❌ Error updating order status:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};


