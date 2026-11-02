import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Bot, BookOpen } from "lucide-react";

export const WeaknessActionSystem = ({ weakArea }) => {
  const data = weakArea || {
    topic: "Binary Search & Edge Traps",
    subject: "DSA",
    accuracy: 42,
    target: 70,
    impact: "High (Frequently tested in coding assessments and OA rounds)",
    steps: [
      { num: 1, title: "Review Core Invariant", desc: "Understand lower_bound vs upper_bound logic (8 min)" },
      { num: 2, title: "Watch/Read Concept Breakdown", desc: "Avoid overflow bug with mid = low + (high-low)/2" },
      { num: 3, title: "Solve 5 Easy Problems", desc: "Sorted array search, square root binary search" },
      { num: 4, title: "Solve 5 Medium Problems", desc: "Search in rotated sorted array, peak element" },
      { num: 5, title: "Take 10-Question Mini Quiz", desc: "Validate edge-case recognition under 15 min" },
      { num: 6, title: "Verify Mastery Lift", desc: "Automatic mastery update to >= 70%" },
    ],
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">
                ADAPTIVE REMEDIATION
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Weakness → Action System
              </h2>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Current Accuracy: {data.accuracy}%
          </span>
        </div>

        {/* Problem & Impact Banner */}
        <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 my-4 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-rose-950 uppercase tracking-wide">
              {data.subject} • {data.topic}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            <strong className="text-slate-800">Why it matters:</strong> {data.impact}
          </p>
        </div>

        {/* 6 Actionable Remediation Steps */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block px-1">
            Prescribed 6-Step Mastery Roadmap:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.steps.map((step) => (
              <div
                key={step.num}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-indigo-200 transition-all flex items-start gap-2.5 group shadow-2xs"
              >
                <div className="w-5 h-5 rounded-full bg-white border border-slate-200 text-[10px] font-black text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors">
                  {step.num}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-950 truncate">
                    {step.title}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
        <Link
          to={`/learn/dsa/dsa-binary-search`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs active:scale-98"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Start Remediation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <Link
          to={`/tutor?q=${encodeURIComponent(
            `I have 42% accuracy in ${data.topic}. Guide me through the top 3 traps and how to solve them.`
          )}&subject=${data.subject}`}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
        >
          <Bot className="w-3.5 h-3.5 text-indigo-500" />
          <span>Ask AI for Hints →</span>
        </Link>
      </div>
    </div>
  );
};

export default WeaknessActionSystem;
