// src/components/SearchBar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedSearch = searchTerm.trim();
      if (trimmedSearch === "") {
        setError("Search cannot be empty.");
      } else if (trimmedSearch.length < 3) {
        setError("Please enter at least 3 characters.");
      } else {
        setError("");
        // Redirect to category page with the search query as a URL parameter
        navigate(`/category?query=${encodeURIComponent(trimmedSearch)}`);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${
            error
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-blue-500"
          }`}
        />
        {error && (
          <span className="text-sm text-red-500 font-medium">{error}</span>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
