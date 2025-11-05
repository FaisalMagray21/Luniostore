import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    category: "hardware",
    description: "",
    price: "",
  });
  const [images, setImages] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { axiosAuth } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    images.forEach((img) => data.append("images", img));

    try {
      const res = await axiosAuth.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg(res.data.message || "Product added successfully!");
      navigate("/seller/dashboard");
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">➕ Add Product</h2>
        {msg && <p className="mb-4 text-red-600">{msg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-4 py-2 bg-gray-100 rounded"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-2 bg-gray-100 rounded"
          >
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="services">Services</option>
          </select>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            required
            className="w-full px-4 py-2 bg-gray-100 rounded"
          />
          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            className="w-full px-4 py-2 bg-gray-100 rounded"
          />
          <input
            type="file"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files))}
            className="w-full"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
