import React from "react";
import { Link } from "react-router-dom";

const Navbar1 = () => {
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login"; // reload and redirect
  };

  return (
    <nav className="navbar">
          <div className="navbar-logo">LOGO</div>
          <ul className="navbar-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/library">Library</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
          <button onClick={handleLogout}>🚪 Logout</button>
    </nav> 
  );
};

export default Navbar1;
