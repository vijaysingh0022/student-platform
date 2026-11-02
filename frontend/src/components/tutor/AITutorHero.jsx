import React from "react";
import { Sparkles, BookOpen, Code, Target, GraduationCap, CheckCircle2 } from "lucide-react";

export const AITutorHero = ({ onCapabilityClick }) => {
  const capabilities = [
    {
      id: "concept",
      title: "Concept Explanations",
      desc: "Step-by-step learning",
      icon: BookOpen,
      iconColor: "text-indigo-400",
      query: "Explain the fundamental concepts step-by-step with real-world mental models.",
    },
    {
      id: "code",
      title: "Code Help",
      desc: "Debug & optimize",
      icon: Code,
      iconColor: "text-cyan-400",
      query: "Help me debug, optimize, and analyze time & space complexity of my code.",
    },
    {
      id: "practice",
      title: "Practice Questions",
      desc: "Topic-wise problems",
      icon: Target,
      iconColor: "text-violet-400",
      query: "Give me topic-wise practice problems with progressive hints.",
    },
    {
      id: "interview",
      title: "Interview Prep",
      desc: "Real questions & tips",
      icon: GraduationCap,
      iconColor: "text-emerald-400",
      query: "Give me real technical interview questions and tips asked by Tier-1 product companies.",
    },
  ];

  const features = [
    "Instant Doubt Resolution",
    "All CSE Subjects",
    "Code Explanation",
    "Practice Questions",
    "Interview Preparation",
    "Personalized Learning",
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#080B14] via-[#0E1528] to-[#18173B] text-white p-6 sm:p-8 border border-indigo-950/60 shadow-xl">
      {/* Background radial ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-60 h-60 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        {/* Left Side: Brand Badges, Title, Subtitle, Capabilities */}
        <div className="space-y-5 max-w-2xl">
          {/* Top Pill Badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/25 to-violet-500/25 border border-indigo-400/40 text-[11px] font-black uppercase tracking-wider text-indigo-300 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI-POWERED PERSONAL TUTOR</span>
            </div>
            <span className="text-xs font-semibold text-cyan-300/90 tracking-wide">
              Ask anything, learn everything!
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            LearnX AI Tutor
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-[15px] text-slate-300 font-normal leading-relaxed max-w-xl">
            Your 24/7 CSE learning partner for doubt resolution, concept building, coding help and placement preparation.
          </p>

          {/* 4 Bottom Capability Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <button
                  key={cap.id}
                  onClick={() => onCapabilityClick && onCapabilityClick(cap.query)}
                  className="p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-indigo-400/40 transition-all duration-200 text-left group backdrop-blur-sm shadow-xs"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${cap.iconColor} group-hover:scale-110 transition-transform`} />
                    <span className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors truncate">
                      {cap.title}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium truncate">
                    {cap.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Robot Mascot + Key Features Checklist */}
        <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0 xl:pl-4">
          {/* Robot Visual */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-44 sm:w-52 h-36 sm:h-40 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-[#0B1020]">
              <img
                src="/assets/ai_tutor_mascot.jpg"
                alt="LearnX AI Tutor Mentor"
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B14]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-2 right-2 text-center">
                <span className="text-[10px] font-bold text-cyan-200 bg-slate-900/80 px-2 py-0.5 rounded-full border border-cyan-500/20 backdrop-blur-xs">
                  Active CSE Co-Pilot
                </span>
              </div>
            </div>
          </div>

          {/* Key Features Checklist with glowing green checkmarks */}
          <div className="grid grid-cols-1 gap-2 text-xs">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 font-medium text-slate-200">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-400/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[11px] sm:text-xs text-slate-200 tracking-wide font-medium">
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutorHero;
