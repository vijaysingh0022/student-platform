import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getSkillGraph } from "../services/api.js";

// ─── Constants ────────────────────────────────────────────────────────────────
const MASTERY_CONFIG = {
  mastered:    { label: "Mastered",    color: "#10b981", bg: "bg-emerald-500",  light: "bg-emerald-50",  border: "border-emerald-200", text: "text-emerald-700",  ring: "ring-emerald-400", dot: "🟢" },
  strong:      { label: "Strong",      color: "#3b82f6", bg: "bg-blue-500",     light: "bg-blue-50",     border: "border-blue-200",    text: "text-blue-700",     ring: "ring-blue-400",    dot: "🔵" },
  developing:  { label: "Developing",  color: "#f59e0b", bg: "bg-amber-400",    light: "bg-amber-50",    border: "border-amber-200",   text: "text-amber-700",    ring: "ring-amber-400",   dot: "🟡" },
  weak:        { label: "Weak",        color: "#ef4444", bg: "bg-rose-500",     light: "bg-rose-50",     border: "border-rose-200",    text: "text-rose-700",     ring: "ring-rose-400",    dot: "🔴" },
  not_started: { label: "Not Started", color: "#94a3b8", bg: "bg-slate-300",    light: "bg-slate-50",    border: "border-slate-200",   text: "text-slate-500",    ring: "ring-slate-300",   dot: "⚪" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Circular mastery ring */
const MasteryRing = ({ pct = 0, size = 80, strokeWidth = 7, color = "#3b82f6" }) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
};

/** Horizontal mastery bar for topic rows */
const MasteryBar = ({ pct = 0, color = "#3b82f6" }) => (
  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
    <div
      className="h-full rounded-full transition-all duration-700"
      style={{ width: `${Math.max(pct, 3)}%`, backgroundColor: color }}
    />
  </div>
);

/** Subject card */
const SubjectCard = ({ subject, isSelected, onClick }) => {
  const cfg = MASTERY_CONFIG[subject.masteryStatus] || MASTERY_CONFIG.not_started;
  return (
    <button
      onClick={onClick}
      className={`group relative p-4 rounded-2xl border-2 transition-all duration-200 text-left w-full
        ${isSelected
          ? `${cfg.light} ${cfg.border} shadow-lg ring-2 ${cfg.ring} ring-offset-1`
          : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
        }`}
    >
      <div className="flex items-center gap-3">
        {/* Circular ring */}
        <div className="relative flex-shrink-0">
          <MasteryRing pct={subject.masteryPercentage} size={52} strokeWidth={5} color={subject.color} />
          <div className="absolute inset-0 flex items-center justify-center text-base rotate-90">
            {subject.icon}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-xs font-black text-slate-900 truncate">{subject.label}</div>
          <div className={`text-lg font-black ${cfg.text}`}>{subject.masteryPercentage}%</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${cfg.light} ${cfg.text}`}>
              {cfg.label}
            </span>
            <span className="text-[9px] text-slate-400 font-medium">
              {subject.completedTopics}/{subject.totalTopics}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

/** Stat tile */
const StatTile = ({ label, value, sub, color = "text-slate-900", icon }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 shadow-xs">
    {icon && <div className="text-2xl">{icon}</div>}
    <div>
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      <div className="text-xs font-bold text-slate-500">{label}</div>
      {sub && <div className="text-[10px] text-slate-400">{sub}</div>}
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SkillGraphPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [topicFilter, setTopicFilter] = useState("all"); // all | weak | strong | not_started

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSkillGraph();
      setData(res.data);
      if (res.data?.subjectSkills?.length > 0) {
        setSelectedSubject(res.data.subjectSkills[0]);
      }
    } catch (err) {
      setError("Failed to load skill graph. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f6fc] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          <div>
            <p className="text-sm font-bold text-slate-900">Building your Skill Graph...</p>
            <p className="text-xs text-slate-500">Analysing your quiz, assessment & learning data</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f0f6fc] flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-rose-200 p-10 text-center space-y-3 max-w-sm shadow-sm">
          <div className="text-4xl">⚠️</div>
          <h2 className="font-black text-slate-900">Something went wrong</h2>
          <p className="text-xs text-slate-500">{error}</p>
          <button onClick={load} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const overallCfg = MASTERY_CONFIG[data.masteryStatus] || MASTERY_CONFIG.not_started;

  const filteredTopics = (selectedSubject?.topicBreakdown || []).filter(t => {
    if (topicFilter === "weak")        return t.masteryPercentage > 0 && t.masteryPercentage < 60;
    if (topicFilter === "strong")      return t.masteryPercentage >= 75;
    if (topicFilter === "not_started") return t.masteryStatus === "not_started";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f0f6fc] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── HEADER ──────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-white rounded-3xl border border-indigo-100 shadow-sm p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-100/60 via-violet-100/40 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800 uppercase tracking-wider">
                🧬 CSE Skill Intelligence
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Your Skill Graph
              </h1>
              <p className="text-sm text-slate-500 font-medium max-w-lg">
                Live intelligence layer tracking your mastery across every CSE subject, topic, and concept — updated automatically after every quiz, assessment, and AI session.
              </p>
            </div>

            {/* Overall Mastery Ring */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="relative">
                <MasteryRing pct={data.overallMastery} size={120} strokeWidth={10} color={overallCfg.color} />
                <div className="absolute inset-0 flex flex-col items-center justify-center rotate-90">
                  <span className="text-2xl font-black text-slate-900">{data.overallMastery}%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Mastery</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${overallCfg.light} ${overallCfg.text} ${overallCfg.border}`}>
                {overallCfg.dot} {overallCfg.label}
              </span>
            </div>
          </div>
        </div>

        {/* ── STAT TILES ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatTile icon="📚" label="Topics Total"    value={data.totalTopicsInCurriculum} color="text-slate-900" />
          <StatTile icon="✅" label="Completed"       value={data.totalTopicsCompleted}    color="text-emerald-600" />
          <StatTile icon="🎯" label="Attempted"       value={data.totalTopicsAttempted}    color="text-blue-600" />
          <StatTile icon="🔥" label="This Week"       value={data.velocity.topicsThisWeek} color="text-orange-500" sub="Topics completed" />
          <StatTile icon="📈" label="Improving"       value={data.velocity.improvedThisWeek} color="text-violet-600" sub="Topics this week" />
          <StatTile icon="💪" label="Subjects Active" value={data.subjectSkills.filter(s => s.completedTopics > 0).length} color="text-indigo-600" sub={`of ${data.subjectSkills.length}`} />
        </div>

        {/* ── MAIN GRID ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

          {/* LEFT: Subject Cards Grid */}
          <div className="xl:col-span-4 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
              <h2 className="text-sm font-black text-slate-900 mb-3">Subject Mastery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
                {data.subjectSkills.map(subject => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    isSelected={selectedSubject?.id === subject.id}
                    onClick={() => { setSelectedSubject(subject); setTopicFilter("all"); }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Topic Breakdown + Extremes */}
          <div className="xl:col-span-8 space-y-5">

            {/* Topic Breakdown Panel */}
            {selectedSubject && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                {/* Panel Header */}
                <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner"
                      style={{ backgroundColor: selectedSubject.color + "20", border: `1px solid ${selectedSubject.color}40` }}
                    >
                      {selectedSubject.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">{selectedSubject.label}</h3>
                      <div className="text-xs text-slate-500 font-medium">
                        {selectedSubject.completedTopics}/{selectedSubject.totalTopics} completed •{" "}
                        <span style={{ color: selectedSubject.color }} className="font-bold">
                          {selectedSubject.masteryPercentage}% mastery
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Topic filter pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { id: "all",         label: "All" },
                      { id: "strong",      label: "💪 Strong" },
                      { id: "weak",        label: "⚠️ Weak" },
                      { id: "not_started", label: "🔘 Not Started" },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setTopicFilter(f.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                          topicFilter === f.id
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic rows */}
                <div className="p-5 sm:p-6 space-y-2 max-h-[520px] overflow-y-auto">
                  {filteredTopics.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm font-medium">
                      No topics match this filter.
                    </div>
                  ) : (
                    filteredTopics.map(t => {
                      const cfg = MASTERY_CONFIG[t.masteryStatus] || MASTERY_CONFIG.not_started;
                      return (
                        <Link
                          key={t.topicId}
                          to={`/learn/${selectedSubject.id}/${t.topicId}`}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          {/* Status dot */}
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cfg.color }}
                          />

                          {/* Topic name */}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
                              {t.title}
                            </div>
                            {t.weakConcepts?.length > 0 && (
                              <div className="text-[10px] text-rose-500 font-medium truncate">
                                ⚠ Weak: {t.weakConcepts.slice(0, 2).join(", ")}
                              </div>
                            )}
                          </div>

                          {/* Bar */}
                          <div className="flex items-center gap-2 flex-shrink-0 w-36">
                            <MasteryBar pct={t.masteryPercentage} color={cfg.color} />
                            <span className="text-[11px] font-black text-slate-700 w-8 text-right">
                              {t.masteryPercentage}%
                            </span>
                          </div>

                          {/* Status badge */}
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider flex-shrink-0 ${cfg.light} ${cfg.text}`}>
                            {cfg.label}
                          </span>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Bottom row: Strongest + Weakest */}
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Strongest Topics */}
              <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs p-5">
                <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-base">💪</span> Strongest Topics
                </h3>
                <div className="space-y-2">
                  {data.strongTopics.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Complete topic quizzes to build strong mastery.</p>
                  ) : (
                    data.strongTopics.map((t, i) => (
                      <div key={t.topicId} className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-300 w-4">#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-800 truncate">{t.title}</div>
                        </div>
                        <div className="flex items-center gap-1.5 w-24">
                          <MasteryBar pct={t.masteryPercentage} color="#10b981" />
                          <span className="text-[11px] font-black text-emerald-700">{t.masteryPercentage}%</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Weakest Topics */}
              <div className="bg-white rounded-2xl border border-rose-100 shadow-xs p-5">
                <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-base">⚠️</span> Needs Attention
                </h3>
                <div className="space-y-2">
                  {data.weakTopics.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No weak topics yet. Keep practising!</p>
                  ) : (
                    data.weakTopics.map((t, i) => (
                      <div key={t.topicId} className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-300 w-4">#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-800 truncate">{t.title}</div>
                        </div>
                        <div className="flex items-center gap-1.5 w-24">
                          <MasteryBar pct={t.masteryPercentage} color="#ef4444" />
                          <span className="text-[11px] font-black text-rose-700">{t.masteryPercentage}%</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {data.weakTopics.length > 0 && (
                  <Link
                    to="/learn"
                    className="mt-3 flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                  >
                    → Go to curriculum to revise
                  </Link>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-2xl border border-slate-100 px-5 py-3 flex flex-wrap gap-3 shadow-xs">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-2">Legend:</span>
              {Object.entries(MASTERY_CONFIG).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                  <span className="text-[11px] font-bold text-slate-600">{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
