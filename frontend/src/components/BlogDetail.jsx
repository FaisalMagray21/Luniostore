import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const [blog, setBlog] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const token = userInfo?.token;

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
      setBlog(res.data);
      setLikes(res.data.likes?.length || 0);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Error fetching blog:", err);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/blogs/like/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikes(res.data.count);
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/blogs/comment/${id}`,
        { comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data.comments);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  if (!blog) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <Link to="/blogs" className="text-cyan-400 hover:underline mb-4 inline-block">
          ← Back to Blogs
        </Link>

        {blog.image && (
          <img
            src={`http://localhost:5000/uploads/${blog.image}`}
            alt={blog.title}
            className="w-full h-64 object-cover rounded mb-6"
          />
        )}

        <h1 className="text-3xl font-bold mb-3">{blog.title}</h1>
        {blog.category && (
          <p className="text-sm text-gray-400 mb-2">Category: {blog.category}</p>
        )}
        <p className="text-gray-400 text-sm mb-4">
          Published on: {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        <p className="text-base text-gray-200 mb-6">{blog.content}</p>

        {/* Like Section */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleLike}
            className={`px-4 py-2 rounded ${
              token
                ? "bg-cyan-500 hover:bg-cyan-600"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            👍 Like
          </button>
          <span>{likes} {likes === 1 ? "Like" : "Likes"}</span>
        </div>

        {/* Comments Section */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Comments</h2>
          {comments.length > 0 ? (
            <ul className="mb-4">
              {comments.map((c, idx) => (
                <li key={idx} className="mb-3 border-b border-gray-700 pb-2">
                  <p className="text-gray-200">{c.comment}</p>
                  <p className="text-gray-500 text-sm">
                    By <span className="font-medium">{c.user?.name || "Unknown"}</span> •{" "}
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 mb-4">No comments yet.</p>
          )}

          {/* Add Comment Form */}
          {token ? (
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded"
              >
                Post
              </button>
            </form>
          ) : (
            <p
              className="text-cyan-400 cursor-pointer hover:underline"
              onClick={() => navigate("/signin")}
            >
              Login to like or comment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
