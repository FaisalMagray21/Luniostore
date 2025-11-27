import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AddBlog = () => {
  const { id } = useParams(); // 🧭 Get sellerId from URL
  const navigate = useNavigate();
  const { axiosAuth } = useContext(AuthContext); // 🔐 Authenticated axios instance

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    image: null,
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧠 Handle Input Change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  // 🧠 Handle Form Submit with Validation + Redirect
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    // 🧩 Validation (Regression Check)
    if (!form.title || !form.content || !form.category) {
      setMsg("⚠️ Please fill all required fields before submitting!");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => data.append(key, val));
      data.append("sellerId", id); // 🆔 Include sellerId in payload

      const res = await axiosAuth.post("/blogs", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg(res.data.message || "✅ Blog added successfully!");

      // 🧭 Redirect to Seller Dashboard after short delay (Fixed path)
      setTimeout(() => {
        navigate(`/seller/dashboard/${id}`);
      }, 1000);
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "❌ Failed to add blog.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          📝 Add a New Blog
        </h2>

        {/* Message */}
        {msg && (
          <p
            className={`text-center mb-4 font-semibold ${
              msg.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {msg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Content
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows="5"
              placeholder="Write your blog content..."
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select Category</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Services">Services</option>
            </select>
          </div>

          {/* Image */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-gray-700"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "📤 Submit Blog"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
