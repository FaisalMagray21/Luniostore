const express = require("express");
const router = express.Router();
const reviewController = require("../controller/reviewController");
const auth = require("../middleware/auth");

router.post("/", auth, reviewController.createReview);
router.get("/product/:productId", reviewController.getReviewsForProduct);
router.delete("/:id", auth, reviewController.deleteReview);

module.exports = router;
