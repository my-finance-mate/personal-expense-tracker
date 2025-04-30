// src/components/Navbar.jsx
import React from "react";
import Logo from "./Logo";
import NavLink from "./NavLink";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md py-4 px-6 flex items-center justify-between w-full sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center space-x-8">
        <Logo />
        <div className="flex space-x-4">
          <NavLink name="Dashboard" path="/" />
          <NavLink name="Budget" path="/budget" />
          <NavLink name="Reports" path="/reports" />
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 mx-8 max-w-md">
        <SearchBar />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <NotificationBell />
        <DarkModeToggle />
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
