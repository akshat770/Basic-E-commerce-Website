import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useTheme } from "../contexts/ThemeContext";
const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="sticky top-0 z-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600/95 backdrop-blur supports-[backdrop-filter]:bg-opacity-90 border-b border-white/10 shadow-lg">
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {" "}
        <Link
          to="/"
          className="text-2xl font-bold text-white tracking-tight transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-sm"
        >
          {" "}
          ShopHub{" "}
        </Link>{" "}
        <div className="flex items-center gap-2 sm:gap-4">
          {" "}
          <Link
            to="/"
            className="px-3 py-2 text-white/90 hover:text-white rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            {" "}
            Home{" "}
          </Link>{" "}
          <Link
            to="/cart"
            className="relative px-3 py-2 text-white/90 hover:text-white rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            {" "}
            Cart{" "}
            {getCartItemCount() > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-semibold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center shadow ring-1 ring-white/40">
                {" "}
                {getCartItemCount()}{" "}
              </span>
            )}{" "}
          </Link>{" "}
          <button
            onClick={toggleTheme}
            className="hidden sm:inline-flex items-center text-white/90 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            {" "}
            {theme === "dark" ? "Light" : "Dark"}{" "}
          </button>{" "}
          {user ? (
            <button
              onClick={logout}
              className="inline-flex items-center bg-white/20 text-white px-3 py-1.5 rounded-md hover:bg-white/30 transition-all duration-200 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {" "}
              Logout{" "}
            </button>
          ) : (
            <>
              {" "}
              <Link
                to="/login"
                className="px-3 py-2 text-white/90 hover:text-white rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Login
              </Link>{" "}
              <Link
                to="/signup"
                className="inline-flex items-center bg-white text-indigo-700 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Sign Up
              </Link>{" "}
            </>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </nav>
  );
};

export default Navbar;
