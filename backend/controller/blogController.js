const Blog = require("../models/Blog");

// Seller adds a blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file?.filename;

    const newBlog = new Blog({
      title,
      content,
      image,
      seller: req.user.id,
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

// Like/Unlike Blog
exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const userId = req.user.id;
    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(id => id.toString() !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
res.json({ likes: blog.likes, count: blog.likes.length, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Get Blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("seller", "name")
      .populate("likes", "name")
      .populate("comments.user", "name");

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.commentBlog = async (req, res) => {
  try {
    if (!req.body.comment?.trim()) {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    blog.comments.push({
      user: req.user.id,
      comment: req.body.comment
    });

    await blog.save();
    const updatedBlog = await Blog.findById(req.params.id)
      .populate("comments.user", "name"); // ✅ Return with names

res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

