import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://luniostore-backend.vercel.app/api";
const IMAGE_BASE = "https://luniostore-backend.vercel.app/uploads";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-white">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-400">You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="bg-gray-800 p-4 rounded shadow mb-4 text-gray-200">
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ${order.totalAmount}</p>
            <ul className="mt-2">
              {order.products.map((item) => (
                <li key={item.product._id} className="flex items-center gap-2">
                  <img
                    src={item.product.images?.[0] ? `${IMAGE_BASE}/${item.product.images[0]}` : "/placeholder.png"}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <span>{item.product.name} — {item.quantity} × ${item.product.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
