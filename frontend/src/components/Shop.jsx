import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = "https://luniostore-backend.vercel.app";
const IMAGE_BASE = `${BACKEND_URL}/uploads`;

const Shop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/products/all`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-800 to-purple-900 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Shop All Products
          </h1>
          <p className="text-lg max-w-2xl mx-auto">
            Explore our collection of hardware, software, and services — handpicked to power your digital lifestyle.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transform hover:-translate-y-1 transition"
              >
                {/* Product Image */}
                <div
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="cursor-pointer"
                >
                  <img
                    src={
                      p.images?.length > 0
                        ? `${IMAGE_BASE}/${p.images[0]}`
                        : "/placeholder.png"
                    }
                    alt={p.name}
                    className="w-full h-40 object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h4 className="text-lg font-bold">{p.name}</h4>
                  <p className="text-xs text-gray-400">Category: {p.category}</p>
                  <p className="text-sm mt-1">{p.description}</p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-cyan-400 font-bold">${p.price}</span>
                    <span className="text-yellow-400 text-sm">
                      ⭐ {p.rating || "4.5"}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => navigate(`/checkout?product=${p._id}`)}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-3 py-1 rounded shadow"
                    >
                      Shop Now
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded shadow">
                      ❤️ Favorite
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
