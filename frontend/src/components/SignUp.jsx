import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // 👈 login function le lo

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await axios.post("http://localhost:5000/api/signup", form);
      setMsg(res.data.message);

      // 👇 OTP verify hone ke baad login call karna hoga
      // navigate("/verify-otp", { state: { email: form.email } });

      // agar backend signup ke baad hi token bhejta hai:
      if (res.data.token) {
        login({ token: res.data.token, user: res.data.user });
        navigate("/"); // dashboard par bhejo
      } else {
        // agar backend pehle OTP verify mangta hai:
        navigate("/verify-otp", { state: { email: form.email } });
      }
    } catch (err) {
      setMsg(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-cyan-400 mb-4">
          Sign Up
        </h2>

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
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
          >
            Sign Up
          </button>
        </form>

        {msg && <p className="mt-4 text-center text-sm text-white">{msg}</p>}
      </div>
    </div>
  );
};

export default Signup;
