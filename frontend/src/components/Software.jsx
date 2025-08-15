import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Software = () => {
  const [softwareProducts, setSoftwareProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/category/Software");
        const softwareOnly = res.data.filter((p) => p.category.toLowerCase() === "software");
        setSoftwareProducts(softwareOnly);
      } catch (err) {
        console.error("Failed to fetch software products", err);
      }
    };

    fetchSoftware();
  }, []);

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Software Products</h1>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {softwareProducts.map((p, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
            >
              <div
                onClick={() => navigate(`/product/${p._id}`)}
                className="cursor-pointer relative"
              >
                <img
                  src={`http://localhost:5000/uploads/${p.images?.[0] || p.images}`}
                  alt={p.name}
                  className="w-full h-40 object-cover"
                />
                <span className="absolute top-2 left-2 bg-blue-600 text-xs px-2 py-1 rounded-full">
                  Featured
                </span>
              </div>

              <div className="p-4">
                <h4 className="text-lg font-semibold">{p.name}</h4>
                <p className="text-sm text-gray-300 mb-4">{p.desc}</p>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-400 font-bold">${p.price}</span>
                  <span className="text-yellow-400 text-sm">⭐ {p.rating}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/checkout?product=${p.name}`)}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded shadow"
                  >
                    Buy Now
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded shadow">
                    💾 Save
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

export default Software;
