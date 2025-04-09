import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({ isBlack = false }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  // Reactively update login state based on localStorage
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("authToken");
      const loggedIn = !!token;
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        const storedPicUrl = localStorage.getItem("profilePicUrl");
        setProfilePicUrl(storedPicUrl || null);
      } else {
        setProfilePicUrl(null);
      }
    };

    checkLogin();

    // Listen for storage changes (login/logout across tabs or routes)
    window.addEventListener("storage", checkLogin);
    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleLogout = () => {
    localStorage.clear(); // Remove token and profile info
    window.dispatchEvent(new Event("storage")); // Trigger reactive update
    setShowProfileDropdown(false);
    navigate("/LoginPage");
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  const handleDropdownLinkClick = (path) => {
    setShowProfileDropdown(false);
    navigate(path);
  };

  const textColorClass = isBlack ? "text-black" : "text-white";
  const hoverTextColorClass = isBlack
    ? "hover:text-gray-700"
    : "hover:text-gray-300";

  return (
    <nav
      className={`navbar ${textColorClass} fixed w-full h-fit top-0 py-3 raleway text-black z-50`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
          <h1 className={`text-2xl font-extrabold tracking-wide font-serif text-[#0B3D20]`}>
            <span className="text-amber-50">Trail</span><span className="text-[#295b42]">Himalaya</span>
          </h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4 md:space-x-6">
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
            to="/channels"
            className={`${hoverTextColorClass} transition duration-150 ease-in-out`}
          >
            Channels
          </Link>
          <Link
            to="/About"
            className={`${hoverTextColorClass} transition duration-150 ease-in-out`}
          >
            About
          </Link>

          {/* Auth Section */}
          {isLoggedIn ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 bg-gray-400 rounded-full overflow-hidden border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-label="User menu"
                aria-haspopup="true"
                aria-expanded={showProfileDropdown}
              >
                {profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle
                    className={`w-full h-full ${
                      isBlack ? "text-gray-600" : "text-gray-200"
                    }`}
                  />
                )}
              </button>
              {showProfileDropdown && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <button
                    onClick={() => handleDropdownLinkClick("/ProfilePage")}
                    className="flex w-full text-left items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    User Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full text-left items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-sm">
              <Link
                to="/LoginPage"
                className={`${hoverTextColorClass} hover:underline`}
              >
                Login
              </Link>
              <span className={`${textColorClass} opacity-50`}>|</span>
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
