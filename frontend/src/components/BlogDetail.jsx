import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/blogs/${id}`)
      .then((res) => setBlog(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!blog) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <Link to="/blogs" className="text-cyan-400 hover:underline mb-4 inline-block">← Back to Blogs</Link>
        {blog.image && (
          <img src={`http://localhost:5000/uploads/${blog.image}`} alt={blog.title} className="w-full h-64 object-cover rounded mb-6" />
        )}
        <h1 className="text-3xl font-bold mb-3">{blog.title}</h1>
        <p className="text-sm text-gray-400 mb-2">Category: {blog.category}</p>
        <p className="text-base text-gray-200">{blog.content}</p>
      </div>
    </div>
  );
};

export default BlogDetail;
