import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Target, ArrowRight, Play, BookOpen, Bot } from "lucide-react";

export const NextBestActionCard = ({ nextAction }) => {
  const action = nextAction || {
    subject: "DSA",
    topicTitle: "Dynamic Programming",
    accuracy: 34,
    target: 70,
    subId: "dsa",
    topicId: "dsa-dp-intro",
    estimatedMinutes: 15,
    reasons: [
      "Accuracy dropped in last 2 diagnostic attempts (34%)",
      "High placement relevance — frequently asked at Google & Amazon",
      "Core prerequisite for advanced graph and tree optimization algorithms",
      "Mastering this will increase your Placement Readiness score by +4 points",
    ],
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block">
                LEARNX SIGNATURE ENGINE
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Your Next Best Action
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
              Priority 1 • High Placement Impact
            </span>
          </div>
        </div>

        {/* 2-Column Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 items-start">
          {/* Left Action Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                <Target className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider border border-indigo-100">
                    {action.subject}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                    Weak Topic
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    ~ {action.estimatedMinutes || 15} min
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {action.topicTitle}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
              Your current accuracy is{" "}
              <strong className="text-rose-600 font-bold">{action.accuracy}%</strong>, which is
              below the placement benchmark of <strong>{action.target}%</strong>. Completing this
              micro-session will bridge the gap and reinforce your foundations.
            </p>

            {/* Current vs Target Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-rose-600">Current Mastery: {action.accuracy}%</span>
                <span className="text-emerald-700 flex items-center gap-1">
                  <span>Target: {action.target}%</span>
                  <span className="text-[10px] text-slate-400 font-medium">(Placement Cutoff)</span>
                </span>
              </div>

              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/50">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, action.accuracy)}%` }}
                />
                {/* Target Marker */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-emerald-600 z-10 shadow-xs"
                  style={{ left: `${action.target}%` }}
                  title={`Target: ${action.target}%`}
                />
              </div>
            </div>
          </div>

          {/* Right Trust & Transparency Panel (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wide">
              <span>🔍</span>
              <span>Why LearnX Recommends This</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 font-medium leading-relaxed">
              {action.reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                    ✓
                  </span>
                  <span className="text-[11px] text-slate-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Action Bar */}
      <div className="flex items-center gap-3 pt-6 border-t border-slate-100 mt-6 flex-wrap">
        <Link
          to={`/learn/${action.subId}/${action.topicId}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs shadow-indigo-500/25 active:scale-98 group"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start 15 min Session</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link
          to={`/learn/${action.subId}/${action.topicId}/quiz`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-bold transition-all shadow-2xs hover:border-slate-300 active:scale-98"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span>Practice 10 Questions</span>
        </Link>

        <Link
          to={`/tutor?q=${encodeURIComponent(
            `Explain ${action.topicTitle} with mental models, Big-O complexity, and interview patterns.`
          )}&subject=${action.subject}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 hover:text-indigo-600 text-xs font-bold transition-all shadow-2xs hover:border-slate-300 active:scale-98"
        >
          <Bot className="w-3.5 h-3.5 text-indigo-500" />
          <span>Ask AI Tutor</span>
        </Link>
      </div>
    </div>
  );
};

export default NextBestActionCard;
