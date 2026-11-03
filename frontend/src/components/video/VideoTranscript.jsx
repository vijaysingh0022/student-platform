import React, { useState } from "react";

export const VideoTranscript = ({ transcript = [], keyMoments = [], onSeek }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("transcript"); // "transcript" | "moments"

  const filteredTranscript = transcript.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 space-y-4 shadow-sm">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📜</span>
          <h3 className="text-sm font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Video Transcript & Key Chapters
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("transcript")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === "transcript"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Full Transcript ({transcript.length})
          </button>
          <button
            onClick={() => setActiveTab("moments")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === "moments"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Key Moments ({keyMoments.length})
          </button>
        </div>
      </div>

      {activeTab === "transcript" ? (
        <div className="space-y-3">
          {/* Search bar inside transcript */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts or words in transcript..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-violet-500 transition-all"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Transcript Lines */}
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {filteredTranscript.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                No matching dialogue found in transcript.
              </div>
            ) : (
              filteredTranscript.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onSeek && onSeek(item.timestampSeconds)}
                  className="group p-2.5 rounded-xl hover:bg-violet-50/70 border border-transparent hover:border-violet-100 transition-all cursor-pointer flex items-start gap-3 text-xs"
                >
                  <span className="font-mono font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md text-[11px] group-hover:bg-violet-600 group-hover:text-white transition-colors flex-shrink-0">
                    {item.timeLabel}
                  </span>
                  <p className="text-slate-700 leading-relaxed font-medium flex-1">
                    {item.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Key Moments / Chapters */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
          {keyMoments.length === 0 ? (
            <div className="col-span-2 p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
              No specific chapters defined for this lecture.
            </div>
          ) : (
            keyMoments.map((km, idx) => (
              <div
                key={idx}
                onClick={() => onSeek && onSeek(km.timestampSeconds)}
                className="group p-3 rounded-2xl border border-slate-100 hover:border-violet-200 bg-slate-50/50 hover:bg-violet-50/40 transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-violet-600 font-bold text-xs">▶</span>
                  <span className="text-xs font-bold text-slate-800 truncate group-hover:text-violet-900 transition-colors">
                    {km.title}
                  </span>
                </div>
                <span className="font-mono text-[11px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200 flex-shrink-0">
                  {km.timeLabel}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default VideoTranscript;

