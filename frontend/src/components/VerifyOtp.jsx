import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Shield, ArrowRight, CheckCircle, RefreshCw } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "user@example.com"; // fallback if no email

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCountdown <= 0) return;

    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/verify-otp", { email, otp: code });
      setIsVerified(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    if (resendCountdown > 0) return;
    setResendCountdown(60);
    setError("");
    axios.post("http://localhost:5000/api/resend-otp", { email });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900 p-4 relative">
      <div className="absolute inset-0 flex flex-wrap opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-white rounded-full animate-ping"
            style={{
              position: "absolute",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md bg-slate-800/50 backdrop-blur-md rounded-xl p-6 shadow-lg">
        <Link to="/login" className="text-slate-400 hover:text-purple-400 flex items-center mb-4 text-sm">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
        </Link>

        {!isVerified ? (
          <>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                <Shield className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-white">Verify Your Account</h1>
              <p className="text-sm text-slate-300">Code sent to <span className="text-purple-300">{email}</span></p>
            </div>

            <div className="flex gap-2 justify-center mt-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`w-12 h-12 rounded text-center text-lg font-semibold bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border ${
                    error ? "border-red-500" : "border-slate-600"
                  }`}
                />
              ))}
            </div>

            {error && <p className="text-red-400 text-center mt-2 text-sm">{error}</p>}

            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className={`w-full mt-4 py-2 rounded bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold flex items-center justify-center gap-2 hover:scale-105 transition ${
                isVerifying ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isVerifying ? (
                <div className="animate-spin border-t-2 border-white rounded-full w-4 h-4"></div>
              ) : (
                <>
                  Verify Code <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-slate-300">
                Didn’t receive code?{" "}
                <button
                  onClick={handleResend}
                  disabled={resendCountdown > 0}
                  className="text-purple-400 hover:underline disabled:text-slate-500"
                >
                  {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend Code"}
                </button>
              </p>
            </div>
          </>
        ) : (
          <div className="text-center animate-fadeIn">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-200 mb-4">
              <CheckCircle className="text-green-600 w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-white">Verification Successful!</h1>
            <p className="text-slate-300 text-sm">Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}
