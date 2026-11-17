import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Flame,
  Brain,
  TrendingUp,
  Target,
  ArrowRight,
  BookOpen,
  Zap,
  Award,
  ChevronRight,
  Filter,
  Search,
  Layers,
  GraduationCap,
  Activity,
  Lightbulb,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { getRevisionDashboard, getTopicRevisionSession } from "../services/api.js";
import { RevisionSessionModal } from "../components/revision/RevisionSessionModal.jsx";

export const SpacedRepetitionPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("due"); // 'due' | 'overdue' | 'upcoming' | 'mastered' | 'all'
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Active session modal state
  const [activeTopicSession, setActiveTopicSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getRevisionDashboard();
      if (res && res.data) {
        setDashboard(res.data);
      }
    } catch (err) {
      console.error("Error fetching revision dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const startRevision = async (topicId, subjectId) => {
    try {
      setSessionLoading(true);
      const res = await getTopicRevisionSession(topicId, subjectId);
      if (res && res.data) {
        setActiveTopicSession(res.data);
      }
    } catch (err) {
      console.error("Failed to load topic revision session:", err);
    } finally {
      setSessionLoading(false);
    }
  };

  const handleSessionComplete = (result) => {
    setActiveTopicSession(null);
    fetchDashboard();
  };

  // Filter items by tab, subject, search
  const filteredItems = useMemo(() => {
    if (!dashboard) return [];
    let list = [];
    if (activeTab === "due") list = dashboard.dueToday || [];
    else if (activeTab === "overdue") list = dashboard.overdue || [];
    else if (activeTab === "upcoming") list = dashboard.upcoming || [];
    else if (activeTab === "mastered") list = dashboard.mastered || [];
    else {
      // all
      const combined = [
        ...(dashboard.dueToday || []),
        ...(dashboard.overdue || []),
        ...(dashboard.upcoming || []),
        ...(dashboard.mastered || []),
      ];
      // deduplicate
      const seen = new Set();
      list = combined.filter((it) => {
        const id = it.topicId || it._id;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    }

    return list.filter((item) => {
      const matchSubject =
        selectedSubject === "all" ||
        item.subjectId?.toLowerCase() === selectedSubject.toLowerCase();
      const matchSearch =
        !searchQuery ||
        item.topicTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subjectId?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubject && matchSearch;
    });
  }, [dashboard, activeTab, selectedSubject, searchQuery]);

  // Unique subjects for filter
  const subjectsList = useMemo(() => {
    if (!dashboard) return [];
    const all = [
      ...(dashboard.dueToday || []),
      ...(dashboard.overdue || []),
      ...(dashboard.upcoming || []),
      ...(dashboard.mastered || []),
    ];
    const subs = new Set(all.map((it) => it.subjectId).filter(Boolean));
    return Array.from(subs);
  }, [dashboard]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Top Banner / Hero Header */}
      <div className="bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ebbinghaus Memory & SM-2 Adaptive Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Spaced Repetition & Retention Hub
              </h1>
              <p className="text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
                Supercharge long-term memory retrieval. Topics you complete are automatically scheduled at optimal intervals (1d, 3d, 7d, 14d, 30d) before memory decay occurs.
              </p>
            </div>

            {/* Quick Action */}
            {dashboard?.summary?.dueTodayCount > 0 && (
              <div className="shrink-0 flex items-center gap-3">
                <button
                  onClick={() => {
                    const firstDue = dashboard.dueToday?.[0];
                    if (firstDue) startRevision(firstDue.topicId, firstDue.subjectId);
                  }}
                  disabled={sessionLoading}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Zap className="w-4 h-4 fill-white text-white" />
                  <span>Start Due Session ({dashboard.summary.dueTodayCount})</span>
                </button>
              </div>
            )}
          </div>

          {/* Key Metrics KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4 mt-8">
            {/* Due Today */}
            <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-4 transition-all hover:bg-white hover:shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Due Today</span>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {loading ? "..." : dashboard?.summary?.dueTodayCount || 0}
              </div>
              <div className="text-[11px] text-blue-600 font-bold mt-1">Ready for recall</div>
            </div>

            {/* Overdue */}
            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 transition-all hover:bg-white hover:shadow-sm">
              <div className="flex items-center justify-between text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Overdue</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-600">
                {loading ? "..." : dashboard?.summary?.overdueCount || 0}
              </div>
              <div className="text-[11px] text-rose-500 font-bold mt-1">High memory decay</div>
            </div>

            {/* Retention Score */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 transition-all hover:bg-white hover:shadow-sm">
              <div className="flex items-center justify-between text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Retention Index</span>
                <Brain className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-600">
                {loading ? "..." : `${dashboard?.summary?.averageRetention || 85}%`}
              </div>
              <div className="text-[11px] text-indigo-500 font-bold mt-1">Platform aggregate</div>
            </div>

            {/* Topics Mastered */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 transition-all hover:bg-white hover:shadow-sm">
              <div className="flex items-center justify-between text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Mastered</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                {loading ? "..." : dashboard?.summary?.masteredCount || 0}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">Stage 5+ &gt;30d interval</div>
            </div>

            {/* Revision Streak */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 transition-all hover:bg-white hover:shadow-sm col-span-2 md:col-span-1">
              <div className="flex items-center justify-between text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Revision Streak</span>
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 flex items-center gap-1.5">
                <span>{loading ? "..." : dashboard?.summary?.revisionStreak || 1}</span>
                <span className="text-xs font-black text-amber-500 uppercase">Days</span>
              </div>
              <div className="text-[11px] text-amber-600 font-bold mt-1">Consistent review</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2 Cols): Memory Queue & Active Reviews */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Filter and Queue Header */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Revision Queue</h2>
                  <p className="text-xs text-slate-500 font-medium">Select a topic to test active recall or reinforce weak spots</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topics..."
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 pt-4 overflow-x-auto no-scrollbar pb-1">
                {[
                  { id: "due", label: "Due Today", count: dashboard?.summary?.dueTodayCount || 0 },
                  { id: "overdue", label: "Overdue", count: dashboard?.summary?.overdueCount || 0, badgeColor: "bg-rose-100 text-rose-700" },
                  { id: "upcoming", label: "Upcoming", count: dashboard?.summary?.upcomingCount || 0 },
                  { id: "mastered", label: "Mastered", count: dashboard?.summary?.masteredCount || 0, badgeColor: "bg-emerald-100 text-emerald-700" },
                  { id: "all", label: "All Items", count: dashboard?.summary?.totalEnrolled || 0 },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                        isActive
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                          isActive
                            ? "bg-white/20 text-white"
                            : tab.badgeColor || "bg-slate-200/80 text-slate-700"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Subject Filter Pills */}
              {subjectsList.length > 0 && (
                <div className="flex items-center gap-1.5 pt-3 overflow-x-auto no-scrollbar">
                  <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Filter:
                  </span>
                  <button
                    onClick={() => setSelectedSubject("all")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      selectedSubject === "all"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    All Subjects
                  </button>
                  {subjectsList.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubject(sub)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-colors ${
                        selectedSubject === sub
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* List of Topic Queue Items */}
            <div className="space-y-3">
              {loading ? (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-600">Loading your personalized retention curve...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Queue is clear!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-medium leading-relaxed">
                    {activeTab === "due"
                      ? "No topics are due for review right now. All your completed concepts have healthy memory retention!"
                      : "No topics found in this category. Complete new curriculum topics to automatically enroll them into spaced repetition."}
                  </p>
                  <Link
                    to="/learn"
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Explore Curriculum</span>
                  </Link>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const isOverdue = item.isOverdue;
                  const isDue = item.isDueToday;
                  const retentionPct = Math.round(item.currentRetention ?? item.retentionScore ?? 75);
                  
                  // Color accents based on memory health
                  const retentionColor =
                    retentionPct >= 75
                      ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                      : retentionPct >= 50
                      ? "text-amber-600 bg-amber-50 border-amber-200"
                      : "text-rose-600 bg-rose-50 border-rose-200";

                  const progressBarColor =
                    retentionPct >= 75
                      ? "bg-emerald-500"
                      : retentionPct >= 50
                      ? "bg-amber-500"
                      : "bg-rose-500";

                  return (
                    <div
                      key={item._id || item.topicId}
                      className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:border-slate-300 transition-all group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Topic Details */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 tracking-wider">
                              {item.subjectId || "CS"}
                            </span>
                            {isOverdue && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                <span>{item.daysOverdue}d overdue</span>
                              </span>
                            )}
                            {isDue && !isOverdue && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Due today</span>
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-slate-400">
                              Stage {item.repetitionStage || 1} • Interval: {item.intervalDays || 1}d
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {item.topicTitle}
                          </h3>

                          {/* Retention bar */}
                          <div className="flex items-center gap-3 pt-1 max-w-md">
                            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
                                style={{ width: `${Math.min(100, Math.max(5, retentionPct))}%` }}
                              />
                            </div>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${retentionColor}`}>
                              {retentionPct}% Retention
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <Link
                            to={`/learn/${item.subjectId}/${item.topicId}`}
                            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
                            title="Read study material"
                          >
                            Review Notes
                          </Link>
                          <button
                            onClick={() => startRevision(item.topicId, item.subjectId)}
                            disabled={sessionLoading}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <Zap className="w-3.5 h-3.5 fill-white" />
                            <span>Revise Now</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column (1 Col): Analytics, Forgetting Curve & High-Risk Recs */}
          <div className="space-y-6">
            
            {/* Memory Decay Chart Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-black text-slate-900">Ebbinghaus Memory Decay</h3>
                </div>
                <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  Active Model
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium py-3 leading-relaxed">
                Retention drops naturally following an exponential decay curve without active repetition. Each revision resets and flattens the curve.
              </p>

              {/* Chart */}
              <div className="h-44 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { day: "Day 0", base: 100, spaced: 100 },
                      { day: "Day 1", base: 58, spaced: 90 },
                      { day: "Day 3", base: 36, spaced: 88 },
                      { day: "Day 7", base: 22, spaced: 85 },
                      { day: "Day 14", base: 14, spaced: 84 },
                      { day: "Day 30", base: 8, spaced: 82 },
                    ]}
                    margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorSpaced" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1E293B",
                        borderRadius: "12px",
                        border: "none",
                        color: "#fff",
                        fontSize: "11px",
                      }}
                    />
                    <Area type="monotone" dataKey="spaced" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSpaced)" name="With LearnX Spaced Repetition (%)" />
                    <Area type="monotone" dataKey="base" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorBase)" name="Without Revision (%)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <span>With LearnX Engine</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span>Standard Forgetting</span>
                </span>
              </div>
            </div>

            {/* High-Risk Recommendations Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-black text-slate-900">AI Memory Recommendations</h3>
                </div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                  Priority Action
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium py-3 leading-relaxed">
                Topics exhibiting highest forgetting velocity or recent quiz mistakes. Intercept now to restore retention.
              </p>

              <div className="space-y-3">
                {(dashboard?.recommendations || []).length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400 font-medium">
                    No high-risk topics detected. Outstanding consistency!
                  </div>
                ) : (
                  dashboard.recommendations.map((rec) => (
                    <div
                      key={rec._id || rec.topicId}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase text-slate-400">
                          {rec.subjectId}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {rec.topicTitle}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-rose-600 mt-0.5">
                          <span>{rec.reason || "Retention below threshold"}</span>
                          <span>•</span>
                          <span>{Math.round(rec.retentionScore)}% retention</span>
                        </div>
                      </div>
                      <button
                        onClick={() => startRevision(rec.topicId, rec.subjectId)}
                        disabled={sessionLoading}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 transition-colors shrink-0"
                        title="Revise now"
                      >
                        <Zap className="w-3.5 h-3.5 fill-blue-600" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Interval Explanation Card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-black tracking-tight">How SM-2 Intervals Work</h3>
              </div>
              <p className="text-xs text-slate-300 font-normal leading-relaxed mb-4">
                The SM-2 algorithm calculates your exact optimal review date based on honesty ratings (0–5):
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                  <span className="text-slate-400">1st Review</span>
                  <span className="font-bold text-white">After 1 Day</span>
                </div>
                <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                  <span className="text-slate-400">2nd Review</span>
                  <span className="font-bold text-white">After 3 Days</span>
                </div>
                <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                  <span className="text-slate-400">3rd Review</span>
                  <span className="font-bold text-white">After 7 Days</span>
                </div>
                <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                  <span className="text-slate-400">4th Review</span>
                  <span className="font-bold text-white">After 14 Days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">Mastery State</span>
                  <span className="font-bold text-emerald-400">30 – 60+ Days</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Revision Session Modal */}
      {activeTopicSession && (
        <RevisionSessionModal
          sessionData={activeTopicSession}
          onClose={() => setActiveTopicSession(null)}
          onComplete={handleSessionComplete}
        />
      )}
    </div>
  );
};

export default SpacedRepetitionPage;
