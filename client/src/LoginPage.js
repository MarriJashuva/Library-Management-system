import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await axios.post("https://library-management-system-mj2e.onrender.com/api/login", formData);
      
      if (response.status === 200) {
        localStorage.setItem("isLoggedIn", "true");
        alert("Login successful!");
        navigate("/");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("User not found.");
      } else if (err.response?.status === 400) {
        setError("Invalid credentials.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <p className="login-subtitle">Login to your account</p>

      <form className="login-form" onSubmit={handleLogin}>
        {error && <p className="login-error">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="👤 Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="🔑 Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button className="btn-login" type="submit">Login</button>
        <button
          className="btn-register"
          type="button"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
