import React from "react";
import { Link } from "react-router-dom";

export const TopicSidebarNavigation = ({
  subjectId,
  unit,
  currentTopicId,
  chapterTopics = [],
  videoStats = {},
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 space-y-4 shadow-sm sticky top-24">
      {/* Unit Header */}
      <div className="space-y-1 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-violet-100 text-violet-800">
            {unit?.title ? `Unit ${unit.unitNumber || 1}` : "Current Unit"}
          </span>
          <span className="text-[11px] font-bold text-slate-400">• Chapter Content</span>
        </div>
        <h4 className="text-sm font-black text-slate-900 leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {unit?.title || "Curriculum Topics"}
        </h4>
      </div>

      {/* Topics Roadmap List */}
      <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 scrollbar-thin">
        {chapterTopics.map((top, idx) => {
          const isCurrent = top.topicId === currentTopicId;
          const isCompleted = top.isCompleted || (videoStats[top.topicId]?.isCompleted);
          const completionPct = videoStats[top.topicId]?.completionPercentage || (isCompleted ? 100 : 0);

          return (
            <Link
              key={top.topicId || idx}
              to={`/learn/${subjectId}/${top.topicId}`}
              className={`p-3 rounded-2xl border transition-all flex items-start gap-2.5 group ${
                isCurrent
                  ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-600/20"
                  : isCompleted
                  ? "bg-slate-50 border-emerald-200 text-slate-800 hover:bg-emerald-50/40"
                  : "bg-white border-slate-100 hover:border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {/* Icon Status */}
              <div className="pt-0.5 flex-shrink-0">
                {isCurrent ? (
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                    ▶
                  </span>
                ) : isCompleted ? (
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black">
                    ✓
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                )}
              </div>

              {/* Topic Information */}
              <div className="space-y-1 flex-1 min-w-0">
                <div
                  className={`text-xs font-bold leading-tight truncate ${
                    isCurrent ? "text-white" : "group-hover:text-violet-700 text-slate-900"
                  }`}
                >
                  {top.title}
                </div>

                <div className="flex items-center gap-2 text-[10px]">
                  <span className={isCurrent ? "text-violet-200" : "text-slate-400"}>
                    ⏱️ {top.estimatedMinutes || 20}m
                  </span>

                  {completionPct > 0 && (
                    <span
                      className={`font-semibold ${
                        isCurrent
                          ? "text-violet-100"
                          : isCompleted
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}
                    >
                      {completionPct}%
                    </span>
                  )}
                </div>

                {/* Progress bar inside each item */}
                <div
                  className={`h-1 rounded-full overflow-hidden ${
                    isCurrent ? "bg-violet-700/60" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`h-full transition-all duration-300 ${
                      isCurrent
                        ? "bg-white"
                        : isCompleted
                        ? "bg-emerald-500"
                        : "bg-violet-500"
                    }`}
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TopicSidebarNavigation;

