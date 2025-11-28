const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const orderController = require("../controller/orderController");

// 🧾 Seller routes — must come BEFORE routes with parameters like "/:id"
router.get("/seller/orders", auth, orderController.getSellerOrders);
router.get("/seller/stats", auth, orderController.getSellerStats);
router.put("/update-stats/:id", auth, orderController.updateOrderStatus);

// 🛒 Buyer routes
router.post("/", auth, orderController.placeOrder);
router.get("/", auth, orderController.getMyOrders);
router.get("/:id", auth, orderController.getOrderById);
router.put("/:id/status", auth, orderController.updateOrderStatusByBuyer);


module.exports = router;
