import React from "react";

const TreeVisualizer = ({ stepData, algorithmId }) => {
  if (!stepData) return null;

  // Render Heap Array & Binary Tree format
  if (algorithmId === "heap" && stepData.heap) {
    const heap = stepData.heap;
    const activeIdx = stepData.activeIdx;
    const comparingIdx = stepData.comparingIdx;

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Array representation */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-3">
          <div className="text-xs font-black text-slate-400 uppercase tracking-wide">
            Min-Heap Array Storage:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {heap.map((val, idx) => (
              <div
                key={idx}
                className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-extrabold border transition-all ${
                  activeIdx === idx
                    ? "bg-amber-400 text-slate-950 border-amber-300 scale-110 shadow-lg shadow-amber-400/30"
                    : comparingIdx === idx
                    ? "bg-purple-500 text-white border-purple-400"
                    : "bg-slate-800 text-slate-100 border-slate-700"
                }`}
              >
                <span className="text-xs">{val}</span>
                <span className="text-[9px] text-slate-400 font-mono">[{idx}]</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render BST / AVL / Red-Black Tree representation
  return (
    <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4 text-white animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <span className="text-xs font-black text-violet-400 uppercase tracking-wide">
          Data Structure State
        </span>
        {stepData.rotation && (
          <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
            🔄 Rotation: {stepData.rotation}
          </span>
        )}
      </div>

      <div className="min-h-[160px] flex flex-col items-center justify-center space-y-3">
        <div className="text-sm font-bold text-slate-300">
          {stepData.treeDescription || "Tree Structure Dynamic Visualization"}
        </div>
        {stepData.insertedValue && (
          <div className="px-3 py-1.5 rounded-xl bg-violet-600/30 text-violet-200 border border-violet-500/30 text-xs font-extrabold">
            Inserted Node: {stepData.insertedValue} {stepData.color ? `(${stepData.color})` : ""}
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeVisualizer;
