import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ totalSales: 0, totalRevenue: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/products/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts(res.data);
  };

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/products/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStats(res.data);
  };

  const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white w-64 p-4 space-y-4 fixed md:relative z-20 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h1 className="text-2xl font-bold text-center mb-6">📦 Seller</h1>
        <button
          onClick={() => navigate("/add-product")}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
        >
          ➕ Add Product
        </button>
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 mt-4 px-4 py-2 rounded"
        >
          🚪 Logout
        </button>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 text-white"
        >
          ✖
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <header className="bg-white shadow p-4 flex justify-between items-center md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 text-xl"
          >
            ☰
          </button>
          <h2 className="text-lg font-bold">Seller Dashboard</h2>
        </header>

        <main className="p-6 space-y-8">
          {/* Stats Cards */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalSales}
                </p>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${stats.totalRevenue}
                </p>
              </div>
            </div>
          </section>

          {/* Products */}
          <section>
            <h2 className="text-2xl font-bold mb-4">My Products</h2>

            {products.length === 0 ? (
              <div className="text-center p-4 bg-white rounded shadow">
                No products yet. Click <strong>Add Product</strong> to start.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white rounded shadow p-4 flex flex-col"
                  >
                    {p.images && p.images.length > 0 ? (
      <img src={`http://localhost:5000/uploads/${p.images[0]}`}alt={p.name} className="h-40 w-full object-cover rounded mb-4"/>
    ) : (
      <div className="h-40 w-full bg-gray-200 flex items-center justify-center rounded mb-4 text-gray-500">
        No Image
      </div>
    )}
                    <h3 className="text-lg font-bold mb-2">{p.name}</h3>
                    <p className="text-gray-500 text-sm mb-1">
                      Category: {p.category}
                    </p>
                    <p className="text-gray-700 font-semibold mb-4">
                      ${p.price}
                    </p>
                    <div className="flex justify-between mt-auto">
                      <button
                        onClick={() => navigate(`/edit-product/${p._id}`)}
                        className="text-indigo-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default SellerDashboard;
