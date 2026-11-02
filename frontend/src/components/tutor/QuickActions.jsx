import React from "react";
import {
  Lightbulb,
  Compass,
  Code2,
  HelpCircle,
  FileCheck2,
  AlertTriangle,
} from "lucide-react";

export const QUICK_ACTIONS_CONFIG = [
  {
    id: "explain",
    label: "Explain Simply",
    icon: Lightbulb,
    color: "text-amber-500",
    bg: "hover:bg-amber-50/60 hover:border-amber-200",
    promptSuffix: "Explain the fundamental concepts simply using an intuitive mental model.",
  },
  {
    id: "example",
    label: "Real-Life Example",
    icon: Compass,
    color: "text-cyan-500",
    bg: "hover:bg-cyan-50/60 hover:border-cyan-200",
    promptSuffix: "Provide a vivid real-life systems engineering analogy.",
  },
  {
    id: "code",
    label: "Show Code",
    icon: Code2,
    color: "text-indigo-500",
    bg: "hover:bg-indigo-50/60 hover:border-indigo-200",
    promptSuffix: "Provide clean, production-grade code in C++, Java, and Python with Big-O complexity analysis.",
  },
  {
    id: "quiz",
    label: "Quiz Me",
    icon: HelpCircle,
    color: "text-purple-500",
    bg: "hover:bg-purple-50/60 hover:border-purple-200",
    promptSuffix: "Quiz me with 3 concept-check multiple-choice questions with answer keys.",
  },
  {
    id: "exam",
    label: "Exam Answer",
    icon: FileCheck2,
    color: "text-emerald-500",
    bg: "hover:bg-emerald-50/60 hover:border-emerald-200",
    promptSuffix: "Format as a university semester 10-mark model answer with clear bullet points.",
  },
  {
    id: "mistakes",
    label: "Common Mistakes",
    icon: AlertTriangle,
    color: "text-rose-500",
    bg: "hover:bg-rose-50/60 hover:border-rose-200",
    promptSuffix: "What are the top 3 interview pitfalls and syntax traps students make?",
  },
];

export const QuickActions = ({ onTriggerAction, activeSubject, activeTopic }) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {QUICK_ACTIONS_CONFIG.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => {
              const subjectStr = activeTopic || (activeSubject !== "All Subjects" ? activeSubject : "Computer Science");
              onTriggerAction(
                `${action.label} on ${subjectStr}: ${action.promptSuffix}`,
                action.id
              );
            }}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold bg-white border border-slate-200/90 text-slate-700 transition-all shrink-0 shadow-2xs flex items-center gap-1.5 ${action.bg}`}
          >
            <Icon className={`w-3.5 h-3.5 ${action.color}`} />
            <span>{action.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;
