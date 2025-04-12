import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  useEffect(() => {
    const checkSession = () => {
      const loginTime = localStorage.getItem("adminLoginTime");
      const token = localStorage.getItem("authToken");

      if (loginTime && token) {
        const now = new Date().getTime();
        const diff = now - parseInt(loginTime, 10);

        if (diff > 30 * 60 * 1000) { // 30 minutes
          localStorage.removeItem("authToken");
          localStorage.removeItem("adminLoginTime");
          window.location.href = "/admin/login";
        }
      }
    };

    const interval = setInterval(checkSession, 60000); // every 1 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 w-full p-6 bg-[#f3f8f6] min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
