import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://luniostore-backend.vercel.app/api";
const IMAGE_BASE = "https://luniostore-backend.vercel.app/uploads";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products/${id}`);
      setProduct(res.data);
      if (res.data.images?.length > 0) {
        setSelectedImage(`${IMAGE_BASE}/${res.data.images[0]}`);
      }
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
        `${API_BASE}/products/${id}/rate`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Rating submitted successfully!");
      fetchProduct();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to submit rating");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <h1 className="text-2xl animate-pulse">⏳ Loading product...</h1>
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
    <div className="bg-gray-950 text-gray-200 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-cyan-400 hover:text-cyan-300 mb-6 inline-block transition"
        >
          ← Back to products
        </button>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/2 flex flex-col items-center">
            <div className="w-full flex justify-center">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full max-h-[450px] object-contain rounded-xl shadow-lg transition-transform transform hover:scale-105"
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex justify-center flex-wrap gap-3 mt-4">
                {product.images.map((img, index) => {
                  const imageUrl = `${IMAGE_BASE}/${img}`;
                  return (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      onClick={() => setSelectedImage(imageUrl)}
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                        selectedImage === imageUrl
                          ? "border-cyan-400"
                          : "border-transparent"
                      } hover:border-cyan-300`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:w-1/2 space-y-5">
            <h1 className="text-4xl font-bold text-cyan-300">{product.name}</h1>

            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-purple-700 px-3 py-1 text-sm rounded-full shadow">
                {product.category}
              </span>
              <span className="text-yellow-400 text-lg">
                ⭐ {product.rating?.toFixed(1) || "0.0"}
              </span>
              <span className="text-sm text-gray-400">
                📦 In Stock: {product.stock || "N/A"}
              </span>
            </div>

            <p className="text-gray-400 leading-relaxed">{product.description}</p>

            <div className="text-3xl font-bold text-cyan-400">${product.price}</div>
            <div className="text-sm text-gray-400">
              📈 Sales: <span className="text-green-400">{product.salesCount || 0}</span>
            </div>

            <div className="mt-6">
              <label className="block text-gray-300 mb-2">Your Rating:</label>
              <div className="flex items-center">
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
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => navigate(`/checkout?product=${product._id}`)}
                className="bg-cyan-600 hover:bg-cyan-700 px-5 py-3 rounded-lg shadow-md text-white transition transform hover:scale-105"
              >
                🛒 Shop Now
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-lg shadow-md text-white transition transform hover:scale-105">
                ❤️ Favorite
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
