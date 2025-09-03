import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../Styles/Navbar.css";

function Navbar() {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const location = useLocation();
  
  // Check if current path is home page
  const isHomePage = location.pathname === "/" || location.pathname === "/career";
  
  console.log(isHomePage);
  

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };
  
  return (
    // <div className={`navbar ${!isHomePage ? "navbar-alt" : ""}`}>
    <div className="navbar">
      <div className="logo">
        {/* <img src="/Assets/logo.svg" alt="" /> */}
        <img src={isHomePage?"/Assets/logo.svg":"/Assets/logo2.svg"} alt="" />
      </div>
      <div className="menu">
        <div
          className={`hamburger-menu ${isMenuActive ? "active" : ""} ${!isHomePage ? "hamburger-alt" : ""}`}
          onClick={toggleMenu}
          tabIndex={0}
          role="button"
          aria-label="Toggle menu"
        >
          <div className="line line1"></div>
          <div className="line line2"></div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;