import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

const RoadmapVisualizer = ({ roadmap, onRoadmapUpdated, onRegenerate, generating }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // 'all' | 'active' | 'completed'
  const [expandedDays, setExpandedDays] = useState({ 1: true });
  const [copied, setCopied] = useState(false);
  const [togglingDay, setTogglingDay] = useState(null);

  if (!roadmap || !roadmap.days || roadmap.days.length === 0) {
    return null;
  }

  const days = roadmap.days;
  const completedCount = days.filter((d) => d.completed).length;
  const totalDays = days.length;
  const progressPercent = Math.round((completedCount / totalDays) * 100);

  const filteredDays = days.filter((day) => {
    if (filter === "active") return !day.completed;
    if (filter === "completed") return day.completed;
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

  const handleToggleComplete = async (e, dayNum) => {
    e.stopPropagation();
    if (!roadmap?._id) return;
    setTogglingDay(dayNum);
    try {
      const { data } = await api.patch(`/roadmap/${roadmap._id}/toggle-day`, {
        dayNumber: dayNum,
      });
      if (onRoadmapUpdated) {
        onRoadmapUpdated(data);
      }
    } catch (err) {
      console.error("Failed to toggle day:", err);
    } finally {
      setTogglingDay(null);
    }
  };

  const handleAskTutor = (e, day) => {
    e.stopPropagation();
    const query = `I am studying Day ${day.day} of my ${roadmap.subject} roadmap: "${day.title}". Can you explain: ${day.keyConcepts?.join(", ")}? Also give me guidance on doing: "${day.actionItem}"`;
    navigate(`/tutor?q=${encodeURIComponent(query)}&subject=${encodeURIComponent(roadmap.subject)}`);
  };

  const handleCopySummary = () => {
    const text = `# 7-Day Study Roadmap: ${roadmap.subject}\n\n${roadmap.overview}\n\n` +
      roadmap.days
        .map(
          (d) =>
            `## Day ${d.day}: ${d.title} (${d.difficulty} | ${d.duration}) [${d.completed ? "COMPLETED" : "PENDING"}]\n` +
            `- **Concepts**: ${d.keyConcepts.join(", ")}\n` +
            `- **Action Item**: ${d.actionItem}\n` +
            `- **Pro Tip**: ${d.proTip}\n`
        )
        .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyBadge = (diff) => {
    const d = (diff || "Intermediate").toLowerCase();
    if (d.includes("begin")) {
      return {
        bg: "#d1fae5",
        border: "#a7f3d0",
        text: "#047857",
        label: "Beginner",
      };
    }
    if (d.includes("adv")) {
      return {
        bg: "#fce7f3",
        border: "#fbcfe8",
        text: "#be185d",
        label: "Advanced",
      };
    }
    return {
      bg: "#fef3c7",
      border: "#fde68a",
      text: "#b45309",
      label: "Intermediate",
    };
  };

  return (
    <div className="space-y-6 animate-fade-in" id="visual-roadmap-container">
      {/* Overview & Progress Hero Card */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden bg-gradient-to-r from-violet-100/80 via-purple-50 to-sky-100/80 border border-violet-200 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-violet-600 text-white shadow-xs">
                🎯 7-DAY ACCELERATOR
              </span>
              <span className="text-xs font-semibold text-slate-600">
                Targeting: {roadmap.weakTopics?.join(", ")}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {roadmap.subject} Mastery Blueprint
            </h3>
            <p className="text-sm leading-relaxed text-slate-700 font-medium">
              {roadmap.overview || `Custom step-by-step path designed to turn your weak topics into strong foundations.`}
            </p>
          </div>

          {/* Progress Tracker Card */}
          <div
            className="flex-shrink-0 rounded-xl p-4 flex items-center gap-4 min-w-[220px] bg-white border border-slate-200 shadow-sm"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0"
              style={{
                background: `conic-gradient(#0284c7 ${progressPercent * 3.6}deg, #e2e8f0 0deg)`,
                color: "#0284c7",
                boxShadow: "0 0 15px rgba(2,132,199,0.2)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {progressPercent}%
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Study Progress</p>
              <p className="text-sm font-extrabold text-violet-700">
                {completedCount} of {totalDays} Days
              </p>
              <p className="text-[11px] font-semibold text-slate-500">
                {totalDays - completedCount === 0 ? "🎉 Completed!" : `${totalDays - completedCount} days remaining`}
              </p>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-5 h-2.5 rounded-full overflow-hidden bg-slate-200 border border-slate-300">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progressPercent}%`,
              background: "linear-gradient(90deg, #7c3aed, #0ea5e9)",
            }}
          />
        </div>
      </div>

      {/* Control Tabs & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
          {[
            { id: "all", label: `All Days (${totalDays})` },
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

        <div className="flex items-center gap-2">
          <button
            onClick={Object.keys(expandedDays).length >= totalDays ? collapseAll : expandAll}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all duration-200"
          >
            {Object.keys(expandedDays).length >= totalDays ? "📁 Collapse All" : "📂 Expand All"}
          </button>
          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all duration-200 flex items-center gap-1.5"
          >
            {copied ? "✓ Copied" : "📋 Copy Plan"}
          </button>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={generating}
              className="btn-gradient px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
            >
              {generating ? "🔄 Regenerating..." : "✨ Regenerate"}
            </button>
          )}
        </div>
      </div>

      {/* Interactive Timeline of Day Cards */}
      <div className="relative pl-6 md:pl-8 space-y-6">
        {/* Glowing vertical connector spine */}
        <div
          className="absolute left-3 md:left-4 top-4 bottom-4 w-0.5"
          style={{
            background: "linear-gradient(180deg, #7c3aed 0%, #0ea5e9 50%, rgba(124,58,237,0.2) 100%)",
          }}
        />

        {filteredDays.length === 0 ? (
          <div className="glass-card p-8 text-center ml-2 bg-white border border-slate-200">
            <p className="text-sm font-semibold text-slate-500">
              No days match the "{filter}" filter.
            </p>
          </div>
        ) : (
          filteredDays.map((day) => {
            const isExpanded = !!expandedDays[day.day];
            const badge = getDifficultyBadge(day.difficulty);
            const isToggling = togglingDay === day.day;

            return (
              <div
                key={day.day}
                className="relative group transition-all duration-300"
                id={`roadmap-day-${day.day}`}
              >
                {/* Timeline node icon */}
                <button
                  onClick={(e) => handleToggleComplete(e, day.day)}
                  disabled={isToggling}
                  title={day.completed ? "Mark as Incomplete" : "Mark as Completed"}
                  className="absolute -left-6 md:-left-8 top-4 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 text-white shadow-xs"
                  style={{
                    background: day.completed
                      ? "linear-gradient(135deg, #059669, #0ea5e9)"
                      : "#ffffff",
                    border: day.completed
                      ? "2px solid #059669"
                      : "2px solid #7c3aed",
                    color: day.completed ? "#ffffff" : "#7c3aed",
                  }}
                >
                  {isToggling ? (
                    <span className="animate-spin text-[10px]">⏳</span>
                  ) : day.completed ? (
                    "✓"
                  ) : (
                    <span className="text-[10px] font-bold text-violet-700">{day.day}</span>
                  )}
                </button>

                {/* Day Card */}
                <div
                  onClick={() => toggleDayExpanded(day.day)}
                  className={`glass-card rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden bg-white border shadow-xs hover:shadow-md ${
                    day.completed
                      ? "border-emerald-300 bg-emerald-50/20"
                      : isExpanded
                      ? "border-violet-400 bg-violet-50/30"
                      : "border-slate-200"
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 md:p-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-extrabold tracking-wider border ${
                          day.completed
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-violet-100 text-violet-800 border-violet-200"
                        }`}
                      >
                        DAY {day.day < 10 ? `0${day.day}` : day.day}
                      </span>

                      <h4
                        className={`text-base font-extrabold transition-colors ${
                          day.completed ? "line-through text-slate-400" : "text-slate-900"
                        }`}
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {day.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Difficulty */}
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-bold hidden sm:inline-block border"
                        style={{
                          background: badge.bg,
                          borderColor: badge.border,
                          color: badge.text,
                        }}
                      >
                        {badge.label}
                      </span>

                      {/* Duration */}
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-bold hidden sm:inline-block bg-slate-100 border border-slate-200 text-slate-700"
                      >
                        ⏱️ {day.duration || "45m"}
                      </span>

                      {/* Expand Chevron */}
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
                    <div
                      className="px-4 pb-5 md:px-5 md:pb-5 space-y-4 pt-2 border-t border-slate-100"
                    >
                      {/* Mobile badges if hidden in header */}
                      <div className="flex sm:hidden items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                          style={{
                            background: badge.bg,
                            borderColor: badge.border,
                            color: badge.text,
                          }}
                        >
                          {badge.label}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-700"
                        >
                          ⏱️ {day.duration || "45m"}
                        </span>
                      </div>

                      {/* Key Concepts Tags */}
                      {day.keyConcepts && day.keyConcepts.length > 0 && (
                        <div>
                          <p className="text-xs font-extrabold mb-2 text-violet-800">
                            📚 KEY CONCEPTS TO MASTER:
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

                      {/* Daily Mission / Action Item Card */}
                      {day.actionItem && (
                        <div
                          className="rounded-xl p-3.5 relative overflow-hidden bg-sky-50/70 border border-sky-200"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="text-lg flex-shrink-0 mt-0.5">🎯</span>
                            <div>
                              <p className="text-xs font-extrabold tracking-wide mb-1 text-sky-800">
                                PRACTICE MISSION:
                              </p>
                              <p className="text-xs leading-relaxed text-slate-800 font-medium">
                                {day.actionItem}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Pro Tip Card */}
                      {day.proTip && (
                        <div
                          className="rounded-xl p-3.5 bg-amber-50/70 border border-amber-200"
                        >
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

                      {/* Card Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <button
                          onClick={(e) => handleToggleComplete(e, day.day)}
                          disabled={isToggling}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 border ${
                            day.completed
                              ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                              : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {day.completed ? "✓ Completed" : "Mark Day as Done"}
                        </button>

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

      {/* Completion Trophy Card */}
      {completedCount === totalDays && (
        <div
          className="rounded-2xl p-6 text-center space-y-3 animate-fade-in bg-emerald-50 border border-emerald-200 shadow-sm"
        >
          <div className="text-4xl">🏆</div>
          <h4 className="text-lg font-extrabold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            7-Day Roadmap Completed!
          </h4>
          <p className="text-xs max-w-md mx-auto text-slate-700 font-medium">
            Awesome job! You have reinforced all your key concepts. Retake the {roadmap.subject} test to check your improved score!
          </p>
          <button
            onClick={() => navigate(`/test/${roadmap.subject}`)}
            className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm"
          >
            📝 Retake {roadmap.subject} Assessment →
          </button>
        </div>
      )}
    </div>
  );
};

export default RoadmapVisualizer;
