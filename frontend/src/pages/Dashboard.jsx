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
import { LearnXLogo, LearnXIcon } from "../components/LearnXLogo.jsx";
import GamificationWidget from "../components/GamificationWidget.jsx";

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
      <div className="bg-slate-900/95 text-white border border-slate-700 rounded-xl p-3 shadow-xl backdrop-blur-md">
        <p className="text-slate-300 text-xs font-medium">{label}</p>
        <p className="text-violet-400 font-black text-sm mt-0.5">
          {payload[0].value}% Accuracy
        </p>
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
    if (location.state?.subject) {
      setSelectedSubject(location.state.subject);
    }
  }, [location.state]);

  const [skillGap, setSkillGap] = useState(null);
  const [results, setResults] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [learningData, setLearningData] = useState(null);
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
        const [skillGapRes, resultsRes, learningRes] = await Promise.all([
          api.get(`/tests/skill-gap/${selectedSubject}`).catch(() => ({ data: null })),
          api.get("/tests/results").catch(() => ({ data: [] })),
          getStudentLearningDashboard().catch(() => ({ data: null }))
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
        
        let loadedRoadmap = null;
        try {
          const roadmapRes = await api.get(`/roadmap/${selectedSubject}`);
          loadedRoadmap = roadmapRes.data;
          setRoadmap(loadedRoadmap);
        } catch (e) {
          setRoadmap(null);
        }

        if (location.state?.autoRoadmap && (!loadedRoadmap || location.state?.forceRegenerate)) {
          const weakTopics =
            location.state.weakTopics?.length > 0
              ? location.state.weakTopics
              : skillGapRes.data?.weakTopics?.length > 0
              ? skillGapRes.data.weakTopics
              : [];

          setGeneratingRoadmap(true);
          try {
            const { data } = await api.post("/roadmap/generate", {
              subject: selectedSubject,
              weakTopics,
            });
            setRoadmap(data);
          } catch (autoErr) {
            console.error("Auto roadmap generation error:", autoErr);
          } finally {
            setGeneratingRoadmap(false);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedSubject, testVersion, learningVersion]);

  useEffect(() => {
    if (!loading && (location.state?.autoRoadmap || location.hash === "#dashboard-roadmap")) {
      const timer = setTimeout(() => {
        const el = document.getElementById("dashboard-roadmap");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-4", "ring-violet-500/50", "transition-all", "duration-1000");
          setTimeout(() => {
            el.classList.remove("ring-4", "ring-violet-500/50");
          }, 3000);
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [loading, roadmap, location.state]);

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

  const handleDailySubmit = (idx) => {
    setSelectedOption(idx);
    setAnsweredDaily(true);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center p-3 animate-pulse bg-violet-50 border border-violet-200 shadow-sm">
            <LearnXIcon size={36} />
          </div>
          <div className="w-8 h-8 mx-auto rounded-full border-2 border-t-transparent animate-spin border-violet-600 border-t-transparent" />
          <p className="text-slate-700 font-bold text-sm">Loading your personalized dashboard...</p>
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
  const scoreColor = overallScore >= 70 ? "#059669" : overallScore >= 40 ? "#7c3aed" : "#dc2626";

  const streakDays = Math.max(3, (totalTestsAllSubjects % 7) + 1);
  const studentXP = 850 + totalTestsAllSubjects * 120 + (overallScore * 5);
  const studentLevel = Math.floor(studentXP / 400) + 1;
  const dailyGoalDone = Math.min(totalTestsAllSubjects, 3);

  const currentChallenge = DAILY_CHALLENGES[dailyChallengeIdx % DAILY_CHALLENGES.length];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in" id="dashboard-page">

      {/* 1. HERO HEADER: Greeting & Gamified Performance Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl p-6 sm:p-8">
        {/* Glow ambient background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-600/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-violet-300 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LearnX Scholar • Level {studentLevel}</span>
            </div>
            <h1
              className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {getGreeting()}, {user?.name?.split(" ")[0] || "Scholar"}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Track your topic mastery, test diagnostic weaknesses, and level up your engineering skills step by step.
            </p>
          </div>

          {/* Gamified Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Streak */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Streak</p>
                <p className="text-base font-extrabold text-white leading-none mt-0.5">{streakDays} Days</p>
              </div>
            </div>

            {/* XP */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-violet-300">Total XP</p>
                <p className="text-base font-extrabold text-white leading-none mt-0.5">{studentXP}</p>
              </div>
            </div>

            {/* Job Readiness */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
              <span className="text-2xl">💼</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Job Ready</p>
                <p className="text-base font-extrabold text-white leading-none mt-0.5">
                  {jobReadinessScore !== null ? `${jobReadinessScore}%` : "84%"}
                </p>
              </div>
            </div>

            {/* Daily Target */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-sky-300">Daily Target</p>
                <p className="text-base font-extrabold text-white leading-none mt-0.5">{dailyGoalDone} / 3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Quick Shortcuts */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <Link
            to="/learn"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2 text-xs font-bold text-white group"
          >
            <span>📚</span>
            <span className="truncate">Subjects Curriculum</span>
          </Link>
          <Link
            to={`/test/${selectedSubject}`}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2 text-xs font-bold text-white group"
          >
            <span>📝</span>
            <span className="truncate">Diagnostic Quizzes</span>
          </Link>
          <Link
            to="/tutor"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2 text-xs font-bold text-white group"
          >
            <span>🤖</span>
            <span className="truncate">24/7 AI Tutor</span>
          </Link>
          <Link
            to="/placement-readiness"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2 text-xs font-bold text-white group"
          >
            <span>🚀</span>
            <span className="truncate">Placement Predictor</span>
          </Link>
        </div>
      </div>

      {/* 2. CORE LEARNING SECTION (Continue Learning & Flagged Weak Topics) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Continue Learning Hero Card */}
        <div className="lg:col-span-2 rounded-3xl border border-indigo-100 bg-white p-6 sm:p-7 shadow-sm flex flex-col justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700">
                <span>📖 Next Learning Milestone</span>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                {learningData?.continueLearning ? learningData.continueLearning.subjectName : "Recommended Track"}
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {learningData?.continueLearning
                  ? learningData.continueLearning.topicTitle
                  : learningData?.recommendedNext
                  ? learningData.recommendedNext.topicTitle
                  : "Arrays & Dynamic Memory Allocation"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed max-w-xl">
                {learningData?.continueLearning
                  ? `${learningData.continueLearning.unitTitle || "Unit 1"} • ${learningData.continueLearning.chapterTitle || "Chapter 1"}`
                  : "Master high-frequency concepts with structured theory, multi-language code playground, algorithm visualizers, and topic tests."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
            {(() => {
              const targetSub = (learningData?.continueLearning?.subjectId || learningData?.recommendedNext?.subjectId || "dsa").toLowerCase();
              const targetTopic = learningData?.continueLearning?.topicId || learningData?.recommendedNext?.topicId || "dsa-u1-c1-t1";
              const targetTitle = learningData?.continueLearning?.topicTitle || learningData?.recommendedNext?.topicTitle || "Data Structures";

              return (
                <>
                  <Link
                    to={`/learn/${targetSub}/${targetTopic}`}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all inline-flex items-center gap-2"
                  >
                    <span>📖 Start Study Session</span>
                    <span>→</span>
                  </Link>
                  <Link
                    to={`/learn/${targetSub}/${targetTopic}/quiz`}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all inline-flex items-center gap-2"
                  >
                    <span>📝 Take Topic Quiz</span>
                  </Link>
                  <Link
                    to={`/tutor?topic=${encodeURIComponent(targetTitle)}`}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all inline-flex items-center gap-2"
                  >
                    <span>🤖 Ask AI Tutor</span>
                  </Link>
                </>
              );
            })()}
          </div>
        </div>

        {/* Right 1 Col: Weak Topics Diagnostic Radar */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-base">🎯</span>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Weak Topics Radar
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {learningData?.weakTopics?.length || 0} Need Practice
              </span>
            </div>

            {learningData?.weakTopics && learningData.weakTopics.length > 0 ? (
              <div className="space-y-3 mt-3">
                {learningData.weakTopics.slice(0, 3).map((wt) => (
                  <div key={wt.topicId} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-snug">{wt.topicTitle}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{wt.subjectName || "Core CSE"}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 shrink-0">
                        {wt.masteryPercentage || wt.lastAttemptScore || 0}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-[11px] font-bold">
                      <Link
                        to={`/learn/${(wt.subjectId || "dsa").toLowerCase()}/${wt.topicId}`}
                        className="text-indigo-600 hover:underline"
                      >
                        Revise
                      </Link>
                      <span className="text-slate-300">•</span>
                      <Link
                        to={`/learn/${(wt.subjectId || "dsa").toLowerCase()}/${wt.topicId}/quiz`}
                        className="text-violet-600 hover:underline"
                      >
                        Retake Quiz
                      </Link>
                      <span className="text-slate-300">•</span>
                      <Link
                        to={`/tutor?topic=${encodeURIComponent(wt.topicTitle)}`}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        Ask Tutor
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-xl mb-2 border border-emerald-100">
                  ✓
                </div>
                <p className="font-bold text-slate-700">No Weak Topics Flagged</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] mx-auto">
                  Take diagnostic quizzes in any subject to test your concept mastery.
                </p>
              </div>
            )}
          </div>

          <Link
            to="/learn"
            className="text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-3 border-t border-slate-100 block"
          >
            Explore All 10 Subjects →
          </Link>
        </div>
      </div>

      {/* 3. INTERACTIVE SUBJECT SELECTOR & DIAGNOSTIC TRACKS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Core Technical Tracks & Diagnostics
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Select any domain below to inspect calibrated diagnostic scores, weakness radar, and 7-day study roadmaps.
            </p>
          </div>

          <Link
            to={`/test/${selectedSubject}`}
            id="dashboard-take-test-btn"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>📝 Take {selectedSubject} Diagnostic Test</span>
            <span>→</span>
          </Link>
        </div>

        {/* Modern Subject Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SUBJECTS.map((sub) => {
            const isSelected = sub.id === selectedSubject;
            const subTests = results.filter((r) => r.subject === sub.id);
            const latestScore = subTests.length > 0 ? subTests[subTests.length - 1].scorePercent : null;

            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? "bg-violet-50/70 border-violet-500 ring-2 ring-violet-500/20 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{sub.icon}</span>
                  {isSelected && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-violet-600 text-white">
                      Active
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{sub.name}</h4>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-semibold">
                    <span>{subTests.length} tests</span>
                    <span className={latestScore !== null ? (latestScore >= 60 ? "text-emerald-600 font-bold" : "text-rose-600 font-bold") : "text-slate-400"}>
                      {latestScore !== null ? `${latestScore}%` : "No test"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. DIAGNOSTIC ANALYTICS & 7-DAY AI ROADMAP */}
      <div id="dashboard-analytics" className="space-y-6">
        {!skillGap ? (
          <div className="p-10 text-center border border-slate-200 shadow-sm bg-white rounded-3xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-2xl mb-3 border border-violet-100">
              🎯
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No {selectedSubject} diagnostic tests taken yet</h3>
            <p className="text-xs text-slate-500 mb-5 max-w-md mx-auto">
              Take your first calibrated {selectedSubject} test to unlock diagnostic skill radar, accuracy graphs, and your AI study roadmap.
            </p>
            <Link
              to={`/test/${selectedSubject}`}
              id="dashboard-first-test-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
            >
              Start {selectedSubject} Diagnostic Test →
            </Link>
          </div>
        ) : (
          <>
            {/* Metric Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Overall Mastery", value: `${overallScore}%`, icon: "🎯", color: scoreColor },
                { label: "Tests Logged", value: results.filter(r => r.subject === selectedSubject).length, icon: "📝", color: "#6366f1" },
                { label: "Weak Topics", value: skillGap.weakTopics?.length ?? 0, icon: "⚠️", color: "#dc2626" },
                { label: "Mastered Topics", value: skillGap.strongTopics?.length ?? 0, icon: "✅", color: "#059669" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="border border-slate-200 shadow-xs bg-white p-4 rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl">{stat.icon}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-black mt-1" style={{ color: stat.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Diagnostic Accuracy & Mastery Velocity Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Accuracy Chart */}
              <div className="p-6 border border-slate-200 shadow-xs bg-white rounded-3xl" id="dashboard-skill-gap-chart">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-extrabold text-slate-900 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Topic-Wise Diagnostic Accuracy
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Benchmark: 60%</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">Topic scores across your {selectedSubject} attempts</p>
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={skillGap.topicScores}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="topic" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="percent" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Longitudinal Mastery Velocity */}
              <div className="p-6 border border-slate-200 shadow-xs bg-white rounded-3xl" id="dashboard-progress-chart">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-extrabold text-slate-900 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Score Progression Over Time
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{progressData.length} Attempts</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">Mastery velocity across test history</p>
                {progressData.length > 1 ? (
                  <ResponsiveContainer width="100%" height={210}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={3} dot={{ fill: "#7c3aed", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: "#7c3aed" }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[210px] flex flex-col items-center justify-center text-center p-4">
                    <div className="text-3xl mb-2">📈</div>
                    <p className="text-xs text-slate-400 font-medium">Take at least 2 tests in {selectedSubject} to render your longitudinal velocity graph.</p>
                  </div>
                )}
              </div>
            </div>

            {/* 7-Day AI Roadmap Section */}
            <div className="p-6 sm:p-7 border border-slate-200 shadow-xs bg-white rounded-3xl" id="dashboard-roadmap">
              <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-base">🗺️</span>
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                    7-Day AI Learning Roadmap ({selectedSubject})
                  </span>
                </div>
                <Link
                  to={`/roadmap/${selectedSubject}`}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition-colors flex items-center gap-1"
                >
                  <span>Full 7-Day Roadmap</span>
                  <span>→</span>
                </Link>
              </div>

              {roadmap ? (
                <RoadmapVisualizer
                  roadmap={roadmap}
                  onRoadmapUpdated={(updated) => setRoadmap(updated)}
                  onRegenerate={skillGap.weakTopics?.length > 0 ? handleGenerateRoadmap : null}
                  generating={generatingRoadmap}
                />
              ) : generatingRoadmap ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center text-2xl bg-violet-50 border border-violet-200 animate-bounce">
                    ⚡
                  </div>
                  <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Synthesizing Your 7-Day AI Study Roadmap...
                  </h3>
                  <p className="text-xs max-w-md mx-auto text-slate-500 leading-relaxed">
                    Analyzing test diagnostics for <strong className="text-violet-700">{selectedSubject}</strong> to build daily remediation milestones.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center text-2xl bg-violet-50 border border-violet-200">
                    🗺️
                  </div>
                  <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Personalized 7-Day Study Roadmap
                  </h3>
                  <p className="text-xs max-w-md mx-auto text-slate-500 leading-relaxed">
                    Generate a structured day-by-day blueprint specifically calibrated for your diagnosed weaknesses in {selectedSubject}.
                  </p>
                  <button
                    id="dashboard-generate-roadmap-btn"
                    onClick={handleGenerateRoadmap}
                    disabled={generatingRoadmap}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-sm transition-all"
                  >
                    ✨ Generate 7-Day AI Roadmap
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 5. PROBLEM OF THE DAY & ADVANCED LEARNING SUITE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Interactive Problem of the Day (POTD) */}
        <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">💡</span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Problem of the Day</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                +50 XP
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
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
                  Next ↻
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
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs animate-fade-in">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold ${selectedOption === currentChallenge.correctIdx ? "text-emerald-700" : "text-rose-700"}`}>
                      {selectedOption === currentChallenge.correctIdx ? "🎉 Correct! +50 XP" : "❌ Review explanation:"}
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
            Daily reset at midnight • Streak active
          </div>
        </div>

        {/* Right 2 Columns: 3 Advanced Feature Hub Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Placement AI Predictor */}
          <div className="p-5 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between gap-3 hover:border-slate-300 transition-all">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-xl">
                🎯
              </div>
              <h4 className="text-xs font-extrabold text-slate-900">Placement AI Predictor</h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                Forecast readiness score, time-to-ready & high-risk interview zones.
              </p>
            </div>
            <Link
              to="/placement-readiness"
              id="dashboard-placement-cta"
              className="w-full text-center px-3 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors shadow-xs"
            >
              Open Predictor →
            </Link>
          </div>

          {/* Career & ATS Engine */}
          <div className="p-5 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between gap-3 hover:border-slate-300 transition-all">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-xl">
                💼
              </div>
              <h4 className="text-xs font-extrabold text-slate-900">Career Readiness</h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                ATS resume checker, real-world project blueprints & interview prep.
              </p>
            </div>
            <Link
              to="/career-readiness"
              id="dashboard-career-cta"
              className="w-full text-center px-3 py-2 rounded-xl text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 shadow-xs"
            >
              Career Hub →
            </Link>
          </div>

          {/* Offline Learning Hub */}
          <div className="p-5 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between gap-3 hover:border-slate-300 transition-all">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-xl">
                🛡️
              </div>
              <h4 className="text-xs font-extrabold text-slate-900">Offline Learning</h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                Download practice question packs & sync progress offline.
              </p>
            </div>
            <Link
              to="/offline-learning"
              id="dashboard-offline-cta"
              className="w-full text-center px-3 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors shadow-xs"
            >
              Offline Hub →
            </Link>
          </div>
        </div>
      </div>

      {/* 6. GAMIFICATION BADGES & RANK FOOTER */}
      <GamificationWidget xp={studentXP} streak={streakDays} />

    </div>
  );
};

export default Dashboard;
