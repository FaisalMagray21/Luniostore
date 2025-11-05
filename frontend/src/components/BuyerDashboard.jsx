import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const { userInfo, logout, loading } = useContext(AuthContext);

  // ✅ Navigate helper
  const goTo = (path) => navigate(path);

  // ✅ Role + ID validation
  useEffect(() => {
    if (!loading) {
      if (!userInfo || userInfo?.user?.role !== "buyer") {
        navigate("/unauthorized");
      } else if (userInfo?.user?.id !== id) {
        navigate("/unauthorized");
      }
    }
  }, [userInfo, loading, navigate, id]);

  // ✅ Logout handler
  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Buyer Dashboard</h2>
        <p className="mb-6 text-gray-400">
          👋 Hello,{" "}
          <span className="text-yellow-400 font-semibold">
            {userInfo?.user?.name || userInfo?.user?.email}
          </span>
        </p>

        <ul className="space-y-4">
          <li>
            <button
              onClick={() => goTo(`/buyer/products/${id}`)}
              className="w-full text-left hover:text-yellow-400"
            >
              Browse Products
            </button>
          </li>
          <li>
            <button
              onClick={() => goTo(`/buyer/claims/${id}`)}
              className="w-full text-left hover:text-yellow-400"
            >
              Claimed Items
            </button>
          </li>
          <li>
            <button
              onClick={() => goTo("/blog")}
              className="w-full text-left hover:text-yellow-400"
            >
              View Blogs
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-semibold mb-6">
          Welcome, {userInfo?.user?.name || "Buyer"}!
        </h1>
        <p className="text-lg">
          Use the sidebar to explore products, manage your claims, and read blogs from donors.
        </p>
      </div>
    </div>
  );
};

export default BuyerDashboard;
