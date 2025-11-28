import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const { axiosAuth } = useContext(AuthContext);

  // 🌍 Backend Base URL (Production + Local)
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const IMAGE_BASE = API_BASE;

  useEffect(() => {
    axiosAuth
      .get("/blogs")
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-4xl text-center font-bold text-cyan-400 mb-10">
        Latest Blogs
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-gray-800 rounded-lg shadow-lg p-5 hover:shadow-cyan-400/30 transition"
          >
            {blog.image && (
              <img
                src={`${IMAGE_BASE}/uploads/${blog.image}`}
                alt={blog.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}

            <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
            <p className="text-sm text-gray-400 mb-2">
              Category: {blog.category}
            </p>
            <p className="text-sm text-gray-300 mb-3">
              {blog.content.slice(0, 100)}...
            </p>

            <Link
              to={`/blogs/${blog._id}`}
              className="text-cyan-500 hover:underline"
            >
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
