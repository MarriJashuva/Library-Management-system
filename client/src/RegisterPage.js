import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/register", formData);
      alert(res.data.message);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <p className="register-subtitle">Create an account</p>
      <form className="register-form" onSubmit={handleRegister}>
        <input
          type="text"
          name="username"
          placeholder="👤 UserName"
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
        <button className="btn-register" type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
