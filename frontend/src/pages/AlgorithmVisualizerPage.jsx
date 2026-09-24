import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SortingVisualizer from "../components/visualizer/SortingVisualizer.jsx";
import GraphVisualizer from "../components/visualizer/GraphVisualizer.jsx";
import TreeVisualizer from "../components/visualizer/TreeVisualizer.jsx";
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateMergeSortSteps,
  generateQuickSortSteps,
  generateBinarySearchSteps,
  generateDijkstraSteps,
  generateBFSSteps,
  generateDFSSteps,
  generatePrimsSteps,
  generateKruskalsSteps,
  generateBSTSteps,
  generateHeapSteps,
  generateAVLSteps,
  generateRedBlackSteps,
} from "../utils/algorithmStepGenerators.js";

// List of all 15 algorithms with metadata
const ALGORITHMS = [
  // Sorting
  { id: "bubble", name: "Bubble Sort", category: "sorting", icon: "🫧", difficulty: "Beginner" },
  { id: "selection", name: "Selection Sort", category: "sorting", icon: "🎯", difficulty: "Beginner" },
  { id: "insertion", name: "Insertion Sort", category: "sorting", icon: "🃏", difficulty: "Beginner" },
  { id: "merge", name: "Merge Sort", category: "sorting", icon: "⚔️", difficulty: "Intermediate" },
  { id: "quick", name: "Quick Sort", category: "sorting", icon: "⚡", difficulty: "Intermediate" },

  // Searching
  { id: "binary-search", name: "Binary Search", category: "searching", icon: "🔍", difficulty: "Beginner" },

  // Graph
  { id: "bfs", name: "BFS (Breadth-First)", category: "graph", icon: "🌊", difficulty: "Intermediate" },
  { id: "dfs", name: "DFS (Depth-First)", category: "graph", icon: "🌲", difficulty: "Intermediate" },
  { id: "dijkstra", name: "Dijkstra's Algorithm", category: "graph", icon: "🚀", difficulty: "Advanced" },
  { id: "prims", name: "Prim's MST", category: "graph", icon: "🕸️", difficulty: "Advanced" },
  { id: "kruskals", name: "Kruskal's MST", category: "graph", icon: "🧩", difficulty: "Advanced" },

  // Trees & Data Structures
  { id: "bst", name: "Binary Search Tree", category: "tree", icon: "🌳", difficulty: "Intermediate" },
  { id: "heap", name: "Min / Max Heap", category: "tree", icon: "⛰️", difficulty: "Intermediate" },
  { id: "avl", name: "AVL Tree", category: "tree", icon: "⚖️", difficulty: "Advanced" },
  { id: "red-black", name: "Red-Black Tree", category: "tree", icon: "🔴", difficulty: "Advanced" },
];

const DEFAULT_ARRAY = [45, 12, 89, 34, 67, 23, 90, 15];

const AlgorithmVisualizerPage = () => {
  const [selectedAlgoId, setSelectedAlgoId] = useState("dijkstra");
  const [activeCategory, setActiveCategory] = useState("all"); // 'all' | 'sorting' | 'searching' | 'graph' | 'tree'

  // Execution states
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 0.5x, 1x, 2x
  const [customArrayInput, setCustomArrayInput] = useState("45, 12, 89, 34, 67, 23, 90, 15");

  // Generated algorithm steps container
  const [algoEngine, setAlgoEngine] = useState(null);

  const timerRef = useRef(null);

  // Load/Generate algorithm steps when algorithm or input changes
  useEffect(() => {
    let initialArr = customArrayInput
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));

    if (initialArr.length === 0) initialArr = DEFAULT_ARRAY;

    let engineData = null;

    switch (selectedAlgoId) {
      case "bubble":
        engineData = generateBubbleSortSteps(initialArr);
        break;
      case "selection":
        engineData = generateSelectionSortSteps(initialArr);
        break;
      case "insertion":
        engineData = generateInsertionSortSteps(initialArr);
        break;
      case "merge":
        engineData = generateMergeSortSteps(initialArr);
        break;
      case "quick":
        engineData = generateQuickSortSteps(initialArr);
        break;
      case "binary-search":
        engineData = generateBinarySearchSteps(initialArr, 45);
        break;
      case "dijkstra":
        engineData = generateDijkstraSteps();
        break;
      case "bfs":
        engineData = generateBFSSteps();
        break;
      case "dfs":
        engineData = generateDFSSteps();
        break;
      case "prims":
        engineData = generatePrimsSteps();
        break;
      case "kruskals":
        engineData = generateKruskalsSteps();
        break;
      case "bst":
        engineData = generateBSTSteps();
        break;
      case "heap":
        engineData = generateHeapSteps();
        break;
      case "avl":
        engineData = generateAVLSteps();
        break;
      case "red-black":
        engineData = generateRedBlackSteps();
        break;
      default:
        engineData = generateBubbleSortSteps(initialArr);
    }

    setAlgoEngine(engineData);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [selectedAlgoId]);

  // Handle playback timer
  useEffect(() => {
    if (isPlaying) {
      const delay = Math.max(1200 / speedMultiplier, 250);
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (!algoEngine || prev >= algoEngine.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, speedMultiplier, algoEngine]);

  const handleNext = () => {
    if (algoEngine && currentStepIdx < algoEngine.steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const handleRandomize = () => {
    const randomArr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 85) + 10);
    setCustomArrayInput(randomArr.join(", "));
    setSelectedAlgoId((prev) => prev); // Trigger re-generate
  };

  const currentAlgoMeta = ALGORITHMS.find((a) => a.id === selectedAlgoId) || ALGORITHMS[0];
  const currentStep = algoEngine?.steps[currentStepIdx] || null;

  const filteredAlgorithms = ALGORITHMS.filter((a) => {
    if (activeCategory === "all") return true;
    return a.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-200/40 via-sky-200/30 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="space-y-3 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-black tracking-wide uppercase border border-violet-200 shadow-xs">
              <span>🧮 Interactive Algorithm Visualizer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Learn Algorithms Step-by-Step with AI Explanations
            </h1>
            <p className="text-sm text-slate-600 max-w-3xl font-medium leading-relaxed">
              Understand <strong>WHY</strong> each operation occurs with step-by-step state visualization, active pseudocode line highlighting, and real-time AI execution analysis.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10 flex-shrink-0">
            <Link
              to="/tutor"
              className="btn-gradient px-4 py-2.5 rounded-2xl text-xs font-black text-white flex items-center gap-2 shadow-sm"
            >
              🤖 Ask AI Tutor About {currentAlgoMeta.name} →
            </Link>
          </div>
        </div>

        {/* Algorithm Category Filter Pills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Select Category:
            </span>
            <span className="text-xs font-bold text-slate-500">
              Showing 15 Core CSE Algorithms
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "all", label: "All Algorithms (15)" },
              { id: "sorting", label: "Sorting (5)" },
              { id: "searching", label: "Searching (1)" },
              { id: "graph", label: "Graph & Shortest Path (5)" },
              { id: "tree", label: "Trees & Heaps (4)" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all border flex-shrink-0 ${
                  activeCategory === cat.id
                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Algorithm Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
            {filteredAlgorithms.map((algo) => {
              const isSelected = selectedAlgoId === algo.id;
              return (
                <button
                  key={algo.id}
                  onClick={() => setSelectedAlgoId(algo.id)}
                  className={`p-3 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? "bg-gradient-to-br from-violet-600 to-indigo-700 text-white border-violet-600 shadow-lg scale-[1.02]"
                      : "bg-white text-slate-800 border-slate-200 hover:border-violet-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{algo.icon}</span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {algo.difficulty}
                    </span>
                  </div>
                  <span className="text-xs font-black truncate">{algo.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTROLS TOOLBAR & PLAYBACK ENGINE */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Algorithm Title & Step Progress */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentAlgoMeta.icon}</span>
              <h2 className="text-lg font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {currentAlgoMeta.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-bold">
              Step {currentStepIdx + 1} of {algoEngine?.steps.length || 1}
            </p>
          </div>

          {/* Playback Button Group */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleReset}
              title="Reset Execution"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center gap-1.5 transition-all"
            >
              🔄 Reset
            </button>

            <button
              onClick={handlePrev}
              disabled={currentStepIdx === 0}
              title="Previous Step"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs disabled:opacity-40 transition-all"
            >
              ⏮️ Prev Step
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black text-white flex items-center gap-2 shadow-sm transition-all ${
                isPlaying ? "bg-amber-500 hover:bg-amber-600" : "btn-gradient active:scale-95"
              }`}
            >
              {isPlaying ? "⏸️ Pause" : "▶️ Play Animation"}
            </button>

            <button
              onClick={handleNext}
              disabled={!algoEngine || currentStepIdx >= algoEngine.steps.length - 1}
              title="Next Step"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs disabled:opacity-40 transition-all"
            >
              Next Step ⏭️
            </button>

            {(currentAlgoMeta.category === "sorting" || currentAlgoMeta.category === "searching") && (
              <button
                onClick={handleRandomize}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all"
              >
                🎲 Random Data
              </button>
            )}
          </div>

          {/* Speed Slider */}
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <span className="text-xs font-extrabold text-slate-500 uppercase">Speed:</span>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100">
              {[0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSpeedMultiplier(spd)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                    speedMultiplier === spd
                      ? "bg-violet-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN VISUAL CANVAS & AI STEP EXPLANATION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols): Visualizer Engine */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wide">
                  Execution State Canvas
                </span>
                <span className="text-xs font-bold text-violet-700">
                  {currentAlgoMeta.name} Execution
                </span>
              </div>

              {/* Render dynamic sub-visualizer component */}
              {(currentAlgoMeta.category === "sorting" || currentAlgoMeta.category === "searching") && (
                <SortingVisualizer
                  stepData={currentStep}
                  isBinarySearch={selectedAlgoId === "binary-search"}
                />
              )}

              {currentAlgoMeta.category === "graph" && (
                <GraphVisualizer stepData={currentStep} algorithmId={selectedAlgoId} />
              )}

              {currentAlgoMeta.category === "tree" && (
                <TreeVisualizer stepData={currentStep} algorithmId={selectedAlgoId} />
              )}
            </div>

            {/* AI Explanation Box */}
            {currentStep?.aiExplanation && (
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-950 to-slate-900 text-white border border-indigo-800 shadow-xl space-y-2 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🤖</span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-violet-300">
                    AI Execution Analysis (WHY This Step Happens):
                  </h3>
                </div>
                <p className="text-sm font-medium leading-relaxed text-slate-200 whitespace-pre-line">
                  {currentStep.aiExplanation}
                </p>
              </div>
            )}
          </div>

          {/* Right Column (1 Col): Pseudocode & Complexity Cards */}
          <div className="space-y-6">
            {/* Pseudocode Panel */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-violet-400">
                  Pseudocode Execution
                </span>
                <span className="text-[10px] font-bold text-slate-400">Line Tracking</span>
              </div>

              <div className="font-mono text-xs space-y-1.5 overflow-x-auto">
                {algoEngine?.pseudocode?.map((lineStr, lIdx) => {
                  const isCurrentLine = currentStep?.codeLine === lIdx + 1;
                  return (
                    <div
                      key={lIdx}
                      className={`p-2 rounded-xl transition-all duration-200 flex items-start gap-3 ${
                        isCurrentLine
                          ? "bg-violet-600 text-white font-extrabold shadow-md scale-[1.02] border-l-4 border-amber-400"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-[10px] font-mono text-slate-500 w-4 text-right flex-shrink-0">
                        {lIdx + 1}
                      </span>
                      <pre className="font-mono text-xs whitespace-pre-wrap">{lineStr}</pre>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Complexity Analysis Cards */}
            {algoEngine?.complexity && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  Complexity Analysis:
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-violet-50 border border-violet-200 space-y-0.5">
                    <div className="text-[10px] font-bold text-violet-800 uppercase">Worst Time</div>
                    <div className="text-sm font-black text-violet-950 font-mono">
                      {algoEngine.complexity.time}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-0.5">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase">Best Time</div>
                    <div className="text-sm font-black text-emerald-950 font-mono">
                      {algoEngine.complexity.bestTime || algoEngine.complexity.time}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 space-y-0.5 col-span-2">
                    <div className="text-[10px] font-bold text-sky-800 uppercase">Space Complexity</div>
                    <div className="text-sm font-black text-sky-950 font-mono">
                      {algoEngine.complexity.space}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmVisualizerPage;
