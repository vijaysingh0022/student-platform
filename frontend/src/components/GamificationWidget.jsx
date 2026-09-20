import React from "react";

export default function GamificationWidget({ xp = 350, streak = 4, badges = [] }) {
  const level = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;
  const xpForNextLevel = 100;
  const progressPct = Math.min(100, Math.round((xpInCurrentLevel / xpForNextLevel) * 100));

  const ALL_BADGES = [
    { id: "dsa_starter", title: "DSA Explorer", icon: "⚡", desc: "Completed 3 DSA topics", color: "from-amber-400 to-orange-500" },
    { id: "code_ninja", title: "Code Ninja", icon: "🥷", desc: "Scored 80%+ on a Topic Quiz", color: "from-violet-500 to-purple-600" },
    { id: "streak_master", title: "Streak Master", icon: "🔥", desc: "Maintained a 3-day study streak", color: "from-rose-500 to-red-600" },
    { id: "db_architect", title: "SQL Architect", icon: "🛢️", desc: "Mastered DBMS Querying", color: "from-emerald-400 to-teal-600" },
    { id: "os_specialist", title: "OS Specialist", icon: "💻", desc: "Completed Process Management", color: "from-sky-400 to-blue-600" },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-indigo-500/20 shadow-xl space-y-4">
      {/* Top Banner: Level, XP & Streak */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
            Lvl {level}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-wide text-white">CSE Scholar Rank</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {xp} Total XP
              </span>
            </div>

            {/* XP Progress Bar */}
            <div className="flex items-center gap-3">
              <div className="w-36 sm:w-48 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                {xpInCurrentLevel}/100 XP to Lvl {level + 1}
              </span>
            </div>
          </div>
        </div>

        {/* Daily Streak Counter */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
          <span className="text-2xl animate-bounce">🔥</span>
          <div className="text-left">
            <div className="text-xs font-black text-amber-400 leading-none">{streak} Day Streak</div>
            <div className="text-[10px] font-semibold text-slate-400">Keep it up today!</div>
          </div>
        </div>
      </div>

      {/* Badges Carousel / Showcase */}
      <div className="pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2.5">
          <span>Unlocked Topic Mastery Badges</span>
          <span className="text-amber-400">{badges.length || 2} / {ALL_BADGES.length} Badges</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {ALL_BADGES.map((badge, idx) => {
            const isUnlocked = idx < 2 || badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`flex-shrink-0 flex items-center gap-2.5 p-2.5 px-3.5 rounded-2xl border transition-all ${
                  isUnlocked
                    ? "bg-slate-800/90 border-slate-700 text-white shadow-md"
                    : "bg-slate-900/50 border-slate-800/80 text-slate-600 grayscale opacity-60"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${badge.color} flex items-center justify-center text-base shadow-sm`}>
                  {badge.icon}
                </div>
                <div>
                  <div className="text-xs font-black leading-snug">{badge.title}</div>
                  <div className="text-[10px] font-medium text-slate-400">{badge.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
