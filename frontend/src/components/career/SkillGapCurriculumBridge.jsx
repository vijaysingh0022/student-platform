import React from "react";
import { Link } from "react-router-dom";

export const SkillGapCurriculumBridge = ({ skillGaps, targetRole, onStartMockInterview }) => {
  if (!skillGaps || skillGaps.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
        <span className="text-3xl block">🎯</span>
        <h3 className="text-sm font-black text-slate-800">No Immediate Skill Gaps Detected</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Your profile aligns well with the foundational requirements for {targetRole}. Explore advanced topics in My Learning or take an AI Mock Interview.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">🌉</span>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                LearnX Skill Gap & Personalized Curriculum Bridge
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Direct connection from detected resume weaknesses to active LearnX courses, units, and practice labs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onStartMockInterview && (
              <button
                onClick={onStartMockInterview}
                className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-sm flex items-center gap-1.5"
              >
                <span>🎙️</span> Test in AI Interview
              </button>
            )}
          </div>
        </div>

        {/* Skill Gap Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillGaps.map((gap, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 hover:bg-white hover:border-indigo-300 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    {gap.urgency || "Critical"} Gap
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-1.5">{gap.skill}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{gap.category}</p>
                </div>
                <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-sm shrink-0">
                  ⚡
                </span>
              </div>

              {/* Connected LearnX Topic CTA */}
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1.5">
                <div className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                  Recommended LearnX Course Topic:
                </div>
                <div className="text-xs font-bold text-slate-800 line-clamp-1">
                  {gap.matchedLearnXTopicTitle || "Foundational Computer Science Module"}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-slate-400">
                    Subject: {gap.matchedLearnXSubjectId?.toUpperCase() || "CSE"}
                  </span>
                  <Link
                    to={`/learn/${gap.matchedLearnXSubjectId || "dsa"}/${gap.matchedLearnXTopicId || "dsa-u1-intro-ds"}`}
                    className="text-xs font-black text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                  >
                    <span>Start Learning</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillGapCurriculumBridge;
