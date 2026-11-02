import React from "react";
import { BookOpen, Target, Flame, TrendingUp } from "lucide-react";

// Circular Progress Gauge Ring
const CircularProgress = ({
  value = 0,
  size = 48,
  strokeWidth = 4.5,
  strokeColor = "#10b981",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="#f1f5f9"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
};

// Mini Sparkline Bars
const MiniSparkline = ({
  bars = [35, 50, 45, 70, 60, 85, 95],
  colorClass = "from-amber-400 to-orange-500",
}) => (
  <div className="flex items-end gap-1 h-9 shrink-0">
    {bars.map((h, i) => (
      <div
        key={i}
        className={`w-1.5 rounded-full bg-gradient-to-t ${colorClass} opacity-85 transition-all`}
        style={{ height: `${Math.max(15, h)}%` }}
      />
    ))}
  </div>
);

export const KeyMetricsRow = ({
  overallProgress = 28,
  topicsCompleted = 76,
  totalTopics = 272,
  readinessScore = 68,
  readinessLabel = "Developing",
  streakDays = 4,
  weeklyMomentum = 12,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* Metric 1: Learning Progress */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 flex items-center justify-between shadow-2xs hover:border-indigo-300 transition-all">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Learning Progress
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight pt-1">
            {overallProgress}%
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            {topicsCompleted} / {totalTopics} topics mastered
          </p>
        </div>
        <CircularProgress
          value={overallProgress}
          size={50}
          strokeWidth={4.5}
          strokeColor="#10b981"
        />
      </div>

      {/* Metric 2: Placement Readiness */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 flex items-center justify-between shadow-2xs hover:border-indigo-300 transition-all">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
              <Target className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Placement Readiness
            </span>
            <span
              className="text-slate-400 text-xs cursor-help"
              title="Educational decision-support score calculated from verified technical assessments, DSA mastery, and coding consistency"
            >
              ⓘ
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight pt-1">
            {readinessScore} <span className="text-sm font-semibold text-slate-400">/ 100</span>
          </p>
          <div>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {readinessLabel}
            </span>
          </div>
        </div>
        <CircularProgress
          value={readinessScore}
          size={50}
          strokeWidth={4.5}
          strokeColor="#4F46E5"
        />
      </div>

      {/* Metric 3: Learning Momentum */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 flex items-center justify-between shadow-2xs hover:border-indigo-300 transition-all">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Learning Momentum
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-600 tracking-tight pt-1 flex items-center gap-1">
            +{weeklyMomentum}% <span className="text-base">↑</span>
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            Progress velocity this week
          </p>
        </div>
        <MiniSparkline
          bars={[40, 55, 65, 50, 80, 70, 95]}
          colorClass="from-purple-300 to-indigo-500"
        />
      </div>

      {/* Metric 4: Current Streak */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 flex items-center justify-between shadow-2xs hover:border-indigo-300 transition-all">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center shrink-0">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Streak
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight pt-1">
            {streakDays} Days
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            Daily practice rhythm 🔥
          </p>
        </div>
        <MiniSparkline
          bars={[30, 45, 60, 50, 75, 90, 85]}
          colorClass="from-amber-300 to-orange-400"
        />
      </div>
    </div>
  );
};

export default KeyMetricsRow;
