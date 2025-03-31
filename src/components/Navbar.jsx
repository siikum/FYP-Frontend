import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/navbar.css";

const Navbar = ({ isBlack = false }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showBlogDropdown, setShowBlogDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Changed "token" to "authToken" to match your login page
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Changed "token" to "authToken" to match your login page
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className={`navbar ${isBlack ? "text-black" : "text-white"}`}>
      <div className="container">
        <div className="logo">
          <h1>Logo</h1>
        </div>
        <div className="links">
          <Link to="/">Home</Link>
          <Link to="/TripPlannerForm">Itinerary</Link>
          <div
            className="dropdown"
            onMouseEnter={() => setShowBlogDropdown(true)}
            onMouseLeave={() => setShowBlogDropdown(false)}
          >
            <button className="dropbtn">Blog</button>
            {showBlogDropdown && (
              <div className="dropdown-content">
                <Link to="/blog">Blog</Link>
                <Link to="/Chat">Messages</Link>
              </div>
            )}
          </div>
          <Link to="/About">About</Link>

          {isLoggedIn ? (
            <button onClick={handleLogout} className="text-sm">Logout</button>
          ) : (
            <div className="flex space-x-2 text-sm">
              <Link to="/LoginPage" className="hover:underline">Login</Link>
              <Link to="/NewSignUpPage" className="hover:underline">| Sign Up</Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;