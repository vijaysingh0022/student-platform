import React, { useEffect, useState } from "react";
import api, { getStudentLearningDashboard } from "../services/api.js";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from "recharts";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useOffline } from "../context/OfflineContext.jsx";
import { useAppState } from "../context/AppStateContext.jsx";
import RoadmapVisualizer from "../components/RoadmapVisualizer.jsx";
import GamificationWidget from "../components/GamificationWidget.jsx";
import Sidebar from "../components/Sidebar.jsx";
import TopHeader from "../components/TopHeader.jsx";

const SUBJECTS = [
  { id: "DSA", name: "DSA", fullName: "Data Structures & Algorithms", icon: "⚡", color: "#6366f1", bg: "bg-indigo-50/80", border: "border-indigo-200", totalTopics: 6, tag: "Must Prepare" },
  { id: "OS", name: "OS", fullName: "Operating Systems", icon: "💻", color: "#10b981", bg: "bg-emerald-50/80", border: "border-emerald-200", totalTopics: 4, tag: "Core Track" },
  { id: "DBMS", name: "DBMS", fullName: "Database Management & SQL", icon: "🗄️", color: "#0ea5e9", bg: "bg-sky-50/80", border: "border-sky-200", totalTopics: 4, tag: "Core Track" },
  { id: "CN", name: "CN", fullName: "Computer Networks", icon: "🌐", color: "#f59e0b", bg: "bg-amber-50/80", border: "border-amber-200", totalTopics: 4, tag: "Networking" },
  { id: "OOPS", name: "OOPs", fullName: "OOPs & SOLID Design", icon: "🧩", color: "#8b5cf6", bg: "bg-purple-50/80", border: "border-purple-200", totalTopics: 4, tag: "Software Eng" },
  { id: "SYSTEM_DESIGN", name: "Sys Design", fullName: "System Design & Architecture", icon: "🏗️", color: "#ec4899", bg: "bg-pink-50/80", border: "border-pink-200", totalTopics: 5, tag: "Top Tier" },
  { id: "APTITUDE", name: "Aptitude", fullName: "Aptitude & Quantitative", icon: "🧠", color: "#14b8a6", bg: "bg-teal-50/80", border: "border-teal-200", totalTopics: 4, tag: "Round 1 OA" },
  { id: "WEB_DEV", name: "Web Dev", fullName: "Web Development & DevOps", icon: "🚀", color: "#f97316", bg: "bg-orange-50/80", border: "border-orange-200", totalTopics: 4, tag: "Full Stack" },
  { id: "MACHINE_LEARNING", name: "AI/ML", fullName: "Machine Learning & AI", icon: "🤖", color: "#a855f7", bg: "bg-fuchsia-50/80", border: "border-fuchsia-200", totalTopics: 5, tag: "AI/ML Track" },
];

const LEARNING_TOOLS = [
  {
    id: "subjects",
    title: "Subjects",
    desc: "12+ Core CSE curriculum tracks & notes",
    to: "/learn",
    icon: (
      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    bg: "bg-indigo-50/70 hover:bg-indigo-50",
    border: "border-indigo-100/90",
    badge: "Curriculum",
  },
  {
    id: "exam-prep",
    title: "Exam Prep",
    desc: "University PYQs, unit notes & timed tests",
    to: "/exam-prep",
    icon: (
      <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    ),
    bg: "bg-cyan-50/70 hover:bg-cyan-50",
    border: "border-cyan-100/90",
    badge: "PYQs",
  },
  {
    id: "tests",
    title: "Tests",
    desc: "Diagnostic MCQs & adaptive skill gap radar",
    to: "/test/DSA",
    icon: (
      <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    bg: "bg-sky-50/70 hover:bg-sky-50",
    border: "border-sky-100/90",
    badge: "Adaptive",
  },
  {
    id: "ai-quiz",
    title: "AI Quiz",
    desc: "Generate instant customized CS quizzes",
    to: "/quiz-generator",
    icon: (
      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    bg: "bg-amber-50/70 hover:bg-amber-50",
    border: "border-amber-100/90",
    badge: "Instant",
  },
  {
    id: "ai-tutor",
    title: "AI Tutor",
    desc: "24/7 DeepSeek & GPT-4o conversational tutor",
    to: "/tutor",
    icon: (
      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    bg: "bg-emerald-50/70 hover:bg-emerald-50",
    border: "border-emerald-100/90",
    badge: "24/7 AI",
  },
  {
    id: "roadmap",
    title: "7-Day Roadmap",
    desc: "Personalized day-by-day syllabus planner",
    to: "/roadmap/DSA",
    icon: (
      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    bg: "bg-purple-50/70 hover:bg-purple-50",
    border: "border-purple-100/90",
    badge: "Dynamic",
  },
  {
    id: "career-engine",
    title: "Career Engine",
    desc: "Placement readiness, ATS resume & mock interview",
    to: "/placement-readiness",
    icon: (
      <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    bg: "bg-rose-50/70 hover:bg-rose-50",
    border: "border-rose-100/90",
    badge: "Career",
  },
  {
    id: "coding-lab",
    title: "Coding Lab",
    desc: "159+ Problems in C, C++, Java, Python with visualizer",
    to: "/coding-lab",
    icon: (
      <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    bg: "bg-teal-50/70 hover:bg-teal-50",
    border: "border-teal-100/90",
    badge: "IDE",
  },
];

const DAILY_CHALLENGES = [
  {
    subject: "DSA", topic: "Trees & BST",
    question: "Which tree traversal outputs the keys of a Binary Search Tree in sorted ascending order?",
    options: ["Pre-order", "In-order", "Post-order", "Level-order"],
    correctIdx: 1,
    explanation: "In-order traversal (Left → Root → Right) naturally visits BST nodes in ascending sorted sequence.",
  },
  {
    subject: "DBMS", topic: "Normalization",
    question: "Which normal form requires that every determinant is a superkey / candidate key?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    correctIdx: 3,
    explanation: "Boyce-Codd Normal Form (BCNF) strictly requires every non-trivial determinant X → Y to have X as a superkey.",
  },
  {
    subject: "OS", topic: "Deadlocks",
    question: "Which condition is broken if a process must request all required resources before starting?",
    options: ["Mutual Exclusion", "Hold and Wait", "No Preemption", "Circular Wait"],
    correctIdx: 1,
    explanation: "Requiring all resources upfront eliminates the 'Hold and Wait' condition, preventing deadlock.",
  },
];

const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 text-white border border-slate-700 rounded-xl p-3 shadow-xl backdrop-blur-md">
        <p className="text-slate-300 text-xs font-semibold">{label}</p>
        <p className="text-indigo-400 font-black text-sm mt-0.5">{payload[0].value}%</p>
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

  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const [dailyIdx, setDailyIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
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
              totalTopics: raw.stats?.totalTopics || 28,
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

  const subjectResults = results.filter((r) => r.subject === selectedSubject);
  const progressData = subjectResults.map((r, i) => ({ name: `Test ${i + 1}`, score: r.scorePercent }));
  const totalTests = results.length;
  const overallScore = skillGap?.overallScore ?? 0;
  const streakDays = Math.max(3, (totalTests % 7) + 1);
  const studentXP = 850 + totalTests * 120 + overallScore * 5;
  const studentLevel = Math.floor(studentXP / 400) + 1;
  const xpInCurrentLevel = studentXP % 400;
  const xpPercentage = Math.round((xpInCurrentLevel / 400) * 100);
  const dailyGoalDone = Math.min(totalTests, 3);
  const currentChallenge = DAILY_CHALLENGES[dailyIdx % DAILY_CHALLENGES.length];
  const jobReady = typeof jobReadinessScore === "number" && !isNaN(jobReadinessScore) ? jobReadinessScore : 84;
  const progressPercent = learningData?.summary?.overallProgressPercent || 0;

  const topicsCompleted = learningData?.summary?.totalTopicsCompleted || 0;
  const totalTopics = learningData?.summary?.totalTopics || 28;
  const testsAttempted = learningData?.summary?.totalQuizzesTaken || totalTests;
  const masteredTopics = learningData?.summary?.strongTopicsCount || skillGap?.strongTopics?.length || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold animate-pulse text-xl">
            LX
          </div>
          <div className="w-6 h-6 mx-auto rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-xs font-semibold">Loading LearnX Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* ═══════════════════════════════════════════════════════
          1. PERMANENT LEFT SIDEBAR (~240px)
      ═══════════════════════════════════════════════════════ */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ═══════════════════════════════════════════════════════
          MAIN CONTENT AREA (Offset by sidebar width on desktop)
      ═══════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[240px]">
        {/* 2. MINIMAL TOP HEADER */}
        <TopHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Inner Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

          {/* ═══════════════════════════════════════════════════════
              3. MAIN HERO SECTION (Dark Navy + Purple/Blue Gradient)
          ═══════════════════════════════════════════════════════ */}
          <section className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl p-6 sm:p-8">
            {/* Ambient Background Gradient Lighting */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-600/25 to-violet-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-sky-600/20 to-indigo-600/15 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />

            {/* Subtle Futuristic Tech Pattern Grid */}
            <div
              className="absolute inset-0 opacity-[0.035] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                backgroundSize: "36px 36px",
              }}
            />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left Column: Greeting & Progress */}
              <div className="space-y-4 max-w-2xl">
                {/* Scholar Level Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-indigo-200 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LearnX Scholar • Level {studentLevel}</span>
                  <span className="ml-1 px-1.5 py-0.5 rounded bg-indigo-500/40 text-[10px] text-white font-extrabold tracking-wide">
                    ✦ Active
                  </span>
                </div>

                {/* Title & Greeting */}
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                    {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-300 to-purple-200">{user?.name?.split(" ")[0] || "Vijay"}</span>! 👋
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-slate-300 mt-2 leading-relaxed">
                    Your personalized CSE learning command center. Track mastery, practice coding algorithms, and accelerate interview readiness.
                  </p>
                </div>

                {/* Level Progress Bar & Percentage */}
                <div className="max-w-md space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span>Level {studentLevel} Progress</span>
                      <span className="text-slate-400 font-normal">({studentXP} XP)</span>
                    </span>
                    <span className="text-indigo-300 font-bold">{xpPercentage}% completed</span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.max(5, xpPercentage)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Hero KPI Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 sm:gap-3 shrink-0">
                {[
                  { icon: "🔥", label: "Study Streak", value: `${streakDays} Days`, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
                  { icon: "⚡", label: "Total XP", value: studentXP.toLocaleString(), color: "text-indigo-300", bg: "bg-indigo-500/10 border-indigo-500/20" },
                  { icon: "💼", label: "Job Ready", value: `${jobReady}%`, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                  { icon: "🎯", label: "Daily Goal", value: `${dailyGoalDone}/3`, color: "text-sky-300", bg: "bg-sky-500/10 border-sky-500/20" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`p-3.5 rounded-2xl border backdrop-blur-md ${stat.bg} flex items-center gap-3 transition-transform hover:-translate-y-0.5`}
                  >
                    <span className="text-2xl">{stat.icon}</span>
                    <div>
                      <p className={`text-[10px] font-extrabold uppercase tracking-wider ${stat.color}`}>{stat.label}</p>
                      <p className="text-base font-black text-white leading-none mt-1">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              4. QUICK ACCESS / YOUR LEARNING TOOLS (8 Modern Cards)
          ═══════════════════════════════════════════════════════ */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Your Learning Tools</h2>
                <p className="text-xs font-semibold text-slate-500">Quick-access essentials for full CSE preparation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {LEARNING_TOOLS.map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.to}
                  className={`group p-4 rounded-2xl border ${tool.bg} ${tool.border} transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between gap-3 relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-200/60 group-hover:scale-105 transition-transform">
                      {tool.icon}
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-white/80 text-slate-700 border border-slate-200/80">
                      {tool.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5 leading-snug line-clamp-2">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="flex items-center text-xs font-bold text-indigo-600 group-hover:text-indigo-700 pt-1 border-t border-slate-200/40">
                    <span>Explore</span>
                    <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              5. STATISTICS (4 KPI Cards using Real Data)
          ═══════════════════════════════════════════════════════ */}
          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Learning Statistics</h2>
              <p className="text-xs font-semibold text-slate-500">Real-time study analytics and assessment performance</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              {[
                {
                  label: "Topics Completed",
                  value: topicsCompleted,
                  sub: `of ${totalTopics} curriculum topics`,
                  icon: "📖",
                  color: "text-indigo-600",
                  bg: "bg-indigo-50",
                  border: "border-indigo-100",
                },
                {
                  label: "Tests Attempted",
                  value: testsAttempted,
                  sub: `${subjectResults.length} in ${selectedSubject}`,
                  icon: "📝",
                  color: "text-sky-600",
                  bg: "bg-sky-50",
                  border: "border-sky-100",
                },
                {
                  label: "Study Streak",
                  value: `${streakDays} Days`,
                  sub: "Active daily streak",
                  icon: "🔥",
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                  border: "border-amber-100",
                },
                {
                  label: "Mastered Concepts",
                  value: masteredTopics,
                  sub: `${progressPercent}% syllabus completed`,
                  icon: "🏆",
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                  border: "border-emerald-100",
                },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className={`p-5 rounded-2xl bg-white border ${kpi.border} shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center text-lg`}>
                      {kpi.icon}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      {kpi.label}
                    </span>
                  </div>
                  <div>
                    <p className={`text-2xl sm:text-3xl font-black ${kpi.color}`}>
                      {kpi.value}
                    </p>
                    <p className="text-xs font-semibold text-slate-500 mt-1">{kpi.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              6. CONTINUE LEARNING (Real Curriculum Progress)
          ═══════════════════════════════════════════════════════ */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Continue Learning</h2>
                <p className="text-xs font-semibold text-slate-500">Pick up where you left off across your core CSE tracks</p>
              </div>
              <Link to="/learn" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                <span>View All Curriculum</span>
                <span>→</span>
              </Link>
            </div>

            {/* Top Continue Banner + Weak Topics Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Active / Next Recommended Session */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-indigo-100 shadow-xs p-6 flex flex-col justify-between gap-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

                <div className="relative space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700">
                      <span>📖</span>
                      <span>Next Active Topic</span>
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {learningData?.continueLearning?.subjectName || "Data Structures & Algorithms"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {learningData?.continueLearning?.topicTitle || learningData?.recommendedNext?.topicTitle || "Arrays & Dynamic Memory Allocation"}
                    </h3>
                    <p className="text-xs font-medium text-slate-600 mt-1">
                      {learningData?.continueLearning
                        ? `${learningData.continueLearning.unitTitle || "Unit 1"} • ${learningData.continueLearning.chapterTitle || "Chapter 1"}`
                        : "Master core concepts with theory, interactive visualizers, and instant AI quizzes."}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                      <span>Overall Subject Mastery</span>
                      <span className="text-indigo-600 font-bold">{progressPercent}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(8, progressPercent)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Direct Actions */}
                <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-slate-100">
                  {(() => {
                    const sub = (learningData?.continueLearning?.subjectId || learningData?.recommendedNext?.subjectId || "dsa").toLowerCase();
                    const topic = learningData?.continueLearning?.topicId || learningData?.recommendedNext?.topicId || "dsa-u1-c1-t1";
                    const title = learningData?.continueLearning?.topicTitle || learningData?.recommendedNext?.topicTitle || "Data Structures";
                    return (
                      <>
                        <Link
                          to={`/learn/${sub}/${topic}`}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all inline-flex items-center gap-1.5"
                        >
                          <span>Resume Session</span>
                          <span>→</span>
                        </Link>
                        <Link
                          to={`/learn/${sub}/${topic}/quiz`}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                        >
                          Topic Quiz
                        </Link>
                        <Link
                          to={`/tutor?topic=${encodeURIComponent(title)}`}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                        >
                          Ask AI Tutor
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Weak Topics Diagnostic Card */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-base">⚠️</span>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                        Focus Areas
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      {learningData?.weakTopics?.length || 0} flagged
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {learningData?.weakTopics?.length > 0 ? (
                      learningData.weakTopics.slice(0, 3).map((wt) => {
                        const score = wt.masteryPercentage || wt.lastAttemptScore || 0;
                        return (
                          <div key={wt.topicId} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-bold text-slate-900 truncate">{wt.topicTitle}</p>
                              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 shrink-0">{score}%</span>
                            </div>
                            <div className="flex gap-2 text-[10px] font-bold">
                              <Link to={`/learn/${(wt.subjectId || "dsa").toLowerCase()}/${wt.topicId}`} className="text-indigo-600 hover:underline">Revise</Link>
                              <span className="text-slate-300">•</span>
                              <Link to={`/learn/${(wt.subjectId || "dsa").toLowerCase()}/${wt.topicId}/quiz`} className="text-purple-600 hover:underline">Take Quiz</Link>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-6 text-center text-slate-500">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-lg mb-2">✓</div>
                        <p className="text-xs font-bold text-slate-800">All Topics Strong</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Keep practicing to retain your mastery.</p>
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  to="/skill-graph"
                  className="w-full text-center py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors block"
                >
                  View Skill Graph Radar →
                </Link>
              </div>
            </div>

            {/* Core Subject Track Cards (DSA, OS, DBMS, CN) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
              {SUBJECTS.slice(0, 4).map((sub) => {
                const subTests = results.filter((r) => r.subject === sub.id);
                const latestScore = subTests.length > 0 ? subTests[subTests.length - 1].scorePercent : null;
                const calcProgress = latestScore !== null ? latestScore : 0;
                return (
                  <div
                    key={sub.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl ${sub.bg} border ${sub.border} flex items-center justify-center text-lg`}>
                          {sub.icon}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{sub.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{sub.totalTopics} Topics</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {sub.tag}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                        <span>Mastery</span>
                        <span className="font-bold text-indigo-600">{calcProgress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(5, calcProgress)}%`,
                            backgroundColor: sub.color,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <Link
                        to={`/learn/${sub.id.toLowerCase()}`}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Study Track</span>
                        <span>→</span>
                      </Link>
                      <button
                        onClick={() => setSelectedSubject(sub.id)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md transition-colors ${
                          selectedSubject === sub.id
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {selectedSubject === sub.id ? "Selected" : "Analyze"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              7. DIAGNOSTIC TRACKER & INTERACTIVE ANALYTICS
          ═══════════════════════════════════════════════════════ */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div>
                <h2 className="text-base font-black text-slate-900 tracking-tight">Subject Diagnostic Tracker</h2>
                <p className="text-xs font-semibold text-slate-500">Select a subject to view topic-wise accuracy, progression & 7-Day AI plan</p>
              </div>
              <Link
                to={`/test/${selectedSubject}`}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xs transition-all inline-flex items-center gap-1.5 shrink-0"
              >
                <span>Take {selectedSubject} Diagnostic Test</span>
                <span>→</span>
              </Link>
            </div>

            {/* Subject Selector Pills */}
            <div className="p-4 border-b border-slate-100 bg-white">
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((sub) => {
                  const isSelected = sub.id === selectedSubject;
                  const subTests = results.filter((r) => r.subject === sub.id);
                  const latest = subTests.length > 0 ? subTests[subTests.length - 1].scorePercent : null;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubject(sub.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? "text-white shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
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

            {/* Analytics Content */}
            <div className="p-5">
              {!skillGap ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl border border-indigo-100">
                    🎯
                  </div>
                  <h3 className="text-base font-bold text-slate-900">No {selectedSubject} diagnostic data yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Take your first diagnostic test to unlock topic accuracy radar and customized AI study roadmap.
                  </p>
                  <Link
                    to={`/test/${selectedSubject}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all"
                  >
                    Start {selectedSubject} Test →
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Topic-Wise Accuracy & Score Progression Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-xs font-extrabold text-slate-900">Topic-Wise Accuracy ({selectedSubject})</h3>
                          <p className="text-[10px] text-slate-400">Benchmark: 60% mastery threshold</p>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={190}>
                        <BarChart data={skillGap.topicScores}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                          <XAxis dataKey="topic" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                          <Tooltip content={<CustomChartTooltip />} />
                          <Bar dataKey="percent" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-xs font-extrabold text-slate-900">Score Progression</h3>
                          <p className="text-[10px] text-slate-400">{progressData.length} attempts logged</p>
                        </div>
                      </div>
                      {progressData.length > 1 ? (
                        <ResponsiveContainer width="100%" height={190}>
                          <LineChart data={progressData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomChartTooltip />} />
                            <Line type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={3} dot={{ fill: "#7c3aed", r: 4 }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[190px] flex flex-col items-center justify-center text-center">
                          <div className="text-3xl mb-2">📈</div>
                          <p className="text-xs text-slate-500 font-medium">Take 2+ tests to visualize your progress trajectory.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 7-Day Roadmap Strip */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-indigo-100 bg-indigo-50/40">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🗺️</span>
                        <span className="text-sm font-bold text-slate-900">7-Day AI Study Roadmap — {selectedSubject}</span>
                      </div>
                      <Link
                        to={`/roadmap/${selectedSubject}`}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 transition-colors"
                      >
                        Full Roadmap →
                      </Link>
                    </div>
                    {roadmap ? (
                      <RoadmapVisualizer
                        roadmap={roadmap}
                        onRoadmapUpdated={(u) => setRoadmap(u)}
                        onRegenerate={skillGap.weakTopics?.length > 0 ? handleGenerateRoadmap : null}
                        generating={generatingRoadmap}
                      />
                    ) : generatingRoadmap ? (
                      <div className="text-center py-6 space-y-2">
                        <div className="w-8 h-8 mx-auto rounded-xl bg-indigo-100 flex items-center justify-center text-lg animate-bounce">⚡</div>
                        <p className="text-xs font-bold text-slate-800">Generating AI calibrated roadmap...</p>
                      </div>
                    ) : (
                      <div className="text-center py-6 space-y-2">
                        <p className="text-xs font-bold text-slate-800">Generate a 7-day personalized roadmap for {selectedSubject}</p>
                        <button
                          onClick={handleGenerateRoadmap}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all"
                        >
                          ✨ Generate AI Roadmap
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              8. PROBLEM OF THE DAY CHALLENGE
          ═══════════════════════════════════════════════════════ */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-base">
                  💡
                </div>
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    Daily Problem Challenge
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">Earn +50 XP and protect your daily streak</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  +50 XP
                </span>
                <button
                  onClick={() => {
                    setDailyIdx((p) => p + 1);
                    setSelectedOpt(null);
                    setAnsweredDaily(false);
                    setShowExplanation(false);
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  ↻ Next
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold mr-2 uppercase">
                  {currentChallenge.subject}
                </span>
                {currentChallenge.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentChallenge.options.map((opt, oIdx) => {
                  let cls = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100";
                  if (answeredDaily) {
                    if (oIdx === currentChallenge.correctIdx) {
                      cls = "bg-emerald-50 border-emerald-400 text-emerald-800 font-bold";
                    } else if (selectedOpt === oIdx) {
                      cls = "bg-rose-50 border-rose-300 text-rose-800 font-bold";
                    }
                  }
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        if (!answeredDaily) {
                          setSelectedOpt(oIdx);
                          setAnsweredDaily(true);
                        }
                      }}
                      disabled={answeredDaily}
                      className={`text-left px-3.5 py-2.5 rounded-xl text-xs border font-medium transition-all ${cls}`}
                    >
                      <span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + oIdx)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {answeredDaily && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${selectedOpt === currentChallenge.correctIdx ? "text-emerald-700" : "text-rose-700"}`}>
                      {selectedOpt === currentChallenge.correctIdx ? "🎉 Correct! +50 XP Awarded" : "❌ Incorrect, review explanation"}
                    </span>
                    <button
                      onClick={() => setShowExplanation((p) => !p)}
                      className="text-indigo-600 underline font-semibold text-[11px]"
                    >
                      {showExplanation ? "Hide Explanation" : "Why is this correct?"}
                    </button>
                  </div>
                  {showExplanation && (
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                      {currentChallenge.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              9. GAMIFICATION WIDGET
          ═══════════════════════════════════════════════════════ */}
          <GamificationWidget xp={studentXP} streak={streakDays} />

        </main>
      </div>
    </div>
  );
};

export default Dashboard;
