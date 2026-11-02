import React, { useState } from "react";

const INITIAL_ARRAY = [4, 11, 19, 27, 35, 42, 58, 69, 77, 85, 93];

const BinarySearchInteractiveVisualizer = () => {
  const [array] = useState(INITIAL_ARRAY);
  const [targetVal, setTargetVal] = useState(42);
  const [inputVal, setInputVal] = useState("42");
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(INITIAL_ARRAY.length - 1);
  const [mid, setMid] = useState(Math.floor((0 + INITIAL_ARRAY.length - 1) / 2));
  const [status, setStatus] = useState("initialized"); // "initialized" | "comparing" | "found" | "not_found"
  const [stepCount, setStepCount] = useState(1);
  const [history, setHistory] = useState([
    {
      step: 1,
      low: 0,
      high: INITIAL_ARRAY.length - 1,
      mid: Math.floor((0 + INITIAL_ARRAY.length - 1) / 2),
      val: INITIAL_ARRAY[Math.floor((0 + INITIAL_ARRAY.length - 1) / 2)],
      desc: "Initial search boundaries covering entire array.",
    },
  ]);

  const handleStep = () => {
    if (status === "found" || status === "not_found") return;

    const currentMidVal = array[mid];

    if (currentMidVal === targetVal) {
      setStatus("found");
      setHistory((prev) => [
        ...prev,
        {
          step: stepCount + 1,
          low,
          high,
          mid,
          val: currentMidVal,
          desc: `arr[mid] (${currentMidVal}) == target (${targetVal})! Target successfully located at Index ${mid}!`,
        },
      ]);
      return;
    }

    if (low >= high) {
      setStatus("not_found");
      setHistory((prev) => [
        ...prev,
        {
          step: stepCount + 1,
          low,
          high,
          mid,
          val: currentMidVal,
          desc: `Search range exhausted (low > high). Target ${targetVal} is not in the array!`,
        },
      ]);
      return;
    }

    let nextLow = low;
    let nextHigh = high;

    if (currentMidVal < targetVal) {
      nextLow = mid + 1;
      const nextMid = Math.floor((nextLow + nextHigh) / 2);
      setLow(nextLow);
      setMid(nextMid);
      setStepCount((s) => s + 1);
      setHistory((prev) => [
        ...prev,
        {
          step: stepCount + 1,
          low: nextLow,
          high: nextHigh,
          mid: nextMid,
          val: array[nextMid],
          desc: `${currentMidVal} < ${targetVal}: Target is greater. Discard left half, set low = mid + 1 (${nextLow}).`,
        },
      ]);
    } else {
      nextHigh = mid - 1;
      const nextMid = Math.floor((nextLow + nextHigh) / 2);
      setHigh(nextHigh);
      setMid(nextMid);
      setStepCount((s) => s + 1);
      setHistory((prev) => [
        ...prev,
        {
          step: stepCount + 1,
          low: nextLow,
          high: nextHigh,
          mid: nextMid,
          val: array[nextMid],
          desc: `${currentMidVal} > ${targetVal}: Target is smaller. Discard right half, set high = mid - 1 (${nextHigh}).`,
        },
      ]);
    }
  };

  const handleReset = (newTarget = targetVal) => {
    const l = 0;
    const h = array.length - 1;
    const m = Math.floor((l + h) / 2);
    setTargetVal(newTarget);
    setLow(l);
    setHigh(h);
    setMid(m);
    setStatus("initialized");
    setStepCount(1);
    setHistory([
      {
        step: 1,
        low: l,
        high: h,
        mid: m,
        val: array[m],
        desc: `Reset search for target ${newTarget}. Range: [0 to ${h}].`,
      },
    ]);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-purple-100 text-purple-800 border border-purple-200">
              Interactive Algorithm Lab
            </span>
            <span className="text-xs font-semibold text-slate-400">Divide & Conquer Searching</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Binary Search Animated Step-by-Step Visualizer
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Watch Low, Mid, and High pointers dynamically eliminate half the array at every comparison.
          </p>
        </div>

        {/* Target input */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-20 px-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 font-bold"
          />
          <button
            onClick={() => {
              const val = parseInt(inputVal, 10);
              if (!isNaN(val)) handleReset(val);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Set Target
          </button>
        </div>
      </div>

      {/* POINTERS DASHBOARD */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between flex-wrap gap-3 shadow-inner">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-purple-400">
            Target: <span className="text-white text-sm font-extrabold">{targetVal}</span>
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-mono font-bold">
            Low: {low}
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-mono font-bold">
            Mid: {mid} (Value: {array[mid]})
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold">
            High: {high}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStep}
            disabled={status === "found" || status === "not_found"}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-black shadow-xs transition-colors"
          >
            Step Forward →
          </button>
          <button
            onClick={() => handleReset()}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            Reset ↺
          </button>
        </div>
      </div>

      {/* ARRAY VISUAL BARS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Sorted Array (Length {array.length})</span>
          <span>Time Complexity: <strong>O(log N)</strong></span>
        </div>

        <div className="grid grid-cols-11 gap-1.5 sm:gap-2 pt-6">
          {array.map((val, idx) => {
            const isMid = idx === mid;
            const isLow = idx === low;
            const isHigh = idx === high;
            const inRange = idx >= low && idx <= high;
            const isTargetFound = status === "found" && isMid;

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 relative">
                {/* Top Pointers */}
                <div className="h-5 flex items-center justify-center text-[10px] font-black absolute -top-5">
                  {isTargetFound ? (
                    <span className="text-emerald-600 font-extrabold animate-bounce">🎯 FOUND</span>
                  ) : isMid ? (
                    <span className="text-purple-600 font-extrabold">MID</span>
                  ) : isLow ? (
                    <span className="text-blue-600">LOW</span>
                  ) : isHigh ? (
                    <span className="text-amber-600">HIGH</span>
                  ) : null}
                </div>

                {/* Box */}
                <div
                  className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all font-mono text-xs sm:text-sm font-black ${
                    isTargetFound
                      ? "bg-emerald-500 border-emerald-600 text-white scale-110 shadow-lg shadow-emerald-500/30"
                      : isMid
                      ? "bg-purple-600 border-purple-700 text-white shadow-md scale-105"
                      : inRange
                      ? "bg-slate-100 border-slate-300 text-slate-800"
                      : "bg-slate-50 border-slate-200 text-slate-300 opacity-40"
                  }`}
                >
                  {val}
                </div>

                {/* Index label */}
                <span className="text-[10px] text-slate-400 font-bold">{idx}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP LOG */}
      <div className="space-y-2 border-t border-slate-100 pt-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Execution Step Log:
        </h4>
        <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
          {history.map((h, i) => (
            <div
              key={i}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-2"
            >
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-black shrink-0">
                {h.step}
              </span>
              <span className="font-semibold text-slate-700 flex-1">{h.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BinarySearchInteractiveVisualizer;
