import { useEffect, useState } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>
      {orders.map((order) => (
        <div key={order._id} className="bg-white p-4 rounded shadow mb-2">
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ${order.totalAmount}</p>
          <ul>
            {order.products.map((item) => (
              <li key={item.product._id}>
                {item.product.name} — {item.quantity} × ${item.product.price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;