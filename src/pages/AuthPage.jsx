import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Use useNavigate in v6

const AuthPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();  // Initialize useNavigate

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("/api/protected", { headers: { Authorization: `Token ${token}` } })
        .then(() => {  // No need to use response if not required
          setIsAuthenticated(true);
        })
        .catch(() => {  // No need to use error if not required
          setIsAuthenticated(false);
        });
    }
}, []);


  // If the user is not authenticated, navigate to the login page
  if (!isAuthenticated) {
    navigate("/login");  // Use navigate instead of Redirect
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>This content is only visible to authenticated users.</p>
    </div>
  );
};

export default AuthPage;
