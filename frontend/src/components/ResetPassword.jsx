import { useState } from "react";
import axios from "axios";

const ResetPassword = ({ email }) => {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password) {
      setMsg("Please enter a new password.");
      return;
    }
    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post("http://localhost:5000/api/reset-password", { email, password });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleReset} disabled={loading}>
        {loading ? "Resetting..." : "Reset Password"}
      </button>
      <p>{msg}</p>
    </div>
  );
};

export default ResetPassword;
