import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurriculumSubjects, getStudentLearningDashboard } from "../services/api.js";
import { useAppState } from "../context/AppStateContext.jsx";

const DOMAIN_FILTERS = [
  { id: "all", label: "All Subjects" },
  { id: "Core CSE", label: "Core CSE" },
  { id: "Placement", label: "Placement" },
  { id: "Others", label: "Others" },
];

const CurriculumSubjectsPage = () => {
  const navigate = useNavigate();
  const { learningVersion } = useAppState();

  const [subjects, setSubjects] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredSubjects = subjects.filter((s) => {
    const matchesFilter = selectedFilter === "all" || s.badge === selectedFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const continueLearning = dashboardSummary?.continueLearning;
  const overallStats = dashboardSummary?.stats;

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-200/40 via-sky-200/30 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-black tracking-wide uppercase border border-violet-200">
                <span>📚 Structured Learning Path</span>
                <span>•</span>
                <span>CSE Curriculum</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Computer Science Learning System
              </h1>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Step-by-step master core engineering domains: study interactive modules, complete topic-level assessments, detect weak concepts, and achieve verified subject mastery.
              </p>
            </div>

            {/* Overall Learning Stats Pill */}
            {overallStats && (
              <div className="flex-shrink-0 grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 min-w-[280px]">
                <div className="text-center">
                  <div className="text-xl font-black text-violet-700">{overallStats.totalTopics || 0}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Topics</div>
                </div>
                <div className="text-center border-x border-slate-200">
                  <div className="text-xl font-black text-emerald-600">{overallStats.completedTopics || 0}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-black text-sky-600">{overallStats.overallProgressPercent || 0}%</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Progress</div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Continue Learning Banner */}
          {continueLearning && (
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center text-lg shadow-sm">
                  ⚡
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                    Pick Up Where You Left Off:
                  </div>
                  <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span>{continueLearning.subjectName}</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-violet-700">{continueLearning.topicTitle}</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/learn/${continueLearning.subjectId}/${continueLearning.topicId}`}
                className="btn-gradient px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5 self-start sm:self-auto active:scale-95 transition-transform"
              >
                <span>Continue Learning</span>
                <span>→</span>
              </Link>
            </div>
          )}
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Domain Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            {DOMAIN_FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex-shrink-0 border ${
                  selectedFilter === filter.id
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search subjects or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all placeholder:text-slate-400"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
          </div>
        </div>

        {/* Subject Cards Grid */}
        {loading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-600">Loading Computer Science Curriculum...</p>
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <div className="text-3xl">🔍</div>
            <h3 className="text-base font-bold text-slate-800">No subjects match your filter</h3>
            <p className="text-xs text-slate-500">Try selecting a different domain or clearing your search query.</p>
            <button
              onClick={() => {
                setSelectedFilter("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((sub) => {
              const progressPct = sub.progressPercent || 0;
              const hasWeakTopics = sub.weakTopicCount > 0;

              return (
                <div
                  key={sub.subjectId}
                  onClick={() => navigate(`/learn/${sub.subjectId}`)}
                  className="group bg-white rounded-3xl border border-slate-200/90 hover:border-violet-300 p-6 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Subject Header */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 group-hover:scale-105 transition-transform flex items-center justify-center text-2xl shadow-xs">
                        {sub.icon}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                          {sub.badge || sub.code}
                        </span>
                        {hasWeakTopics && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                            <span>⚠️</span>
                            <span>{sub.weakTopicCount} Weak</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3
                        className="text-lg font-black text-slate-900 group-hover:text-violet-700 transition-colors"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {sub.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1 leading-relaxed">
                        {sub.description}
                      </p>
                    </div>

                    {/* Progress Bar & Counts */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-500">
                          {sub.completedTopics} of {sub.totalTopics} Topics Completed
                        </span>
                        <span className="text-slate-900 font-black">{progressPct}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden bg-slate-100">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progressPct}%`,
                            background: progressPct >= 80 ? "#10b981" : progressPct >= 40 ? "#8b5cf6" : "#3b82f6",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject Card Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <span>📖 {sub.totalUnits} Units</span>
                      <span>•</span>
                      <span>🎯 {sub.avgMastery > 0 ? `${sub.avgMastery}% Mastery` : "Not Attempted"}</span>
                    </div>

                    <span className="text-xs font-black text-violet-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Explore</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Learning System Guide Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-50 via-purple-50 to-sky-50 border border-violet-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-base font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              How the LearnX Learning Journey Works:
            </h4>
            <p className="text-xs text-slate-600 font-medium">
              1. Choose a Subject ➔ 2. Read Concept Breakdown ➔ 3. Mark as Completed ➔ 4. Take Topic Quiz ➔ 5. Fix Weaknesses with AI Tutor
            </p>
          </div>
          <Link
            to="/tutor"
            className="px-5 py-2.5 rounded-2xl text-xs font-bold text-violet-700 bg-white border border-violet-200 hover:bg-violet-50 shadow-xs flex-shrink-0 transition-colors"
          >
            🤖 Open 24/7 AI Academic Tutor →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CurriculumSubjectsPage;
