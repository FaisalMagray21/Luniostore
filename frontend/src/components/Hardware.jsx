import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Hardware = () => {
  const [hardwareProducts, setHardwareProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axiosAuth, userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const IMAGE_BASE = "https://luniostore-backend.vercel.app"; // Replace with deployed backend

  // Fetch Hardware products
  useEffect(() => {
    const fetchHardware = async () => {
      try {
        const res = await axiosAuth.get("/products/category/Hardware");
        const hardwareOnly = res.data.filter(
          (p) => p.category?.toLowerCase() === "hardware"
        );
        setHardwareProducts(hardwareOnly);
      } catch (err) {
        console.error("Failed to fetch hardware products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHardware();
  }, [axiosAuth]);

  // Toggle favorite
  const handleFavorite = async (productId) => {
    if (!userInfo) {
      alert("Please login first to add favorites!");
      navigate("/signin");
      return;
    }

    try {
      await axiosAuth.post(`/favorites/toggle/${productId}`);
      alert("Toggled favorite successfully!");
      // Optionally update local state for instant UI feedback
      setHardwareProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, isFavorite: !p.isFavorite } : p
        )
      );
    } catch (err) {
      console.error("Error toggling favorite", err);
      alert("Failed to add/remove product from favorites.");
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-white">Loading...</div>;
  }

  if (hardwareProducts.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        No hardware products found.
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Hardware Products
        </h1>

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
                {p.images?.[0] ? (
                  <img
                    src={`${IMAGE_BASE}/uploads/${p.images[0]}`}
                    alt={p.name}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="h-40 bg-gray-700 flex justify-center items-center text-gray-400">
                    No Image
                  </div>
                )}
                <span className="absolute top-2 left-2 bg-purple-600 text-xs px-2 py-1 rounded-full">
                  New
                </span>
              </div>

              <div className="p-4">
                <h4 className="text-lg font-semibold">{p.name}</h4>
                <p className="text-sm text-gray-300 mb-4">{p.description || p.desc}</p>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-cyan-400 font-bold">${p.price}</span>
                  <span className="text-yellow-400 text-sm">⭐ {p.rating || 0}</span>
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
                    className={`${
                      p.isFavorite ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"
                    } text-white text-xs px-3 py-1 rounded shadow w-full`}
                  >
                    {p.isFavorite ? "❤️ Favorited" : "❤️ Favorite"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hardware;
