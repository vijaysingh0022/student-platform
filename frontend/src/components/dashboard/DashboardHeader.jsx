import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Brain, ArrowRight, BookOpen, Bot } from "lucide-react";

export const DashboardHeader = ({ firstName = "Vijay", onScrollToPlan }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* Welcome Banner (Left ~72%) */}
      <div className="lg:col-span-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-100/90 via-indigo-50/70 to-blue-50/40 border border-blue-200/80 p-6 sm:p-7 flex flex-col justify-between shadow-xs min-h-[210px]">
        {/* Ambient subtle illustration on right */}
        <div className="absolute right-0 top-0 bottom-0 w-2/5 sm:w-1/2 pointer-events-none overflow-hidden select-none">
          <img
            src="/assets/hero-illustration.jpg"
            alt="Learning journey"
            className="w-full h-full object-cover object-left mask-image-linear opacity-90 mix-blend-multiply"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 35%)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 35%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-xl space-y-2">
          {/* Top Status Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B1020] text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>LearnX Command Center</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Adaptive Intelligence Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2 pt-1">
            Good Morning, {firstName} <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed max-w-md">
            Your personal AI operating system for CSE concepts, coding practice, and placement intelligence.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex items-center gap-3 mt-5 flex-wrap">
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs shadow-indigo-500/25 active:scale-98"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Continue Learning</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/tutor"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 hover:text-indigo-600 text-xs font-bold transition-all shadow-2xs hover:border-slate-300 active:scale-98"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-500" />
            <span>Ask AI Tutor</span>
          </Link>

          <button
            type="button"
            onClick={onScrollToPlan}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/70 hover:bg-white border border-slate-200/80 text-slate-600 text-xs font-bold transition-all shadow-2xs active:scale-98"
          >
            <span>Today's Focus</span>
            <span className="text-slate-400">↓</span>
          </button>
        </div>
      </div>

      {/* Daily Motivational Insight (Right ~28%) */}
      <div className="lg:col-span-4 rounded-3xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white border border-blue-100/90 p-6 flex flex-col justify-between shadow-xs">
        <div>
          <span className="text-4xl sm:text-5xl font-serif text-blue-400 select-none block leading-none mb-2">
            “
          </span>
          <p className="text-slate-800 text-sm sm:text-base font-bold italic leading-relaxed">
            Discipline today creates opportunities tomorrow.
          </p>
          <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
            Focus on eliminating 1 weak concept each day to steadily compound placement readiness.
          </p>
        </div>

        <div className="pt-4 border-t border-blue-100/70 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-indigo-500" />
            <span>Career Intelligence Loop</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
