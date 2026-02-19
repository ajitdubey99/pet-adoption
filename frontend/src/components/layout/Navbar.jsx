/**
 * @fileoverview Responsive Navbar with role-based links and logout.
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

/**
 * Navbar renders top navigation with links based on user role.
 * Collapses to hamburger menu on mobile.
 *
 * @returns {JSX.Element}
 */
const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className="text-primary-100 hover:text-white transition-colors duration-200 text-sm font-medium"
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-primary-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-white font-bold text-xl tracking-tight">
            Pet Adoption
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/pets">Browse Pets</NavLink>
            {!isAuthenticated && (
              <>
                <NavLink to="/login">Login</NavLink>
                <Link to="/register" className="btn btn-sm bg-white text-primary-800 hover:bg-primary-50">
                  Register
                </Link>
              </>
            )}
            {isAuthenticated && !isAdmin && <NavLink to="/dashboard">My Applications</NavLink>}
            {isAdmin && (
              <>
                <NavLink to="/admin/pets">Manage Pets</NavLink>
                <NavLink to="/admin/applications">Applications</NavLink>
              </>
            )}
            {isAuthenticated && (
              <div className="flex items-center gap-3">
                <span className="text-primary-200 text-sm">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm border border-primary-400 text-primary-100 hover:bg-primary-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-0.5 bg-white mb-1"></div>
            <div className="w-5 h-0.5 bg-white mb-1"></div>
            <div className="w-5 h-0.5 bg-white"></div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-primary-900 px-4 pb-4 flex flex-col gap-3 pt-2">
          <NavLink to="/pets">Browse Pets</NavLink>
          {!isAuthenticated && (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
          {isAuthenticated && !isAdmin && <NavLink to="/dashboard">My Applications</NavLink>}
          {isAdmin && (
            <>
              <NavLink to="/admin/pets">Manage Pets</NavLink>
              <NavLink to="/admin/applications">Applications</NavLink>
            </>
          )}
          {isAuthenticated && (
            <button onClick={handleLogout} className="text-left text-red-300 text-sm font-medium">
              Logout ({user?.name})
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
