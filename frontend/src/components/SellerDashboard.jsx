import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({ totalSales: 0, totalRevenue: 0 });
  const [orders, setOrders] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { userInfo, logout, axiosAuth, loading } = useContext(AuthContext);

  // ✅ Access Control
  useEffect(() => {
    if (!loading) {
      if (!userInfo || userInfo?.user?.role !== "seller") {
        navigate("/unauthorized");
      } else if (userInfo?.user?.id !== id) {
        navigate("/unauthorized");
      }
    }
  }, [userInfo, loading, navigate, id]);

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await axiosAuth.get("/products/my");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  // ✅ Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await axiosAuth.get("/products/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  // ✅ Fetch Blogs
  const fetchMyBlogs = async () => {
    try {
      const res = await axiosAuth.get("/blogs");
      const myId = userInfo?.user?.id;
      const myBlogs = res.data.filter(
        (b) => b.seller?.id === myId || b.seller?._id === myId
      );
      setBlogs(myBlogs);
    } catch (err) {
      console.error("Error fetching blogs", err);
    }
  };

  // ✅ Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await axiosAuth.get("/orders/seller/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  // ✅ Delete Product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosAuth.delete(`/products/${id}`);
      fetchProducts();
      fetchStats();
    } catch (err) {
      console.error("Error deleting product", err);
      alert("Failed to delete product");
    }
  };

  // ✅ Delete Blog
  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axiosAuth.delete(`/blogs/delete/${id}`);
      fetchMyBlogs(); // refresh list
    } catch (err) {
      console.error("Error deleting blog", err);
      alert("Failed to delete blog");
    }
  };

  // ✅ Load All Data
  useEffect(() => {
    if (!loading && userInfo?.user?.role === "seller" && userInfo?.user?.id === id) {
      fetchProducts();
      fetchStats();
      fetchMyBlogs();
      fetchOrders();
    }
  }, [loading, userInfo, id]);

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
          onClick={() => navigate(`/seller/${id}/add-product`)}
          className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          ➕ Add Product
        </button>
        <button
          onClick={() => navigate(`/seller/${id}/add-blog`)}
          className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          ✍️ Add Blog
        </button>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
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

      {/* Main */}
      <div className="flex-1 ml-0 md:ml-64">
        {/* Mobile Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700 text-xl">
            ☰
          </button>
          <h2 className="text-lg font-bold">Seller Dashboard</h2>
        </header>

        <main className="p-6 space-y-10">
          {/* Stats Section */}
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

          {/* Orders Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">📦 Recent Orders</h2>
            {orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow rounded">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="p-3">Product</th>
                      <th className="p-3">Buyer</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Address</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id} className="border-t">
                        <td className="p-3">{o.product?.name}</td>
                        <td className="p-3">{o.buyer?.name}</td>
                        <td className="p-3">{o.quantity}</td>
                        <td className="p-3">${o.totalPrice}</td>
                        <td className="p-3">{o.shippingAddress}</td>
                        <td className="p-3 text-blue-600">{o.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Products Section */}
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
                      <div className="h-40 bg-gray-200 flex items-center justify-center rounded mb-3 text-gray-500">
                        No Image
                      </div>
                    )}
                    <h3 className="text-lg font-bold">{p.name}</h3>
                    <p className="text-sm text-gray-500">Category: {p.category}</p>
                    <p className="font-semibold text-green-600">${p.price}</p>
                    <div className="flex justify-between mt-3">
                      <button
                        onClick={() =>
                          navigate(`/seller/dashboard/${id}/edit-product/${p._id}`)
                        }
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

          {/* Blogs Section */}
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
                        src={`http://localhost:5000/uploads/${b.image}`}
                        alt="blog"
                        className="h-40 w-full object-cover rounded mb-3"
                      />
                    ) : (
                      <div className="h-40 bg-gray-200 flex justify-center items-center rounded text-gray-500 mb-3">
                        No Image
                      </div>
                    )}
                    <h3 className="text-lg font-bold">{b.title}</h3>
                    <p className="text-sm text-gray-500">
                      Linked Product: {b.product?.name || "N/A"}
                    </p>
                    <p className="text-sm mt-2">{b.content.slice(0, 100)}...</p>
                    <div className="text-xs text-gray-400 mt-2">
                      {b.likes?.length || 0} likes • {b.comments?.length || 0} comments
                    </div>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => deleteBlog(b._id)}
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
        </main>
      </div>
    </div>
  );
};

export default SellerDashboard;
