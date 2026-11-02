import React from "react";
import {
  MessageSquare,
  Code,
  Target,
  GraduationCap,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const TUTOR_MODES = [
  {
    id: "chat",
    label: "Chat & Learn",
    desc: "Get instant explanations",
    icon: MessageSquare,
    badge: "Active",
  },
  {
    id: "code",
    label: "Code Helper",
    desc: "Debug, optimize, explain",
    icon: Code,
  },
  {
    id: "practice",
    label: "Practice Questions",
    desc: "Topic-wise problems",
    icon: Target,
  },
  {
    id: "interview",
    label: "Interview Prep",
    desc: "Mock questions & tips",
    icon: GraduationCap,
  },
  {
    id: "planner",
    label: "Study Planner",
    desc: "Personalized plan",
    icon: Calendar,
  },
  {
    id: "visualizer",
    label: "Concept Visualizer",
    desc: "Diagrams & animations",
    icon: Layers,
  },
];

export const TutorModePanel = ({ activeMode, onSelectMode, activeSubject }) => {
  return (
    <div className="space-y-4">
      {/* Mode Navigation Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs space-y-1.5">
        <div className="px-2 py-1 text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>AI Assistant Modes</span>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">
            6 Modes
          </span>
        </div>

        <div className="space-y-1 pt-1">
          {TUTOR_MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onSelectMode(mode)}
                className={`w-full p-3 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3 group ${
                  isSelected
                    ? "bg-indigo-50/80 border-indigo-200 text-indigo-950 shadow-2xs"
                    : "bg-white border-transparent hover:border-slate-200 hover:bg-slate-50/80 text-slate-700"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? "bg-[#4F46E5] text-white shadow-xs shadow-indigo-500/20"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold truncate ${
                        isSelected ? "text-indigo-950 font-extrabold" : "text-slate-800"
                      }`}
                    >
                      {mode.label}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
                    {mode.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Connected Intelligence Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-50/90 to-violet-50/60 border border-indigo-100/90 shadow-2xs space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Connected Ecosystem</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
          Tutor answers adapt to your{" "}
          <strong className="text-indigo-900 font-semibold">{activeSubject}</strong> curriculum,
          assessment accuracy, and active skill gaps automatically.
        </p>
      </div>
    </div>
  );
};

export default TutorModePanel;
