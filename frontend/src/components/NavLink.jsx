// src/components/NavLink.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavLink = ({ name, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
        isActive
          ? "bg-indigo-600 text-white dark:bg-indigo-500"
          : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
      }`}
    >
      {name}
    </Link>
  );
};

export default NavLink;
