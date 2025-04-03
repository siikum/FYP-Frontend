import React, { useState, useEffect, useRef } from "react"; // Import React explicitly
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Fallback user icon
// Removed the import for "../styles/navbar.css" unless you have specific base styles there
// If you do, keep the import: import "../styles/navbar.css";

const Navbar = ({ isBlack = false }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef(null); // Ref for the dropdown container

  // --- Placeholder: Get this from your auth context, local storage, API, etc. ---
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);

    // --- Example: Fetch/Retrieve profile pic URL if logged in ---
    if (loggedIn) {
      // Replace with your actual logic (e.g., from context, localStorage)
      const storedPicUrl = localStorage.getItem("profilePicUrl"); // Example
      setProfilePicUrl(storedPicUrl || null); // Set to stored URL or null
    } else {
      setProfilePicUrl(null); // Clear pic if not logged in
    }
  }, []); // Runs once on mount

  // Effect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup listener on component unmount or when dropdown hides
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]); // Re-run effect when showProfileDropdown changes

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("profilePicUrl"); // Clear pic URL on logout
    // Clear other user data as needed
    setIsLoggedIn(false);
    setProfilePicUrl(null);
    setShowProfileDropdown(false); // Close dropdown
    navigate("/LoginPage"); // Navigate to login
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  // Closes dropdown and navigates
  const handleDropdownLinkClick = (path) => {
    setShowProfileDropdown(false);
    navigate(path);
  };

  // Determine text color based on isBlack prop using Tailwind classes
  const textColorClass = isBlack ? "text-black" : "text-white";
  const hoverTextColorClass = isBlack
    ? "hover:text-gray-700"
    : "hover:text-gray-300"; // Adjust hover color as needed

  return (
    // Base navbar class might still come from navbar.css if needed
    <nav
      className={`navbar ${textColorClass} fixed w-full h-fit top-0 py-3 raleway text-black`}
    >
      {/* Using Tailwind for container, padding, flex layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <h1 className={`text-xl font-bold ${textColorClass}`}>Logo</h1>
          </Link>
        </div>

        {/* Links and Profile/Auth Section */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Navigation Links */}
          <Link
            to="/"
            className={`${hoverTextColorClass} transition duration-150 ease-in-out`}
          >
            Home
          </Link>
          <Link
            to="/TripPlannerForm"
            className={`${hoverTextColorClass} transition duration-150 ease-in-out`}
          >
            Itinerary
          </Link>
          <Link
            to="/blog"
            className={`${hoverTextColorClass} transition duration-150 ease-in-out`}
          >
            Blog
          </Link>
          <Link
            to="/About"
            className={`${hoverTextColorClass} transition duration-150 ease-in-out`}
          >
            About
          </Link>

          {/* Conditional Rendering: Profile Dropdown or Login/Signup */}
          {isLoggedIn ? (
            <div className="relative" ref={profileRef}>
              {" "}
              {/* Tailwind relative positioning context */}
              {/* Profile Image Button */}
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 bg-gray-400 rounded-full overflow-hidden border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" // Adjusted focus styles
                aria-label="User menu"
                aria-haspopup="true"
                aria-expanded={showProfileDropdown}
              >
                {profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt="User profile"
                    className="w-full h-full object-cover" // Cover ensures image fills circle
                  />
                ) : (
                  // Fallback Icon when no profile picture URL
                  <FaUserCircle
                    className={`w-full h-full ${
                      isBlack ? "text-gray-600" : "text-gray-200"
                    }`}
                  />
                )}
              </button>
              {/* Dropdown Menu - Using Tailwind classes */}
              {showProfileDropdown && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button" // Links button via label
                >
                  {/* Dropdown Item: User Profile */}
                  <button
                    onClick={() => handleDropdownLinkClick("/ProfilePage")}
                    className="flex w-full text-left items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    {/* Optional: Icon <FaUser className="mr-2" /> */}
                    User Profile
                  </button>

                  {/* Dropdown Item: Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex w-full text-left items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    role="menuitem"
                  >
                    {/* Optional: Icon <FaSignOutAlt className="mr-2" /> */}
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Login/Sign Up Links
            <div className="flex items-center space-x-2 text-sm">
              <Link
                to="/LoginPage"
                className={`${hoverTextColorClass} hover:underline`}
              >
                Login
              </Link>
              <span className={`${textColorClass} opacity-50`}>|</span>{" "}
              {/* Separator */}
              <Link
                to="/NewSignUpPage"
                className={`${hoverTextColorClass} hover:underline`}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
