// src/components/Logo.jsx
import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../img/EconoMe.jpg"; // Update path if needed

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img
        src={logoImg}
        alt="EconoMe Logo"
        className="w-16 h-16 object-contain"
      />
    </Link>
  );
};

export default Logo;
