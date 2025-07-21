import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

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

      localStorage.setItem("token", res.data.token);

      console.log("Login success");
      setLoading(false);
      navigate("/"); 
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(
        err.response?.data?.message || "Invalid credentials or server error."
      );
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setResetLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/forgot-password",
        {
          email: resetEmail,
        }
      );
      setMessage(
        res.data.message ||
          "If your email exists, a reset link was sent."
      );
      setShowForgot(false);
      setResetEmail("");
      setResetLoading(false);
    } catch (err) {
      console.error(err);
      setResetLoading(false);
      setError("Failed to send reset email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-cyan-400 mb-4">
          Sign In
        </h1>

        {error && (
          <div className="bg-red-600 text-white px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-600 text-white px-4 py-2 rounded mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-2 text-sm text-center text-gray-400">
  Forgot your password?{" "}
  <a href="/forgot" className="text-cyan-400 hover:underline">
    Reset here
  </a>
</p>

<p className="mt-2 text-sm text-center text-gray-400">
  Don’t have an account?{" "}
  <a href="/signup" className="text-cyan-400 hover:underline">
    Sign Up
  </a>
</p>

        

        {/* Forgot Password Modal */}
        {showForgot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded shadow-md w-full max-w-sm">
              <h2 className="text-xl text-cyan-400 mb-4">
                Reset Password
              </h2>
              <form
                onSubmit={handleForgotPassword}
                className="space-y-4"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
                >
                  {resetLoading
                    ? "Sending..."
                    : "Send Reset Link"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setResetEmail("");
                  }}
                  className="w-full mt-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signin;
