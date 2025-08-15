const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
const auth = require("../middleware/auth");
const upload = require("../utils/upload"); 

router.post("/", auth, upload.single("image"), blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.put("/like/:id", auth, blogController.likeBlog);
router.post("/comment/:id", auth, blogController.commentBlog);


module.exports = router;
