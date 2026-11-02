import React from "react";
import { Sparkles, Play, Sliders, Clock, Target, ArrowRight } from "lucide-react";

export const SmartRecommendationCard = ({
  recommendation,
  onStartRecommended,
  onCustomize,
}) => {
  const rec = recommendation || {
    recommendedType: "Technical CSE Interview",
    difficulty: "Intermediate",
    estimatedDurationMinutes: 30,
    reasons: [
      "DBMS mastery is improving steadily (72%)",
      "Operating Systems is currently weak (41% — Deadlocks & CPU Scheduling)",
      "You haven't practiced technical interviews recently",
      "Placement readiness can improve through interview practice (+4 projected pts)",
    ],
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs relative overflow-hidden">
      {/* Background ambient tint */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Tag, Title, Why */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              SMART RECOMMENDATION
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
              Based on Skill Graph & Diagnostic Telemetry
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {rec.recommendedType}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{rec.estimatedDurationMinutes} minutes</span>
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-slate-400" />
                <span>Difficulty: {rec.difficulty}</span>
              </span>
              <span className="text-emerald-600 font-bold">
                +4 pts Placement Readiness lift
              </span>
            </div>
          </div>

          {/* Why List */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
              Why LearnX recommends this interview:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {rec.reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-100 text-xs text-slate-700 font-medium leading-relaxed"
                >
                  <span className="w-4 h-4 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                    ✓
                  </span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: CTAs */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <button
            type="button"
            onClick={onStartRecommended}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/25 active:scale-98 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Recommended Interview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onCustomize}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 hover:text-indigo-600 text-xs font-bold transition-all shadow-2xs hover:border-slate-300 active:scale-98 cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-slate-400" />
            <span>Customize Interview</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartRecommendationCard;
