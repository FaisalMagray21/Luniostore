import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
  });

  const token = localStorage.getItem("token");

  const fetchProduct = async () => {
    const res = await axios.get(`http://localhost:5000/api/products/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const found = res.data.find((p) => p._id === id);
    if (!found) {
      alert("Product not found or unauthorized");
      navigate("/");
      return;
    }
    setProduct(found);
    setForm({
      name: found.name,
      category: found.category,
      description: found.description,
      price: found.price,
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(
      `http://localhost:5000/api/products/${id}`,
      form,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Product updated!");
    navigate("/dashboard");
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  if (!product) return <div className="p-6">Loading...</div>;

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

        {/* Show current images */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Current Images</h3>
          <div className="grid grid-cols-2 gap-2">
            {product.images && product.images.length > 0 ? (
              product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:5000/uploads/${img}`}
                  alt={`Product ${idx}`}
                  className="w-full h-32 object-cover rounded"
                />
              ))
            ) : (
              <p>No images available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
