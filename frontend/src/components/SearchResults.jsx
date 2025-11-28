import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://luniostore-backend.vercel.app/api";
const IMAGE_BASE = "https://luniostore-backend.vercel.app/uploads";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("query");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE}/products/search?q=${query}`);
        setProducts(data);
      } catch (error) {
        console.error("Search fetch error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Search Results for "{query}"
        </h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : products.length > 0 ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
              >
                {/* Product Image */}
                <div
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="cursor-pointer relative"
                >
                  <img
                    src={
                      p.images && p.images.length > 0
                        ? `${IMAGE_BASE}/${p.images[0]}`
                        : "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={p.name}
                    className="w-full h-40 object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-purple-600 text-xs px-2 py-1 rounded-full">
                    {p.category}
                  </span>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-sm text-gray-300 mb-4">{p.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400 font-bold">${p.price}</span>
                    <span className="text-yellow-400 text-sm">
                      ⭐ {p.rating || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
