import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
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
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 outline-none transition placeholder-white/70"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 outline-none transition placeholder-white/70"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-violet-600 hover:bg-violet-500 transition shadow-md hover:shadow-violet-500/30"
          >
            Login
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-white/60">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-violet-400 hover:text-violet-300 cursor-pointer"
          >
            Create one
          </span>
        </p>
      </motion.div>
    </div>
  );
}
