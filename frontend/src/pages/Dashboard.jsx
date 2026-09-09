import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, AreaChart, Area
} from "recharts";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useOffline } from "../context/OfflineContext.jsx";
import RoadmapVisualizer from "../components/RoadmapVisualizer.jsx";
import { LearnXLogo, LearnXIcon } from "../components/LearnXLogo.jsx";

const SUBJECTS = [
  { id: "DSA", name: "Data Structures & Algos", icon: "⚡", totalTopics: 6, tag: "Must Prepare" },
  { id: "DBMS", name: "Database Systems & SQL", icon: "🗄️", totalTopics: 4, tag: "Core Track" },
  { id: "OS", name: "Operating Systems", icon: "💻", totalTopics: 4, tag: "Core Track" },
  { id: "CN", name: "Computer Networks", icon: "🌐", totalTopics: 4, tag: "Networking" },
  { id: "OOPS", name: "OOPs & SOLID Design", icon: "🧩", totalTopics: 4, tag: "Software Eng" },
  { id: "SYSTEM_DESIGN", name: "System Design & Arch", icon: "🏗️", totalTopics: 5, tag: "Top Tier" },
  { id: "APTITUDE", name: "Aptitude & Reasoning", icon: "🧠", totalTopics: 4, tag: "Round 1 OA" },
  { id: "WEB_DEV", name: "Web Dev & DevOps", icon: "🚀", totalTopics: 4, tag: "Full Stack" },
  { id: "MACHINE_LEARNING", name: "Machine Learning & AI", icon: "🤖", totalTopics: 5, tag: "AI/ML Track" },
];

const DAILY_CHALLENGES = [
  {
    subject: "DSA",
    topic: "Trees & Traversals",
    question: "Which tree traversal algorithm produces the nodes of a Binary Search Tree (BST) in strictly sorted ascending order?",
    options: ["Pre-order Traversal", "In-order Traversal", "Post-order Traversal", "Level-order Traversal"],
    correctIdx: 1,
    explanation: "In-order traversal visits (Left Subtree -> Root -> Right Subtree), which naturally yields elements in non-decreasing sorted order in a BST."
  },
  {
    subject: "DBMS",
    topic: "Normalization",
    question: "Which normal form requires every determinant in a functional dependency to be a candidate key?",
    options: ["1NF", "2NF", "3NF", "BCNF (Boyce-Codd)"],
    correctIdx: 3,
    explanation: "BCNF is a stricter version of 3NF where for every functional dependency X → Y, X must be a superkey / determinant."
  },
  {
    subject: "OS",
    topic: "Deadlocks",
    question: "Which of the following deadlock prevention strategies directly violates the 'Hold and Wait' condition?",
    options: ["Imposing total order on resources", "Requiring processes to request all resources at once", "Allowing preemption", "Using time-sharing scheduling"],
    correctIdx: 1,
    explanation: "Requiring a process to request all required resources before starting execution prevents it from holding allocated resources while waiting for more."
  },
  {
    subject: "CN",
    topic: "Transport Layer",
    question: "How many packets are exchanged in a standard TCP connection establishment handshake?",
    options: ["2 packets (SYN, ACK)", "3 packets (SYN, SYN-ACK, ACK)", "4 packets (SYN, ACK, DATA, ACK)", "1 packet (SYN)"],
    correctIdx: 1,
    explanation: "TCP 3-Way Handshake: Client sends SYN -> Server responds with SYN-ACK -> Client replies with ACK."
  },
  {
    subject: "OOPS",
    topic: "Polymorphism & vtable",
    question: "In C++ and Java, how is runtime (dynamic) polymorphism resolved under the hood?",
    options: ["Preprocessor macros", "vtable (virtual method table) and vptr pointer", "Static bytecode rewriting", "Thread execution stack hashing"],
    correctIdx: 1,
    explanation: "Each polymorphic class contains a vtable of function pointers and each object holds a hidden vptr pointing to its class vtable."
  },
  {
    subject: "SYSTEM_DESIGN",
    topic: "Distributed Caching",
    question: "In high-scale web systems, what problem occurs when multiple concurrent requests miss the cache simultaneously and slam the DB?",
    options: ["Cache Penetration", "Cache Stampede / Avalanche", "Write-Back Throttling", "Dirty Read Contention"],
    correctIdx: 1,
    explanation: "Cache Stampede happens when a hot cache key expires, causing massive concurrent read requests to hit the database directly."
  },
  {
    subject: "APTITUDE",
    topic: "Time & Work",
    question: "A can complete a project in 12 days, and B can complete it in 24 days. Working together, how many days will they take?",
    options: ["6 days", "8 days", "9 days", "18 days"],
    correctIdx: 1,
    explanation: "1/12 + 1/24 = 3/24 = 1/8. Total time required working together = 8 days."
  },
  {
    subject: "WEB_DEV",
    topic: "HTTP & REST",
    question: "Which HTTP request method is strictly Idempotent according to RFC 7231?",
    options: ["POST", "PUT", "PATCH (without conditional headers)", "CONNECT"],
    correctIdx: 1,
    explanation: "PUT is idempotent because executing it multiple times with the same payload produces the exact same resource state."
  },
  {
    subject: "MACHINE_LEARNING",
    topic: "Bias-Variance Trade-off",
    question: "A model that performs excellently on training data but poorly on unseen test data is suffering from:",
    options: ["High Bias / Underfitting", "High Variance / Overfitting", "Data Leakage", "Gradient Explosion"],
    correctIdx: 1,
    explanation: "High Variance (Overfitting) means the model memorises training data and fails to generalise. Remedies include Regularisation (L1/L2), Dropout, and more training data."
  }
];

// Custom sleek chart tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 text-white border border-slate-700 rounded-xl p-3 shadow-2xl backdrop-blur-md">
        <p className="text-slate-300 text-xs font-medium">{label}</p>
        <p className="text-sky-400 font-extrabold text-base mt-0.5">
          {payload[0].value}% Accuracy
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { user } = useAuth();
  const { isOnline, isLowDataMode } = useOffline();
  const [selectedSubject, setSelectedSubject] = useState("DBMS");
  const [skillGap, setSkillGap] = useState(null);
  const [results, setResults] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [loading, setLoading] = useState(true);

  // Daily Challenge Interactive State
  const [dailyChallengeIdx, setDailyChallengeIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answeredDaily, setAnsweredDaily] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Active greeting calculation
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [skillGapRes, resultsRes] = await Promise.all([
          api.get(`/tests/skill-gap/${selectedSubject}`).catch(() => ({ data: null })),
          api.get("/tests/results"),
        ]);
        setSkillGap(skillGapRes.data);
        setResults(resultsRes.data || []);
        try {
          const roadmapRes = await api.get(`/roadmap/${selectedSubject}`);
          setRoadmap(roadmapRes.data);
        } catch (e) {
          setRoadmap(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedSubject]);

  const handleGenerateRoadmap = async () => {
    if (!skillGap?.weakTopics?.length) return;
    setGeneratingRoadmap(true);
    try {
      const { data } = await api.post("/roadmap/generate", {
        subject: selectedSubject,
        weakTopics: skillGap.weakTopics,
      });
      setRoadmap(data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate roadmap");
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  const handleDailySubmit = (idx) => {
    setSelectedOption(idx);
    setAnsweredDaily(true);
  };

  if (loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div
            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center p-3 animate-pulse bg-violet-50 border border-violet-200 shadow-sm"
          >
            <LearnXIcon size={36} />
          </div>
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(124,58,237,0.3)", borderTopColor: "#7c3aed" }} />
          <p className="text-slate-700 font-bold text-sm">Loading your LearnX command center...</p>
        </div>
      </div>
    );
  }

  const subjectResults = results.filter((r) => r.subject === selectedSubject);
  const progressData = subjectResults.map((r, i) => ({
    name: `Test ${i + 1}`,
    score: r.scorePercent,
  }));

  const totalTestsAllSubjects = results.length;
  const overallScore = skillGap?.overallScore ?? 0;
  const scoreColor = overallScore >= 70 ? "#0284c7" : overallScore >= 40 ? "#7c3aed" : "#dc2626";

  // Gamified student XP & streaks
  const streakDays = Math.max(3, (totalTestsAllSubjects % 7) + 1);
  const studentXP = 850 + totalTestsAllSubjects * 120 + (overallScore * 5);
  const studentLevel = Math.floor(studentXP / 400) + 1;

  const currentChallenge = DAILY_CHALLENGES[dailyChallengeIdx % DAILY_CHALLENGES.length];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8" id="dashboard-page">

      {/* 1. Premier Header: Greeting, Streak, XP, & Daily Goal Bar */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-950 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Background glow orb */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* User Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-violet-200 mb-2.5 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LearnX Scholar • Level {studentLevel}</span>
            </div>
            <h1
              className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {getGreeting()}, {user?.name?.split(" ")[0] || "Scholar"}! 🚀
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              "More Than Learning, A Brighter You." Ready to close your technical skill gaps today?
            </p>
          </div>

          {/* Gamified Stat Chips */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Streak Chip */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
              <span className="text-2xl animate-bounce">🔥</span>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-amber-300">Daily Streak</p>
                <p className="text-base font-extrabold text-white leading-none mt-0.5">{streakDays} Days</p>
              </div>
            </div>

            {/* XP Chip */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-sky-300">Total XP</p>
                <p className="text-base font-extrabold text-white leading-none mt-0.5">{studentXP} XP</p>
              </div>
            </div>

            {/* Daily Goal Completion */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">Daily Target</p>
                <p className="text-base font-extrabold text-white leading-none mt-0.5">2 / 3 Done</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Pillars Quick Access Ribbon */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-center">
          <Link
            to={`/test/${selectedSubject}`}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 transition-colors border border-white/10 flex items-center justify-center gap-2 text-xs font-bold text-white group"
          >
            <span className="text-base group-hover:scale-110 transition-transform">📖</span>
            <span className="truncate">Personalized Study</span>
          </Link>
          <Link
            to="/tutor"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 transition-colors border border-white/10 flex items-center justify-center gap-2 text-xs font-bold text-white group"
          >
            <span className="text-base group-hover:scale-110 transition-transform">🤖</span>
            <span className="truncate">24/7 AI Tutor</span>
          </Link>
          <Link
            to={`/test/${selectedSubject}`}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 transition-colors border border-white/10 flex items-center justify-center gap-2 text-xs font-bold text-white group"
          >
            <span className="text-base group-hover:scale-110 transition-transform">📝</span>
            <span className="truncate">Practice MCQs</span>
          </Link>
          <Link
            to="#dashboard-analytics"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 transition-colors border border-white/10 flex items-center justify-center gap-2 text-xs font-bold text-white group"
          >
            <span className="text-base group-hover:scale-110 transition-transform">📊</span>
            <span className="truncate">Skill Analytics</span>
          </Link>
          <Link
            to="/career-readiness"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 transition-colors border border-white/10 flex items-center justify-center gap-2 text-xs font-bold text-white group col-span-2 sm:col-span-1"
          >
            <span className="text-base group-hover:scale-110 transition-transform">💼</span>
            <span className="truncate">Career & ATS</span>
          </Link>
        </div>
      </div>

      {/* 2. Subject Mastery Selector & Quick-Start Cards */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Core Technical Tracks
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Select a domain to inspect your diagnostic skill gap, roadmaps, and test history.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/test/${selectedSubject}`}
              id="dashboard-take-test-btn"
              className="btn-gradient px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap inline-flex items-center gap-1.5 text-white shadow-sm"
            >
              <span>📝 Take {selectedSubject} Diagnostic Test</span>
            </Link>
          </div>
        </div>

        {/* 3 Domain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SUBJECTS.map((sub) => {
            const isSelected = sub.id === selectedSubject;
            const subTests = results.filter((r) => r.subject === sub.id);
            const latestScore = subTests.length > 0 ? subTests[subTests.length - 1].scorePercent : null;

            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubject(sub.id)}
                className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-4 ${
                  isSelected
                    ? "bg-white border-violet-500 ring-2 ring-violet-500/20 shadow-lg scale-[1.01]"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-2xl">
                      {sub.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 leading-tight">{sub.name}</h3>
                      <p className="text-[11px] font-bold text-slate-500 mt-0.5">{sub.totalTopics} High-Yield Topics</p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-violet-100 text-violet-800 border border-violet-200">
                      Active
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Latest Score</p>
                    <p className={`font-extrabold text-sm ${latestScore !== null ? (latestScore >= 70 ? "text-emerald-600" : latestScore >= 40 ? "text-violet-600" : "text-rose-600") : "text-slate-400"}`}>
                      {latestScore !== null ? `${latestScore}%` : "No Test Yet"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Tests Logged</p>
                    <p className="font-extrabold text-slate-800 text-sm">{subTests.length} Attempts</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Continue Learning / Active Milestone Hero Card */}
      <div className="glass-card p-6 rounded-3xl border border-violet-200/80 bg-gradient-to-r from-violet-50 via-purple-50 to-sky-50 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-violet-600 text-white uppercase tracking-wider">
                Active Itinerary
              </span>
              <span className="text-xs font-bold text-violet-800">{selectedSubject} Mastery Track</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {skillGap?.weakTopics?.length > 0
                ? `Remediation Priority: Master ${skillGap.weakTopics[0]}`
                : `Advanced Concept Sprint: ${selectedSubject} Core Competencies`}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {skillGap?.weakTopics?.length > 0
                ? `Your diagnostics flagged ${skillGap.weakTopics.join(", ")} below the 60% mastery threshold. Follow the AI roadmap to boost your score.`
                : `You've demonstrated solid fundamentals! Continue taking comprehensive assessments to maintain placement readiness.`}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
            <Link
              to={`/test/${selectedSubject}`}
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold text-white btn-gradient flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <span>⚡ Start Practice Test</span>
              <span>→</span>
            </Link>
            <Link
              to={`/tutor?topic=${encodeURIComponent(skillGap?.weakTopics?.[0] || selectedSubject)}`}
              className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs font-bold bg-white text-slate-800 hover:bg-slate-100 transition-colors border border-slate-200 flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
            >
              <span>🤖 Ask AI Tutor</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Problem of the Day (Interactive POTD) & 4 Key Feature Hub Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Problem of the Day (POTD) Widget */}
        <div className="lg:col-span-1 glass-card p-6 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">💡</span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-violet-800">Problem of the Day</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                +50 XP
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                <span>{currentChallenge.subject} • {currentChallenge.topic}</span>
                <button
                  onClick={() => {
                    setDailyChallengeIdx((prev) => prev + 1);
                    setSelectedOption(null);
                    setAnsweredDaily(false);
                    setShowExplanation(false);
                  }}
                  className="text-violet-600 hover:underline text-[11px] font-bold"
                >
                  Next Question ↻
                </button>
              </div>

              <p className="text-xs font-bold text-slate-800 leading-relaxed">
                {currentChallenge.question}
              </p>

              <div className="space-y-2 pt-1">
                {currentChallenge.options.map((opt, oIdx) => {
                  let btnStyle = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100";
                  if (answeredDaily) {
                    if (oIdx === currentChallenge.correctIdx) {
                      btnStyle = "bg-emerald-50 border-emerald-400 text-emerald-800 font-bold";
                    } else if (selectedOption === oIdx) {
                      btnStyle = "bg-rose-50 border-rose-300 text-rose-800 font-bold";
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => !answeredDaily && handleDailySubmit(oIdx)}
                      disabled={answeredDaily}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs border transition-all ${btnStyle}`}
                    >
                      <span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + oIdx)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {answeredDaily && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs animate-fade-in-up">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold ${selectedOption === currentChallenge.correctIdx ? "text-emerald-700" : "text-rose-700"}`}>
                      {selectedOption === currentChallenge.correctIdx ? "🎉 Correct! +50 XP" : "❌ Incorrect, review explanation:"}
                    </span>
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="text-[11px] text-violet-700 underline font-semibold"
                    >
                      {showExplanation ? "Hide" : "Why?"}
                    </button>
                  </div>
                  {showExplanation && (
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                      {currentChallenge.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 text-center text-[10px] text-slate-400 font-medium">
            Daily reset in 4 hours • Streak is active
          </div>
        </div>

        {/* Right 2 Columns: 4 Advanced Intelligence Hub Banners */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Placement AI Predictor Banner */}
          <div className="glass-card p-5 rounded-2xl border border-violet-200 flex flex-col justify-between gap-3 bg-gradient-to-r from-violet-50/90 to-purple-50/90 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center text-xl shrink-0">
                🎯
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs font-extrabold text-slate-900">Placement AI</h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
                    Predictor
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Forecast readiness score, time-to-ready & interview danger zones.
                </p>
              </div>
            </div>
            <Link
              to="/placement-readiness"
              id="dashboard-placement-cta"
              className="w-full text-center px-3 py-2 rounded-xl text-xs font-bold btn-gradient text-white flex items-center justify-center gap-1 shadow-xs"
            >
              <span>Placement Predictor →</span>
            </Link>
          </div>

          {/* Career & Job Readiness Engine Banner */}
          <div className="glass-card p-5 rounded-2xl border border-sky-200 flex flex-col justify-between gap-3 bg-gradient-to-r from-sky-50/90 to-purple-50/90 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-xl shrink-0">
                💼
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs font-extrabold text-slate-900">Career Engine</h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                    ATS & Mock
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  ATS resume scanner, roadmaps, project blueprints & mock prep.
                </p>
              </div>
            </div>
            <Link
              to="/career-readiness"
              id="dashboard-career-cta"
              className="w-full text-center px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-1 shadow-xs"
            >
              <span>Career Readiness →</span>
            </Link>
          </div>

          {/* Faculty & Institution Dashboard Banner */}
          <div className="glass-card p-5 rounded-2xl border border-indigo-200 flex flex-col justify-between gap-3 bg-gradient-to-r from-indigo-50/90 to-cyan-50/90 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xl shrink-0">
                🎓
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs font-extrabold text-slate-900">Faculty Portal</h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                    Analytics
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Class overview, weak topics, at-risk alerts & Dean's reports.
                </p>
              </div>
            </div>
            <Link
              to="/teacher-dashboard"
              id="dashboard-teacher-cta"
              className="w-full text-center px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1 shadow-xs"
            >
              <span>Faculty Portal →</span>
            </Link>
          </div>

          {/* Offline & Low-Bandwidth Hub Banner */}
          <div className="glass-card p-5 rounded-2xl border border-amber-200 flex flex-col justify-between gap-3 bg-gradient-to-r from-amber-50/90 to-emerald-50/90 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-xl shrink-0">
                🛡️
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs font-extrabold text-slate-900">Offline Hub</h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    Low-Bandwidth
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Download question packs, take offline tests & auto-sync progress.
                </p>
              </div>
            </div>
            <Link
              to="/offline-learning"
              id="dashboard-offline-cta"
              className="w-full text-center px-3 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors flex items-center justify-center gap-1 shadow-xs"
            >
              <span>Offline Learning Hub →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Diagnostic Analytics & Radar Section */}
      <div id="dashboard-analytics" className="space-y-6">
        {!skillGap ? (
          /* No test yet — empty state */
          <div className="glass-card p-12 text-center border border-slate-200 shadow-sm bg-white rounded-3xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-100 flex items-center justify-center text-3xl mb-4">
              🎯
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No {selectedSubject} diagnostic tests taken yet</h3>
            <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
              Take your first calibrated {selectedSubject} assessment to unlock personalized skill gap radar, topic-by-topic scores, and AI roadmaps.
            </p>
            <Link
              to={`/test/${selectedSubject}`}
              id="dashboard-first-test-btn"
              className="btn-gradient inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-sm"
            >
              Start {selectedSubject} Diagnostic Test →
            </Link>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Overall Mastery", value: `${overallScore}%`, icon: "🎯", color: scoreColor },
                { label: "Tests Logged", value: results.filter(r => r.subject === selectedSubject).length, icon: "📝", color: "#0284c7" },
                { label: "Weak Topics", value: skillGap.weakTopics?.length ?? 0, icon: "⚠️", color: "#dc2626" },
                { label: "Mastered Topics", value: skillGap.strongTopics?.length ?? 0, icon: "✅", color: "#059669" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="stat-card animate-fade-in-up border border-slate-200 shadow-sm bg-white p-5 rounded-2xl"
                  style={{ animationDelay: `${i * 80}ms` }}
                  id={`dashboard-stat-${stat.label.toLowerCase().replace(" ", "-")}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{stat.icon}</span>
                    <div className="w-2.5 h-2.5 rounded-full mt-1" style={{ background: stat.color, boxShadow: `0 0 6px ${stat.color}60` }} />
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold" style={{ color: stat.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                    {stat.value}
                  </p>
                  <p className="text-xs font-semibold text-slate-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skill gap bar chart */}
              <div className="glass-card p-6 border border-slate-200 shadow-sm bg-white rounded-3xl" id="dashboard-skill-gap-chart">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Topic-Wise Diagnostic Accuracy
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Benchmark: 60%</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">Topic scores across your {selectedSubject} attempts</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={skillGap.topicScores}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="topic" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="percent" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#0284c7" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Progress line chart */}
              <div className="glass-card p-6 border border-slate-200 shadow-sm bg-white rounded-3xl" id="dashboard-progress-chart">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Longitudinal Mastery Velocity
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{progressData.length} Attempts</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">Score progression over time</p>
                {progressData.length > 1 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#7c3aed" />
                          <stop offset="100%" stopColor="#0284c7" />
                        </linearGradient>
                      </defs>
                      <Line type="monotone" dataKey="score" stroke="url(#lineGradient)" strokeWidth={3} dot={{ fill: "#7c3aed", strokeWidth: 2, r: 5 }} activeDot={{ r: 7, fill: "#7c3aed" }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[220px] flex flex-col items-center justify-center text-center p-4">
                    <div className="text-4xl mb-2">📈</div>
                    <p className="text-xs text-slate-500 font-medium">Take at least 2 tests in {selectedSubject} to render your longitudinal velocity graph.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Readiness Breakdown & Topic Recommendations */}
            <div className="glass-card p-6 border border-slate-200 shadow-sm bg-white rounded-3xl" id="dashboard-readiness">
              <h3 className="font-bold text-slate-900 mb-4 text-sm sm:text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Diagnostic Vulnerability Summary
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Score circle */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-24 h-24 rounded-full flex flex-col items-center justify-center font-black"
                    style={{
                      background: `conic-gradient(${scoreColor} ${overallScore * 3.6}deg, #e2e8f0 0deg)`,
                      boxShadow: `0 0 20px ${scoreColor}30`,
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: scoreColor,
                    }}
                  >
                    <div className="w-20 h-20 rounded-full bg-white flex flex-col items-center justify-center">
                      <span className="text-xl leading-none">{overallScore}%</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Mastery</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="rounded-2xl p-4 bg-rose-50/70 border border-rose-200">
                    <p className="text-xs font-bold mb-1.5 text-rose-700 flex items-center gap-1.5">
                      <span>⚠️ Critical Vulnerabilities (&lt;60%)</span>
                    </p>
                    <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                      {skillGap.weakTopics?.length > 0
                        ? skillGap.weakTopics.join(", ")
                        : "No critical weaknesses detected! Excellent command."}
                    </p>
                  </div>

                  <div className="rounded-2xl p-4 bg-emerald-50/70 border border-emerald-200">
                    <p className="text-xs font-bold mb-1.5 text-emerald-700 flex items-center gap-1.5">
                      <span>✅ Mastered Competencies (≥60%)</span>
                    </p>
                    <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                      {skillGap.strongTopics?.length > 0
                        ? skillGap.strongTopics.join(", ")
                        : "Complete more questions to establish topic mastery."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. AI 7-Day Roadmap Section */}
            <div className="glass-card p-6 md:p-8 border border-slate-200 shadow-sm bg-white rounded-3xl" id="dashboard-roadmap">
              {roadmap ? (
                <RoadmapVisualizer
                  roadmap={roadmap}
                  onRoadmapUpdated={(updated) => setRoadmap(updated)}
                  onRegenerate={skillGap.weakTopics?.length > 0 ? handleGenerateRoadmap : null}
                  generating={generatingRoadmap}
                />
              ) : (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl bg-violet-100 border border-violet-200 shadow-xs">
                    🗺️
                  </div>
                  <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Personalized 7-Day Study Roadmap
                  </h3>
                  <p className="text-xs sm:text-sm max-w-md mx-auto text-slate-600 leading-relaxed">
                    {skillGap.weakTopics?.length > 0
                      ? `Our AI tutor will design a structured day-by-day blueprint specifically to overcome your diagnosed weak topics in ${selectedSubject} (${skillGap.weakTopics.join(", ")}).`
                      : `No weak topics found in ${selectedSubject}! You can still generate a 7-day mastery roadmap.`}
                  </p>
                  <button
                    id="dashboard-generate-roadmap-btn"
                    onClick={handleGenerateRoadmap}
                    disabled={generatingRoadmap}
                    className="btn-gradient inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-50 text-white shadow-sm"
                  >
                    {generatingRoadmap ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                        Generating AI Blueprint...
                      </>
                    ) : (
                      "✨ Generate 7-Day Visual Roadmap"
                    )}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default Dashboard;

