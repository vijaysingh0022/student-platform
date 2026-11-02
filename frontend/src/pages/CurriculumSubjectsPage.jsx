import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCurriculumSubjects,
  getStudentLearningDashboard,
  searchCurriculum,
  getLearningBookmarks,
  toggleLearningBookmark,
  getTopicNotes,
} from "../services/api.js";
import { useAppState } from "../context/AppStateContext.jsx";
import { CURRICULUM_SUBJECTS as FALLBACK_SUBJECTS } from "../data/fallbackCurriculumSubjects.js";
import LearningCompanion from "../components/LearningCompanion.jsx";

// Navigation tabs matching the screenshot pill navigation
const NAV_TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: "subjects",
    label: "My Subjects",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: "units",
    label: "Units & Topics",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    id: "practice",
    label: "Practice",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id: "notes",
    label: "Notes",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    id: "bookmarks",
    label: "Bookmarks",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    ),
  },
];

const CurriculumSubjectsPage = () => {
  const navigate = useNavigate();
  const { learningVersion } = useAppState();

  const [activeNavTab, setActiveNavTab] = useState("overview");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [notesList, setNotesList] = useState([]);

  // Modals & Drawers
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);
  const [companionInitialMode, setCompanionInitialMode] = useState("beginner");
  const [companionTopic, setCompanionTopic] = useState({
    id: "dbms-u5-normalization",
    title: "Normalization — 2NF & 3NF",
    subjectId: "dbms",
    subjectName: "Database Management Systems",
  });

  // Today's Plan interactive checkbox state matching screenshot exactly
  const [todayTasks, setTodayTasks] = useState([
    {
      id: "p1",
      title: "DBMS — Normalization",
      time: "18 min",
      completed: true,
      subjectId: "dbms",
      topicId: "dbms-u5-normalization",
    },
    {
      id: "p2",
      title: "DSA — Trees",
      time: "25 min",
      completed: false,
      subjectId: "dsa",
      topicId: "dsa-u5-bst-operations",
    },
    {
      id: "p3",
      title: "OS — Process Scheduling",
      time: "20 min",
      completed: false,
      subjectId: "os",
      topicId: "os-u3-scheduling-metrics",
    },
    {
      id: "p4",
      title: "Revise Notes (DBMS)",
      time: "15 min",
      completed: false,
      subjectId: "dbms",
      topicId: "dbms-u5-normalization",
    },
  ]);

  useEffect(() => {
    let isMounted = true;
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [dashRes, subRes, bmRes] = await Promise.all([
          getStudentLearningDashboard().catch(() => ({ data: null })),
          getCurriculumSubjects().catch(() => ({ data: [] })),
          getLearningBookmarks().catch(() => ({ data: [] })),
        ]);

        if (isMounted) {
          if (dashRes?.data) {
            setDashboardData(dashRes.data);
            if (dashRes.data.todaysPlan?.items && dashRes.data.todaysPlan.items.length >= 4) {
              setTodayTasks(dashRes.data.todaysPlan.items);
            }
          }
          if (subRes?.data && subRes.data.length > 0) {
            setSubjects(subRes.data);
          } else {
            setSubjects(FALLBACK_SUBJECTS);
          }
          if (bmRes?.data) {
            setBookmarks(bmRes.data);
          }
        }
      } catch (err) {
        console.error("Error loading My Learning dashboard:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAllData();
    return () => {
      isMounted = false;
    };
  }, [learningVersion]);

  // Load Notes when Notes tab active
  useEffect(() => {
    if (activeNavTab === "notes") {
      getTopicNotes("all")
        .then((res) => {
          if (res?.data?.notes) setNotesList(res.data.notes);
        })
        .catch(() => {});
    }
  }, [activeNavTab]);

  const toggleTask = (taskId) => {
    setTodayTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedTaskCount = todayTasks.filter((t) => t.completed).length;

  const handleStartPlan = () => {
    const nextUnfinished = todayTasks.find((t) => !t.completed) || todayTasks[0];
    if (nextUnfinished) {
      navigate(`/learn/${nextUnfinished.subjectId}/${nextUnfinished.topicId}`);
    }
  };

  // Filter & Sort subjects (for My Subjects tab)
  const filteredSubjects = useMemo(() => {
    let list = [...subjects];

    if (selectedSemester !== "all") {
      list = list.filter((s) => s.semester === parseInt(selectedSemester, 10));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "recommended") {
      list.sort((a, b) => (b.progressPercent || 0) - (a.progressPercent || 0));
    } else if (sortBy === "weakest") {
      list.sort((a, b) => (a.progressPercent || 0) - (b.progressPercent || 0));
    } else if (sortBy === "alphabetical") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [subjects, selectedSemester, searchQuery, sortBy]);

  // Hero Continue Learning Item matching screenshot
  const continueItem = {
    courseCode: "CS202",
    semester: 2,
    topicTitle: "Dynamic Typing, Memory Management\n& Python Bytecode",
    unitTitle: "Unit 1 - Dynamic Typing, Memory Management & Python Bytecode",
    subjectId: "python",
    topicId: "python-u1-c1-t1",
    time: "25 min",
    concepts: "4 concepts",
    progressPercent: 42,
  };

  // Next Best Lesson Item matching screenshot
  const nextBestItem = {
    subjectCode: "DSA",
    semester: 3,
    lessonTitle: "Binary Search Trees",
    supportingReason: "You completed Binary Trees but struggled with insertion questions.",
    subjectId: "dsa",
    topicId: "dsa-u5-bst-operations",
    time: "20 min",
    concepts: "8 concepts",
  };

  return (
    <div className="min-h-screen text-slate-800 pb-12 space-y-5 animate-fade-in">
      {/* ──────────────────────────────────────────────────────────────────────────
          3. TOP LEARNING NAVIGATION PILLS (EXACT PILL MATCH)
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none pb-1 pt-1">
        {NAV_TABS.map((tab) => {
          const isActive = activeNavTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveNavTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? "bg-[#4f46e5] text-white shadow-sm shadow-indigo-500/25 ring-1 ring-[#4f46e5]"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90 hover:bg-slate-50/80 shadow-2xs"
              }`}
            >
              <span className={`shrink-0 ${isActive ? "text-white" : "text-slate-500"}`}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          MAIN VIEW CONTAINER (Default: Overview dashboard matching screenshot)
      ────────────────────────────────────────────────────────────────────────── */}
      {activeNavTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ════════════════════════════════════════════════════════════════════════
              LEFT COLUMN (~68% / 8 COLS)
          ════════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 space-y-5">
            {/* ── CARD 4: HERO SECTION ────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#eff6ff] via-[#f0f4ff] to-[#f8f9ff] border border-blue-100/90 p-7 sm:p-8 shadow-xs flex flex-col md:flex-row justify-between gap-6 min-h-[300px]">
              {/* Left Column Content */}
              <div className="flex-1 max-w-md z-10 flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  {/* Keep Learning Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-700">
                    <span>Keep Learning, Keep Growing 🚀</span>
                  </div>

                  {/* Main Title */}
                  <h1
                    className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight leading-tight"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    My Learning
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed">
                    Your personalized learning space — understand concepts, practice what you learn, and build skills step by step.
                  </p>
                </div>

                {/* 3 Learning Statistics in a row */}
                <div className="flex items-center gap-6 sm:gap-7 pt-1">
                  {/* Stat 1: CSE Curriculum */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center text-slate-700 text-sm shrink-0">
                      📋
                    </div>
                    <div>
                      <div className="text-[12px] font-black text-slate-900 leading-tight">
                        CSE Curriculum
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 leading-tight">
                        Sem 3
                      </div>
                    </div>
                  </div>

                  {/* Stat 2: 12 Subjects */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center text-blue-600 text-sm shrink-0">
                      📖
                    </div>
                    <div>
                      <div className="text-[12px] font-black text-slate-900 leading-tight">
                        12 Subjects
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 leading-tight">
                        48 Topics
                      </div>
                    </div>
                  </div>

                  {/* Stat 3: 26% Overall Progress Circular */}
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
                      <svg className="w-8 h-8 -rotate-90 transform" viewBox="0 0 36 36">
                        <path
                          className="text-slate-200"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#3b82f6]"
                          strokeDasharray="26, 100"
                          stroke="currentColor"
                          strokeWidth="3.8"
                          strokeLinecap="round"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-[8px] font-black text-blue-700">26%</span>
                    </div>
                    <div>
                      <div className="text-[12px] font-black text-slate-900 leading-tight">
                        26%
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 leading-tight">
                        Overall Progress
                      </div>
                    </div>
                  </div>
                </div>

                {/* Continue Learning CTA Button */}
                <div className="pt-2">
                  <Link
                    to={`/learn/${continueItem.subjectId}/${continueItem.topicId}`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-[13px] font-extrabold text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-sm shadow-blue-500/25 transition-all duration-150 group"
                  >
                    <span>Continue Learning</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </Link>
                </div>
              </div>

              {/* Right Side Composition: Study Desk realistic artwork seamlessly blended */}
              <div className="md:w-[46%] relative rounded-2xl overflow-hidden border border-slate-200/60 shadow-xs self-stretch min-h-[220px]">
                <img
                  src="/images/hero-study-desk.jpg"
                  alt="LearnX Student Study Environment"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#eff6ff]/30 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* ── ROW: CONTINUE LEARNING (LEFT) & YOUR NEXT BEST LESSON (RIGHT) ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* ── CARD 6: CONTINUE LEARNING ─────────────────────────────────── */}
              <div className="bg-white rounded-[24px] border border-slate-200/90 p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3.5">
                  {/* Card Header */}
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs shrink-0 border border-blue-100">
                      ▶
                    </span>
                    <div>
                      <h3 className="text-xs font-black text-slate-900 tracking-wider uppercase">
                        CONTINUE LEARNING
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Pick up where you left off and keep your momentum.
                      </p>
                    </div>
                  </div>

                  {/* Course Tags */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-200/80">
                      {continueItem.courseCode}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                      Sem {continueItem.semester}
                    </span>
                  </div>

                  {/* Topic Title with Python Code Thumbnail */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm shrink-0 mt-0.5 shadow-2xs">
                        🐍
                      </span>
                      <h4 className="text-[13px] font-extrabold text-slate-900 leading-snug whitespace-pre-line">
                        {continueItem.topicTitle}
                      </h4>
                    </div>

                    {/* Python / Code Visual Snippet */}
                    <div className="shrink-0 w-20 h-11 bg-slate-900 rounded-lg p-1.5 border border-slate-700/60 shadow-2xs flex flex-col justify-between">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                      <div className="text-[7px] text-emerald-400 font-mono leading-none truncate">
                        def __init__()
                      </div>
                    </div>
                  </div>

                  {/* Stats & Progress */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <span>⏱️ {continueItem.time}</span>
                        <span>·</span>
                        <span>📚 {continueItem.concepts}</span>
                      </span>
                      <span className="text-blue-600 font-black">{continueItem.progressPercent}%</span>
                    </div>

                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-[#2563eb] rounded-full transition-all duration-500"
                        style={{ width: `${continueItem.progressPercent}%` }}
                      />
                    </div>

                    <div className="text-[10px] text-slate-400 font-medium truncate pt-0.5">
                      {continueItem.unitTitle}
                    </div>
                  </div>
                </div>

                {/* Continue Learning Button */}
                <Link
                  to={`/learn/${continueItem.subjectId}/${continueItem.topicId}`}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-white bg-[#2563eb] hover:bg-[#1d4ed8] transition-all shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <span>Continue Learning</span>
                  <span>→</span>
                </Link>
              </div>

              {/* ── CARD 7: NEXT BEST LESSON ──────────────────────────────────── */}
              <div className="bg-white rounded-[24px] border border-slate-200/90 p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3.5">
                  {/* Card Header with "Why this?" button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xs shrink-0 border border-amber-100">
                        ⭐
                      </span>
                      <div>
                        <h3 className="text-xs font-black text-slate-900 tracking-wider uppercase">
                          YOUR NEXT BEST LESSON
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Based on your progress and recent performance
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowWhyModal(true)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-black text-[#4f46e5] bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/70 transition-colors shadow-2xs shrink-0"
                    >
                      Why this?
                    </button>
                  </div>

                  {/* Course Tags */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      {nextBestItem.subjectCode}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                      Sem {nextBestItem.semester}
                    </span>
                  </div>

                  {/* Topic Title with 3D Tree Visual */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-sm shrink-0 mt-0.5 shadow-2xs">
                        🌳
                      </span>
                      <h4 className="text-[13px] font-extrabold text-slate-900 leading-snug">
                        {nextBestItem.lessonTitle}
                      </h4>
                    </div>

                    {/* Small 3D Tree / Graph Node graphic representation */}
                    <div className="shrink-0 w-12 h-11 bg-emerald-50 rounded-xl border border-emerald-200/80 flex items-center justify-center text-emerald-700 text-lg shadow-2xs">
                      🌲
                    </div>
                  </div>

                  {/* Supporting explanation card */}
                  <div className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50/90 p-2.5 rounded-xl border border-slate-100">
                    "{nextBestItem.supportingReason}"
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                    <span>⏱️ {nextBestItem.time}</span>
                    <span>·</span>
                    <span>📚 {nextBestItem.concepts}</span>
                  </div>
                </div>

                {/* Start Learning Button */}
                <Link
                  to={`/learn/${nextBestItem.subjectId}/${nextBestItem.topicId}`}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-white bg-[#2563eb] hover:bg-[#1d4ed8] transition-all shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <span>Start Learning</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* ── CARD 10: LEARNING PATH (BOTTOM FULL WIDTH IN LEFT COL) ───────── */}
            <div className="bg-white rounded-[26px] border border-slate-200/90 p-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
              {/* Left & Middle: Semester Sequence Flow */}
              <div className="flex-1 space-y-4 w-full">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-sm shrink-0">
                      📖
                    </span>
                    <div>
                      <h3 className="text-xs font-black text-slate-900 tracking-wider uppercase">
                        LEARNING PATH
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Structured curriculum across 5 semesters
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveNavTab("subjects")}
                    className="text-xs font-extrabold text-[#2563eb] hover:text-blue-700 flex items-center gap-1 transition-colors"
                  >
                    <span>View Full Curriculum</span>
                    <span>→</span>
                  </button>
                </div>

                {/* 5 Semesters Horizontal Chain with connecting arrows */}
                <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none pt-2 pb-1">
                  {/* SEM 1 */}
                  <div className="flex-1 min-w-[90px] p-2.5 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400">SEM 1</span>
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-black">
                        ✓
                      </span>
                    </div>
                    <div className="text-[11px] font-black text-slate-900 truncate">Foundations</div>
                    <div className="h-1 rounded-full bg-emerald-500 w-full" />
                    <div className="text-[10px] font-bold text-emerald-600 text-right">100%</div>
                  </div>

                  <span className="text-slate-300 text-xs font-black shrink-0">→</span>

                  {/* SEM 2 */}
                  <div className="flex-1 min-w-[90px] p-2.5 bg-blue-50/40 rounded-2xl border border-blue-200/90 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-blue-500">SEM 2</span>
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] font-black">
                        ▶
                      </span>
                    </div>
                    <div className="text-[11px] font-black text-slate-900 truncate">Core CSE</div>
                    <div className="h-1 rounded-full bg-slate-100 overflow-hidden w-full">
                      <div className="h-full bg-blue-600 rounded-full w-[68%]" />
                    </div>
                    <div className="text-[10px] font-bold text-blue-600 text-right">68%</div>
                  </div>

                  <span className="text-slate-300 text-xs font-black shrink-0">→</span>

                  {/* SEM 3 */}
                  <div className="flex-1 min-w-[90px] p-2.5 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400">SEM 3</span>
                      <span className="text-[10px]">🔒</span>
                    </div>
                    <div className="text-[11px] font-black text-slate-900 truncate">Algorithms</div>
                    <div className="h-1 rounded-full bg-slate-100 overflow-hidden w-full">
                      <div className="h-full bg-blue-600 rounded-full w-[26%]" />
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 text-right">26%</div>
                  </div>

                  <span className="text-slate-300 text-xs font-black shrink-0">→</span>

                  {/* SEM 4 */}
                  <div className="flex-1 min-w-[90px] p-2.5 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-1.5 opacity-80">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400">SEM 4</span>
                      <span className="text-[10px]">🔒</span>
                    </div>
                    <div className="text-[11px] font-black text-slate-900 truncate">Core Systems</div>
                    <div className="h-1 rounded-full bg-slate-200 w-full" />
                    <div className="text-[10px] font-bold text-slate-400 text-right">0%</div>
                  </div>

                  <span className="text-slate-300 text-xs font-black shrink-0">→</span>

                  {/* SEM 5 */}
                  <div className="flex-1 min-w-[90px] p-2.5 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-1.5 opacity-80">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400">SEM 5</span>
                      <span className="text-[10px]">🔒</span>
                    </div>
                    <div className="text-[11px] font-black text-slate-900 truncate">Advanced Topics</div>
                    <div className="h-1 rounded-full bg-slate-200 w-full" />
                    <div className="text-[10px] font-bold text-slate-400 text-right">0%</div>
                  </div>
                </div>
              </div>

              {/* Right Side Illustration: Student with Backpack & Career Signposts */}
              <div className="md:w-56 h-36 relative rounded-2xl overflow-hidden border border-slate-200/80 shrink-0 shadow-2xs">
                <img
                  src="/images/learning-path-career.jpg"
                  alt="Student Journey to Career Growth"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════════════
              RIGHT COLUMN (~32% / 4 COLS)
          ════════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 space-y-5">
            {/* ── CARD 5: TODAY'S PLAN ────────────────────────────────────────── */}
            <div className="bg-white rounded-[24px] border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-sm shrink-0">
                    📅
                  </span>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 tracking-wider uppercase">
                      TODAY'S PLAN
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Stay consistent to reach your goals.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-extrabold text-slate-400 pt-0.5">
                  Mon, Oct 19
                </span>
              </div>

              {/* Interactive Checklist matching screenshot */}
              <div className="space-y-2 pt-1">
                {todayTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                      t.completed
                        ? "bg-emerald-50/40 border-emerald-200/80 text-slate-800"
                        : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100/70"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Checkbox */}
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                          t.completed
                            ? "bg-emerald-500 text-white shadow-2xs"
                            : "border-2 border-slate-300 bg-white"
                        }`}
                      >
                        {t.completed ? "✓" : ""}
                      </span>

                      <span
                        className={`text-xs font-bold ${
                          t.completed ? "text-slate-800 font-semibold" : "text-slate-800"
                        }`}
                      >
                        {t.title}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold text-emerald-700 font-mono">
                      {t.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress counter & Start Plan button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex-1 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-500">
                    {completedTaskCount} / {todayTasks.length} completed
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden w-full">
                    <div
                      className="h-full bg-[#2563eb] rounded-full transition-all duration-300"
                      style={{ width: `${(completedTaskCount / todayTasks.length) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleStartPlan}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-xs shrink-0 flex items-center gap-1.5 transition-all"
                >
                  <span>▶</span>
                  <span>Start Plan</span>
                </button>
              </div>
            </div>

            {/* ── CARD 8: LEARNING STREAK ─────────────────────────────────────── */}
            <div className="bg-white rounded-[24px] border border-slate-200/90 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      LEARNING STREAK
                    </div>
                    <div className="text-xl font-black text-slate-900 leading-tight">
                      4 Days
                    </div>
                  </div>
                </div>

                {/* Weekly Mini Bar Chart: M T W T F S S */}
                <div className="flex items-end gap-1.5 h-10 pb-1">
                  {[
                    { day: "M", height: 75, active: true },
                    { day: "T", height: 90, active: true },
                    { day: "W", height: 50, active: true },
                    { day: "T", height: 85, active: true },
                    { day: "F", height: 0, active: false },
                    { day: "S", height: 0, active: false },
                    { day: "S", height: 0, active: false },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div className="w-2.5 h-7 bg-slate-100 rounded-full overflow-hidden flex flex-col justify-end">
                        <div
                          className={`w-full rounded-full ${
                            bar.active ? "bg-amber-500" : "bg-transparent"
                          }`}
                          style={{ height: `${bar.height}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-slate-400">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── CARD 9: AI LEARNING COACH ───────────────────────────────────── */}
            <div className="bg-white rounded-[24px] border border-slate-200/90 p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
                    🤖
                  </span>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    YOUR LEARNING COACH
                  </h3>
                </div>

                {/* Online Pill */}
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online</span>
                </span>
              </div>

              {/* Message Bubble */}
              <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                You're doing well in DSA! 🚀 Your DBMS progress has slowed down a bit. I recommend completing the Normalization topic today.
              </p>

              {/* Action Buttons: Start Now & Explain More */}
              <div className="flex items-center gap-2 pt-0.5">
                <Link
                  to="/learn/dbms/dbms-u5-normalization"
                  className="flex-1 py-2 rounded-xl text-xs font-black bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-center shadow-xs transition-colors"
                >
                  Start Now
                </Link>
                <button
                  onClick={() => setShowCoachModal(true)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/90 transition-colors"
                >
                  Explain More
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          TAB VIEW: MY SUBJECTS (When user selects 'My Subjects' pill)
      ────────────────────────────────────────────────────────────────────────── */}
      {activeNavTab === "subjects" && (
        <div className="bg-white rounded-[24px] border border-slate-200/90 p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Curriculum Subjects
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Comprehensive semester-wise modules with PYQs, labs, and concept notes.
              </p>
            </div>

            {/* Filter Semester Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 overflow-x-auto scrollbar-none">
              {["all", "1", "2", "3", "4", "5", "6", "7", "8"].map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedSemester === sem
                      ? "bg-white text-blue-700 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {sem === "all" ? `All (${subjects.length || 22})` : `Sem ${sem}`}
                </button>
              ))}
            </div>
          </div>

          {/* Subjects Grid & Empty State */}
          {filteredSubjects.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-2xl">📚</span>
              <h3 className="text-sm font-bold text-slate-800">No subjects found for Semester {selectedSemester}</h3>
              <p className="text-xs text-slate-500">Try selecting 'All' or picking another semester filter.</p>
              <button
                onClick={() => setSelectedSemester("all")}
                className="mt-2 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
              >
                View All Subjects ({subjects.length || 22})
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubjects.map((sub) => {
                const total = sub.totalTopics || 36;
                const completed = sub.completedTopics || Math.round((sub.progressPercent || 25) * 0.36);
                const progress = sub.progressPercent || 30;

                return (
                  <div
                    key={sub.subjectId}
                    className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-base">
                          {sub.icon || "📚"}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-200">
                            {sub.code || sub.subjectId.toUpperCase()}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                            Sem {sub.semester || 3}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-black text-slate-900 tracking-tight">
                          {sub.name}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mt-1">
                          <span>{completed} / {total} topics</span>
                          <span className="text-blue-600">{progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/learn/${sub.subjectId}`}
                      className="w-full py-2 px-3 rounded-xl text-xs font-black text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center justify-center gap-1.5 mt-2"
                    >
                      <span>View Units & Topics</span>
                      <span>→</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          TAB VIEW: UNITS & TOPICS
      ────────────────────────────────────────────────────────────────────────── */}
      {activeNavTab === "units" && (
        <div className="bg-white rounded-[24px] border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900">Units & Topics Directory</h2>
            <p className="text-xs text-slate-500">Pick any subject below to explore detailed unit breakdown.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {subjects.slice(0, 12).map((s) => (
              <Link
                key={s.subjectId}
                to={`/learn/${s.subjectId}`}
                className="p-3 rounded-xl border border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">{s.name}</div>
                  <div className="text-[10px] text-slate-400">{s.code} · Sem {s.semester}</div>
                </div>
                <span className="text-slate-400 group-hover:text-blue-600 font-bold">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          TAB VIEW: PRACTICE
      ────────────────────────────────────────────────────────────────────────── */}
      {activeNavTab === "practice" && (
        <div className="bg-white rounded-[24px] border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">Practice & Adaptive Quizzes</h2>
              <p className="text-xs text-slate-500">Test your mastery across Computer Science core concepts.</p>
            </div>
            <Link
              to="/test"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
            >
              Full Assessment Lab →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/learn/dsa/dsa-u5-bst-operations/quiz"
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/40 transition-all space-y-2"
            >
              <div className="text-xs font-black text-blue-600 uppercase">DSA · Sem 3</div>
              <div className="text-sm font-black text-slate-900">Binary Search Trees Quiz</div>
              <p className="text-xs text-slate-500">10 Questions · Insertion, Deletion, Traversal</p>
              <div className="text-xs font-bold text-blue-600 pt-1">Start Quiz →</div>
            </Link>
            <Link
              to="/learn/dbms/dbms-u5-normalization/quiz"
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/40 transition-all space-y-2"
            >
              <div className="text-xs font-black text-blue-600 uppercase">DBMS · Sem 5</div>
              <div className="text-sm font-black text-slate-900">Normalization & Functional Dependency</div>
              <p className="text-xs text-slate-500">8 Questions · 2NF, 3NF, BCNF</p>
              <div className="text-xs font-bold text-blue-600 pt-1">Start Quiz →</div>
            </Link>
            <Link
              to="/learn/os/os-u3-scheduling-metrics/quiz"
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/40 transition-all space-y-2"
            >
              <div className="text-xs font-black text-blue-600 uppercase">OS · Sem 4</div>
              <div className="text-sm font-black text-slate-900">Process Scheduling Quiz</div>
              <p className="text-xs text-slate-500">10 Questions · Round Robin, SJF, Priority</p>
              <div className="text-xs font-bold text-blue-600 pt-1">Start Quiz →</div>
            </Link>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          TAB VIEW: NOTES
      ────────────────────────────────────────────────────────────────────────── */}
      {activeNavTab === "notes" && (
        <div className="bg-white rounded-[24px] border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900">Personal & Curriculum Notes</h2>
            <p className="text-xs text-slate-500">Summaries, cheat sheets, and personal annotations.</p>
          </div>
          {notesList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {notesList.map((n, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="text-xs font-bold text-slate-900">{n.topicTitle || "Subject Notes"}</div>
                  <div className="text-xs text-slate-600">{n.content}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No custom notes saved yet. Highlighting concepts in topics will save notes here!
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          TAB VIEW: BOOKMARKS
      ────────────────────────────────────────────────────────────────────────── */}
      {activeNavTab === "bookmarks" && (
        <div className="bg-white rounded-[24px] border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900">Bookmarked Concepts & Topics</h2>
            <p className="text-xs text-slate-500">Quickly jump back to your saved learning topics.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <Link
              to="/learn/dbms/dbms-u5-normalization"
              className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-900">Normalization (2NF, 3NF, BCNF)</div>
                <div className="text-[10px] text-slate-400">DBMS · Sem 5</div>
              </div>
              <span className="text-blue-600 text-xs">🔖</span>
            </Link>
            <Link
              to="/learn/dsa/dsa-u5-bst-operations"
              className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-900">Binary Search Trees</div>
                <div className="text-[10px] text-slate-400">DSA · Sem 3</div>
              </div>
              <span className="text-blue-600 text-xs">🔖</span>
            </Link>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          "Why This?" AI Recommendation Modal (Matches Requirement #7)
      ────────────────────────────────────────────────────────────────────────── */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-lg">✨</span>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Why This Recommendation?
                </h3>
              </div>
              <button
                onClick={() => setShowWhyModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
              <p className="font-bold text-slate-900">
                You completed Binary Trees theory with 85% accuracy, but struggled with insertion questions in recent assessments.
              </p>

              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2">
                <div className="text-[11px] font-black uppercase text-slate-400">Diagnostic Factors:</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-700">
                  <li><strong>Weak Topic:</strong> Pointer re-linking in duplicate-key insertions</li>
                  <li><strong>Assessment History:</strong> 40% accuracy on BST quiz last week</li>
                  <li><strong>Curriculum Requirement:</strong> Essential prerequisite before AVL and Graph algorithms</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowWhyModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Got it
              </button>
              <Link
                to={`/learn/${nextBestItem.subjectId}/${nextBestItem.topicId}`}
                className="flex-1 py-2 rounded-xl text-xs font-black bg-[#2563eb] text-white text-center hover:bg-blue-700 shadow-xs"
              >
                Start Lesson →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          Learning Coach Explanation Modal (Matches Requirement #9)
      ────────────────────────────────────────────────────────────────────────── */}
      {showCoachModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Coach Guidance
                </h3>
              </div>
              <button
                onClick={() => setShowCoachModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
              <p>
                Your weekly study velocity in <strong>Data Structures & Algorithms</strong> is currently high (+24% ahead of schedule).
              </p>
              <p>
                However, your <strong>Database Management Systems</strong> consistency slowed down by 35%. Completing <strong>Normalization (2NF & 3NF)</strong> today ensures you maintain a balanced CGPA profile and cover 100% of Semester 5 core requirements.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowCoachModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
              <Link
                to="/tutor?topic=Normalization&subject=DBMS"
                className="flex-1 py-2 rounded-xl text-xs font-black bg-[#2563eb] text-white text-center hover:bg-blue-700 shadow-xs"
              >
                Open in AI Tutor →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Floating Learning Companion Drawer */}
      <LearningCompanion
        isOpen={isCompanionOpen}
        onClose={() => setIsCompanionOpen(false)}
        topicId={companionTopic.id}
        topicTitle={companionTopic.title}
        subjectId={companionTopic.subjectId}
        subjectName={companionTopic.subjectName}
        initialMode={companionInitialMode}
      />
    </div>
  );
};

export default CurriculumSubjectsPage;
