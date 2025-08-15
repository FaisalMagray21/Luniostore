import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch product from backend
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Error fetching product:", err);
      navigate("/404");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // ✅ Submit rating with token
  const submitRating = async () => {
    if (rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to rate this product");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/products/${id}/rate`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Rating submitted successfully!");
      fetchProduct(); // refresh product data
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to submit rating");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-white mt-20">
        <h1 className="text-3xl font-bold">⏳ Loading...</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-white mt-20">
        <h1 className="text-3xl font-bold">🚫 Product not found!</h1>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="text-cyan-400 hover:text-cyan-300 mb-6 inline-block transition"
        >
          ← Back to products
        </button>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row gap-8">
          {/* Image */}
          <div className="md:w-1/2 flex items-center justify-center">
            <img
              src={`http://localhost:5000/uploads/${product.images?.[0]}`}
              alt={product.name}
              className="w-full h-auto max-h-96 rounded-lg shadow-lg object-contain transform hover:scale-105 transition duration-300"
            />
          </div>

          {/* Details */}
          <div className="md:w-1/2 space-y-4">
            <h1 className="text-4xl font-bold text-cyan-300">{product.name}</h1>

            <div className="flex items-center gap-3">
              <span className="bg-purple-700 px-3 py-1 text-sm rounded-full shadow">
                {product.category}
              </span>
              <span className="text-yellow-400 text-lg">⭐ {product.rating.toFixed(1)}</span>
            </div>

            <p className="text-gray-400">{product.description}</p>

            <div className="mt-4 text-2xl font-bold text-cyan-400">
              ${product.price}
            </div>

            <div>
              <span className="text-sm text-gray-400">
                📈 Sales:{" "}
                <span className="text-green-400">{product.salesCount || 0}</span>
              </span>
            </div>

            {/* Rating Input */}
            <div className="mt-4">
              <label className="block text-gray-300 mb-2">Your Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="bg-gray-700 text-white px-3 py-2 rounded"
              >
                <option value="0">Select rating</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    ⭐ {r}
                  </option>
                ))}
              </select>
              <button
                onClick={submitRating}
                className="ml-3 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-black font-semibold"
              >
                Submit
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => navigate(`/checkout?product=${product._id}`)}
                className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded shadow-lg text-white transition transform hover:scale-105"
              >
                🛒 Shop Now
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded shadow-lg text-white transition transform hover:scale-105">
                ❤️ Favorite
              </button>
              <button
                onClick={() => navigate(`/chat?seller=${product.seller?._id}`)}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded shadow-lg text-white transition transform hover:scale-105"
              >
                📩 Message Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
