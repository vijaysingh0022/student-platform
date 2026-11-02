import React from "react";
import {
  Code,
  Zap,
  Cpu,
  Layers,
  Terminal,
  FolderGit2,
  Users,
  Compass,
  Award,
  Timer,
  ArrowRight,
} from "lucide-react";

export const INTERVIEW_TYPES = [
  {
    id: "Technical Interview",
    title: "Technical Interview",
    icon: Code,
    color: "text-indigo-600",
    bg: "bg-indigo-50/70 border-indigo-100 hover:border-indigo-300",
    duration: "30-45 min",
    difficulty: "Intermediate",
    tests: "Core algorithms, data structures, OOP architecture & systems thinking.",
    skills: ["Algorithms", "OOP & SOLID", "System Trade-offs"],
  },
  {
    id: "DSA Interview",
    title: "DSA Interview",
    icon: Zap,
    color: "text-rose-500",
    bg: "bg-rose-50/70 border-rose-100 hover:border-rose-300",
    duration: "30 min",
    difficulty: "Advanced",
    tests: "Array invariants, Trees, Graphs, Dynamic Programming & Big-O proofs.",
    skills: ["Trees & BST", "Dynamic Programming", "Graph Traversal"],
  },
  {
    id: "CS Fundamentals",
    title: "CS Fundamentals",
    icon: Cpu,
    color: "text-blue-500",
    bg: "bg-blue-50/70 border-blue-100 hover:border-blue-300",
    duration: "25 min",
    difficulty: "Intermediate",
    tests: "OS Process states, Deadlocks, Virtual Memory, DBMS ACID & TCP/IP.",
    skills: ["Operating Systems", "DBMS & SQL", "Networks"],
  },
  {
    id: "Coding Interview",
    title: "Coding Interview",
    icon: Terminal,
    color: "text-emerald-500",
    bg: "bg-emerald-50/70 border-emerald-100 hover:border-emerald-300",
    duration: "40 min",
    difficulty: "Advanced",
    tests: "Live coding execution, boundary edge cases, and runtime explanation.",
    skills: ["Python/Java/C++", "Code Quality", "Edge Cases"],
  },
  {
    id: "Full Stack Interview",
    title: "Full Stack Interview",
    icon: Layers,
    color: "text-purple-600",
    bg: "bg-purple-50/70 border-purple-100 hover:border-purple-300",
    duration: "35 min",
    difficulty: "Intermediate",
    tests: "React Virtual DOM, State management, REST APIs, JWT & Database schema.",
    skills: ["React & Web", "REST APIs", "SQL vs NoSQL"],
  },
  {
    id: "Project Interview",
    title: "Project Deep-Dive",
    icon: FolderGit2,
    color: "text-amber-500",
    bg: "bg-amber-50/70 border-amber-100 hover:border-amber-300",
    duration: "30 min",
    difficulty: "Advanced",
    tests: "Architecture design, scaling to 100k users, DB failover & tough bugs.",
    skills: ["Architecture", "Scalability", "Technical Ownership"],
  },
  {
    id: "HR Interview",
    title: "HR Interview",
    icon: Users,
    color: "text-teal-600",
    bg: "bg-teal-50/70 border-teal-100 hover:border-teal-300",
    duration: "20 min",
    difficulty: "Easy",
    tests: "Culture fit, communication clarity, career goals, and teamwork.",
    skills: ["Culture Alignment", "Communication", "Career Vision"],
  },
  {
    id: "Behavioral Interview",
    title: "Behavioral Interview",
    icon: Compass,
    color: "text-sky-600",
    bg: "bg-sky-50/70 border-sky-100 hover:border-sky-300",
    duration: "25 min",
    difficulty: "Intermediate",
    tests: "STAR Method (Situation, Task, Action, Result) conflict and deadline management.",
    skills: ["STAR Method", "Conflict Resolution", "Ownership"],
  },
  {
    id: "Mixed Placement Interview",
    title: "Mixed Placement Simulation",
    icon: Award,
    color: "text-indigo-600",
    bg: "bg-indigo-50/70 border-indigo-100 hover:border-indigo-300",
    duration: "45 min",
    difficulty: "Advanced",
    tests: "Comprehensive 5-round campus placement simulator (MCQ, Tech, Code, Project, HR).",
    skills: ["Full Coverage", "Multi-Round Endurance", "Hiring Verdict"],
  },
  {
    id: "Rapid Fire Interview",
    title: "Rapid Fire Interview",
    icon: Timer,
    color: "text-orange-500",
    bg: "bg-orange-50/70 border-orange-100 hover:border-orange-300",
    duration: "15 min",
    difficulty: "Speed Drill",
    tests: "10-15 fast-paced conceptual recall questions under tight time limits.",
    skills: ["Fast Recall", "Precision", "Pressure Handling"],
  },
];

export const InterviewTypeSelector = ({ selectedType, onSelectType }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Select Interview Simulation Type
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Choose from 10 specialized interview simulations designed around top tech placement patterns.
          </p>
        </div>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl">
          10 Specialized Tracks
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {INTERVIEW_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          return (
            <div
              key={type.id}
              onClick={() => onSelectType(type.id)}
              className={`p-4 rounded-3xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group ${
                isSelected
                  ? "bg-white border-[#4F46E5] ring-2 ring-indigo-200 shadow-md scale-[1.02]"
                  : "bg-white border-slate-200/90 hover:border-indigo-300 hover:bg-slate-50/80 shadow-2xs"
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 group-hover:bg-white shadow-2xs transition-colors">
                    <Icon className={`w-4 h-4 ${type.color}`} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    {type.duration}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-black text-slate-900 group-hover:text-indigo-950 transition-colors">
                    {type.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                    {type.tests}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap gap-1">
                  {type.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[9px] font-bold text-slate-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] font-bold">
                  <span className="text-slate-400">{type.difficulty}</span>
                  <span
                    className={`flex items-center gap-0.5 transition-colors ${
                      isSelected ? "text-indigo-600 font-black" : "text-slate-400 group-hover:text-indigo-600"
                    }`}
                  >
                    <span>{isSelected ? "Selected" : "Select"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterviewTypeSelector;
