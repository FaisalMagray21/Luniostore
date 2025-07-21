import products from "../data/product";
import { useNavigate } from "react-router-dom";

const Hardware = () => {
  const navigate = useNavigate();

  const hardwareProducts = products.filter(p => p.category === "Hardware");

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Hardware Products</h1>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hardwareProducts.map((p, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
            >
              <div
                onClick={() => navigate(`/product/${p.name}`)}
                className="cursor-pointer relative"
              >
                <img
                  src={p.img}
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
                  {/* Shop Now → goes to checkout with product info */}
                  <button
                    onClick={() => navigate(`/checkout?product=${p.name}`)}
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
    </div>
  );
};

export default Hardware;
