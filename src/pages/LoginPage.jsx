import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import firstIMG from "../assets/images/login-image.jpg";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/account/login/', formData);
      console.log(response.data);

      // ✅ Save token and login state
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('isLoggedIn', 'true');

      alert("Login Successful!");
      navigate("/"); // redirect after login
    } catch (error) {
      setError(error.response?.data?.error || 'Invalid credentials');
    }
  };

  return (
    <div className="flex h-screen raleway bg-amber-50 font-raleway">
      {/* Left Side: Image */}
      <div className="w-[60%] h-full">
        <img src={firstIMG} alt="Travel" className="object-cover h-full w-full" />
      </div>

      {/* Right Side: Form */}
      <div className="w-[40%] flex items-center justify-center">
        <div className="bg-amber-50 px-8 pt-6 pb-8 mb-4">
          <div className="text-6xl font-bold mb-6 text-center">Login</div>
          <br />
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
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
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
            <div className="flex items-center justify-between gap-x-5">
              <button
                className="bg-black hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Login
              </button>
              <Link to="/NewSignUpPage" className="inline-block align-baseline font-bold text-sm text-black hover:text-blue-800">
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
