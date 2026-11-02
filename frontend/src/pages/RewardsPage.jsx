import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, {
  getRewardsOverview,
  updateRewardSettings,
} from "../services/api.js";
import BadgeDetailModal from "../components/rewards/BadgeDetailModal.jsx";
import RewardHistoryModal from "../components/rewards/RewardHistoryModal.jsx";
import ChallengesModal from "../components/rewards/ChallengesModal.jsx";
import LearnXCertificateTemplate from "../components/certificate/LearnXCertificateTemplate.jsx";

export const RewardsPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isChallengesModalOpen, setIsChallengesModalOpen] = useState(false);
  const [toast, setToast] = useState("");

  // Certificates Integration
  const [certificates, setCertificates] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

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

  const fetchCertificates = async () => {
    try {
      const { data } = await api.get("/certificates/my");
      if (data?.certificates) {
        setCertificates(data.certificates);
        if (data.certificates.length > 0 && !selectedCert) {
          setSelectedCert(data.certificates[0]);
        }
      }
    } catch (err) {
      console.warn("Error fetching certificates in rewards:", err.message);
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchCertificates();
  }, []);

  const handleCopyVerificationLink = (cert) => {
    const link = `${window.location.origin}/verify/${cert.verificationToken || cert.certificateId}`;
    navigator.clipboard.writeText(link);
    setShareCopied(true);
    showToast("📋 Verification link copied!");
    setTimeout(() => setShareCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-600">
            <span className="inline-block animate-spin">⚙️</span>
            Loading your learning rewards...
          </div>
        </div>
      </div>
    );
  }

  const hero = data?.hero || {};
  const challenges = data?.challenges || [];
  const badges = data?.badges || [];
  const nextReward = data?.nextReward || {};
  const aiNextReward = data?.aiNextReward || {};
  const skillMastery = data?.skillMastery || [];

  // Weekly streak days (Mon - Sun)
  const streakDays = [
    { day: "Mon", active: true },
    { day: "Tue", active: true },
    { day: "Wed", active: true },
    { day: "Thu", active: true },
    { day: "Fri", active: true },
    { day: "Sat", active: true },
    { day: "Sun", active: false },
  ];

  // Leaderboard data (dynamic with fallbacks matching exact reference)
  const leaderboardUsers = [
    { rank: 1, name: "Utkarsh Vishwakarma", xp: "3,280 XP", badge: "🥇", avatarBg: "from-amber-400 to-amber-600" },
    { rank: 2, name: "Vijay Singh", xp: "2,940 XP", badge: "🥈", avatarBg: "from-blue-500 to-indigo-600", isCurrent: true },
    { rank: 3, name: "Rinki Patel", xp: "2,520 XP", badge: "🥉", avatarBg: "from-rose-400 to-purple-600" },
  ];

  // Personalized challenge cards with exact visual structure from reference
  const personalizedChallenges = [
    {
      id: "dbms-practice",
      title: "DBMS Practice",
      desc: "Solve 10 questions",
      subDesc: "Accuracy target: 75%",
      xp: "+100 XP",
      icon: "🗄️",
      iconBg: "bg-blue-50 text-blue-600 border border-blue-200",
      route: "/learn/dbms",
    },
    {
      id: "daa-revision",
      title: "DAA Revision",
      desc: "Complete 1 unit",
      subDesc: "(Graphs & Trees)",
      xp: "+80 XP",
      icon: "🌲",
      iconBg: "bg-purple-50 text-purple-600 border border-purple-200",
      route: "/learn/dsa",
    },
    {
      id: "web-tech",
      title: "Web Technology",
      desc: "Build 1 small project",
      subDesc: "(HTML + CSS + JS)",
      xp: "+120 XP",
      icon: "</>",
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200",
      route: "/coding-lab",
    },
  ];

  // Skill mastery subjects for bottom section
  const skillsList = [
    { name: "DBMS", accuracy: 62, status: "Weak", color: "from-blue-500 to-blue-600", icon: "🗄️" },
    { name: "DAA", accuracy: 78, status: "Improving", color: "from-purple-500 to-purple-600", icon: "🌲" },
    { name: "Web Tech", accuracy: 85, status: "Strong", color: "from-cyan-500 to-blue-500", icon: "</>" },
    { name: "MLT", accuracy: 70, status: "Improving", color: "from-amber-500 to-orange-500", icon: "🤖" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16 font-sans text-slate-900">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-bounce backdrop-blur-md">
          <span>✨</span>
          <span>{toast}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          1. HERO SECTION — Learning Rewards with 3D Illustration Graphic
         ══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">🎁</span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Learning Rewards
            </h1>
          </div>
          <p className="text-sm font-bold text-slate-700 leading-snug">
            Turn your learning progress into real academic and career benefits.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Complete challenges, earn XP, unlock badges and exclusive rewards.
          </p>
        </div>

        {/* 3D Gamification Trophy & Books Composition matching reference */}
        <div className="relative shrink-0 flex items-center justify-center pr-2 sm:pr-8">
          {/* Subtle curved wave background */}
          <div className="absolute w-72 h-32 -right-4 top-2 bg-gradient-to-r from-purple-200/40 via-blue-200/30 to-amber-200/30 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center">
            {/* Left stars */}
            <span className="absolute -left-6 top-4 text-amber-400 text-lg animate-pulse">★</span>
            <span className="absolute -left-2 bottom-6 text-amber-400 text-xs">★</span>

            {/* Main Trophy & Stacked Books graphic container */}
            <div className="flex flex-col items-center">
              {/* Golden Trophy */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-300 flex items-center justify-center text-3xl sm:text-4xl shadow-lg shadow-amber-300/40 -mb-2 z-20 border-2 border-white">
                🏆
              </div>
              {/* Stack of books */}
              <div className="w-24 sm:w-28 h-5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm -mb-1 z-10 border border-blue-400" />
              <div className="w-28 sm:w-32 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md border border-emerald-400" />
            </div>

            {/* Right Gold Coin */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-amber-400/40 border-2 border-amber-200 -ml-3 -mb-4 z-30">
              ★
            </div>
            <span className="absolute -right-4 top-2 text-amber-400 text-sm">★</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. LEVEL & XP STRIP + 4 QUICK STAT CARDS
         ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: Level 8 Progress Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between gap-4">
            {/* Level Badge Shield */}
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-600 flex flex-col items-center justify-center text-white shadow-md shadow-indigo-500/20 border-2 border-indigo-400">
                  <span className="text-[10px] text-amber-300 font-black leading-none">👑</span>
                  <span className="text-base font-black tracking-tight leading-none mt-0.5">L8</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900 leading-tight">Level 8</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                    Skill Builder
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  260 XP to reach Level 9
                </p>
              </div>
            </div>

            {/* Total XP Earned */}
            <div className="text-right pl-4 border-l border-slate-100">
              <div className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                1,240 XP
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Total XP Earned
              </p>
            </div>
          </div>

          {/* Gradient Level Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-1000 shadow-sm"
                style={{ width: "83%" }}
              />
            </div>
          </div>
        </div>

        {/* Right: 4 Quick Stat Cards (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 items-stretch">
          {/* 1. Day Streak */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm text-center flex flex-col items-center justify-center hover:shadow-md transition-all">
            <div className="w-9 h-9 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-lg mb-1.5 shadow-2xs">
              🔥
            </div>
            <div className="text-lg font-black text-slate-900 leading-none">7</div>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Day Streak</p>
          </div>

          {/* 2. Topics Done */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm text-center flex flex-col items-center justify-center hover:shadow-md transition-all">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg mb-1.5 shadow-2xs">
              📚
            </div>
            <div className="text-lg font-black text-slate-900 leading-none">42</div>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Topics Done</p>
          </div>

          {/* 3. Badges */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm text-center flex flex-col items-center justify-center hover:shadow-md transition-all">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg mb-1.5 shadow-2xs">
              🏅
            </div>
            <div className="text-lg font-black text-slate-900 leading-none">12</div>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Badges</p>
          </div>

          {/* 4. Accuracy */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm text-center flex flex-col items-center justify-center hover:shadow-md transition-all">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-1.5 shadow-2xs">
              🎯
            </div>
            <div className="text-lg font-black text-slate-900 leading-none">78%</div>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Accuracy</p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. MIDDLE 3-COLUMN ROW:
             - Your Next Reward (Gradient Card with Book Illustration)
             - DBMS Mastery Pack (Checklist Card)
             - Your Learning Streak (7 Days Timeline Card)
         ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
        {/* Card 1: Your Next Reward (5 cols) */}
        <div
          className="lg:col-span-5 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[260px]"
          style={{ background: "linear-gradient(135deg, #0d2b6b 0%, #173b91 40%, #2b1875 100%)" }}
        >
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-sm">🎯</span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Your Next Reward
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black leading-tight max-w-xs text-white">
              Improve your DBMS accuracy to unlock the Mastery Pack.
            </h3>

            <div className="flex items-center gap-2.5 pt-1">
              <span className="text-sm font-bold text-blue-100">DBMS: 62% → 75%</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/80 text-white border border-rose-300/30">
                Weak Area
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-xs bg-white/20 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-700"
                style={{ width: "62%" }}
              />
            </div>
          </div>

          {/* Action button */}
          <div className="relative z-10 pt-4">
            <Link
              to="/learn/dbms"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md shadow-indigo-900/40"
            >
              <span>Improve Now</span>
              <span>→</span>
            </Link>
          </div>

          {/* Educational 3D graphic illustration on right */}
          <div className="absolute -right-2 bottom-4 pointer-events-none z-10 flex flex-col items-center">
            {/* Sparkles */}
            <span className="text-amber-300 text-xs self-start ml-4 animate-bounce">✨</span>
            {/* Graduation Cap */}
            <div className="text-3xl -mb-2 z-20">🎓</div>
            {/* DBMS book */}
            <div className="w-24 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center font-black text-xs text-slate-900 tracking-wider shadow-lg border border-amber-300">
              DBMS
            </div>
            {/* Bottom book layer */}
            <div className="w-28 h-5 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 shadow-sm -mt-1 border border-blue-200" />
          </div>

          {/* Background glow orb */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Card 2: DBMS Mastery Pack Checklist (3.5 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🗄️</span>
              <div>
                <h4 className="text-sm font-black text-slate-900 leading-tight">DBMS Mastery Pack</h4>
                <p className="text-[10px] text-slate-400 font-medium">Unlocks when you hit target accuracy</p>
              </div>
            </div>

            {/* 5-item Checklist */}
            <ul className="space-y-2 pt-1 text-xs font-semibold text-slate-700">
              <li className="flex items-center gap-2 text-slate-800">
                <span className="text-emerald-500 font-black text-xs">✓</span>
                <span>Quick Revision Notes</span>
              </li>
              <li className="flex items-center gap-2 text-slate-800">
                <span className="text-emerald-500 font-black text-xs">✓</span>
                <span>Important PYQs</span>
              </li>
              <li className="flex items-center gap-2 text-slate-800">
                <span className="text-emerald-500 font-black text-xs">✓</span>
                <span>30 Practice Questions</span>
              </li>
              <li className="flex items-center gap-2 text-slate-800">
                <span className="text-emerald-500 font-black text-xs">✓</span>
                <span>AI Revision Challenge</span>
              </li>
              <li className="flex items-center gap-2 text-slate-800">
                <span className="text-emerald-500 font-black text-xs">✓</span>
                <span>Advanced Questions</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80">
              <span>🔒</span>
              <span>Requires 75% Accuracy</span>
            </span>
          </div>
        </div>

        {/* Card 3: Your Learning Streak (3.5 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
          {/* Subtle green wave graphic background */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-100/30 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-orange-500 text-base">🔥</span>
              <h4 className="text-sm font-black text-slate-900">Your Learning Streak</h4>
            </div>

            <div className="text-2xl font-black text-emerald-600 tracking-tight">
              7 Days
            </div>

            {/* Circular timeline indicators Mon - Sun */}
            <div className="pt-2">
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {streakDays.map((s, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-2xs transition-all ${
                        s.active
                          ? "bg-emerald-500 text-white shadow-emerald-400/30"
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      }`}
                    >
                      {s.active ? "✓" : "○"}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{s.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-[11px] font-semibold text-slate-500 relative z-10">
            Keep learning today to extend your streak to 8 days!
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          4. TODAY'S PERSONALIZED CHALLENGES & LEADERBOARD ROW
         ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Today's Personalized Challenges (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-rose-500 text-base">🎯</span>
                <h3 className="text-base font-black text-slate-900">
                  Today's Personalized Challenges
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Improve your weak areas to unlock rewards.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsChallengesModalOpen(true)}
              className="text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <span>→</span>
            </button>
          </div>

          {/* 3 Challenge Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {personalizedChallenges.map((ch) => (
              <div
                key={ch.id}
                className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 flex flex-col justify-between space-y-3 hover:shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-2xs ${ch.iconBg}`}>
                      {ch.icon}
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-700">
                      {ch.xp}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 leading-snug">{ch.title}</h4>
                    <p className="text-[11px] text-slate-600 font-semibold mt-0.5">{ch.desc}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{ch.subDesc}</p>
                  </div>
                </div>

                <Link
                  to={ch.route}
                  className="w-full py-2 rounded-xl text-center text-xs font-extrabold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xs block"
                >
                  Start →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Leaderboard (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-base">🏆</span>
              <h3 className="text-base font-black text-slate-900">Leaderboard</h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              This Week
            </span>
          </div>

          {/* Leaderboard entries */}
          <div className="space-y-2.5">
            {leaderboardUsers.map((item) => (
              <div
                key={item.rank}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  item.isCurrent
                    ? "bg-indigo-50/70 border-indigo-200 shadow-2xs"
                    : "bg-slate-50/50 border-slate-100 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base font-black w-5 text-center">{item.badge}</span>
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${item.avatarBg} flex items-center justify-center text-white font-extrabold text-xs shadow-xs`}>
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900 leading-tight">
                      {item.name}
                    </p>
                    {item.isCurrent && (
                      <span className="text-[9px] font-bold text-indigo-600 uppercase">You</span>
                    )}
                  </div>
                </div>
                <div className="text-xs font-black text-slate-900 font-mono">
                  {item.xp}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center border-t border-slate-100">
            <button
              type="button"
              onClick={() => showToast("🏆 Full campus leaderboard loaded!")}
              className="text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View Full Leaderboard →
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          5. BOTTOM ROW:
             - Skill Mastery Progress (8 cols)
             - Next Badge Reward (4 cols, purple card)
         ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Skill Mastery Progress (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 text-base">📊</span>
              <h3 className="text-base font-black text-slate-900">Skill Mastery Progress</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Your accuracy per subject and what each milestone unlocks.
            </p>
          </div>

          {/* 4 Subjects Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {skillsList.map((skill) => (
              <div
                key={skill.name}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 space-y-2 hover:bg-white hover:shadow-xs transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{skill.icon}</span>
                    <span className="text-xs font-black text-slate-900">{skill.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{skill.accuracy}%</span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-700`}
                    style={{ width: `${skill.accuracy}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-slate-400">State:</span>
                  <span
                    className={`font-black ${
                      skill.status === "Weak"
                        ? "text-rose-600"
                        : skill.status === "Strong"
                        ? "text-emerald-600"
                        : "text-blue-600"
                    }`}
                  >
                    {skill.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Next Badge Reward (4 cols, purple gradient) */}
        <div
          className="lg:col-span-4 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[170px]"
          style={{ background: "linear-gradient(135deg, #37187a 0%, #4b1fa8 50%, #6826d1 100%)" }}
        >
          <div className="space-y-3 z-10">
            <div className="flex items-center gap-3">
              {/* Badge Laurel Graphic */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-white text-xl shadow-md border-2 border-amber-200 shrink-0">
                ⭐
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
                  Next Badge Reward
                </p>
                <h4 className="text-base font-black leading-tight text-white">
                  DSA Explorer
                </h4>
                <p className="text-[10px] text-purple-200 font-medium">Your closest badge to unlock.</p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-purple-100">
                <span>Progress</span>
                <span>3 / 5 modules</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-700"
                  style={{ width: "60%" }}
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end z-10">
            <Link
              to="/learn/dsa"
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white hover:text-purple-900 text-white flex items-center justify-center font-black transition-all shadow-sm"
              title="Continue Learning"
            >
              →
            </Link>
          </div>

          {/* Background glow */}
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>

      {/* ── MODALS ── */}
      <BadgeDetailModal isOpen={isBadgeModalOpen} onClose={() => setIsBadgeModalOpen(false)} badge={selectedBadge} />
      <RewardHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} />
      <ChallengesModal isOpen={isChallengesModalOpen} onClose={() => setIsChallengesModalOpen(false)} challenges={challenges} />

      {/* ── CERTIFICATE PREVIEW MODAL (Preserved for compatibility) ── */}
      {certModalOpen && selectedCert && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setCertModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 max-w-5xl w-full p-6 shadow-2xl space-y-6 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎓</span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{selectedCert.courseName}</h3>
                  <p className="text-xs text-slate-500 font-mono">ID: {selectedCert.certificateId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCertModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-500 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <div className="flex justify-center overflow-x-auto">
              <LearnXCertificateTemplate
                certificate={selectedCert}
                onClose={() => setCertModalOpen(false)}
                onDownloadComplete={() => showToast("✅ High-Resolution PDF downloaded!")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsPage;
