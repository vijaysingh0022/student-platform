import React from "react";
import { ChevronRight, Flame, Database, Laptop, Globe, Boxes } from "lucide-react";

export const POPULAR_TOPICS = [
  {
    rank: 1,
    title: "Binary Search",
    subject: "DSA",
    icon: Flame,
    iconColor: "text-rose-500",
    query: "Explain Binary Search with loop invariants, edge cases, and C++ code implementation.",
  },
  {
    rank: 2,
    title: "Normalization",
    subject: "DBMS",
    icon: Database,
    iconColor: "text-emerald-500",
    query: "Explain 1NF, 2NF, 3NF, and BCNF with a clear relational schema example and functional dependencies.",
  },
  {
    rank: 3,
    title: "Process Scheduling",
    subject: "Operating Systems",
    icon: Laptop,
    iconColor: "text-blue-500",
    query: "Compare FCFS, SJF, Round Robin, and Priority CPU scheduling with Gantt charts and turnaround math.",
  },
  {
    rank: 4,
    title: "TCP 3-Way Handshake",
    subject: "Computer Networks",
    icon: Globe,
    iconColor: "text-sky-500",
    query: "Trace step-by-step how the TCP 3-Way Handshake (SYN, SYN-ACK, ACK) establishes a reliable connection.",
  },
  {
    rank: 5,
    title: "Inheritance vs Polymorphism",
    subject: "OOPs",
    icon: Boxes,
    iconColor: "text-violet-500",
    query: "Explain compile-time vs runtime polymorphism and how the vtable / vptr mechanism works in C++.",
  },
];

export const PopularTopics = ({ onSelectTopic }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400">
          Popular Topics
        </span>
        <span className="text-[11px] font-bold text-indigo-600">
          Top 5
        </span>
      </div>

      <div className="space-y-1.5">
        {POPULAR_TOPICS.map((topic) => {
          const Icon = topic.icon;
          return (
            <button
              key={topic.rank}
              type="button"
              onClick={() => onSelectTopic(topic.query, topic.subject)}
              className="w-full p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 text-left transition-all flex items-center justify-between gap-2 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-black text-slate-400 w-4 text-center group-hover:text-indigo-600 transition-colors">
                  {topic.rank}
                </span>
                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-white shadow-2xs">
                  <Icon className={`w-3.5 h-3.5 ${topic.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-900 truncate">
                    {topic.title}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium truncate">
                    {topic.subject}
                  </div>
                </div>
              </div>

              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 shrink-0 transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PopularTopics;
