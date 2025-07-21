import { useState } from "react";
import axios from "axios";

const ForgotPassword = ({ setStep, setEmail }) => {
  const [localEmail, setLocalEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!localEmail) {
      setMsg("Please enter your email.");
      return;
    }
    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post("http://localhost:5000/api/forgot-password", { email: localEmail });
      setMsg(res.data.message);
      setEmail(localEmail);
      setStep("/verify-forgot");
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={localEmail}
        onChange={(e) => setLocalEmail(e.target.value)}
      />
      <button onClick={handleSendOtp} disabled={loading}>
        {loading ? "Sending..." : "Send OTP"}
      </button>
      <p>{msg}</p>
    </div>
  );
};

export default ForgotPassword;
