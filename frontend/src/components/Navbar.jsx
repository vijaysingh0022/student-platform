import React, { useState, useEffect } from "react";
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
  const profileRef = React.useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
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

  const navLinks = [
    { to: "/dashboard",           label: "Dashboard",      icon: "⚡" },
    { to: "/test/DSA",            label: "Take Test",      icon: "📝" },
    { to: "/quiz-generator",      label: "AI Quiz",        icon: "🧠" },
    { to: "/security",            label: "Security",       icon: "🛡️" },
    { to: "/career-readiness",    label: "Career Engine",  icon: "💼" },
    { to: "/placement-readiness", label: "Placement AI",   icon: "🎯" },
    { to: "/teacher-dashboard",   label: "Faculty Portal", icon: "🎓" },
    { to: "/offline-learning",    label: "Offline Hub",    icon: "📡" },
    { to: "/tutor",               label: "AI Tutor",       icon: "🤖" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs"
          : "bg-white/80 backdrop-blur-sm border-b border-slate-200"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group hover:opacity-90 transition-opacity" id="nav-logo">
          <LearnXLogo size="sm" showBadge={false} />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {user ? (
            <>
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    id={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                      active
                        ? "bg-violet-100 text-violet-800 border border-violet-200"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
                    }`}
                  >
                    <span className="text-sm leading-none">{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}

              {/* Separator */}
              <div className="w-px h-4 mx-1.5 bg-slate-200" />

              {/* Live Connectivity / Sync Status Badge */}
              <Link
                to="/offline-learning"
                title={isOnline ? "Online & Synchronized" : "Offline Mode Active"}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                  !isOnline || isSimulatorActive
                    ? "bg-amber-50 text-amber-800 border-amber-300 animate-pulse"
                    : pendingSyncCount > 0
                    ? "bg-sky-50 text-sky-800 border-sky-300"
                    : "bg-emerald-50 text-emerald-800 border-emerald-200"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    !isOnline || isSimulatorActive
                      ? "bg-amber-500"
                      : pendingSyncCount > 0
                      ? "bg-sky-500 animate-ping"
                      : "bg-emerald-500"
                  }`}
                />
                <span>
                  {!isOnline || isSimulatorActive
                    ? "Offline"
                    : pendingSyncCount > 0
                    ? `Syncing (${pendingSyncCount})`
                    : "Online"}
                </span>
                {isLowDataMode && (
                  <span className="text-[10px] px-1 py-0.2 bg-violet-100 text-violet-700 rounded border border-violet-200 font-mono">
                    LowData
                  </span>
                )}
              </Link>

              {/* Floating User Bar & Dropdown matching design */}
              <div className="relative ml-1" ref={profileRef}>
                <div className="flex items-center gap-3.5 bg-white border border-slate-200/90 rounded-2xl px-3.5 py-1.5 shadow-sm hover:shadow transition-all">
                  {/* Mail / Message Icon */}
                  <button
                    type="button"
                    title="Messages"
                    onClick={() => alert("Messages: No new unread messages.")}
                    className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>

                  {/* Notification Bell with alert dot */}
                  <button
                    type="button"
                    title="Notifications"
                    onClick={() => alert("Notifications: All systems operational.")}
                    className="relative text-slate-400 hover:text-slate-700 transition-colors p-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
                  </button>

                  {/* Clickable Profile Bar trigger */}
                  <div
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2.5 cursor-pointer select-none group"
                  >
                    <div className="text-right leading-tight">
                      <p className="text-xs font-bold text-slate-800 tracking-tight group-hover:text-violet-700 transition-colors">
                        {user.name || "Calvin Matthews"}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-400 capitalize">
                        {user.role ? (user.role === "teacher" ? "Faculty" : user.role) : "Admin"}
                      </p>
                    </div>

                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                        alt={user.name || "User"}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-violet-300 transition-all shadow-xs"
                      />
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
                  </div>
                </div>

                {/* Dropdown Menu with tooltip triangle notch */}
                {profileMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-3 w-40 bg-white rounded-2xl border border-slate-100 py-2 z-50 animate-fade-in-up"
                    style={{
                      boxShadow: "0 14px 34px -4px rgba(0,0,0,0.12), 0 4px 12px -2px rgba(0,0,0,0.06)",
                    }}
                  >
                    {/* Top Triangle Tooltip Notch */}
                    <div className="absolute -top-1.5 right-5 w-3 h-3 bg-white rotate-45 border-t border-l border-slate-100" />

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate("/dashboard");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
                    >
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate("/security");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
                    >
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      Settings
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      type="button"
                      id="nav-logout-btn"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50/70 transition-colors text-left group"
                    >
                      <svg className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Signout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/quiz-generator"
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors border border-violet-200 flex items-center gap-1"
              >
                <span>🧠</span> AI Quiz
              </Link>
              <Link
                to="/security"
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200 flex items-center gap-1"
              >
                <span>🛡️</span> Security
              </Link>
              <a
                href="/#interactive-demo"
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Live Demo
              </a>
              <Link
                to="/login"
                id="nav-login"
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                id="nav-register"
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold btn-gradient text-white shadow-xs"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          id="nav-mobile-menu"
          aria-label="Toggle menu"
        >
          <div className="w-4 flex flex-col gap-[5px]">
            <span
              className="block h-0.5 rounded-full transition-all duration-250 bg-current"
              style={{ transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }}
            />
            <span
              className="block h-0.5 rounded-full transition-all duration-250 bg-current"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block h-0.5 rounded-full transition-all duration-250 bg-current"
              style={{ transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }}
            />
          </div>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="md:hidden px-5 pb-4 pt-2 space-y-1 bg-white border-t border-slate-200"
        >
          {user ? (
            <>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs text-slate-600">
                <span>Status:</span>
                <span className="font-bold flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-amber-500"}`} />
                  {isOnline ? "Online" : "Offline Active"} {isLowDataMode ? "(Low Data)" : ""}
                </span>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                    isActive(link.to)
                      ? "bg-violet-100 text-violet-800"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-slate-200">
                <button
                  onClick={handleLogout}
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm font-bold text-left text-rose-700 hover:bg-rose-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/quiz-generator"
                onClick={() => setMenuOpen(false)}
                className="block px-3.5 py-2.5 text-sm font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg mb-1"
              >
                🧠 AI Quiz & MCQ Generator
              </Link>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-lg text-sm font-bold text-white btn-gradient text-center shadow-xs"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
