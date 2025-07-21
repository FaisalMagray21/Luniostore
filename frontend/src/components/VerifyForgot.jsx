import { useState } from "react";
import axios from "axios";

const VerifyForgot = ({ email, setStep }) => {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp) {
      setMsg("Please enter OTP.");
      return;
    }
    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post("http://localhost:5000/api/verify-forgot-otp", { email, otp });
      setMsg(res.data.message);
      setStep("reset-password");
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2>Verify OTP</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerify} disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
      <p>{msg}</p>
    </div>
  );
};

export default VerifyForgot;
