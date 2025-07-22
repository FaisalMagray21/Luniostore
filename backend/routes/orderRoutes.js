const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const auth = require("../middleware/auth"); // assume you already have this

router.post("/", auth, orderController.createOrder);
router.get("/", auth, orderController.getMyOrders);
router.get("/:id", auth, orderController.getOrderById);
router.patch("/:id/status", auth, orderController.updateOrderStatus);

module.exports = router;
