import React, { useState } from "react";
import { useOffline } from "../context/OfflineContext.jsx";
import OfflineQuizModal from "../components/offline/OfflineQuizModal.jsx";
import OfflineQuickToolsModal from "../components/offline/OfflineQuickToolsModal.jsx";
import OfflineSearchModal from "../components/offline/OfflineSearchModal.jsx";
import OfflineStorageModal from "../components/offline/OfflineStorageModal.jsx";
import OfflineSyncQueueModal from "../components/offline/OfflineSyncQueueModal.jsx";
import PrepareOfflineModal from "../components/offline/PrepareOfflineModal.jsx";

const OfflineLearning = () => {
  const {
    isOnline,
    isSimulatorActive,
    toggleOfflineSimulator,
    stats,
    offlineReadinessPercent,
    pendingSyncCount,
    syncedCount,
    syncing,
    lastSyncTime,
    syncNow,
    continueTopic,
    recentActivities,
    downloadedSubjects,
    storageData,
    lowDataSettings,
    updateLowDataSetting,
    showNotification,
  } = useOffline();

  // Modals state
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizParams, setQuizParams] = useState({
    subject: "Data Structures & Algorithms",
    unit: "Trees",
    difficulty: "Medium",
    count: 5,
  });

  const [isQuickToolsOpen, setIsQuickToolsOpen] = useState(false);
  const [quickToolsTab, setQuickToolsTab] = useState("notes");

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isPrepareModalOpen, setIsPrepareModalOpen] = useState(false);

  // Subject Card Dropdown Menu
  const [activeMenuSubjectId, setActiveMenuSubjectId] = useState(null);

  // Quick Offline Quiz selector state
  const [selectedQuizSubject, setSelectedQuizSubject] = useState("Data Structures & Algorithms");
  const [selectedQuizUnit, setSelectedQuizUnit] = useState("Trees");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Medium");
  const [selectedQCount, setSelectedQCount] = useState(5);

  const handleStartQuizFromCard = () => {
    setQuizParams({
      subject: selectedQuizSubject,
      unit: selectedQuizUnit,
      difficulty: selectedDifficulty,
      count: selectedQCount,
    });
    setIsQuizModalOpen(true);
  };

  const handleOpenSubjectOffline = (subj) => {
    setQuickToolsTab("notes");
    setIsQuickToolsOpen(true);
    showNotification(`Opened ${subj.name} in offline study mode.`);
  };

  const handleOpenQuickTool = (tabName) => {
    setQuickToolsTab(tabName);
    setIsQuickToolsOpen(true);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans text-slate-900">
      {/* ── TOP SEARCH & OFFLINE QUICK SEARCH TRIGGER BAR ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2">
        <div
          onClick={() => setIsSearchOpen(true)}
          className="flex-1 max-w-xl flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <span className="text-slate-400 group-hover:text-blue-600 transition-colors">🔍</span>
          <span className="text-xs text-slate-400 font-medium group-hover:text-slate-600">
            Search topics, subjects, notes, questions...
          </span>
          <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
            ⌘K
          </span>
        </div>

        {/* Network & Offline Engine Indicator with Live Simulator Switch */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={toggleOfflineSimulator}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              isOnline
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
            }`}
            title="Click to toggle offline mode simulation"
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOnline ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <span>{isOnline ? "Online" : "Offline"}</span>
            <span className="text-[10px] font-normal text-slate-400 border-l border-slate-300 pl-1.5">
              {isSimulatorActive ? "Test Mode" : "Live"}
            </span>
          </button>
        </div>
      </div>

      {/* ==================================================
          1. HERO — SIMPLE & POWERFUL + COMPACT STATUS CARD
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Hero Card (8 cols) */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-white border border-blue-100/80 p-6 sm:p-8 flex flex-col justify-between shadow-sm">
          {/* Subtle decorative circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-200/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-indigo-200/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-xl">
            {/* Top Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-100/80 text-blue-800 border border-blue-200">
                🛡️ OFFLINE LEARNING ENGINE
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  isOnline
                    ? "bg-emerald-100/70 text-emerald-800 border border-emerald-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOnline ? "bg-emerald-600" : "bg-red-600"
                  }`}
                />
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black tracking-tight text-slate-900 leading-tight">
              Learn Anywhere. Even{" "}
              <span className="text-blue-600">Without Internet</span>.
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-lg">
              Download your courses once. Study, practice, take tests, and track your progress offline. LearnX automatically syncs everything when you're back online.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsPrepareModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 flex items-center gap-2"
              >
                <span>Prepare for Offline Study</span>
                <span>→</span>
              </button>
              <button
                onClick={() => setIsStorageModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Manage Downloads</span>
              </button>
            </div>
          </div>

          {/* Clean 3D Vector Illustration on Right */}
          <div className="hidden sm:block absolute right-4 bottom-4 lg:right-6 lg:bottom-6 pointer-events-none opacity-90">
            <svg className="w-48 h-36" viewBox="0 0 200 150" fill="none">
              <rect x="25" y="30" width="150" height="95" rx="8" fill="#1e293b" />
              <rect x="33" y="38" width="134" height="79" rx="4" fill="#0f172a" />
              <path d="M10 125h180c4 0 6 2 6 4s-2 4-6 4H10c-4 0-6-2-6-4s2-4 6-4z" fill="#94a3b8" />
              {/* Floating badges on screen */}
              <rect x="45" y="48" width="24" height="24" rx="4" fill="#3b82f6" fillOpacity="0.3" stroke="#60a5fa" />
              <path d="M52 60h10M57 55v10" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
              <rect x="75" y="48" width="24" height="24" rx="4" fill="#8b5cf6" fillOpacity="0.3" stroke="#a78bfa" />
              <path d="M82 56l4 8 6-6" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="105" y="48" width="24" height="24" rx="4" fill="#10b981" fillOpacity="0.3" stroke="#34d399" />
              <circle cx="117" cy="60" r="5" stroke="#6ee7b7" strokeWidth="2" />
              <rect x="135" y="48" width="24" height="24" rx="4" fill="#f59e0b" fillOpacity="0.3" stroke="#fbbf24" />
              <path d="M140 64v-6M147 64v-10M154 64v-4" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
              <rect x="45" y="80" width="114" height="6" rx="3" fill="#334155" />
              <rect x="45" y="92" width="75" height="6" rx="3" fill="#334155" />
            </svg>
          </div>
        </div>

        {/* Right Status Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 text-sm">🎯</span>
                <h3 className="text-sm font-bold text-slate-900">Offline Learning Status</h3>
              </div>
              <button
                onClick={() => setIsStorageModalOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Manage
              </button>
            </div>

            {/* Offline Ready Pill */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                ✓
              </div>
              <div>
                <div className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                  OFFLINE READY
                </div>
                <div className="text-[11px] text-emerald-700 font-medium">
                  Your content is downloaded and ready.
                </div>
              </div>
            </div>

            {/* 4 Stats Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-lg font-black text-slate-900">{stats.subjectsCount}</div>
                <div className="text-[11px] font-semibold text-slate-500">Subjects</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-lg font-black text-slate-900">{stats.topicsCount}</div>
                <div className="text-[11px] font-semibold text-slate-500">Topics</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-lg font-black text-slate-900">{stats.questionsCount}</div>
                <div className="text-[11px] font-semibold text-slate-500">Questions</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-lg font-black text-slate-900">{stats.storageMB} MB</div>
                <div className="text-[11px] font-semibold text-slate-500">Storage Used</div>
              </div>
            </div>
          </div>

          {/* Footer Sync & Status */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 flex items-center gap-1.5 font-medium">
              <span>🔄</span> Last synced: {lastSyncTime || "Today"}
            </span>
            <span
              className={`font-bold flex items-center gap-1 ${
                pendingSyncCount > 0 ? "text-amber-600" : "text-emerald-600"
              }`}
            >
              <span>{pendingSyncCount > 0 ? "🔵" : "🛡️"}</span>
              {pendingSyncCount > 0 ? `${pendingSyncCount} waiting` : "Up to date"}
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================
          2. OFFLINE STATUS BAR (5 COMPACT METRIC CARDS)
          ================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* 1. Connection Status */}
        <div
          onClick={toggleOfflineSimulator}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-3 cursor-pointer hover:border-slate-300 transition-all group"
          title="Click to toggle offline simulation"
        >
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              isOnline ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            }`}
          >
            <span className="text-lg">{isOnline ? "📶" : "🔴"}</span>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Connection Status
            </div>
            <div className="text-xs font-black text-slate-900 truncate">
              {isOnline ? "Online" : "Offline"}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {isOnline ? "All progress syncing normally" : "You're still ready to learn."}
            </div>
          </div>
        </div>

        {/* 2. Offline Readiness */}
        <div
          onClick={() => setIsPrepareModalOpen(true)}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-3 cursor-pointer hover:border-slate-300 transition-all group"
        >
          <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="3.5"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeDasharray={`${offlineReadinessPercent}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[11px] font-black text-slate-900">
              {offlineReadinessPercent}%
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Offline Readiness
            </div>
            <div className="text-xs font-bold text-slate-700 truncate">Prepared for study</div>
            <span className="text-[10px] text-blue-600 font-bold group-hover:underline">
              View Details →
            </span>
          </div>
        </div>

        {/* 3. Device Storage */}
        <div
          onClick={() => setIsStorageModalOpen(true)}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-3 cursor-pointer hover:border-slate-300 transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shrink-0">
            💾
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Device Storage
            </div>
            <div className="text-xs font-black text-slate-900">
              {storageData?.totalUsedMB || 186} MB / 1 GB
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
              <div
                className="bg-blue-600 h-1 rounded-full"
                style={{ width: `${storageData?.percentUsed || 18}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4. Sync Queue */}
        <div
          onClick={() => setIsSyncModalOpen(true)}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg shrink-0">
              ☁️
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Sync Queue
              </div>
              <div className="text-xs font-black text-slate-900 truncate">
                {pendingSyncCount === 0 ? "0 pending" : `${pendingSyncCount} pending`}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {pendingSyncCount === 0 ? "Everything synced" : "Waiting for network"}
              </div>
            </div>
          </div>
          <span className="text-slate-400 group-hover:text-blue-600 transition-colors">›</span>
        </div>

        {/* 5. Low Data Mode */}
        <div
          onClick={() => updateLowDataSetting("enabled", !lowDataSettings?.enabled)}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg shrink-0">
              ⚡
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Low Data Mode
              </div>
              <div className="text-xs font-black text-slate-900">
                {lowDataSettings?.enabled ? "Enabled" : "Disabled"}
              </div>
              <div className="text-[10px] text-slate-500 truncate">Saves data & optimizes</div>
            </div>
          </div>
          <div
            className={`w-8 h-4 rounded-full p-0.5 transition-colors ${
              lowDataSettings?.enabled ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full bg-white transition-transform ${
                lowDataSettings?.enabled ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
        </div>
      </div>

      {/* ==================================================
          3. CONTINUE LEARNING + QUICK TOOLS + QUIZ ARENA
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* 3A. Continue Learning Offline (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">
                ▶
              </span>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Continue Learning Offline
              </h3>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl shrink-0">
                🌳
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100">
                    {continueTopic?.subjectCode || "DSA"}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                    Sem {continueTopic?.semester || 3}
                  </span>
                </div>
                <h4 className="text-base font-black text-slate-900 truncate">
                  {continueTopic?.topicTitle || "Binary Search Trees"}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="font-bold text-slate-700">
                    {continueTopic?.progressPercent || 68}% complete
                  </span>
                  <span>•</span>
                  <span>Last studied: {continueTopic?.lastStudied || "12 minutes ago"}</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${continueTopic?.progressPercent || 68}%` }}
              />
            </div>

            {/* Sub details */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">🎯</span>
                <span>Next: {continueTopic?.nextTopic || "Insertion in BST"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">📝</span>
                <span>{continueTopic?.pendingQuestionsCount || 3} pending practice questions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">🔖</span>
                <span>{continueTopic?.bookmarkedNotesCount || 1} bookmarked note</span>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <button
              onClick={() => handleOpenQuickTool("notes")}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <span>Continue Learning</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* 3B. Quick Offline Tools (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="p-1 rounded-md bg-blue-50 text-blue-600 text-xs">📁</span>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Quick Offline Tools
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Notes */}
              <div
                onClick={() => handleOpenQuickTool("notes")}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/60 hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-sm mb-2 group-hover:scale-105 transition-transform">
                  📄
                </div>
                <div className="text-xs font-black text-slate-900 group-hover:text-blue-700">Notes</div>
                <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                  View saved notes
                </div>
              </div>

              {/* Practice */}
              <div
                onClick={() => handleOpenQuickTool("practice")}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-rose-50/60 hover:border-rose-300 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-sm mb-2 group-hover:scale-105 transition-transform">
                  🎯
                </div>
                <div className="text-xs font-black text-slate-900 group-hover:text-rose-700">Practice</div>
                <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                  Solve questions
                </div>
              </div>

              {/* PYQs */}
              <div
                onClick={() => handleOpenQuickTool("pyqs")}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-amber-50/60 hover:border-amber-300 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-sm mb-2 group-hover:scale-105 transition-transform">
                  📑
                </div>
                <div className="text-xs font-black text-slate-900 group-hover:text-amber-700">PYQs</div>
                <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                  Exam questions
                </div>
              </div>

              {/* Cheat Sheets */}
              <div
                onClick={() => handleOpenQuickTool("cheatsheets")}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-indigo-50/60 hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm mb-2 group-hover:scale-105 transition-transform">
                  ⚡
                </div>
                <div className="text-xs font-black text-slate-900 group-hover:text-indigo-700">
                  Cheat Sheets
                </div>
                <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                  Quick revision
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 text-center">
            <span className="text-[11px] text-slate-400 font-medium">
              ✓ All 4 tools work 100% offline
            </span>
          </div>
        </div>

        {/* 3C. Offline Quiz Arena (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-purple-50 text-purple-600 text-xs">🎯</span>
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Offline Quiz Arena
                </h3>
                <p className="text-[11px] text-slate-500">Practice anywhere without internet.</p>
              </div>
            </div>

            {/* Subject Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Select Subject</label>
              <select
                value={selectedQuizSubject}
                onChange={(e) => setSelectedQuizSubject(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-blue-500"
              >
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                <option value="Database Management Systems">Database Management Systems</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="Computer Networks">Computer Networks</option>
              </select>
            </div>

            {/* Unit Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Select Unit</label>
              <select
                value={selectedQuizUnit}
                onChange={(e) => setSelectedQuizUnit(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-blue-500"
              >
                <option value="Trees">Trees & Hierarchies</option>
                <option value="Normalization">Normalization (1NF to BCNF)</option>
                <option value="Process Scheduling">Process Scheduling & Deadlocks</option>
                <option value="Transport Layer">Transport Layer & TCP Protocols</option>
              </select>
            </div>

            {/* Difficulty and Questions Row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-blue-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Questions</label>
                <select
                  value={selectedQCount}
                  onChange={(e) => setSelectedQCount(Number(e.target.value))}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-blue-500"
                >
                  <option value={5}>5 Qs</option>
                  <option value={10}>10 Qs</option>
                  <option value={20}>20 Qs</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStartQuizFromCard}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <span>Start Offline Quiz</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          4. YOUR OFFLINE SUBJECTS (LIBRARY GRID) + ACTIVITY
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: 4 Subjects Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 text-sm">📚</span>
              <h2 className="text-sm font-black text-slate-900">
                Your Offline Subjects ({downloadedSubjects.length} Downloaded)
              </h2>
            </div>
            <button
              onClick={() => setIsPrepareModalOpen(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              View All Subjects →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {downloadedSubjects.map((subject) => (
              <div
                key={subject.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-all relative"
              >
                <div>
                  {/* Top row: Subject & Tag & Status */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-amber-500 text-sm">{subject.icon || "⚡"}</span>
                        <h4 className="text-sm font-black text-slate-900 line-clamp-1">
                          {subject.name}
                        </h4>
                      </div>
                      <div className="text-[11px] text-slate-500 font-semibold">
                        Sem {subject.semester} • {subject.storageMB} MB
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      ✓ Offline Ready
                    </span>
                  </div>

                  {/* Stats Row & Circular Progress */}
                  <div className="flex items-center justify-between py-3 border-y border-slate-100 my-2">
                    <div className="space-y-1 text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">📖</span>
                        <span>
                          {subject.topicsCount} / {subject.totalTopics} Topics
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">🎯</span>
                        <span>{subject.questionsCount} Questions</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">📄</span>
                        <span>{subject.notesCount} Notes</span>
                      </div>
                    </div>

                    {/* Progress Circle */}
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#f1f5f9"
                          strokeWidth="3.5"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3.5"
                          strokeDasharray={`${subject.progressPercent}, 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-[11px] font-black text-slate-900">
                        {subject.progressPercent}%
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 font-medium pb-2">
                    Updated: {subject.lastUpdated}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleOpenSubjectOffline(subject)}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Open Offline
                  </button>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenuSubjectId(
                          activeMenuSubjectId === subject.id ? null : subject.id
                        )
                      }
                      className="w-8 h-8 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center font-bold text-sm transition-colors"
                    >
                      ⋮
                    </button>
                    {activeMenuSubjectId === subject.id && (
                      <div className="absolute right-0 bottom-full mb-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-200 p-1 z-20 text-xs font-bold space-y-0.5">
                        <button
                          onClick={() => {
                            setActiveMenuSubjectId(null);
                            handleOpenQuickTool("practice");
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700"
                        >
                          Practice Questions
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenuSubjectId(null);
                            handleOpenQuickTool("cheatsheets");
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700"
                        >
                          View Formula Sheet
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenuSubjectId(null);
                            setIsStorageModalOpen(true);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-red-50 text-red-600"
                        >
                          Manage Cache
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Offline Activity (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-blue-50 text-blue-600 text-xs">⏱️</span>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Recent Offline Activity
                </h3>
              </div>
              <button
                onClick={() => handleOpenQuickTool("practice")}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2.5">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                        act.type === "topic"
                          ? "bg-emerald-100 text-emerald-700"
                          : act.type === "quiz"
                          ? "bg-blue-100 text-blue-700"
                          : act.type === "bookmark"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {act.icon}
                    </span>
                    <span className="font-bold text-slate-900 truncate">{act.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">
                    {act.timeAgo}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>✓ Verified by local transaction log</span>
            <span className="text-emerald-600 font-bold">Auto-synced</span>
          </div>
        </div>
      </div>

      {/* ==================================================
          5. STORAGE USAGE & SYNC QUEUE ROW
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Storage Usage (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-blue-50 text-blue-600 text-xs">💾</span>
                <h3 className="text-sm font-bold text-slate-900">Storage Usage</h3>
              </div>
              <button
                onClick={() => setIsStorageModalOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Manage Storage →
              </button>
            </div>

            <div className="text-sm font-black text-slate-900">
              {storageData?.totalUsedMB || 186} MB / {storageData?.totalCapacityMB || 1024} MB used
            </div>

            {/* Segmented Progress Bar */}
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div style={{ width: "15%" }} className="bg-blue-600 h-full" title="DSA 28 MB" />
              <div style={{ width: "13%" }} className="bg-teal-500 h-full" title="DBMS 24 MB" />
              <div style={{ width: "12%" }} className="bg-amber-500 h-full" title="OS 22 MB" />
              <div style={{ width: "13%" }} className="bg-indigo-600 h-full" title="CN 25 MB" />
              <div style={{ width: "16%" }} className="bg-sky-500 h-full" title="Notes 31 MB" />
              <div style={{ width: "31%" }} className="bg-slate-300 h-full" title="Other 56 MB" />
            </div>

            {/* Segments Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 font-semibold pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> DSA 28 MB
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> DBMS 24 MB
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> OS 22 MB
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> CN 25 MB
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Notes 31 MB
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Other 56 MB
              </span>
            </div>
          </div>
        </div>

        {/* Sync Queue Status (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-indigo-50 text-indigo-600 text-xs">☁️</span>
                <h3 className="text-sm font-bold text-slate-900">Sync Queue</h3>
              </div>
              <button
                onClick={() => setIsSyncModalOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                View Details →
              </button>
            </div>

            {pendingSyncCount === 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-black text-emerald-950">Everything synced</div>
                  <div className="text-[11px] text-emerald-700">
                    Your offline progress is safely saved.
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    🔵
                  </div>
                  <div>
                    <div className="text-xs font-black text-amber-950">
                      {pendingSyncCount} changes waiting to sync
                    </div>
                    <div className="text-[11px] text-amber-700">
                      {isOnline ? "Ready to upload" : "Will auto-sync on reconnect"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={syncNow}
                  disabled={syncing || !isOnline}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  {syncing ? "Syncing..." : "Sync Now"}
                </button>
              </div>
            )}
          </div>

          <div className="pt-2 text-[11px] text-slate-400 font-medium">
            Conflict-safe synchronization engine • Zero progress overwrites
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE MODALS & DRAWERS ── */}
      <OfflineQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        initialSubject={quizParams.subject}
        initialUnit={quizParams.unit}
        initialDifficulty={quizParams.difficulty}
        initialCount={quizParams.count}
      />

      <OfflineQuickToolsModal
        isOpen={isQuickToolsOpen}
        onClose={() => setIsQuickToolsOpen(false)}
        initialTab={quickToolsTab}
      />

      <OfflineSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(item) => {
          if (item.badge === "Note") {
            setQuickToolsTab("notes");
            setIsQuickToolsOpen(true);
          } else if (item.badge === "Question") {
            setQuickToolsTab("practice");
            setIsQuickToolsOpen(true);
          } else {
            setQuickToolsTab("cheatsheets");
            setIsQuickToolsOpen(true);
          }
        }}
      />

      <OfflineStorageModal
        isOpen={isStorageModalOpen}
        onClose={() => setIsStorageModalOpen(false)}
      />

      <OfflineSyncQueueModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />

      <PrepareOfflineModal
        isOpen={isPrepareModalOpen}
        onClose={() => setIsPrepareModalOpen(false)}
      />
    </div>
  );
};

export default OfflineLearning;
