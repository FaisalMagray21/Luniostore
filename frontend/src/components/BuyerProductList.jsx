import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BuyerProductList = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { axiosAuth, userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  // BASE URL for images
  const IMAGE_BASE = "https://luniostore-backend.vercel.app";

  // ✅ Fetch all available products
  const fetchProducts = async () => {
    try {
      const res = await axiosAuth.get("/products/all");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // ✅ Claim Product (Place an Order)
  const handleClaim = async (productId) => {
    try {
      const quantity = prompt("Enter quantity:", "1");
      if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
        return alert("❌ Invalid quantity entered.");
      }

      await axiosAuth.post("/orders", {
        productId,
        quantity,
        buyerId: userInfo?.user?.id,
      });

      alert("✅ Product claimed successfully!");
      navigate(`/buyer/claims/${userInfo?.user?.id}`);
    } catch (err) {
      console.error("Error claiming product:", err);
      alert("❌ Failed to claim product. Try again later.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loadingProducts) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-500 animate-pulse">
          Loading products...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🛍️ Available Products
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          No products available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
            >
              <img
                src={
                  p.images?.length
                    ? `${IMAGE_BASE}/uploads/${p.images[0]}`
                    : "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={p.name}
                className="w-full h-52 object-cover"
              />

              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 truncate">
                  {p.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 capitalize">
                  Category: {p.category || "N/A"}
                </p>
                <p className="text-green-600 font-bold mt-2 text-lg">
                  ${p.price}
                </p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {p.description}
                </p>

                <div className="mt-5 flex justify-between items-center">
                  <button
                    onClick={() => handleClaim(p._id)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md"
                  >
                    Claim Product
                  </button>
                  <button
                    onClick={() => navigate(`/product/${p._id}`)}
                    className="text-sm text-gray-500 underline hover:text-gray-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerProductList;
