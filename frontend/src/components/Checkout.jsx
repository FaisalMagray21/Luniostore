import { useState } from "react";

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit");

  const handlePlaceOrder = () => {
    alert("🎉 Order Placed Successfully!");
  };

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen p-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6 shadow">
        <h1 className="text-3xl font-bold mb-4">🛒 Checkout</h1>

        {/* Product Info */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <img
            src="https://source.unsplash.com/300x200/?product"
            alt="Product"
            className="w-full md:w-48 h-32 object-cover rounded"
          />
          <div>
            <h2 className="text-xl font-semibold">Gaming Mouse</h2>
            <p className="text-sm text-gray-400">High-precision gaming mouse with RGB lighting.</p>
            <p className="mt-2 font-bold text-cyan-400">$49</p>
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label className="block mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-20 px-2 py-1 rounded bg-gray-700 text-gray-200"
          />
        </div>

        {/* Shipping Address */}
        <div className="mb-4">
          <label className="block mb-1">Shipping Address</label>
          <textarea
            rows="3"
            placeholder="123 Main St, Kathmandu, Nepal"
            className="w-full px-3 py-2 rounded bg-gray-700 text-gray-200"
          />
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <label className="block mb-1">Payment Method</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                value="credit"
                checked={paymentMethod === "credit"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit Card
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              PayPal
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <div className="flex justify-between">
            <span>Product Price</span>
            <span>$49 x {quantity}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>$5</span>
          </div>
          <div className="flex justify-between font-bold mt-2">
            <span>Total</span>
            <span>${49 * quantity + 5}</span>
          </div>
        </div>

        {/* Place Order */}
        <button
          onClick={handlePlaceOrder}
          className="bg-cyan-600 hover:bg-cyan-700 w-full py-2 rounded text-white font-semibold"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
