import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Sparkles,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  BookOpen,
  RefreshCw,
  Sliders,
  Calendar,
  Compass,
  Activity,
  Award,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import {
  getPersonalLearningTwin,
  recalculatePersonalLearningTwin,
  simulatePersonalLearningPlan,
} from "../services/api.js";

export const PersonalLearningTwinPage = () => {
  const [twin, setTwin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  // Simulation controls state
  const [simSubject, setSimSubject] = useState("DSA");
  const [simMinsDaily, setSimMinsDaily] = useState(30);
  const [simDays, setSimDays] = useState(30);
  const [simResult, setSimResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Filter tabs for Knowledge State Matrix
  const [activeSubjectFilter, setActiveSubjectFilter] = useState("ALL");

  const fetchTwin = async () => {
    try {
      setLoading(true);
      const res = await getPersonalLearningTwin();
      if (res.data?.success && res.data?.twin) {
        setTwin(res.data.twin);
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
      }
    } catch (err) {
      console.error("Recalculate error:", err);
    } finally {
      setRecalculating(false);
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
          <p className="text-xs font-bold text-slate-600">Synthesizing your Personal Learning Twin...</p>
        </div>
      </div>
    );
  }

  const nextAction = twin?.nextBestAction;
  const filteredStates = (twin?.topicKnowledgeStates || []).filter(
    (t) => activeSubjectFilter === "ALL" || t.subjectId === activeSubjectFilter
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 font-sans">
      
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                <Brain className="w-3.5 h-3.5" />
                <span>Central Educational Intelligence Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                AI Personal Learning Twin
              </h1>
              <p className="text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
                Continuously modeling what you know, where your learning gaps are, which concepts are decaying, and what single learning action will deliver the highest mastery return today.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleRecalculate}
                disabled={recalculating}
                className="px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all flex items-center gap-2 shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${recalculating ? "animate-spin text-indigo-600" : ""}`} />
                <span>{recalculating ? "Recalculating DNA..." : "Recalculate Profile"}</span>
              </button>
            </div>
          </div>

          {/* Key KPI Cards (Learning DNA Snapshot) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block mb-1">
                Learning DNA Index
              </span>
              <div className="text-2xl sm:text-3xl font-black text-indigo-700">
                {twin?.overallLearningIndex || 68}%
              </div>
              <span className="text-[11px] font-bold text-indigo-600">Cross-Subject Mastery</span>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block mb-1">
                Retention Health
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                {twin?.retentionHealthScore || 82}%
              </div>
              <span className="text-[11px] font-bold text-emerald-600">Ebbinghaus Curve Stability</span>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block mb-1">
                Study Velocity
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-700">
                {twin?.activeStudyHoursWeekly || 4.5} hrs/wk
              </div>
              <span className="text-[11px] font-bold text-amber-600">Active Recall & Practice</span>
            </div>

            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block mb-1">
                Identified Gaps
              </span>
              <div className="text-2xl sm:text-3xl font-black text-rose-700">
                {(twin?.learningGaps || []).length}
              </div>
              <span className="text-[11px] font-bold text-rose-600">Requires Intervention</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* ROW 1: NEXT BEST ACTION (HERO CARD) */}
        {nextAction && (
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full bg-indigo-500/10">
                  ⚡ HIGHEST RETURN LEARNING INTERVENTION
                </span>
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Est. {nextAction.estimatedMinutes} mins</span>
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {nextAction.subjectId} • Next Best Learning Action
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {nextAction.title}
                </h2>
              </div>

              {/* Explainability Block */}
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-xs space-y-1.5 backdrop-blur-xs">
                <p className="font-semibold text-slate-200">
                  <strong className="text-indigo-300 font-bold">Why Selected: </strong>
                  {nextAction.whySelected}
                </p>
                <p className="font-semibold text-emerald-300">
                  <strong className="text-emerald-400 font-bold">Expected Benefit: </strong>
                  {nextAction.expectedBenefit}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {nextAction.supportingData?.map((data, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white/10 text-[11px] font-medium text-slate-300"
                    >
                      • {data}
                    </span>
                  ))}
                </div>

                <Link
                  to={nextAction.actionRoute}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all shadow-md flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{nextAction.actionLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ROW 2: KNOWLEDGE STATE MATRIX & SUBJECT DNA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Subject DNA Overview (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-black text-slate-900">Subject Mastery DNA</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400">7 Core Domains</span>
              </div>

              <div className="space-y-3">
                {(twin?.subjectsDna || []).map((s) => (
                  <div key={s.subjectId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{s.subjectName}</span>
                      <span className="font-black text-indigo-600">{s.overallMastery}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(5, s.overallMastery))}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                      <span>{s.masteredCount} Mastered</span>
                      <span>{s.needsRevisionCount > 0 ? `${s.needsRevisionCount} Needs Review` : "Stable"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Identified Learning Gaps Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <h3 className="text-sm font-black text-slate-900">Diagnosed Learning Gaps</h3>
                </div>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                  Actionable
                </span>
              </div>

              <div className="space-y-2.5">
                {(twin?.learningGaps || []).length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400 font-medium">
                    No active critical learning gaps detected. Great consistency!
                  </div>
                ) : (
                  twin.learningGaps.map((gap, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-rose-950">
                        <span>{gap.topicName}</span>
                        <span className="text-[10px] font-black uppercase text-rose-600">
                          {gap.type.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium">{gap.evidence}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Topic-Level Knowledge State Map (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Topic Knowledge State Matrix
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Measurable state tracking: Unexplored → Learning → Developing → Strong → Mastered (with Ebbinghaus Needs Revision flag)
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {["ALL", "DSA", "DBMS", "OS", "CN", "OOP"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSubjectFilter(s)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                        activeSubjectFilter === s
                          ? "bg-slate-900 text-white"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredStates.length === 0 ? (
                  <div className="col-span-2 py-8 text-center text-xs text-slate-400">
                    No recorded topics for this subject filter. Start reading concepts or taking quizzes!
                  </div>
                ) : (
                  filteredStates.map((topic, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200/80 hover:bg-white hover:border-indigo-300 transition-all space-y-2 shadow-2xs group"
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

                      {/* Accuracy & Retention Confidence bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                          <span>Mastery: {topic.masteryScore}%</span>
                          <span>Retention: {topic.retentionConfidence}%</span>
                        </div>
                        <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              topic.masteryScore >= 75
                                ? "bg-emerald-500"
                                : topic.masteryScore >= 50
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${topic.masteryScore}%` }}
                          />
                        </div>
                      </div>

                      {topic.missingPrerequisites?.length > 0 && (
                        <div className="text-[10px] text-rose-600 font-bold pt-1">
                          ⚠️ Prerequisite needed: {topic.missingPrerequisites[0]}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: PERSONALIZED LEARNING SIMULATION ENGINE */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Personalized Learning Plan Simulator
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Explore hypothetical study schedules. Transparently models mastery growth and retention based on historical velocity.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full self-start sm:self-center">
              Predictive Modeling
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Simulation Form (5 Cols) */}
            <form onSubmit={handleRunSimulation} className="lg:col-span-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Target Subject Focus
                </label>
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
                <span>{simulating ? "Simulating Learning Curve..." : "Run Scenario Simulation"}</span>
              </button>
            </form>

            {/* Simulation Results Display (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-50/70 rounded-2xl border border-slate-200/90 p-5 space-y-4">
              {!simResult ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Select parameters on the left to project hypothetical mastery.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <span className="text-xs font-black text-slate-900">
                      Projected Outcome: {simResult.targetSubject} ({simResult.durationDays} Days @ {simResult.dailyStudyMinutes}m/d)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {simResult.retentionStabilityProjected} Stability
                    </span>
                  </div>

                  {/* Growth Numbers */}
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
                      <span className="text-[10px] font-bold text-emerald-600 block uppercase">Final Mastery</span>
                      <span className="text-lg font-black text-emerald-700">{simResult.projectedMastery}%</span>
                    </div>
                  </div>

                  {/* Assumptions */}
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-slate-700">Transparent Assumptions:</span>
                    {(simResult.assumptions || []).map((ass, idx) => (
                      <p key={idx} className="text-slate-500 font-medium">
                        • {ass}
                      </p>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-200/60">
                    * {simResult.disclaimer || "Simulated estimate based on learning science models; not a guaranteed outcome."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PersonalLearningTwinPage;
