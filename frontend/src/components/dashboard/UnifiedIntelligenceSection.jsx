import React from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Repeat,
  Target,
  FileText,
  FolderGit2,
  Users,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
} from "lucide-react";

export const UnifiedIntelligenceSection = ({
  twin,
  learningPriorities = [],
  revisionsDue = 2,
  codingCount = 14,
  portfolioStatus = "Connected",
  weeklyVelocity = "+14% Mastery",
}) => {
  const nextAction = twin?.nextBestAction;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LearnX 2.0 Centralized Ecosystem Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Unified Learning Intelligence Overview
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Live synchronization across Spaced Repetition, Adaptive Assessments, RAG Docs, GitHub Portfolio, Peer Groups, and Learning Twin.
          </p>
        </div>

        <Link
          to="/learning-twin"
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-center shadow-xs"
        >
          <Brain className="w-3.5 h-3.5 text-indigo-300" />
          <span>Open Full Learning Twin</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 6 Integrated Module Metric Badges */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Spaced Repetition */}
        <Link
          to="/revision"
          className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 hover:bg-indigo-50 transition-all space-y-1.5 group"
        >
          <div className="flex items-center justify-between text-indigo-600">
            <Repeat className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase text-indigo-500">M01</span>
          </div>
          <div className="text-lg font-black text-indigo-950">
            {revisionsDue} Due
          </div>
          <div className="text-[11px] font-bold text-indigo-700 group-hover:underline flex items-center gap-1">
            <span>Spaced SM-2</span>
          </div>
        </Link>

        {/* 2. Adaptive Question Engine */}
        <Link
          to="/test/DSA"
          className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100/80 hover:bg-blue-50 transition-all space-y-1.5 group"
        >
          <div className="flex items-center justify-between text-blue-600">
            <Target className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase text-blue-500">M02</span>
          </div>
          <div className="text-lg font-black text-blue-950">
            921 Items
          </div>
          <div className="text-[11px] font-bold text-blue-700 group-hover:underline flex items-center gap-1">
            <span>Adaptive IRT</span>
          </div>
        </Link>

        {/* 3. Upload-to-Learn RAG */}
        <Link
          to="/upload-to-learn"
          className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 hover:bg-emerald-50 transition-all space-y-1.5 group"
        >
          <div className="flex items-center justify-between text-emerald-600">
            <FileText className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase text-emerald-500">M03</span>
          </div>
          <div className="text-lg font-black text-emerald-950">
            RAG Active
          </div>
          <div className="text-[11px] font-bold text-emerald-700 group-hover:underline flex items-center gap-1">
            <span>Doc Retrieval</span>
          </div>
        </Link>

        {/* 4. GitHub Portfolio Intelligence */}
        <Link
          to="/portfolio"
          className="p-3.5 rounded-2xl bg-slate-100/70 border border-slate-200/80 hover:bg-slate-100 transition-all space-y-1.5 group"
        >
          <div className="flex items-center justify-between text-slate-700">
            <FolderGit2 className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase text-slate-500">M04</span>
          </div>
          <div className="text-lg font-black text-slate-900">
            {portfolioStatus}
          </div>
          <div className="text-[11px] font-bold text-slate-700 group-hover:underline flex items-center gap-1">
            <span>Audit & Review</span>
          </div>
        </Link>

        {/* 5. Collaborative Network */}
        <Link
          to="/community"
          className="p-3.5 rounded-2xl bg-violet-50/50 border border-violet-100/80 hover:bg-violet-50 transition-all space-y-1.5 group"
        >
          <div className="flex items-center justify-between text-violet-600">
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase text-violet-500">M05</span>
          </div>
          <div className="text-lg font-black text-violet-950">
            Peer Groups
          </div>
          <div className="text-[11px] font-bold text-violet-700 group-hover:underline flex items-center gap-1">
            <span>Network Co-Learn</span>
          </div>
        </Link>

        {/* 6. AI Personal Learning Twin */}
        <Link
          to="/learning-twin"
          className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100/80 hover:bg-amber-50 transition-all space-y-1.5 group"
        >
          <div className="flex items-center justify-between text-amber-600">
            <Brain className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase text-amber-500">M06</span>
          </div>
          <div className="text-lg font-black text-amber-950">
            {twin?.overallLearningIndex || 68}%
          </div>
          <div className="text-[11px] font-bold text-amber-800 group-hover:underline flex items-center gap-1">
            <span>Learning DNA</span>
          </div>
        </Link>
      </div>

      {/* Main Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Learning Twin Priority Action & Gap Radar (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {nextAction ? (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white space-y-3 shadow-md">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 bg-indigo-500/20 border border-indigo-400/30 px-2.5 py-0.5 rounded-full">
                  Centralized Next Best Action
                </span>
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Est. {nextAction.estimatedMinutes} mins</span>
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-black text-white">
                {nextAction.title}
              </h4>

              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                <strong className="text-indigo-300 font-bold">Why Selected: </strong>
                {nextAction.whySelected}
              </p>

              <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
                <span className="text-[11px] font-semibold text-emerald-300">
                  Expected Gain: {nextAction.expectedBenefit}
                </span>

                <Link
                  to={nextAction.actionRoute}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <span>{nextAction.actionLabel || "Execute Action"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
              No immediate learning gaps detected. Complete practice topics to refresh recommendations.
            </div>
          )}

          {/* Cross-Module Weekly Momentum */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Weekly Ecosystem Momentum</span>
                <span className="text-[11px] text-slate-500 font-medium">Synchronized from test scores, coding submissions & revisions</span>
              </div>
            </div>
            <span className="font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-xl text-xs">
              {weeklyVelocity}
            </span>
          </div>
        </div>

        {/* Right Column: Active Learning Priorities & Status (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50/70 rounded-2xl border border-slate-200/90 p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Cross-Module Priorities
            </span>
            <span className="text-[10px] font-bold text-slate-400">Synchronized</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Spaced Memory Health</span>
                <span className="text-[10px] font-black text-emerald-600">
                  {twin?.retentionHealthScore || 82}% Retention
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Ebbinghaus forgetting curve checked across all completed curriculum units.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Coding Lab Velocity</span>
                <span className="text-[10px] font-black text-indigo-600">
                  {codingCount} Solutions Submitted
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                DSA algorithms and unit test verification synced to skill graph.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Target Role Skill Coverage</span>
                <span className="text-[10px] font-black text-amber-600">
                  68% Role Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Connected to GitHub repositories and Career Twin campus benchmarks.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UnifiedIntelligenceSection;