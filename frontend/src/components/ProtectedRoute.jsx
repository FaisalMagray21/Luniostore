import { useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { userInfo, loading } = useContext(AuthContext);
  const params = useParams();

  // extract possible IDs from URL
  const routeId = params.id || params.sellerId || params.userId;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        Loading session...
      </div>
    );
  }

  // ✅ user not logged in → signin page
  if (!userInfo) {
    return <Navigate to="/signin" replace />;
  }

  // ✅ role mismatch
  if (role && userInfo.user.role.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ if route has an id, make sure it matches current user
  const userId = userInfo.user.id || userInfo.user._id;
  if (routeId && userId !== routeId) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
