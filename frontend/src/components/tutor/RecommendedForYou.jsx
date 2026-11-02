import React from "react";
import { Link } from "react-router-dom";
import { Target, ListOrdered, Cpu, ArrowRight, Sparkles } from "lucide-react";

export const RecommendedForYou = ({ recommendations, onSelectRecommendation }) => {
  const getIcon = (idx) => {
    switch (idx % 3) {
      case 0:
        return <Target className="w-4 h-4 text-rose-500" />;
      case 1:
        return <ListOrdered className="w-4 h-4 text-amber-500" />;
      default:
        return <Cpu className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-3.5 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-[#0B1220] tracking-tight">
              Recommended for You
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-[10px] font-bold text-indigo-700">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Skill Gap Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Based on your learning progress, quiz accuracy, and recent skill diagnostics
          </p>
        </div>

        <Link
          to="/skill-graph"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0 group transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 3 Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {recommendations.map((rec, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectRecommendation(rec.query)}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-xs transition-all text-left flex items-start justify-between gap-3 group relative overflow-hidden"
          >
            <div className="space-y-2 min-w-0 flex-1">
              {/* Badge + Icon */}
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 group-hover:bg-indigo-50/60 transition-colors">
                  {getIcon(idx)}
                </div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${rec.priorityColor}`}
                >
                  {rec.priority}
                </span>
              </div>

              {/* Title */}
              <div className="text-sm font-black text-slate-900 group-hover:text-indigo-950 transition-colors truncate">
                {rec.title}
              </div>

              {/* Reason / Context */}
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                {rec.reason}
              </p>
            </div>

            {/* Hover arrow button */}
            <div className="w-7 h-7 rounded-xl bg-slate-50 group-hover:bg-indigo-600 border border-slate-200 group-hover:border-indigo-600 flex items-center justify-center text-slate-400 group-hover:text-white shrink-0 mt-1 transition-all shadow-2xs">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecommendedForYou;
