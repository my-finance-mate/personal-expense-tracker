// src/components/NavLink.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavLink = ({ name, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200
        ${
          isActive
            ? "bg-[#C8B6FF] text-[#4A4A4A] shadow-md" // Lavender active
            : "text-[#386641] hover:bg-[#A8D5BA] hover:text-[#1B4332]" // Cucumber hover
        }`}
    >
      {name}
    </Link>
  );
};

export default NavLink;
