import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const TARGET_TIERS = [
  "Tier-1 Product & Tech Giants",
  "FinTech & High-Growth Unicorns",
  "Emerging Startups & Tech Core",
  "IT Services & Digital Consultancies",
];

const WEEKLY_HOUR_OPTIONS = [8, 12, 16, 20, 25];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-violet-200 text-xs shadow-lg rounded-xl">
        <p className="text-slate-700 font-semibold">{label}</p>
        <p className="text-violet-700 font-bold text-sm mt-1">{payload[0].value}% Projected Readiness</p>
        {payload[0].payload?.milestone && (
          <p className="text-sky-700 text-[11px] mt-0.5">{payload[0].payload.milestone}</p>
        )}
      </div>
    );
  }
  return null;
};

const PlacementPrediction = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const [selectedTier, setSelectedTier] = useState("FinTech & High-Growth Unicorns");
  const [weeklyHours, setWeeklyHours] = useState(12);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("ALL");
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState("ALL");

  const fetchPrediction = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/prediction/readiness");
      setPrediction(data);
      if (data.targetTier) setSelectedTier(data.targetTier);
      if (data.weeklyHours) setWeeklyHours(data.weeklyHours);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load placement prediction data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  const handleRecalculate = async () => {
    setRecalculating(true);
    setError("");
    try {
      const { data } = await api.post("/prediction/recalculate", {
        targetTier: selectedTier,
        weeklyHours,
      });
      setPrediction(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to recalculate prediction.");
    } finally {
      setRecalculating(false);
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "High":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Medium":
        return "bg-sky-100 text-sky-700 border-sky-200";
      default:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#059669"; // emerald
    if (score >= 65) return "#0284c7"; // sky
    if (score >= 50) return "#7c3aed"; // violet
    return "#dc2626"; // red
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-t-transparent animate-spin" style={{ borderTopColor: "#7c3aed", borderColor: "rgba(124,58,237,0.2)" }} />
          <h3 className="text-base font-semibold text-slate-800">Generating your prediction...</h3>
          <p className="text-xs text-slate-600">Synthesizing diagnostic history & placement benchmarks</p>
        </div>
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="glass-card p-8 rounded-2xl max-w-lg w-full text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Prediction Unavailable</h2>
          <p className="text-sm text-slate-700 mb-2">
            {error || "Could not generate a placement prediction."}
          </p>
          <p className="text-xs text-slate-600 mb-6">
            If you haven't taken any tests yet, your prediction uses baseline benchmarks. Please make sure you're logged in and try again.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button onClick={fetchPrediction} className="px-5 py-2.5 rounded-xl btn-gradient text-sm font-semibold text-white">
              Try Again
            </button>
            <Link to="/test/DBMS" className="px-5 py-2.5 rounded-xl glass-card text-sm font-semibold hover:bg-slate-100 text-slate-800">
              Take DBMS Test First
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered improvement areas
  const filteredImprovements = (prediction.improvementAreas || []).filter((item) => {
    const matchSubject = selectedSubjectFilter === "ALL" || item.subject === selectedSubjectFilter;
    const matchPriority = selectedPriorityFilter === "ALL" || item.priority === selectedPriorityFilter;
    return matchSubject && matchPriority;
  });

  const criticalCount = (prediction.improvementAreas || []).filter(a => a.priority === "Critical" || a.priority === "High").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8" id="placement-prediction-page">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-700 border border-violet-200 flex items-center gap-1.5">
              <span>🎯</span> AI Career Intelligence
            </span>
            <span className="text-xs text-slate-600">
              Analyzed {prediction.testsAnalyzed} Assessment{prediction.testsAnalyzed === 1 ? "" : "s"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Skill & Placement <span className="gradient-text">Readiness Prediction</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Progress-based forecasting engine estimating your time-to-readiness, topic improvement deltas, and company tier calibration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/test/DBMS"
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold glass-card hover:bg-slate-100 text-slate-800 transition-colors flex items-center gap-1.5"
          >
            <span>📝 Take New Test</span>
          </Link>
          <Link
            to="/tutor"
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold btn-gradient text-white flex items-center gap-1.5 shadow-glow-purple"
          >
            <span>🤖 AI Tutor</span>
          </Link>
        </div>
      </div>

      {/* Hero Stats & Readiness Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Readiness Gauge Card */}
        <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-2xl border border-violet-200 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-violet-100/50 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-slate-600 font-semibold">Overall Placement Readiness</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-sky-50 border border-sky-200 text-sky-800 font-mono font-bold">
                {prediction.learningVelocity}
              </span>
            </div>

            {/* Big Radial/Meter Representation */}
            <div className="flex items-center gap-6 my-4">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    strokeWidth="3.5"
                    strokeDasharray={`${prediction.readinessScore}, 100`}
                    strokeLinecap="round"
                    stroke={getScoreColor(prediction.readinessScore)}
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {prediction.readinessScore}%
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Score</span>
                </div>
              </div>

              <div>
                <div className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                  {prediction.readinessTier}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Based on diagnostic depth across DBMS, Data Structures & Algorithms, and Operating Systems.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 mt-4">
            <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100">
              <div className="text-xs text-slate-600">Target Time to Ready</div>
              <div className="text-base sm:text-lg font-bold text-sky-700 mt-0.5">
                ⚡ ~{prediction.estimatedWeeksToReady} Weeks
              </div>
              <div className="text-[11px] text-slate-500">at {weeklyHours} hrs/week</div>
            </div>
            <div className="p-3 rounded-xl bg-violet-50/70 border border-violet-100">
              <div className="text-xs text-slate-600">Focused Study Required</div>
              <div className="text-base sm:text-lg font-bold text-violet-700 mt-0.5">
                ⏱️ {prediction.estimatedHoursTotal} Total Hours
              </div>
              <div className="text-[11px] text-slate-500">across {criticalCount} weak topics</div>
            </div>
          </div>
        </div>

        {/* Dynamic Recalibration Simulator Card */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>⚙️</span> Interactive Placement Simulator & Goal Adjuster
              </h3>
              <span className="text-xs text-sky-700 font-semibold">Real-time Recalculation</span>
            </div>
            <p className="text-xs text-slate-600 mb-6">
              Adjust your target company ambition or weekly available study hours to forecast your preparation curve.
            </p>

            <div className="space-y-4">
              {/* Target Company Tier Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Target Company Category:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TARGET_TIERS.map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTier(tier)}
                      className={`p-2.5 text-left rounded-xl border text-xs font-medium transition-all ${
                        selectedTier === tier
                          ? "bg-violet-600 border-violet-600 text-white shadow-sm font-semibold"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="font-semibold">{tier.split(" (")[0]}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly Hours Selector */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Weekly Study Commitment:
                  </label>
                  <span className="text-xs font-bold text-violet-700">{weeklyHours} Hours / Week</span>
                </div>
                <div className="flex items-center gap-2">
                  {WEEKLY_HOUR_OPTIONS.map((hrs) => (
                    <button
                      key={hrs}
                      onClick={() => setWeeklyHours(hrs)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                        weeklyHours === hrs
                          ? "bg-violet-600 border-violet-600 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {hrs}h
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-200 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              Projected completion: <strong className="text-slate-900">~{prediction.estimatedWeeksToReady} weeks</strong> from today
            </div>
            <button
              onClick={handleRecalculate}
              disabled={recalculating}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold btn-gradient text-white shadow-glow-purple flex items-center gap-2"
            >
              {recalculating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Recalculating...</span>
                </>
              ) : (
                <>
                  <span>⚡ Recalculate Prediction</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Trajectory Chart + Subject Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Projected Readiness Trajectory Chart */}
        <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>📈</span> Progress-Based Readiness Trajectory
              </h3>
              <p className="text-xs text-slate-600">Projected score evolution if weekly study commitment is maintained</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-semibold self-start sm:self-auto">
              Target: 85%+ Placement Ready
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={prediction.projectedTrajectory || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#readinessGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Domain Breakdown */}
        <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <span>📚</span> Core Technical Domain Weights
            </h3>
            <p className="text-xs text-slate-600 mb-5">Interview calibration weights for Computer Science roles</p>

            <div className="space-y-4">
              {(prediction.subjectBreakdown || []).map((sub) => (
                <div key={sub.subject} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{sub.subject}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 font-mono font-semibold">
                        Weight: {sub.weight}%
                      </span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: getScoreColor(sub.score) }}>
                      {sub.score}% Mastery
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${sub.score}%`, backgroundColor: getScoreColor(sub.score) }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[11px] text-slate-600">
                    <span>Status: {sub.status}</span>
                    <Link to={`/test/${sub.subject}`} className="text-sky-700 font-semibold hover:underline">
                      Retake Test →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 mt-4">
            * DSA (45%) has the highest interview weighting, followed by DBMS (30%) and OS (25%).
          </div>
        </div>
      </div>

      {/* "What to Improve and How Much" Gap Matrix */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200" id="improvement-matrix">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 font-semibold">
                Actionable Deficit Analysis
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              What to Improve & <span className="gradient-text">How Much</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Specific topic deltas, benchmark targets, and estimated hours required to attain placement competency.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
              {["ALL", "DBMS", "DSA", "OS"].map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubjectFilter(subj)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedSubjectFilter === subj ? "bg-violet-600 text-white font-semibold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>

            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
              {["ALL", "Critical", "High", "Medium"].map((pri) => (
                <button
                  key={pri}
                  onClick={() => setSelectedPriorityFilter(pri)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedPriorityFilter === pri ? "bg-violet-600 text-white font-semibold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {pri}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Improvement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImprovements.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">
              No topic gaps matched the selected filter criteria.
            </div>
          ) : (
            filteredImprovements.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-violet-300 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                      {item.subject}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getPriorityBadgeClass(item.priority)}`}>
                      {item.priority} Priority
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-2">{item.topic}</h4>

                  {/* Progress Comparison */}
                  <div className="space-y-1.5 my-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Current Mastery:</span>
                      <span className="font-bold text-slate-900">{item.currentScore}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${item.currentScore}%`, backgroundColor: getScoreColor(item.currentScore) }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-slate-600">Target Benchmark:</span>
                      <span className="font-bold text-emerald-700">{item.targetScore}%</span>
                    </div>

                    <div className="p-2 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-between text-xs font-semibold">
                      <span className="text-violet-800">Delta Needed:</span>
                      <span className="text-sky-700 font-bold">+{item.delta}% Improvement</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed my-2">
                    {item.recommendedAction}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600">⏱️ ~{item.estimatedHoursToFix} hrs needed</span>
                  <Link
                    to="/tutor"
                    className="text-sky-700 hover:text-sky-800 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Ask AI Tutor</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Company Tier Readiness Fit & AI Strategic Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Company Tier Breakdown */}
        <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-slate-200">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
            <span>🏢</span> Company Tier Readiness Match
          </h3>
          <p className="text-xs text-slate-600 mb-5">
            Calibrated against industry screening thresholds
          </p>

          <div className="space-y-3.5">
            {(prediction.companyTierFits || []).map((tier, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{tier.tier}</h4>
                    <p className="text-[11px] text-slate-600">{tier.companyExamples}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-sky-700">
                    {tier.fitPercent}% Fit
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 my-2">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, tier.fitPercent)}%`, backgroundColor: getScoreColor(tier.fitPercent) }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-600">
                  <span>Benchmark: {tier.benchmarkScore}%+</span>
                  <span className="font-semibold text-slate-800">{tier.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Strategic Action Plan & Danger Zones */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Executive Summary Card */}
          <div className="glass-card p-6 rounded-2xl border border-sky-200 relative overflow-hidden bg-gradient-to-br from-sky-50/50 to-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
              <h3 className="text-base font-bold text-slate-900">AI Placement Diagnostic Synthesis</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              {typeof prediction.aiExecutiveSummary === "object" ? JSON.stringify(prediction.aiExecutiveSummary) : prediction.aiExecutiveSummary}
            </p>
          </div>

          {/* AI Strategic Sprint Plan */}
          <div className="glass-card p-6 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50/40 to-white">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
              <span>📋</span> 4-Week Strategic Sprint Plan
            </h3>
            <div className="text-xs text-slate-700 leading-relaxed space-y-2 whitespace-pre-line bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              {typeof prediction.aiStrategicPlan === "object" ? JSON.stringify(prediction.aiStrategicPlan) : prediction.aiStrategicPlan}
            </div>

            {/* Danger Zones */}
            {prediction.dangerZones && prediction.dangerZones.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-rose-700 flex items-center gap-1.5 mb-2">
                  <span>⚠️</span> Key Interview Danger Zones (High Viva Risk):
                </h4>
                <div className="space-y-1.5">
                  {prediction.dangerZones.map((dz, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{dz}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 via-purple-50 to-sky-50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Ready to Boost Your Readiness Score?</h3>
          <p className="text-xs text-slate-600 mt-1">
            Generate a targeted 7-day study roadmap or retake diagnostic assessments to update your placement forecast.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold glass-card hover:bg-slate-100 text-slate-800 transition-colors"
          >
            Go to Roadmap
          </Link>
          <Link
            to="/test/DBMS"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold btn-gradient text-white shadow-glow-purple"
          >
            Start Assessment →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlacementPrediction;
