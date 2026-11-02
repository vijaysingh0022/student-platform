import React from "react";
import { Link } from "react-router-dom";
import { Award, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export const PLACEMENT_DIMENSIONS = [
  { label: "Technical Skills", score: 72, target: 80 },
  { label: "DSA & Problem Solving", score: 54, target: 80, isWeak: true },
  { label: "CS Fundamentals", score: 71, target: 80 },
  { label: "Coding Practice", score: 61, target: 80 },
  { label: "Interview Readiness", score: 58, target: 80, isWeak: true },
  { label: "Consistency & Rhythm", score: 79, target: 80 },
  { label: "Quantitative Aptitude", score: 73, target: 80 },
];

export const HOW_TO_REACH_80 = [
  { step: 1, title: "Improve DSA Score by +12", desc: "Master Trees, Graphs, and Dynamic Programming", points: "+5 pts" },
  { step: 2, title: "Complete OS Fundamentals", desc: "Revise Process Scheduling, Deadlocks & Paging", points: "+3 pts" },
  { step: 3, title: "Solve 30 Problems in Coding Lab", desc: "Focus on Medium difficulty LeetCode/GFG standards", points: "+3 pts" },
  { step: 4, title: "Complete 2 AI Mock Interviews", desc: "Practice technical verbal communication & edge cases", points: "+2 pts" },
];

export const PlacementReadinessBreakdown = ({
  score = 68,
  dimensions = PLACEMENT_DIMENSIONS,
  actionSteps = HOW_TO_REACH_80,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block">
                CAREER INTELLIGENCE
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Placement Readiness Score
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {score} <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Developing
            </span>
          </div>
        </div>

        {/* Educational Decision-Support Notice */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 my-3.5 flex items-start gap-2 text-[11px] text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <span>
            <strong>Educational Decision-Support Indicator:</strong> Evaluates syllabus mastery,
            coding laboratory submissions, and assessment benchmarks to guide preparation.
          </span>
        </div>

        {/* 2 Sub-Columns: Dimension Breakdown vs How to Reach 80 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-1">
          {/* 7 Skill Dimensions (6 cols) */}
          <div className="md:col-span-6 space-y-2.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block px-1">
              Evaluated Dimensions
            </span>

            {dimensions.map((dim, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className={dim.isWeak ? "text-rose-600 font-bold" : ""}>
                    {dim.label}
                  </span>
                  <span className="font-bold text-slate-900">{dim.score}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      dim.isWeak ? "bg-rose-500" : "bg-indigo-600"
                    }`}
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* How to Reach 80 (6 cols) */}
          <div className="md:col-span-6 rounded-2xl bg-indigo-50/50 border border-indigo-100/90 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-950 uppercase tracking-wide">
                Target: Reach 80 Score
              </span>
              <span className="text-[10px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                +12 pts needed
              </span>
            </div>

            <div className="space-y-2">
              {actionSteps.map((step) => (
                <div
                  key={step.step}
                  className="p-2 rounded-xl bg-white border border-indigo-100/80 shadow-2xs space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      {step.step}. {step.title}
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-600">
                      {step.points}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-slate-400 font-medium">
          Benchmark: Tier-1 tech product standard is 80+
        </span>
        <Link
          to="/placement-readiness"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group transition-colors"
        >
          <span>View Placement Analytics</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default PlacementReadinessBreakdown;
