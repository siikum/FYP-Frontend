import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/destinations", label: "Destinations" },
    { to: "/admin/groupchats", label: "Group Chats" },
    { to: "/admin/joinrequests", label: "Join Requests" },
    { to: "/admin/messages", label: "Contact Messages" },
    { to: "/admin/AdminBlogsPage", label: "Blog"},
    { to: "/admin/AdminSentimentReviews", label: "Sentiment Reviews" },

  ];

  return (
    <div className="w-64 min-h-screen bg-[#e6f1ec] text-[#0B3D20] p-6 fixed">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md hover:bg-[#1c5132] hover:text-amber-50 ${
                isActive ? "hover:bg-[#1c5132] hover:text-amber-50" : ""
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={() => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("adminLoginTime");
          window.location.href = "/admin/login";
        }}
        className="w-full text-left px-4 py-2 mt-6 text-red-500 hover:bg-red-100 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
