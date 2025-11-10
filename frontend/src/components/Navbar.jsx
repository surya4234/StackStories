import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">🌟 PostPortal</Link>
      <div className="flex gap-4">
        {!user ? (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        ) : (
          <>
            <span>Hi, {user.name}</span>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <button onClick={onLogout} className="bg-white text-purple-600 px-3 py-1 rounded-lg">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
