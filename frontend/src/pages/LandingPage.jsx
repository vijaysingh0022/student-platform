import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Bot,
  Brain,
  Code2,
  Target,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Flame,
  Zap,
  Award,
  Sparkles,
  ChevronRight,
  BarChart3,
  Compass,
  GraduationCap,
  Shield,
  Layers,
  Search,
  Activity,
  Cpu,
  UserCheck,
  PlayCircle
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer
} from "recharts";
import { useAuth } from "../context/AuthContext.jsx";
import { LearnXLogo } from "../components/LearnXLogo.jsx";

// Recharts radar data for Section 4 (AI Learning Profile)
const RADAR_DATA = [
  { subject: "DSA", score: 82 },
  { subject: "DBMS", score: 74 },
  { subject: "OS", score: 68 },
  { subject: "CN", score: 61 },
  { subject: "OOPs", score: 88 },
  { subject: "System Design", score: 65 }
];

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const featureCards = [
    {
      icon: BookOpen,
      title: "1. 📚 Smart Learning",
      desc: "Learn complete CSE subjects organized systematically by Semester → Unit → Chapter → Topic with video tutorials & quizzes.",
      link: "/learn",
      tag: "Curriculum Track"
    },
    {
      icon: Bot,
      title: "2. 🤖 AI Tutor 24/7",
      desc: "Ask any technical concept question, get step-by-step code explanations, real-world examples, and personalized tutoring.",
      link: "/tutor",
      tag: "Instant AI Mentor"
    },
    {
      icon: Brain,
      title: "3. 🧠 Skill Diagnostic",
      desc: "AI continuously analyzes your strengths & weak concepts through adaptive quizzes and generates your real-time CSE Skill Graph.",
      link: "/skill-graph",
      tag: "Adaptive Analytics"
    },
    {
      icon: Code2,
      title: "4. 💻 AI Coding Lab",
      desc: "Practice DSA problems with multi-language compiler (C, C++, Java, Python, JS, SQL), custom test cases & instant AI debugging.",
      link: "/coding-lab",
      tag: "Hands-on Practice"
    },
    {
      icon: Target,
      title: "5. 🎯 Career Roadmap",
      desc: "Generate a personalized day-by-day learning roadmap tailored specifically to your target CSE role and current skill level.",
      link: "/roadmap",
      tag: "AI Roadmaps"
    },
    {
      icon: Rocket,
      title: "6. 🚀 Placement Preparation",
      desc: "Comprehensive preparation covering DSA, Core CS, Aptitude, AI Mock Interviews (5 rounds with live feedback) & CTC estimation.",
      link: "/placement-readiness",
      tag: "Interview Ready"
    }
  ];

  const targetRoles = [
    { name: "Software Developer", icon: Code2, color: "from-blue-600 to-indigo-600" },
    { name: "Full Stack Developer", icon: Layers, color: "from-indigo-600 to-purple-600" },
    { name: "Data Analyst", icon: BarChart3, color: "from-purple-600 to-pink-600" },
    { name: "AI/ML Engineer", icon: Cpu, color: "from-pink-600 to-rose-600" },
    { name: "Cyber Security Analyst", icon: Shield, color: "from-cyan-600 to-blue-600" }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/learn?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* ─── TOP NAVBAR ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#faf8f5]/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <LearnXLogo size="md" showBadge={true} />
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-semibold text-slate-700">
            <Link to="/" className="text-blue-600 font-bold hover:text-blue-700 transition">Home</Link>
            <Link to="/learn" className="hover:text-blue-600 transition">Learn</Link>
            <Link to="/coding-lab" className="hover:text-blue-600 transition">Practice</Link>
            <Link to="/tutor" className="hover:text-blue-600 transition flex items-center gap-1">
              <span>AI Tutor</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">AI</span>
            </Link>
            <Link to="/skill-graph" className="hover:text-blue-600 transition">Skill Diagnostic</Link>
            <Link to="/roadmap" className="hover:text-blue-600 transition">Career</Link>
          </nav>

          {/* Center Search Input */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, subjects..."
              className="w-full bg-white border border-slate-200/90 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
            />
          </form>

          {/* Right User State Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-xs">
                  <span className="text-amber-500 flex items-center gap-1 font-bold">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" /> {user.streakDays || 18} Day Streak
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-indigo-600 font-extrabold">⭐ {user.totalXP || 4850} XP</span>
                </div>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-full bg-[#0066ff] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-xs">
                  <span className="text-amber-500 flex items-center gap-1 font-bold">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" /> 18 Day Streak
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-amber-500 font-extrabold">⭐ 4,850 XP</span>
                </div>
                <Link
                  to="/sign-in"
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-white transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="px-4 py-2 rounded-full bg-[#0066ff] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
                >
                  <span>Start Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── SECTION 1: HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-8 pb-16 lg:pt-12 lg:pb-20 overflow-hidden">
        {/* Soft Ambient Light Glow Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-6 text-left"
            >
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI-POWERED PERSONAL LEARNING</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Your Personal <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  AI-Powered Learning
                </span> <br />
                & Career Mentor.
              </h1>

              {/* Subheading */}
              <p className="text-base text-slate-600 font-medium leading-relaxed max-w-md">
                Learn every CSE subject, master coding, discover your skill gaps, and follow a personalized roadmap from classroom to career.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to={user ? "/dashboard" : "/sign-up"}
                  className="px-6 py-3.5 rounded-full bg-[#0066ff] hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>Start Learning Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#features"
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 font-bold text-sm shadow-xs transition flex items-center gap-2"
                >
                  <PlayCircle className="w-4 h-4 text-blue-600 fill-blue-50" />
                  <span>Explore LearnX</span>
                </a>
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 max-w-md">
                {[
                  "Personalized Learning",
                  "AI Tutor 24/7",
                  "Skill Gap Analysis",
                  "Placement Preparation"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Hero Visual with Student Image Background + Floating Glass Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-7 relative"
            >
              {/* Student Background Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/60 border border-slate-200/80 bg-white">
                {/* Background Photo */}
                <div className="relative h-[440px] sm:h-[480px] w-full">
                  <img
                    src="/student_hero.jpg"
                    alt="Student studying CSE on LearnX"
                    className="w-full h-full object-cover object-center opacity-85"
                  />
                  {/* Subtle Light Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/30 via-white/10 to-white/70" />
                </div>

                {/* Overlaid Main Glass Dashboard Card */}
                <div className="absolute top-6 left-6 right-36 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-5 shadow-2xl shadow-slate-900/10 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        <Brain className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">Your Learning Intelligence</h3>
                        <p className="text-[10px] font-semibold text-slate-500">Real-Time CSE Subject Mastery</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Sync
                    </span>
                  </div>

                  {/* Skill Progress Bars */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Skill Progress</div>
                    {[
                      { name: "DSA", pct: 82, color: "bg-blue-600" },
                      { name: "DBMS", pct: 74, color: "bg-cyan-500" },
                      { name: "OS", pct: 68, color: "bg-purple-600" },
                      { name: "CN", pct: 61, color: "bg-sky-500" }
                    ].map((s, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span>{s.name}</span>
                          <span className="font-mono text-blue-600">{s.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${s.color} transition-all duration-1000`}
                            style={{ width: `${s.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Career Readiness */}
                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span className="flex items-center gap-1">
                        <Rocket className="w-3.5 h-3.5 text-blue-600" /> Career Readiness Score
                      </span>
                      <span className="text-blue-600 font-extrabold font-mono">78%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full w-[78%]" />
                    </div>
                  </div>

                  {/* AI Recommendation Callout */}
                  <div className="bg-purple-50/90 border border-purple-200/80 rounded-xl p-2.5 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-extrabold text-purple-900 uppercase tracking-wider">AI Recommendation</div>
                      <p className="text-[11px] font-semibold text-purple-800 leading-tight">
                        "Focus on Graph Algorithms next to bridge your placement readiness gap."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Stacked Column of 3 Floating White Cards */}
                <div className="absolute top-6 right-4 w-28 space-y-3">
                  <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl text-center space-y-1">
                    <div className="w-7 h-7 mx-auto rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div className="text-sm font-black text-slate-900">+12%</div>
                    <div className="text-[9px] font-bold text-slate-500">Skill Growth</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl text-center space-y-1">
                    <div className="w-7 h-7 mx-auto rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Flame className="w-4 h-4 fill-amber-500" />
                    </div>
                    <div className="text-sm font-black text-slate-900">7 Day</div>
                    <div className="text-[9px] font-bold text-slate-500">Streak</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl text-center space-y-1">
                    <div className="w-7 h-7 mx-auto rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Target className="w-4 h-4" />
                    </div>
                    <div className="text-sm font-black text-slate-900">3 Topics</div>
                    <div className="text-[9px] font-bold text-slate-500">Completed</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ─── SECTION 2: FLOATING HORIZONTAL STATS BAR ───────────────────────── */}
          <div className="mt-12 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 shadow-xl shadow-slate-200/60 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="flex items-center gap-3 justify-center">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg">
                  🎓
                </div>
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-black text-slate-900">10K+</div>
                  <div className="text-xs font-semibold text-slate-500">Learning Sessions</div>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center pt-4 md:pt-0">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg">
                  📖
                </div>
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-black text-blue-600">50+</div>
                  <div className="text-xs font-semibold text-slate-500">CSE Topics</div>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center pt-4 md:pt-0">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-lg">
                  🤖
                </div>
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-black text-purple-600">24/7</div>
                  <div className="text-xs font-semibold text-slate-500">AI Tutor</div>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center pt-4 md:pt-0">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg">
                  🎯
                </div>
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-black text-emerald-600">Personalized</div>
                  <div className="text-xs font-semibold text-slate-500">Learning Paths</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: EVERYTHING YOU NEED TO GROW ─────────────────────────── */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-bold uppercase tracking-wider">
              Complete Platform Suite
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              One Platform. Your Complete CSE Journey.
            </h2>
            <p className="text-base text-slate-600 font-medium">
              Everything you need to excel in semester exams, master computer science fundamentals, and crack company placements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCards.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#faf8f5] border border-slate-200/90 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-blue-300 transition flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-[#0066ff] group-hover:text-white transition-colors duration-300">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 uppercase tracking-wider">
                        {feat.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {feat.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-200/60">
                    <Link
                      to={feat.link}
                      className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
                    >
                      <span>Explore Feature</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: AI PERSONALIZATION ──────────────────────────────────── */}
      <section className="py-20 bg-[#faf8f5] border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-extrabold text-purple-600 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-200/80">
              Adaptive Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              LearnX Understands How You Learn.
            </h2>
            <p className="text-slate-600 text-base font-medium">
              Our AI constantly models your retention, identifies high-risk concept zones, and delivers targeted micro-lessons.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Recharts Radar AI Brain Chart */}
            <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center relative shadow-sm min-h-[380px]">
              <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Multi-Dimensional Subject Diagnostic
              </div>

              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={RADAR_DATA}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 12, fontWeight: 700 }} />
                    <Radar
                      name="Student Mastery"
                      dataKey="score"
                      stroke="#0066ff"
                      fill="#2563eb"
                      fillOpacity={0.35}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-xs font-bold text-slate-500 mt-2 text-center">
                Live AI Assessment Diagnostic Map
              </div>
            </div>

            {/* Right: Learning Profile Summary */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-xs font-mono font-bold text-blue-300 uppercase tracking-widest">Profile Snapshot</div>
                    <h3 className="text-xl font-black text-white mt-0.5">YOUR LEARNING PROFILE</h3>
                  </div>
                  <UserCheck className="w-6 h-6 text-blue-400" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4">
                    <div className="text-xs text-slate-400 font-semibold">Current Level</div>
                    <div className="text-lg font-bold text-white mt-1">Intermediate</div>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4">
                    <div className="text-xs text-slate-400 font-semibold">Strongest Skill</div>
                    <div className="text-lg font-bold text-emerald-400 mt-1">Programming</div>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4">
                    <div className="text-xs text-slate-400 font-semibold">Needs Improvement</div>
                    <div className="text-lg font-bold text-rose-400 mt-1">Operating Systems</div>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4">
                    <div className="text-xs text-slate-400 font-semibold">Recommended Next Step</div>
                    <div className="text-lg font-bold text-cyan-400 mt-1">Graph Algorithms</div>
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-200">
                    <span>Weekly Goal Progress</span>
                    <span className="font-mono text-cyan-400">8 / 10 Hours (80%)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-900 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full w-[80%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: LEARNING JOURNEY ────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-100/80 px-3 py-1 rounded-full">
              Proven Methodology
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              From Confused to Career Ready.
            </h2>
            <p className="text-slate-600 text-base font-medium">
              LearnX continuously updates your personalized roadmap based on every quiz, coding solution, and diagnostic score.
            </p>
          </div>

          {/* Horizontal Journey Steps */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { num: "01", title: "Diagnose", desc: "Identify skill gaps" },
              { num: "02", title: "Plan", desc: "AI custom roadmap" },
              { num: "03", title: "Learn", desc: "Structured units" },
              { num: "04", title: "Practice", desc: "Coding & quizzes" },
              { num: "05", title: "Measure", desc: "Track progress" },
              { num: "06", title: "Improve", desc: "Target weaknesses" },
              { num: "07", title: "Career Ready", desc: "Crack interviews" }
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-[#faf8f5] border border-slate-200/90 rounded-2xl p-4 text-center shadow-xs hover:border-blue-400 transition"
              >
                <div className="text-xs font-mono font-extrabold text-blue-600 mb-1">{step.num}</div>
                <div className="text-sm font-bold text-slate-900">{step.title}</div>
                <div className="text-[11px] font-semibold text-slate-500 mt-1">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: DASHBOARD PREVIEW ────────────────────────────────────── */}
      <section className="py-20 bg-[#faf8f5] border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80">
              Student Command Center
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Experience the LearnX Dashboard.
            </h2>
            <p className="text-slate-600 text-base font-medium">
              A single unified hub for your subject progress, daily goals, XP streaks, and AI recommendations.
            </p>
          </div>

          {/* Realistic Student Dashboard Mockup Card */}
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-slate-800 space-y-8">
            {/* Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <h3 className="text-2xl font-black text-white">
                  {user ? `Welcome back, ${user.name || "Student"} 👋` : "Student Command Center Preview 👋"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Your CSE learning command center is up to date.</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="px-3 py-1.5 rounded-xl bg-slate-800 text-amber-400 font-extrabold text-xs flex items-center gap-1.5 border border-slate-700">
                  <Flame className="w-4 h-4 fill-amber-400" /> Current Streak: 18 Days
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-800 text-indigo-400 font-extrabold text-xs flex items-center gap-1.5 border border-slate-700">
                  <Award className="w-4 h-4" /> XP: 4,850
                </div>
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Continue Learning */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Continue Learning</div>
                <div className="text-lg font-bold text-white">Data Structures & Algorithms</div>
                <div className="flex justify-between text-xs text-slate-300 pt-2 font-mono">
                  <span>Progress</span>
                  <span className="text-cyan-400 font-bold">78%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full w-[78%]" />
                </div>
              </div>

              {/* Card 2: Today's Goal */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Focus Goal</div>
                <div className="text-lg font-bold text-emerald-400">Complete Graph Traversal</div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Finish BFS & DFS unit quiz to maintain your 18-day streak.
                </div>
              </div>

              {/* Card 3: Skill Overview */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skill Overview</div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["DSA", "DBMS", "OS", "Computer Networks", "Java"].map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-200 text-xs font-bold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Recommendation */}
            <div className="bg-indigo-950/60 border border-indigo-800/80 rounded-2xl p-4 flex items-center gap-3">
              <Bot className="w-6 h-6 text-indigo-400 shrink-0" />
              <div className="text-xs text-indigo-200">
                <strong className="text-white">AI Recommendation:</strong> "Revise BFS before starting Advanced Graphs to optimize your diagnostic score."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: CAREER INTELLIGENCE ────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-100/80 px-3 py-1 rounded-full">
              Placement Readiness Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Know Where You Stand. Know What To Learn Next.
            </h2>
            <p className="text-slate-600 text-base font-medium">
              Bridge the gap between academic curriculum and high-growth industry roles with data-backed skill intelligence.
            </p>
          </div>

          {/* Flow Pipeline */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-mono text-xs sm:text-sm font-bold text-slate-700 bg-[#faf8f5] p-6 rounded-3xl border border-slate-200/90 shadow-xs max-w-4xl mx-auto">
            <span className="px-3 py-1.5 rounded-xl bg-white text-slate-800 shadow-xs">Current Skills</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700">Skill Gap Analysis</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
            <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700">Target Role</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
            <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700">Personalized Roadmap</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700">Placement Prep</span>
          </div>

          {/* Target Role Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {targetRoles.map((role, idx) => {
              const RoleIcon = role.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#faf8f5] border border-slate-200/90 rounded-2xl p-5 text-center shadow-xs hover:shadow-md hover:border-blue-300 transition space-y-3"
                >
                  <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-r ${role.color} text-white flex items-center justify-center shadow-xs`}>
                    <RoleIcon className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold text-slate-900">{role.name}</div>
                  <Link
                    to="/career-readiness"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    <span>View Role Path</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-slate-400 font-medium italic">
            * LearnX provides objective skill diagnostic intelligence to assist in candidate placement readiness.
          </p>
        </div>
      </section>

      {/* ─── SECTION 8: FINAL CTA & FOOTER ───────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Your Career Doesn't Need <br />
            Another Generic Course.
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-medium max-w-2xl mx-auto">
            Build the skills. Follow the roadmap. Let AI guide your next step from classroom to tech industry.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to={user ? "/dashboard" : "/sign-up"}
              className="px-8 py-4 rounded-full bg-[#0066ff] hover:bg-blue-700 text-white font-bold text-base shadow-xl shadow-blue-500/30 transition transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Start Your LearnX Journey</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/learn"
              className="px-8 py-4 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-base transition"
            >
              Explore Platform
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-900 pb-8">
            <div className="space-y-2 text-center md:text-left">
              <LearnXLogo size="md" showBadge={true} />
              <p className="text-xs text-slate-500 font-medium">
                Learn. Practice. Grow. Succeed.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 font-semibold text-slate-300 text-xs sm:text-sm">
              <Link to="/about" className="hover:text-blue-400 transition">About</Link>
              <Link to="/learn" className="hover:text-blue-400 transition">Learn</Link>
              <Link to="/coding-lab" className="hover:text-blue-400 transition">Practice</Link>
              <Link to="/tutor" className="hover:text-blue-400 transition">AI Tutor</Link>
              <Link to="/career-readiness" className="hover:text-blue-400 transition">Career</Link>
              <Link to="/privacy" className="hover:text-blue-400 transition">Privacy</Link>
              <Link to="/terms" className="hover:text-blue-400 transition">Terms</Link>
              <Link to="/contact" className="hover:text-blue-400 transition">Contact</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} LearnX. All rights reserved.</p>
            <p>Student Growth & Career Intelligence Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
