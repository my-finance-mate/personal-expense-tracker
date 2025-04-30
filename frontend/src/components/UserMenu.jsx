// src/components/UserMenu.jsx
import React, { useState, useRef, useEffect } from "react";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Picture Button */}
      <button
        className="focus:outline-none rounded-full ring-2 ring-transparent focus:ring-blue-500 transition duration-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        <img
          src="/profile.jpg"
          alt="User"
          className="w-10 h-10 rounded-full object-cover"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 transition transform origin-top scale-95 animate-fade-in">
          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            View Profile
          </a>
          <a
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Settings
          </a>
          <a
            href="/logout"
            className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-700 transition"
          >
            Logout
          </a>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
