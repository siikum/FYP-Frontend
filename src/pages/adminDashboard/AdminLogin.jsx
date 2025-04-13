import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:8000/admin_dashboard/login/",
        form
      );

      const token = res.data.token;
      localStorage.setItem("adminAuthToken", token);

      // Save login time after successful login
      const now = new Date().getTime();
      localStorage.setItem("adminLoginTime", now);

      // Now verify if user is actually staff
      const check = await axios.get(
        "http://localhost:8000/admin_dashboard/is_admin/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (check.data.is_admin) {
        navigate("/admin/dashboard");
      } else {
        setError("Access denied: not an admin.");
        localStorage.removeItem("adminAuthToken");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid credentials or server error.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-[#0B3D20]">
          Admin Login
        </h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-[#0B3D20] text-white py-2 rounded hover:bg-[#12492b]"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
