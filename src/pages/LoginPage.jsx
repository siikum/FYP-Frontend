import React, { useState } from "react";
import { Link, useNavigate , useLocation } from "react-router-dom";
import axios from "axios";
import firstIMG from "../assets/images/login-image.jpg";
import Swal from "sweetalert2";


const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/account/login/",
        formData
      );
      const data = response.data;
  
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("userId", data.user_id);
      localStorage.setItem("isLoggedIn", "true");
  
      const redirectPath = location.state?.from || "/";
      navigate(redirectPath);
  
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Welcome back, ${data.username}!`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      if (error.response) {
        console.error("Login error (response):", error.response.data);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.response.data?.error || "Invalid credentials. Please try again.",
          confirmButtonColor: "#B91C1C",
        });
      } else if (error.request) {
        console.error("Login error (no response):", error.request);
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "No response from server. Please try again.",
          confirmButtonColor: "#B91C1C",
        });
      } else {
        console.error("Login error (general):", error.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong. Please try again.",
          confirmButtonColor: "#B91C1C",
        });
      }
    }
    
    
  };


  return (
    <div className="flex h-screen raleway bg-amber-50 font-raleway">
      {/* Left Side: Image */}
      <div className="w-[60%] h-full">
        <img
          src={firstIMG}
          alt="Travel"
          className="object-cover h-full w-full"
        />
      </div>

      {/* Right Side: Form */}
      <div className="w-[40%] flex items-center justify-center relative">
        {/* Logo and Home Link */}
        <div className="absolute top-6 right-8 text-right">
          <Link to="/">
            <h1 className="text-2xl font-extrabold tracking-wide font-serif text-[#0B3D20]">
              <span className="text-black">Trail</span>
              <span className="text-[#295b42]">Himalaya</span>
            </h1>
          </Link>
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-black transition duration-200 mt-1 inline-block"
          >
            Go to Homepage &gt;
          </Link>
        </div>

        <div className="bg-amber-50 px-8 pt-6 pb-8 mb-4">
        <div className="text-6xl font-bold mb-2 text-center">Login</div>
        <p className="text-[#295b42] text-mm text-center mb-6 italic">
            Your trail awaits.
          </p>
          <br />
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {/* {error && <p className="text-red-500 text-xs italic">{error}</p>} */}
            <div className="flex items-center justify-between gap-x-5">
              <button
                className="bg-black hover:bg-[#295b42] hover:text-white text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Login
              </button>
              <Link
                to="/NewSignUpPage"
                className="inline-block align-baseline font-bold text-sm text-black hover:text-[#295b42]"
              >
                Don't have an account?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
