import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Try different credentials or try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.15)]"
      >
        <h2 className="text-3xl font-semibold text-center mb-6 tracking-tight">
          Create Your Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 outline-none transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-violet-600 hover:bg-violet-500 transition shadow-md hover:shadow-violet-500/30"
          >
            Register
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-white/60">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-violet-400 hover:text-violet-300 cursor-pointer"
          >
            Log in
          </span>
        </p>
      </motion.div>
    </div>
  );
}
