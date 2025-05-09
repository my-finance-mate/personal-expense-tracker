import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Expense Manager
        </Link>
        
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="p-1 rounded-full">
            {darkMode ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </button>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <span>Hi, {user.username}</span>
              <button
                onClick={logout}
                className="bg-white text-primary px-3 py-1 rounded hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-white text-primary px-3 py-1 rounded hover:bg-gray-100">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;