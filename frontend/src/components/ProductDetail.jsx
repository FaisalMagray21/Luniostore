import { useParams, useNavigate } from "react-router-dom";
import products from "../data/product";

const ProductDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.name === name);

  if (!product) {
    return (
      <div className="text-center text-white mt-20">
        <h1 className="text-3xl font-bold">🚫 Product not found!</h1>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded shadow-lg text-white transition transform hover:scale-105"
        >
          ⬅️ Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 animate-fade-in">
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
              src={product.img}
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
              <span className="text-yellow-400 text-lg">⭐ {product.rating}</span>
            </div>

            <p className="text-gray-400">{product.desc}</p>

            <div className="mt-4 text-2xl font-bold text-cyan-400">
              ${product.price}
            </div>

            <div>
              <span className="text-sm text-gray-400">
                📈 Sales:{" "}
                <span className="text-green-400">
                  {Math.floor(Math.random() * 500) + 50}
                </span>
              </span>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => navigate(`/checkout?product=${product.name}`)}
                className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded shadow-lg text-white transition transform hover:scale-105"
              >
                🛒 Shop Now
              </button>
              <button
                className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded shadow-lg text-white transition transform hover:scale-105"
              >
                ❤️ Favorite
              </button>
              <button
                onClick={() => navigate(`/chat?seller=${product.name}`)}
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
