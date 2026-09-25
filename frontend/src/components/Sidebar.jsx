import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useClerk } from "@clerk/clerk-react";
import { LearnXLogo } from "./LearnXLogo.jsx";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    badge: null,
  },
  {
    label: "Learn",
    to: "/learn",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    badge: "12 Tracks",
  },
  {
    label: "Exam Prep",
    to: "/exam-prep",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    ),
    badge: "PYQs",
  },
  {
    label: "Tests",
    to: "/test/DSA",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    badge: null,
  },
  {
    label: "AI Quiz",
    to: "/quiz-generator",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    badge: "Instant",
  },
  {
    label: "AI Tutor",
    to: "/tutor",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    badge: "24/7",
  },
  {
    label: "7-Day Roadmap",
    to: "/roadmap/DSA",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    badge: "AI Plan",
  },
  {
    label: "Career Engine",
    to: "/placement-readiness",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    badge: "Placement",
  },
];

const MORE_ITEMS = [
  { label: "AI Coding Lab", to: "/coding-lab", icon: "💻", desc: "159+ DSA Problems & Compiler" },
  { label: "Algorithm Visualizer", to: "/algorithm-visualizer", icon: "🎬", desc: "15 Sorting & Graph Visualizers" },
  { label: "AI Mock Interview", to: "/mock-interview", icon: "🎤", desc: "5-Round AI Interview Sim" },
  { label: "Skill Graph Radar", to: "/skill-graph", icon: "🧠", desc: "12-Domain CSE Competency Map" },
  { label: "Offline Learning", to: "/offline-learning", icon: "📥", desc: "Cached Packs & Sync Queue" },
  { label: "Career Hub & ATS", to: "/career-readiness", icon: "💼", desc: "Resume Scorer & Interview Qs" },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { signOut } = useClerk();
  const [moreExpanded, setMoreExpanded] = useState(false);

  const isCurrentActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    if (path === "/learn") return location.pathname.startsWith("/learn");
    if (path === "/exam-prep") return location.pathname.startsWith("/exam-prep");
    if (path === "/test/DSA") return location.pathname.startsWith("/test") || location.pathname === "/assessment";
    if (path === "/quiz-generator") return location.pathname === "/quiz-generator";
    if (path === "/tutor") return location.pathname.startsWith("/tutor");
    if (path === "/roadmap/DSA") return location.pathname.startsWith("/roadmap");
    if (path === "/placement-readiness") return location.pathname.startsWith("/placement-readiness") || location.pathname.startsWith("/career-readiness");
    return location.pathname === path;
  };

  const isMoreItemActive = MORE_ITEMS.some((item) => location.pathname.startsWith(item.to));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[240px] bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Top: Logo + Brand */}
        <div className="flex flex-col">
          <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
            <Link to="/dashboard" onClick={onClose} className="flex items-center gap-2 group">
              <LearnXLogo size="sm" showBadge={false} />
            </Link>
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Section */}
          <div className="px-3 py-4 overflow-y-auto max-h-[calc(100vh-190px)] space-y-1">
            <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Main Menu
            </p>

            {NAV_ITEMS.map((item) => {
              const active = isCurrentActive(item.to);
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={onClose}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${active ? "text-white" : "text-slate-500 group-hover:text-indigo-600"} transition-colors`}>
                      {item.icon}
                    </span>
                    <span className="tracking-tight">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-100/80"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* More Menu Dropdown Item */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setMoreExpanded((prev) => !prev)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isMoreItemActive
                    ? "bg-indigo-50 text-indigo-900 border border-indigo-200/80"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </span>
                  <span className="tracking-tight">More Tools</span>
                </div>
                <svg
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    moreExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded Sublinks */}
              {moreExpanded && (
                <div className="mt-1.5 ml-4 pl-3 border-l-2 border-slate-100 space-y-1 py-1">
                  {MORE_ITEMS.map((sub) => {
                    const activeSub = location.pathname.startsWith(sub.to);
                    return (
                      <Link
                        key={sub.label}
                        to={sub.to}
                        onClick={onClose}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          activeSub
                            ? "bg-indigo-100 text-indigo-950 font-bold"
                            : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-sm">{sub.icon}</span>
                        <span className="truncate">{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Profile / Status Section */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-xs">
              {user?.name?.[0]?.toUpperCase() || "S"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {user?.name || "Vijay Singh"}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <p className="text-[10px] font-semibold text-slate-500 truncate">Online • Scholar</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
