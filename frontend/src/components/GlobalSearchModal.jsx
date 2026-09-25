import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SEARCH_DATA = [
  { title: "Dashboard", category: "Navigation", path: "/dashboard", icon: "🏠", desc: "Main student learning overview" },
  { title: "Data Structures & Algorithms", category: "Learn Track", path: "/learn/dsa", icon: "⚡", desc: "Arrays, Trees, Graphs, DP & Recursion" },
  { title: "Operating Systems", category: "Learn Track", path: "/learn/os", icon: "💻", desc: "Processes, Threads, Concurrency & Memory" },
  { title: "Database Systems & SQL", category: "Learn Track", path: "/learn/dbms", icon: "🗄️", desc: "Indexing, ACID, Normalization & SQL" },
  { title: "Computer Networks", category: "Learn Track", path: "/learn/cn", icon: "🌐", desc: "OSI Model, TCP/IP, DNS & HTTP" },
  { title: "Exam Preparation Hub", category: "Exams", path: "/exam-prep", icon: "🎓", desc: "University PYQs, unit notes & timed tests" },
  { title: "DSA Diagnostic Test", category: "Assessment", path: "/test/DSA", icon: "🧠", desc: "20-question adaptive assessment" },
  { title: "AI Quiz Generator", category: "AI Tools", path: "/quiz-generator", icon: "✨", desc: "Generate dynamic MCQs on any CS concept" },
  { title: "AI Tutor (DeepSeek / GPT-4o)", category: "AI Tools", path: "/tutor", icon: "🤖", desc: "24/7 personal conversational tutor" },
  { title: "7-Day AI Study Roadmap", category: "Planning", path: "/roadmap/DSA", icon: "🗺️", desc: "Personalized syllabus schedule" },
  { title: "Placement Readiness Predictor", category: "Career", path: "/placement-readiness", icon: "📊", desc: "Interview probability and risk analysis" },
  { title: "AI Coding Lab (159+ Problems)", category: "Practice", path: "/coding-lab", icon: "💻", desc: "Code, debug & run in C, C++, Java, Python" },
  { title: "Algorithm Visualizer (15 Algos)", category: "Practice", path: "/algorithm-visualizer", icon: "🎬", desc: "Step-by-step animations with code execution" },
  { title: "AI Mock Interview Simulator", category: "Career", path: "/mock-interview", icon: "🎤", desc: "5-round full mock interview session" },
  { title: "Skill Graph Competency Map", category: "Intelligence", path: "/skill-graph", icon: "🧠", desc: "12-domain radar chart & mastery metrics" },
  { title: "Offline Learning Mode", category: "Tools", path: "/offline-learning", icon: "📥", desc: "Download chapters for offline study" },
];

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true); // toggle
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = SEARCH_DATA.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-xs">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects, problems, tests, AI tools, roadmaps..."
            className="w-full text-sm font-semibold text-slate-900 bg-transparent focus:outline-hidden placeholder-slate-400"
          />
          <button
            onClick={onClose}
            className="px-2 py-1 text-[10px] font-bold text-slate-500 bg-slate-200/80 hover:bg-slate-300 rounded-md transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <button
                key={item.title + item.path}
                onClick={() => handleSelect(item.path)}
                className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/80 hover:border-indigo-100 border border-transparent transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl p-1.5 rounded-lg bg-slate-100 group-hover:bg-indigo-100 transition-colors">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{item.desc}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-800 shrink-0">
                  {item.category}
                </span>
              </button>
            ))
          ) : (
            <div className="py-8 text-center text-slate-500">
              <p className="text-sm font-bold">No results found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for DSA, Operating Systems, Coding Lab or Quizzes</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Navigate with click or enter</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold">⌘K</kbd> to toggle
          </span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
