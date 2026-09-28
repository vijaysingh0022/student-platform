import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useAppState } from "../context/AppStateContext.jsx";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
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
      <div className="bg-slate-900 text-white p-3 border border-slate-700 text-xs shadow-xl rounded-xl">
        <p className="text-slate-300 font-semibold">{label}</p>
        <p className="text-indigo-400 font-bold text-sm mt-1">{payload[0].value}% Projected Readiness</p>
        {payload[0].payload?.milestone && (
          <p className="text-sky-300 text-[11px] mt-0.5">{payload[0].payload.milestone}</p>
        )}
      </div>
    );
  }
  return null;
};

const PlacementPrediction = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { testVersion, careerVersion } = useAppState();

  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [transparencyOpen, setTransparencyOpen] = useState(false);

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

  useEffect(() => {
    if (testVersion > 0 || careerVersion > 0) {
      api.get("/prediction/readiness")
        .then(({ data }) => setPrediction(data))
        .catch(() => {});
    }
  }, [testVersion, careerVersion]);

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
    if (score >= 80) return "#10b981"; // emerald
    if (score >= 65) return "#0ea5e9"; // sky
    if (score >= 50) return "#6366f1"; // indigo
    return "#f43f5e"; // rose
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
          <h3 className="text-base font-bold text-slate-800">Calculating Placement Readiness...</h3>
          <p className="text-xs text-slate-500">Extracting assessment features & evaluating ML model</p>
        </div>
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-lg w-full text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Readiness Engine Standby</h2>
          <p className="text-sm text-slate-600 mb-4">
            {error || "Placement readiness is temporarily unavailable. Your assessment results are safe."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button onClick={fetchPrediction} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-700 shadow-xs transition-colors">
              Try Again
            </button>
            <Link to="/test/DSA" className="px-5 py-2.5 rounded-xl bg-slate-100 text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors">
              Take Diagnostic Test First
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredImprovements = (prediction.improvementAreas || []).filter((item) => {
    const matchSubject = selectedSubjectFilter === "ALL" || item.subject === selectedSubjectFilter;
    const matchPriority = selectedPriorityFilter === "ALL" || item.priority === selectedPriorityFilter;
    return matchSubject && matchPriority;
  });

  const criticalCount = (prediction.improvementAreas || []).filter(a => a.priority === "Critical" || a.priority === "High").length;

  return (
    <div className="space-y-8" id="placement-prediction-page">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
              <span>🧠</span> ML Placement Readiness Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
              Model: {prediction.modelVersion || "v1.0"}
            </span>
            <span className="text-xs text-slate-500">
              Analyzed {prediction.testsAnalyzed} Assessment{prediction.testsAnalyzed === 1 ? "" : "s"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Placement Readiness & <span className="text-indigo-600">Competency Prediction</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Empirical machine learning evaluation assessing your current CSE technical competency across all 8 core placement tracks.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setTransparencyOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1.5"
          >
            <span>ℹ️</span> How this score is calculated
          </button>
          <Link
            to="/test/DSA"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1.5"
          >
            <span>📝 Take Test</span>
          </Link>
          <Link
            to="/tutor"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>🤖 AI Tutor</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI & Gauge Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Readiness Gauge Card */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-extrabold">Placement Readiness Score</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
                {prediction.tierLevel || "Evaluated"}
              </span>
            </div>

            {/* Circular Gauge Representation */}
            <div className="flex items-center gap-6 my-3">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
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
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    {prediction.readinessScore}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">out of 100</span>
                </div>
              </div>

              <div>
                <div className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                  {prediction.readinessTier}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Calculated from 14 quantitative features spanning domain mastery, velocity, and topic consistency.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 mt-3">
            <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
              <div className="text-[11px] text-indigo-700 font-bold uppercase tracking-wide">Target Time to Ready</div>
              <div className="text-base sm:text-lg font-black text-indigo-950 mt-0.5">
                ⚡ ~{prediction.estimatedWeeksToReady} Weeks
              </div>
              <div className="text-[10px] text-slate-500 font-medium">at {weeklyHours} hrs/week study</div>
            </div>
            <div className="p-3 rounded-2xl bg-violet-50/70 border border-violet-100">
              <div className="text-[11px] text-violet-700 font-bold uppercase tracking-wide">Study Hours Required</div>
              <div className="text-base sm:text-lg font-black text-violet-950 mt-0.5">
                ⏱️ {prediction.estimatedHoursTotal} Total Hours
              </div>
              <div className="text-[10px] text-slate-500 font-medium">across {criticalCount} weak topics</div>
            </div>
          </div>
        </div>

        {/* Dynamic Goal Adjuster & Recalibration */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>⚙️</span> Interactive Placement Simulator & Target Tier
              </h3>
              <span className="text-xs text-indigo-600 font-bold">Real-time Recalculation</span>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Customize your target company tier or available weekly study hours to recalculate your preparation timeline.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Target Company Tier:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TARGET_TIERS.map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTier(tier)}
                      className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                        selectedTier === tier
                          ? "bg-indigo-600 border-indigo-600 text-white font-bold shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
                      }`}
                    >
                      <div>{tier.split(" (")[0]}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    Weekly Study Commitment:
                  </label>
                  <span className="text-xs font-bold text-indigo-600">{weeklyHours} Hours / Week</span>
                </div>
                <div className="flex items-center gap-2">
                  {WEEKLY_HOUR_OPTIONS.map((hrs) => (
                    <button
                      key={hrs}
                      onClick={() => setWeeklyHours(hrs)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                        weeklyHours === hrs
                          ? "bg-indigo-600 border-indigo-600 text-white"
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

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Target completion: <strong className="text-slate-900">~{prediction.estimatedWeeksToReady} weeks</strong>
            </div>
            <button
              onClick={handleRecalculate}
              disabled={recalculating}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors flex items-center gap-2"
            >
              {recalculating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Recalculating...</span>
                </>
              ) : (
                <>
                  <span>⚡ Recalculate Timeline</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Strengths, Weak Areas & Contributing Factors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Top 3 Strengths */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💪</span>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Top Strengths</h3>
            </div>
            <div className="space-y-2.5">
              {(prediction.strengths || []).slice(0, 3).map((st) => (
                <div key={st.name} className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{st.name}</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">{st.status || "Strong Competency"}</p>
                  </div>
                  <span className="text-xs font-black text-emerald-700">{st.score}%</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">Contributed positively to overall score</p>
        </div>

        {/* Top 3 Improvement Areas */}
        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">⚠️</span>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Improvement Areas</h3>
            </div>
            <div className="space-y-2.5">
              {(prediction.improvementAreas || []).slice(0, 3).map((imp) => (
                <div key={imp.name || imp.topic} className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{imp.name || imp.topic}</p>
                    <p className="text-[10px] text-rose-700 font-semibold">{imp.status || "Focus Area"}</p>
                  </div>
                  <span className="text-xs font-black text-rose-700">{imp.score || imp.currentScore}%</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">Highest leverage areas for readiness gain</p>
        </div>

        {/* Explainable Factor Contributions */}
        <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📊</span>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Model Explanation</h3>
            </div>
            <div className="space-y-2">
              {(prediction.explanations || []).map((exp, i) => (
                <p key={i} className="text-xs text-slate-600 leading-relaxed p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  {exp}
                </p>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">Supervised feature attribution analysis</p>
        </div>
      </div>

      {/* 8-Domain Competency Breakdown & Projected Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trajectory Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>📈</span> Readiness Trajectory & Forecast
              </h3>
              <p className="text-xs text-slate-500">Projected competency score if study commitment is maintained</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold self-start sm:self-auto">
              Target: 85%+ Ready
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={prediction.projectedTrajectory || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#readinessGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 8-Domain Breakdown Table */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <span>📚</span> Core Technical Domain Competencies
            </h3>
            <p className="text-xs text-slate-500 mb-4">Competency scores across 8 placement tracks</p>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {(prediction.subjectBreakdown || []).map((sub) => (
                <div key={sub.subject} className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{sub.subject}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                        {sub.weight || 12}% Weight
                      </span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: getScoreColor(sub.score) }}>
                      {sub.score}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${sub.score}%`, backgroundColor: getScoreColor(sub.score) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 mt-3">
            * DSA, System Design, and DBMS hold primary weighting in technical screening rounds.
          </div>
        </div>
      </div>

      {/* "What to Improve and How Much" Gap Matrix */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs" id="improvement-matrix">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                Actionable Deficit Analysis
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              What to Improve & How Much
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
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
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedSubjectFilter === subj ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
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
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedPriorityFilter === pri ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
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
            <div className="col-span-full py-12 text-center text-slate-400 text-xs font-semibold">
              No topic gaps matched the selected filter criteria.
            </div>
          ) : (
            filteredImprovements.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between group shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800">
                      {item.subject}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadgeClass(item.priority)}`}>
                      {item.priority} Priority
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-2">{item.topic}</h4>

                  <div className="space-y-1.5 my-3">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">Current Mastery:</span>
                      <span className="font-bold text-slate-900">{item.currentScore}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${item.currentScore}%`, backgroundColor: getScoreColor(item.currentScore) }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1 font-medium">
                      <span className="text-slate-500">Target Benchmark:</span>
                      <span className="font-bold text-emerald-700">{item.targetScore}%</span>
                    </div>

                    <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs font-semibold">
                      <span className="text-indigo-800">Delta Needed:</span>
                      <span className="text-indigo-600 font-bold">+{item.delta}% Improvement</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed my-2">
                    {item.recommendedAction}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">⏱️ ~{item.estimatedHoursToFix} hrs needed</span>
                  <Link
                    to="/tutor"
                    className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
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

      {/* AI Synthesis & Danger Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
            <span>🏢</span> Company Tier Readiness Match
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Calibrated against standardized technical hiring thresholds
          </p>

          <div className="space-y-3.5">
            {(prediction.companyTierFits || []).map((tier, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{tier.tier}</h4>
                    <p className="text-[11px] text-slate-500">{tier.companyExamples}</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600">
                    {tier.fitPercent}% Fit
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 my-2">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, tier.fitPercent)}%`, backgroundColor: getScoreColor(tier.fitPercent) }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>Benchmark: {tier.benchmarkScore}%+</span>
                  <span className="font-bold text-slate-800">{tier.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-base font-bold text-slate-900">AI Placement Diagnostic Synthesis</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {typeof prediction.aiExecutiveSummary === "object" ? JSON.stringify(prediction.aiExecutiveSummary) : prediction.aiExecutiveSummary}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
              <span>📋</span> 4-Week Strategic Sprint Plan
            </h3>
            <div className="text-xs text-slate-700 leading-relaxed space-y-2 whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {typeof prediction.aiStrategicPlan === "object" ? JSON.stringify(prediction.aiStrategicPlan) : prediction.aiStrategicPlan}
            </div>

            {prediction.dangerZones && prediction.dangerZones.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-rose-700 flex items-center gap-1.5 mb-2">
                  <span>⚠️</span> High-Risk Viva & Interview Topics:
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

      {/* Model Transparency Modal */}
      {transparencyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">ℹ️</span>
                <h3 className="text-base font-black text-slate-900">How LearnX Calculates Placement Readiness</h3>
              </div>
              <button
                onClick={() => setTransparencyOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed max-h-96 overflow-y-auto pr-2">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                <p className="font-bold text-indigo-900 text-sm">1. Diagnostic Assessment Performance</p>
                <p>Features are extracted from your real test results across 8 core tracks (DSA, DBMS, OS, CN, OOPs, System Design, Aptitude, Web Dev).</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900 text-sm">2. Multi-Dimensional Feature Engineering</p>
                <p>The system computes 14 quantifiable metrics including subject mastery averages, overall accuracy, attempt volume, score improvement rate, learning velocity, and topic variance.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900 text-sm">3. Supervised Machine Learning Model ({prediction.modelVersion || "v1.0"})</p>
                <p>The normalized feature vector is evaluated by a trained Scikit-Learn Gradient Boosting Regressor (cross-validation R² = 0.989, MAE = 1.65 score points) to produce an unbiased 0–100 score.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <p className="font-bold text-amber-950 text-sm">⚖️ Ethical AI & Transparency Disclaimer</p>
                <p>This score represents current academic and placement competency readiness based on measurable assessments. It is <strong>NOT</strong> an employment guarantee or a definitive job offer prediction.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setTransparencyOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementPrediction;
