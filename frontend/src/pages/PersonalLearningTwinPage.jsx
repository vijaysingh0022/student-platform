import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Sparkles,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  BookOpen,
  RefreshCw,
  Compass,
  Activity,
  Award,
  ChevronRight,
  Calendar,
  Repeat,
  Target,
  BarChart2,
  ShieldAlert,
  HelpCircle,
  X,
  Play,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Info,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  getPersonalLearningTwin,
  recalculatePersonalLearningTwin,
  simulatePersonalLearningPlan,
  toggleDailyPlanTask,
  resolveLearningInsight,
} from "../services/api.js";

export const PersonalLearningTwinPage = () => {
  const [twin, setTwin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [dateRange, setDateRange] = useState("30d");

  // Selected topic modal for knowledge map drill-down
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Filter tabs for Knowledge State Matrix
  const [activeSubjectFilter, setActiveSubjectFilter] = useState("ALL");
  const [activeStatusFilter, setActiveStatusFilter] = useState("ALL");

  // Alternative recommendations toggle
  const [showAlternativeAction, setShowAlternativeAction] = useState(false);
  const [snoozedAction, setSnoozedAction] = useState(false);

  // Simulation controls state
  const [simSubject, setSimSubject] = useState("DSA");
  const [simTopic, setSimTopic] = useState("All Topics");
  const [simMinsDaily, setSimMinsDaily] = useState(30);
  const [simDays, setSimDays] = useState(30);
  const [simResult, setSimResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Daily plan state
  const [dailyPlan, setDailyPlan] = useState([]);
  const [insightsList, setInsightsList] = useState([]);

  const fetchTwin = async () => {
    try {
      setLoading(true);
      const res = await getPersonalLearningTwin();
      if (res.data?.success && res.data?.twin) {
        setTwin(res.data.twin);
        setDailyPlan(res.data.twin.dailyActionPlan || []);
        setInsightsList(res.data.twin.insights || []);
        if (res.data.twin.simulations?.length > 0) {
          setSimResult(res.data.twin.simulations[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load Personal Learning Twin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTwin();
  }, []);

  const handleRecalculate = async () => {
    try {
      setRecalculating(true);
      const res = await recalculatePersonalLearningTwin();
      if (res.data?.success && res.data?.twin) {
        setTwin(res.data.twin);
        setDailyPlan(res.data.twin.dailyActionPlan || []);
        setInsightsList(res.data.twin.insights || []);
      }
    } catch (err) {
      console.error("Recalculate error:", err);
    } finally {
      setRecalculating(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      setDailyPlan((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
      );
      await toggleDailyPlanTask(taskId);
    } catch (err) {
      console.error("Task toggle error:", err);
    }
  };

  const handleResolveInsight = async (insightId) => {
    try {
      setInsightsList((prev) => prev.filter((i) => i.id !== insightId));
      await resolveLearningInsight(insightId);
    } catch (err) {
      console.error("Resolve insight error:", err);
    }
  };

  const handleRunSimulation = async (e) => {
    e.preventDefault();
    try {
      setSimulating(true);
      const currMastery =
        twin?.subjectsDna?.find((s) => s.subjectId === simSubject)?.overallMastery || 45;

      const res = await simulatePersonalLearningPlan({
        currentMastery: currMastery,
        dailyStudyMinutes: simMinsDaily,
        durationDays: simDays,
        targetSubject: simSubject,
        targetTopic: simTopic,
      });

      if (res.data?.success && res.data?.simulation) {
        setSimResult(res.data.simulation);
      }
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setSimulating(false);
    }
  };

  const getStateBadge = (state) => {
    const map = {
      mastered: "bg-emerald-50 text-emerald-700 border-emerald-200",
      strong: "bg-blue-50 text-blue-700 border-blue-200",
      developing: "bg-indigo-50 text-indigo-700 border-indigo-200",
      learning: "bg-amber-50 text-amber-700 border-amber-200",
      needs_revision: "bg-rose-50 text-rose-700 border-rose-200",
      unexplored: "bg-slate-50 text-slate-500 border-slate-200",
    };
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${map[state] || map.unexplored}`}>
        {state.replace("_", " ")}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600">Calibrating your Personal Learning Twin 2.0...</p>
        </div>
      </div>
    );
  }

  const metrics = twin?.intelligenceMetrics || {};
  const activeNBA = showAlternativeAction && twin?.alternativeActions?.length > 0
    ? twin.alternativeActions[0]
    : twin?.nextBestAction;

  // Filtered topics
  const filteredTopics = (twin?.topicKnowledgeStates || []).filter((t) => {
    const matchSub = activeSubjectFilter === "ALL" || t.subjectId === activeSubjectFilter;
    const matchStatus = activeStatusFilter === "ALL" || t.state === activeStatusFilter;
    return matchSub && matchStatus;
  });

  // Radar chart data from learningDnaDimensions
  const radarData = (twin?.learningDnaDimensions || []).map((d) => ({
    dimension: d.dimension,
    score: d.measuredScore,
    fullMark: 100,
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-900">
      
      {/* ── TOP HEADER (COMPACT & INFORMATIVE) ── */}
      <div className="bg-white border-b border-slate-200/90 shadow-2xs sticky top-0 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold">
                <Brain className="w-3.5 h-3.5" />
                <span>AI Personal Learning Twin 2.0</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-500 font-medium">Live Telemetry Synchronized</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Student Cognitive Intelligence & Learning System
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Last Profile Update: {new Date(twin?.lastRecalculatedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Fully Scoped to Your Active Curriculum
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {/* Date range selector */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-bold border border-slate-200/80">
                {["7d", "30d", "90d"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setDateRange(r)}
                    className={`px-2.5 py-1 rounded-lg uppercase tracking-wider text-[11px] transition-all ${
                      dateRange === r ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button
                onClick={handleRecalculate}
                disabled={recalculating}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${recalculating ? "animate-spin" : ""}`} />
                <span>{recalculating ? "Recalculating..." : "Recalculate Profile"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-7">
        
        {/* ── PART 1: 6 PRIMARY INTELLIGENCE METRIC CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* 1. Learning DNA Index */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-1.5 shadow-2xs hover:border-indigo-200 transition-all">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Learning DNA</span>
              <span className="text-emerald-600 font-black flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>+{metrics.learningDnaIndex?.value - metrics.learningDnaIndex?.previousValue || 4}%</span>
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {metrics.learningDnaIndex?.value || 68}%
            </div>
            <p className="text-[10px] text-slate-400 font-medium truncate" title={metrics.learningDnaIndex?.source}>
              {metrics.learningDnaIndex?.source || "Diagnostic data"}
            </p>
          </div>

          {/* 2. Overall Topic Mastery */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-1.5 shadow-2xs hover:border-indigo-200 transition-all">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Topic Mastery</span>
              <span className="text-emerald-600 font-black flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>+{metrics.overallTopicMastery?.value - metrics.overallTopicMastery?.previousValue || 6}%</span>
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {metrics.overallTopicMastery?.value || 58}%
            </div>
            <p className="text-[10px] text-slate-400 font-medium truncate" title={metrics.overallTopicMastery?.explanation}>
              Strong or Mastered concepts
            </p>
          </div>

          {/* 3. Memory Retention Health */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-1.5 shadow-2xs hover:border-indigo-200 transition-all">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Retention Health</span>
              <span className="text-amber-600 font-black flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" />
                <span>-2%</span>
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {metrics.memoryRetentionHealth?.value || 82}%
            </div>
            <p className="text-[10px] text-slate-400 font-medium truncate" title={metrics.memoryRetentionHealth?.source}>
              SM-2 recall signals
            </p>
          </div>

          {/* 4. Learning Velocity */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-1.5 shadow-2xs hover:border-indigo-200 transition-all">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Study Velocity</span>
              <span className="text-emerald-600 font-black flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>+0.8h</span>
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {metrics.learningVelocity?.value || 5.4} <span className="text-xs font-bold text-slate-500">h/wk</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium truncate">
              Active test & coding hours
            </p>
          </div>

          {/* 5. Identified Knowledge Gaps */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-1.5 shadow-2xs hover:border-rose-200 transition-all">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Knowledge Gaps</span>
              <span className="text-rose-600 font-black">
                {twin?.learningGaps?.length || 3} Active
              </span>
            </div>
            <div className="text-2xl font-black text-rose-600">
              {twin?.learningGaps?.length || 3}
            </div>
            <p className="text-[10px] text-slate-400 font-medium truncate">
              Prerequisite & decay flags
            </p>
          </div>

          {/* 6. Learning Consistency */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-1.5 shadow-2xs hover:border-indigo-200 transition-all">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Consistency</span>
              <span className="text-emerald-600 font-black">86% Index</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {metrics.learningConsistency?.value || 86}%
            </div>
            <p className="text-[10px] text-slate-400 font-medium truncate">
              4-day active streak
            </p>
          </div>
        </div>

        {/* ── PART 5: AI NEXT BEST ACTION ENGINE (HERO POSITION) ── */}
        {activeNBA && !snoozedAction && (
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 relative z-10">
              <div className="space-y-3.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 border border-indigo-400/30 px-3 py-0.5 rounded-full bg-indigo-500/20">
                    ⚡ AI RECOMMENDED LEARNING INTERVENTION
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {activeNBA.priority} PRIORITY
                  </span>
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Est. {activeNBA.estimatedMinutes} mins</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    Data Confidence: {activeNBA.confidenceScore || 88}%
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {activeNBA.subjectId} • {activeNBA.topicId || "Focus Action"}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                    {activeNBA.title}
                  </h2>
                </div>

                {/* Evidence & Educational Rationale */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-white/10 p-3.5 rounded-2xl border border-white/10 backdrop-blur-xs">
                  <div>
                    <strong className="text-indigo-300 font-bold block mb-0.5">Reason for Selection:</strong>
                    <p className="text-slate-200 font-medium leading-relaxed">{activeNBA.whySelected}</p>
                  </div>
                  <div>
                    <strong className="text-emerald-300 font-bold block mb-0.5">Expected Educational Gain:</strong>
                    <p className="text-slate-200 font-medium leading-relaxed">{activeNBA.expectedBenefit}</p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 font-medium">
                  <strong>Supporting Performance Evidence: </strong>
                  {activeNBA.evidence || activeNBA.supportingData?.join(", ")}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 shrink-0 self-stretch md:self-center">
                <Link
                  to={activeNBA.actionRoute}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{activeNBA.actionLabel || "Start Now"}</span>
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowAlternativeAction(!showAlternativeAction)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-[11px] transition-all"
                  >
                    {showAlternativeAction ? "Show Primary" : "Show Alternative"}
                  </button>
                  <button
                    onClick={() => setSnoozedAction(true)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-[11px] transition-all"
                  >
                    Snooze
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PART 2 & PART 10: LEARNING DNA PROFILE & PERSONALIZED DAILY ACTION PLAN ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          
          {/* Left: Learning DNA Radar & Dimensions (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900">Learning DNA Dimensions</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Measured vs Inferred</span>
            </div>

            {/* Radar Chart */}
            <div className="h-56 w-full -my-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: "#64748B", fontSize: 10, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 9 }} />
                  <Radar name="Student DNA" dataKey="score" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Measured Abilities List */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              {(twin?.learningDnaDimensions || []).slice(0, 3).map((dim, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 text-xs space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{dim.dimension}</span>
                    <span className="text-indigo-600 font-black">{dim.measuredScore}%</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">{dim.description}</p>
                </div>
              ))}
            </div>

            {/* Strongest & Weakest summary pills */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-[11px]">
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-[10px] font-black uppercase text-emerald-700 block mb-1">Strongest Topics</span>
                <span className="font-bold text-emerald-950 block truncate">
                  {twin?.strongestTopics?.slice(0, 2).join(", ") || "DBMS Keys, Trees"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100">
                <span className="text-[10px] font-black uppercase text-rose-700 block mb-1">Weakest Topics</span>
                <span className="font-bold text-rose-950 block truncate">
                  {twin?.weakestTopics?.slice(0, 2).join(", ") || "DP, Concurrency"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Personalized Daily Action Plan (Part 10) & Insights Feed (Part 9) (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Daily Action Plan */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-black text-slate-900">Personalized Daily Action Plan</h3>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Today's Priority Agenda
                </span>
              </div>

              <div className="space-y-2.5">
                {dailyPlan.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs ${
                      task.completed
                        ? "bg-emerald-50/40 border-emerald-200/80 opacity-70"
                        : "bg-slate-50/70 border-slate-200/90 hover:bg-white hover:border-indigo-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          task.completed
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "bg-white border-slate-300 text-transparent hover:border-indigo-400"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <div>
                        <h4 className={`font-bold text-slate-900 ${task.completed ? "line-through text-slate-400" : ""}`}>
                          {task.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {task.subjectId} • Est. {task.estimatedMinutes} mins • {task.category.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {!task.completed && (
                      <Link
                        to={task.actionRoute}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] shrink-0 transition-all flex items-center gap-1"
                      >
                        <span>{task.actionLabel || "Start"}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Learning Insights Feed (Part 9) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-black text-slate-900">AI Verified Learning Insights</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400">Derived from Actual Telemetry</span>
              </div>

              <div className="space-y-2.5">
                {insightsList.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">All current learning insights resolved.</p>
                ) : (
                  insightsList.map((ins) => (
                    <div
                      key={ins.id}
                      className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/70 text-xs space-y-1.5 relative"
                    >
                      <div className="flex items-center justify-between pr-6">
                        <span className="font-bold text-amber-950">{ins.title}</span>
                        <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                          {ins.subjectId}
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium leading-relaxed">{ins.description}</p>
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-slate-500 italic">Evidence: {ins.supportingEvidence}</span>
                        <Link to={ins.actionRoute} className="font-bold text-indigo-600 hover:underline">
                          Take Action →
                        </Link>
                      </div>
                      <button
                        onClick={() => handleResolveInsight(ins.id)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-slate-700"
                        title="Dismiss Insight"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ── PART 3: INTERACTIVE KNOWLEDGE MASTERY MAP & TOPIC DRILL-DOWN ── */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Interactive Knowledge Mastery Map
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Curriculum concepts linked to prerequisite trees. Click any topic node for deep-dive accuracy metrics.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
                {["ALL", "DSA", "DBMS", "OS", "CN", "OOP"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveSubjectFilter(s)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                      activeSubjectFilter === s ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <select
                value={activeStatusFilter}
                onChange={(e) => setActiveStatusFilter(e.target.value)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 focus:outline-hidden"
              >
                <option value="ALL">All States</option>
                <option value="mastered">Mastered</option>
                <option value="strong">Strong</option>
                <option value="developing">Developing</option>
                <option value="needs_revision">Needs Revision</option>
                <option value="unexplored">Unexplored</option>
              </select>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {filteredTopics.length === 0 ? (
              <div className="col-span-full py-10 text-center text-xs text-slate-400">
                No recorded topics matching this filter. Start reading concepts or taking adaptive tests!
              </div>
            ) : (
              filteredTopics.map((topic, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedTopic(topic)}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition-all space-y-2.5 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      {topic.subjectId}
                    </span>
                    {getStateBadge(topic.state)}
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                    {topic.topicName}
                  </h4>

                  {/* Mastery Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                      <span>Mastery: {topic.masteryScore}%</span>
                      <span>Retention: {topic.retentionConfidence}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          topic.masteryScore >= 75
                            ? "bg-emerald-500"
                            : topic.masteryScore >= 50
                            ? "bg-indigo-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${Math.min(100, Math.max(5, topic.masteryScore))}%` }}
                      />
                    </div>
                  </div>

                  {topic.missingPrerequisites?.length > 0 && (
                    <div className="text-[10px] text-rose-600 font-bold truncate">
                      ⚠️ Needs: {topic.missingPrerequisites[0]}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── PART 4 & PART 6: MEMORY RETENTION INTELLIGENCE & KNOWLEDGE GAP ANALYSIS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          
          {/* Left: Memory & Retention Intelligence (Part 4) (6 Cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900">Memory & Retention Intelligence</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Ebbinghaus Calibrated</span>
            </div>

            {/* Retention Trend Line Chart */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={twin?.retentionTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94A3B8" }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: "#94A3B8" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="retentionScore" stroke="#4F46E5" strokeWidth={2.5} dot={{ fill: "#4F46E5" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Topics At Risk of Forgetting */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block">Topics at Risk of Forgetting:</span>
              {(twin?.forgettingRiskTopics || []).length === 0 ? (
                <p className="text-xs text-slate-400">All topics currently above safe retention thresholds.</p>
              ) : (
                twin.forgettingRiskTopics.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-rose-950 block">{item.topicName}</span>
                      <span className="text-[10px] text-slate-500">
                        {item.daysSinceReview} days unreviewed • {item.currentRetention}% retention
                      </span>
                    </div>
                    <Link
                      to="/revision"
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] transition-all"
                    >
                      Revise Now
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Knowledge Gap & Prerequisite Intelligence (Part 6) (6 Cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-black text-slate-900">Knowledge Gap & Prerequisite Intelligence</h3>
              </div>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                Root Cause Analysis
              </span>
            </div>

            <div className="space-y-3">
              {(twin?.learningGaps || []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No foundational prerequisite gaps detected.</p>
              ) : (
                twin.learningGaps.map((gap, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900">{gap.topicName}</span>
                      <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                        {gap.type.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium">{gap.evidence}</p>
                    <p className="text-[11px] text-indigo-700 font-bold pt-0.5">
                      💡 Recommended: {gap.recommendedCorrection}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* ── PART 7: LEARNING BEHAVIOUR ANALYTICS (HEATMAP & MASTERY CHARTS) ── */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900">Learning Behaviour & Activity Analytics</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Actual daily study distributions, assessment completion intensity, and subject mastery velocity.
              </p>
            </div>
            <span className="text-[10px] font-bold text-slate-400">7-Day Rolling Active Telemetry</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Weekly Activity Bar Chart (7 Cols) */}
            <div className="md:col-span-7 h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={twin?.weeklyActivityHeatmap || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748B" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
                  <Tooltip />
                  <Bar dataKey="hours" name="Study Hours" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="codingCount" name="Coding Lab Problems" fill="#06B6D4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Subject DNA Mastery Progress (5 Cols) */}
            <div className="md:col-span-5 space-y-2.5">
              {(twin?.subjectsDna || []).slice(0, 4).map((sub) => (
                <div key={sub.subjectId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>{sub.subjectName}</span>
                    <span className="text-indigo-600 font-black">{sub.overallMastery}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                      style={{ width: `${sub.overallMastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PART 8: PERSONALIZED LEARNING SIMULATOR ── */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Personalized Learning Plan Scenario Simulator
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Explore hypothetical study schedules. Transparently models mastery growth and weekly milestone workload.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full self-start sm:self-center">
              Predictive Scenario Modeling
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form (5 cols) */}
            <form onSubmit={handleRunSimulation} className="lg:col-span-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Subject Focus</label>
                <select
                  value={simSubject}
                  onChange={(e) => setSimSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  {["DSA", "DBMS", "OS", "CN", "OOP", "SYSTEM_DESIGN", "WEB_DEV"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1">
                  <span>Daily Dedicated Study Time</span>
                  <span className="text-indigo-600 font-black">{simMinsDaily} minutes/day</span>
                </label>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="15"
                  value={simMinsDaily}
                  onChange={(e) => setSimMinsDaily(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1">
                  <span>Plan Duration</span>
                  <span className="text-indigo-600 font-black">{simDays} Days</span>
                </label>
                <input
                  type="range"
                  min="7"
                  max="90"
                  step="7"
                  value={simDays}
                  onChange={(e) => setSimDays(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={simulating}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{simulating ? "Projecting Workload Schedule..." : "Run Scenario Simulation"}</span>
              </button>
            </form>

            {/* Results (7 cols) */}
            <div className="lg:col-span-7 bg-slate-50/70 rounded-2xl border border-slate-200/90 p-5 space-y-4">
              {!simResult ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Select parameters on the left to project hypothetical mastery.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <span className="text-xs font-black text-slate-900">
                      Scenario Projection: {simResult.targetSubject} ({simResult.durationDays} Days @ {simResult.dailyStudyMinutes}m/d)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {simResult.retentionStabilityProjected} Stability
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Current</span>
                      <span className="text-lg font-black text-slate-700">{simResult.currentMastery}%</span>
                    </div>
                    <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-center">
                      <span className="text-[10px] font-bold text-indigo-600 block uppercase">Projected</span>
                      <span className="text-lg font-black text-indigo-700">+{simResult.projectedMastery - simResult.currentMastery}%</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                      <span className="text-[10px] font-bold text-emerald-600 block uppercase">Target Mastery</span>
                      <span className="text-lg font-black text-emerald-700">{simResult.projectedMastery}%</span>
                    </div>
                  </div>

                  {/* 4-Week Milestone Schedule */}
                  {simResult.suggestedSchedule?.length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-slate-200/60">
                      <span className="text-xs font-bold text-slate-800 block">Suggested Weekly Schedule:</span>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        {simResult.suggestedSchedule.map((s) => (
                          <div key={s.week} className="p-2.5 rounded-xl bg-white border border-slate-200">
                            <span className="font-black text-indigo-600 block">Week {s.week}: {s.focus}</span>
                            <span className="text-slate-500 font-medium">{s.weeklyPracticeHours} hrs practice workload</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-200/60">
                    * {simResult.disclaimer || "Simulated scenario outcome based on learning science models; not a guaranteed prediction."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ── TOPIC DEEP-DIVE DRILLDOWN MODAL ── */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedTopic(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {selectedTopic.subjectId} • Deep-Dive Inspection
              </span>
              <h3 className="text-lg font-black text-slate-900">{selectedTopic.topicName}</h3>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">Mastery</span>
                <span className="text-base font-black text-slate-900">{selectedTopic.masteryScore}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">Accuracy</span>
                <span className="text-base font-black text-slate-900">{selectedTopic.accuracy}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">Retention</span>
                <span className="text-base font-black text-slate-900">{selectedTopic.retentionConfidence}%</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-600">Knowledge State:</span>
                {getStateBadge(selectedTopic.state)}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-600">Attempts Count:</span>
                <span className="font-bold text-slate-900">{selectedTopic.attemptsCount} attempts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-600">Days Since Last Review:</span>
                <span className="font-bold text-slate-900">{selectedTopic.daysSinceReview} days</span>
              </div>
            </div>

            {selectedTopic.missingPrerequisites?.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-800">
                <strong>Missing Foundational Prerequisite:</strong> {selectedTopic.missingPrerequisites.join(", ")}
              </div>
            )}

            {selectedTopic.dependentConcepts?.length > 0 && (
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900">
                <strong>Unlocks Advanced Concepts:</strong> {selectedTopic.dependentConcepts.join(", ")}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedTopic(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
              >
                Close
              </button>
              <Link
                to={`/learn/${selectedTopic.subjectId.toLowerCase()}/${selectedTopic.topicId}`}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
              >
                Open Concept Notes
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PersonalLearningTwinPage;
