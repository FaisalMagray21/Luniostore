import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({ totalSales: 0, totalRevenue: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts(res.data);
  };

  const fetchStats = async () => {
    const res = await axios.get("http://localhost:5000/api/products/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStats(res.data);
  };

  const fetchMyBlogs = async () => {
    const res = await axios.get("http://localhost:5000/api/blogs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const myBlogs = res.data.filter((b) => b.seller._id === getUserIdFromToken(token));
    setBlogs(myBlogs);
  };

  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
    fetchStats();
    fetchMyBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white w-64 p-5 space-y-5 fixed md:relative z-20 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h1 className="text-2xl font-bold text-center">🧑‍💻 Seller Panel</h1>
        <button
          onClick={() => navigate("/add-product")}
          className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          ➕ Add Product
        </button>
        <button
          onClick={() => navigate("/add-blog")}
          className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          ✍️ Add Blog
        </button>
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
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

      {/* Main content */}
      <div className="flex-1 ml-0 md:ml-64">
        <header className="bg-white shadow p-4 flex justify-between items-center md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700 text-xl">
            ☰
          </button>
          <h2 className="text-lg font-bold">Seller Dashboard</h2>
        </header>

        <main className="p-6 space-y-10">
          {/* Stats */}
          <section>
            <h2 className="text-2xl font-bold mb-4">📊 Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalSales}</p>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-blue-600">${stats.totalRevenue}</p>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-gray-600">My Products</p>
                <p className="text-2xl font-bold text-purple-600">{products.length}</p>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-gray-600">My Blogs</p>
                <p className="text-2xl font-bold text-yellow-500">{blogs.length}</p>
              </div>
            </div>
          </section>

          {/* Product List */}
          <section>
            <h2 className="text-2xl font-bold mb-4">🛒 My Products</h2>
            {products.length === 0 ? (
              <p>No products listed. Add some!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((p) => (
                  <div key={p._id} className="bg-white p-4 rounded shadow">
                    {p.images?.length > 0 ? (
                      <img
                        src={`http://localhost:5000/uploads/${p.images[0]}`}
                        alt={p.name}
                        className="h-40 w-full object-cover rounded mb-3"
                      />
                    ) : (
                      <div className="h-40 bg-gray-200 rounded flex justify-center items-center text-gray-500 mb-3">
                        No Image
                      </div>
                    )}
                    <h3 className="text-lg font-bold">{p.name}</h3>
                    <p className="text-sm text-gray-500">Category: {p.category}</p>
                    <p className="font-semibold text-green-600">${p.price}</p>
                    <div className="flex justify-between mt-3">
                      <button
                        onClick={() => navigate(`/edit-product/${p._id}`)}
                        className="text-indigo-600 hover:underline"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p._id)}
                        className="text-red-600 hover:underline"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Blog List */}
          <section>
            <h2 className="text-2xl font-bold mb-4">📰 My Blogs</h2>
            {blogs.length === 0 ? (
              <p>No blogs published. Write one!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {blogs.map((b) => (
                  <div key={b._id} className="bg-white p-4 rounded shadow">
                    {b.image ? (
                      <img
                  src={`http://localhost:5000/uploads/${b.image[0]}`}
                        alt="blog"
                        className="h-40 w-full object-cover rounded mb-3"
                      />
                    ) : (
                      <div className="h-40 bg-gray-200 rounded flex justify-center items-center text-gray-500 mb-3">
                        No Image
                      </div>
                    )}
                    <h3 className="text-lg font-bold">{b.title}</h3>
                    <p className="text-sm text-gray-500">
                      Linked Product: {b.product?.name || "N/A"}
                    </p>
                    <p className="text-sm mt-2">{b.content.slice(0, 100)}...</p>
                    <div className="text-xs text-gray-400 mt-2">
                      {b.likes.length} likes • {b.comments.length} comments
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
