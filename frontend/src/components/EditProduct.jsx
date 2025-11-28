import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const EditProduct = () => {
  const { sellerId, productId } = useParams();
  const navigate = useNavigate();
  const { axiosAuth } = useContext(AuthContext); // use authenticated axios

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const IMAGE_BASE = "https://luniostore-backend.vercel.app"; // deployed backend

  // ✅ Fetch single product
  const fetchProduct = async () => {
    try {
      const res = await axiosAuth.get(`/products/${productId}`);
      const p = res.data;
      setForm({
        name: p.name || "",
        category: p.category || "",
        description: p.description || "",
        price: p.price || "",
      });
      setImages(p.images || []);
    } catch (err) {
      console.error("❌ Error fetching product:", err);
      alert("Error fetching product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit updated product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosAuth.put(`/products/${productId}`, form);
      alert("✅ Product updated successfully!");
      navigate(`/seller/dashboard/${sellerId}`);
    } catch (err) {
      console.error("❌ Error updating product:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error updating product");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select category</option>
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="services">Services</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded px-3 py-2"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Save Changes
          </button>
        </form>

        {/* ✅ Show current images */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Current Images</h3>
          <div className="grid grid-cols-2 gap-2">
            {images.length > 0 ? (
              images.map((img, i) => (
                <img
                  key={i}
                  src={`${IMAGE_BASE}/uploads/${img}`}
                  alt={`Product ${i}`}
                  className="w-full h-32 object-cover rounded"
                />
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
