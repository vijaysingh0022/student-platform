import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useLocation, useNavigate } from "react-router-dom";
import api, { generateStudyPlan, getStudyPlan, rescheduleStudyPlan } from "../services/api.js";
import RoadmapVisualizer from "../components/RoadmapVisualizer.jsx";
import { useAppState } from "../context/AppStateContext.jsx";

// ── Horizontal Subject Selector items matching reference ─────────────────────
const SUBJECTS_RIBBON = [
  { id: "DSA", name: "DSA", fullName: "Data Structures & Algorithms", goals: 14, icon: "⚡" },
  { id: "DBMS", name: "DBMS", fullName: "Database Management Systems", goals: 12, icon: "🗄️" },
  { id: "OS", name: "Operating Systems", fullName: "Operating Systems", goals: 10, icon: "💻" },
  { id: "CN", name: "Computer Networks", fullName: "Computer Networks", goals: 10, icon: "🌐" },
  { id: "Java", name: "Core Java & OOPs", fullName: "Core Java & OOPs", goals: 12, icon: "☕" },
  { id: "Python", name: "Python", fullName: "Python Programming", goals: 10, icon: "🐍" },
];

// ── Circular Progress Ring ───────────────────────────────────────────────────
const CircularProgress = ({ value = 0, size = 52, strokeWidth = 5, strokeColor = "#3b82f6" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-black text-slate-800">{clamped}%</span>
      </div>
    </div>
  );
};

export const RoadmapPage = () => {
  const { subject: routeSubject } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { testVersion } = useAppState();

  const activeSubject =
    routeSubject ||
    location.state?.subject ||
    searchParams.get("subject") ||
    "DSA";

  const [roadmap, setRoadmap] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [genError, setGenError] = useState(null);

  // Setup Modal State for Goals & Schedule
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupForm, setSetupForm] = useState({
    examGoal: "Placement & GATE Preparation",
    examDate: "2026-10-15",
    availableHoursPerDay: 2,
    skillLevel: "Beginner",
    targetScore: "90%",
    preferredStudyTime: "Evening (6 PM - 10 PM)",
  });

  const ribbonRef = useRef(null);

  // ── Fetch or auto-generate study plan ───────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const fetchPlannerData = async () => {
      setLoading(true);
      setGenError(null);

      try {
        const [skillGapRes, roadmapRes] = await Promise.all([
          api.get(`/tests/skill-gap/${activeSubject}`).catch(() => ({ data: null })),
          getStudyPlan(activeSubject).catch(() => ({ data: null })),
        ]);

        if (!isMounted) return;

        setSkillGap(skillGapRes.data);

        const shouldRegenerate =
          location.state?.forceRegenerate ||
          (location.state?.autoRoadmap && !roadmapRes.data);

        if (!shouldRegenerate && roadmapRes.data && roadmapRes.data.days && roadmapRes.data.days.length > 0) {
          setRoadmap(roadmapRes.data);
          setSetupForm((prev) => ({
            ...prev,
            examGoal: roadmapRes.data.examGoal || prev.examGoal,
            examDate: roadmapRes.data.examDate
              ? new Date(roadmapRes.data.examDate).toISOString().split("T")[0]
              : prev.examDate,
            availableHoursPerDay: roadmapRes.data.availableHoursPerDay || prev.availableHoursPerDay,
            skillLevel: roadmapRes.data.skillLevel || prev.skillLevel,
            targetScore: roadmapRes.data.targetScore || prev.targetScore,
            preferredStudyTime: roadmapRes.data.preferredStudyTime || prev.preferredStudyTime,
          }));
        } else {
          handleGeneratePlanner();
        }
      } catch (err) {
        console.error("Error fetching roadmap:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPlannerData();

    return () => {
      isMounted = false;
    };
  }, [activeSubject, testVersion, location.key]);

  const handleSubjectChange = (subjectId) => {
    setSearchParams({ subject: subjectId });
    navigate(`/roadmap/${subjectId}`);
  };

  const handleGeneratePlanner = async (customPayload = null) => {
    setGenerating(true);
    setGenError(null);
    setShowSetupModal(false);

    try {
      const payload = customPayload || {
        subject: activeSubject,
        ...setupForm,
      };

      const { data } = await generateStudyPlan(payload);
      setRoadmap(data);
    } catch (err) {
      console.error("Generate study planner error:", err);
      // Construct realistic fallback roadmap in case of offline / quota limit
      const fallbackDays = [
        {
          day: 1,
          date: "2026-10-14",
          title: "Arrays & Basic Programming",
          priority: "Foundation",
          duration: "30 min",
          status: "not-started",
          description: "Build strong foundation with arrays, input-output, and basic problem solving.",
          pipeline: ["Learn", "Practice", "Quiz"],
          keyConcepts: ["Arrays Basics", "Traversal", "Time Complexity", "Common Problems"],
          actionItem: "Implement array rotation and prefix sum algorithms.",
        },
        {
          day: 2,
          date: "2026-10-15",
          title: "Linked Lists",
          priority: "High Priority",
          duration: "45 min",
          status: "not-started",
          description: "Understand linked list fundamentals and practice implementations.",
          pipeline: ["Learn", "Practice", "Quiz"],
          keyConcepts: ["Singly Linked List", "Doubly Linked List", "Insertion & Deletion", "Applications"],
          actionItem: "Reverse a linked list and detect cycle using Floyd's algorithm.",
        },
        {
          day: 3,
          date: "2026-10-16",
          title: "Stacks & Queues",
          priority: "Important",
          duration: "45 min",
          status: "not-started",
          description: "Learn stack and queue data structures with real-world problems.",
          pipeline: ["Learn", "Practice", "Quiz"],
          keyConcepts: ["Stack Operations", "Queue Operations", "Applications", "Problem Solving"],
          actionItem: "Implement monotonic stack for next greater element problem.",
        },
        {
          day: 4,
          date: "2026-10-17",
          title: "Recursion & Backtracking",
          priority: "Important",
          duration: "60 min",
          status: "not-started",
          description: "Master recursive thinking, base conditions, and backtracking trees.",
          pipeline: ["Learn", "Practice", "Quiz"],
          keyConcepts: ["Base Cases", "Call Stack", "Subsets", "Permutations"],
          actionItem: "Solve N-Queens and generate all valid parentheses.",
        },
        {
          day: 5,
          date: "2026-10-18",
          title: "Binary Trees & Traversals",
          priority: "High Priority",
          duration: "50 min",
          status: "not-started",
          description: "Tree representations, recursive traversals, and diameter calculations.",
          pipeline: ["Learn", "Practice", "Quiz"],
          keyConcepts: ["Inorder", "Preorder", "Postorder", "Tree Height"],
          actionItem: "Find lowest common ancestor (LCA) in binary tree.",
        },
      ];

      setRoadmap({
        _id: "demo_roadmap",
        subject: activeSubject,
        examGoal: setupForm.examGoal,
        examDate: setupForm.examDate,
        availableHoursPerDay: setupForm.availableHoursPerDay,
        skillLevel: setupForm.skillLevel,
        targetScore: setupForm.targetScore,
        preferredStudyTime: setupForm.preferredStudyTime,
        days: fallbackDays,
        aiRecommendation: `You are currently focusing on Day 2: Linked Lists. Since this is a fundamental topic, make sure to complete the practice questions and quiz to build a strong foundation.`,
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleReschedule = async () => {
    if (!roadmap?._id) return;
    setRescheduling(true);
    try {
      const { data } = await rescheduleStudyPlan(roadmap._id);
      setRoadmap(data);
    } catch (err) {
      console.error("Reschedule error:", err);
      setGenError("Failed to reschedule study plan.");
    } finally {
      setRescheduling(false);
    }
  };

  const calculateDaysRemaining = () => {
    if (!setupForm.examDate) return 10;
    const diffTime = new Date(setupForm.examDate).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 10;
  };

  const daysRemaining = calculateDaysRemaining();
  const totalGoals = roadmap?.days?.length || 14;
  const completedGoals = roadmap?.days?.filter((d) => d.completed || d.status === "completed").length || 0;
  const overallProgressPercent = Math.round((completedGoals / totalGoals) * 100);

  const scrollRibbon = (dir) => {
    if (ribbonRef.current) {
      ribbonRef.current.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full space-y-6 pb-20 text-slate-900 font-sans">

      {/* ──────────────────────────────────────────────────────────────────────
          1. HERO ROW: ADAPTIVE STUDY PLANNER + YOUR GOAL CARD
      ────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

        {/* Left Hero Card (~72% width) */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-100/90 via-indigo-50/70 to-blue-50/40 border border-blue-200/80 p-6 sm:p-7 flex flex-col justify-between shadow-xs min-h-[220px]">
          {/* Stepping podiums 3D illustration on right */}
          <div className="absolute right-0 top-0 bottom-0 w-2/5 sm:w-1/2 pointer-events-none overflow-hidden select-none">
            <img
              src="/assets/roadmap-hero-steps.jpg"
              alt="Roadmap progression journey"
              className="w-full h-full object-cover object-left opacity-90 mix-blend-multiply"
              style={{
                maskImage: "linear-gradient(to right, transparent, black 35%)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 35%)",
              }}
            />
            {/* Overlay Your Journey Checklist badge */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs border border-blue-100/90 rounded-xl p-2.5 shadow-2xs hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Your Journey</p>
              <div className="space-y-0.5 text-[10px] font-bold text-slate-700">
                <p className="flex items-center gap-1 text-emerald-600">✓ Stronger Concepts</p>
                <p className="flex items-center gap-1 text-emerald-600">✓ Better Problem Solving</p>
                <p className="flex items-center gap-1 text-emerald-600">✓ Placement Ready</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-md">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase tracking-wider mb-2">
              <span>🤖</span> AI-Powered Learning Roadmap
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
              {activeSubject} Adaptive Study Planner
            </h1>
            <p className="text-xs font-semibold text-slate-800 mt-1">
              Your personalized learning path based on your goals, current level, and exam date.
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
              Master {activeSubject} step by step with AI guidance, practice and quizzes.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 mt-6 flex-wrap">
            <button
              onClick={() => setShowSetupModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm active:scale-98"
            >
              <span>Plan Setup & Goals</span>
              <span className="text-sm">→</span>
            </button>
            <button
              id="roadmap-regenerate-btn"
              onClick={() => handleGeneratePlanner()}
              disabled={generating || loading}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-bold transition-all shadow-2xs hover:border-slate-300 disabled:opacity-50 active:scale-98"
            >
              <span>✨</span>
              <span>{generating ? "Generating..." : "Re-generate Plan"}</span>
            </button>
          </div>
        </div>

        {/* Right Card: Your Goal (~28% width) */}
        <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Your Goal
              </h2>
              <button
                onClick={() => setShowSetupModal(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            </div>

            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0 text-base">
                🎯
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 leading-tight">
                  {setupForm.examGoal}
                </p>
                <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold mt-1">
                  Target Score: {setupForm.targetScore}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <span>📅</span> Exam Date
                </span>
                <span className="font-extrabold text-slate-800">{setupForm.examDate}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <span>🕒</span> Daily Study Time
                </span>
                <span className="font-extrabold text-slate-800">{setupForm.availableHoursPerDay} Hours</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <span>📊</span> Current Level
                </span>
                <span className="font-extrabold text-slate-800">{setupForm.skillLevel}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <span>🌅</span> Preferred Slot
                </span>
                <span className="font-extrabold text-slate-800">{setupForm.preferredStudyTime}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ──────────────────────────────────────────────────────────────────────
          2. HORIZONTAL SUBJECT SELECTOR (RIBBON)
      ────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">
            SELECT SUBJECT
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => scrollRibbon("left")}
              className="w-7 h-7 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center text-xs font-bold transition-all shadow-2xs"
              aria-label="Scroll left"
            >
              ‹
            </button>
            <button
              onClick={() => scrollRibbon("right")}
              className="w-7 h-7 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center text-xs font-bold transition-all shadow-2xs"
              aria-label="Scroll right"
            >
              ›
            </button>
          </div>
        </div>

        <div
          ref={ribbonRef}
          className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none snap-x"
        >
          {SUBJECTS_RIBBON.map((sub) => {
            const isSelected = activeSubject.toLowerCase() === sub.id.toLowerCase();
            return (
              <button
                key={sub.id}
                onClick={() => handleSubjectChange(sub.id)}
                className={`w-[170px] sm:w-[190px] p-3.5 rounded-2xl border text-left shrink-0 transition-all select-none snap-start flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-[#0f172a] text-white border-slate-900 shadow-md scale-[1.02]"
                    : "bg-white text-slate-800 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg shrink-0">{sub.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-black tracking-tight truncate leading-tight">
                      {sub.name}
                    </p>
                    <p className={`text-[10px] font-medium leading-none mt-1 ${isSelected ? "text-slate-400" : "text-slate-400"}`}>
                      {sub.goals} Goals
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <span className="text-xs text-white/80 font-bold shrink-0">→</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────
          3. ROADMAP OVERVIEW (4 SUMMARY CARDS)
      ────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Overall Progress */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 flex items-center gap-4 shadow-2xs hover:border-slate-300 transition-all">
          <CircularProgress value={overallProgressPercent} size={50} strokeWidth={5} strokeColor="#3b82f6" />
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Progress</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              <strong className="text-slate-900 font-extrabold">{completedGoals} of {totalGoals}</strong> Goals Completed
            </p>
          </div>
        </div>

        {/* Card 2: Time Remaining */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time Remaining</p>
              <p className="text-xl font-black text-slate-900 tracking-tight mt-0.5">{daysRemaining} Days</p>
              <p className="text-[10px] text-slate-400 font-medium">Until Target Exam Date</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              📅
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: "65%" }} />
          </div>
        </div>

        {/* Card 3: Daily Allocation */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 flex items-center justify-between shadow-2xs hover:border-slate-300 transition-all">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 text-xs">
                🕒
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Allocation</span>
            </div>
            <p className="text-xl font-black text-slate-900 tracking-tight pt-0.5">
              {setupForm.availableHoursPerDay} Hrs / Day
            </p>
            <p className="text-[10px] text-slate-400 font-medium">Preferred Slot: Evening</p>
          </div>
          <button onClick={() => setShowSetupModal(true)} className="text-slate-400 hover:text-blue-600 text-xs">
            ✎
          </button>
        </div>

        {/* Card 4: AI Readiness Estimate */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Readiness Estimate</span>
                <span className="text-[10px] text-slate-400">ⓘ</span>
              </div>
              <p className="text-xl font-black text-slate-900 tracking-tight mt-0.5">36 / 100</p>
              <p className="text-[10px] text-slate-400 font-medium">Current Level: {setupForm.skillLevel}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
              🎯
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: "36%" }} />
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────
          4. MAIN ROADMAP VISUALIZER COMPONENT
      ────────────────────────────────────────────────────────────────────── */}
      <div id="visual-roadmap-container">
        {loading ? (
          <div className="min-h-[350px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-600">Synthesizing {activeSubject} adaptive study plan...</p>
          </div>
        ) : (
          <RoadmapVisualizer
            roadmap={roadmap}
            onRoadmapUpdated={(updated) => setRoadmap(updated)}
            onRegenerate={() => handleGeneratePlanner()}
            onReschedule={handleReschedule}
            onOpenSetup={() => setShowSetupModal(true)}
            generating={generating}
            rescheduling={rescheduling}
            daysRemaining={daysRemaining}
          />
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────────────────
          5. SETUP & GOAL CONFIGURATION MODAL
      ────────────────────────────────────────────────────────────────────── */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  ⚙️ Dynamic AI Planner Setup
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Configure your exam goals and daily availability for {activeSubject}.
                </p>
              </div>
              <button
                onClick={() => setShowSetupModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGeneratePlanner();
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Target / Exam Goal
                </label>
                <input
                  type="text"
                  value={setupForm.examGoal}
                  onChange={(e) => setSetupForm({ ...setupForm, examGoal: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Target Exam Date
                  </label>
                  <input
                    type="date"
                    value={setupForm.examDate}
                    onChange={(e) => setSetupForm({ ...setupForm, examDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Hours / Day
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={setupForm.availableHoursPerDay}
                    onChange={(e) => setSetupForm({ ...setupForm, availableHoursPerDay: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Current Skill Level
                  </label>
                  <select
                    value={setupForm.skillLevel}
                    onChange={(e) => setSetupForm({ ...setupForm, skillLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Preferred Study Slot
                  </label>
                  <select
                    value={setupForm.preferredStudyTime}
                    onChange={(e) => setSetupForm({ ...setupForm, preferredStudyTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="Morning (6 AM - 10 AM)">Morning (6 AM - 10 AM)</option>
                    <option value="Afternoon (1 PM - 5 PM)">Afternoon (1 PM - 5 PM)</option>
                    <option value="Evening (6 PM - 10 PM)">Evening (6 PM - 10 PM)</option>
                    <option value="Night (10 PM - 2 AM)">Night (10 PM - 2 AM)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={generating}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  {generating ? "Synthesizing Plan..." : "Generate AI Adaptive Plan →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RoadmapPage;
