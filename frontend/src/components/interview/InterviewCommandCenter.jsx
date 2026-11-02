import React from "react";
import { Sparkles, Play, History, TrendingUp, Flame, Award, ShieldCheck, CheckCircle2 } from "lucide-react";

export const InterviewCommandCenter = ({
  readiness = 72,
  performance = 78,
  completedCount = 12,
  streak = 3,
  improvement = "+14%",
  onStartClick,
  onHistoryClick,
}) => {
  return (
    <div className="space-y-6">
      {/* ── HERO BANNER ────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#080B14] via-[#0E1528] to-[#18173B] text-white p-6 sm:p-8 border border-indigo-950/60 shadow-xl">
        {/* Ambient radial glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/25 to-violet-500/25 border border-indigo-400/40 text-[11px] font-black uppercase tracking-wider text-indigo-300 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI MOCK INTERVIEW 2.0</span>
              </span>
              <span className="text-xs font-semibold text-cyan-300">
                Practice. Perform. Improve.
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              AI Interview Command Center
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-xl">
              Experience realistic technical and placement interviews powered by your LearnX skill profile.
              Dynamic Socratic probing, coding evaluation, and automated Skill Graph feedback loops.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={onStartClick}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/25 active:scale-98 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start New Interview</span>
            </button>

            <button
              type="button"
              onClick={onHistoryClick}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all backdrop-blur-sm active:scale-98 cursor-pointer"
            >
              <History className="w-4 h-4" />
              <span>View Interview History</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 3 PRIMARY METRICS + STREAKS ROW ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Interview Readiness */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-1.5 hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Interview Readiness
            </span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {readiness} <span className="text-xs font-semibold text-slate-400">/ 100</span>
          </p>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${readiness}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 font-medium block pt-0.5">
            Placement readiness tier: Proficient
          </span>
        </div>

        {/* Metric 2: Interview Performance */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-1.5 hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Avg. Performance
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {performance} <span className="text-xs font-semibold text-slate-400">/ 100</span>
          </p>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${performance}%` }} />
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block pt-0.5">
            Strong technical depth
          </span>
        </div>

        {/* Metric 3: Interviews Completed */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-1.5 hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Completed
            </span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {completedCount}
          </p>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, completedCount * 8)}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 font-medium block pt-0.5">
            Verified interview logs
          </span>
        </div>

        {/* Metric 4: Interview Streak */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-1.5 hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Streak
            </span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            {streak} <span className="text-xs font-semibold text-slate-500">Interviews</span>
          </p>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: "75%" }} />
          </div>
          <span className="text-[10px] text-slate-400 font-medium block pt-0.5">
            Practice 2 more this week 🔥
          </span>
        </div>

        {/* Metric 5: Monthly Improvement */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-1.5 hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Velocity
            </span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 tracking-tight">
            {improvement}
          </p>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: "85%" }} />
          </div>
          <span className="text-[10px] text-slate-400 font-medium block pt-0.5">
            Confidence & Big-O recall
          </span>
        </div>
      </div>
    </div>
  );
};

export default InterviewCommandCenter;
