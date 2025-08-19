import { LogOut, User, Heart, Home } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import useAxios from "../hooks/useAxios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const TopBar = () => {
  const { fetchData } = useAxios();
  const { user, setUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetchData({ url: "/user/logout", method: "post" });
      setUser(null);

      location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("An error occurred during Logout", {
        autoClose: 2000,
        position: "bottom-right",
        theme: "colored",
      });
    }
  };

  return (
    <header className="sticky top-0 left-0 z-50 flex items-center justify-between px-6 py-3 bg-gray-900/95 backdrop-blur-md shadow-lg">
      {/* Brand */}
      <h1 className="text-xl font-bold tracking-wide">
        <Link
          to="/"
          className="text-white bg-clip-text  hover:opacity-90 transition-opacity"
        >
          My Recipe
        </Link>
      </h1>

      {/* Auth Menu */}
      {!user?.username ? (
        <NavLink
          to="/auth/login"
          className="px-4 py-2 text-sm font-medium text-white rounded-sm  hover:bg-gray-500 transition-colors"
        >
          Login
        </NavLink>
      ) : (
        <div className="flex items-center gap-5 md:gap-10">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-1 text-sm font-medium transition-colors ${
                isActive ? "text-pink-400" : "text-gray-200 hover:text-pink-200"
              }`
            }
          >
            <Home size={20} />
            <span className="hidden sm:inline">Home</span>
          </NavLink>

          <NavLink
            to="/favorite"
            className={({ isActive }) =>
              `flex items-center gap-1 text-sm font-medium transition-colors ${
                isActive ? "text-pink-400" : "text-gray-200 hover:text-pink-200"
              }`
            }
          >
            <Heart size={20} />
            <span className="hidden sm:inline">Favorite</span>
          </NavLink>
          <div
            className="relative flex items-center gap-4 md:gap-7"
            ref={menuRef}
          >
            {/* User menu */}
            <button
              className="flex items-center gap-2 focus:outline-none group "
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="User menu"
              aria-expanded={isMenuOpen}
            >
              <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center group-hover:ring-2 transition-all cursor-pointer">
                <User color="#fff" size={18} />
              </div>
              <span className="text-white font-medium uppercase hidden sm:inline">
                {user?.username}
              </span>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 70 }}
                  exit={{ opacity: 0, y: 60 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0  w-52 rounded-xl bg-gray-800/95 backdrop-blur-sm shadow-xl border border-gray-700 overflow-hidden"
                >
                  <div className="px-4 py-3 text-sm text-gray-300 border-b border-gray-700">
                    Signed in as{" "}
                    <span className="font-semibold">{user?.username}</span>
                  </div>
                  <button
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-red-600 hover:text-white transition-colors text-left"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span className="p-1">Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;
