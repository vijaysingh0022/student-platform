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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

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
    { to: "/career-readiness",    label: "Career Engine",  icon: "💼" },
    { to: "/placement-readiness", label: "Placement AI",   icon: "🎯" },
    { to: "/teacher-dashboard",   label: "Faculty Portal", icon: "🎓" },
    { to: "/offline-learning",    label: "Offline Hub",    icon: "🛡️" },
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

              {/* User avatar chip */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-slate-100 border border-slate-200 font-semibold"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}
                >
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-slate-800">
                  {user.name?.split(" ")[0]}
                </span>
              </div>

              <button
                id="nav-logout-btn"
                onClick={handleLogout}
                className="ml-1 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-rose-700 hover:bg-rose-50 transition-all border border-slate-200"
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
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
