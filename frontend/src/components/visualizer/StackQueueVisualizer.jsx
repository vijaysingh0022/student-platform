import React, { useState } from "react";

const StackQueueVisualizer = () => {
  const [activeTab, setActiveTab] = useState("stack"); // "stack" | "queue"
  const [stackItems, setStackItems] = useState([10, 20, 30]);
  const [queueItems, setQueueItems] = useState([10, 20, 30]);
  const [inputVal, setInputVal] = useState("");
  const [message, setMessage] = useState("Perform operations to see LIFO vs FIFO dynamics in real-time.");

  const handleStackPush = () => {
    const val = parseInt(inputVal, 10) || Math.floor(Math.random() * 90 + 10);
    if (stackItems.length >= 6) {
      setMessage("Stack Overflow! Maximum capacity reached (6 items).");
      return;
    }
    setStackItems([...stackItems, val]);
    setInputVal("");
    setMessage(`Pushed ${val} onto top of Stack. (Time: O(1))`);
  };

  const handleStackPop = () => {
    if (stackItems.length === 0) {
      setMessage("Stack Underflow! Cannot pop from an empty stack.");
      return;
    }
    const popped = stackItems[stackItems.length - 1];
    setStackItems(stackItems.slice(0, -1));
    setMessage(`Popped ${popped} from top of Stack. (LIFO: Last-In, First-Out).`);
  };

  const handleQueueEnqueue = () => {
    const val = parseInt(inputVal, 10) || Math.floor(Math.random() * 90 + 10);
    if (queueItems.length >= 6) {
      setMessage("Queue Overflow! Maximum capacity reached (6 items).");
      return;
    }
    setQueueItems([...queueItems, val]);
    setInputVal("");
    setMessage(`Enqueued ${val} at the REAR of the Queue. (Time: O(1))`);
  };

  const handleQueueDequeue = () => {
    if (queueItems.length === 0) {
      setMessage("Queue Underflow! Cannot dequeue from an empty queue.");
      return;
    }
    const dequeued = queueItems[0];
    setQueueItems(queueItems.slice(1));
    setMessage(`Dequeued ${dequeued} from FRONT of Queue. (FIFO: First-In, First-Out).`);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-violet-100 text-violet-800 border border-violet-200">
              Interactive Data Structures
            </span>
            <span className="text-xs font-semibold text-slate-400">DSA Fundamentals</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Stack & Queue Visualizer
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Compare LIFO (Last-In, First-Out) vs FIFO (First-In, First-Out) operations.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab("stack")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "stack"
                ? "bg-white text-violet-700 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📚 Stack (LIFO)
          </button>
          <button
            onClick={() => setActiveTab("queue")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "queue"
                ? "bg-white text-indigo-700 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🚶‍♂️ Queue (FIFO)
          </button>
        </div>
      </div>

      {/* Control Action Bar */}
      <div className="flex items-center gap-3 flex-wrap bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <input
          type="number"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Number (e.g. 45)..."
          className="px-3 py-2 rounded-xl text-xs border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 w-36"
        />

        {activeTab === "stack" ? (
          <>
            <button
              onClick={handleStackPush}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-colors shadow-xs"
            >
              + Push(val)
            </button>
            <button
              onClick={handleStackPop}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs"
            >
              - Pop()
            </button>
            <button
              onClick={() => setMessage(`Top element is: ${stackItems[stackItems.length - 1] ?? "None (Empty Stack)"}`)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            >
              👁️ Peek()
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleQueueEnqueue}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
            >
              + Enqueue(val)
            </button>
            <button
              onClick={handleQueueDequeue}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs"
            >
              - Dequeue()
            </button>
            <button
              onClick={() => setMessage(`Front element is: ${queueItems[0] ?? "None (Empty Queue)"}`)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            >
              👁️ Front()
            </button>
          </>
        )}
      </div>

      {/* Visual Canvas */}
      <div className="min-h-[220px] bg-slate-50/60 rounded-2xl border border-slate-200/80 p-6 flex flex-col items-center justify-center">
        {activeTab === "stack" ? (
          <div className="w-48 flex flex-col-reverse gap-2 border-b-4 border-l-4 border-r-4 border-slate-400 p-3 rounded-b-2xl bg-white shadow-inner">
            {stackItems.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-6 font-bold">
                [ Empty Stack ]
              </div>
            ) : (
              stackItems.map((val, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl text-center font-black text-xs transition-all ${
                    idx === stackItems.length - 1
                      ? "bg-violet-600 text-white shadow-md shadow-violet-500/20 scale-102"
                      : "bg-slate-100 text-slate-800 border border-slate-200"
                  }`}
                >
                  {val} {idx === stackItems.length - 1 ? "← TOP" : ""}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 border-t-4 border-b-4 border-slate-400 p-4 rounded-2xl bg-white shadow-inner overflow-x-auto max-w-full">
            <span className="text-[11px] font-black text-emerald-600 uppercase pr-2">FRONT →</span>
            {queueItems.length === 0 ? (
              <div className="text-xs text-slate-400 font-bold px-8">[ Empty Queue ]</div>
            ) : (
              queueItems.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-16 h-14 rounded-xl flex flex-col items-center justify-center font-black text-xs transition-all ${
                    idx === 0
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                      : "bg-slate-100 text-slate-800 border border-slate-200"
                  }`}
                >
                  <span>{val}</span>
                  <span className="text-[9px] opacity-70">{idx === 0 ? "OUT" : ""}</span>
                </div>
              ))
            )}
            <span className="text-[11px] font-black text-indigo-600 uppercase pl-2">← REAR</span>
          </div>
        )}
      </div>

      <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 font-medium">
        💬 <strong>Status:</strong> {message}
      </div>
    </div>
  );
};

export default StackQueueVisualizer;
