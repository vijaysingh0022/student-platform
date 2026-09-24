import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurriculumSubjects, getStudentLearningDashboard, searchCurriculum } from "../services/api.js";
import { useAppState } from "../context/AppStateContext.jsx";

const SEMESTER_FILTERS = [
  { id: "all", label: "All Semesters" },
  { id: 1, label: "Semester 1" },
  { id: 2, label: "Semester 2" },
  { id: 3, label: "Semester 3" },
  { id: 4, label: "Semester 4" },
  { id: 5, label: "Semester 5" },
  { id: 6, label: "Semester 6" },
  { id: 7, label: "Semester 7" },
  { id: 8, label: "Semester 8" },
];

const DOMAIN_FILTERS = [
  { id: "all", label: "All Domains" },
  { id: "Core CSE", label: "Core CSE" },
  { id: "Software Arch", label: "Software Eng" },
  { id: "Algorithms", label: "Algorithms" },
  { id: "Core Systems", label: "Core Systems" },
  { id: "AI & Data", label: "AI & Data" },
  { id: "Cloud & DevOps", label: "Cloud & DevOps" },
  { id: "Security & Trust", label: "Security" },
];

const DIFFICULTY_FILTERS = [
  { id: "all", label: "All Difficulties" },
  { id: "Beginner", label: "🟢 Beginner" },
  { id: "Intermediate", label: "🟡 Intermediate" },
  { id: "Advanced", label: "🔴 Advanced" },
];

const getSubjectIconStyle = (id) => {
  switch (id) {
    case "dsa":
      return { bg: "bg-blue-100 text-blue-700 border-blue-200", icon: "⚡" };
    case "dbms":
      return { bg: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: "🗄️" };
    case "os":
      return { bg: "bg-violet-100 text-violet-700 border-violet-200", icon: "💻" };
    case "cn":
      return { bg: "bg-sky-100 text-sky-700 border-sky-200", icon: "🌐" };
    case "oops":
      return { bg: "bg-amber-100 text-amber-700 border-amber-200", icon: "🧩" };
    case "system-design":
      return { bg: "bg-rose-100 text-rose-700 border-rose-200", icon: "🏗️" };
    case "aptitude":
      return { bg: "bg-teal-100 text-teal-700 border-teal-200", icon: "🎯" };
    case "web-dev":
      return { bg: "bg-cyan-100 text-cyan-700 border-cyan-200", icon: "⚛️" };
    case "ml-ai":
      return { bg: "bg-purple-100 text-purple-700 border-purple-200", icon: "🧠" };
    default:
      return { bg: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: "📚" };
  }
};

const CurriculumSubjectsPage = () => {
  const navigate = useNavigate();
  const { learningVersion } = useAppState();

  const [subjects, setSubjects] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [subRes, dashRes] = await Promise.all([
          getCurriculumSubjects().catch(() => ({ data: [] })),
          getStudentLearningDashboard().catch(() => ({ data: null })),
        ]);

        if (isMounted) {
          setSubjects(subRes.data || []);
          setDashboardSummary(dashRes.data || null);
        }
      } catch (err) {
        console.error("Error fetching curriculum subjects:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [learningVersion]);

  // Universal search effect
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchCurriculum({ q: searchQuery });
        setSearchResults(res.data?.results || []);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredSubjects = subjects.filter((s) => {
    const matchesFilter = selectedFilter === "all" || s.badge === selectedFilter;
    const matchesSemester = selectedSemester === "all" || String(s.semester) === String(selectedSemester);
    const matchesDifficulty = selectedDifficulty === "all" || s.difficulty === selectedDifficulty;
    const matchesSearch =
      !searchQuery.trim() ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSemester && matchesDifficulty && matchesSearch;
  });

  const continueLearning = dashboardSummary?.continueLearning;
  const overallStats = dashboardSummary?.stats;

  return (
    <div className="min-h-screen bg-[#f0f6fc] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white/95 p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-200/40 via-blue-200/30 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-bold tracking-wide uppercase border border-sky-200">
                <span>📚 Structured CSE Curriculum</span>
                <span>•</span>
                <span>9 Core Domains</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Computer Science Learning System
              </h1>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Step-by-step academic mastery across all 9 engineering and placement domains. Dive into structured units, study interactive theory with algorithm visualizers, take topic tests, and track verified topic mastery.
              </p>
            </div>

            {/* Overall Learning Stats Pill */}
            {overallStats && (
              <div className="flex-shrink-0 grid grid-cols-3 gap-3 p-4 rounded-2xl bg-sky-50/70 border border-sky-100 min-w-[280px]">
                <div className="text-center">
                  <div className="text-xl font-black text-sky-700">{overallStats.totalTopics || 120}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Topics</div>
                </div>
                <div className="text-center border-x border-sky-200">
                  <div className="text-xl font-black text-emerald-600">{overallStats.completedTopics || 0}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-black text-indigo-600">{overallStats.overallProgressPercent || 0}%</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Progress</div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Continue Learning Banner */}
          {continueLearning && (
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center text-lg shadow-sm">
                  ⚡
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                    Pick Up Where You Left Off:
                  </div>
                  <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span>{continueLearning.subjectName}</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-sky-700">{continueLearning.topicTitle}</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/learn/${continueLearning.subjectId}/${continueLearning.topicId}`}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-xs flex items-center gap-1.5 self-start sm:self-auto active:scale-95 transition-transform"
              >
                <span>Continue Learning</span>
                <span>→</span>
              </Link>
            </div>
          )}
        </div>

        {/* Universal Search & Multi-Filters */}
        <div className="space-y-3">
          {/* Universal Search Bar */}
          <div className="relative w-full">
            <span className="absolute left-4 top-3 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search anything in LearnX (e.g. AVL Rotations, BCNF, TCP 3-Way Handshake, Docker, CAP Theorem, Dijkstra)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl text-xs sm:text-sm font-medium bg-white border border-sky-100 shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}

            {/* Instant Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-sky-100 shadow-xl z-30 max-h-80 overflow-y-auto p-2 space-y-1">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Matching Topics ({searchResults.length}):
                </div>
                {searchResults.map((item) => (
                  <Link
                    key={item.topicId}
                    to={`/learn/${item.subjectId}/${item.topicId}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50/70 transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {item.subjectName} • {item.unitTitle}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                      {item.difficulty}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Domain Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none border-r border-slate-200 pr-2">
                {SEMESTER_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedSemester(filter.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 border ${
                      selectedSemester === filter.id
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-white text-slate-600 border-sky-100 hover:bg-sky-50"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
                {DOMAIN_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 border ${
                      selectedFilter === filter.id
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-white text-slate-600 border-sky-100 hover:bg-sky-50"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {DIFFICULTY_FILTERS.map((df) => (
                <button
                  key={df.id}
                  onClick={() => setSelectedDifficulty(df.id)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all border ${
                    selectedDifficulty === df.id
                      ? "bg-sky-100 text-sky-800 border-sky-300"
                      : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {df.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Cards Grid */}
        {loading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center bg-white rounded-3xl border border-sky-100 p-8 space-y-4">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-600">Loading Computer Science Curriculum...</p>
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="bg-white rounded-3xl border border-sky-100 p-12 text-center space-y-3">
            <div className="text-3xl">🔍</div>
            <h3 className="text-base font-bold text-slate-800">No subjects match your filter</h3>
            <p className="text-xs text-slate-500">Try selecting a different domain or clearing your search query.</p>
            <button
              onClick={() => {
                setSelectedFilter("all");
                setSelectedSemester("all");
                setSelectedDifficulty("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSubjects.map((sub) => {
              const progressPct = sub.progressPercent || sub.progress || 0;
              const totalTopicsCount = sub.totalTopics || 15;
              const completedCount = sub.completedTopics || Math.round(totalTopicsCount * (progressPct / 100));
              const style = getSubjectIconStyle(sub.subjectId);

              return (
                <div
                  key={sub.subjectId}
                  onClick={() => navigate(`/learn/${sub.subjectId}`)}
                  className="group bg-white rounded-3xl border border-sky-100 hover:border-sky-300 p-6 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5 relative overflow-hidden"
                >
                  {/* Top Bar: Icon + Badge + Arrow */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className={`w-12 h-12 rounded-2xl ${style.bg} border flex items-center justify-center text-2xl font-black shadow-xs group-hover:scale-105 transition-transform`}>
                        {style.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          {sub.badge || "Core CSE"}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Sem {sub.semester || 3}
                        </span>
                        <span className="text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all text-sm font-bold">
                          →
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-extrabold text-sky-700 uppercase tracking-wider">
                        {sub.code || "CSE CORE"}
                      </div>
                      <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-sky-700 transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {sub.name}
                      </h2>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {sub.description}
                      </p>
                    </div>
                  </div>

                  {/* Units Count & Progress */}
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">
                        {sub.totalUnits || 6} Units • {totalTopicsCount} Topics
                      </span>
                      <span className="font-extrabold text-sky-700">
                        {progressPct}% Done
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 transition-all duration-500"
                        style={{ width: `${Math.max(progressPct, 4)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>{completedCount} of {totalTopicsCount} completed</span>
                      <span className="font-semibold text-sky-600 group-hover:underline">
                        Open Curriculum →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurriculumSubjectsPage;
