import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/account/login/", formData);
      alert("Login Successful!");
      localStorage.setItem("token", response.data.token); // Store token
      navigate("/"); // Redirect to home page
    } catch (error) {
      setError(error.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="background-image"></div>

      <div className="login-card">
        <div className="form-header">
          <h2>Login</h2>
          <span className="auth-toggle"> / <Link to="/Signup" className="signup-link">Sign Up</Link></span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Login</button>

          <div className="forgot-password">
            <p>Forgot your password? <Link to="/reset-password" className="reset-link">Reset here</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
