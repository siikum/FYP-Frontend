import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/navbar.css";

const Navbar = ({ isBlack = false }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showBlogDropdown, setShowBlogDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
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
            <button className="dropbtn">Blog </button>
            {showBlogDropdown && (
              <div className="dropdown-content">
                <Link to="/blog">Blog</Link>
                <Link to="/Chat">Messages</Link>
              </div>
            )}
          </div>
          <Link to="/About">About</Link>
          
          {isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
