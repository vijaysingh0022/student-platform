import React from "react";

const SortingVisualizer = ({ stepData, isBinarySearch = false }) => {
  if (!stepData || !stepData.array) return null;

  const arr = stepData.array;
  const maxVal = Math.max(...arr, 60);

  const comparing = new Set(stepData.comparing || []);
  const swapping = new Set(stepData.swapping || []);
  const sorted = new Set(stepData.sorted || []);
  const minIndex = stepData.minIndex;
  const pivotIndex = stepData.pivotIndex;
  const keyIndex = stepData.keyIndex;

  // Binary search specific
  const low = stepData.low;
  const high = stepData.high;
  const mid = stepData.mid;
  const target = stepData.target;
  const foundIndex = stepData.foundIndex;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Binary Search Target Banner */}
      {isBinarySearch && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200">
          <div className="flex items-center gap-2">
            <span className="text-base">🎯</span>
            <span className="text-xs font-black text-indigo-900 uppercase">
              Searching for Target: <span className="text-sm text-indigo-600 font-extrabold">{target}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">low: {low ?? "-"}</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">mid: {mid ?? "-"}</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">high: {high ?? "-"}</span>
          </div>
        </div>
      )}

      {/* Main Array Bars Container */}
      <div className="min-h-[260px] bg-slate-900 rounded-3xl p-6 sm:p-8 flex items-end justify-center gap-2 sm:gap-3 border border-slate-800 relative overflow-hidden shadow-inner">
        {arr.map((val, idx) => {
          const heightPercent = Math.max(Math.round((val / maxVal) * 100), 12);

          let barBg = "bg-slate-700 text-slate-300";
          let borderStyle = "border-slate-600";
          let statusLabel = "";

          if (isBinarySearch) {
            if (foundIndex === idx) {
              barBg = "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 scale-105";
              borderStyle = "border-emerald-400";
              statusLabel = "TARGET!";
            } else if (mid === idx) {
              barBg = "bg-purple-500 text-white shadow-lg shadow-purple-500/40 animate-pulse";
              borderStyle = "border-purple-400";
              statusLabel = "MID";
            } else if (idx >= low && idx <= high) {
              barBg = "bg-blue-500/80 text-white";
              borderStyle = "border-blue-400";
            } else {
              barBg = "bg-slate-800/40 text-slate-600 border-dashed";
              borderStyle = "border-slate-800";
            }
          } else {
            if (swapping.has(idx)) {
              barBg = "bg-rose-500 text-white shadow-lg shadow-rose-500/50 scale-105";
              borderStyle = "border-rose-400";
              statusLabel = "SWAP";
            } else if (comparing.has(idx)) {
              barBg = "bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/40";
              borderStyle = "border-amber-300";
              statusLabel = "COMPARE";
            } else if (sorted.has(idx)) {
              barBg = "bg-emerald-500 text-white font-extrabold";
              borderStyle = "border-emerald-400";
              statusLabel = "SORTED";
            } else if (pivotIndex === idx) {
              barBg = "bg-purple-600 text-white font-black shadow-lg shadow-purple-600/40";
              borderStyle = "border-purple-400";
              statusLabel = "PIVOT";
            } else if (minIndex === idx) {
              barBg = "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/40";
              borderStyle = "border-cyan-300";
              statusLabel = "MIN";
            } else if (keyIndex === idx) {
              barBg = "bg-sky-500 text-white font-black shadow-md shadow-sky-500/40";
              borderStyle = "border-sky-300";
              statusLabel = "KEY";
            }
          }

          return (
            <div key={idx} className="flex-1 flex flex-col items-center max-w-[56px] group">
              {/* Pointer indicator above bar */}
              <div className="h-6 flex items-center justify-center text-[10px] font-black uppercase tracking-wider text-slate-400">
                {statusLabel && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                    {statusLabel}
                  </span>
                )}
              </div>

              {/* Bar Element */}
              <div
                className={`w-full rounded-2xl flex flex-col justify-end items-center pb-2 transition-all duration-300 border ${barBg} ${borderStyle}`}
                style={{ height: `${heightPercent * 2}px` }}
              >
                <span className="text-xs font-black tracking-tight drop-shadow-xs">
                  {val}
                </span>
              </div>

              {/* Index label below bar */}
              <span className="text-[10px] font-bold text-slate-500 mt-2 font-mono">
                [{idx}]
              </span>
            </div>
          );
        })}
      </div>

      {/* Array Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-700 border border-slate-600" />
          <span>Unsorted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          <span>Swapping / Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Sorted / Found</span>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;
