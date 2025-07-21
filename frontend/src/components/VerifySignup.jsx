import { useState } from "react";
import axios from "axios";

const VerifySignup = ({ email, setStep }) => {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/verify-otp", {
        email,
        otp,
      });
      setMsg(res.data.message || "OTP verified successfully.");
      setLoading(false);
      setStep("login"); // or redirect to login
    } catch (err) {
      setLoading(false);
      setMsg(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl text-cyan-400 mb-4 text-center">
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-400 mb-6 text-center">
          We sent an OTP to{" "}
          <span className="text-white font-medium">{email}</span>. <br />
          Please enter it below to verify your account.
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        <button
          onClick={handleVerify}
          disabled={loading || !otp}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        {msg && (
          <div
            className={`mt-4 text-center text-sm px-4 py-2 rounded ${
              msg.toLowerCase().includes("success")
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {msg}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifySignup;
