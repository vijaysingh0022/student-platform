import LearningRewardsIllustration from "../components/rewards/LearningRewardsIllustration.jsx";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getRewardsOverview,
  updateRewardSettings,
} from "../services/api.js";
import BadgeDetailModal from "../components/rewards/BadgeDetailModal.jsx";
import RewardHistoryModal from "../components/rewards/RewardHistoryModal.jsx";
import ChallengesModal from "../components/rewards/ChallengesModal.jsx";

// ─── Compact progress bar ──────────────────────────────────────────────────────
const ProgressBar = ({ pct, colorClass = "bg-blue-600", heightClass = "h-2", className = "" }) => (
  <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClass} ${className}`}>
    <div
      className={`${colorClass} ${heightClass} rounded-full transition-all duration-700`}
      style={{ width: `${Math.min(100, pct)}%` }}
    />
  </div>
);

// ─── Section heading ──────────────────────────────────────────────────────────
const SectionTitle = ({ icon, title, sub }) => (
  <div className="flex items-center gap-2.5 mb-4">
    <span className="text-lg">{icon}</span>
    <div>
      <h2 className="text-sm font-black text-slate-900 leading-tight">{title}</h2>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Card wrapper ──────────────────────────────────────────────────────────────
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm ${className}`}>
    {children}
  </div>
);

// ─── Career stage dot ─────────────────────────────────────────────────────────
const careerColorMap = {
  emerald: { ring: "ring-emerald-400", bg: "bg-emerald-500", text: "text-emerald-700", light: "bg-emerald-50", border: "border-emerald-200" },
  blue:    { ring: "ring-blue-400",    bg: "bg-blue-500",    text: "text-blue-700",    light: "bg-blue-50",    border: "border-blue-200" },
  indigo:  { ring: "ring-indigo-400",  bg: "bg-indigo-500",  text: "text-indigo-700",  light: "bg-indigo-50",  border: "border-indigo-200" },
  violet:  { ring: "ring-violet-400",  bg: "bg-violet-500",  text: "text-violet-700",  light: "bg-violet-50",  border: "border-violet-200" },
  amber:   { ring: "ring-amber-400",   bg: "bg-amber-500",   text: "text-amber-700",   light: "bg-amber-50",   border: "border-amber-200" },
};

// ─── Main Component ───────────────────────────────────────────────────────────
const RewardsPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isChallengesModalOpen, setIsChallengesModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const badgeScrollRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 4000); };

  const fetchOverview = async () => {
    try {
      const res = await getRewardsOverview();
      if (res.data?.success) setData(res.data.data);
    } catch (err) {
      console.error("Error fetching rewards overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOverview(); }, []);

  const handleToggleSetting = async (key) => {
    if (!data?.settings) return;
    const updated = { ...data.settings, [key]: !data.settings[key] };
    setData((prev) => ({ ...prev, settings: updated }));
    try {
      await updateRewardSettings(updated);
      showToast(`Preference updated.`);
    } catch (e) { console.warn("Could not save setting:", e); }
  };

  const scrollBadges = (dir) => {
    if (badgeScrollRef.current) badgeScrollRef.current.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-600">
            <span className="inline-block animate-spin">⚙️</span>
            Loading your learning progress...
          </div>
        </div>
      </div>
    );
  }

  const hero         = data?.hero || {};
  const challenges   = data?.challenges || [];
  const badges       = data?.badges || [];
  const nextReward   = data?.nextReward || {};
  const aiNextReward = data?.aiNextReward || {};
  const skillMastery = data?.skillMastery || [];
  const topicMilestones   = data?.topicMilestones || [];
  const careerStages      = data?.careerStages || [];
  const currentCareerStage = data?.currentCareerStage ?? 0;
  const placementPack     = data?.placementPack || {};
  const unlockedBenefits  = data?.unlockedBenefits || [];
  const recentRewards     = data?.recentRewards || [];
  const weeklyGoal        = data?.weeklyGoal || {};
  const settings          = data?.settings || {};

  return (
    <div className="w-full pb-16 space-y-7 font-sans text-slate-900">

      {/* ══════════════════════════════════════════════════════════════
          1. HERO — Learning Rewards Header (Matches Reference Image)
         ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Hero Card with Dark Purple Gradient & 3D Trophy Illustration (7 Cols) */}
        <div className="lg:col-span-7 relative rounded-[28px] overflow-hidden bg-gradient-to-r from-[#0d1224] via-[#1a1744] to-[#26103d] p-6 sm:p-7 text-white shadow-xl border border-indigo-950/40 flex flex-col justify-between min-h-[200px]">
          {/* Ambient glow */}
          <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 h-full">
            <div className="space-y-3 max-w-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-widest">
                <span>🎁</span>
                <span>LEARNX REWARDS</span>
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                Learning Rewards
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Turn your learning progress into real academic and career benefits. Every reward you earn unlocks a useful learning resource.
              </p>
            </div>

            {/* 3D Isometric Trophy Illustration on Right of Banner */}
            <div className="shrink-0 flex items-center justify-center">
              <LearningRewardsIllustration />
            </div>
          </div>
        </div>

        {/* Right — Level & XP Card (5 Cols) */}
        <Card className="lg:col-span-5 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 text-sm font-black shadow-xs">
                  L{hero.level || 8}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900">Level {hero.level || 8}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {hero.levelTitle || "Skill Builder"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-semibold">{hero.xpToNext || 260} XP to next level</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-black text-slate-900">{(hero.totalXP || 1240).toLocaleString()} XP</div>
                <div className="text-[10px] text-slate-400 font-semibold">Total XP earned</div>
              </div>
            </div>

            <ProgressBar pct={hero.progressPercent || 83} colorClass="bg-gradient-to-r from-indigo-600 to-purple-600" />

            <div className="grid grid-cols-5 gap-2 pt-1 border-t border-slate-100">
              {[
                { icon: "🔥", val: hero.dayStreak || 7,              label: "Day Streak" },
                { icon: "📚", val: hero.topicsCompleted || 0,        label: "Topics Done" },
                { icon: "🏅", val: hero.badgesCount || 0,            label: "Badges" },
                { icon: "📈", val: hero.skillsImproved || 0,         label: "Skills ≥75%" },
                { icon: "🎁", val: hero.benefitsUnlocked || 0,       label: "Benefits" },
              ].map((s, i) => (
                <div key={i} className="p-2 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-xs font-black text-slate-900">{s.icon} {s.val}</div>
                  <div className="text-[9px] text-slate-500 font-semibold mt-0.5 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. YOUR NEXT BEST REWARD (Matches Reference Image)
         ══════════════════════════════════════════════════════════════ */}
      <Card className="p-6 sm:p-7 border-indigo-100/90 relative overflow-hidden bg-white shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: AI Recommendation */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center text-sm font-black">🎯</span>
              <div>
                <h2 className="text-xs font-black text-purple-900 uppercase tracking-wide">YOUR NEXT BEST REWARD</h2>
                <p className="text-[11px] text-slate-400 font-medium">Based on your actual performance data</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                Improve your DBMS accuracy to unlock the Mastery Pack.
              </h3>

              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-bold text-slate-700">
                  DBMS: 62% → 75%
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100">
                  Weak Area
                </span>
              </div>

              {/* Progress Bar with Right Percent */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <ProgressBar
                    pct={62}
                    colorClass="bg-gradient-to-r from-orange-400 to-amber-500"
                    heightClass="h-2"
                  />
                </div>
                <span className="text-xs font-black text-slate-900">62%</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/learn/DBMS")}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Improve Now</span>
              <span>→</span>
            </button>
          </div>

          {/* Right Column: DBMS Mastery Pack Preview Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-slate-50/50 rounded-2xl border border-indigo-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-2.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">📚</span>
                <div>
                  <h4 className="text-xs font-black text-slate-900">DBMS Mastery Pack</h4>
                  <p className="text-[10px] text-slate-500">Unlocks when you hit target accuracy (75%)</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                {[
                  "Quick Revision Notes",
                  "Important PYQs",
                  "30 Practice Questions",
                  "AI Revision Challenge",
                  "Advanced Questions",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span className="font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D Isometric DBMS Book SVG */}
            <div className="shrink-0 w-28 h-32 flex items-center justify-center">
              <svg viewBox="0 0 120 140" fill="none" className="w-full h-full drop-shadow-md">
                <path d="M20 30 L85 10 L105 25 L40 45 Z" fill="#6366f1" />
                <path d="M20 30 L40 45 L40 120 L20 105 Z" fill="#4338ca" />
                <path d="M40 45 L105 25 L105 100 L40 120 Z" fill="#4f46e5" />
                {/* Book Pages Layer */}
                <path d="M23 105 L38 117 L100 98 L85 86 Z" fill="#e2e8f0" />
                {/* Database Icon on Book Cover */}
                <g transform="translate(62, 50)">
                  <ellipse cx="12" cy="6" rx="10" ry="4" fill="#a5b4fc" />
                  <path d="M2 6 L2 14 C2 16, 22 16, 22 14 L22 6" fill="#818cf8" stroke="#a5b4fc" strokeWidth="0.8" />
                  <path d="M2 14 L2 22 C2 24, 22 24, 22 22 L2 14" fill="#6366f1" stroke="#a5b4fc" strokeWidth="0.8" />
                  <text x="12" y="-4" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">DBMS</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </Card>

      {/* ══════════════════════════════════════════════════════════════
          3. TODAY'S CHALLENGES + NEXT BADGE REWARD (Matches Reference Image)
         ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Today's Personalized Challenges (8 Cols) */}
        <Card className="lg:col-span-8 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-base text-purple-600">🎯</span>
                <div>
                  <h3 className="text-xs font-black text-slate-900 tracking-tight">Today's Personalized Challenges</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Improve your weak areas to unlock rewards</p>
                </div>
              </div>
              <button onClick={() => setIsChallengesModalOpen(true)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 shrink-0">
                View All →
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  icon: "🗄️",
                  iconBg: "bg-indigo-50 text-indigo-600 border border-indigo-100",
                  title: "DBMS — Practice key concepts",
                  desc: "Focus on normalization and SQL queries",
                  xp: "+50 XP",
                  actionRoute: "/learn/DBMS",
                },
                {
                  icon: "</>",
                  iconBg: "bg-purple-50 text-purple-600 border border-purple-100",
                  title: "DSA — Solve 3 medium problems",
                  desc: "Arrays, Strings or Hashing",
                  xp: "+75 XP",
                  actionRoute: "/coding-lab",
                },
                {
                  icon: "💡",
                  iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
                  title: "Revise — Watch a short concept video",
                  desc: "Recommended based on your weak topics",
                  xp: "+25 XP",
                  actionRoute: "/learn",
                },
              ].map((ch, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${ch.iconBg}`}>
                      {ch.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900">{ch.title}</h4>
                      <p className="text-[11px] text-slate-500 font-normal truncate mt-0.5">{ch.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                      🏆 {ch.xp}
                    </span>
                    <button
                      onClick={() => navigate(ch.actionRoute)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                    >
                      <span>Start</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Next Badge Reward (4 Cols) */}
        <Card className="lg:col-span-4 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-base text-amber-500">🏅</span>
              <div>
                <h3 className="text-xs font-black text-slate-900 tracking-tight">Next Badge Reward</h3>
                <p className="text-[10px] text-slate-400 font-medium">Your closest badge to unlock</p>
              </div>
            </div>

            {/* Badge Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-slate-50/50 border border-amber-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-amber-200 flex items-center justify-center text-2xl shadow-xs shrink-0">
                  🌳
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">DSA Explorer</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Complete 5 DSA topics with ≥75% accuracy
                  </p>
                </div>
              </div>

              <ProgressBar
                pct={60}
                colorClass="bg-indigo-600"
                className="bg-slate-200"
              />

              <div className="flex justify-between text-[11px] font-bold text-slate-600">
                <span>Progress</span>
                <span>3 / 5</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/learn/DSA")}
            className="w-full mt-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <span>Continue Learning</span>
            <span>→</span>
          </button>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          4. SKILL MASTERY — subject-wise progress
         ══════════════════════════════════════════════════════════════ */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <SectionTitle icon="📊" title="Skill Mastery Progress" sub="Your accuracy per subject and what each milestone unlocks" />
          <button onClick={() => navigate("/learn")} className="text-xs font-bold text-blue-600 hover:text-blue-800">Study Now →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {skillMastery.map((sk) => {
            const nextPct = Math.round((sk.accuracy / sk.nextMilestone) * 100);
            return (
              <div key={sk.subjectId}
                className={`p-4 rounded-2xl border transition-all hover:shadow-md cursor-pointer ${sk.isWeak ? "border-rose-200 bg-rose-50/50" : "border-slate-200 bg-slate-50/50"}`}
                onClick={() => navigate(sk.masteryRoute)}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{sk.icon}</span>
                    <span className="text-xs font-black text-slate-900">{sk.label}</span>
                  </div>
                  {sk.isWeak && <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full">Weak</span>}
                </div>

                {/* Accuracy badge */}
                <div className={`text-xl font-black mb-1 ${sk.accuracy >= 80 ? "text-emerald-600" : sk.accuracy >= 65 ? "text-amber-600" : "text-rose-600"}`}>
                  {sk.accuracy}%
                </div>
                <div className="text-[10px] text-slate-500 mb-2">Current accuracy</div>

                <ProgressBar
                  pct={nextPct}
                  colorClass={sk.accuracy >= 80 ? "bg-emerald-500" : sk.accuracy >= 65 ? "bg-amber-500" : "bg-rose-500"}
                  heightClass="h-1.5"
                />
                <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-semibold">
                  <span>{sk.accuracy}%</span>
                  <span>Target {sk.nextMilestone}%</span>
                </div>

                <div className="mt-2.5 p-2 rounded-xl bg-white border border-slate-100 text-[10px] text-slate-600">
                  <span className="font-black text-slate-700">🎁 Reach {sk.nextMilestone}%: </span>
                  {sk.masteryReward}
                </div>

                {sk.weakConcept && (
                  <div className="mt-1.5 text-[10px] text-rose-600 font-semibold truncate">
                    ⚠️ Weak: {sk.weakConcept}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* ══════════════════════════════════════════════════════════════
          5. TOPIC MILESTONES + CAREER MILESTONES
         ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Topic Milestones */}
        <Card className="p-6">
          <SectionTitle icon="🎯" title="Topic Milestones" sub="Complete topics to unlock learning resources" />
          <div className="space-y-3">
            {topicMilestones.map((m, i) => (
              <div key={i}
                className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${m.completed ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200 bg-slate-50/50"}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 ${m.completed ? "bg-emerald-100" : "bg-white border border-slate-200"}`}>
                  {m.completed ? "✅" : m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-900">{m.topics} Topics → {m.reward}</span>
                    {m.completed && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">Unlocked</span>}
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{m.description}</p>
                  {!m.completed && (
                    <>
                      <ProgressBar pct={m.progress} colorClass="bg-blue-500" heightClass="h-1.5" className="mt-1.5" />
                      <div className="text-[10px] text-slate-500 mt-0.5">{m.current} / {m.topics} topics</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Career Milestones */}
        <Card className="p-6">
          <SectionTitle icon="💼" title="Career Progress" sub="Your learning-to-career readiness pathway" />
          <div className="relative">
            {/* Vertical connector */}
            <div className="absolute left-5 top-5 bottom-5 w-px bg-slate-200 z-0" />

            <div className="space-y-3 relative z-10">
              {careerStages.map((stage, i) => {
                const colors = careerColorMap[stage.color] || careerColorMap.blue;
                const isActive = i === currentCareerStage;
                const isDone = i < currentCareerStage || stage.req;
                return (
                  <div key={stage.id} className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base shrink-0 border-2 transition-all ${
                      isDone ? `${colors.bg} text-white border-transparent ring-2 ${colors.ring}` :
                      isActive ? `bg-white ${colors.text} ${colors.border}` : "bg-white border-slate-200 text-slate-400"
                    }`}>
                      {isDone ? "✓" : stage.icon}
                    </div>
                    <div className={`flex-1 p-3 rounded-2xl border transition-all ${isDone ? `${colors.light} ${colors.border}` : "bg-white border-slate-100"}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-black ${isDone ? colors.text : "text-slate-500"}`}>{stage.label}</span>
                        {isDone && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${colors.light} ${colors.text}`}>✓ Done</span>}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Placement Pack */}
          <div className={`mt-4 p-4 rounded-2xl border ${placementPack.unlocked ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">💼</span>
              <h4 className={`text-xs font-black ${placementPack.unlocked ? "text-amber-800" : "text-slate-700"}`}>
                Placement Preparation Pack
              </h4>
              {placementPack.unlocked
                ? <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Unlocked</span>
                : <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">Locked</span>}
            </div>
            <div className="grid grid-cols-1 gap-1 text-[10px]">
              {(placementPack.requirements || []).map((req, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className={req.met ? "text-emerald-500 font-bold" : "text-slate-300 font-bold"}>{req.met ? "✓" : "○"}</span>
                  <span className={req.met ? "text-slate-700 font-semibold" : "text-slate-400"}>{req.label}</span>
                </div>
              ))}
            </div>
            {placementPack.unlocked && (
              <button onClick={() => navigate("/mock-interview")}
                className="mt-2.5 w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all">
                Access Pack →
              </button>
            )}
          </div>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          6. ACHIEVEMENT BADGES
         ══════════════════════════════════════════════════════════════ */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle icon="🏅" title="Skill Achievement Badges" sub="Each badge unlocks a real learning benefit" />
          <div className="flex gap-2 shrink-0">
            <button onClick={() => scrollBadges("left")}
              className="w-7 h-7 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-50">‹</button>
            <button onClick={() => scrollBadges("right")}
              className="w-7 h-7 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-50">›</button>
          </div>
        </div>
        <div ref={badgeScrollRef} className="flex items-stretch gap-3 overflow-x-auto pb-2 scroll-smooth no-scrollbar">
          {badges.map((b) => {
            const defMeta = /* find unlock text */ null;
            const pct = Math.min(100, Math.round(((b.currentProgress || 0) / (b.targetProgress || 1)) * 100));
            return (
              <div key={b._id || b.badgeId}
                onClick={() => { setSelectedBadge(b); setIsBadgeModalOpen(true); }}
                className="min-w-[148px] w-[148px] p-3.5 rounded-2xl border bg-slate-50/60 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col gap-2 group">
                <div className="w-11 h-11 mx-auto rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                  {b.icon}
                </div>
                <div className="text-center">
                  <h4 className="text-[11px] font-black text-slate-900 leading-tight">{b.name}</h4>
                  <p className="text-[9px] text-slate-500 leading-tight mt-0.5 line-clamp-2">{b.description}</p>
                </div>

                {b.isUnlocked ? (
                  <span className="text-center inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    ✓ Unlocked
                  </span>
                ) : (
                  <div className="space-y-1">
                    <ProgressBar pct={pct} heightClass="h-1" colorClass="bg-blue-500" />
                    <div className="flex justify-between text-[9px] font-bold text-slate-400">
                      <span>{b.currentProgress}</span>
                      <span>{b.targetProgress}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* ══════════════════════════════════════════════════════════════
          7. UNLOCKED BENEFITS + XP HISTORY (side-by-side)
         ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Unlocked Benefits */}
        <Card className="p-6">
          <SectionTitle icon="🎁" title="Your Unlocked Benefits" sub="Resources you've earned — click to use them" />
          <div className="space-y-2.5">
            {unlockedBenefits.slice(0, 5).map((b) => (
              <div key={b.id} className="p-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/40 hover:bg-white hover:border-emerald-300 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="text-lg shrink-0">{b.icon}</span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-900">{b.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">{b.why}</p>
                    </div>
                  </div>
                  <button onClick={() => navigate(b.actionRoute)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold transition-all shrink-0">
                    Use →
                  </button>
                </div>
              </div>
            ))}
            {unlockedBenefits.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-sm">Complete topics and challenges to unlock learning benefits.</div>
            )}
          </div>
        </Card>

        {/* Learning Streak + XP Activity */}
        <Card className="p-6 space-y-5">
          {/* Streak */}
          <div>
            <SectionTitle icon="🔥" title="Learning Streak" sub="Only meaningful learning counts — not just logins" />
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Current Streak", val: `${hero.dayStreak || 7} days`, color: "text-orange-600" },
                { label: "Longest Streak", val: `${data?.hero?.longestStreak || 12} days`, color: "text-blue-600" },
                { label: "XP This Week",   val: `+${hero.xpThisWeek || 180}`, color: "text-emerald-600" },
              ].map((s, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <div className={`text-sm font-black ${s.color}`}>{s.val}</div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-2xl bg-blue-50/50 border border-blue-100 text-[11px] text-blue-800">
              <span className="font-bold">Streak activities that count: </span>
              Topic completed · Questions solved · Assessment done · AI Tutor session · Roadmap progress
            </div>
          </div>

          {/* XP Activity */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black text-slate-900">Recent XP Activity</h3>
              <button onClick={() => setIsHistoryModalOpen(true)} className="text-xs font-bold text-blue-600 hover:text-blue-800">View All →</button>
            </div>
            <div className="space-y-2">
              {recentRewards.map((rw) => (
                <div key={rw.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="flex items-center gap-2 min-w-0">
                    <span>{rw.icon}</span>
                    {rw.amount > 0 && <span className="font-black text-emerald-600 shrink-0">+{rw.amount} XP</span>}
                    <span className="font-semibold text-slate-700 truncate">{rw.description}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">{rw.timeAgo}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          8. WEEKLY GOAL + XP TABLE + SETTINGS
         ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Weekly goal */}
        <Card className="p-5 flex flex-col justify-between gap-4">
          <div>
            <SectionTitle icon="📅" title="Weekly Learning Goal" />
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>XP Progress</span>
                <span>{weeklyGoal.currentXP || 180} / {weeklyGoal.targetXP || 300} XP</span>
              </div>
              <ProgressBar pct={Math.round(((weeklyGoal.currentXP || 180) / (weeklyGoal.targetXP || 300)) * 100)} colorClass="bg-blue-600" />
              <div className="text-[10px] text-slate-400 font-semibold text-right">{weeklyGoal.daysLeft ?? 3} days remaining</div>
            </div>
            <div className="mt-3 space-y-1.5">
              {(weeklyGoal.tasks || []).map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className={t.completed ? "text-emerald-500 font-bold" : "text-slate-300"}>
                    {t.completed ? "✓" : "○"}
                  </span>
                  <span className={t.completed ? "line-through text-slate-400" : "text-slate-600 font-medium"}>{t.title}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => navigate("/learn")} className="text-[11px] font-bold text-blue-600 hover:text-blue-800 text-left">
            View Recommended Activities →
          </button>
        </Card>

        {/* XP Value table */}
        <Card className="p-5">
          <SectionTitle icon="⚡" title="How You Earn XP" sub="XP rewards real learning — not clicks" />
          <div className="space-y-1.5">
            {[
              { action: "Topic Completed",         xp: "+20 XP" },
              { action: "Questions Solved",         xp: "+30 XP" },
              { action: "Weak Area Improved",       xp: "+75 XP" },
              { action: "Unit Completed",           xp: "+100 XP" },
              { action: "Assessment Completed",     xp: "+150 XP" },
              { action: "Mock Interview Completed", xp: "+60 XP" },
              { action: "7-Day Streak Maintained",  xp: "+100 XP" },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                <span className="text-slate-600 font-medium">{row.action}</span>
                <span className="font-black text-emerald-600">{row.xp}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Settings */}
        <Card className="p-5 flex flex-col justify-between gap-4">
          <div>
            <SectionTitle icon="⚙️" title="Reward Preferences" />
            <div className="space-y-2.5">
              {[
                { key: "showNotifications",     label: "Show Notifications",     icon: "🔔" },
                { key: "playSound",             label: "Play Sound",             icon: "🔊" },
                { key: "motivationalReminders", label: "Motivational Reminders", icon: "💡" },
                { key: "weeklyGoalReminders",   label: "Weekly Goal Reminders",  icon: "🎯" },
              ].map((s) => (
                <div key={s.key} className="flex items-center justify-between text-xs text-slate-700">
                  <span className="font-semibold flex items-center gap-1.5">
                    <span>{s.icon}</span>{s.label}
                  </span>
                  <button
                    onClick={() => handleToggleSetting(s.key)}
                    className={`w-8 h-4.5 rounded-full p-0.5 transition-colors flex items-center ${settings[s.key] ? "bg-blue-600" : "bg-slate-300"}`}
                    style={{ height: "18px" }}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${settings[s.key] ? "translate-x-3.5" : "translate-x-0"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-[11px] text-blue-900 leading-snug">
            <span className="font-bold">Remember:</span> Every reward is a learning resource — not a decoration.
          </div>
        </Card>
      </div>

      {/* ── MODALS ── */}
            {/* ══════════════════════════════════════════════════════════════
          6. REWARDS & BENEFITS BOTTOM NAVIGATION STRIP (Matches Reference)
         ══════════════════════════════════════════════════════════════ */}
      <Card className="p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center text-xl shrink-0">
            🎁
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 tracking-tight">Rewards & Benefits</h3>
            <p className="text-[10px] text-slate-400 font-medium">Unlock valuable resources as you learn and grow.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full md:w-auto">
          {[
            { label: "Revision Notes", icon: "📄", route: "/resources" },
            { label: "Practice Sets", icon: "</>", route: "/coding-lab" },
            { label: "Video Lessons", icon: "▶", route: "/learn" },
            { label: "Mastery Packs", icon: "⭐", route: "/test" },
            { label: "Skill Badges", icon: "👑", route: "/achievements" },
            { label: "XP & Level Progress", icon: "📊", route: "/skill-analytics" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.route)}
              className="px-3 py-2 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition text-center flex flex-col items-center justify-center gap-1 group cursor-pointer"
            >
              <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">{item.icon}</span>
              <span className="text-[10px] font-bold text-slate-700 group-hover:text-indigo-600 truncate max-w-[90px]">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </Card>

<BadgeDetailModal isOpen={isBadgeModalOpen} onClose={() => setIsBadgeModalOpen(false)} badge={selectedBadge} />
      <RewardHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} />
      <ChallengesModal isOpen={isChallengesModalOpen} onClose={() => setIsChallengesModalOpen(false)} challenges={challenges} />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-3 rounded-2xl bg-slate-950/95 text-white text-xs font-bold shadow-2xl border border-slate-700 flex items-center gap-2 backdrop-blur-md">
          <span>✨</span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};

export default RewardsPage;
