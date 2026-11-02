import React from "react";
import {
  Sparkles,
  Zap,
  Database,
  Laptop,
  Globe,
  Boxes,
  Cpu,
  Brain,
  Code2,
} from "lucide-react";

export const TUTOR_SUBJECT_TABS = [
  { id: "All Subjects", label: "All Subjects", icon: Sparkles, color: "text-indigo-400" },
  { id: "DSA", label: "DSA & Algorithms", icon: Zap, color: "text-rose-500" },
  { id: "DBMS", label: "DBMS & SQL", icon: Database, color: "text-emerald-500" },
  { id: "OS", label: "Operating Systems", icon: Laptop, color: "text-blue-500" },
  { id: "CN", label: "Computer Networks", icon: Globe, color: "text-sky-500" },
  { id: "OOPS", label: "OOPs & SOLID", icon: Boxes, color: "text-violet-500" },
  { id: "SYSTEM_DESIGN", label: "System Design", icon: Cpu, color: "text-amber-500" },
  { id: "APTITUDE", label: "Aptitude", icon: Brain, color: "text-pink-500" },
  { id: "WEB_DEV", label: "Web Development", icon: Code2, color: "text-teal-500" },
];

export const SubjectTabs = ({ activeSubject, onSelectSubject }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
      {TUTOR_SUBJECT_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeSubject === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectSubject(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border duration-150 ${
              isActive
                ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-sm shadow-indigo-500/25 scale-[1.02]"
                : "bg-white text-slate-700 border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/40 hover:text-indigo-900 shadow-2xs"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : tab.color}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SubjectTabs;
