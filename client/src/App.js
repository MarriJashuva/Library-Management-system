import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import Navbar1 from "./Navbar1";
import HomePage from "./HomePage";
import LibraryPage from "./LibraryPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Admin from "./admin";
import Footer from "./Footer";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";

// 👇 Move AppWrapper inside Router
const AppWrapper = ({ isLoggedIn }) => {
  const location = useLocation();
  const hideNavbarRoutes = ["/admin", "/login", "/register"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) &&
        (isLoggedIn ? <Navbar1 /> : <Navbar />)}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>

      {/* Optionally hide footer on specific routes too */}
      {!hideNavbarRoutes.includes(location.pathname) && <Footer />}
    </>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      {/* ✅ AppWrapper must be inside Router */}
      <AppWrapper isLoggedIn={isLoggedIn} />
    </Router>
  );
}

export default App;
