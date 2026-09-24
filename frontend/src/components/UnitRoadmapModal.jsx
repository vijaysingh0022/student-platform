import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { generateUnitRoadmap } from "../services/api.js";

const UnitRoadmapModal = ({ isOpen, onClose, unit, subjectId }) => {
  const [level, setLevel] = useState("Beginner");
  const [dailyMinutes, setDailyMinutes] = useState(60);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedDays, setCompletedDays] = useState({});

  useEffect(() => {
    if (isOpen && unit) {
      handleGenerate();
    }
  }, [isOpen, unit]);

  const handleGenerate = async (selectedLevel = level, selectedMinutes = dailyMinutes) => {
    if (!unit) return;
    setLoading(true);
    try {
      const res = await generateUnitRoadmap(unit.unitId, {
        level: selectedLevel,
        dailyMinutes: Number(selectedMinutes),
      });
      setRoadmap(res.data);
    } catch (err) {
      console.error("Failed to generate unit roadmap:", err);
      // Fallback generator if offline or network failure
      const topics = unit.chapters?.flatMap((c) => c.topics) || [];
      const topicsCount = Math.max(1, topics.length);
      const mult = selectedLevel === "Beginner" ? 1.3 : selectedLevel === "Advanced" ? 0.85 : 1.0;
      const totalMins = topicsCount * 25 * mult;
      const calcDays = Math.max(2, Math.ceil(totalMins / selectedMinutes));
      const studyDays = Math.max(1, calcDays - 1);
      const tPerDay = Math.max(1, Math.ceil(topicsCount / studyDays));

      const days = [];
      let idx = 0;
      for (let d = 1; d <= studyDays && idx < topics.length; d++) {
        const slice = topics.slice(idx, idx + tPerDay);
        idx += tPerDay;
        days.push({
          day: d,
          title: `Day ${d} — ${slice.map((t) => t.title).join(", ") || "Core Concepts"}`,
          topicIds: slice.map((t) => t.topicId),
          topicTitles: slice.map((t) => t.title),
          practiceCount: selectedLevel === "Beginner" ? 5 : 8,
          focusArea: `Study and implement ${slice[0]?.title || "key principles"}.`,
          isCompleted: false,
        });
      }
      days.push({
        day: days.length + 1,
        title: `Day ${days.length + 1} — Unit Revision, Mock Quiz & AI Assessment`,
        topicIds: [],
        topicTitles: ["Comprehensive Revision", "Unit Mastery Test"],
        practiceCount: 15,
        focusArea: "Review weak concepts and take the comprehensive unit test.",
        isCompleted: false,
      });

      setRoadmap({
        unit: {
          unitId: unit.unitId,
          subjectId: unit.subjectId,
          title: unit.title,
          difficulty: unit.difficulty || selectedLevel,
        },
        level: selectedLevel,
        dailyMinutes: selectedMinutes,
        totalDays: days.length,
        days,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleDayCompletion = (dayNum) => {
    setCompletedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  if (!isOpen || !unit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white/95 border border-sky-100 rounded-3xl shadow-2xl shadow-sky-950/20 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50/80 via-white to-indigo-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-lg shadow-md shadow-sky-500/20">
              ⚡
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                <span>AI Personalized Unit Roadmap</span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {unit.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Current Mastery Level
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
              {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setLevel(lvl);
                    handleGenerate(lvl, dailyMinutes);
                  }}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    level === lvl
                      ? "bg-sky-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Daily Study Time
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
              {[
                { min: 30, label: "30m" },
                { min: 60, label: "1 Hour" },
                { min: 120, label: "2 Hours" },
              ].map((opt) => (
                <button
                  key={opt.min}
                  onClick={() => {
                    setDailyMinutes(opt.min);
                    handleGenerate(level, opt.min);
                  }}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    dailyMinutes === opt.min
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Roadmap Plan Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600">
                AI is calculating optimal learning curves & daily time allocation...
              </p>
            </div>
          ) : roadmap ? (
            <div className="space-y-4">
              {/* Dynamic Duration Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 border border-sky-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Calculated Completion: <span className="text-sky-700 font-extrabold">{roadmap.totalDays} Days</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Target pace at {roadmap.dailyMinutes >= 60 ? `${roadmap.dailyMinutes / 60} hour(s)` : `${roadmap.dailyMinutes} mins`} per day ({roadmap.level} track).
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-white text-xs font-bold text-emerald-700 border border-emerald-200 shadow-xs">
                  🎯 Tailored Plan
                </div>
              </div>

              {/* Day-by-Day Timeline */}
              <div className="space-y-3">
                {roadmap.days.map((dayItem) => {
                  const isDone = completedDays[dayItem.day];
                  return (
                    <div
                      key={dayItem.day}
                      className={`p-4 rounded-2xl border transition-all ${
                        isDone
                          ? "bg-emerald-50/60 border-emerald-200"
                          : "bg-white border-slate-200 hover:border-sky-300 shadow-xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleDayCompletion(dayItem.day)}
                            className={`w-6 h-6 rounded-lg mt-0.5 flex items-center justify-center text-xs font-black transition-all ${
                              isDone
                                ? "bg-emerald-600 text-white"
                                : "border border-slate-300 hover:border-sky-500 text-transparent"
                            }`}
                          >
                            ✓
                          </button>
                          <div className="space-y-1">
                            <h3 className={`text-xs font-extrabold ${isDone ? "text-slate-500 line-through" : "text-slate-900"}`}>
                              {dayItem.title}
                            </h3>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              {dayItem.focusArea}
                            </p>
                            {dayItem.topicTitles?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {dayItem.topicTitles.map((tName, i) => {
                                  const tId = dayItem.topicIds[i];
                                  return (
                                    <Link
                                      key={i}
                                      to={`/learn/${subjectId}/${tId}`}
                                      onClick={onClose}
                                      className="px-2 py-0.5 rounded-md bg-sky-50 hover:bg-sky-100 text-[10px] font-bold text-sky-700 border border-sky-200 transition-colors inline-flex items-center gap-1"
                                    >
                                      <span>📖 {tName}</span>
                                      <span>→</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {dayItem.practiceCount > 0 && (
                          <span className="flex-shrink-0 px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                            📝 {dayItem.practiceCount} Qs
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-center text-slate-500 text-xs py-8">No roadmap generated yet.</p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Roadmap dynamically auto-adapts as you complete unit quizzes and diagnostic tests.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-all shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnitRoadmapModal;
