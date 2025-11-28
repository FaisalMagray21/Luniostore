import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const BACKEND_URL = "https://luniostore-backend.vercel.app";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/signup`, form);
      
      // Success message from backend
      setMsg(res.data.message);

      // ✅ If backend sends token immediately, login the user
      if (res.data.token) {
        login({ token: res.data.token, user: res.data.user });

        // Role-based navigation
        if (res.data.user.role === "seller") navigate(`/seller/dashboard/${res.data.user.id}`);
        else if (res.data.user.role === "buyer") navigate(`/buyer/dashboard/${res.data.user.id}`);
        else navigate("/");
      } else {
        // If OTP verification is required
        navigate("/verify-otp", { state: { email: form.email } });
      }
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="bg-gray-900 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-cyan-400 mb-4">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white rounded"
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white rounded"
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white rounded"
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {msg && <p className="mt-4 text-center text-sm text-white">{msg}</p>}
      </div>
    </div>
  );
};

export default Signup;
