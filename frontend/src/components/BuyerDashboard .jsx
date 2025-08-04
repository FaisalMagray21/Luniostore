import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const BuyerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/signin");
  };

  const goTo = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "buyer") {
      navigate("/unauthorized");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Buyer Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <button onClick={() => goTo("/buyer/products")} className="w-full text-left hover:text-yellow-400">
              Browse Products
            </button>
          </li>
          <li>
            <button onClick={() => goTo("/buyer/claims")} className="w-full text-left hover:text-yellow-400">
              Claimed Items
            </button>
          </li>
          <li>
            <button onClick={() => goTo("/buyer/blogs")} className="w-full text-left hover:text-yellow-400">
              View Blogs
            </button>
          </li>
          <li>
            <button onClick={handleLogout} className="w-full text-left text-red-500 hover:text-red-700">
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-semibold mb-6">Welcome, Buyer!</h1>
        <p className="text-lg">
          Use the sidebar to explore products, manage your claims, and read blogs from donors.
        </p>
      </div>
    </div>
  );
};

export default BuyerDashboard;
