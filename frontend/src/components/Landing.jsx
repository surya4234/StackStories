import React from "react";
import {
  PenTool,
  Users,
  Database,
  TrendingUp,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
/**
 * LandingPage.jsx
 *
 * Single-file React + TailwindCSS landing page for a modern blogging platform.
 * - Mobile-first, fully responsive
 * - "Distraction-Free Creator Focus" design philosophy
 * - Uses lucide-react for icons
 *
 * Usage:
 * - Ensure Tailwind CSS is configured in your project.
 * - Install lucide-react: `npm install lucide-react`
 * - Import and render <LandingPage /> in your app.
 */

const CTAPrimary = ({ children }) => (
  <button
    onClick= {() => navigate("/login")}
    className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-semibold rounded-lg px-5 py-3 shadow-lg hover:scale-[1.01] transform transition duration-250 ease-out focus:outline-none focus:ring-4 focus:ring-indigo-200"
  >
    {children}
    <ArrowRight size={16} />
  </button>
);

const CTASecondary = ({ children, onClick }) => (
  <button
    onClick={() => navigate("/login")}
    className="inline-flex items-center gap-3 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 bg-transparent px-4 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition duration-200"
  >
    {children}
  </button>
);

const IconCard = ({ Icon, title, desc, accent }) => (
  <div className="flex flex-col items-start gap-4 p-6 rounded-xl bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1">
    <div
      className={`p-3 rounded-lg inline-flex items-center justify-center ${accent}`}
      aria-hidden
    >
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">{desc}</p>
    </div>
  </div>
);

const FeaturedCreator = ({ avatar, name, articleTitle }) => (
  <article className="flex items-center gap-4 p-4 rounded-xl bg-white/80 dark:bg-white/5 border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition">
    <img
      src={avatar}
      alt={name}
      className="w-14 h-14 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
    />
    <div className="flex-1">
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-md font-medium text-neutral-900 dark:text-neutral-100">
          {name}
        </h4>
        <a
          href="#"
          className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          View Article →
        </a>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1 truncate">
        {articleTitle}
      </p>
    </div>
  </article>
);

/* Simple ticker that cycles through messages */
const Ticker = ({ messages = [], interval = 3000 }) => {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % messages.length), interval);
    return () => clearInterval(t);
  }, [messages.length, interval]);
  return (
    <div className="flex items-center gap-4 overflow-hidden">
      <div className="text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
        {messages[idx]}
      </div>
    </div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const stats = [
    "1,240 posts published today",
    "8,712 new readers joined this week",
    "Top stories read in 5 mins or less",
  ];

  const featured = [
    {
      avatar: "https://via.placeholder.com/160x160.png?text=A",
      name: "Asha Verma",
      articleTitle: "How to structure a story that hooks at first line",
    },
    {
      avatar: "https://via.placeholder.com/160x160.png?text=J",
      name: "J. Kumar",
      articleTitle: "Finding rhythm: Daily writing tips that actually work",
    },
    {
      avatar: "https://via.placeholder.com/160x160.png?text=M",
      name: "Maya Lee",
      articleTitle: "Turning side projects into sustainable income",
    },
  ];

  return (
    <main className="min-h-screen text-neutral-900 dark:text-neutral-100 bg-gradient-to-b from-white to-neutral-50 dark:from-[#071026] dark:to-[#031021]">
      {/* NAVBAR */}
      {/* <header className="sticky top-0 z-40 backdrop-blur-md bg-white/60 dark:bg-black/40 border-b border-neutral-100 dark:border-neutral-800">
        <div className="container flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-md bg-gradient-to-tr from-indigo-600 to-fuchsia-600 flex items-center justify-center text-white font-bold shadow-md"
              aria-hidden
            >
              M
            </div>
            <span className="font-semibold text-lg tracking-tight">Mediumish</span>
          </div>
           <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-indigo-600">
              Explore
            </a>
            <a href="#" className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-indigo-600">
              Pricing
            </a>
            <a href="#" className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-indigo-600">
              About
            </a>
            <div className="ml-2">
              <CTASecondary>Explore Trending Posts</CTASecondary>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <button className="text-sm py-2 px-3 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">Log in</button>
            <CTAPrimary>Start Writing for Free</CTAPrimary>
          </div>
        </div>
      </header> */}

      {/* HERO */}
      <section className="container grid gap-8 grid-cols-1 md:grid-cols-2 items-center py-14">
        {/* Left: Text */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Just Write. <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-fuchsia-600">We Handle the Rest.</span>
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-xl">
            The fastest way to publish your stories, build an audience, and monetize your passion—no coding required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <CTAPrimary>Start Writing for Free</CTAPrimary>
            <CTASecondary>Explore Trending Posts</CTASecondary>
          </div>

          <div className="mt-4 rounded-xl bg-white/80 dark:bg-white/5 backdrop-blur-sm p-4 border border-neutral-100 dark:border-neutral-800 inline-flex items-center gap-4">
            <div className="flex items-center gap-3">
              <TrendingUp size={18} className="text-indigo-600" />
              <div className="text-sm text-neutral-700 dark:text-neutral-300">
                <strong>Trending:</strong> <span className="text-indigo-600">Why readers love short essays</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Visual mockup */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Editor mock */}
            <figure className="rounded-xl overflow-hidden bg-white/95 dark:bg-white/6 border border-neutral-100 dark:border-neutral-800 shadow-md p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 rounded-full bg-neutral-200 dark:bg-neutral-800"></div>
                <div className="h-3 w-8 rounded-full bg-neutral-200 dark:bg-neutral-800"></div>
              </div>
              <div className="flex-1">
                <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded mb-1 w-full"></div>
                <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded mb-1 w-5/6"></div>
                <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded mb-1 w-2/3"></div>
              </div>
              <div className="text-sm text-neutral-500">Clean editor — zero distractions</div>
            </figure>

            {/* Mobile publish mock */}
            <figure className="rounded-xl overflow-hidden bg-gradient-to-b from-neutral-50 to-white dark:from-[#07172b]/30 dark:to-[#031021]/20 border border-neutral-100 dark:border-neutral-800 shadow-md p-4 flex flex-col">
              <div className="h-8 w-20 bg-neutral-100 dark:bg-neutral-800 rounded mb-3"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded mb-2"></div>
              <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded mb-1 w-4/5"></div>
              <div className="mt-auto text-sm text-neutral-500">Reader view • Mobile</div>
            </figure>
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="container py-12">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h2 className="text-2xl font-semibold">The Writer's Struggle — Solved</h2>
          <p className="text-neutral-600 dark:text-neutral-300 mt-2">
            Simple, distraction-free tools to help you focus on what matters — your words.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
          <IconCard
            Icon={PenTool}
            title="Zero Distractions"
            desc="A clean editor that fades the interface away—so your words get the spotlight."
            accent="bg-indigo-600"
          />
          <IconCard
            Icon={Users}
            title="Built-in Audience"
            desc="Discoverability features help your best work find readers without extra promotion."
            accent="bg-emerald-500"
          />
          <IconCard
            Icon={Database}
            title="Your Content, Your Data"
            desc="Export, own, and control your stories — we never hold your audience hostage."
            accent="bg-fuchsia-600"
          />
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white/90 dark:bg-white/6 p-3 border border-neutral-100 dark:border-neutral-800 shadow-sm">
              <TrendingUp size={20} className="text-indigo-600" />
            </div>
            <div>
              <div className="text-sm text-neutral-500">Live activity</div>
              <div className="text-lg font-semibold">
                <Ticker messages={stats} interval={3200} />
              </div>
            </div>
          </div>

          <div className="text-sm text-neutral-500">Join thousands of creators building meaningful work.</div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {featured.map((f, i) => (
            <FeaturedCreator
              key={i}
              avatar={f.avatar}
              name={f.name}
              articleTitle={f.articleTitle}
            />
          ))}
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section className="container py-12">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-2xl font-semibold">Features that help you create & earn</h2>
          <p className="text-neutral-600 dark:text-neutral-300 mt-2">
            Focus on your craft — we take care of the rest: growth, publishing, and monetization.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <div className="card">
            <h3 className="text-lg font-semibold">Write how you want</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
              Seamless Markdown and rich text together — format instantly and see it live.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30">
                <PenTool size={18} className="text-indigo-600" />
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-300">Fast formatting</div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold">Get paid by readers</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
              Built-in subscriptions, tips, and paywalled posts so you can monetize directly.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-fuchsia-50 dark:bg-fuchsia-900/30">
                <CreditCard size={18} className="text-fuchsia-600" />
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-300">Flexible monetization</div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold">Grow with discovery</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
              Smart recommendations and reader-first feeds connect your writing to the right audience.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30">
                <Users size={18} className="text-emerald-600" />
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-300">Built for discovery</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL FOOTER CTA */}
      <section className="py-14">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto glass p-10 rounded-2xl border border-neutral-100 dark:border-neutral-800">
            <h2 className="text-3xl font-extrabold mb-4">Ready to share your story?</h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-6">
              Start your blog, build a following, and earn — all in one place, without the noise.
            </p>
            <div className="flex items-center justify-center gap-4">
              <CTAPrimary onClick={() => navigate("/login")}>Start Your Blog Today</CTAPrimary>
              <CTASecondary>See sample posts</CTASecondary>
            </div>
          </div>

          <footer className="mt-10 text-sm text-neutral-500 dark:text-neutral-400">
            © {new Date().getFullYear()} Mediumish • Terms • Privacy
          </footer>
        </div>
      </section>
    </main>
  );
}
