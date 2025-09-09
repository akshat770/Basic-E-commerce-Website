import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          ShopHub
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            to="/"
            className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            to="/cart"
            className="relative px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
          >
            Cart
            {getCartItemCount() > 0 && (
              <span className="absolute -top-1 -right-2 bg-indigo-600 text-white text-[11px] font-semibold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
                {getCartItemCount()}
              </span>
            )}
          </Link>
          <button
            onClick={toggleTheme}
            className="hidden sm:inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          {user ? (
            <button
              onClick={logout}
              className="inline-flex items-center bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>


  );
};

export default Navbar;


