import React, { useState } from "react";

const PAGE_TABLE = [
  { pageNum: 0, frameNum: 3, valid: true },
  { pageNum: 1, frameNum: 7, valid: true },
  { pageNum: 2, frameNum: 1, valid: true },
  { pageNum: 3, frameNum: 5, valid: true },
  { pageNum: 4, frameNum: 2, valid: true },
];

const PHYSICAL_FRAMES = [
  { frame: 0, content: "OS Kernel Core" },
  { frame: 1, content: "Process A - Page 2" },
  { frame: 2, content: "Process A - Page 4" },
  { frame: 3, content: "Process A - Page 0" },
  { frame: 4, content: "Shared Library (libc)" },
  { frame: 5, content: "Process A - Page 3" },
  { frame: 6, content: "Process B - Page 1" },
  { frame: 7, content: "Process A - Page 1" },
];

const PagingVisualizer = () => {
  const [selectedLogicalPage, setSelectedLogicalPage] = useState(1);
  const [offsetVal, setOffsetVal] = useState(256);
  const pageSize = 1024; // 1 KB

  const activeEntry = PAGE_TABLE.find((p) => p.pageNum === selectedLogicalPage) || PAGE_TABLE[0];
  const frameNum = activeEntry.frameNum;
  const logicalAddress = selectedLogicalPage * pageSize + offsetVal;
  const physicalAddress = frameNum * pageSize + offsetVal;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-cyan-100 text-cyan-800 border border-cyan-200">
              Operating Systems Lab
            </span>
            <span className="text-xs font-semibold text-slate-400">Virtual Memory & Address Translation</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            OS Paging & Memory Management Visualizer
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Trace how the CPU converts a Logical Address (Page Number + Offset) to a Physical Address (Frame Number + Offset) via the Page Table.
          </p>
        </div>

        {/* Page selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          <span className="text-[10px] font-black uppercase text-slate-400 pl-2">Select Page:</span>
          {[0, 1, 2, 3, 4].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedLogicalPage(p)}
              className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                selectedLogicalPage === p
                  ? "bg-cyan-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              P{p}
            </button>
          ))}
        </div>
      </div>

      {/* ADDRESS TRANSLATION PIPELINE */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">
            Hardware Address Translation Pipeline (MMU)
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Page Size = 1 KB ({pageSize} Bytes)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
          {/* 1. CPU Logical Address */}
          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">1. CPU Generated (Logical)</span>
            <div className="font-mono text-sm text-cyan-300 font-extrabold">
              [{selectedLogicalPage} | {offsetVal}]
            </div>
            <p className="text-[10px] text-slate-400">
              Page: <strong>{selectedLogicalPage}</strong> · Offset (d): <strong>{offsetVal}</strong>
            </p>
            <div className="text-[11px] text-slate-300 font-bold pt-1">
              Address: {logicalAddress}
            </div>
          </div>

          {/* 2. Page Table Lookup */}
          <div className="p-3.5 rounded-xl bg-cyan-950/70 border border-cyan-500/40 space-y-1">
            <span className="text-[10px] uppercase font-bold text-cyan-400">2. Page Table Lookup</span>
            <div className="font-mono text-sm text-amber-300 font-extrabold animate-pulse">
              P{selectedLogicalPage} ➔ Frame {frameNum}
            </div>
            <p className="text-[10px] text-slate-400">
              Offset <strong className="text-white">{offsetVal}</strong> copied unmodified
            </p>
            <div className="text-[11px] text-emerald-400 font-bold pt-1">
              Status: Valid (In RAM)
            </div>
          </div>

          {/* 3. Physical RAM Address */}
          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">3. Physical Memory (RAM)</span>
            <div className="font-mono text-sm text-emerald-300 font-extrabold">
              [{frameNum} | {offsetVal}]
            </div>
            <p className="text-[10px] text-slate-400">
              Frame: <strong>{frameNum}</strong> · Offset: <strong>{offsetVal}</strong>
            </p>
            <div className="text-[11px] text-white font-bold pt-1">
              Physical Address: {physicalAddress}
            </div>
          </div>
        </div>
      </div>

      {/* PAGE TABLE & PHYSICAL FRAMES SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Page Table */}
        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-900 uppercase">Process Page Table</h4>
            <span className="text-[10px] text-slate-400 font-semibold">Base Register (PTBR)</span>
          </div>
          <table className="w-full text-xs text-left border-collapse bg-white rounded-xl overflow-hidden border border-slate-200">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-2">Page #</th>
                <th className="p-2">Frame #</th>
                <th className="p-2">Valid Bit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {PAGE_TABLE.map((p) => {
                const isActive = p.pageNum === selectedLogicalPage;
                return (
                  <tr
                    key={p.pageNum}
                    className={`transition-colors ${
                      isActive ? "bg-cyan-100 text-cyan-950 font-bold" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="p-2">Page {p.pageNum}</td>
                    <td className="p-2 text-indigo-700">Frame {p.frameNum}</td>
                    <td className="p-2 text-emerald-600 font-bold">1 (RAM)</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Physical RAM Frames */}
        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-900 uppercase">Physical RAM (Frames)</h4>
            <span className="text-[10px] text-slate-400 font-semibold">8 Frames total</span>
          </div>
          <div className="space-y-1">
            {PHYSICAL_FRAMES.map((f) => {
              const isTargetFrame = f.frame === frameNum;
              return (
                <div
                  key={f.frame}
                  className={`p-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                    isTargetFrame
                      ? "bg-emerald-100 border-emerald-400 text-emerald-950 font-bold shadow-xs scale-[1.02]"
                      : "bg-white border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-400 text-[10px]">Frame {f.frame}:</span>
                    <span>{f.content}</span>
                  </div>
                  {isTargetFrame && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase">
                      Accessed!
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagingVisualizer;
