import React from "react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200/90 shadow-xl rounded-xl p-2.5 text-left text-xs pointer-events-none">
        <p className="font-bold text-slate-800">{label}</p>
        <p className="text-indigo-600 font-semibold mt-0.5">
          {payload[0].value}% mastery progress
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          {payload[0].payload.topicsCompleted || 8} topics completed
        </p>
      </div>
    );
  }
  return null;
};

export const LearningMomentumChart = ({
  chartData,
  recentActivities,
  weeklyMomentum = 12,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* Left (7 cols): Learning Momentum Chart */}
      <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block">
                  VELOCITY METRIC
                </span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Learning Momentum (Last 7 Days)
                </h3>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              +{weeklyMomentum}% Growth
            </span>
          </div>

          {/* Area Chart */}
          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="learnxMomentumGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 500 }}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 500 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="progress"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fill="url(#learnxMomentumGrad)"
                  dot={{ fill: "#4f46e5", r: 3, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ fill: "#4f46e5", r: 5, strokeWidth: 2, stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3 Stats Below Chart */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 mt-2 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-black text-emerald-600 flex items-center justify-center gap-0.5">
              <span>↗</span> +{weeklyMomentum}%
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Quiz Accuracy Lift</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-black text-indigo-600">8 Topics</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Completed</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-black text-purple-600">3.2 hrs</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Active Study Time</p>
          </div>
        </div>
      </div>

      {/* Right (5 cols): Recent Activity Feed */}
      <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Verified Learning Log
            </h3>
            <Link
              to="/test"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              All Tests →
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {recentActivities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between gap-3 text-xs p-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-xs font-bold border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <p className="font-bold text-slate-800 truncate">{act.title}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-medium block">
                    {act.time}
                  </span>
                  {act.score && (
                    <span className="text-[10px] font-black text-emerald-600">
                      {act.score}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 mt-4">
          <Link
            to="/test"
            className="w-full block py-2.5 rounded-xl border border-slate-200/90 hover:bg-slate-50 text-slate-700 text-xs font-bold text-center transition-all shadow-2xs"
          >
            Take Assessment →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LearningMomentumChart;
