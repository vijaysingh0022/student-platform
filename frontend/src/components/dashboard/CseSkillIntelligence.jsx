import React from "react";
import { Link } from "react-router-dom";
import { Cpu, ArrowRight, CheckCircle2 } from "lucide-react";

export const CSE_SKILLS = [
  {
    id: "DSA",
    name: "DSA & Algorithms",
    score: 54,
    status: "Developing",
    statusColor: "bg-blue-50 text-blue-700 border-blue-200",
    barColor: "#3b82f6",
    link: "/skill-graph",
  },
  {
    id: "DBMS",
    name: "DBMS & SQL",
    score: 72,
    status: "Strong",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    barColor: "#10b981",
    link: "/skill-graph",
  },
  {
    id: "OS",
    name: "Operating Systems",
    score: 41,
    status: "Weak",
    statusColor: "bg-amber-50 text-amber-700 border-amber-200",
    barColor: "#f59e0b",
    link: "/skill-graph",
  },
  {
    id: "CN",
    name: "Computer Networks",
    score: 63,
    status: "Developing",
    statusColor: "bg-blue-50 text-blue-700 border-blue-200",
    barColor: "#0284c7",
    link: "/skill-graph",
  },
  {
    id: "OOP",
    name: "OOP & Clean Code",
    score: 81,
    status: "Strong",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    barColor: "#059669",
    link: "/skill-graph",
  },
  {
    id: "System Design",
    name: "System Design & Architecture",
    score: 29,
    status: "Critical",
    statusColor: "bg-rose-50 text-rose-700 border-rose-200",
    barColor: "#ef4444",
    link: "/skill-graph",
  },
];

export const CseSkillIntelligence = ({ skills = CSE_SKILLS, overallMastery = 68 }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block">
                SKILL GRAPH 2.0
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                CSE Skill Intelligence
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-slate-400 block">
                Overall Mastery
              </span>
              <span className="text-base font-black text-slate-900 leading-tight">
                {overallMastery}%
              </span>
            </div>
            <Link
              to="/skill-graph"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 group"
            >
              <span>Explore Graph</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Skill Rows */}
        <div className="space-y-3.5 pt-4">
          {skills.map((skill) => (
            <div key={skill.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-bold text-slate-800 truncate">{skill.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${skill.statusColor}`}
                  >
                    {skill.status}
                  </span>
                </div>
                <span className="font-black text-slate-900">{skill.score}%</span>
              </div>

              {/* Progress Bar with Placement Cutoff (70%) */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${skill.score}%`,
                    backgroundColor: skill.barColor,
                  }}
                />
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-400/80 z-10"
                  style={{ left: "70%" }}
                  title="Placement Cutoff (70%)"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Benchmark Notice */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span>Vertical marker denotes 70% technical interview cutoff</span>
        </span>
        <span className="text-emerald-600 font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>3 / 6 Domains Qualified</span>
        </span>
      </div>
    </div>
  );
};

export default CseSkillIntelligence;
