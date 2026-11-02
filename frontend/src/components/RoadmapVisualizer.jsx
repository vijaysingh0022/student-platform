import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updatePlanDayStatus } from "../services/api.js";
import { useAppState } from "../context/AppStateContext.jsx";

// ── Small Circular Progress Ring ─────────────────────────────────────────────
const SmallRing = ({ value = 0, size = 48, strokeWidth = 4.5, strokeColor = "#3b82f6" }) => {
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

// ── Topic Mastery default topics for CSE subjects ────────────────────────────
const TOPIC_MASTERY_MAP = {
  DSA: [
    { name: "Arrays", score: 0 },
    { name: "Linked Lists", score: 0 },
    { name: "Stacks & Queues", score: 0 },
    { name: "Trees", score: 0 },
    { name: "Graphs", score: 0 },
    { name: "Dynamic Programming", score: 0 },
    { name: "Sorting & Searching", score: 0 },
    { name: "Hashing", score: 0 },
    { name: "Recursion & Backtracking", score: 0 },
    { name: "Greedy Algorithms", score: 0 },
  ],
  DBMS: [
    { name: "ER & Relational Model", score: 42 },
    { name: "SQL & Joins", score: 23 },
    { name: "Normalization (1NF-BCNF)", score: 50 },
    { name: "Indexing & B+ Trees", score: 35 },
    { name: "Transactions & ACID", score: 60 },
    { name: "Concurrency Control", score: 40 },
    { name: "NoSQL Systems", score: 30 },
  ],
  OS: [
    { name: "Process & Threads", score: 55 },
    { name: "CPU Scheduling", score: 65 },
    { name: "Deadlocks & Semaphores", score: 45 },
    { name: "Memory Management", score: 50 },
    { name: "Virtual Memory & Paging", score: 40 },
    { name: "File Systems", score: 60 },
  ],
  CN: [
    { name: "OSI & TCP/IP", score: 68 },
    { name: "Data Link Layer", score: 50 },
    { name: "Routing Protocols", score: 51 },
    { name: "Transport Layer & TCP", score: 60 },
    { name: "Application Protocols", score: 70 },
    { name: "Network Security", score: 45 },
  ],
};

export const RoadmapVisualizer = ({
  roadmap,
  onRoadmapUpdated,
  onRegenerate,
  onReschedule,
  onOpenSetup,
  generating,
  rescheduling,
  daysRemaining,
}) => {
  const navigate = useNavigate();
  const { onRoadmapDayToggled } = useAppState();

  const [filter, setFilter] = useState("all"); // 'all' | 'remaining' | 'completed'
  const [expandedDays, setExpandedDays] = useState({ 1: true, 2: true });
  const [copied, setCopied] = useState(false);
  const [updatingDay, setUpdatingDay] = useState(null);

  if (!roadmap || !roadmap.days || roadmap.days.length === 0) {
    return null;
  }

  const days = roadmap.days;
  const completedCount = days.filter((d) => d.completed || d.status === "completed").length;
  const totalDays = days.length;
  const progressPercent = Math.round((completedCount / totalDays) * 100);
  const remainingCount = totalDays - completedCount;

  // Identify Today's Goal (first in-progress or non-completed day)
  const todaysGoal =
    days.find((d) => d.status === "in-progress") ||
    days.find((d) => !d.completed && d.status !== "skipped") ||
    days[0];

  const filteredDays = days.filter((day) => {
    if (filter === "remaining") return !day.completed && day.status !== "completed";
    if (filter === "completed") return day.completed || day.status === "completed";
    return true;
  });

  const toggleDayExpanded = (dayNum) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  const expandAll = () => {
    const all = {};
    days.forEach((d) => {
      all[d.day] = true;
    });
    setExpandedDays(all);
  };

  const handleCopySummary = () => {
    const text =
      `# LearnX AI Study Plan: ${roadmap.subject}\n` +
      `Goal: ${roadmap.examGoal || "GATE & Placement Prep"} | Target Date: ${roadmap.examDate ? new Date(roadmap.examDate).toLocaleDateString() : "2026-10-15"}\n\n` +
      roadmap.days
        .map(
          (d) =>
            `## Day ${d.day} (${d.date || "Scheduled"}): ${d.title} [${d.duration || "45m"}] - Status: ${d.status?.toUpperCase() || "PENDING"}\n` +
            `- Pipeline: ${(d.pipeline || ["Learn", "Practice", "Quiz"]).join(" → ")}\n` +
            `- Concepts: ${(d.keyConcepts || []).join(", ")}\n`
        )
        .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = async (dayNum, status) => {
    if (!roadmap?._id) return;
    setUpdatingDay(dayNum);
    try {
      const { data } = await updatePlanDayStatus(roadmap._id, dayNum, status, "good");
      if (onRoadmapUpdated) onRoadmapUpdated(data);
      onRoadmapDayToggled(roadmap.subject, data);
    } catch (err) {
      console.error("Failed to update day status:", err);
    } finally {
      setUpdatingDay(null);
    }
  };

  // Get topic mastery items
  const masteryItems = TOPIC_MASTERY_MAP[roadmap.subject] || TOPIC_MASTERY_MAP.DSA;

  return (
    <div className="space-y-6">

      {/* ──────────────────────────────────────────────────────────────────────
          TOP FILTER & ACTION BUTTONS BAR
      ────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        {/* Left Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
              filter === "all"
                ? "bg-blue-600 text-white shadow-xs font-black"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            All Goals ({totalDays})
          </button>
          <button
            onClick={() => setFilter("remaining")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
              filter === "remaining"
                ? "bg-blue-600 text-white shadow-xs font-black"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            Remaining ({remainingCount})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
              filter === "completed"
                ? "bg-blue-600 text-white shadow-xs font-black"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onReschedule}
            disabled={rescheduling}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs disabled:opacity-50"
          >
            <span>📅</span>
            <span>{rescheduling ? "Recalculating..." : "Reschedule Missed Days"}</span>
          </button>

          <button
            onClick={expandAll}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <span>⤢</span>
            <span>Expand All</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <span>📄</span>
            <span>{copied ? "Copied!" : "Copy Plan"}</span>
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────
          MAIN TWO-COLUMN GRID: TIMELINE ON LEFT, INSIGHTS ON RIGHT
      ────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ── LEFT COLUMN: VERTICAL ROADMAP TIMELINE (~70%) ── */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative pl-7 sm:pl-9 space-y-4 before:absolute before:left-3.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-indigo-300">
            {filteredDays.map((day) => {
              const isCompleted = day.completed || day.status === "completed";
              const isInProgress = day.status === "in-progress" || day.day === todaysGoal?.day;
              const isExpanded = !!expandedDays[day.day];

              // Priority pill styling
              const priority = day.priority || (day.day <= 2 ? "High Priority" : day.day <= 5 ? "Foundation" : "Important");
              const priorityClass =
                priority === "High Priority"
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : priority === "Foundation"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200";

              return (
                <div key={day.day} className="relative group">
                  {/* Circular Timeline Node */}
                  <div
                    className={`absolute -left-7 sm:-left-9 top-4 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${
                      isCompleted
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-xs"
                        : isInProgress
                        ? "bg-white border-indigo-600 text-indigo-700 font-extrabold ring-4 ring-indigo-100 shadow-xs"
                        : "bg-white border-indigo-300 text-indigo-600"
                    }`}
                  >
                    {isCompleted ? "✓" : day.day}
                  </div>

                  {/* Goal Card Container */}
                  <div
                    className={`rounded-2xl border transition-all p-5 shadow-2xs bg-white ${
                      isInProgress
                        ? "border-indigo-200/90 ring-1 ring-indigo-100"
                        : "border-slate-200/90 hover:border-slate-300"
                    }`}
                  >
                    {/* Header Row */}
                    <div
                      onClick={() => toggleDayExpanded(day.day)}
                      className="cursor-pointer flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-100"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-[#0f172a] text-white text-[10px] font-black">
                          Day {day.day}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                          <span>📅</span> {day.date || `2026-10-${String(13 + day.day).padStart(2, "0")}`}
                        </span>
                        <h3 className="text-sm font-black text-slate-900 tracking-tight">
                          {day.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${priorityClass}`}>
                          {priority}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Not Started"}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                          <span>🕒</span> {day.duration || "45 min"}
                        </span>
                        <span className={`text-slate-400 text-xs transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                          ▼
                        </span>
                      </div>
                    </div>

                    {/* Narrative Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
                      {day.description || `Build strong foundation with ${day.title}, input-output, and basic problem solving.`}
                    </p>

                    {/* Learning Flow & Key Concepts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
                      {/* Learning Flow */}
                      <div className="md:col-span-5 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Learning Flow:
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">❶ Learn</span>
                          <span className="text-slate-300">→</span>
                          <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">❷ Practice</span>
                          <span className="text-slate-300">→</span>
                          <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700">❸ Quiz</span>
                        </div>
                      </div>

                      {/* Key Concepts */}
                      <div className="md:col-span-7 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Key Concepts:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(day.keyConcepts && day.keyConcepts.length > 0
                            ? day.keyConcepts
                            : ["Basics", "Traversal", "Time Complexity", "Common Patterns"]
                          ).map((concept, ci) => (
                            <span
                              key={ci}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content with Action Buttons */}
                    {isExpanded && (
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                        {day.actionItem && (
                          <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 flex items-start gap-2">
                            <span className="font-bold text-indigo-600">Action Item:</span>
                            <span>{day.actionItem}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/learn/${roadmap.subject?.toLowerCase() || "dsa"}`}
                              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                            >
                              Start Learning →
                            </Link>
                            <Link
                              to={`/tutor?topic=${encodeURIComponent(day.title)}`}
                              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-2xs"
                            >
                              💬 Ask AI Tutor
                            </Link>
                          </div>

                          {/* Status Toggle Button */}
                          <button
                            onClick={() => handleStatusChange(day.day, isCompleted ? "not-started" : "completed")}
                            disabled={updatingDay === day.day}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                              isCompleted
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 border-slate-200"
                            }`}
                          >
                            {updatingDay === day.day
                              ? "Updating..."
                              : isCompleted
                              ? "✓ Mark Incomplete"
                              : "Mark Complete"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT COLUMN: INSIGHTS & MASTERY (~30%) ── */}
        <div className="lg:col-span-4 space-y-4">

          {/* Card 1: Today's Goal (Day 2) */}
          {todaysGoal && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Today's Goal (Day {todaysGoal.day})
                </h3>
                <span
                  onClick={() => {
                    const el = document.getElementById("visual-roadmap-container");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  View Plan
                </span>
              </div>

              <div className="flex items-center gap-4">
                <SmallRing value={progressPercent} size={54} strokeWidth={5} strokeColor="#3b82f6" />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                    {todaysGoal.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-medium">
                    <span>🕒 {todaysGoal.duration || "45 minutes"}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-bold">Complete all 3 steps</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/learn/${roadmap.subject?.toLowerCase() || "dsa"}`}
                className="w-full block py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center transition-all shadow-xs"
              >
                Start Learning →
              </Link>
            </div>
          )}

          {/* Card 2: AI Recommendation */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                🤖
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                AI Recommendation
              </h3>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed font-medium">
              <span className="text-amber-500 text-base mt-0.5">💡</span>
              <p>
                {roadmap.aiRecommendation ||
                  `You are currently focusing on Day ${todaysGoal?.day || 2}: ${todaysGoal?.title || "Linked Lists"}. Since this is a fundamental topic, make sure to complete the practice questions and quiz to build a strong foundation.`}
              </p>
            </div>
          </div>

          {/* Card 3: Topic Mastery (Subject) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Topic Mastery ({roadmap.subject})
              </h3>
              <Link to="/skill-graph" className="text-xs font-bold text-blue-600 hover:text-blue-800">
                View Details
              </Link>
            </div>

            <div className="space-y-2.5 pt-1">
              {masteryItems.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-700">{item.name}</span>
                    <span className="text-slate-400 text-[10px] font-medium">{item.score}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Learning Streak */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 border border-orange-100 flex items-center justify-center text-xl shrink-0">
                🔥
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Learning Streak</p>
                <p className="text-base font-black text-slate-900 tracking-tight">0 Days</p>
                <p className="text-[10px] text-slate-400">Keep learning consistently!</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span
                  key={i}
                  className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    i === 3 ? "bg-blue-600 text-white border-blue-600 font-black" : "border-slate-200 bg-slate-50"
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default RoadmapVisualizer;
