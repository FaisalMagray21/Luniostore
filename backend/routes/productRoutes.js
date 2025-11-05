const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const upload = require("../utils/upload");
const productController = require("../controller/productController");

// Add product
router.post("/", auth, upload.array("images", 5), productController.addProduct);

router.put("/:id/rate", auth, productController.rateProduct);


// Edit product
router.put("/:id", auth, productController.editProduct);

// Delete product
router.delete("/:id", auth, productController.deleteProduct);

// Get my products
router.get("/my", auth, productController.getMyProducts);
router.get("/category/:cat", productController.getByCategory);
router.get("/all",productController.getallProducts);
// Get product by ID

// Analytics
router.get("/top", productController.getTopProducts);
router.get("/search",productController.searchProducts);

router.get("/stats", auth, productController.getSellerStats);
router.get("/:id", productController.getProductById);

module.exports = router;
