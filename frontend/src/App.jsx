import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Shop from "./components/Shop";
import MyOrders from "./components/MyOrders";
import Blog from "./components/Blog";
import BlogDetail from "./components/BlogDetail";
import Contact from "./components/Contact";
import Hardware from "./components/Hardware";
import Software from "./components/Software";
import Services from "./components/Services";
import ProductDetail from "./components/ProductDetail";
import SignUp from "./components/SignUp";
import Checkout from "./components/Checkout";
import BuyerDashboard from "./components/BuyerDashboard";
import SellerDashboard from "./components/SellerDashboard";
import VerifyOtp from "./components/VerifyOtp";
import Signin from "./components/Signin";
import ProtectedRoute from "./components/ProtectedRoute";
import SearchResults from "./components/SearchResults";
import { useState } from "react";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";
import AddBlog from "./components/AddBlog";
import Favourites from "./components/Favourites";
import Unauthorized from "./components/Unauthorized";
import BuyerProductList from "./components/BuyerProductList";
import BuyerClaims from "./components/BuyerClaims";
function App() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("signup");


  return (
    <div className="min-h-screen bg-gray-800">
      <Header />
      <Routes>
        {/* 🔓 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/hardware" element={<Hardware />} />
        <Route path="/software" element={<Software />} />
        <Route path="/services" element={<Services />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/unauthorized" element={<Unauthorized />} /><Route path="/buyer/products/:id" element={<BuyerProductList />} />
           <Route path="/buyer/claims/:id" element={<BuyerClaims />} />



        <Route
          path="/signup"
          element={<SignUp setStep={setStep} setEmail={setEmail} />}
        />
        <Route path="/signin" element={<Signin />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

<Route path="/checkout" element={<Checkout />} />

        <Route
          path="/buyer/dashboard/:id"
          element={
            <ProtectedRoute role="buyer">
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/dashboard/:id"
          element={
            <ProtectedRoute role="seller">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
  path="/seller/:id/add-blog"
          element={
            <ProtectedRoute>
              <AddBlog />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favourites />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/:id/add-product"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/dashboard/:id/edit-product/:productId"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
