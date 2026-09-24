import React, { useEffect, useState } from "react";
import api, { getStudentLearningDashboard } from "../services/api.js";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, RadialBarChart, RadialBar
} from "recharts";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useOffline } from "../context/OfflineContext.jsx";
import { useAppState } from "../context/AppStateContext.jsx";
import RoadmapVisualizer from "../components/RoadmapVisualizer.jsx";
import { LearnXLogo, LearnXIcon } from "../components/LearnXLogo.jsx";
import GamificationWidget from "../components/GamificationWidget.jsx";

const SUBJECTS = [
  { id: "DSA", name: "DSA", fullName: "Data Structures & Algorithms", icon: "⚡", color: "#6366f1", bg: "#eef2ff", totalTopics: 6, tag: "Must Prepare" },
  { id: "DBMS", name: "DBMS", fullName: "Database Systems & SQL", icon: "🗄️", color: "#0ea5e9", bg: "#f0f9ff", totalTopics: 4, tag: "Core Track" },
  { id: "OS", name: "OS", fullName: "Operating Systems", icon: "💻", color: "#10b981", bg: "#ecfdf5", totalTopics: 4, tag: "Core Track" },
  { id: "CN", name: "CN", fullName: "Computer Networks", icon: "🌐", color: "#f59e0b", bg: "#fffbeb", totalTopics: 4, tag: "Networking" },
  { id: "OOPS", name: "OOPs", fullName: "OOPs & SOLID Design", icon: "🧩", color: "#8b5cf6", bg: "#f5f3ff", totalTopics: 4, tag: "Software Eng" },
  { id: "SYSTEM_DESIGN", name: "Sys Design", fullName: "System Design & Architecture", icon: "🏗️", color: "#ec4899", bg: "#fdf2f8", totalTopics: 5, tag: "Top Tier" },
  { id: "APTITUDE", name: "Aptitude", fullName: "Aptitude & Reasoning", icon: "🧠", color: "#14b8a6", bg: "#f0fdfa", totalTopics: 4, tag: "Round 1 OA" },
  { id: "WEB_DEV", name: "Web Dev", fullName: "Web Dev & DevOps", icon: "🚀", color: "#f97316", bg: "#fff7ed", totalTopics: 4, tag: "Full Stack" },
  { id: "MACHINE_LEARNING", name: "AI/ML", fullName: "Machine Learning & AI", icon: "🤖", color: "#a855f7", bg: "#faf5ff", totalTopics: 5, tag: "AI/ML Track" },
];

const QUICK_ACTIONS = [
  { label: "Subjects", icon: "📚", to: "/learn", color: "#6366f1" },
  { label: "Exam Prep", icon: "🎓", to: "/exam-prep", color: "#06b6d4" },
  { label: "Quiz", icon: "📝", to: "/test/DSA", color: "#0ea5e9" },
  { label: "AI Tutor", icon: "🤖", to: "/tutor", color: "#10b981" },
  { label: "Placement", icon: "🚀", to: "/placement-readiness", color: "#f59e0b" },
  { label: "Visualizer", icon: "🎬", to: "/algorithm-visualizer", color: "#ec4899" },
  { label: "Coding Lab", icon: "💻", to: "/coding-lab", color: "#8b5cf6" },
  { label: "Interview", icon: "🎤", to: "/mock-interview", color: "#14b8a6" },
  { label: "Roadmap", icon: "🗺️", to: "/roadmap/DSA", color: "#f97316" },
];

const DAILY_CHALLENGES = [
  {
    subject: "DSA", topic: "Trees & Traversals",
    question: "Which traversal gives a BST's nodes in sorted ascending order?",
    options: ["Pre-order", "In-order", "Post-order", "Level-order"],
    correctIdx: 1,
    explanation: "In-order traversal (Left → Root → Right) naturally yields sorted output in a BST.",
  },
  {
    subject: "DBMS", topic: "Normalization",
    question: "Which normal form requires every determinant to be a candidate key?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    correctIdx: 3,
    explanation: "BCNF is stricter than 3NF — every determinant must be a superkey.",
  },
  {
    subject: "OS", topic: "Deadlocks",
    question: "Which strategy directly violates 'Hold and Wait' condition?",
    options: ["Total ordering", "Request all resources upfront", "Preemption", "Time-sharing"],
    correctIdx: 1,
    explanation: "Requiring all resources at start prevents holding while waiting.",
  },
  {
    subject: "CN", topic: "Transport Layer",
    question: "How many packets in a TCP 3-Way Handshake?",
    options: ["2 (SYN, ACK)", "3 (SYN, SYN-ACK, ACK)", "4 packets", "1 (SYN)"],
    correctIdx: 1,
    explanation: "SYN → SYN-ACK → ACK. Three packets, hence '3-way'.",
  },
  {
    subject: "OOPs", topic: "Polymorphism",
    question: "Runtime polymorphism in C++/Java is resolved via?",
    options: ["Macros", "vtable + vptr", "Bytecode rewriting", "Stack hashing"],
    correctIdx: 1,
    explanation: "Each polymorphic class has a vtable; objects carry a vptr to their class's vtable.",
  },
];

const MODULE_CARDS = [
  {
    icon: "🧠", title: "Skill Graph", subtitle: "CSE Mastery Map",
    desc: "Visualise topic mastery across all 12 CSE domains with real data.",
    to: "/skill-graph", gradient: "from-violet-600 to-purple-700", tag: "Intelligence",
  },
  {
    icon: "🎓", title: "Exam Preparation", subtitle: "PYQs & Timed Tests",
    desc: "Unit-wise notes, previous year questions, timed tests, and instant AI evaluation.",
    to: "/exam-prep", gradient: "from-cyan-500 to-blue-600", tag: "University Prep",
  },
  {
    icon: "📅", title: "AI Study Planner", subtitle: "Dynamic Roadmap",
    desc: "Personalized day-by-day plans that adapt to your pace and exam date.",
    to: "/roadmap/DSA", gradient: "from-sky-500 to-cyan-600", tag: "Planning",
  },
  {
    icon: "🎬", title: "Algorithm Visualizer", subtitle: "15 Algorithms",
    desc: "Bubble Sort to Dijkstra — step-by-step animations with AI explanations.",
    to: "/algorithm-visualizer", gradient: "from-rose-500 to-pink-600", tag: "Visual Learning",
  },
  {
    icon: "💻", title: "AI Coding Lab", subtitle: "6 Languages",
    desc: "Code, run, debug and get AI feedback across C, C++, Java, Python & more.",
    to: "/coding-lab", gradient: "from-emerald-500 to-teal-600", tag: "Practice",
  },
  {
    icon: "🎤", title: "Mock Interview", subtitle: "5-Round AI Sim",
    desc: "Full interview simulation — MCQ, Coding, HR with AI-driven follow-ups.",
    to: "/mock-interview", gradient: "from-amber-500 to-orange-600", tag: "Interview Prep",
  },
  {
    icon: "🚀", title: "Placement Predictor", subtitle: "AI Readiness",
    desc: "Forecast your placement readiness score and high-risk interview zones.",
    to: "/placement-readiness", gradient: "from-indigo-500 to-blue-600", tag: "Career",
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 text-white border border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-slate-300 text-xs font-medium">{label}</p>
        <p className="text-violet-400 font-black text-sm mt-0.5">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOnline } = useOffline();
  const { testVersion, learningVersion, jobReadinessScore } = useAppState();
  const [selectedSubject, setSelectedSubject] = useState(location.state?.subject || "DSA");

  useEffect(() => {
    if (location.state?.subject) setSelectedSubject(location.state.subject);
  }, [location.state]);

  const [skillGap, setSkillGap] = useState(null);
  const [results, setResults] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [learningData, setLearningData] = useState(null);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview | analytics | roadmap

  const [dailyChallengeIdx, setDailyChallengeIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answeredDaily, setAnsweredDaily] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [skillGapRes, resultsRes, learningRes] = await Promise.all([
          api.get(`/tests/skill-gap/${selectedSubject}`).catch(() => ({ data: null })),
          api.get("/tests/results").catch(() => ({ data: [] })),
          getStudentLearningDashboard().catch(() => ({ data: null })),
        ]);
        setSkillGap(skillGapRes.data);
        setResults(resultsRes.data || []);
        if (learningRes?.data) {
          const raw = learningRes.data;
          setLearningData({
            continueLearning: raw.continueLearning || null,
            weakTopics: (raw.weakTopics || []).map((wt) => ({
              ...wt,
              topicTitle: wt.topicTitle || wt.title || wt.topicId,
            })),
            recommendedNext: raw.recommendations?.[0] ? {
              ...raw.recommendations[0],
              topicTitle: raw.recommendations[0].topicTitle || raw.recommendations[0].title,
            } : null,
            summary: {
              totalTopicsRead: raw.stats?.readTopics || raw.stats?.completedTopics || 0,
              totalTopics: raw.stats?.totalTopics || 0,
              totalTopicsCompleted: raw.stats?.completedTopics || 0,
              totalQuizzesTaken: raw.stats?.quizzesTaken || 0,
              strongTopicsCount: raw.stats?.strongTopicsCount || 0,
              needsPracticeCount: raw.stats?.needsPracticeCount || 0,
              weakTopicsCount: raw.stats?.weakTopicsCount || raw.weakTopics?.length || 0,
              overallProgressPercent: raw.stats?.overallProgressPercent || 0,
            },
          });
        }
        try {
          const roadmapRes = await api.get(`/roadmap/${selectedSubject}`);
          setRoadmap(roadmapRes.data);
        } catch {
          setRoadmap(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedSubject, testVersion, learningVersion]);

  const handleGenerateRoadmap = async () => {
    setGeneratingRoadmap(true);
    try {
      const { data } = await api.post("/roadmap/generate", {
        subject: selectedSubject,
        weakTopics: skillGap?.weakTopics || [],
      });
      setRoadmap(data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate roadmap");
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-violet-600/20 border border-violet-500/30 animate-pulse">
            <LearnXIcon size={36} />
          </div>
          <div className="w-8 h-8 mx-auto rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const subjectResults = results.filter((r) => r.subject === selectedSubject);
  const progressData = subjectResults.map((r, i) => ({ name: `T${i + 1}`, score: r.scorePercent }));
  const totalTests = results.length;
  const overallScore = skillGap?.overallScore ?? 0;
  const streakDays = Math.max(3, (totalTests % 7) + 1);
  const studentXP = 850 + totalTests * 120 + overallScore * 5;
  const studentLevel = Math.floor(studentXP / 400) + 1;
  const dailyGoalDone = Math.min(totalTests, 3);
  const currentChallenge = DAILY_CHALLENGES[dailyChallengeIdx % DAILY_CHALLENGES.length];
  const jobReady = typeof jobReadinessScore === "number" && !isNaN(jobReadinessScore) ? jobReadinessScore : 84;

  const progressPercent = learningData?.summary?.overallProgressPercent || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .dash-root { font-family: 'Inter', sans-serif; }
        .dash-heading { font-family: 'Space Grotesk', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.1s; }
        .fade-up-3 { animation-delay: 0.15s; }
        .fade-up-4 { animation-delay: 0.2s; }
        .fade-up-5 { animation-delay: 0.25s; }
        .hero-glow { background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,92,246,0.35) 0%, transparent 70%); }
        .module-card:hover { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
        .module-card { transition: all 0.25s cubic-bezier(.4,0,.2,1); }
        .stat-card:hover { transform: translateY(-2px); }
        .stat-card { transition: all 0.2s ease; }
        .subject-pill:hover { transform: scale(1.03); }
        .subject-pill { transition: all 0.18s ease; }
        .quick-action:hover { transform: translateY(-2px) scale(1.05); }
        .quick-action { transition: all 0.2s ease; }
      `}</style>

      <div className="dash-root max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ═══════════════════════════════════════════════════════
            SECTION 1 — PREMIUM HERO BANNER
        ═══════════════════════════════════════════════════════ */}
        <div className="fade-up relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl" style={{ minHeight: 220 }}>
          {/* Gradient overlays */}
          <div className="absolute inset-0 hero-glow pointer-events-none" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-700/20 blur-[80px] -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-sky-700/15 blur-[60px] -ml-20 -mb-20 pointer-events-none" />

          {/* Decorative grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "40px 40px"
          }} />

          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

              {/* Left: Greeting */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-violet-300 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  LearnX Scholar • Level {studentLevel}
                  <span className="ml-1 px-1.5 py-0.5 bg-violet-500/40 rounded text-[10px] font-bold">✦ Active</span>
                </div>
                <div>
                  <h1 className="dash-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {getGreeting()}, <span className="text-violet-400">{user?.name?.split(" ")[0] || "Scholar"}</span>! 👋
                  </h1>
                  <p className="text-sm text-slate-400 mt-2 max-w-lg leading-relaxed">
                    Your personalized CSE learning command center. Track mastery, practice algorithms, crack interviews.
                  </p>
                </div>

                {/* XP Progress Bar */}
                <div className="max-w-xs space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>Level {studentLevel} → {studentLevel + 1}</span>
                    <span className="text-violet-400 font-bold">{studentXP} XP</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all duration-700"
                      style={{ width: `${(studentXP % 400) / 4}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Stat Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                {[
                  { icon: "🔥", label: "Streak", value: `${streakDays} Days`, color: "text-amber-300", bg: "bg-amber-500/10 border-amber-500/20" },
                  { icon: "⚡", label: "Total XP", value: studentXP.toLocaleString(), color: "text-violet-300", bg: "bg-violet-500/10 border-violet-500/20" },
                  { icon: "💼", label: "Job Ready", value: `${jobReady}%`, color: "text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/20" },
                  { icon: "🎯", label: "Daily Goal", value: `${dailyGoalDone}/3`, color: "text-sky-300", bg: "bg-sky-500/10 border-sky-500/20" },
                ].map((s) => (
                  <div key={s.label} className={`stat-card p-4 rounded-2xl border backdrop-blur-sm ${s.bg} flex items-center gap-3`}>
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${s.color}`}>{s.label}</p>
                      <p className="text-base font-extrabold text-white leading-tight mt-0.5">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Row */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Quick Access</p>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {QUICK_ACTIONS.map((qa) => (
                  <Link
                    key={qa.label}
                    to={qa.to}
                    className="quick-action flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/12 border border-white/8 text-center"
                  >
                    <span className="text-xl">{qa.icon}</span>
                    <span className="text-[10px] font-semibold text-slate-300 leading-none">{qa.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 2 — LEARNING SUMMARY STATS (4 KPI Cards)
        ═══════════════════════════════════════════════════════ */}
        <div className="fade-up fade-up-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: "📖", label: "Topics Completed",
              value: learningData?.summary?.totalTopicsCompleted || 0,
              sub: `of ${learningData?.summary?.totalTopics || 0} total`,
              color: "#6366f1", light: "#eef2ff", border: "#c7d2fe"
            },
            {
              icon: "📝", label: "Quizzes Taken",
              value: learningData?.summary?.totalQuizzesTaken || totalTests,
              sub: "All subjects",
              color: "#0ea5e9", light: "#f0f9ff", border: "#bae6fd"
            },
            {
              icon: "💪", label: "Strong Topics",
              value: learningData?.summary?.strongTopicsCount || skillGap?.strongTopics?.length || 0,
              sub: "Mastered concepts",
              color: "#10b981", light: "#ecfdf5", border: "#a7f3d0"
            },
            {
              icon: "⚠️", label: "Need Practice",
              value: learningData?.summary?.weakTopicsCount || skillGap?.weakTopics?.length || 0,
              sub: "Flagged topics",
              color: "#f59e0b", light: "#fffbeb", border: "#fde68a"
            },
          ].map((kpi, i) => (
            <div
              key={kpi.label}
              className="stat-card bg-white rounded-2xl border p-5 shadow-sm"
              style={{ borderColor: kpi.border }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: kpi.light }}>
                  {kpi.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{kpi.label}</span>
              </div>
              <p className="dash-heading text-3xl font-black" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="text-[11px] text-slate-400 mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 3 — CONTINUE LEARNING + WEAK TOPICS
        ═══════════════════════════════════════════════════════ */}
        <div className="fade-up fade-up-2 grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Continue Learning — 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-indigo-100 shadow-sm p-6 sm:p-7 flex flex-col justify-between gap-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700">
                  📖 Continue Learning
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {learningData?.continueLearning?.subjectName || "Recommended"}
                </span>
              </div>

              <h2 className="dash-heading text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
                {learningData?.continueLearning?.topicTitle || learningData?.recommendedNext?.topicTitle || "Arrays & Dynamic Memory"}
              </h2>
              <p className="text-sm text-slate-500 mb-5">
                {learningData?.continueLearning
                  ? `${learningData.continueLearning.unitTitle || "Unit 1"} • ${learningData.continueLearning.chapterTitle || "Chapter 1"}`
                  : "Master high-frequency concepts with structured theory, visualizers & quizzes."}
              </p>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
                  <span>Overall Progress</span>
                  <span className="text-indigo-600 font-bold">{progressPercent}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "⚡", label: "Est. Time", val: "~20 min", color: "indigo" },
                  { icon: "🎯", label: "Coverage", val: "Theory + Lab", color: "sky" },
                  { icon: "🏆", label: "Quiz", val: "5 MCQs", color: "emerald" },
                ].map((m) => (
                  <div key={m.label} className={`p-3 rounded-2xl bg-${m.color}-50/70 border border-${m.color}-100 flex items-center gap-2`}>
                    <span className="text-base">{m.icon}</span>
                    <div>
                      <p className={`text-[10px] font-bold uppercase text-${m.color}-700`}>{m.label}</p>
                      <p className="text-xs font-semibold text-slate-700">{m.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
              {(() => {
                const sub = (learningData?.continueLearning?.subjectId || learningData?.recommendedNext?.subjectId || "dsa").toLowerCase();
                const topic = learningData?.continueLearning?.topicId || learningData?.recommendedNext?.topicId || "dsa-u1-c1-t1";
                const title = learningData?.continueLearning?.topicTitle || learningData?.recommendedNext?.topicTitle || "Data Structures";
                return (
                  <>
                    <Link to={`/learn/${sub}/${topic}`} className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all inline-flex items-center gap-2">
                      📖 Resume Session →
                    </Link>
                    <Link to={`/learn/${sub}/${topic}/quiz`} className="px-4 py-2.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all">
                      📝 Topic Quiz
                    </Link>
                    <Link to={`/tutor?topic=${encodeURIComponent(title)}`} className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all">
                      🤖 Ask AI
                    </Link>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Weak Topics — 1/3 width */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">Weak Topics</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {learningData?.weakTopics?.length || 0} flagged
              </span>
            </div>

            <div className="flex-1">
              {learningData?.weakTopics?.length > 0 ? (
                <div className="space-y-3">
                  {learningData.weakTopics.slice(0, 4).map((wt) => {
                    const score = wt.masteryPercentage || wt.lastAttemptScore || 0;
                    const barColor = score < 40 ? "#ef4444" : score < 60 ? "#f59e0b" : "#10b981";
                    return (
                      <div key={wt.topicId} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-bold text-slate-900 truncate flex-1">{wt.topicTitle}</p>
                          <span className="ml-2 text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 shrink-0">{score}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                          <div className="h-full rounded-full" style={{ width: `${score}%`, background: barColor }} />
                        </div>
                        <div className="flex gap-2 text-[11px] font-bold">
                          <Link to={`/learn/${(wt.subjectId || "dsa").toLowerCase()}/${wt.topicId}`} className="text-indigo-600 hover:underline">Revise</Link>
                          <span className="text-slate-300">•</span>
                          <Link to={`/learn/${(wt.subjectId || "dsa").toLowerCase()}/${wt.topicId}/quiz`} className="text-violet-600 hover:underline">Quiz</Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-xl mb-3 border border-emerald-100">✓</div>
                  <p className="font-bold text-slate-700 text-sm">No Weak Topics!</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[180px] mx-auto">Take a diagnostic quiz to pinpoint gaps.</p>
                </div>
              )}
            </div>

            <Link to="/learn" className="text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-3 border-t border-slate-100 block">
              Browse All Subjects →
            </Link>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 4 — MODULE CARDS GRID (6 Premium Cards)
        ═══════════════════════════════════════════════════════ */}
        <div className="fade-up fade-up-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="dash-heading text-xl font-extrabold text-slate-900">Learning Modules</h2>
              <p className="text-xs text-slate-500 mt-0.5">Your full CSE preparation toolkit</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULE_CARDS.map((card) => (
              <Link
                key={card.title}
                to={card.to}
                className="module-card group bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:border-transparent"
              >
                {/* Top gradient strip */}
                <div className={`h-1.5 bg-gradient-to-r ${card.gradient}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-2xl shadow-sm`}>
                      {card.icon}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                      {card.tag}
                    </span>
                  </div>
                  <h3 className="dash-heading text-base font-extrabold text-slate-900 group-hover:text-slate-700">{card.title}</h3>
                  <p className="text-[11px] text-violet-600 font-bold mb-2">{card.subtitle}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                  <div className="mt-4 flex items-center text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                    Open Module <span className="ml-1 group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 5 — SUBJECT SELECTOR + DIAGNOSTICS
        ═══════════════════════════════════════════════════════ */}
        <div className="fade-up fade-up-4 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="dash-heading text-lg font-extrabold text-slate-900">Diagnostic Tracker</h2>
                <p className="text-xs text-slate-500 mt-0.5">Select a subject to view scores & analytics</p>
              </div>
              <Link
                to={`/test/${selectedSubject}`}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all inline-flex items-center gap-1.5"
              >
                📝 Take {selectedSubject} Test →
              </Link>
            </div>
          </div>

          {/* Subject Pills */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((sub) => {
                const isSelected = sub.id === selectedSubject;
                const subTests = results.filter((r) => r.subject === sub.id);
                const latest = subTests.length > 0 ? subTests[subTests.length - 1].scorePercent : null;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubject(sub.id)}
                    className={`subject-pill flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                      isSelected
                        ? "text-white shadow-md"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                    style={isSelected ? { background: sub.color, borderColor: sub.color } : {}}
                  >
                    <span>{sub.icon}</span>
                    <span>{sub.name}</span>
                    {latest !== null && (
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${isSelected ? "bg-white/20 text-white" : latest >= 60 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                        {latest}%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Analytics */}
          <div className="p-6">
            {!skillGap ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-3xl mb-4 border border-violet-100">🎯</div>
                <h3 className="dash-heading text-lg font-bold text-slate-900 mb-2">No {selectedSubject} data yet</h3>
                <p className="text-sm text-slate-500 mb-5 max-w-sm mx-auto">Take your first diagnostic test to unlock analytics, skill radar and AI study roadmap.</p>
                <Link to={`/test/${selectedSubject}`} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all">
                  Start {selectedSubject} Test →
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stat Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Overall Mastery", value: `${overallScore}%`, icon: "🎯", color: overallScore >= 70 ? "#059669" : overallScore >= 40 ? "#7c3aed" : "#dc2626" },
                    { label: "Tests Logged", value: subjectResults.length, icon: "📝", color: "#6366f1" },
                    { label: "Weak Topics", value: skillGap.weakTopics?.length ?? 0, icon: "⚠️", color: "#dc2626" },
                    { label: "Mastered", value: skillGap.strongTopics?.length ?? 0, icon: "✅", color: "#059669" },
                  ].map((s) => (
                    <div key={s.label} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{s.icon}</span>
                        <span className="text-[10px] font-bold uppercase text-slate-400">{s.label}</span>
                      </div>
                      <p className="dash-heading text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <h3 className="dash-heading text-sm font-extrabold text-slate-900 mb-1">Topic-Wise Accuracy</h3>
                    <p className="text-[11px] text-slate-400 mb-4">Benchmark: 60%</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={skillGap.topicScores}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="topic" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="percent" fill="#6366f1" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <h3 className="dash-heading text-sm font-extrabold text-slate-900 mb-1">Score Progression</h3>
                    <p className="text-[11px] text-slate-400 mb-4">{progressData.length} attempts logged</p>
                    {progressData.length > 1 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={progressData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Line type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={3} dot={{ fill: "#7c3aed", r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[200px] flex flex-col items-center justify-center text-center">
                        <div className="text-4xl mb-3">📈</div>
                        <p className="text-xs text-slate-400 max-w-[200px]">Take 2+ tests to see your progression graph.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Roadmap Strip */}
                <div className="p-5 rounded-2xl border border-violet-100 bg-violet-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span>🗺️</span>
                      <span className="text-sm font-extrabold text-slate-900">7-Day AI Roadmap — {selectedSubject}</span>
                    </div>
                    <Link to={`/roadmap/${selectedSubject}`} className="px-3 py-1.5 rounded-xl text-xs font-bold text-violet-700 bg-violet-100 hover:bg-violet-200 border border-violet-200 transition-colors">
                      Full View →
                    </Link>
                  </div>
                  {roadmap ? (
                    <RoadmapVisualizer roadmap={roadmap} onRoadmapUpdated={(u) => setRoadmap(u)} onRegenerate={skillGap.weakTopics?.length > 0 ? handleGenerateRoadmap : null} generating={generatingRoadmap} />
                  ) : generatingRoadmap ? (
                    <div className="text-center py-8 space-y-2">
                      <div className="w-10 h-10 mx-auto rounded-xl bg-violet-100 flex items-center justify-center text-xl animate-bounce">⚡</div>
                      <p className="text-sm font-bold text-slate-900">Generating your roadmap...</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-3">
                      <div className="w-10 h-10 mx-auto rounded-xl bg-violet-100 flex items-center justify-center text-xl">🗺️</div>
                      <p className="text-sm font-bold text-slate-900">Personalized 7-Day Study Roadmap</p>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">AI-calibrated day-by-day blueprint based on your {selectedSubject} weak topics.</p>
                      <button onClick={handleGenerateRoadmap} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-sm transition-all">
                        ✨ Generate AI Roadmap
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 6 — PROBLEM OF THE DAY + FEATURE CARDS
        ═══════════════════════════════════════════════════════ */}
        <div className="fade-up fade-up-5 grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Problem of the Day — 2/5 */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-base">💡</div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Problem of the Day</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">+50 XP</span>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">{currentChallenge.subject}</span>
                <button
                  onClick={() => { setDailyChallengeIdx(p => p + 1); setSelectedOption(null); setAnsweredDaily(false); setShowExplanation(false); }}
                  className="text-violet-600 hover:text-violet-800 font-bold transition-colors"
                >↻ Next</button>
              </div>
              <p className="text-xs font-bold text-slate-800 leading-relaxed">{currentChallenge.question}</p>
              <div className="space-y-2">
                {currentChallenge.options.map((opt, oIdx) => {
                  let cls = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300";
                  if (answeredDaily) {
                    if (oIdx === currentChallenge.correctIdx) cls = "bg-emerald-50 border-emerald-400 text-emerald-800";
                    else if (selectedOption === oIdx) cls = "bg-rose-50 border-rose-300 text-rose-800";
                  }
                  return (
                    <button
                      key={opt} onClick={() => !answeredDaily && (setSelectedOption(oIdx), setAnsweredDaily(true))}
                      disabled={answeredDaily}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs border font-medium transition-all ${cls}`}
                    >
                      <span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + oIdx)}.</span>{opt}
                    </button>
                  );
                })}
              </div>
              {answeredDaily && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs animate-fade-in">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold ${selectedOption === currentChallenge.correctIdx ? "text-emerald-700" : "text-rose-700"}`}>
                      {selectedOption === currentChallenge.correctIdx ? "🎉 Correct! +50 XP" : "❌ Incorrect"}
                    </span>
                    <button onClick={() => setShowExplanation(p => !p)} className="text-violet-700 underline font-semibold">
                      {showExplanation ? "Hide" : "Why?"}
                    </button>
                  </div>
                  {showExplanation && <p className="text-[11px] text-slate-600 leading-relaxed mt-1">{currentChallenge.explanation}</p>}
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-100">Daily reset at midnight • Streak active</p>
          </div>

          {/* Feature Cards — 3/5 */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: "🎯", title: "Placement Predictor", desc: "Forecast readiness score & high-risk interview zones.",
                to: "/placement-readiness", cta: "Open Predictor", gradient: "from-violet-600 to-purple-600", ctaCls: "bg-violet-600 hover:bg-violet-700 text-white"
              },
              {
                icon: "💼", title: "Career Readiness", desc: "ATS resume checker, project blueprints & interview prep.",
                to: "/career-readiness", cta: "Career Hub", gradient: "from-sky-500 to-cyan-600", ctaCls: "bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200"
              },
              {
                icon: "📥", title: "Offline Learning", desc: "Download packs & study without internet connection.",
                to: "/offline-learning", cta: "Offline Hub", gradient: "from-amber-500 to-orange-500", ctaCls: "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200"
              },
            ].map((fc) => (
              <div key={fc.title} className="module-card bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className={`h-1.5 bg-gradient-to-r ${fc.gradient}`} />
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${fc.gradient} flex items-center justify-center text-xl shadow-sm`}>
                    {fc.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="dash-heading text-sm font-extrabold text-slate-900">{fc.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{fc.desc}</p>
                  </div>
                  <Link to={fc.to} className={`w-full text-center px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${fc.ctaCls}`}>
                    {fc.cta} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 7 — GAMIFICATION WIDGET
        ═══════════════════════════════════════════════════════ */}
        <GamificationWidget xp={studentXP} streak={streakDays} />

      </div>
    </div>
  );
};

export default Dashboard;
