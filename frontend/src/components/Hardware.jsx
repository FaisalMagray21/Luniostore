import { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Hardware = () => {
  const [hardwareProducts, setHardwareProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch Hardware products
  useEffect(() => {
    const fetchHardware = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/products/category/Hardware"
        );
        const hardwareOnly = res.data.filter(
          (p) => p.category.toLowerCase() === "hardware"
        );
        setHardwareProducts(hardwareOnly);
      } catch (err) {
        console.error("Failed to fetch hardware products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHardware();
  }, []);

  // Toggle favorite
  const handleFavorite = async (productId) => {
    const token = localStorage.getItem("token"); // JWT token from login
    if (!token) {
      alert("Please login first to add favorites!");
      navigate("/signin");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/favorites/toggle/${productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data.message); // Added / Removed favorite
    } catch (err) {
      console.error("Error toggling favorite", err);
      alert("Failed to add/remove product from favorites.");
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-white">Loading...</div>;
  }

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Hardware Products</h1>

        {hardwareProducts.length === 0 ? (
          <p className="text-center text-gray-400">No hardware products found.</p>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hardwareProducts.map((p) => (
              <div
                key={p._id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
              >
                <div
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="cursor-pointer relative"
                >
                  <img
                    src={`http://localhost:5000/uploads/${p.images[0]}`} 
                    alt={p.name}
                    className="w-full h-40 object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-purple-600 text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                </div>

                <div className="p-4">
                  <h4 className="text-lg font-semibold">{p.name}</h4>
                  <p className="text-sm text-gray-300 mb-4">{p.desc}</p>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-cyan-400 font-bold">${p.price}</span>
                    <span className="text-yellow-400 text-sm">⭐ {p.rating}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/checkout?product=${p._id}`)}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-3 py-1 rounded shadow w-full"
                    >
                      Shop Now
                    </button>
                    <button
                      onClick={() => handleFavorite(p._id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded shadow w-full"
                    >
                      ❤️ Favorite
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hardware;
