import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  getCareerTwin,
  refreshCareerTwin,
  updateCareerTwinSprintDay,
  updateCareerTwinRole,
  sendCareerTwinChatMessage,
  simulateSkillImprovement,
} from '../services/api';

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated count-up number */
function AnimatedScore({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!value) return;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(progress * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);
  return <span>{display}</span>;
}

/** Skill score bar row */
function SkillBar({ label, score, trend, icon }) {
  const pct = score || 0;
  const color =
    pct >= 75 ? 'bg-emerald-500' :
    pct >= 55 ? 'bg-amber-500' :
    'bg-rose-500';
  const textColor =
    pct >= 75 ? 'text-emerald-700' :
    pct >= 55 ? 'text-amber-700' :
    'text-rose-700';
  const bgColor =
    pct >= 75 ? 'bg-emerald-50' :
    pct >= 55 ? 'bg-amber-50' :
    'bg-rose-50';
  const status =
    pct >= 75 ? 'Strong' :
    pct >= 55 ? 'Developing' :
    pct > 0 ? 'Needs Work' : 'Not Started';

  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0 group">
      <div className="w-24 shrink-0">
        <div className="text-xs font-semibold text-slate-800">{label}</div>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${bgColor} ${textColor} mt-0.5 inline-block`}>
          {status}
        </span>
      </div>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="w-16 text-right">
        <span className="text-sm font-bold text-slate-900">{pct > 0 ? `${pct}%` : '–'}</span>
        {trend !== undefined && pct > 0 && (
          <div className={`text-[10px] font-semibold mt-0.5 ${trend >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            {trend >= 0 ? `↑ ${trend}%` : `↓ ${Math.abs(trend)}%`}
          </div>
        )}
      </div>
    </div>
  );
}

/** Sprint day card */
function SprintCard({ day, task, minutes, actionRoute, status, onStatusChange, navigate }) {
  const statusStyles = {
    pending: 'bg-white border-slate-200',
    started: 'bg-blue-50 border-blue-200',
    completed: 'bg-emerald-50 border-emerald-200',
    skipped: 'bg-slate-50 border-slate-200 opacity-60',
  };

  return (
    <div className={`p-4 rounded-2xl border transition-all ${statusStyles[status]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{day}</span>
        <span className="text-[10px] font-medium text-slate-400">{minutes} min</span>
      </div>
      <p className="text-xs font-semibold text-slate-800 leading-tight mb-3">{task}</p>
      <div className="flex gap-1.5">
        {status !== 'completed' && status !== 'skipped' && (
          <>
            <button
              onClick={() => { navigate(actionRoute); onStatusChange('started'); }}
              className="flex-1 py-1.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              Start
            </button>
            <button
              onClick={() => onStatusChange('skipped')}
              className="px-2 py-1.5 text-[10px] font-medium text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Skip
            </button>
          </>
        )}
        {status === 'started' && (
          <button
            onClick={() => onStatusChange('completed')}
            className="flex-1 py-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
          >
            ✓ Mark Done
          </button>
        )}
        {status === 'completed' && (
          <span className="flex-1 text-center py-1.5 text-[10px] font-bold text-emerald-700">
            ✓ Completed
          </span>
        )}
        {status === 'skipped' && (
          <button
            onClick={() => onStatusChange('pending')}
            className="flex-1 py-1.5 text-[10px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Restore
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CareerTwinPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [twin, setTwin] = useState(null);
  const [userMeta, setUserMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showExplain, setShowExplain] = useState(false);

  // Coach chat state
  const [coachMessages, setCoachMessages] = useState([]);
  const [coachInput, setCoachInput] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Simulator state
  const [simSkill, setSimSkill] = useState('dsa');
  const [simTarget, setSimTarget] = useState(75);
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  // Role change state
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [roleUpdating, setRoleUpdating] = useState(false);

  const ROLES = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Analyst',
    'AI/ML Engineer',
  ];

  const SKILL_LABELS = {
    dsa: 'DSA',
    dbms: 'DBMS',
    os: 'Operating Systems',
    cn: 'Computer Networks',
    oops: 'OOP',
    systemDesign: 'System Design',
    webDev: 'Web Development',
    coding: 'Coding Consistency',
    interview: 'Interview Readiness',
  };

  useEffect(() => {
    loadTwin();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [coachMessages]);

  const loadTwin = async () => {
    setLoading(true);
    try {
      const res = await getCareerTwin();
      if (res.data?.careerTwin) {
        setTwin(res.data.careerTwin);
        setUserMeta(res.data.user || {});
        setSelectedRole(res.data.careerTwin.targetRole || 'Software Engineer');
        setCoachMessages(res.data.careerTwin.coachChat?.slice(-10) || []);
      }
    } catch (err) {
      console.error('Failed to load Career Twin:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await refreshCareerTwin({ targetRole: selectedRole });
      if (res.data?.careerTwin) {
        setTwin(res.data.careerTwin);
        setUserMeta(res.data.user || {});
      }
    } catch (err) {
      console.error('Refresh failed:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRoleUpdate = async () => {
    setRoleUpdating(true);
    try {
      const res = await updateCareerTwinRole(selectedRole);
      if (res.data?.careerTwin) {
        setTwin(res.data.careerTwin);
      }
    } catch (err) {
      console.error('Role update failed:', err);
    } finally {
      setRoleUpdating(false);
    }
  };

  const handleSprintStatus = async (day, status) => {
    try {
      const res = await updateCareerTwinSprintDay(day, status);
      if (res.data?.weekSprint) {
        setTwin((prev) => ({ ...prev, weekSprint: res.data.weekSprint }));
      }
    } catch (err) {
      console.error('Sprint update failed:', err);
    }
  };

  const handleCoachSend = async (text) => {
    const msg = (text || coachInput).trim();
    if (!msg || coachLoading) return;
    setCoachMessages((prev) => [...prev, { role: 'user', message: msg }]);
    setCoachInput('');
    setCoachLoading(true);
    try {
      const res = await sendCareerTwinChatMessage(msg);
      if (res.data?.reply) {
        setCoachMessages((prev) => [...prev, { role: 'assistant', message: res.data.reply }]);
      }
    } catch (err) {
      setCoachMessages((prev) => [...prev, { role: 'assistant', message: 'Coaching engine is temporarily unavailable. Focus on your top bottleneck for maximum progress.' }]);
    } finally {
      setCoachLoading(false);
    }
  };

  const handleSimulate = async () => {
    setSimLoading(true);
    setSimResult(null);
    try {
      const res = await simulateSkillImprovement(simSkill, simTarget);
      if (res.data?.success) setSimResult(res.data);
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setSimLoading(false);
    }
  };

  const hasData = twin && twin.totalSignals > 0;
  const score = twin?.overallReadinessScore || 0;
  const confidence = twin?.dataConfidence || 'low';
  const signals = twin?.totalSignals || 0;
  const lastUpdated = twin?.lastComputedAt
    ? new Date(twin.lastComputedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Never';

  const priorityColors = {
    CRITICAL: 'bg-rose-100 text-rose-800 border-rose-300',
    HIGH: 'bg-amber-100 text-amber-800 border-amber-300',
    MEDIUM: 'bg-blue-100 text-blue-800 border-blue-300',
    LOW: 'bg-slate-100 text-slate-700 border-slate-300',
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6 animate-pulse">
        <div className="h-48 bg-slate-100 rounded-3xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-slate-100 rounded-2xl"></div>
          <div className="h-64 bg-slate-100 rounded-2xl"></div>
        </div>
        <div className="h-32 bg-slate-100 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">

      {/* ═══════════════════════════════════════════════════════════
          HERO — Identity + Score + CTA
      ════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1220] via-[#111827] to-[#1e1b4b] p-6 sm:p-8 shadow-2xl">
        {/* background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left: Identity */}
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              AI Career Intelligence · Educational Readiness Indicator
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Your Career Twin
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              An AI-powered view of where you are, where you want to go, and what to do next — based on your actual LearnX activity.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {user?.name || 'Student'}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                🎯 {twin?.targetRole || 'Software Engineer'}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                📡 {signals} learning signals
              </div>
            </div>
          </div>

          {/* Right: Score Ring */}
          <div className="flex items-center gap-8 shrink-0">
            <div className="flex flex-col items-center">
              {/* Score circle */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={score >= 70 ? '#6366f1' : score >= 50 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="10"
                    strokeDasharray={`${(score / 100) * 314} 314`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    <AnimatedScore value={score} />
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/ 100</span>
                </div>
              </div>
              <div className="mt-2 text-center">
                <div className="text-xs font-bold text-slate-300">Career Readiness</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Educational indicator only</div>
              </div>
            </div>

            {/* Meta stats */}
            <div className="space-y-3 hidden sm:flex flex-col">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Confidence</div>
                <div className={`text-sm font-bold capitalize mt-0.5 ${confidence === 'high' ? 'text-emerald-400' : confidence === 'moderate' ? 'text-amber-400' : 'text-slate-400'}`}>
                  {confidence}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Last Synced</div>
                <div className="text-xs font-medium text-slate-300 mt-0.5">{lastUpdated}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Fit Score</div>
                <div className="text-sm font-bold text-indigo-400 mt-0.5">{twin?.roleFit?.fitPercent || 0}% for {twin?.targetRole}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action row */}
        <div className="relative flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-white/10">
          <button
            onClick={() => setActiveTab('coach')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Ask My Career Twin
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {refreshing ? (
              <><span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span> Syncing...</>
            ) : (
              <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> Refresh Intelligence</>
            )}
          </button>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {ROLES.map((r) => <option key={r} value={r} className="text-slate-900">{r}</option>)}
            </select>
            <button
              onClick={handleRoleUpdate}
              disabled={roleUpdating}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all disabled:opacity-50"
            >
              {roleUpdating ? 'Updating…' : 'Apply'}
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          NO DATA STATE
      ════════════════════════════════════════════════════════════ */}
      {!hasData && (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Your Career Twin is learning about you</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Complete your first assessment, quiz, or coding challenge to generate personalized career intelligence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button onClick={() => navigate('/test')} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors">
              Take Assessment
            </button>
            <button onClick={() => navigate('/coding-lab')} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition-colors">
              Open Coding Lab
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SECTION TABS
      ════════════════════════════════════════════════════════════ */}
      {hasData && (
        <>
          <div className="flex items-center gap-1 overflow-x-auto pb-1 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'skills', label: 'Skill Intelligence' },
              { id: 'sprint', label: '7-Day Sprint' },
              { id: 'simulator', label: 'Improvement Simulator' },
              { id: 'roleFit', label: 'Role Fit' },
              { id: 'timeline', label: 'Growth Timeline' },
              { id: 'coach', label: 'Ask Career Twin' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ═══════════════════════════════════
              TAB: OVERVIEW
          ════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Row: Next Best Action + Score Explainability */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Next Best Action — HERO FEATURE */}
                <div className="lg:col-span-3 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 rounded-2xl p-6 shadow-xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="relative space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 border border-indigo-500/40 px-3 py-1 rounded-full">
                        NEXT BEST ACTION
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border ${priorityColors[twin?.nextBestAction?.priority || 'HIGH']}`}>
                        {twin?.nextBestAction?.priority || 'HIGH'}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                      {twin?.nextBestAction?.title || 'Complete Your First Assessment'}
                    </h2>

                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">Why This?</div>
                      <ul className="space-y-1.5">
                        {(twin?.nextBestAction?.why || []).map((reason, i) => (
                          <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>⏱ ~{twin?.nextBestAction?.estimatedMinutes || 30} min</span>
                    </div>

                    <button
                      onClick={() => navigate(twin?.nextBestAction?.actionRoute || '/learn')}
                      className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all"
                    >
                      {twin?.nextBestAction?.actionLabel || 'Start Now'}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Score Explainability */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Why {score}?</h3>
                    <button
                      onClick={() => setShowExplain(!showExplain)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      {showExplain ? 'Hide Details' : 'See Explanation'}
                    </button>
                  </div>

                  <div className="text-xs text-slate-500 leading-relaxed">
                    Your readiness score is computed from <strong>{signals}</strong> learning signals across assessment performance, topic mastery, coding activity, and mock interview results.
                  </div>

                  {showExplain && (
                    <div className="space-y-2 pt-2">
                      {(twin?.scoreFactors || []).map((f, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-xs">
                          <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            f.impact === 'positive' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {f.impact === 'positive' ? '+' : '−'}
                          </span>
                          <span className="text-slate-700 flex-1">{f.label}</span>
                          <span className="font-semibold text-slate-900">{f.value}</span>
                        </div>
                      ))}
                      {(twin?.scoreFactors || []).length === 0 && (
                        <p className="text-xs text-slate-400 italic">Complete more assessments to see score breakdown.</p>
                      )}
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 italic">
                      This is an educational readiness indicator. It does not represent a hiring probability or guaranteed placement outcome.
                    </p>
                  </div>
                </div>
              </div>

              {/* Top Bottlenecks */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">What Is Holding You Back?</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Your top skill gaps ranked by educational impact on readiness</p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {(twin?.topBottlenecks || []).length === 0 ? (
                    <div className="px-6 py-8 text-center">
                      <p className="text-sm text-slate-500">No bottlenecks detected yet. Complete more assessments to identify gaps.</p>
                      <button onClick={() => navigate('/test')} className="mt-3 text-xs font-bold text-indigo-600 hover:underline">
                        Take Assessment →
                      </button>
                    </div>
                  ) : (
                    (twin?.topBottlenecks || []).map((b, idx) => (
                      <div key={idx} className="p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-black text-slate-600 shrink-0">
                              {String(b.rank).padStart(2, '0')}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-bold text-slate-900">{b.skill}</h4>
                                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                  {b.score}%
                                </span>
                              </div>
                              {/* Score bar */}
                              <div className="w-full sm:w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                                <div
                                  className="h-full bg-rose-500 rounded-full transition-all duration-700"
                                  style={{ width: `${b.score}%` }}
                                />
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">{b.evidence}</p>
                              <p className="text-xs text-slate-500 italic mt-1">{b.whyItMatters}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(b.actionRoute)}
                            className="shrink-0 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors whitespace-nowrap"
                          >
                            Fix This →
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════
              TAB: SKILL INTELLIGENCE
          ════════════════════════════════════ */}
          {activeTab === 'skills' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Skill Intelligence</h3>
                <p className="text-xs text-slate-500 mt-0.5">Derived from assessment scores, topic mastery, coding activity, and interview performance</p>
              </div>
              <div className="px-6 py-4">
                {Object.entries(SKILL_LABELS).map(([key, label]) => {
                  const score = twin?.skillScores?.[key] || 0;
                  return (
                    <SkillBar
                      key={key}
                      label={label}
                      score={score}
                    />
                  );
                })}
                {Object.values(twin?.skillScores || {}).every((s) => s === 0) && (
                  <div className="py-8 text-center">
                    <p className="text-sm text-slate-500">No skill data detected yet. Complete assessments and quizzes to populate your skill profile.</p>
                  </div>
                )}
              </div>

              <div className="px-6 pb-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                  <strong className="text-slate-700">How are scores calculated?</strong> Your Career Twin aggregates data from: assessment results (subject accuracy), topic quizzes (mastery %), mock interview scores, and coding activity. Scores update automatically as you learn.
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════
              TAB: 7-DAY SPRINT
          ════════════════════════════════════ */}
          {activeTab === 'sprint' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Your 7-Day Career Sprint</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Personalized daily targets based on your weakest areas. Each action connects directly to LearnX features.</p>
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                  >
                    Regenerate Plan
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {(twin?.weekSprint || []).map((item) => (
                    <SprintCard
                      key={item.day}
                      {...item}
                      onStatusChange={(status) => handleSprintStatus(item.day, status)}
                      navigate={navigate}
                    />
                  ))}
                </div>

                {(twin?.weekSprint || []).length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-sm text-slate-500">Your sprint plan will appear after you complete your first assessment.</p>
                    <button onClick={() => navigate('/test')} className="mt-3 text-xs font-bold text-indigo-600 hover:underline">Take Assessment →</button>
                  </div>
                )}
              </div>

              {/* Sprint progress */}
              {(twin?.weekSprint || []).length > 0 && (() => {
                const total = twin.weekSprint.length;
                const completed = twin.weekSprint.filter((s) => s.status === 'completed').length;
                const pct = Math.round((completed / total) * 100);
                return (
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-700 mb-1.5">Sprint Progress</div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="text-lg font-black text-slate-900">{pct}%</div>
                    <div className="text-xs text-slate-500">{completed}/{total} tasks</div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ═══════════════════════════════════
              TAB: IMPROVEMENT SIMULATOR
          ════════════════════════════════════ */}
          {activeTab === 'simulator' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    "If I Improve This…" Simulator
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    See the estimated educational readiness impact of improving a specific skill. This is an educational simulation, not a hiring prediction.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Select Skill</label>
                    <select
                      value={simSkill}
                      onChange={(e) => setSimSkill(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      {Object.entries(SKILL_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v} (Current: {twin?.skillScores?.[k] || 0}%)</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                      Target Score: <span className="text-indigo-600">{simTarget}%</span>
                    </label>
                    <input
                      type="range" min="10" max="100" step="5"
                      value={simTarget}
                      onChange={(e) => setSimTarget(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <button
                    onClick={handleSimulate}
                    disabled={simLoading}
                    className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                  >
                    {simLoading ? (
                      <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span> Simulating...</>
                    ) : 'Simulate Impact'}
                  </button>
                </div>

                {simResult && (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 space-y-5">
                    <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                      Estimated Impact — Educational Readiness Simulation
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
                        <div className="text-[11px] text-slate-500 font-medium mb-1">Current Readiness</div>
                        <div className="text-2xl font-black text-slate-900">{simResult.currentOverall}</div>
                        <div className="text-[10px] text-slate-400">/ 100</div>
                      </div>
                      <div className="bg-indigo-600 rounded-xl p-4 text-center text-white">
                        <div className="text-[11px] text-indigo-200 font-medium mb-1">If You Improve {SKILL_LABELS[simResult.skill]}</div>
                        <div className="text-2xl font-black">+{simResult.delta}</div>
                        <div className="text-[10px] text-indigo-300">points estimated</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
                        <div className="text-[11px] text-slate-500 font-medium mb-1">Projected Readiness</div>
                        <div className="text-2xl font-black text-emerald-600">{simResult.simulatedOverall}</div>
                        <div className="text-[10px] text-slate-400">/ 100</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                        <div className="text-slate-500 mb-1">Skill Change</div>
                        <div className="font-bold text-slate-900">
                          {simResult.fromScore}% → {simResult.toScore}%
                        </div>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                        <div className="text-slate-500 mb-1">Role Fit Change</div>
                        <div className="font-bold text-slate-900">
                          {simResult.currentFit}% → {simResult.simulatedFit}%
                          {simResult.fitDelta > 0 && <span className="text-emerald-600 ml-1">(+{simResult.fitDelta}%)</span>}
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 italic">{simResult.disclaimer}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════
              TAB: ROLE FIT
          ════════════════════════════════════ */}
          {activeTab === 'roleFit' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Career Role Fit Analysis</div>
                      <h3 className="text-xl font-black text-slate-900 mt-1">
                        {twin?.roleFit?.targetRole || twin?.targetRole || 'Software Engineer'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Educational fit indicator based on your skill profile. Not a hiring prediction.</p>
                    </div>
                    <div className="text-center shrink-0">
                      <div className="text-4xl font-black text-indigo-600">{twin?.roleFit?.fitPercent || 0}%</div>
                      <div className="text-xs text-slate-500 font-medium">Current Fit</div>
                    </div>
                  </div>

                  <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                      style={{ width: `${twin?.roleFit?.fitPercent || 0}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                  <div className="p-6 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Your Strong Areas
                    </h4>
                    {(twin?.roleFit?.strongAreas || []).length > 0 ? (
                      <ul className="space-y-2">
                        {twin.roleFit.strongAreas.map((area, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                            {area}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Complete more assessments to identify your strong areas.</p>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Needs Work
                    </h4>
                    {(twin?.roleFit?.missingAreas || []).length > 0 ? (
                      <ul className="space-y-2">
                        {twin.roleFit.missingAreas.map((area, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                            {area}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Keep learning — more data needed.</p>
                    )}
                  </div>
                </div>

                {(twin?.roleFit?.gapActions || []).length > 0 && (
                  <div className="p-6 border-t border-slate-100 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Recommended Gap Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      {twin.roleFit.gapActions.map((action, i) => (
                        <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {action}
                        </span>
                      ))}
                    </div>
                    <button onClick={() => navigate('/roadmap')} className="text-xs font-bold text-indigo-600 hover:underline">
                      View Roadmap to Close Gaps →
                    </button>
                  </div>
                )}
              </div>

              {/* Role picker */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Explore Another Role</h4>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      onClick={async () => {
                        setSelectedRole(r);
                        setRoleUpdating(true);
                        try {
                          const res = await updateCareerTwinRole(r);
                          if (res.data?.careerTwin) setTwin(res.data.careerTwin);
                        } catch (_) {}
                        setRoleUpdating(false);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedRole === r
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-700'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {roleUpdating && <p className="text-xs text-indigo-600">Recomputing for new role…</p>}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════
              TAB: GROWTH TIMELINE
          ════════════════════════════════════ */}
          {activeTab === 'timeline' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Career Growth Timeline</h3>
                <p className="text-xs text-slate-500 mt-0.5">A chronological record of your significant learning events and their impact on your profile</p>
              </div>

              {(twin?.timeline || []).length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <p className="text-sm text-slate-500">Your timeline will populate as you complete assessments, quizzes, and mock interviews.</p>
                </div>
              ) : (
                <div className="px-6 py-6">
                  <div className="relative">
                    <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-slate-100"></div>
                    <div className="space-y-6">
                      {(twin.timeline || []).map((item, idx) => {
                        const typeColors = {
                          assessment: 'bg-blue-100 text-blue-700',
                          learning: 'bg-emerald-100 text-emerald-700',
                          coding: 'bg-violet-100 text-violet-700',
                          interview: 'bg-amber-100 text-amber-700',
                          achievement: 'bg-indigo-100 text-indigo-700',
                          general: 'bg-slate-100 text-slate-700',
                        };
                        const typeIcons = {
                          assessment: '📊', learning: '📚', coding: '💻',
                          interview: '🎤', achievement: '🏆', general: '📌',
                        };

                        return (
                          <div key={idx} className="flex items-start gap-5 pl-8 relative">
                            <div className={`absolute left-0 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${typeColors[item.type] || 'bg-slate-100 text-slate-600'}`}>
                              {typeIcons[item.type] || '📌'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-semibold text-slate-800">{item.event}</span>
                                <span className="text-[10px] text-slate-400">
                                  {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                                </span>
                              </div>
                              {item.impact && (
                                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                  <span className="text-indigo-400">↳</span> {item.impact}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════
              TAB: ASK MY CAREER TWIN (Coach)
          ════════════════════════════════════ */}
          {activeTab === 'coach' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[640px]">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-sm shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Ask My Career Twin</h3>
                  <p className="text-xs text-slate-500">Answers based exclusively on your LearnX data — not a generic chatbot</p>
                </div>
              </div>

              {/* Quick prompts */}
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
                {[
                  "Why am I weak in DSA?",
                  "What should I study today?",
                  "Am I ready for a technical interview?",
                  "What should I improve first?",
                  "Why did my score change?",
                ].map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => handleCoachSend(chip)}
                    className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-medium transition-colors shrink-0"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
                {coachMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                    <div className="text-2xl">🤖</div>
                    <p className="text-sm font-semibold text-slate-700">Your AI Career Coach is ready</p>
                    <p className="text-xs text-slate-400 max-w-xs">Ask anything about your learning profile, skill gaps, or what to focus on next.</p>
                  </div>
                )}
                {coachMessages.map((m, i) => {
                  const isAssistant = m.role === 'assistant';
                  return (
                    <div key={i} className={`flex gap-3 ${isAssistant ? 'max-w-2xl mr-auto' : 'max-w-xl ml-auto flex-row-reverse'}`}>
                      <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                        isAssistant ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {isAssistant ? '🤖' : 'You'}
                      </div>
                      <div className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isAssistant
                          ? 'bg-white border border-slate-200 text-slate-800 shadow-xs'
                          : 'bg-indigo-600 text-white'
                      }`}>
                        {m.message}
                      </div>
                    </div>
                  );
                })}
                {coachLoading && (
                  <div className="flex gap-3 max-w-2xl mr-auto">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs">🤖</div>
                    <div className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border-2 border-indigo-300 border-t-indigo-600 animate-spin"></span>
                      Analyzing your profile…
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => { e.preventDefault(); handleCoachSend(); }}
                className="p-4 border-t border-slate-100 bg-white flex items-center gap-3"
              >
                <input
                  type="text"
                  value={coachInput}
                  onChange={(e) => setCoachInput(e.target.value)}
                  placeholder="Ask about your career profile, skills, or what to do next…"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={coachLoading || !coachInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                >
                  Send
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            </div>
          )}

          {/* ═══════════════════════════════════
              PRIVACY TRANSPARENCY FOOTER
          ════════════════════════════════════ */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex items-start gap-3">
            <svg className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-700">Privacy & Transparency:</strong> Your Career Twin is generated exclusively from your LearnX learning activity — assessment results, topic quiz scores, topic progress, and mock interview data. No external data is used. All readiness scores are <em>educational readiness indicators</em> and do not represent a hiring probability, guaranteed placement, or guaranteed interview success. You can delete your data at any time from <button onClick={() => navigate('/security')} className="text-indigo-600 hover:underline">Security Settings</button>.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
