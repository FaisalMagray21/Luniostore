import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // assuming you have AuthContext

const Favourites = () => {
  const { userInfo } = useContext(AuthContext);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getFavourites = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/favorites`, // your backend endpoint to get user favourites
        { withCredentials: true }
      );
      setFavourites(res.data);
    } catch (err) {
      console.error("Error fetching favourites", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFavourites();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (favourites.length === 0) {
    return <div className="text-center py-20">No favourite products yet ❤️</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">My Favourite Products</h2>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favourites.map((product) => (
          <div key={product._id} className="bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">
            <div onClick={() => navigate(`/product/${product._id}`)} className="cursor-pointer">
              <img
                src={product.image} // adjust according to your API response
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold">{product.name}</h4>
                <p className="text-sm text-gray-300 mb-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 font-bold">${product.price}</span>
                  <span className="text-yellow-400 text-sm">⭐ {product.rating}</span>
                </div>
              </div>
            </div>
            <div className="px-4 pb-4 mt-2">
              <button
                onClick={() => navigate(`/checkout?product=${product._id}`)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-3 py-1 rounded shadow w-full"
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourites;
