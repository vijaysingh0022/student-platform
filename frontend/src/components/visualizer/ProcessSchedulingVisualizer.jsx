import React, { useState, useEffect, useRef, useMemo } from "react";

// Distinct accessible colors for processes
const PROCESS_COLORS = [
  { bg: "#3b82f6", border: "#1d4ed8", light: "#eff6ff", text: "#1e40af" }, // Blue
  { bg: "#10b981", border: "#047857", light: "#ecfdf5", text: "#065f46" }, // Emerald
  { bg: "#f59e0b", border: "#b45309", light: "#fffbeb", text: "#92400e" }, // Amber
  { bg: "#8b5cf6", border: "#6d28d9", light: "#f5f3ff", text: "#5b21b6" }, // Violet
  { bg: "#ec4899", border: "#be185d", light: "#fdf2f8", text: "#9d174d" }, // Pink
  { bg: "#06b6d4", border: "#0e7490", light: "#ecfeff", text: "#155e75" }, // Cyan
  { bg: "#f97316", border: "#c2410c", light: "#fff7ed", text: "#9a3412" }, // Orange
];

const PRESETS = [
  {
    name: "Standard Textbook (Example 1)",
    quantum: 2,
    processes: [
      { id: "P1", arrivalTime: 0, burstTime: 5 },
      { id: "P2", arrivalTime: 1, burstTime: 4 },
      { id: "P3", arrivalTime: 2, burstTime: 2 },
      { id: "P4", arrivalTime: 3, burstTime: 6 },
    ],
  },
  {
    name: "GATE CS Question (Equal AT)",
    quantum: 3,
    processes: [
      { id: "P1", arrivalTime: 0, burstTime: 8 },
      { id: "P2", arrivalTime: 0, burstTime: 5 },
      { id: "P3", arrivalTime: 0, burstTime: 2 },
      { id: "P4", arrivalTime: 0, burstTime: 4 },
    ],
  },
  {
    name: "Staggered Arrivals (High Preemption)",
    quantum: 2,
    processes: [
      { id: "P1", arrivalTime: 0, burstTime: 4 },
      { id: "P2", arrivalTime: 2, burstTime: 5 },
      { id: "P3", arrivalTime: 4, burstTime: 2 },
      { id: "P4", arrivalTime: 6, burstTime: 3 },
      { id: "P5", arrivalTime: 8, burstTime: 1 },
    ],
  },
];

// Pure algorithm simulation function
export const simulateRoundRobin = (rawProcesses, rawQuantum) => {
  const quantum = Math.max(1, parseInt(rawQuantum, 10) || 2);
  const processes = rawProcesses.map((p, idx) => ({
    id: p.id || `P${idx + 1}`,
    arrivalTime: Math.max(0, parseInt(p.arrivalTime, 10) || 0),
    burstTime: Math.max(1, parseInt(p.burstTime, 10) || 1),
    color: PROCESS_COLORS[idx % PROCESS_COLORS.length],
  }));

  const n = processes.length;
  if (n === 0) {
    return {
      gantt: [],
      steps: [],
      processResults: [],
      metrics: { awt: 0, atat: 0, art: 0, cpuUtil: 100, totalTime: 0 },
    };
  }

  // Clone remaining burst times and state
  const remaining = {};
  const firstResponse = {};
  const completionTime = {};
  processes.forEach((p) => {
    remaining[p.id] = p.burstTime;
  });

  const gantt = [];
  const steps = [];
  let currentTime = 0;
  let completedCount = 0;

  // Track processes queued or arrived
  const arrivedSet = new Set();
  const readyQueue = [];

  // Helper to admit new arrivals at or before time t
  const admitArrivals = (upToTime) => {
    // Sort newly arrived by arrivalTime, then process order
    const toAdmit = processes
      .filter((p) => p.arrivalTime <= upToTime && !arrivedSet.has(p.id))
      .sort((a, b) => a.arrivalTime - b.arrivalTime);

    toAdmit.forEach((p) => {
      arrivedSet.add(p.id);
      readyQueue.push(p.id);
    });
  };

  // Initial arrivals at time 0
  admitArrivals(0);

  // Safety break to prevent infinite loops (max 1000 context switches)
  let loopCount = 0;

  while (completedCount < n && loopCount < 1000) {
    loopCount++;

    if (readyQueue.length === 0) {
      // CPU Idle: Jump to next arrival time
      const unarrived = processes.filter((p) => !arrivedSet.has(p.id));
      if (unarrived.length > 0) {
        const nextArrival = Math.min(...unarrived.map((p) => p.arrivalTime));
        const idleDuration = nextArrival - currentTime;

        gantt.push({
          id: "IDLE",
          start: currentTime,
          end: nextArrival,
          duration: idleDuration,
          isIdle: true,
          color: { bg: "#94a3b8", border: "#64748b", light: "#f1f5f9", text: "#475569" },
        });

        steps.push({
          stepIndex: steps.length + 1,
          time: nextArrival,
          currentBlock: { id: "IDLE", start: currentTime, end: nextArrival },
          activeProcessId: "IDLE",
          execTime: idleDuration,
          remainingAfter: 0,
          readyQueueSnapshot: [],
          allRemainingSnapshot: { ...remaining },
          completedList: Object.keys(completionTime),
          explanation: {
            english: `CPU is IDLE from t=${currentTime} to t=${nextArrival} because no process has arrived yet.`,
            simpler: `CPU free baitha hai kyunki koi bhi process system me nahi aaya hai.`,
            hinglish: `CPU t=${currentTime} se t=${nextArrival} tak IDLE raha kyunki agli process t=${nextArrival} par aayegi.`,
            whySwitch: `No process available in the Ready Queue.`,
          },
          nextProcessId: unarrived[0].id,
        });

        currentTime = nextArrival;
        admitArrivals(currentTime);
        continue;
      } else {
        break;
      }
    }

    // Pick process from front of queue
    const pid = readyQueue.shift();
    const proc = processes.find((p) => p.id === pid);

    // Record response time on first CPU dispatch
    if (firstResponse[pid] === undefined) {
      firstResponse[pid] = currentTime - proc.arrivalTime;
    }

    const execSlice = Math.min(quantum, remaining[pid]);
    const startTime = currentTime;
    const endTime = currentTime + execSlice;

    remaining[pid] -= execSlice;
    currentTime = endTime;

    // Check newly arrived processes during (startTime, endTime] BEFORE re-inserting preempted process
    admitArrivals(currentTime);

    const isFinished = remaining[pid] === 0;
    if (isFinished) {
      completionTime[pid] = currentTime;
      completedCount++;
    } else {
      // Preempted: Reinsert at tail of ready queue
      readyQueue.push(pid);
    }

    const ganttBlock = {
      id: pid,
      start: startTime,
      end: endTime,
      duration: execSlice,
      isIdle: false,
      color: proc.color,
    };
    gantt.push(ganttBlock);

    // Detailed multi-lingual step explanations
    const nextInLine = readyQueue.length > 0 ? readyQueue[0] : isFinished && completedCount < n ? "Pending Arrival" : "None (All Complete)";
    const explEnglish = isFinished
      ? `Process ${pid} executes for ${execSlice} unit(s) and COMPLETES at t=${currentTime}. It is removed from the system. Next process in queue: ${nextInLine}.`
      : `Process ${pid} executes for ${execSlice} unit(s) (Time Quantum = ${quantum}). It still has ${remaining[pid]} burst unit(s) remaining. Preempted and moved to the back of the Ready Queue. Next in line: ${nextInLine}.`;

    const explSimpler = isFinished
      ? `${pid} finished all its work at time ${currentTime}! It leaves the CPU.`
      : `${pid} used its allowed time (${execSlice}s). It has ${remaining[pid]}s left, so it goes to the back of the line.`;

    const explHinglish = isFinished
      ? `${pid} ne apna saara kaam complete kar liya t=${currentTime} par aur exit ho gaya. Ab baaki processes execute hongi.`
      : `${pid} ko ${execSlice} time units CPU mila. Time quantum khatam hone par ye wapas Ready Queue ke aakhiri me chala gaya. Bacha hua burst time = ${remaining[pid]}.`;

    const whySwitch = isFinished
      ? `${pid} finished its entire burst time (remaining = 0).`
      : `Time Quantum of ${quantum} units expired for ${pid}, triggering context switch.`;

    steps.push({
      stepIndex: steps.length + 1,
      time: currentTime,
      currentBlock: ganttBlock,
      activeProcessId: pid,
      execTime: execSlice,
      remainingAfter: remaining[pid],
      readyQueueSnapshot: [...readyQueue],
      allRemainingSnapshot: { ...remaining },
      completedList: Object.keys(completionTime),
      explanation: {
        english: explEnglish,
        simpler: explSimpler,
        hinglish: explHinglish,
        whySwitch,
      },
      nextProcessId: nextInLine,
    });
  }

  // Calculate standard metrics for each process
  const processResults = processes.map((p) => {
    const ct = completionTime[p.id] !== undefined ? completionTime[p.id] : p.arrivalTime + p.burstTime;
    const tat = ct - p.arrivalTime;
    const wt = tat - p.burstTime;
    const rt = firstResponse[p.id] !== undefined ? firstResponse[p.id] : wt;

    return {
      ...p,
      ct,
      tat,
      wt,
      rt,
    };
  });

  const totalWT = processResults.reduce((acc, p) => acc + p.wt, 0);
  const totalTAT = processResults.reduce((acc, p) => acc + p.tat, 0);
  const totalRT = processResults.reduce((acc, p) => acc + p.rt, 0);
  const totalExecTime = currentTime;

  const idleTime = gantt.filter((g) => g.isIdle).reduce((acc, g) => acc + g.duration, 0);
  const cpuUtil = totalExecTime > 0 ? Math.round(((totalExecTime - idleTime) / totalExecTime) * 100) : 100;

  return {
    gantt,
    steps,
    processResults,
    metrics: {
      awt: (totalWT / n).toFixed(2),
      atat: (totalTAT / n).toFixed(2),
      art: (totalRT / n).toFixed(2),
      cpuUtil,
      totalTime: totalExecTime,
    },
  };
};

export const ProcessSchedulingVisualizer = () => {
  // Input states
  const [processes, setProcesses] = useState(PRESETS[0].processes);
  const [quantum, setQuantum] = useState(PRESETS[0].quantum);
  const [mode, setMode] = useState("learn"); // 'learn' | 'practice' | 'exam'
  const [explanationLang, setExplanationLang] = useState("english"); // 'english' | 'hinglish' | 'simpler' | 'why'

  // Playback & Animation states
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 0.5x, 1x, 1.5x, 2x

  // Practice Mode (Predict Next Process) states
  const [predictionSelected, setPredictionSelected] = useState(null);
  const [predictionFeedback, setPredictionFeedback] = useState(null);
  const [predictionStats, setPredictionStats] = useState({ correct: 0, total: 0 });

  // Exam Mode states
  const [examAnswers, setExamAnswers] = useState({});
  const [examEvaluated, setExamEvaluated] = useState(false);
  const [examScore, setExamScore] = useState(null);

  const timerRef = useRef(null);

  // Compute live simulation on input changes
  const simulation = useMemo(() => {
    return simulateRoundRobin(processes, quantum);
  }, [processes, quantum]);

  const maxSteps = simulation.steps.length;

  // Reset or clamp step index if simulation changes
  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
    setPredictionSelected(null);
    setPredictionFeedback(null);
    setExamEvaluated(false);
    setExamAnswers({});
  }, [processes, quantum]);

  // Animation player loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalTime = Math.max(300, 1600 / speedMultiplier);

    timerRef.current = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev >= maxSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, maxSteps, speedMultiplier]);

  // Current step state snapshot
  const currentStep = simulation.steps[currentStepIdx] || simulation.steps[0] || null;
  const currentBlock = currentStep ? currentStep.currentBlock : null;
  const activeProcessObj = currentStep
    ? processes.find((p) => p.id === currentStep.activeProcessId)
    : null;

  // Handles adding new process
  const handleAddProcess = () => {
    if (processes.length >= 7) return;
    const nextNum = processes.length + 1;
    const lastAT = processes.length > 0 ? processes[processes.length - 1].arrivalTime : 0;
    setProcesses([
      ...processes,
      { id: `P${nextNum}`, arrivalTime: lastAT + 1, burstTime: 4 },
    ]);
  };

  // Handles removing process
  const handleRemoveProcess = (id) => {
    if (processes.length <= 1) return;
    setProcesses(processes.filter((p) => p.id !== id));
  };

  // Handles editing process property
  const handleProcessChange = (id, field, value) => {
    const val = field === "id" ? value : Math.max(0, parseInt(value, 10) || 0);
    setProcesses(
      processes.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  // Load Preset
  const handleLoadPreset = (preset) => {
    setProcesses(preset.processes);
    setQuantum(preset.quantum);
  };

  // Reset to default
  const handleReset = () => {
    setProcesses(PRESETS[0].processes);
    setQuantum(PRESETS[0].quantum);
    setCurrentStepIdx(0);
    setIsPlaying(false);
    setPredictionSelected(null);
    setPredictionFeedback(null);
  };

  // Handle Practice Prediction
  const handlePredictNext = (selectedPid) => {
    if (!currentStep) return;
    const correctPid = currentStep.nextProcessId;
    setPredictionSelected(selectedPid);

    const isMatch = selectedPid === correctPid;
    setPredictionFeedback(
      isMatch
        ? { correct: true, msg: `✓ Correct! ${correctPid} is scheduled next as per the Ready Queue priority.` }
        : { correct: false, msg: `✕ Incorrect. The next process is ${correctPid} because it is at the front of the Ready Queue.` }
    );

    setPredictionStats((prev) => ({
      correct: prev.correct + (isMatch ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  // Evaluate Exam Mode
  const handleEvaluateExam = () => {
    let earned = 0;
    const totalFields = simulation.processResults.length * 3; // CT, TAT, WT

    simulation.processResults.forEach((p) => {
      const userCT = parseInt(examAnswers[`${p.id}_ct`], 10);
      const userTAT = parseInt(examAnswers[`${p.id}_tat`], 10);
      const userWT = parseInt(examAnswers[`${p.id}_wt`], 10);

      if (userCT === p.ct) earned++;
      if (userTAT === p.tat) earned++;
      if (userWT === p.wt) earned++;
    });

    const pct = Math.round((earned / totalFields) * 100);
    setExamScore({ earned, totalFields, pct });
    setExamEvaluated(true);
  };

  return (
    <div className="w-full space-y-6 pb-12 text-slate-900 animate-fadeIn">
      {/* ── HEADER & MODE TABS ── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-200">
              Interactive OS Systems Lab
            </span>
            <span className="text-xs font-semibold text-slate-400">CPU Scheduling Algorithms</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Round Robin (RR) CPU Scheduling & Interactive Gantt Chart
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real dynamic preemption engine with live Ready Queue, CPU state timeline, and semester exam evaluation.
          </p>
        </div>

        {/* Learning Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shrink-0 self-start md:self-auto">
          {[
            { id: "learn", label: "Learn Mode", icon: "📚" },
            { id: "practice", label: "Practice (Predict)", icon: "🎯" },
            { id: "exam", label: "Exam Mode", icon: "📝" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setMode(tab.id); setIsPlaying(false); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === tab.id
                  ? "bg-white text-blue-700 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN 3-COLUMN WORKBENCH LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT COLUMN: INPUT TABLE & CONTROLS (Col 4) ── */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Process Parameters</h3>
                <p className="text-[11px] text-slate-400">Configure Arrival and Burst Times</p>
              </div>
              <button
                onClick={handleAddProcess}
                disabled={processes.length >= 7}
                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-all disabled:opacity-40"
              >
                + Add Process
              </button>
            </div>

            {/* Time Quantum Selector */}
            <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-950 uppercase tracking-wider">
                  Time Quantum (q)
                </span>
                <span className="text-xs font-black text-blue-700 font-mono bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-xs">
                  {quantum} unit(s)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((qVal) => (
                  <button
                    key={qVal}
                    onClick={() => setQuantum(qVal)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      quantum === qVal
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-blue-50"
                    }`}
                  >
                    {qVal}
                  </button>
                ))}
              </div>
            </div>

            {/* Processes Input Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Process</th>
                    <th className="py-2.5 px-2">Arrival (AT)</th>
                    <th className="py-2.5 px-2">Burst (BT)</th>
                    <th className="py-2.5 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {processes.map((p, idx) => {
                    const color = PROCESS_COLORS[idx % PROCESS_COLORS.length];
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: color.bg }}
                            />
                            <input
                              type="text"
                              value={p.id}
                              onChange={(e) => handleProcessChange(p.id, "id", e.target.value)}
                              className="w-12 px-1.5 py-1 rounded-lg border border-slate-200 font-black text-slate-800 text-xs text-center focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={p.arrivalTime}
                            onChange={(e) => handleProcessChange(p.id, "arrivalTime", e.target.value)}
                            className="w-14 px-2 py-1 rounded-lg border border-slate-200 font-mono text-slate-800 text-xs text-center focus:outline-none focus:border-blue-500"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={p.burstTime}
                            onChange={(e) => handleProcessChange(p.id, "burstTime", e.target.value)}
                            className="w-14 px-2 py-1 rounded-lg border border-slate-200 font-mono text-slate-800 text-xs text-center focus:outline-none focus:border-blue-500"
                          />
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button
                            onClick={() => handleRemoveProcess(p.id)}
                            disabled={processes.length <= 1}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-30"
                            title="Delete Process"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Presets and Controls */}
            <div className="space-y-2 pt-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Load Standard Presets:
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {PRESETS.map((pr) => (
                  <button
                    key={pr.name}
                    onClick={() => handleLoadPreset(pr)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-all flex items-center justify-between"
                  >
                    <span className="truncate">{pr.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">q={pr.quantum}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                ↻ Reset
              </button>
              <button
                onClick={() => { setCurrentStepIdx(0); setIsPlaying(true); }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <span>⚡</span> Run Simulation
              </button>
            </div>
          </div>
        </div>

        {/* ── CENTER & RIGHT COLUMNS: GANTT CHART, READY QUEUE, CPU (Col 8) ── */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* ── PROMINENT GANTT CHART DISPLAY ── */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
                  Timeline Visualizer
                </span>
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  Interactive Round Robin Gantt Chart
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  Step {Math.min(currentStepIdx + 1, maxSteps)} of {maxSteps}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-black bg-slate-100 text-slate-800 border border-slate-200">
                  t = {currentStep ? currentStep.time : 0}
                </span>
              </div>
            </div>

            {/* The Gantt Chart Canvas */}
            <div className="space-y-3 pt-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>CPU Execution Timeline</span>
                <span className="text-[10px] text-slate-400 font-normal">Blocks sized proportionally to burst slice</span>
              </div>

              {/* Gantt Bar */}
              <div className="w-full rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100/80 shadow-inner flex h-20 relative">
                {simulation.gantt.map((block, idx) => {
                  const isCurrent = currentStepIdx === idx;
                  const isPastOrCurrent = idx <= currentStepIdx;
                  const duration = block.end - block.start;

                  return (
                    <div
                      key={idx}
                      style={{
                        flex: duration,
                        backgroundColor: isPastOrCurrent ? block.color.bg : "#cbd5e1",
                        opacity: isPastOrCurrent ? 1 : 0.45,
                      }}
                      className={`h-full flex flex-col items-center justify-center text-white font-black text-xs border-r border-white/30 transition-all relative select-none ${
                        isCurrent
                          ? "ring-4 ring-offset-2 ring-blue-500 z-10 scale-[1.02] shadow-lg animate-pulse"
                          : ""
                      }`}
                    >
                      <span className="text-sm font-black drop-shadow-sm tracking-wide">
                        {block.id}
                      </span>
                      <span className="text-[10px] font-mono opacity-90 font-bold">
                        Δ {duration}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Time Ruler Numbers Below Gantt Chart */}
              <div className="flex w-full text-[11px] font-mono font-black text-slate-600 px-0.5 select-none overflow-x-auto">
                <div className="shrink-0 text-left w-6">0</div>
                {simulation.gantt.map((block, idx) => {
                  const duration = block.end - block.start;
                  return (
                    <div
                      key={idx}
                      style={{ flex: duration }}
                      className="text-right pr-0.5"
                    >
                      {block.end}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Playback Controls Toolbar */}
            <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              {/* Stepper Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { setIsPlaying(false); setCurrentStepIdx(0); }}
                  disabled={currentStepIdx === 0}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all disabled:opacity-40"
                  title="First Step"
                >
                  ⏮
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setCurrentStepIdx((p) => Math.max(0, p - 1)); }}
                  disabled={currentStepIdx === 0}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all disabled:opacity-40"
                >
                  ◀ Previous
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-sm flex items-center gap-1.5"
                >
                  {isPlaying ? "⏸ Pause" : "▶ Play"}
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setCurrentStepIdx((p) => Math.min(maxSteps - 1, p + 1)); }}
                  disabled={currentStepIdx >= maxSteps - 1}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all disabled:opacity-40"
                >
                  Next ▶
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setCurrentStepIdx(maxSteps - 1); }}
                  disabled={currentStepIdx >= maxSteps - 1}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all disabled:opacity-40"
                  title="Last Step"
                >
                  ⏭
                </button>
              </div>

              {/* Speed Multiplier */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <span className="text-[10px] uppercase text-slate-400">Speed:</span>
                {[0.5, 1, 1.5, 2].map((sp) => (
                  <button
                    key={sp}
                    onClick={() => setSpeedMultiplier(sp)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                      speedMultiplier === sp
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {sp}x
                  </button>
                ))}
              </div>

              {/* Scrubber slider */}
              <div className="flex items-center gap-2 w-full sm:w-auto flex-1 sm:max-w-xs">
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, maxSteps - 1)}
                  value={currentStepIdx}
                  onChange={(e) => { setIsPlaying(false); setCurrentStepIdx(parseInt(e.target.value, 10)); }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* ── TWO PANELS: READY QUEUE & CURRENT CPU STATE ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              
              {/* Ready Queue Live Visualization */}
              <div className="bg-slate-50/90 rounded-2xl border border-slate-200/90 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Ready Queue
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {currentStep?.readyQueueSnapshot.length || 0} process(es)
                  </span>
                </div>

                <div className="min-h-14 flex items-center gap-2 overflow-x-auto p-2 bg-white rounded-xl border border-slate-200 shadow-inner">
                  {currentStep && currentStep.readyQueueSnapshot.length > 0 ? (
                    currentStep.readyQueueSnapshot.map((pid, qIdx) => {
                      const pObj = processes.find((p) => p.id === pid);
                      const rem = currentStep.allRemainingSnapshot[pid];
                      return (
                        <div key={`${pid}-${qIdx}`} className="flex items-center gap-2 shrink-0 animate-fadeIn">
                          <div className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 shadow-xs">
                            <span className="text-xs font-black">{pid}</span>
                            <span className="text-[9px] font-mono text-slate-500">rem: {rem}</span>
                          </div>
                          {qIdx < currentStep.readyQueueSnapshot.length - 1 && (
                            <span className="text-slate-400 font-black text-xs">→</span>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-xs text-slate-400 font-medium italic w-full text-center py-2">
                      Queue is currently empty
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 leading-snug">
                  Processes are executed from Left (Head) to Right (Tail). Preempted processes return to tail.
                </p>
              </div>

              {/* Current CPU State Panel */}
              <div className="bg-slate-50/90 rounded-2xl border border-slate-200/90 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                    CPU Core Status
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    Busy
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Executing</p>
                    <p className="text-sm font-black text-blue-700 mt-0.5">
                      {currentStep?.activeProcessId || "None"}
                    </p>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Time Slice</p>
                    <p className="text-sm font-black text-slate-800 font-mono mt-0.5">
                      {currentStep?.execTime || 0} / {quantum}
                    </p>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Remaining Burst</p>
                    <p className="text-sm font-black text-slate-800 font-mono mt-0.5">
                      {currentStep?.remainingAfter !== undefined ? `${currentStep.remainingAfter} unit(s)` : "—"}
                    </p>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Next Up</p>
                    <p className="text-sm font-black text-indigo-700 mt-0.5">
                      {currentStep?.nextProcessId || "Complete"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── STEP EXPLANATION & HINGLISH TOGGLE (LEARN MODE) ── */}
            {mode === "learn" && currentStep && (
              <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 rounded-2xl border border-blue-200/80 p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    <h4 className="text-xs font-black text-blue-950 uppercase tracking-wider">
                      Step {currentStepIdx + 1} Explanation
                    </h4>
                  </div>
                  {/* Language switchers */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { id: "english", label: "English" },
                      { id: "simpler", label: "Explain Simpler" },
                      { id: "hinglish", label: "Hinglish" },
                      { id: "why", label: "Why did CPU switch?" },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => setExplanationLang(btn.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                          explanationLang === btn.id
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-blue-50"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-blue-100 shadow-xs text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                  {explanationLang === "english" && currentStep.explanation.english}
                  {explanationLang === "simpler" && currentStep.explanation.simpler}
                  {explanationLang === "hinglish" && currentStep.explanation.hinglish}
                  {explanationLang === "why" && currentStep.explanation.whySwitch}
                </div>
              </div>
            )}

            {/* ── PRACTICE MODE: PREDICT THE NEXT PROCESS ── */}
            {mode === "practice" && currentStep && (
              <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    <div>
                      <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                        Practice Quiz: Predict Next Process
                      </h4>
                      <p className="text-[11px] text-amber-800">
                        At time t={currentStep.time}, which process will get the CPU next?
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-amber-900">
                      Score: {predictionStats.correct} / {predictionStats.total}
                    </span>
                  </div>
                </div>

                {/* Option buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {processes.map((p) => {
                    const isSelected = predictionSelected === p.id;
                    const isCorrect = currentStep.nextProcessId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handlePredictNext(p.id)}
                        className={`p-3 rounded-xl text-xs font-black transition-all border flex items-center justify-center gap-2 ${
                          isSelected
                            ? isCorrect
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                              : "bg-rose-600 text-white border-rose-600 shadow-sm"
                            : "bg-white hover:bg-amber-100 text-slate-800 border-amber-200"
                        }`}
                      >
                        <span>{p.id}</span>
                        {isSelected && <span>{isCorrect ? "✓" : "✕"}</span>}
                      </button>
                    );
                  })}
                </div>

                {predictionFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold border ${
                      predictionFeedback.correct
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}
                  >
                    {predictionFeedback.msg}
                  </div>
                )}
              </div>
            )}

            {/* ── EXAM MODE: STUDENT SOLVES WT / TAT ── */}
            {mode === "exam" && (
              <div className="bg-violet-50/70 rounded-2xl border border-violet-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📝</span>
                    <div>
                      <h4 className="text-xs font-black text-violet-950 uppercase tracking-wider">
                        Exam Simulator: Calculate CT, TAT and WT
                      </h4>
                      <p className="text-[11px] text-violet-800">
                        Solve this Round Robin problem manually and verify your calculations!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-violet-200 bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-violet-100/60 font-bold text-violet-950 text-[10px] uppercase">
                      <tr>
                        <th className="p-2.5">Process</th>
                        <th className="p-2.5">AT</th>
                        <th className="p-2.5">BT</th>
                        <th className="p-2.5">Your CT</th>
                        <th className="p-2.5">Your TAT</th>
                        <th className="p-2.5">Your WT</th>
                        {examEvaluated && <th className="p-2.5 text-center">Correct?</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-violet-100">
                      {simulation.processResults.map((p) => {
                        const ctCorrect = parseInt(examAnswers[`${p.id}_ct`], 10) === p.ct;
                        const tatCorrect = parseInt(examAnswers[`${p.id}_tat`], 10) === p.tat;
                        const wtCorrect = parseInt(examAnswers[`${p.id}_wt`], 10) === p.wt;
                        const allGood = ctCorrect && tatCorrect && wtCorrect;

                        return (
                          <tr key={p.id}>
                            <td className="p-2.5 font-black text-slate-800">{p.id}</td>
                            <td className="p-2.5 font-mono text-slate-600">{p.arrivalTime}</td>
                            <td className="p-2.5 font-mono text-slate-600">{p.burstTime}</td>
                            <td className="p-2.5">
                              <input
                                type="number"
                                placeholder={examEvaluated ? String(p.ct) : "CT"}
                                value={examAnswers[`${p.id}_ct`] || ""}
                                onChange={(e) => setExamAnswers({ ...examAnswers, [`${p.id}_ct`]: e.target.value })}
                                className="w-14 px-2 py-1 rounded-lg border border-slate-200 font-mono text-xs text-center"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="number"
                                placeholder={examEvaluated ? String(p.tat) : "TAT"}
                                value={examAnswers[`${p.id}_tat`] || ""}
                                onChange={(e) => setExamAnswers({ ...examAnswers, [`${p.id}_tat`]: e.target.value })}
                                className="w-14 px-2 py-1 rounded-lg border border-slate-200 font-mono text-xs text-center"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="number"
                                placeholder={examEvaluated ? String(p.wt) : "WT"}
                                value={examAnswers[`${p.id}_wt`] || ""}
                                onChange={(e) => setExamAnswers({ ...examAnswers, [`${p.id}_wt`]: e.target.value })}
                                className="w-14 px-2 py-1 rounded-lg border border-slate-200 font-mono text-xs text-center"
                              />
                            </td>
                            {examEvaluated && (
                              <td className="p-2.5 text-center font-bold">
                                {allGood ? (
                                  <span className="text-emerald-600">✓ Pass</span>
                                ) : (
                                  <span className="text-rose-600 text-[10px]">
                                    Expected: {p.ct}, {p.tat}, {p.wt}
                                  </span>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={handleEvaluateExam}
                    className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-black shadow-sm transition-all"
                  >
                    Check My Answers →
                  </button>
                  {examScore && (
                    <div className="text-xs font-black text-violet-900 bg-white px-3 py-1.5 rounded-xl border border-violet-200 shadow-xs">
                      Score: {examScore.earned} / {examScore.totalFields} ({examScore.pct}%)
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION: COMPLETE PERFORMANCE SUMMARY & RESULT TABLE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Performance Metrics Cards (Col 4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Performance Summary
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Avg Waiting Time</p>
              <p className="text-xl font-black text-blue-700 mt-1">{simulation.metrics.awt} <span className="text-xs font-normal">ms</span></p>
            </div>
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Avg Turnaround</p>
              <p className="text-xl font-black text-indigo-700 mt-1">{simulation.metrics.atat} <span className="text-xs font-normal">ms</span></p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Avg Response Time</p>
              <p className="text-xl font-black text-emerald-700 mt-1">{simulation.metrics.art} <span className="text-xs font-normal">ms</span></p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase">CPU Utilization</p>
              <p className="text-xl font-black text-amber-700 mt-1">{simulation.metrics.cpuUtil}%</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
            <strong className="text-slate-800 block mb-0.5">Formulas:</strong>
            Turnaround Time (TAT) = Completion Time − Arrival Time<br />
            Waiting Time (WT) = Turnaround Time − Burst Time
          </div>
        </div>

        {/* Process Result Table (Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Real Simulation Results Table
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Calculated dynamically from the executed Round Robin state
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">Total Time: {simulation.metrics.totalTime} ms</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 font-black text-slate-700 uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Process</th>
                  <th className="py-3 px-3">Arrival (AT)</th>
                  <th className="py-3 px-3">Burst (BT)</th>
                  <th className="py-3 px-3 text-blue-700">Completion (CT)</th>
                  <th className="py-3 px-3 text-indigo-700">Turnaround (TAT)</th>
                  <th className="py-3 px-3 text-emerald-700">Waiting (WT)</th>
                  <th className="py-3 px-3 text-amber-700">Response (RT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {simulation.processResults.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-4 font-black">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: p.color.bg }}
                        />
                        <span>{p.id}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-600">{p.arrivalTime}</td>
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-600">{p.burstTime}</td>
                    <td className="py-2.5 px-3 font-mono font-black text-blue-700">{p.ct}</td>
                    <td className="py-2.5 px-3 font-mono font-black text-indigo-700">{p.tat}</td>
                    <td className="py-2.5 px-3 font-mono font-black text-emerald-700">{p.wt}</td>
                    <td className="py-2.5 px-3 font-mono font-black text-amber-700">{p.rt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProcessSchedulingVisualizer;
