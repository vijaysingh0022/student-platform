import React, { useState, useEffect } from "react";

export default function SortingVisualizer({ topicTitle }) {
  const [array, setArray] = useState([45, 12, 89, 34, 67, 23, 90, 15, 78, 56]);
  const [activeIndices, setActiveIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [pivotIndex, setPivotIndex] = useState(null);
  const [isSorting, setIsSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState("quick");
  const [speed, setSpeed] = useState(300);

  const resetArray = () => {
    const newArr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 85) + 10);
    setArray(newArr);
    setActiveIndices([]);
    setSortedIndices([]);
    setPivotIndex(null);
    setIsSorting(false);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const runBubbleSort = async () => {
    setIsSorting(true);
    let arr = [...array];
    let n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setActiveIndices([j, j + 1]);
        await sleep(speed);

        if (arr[j] > arr[j + 1]) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          await sleep(speed);
        }
      }
      setSortedIndices((prev) => [...prev, n - i - 1]);
    }
    setSortedIndices(Array.from({ length: n }, (_, idx) => idx));
    setActiveIndices([]);
    setIsSorting(false);
  };

  const runQuickSort = async () => {
    setIsSorting(true);
    let arr = [...array];

    const partition = async (low, high) => {
      let pivot = arr[high];
      setPivotIndex(high);
      let i = low - 1;

      for (let j = low; j < high; j++) {
        setActiveIndices([j, high]);
        await sleep(speed);

        if (arr[j] < pivot) {
          i++;
          let temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          setArray([...arr]);
          await sleep(speed);
        }
      }

      let temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;
      setArray([...arr]);
      setPivotIndex(null);
      await sleep(speed);

      return i + 1;
    };

    const quickSortHelper = async (low, high) => {
      if (low < high) {
        let pi = await partition(low, high);
        setSortedIndices((prev) => [...prev, pi]);
        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
      }
    };

    await quickSortHelper(0, arr.length - 1);
    setSortedIndices(Array.from({ length: arr.length }, (_, idx) => idx));
    setActiveIndices([]);
    setPivotIndex(null);
    setIsSorting(false);
  };

  const handleStart = () => {
    if (algorithm === "quick") runQuickSort();
    else runBubbleSort();
  };

  return (
    <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 my-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span>🎨</span>
            <span>Interactive Algorithm Visualizer — {topicTitle || "Sorting"}</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Watch step-by-step element partitioning and comparisons in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isSorting}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold focus:outline-none"
          >
            <option value="quick">Quick Sort (Partitioning)</option>
            <option value="bubble">Bubble Sort (Swaps)</option>
          </select>

          <button
            onClick={resetArray}
            disabled={isSorting}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
          >
            🎲 Reset Array
          </button>

          <button
            onClick={handleStart}
            disabled={isSorting}
            className="btn-gradient px-4 py-1.5 rounded-xl text-white font-extrabold text-xs shadow-md disabled:opacity-50"
          >
            {isSorting ? "Sorting..." : "▶ Play Visualization"}
          </button>
        </div>
      </div>

      {/* Visualizer Canvas */}
      <div className="h-64 sm:h-72 bg-slate-950 p-6 rounded-2xl border border-slate-800/80 flex items-end justify-center gap-2 sm:gap-3 relative overflow-hidden">
        {array.map((val, idx) => {
          const isActive = activeIndices.includes(idx);
          const isPivot = pivotIndex === idx;
          const isSorted = sortedIndices.includes(idx);

          const barBg = isPivot
            ? "bg-amber-400 border-amber-300"
            : isActive
            ? "bg-rose-500 border-rose-400 animate-pulse"
            : isSorted
            ? "bg-emerald-500 border-emerald-400"
            : "bg-violet-600 border-violet-500";

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 max-w-[48px] transition-all duration-300">
              <span className="text-[10px] font-mono font-bold text-slate-400">{val}</span>
              <div
                className={`w-full rounded-t-xl border ${barBg} shadow-lg transition-all duration-300`}
                style={{ height: `${(val / 100) * 180}px` }}
              />
            </div>
          );
        })}
      </div>

      {/* Legend & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-400 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-violet-600" />
            <span>Unsorted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Comparing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span>Pivot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Sorted Position</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span>Speed:</span>
          {[500, 300, 100].map((sp) => (
            <button
              key={sp}
              onClick={() => setSpeed(sp)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                speed === sp ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              {sp === 500 ? "0.5x" : sp === 300 ? "1x" : "2x"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
