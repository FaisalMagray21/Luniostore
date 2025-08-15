import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch top products from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products/top")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching top products", err);
        setLoading(false);
      });
  }, []);

  // ✅ Handle Add to Favorites
  const handleFavorite = async (productId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/favorites/toggle/${productId}`,
        {},
        { withCredentials: true }
      );
      navigate("/favorites");
    } catch (err) {
      console.error("Error adding to favorites", err);
    }
  };

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  if (loading) {
    return <div className="text-center text-white py-20">Loading...</div>;
  }

  return (
    <div className="bg-gray-950 text-gray-200">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-800 to-indigo-900 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to <span className="text-cyan-300">Lunio</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Your one-stop marketplace for cutting-edge hardware, software, and
            tech services — tailored for Nepal, built for the world.
          </p>
          <div className="mt-6">
            <a
              href="/shop"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded text-lg"
            >
              Shop Now
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Browse Categories</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => handleCategoryClick("/hardware")}
              className="bg-purple-700 hover:bg-purple-800 p-4 rounded shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold">Hardware</h3>
            </div>
            <div
              onClick={() => handleCategoryClick("/software")}
              className="bg-indigo-700 hover:bg-indigo-800 p-4 rounded shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold">Software</h3>
            </div>
            <div
              onClick={() => handleCategoryClick("/services")}
              className="bg-cyan-700 hover:bg-cyan-800 p-4 rounded shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold">Services</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Products
          </h2>
          {products.length === 0 ? (
            <p className="text-center text-gray-400">
              No top products found.
            </p>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                            ? `http://localhost:5000/uploads/${p.images[0]}`
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
                      <h4 className="text-lg font-semibold">{p.name}</h4>
                      <p className="text-xs text-gray-400 mb-1">
                        Category: {p.category}
                      </p>
                      <p className="text-sm text-gray-300 mb-4">{p.description}</p>
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
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Lunio Technologies Pvt. Ltd. — All rights
        reserved.
      </footer>
    </div>
  );
};

export default Home;
