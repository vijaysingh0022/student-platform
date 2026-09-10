import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useOffline } from "../context/OfflineContext.jsx";
import { LearnXLogo } from "./LearnXLogo.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isOnline, isLowDataMode, pendingSyncCount, isSimulatorActive } = useOffline();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "AI OpenRouter Active",
      desc: "DeepSeek & GPT-4o-mini ready for AI tutoring.",
      time: "Just now",
      unread: true,
      icon: "🤖",
    },
    {
      id: 2,
      title: "Daily Goal Ready",
      desc: "Complete today's DSA challenge to keep your streak.",
      time: "2h ago",
      unread: true,
      icon: "🔥",
    },
    {
      id: 3,
      title: "Platform Synchronized",
      desc: "All local offline assessment queues up to date.",
      time: "Yesterday",
      unread: false,
      icon: "📡",
    },
  ]);

  const profileRef = useRef(null);
  const toolsRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setToolsMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
    setToolsMenuOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/test/DSA" || path === "/assessment") {
      return location.pathname.startsWith("/test") || location.pathname === "/assessment";
    }
    return location.pathname === path;
  };

  // Check if any sublink in the More dropdown is active
  const isMoreActive = ["/placement-readiness", "/teacher-dashboard", "/institution-dashboard", "/security", "/offline-learning"].includes(
    location.pathname
  );

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)]"
          : "bg-white/80 backdrop-blur-lg border-b border-slate-200/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 group transition-transform active:scale-95"
            id="nav-logo"
          >
            <LearnXLogo size="sm" showBadge={true} />
          </Link>
        </div>

        {/* Center: Desktop Navigation Links (Logged In) */}
        {user ? (
          <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {/* Dashboard */}
            <Link
              to="/dashboard"
              id="nav-dashboard"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive("/dashboard")
                  ? "bg-violet-100/80 text-violet-900 shadow-xs ring-1 ring-violet-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <svg className="w-3.5 h-3.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dashboard</span>
            </Link>

            {/* Take Test */}
            <Link
              to="/test/DSA"
              id="nav-take-test"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive("/test/DSA")
                  ? "bg-violet-100/80 text-violet-900 shadow-xs ring-1 ring-violet-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <svg className="w-3.5 h-3.5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Tests</span>
            </Link>

            {/* AI Quiz */}
            <Link
              to="/quiz-generator"
              id="nav-ai-quiz"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive("/quiz-generator")
                  ? "bg-violet-100/80 text-violet-900 shadow-xs ring-1 ring-violet-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>AI Quiz</span>
            </Link>

            {/* AI Tutor */}
            <Link
              to="/tutor"
              id="nav-ai-tutor"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive("/tutor")
                  ? "bg-violet-100/80 text-violet-900 shadow-xs ring-1 ring-violet-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>AI Tutor</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-violet-600 text-white tracking-wide">
                AI
              </span>
            </Link>

            {/* Career Engine */}
            <Link
              to="/career-readiness"
              id="nav-career-engine"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive("/career-readiness")
                  ? "bg-violet-100/80 text-violet-900 shadow-xs ring-1 ring-violet-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Career Engine</span>
            </Link>

            {/* More Tools Dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                type="button"
                onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isMoreActive || toolsMenuOpen
                    ? "bg-violet-50 text-violet-800 ring-1 ring-violet-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <span>More</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    toolsMenuOpen ? "rotate-180 text-violet-600" : "text-slate-400"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Tools Dropdown Card */}
              {toolsMenuOpen && (
                <div
                  className="absolute left-0 mt-2.5 w-64 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 p-2 z-50 shadow-xl animate-fade-in-up"
                  style={{
                    boxShadow: "0 20px 40px -15px rgba(15,23,42,0.12), 0 0 1px 1px rgba(15,23,42,0.05)",
                  }}
                >
                  <Link
                    to="/placement-readiness"
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                      location.pathname === "/placement-readiness"
                        ? "bg-violet-50 text-violet-900"
                        : "hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold">Placement AI</div>
                      <div className="text-[11px] text-slate-400 font-medium">Predict CTC & placement odds</div>
                    </div>
                  </Link>

                  <Link
                    to="/teacher-dashboard"
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                      location.pathname === "/teacher-dashboard"
                        ? "bg-violet-50 text-violet-900"
                        : "hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold">Faculty Portal</div>
                      <div className="text-[11px] text-slate-400 font-medium">Cohort analytics & student metrics</div>
                    </div>
                  </Link>

                  <Link
                    to="/security"
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                      location.pathname === "/security"
                        ? "bg-violet-50 text-violet-900"
                        : "hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold">Security & Compliance</div>
                      <div className="text-[11px] text-slate-400 font-medium">RBAC, audit logs & privacy</div>
                    </div>
                  </Link>

                  <Link
                    to="/offline-learning"
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                      location.pathname === "/offline-learning"
                        ? "bg-violet-50 text-violet-900"
                        : "hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold">Offline Learning Hub</div>
                      <div className="text-[11px] text-slate-400 font-medium">Offline tests & sync status</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Public / Unauthenticated Navigation */
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/quiz-generator"
              className="text-xs font-semibold text-slate-600 hover:text-violet-600 transition-colors"
            >
              AI Quiz
            </Link>
            <Link
              to="/security"
              className="text-xs font-semibold text-slate-600 hover:text-violet-600 transition-colors"
            >
              Security
            </Link>
            <a
              href="/#interactive-demo"
              className="text-xs font-semibold text-slate-600 hover:text-violet-600 transition-colors"
            >
              Live Demo
            </a>
          </div>
        )}

        {/* Right Section: Network Status, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {/* Network / Offline Sync Status Badge */}
              <Link
                to="/offline-learning"
                title={isOnline ? "Online & Synchronized" : "Offline Mode Active"}
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  !isOnline || isSimulatorActive
                    ? "bg-amber-50/80 text-amber-800 border-amber-200 hover:bg-amber-100"
                    : pendingSyncCount > 0
                    ? "bg-sky-50/80 text-sky-800 border-sky-200 hover:bg-sky-100"
                    : "bg-emerald-50/80 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      !isOnline || isSimulatorActive
                        ? "bg-amber-400"
                        : pendingSyncCount > 0
                        ? "bg-sky-400"
                        : "bg-emerald-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      !isOnline || isSimulatorActive
                        ? "bg-amber-500"
                        : pendingSyncCount > 0
                        ? "bg-sky-500"
                        : "bg-emerald-500"
                    }`}
                  />
                </span>
                <span className="text-[11px]">
                  {!isOnline || isSimulatorActive
                    ? "Offline"
                    : pendingSyncCount > 0
                    ? `Sync (${pendingSyncCount})`
                    : "Online"}
                </span>
                {isLowDataMode && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-violet-100 text-violet-700 rounded-md font-mono font-bold">
                    Low Data
                  </span>
                )}
              </Link>

              {/* Notification Popover */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  aria-label="Notifications"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all ${
                    notificationsOpen ? "bg-slate-100 text-slate-900" : ""
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-600 rounded-full ring-2 ring-white" />
                  )}
                </button>

                {/* Notifications Dropdown Card */}
                {notificationsOpen && (
                  <div
                    className="absolute right-0 mt-2.5 w-80 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-2xl z-50 p-3 animate-fade-in-up"
                    style={{
                      boxShadow: "0 20px 40px -15px rgba(15,23,42,0.14)",
                    }}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-violet-100 text-violet-700 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllAsRead}
                          className="text-[11px] font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                        >
                          Mark read
                        </button>
                      )}
                    </div>

                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                            notif.unread ? "bg-violet-50/50" : "hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-base shrink-0 mt-0.5">{notif.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-bold text-slate-800 truncate">{notif.title}</p>
                              <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                              {notif.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Vertical Divider */}
              <div className="w-px h-5 bg-slate-200" />

              {/* User Profile Pill & Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2.5 p-1 pl-1.5 pr-2 rounded-full border border-slate-200/80 bg-white/60 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all select-none group"
                >
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt={user.name || "User"}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-white group-hover:ring-violet-200 transition-all shadow-xs"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

                  <div className="hidden lg:block text-left leading-tight">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-violet-700 transition-colors max-w-[110px] truncate">
                      {user.name || "Scholar"}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400 capitalize">
                      {user.role ? (user.role === "teacher" ? "Faculty" : user.role) : "Student"}
                    </p>
                  </div>

                  <svg
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      profileMenuOpen ? "rotate-180 text-violet-600" : "group-hover:text-slate-600"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown Card */}
                {profileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2.5 w-60 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-2xl z-50 p-2 animate-fade-in-up"
                    style={{
                      boxShadow: "0 20px 40px -15px rgba(15,23,42,0.15), 0 0 1px 1px rgba(15,23,42,0.05)",
                    }}
                  >
                    {/* User Card Header */}
                    <div className="px-3 py-2.5 mb-1.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name || "Student Scholar"}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.email || "student@learnx.ai"}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-violet-100 text-violet-700 tracking-wider">
                          {user.role === "teacher" ? "Faculty" : "Scholar"}
                        </span>
                        <span className="text-[10px] text-slate-400">• Level 4</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate("/dashboard");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition-colors text-left"
                    >
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Dashboard & Stats</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate("/security");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition-colors text-left"
                    >
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      <span>Account & Security</span>
                    </button>

                    <div className="my-1.5 border-t border-slate-100" />

                    <button
                      type="button"
                      id="nav-logout-btn"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50/80 transition-colors text-left group"
                    >
                      <svg className="w-4 h-4 text-rose-400 group-hover:text-rose-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Logged Out Actions */
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                id="nav-login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                id="nav-register"
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-sky-600 hover:from-violet-500 hover:to-sky-500 text-white shadow-sm hover:shadow-glow-purple transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            id="nav-mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <div className="w-5 flex flex-col gap-1">
              <span
                className={`block h-0.5 rounded-full bg-slate-700 transition-all duration-200 ${
                  menuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`block h-0.5 rounded-full bg-slate-700 transition-all duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 rounded-full bg-slate-700 transition-all duration-200 ${
                  menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-5 pt-2 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-2xl space-y-3 animate-fade-in-up">
          {user ? (
            <>
              {/* User Profile Bar on Mobile */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt={user.name || "User"}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-violet-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{user.name || "Scholar"}</p>
                    <p className="text-[11px] text-slate-400 capitalize">{user.role || "Student"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{isOnline ? "Online" : "Offline"}</span>
                </div>
              </div>

              {/* Navigation Links Grid */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                    isActive("/dashboard") ? "bg-violet-100 text-violet-900 font-bold" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>⚡</span> Dashboard
                </Link>
                <Link
                  to="/test/DSA"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                    isActive("/test/DSA") ? "bg-violet-100 text-violet-900 font-bold" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>📝</span> Take Test
                </Link>
                <Link
                  to="/quiz-generator"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                    isActive("/quiz-generator") ? "bg-violet-100 text-violet-900 font-bold" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>🧠</span> AI Quiz
                </Link>
                <Link
                  to="/tutor"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                    isActive("/tutor") ? "bg-violet-100 text-violet-900 font-bold" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>🤖</span> AI Tutor
                </Link>
                <Link
                  to="/career-readiness"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                    isActive("/career-readiness") ? "bg-violet-100 text-violet-900 font-bold" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>💼</span> Career Engine
                </Link>
                <Link
                  to="/placement-readiness"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                    isActive("/placement-readiness") ? "bg-violet-100 text-violet-900 font-bold" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>🎯</span> Placement AI
                </Link>
                <Link
                  to="/teacher-dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                    isActive("/teacher-dashboard") ? "bg-violet-100 text-violet-900 font-bold" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>🎓</span> Faculty Portal
                </Link>
                <Link
                  to="/security"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                    isActive("/security") ? "bg-violet-100 text-violet-900 font-bold" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>🛡️</span> Security & Gov
                </Link>
                <Link
                  to="/offline-learning"
                  onClick={() => setMenuOpen(false)}
                  className={`col-span-2 flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                    isActive("/offline-learning") ? "bg-violet-100 text-violet-900 font-bold" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>📡</span> Offline Learning Hub
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Sync & Cache</span>
                </Link>
              </div>

              {/* Sign Out Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-colors"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/quiz-generator"
                onClick={() => setMenuOpen(false)}
                className="block p-3 text-xs font-bold text-violet-700 bg-violet-50 rounded-xl"
              >
                🧠 AI Quiz & MCQ Generator
              </Link>
              <Link
                to="/security"
                onClick={() => setMenuOpen(false)}
                className="block p-3 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                🛡️ Security & Privacy
              </Link>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-sky-600 text-xs font-bold text-white shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
