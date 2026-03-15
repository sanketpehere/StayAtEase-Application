import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">
                S
              </span>
            </div>
            <span className="font-display font-bold text-xl text-brand-dark">
              Stay<span className="text-brand-red">AtEase</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link
              to="/hotels"
              className="hover:text-brand-red transition-colors"
            >
              Hotels
            </Link>
            <Link
              to="/hotels?type=Resort"
              className="hover:text-brand-red transition-colors"
            >
              Resorts
            </Link>
            <Link
              to="/hotels?type=Villa"
              className="hover:text-brand-red transition-colors"
            >
              Villas
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl transition-colors"
                >
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.fullName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-brand-red flex items-center justify-center text-white text-xs font-bold">
                      {user.fullName?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user.fullName?.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard size={15} /> My Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={15} /> Profile
                    </Link>
                    <hr className="border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-brand-red hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-sm font-medium text-gray-600 hover:text-brand-red transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="btn-primary text-sm py-2 px-5"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link
            to="/hotels"
            className="block text-sm font-medium text-gray-700 py-2"
            onClick={() => setMenuOpen(false)}
          >
            Hotels
          </Link>
          <Link
            to="/hotels?type=Resort"
            className="block text-sm font-medium text-gray-700 py-2"
            onClick={() => setMenuOpen(false)}
          >
            Resorts
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="block text-sm font-medium text-gray-700 py-2"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block text-sm font-medium text-brand-red py-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="block btn-primary text-center text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Sign In / Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
