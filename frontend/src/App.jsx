import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Shop from './components/Shop';
import Blog from './components/Blog';
import BlogDetail from './components/BlogDetail';
import Contact from './components/Contact';
import Hardware from './components/Hardware';
import Software from './components/Software';
import Services from './components/Services';
import ProductDetail from './components/ProductDetail';
import VerifyForgot from './components/VerifyForgot';
import SignUp from './components/SignUp';
import Checkout from './components/Checkout';
import BuyerDashboard from './components/BuyerDashboard ';
import SellerDashboard from './components/SellerDashboard';
import  ForgotPassword  from './components/ForgotPassword';
import  ResetPassword from './components/ResetPassword';
import VerifyOtp from './components/VerifyOtp';
import Signin from './components/SignIn';
import { useState } from 'react';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import MyOrders from './components/MyOrders';
import ProductReviews from './components/ProductReviews';
import AddBlog from './components/AddBlog';
import Favourites from './components/Favourites';
import { useParams } from 'react-router-dom';

const Page = ({ title, emoji }) => (
  <div className="p-8 text-center text-3xl text-gray-100">
    {emoji} {title} Page
  </div>
)

function App() {
  let id=useParams();
  console.log(id);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("signup");


  return (
    <div className="min-h-screen bg-gray-800">
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/shop" element={<Shop/>} />
        <Route path="/hardware" element={<Hardware />} />
         <Route path="/software" element={<Software />} />
          <Route path="/services" element={<Services />} />

          <Route path="/blog" element={<Blog/>} />
        <Route path="/blogs/:id" element={<BlogDetail />} />

        <Route path="/contact" element={<Contact/>} />
          <Route path="/product/:id" element={<ProductDetail />} />
           <Route path="/signup" element={<SignUp setStep={setStep} setEmail={setEmail} />} />
           <Route path="/signin" element={<Signin/>} />
      {/* <Route path="/" element={<RoleSelection />} /> */}

           <Route path="/checkout" element={<Checkout/>} />
       <Route path="/seller/dashboard" element={<SellerDashboard />} />
      <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
      <Route path="/forgot" element={<ForgotPassword setStep={setStep} setEmail={setEmail} />} />
<Route path="/verify-otp" element={<VerifyOtp />} />
<Route path="/reset-password" element={<ResetPassword />} />
<Route path="/verify-forgot" element={<VerifyForgot />} />
<Route path="/add-blog" element={<AddBlog/>}/>
<Route path="/favorites" element={<Favourites />} />

<Route path="/add-product" element={<AddProduct/>}/>
<Route path="/edit-product/:id" element={<EditProduct/>}/>
<Route path="/my-orders" element={<MyOrders />} />
 <Route path="/product-reviews/:productId" element={<ProductReviews />} />
      </Routes>

      
       
    
    </div>
  )
}

export default App;
