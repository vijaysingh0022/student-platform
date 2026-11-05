import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useClerk } from "@clerk/clerk-react";

// ── Nav group definitions matching the reference design ───────────────────────
const NAV_GROUPS = [
  {
    label: "MAIN",
    items: [
      {
        label: "Dashboard",
        to: "/dashboard",
        icon: (
          <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
      {
        label: "My Learning",
        to: "/learn",
        icon: (
          <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
      },
      {
        label: "Assessments",
        to: "/test",
        icon: (
          <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        ),
      },
      {
        label: "AI PYQ Intelligence",
        to: "/assessments/pyq",
        badge: "AI",
        icon: (
          <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "PRACTICE",
    items: [
      {
        label: "Coding Lab",
        to: "/coding-lab",
        icon: (
          <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        ),
      },
      {
        label: "AI Tutor",
        to: "/tutor",
        icon: (
          <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        ),
      },
      {
        label: "Mock Interview",
        to: "/mock-interview",
        icon: (
          <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "CAREER",
    items: [
      {
        label: "AI Resume & ATS",
        to: "/career-readiness",
        badge: "NEW",
        icon: (
          <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        label: "Career Twin",
        to: "/career-twin",
        badge: "AI",
        icon: (
          <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
      },
      {
        label: "Placement Readiness",
        to: "/placement-readiness",
        icon: (
          <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
      },
      {
        label: "My Roadmap",
        to: "/roadmap/DSA",
        icon: (
          <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        ),
      },
      {
        label: "Skill Analytics",
        to: "/skill-graph",
        icon: (
          <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "PROGRESS",
    items: [
      {
        label: "Achievements",
        to: "/dashboard#achievements",
        icon: (
          <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        ),
      },
      {
        label: "Rewards",
        to: "/rewards",
        icon: (
          <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        ),
      },
    ],
  },
];

// ── Path matching helper ──────────────────────────────────────────────────────
const isActive = (path, location) => {
  if (path === "/dashboard") return location.pathname === "/dashboard" && !location.hash;
  if (path === "/dashboard#achievements") return location.pathname === "/dashboard" && location.hash === "#achievements";
  if (path === "/learn") return location.pathname.startsWith("/learn");
  if (path === "/test") return location.pathname.startsWith("/test") || location.pathname === "/assessment";
  if (path === "/coding-lab") return location.pathname.startsWith("/coding");
  if (path === "/tutor") return location.pathname.startsWith("/tutor");
  if (path === "/career-twin") return location.pathname.startsWith("/career-twin");
  if (path === "/placement-readiness") return location.pathname.startsWith("/placement-readiness") || location.pathname.startsWith("/career");
  if (path === "/roadmap/DSA") return location.pathname.startsWith("/roadmap");
  if (path === "/skill-graph") return location.pathname.startsWith("/skill-graph");
  if (path === "/rewards") return location.pathname.startsWith("/rewards");
  if (path === "/security") return location.pathname.startsWith("/security");
  return location.pathname === path;
};

// ── Sidebar Component ─────────────────────────────────────────────────────────
export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try { if (signOut) await signOut(); } catch {}
    if (logout) logout();
  };

  const displayName = user?.name || "Vijay Singh";
  const displayCourse = user?.course || "B.Tech CSE";
  const userInitial = displayName.charAt(0).toUpperCase() || "V";

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar shell: Clean White (#FFFFFF) with subtle gray border */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[240px] bg-white text-slate-800 border-r border-slate-200/90 flex flex-col select-none transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center group py-1"
            title="LearnX Dashboard"
          >
            <img
              src="/learnx-logo.png"
              alt="LearnX - Learn. Practice. Grow. Succeed."
              className="h-11 max-h-12 w-auto max-w-[175px] object-contain select-none transition-transform duration-200 group-hover:scale-[1.02]"
              loading="eager"
            />
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Close sidebar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav Items Grouped */}
        <div className="flex-1 overflow-y-auto py-3.5 px-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(item.to, location);
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={onClose}
                      className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold transition-all duration-150 ${
                        active
                          ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 font-bold"
                          : "text-[#111827] hover:text-[#0b1120] hover:bg-[#F1F5F9]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`${
                            active
                              ? "text-white"
                              : "text-[#111827] group-hover:text-indigo-600"
                          } transition-colors`}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate leading-tight">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`text-[9.5px] font-extrabold tracking-wider px-2 py-0.5 rounded-lg shrink-0 ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs"
                            } ml-0.5`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {active && (
                        <span className="w-2 h-2 rounded-full bg-white shrink-0 ml-2" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section: Settings & Student Profile */}
        <div className="p-3 border-t border-slate-100 bg-white shrink-0 space-y-2.5">
          {/* Settings link */}
          <Link
            to="/security"
            onClick={onClose}
            className={`group flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-semibold transition-all ${
              isActive("/security", location)
                ? "bg-slate-100 text-[#111827] font-bold"
                : "text-[#111827] hover:text-black hover:bg-[#F1F5F9]"
            }`}
          >
            <svg
              className="w-[18px] h-[18px] shrink-0 text-[#111827] group-hover:text-indigo-600 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </Link>

          {/* Student Profile Card (Pill card with blue-purple avatar, Vijay Singh, B.Tech CSE, arrow) */}
          <div className="flex items-center gap-3 p-2.5 rounded-full bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0 ring-2 ring-white">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <p className="text-xs font-bold text-[#111827] truncate leading-tight">
                {displayName}
              </p>
              <p className="text-[11px] text-slate-500 font-medium truncate leading-tight mt-0.5">
                {displayCourse}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out / Account"
              className="p-1 text-slate-400 hover:text-slate-700 rounded-full transition-colors shrink-0"
              aria-label="Sign out or profile options"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
