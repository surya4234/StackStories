// LandingPageRefactor.jsx
// Full refactor of your LandingPage with:
// - Framer Motion scroll reveal animations
// - Typing headline + subtle animated background orbs
// - Interactive demo card with 3D tilt + sheen on hover
// - Smooth scroll nav links
// - Glassmorphism feature cards, modern palette (deep slate + vivid indigo)
// - Tailwind CSS only styling (plus a small <style> block for keyframes used inline)
// - Uses lucide-react icons already; ensure framer-motion is installed
//
// Install dependencies:
// npm i framer-motion lucide-react
//
// Notes:
// - This file assumes Tailwind is set up and you use a modern font (Inter / Plus Jakarta).
// - Drop this component into your routes and render normally.

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PenTool,
  Users,
  Database,
  TrendingUp,
  CreditCard,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

/* ---------------------------
   Utility / Small subcomponents
   --------------------------- */

const NavLink = ({ href, children }) => {
  const onClick = (e) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <a
      href={href}
      onClick={onClick}
      className="text-sm text-slate-200 hover:text-white/95 transition"
    >
      {children}
    </a>
  );
};

const FeatureCard = ({ Icon, title, desc, accent }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="group relative p-6 rounded-2xl bg-white/6 border border-white/6 backdrop-blur-md"
  >
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${accent} text-white shadow-sm`}>
      <Icon size={20} />
    </div>
    <h3 className="mt-4 text-lg font-semibold text-slate-50">{title}</h3>
    <p className="mt-2 text-sm text-slate-300 leading-relaxed">{desc}</p>

    {/* subtle glass highlight */}
    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-white/2 to-transparent opacity-0 group-hover:opacity-10 transition" />
  </motion.div>
);

/* ---------------------------
   Main LandingPage component
   --------------------------- */

export default function LandingPageRefactor() {
  const navigate = useNavigate();

  // Typing effect
  const phrases = [
    "Write freely. Publish instantly.",
    "Build an audience. Earn from your words.",
    "A real-time publishing experience.",
  ];
  const [typing, setTyping] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const speed = deleting ? 40 : 70;
    const timeout = setTimeout(() => {
      const current = phrases[phraseIndex];
      if (!deleting) {
        // type forward
        setTyping(current.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
        if (charIndex + 1 === current.length) {
          // pause then delete
          setTimeout(() => setDeleting(true), 900);
        }
      } else {
        // deleting
        setTyping(current.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
        if (charIndex - 1 === 0) {
          setDeleting(false);
          setPhraseIndex((p) => (p + 1) % phrases.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charIndex, deleting, phraseIndex]);

  // Interactive demo tilt (mouse-driven)
  const demoRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-30, 30], [10, -10]);
  const rotateY = useTransform(x, [-30, 30], [-10, 10]);
  useEffect(() => {
    const el = demoRef.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1
      // center to -30..30
      x.set((px - 0.5) * 60);
      y.set((py - 0.5) * 60);
    };
    const handleLeave = () => {
      x.set(0);
      y.set(0);
    };
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    el.addEventListener("touchmove", handleMove, { passive: true });
    el.addEventListener("touchend", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      el.removeEventListener("touchmove", handleMove);
      el.removeEventListener("touchend", handleLeave);
    };
  }, [x, y]);

  // Framer reveal variants
  const reveal = {
    hidden: { opacity: 0, y: 16 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
  };

  /* ---------------------------
     UI / JSX
     --------------------------- */
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased">
      {/* small inline styles for animated orbs and typing caret */}
      <style>{`
        @keyframes floatX {
          0% { transform: translateX(0) translateY(0) }
          50% { transform: translateX(20px) translateY(-8px) }
          100% { transform: translateX(0) translateY(0) }
        }
        @keyframes floatY {
          0% { transform: translateY(0) }
          50% { transform: translateY(-18px) }
          100% { transform: translateY(0) }
        }
        .typing-caret::after {
          content: '';
          display: inline-block;
          width: 2px;
          height: 1.2em;
          margin-left: 6px;
          background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.6));
          animation: blink 1s steps(2, start) infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1 }
          51%, 100% { opacity: 0 }
        }
      `}</style>

      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-slate-900/60 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow">
              P
            </div>
            <div className="text-lg font-semibold tracking-tight">PostPortal</div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#demo">Demo</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#footer">Company</NavLink>
            <button
              onClick={() => navigate("/login")}
              className="ml-2 inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 rounded-full text-sm font-semibold shadow hover:scale-105 transform transition"
            >
              Get Started <ArrowRight size={16} />
            </button>
          </div>

          {/* mobile actions */}
          <div className="md:hidden">
            <button onClick={() => navigate("/login")} className="text-sm px-3 py-2 rounded-md bg-indigo-600/90">
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative overflow-hidden">
        {/* animated orbs */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <div style={{ mixBlendMode: "screen" }} className="relative w-full h-full">
            <div
              style={{
                width: 220,
                height: 220,
                left: "4%",
                top: "10%",
                background: "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.28), transparent 30%)",
                filter: "blur(40px)",
                position: "absolute",
                borderRadius: "50%",
                animation: "floatX 6s ease-in-out infinite",
              }}
            />
            <div
              style={{
                width: 160,
                height: 160,
                right: "8%",
                top: "20%",
                background: "radial-gradient(circle at 40% 40%, rgba(99,102,241,0.2), transparent 30%)",
                filter: "blur(28px)",
                position: "absolute",
                borderRadius: "50%",
                animation: "floatY 7s ease-in-out infinite",
              }}
            />
            <div
              style={{
                width: 120,
                height: 120,
                right: "20%",
                bottom: "4%",
                background: "radial-gradient(circle at 40% 40%, rgba(139,92,246,0.14), transparent 30%)",
                filter: "blur(24px)",
                position: "absolute",
                borderRadius: "50%",
                animation: "floatX 9s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* left: hero copy */}
            <div className="md:col-span-6">
              <motion.h1
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={reveal}
                className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight"
              >
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                  Write <span className="whitespace-nowrap">without limits.</span>
                </span>
                <span className="block mt-2 text-slate-200 text-lg md:text-xl font-medium">
                  <span className="typing-caret">{typing}</span>
                </span>
              </motion.h1>

              <motion.p
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={reveal}
                className="mt-6 text-slate-300 max-w-xl leading-relaxed"
              >
                PostPortal is a modern publishing platform with a real-time, delightful authoring experience.
                Publish, grow your audience, and monetize — all with beautiful, fast tools.
              </motion.p>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={reveal}
                className="mt-8 flex flex-wrap gap-4"
              >
                <button
                  onClick={() => navigate("/register")}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 rounded-full font-semibold shadow-lg transform hover:scale-[1.02] transition"
                >
                  Start writing — it's free <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => {
                    const el = document.querySelector("#demo");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 border border-white/8 text-sm"
                >
                  Try interactive demo
                </button>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={reveal}
                className="mt-8 text-sm text-slate-400 flex items-center gap-3"
              >
                <Sparkles size={16} className="text-indigo-400" />
                <span>Trusted by creators & teams — secure exports, analytics, and subscription tools.</span>
              </motion.div>
            </div>

            {/* right: interactive demo */}
            <div className="md:col-span-6 flex justify-center md:justify-end">
              <motion.div
                id="demo"
                ref={demoRef}
                style={{ rotateX, rotateY }}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md transform perspective-800"
              >
                <div className="relative">
                  {/* glossy card */}
                  <div
                    className="rounded-2xl bg-gradient-to-b from-white/6 to-white/3 border border-white/6 backdrop-blur-md p-5 shadow-2xl"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-semibold">A</div>
                        <div>
                          <div className="text-sm font-semibold">Asha Verma</div>
                          <div className="text-xs text-slate-400">2 hours ago • 3 min read</div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-400">Draft</div>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-white leading-tight">How to structure a story that hooks at first line</h3>
                      <p className="mt-3 text-slate-300 text-sm leading-relaxed">A small tease of the article — this card responds to your cursor and highlights sections on hover.</p>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-sm px-3 py-1 rounded-full bg-white/6 text-slate-100">#writing</div>
                        <div className="text-sm px-3 py-1 rounded-full bg-white/6 text-slate-100">#tips</div>
                      </div>
                      <div className="text-sm text-slate-300">❤ 128</div>
                    </div>
                  </div>

                  {/* sheen overlay */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))", mixBlendMode: "overlay" }} />

                  {/* subtle hover sheen that follows X motion value */}
                  <motion.div
                    style={{
                      x: useTransform(x, (v) => `${v / 2}px`),
                      y: useTransform(y, (v) => `${-v / 3}px`),
                    }}
                    className="absolute -left-12 -top-12 w-40 h-40 rounded-full blur-lg opacity-0 pointer-events-none"
                    animate={{ opacity: [0, 0.12, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center max-w-2xl mx-auto">
            <motion.h2 variants={reveal} className="text-2xl font-semibold">Features that feel alive</motion.h2>
            <motion.p variants={reveal} className="mt-3 text-slate-300">Design-first tools for writers: a fast editor, audience growth, and seamless monetization.</motion.p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              Icon={PenTool}
              title="Distraction-free editor"
              desc="Write with clarity — our editor hides UI while keeping power where you need it."
              accent="bg-indigo-500"
            />
            <FeatureCard
              Icon={Users}
              title="Built-in audience tools"
              desc="Smart discovery, subscriptions, and analytics to grow readers organically."
              accent="bg-emerald-500"
            />
            <FeatureCard
              Icon={Database}
              title="Your data, exportable"
              desc="Download posts, subscribers, and analytics whenever you want."
              accent="bg-fuchsia-500"
            />
          </div>
        </div>
      </section>

      {/* MORE / TRUST */}
      <section id="pricing" className="py-16 bg-slate-800/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div className="rounded-2xl p-6 bg-white/5 border border-white/6" whileHover={{ y: -6 }}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-white">Starter</h4>
                  <p className="text-sm text-slate-300 mt-1">Perfect for personal blogs & side projects</p>
                </div>
                <div className="text-2xl font-bold text-indigo-400">$0</div>
              </div>
              <ul className="mt-4 text-sm text-slate-300 space-y-2">
                <li>Unlimited posts</li>
                <li>Basic analytics</li>
                <li>Email support</li>
              </ul>
              <div className="mt-6">
                <button onClick={() => navigate("/register")} className="w-full rounded-full py-2 bg-indigo-600 font-semibold">Start free</button>
              </div>
            </motion.div>

            <motion.div className="rounded-2xl p-6 bg-white/5 border border-white/6" whileHover={{ y: -6 }}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-white">Creator</h4>
                  <p className="text-sm text-slate-300 mt-1">Monetize and build a following</p>
                </div>
                <div className="text-2xl font-bold text-indigo-400">$12/mo</div>
              </div>
              <ul className="mt-4 text-sm text-slate-300 space-y-2">
                <li>Advanced analytics</li>
                <li>Subscription payments</li>
                <li>Priority support</li>
              </ul>
              <div className="mt-6">
                <button onClick={() => navigate("/register")} className="w-full rounded-full py-2 bg-violet-600 font-semibold">Get Creator</button>
              </div>
            </motion.div>

            <motion.div className="rounded-2xl p-6 bg-white/5 border border-white/6" whileHover={{ y: -6 }}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-white">Team</h4>
                  <p className="text-sm text-slate-300 mt-1">Multiple authors, team analytics</p>
                </div>
                <div className="text-2xl font-bold text-indigo-400">Contact</div>
              </div>
              <ul className="mt-4 text-sm text-slate-300 space-y-2">
                <li>Multi-author workspaces</li>
                <li>Custom domains</li>
                <li>Dedicated support</li>
              </ul>
              <div className="mt-6">
                <button onClick={() => navigate("/contact")} className="w-full rounded-full py-2 bg-white/6 border border-white/8 font-semibold">Contact sales</button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="mt-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-md bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">P</div>
              <div className="text-lg font-semibold">PostPortal</div>
            </div>
            <p className="text-sm text-slate-400">Fast, beautiful publishing for creators who care about craft.</p>
            <div className="mt-4 text-sm text-slate-500">© {new Date().getFullYear()} PostPortal</div>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-slate-200 mb-3">Product</h5>
            <ul className="text-sm space-y-2 text-slate-400">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="/docs" className="hover:text-white">Docs</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-slate-200 mb-3">Company</h5>
            <ul className="text-sm space-y-2 text-slate-400">
              <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/careers" className="hover:text-white">Careers</a></li>
              <li><a href="/blog" className="hover:text-white">Blog</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-slate-200 mb-3">Support</h5>
            <ul className="text-sm space-y-2 text-slate-400">
              <li><a href="/help" className="hover:text-white">Help Center</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
              <li><a href="/terms" className="hover:text-white">Terms</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
