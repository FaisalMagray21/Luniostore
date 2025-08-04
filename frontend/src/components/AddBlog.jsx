// AddBlog.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    
    image: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data = new FormData();
    for (const key in form) data.append(key, form[key]);

    try {
      await axios.post("http://localhost:5000/api/blogs", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/seller/dashboard");
    } catch (error) {
      console.error("Failed to post blog:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📝 Add a New Blog</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Title</label>
            <input
              name="title"
              placeholder="Enter blog title"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Content (Max 250 words)</label>
            <textarea
              name="content"
              placeholder="Write your blog content..."
              maxLength={250}
              rows="5"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
           <select
  name="category"
  value={form.category}
  onChange={handleChange}
  required
  className="w-full px-3 py-2 text-black rounded"
>
  <option value="">Select Category</option>
  <option value="Hardware">Hardware</option>
  <option value="Software">Software</option>
  <option value="Services">Services</option>
</select>

          </div>

         

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Blog Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-gray-700"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
          >
            📤 Submit Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
