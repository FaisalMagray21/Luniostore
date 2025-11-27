import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { userInfo, axiosAuth } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // BASE URL for images (Vercel backend)
  const IMAGE_BASE = "https://luniostore-backend.vercel.app";

  useEffect(() => {
    axiosAuth
      .get("products/top")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching top products", err);
        setLoading(false);
      });
  }, []);

  const handleFavorite = async (productId) => {
    if (!userInfo?.token) {
      navigate("/login");
      return;
    }

    try {
      await axiosAuth.post(`/favorites/toggle/${productId}`);
      navigate("/favorites");
    } catch (err) {
      console.error("Error adding to favorites", err);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  if (loading)
    return <div className="text-center text-white py-20">Loading...</div>;

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-800 to-indigo-900 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Welcome to <span className="text-cyan-300">Lunio</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            Your one-stop marketplace for hardware, software, and tech services.
          </p>
          <div className="mt-6">
            <Link
              to="/shop"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded text-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            Browse Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div
              onClick={() => handleCategoryClick("/hardware")}
              className="bg-purple-700 hover:bg-purple-800 p-6 rounded shadow cursor-pointer"
            >
              <h3 className="text-lg sm:text-xl font-semibold">Hardware</h3>
            </div>
            <div
              onClick={() => handleCategoryClick("/software")}
              className="bg-indigo-700 hover:bg-indigo-800 p-6 rounded shadow cursor-pointer"
            >
              <h3 className="text-lg sm:text-xl font-semibold">Software</h3>
            </div>
            <div
              onClick={() => handleCategoryClick("/services")}
              className="bg-cyan-700 hover:bg-cyan-800 p-6 rounded shadow cursor-pointer"
            >
              <h3 className="text-lg sm:text-xl font-semibold">Services</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            Featured Products
          </h2>
          {products.length === 0 ? (
            <p className="text-center text-gray-400">No top products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
                >
                  <div
                    onClick={() => navigate(`/product/${p._id}`)}
                    className="cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={
                          p.images?.length
                            ? `${IMAGE_BASE}/uploads/${p.images[0]}`
                            : "/no-image.jpg"
                        }
                        alt={p.name}
                        className="w-full h-40 object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-purple-600 text-xs px-2 py-1 rounded-full">
                        Top
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="text-base sm:text-lg font-semibold">
                        {p.name}
                      </h4>
                      <p className="text-xs text-gray-400 mb-1">
                        Category: {p.category}
                      </p>
                      <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                        {p.description}
                      </p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-cyan-400 font-bold">
                          ${p.price}
                        </span>
                        <span className="text-yellow-400 text-sm">
                          ⭐ {p.rating?.toFixed(1) || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 px-4 pb-4">
                    <button
                      onClick={() => navigate(`/checkout?product=${p._id}`)}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs sm:text-sm px-3 py-1 rounded shadow w-full"
                    >
                      Shop Now
                    </button>
                    <button
                      onClick={() => handleFavorite(p._id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm px-3 py-1 rounded shadow w-full"
                    >
                      ❤️ Favorite
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 text-center text-xs sm:text-sm text-gray-400">
        © {new Date().getFullYear()} Lunio Technologies Pvt. Ltd.
      </footer>
    </div>
  );
};

export default Home;
