import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Play, BookOpen, Clock } from "lucide-react";

export const StudyPlannerPreview = () => {
  const [selectedPlan, setSelectedPlan] = useState("14");

  const plans = {
    "7": {
      pace: "Intensive",
      hoursPerDay: "2.5 hrs",
      topicsCovered: 18,
      focus: "High-yield interview topics & weak concept triage",
    },
    "14": {
      pace: "Balanced (Recommended)",
      hoursPerDay: "1.5 hrs",
      topicsCovered: 32,
      focus: "Comprehensive syllabus mastery with structured revision loops",
    },
    "30": {
      pace: "Foundation",
      hoursPerDay: "1 hr",
      topicsCovered: 58,
      focus: "Deep fundamental mastery from beginner to advanced placement readiness",
    },
  };

  const currentPlan = plans[selectedPlan];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block">
                INTELLIGENT TIMELINE
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                AI Study Planner
              </h2>
            </div>
          </div>

          {/* Plan Selector Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {["7", "14", "30"].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setSelectedPlan(days)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedPlan === days
                    ? "bg-white text-indigo-700 shadow-2xs font-extrabold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {days}-Day
              </button>
            ))}
          </div>
        </div>

        {/* Selected Plan Overview */}
        <div className="my-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-950">
              {selectedPlan}-Day Strategy • {currentPlan.pace}
            </span>
            <span className="text-[11px] font-extrabold text-indigo-700">
              {currentPlan.hoursPerDay} daily
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {currentPlan.focus}
          </p>
        </div>

        {/* Daily Schedule Structure Preview */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block px-1">
            Standard Daily Micro-Session Breakdown:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-indigo-600 uppercase block">LEARN</span>
              <span className="text-xs font-black text-slate-800">20 min</span>
              <p className="text-[10px] text-slate-400">Core concepts</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-blue-600 uppercase block">PRACTICE</span>
              <span className="text-xs font-black text-slate-800">20 min</span>
              <p className="text-[10px] text-slate-400">Coding problems</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-purple-600 uppercase block">QUIZ</span>
              <span className="text-xs font-black text-slate-800">10 min</span>
              <p className="text-[10px] text-slate-400">Mini evaluation</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-emerald-600 uppercase block">REVISION</span>
              <span className="text-xs font-black text-slate-800">10 min</span>
              <p className="text-[10px] text-slate-400">Retention check</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-slate-400 font-medium">
          Automatically reschedules missed tasks
        </span>

        <Link
          to="/roadmap/DSA"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs shadow-indigo-500/25 active:scale-98"
        >
          <span>Open Full Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default StudyPlannerPreview;
