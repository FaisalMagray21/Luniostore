import { useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { userInfo, loading } = useContext(AuthContext);
  const { id } = useParams(); // url ka :id pakadna

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        Loading session...
      </div>
    );
  }

  // ✅ user hi nahi mila → signin page bhej do
  if (!userInfo) {
    return <Navigate to="/signin" replace />;
  }

  // ✅ role mismatch
  if (role && userInfo.user.role.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ agar id param diya hai toh woh current user id match kare
  if (id && userInfo.user.id !== id) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
