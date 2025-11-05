import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Favourites = () => {
  const { userInfo } = useContext(AuthContext);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch user's favourites
  const getFavourites = async () => {
    if (!userInfo?.token) {
      navigate("/signin");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/favorites", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      const userFavs = res.data.filter(
        (fav) => fav.user?._id === userInfo._id || fav.userId === userInfo._id
      );

      setFavourites(userFavs);
    } catch (err) {
      console.error("❌ Error fetching favourites:", err);
      if (err.response?.status === 401) navigate("/signin");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove favourite
const removeFavourite = async (productId) => {
  try {
    const res = await axios.post(
      `http://localhost:5000/api/favorites/toggle/${productId}`,
      {},
      { headers: { Authorization: `Bearer ${userInfo.token}` } }
    );

    // Update UI immediately
    setFavourites((prev) => prev.filter((fav) => fav._id !== productId));
    alert("Removed from favourites ❤️‍🔥");
  } catch (err) {
    console.error("Error removing favourite:", err);
    alert("Failed to remove favourite");
  }
};
  useEffect(() => {
    if (userInfo) getFavourites();
    else navigate("/signin");
  }, [userInfo]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (favourites.length === 0)
    return <div className="text-center py-20">No favourite products yet ❤️</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        My Favourite Products ❤️
      </h2>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
{favourites.map((fav) => {
  const product = fav.product || fav;
  return (
    <div key={fav._id} className="bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">
      <div onClick={() => navigate(`/product/${product._id}`)} className="cursor-pointer">
        <img
          src={
            Array.isArray(product.images)
              ? `http://localhost:5000/uploads/${product.images[0]}`
              : product.image || "/placeholder.png"
          }
          alt={product.name}
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <h4 className="text-lg font-semibold text-white">{product.name}</h4>
          <p className="text-sm text-gray-300 mb-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-cyan-400 font-bold">${product.price}</span>
            <span className="text-yellow-400 text-sm">⭐ {product.rating}</span>
          </div>
        </div>
      </div>

      {/* ✅ Buttons */}
      <div className="px-4 pb-4 mt-2 flex gap-2">
        <button
          onClick={() => removeFavourite(fav._id)} // ✅ FIXED
          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded shadow w-1/2"
        >
          Remove
        </button>
        <button
          onClick={() => navigate(`/checkout?product=${product._id}`)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-3 py-1 rounded shadow w-1/2"
        >
          Shop Now
        </button>
      </div>
    </div>
  );
})}
      </div>
    </div>
  );
};

export default Favourites;
