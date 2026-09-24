import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePlanDayStatus } from "../services/api.js";
import { useAppState } from "../context/AppStateContext.jsx";

const RoadmapVisualizer = ({
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
  const [filter, setFilter] = useState("all"); // 'all' | 'active' | 'completed'
  const [expandedDays, setExpandedDays] = useState({ 1: true });
  const [copied, setCopied] = useState(false);
  const [updatingDay, setUpdatingDay] = useState(null);

  // Performance Rating Modal State on Completing a Day
  const [completingDayItem, setCompletingDayItem] = useState(null);

  if (!roadmap || !roadmap.days || roadmap.days.length === 0) {
    return null;
  }

  const days = roadmap.days;
  const completedCount = days.filter((d) => d.completed || d.status === "completed").length;
  const totalDays = days.length;
  const progressPercent = Math.round((completedCount / totalDays) * 100);

  // Identify Today's Goal (first non-completed and non-skipped day, or day with status 'in-progress')
  const todaysGoal =
    days.find((d) => d.status === "in-progress") ||
    days.find((d) => !d.completed && d.status !== "skipped") ||
    days[days.length - 1];

  const filteredDays = days.filter((day) => {
    if (filter === "active") return !day.completed && day.status !== "skipped";
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

  const collapseAll = () => {
    setExpandedDays({});
  };

  // Status Action Handlers: Start, Pause, Complete, Skip
  const handleStatusChange = async (dayNum, status, performanceRating = "good") => {
    if (!roadmap?._id) return;
    setUpdatingDay(dayNum);
    try {
      const { data } = await updatePlanDayStatus(roadmap._id, dayNum, status, performanceRating);
      if (onRoadmapUpdated) {
        onRoadmapUpdated(data);
      }
      onRoadmapDayToggled(roadmap.subject, data);
    } catch (err) {
      console.error("Failed to update day status:", err);
    } finally {
      setUpdatingDay(null);
      setCompletingDayItem(null);
    }
  };

  const handleAskTutor = (e, day) => {
    e.stopPropagation();
    const query = `I am studying Day ${day.day} of my ${roadmap.subject} study planner: "${day.title}". Can you explain: ${day.keyConcepts?.join(", ")}? Also give me guidance on doing: "${day.actionItem}"`;
    navigate(`/tutor?q=${encodeURIComponent(query)}&subject=${encodeURIComponent(roadmap.subject)}`);
  };

  const handleCopySummary = () => {
    const text =
      `# Dynamic AI Study Plan: ${roadmap.subject}\n` +
      `Exam Goal: ${roadmap.examGoal || "General"} | Target Date: ${roadmap.examDate ? new Date(roadmap.examDate).toLocaleDateString() : "TBD"}\n` +
      `AI Recommendation: ${roadmap.aiRecommendation}\n\n` +
      roadmap.days
        .map(
          (d) =>
            `## Day ${d.day} (${d.date || "Scheduled"}): ${d.title} [${d.duration || "45m"}] - Status: ${d.status.toUpperCase()}\n` +
            `- **Pipeline**: ${d.pipeline?.join(" → ")}\n` +
            `- **Concepts**: ${d.keyConcepts?.join(", ")}\n` +
            `- **Action Item**: ${d.actionItem}\n` +
            `- **Pro Tip**: ${d.proTip}\n`
        )
        .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200", label: "Completed ✓" };
      case "in-progress":
        return { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", label: "In Progress ⚡" };
      case "paused":
        return { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200", label: "Paused ⏸️" };
      case "skipped":
        return { bg: "bg-slate-100", text: "text-slate-500", border: "border-slate-200", label: "Skipped ⏭️" };
      default:
        return { bg: "bg-violet-100", text: "text-violet-800", border: "border-violet-200", label: "Not Started" };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="visual-roadmap-container">
      {/* 🌟 TODAY'S GOAL SPOTLIGHT HERO CARD */}
      {todaysGoal && (
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 z-10 relative">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-violet-600 text-white shadow-xs">
                  📌 TODAY'S GOAL (DAY {todaysGoal.day})
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-slate-300 border border-white/10">
                  ⏱️ {todaysGoal.duration || "45 min"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-slate-300 border border-white/10">
                  📅 {todaysGoal.date || "Today"}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {todaysGoal.title}
              </h2>

              {/* Learning Pipeline */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wide">
                  Learning Flow:
                </span>
                {(todaysGoal.pipeline || ["Learn", "Practice", "Quiz"]).map((step, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {idx + 1}. {step}
                    </span>
                    {idx < (todaysGoal.pipeline || []).length - 1 && (
                      <span className="text-xs text-slate-500">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-2xl pt-1">
                {todaysGoal.actionItem}
              </p>
            </div>

            {/* Interactive Goal Controls: Start, Pause, Complete, Skip */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 z-10 flex-shrink-0 min-w-[200px]">
              {todaysGoal.status !== "completed" && (
                <>
                  {todaysGoal.status === "in-progress" ? (
                    <button
                      onClick={() => handleStatusChange(todaysGoal.day, "paused")}
                      disabled={updatingDay === todaysGoal.day}
                      className="px-4 py-3 rounded-2xl text-xs font-black bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      ⏸️ Pause Session
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(todaysGoal.day, "in-progress")}
                      disabled={updatingDay === todaysGoal.day}
                      className="px-4 py-3 rounded-2xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      ▶️ Start Goal
                    </button>
                  )}

                  <button
                    onClick={() => setCompletingDayItem(todaysGoal)}
                    disabled={updatingDay === todaysGoal.day}
                    className="btn-gradient px-4 py-3 rounded-2xl text-xs font-black text-white flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    ✓ Complete Goal
                  </button>

                  <button
                    onClick={() => handleStatusChange(todaysGoal.day, "skipped")}
                    disabled={updatingDay === todaysGoal.day}
                    className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-all"
                  >
                    ⏭️ Skip Topic
                  </button>
                </>
              )}

              {todaysGoal.status === "completed" && (
                <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-center space-y-1">
                  <div className="text-sm">🎉 Goal Completed!</div>
                  <p className="text-[11px] text-emerald-300 font-semibold">Great work! Check upcoming goals below.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🧠 AI RECOMMENDATION & PACING DISPLAY */}
      {roadmap.aiRecommendation && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-violet-50 via-sky-50 to-emerald-50 border border-violet-200 shadow-xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center text-lg font-black flex-shrink-0 shadow-xs">
            🤖
          </div>
          <div className="space-y-1 flex-1">
            <h4 className="text-xs font-black text-violet-900 uppercase tracking-wide">
              AI Recommendation & Adaptive Insights:
            </h4>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              {roadmap.aiRecommendation}
            </p>
          </div>
        </div>
      )}

      {/* SUMMARY STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progress % */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Progress</div>
          <div className="text-2xl font-black text-violet-700">{progressPercent}%</div>
          <p className="text-[11px] text-slate-600 font-semibold">{completedCount} of {totalDays} Goals Completed</p>
        </div>

        {/* Time Remaining */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Time Remaining</div>
          <div className="text-2xl font-black text-slate-900">
            {daysRemaining !== null ? `${daysRemaining} Days` : "14 Days"}
          </div>
          <p className="text-[11px] text-slate-600 font-semibold">Until Target Exam Date</p>
        </div>

        {/* Daily Study Time */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Daily Allocation</div>
          <div className="text-2xl font-black text-sky-700">
            {roadmap.availableHoursPerDay || 2} Hrs / Day
          </div>
          <p className="text-[11px] text-slate-600 font-semibold">Preferred Slot: {roadmap.preferredStudyTime || "Evening"}</p>
        </div>

        {/* Target Goal */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Exam Goal</div>
          <div className="text-base font-black text-slate-900 truncate">
            {roadmap.examGoal || "Placement Prep"}
          </div>
          <p className="text-[11px] text-emerald-700 font-bold">Target Score: {roadmap.targetScore || "90%"}</p>
        </div>
      </div>

      {/* ACTION BAR & FILTER TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
          {[
            { id: "all", label: `All Goals (${totalDays})` },
            { id: "active", label: `Remaining (${totalDays - completedCount})` },
            { id: "completed", label: `Completed (${completedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                filter === tab.id
                  ? "bg-violet-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onReschedule && (
            <button
              onClick={onReschedule}
              disabled={rescheduling}
              className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-slate-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-all flex items-center gap-1.5"
            >
              {rescheduling ? "🗓️ Rescheduling..." : "🗓️ Reschedule Missed Days"}
            </button>
          )}

          <button
            onClick={Object.keys(expandedDays).length >= totalDays ? collapseAll : expandAll}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
          >
            {Object.keys(expandedDays).length >= totalDays ? "📁 Collapse All" : "📂 Expand All"}
          </button>

          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-1.5"
          >
            {copied ? "✓ Copied" : "📋 Copy Plan"}
          </button>
        </div>
      </div>

      {/* UPCOMING & ALL GOALS TIMELINE */}
      <div className="relative pl-6 md:pl-8 space-y-6">
        <div
          className="absolute left-3 md:left-4 top-4 bottom-4 w-0.5"
          style={{
            background: "linear-gradient(180deg, #7c3aed 0%, #0ea5e9 50%, rgba(124,58,237,0.2) 100%)",
          }}
        />

        {filteredDays.length === 0 ? (
          <div className="p-8 text-center ml-2 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-500">
              No goals match the "{filter}" filter.
            </p>
          </div>
        ) : (
          filteredDays.map((day) => {
            const isExpanded = !!expandedDays[day.day];
            const isUpdating = updatingDay === day.day;
            const badge = getStatusBadge(day.status);

            return (
              <div key={day.day} className="relative group transition-all duration-300">
                {/* Node icon */}
                <button
                  onClick={() => setCompletingDayItem(day)}
                  disabled={isUpdating}
                  className="absolute -left-6 md:-left-8 top-4 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 text-white shadow-xs"
                  style={{
                    background: day.completed || day.status === "completed"
                      ? "linear-gradient(135deg, #059669, #0ea5e9)"
                      : day.status === "in-progress"
                      ? "#2563eb"
                      : "#ffffff",
                    border: day.completed || day.status === "completed"
                      ? "2px solid #059669"
                      : "2px solid #7c3aed",
                    color: day.completed || day.status === "completed" || day.status === "in-progress" ? "#ffffff" : "#7c3aed",
                  }}
                >
                  {isUpdating ? (
                    <span className="animate-spin text-[10px]">⏳</span>
                  ) : day.completed || day.status === "completed" ? (
                    "✓"
                  ) : (
                    <span className="text-[10px] font-bold">{day.day}</span>
                  )}
                </button>

                {/* Day Card */}
                <div
                  onClick={() => toggleDayExpanded(day.day)}
                  className={`rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden bg-white border shadow-xs hover:shadow-md ${
                    day.completed || day.status === "completed"
                      ? "border-emerald-300 bg-emerald-50/20"
                      : day.status === "in-progress"
                      ? "border-blue-400 bg-blue-50/20"
                      : isExpanded
                      ? "border-violet-300 bg-violet-50/20"
                      : "border-slate-200"
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 md:p-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-slate-900 text-white border border-slate-900">
                        DAY {day.day < 10 ? `0${day.day}` : day.day}
                      </span>

                      <span className="text-xs font-bold text-slate-500">
                        📅 {day.date || `Day ${day.day}`}
                      </span>

                      <h4
                        className={`text-base font-extrabold transition-colors ${
                          day.completed || day.status === "completed" ? "line-through text-slate-400" : "text-slate-900"
                        }`}
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {day.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Status Badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                        {badge.label}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold hidden sm:inline-block bg-slate-100 border border-slate-200 text-slate-700">
                        ⏱️ {day.duration || "45m"}
                      </span>

                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs transition-transform duration-300 bg-slate-100 text-slate-600 ${
                          isExpanded ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Expandable Content Area */}
                  {isExpanded && (
                    <div className="px-4 pb-5 md:px-5 md:pb-5 space-y-4 pt-2 border-t border-slate-100">
                      {/* Learning Pipeline */}
                      <div>
                        <p className="text-xs font-extrabold mb-1 text-slate-500 uppercase tracking-wide">
                          Pipeline Stage:
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {(day.pipeline || ["Learn", "Practice", "Quiz"]).map((pStep, pIdx) => (
                            <span
                              key={pIdx}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-violet-100 text-violet-800 border border-violet-200"
                            >
                              {pStep}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Key Concepts */}
                      {day.keyConcepts && day.keyConcepts.length > 0 && (
                        <div>
                          <p className="text-xs font-extrabold mb-1.5 text-violet-800">
                            📚 KEY CONCEPTS:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {day.keyConcepts.map((concept, cIdx) => (
                              <span
                                key={cIdx}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-50 border border-violet-200 text-violet-900"
                              >
                                🔹 {concept}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Item */}
                      {day.actionItem && (
                        <div className="rounded-xl p-3.5 bg-sky-50 border border-sky-200">
                          <div className="flex items-start gap-2.5">
                            <span className="text-lg flex-shrink-0 mt-0.5">🎯</span>
                            <div>
                              <p className="text-xs font-extrabold tracking-wide mb-1 text-sky-800">
                                DAILY MISSION:
                              </p>
                              <p className="text-xs leading-relaxed text-slate-800 font-medium">
                                {day.actionItem}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Pro Tip */}
                      {day.proTip && (
                        <div className="rounded-xl p-3.5 bg-amber-50 border border-amber-200">
                          <div className="flex items-start gap-2.5">
                            <span className="text-lg flex-shrink-0 mt-0.5">💡</span>
                            <div>
                              <p className="text-xs font-extrabold tracking-wide mb-0.5 text-amber-800">
                                EXAM & INTERVIEW TIP:
                              </p>
                              <p className="text-xs leading-relaxed text-slate-800 font-medium">
                                {day.proTip}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Card Action Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {day.status !== "in-progress" && day.status !== "completed" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(day.day, "in-progress");
                              }}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                            >
                              ▶️ Start
                            </button>
                          )}

                          {day.status === "in-progress" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(day.day, "paused");
                              }}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 shadow-xs"
                            >
                              ⏸️ Pause
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCompletingDayItem(day);
                            }}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                          >
                            ✓ Mark Complete
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(day.day, "skipped");
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                          >
                            ⏭️ Skip
                          </button>
                        </div>

                        <button
                          onClick={(e) => handleAskTutor(e, day)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white btn-gradient flex items-center gap-1.5 shadow-xs"
                        >
                          🤖 Ask AI Tutor About Day {day.day} →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PERFORMANCE FEEDBACK MODAL ON COMPLETING A GOAL */}
      {completingDayItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="text-center space-y-2">
              <div className="text-3xl">🎯</div>
              <h3 className="text-lg font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Goal Performance Feedback
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                How did you perform on <strong>Day {completingDayItem.day}: {completingDayItem.topic}</strong>?
                The AI will use this feedback to adapt your upcoming schedule.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleStatusChange(completingDayItem.day, "completed", "mastered")}
                className="w-full p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-extrabold flex items-center justify-between transition-all"
              >
                <span>🌟 Fully Mastered</span>
                <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded-full">Accelerate Plan</span>
              </button>

              <button
                onClick={() => handleStatusChange(completingDayItem.day, "completed", "good")}
                className="w-full p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-900 text-xs font-extrabold flex items-center justify-between transition-all"
              >
                <span>👍 Good / Solved Pipeline</span>
                <span className="text-[10px] bg-blue-200 px-2 py-0.5 rounded-full">On Track</span>
              </button>

              <button
                onClick={() => handleStatusChange(completingDayItem.day, "completed", "poor")}
                className="w-full p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold flex items-center justify-between transition-all"
              >
                <span>⚠️ Struggle / Low Quiz Score</span>
                <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded-full">+Add Revision</span>
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setCompletingDayItem(null)}
                className="text-xs text-slate-500 font-bold hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapVisualizer;
