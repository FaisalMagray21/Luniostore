import { useState, useContext } from "react";   
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // ✅ Update context + localStorage
      login({ token, user });

      // ✅ Role-based navigation
if (user.role === "seller") navigate(`/seller/dashboard/${user.id}`);
else if (user.role === "buyer") navigate(`/buyer/dashboard/${user.id}`);
else navigate("/");

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(err.response?.data?.message || "Invalid credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-cyan-400 mb-4">
          Sign In
        </h1>

        {error && (
          <div className="bg-red-600 text-white px-4 py-2 rounded mb-4 text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
            required
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded text-sm sm:text-base"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-3 text-xs sm:text-sm text-center text-gray-400">
          Forgot your password?{" "}
          <Link to="/forgot" className="text-cyan-400 hover:underline">
            Reset here
          </Link>
        </p>

        <p className="mt-2 text-xs sm:text-sm text-center text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-cyan-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
