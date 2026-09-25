import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useOffline } from "../context/OfflineContext.jsx";
import { useAppState } from "../context/AppStateContext.jsx";
import GlobalSearchModal from "./GlobalSearchModal.jsx";

export const TopHeader = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { isOnline, isLowDataMode, pendingSyncCount } = useOffline();
  const { refreshing } = useAppState();
  const isSyncing = Object.values(refreshing || {}).some(Boolean);

  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "AI Engine Online",
      desc: "DeepSeek & GPT-4o ready for 24/7 intelligent tutoring.",
      time: "Just now",
      unread: true,
      icon: "🤖",
    },
    {
      id: 2,
      title: "Daily Study Challenge",
      desc: "Solve today's tree traversal question to maintain your streak.",
      time: "1h ago",
      unread: true,
      icon: "🔥",
    },
    {
      id: 3,
      title: "New Exam Prep PYQs",
      desc: "12+ university previous year papers available with step-by-step solutions.",
      time: "Yesterday",
      unread: false,
      icon: "🎓",
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all">
        {/* Left: Mobile hamburger & Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {/* Mobile hamburger toggle */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Open navigation sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Minimal Search Bar */}
          <div
            onClick={() => setSearchOpen(true)}
            className="cursor-pointer w-full flex items-center justify-between px-3.5 py-2 bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300 rounded-xl text-slate-500 text-xs transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="font-medium text-slate-500 group-hover:text-slate-700">
                Search topics, tests, algorithms, quiz...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 rounded-md shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Actions & User Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Online / Offline Sync Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-semibold text-slate-600">
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span>{isOnline ? "Live Sync" : "Offline"}</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((prev) => !prev)}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-pulse" />
              )}
            </button>

            {/* Dropdown Menu */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-700">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                        n.unread ? "bg-indigo-50/30" : ""
                      }`}
                    >
                      <span className="text-xl p-1.5 rounded-xl bg-slate-100 shrink-0">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{n.title}</p>
                          <span className="text-[10px] text-slate-400 font-medium shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Controls */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-full ring-2 ring-indigo-500/30",
                },
              }}
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">
                {user?.name?.split(" ")[0] || "Vijay"}
              </p>
              <p className="text-[10px] font-semibold text-slate-400 leading-none mt-1">
                CSE Scholar
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={(val) => {
          if (typeof val === "boolean") setSearchOpen(val);
          else setSearchOpen(false);
        }}
      />
    </>
  );
};

export default TopHeader;
