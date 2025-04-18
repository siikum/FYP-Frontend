import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";

const Navbar = ({ isBlack = false }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("authToken");
      const loggedIn = !!token;
      setIsLoggedIn(loggedIn);

      if (!loggedIn) {
        setProfilePicUrl(null); // Reset if logged out
      }
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("authToken");
      const loggedIn = !!token;
      setIsLoggedIn(loggedIn);

      if (!loggedIn) {
        setProfilePicUrl(null);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/account/profile/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Replace 'profile_picture' with the actual field from your backend
          setProfilePicUrl(`http://localhost:8000${data.profile_picture}`);
        } else {
          setProfilePicUrl(null);
        }
      } catch (err) {
        console.error("Failed to fetch profile info:", err);
        setProfilePicUrl(null);
      }
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of Trail Himalaya.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B91C1C",
      cancelButtonColor: "#0B3D20",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Stay",
    });

    if (result.isConfirmed) {
      localStorage.clear();
      window.dispatchEvent(new Event("storage"));
      setShowProfileDropdown(false);
      navigate("/LoginPage");
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been successfully logged out.",
        confirmButtonColor: "#0B3D20",
        timer: 2000,
      });
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  const handleDropdownLinkClick = (path) => {
    setShowProfileDropdown(false);
    navigate(path);
  };

  const textColorClass = isBlack ? "text-black" : "text-[#0B3D20]";
  const hoverTextColorClass = isBlack
    ? "hover:text-gray-700"
    : "hover:text-[#1f4031]";

  return (
    <nav
      className={`navbar fixed w-full top-0 py-4 z-50 bg-[#dfece2] font-serif shadow-md`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <h1
              className={`text-2xl font-extrabold tracking-wide font-serif text-[#0B3D20]`}
            >
              <span className="text-black">Trail</span>
              <span className="text-[#295b42]">Himalaya</span>
            </h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex font-bold items-center space-x-5 md:space-x-8 text-lg">
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
                className="flex items-center justify-center w-12 h-12 bg-gray-400 rounded-full overflow-hidden border-1 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-label="User menu"
                aria-haspopup="true"
                aria-expanded={showProfileDropdown}
              >
                {profilePicUrl && !profilePicUrl.includes("null") ? (
                  <img
                    src={profilePicUrl}
                    alt="User profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <FaUserCircle className="w-full h-full text-black hover:bg-[#295b42] bg-white" />
                )}
              </button>
              {showProfileDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <button
                    onClick={() => handleDropdownLinkClick("/ProfilePage")}
                    className="flex w-full text-left items-center px-4 py-2 text-sm text-black hover:bg-gray-100"
                  >
                    User Profile
                  </button>
                  <button
                    onClick={() => handleDropdownLinkClick("/MyChannels")}
                    className="flex w-full text-left items-center px-4 py-2 text-sm text-black hover:bg-gray-100"
                  >
                    My Channels
                  </button>
                  <button
                    onClick={() =>
                      handleDropdownLinkClick("/SavedDestinations")
                    }
                    className="flex w-full text-left items-center px-4 py-2 text-sm text-black hover:bg-gray-100"
                  >
                    My Destinations
                  </button>

                  <button
                    onClick={() => handleDropdownLinkClick("/SavedItineraries")}
                    className="flex w-full text-left items-center px-4 py-2 text-sm text-black hover:bg-gray-100"
                  >
                    My Trip Plans
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full text-left items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-lg">
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
