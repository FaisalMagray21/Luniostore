// import { useState } from "react";
// import Signup from "./SignUp";
// import VerifySignup from "./VerifySignup";

// const AuthFlow = () => {
//   const [step, setStep] = useState("signup"); // current step
//   const [email, setEmail] = useState(""); // to hold email between steps

//   return (
//     <div>
//       {step === "SignUp" && (
//         <Signup setStep={setStep} setEmail={setEmail} />
//       )}
//       {step === "verifySignup" && (
//         <VerifySignup setStep={setStep} email={email} />
//       )}
//     </div>
//   );
// };

// export default AuthFlow;


import { useState } from "react";
import Signup from "./SignUp";
import VerifySignup from "./VerifySignup";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import VerifyForgot from "./VerifyForgot";

const AuthFlow = () => {
  const [step, setStep] = useState("signup"); // current step
  const [email, setEmail] = useState("");     // holds email between steps

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 sm:p-8">
        {step === "signup" && (
          <Signup setStep={setStep} setEmail={setEmail} />
        )}

        {step === "verifySignup" && (
          <VerifySignup setStep={setStep} email={email} />
        )}

        {step === "forgot" && (
          <ForgotPassword setStep={setStep} setEmail={setEmail} />
        )}
              {step === "verify-forgot" && <VerifyForgot setStep={setStep} email={email} />}




        {step === "reset-password" && (
          <ResetPassword setStep={setStep} email={email} />
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => setStep("signup")}
              className="text-indigo-600 hover:underline"
            >
              Back to Signup
            </button>
          </p>
          {step !== "forgotPassword" && step !== "resetPassword" && (
            <p className="text-xs text-gray-500 mt-2">
              Forgot your password?{" "}
              <button
                onClick={() => setStep("forgotPassword")}
                className="text-indigo-600 hover:underline"
              >
                Reset here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthFlow;


