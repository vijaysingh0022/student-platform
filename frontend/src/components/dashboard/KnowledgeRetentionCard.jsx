import React from "react";
import { Link } from "react-router-dom";
import { History, ArrowRight, Bot, RotateCcw } from "lucide-react";

export const RETENTION_TOPICS = [
  {
    id: "r1",
    title: "DBMS Normalization (1NF to BCNF)",
    subject: "DBMS",
    lastStudied: "8 days ago",
    previousAccuracy: 78,
    retentionConfidence: 61,
    status: "Needs Revision",
    statusColor: "bg-amber-50 text-amber-700 border-amber-200",
    confidenceColor: "bg-amber-500",
    link: "/learn/dbms/dbms-normalization",
  },
  {
    id: "r2",
    title: "Binary Search Trees & Traversals",
    subject: "DSA",
    lastStudied: "14 days ago",
    previousAccuracy: 82,
    retentionConfidence: 48,
    status: "At Risk",
    statusColor: "bg-rose-50 text-rose-700 border-rose-200",
    confidenceColor: "bg-rose-500",
    link: "/learn/dsa/dsa-trees",
  },
  {
    id: "r3",
    title: "TCP 3-Way Handshake & Flow Control",
    subject: "CN",
    lastStudied: "2 days ago",
    previousAccuracy: 90,
    retentionConfidence: 92,
    status: "Fresh",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    confidenceColor: "bg-emerald-500",
    link: "/learn/cn/cn-transport-layer",
  },
];

export const KnowledgeRetentionCard = ({ retentionTopics = RETENTION_TOPICS }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
              <History className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block">
                SPACED-REPETITION RADAR
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Knowledge Retention
              </h2>
            </div>
          </div>

          <Link
            to="/roadmap/DSA"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
          >
            <span>Revision Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 font-medium py-3 leading-relaxed">
          Ebbinghaus forgetting curve models your memory decay. Revise topics before confidence drops below 60%.
        </p>

        {/* Topic Cards */}
        <div className="space-y-3 pt-1">
          {retentionTopics.map((topic) => (
            <div
              key={topic.id}
              className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-indigo-300 hover:bg-white transition-all space-y-2 group shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                      {topic.subject}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${topic.statusColor}`}
                    >
                      {topic.status}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-950 truncate">
                    {topic.title}
                  </h3>
                </div>

                <Link
                  to={topic.link}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:border-indigo-400 hover:text-indigo-600 shrink-0 shadow-2xs flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                  <span>Revise</span>
                </Link>
              </div>

              {/* Progress and Stats bar */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1">
                <span>Last studied: {topic.lastStudied}</span>
                <span>
                  Retention Confidence:{" "}
                  <strong className="text-slate-700 font-bold">{topic.retentionConfidence}%</strong>
                </span>
              </div>

              {/* Retention Meter Bar */}
              <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                <div
                  className={`h-full ${topic.confidenceColor} rounded-full transition-all duration-700`}
                  style={{ width: `${topic.retentionConfidence}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Quick Action */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-[11px] text-slate-400 font-medium">
          2 topics due for revision this week
        </span>

        <Link
          to="/tutor?q=Quiz%20me%20on%20my%20topics%20due%20for%20revision%20today"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          <Bot className="w-3.5 h-3.5 text-indigo-500" />
          <span>Ask AI to Quiz You →</span>
        </Link>
      </div>
    </div>
  );
};

export default KnowledgeRetentionCard;
