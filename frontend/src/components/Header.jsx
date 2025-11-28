import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // ✅ New state
  const userinfo = JSON.parse(localStorage.getItem("userInfo"));
  const API_BASE = "https://luniostore-backend.vercel.app/api";
const IMAGE_BASE = "https://luniostore-backend.vercel.app/uploads";

  const handleSellerClick = () => {
    if (userinfo?.token) {
      console.log("userinfo",userinfo.token);
      navigate("/seller/dashboard");
    } else {
      navigate("/signin?role=seller");
    }
  };

  // ✅ Live suggestions fetch
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 1) {
        setSuggestions([]);
        return;
      }

      try {
        const { data } = await axios.get(
          `${API_BASE}/products/search?q=${searchQuery}`
        );
        setSuggestions(data.slice(0, 5)); // top 5 results
      } catch (error) {
        console.error("Suggestion fetch error:", error);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${searchQuery}`);
      setSearchQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (name) => {
    navigate(`/search?query=${name}`);
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleLogOut=()=>{
    localStorage.removeItem("userInfo")
    navigate("/signin?role=seller");
  }

  return (
    <header className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center gap-4 py-3">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink
              to="/"
              className="text-3xl font-extrabold text-purple-400 tracking-wide"
            >
              Lunio
            </NavLink>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6">
            {[
              { path: "/", name: "Home" },
              { path: "/shop", name: "Shop" },
              { path: "/hardware", name: "Hardware" },
              { path: "/software", name: "Software" },
              { path: "/services", name: "Services" },
              { path: "/blog", name: "Blog" },
              { path: "/contact", name: "Contact" },
            ].map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-base px-3 py-1 rounded-md font-medium transition ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:text-purple-400 hover:bg-gray-800"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 flex-wrap justify-end w-full md:w-auto relative">
            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-gray-800 rounded px-2 w-full sm:w-auto relative"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search…"
                className="px-2 py-2 bg-transparent text-base text-gray-200 placeholder-gray-400 focus:outline-none w-full sm:w-48"
              />
              <button
                type="submit"
                className="px-1 text-gray-400 hover:text-purple-400 text-lg"
              >
                🔍
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-12 left-0 bg-gray-800 text-gray-200 w-full sm:w-64 rounded shadow-lg z-50 max-h-60 overflow-y-auto">
                {suggestions.map((item) => (
                  <li
                    key={item._id}
                    onClick={() => handleSuggestionClick(item.name)}
                    className="px-3 py-2 cursor-pointer hover:bg-purple-600 hover:text-white"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}

            {/* Seller Button */}
            {
              userinfo?.token?<button
              onClick={handleLogOut}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm rounded-md shadow"
              
            >
              LogOut
            </button>:<button
              onClick={handleSellerClick}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm rounded-md shadow"
              disabled={userinfo?.token}
            >
              USER
            </button>
            }

            {/* Icons */}
            <button
              onClick={() => navigate("/favorites")}
              className="text-gray-300 hover:text-purple-400 text-xl"
            >
              ❤️
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} // ✅ Toggle
              className="md:hidden text-gray-300 hover:text-purple-400 text-2xl"
            >
              ☰
            </button>
          </div>
        </div>

        {/* ✅ Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden flex flex-col space-y-2 pb-4">
            {[
              { path: "/", name: "Home" },
              { path: "/shop", name: "Shop" },
              { path: "/hardware", name: "Hardware" },
              { path: "/software", name: "Software" },
              { path: "/services", name: "Services" },
              { path: "/blog", name: "Blog" },
              { path: "/contact", name: "Contact" },
            ].map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)} // ✅ close after click
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md font-medium transition ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:text-purple-400 hover:bg-gray-800"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
