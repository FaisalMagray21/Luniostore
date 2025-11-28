import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Checkout = () => {
  const { axiosAuth, userInfo } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [product, setProduct] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const productId = new URLSearchParams(location.search).get("product");

  // ✅ Backend image base URL
  const IMAGE_BASE = "https://luniostore-backend.vercel.app";

  // ✅ Fetch product details
  useEffect(() => {
    if (!productId) {
      alert("⚠️ No product selected.");
      navigate("/");
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await axiosAuth.get(`/products/${productId}`);
        setProduct(res.data);
      } catch (err) {
        console.error("❌ Error fetching product:", err.response?.data || err.message);
        alert("Failed to load product. Please try again.");
        navigate("/");
      }
    };

    fetchProduct();
  }, [productId, navigate, axiosAuth]);

  // ✅ Handle order placement
  const handlePlaceOrder = async () => {
    if (!userInfo?.token) {
      alert("⚠️ Please login first!");
      navigate("/login");
      return;
    }

    if (!shippingAddress.trim()) {
      alert("Please enter a valid shipping address!");
      return;
    }

    if (!product) return;

    const totalPrice = product.price * quantity + 5; // $5 shipping fee

    const orderData = {
      product: product._id,
      quantity,
      paymentMethod,
      shippingAddress,
      totalPrice,
      seller: product.seller?._id,
    };

    try {
      setLoading(true);
      // ✅ Place order
      await axiosAuth.post("/orders", orderData);

      // ✅ Update seller stats
      try {
        await axiosAuth.put(`/orders/update-stats/${product.seller?._id}`, {
          saleAmount: product.price * quantity,
        });
      } catch (err) {
        console.warn("⚠️ Seller stats update skipped:", err.response?.data || err.message);
      }

      alert("🎉 Order placed successfully!");
      navigate("/buyer/orders");
    } catch (err) {
      console.error("❌ Error placing order:", err.response?.data || err.message);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <div className="text-center text-gray-200 py-20">Loading product...</div>;
  }

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen p-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6 shadow">
        <h1 className="text-3xl font-bold mb-4">🛒 Checkout</h1>

        {/* Product Info */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <img
            src={
              product.images?.length
                ? `${IMAGE_BASE}/uploads/${product.images[0]}`
                : product.image
                ? `${IMAGE_BASE}/uploads/${product.image}`
                : "/placeholder.png"
            }
            alt={product.name}
            className="w-full md:w-48 h-32 object-cover rounded"
          />
          <div>
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-400">{product.description}</p>
            <p className="mt-2 font-bold text-cyan-400">${product.price}</p>
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label className="block mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 px-2 py-1 rounded bg-gray-700 text-gray-200"
          />
        </div>

        {/* Shipping Address */}
        <div className="mb-4">
          <label className="block mb-1">Shipping Address</label>
          <textarea
            rows="3"
            placeholder="123 Main St, Karachi, Pakistan"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 text-gray-200"
          />
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <label className="block mb-1">Payment Method</label>
          <div className="flex gap-4">
            {["credit", "paypal", "cod"].map((method) => (
              <label key={method} className="flex items-center gap-1">
                <input
                  type="radio"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {method === "cod" ? "Cash on Delivery" : method.toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <div className="flex justify-between">
            <span>Product Price</span>
            <span>
              ${product.price} × {quantity}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>$5</span>
          </div>
          <div className="flex justify-between font-bold mt-2">
            <span>Total</span>
            <span>${product.price * quantity + 5}</span>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className={`${
            loading ? "bg-gray-600" : "bg-cyan-600 hover:bg-cyan-700"
          } w-full py-2 rounded text-white font-semibold transition-all`}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
