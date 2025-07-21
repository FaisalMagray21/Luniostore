import { useNavigate } from "react-router-dom";

import mouse from "../assets/mouse.jpg";
import mechanicalkeyboard from "../assets/mechanicalkeyboard.jpg";
import vrheadset from "../assets/vrheadset.jpg";
import graphiccard from "../assets/graphiccard.jpg";
import gamingchair from "../assets/gamingchair.jpg";
import smartwatch from "../assets/smartwatch.jpg";
import cloudstorage from "../assets/cloudstorage.jpg";
import antivirussuit from "../assets/antivirussuit.jpg";
import kycpayment from "../assets/kycpaymentfacilation.jpg";
import socialmediaboost from "../assets/socialmediaboost.jpg";

const Home = () => {
  const navigate = useNavigate();

  const products = [
    { name: "Gaming Mouse", category: "Hardware", price: 49, rating: 4.5, desc: "High-precision gaming mouse with RGB lighting.", img: mouse },
    { name: "Mechanical Keyboard", category: "Hardware", price: 89, rating: 4.8, desc: "Tactile mechanical keyboard for competitive gaming.", img: mechanicalkeyboard },
    { name: "VR Headset", category: "Hardware", price: 299, rating: 4.7, desc: "Immersive VR experience for gamers and creators.", img: vrheadset },
    { name: "Graphics Card", category: "Hardware", price: 499, rating: 4.9, desc: "Top-tier GPU for ultimate gaming performance.", img: graphiccard },
    { name: "Gaming Chair", category: "Hardware", price: 199, rating: 4.6, desc: "Ergonomic chair designed for long gaming sessions.", img: gamingchair },
    { name: "Smartwatch", category: "Hardware", price: 149, rating: 4.4, desc: "Stylish smartwatch with fitness tracking features.", img: smartwatch },
    { name: "Antivirus Suite", category: "Software", price: 29, rating: 4.3, desc: "Advanced protection for your devices.", img: antivirussuit },
    { name: "Cloud Storage", category: "Software", price: 99, rating: 4.5, desc: "Secure cloud storage for all your files.", img: cloudstorage },
    { name: "Social Media Boost", category: "Service", price: 59, rating: 4.2, desc: "Grow your social presence with targeted campaigns.", img: socialmediaboost },
    { name: "KYC Payment Facilitation", category: "Service", price: 39, rating: 4.4, desc: "Streamlined KYC and secure payment setup.", img: kycpayment },
  ];

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <div className="bg-gray-950 text-gray-200">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-800 to-indigo-900 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to <span className="text-cyan-300">Lunio</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Your one-stop marketplace for cutting-edge hardware, software, and tech services — tailored for Nepal, built for the world.
          </p>
          <div className="mt-6">
            <a href="/shop" className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded text-lg">
              Shop Now
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Browse Categories</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
            <div onClick={() => handleCategoryClick("/hardware")} className="bg-purple-700 hover:bg-purple-800 p-4 rounded shadow cursor-pointer">
              <h3 className="text-xl font-semibold">Hardware</h3>
            </div>
            <div onClick={() => handleCategoryClick("/software")} className="bg-indigo-700 hover:bg-indigo-800 p-4 rounded shadow cursor-pointer">
              <h3 className="text-xl font-semibold">Software</h3>
            </div>
            <div onClick={() => handleCategoryClick("/services")} className="bg-cyan-700 hover:bg-cyan-800 p-4 rounded shadow cursor-pointer">
              <h3 className="text-xl font-semibold">Services</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <div key={i} className="bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
                <div onClick={() => navigate(`/product/${p.name}`)} className="cursor-pointer">
                  <div className="relative">
                    <img src={p.img} alt={p.name} className="w-full h-40 object-cover" />
                    <span className="absolute top-2 left-2 bg-purple-600 text-xs px-2 py-1 rounded-full">
                      New
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold">{p.name}</h4>
                    <p className="text-xs text-gray-400 mb-1">Category: {p.category}</p>
                    <p className="text-sm text-gray-300 mb-4">{p.desc}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-cyan-400 font-bold">${p.price}</span>
                      <span className="text-yellow-400 text-sm">⭐ {p.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 px-4 pb-4">
                  <button
                    onClick={() => navigate(`/checkout?product=${p.name}`)}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-3 py-1 rounded shadow w-full"
                  >
                    Shop Now
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded shadow w-full">
                    ❤️ Favorite
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Lunio Technologies Pvt. Ltd. — All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
