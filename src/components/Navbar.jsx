import { Link, useNavigate } from "react-router-dom";  // Import useNavigate for navigation
import { useState, useEffect } from "react";  // Import useState and useEffect
import "../styles/navbar.css"; // Import Navbar CSS

const Navbar = () => {
  const navigate = useNavigate();  // Replace useHistory with useNavigate
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track if user is logged in

  // Check token on component mount and whenever the token changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);  // If the token exists, set isLoggedIn to true
  }, []);  // Empty dependency array to run only once when the component mounts

  // Handle Logout
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");

    // Update the state and redirect to login page after logout
    setIsLoggedIn(false);  // Update the state to reflect the logged-out status
    navigate("/login");  // Use navigate to redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          {/* <img src="/src/assets/images/logo.png" alt="Logo" /> */}
          <h1>Logo</h1>
        </div>
        <div className="links">
          <Link to="/">Home</Link>
          <Link to="/About">About</Link>
          <Link to="/destination">Destinations</Link>
          <Link to="/itinerary">Itinerary</Link>
          <Link to="/blog">Blog</Link>
          
          {isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>  // Show logout button if user is logged in
          ) : (
            <Link to="/login">Login</Link>  // Show login link if not logged in
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
