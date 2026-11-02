import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Lightbulb,
  Code,
  Target,
  HelpCircle,
  GraduationCap,
  Calendar,
  Layers,
  FileText,
} from "lucide-react";

export const QUICK_TOOLS = [
  { label: "Explain", icon: Lightbulb, color: "text-amber-500", query: "Explain fundamental principles with simple analogies." },
  { label: "Code Help", icon: Code, color: "text-cyan-500", query: "Help me debug and optimize code with complexity analysis." },
  { label: "Practice", icon: Target, color: "text-indigo-500", query: "Give me 3 practice problems with hints." },
  { label: "Quiz", icon: HelpCircle, color: "text-purple-500", query: "Quiz me with 3 concept-check multiple choice questions." },
  { label: "Interview", icon: GraduationCap, color: "text-emerald-500", query: "Give me 3 technical interview questions with model answers." },
  { label: "Study Plan", icon: Calendar, color: "text-blue-500", query: "Create a 5-day structured revision schedule." },
  { label: "Diagrams", icon: Layers, color: "text-violet-500", query: "Draw an ASCII architecture and memory diagram." },
  { label: "Notes", icon: FileText, color: "text-rose-500", query: "Summarize key revision formula and cheat-sheet points." },
];

export const LearningContext = ({ onQuickToolClick, activeSubject }) => {
  return (
    <div className="space-y-4">
      {/* TODAY'S LEARNING CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Today's Learning
          </span>
          <Link
            to="/test"
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View History →
          </Link>
        </div>

        {/* Circular Gauge & Stats */}
        <div className="flex items-center gap-4">
          {/* Circular SVG Gauge */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="5"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="5"
                strokeDasharray="163"
                strokeDashoffset="65"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-black text-slate-900 leading-tight">2 / 5</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                Questions
              </span>
            </div>
          </div>

          {/* Solved / Attempted / Remaining Breakdown */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>3 Solved</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>1 Attempted</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span>1 Remaining</span>
            </div>
          </div>
        </div>

        {/* Start Practice Session Button */}
        <Link
          to="/test"
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#4F46E5] hover:bg-indigo-700 text-white flex items-center justify-center gap-2 transition-all shadow-xs shadow-indigo-500/25 group"
        >
          <span>Start Practice Session</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* QUICK TOOLS CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1 block">
          Quick Tools
        </span>

        <div className="grid grid-cols-4 gap-2">
          {QUICK_TOOLS.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  onQuickToolClick(
                    `${tool.query} on ${activeSubject !== "All Subjects" ? activeSubject : "CSE concepts"}.`
                  )
                }
                className="p-2 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 flex flex-col items-center justify-center text-center transition-all group"
                title={tool.label}
              >
                <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-white flex items-center justify-center transition-colors shadow-2xs">
                  <Icon className={`w-3.5 h-3.5 ${tool.color}`} />
                </div>
                <span className="text-[10px] font-bold text-slate-700 group-hover:text-indigo-950 mt-1 truncate w-full">
                  {tool.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearningContext;
