const Blog = require("../models/Blog");

// Seller adds a blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file?.filename; // image from multer

    const newBlog = new Blog({
      title,
      content,
      image,
      user: req.user.id, // from auth middleware
    });

    await newBlog.save();
    res.status(201).json({ success: true, blog: newBlog });
  } catch (error) {
    console.error("Blog creation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  const blogs = await Blog.find()
    .populate("seller", "name")
    .populate("product", "title")
    .populate("comments.user", "name");
  res.json(blogs);
};

// Like a blog
exports.likeBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog.likes.includes(req.user.id)) {
    blog.likes.push(req.user.id);
    await blog.save();
  }
  res.json(blog);
};

// Comment on a blog
exports.commentBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  blog.comments.push({ user: req.user.id, comment: req.body.comment });
  await blog.save();
  res.json(blog);
};
