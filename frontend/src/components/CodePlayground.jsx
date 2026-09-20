import React, { useState } from "react";

export default function CodePlayground({ codeExamples }) {
  const defaultCodeMap = {
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Quick Sort Partition Demo\n    int arr[] = {10, 7, 8, 9, 1, 5};\n    int n = sizeof(arr) / sizeof(arr[0]);\n    cout << "Array size: " << n << endl;\n    cout << "Partitioning around pivot: " << arr[n-1] << endl;\n    return 0;\n}`,
    java: `public class Solution {\n    public static void main(String[] args) {\n        int[] arr = {10, 7, 8, 9, 1, 5};\n        System.out.println("QuickSort Execution Demo");\n        System.out.println("Sorted array elements: [1, 5, 7, 8, 9, 10]");\n    }\n}`,
    python: `def quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + middle + quick_sort(right)\n\nprint("Sorted:", quick_sort([10, 7, 8, 9, 1, 5]))`,
    javascript: `function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[arr.length - 1];\n  const left = arr.filter(x => x < pivot);\n  const right = arr.filter(x => x > pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}\n\nconsole.log("Result:", quickSort([10, 7, 8, 9, 1, 5]));`,
    sql: `SELECT employee_id, first_name, salary,\n       RANK() OVER (ORDER BY salary DESC) as salary_rank\nFROM employees\nORDER BY salary_rank ASC\nLIMIT 5;`,
  };

  const codeMap = codeExamples || defaultCodeMap;
  const availableLangs = Object.keys(codeMap);
  const [activeLang, setActiveLang] = useState(availableLangs[0] || "cpp");
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(null);

  const handleCopy = () => {
    const textToCopy = codeMap[activeLang] || "";
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput(null);

    setTimeout(() => {
      setIsRunning(false);
      const simulatedOutputs = {
        cpp: `[Compiling C++20 using g++]...\nCompilation successful (0.04s)\n\nArray size: 6\nPartitioning around pivot: 5\nOutput: [1, 5, 7, 8, 9, 10]\nProcess finished with exit code 0`,
        java: `[Compiling Solution.java with OpenJDK 17]...\n\nQuickSort Execution Demo\nSorted array elements: [1, 5, 7, 8, 9, 10]\nTime taken: 0.12s`,
        python: `[Executing Python 3.11 environment]...\n\nSorted: [1, 5, 7, 8, 9, 10]\nExecution time: 0.015s`,
        javascript: `[Node.js v20.10.0 V8 Engine]...\n\nResult: [ 1, 5, 7, 8, 9, 10 ]\nExecuted in 1.2ms`,
        sql: `[PostgreSQL 16 Query Engine]...\n\nemployee_id | first_name | salary  | salary_rank\n------------+------------+---------+------------\n101         | Alice      | 145000  | 1\n104         | David      | 128000  | 2\n102         | Bob        | 115000  | 3\n(3 rows returned in 4.1ms)`,
      };

      setOutput(simulatedOutputs[activeLang] || `Output generated successfully.\nProcessed in 0.05s.`);
    }, 600);
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-slate-100 my-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 px-5 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-mono font-bold text-slate-400 ml-2">⚡ Interactive Code Playground</span>
        </div>

        {/* Language Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {availableLangs.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setActiveLang(lang);
                setOutput(null);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all ${
                activeLang === lang
                  ? "bg-violet-600 text-white shadow-xs"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Code Window */}
      <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-200 min-h-[160px] bg-slate-900">
        <pre>{codeMap[activeLang] || "// Code example available for this topic"}</pre>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between p-4 px-5 bg-slate-950 border-t border-slate-800 text-xs">
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors flex items-center gap-1.5"
        >
          <span>{copied ? "✓ Copied" : "📋 Copy Code"}</span>
        </button>

        <button
          onClick={handleRunCode}
          disabled={isRunning}
          className="btn-gradient px-4 py-2 rounded-xl text-white font-extrabold flex items-center gap-2 shadow-lg shadow-violet-600/20 hover:scale-105 active:scale-95 transition-all"
        >
          {isRunning ? (
            <>
              <span className="animate-spin text-sm">⏳</span>
              <span>Running...</span>
            </>
          ) : (
            <>
              <span>▶ Run Code</span>
            </>
          )}
        </button>
      </div>

      {/* Output Console Drawer */}
      {output && (
        <div className="p-4 px-5 bg-slate-950/90 border-t border-slate-800 font-mono text-xs space-y-2 animate-fade-in">
          <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Execution Console Output</span>
          </div>
          <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">{output}</pre>
        </div>
      )}
    </div>
  );
}
