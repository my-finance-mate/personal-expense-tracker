import React, { useState } from 'react';


const Input = ({ value, onChange, placeholder, label, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div className="flex flex-col space-y-1">
      {/* Label */}
      <label className="text-sm font-medium text-gray-700">{label}</label>

      {/* Input Wrapper */}
      <div className="relative flex items-center border-2 border-blue-500 rounded-md p-2 bg-white">
        {/* Input Field */}
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400"
          value={value}
          onChange={onChange}
        />

        {/* Password Toggle Button */}
        {type === 'password' && (
          <button
            type="button"
            className="absolute right-3 text-gray-500 hover:text-gray-700"
            onClick={toggleShowPassword}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
