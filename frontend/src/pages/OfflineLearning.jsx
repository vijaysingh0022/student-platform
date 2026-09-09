import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import { useOffline } from "../context/OfflineContext.jsx";
import {
  getStoredPacks,
  saveOfflineBundle,
  getStoredQuestions,
  queueOfflineTest,
  getStorageUsageKB,
  clearOfflineStorage,
} from "../services/offlineStorage.js";

const OfflineLearning = () => {
  const {
    isOnline,
    isLowDataMode,
    isSimulatorActive,
    pendingSyncCount,
    syncQueue,
    syncing,
    lastSyncTime,
    syncNow,
    refreshQueue,
    toggleLowDataMode,
    toggleOfflineSimulator,
    showNotification,
  } = useOffline();

  const [activeTab, setActiveTab] = useState("packs");
  const [downloadingBundle, setDownloadingBundle] = useState(false);
  const [downloadedPacks, setDownloadedPacks] = useState(getStoredPacks());
  const [storageUsedKB, setStorageUsedKB] = useState(getStorageUsageKB());

  // Offline Quiz State
  const [quizSubject, setQuizSubject] = useState("DBMS");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTopicBreakdown, setQuizTopicBreakdown] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);

  // Download Offline Content Bundle from server
  const handleDownloadPacks = async (subject = "All") => {
    if (!isOnline) {
      showNotification("Cannot download new packs while offline. Please connect to internet.");
      return;
    }

    setDownloadingBundle(true);
    try {
      const { data: bundle } = await api.get(`/offline/content-bundle?subject=${subject}`);
      saveOfflineBundle(bundle);
      setDownloadedPacks(getStoredPacks());
      setStorageUsedKB(getStorageUsageKB());
      showNotification(`✅ Successfully downloaded ${bundle.studyPacks?.length || 3} offline study pack(s) & ${bundle.totalQuestions} questions!`);
    } catch (err) {
      console.error("Download error:", err);
      showNotification("Failed to download offline content. Please check internet connection.");
    } finally {
      setDownloadingBundle(false);
    }
  };

  // Start Offline Quiz
  const handleStartQuiz = (subj) => {
    setQuizSubject(subj);
    const questions = getStoredQuestions(subj);
    setQuizQuestions(questions.slice(0, 5));
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizStarted(true);
    setActiveTab("quiz");
  };

  // Submit Offline Quiz
  const handleSubmitQuiz = () => {
    let correctCount = 0;
    const topicMap = {};

    quizQuestions.forEach((q, idx) => {
      const userAns = selectedAnswers[idx];
      const isCorrect = userAns === q.correctAnswerIndex;
      if (isCorrect) correctCount++;

      const topicName = q.topic || "General";
      if (!topicMap[topicName]) topicMap[topicName] = { correct: 0, total: 0 };
      topicMap[topicName].total++;
      if (isCorrect) topicMap[topicName].correct++;
    });

    const scorePercent = Math.round((correctCount / quizQuestions.length) * 100);
    setQuizScore(scorePercent);
    setQuizTopicBreakdown(topicMap);
    setQuizSubmitted(true);

    // Queue in client-side offline storage
    const queuedItem = queueOfflineTest({
      subject: quizSubject,
      totalQuestions: quizQuestions.length,
      correctAnswers: correctCount,
      scorePercent,
      topicBreakdown: topicMap,
    });

    refreshQueue();
    setStorageUsedKB(getStorageUsageKB());

    if (isOnline) {
      showNotification("Test evaluated locally and auto-synced to server!");
      syncNow();
    } else {
      showNotification("Test evaluated offline & saved in local queue. Will auto-sync when online.");
    }
  };

  // Clear Storage
  const handleClearCache = () => {
    if (confirm("Are you sure you want to clear all offline cached packs and test queues?")) {
      clearOfflineStorage();
      setDownloadedPacks([]);
      refreshQueue();
      setStorageUsedKB(getStorageUsageKB());
      showNotification("Offline local storage cleared.");
    }
  };

  const TABS = [
    { id: "packs", label: "Offline Packs", icon: "📦" },
    { id: "quiz", label: "Offline Quiz Arena", icon: "📝" },
    { id: "cheatsheets", label: "Cheat-Sheets", icon: "📚" },
    { id: "queue", label: "Auto-Sync Queue", icon: "🔄", count: pendingSyncCount },
    { id: "settings", label: "Low Data & Storage", icon: "⚡" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6" id="offline-learning-page">
      {/* ── HEADER & NETWORK STATUS BANNER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
              🛡️ UNINTERRUPTED LEARNING ENGINE
            </span>
            {isOnline ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Offline Mode Active
              </span>
            )}
            {isLowDataMode && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                ⚡ Low-Data Mode
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Offline & Low-Bandwidth <span className="gradient-text">Learning Hub</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Download study packs, take tests with zero internet, save local progress, and auto-sync seamlessly when connected.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
          {/* Offline Simulator Switch */}
          <button
            onClick={toggleOfflineSimulator}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1.5 ${
              isSimulatorActive
                ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
            }`}
          >
            <span>{isSimulatorActive ? "🔴 Offline Sim: ON" : "⚪ Simulate Offline"}</span>
          </button>

          {/* Low Data Mode Switch */}
          <button
            onClick={toggleLowDataMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1.5 ${
              isLowDataMode
                ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
            }`}
          >
            <span>⚡ {isLowDataMode ? "Low Data: ON" : "Low Data Mode"}</span>
          </button>

          {/* Sync Button */}
          <button
            onClick={syncNow}
            disabled={syncing || pendingSyncCount === 0 || !isOnline}
            className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold btn-gradient text-white flex items-center gap-1.5 shadow-sm disabled:opacity-40"
          >
            {syncing ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span>🔄</span>}
            <span>{syncing ? "Syncing..." : `Sync (${pendingSyncCount})`}</span>
          </button>
        </div>
      </div>

      {/* ── TAB NAV ── */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-white text-emerald-700 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 1: DOWNLOAD CONTENT FOR OFFLINE USE ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "packs" && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Top Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 uppercase">
                One-Click Offline Download
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                Offline Course Bundles & Cheat-Sheets
              </h2>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed mt-0.5">
                Download questions, formulas, and topic cheat-sheets directly to browser storage. Once downloaded, you can study and take full quizzes with zero internet.
              </p>
            </div>
            <button
              onClick={() => handleDownloadPacks("All")}
              disabled={downloadingBundle || !isOnline}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shrink-0 shadow-sm disabled:opacity-50"
            >
              {downloadingBundle ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span>📥</span>}
              <span>{downloadingBundle ? "Downloading Pack..." : "Download All Subject Packs"}</span>
            </button>
          </div>

          {/* Subject Packs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { subject: "DSA", title: "Data Structures & Algos", icon: "⚡", topics: ["Binary Search & Arrays", "BST & Tree Traversals", "Dynamic Programming & Graphs"], size: "28 KB" },
              { subject: "DBMS", title: "Database Systems & SQL", icon: "🗄️", topics: ["Normalization (1NF-BCNF)", "B+ Trees & Indexing", "ACID & Transactions"], size: "24 KB" },
              { subject: "OS", title: "Operating Systems", icon: "💻", topics: ["Process Scheduling (PCB)", "Deadlocks & Bankers Algo", "Paging & Memory Management"], size: "22 KB" },
              { subject: "CN", title: "Computer Networks", icon: "🌐", topics: ["TCP 3-Way Handshake", "Subnetting & CIDR Math", "DNS & HTTPS / TLS"], size: "25 KB" },
              { subject: "OOPS", title: "OOPs & SOLID Principles", icon: "🧩", topics: ["4 Pillars & Polymorphism", "vtable / vptr Internals", "Design Patterns & SOLID"], size: "23 KB" },
              { subject: "SYSTEM_DESIGN", title: "System Design & Arch", icon: "🏗️", topics: ["Caching & Cache Stampede", "Load Balancing & Sharding", "CAP Theorem & Consistency"], size: "26 KB" },
              { subject: "APTITUDE", title: "Aptitude & Reasoning", icon: "🧠", topics: ["Time & Work Formulas", "Speed-Distance & Trains", "Probability & Combinatorics"], size: "20 KB" },
              { subject: "WEB_DEV", title: "Web Dev & DevOps", icon: "🚀", topics: ["Event Loop & Async Microtasks", "REST API Idempotency", "Docker, JWT & Git Rebase"], size: "25 KB" },
            ].map((pack, idx) => {
              const isDownloaded = downloadedPacks.some((p) => p.subject === pack.subject);

              return (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-all">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{pack.icon}</span>
                        <div>
                          <h3 className="text-xs font-extrabold text-slate-900">{pack.title}</h3>
                          <span className="text-[10px] text-slate-400 font-bold">{pack.subject} · {pack.size}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${isDownloaded ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                        {isDownloaded ? "✅ Ready" : "Cloud"}
                      </span>
                    </div>

                    <div className="space-y-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Offline Topics:</div>
                      <ul className="text-[11px] text-slate-700 space-y-0.5 font-medium">
                        {pack.topics.map((t, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <span className="text-emerald-600 font-bold text-[10px]">✓</span>
                            <span className="truncate">{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleStartQuiz(pack.subject)}
                      className="py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 text-center shadow-sm"
                    >
                      📝 Quiz
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("cheatsheets");
                      }}
                      className="py-1.5 rounded-xl text-xs font-extrabold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 text-center"
                    >
                      📖 Notes
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Start Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-slate-600 font-medium">
              <strong className="text-slate-900">Storage Usage:</strong> {storageUsedKB} KB stored locally. Offline tests automatically queue and sync on connection.
            </div>
            <button
              onClick={() => handleStartQuiz("DSA")}
              className="px-4 py-2 rounded-xl font-extrabold bg-slate-900 text-white hover:bg-slate-800 shrink-0 text-center"
            >
              🚀 Launch Offline Quiz Arena
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 2: OFFLINE QUIZ ARENA ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "quiz" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                100% Client-Side Evaluation
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                📝 Offline Diagnostic Assessment
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Questions are loaded from local cache. Scores and topic gaps evaluate with zero network latency.
              </p>
            </div>

            {/* Subject Selector */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
              {["DSA", "DBMS", "OS", "CN", "OOPS", "SYSTEM_DESIGN", "APTITUDE", "WEB_DEV"].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStartQuiz(s)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                    quizSubject === s && quizStarted
                      ? "bg-white text-emerald-700 shadow-sm border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {!quizStarted ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 space-y-4">
              <div className="text-4xl">📝</div>
              <h3 className="text-base font-extrabold text-slate-900">Start an Offline Assessment</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                Choose a subject above to launch a 5-question diagnostic test that runs entirely in your browser without an active connection.
              </p>
              <button
                onClick={() => handleStartQuiz("DSA")}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold btn-gradient text-white shadow-sm"
              >
                Start DSA Offline Test →
              </button>
            </div>
          ) : !quizSubmitted ? (
            <div className="space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500">
                  Question {currentQIndex + 1} of {quizQuestions.length}
                </span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  {quizQuestions[currentQIndex]?.topic || quizSubject}
                </span>
              </div>

              {/* Question Text */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 leading-relaxed">
                  {quizQuestions[currentQIndex]?.questionText}
                </h3>

                {/* Options */}
                <div className="space-y-2.5">
                  {(quizQuestions[currentQIndex]?.options || []).map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => {
                        setSelectedAnswers({ ...selectedAnswers, [currentQIndex]: optIdx });
                      }}
                      className={`w-full p-3.5 rounded-xl text-xs font-semibold text-left border transition-all flex items-center justify-between ${
                        selectedAnswers[currentQIndex] === optIdx
                          ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span>{opt}</span>
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${selectedAnswers[currentQIndex] === optIdx ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"}`}>
                        {selectedAnswers[currentQIndex] === optIdx ? "✓" : ""}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))}
                  disabled={currentQIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40"
                >
                  ← Previous
                </button>

                {currentQIndex < quizQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQIndex(currentQIndex + 1)}
                    className="px-5 py-2 rounded-xl text-xs font-extrabold bg-slate-900 text-white hover:bg-slate-800"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className="px-6 py-2.5 rounded-xl text-xs font-extrabold btn-gradient text-white shadow-sm disabled:opacity-40"
                  >
                    🚀 Submit & Evaluate Offline
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Result */
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                    Offline Assessment Evaluated
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Your Offline Score: {quizScore}%
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Test result has been queued locally in browser storage and will synchronize automatically to your permanent student record.
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm shrink-0">
                  <div className="text-3xl font-extrabold text-emerald-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {quizScore}%
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Local Mastery</span>
                </div>
              </div>

              {/* Topic Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  📊 Topic Accuracy Breakdown:
                </h4>
                <div className="space-y-2">
                  {Object.entries(quizTopicBreakdown).map(([topic, stats], idx) => {
                    const pct = Math.round((stats.correct / stats.total) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>{topic}</span>
                          <span>{stats.correct}/{stats.total} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: pct >= 75 ? "#059669" : pct >= 50 ? "#d97706" : "#dc2626",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleStartQuiz(quizSubject)}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                >
                  🔄 Retake Assessment
                </button>
                <button
                  onClick={() => setActiveTab("queue")}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                >
                  View Sync Queue ({pendingSyncCount}) →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 3: CHEAT-SHEETS & STUDY NOTES ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "cheatsheets" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                📚 Offline High-Yield Revision Cheatsheets
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Instant access to core definitions, Big-O complexities, and exam formulas without requiring internet.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center gap-1.5 self-start"
            >
              <span>🖨️</span><span>Print Notes</span>
            </button>
          </div>

          <div className="space-y-6">
            {[
              {
                subject: "DSA — Data Structures & Algorithmic Complexity",
                cards: [
                  { title: "Binary Search Tree Traversals", desc: "Inorder: Left -> Root -> Right (Yields sorted ascending order). Preorder: Root -> Left -> Right (Useful for cloning tree topology). Postorder: Left -> Right -> Root (Ideal for tree deletion and bottom-up computation)." },
                  { title: "Graph Shortest Path & Traversals", desc: "BFS uses Queue (O(V+E)) for unweighted shortest path. DFS uses Stack/Recursion (O(V+E)) for cycle detection, topological sorting, and strongly connected components (Tarjan/Kosaraju)." },
                  { title: "Big-O Master Theorem Reference", desc: "For T(n) = aT(n/b) + f(n): If f(n) = O(n^(log_b a - ε)), then T(n) = Θ(n^(log_b a)). If f(n) = Θ(n^(log_b a)), then T(n) = Θ(n^(log_b a) * log n)." },
                ],
              },
              {
                subject: "DBMS — Database Normalization & Indexing",
                cards: [
                  { title: "Normal Forms Quick Reference", desc: "1NF enforces atomic attributes. 2NF removes partial dependencies on composite primary keys. 3NF removes transitive dependencies (X -> Y requires X is superkey or Y is prime). BCNF requires that for all functional dependencies X -> Y, X must strictly be a candidate key." },
                  { title: "B+ Tree Indexing Rules", desc: "Leaves are connected sequentially as a doubly linked list for range searches (e.g. BETWEEN '2024-01-01' AND '2024-12-31'). Clustered indexes dictate physical storage order (only 1 per table)." },
                  { title: "ACID Properties in Transactions", desc: "Atomicity via Undo Logging / Rollback. Consistency via constraint validation. Isolation via 2-Phase Locking (2PL). Durability via Write-Ahead Logging (WAL) and Redo logs." },
                ],
              },
              {
                subject: "OS — Concurrency, Deadlocks & Memory",
                cards: [
                  { title: "Process States & Scheduling", desc: "New -> Ready -> Running -> Waiting -> Terminated. Context switching overhead includes register saving, cache invalidation, and TLB flushes. FCFS, Round Robin, and Priority scheduling algorithms." },
                  { title: "4 Coffman Deadlock Conditions", desc: "1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, 4. Circular Wait. Banker's Algorithm prevents deadlock by maintaining a safe state allocation matrix." },
                  { title: "Virtual Memory & Paging", desc: "Page Table translates virtual page numbers to physical frame numbers. Translation Lookaside Buffer (TLB) provides hardware caching of recent translations." },
                ],
              },
              {
                subject: "CN — Computer Networks & Protocols",
                cards: [
                  { title: "TCP 3-Way Handshake & Teardown", desc: "Connect: Client sends SYN(seq=x) -> Server sends SYN(seq=y)+ACK(x+1) -> Client sends ACK(y+1). Disconnect: 4-Way FIN/ACK handshake." },
                  { title: "Subnetting & CIDR Math", desc: "Prefix /24 = 256 IPs (254 usable). Prefix /28 = 16 IPs (14 usable). Subnet Mask = 255.255.255.(256 - 2^(32-prefix))." },
                  { title: "Application & Security Protocols", desc: "DNS (UDP/53), HTTP (TCP/80), HTTPS (TCP/443 with TLS 1.3 key exchange using ECDHE), ARP (Maps IPv4 to 48-bit MAC)." },
                ],
              },
              {
                subject: "OOPS — Object Oriented Design & SOLID",
                cards: [
                  { title: "4 Core Pillars & Polymorphism", desc: "Encapsulation (data hiding), Abstraction (interface contract), Inheritance (is-a reuse), Polymorphism (Runtime resolved via vtable/vptr pointers)." },
                  { title: "SOLID Engineering Principles", desc: "S: Single Responsibility, O: Open/Closed (extend via interfaces), L: Liskov Substitution, I: Interface Segregation, D: Dependency Inversion (inject abstractions)." },
                  { title: "Creational & Structural Patterns", desc: "Singleton (Thread-safe Double-Checked Locking), Factory Method (instantiates subclasses), Observer (Pub/Sub notifications)." },
                ],
              },
              {
                subject: "SYSTEM DESIGN — High Availability & Scalability",
                cards: [
                  { title: "CAP Theorem Tradeoffs", desc: "In distributed networks with Network Partitions (P), choose between Consistency (CP - banking/financials) or Availability (AP - feeds/social)." },
                  { title: "Distributed Caching & Invalidation", desc: "Cache-Aside, Write-Through, Write-Back. Prevent Cache Stampede using Redis Distributed Mutex Locks or Probabilistic Early Expiration (XFetch)." },
                  { title: "Database Sharding & Partitioning", desc: "Consistent Hashing with virtual vnodes avoids full re-sharding when scaling cluster nodes from N to N+1." },
                ],
              },
              {
                subject: "APTITUDE — Quantitative & Analytical Formulas",
                cards: [
                  { title: "Time, Speed & Relative Velocity", desc: "Speed = Distance / Time. km/h to m/s: multiply by 5/18. Trains moving in opposite directions: Relative Speed = S1 + S2. Same direction: |S1 - S2|." },
                  { title: "Work & Pipe Systems", desc: "If A takes X days and B takes Y days: Combined Time = (X * Y) / (X + Y) days. Inlet pipe +1/A, Drainage leak -1/B." },
                  { title: "Probability & Combinatorics", desc: "Permutations nPr = n! / (n-r)!. Combinations nCr = n! / (r! * (n-r)!). Probability = Favorable Outcomes / Total Sample Space." },
                ],
              },
              {
                subject: "WEB DEV — Modern Architecture & DevOps",
                cards: [
                  { title: "JS Event Loop & Execution", desc: "Call Stack -> Microtask Queue (Promises, queueMicrotask) -> Macrotask Queue (setTimeout, setInterval, I/O). Microtasks have absolute execution priority." },
                  { title: "REST APIs & Idempotent Methods", desc: "Idempotent: GET, PUT, DELETE, HEAD, OPTIONS. Non-Idempotent: POST. 200 OK, 201 Created, 401 Unauthorized, 403 Forbidden, 404 Not Found." },
                  { title: "Containers & Authentication", desc: "Docker Containers share host OS kernel; VMs virtualize full hardware via Hypervisor. JWT Structure: Base64(Header) . Base64(Payload) . HMAC-SHA256 Signature." },
                ],
              },
            ].map((section, sIdx) => (
              <div key={sIdx} className="space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 border-l-4 border-emerald-600 pl-2.5">
                  {section.subject}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {section.cards.map((card, cIdx) => (
                    <div key={cIdx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <h4 className="text-xs font-extrabold text-emerald-950">{card.title}</h4>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">{card.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 4: AUTO-SYNC QUEUE MANAGER ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "queue" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                🔄 Offline Progress & Auto-Sync Queue
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Local assessments queued while disconnected. Automatically flushed when connectivity resumes.
              </p>
            </div>
            <button
              onClick={syncNow}
              disabled={syncing || syncQueue.length === 0 || !isOnline}
              className="px-4 py-2 rounded-xl text-xs font-extrabold btn-gradient text-white flex items-center gap-2 self-start shadow-sm disabled:opacity-40"
            >
              {syncing ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span>🔄</span>}
              <span>{syncing ? "Syncing Batch..." : "Sync All Pending Records"}</span>
            </button>
          </div>

          {/* Sync Status Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Pending in Queue</div>
              <div className="text-2xl font-extrabold text-slate-900">{syncQueue.length} items</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Network Status</div>
              <div className={`text-sm font-extrabold mt-1 ${isOnline ? "text-emerald-600" : "text-rose-600"}`}>
                {isOnline ? "🟢 Connected (Auto-Sync On)" : "🔴 Disconnected (Queue Active)"}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Last Sync Time</div>
              <div className="text-sm font-extrabold text-slate-800 mt-1">{lastSyncTime || "Never in this session"}</div>
            </div>
          </div>

          {/* Queue Items List */}
          {syncQueue.length === 0 ? (
            <div className="p-10 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 space-y-2">
              <div className="text-3xl">✅</div>
              <h4 className="text-sm font-extrabold text-slate-800">All Records Synchronized</h4>
              <p className="text-xs text-slate-500 font-medium">
                No offline tests currently pending in the synchronization queue. Take an offline test to test local queuing.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Pending Offline Submissions:
              </h4>
              <div className="space-y-2">
                {syncQueue.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-extrabold text-slate-900">{item.subject} Diagnostic Assessment</div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        Attempt ID: {item.offlineAttemptId} · Recorded: {new Date(item.completedAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-emerald-600 text-sm">{item.scorePercent}%</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                        ⏳ Queued
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 5: LOW DATA MODE & STORAGE ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in-up">
          <div className="pb-4 border-b border-slate-200">
            <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ⚡ Low Data Mode & Cache Storage Manager
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Optimize network payload for 2G/3G connections and manage browser local cache
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Low Data Mode Setting Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Low-Bandwidth Compression</h3>
                  <p className="text-xs text-slate-500 font-medium">Reduces payload, disables heavy animations & compresses queries</p>
                </div>
                <button
                  onClick={toggleLowDataMode}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                    isLowDataMode ? "bg-amber-500 text-white border-amber-500" : "bg-white text-slate-800 border-slate-300"
                  }`}
                >
                  {isLowDataMode ? "ON" : "OFF"}
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Disables background heavy gradients and continuous polling</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Prioritizes local browser cache for questions and formulas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Batches API requests to prevent timeout errors on 2G/3G</span>
                </div>
              </div>
            </div>

            {/* Offline Cache Storage Manager */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Browser Cache Quota</h3>
                <p className="text-xs text-slate-500 font-medium">Manage client-side IndexedDB and LocalStorage space</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Storage Used</span>
                  <span>{storageUsedKB} KB / 50 MB</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min(100, Math.max(2, (parseFloat(storageUsedKB) / 50000) * 100))}%` }} />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleClearCache}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all"
                >
                  🗑️ Clear Offline Cache
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineLearning;
