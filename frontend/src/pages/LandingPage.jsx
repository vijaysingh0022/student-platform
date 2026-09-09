import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { LearnXLogo, LearnXIcon } from "../components/LearnXLogo.jsx";

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("skillgap");
  const [demoQuestionIndex, setDemoQuestionIndex] = useState(0);

  const demoTutorQuestions = [
    {
      q: "Explain BCNF with a quick practical example.",
      a: "A relation is in BCNF (Boyce-Codd Normal Form) if for every functional dependency X → Y, X is a superkey. In simpler terms: every determinant must be a candidate key. Unlike 3NF, BCNF eliminates anomalies arising from overlapping candidate keys!"
    },
    {
      q: "Why use B+ Trees over Hash Tables for database indexing?",
      a: "Hash tables provide O(1) lookups for point queries (e.g., WHERE id = 42), but cannot handle range queries (e.g., WHERE age BETWEEN 20 AND 30). B+ Trees maintain sorted leaf nodes in a doubly-linked list, allowing O(log N) point lookups AND extremely fast range scans with minimal disk I/O."
    },
    {
      q: "What is the difference between Preemptive and Non-Preemptive scheduling?",
      a: "In preemptive scheduling, the OS can interrupt a running process (e.g., Round Robin, SRTF) to allocate CPU to a higher-priority task. In non-preemptive scheduling (e.g., FCFS), once CPU is allocated to a process, it holds it until termination or I/O wait."
    }
  ];

  const pillars = [
    {
      icon: "📖",
      title: "Personalized Learning",
      tagline: "Adaptive & Custom",
      desc: "Diagnostics pinpoint your conceptual weaknesses and build 7-day personalized remediation plans.",
      color: "from-blue-500 to-sky-600",
      bgLight: "bg-blue-50/80 border-blue-200"
    },
    {
      icon: "🤖",
      title: "AI Guidance",
      tagline: "24/7 CS Mentorship",
      desc: "Instant theory explanations, viva preparation, and step-by-step code analysis.",
      color: "from-violet-600 to-indigo-600",
      bgLight: "bg-violet-50/80 border-violet-200"
    },
    {
      icon: "📝",
      title: "Practice & Tests",
      tagline: "Calibrated MCQs",
      desc: "Industry-standard diagnostic assessments across DBMS, Operating Systems, and DSA.",
      color: "from-indigo-600 to-purple-600",
      bgLight: "bg-indigo-50/80 border-indigo-200"
    },
    {
      icon: "📊",
      title: "Track Progress",
      tagline: "Live Skill Matrix",
      desc: "Real-time accuracy radars, historical growth charts, and test mastery dashboards.",
      color: "from-purple-600 to-pink-600",
      bgLight: "bg-purple-50/80 border-purple-200"
    },
    {
      icon: "💼",
      title: "Career Preparation",
      tagline: "Placement Ready",
      desc: "ATS resume scanner, interview simulations, and AI readiness forecasting.",
      color: "from-rose-500 to-red-600",
      bgLight: "bg-rose-50/80 border-rose-200"
    },
  ];

  const features = [
    {
      icon: "🎯",
      title: "Diagnostic Skill Gap Analysis",
      desc: "Identify your conceptual vulnerabilities before exams. Topic-level diagnostic evaluation pinpoints exactly where your understanding drops below 60%."
    },
    {
      icon: "🧠",
      title: "Generative AI Study Roadmaps",
      desc: "No generic timetables. Our AI synthesizes a personalized 7-day remediation plan tailored specifically around your diagnosed weak topics."
    },
    {
      icon: "🤖",
      title: "24/7 Contextual CS AI Tutor",
      desc: "Stuck on concurrency control, dynamic programming, or page replacement algorithms? Ask doubts anytime and receive clear, structured explanations."
    },
    {
      icon: "📊",
      title: "Mastery Analytics & Tracking",
      desc: "Visualize your growth trajectory across DBMS, Operating Systems, and DSA with real-time accuracy charts and topic-wise progress breakdown."
    },
    {
      icon: "📝",
      title: "Curated Technical MCQs",
      desc: "Calibrated question banks designed to match university viva examinations and top-tier tech placement screening standards."
    },
    {
      icon: "⚡",
      title: "Placement-Ready Competency",
      desc: "Bridge the gap between theoretical textbook memorization and the deep conceptual mastery demanded by tech interviews."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Take a Diagnostic Assessment",
      desc: "Attempt high-yield MCQs across Core CS subjects like DBMS, OS, and DSA with instant scoring."
    },
    {
      step: "02",
      title: "Uncover Critical Skill Gaps",
      desc: "Our analytics engine categorizes performance into Strong vs Weak topics (<60% mastery)."
    },
    {
      step: "03",
      title: "Generate AI 7-Day Roadmap",
      desc: "Receive an actionable, day-by-day learning itinerary focusing strictly on fixing your weak areas."
    },
    {
      step: "04",
      title: "Solve Doubts with AI Tutor",
      desc: "Chat with the specialized AI Tutor to clarify complex theories and verify conceptual clarity."
    }
  ];

  const subjects = [
    {
      name: "Data Structures & Algorithms",
      code: "DSA",
      icon: "⚡",
      topics: ["Trees & BST", "Graph Traversals (BFS/DFS)", "Dynamic Programming", "Heaps & Hash Tables"],
      status: "12 Placement MCQs Live"
    },
    {
      name: "Database Management Systems",
      code: "DBMS",
      icon: "🗄️",
      topics: ["Normalization (1NF-BCNF)", "B+ Tree Indexing", "ACID Transactions & 2PL", "SQL Query Optimization"],
      status: "10 Placement MCQs Live"
    },
    {
      name: "Operating Systems",
      code: "OS",
      icon: "💻",
      topics: ["Process Sync & Semaphores", "Banker's Deadlock Algorithm", "Virtual Memory & Paging", "CPU Scheduling"],
      status: "10 Placement MCQs Live"
    },
    {
      name: "Computer Networks",
      code: "CN",
      icon: "🌐",
      topics: ["OSI & TCP/IP Stack", "TCP 3-Way Handshake", "Subnetting & CIDR", "DNS, HTTPS & TLS Handshake"],
      status: "10 Placement MCQs Live"
    },
    {
      name: "OOPs & System Design Concepts",
      code: "OOPS",
      icon: "🧩",
      topics: ["4 Pillars & Polymorphism", "vtable / vptr Mechanics", "SOLID Principles", "Design Patterns (Singleton/Factory)"],
      status: "10 Placement MCQs Live"
    },
    {
      name: "System Design & Scalability",
      code: "SYSTEM_DESIGN",
      icon: "🏗️",
      topics: ["Load Balancing & Sharding", "Redis Distributed Caching", "CAP Theorem & Consistency", "Rate Limiters & Queues"],
      status: "10 Placement MCQs Live"
    },
    {
      name: "Quantitative Aptitude & Reasoning",
      code: "APTITUDE",
      icon: "🧠",
      topics: ["Time, Speed & Distance", "Time & Work / Pipes", "Profit & Loss / Percentages", "Combinatorics & Probability"],
      status: "10 Placement MCQs Live"
    },
    {
      name: "Web Dev & Cloud Fundamentals",
      code: "WEB_DEV",
      icon: "🚀",
      topics: ["JS Event Loop & Closures", "REST API Status & Idempotency", "JWT Authentication Flow", "Docker vs VMs & Git Workflow"],
      status: "10 Placement MCQs Live"
    }
  ];

  const testimonials = [
    {
      name: "Aditya Verma",
      role: "B.Tech CSE, Final Year",
      college: "Tier-1 Technical Campus",
      text: "The Skill Gap Analyzer highlighted that while my SQL syntax was fine, my Normalization and BCNF concepts were under 40%. The 7-day AI roadmap fixed it right before my technical interview!",
      avatar: "👨‍💻"
    },
    {
      name: "Pooja Sharma",
      role: "Software Engineering Student",
      college: "State Engineering College",
      text: "Having an AI tutor specialized in CSE subjects is a game changer. I asked dozens of edge-case questions about Deadlocks and B+ tree node splitting without feeling hesitant.",
      avatar: "👩‍🎓"
    },
    {
      name: "Rohan Nair",
      role: "Campus Placement Placed @ FinTech",
      college: "CS Department",
      text: "The personalized study plan is so much better than generic YouTube playlists. It cut my exam revision time in half because I only spent time on topics I was actually weak in.",
      avatar: "🧑‍💻"
    }
  ];

  return (
    <div className="min-h-screen text-slate-800 overflow-hidden" id="landing-page">
      {/* Hero Section */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          {/* Main Logo & Motto in Hero */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="p-3 rounded-2xl bg-white shadow-xl border border-slate-200 mb-3 hover:scale-105 transition-transform">
              <LearnXIcon size={56} />
            </div>
            <h1
              className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              LEARN<span className="bg-gradient-to-r from-violet-600 via-purple-600 to-sky-500 bg-clip-text text-transparent">X</span>
            </h1>
            <p className="text-sm sm:text-base font-extrabold text-violet-800 tracking-wider uppercase mt-1">
              Learn. Practice. Grow. Succeed.
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 italic mt-0.5">
              More Than Learning, A Brighter You
            </p>
          </div>

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border bg-violet-50 border-violet-200 text-violet-800 shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>LEARN TODAY • GROW TOMORROW • SUCCEED ALWAYS</span>
          </div>

          {/* Headline */}
          <h2
            className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.15] mb-5 text-slate-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Stop Guessing. <br />
            <span className="gradient-text">Close Your Skill Gaps</span> with AI.
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-8 max-w-2xl mx-auto font-normal">
            Diagnostic CSE assessments, exact concept blindspot discovery, personalized 7-day roadmaps, 24/7 AI tutoring, and comprehensive career intelligence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                id="hero-cta-dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold text-white btn-gradient flex items-center justify-center gap-2 shadow-glow-purple"
              >
                <span>⚡ Go to Your Dashboard</span>
                <span>→</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  id="hero-cta-register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold text-white btn-gradient flex items-center justify-center gap-2 shadow-glow-purple"
                >
                  <span>🚀 Get Started Free</span>
                  <span>→</span>
                </Link>
                <Link
                  to="/login"
                  id="hero-cta-login"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 glass-card flex items-center justify-center gap-2 hover:bg-slate-100 text-slate-800 border border-slate-200"
                >
                  <span>Sign In</span>
                </Link>
              </>
            )}
            <a
              href="#interactive-demo"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              See Live Demo Preview ↓
            </a>
          </div>

          {/* 5 Core Pillars Section (from the Official LearnX Poster) */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-4">
              The 5 Pillars of LearnX Intelligence
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {pillars.map((p, i) => (
                <div
                  key={p.title}
                  className={`p-3.5 rounded-2xl border ${p.bgLight} flex flex-col items-center text-center shadow-xs hover:shadow-md transition-all group`}
                >
                  <div className="text-2xl mb-1.5 transform group-hover:scale-110 transition-transform">
                    {p.icon}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {p.title}
                  </h4>
                  <p className="text-[10px] text-slate-600 mt-1 line-clamp-2 leading-tight">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Feature Showcase / Demo Card */}
        <div id="interactive-demo" className="mt-6 max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-widest text-sky-700 font-bold">Interactive Platform Preview</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Experience The LearnX Workflow
            </h2>
          </div>

          <div className="glass-card p-4 sm:p-8 rounded-2xl border border-slate-200 relative overflow-hidden shadow-lg bg-white">
            {/* Interactive Tab Switcher */}
            <div className="flex flex-wrap gap-2 sm:gap-3 p-1.5 rounded-xl bg-slate-100 border border-slate-200 mb-8 max-w-md mx-auto relative z-10">
              <button
                onClick={() => setActiveTab("skillgap")}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  activeTab === "skillgap"
                    ? "bg-violet-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                1. Skill Gap Engine
              </button>
              <button
                onClick={() => setActiveTab("roadmap")}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  activeTab === "roadmap"
                    ? "bg-violet-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                2. AI 7-Day Roadmap
              </button>
              <button
                onClick={() => setActiveTab("tutor")}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  activeTab === "tutor"
                    ? "bg-violet-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                3. AI Tutor Bot
              </button>
            </div>

            {/* Tab 1: Skill Gap Engine Preview */}
            {activeTab === "skillgap" && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>📊 Diagnostic Evaluation:</span>
                      <span className="text-sky-700">DBMS Mastery</span>
                    </h3>
                    <p className="text-xs text-slate-600">Evaluated 10 questions across 2 sub-topics</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200 self-start sm:self-auto">
                    ⚠️ 1 Weak Area Detected (&lt;60%)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Topic 1 - Weak */}
                  <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-900">Normalization (1NF - BCNF)</span>
                      <span className="text-sm font-extrabold text-rose-700">40% Accuracy</span>
                    </div>
                    <div className="w-full bg-rose-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-rose-600 h-3 rounded-full transition-all duration-500" style={{ width: "40%" }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-600 font-medium">
                      <span>2/5 Questions Correct</span>
                      <span className="text-rose-700 font-bold">Needs Remediation</span>
                    </div>
                  </div>

                  {/* Topic 2 - Strong */}
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-900">Indexing & B+ Trees</span>
                      <span className="text-sm font-extrabold text-emerald-700">80% Accuracy</span>
                    </div>
                    <div className="w-full bg-emerald-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-emerald-600 h-3 rounded-full transition-all duration-500" style={{ width: "80%" }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-600 font-medium">
                      <span>4/5 Questions Correct</span>
                      <span className="text-emerald-700 font-bold">Concept Solid</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-sm text-slate-800">
                    <span className="font-bold text-violet-800">AI Recommendation:</span> Focus on Functional Dependencies and 3NF vs BCNF anomalies before proceeding to transaction management.
                  </div>
                  <button
                    onClick={() => setActiveTab("roadmap")}
                    className="whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                  >
                    Generate AI Plan →
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: AI Roadmap Preview */}
            {activeTab === "roadmap" && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>🗺️ Personalized 7-Day Plan:</span>
                      <span className="text-violet-700">Normalization Mastery</span>
                    </h3>
                    <p className="text-xs text-slate-600">Engineered by GPT-4o-mini based on diagnosed weak topics</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-800 border border-violet-200 self-start sm:self-auto">
                    Target: 7 Days • 1.5 hrs/day
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 border border-violet-200 flex items-center justify-center font-bold text-violet-800 text-xs shrink-0 mt-0.5">
                      D1
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">Functional Dependencies & Closure Sets</h4>
                        <span className="text-xs font-semibold text-slate-600">Day 1 • 60 mins</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Review Armstrong axioms, compute attribute closures X+, and determine all candidate keys for given schemas.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 border border-violet-200 flex items-center justify-center font-bold text-violet-800 text-xs shrink-0 mt-0.5">
                      D2
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">1NF, 2NF & Partial Dependencies</h4>
                        <span className="text-xs font-semibold text-slate-600">Day 2 • 75 mins</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Identify prime vs non-prime attributes and decompose tables to eliminate partial dependencies.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center font-bold text-sky-800 text-xs shrink-0 mt-0.5">
                      D3
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-sky-900">3NF vs BCNF Deep Dive & Lossless Joins</h4>
                        <span className="text-xs font-bold text-sky-700">Key Milestone</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Practice checking dependency preservation and lossless join property during BCNF decomposition.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-slate-600 font-medium">
                  <span>+ 4 More Days of Hands-on Decomposition & Re-assessment Practice</span>
                  <button
                    onClick={() => setActiveTab("tutor")}
                    className="text-sky-700 hover:underline font-bold"
                  >
                    Test with AI Tutor →
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: AI Tutor Bot Preview */}
            {activeTab === "tutor" && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>🤖 24/7 AI Tutor:</span>
                      <span className="text-emerald-700">Interactive Doubt Clearing</span>
                    </h3>
                    <p className="text-xs text-slate-600">Prompt-engineered for Computer Science theory and viva clarity</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                    Online & Ready
                  </span>
                </div>

                {/* Sample Question Chips */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-slate-600 font-semibold py-1">Try asking:</span>
                  {demoTutorQuestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setDemoQuestionIndex(idx)}
                      className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                        demoQuestionIndex === idx
                          ? "bg-sky-100 border-sky-300 text-sky-900 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.q.slice(0, 32)}...
                    </button>
                  ))}
                </div>

                {/* Chat Bubble Dialogue */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {/* User query */}
                  <div className="flex items-start gap-2.5 justify-end">
                    <div className="bg-violet-600 text-white text-xs sm:text-sm px-4 py-2.5 rounded-2xl rounded-tr-none max-w-lg font-medium shadow-sm">
                      {demoTutorQuestions[demoQuestionIndex].q}
                    </div>
                    <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      U
                    </div>
                  </div>

                  {/* AI response */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-violet-600 to-sky-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      🤖
                    </div>
                    <div className="bg-white text-slate-800 text-xs sm:text-sm px-4 py-3 rounded-2xl rounded-tl-none max-w-xl border border-slate-200 leading-relaxed shadow-sm">
                      {demoTutorQuestions[demoQuestionIndex].a}
                    </div>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <Link
                    to={user ? "/tutor" : "/register"}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-800"
                  >
                    <span>Launch Full AI Tutor Console</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works (4-Step Pipeline) */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-violet-700 font-bold">Structured Academic Growth</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            How LearnX Powers Your Progress
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            A high-efficiency 4-step loop designed to replace unfocused studying with surgical, high-impact learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-2xl border border-slate-200 hover:border-violet-300 transition-all duration-300 relative group bg-white shadow-sm hover:shadow-md"
            >
              <div className="text-3xl font-extrabold text-violet-600 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {item.step}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Feature Pillars */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200 bg-slate-50/70">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-sky-700 font-bold">Flagship Features</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Engineered for Modern CSE Excellence
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            From university viva preparation to technical interview screening, everything you need is under one unified system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-2xl border border-slate-200 hover:border-sky-300 transition-all duration-300 flex flex-col justify-between bg-white shadow-sm hover:shadow-md"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-2xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-sky-700 font-semibold">
                Included in Core Platform
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subject Curriculum Modules */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-violet-700 font-bold">Curriculum Coverage</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Comprehensive Technical Domains
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Topic-segmented question banks and knowledge rubrics curated for computer science students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map((sub, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-2xl border border-slate-200 flex flex-col justify-between bg-white shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{sub.icon}</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-violet-100 text-violet-800 font-mono font-bold">
                    {sub.code}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{sub.name}</h3>
                <div className="space-y-1.5 mb-6">
                  {sub.topics.map((t, tidx) => (
                    <div key={tidx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Link
                  to={user ? `/test/${sub.code}` : "/register"}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold glass-card hover:bg-violet-600 hover:text-white transition-all flex items-center justify-center gap-1.5 text-slate-800"
                >
                  <span>Practice {sub.code} Diagnostics</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200 bg-slate-50/70">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold">Student Experiences</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Built for Students, Loved by Students
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            See how computer science undergraduates leverage LearnX to boost performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-2xl border border-slate-200 flex flex-col justify-between bg-white shadow-sm"
            >
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                "{item.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center text-xl">
                  {item.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{item.name}</div>
                  <div className="text-xs text-slate-500 font-medium">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Conversion Banner */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <div
          className="rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden border border-violet-200 bg-gradient-to-r from-violet-100 via-purple-50 to-sky-100 shadow-md"
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Ready to Accelerate Your Academic & Placement Journey?
            </h2>
            <p className="text-sm sm:text-base text-slate-700 mb-8 font-medium">
              Join LearnX today and run your first diagnostic test in less than 2 minutes. Free and built for university students.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-white btn-gradient flex items-center justify-center gap-2 shadow-glow-purple"
              >
                <span>{user ? "Open Dashboard" : "Create Free Student Account"}</span>
                <span>→</span>
              </Link>
              <Link
                to={user ? "/test/DBMS" : "/login"}
                className="w-full sm:w-auto px-6 py-4 rounded-xl text-sm font-semibold glass-card hover:bg-slate-200 text-slate-800 transition-colors"
              >
                {user ? "Take DBMS Test" : "Sign In to Existing Account"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="border-t border-slate-200 pt-12 pb-8 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="mb-3">
              <LearnXLogo size="md" showTagline={true} />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed mb-4">
              An AI-Powered Student Growth & Career Intelligence Platform designed to identify conceptual skill gaps, build personalized roadmaps, and assist with 24/7 AI tutoring.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>More Than Learning, A Brighter You</span>
              <span>•</span>
              <span>Learn Today • Grow Tomorrow • Succeed Always</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Platform Navigation</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-medium">
              <li><Link to="/" className="hover:text-slate-900 transition-colors">Home Landing</Link></li>
              <li><Link to="/dashboard" className="hover:text-slate-900 transition-colors">Student Dashboard</Link></li>
              <li><Link to="/career-readiness" className="hover:text-slate-900 transition-colors">Career Engine</Link></li>
              <li><Link to="/placement-readiness" className="hover:text-slate-900 transition-colors">Placement AI</Link></li>
              <li><Link to="/teacher-dashboard" className="hover:text-slate-900 transition-colors">Faculty Portal</Link></li>
              <li><Link to="/offline-learning" className="hover:text-slate-900 transition-colors">Offline Hub</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Core Tech Stack</h4>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2"><span>⚛️</span> React 18 & Vite</li>
              <li className="flex items-center gap-2"><span>🎨</span> Tailwind CSS & Recharts</li>
              <li className="flex items-center gap-2"><span>🟢</span> Node.js & Express</li>
              <li className="flex items-center gap-2"><span>🍃</span> MongoDB & Mongoose</li>
              <li className="flex items-center gap-2"><span>🤖</span> OpenAI GPT-4o-mini API</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 font-medium">
          <div>
            © {new Date().getFullYear()} LearnX Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Personalized Learning</span>
            <span>•</span>
            <span>AI Guidance</span>
            <span>•</span>
            <span>Practice & Tests</span>
            <span>•</span>
            <span>Track Progress</span>
            <span>•</span>
            <span>Career Preparation</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
