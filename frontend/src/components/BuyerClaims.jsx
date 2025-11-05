import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const BuyerClaims = () => {
  const { axiosAuth, userInfo, loading } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!loading && userInfo?.user?.role !== "buyer") {
      navigate("/unauthorized");
    }
  }, [loading, userInfo, navigate]);

  const fetchOrders = async () => {
    try {
      const res = await axiosAuth.get("orders");
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [axiosAuth]);

  // ✅ Update status when buyer receives product
  const handleMarkAsReceived = async (orderId) => {
    try {
      setUpdatingId(orderId);
      await axiosAuth.put(`orders/${orderId}/status`, { status: "Delivered" });
      await fetchOrders();
      alert("✅ Product marked as Received!");
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("❌ Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading || loadingOrders) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading your claimed products...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-600">
        <h2 className="text-2xl font-semibold mb-2">No claimed products yet</h2>
        <p>Browse products and place your first order!</p>
        <button
          onClick={() => navigate(`/buyer/products/${id}`)}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
          🛍️ My Claimed Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const product = order.product;
            const imageSrc = Array.isArray(product?.images)
              ? `http://localhost:5000/uploads/${product.images[0]}`
              : product?.image || "/placeholder.png";

            return (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden"
              >
                <img
                  src={imageSrc}
                  alt={product?.name}
                  className="h-48 w-full object-cover"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {product?.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product?.description}
                  </p>
                  <p className="text-gray-700 font-medium mt-2">
                    Price: ${order.totalPrice}
                  </p>
                  <p className="text-sm mt-1">
                    Quantity:{" "}
                    <span className="font-medium">{order.quantity}</span>
                  </p>
                  <p className="text-sm mt-1">
                    Status:{" "}
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>

                  {/* ✅ Mark as received button */}
                  {order.status !== "Delivered" && (
                    <button
                      onClick={() => handleMarkAsReceived(order._id)}
                      disabled={updatingId === order._id}
                      className={`mt-3 w-full py-2 rounded-lg text-white transition ${
                        updatingId === order._id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {updatingId === order._id
                        ? "Updating..."
                        : "Mark as Received"}
                    </button>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BuyerClaims;
