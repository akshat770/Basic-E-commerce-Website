import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white transition-transform duration-200 hover:scale-[1.02]">ShopHub</Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white/90 hover:text-white transition-colors duration-200">Home</Link>
          <Link to="/cart" className="relative text-white/90 hover:text-white transition-colors duration-200">
            Cart
            {getCartItemCount() > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow ring-1 ring-white/40">
                {getCartItemCount()}
              </span>
            )}
          </Link>
          <button onClick={toggleTheme} className="text-white/90 hover:text-white bg-white/10 px-2 py-1 rounded-md transition-colors duration-200">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          {user ? (
            <button onClick={logout} className="bg-white/20 text-white px-3 py-1 rounded-md hover:bg-white/30 transition-all duration-200 hover:scale-[1.03]">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-white/90 hover:text-white transition-colors duration-200">Login</Link>
              <Link to="/signup" className="bg-white text-blue-700 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors duration-200">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

 
