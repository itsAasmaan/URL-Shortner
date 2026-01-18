import { Link, useLocation } from "react-router-dom";
import { Link2, LayoutDashboard, LogOut, User, Home } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const isActive = (path: string): boolean => location.pathname === path;
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className="bg-primary-600 p-1.5 rounded-xl shadow-sm group-hover:scale-110 group-hover:bg-primary-700 transition-all duration-200">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Short<span className="text-primary-600">URL</span>
            </span>
          </Link>

          {/* Navigation Section */}
          <nav className="flex items-center space-x-1 sm:space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 text-sm font-semibold transition-colors rounded-md ${
                isActive("/")
                  ? "text-primary-600 bg-primary-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-semibold transition-colors rounded-md ${
                    isActive("/dashboard")
                      ? "text-primary-600 bg-primary-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                {/* User Profile & Logout Divider */}
                <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
                  <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs font-medium text-slate-700 max-w-30 truncate">{user?.email}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-full shadow-md shadow-primary-200 transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
