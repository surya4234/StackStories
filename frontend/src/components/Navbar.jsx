import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const location = useLocation();

  const navItem = (path, label) => (
    <Link
      to={path}
      className={`text-sm font-medium transition ${
        location.pathname === path
          ? "text-indigo-600"
          : "text-slate-600 hover:text-indigo-600"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-white/60 border-b border-white/20 shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* Brand */}
        <Link 
          to="/" 
          className="text-xl font-extrabold tracking-tight text-slate-900 hover:text-indigo-600 transition"
        >
          🌟 PostPortal
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-5">
          {!user ? (
            <>
              {navItem("/login", "Login")}
              {navItem("/register", "Register")}
            </>
          ) : (
            <>
              <span className="text-sm text-slate-600 font-medium">
                Hi, <span className="font-semibold text-slate-800">{user.name}</span>
              </span>

              {navItem("/dashboard", "Dashboard")}

              <button
                onClick={onLogout}
                className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
