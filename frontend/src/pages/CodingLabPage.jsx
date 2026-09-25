import React, { useState, useEffect, useRef } from "react";
import {
  getCodingProblems,
  runCodingCode,
  submitCodingCode,
  debugCodingCode,
  generateCodingTestCases,
} from "../services/api.js";

const LANGUAGES = [
  { id: "python", name: "Python 3", icon: "🐍", defaultCode: "def solution(*args):\n    # Write your solution here\n    pass\n" },
  { id: "javascript", name: "JavaScript (Node.js)", icon: "⚡", defaultCode: "function solution() {\n    // Write your solution here\n}\n" },
  { id: "cpp", name: "C++ 17", icon: "⚙️", defaultCode: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code\n    return 0;\n}\n" },
  { id: "c", name: "C (GCC)", icon: "🔧", defaultCode: "#include <stdio.h>\n\nint main() {\n    return 0;\n}\n" },
  { id: "java", name: "Java 17", icon: "☕", defaultCode: "public class Solution {\n    public static void main(String[] args) {\n        // Write solution\n    }\n}\n" },
  { id: "sql", name: "SQL (Database)", icon: "🗄️", defaultCode: "SELECT * FROM employees WHERE salary > 50000 ORDER BY salary DESC;" },
];

const DIFFICULTY_COLORS = {
  Easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Hard: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

const CodingLabPage = () => {
  const [problems, setProblems] = useState([]);
  const [activeProblem, setActiveProblem] = useState(null);
  const [selectedLang, setSelectedLang] = useState("python");
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState("[2, 7, 11, 15]\n9");

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  // Output & Execution States
  const [activeTab, setActiveTab] = useState("output"); // 'output' | 'stdin' | 'analysis' | 'testcases' | 'debug'
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [debugging, setDebugging] = useState(false);
  const [generatingTests, setGeneratingTests] = useState(false);

  const [execResult, setExecResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [debugResult, setDebugResult] = useState(null);
  const [aiTestCases, setAiTestCases] = useState(null);

  const textareaRef = useRef(null);

  // Fetch problems on mount
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await getCodingProblems();
        if (Array.isArray(data) && data.length > 0) {
          setProblems(data);
          setActiveProblem(data[0]);
          setCode(data[0].starterCode?.[selectedLang] || LANGUAGES[0].defaultCode);
          if (data[0].testCases?.[0]?.input) {
            setCustomInput(data[0].testCases[0].input);
          }
        }
      } catch (err) {
        console.error("Fetch problems error:", err);
      }
    };
    fetchProblems();
  }, []);

  // Compute unique categories
  const categories = ["All", ...Array.from(new Set(problems.map((p) => p.category).filter(Boolean)))];

  // Filtered problems list
  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Handle language switch
  const handleLanguageChange = (langId) => {
    setSelectedLang(langId);
    if (activeProblem?.starterCode && activeProblem.starterCode[langId]) {
      setCode(activeProblem.starterCode[langId]);
    } else {
      const langMeta = LANGUAGES.find((l) => l.id === langId);
      setCode(langMeta ? langMeta.defaultCode : "");
    }
  };

  // Handle problem switch
  const handleProblemChange = (problem) => {
    setActiveProblem(problem);
    if (problem.starterCode && problem.starterCode[selectedLang]) {
      setCode(problem.starterCode[selectedLang]);
    } else {
      const langMeta = LANGUAGES.find((l) => l.id === selectedLang);
      setCode(langMeta ? langMeta.defaultCode : "");
    }
    if (problem.testCases && problem.testCases[0]?.input) {
      setCustomInput(problem.testCases[0].input);
    } else if (problem.examples && problem.examples[0]?.input) {
      setCustomInput(problem.examples[0].input);
    }
    setExecResult(null);
    setSubmitResult(null);
    setDebugResult(null);
    setAiTestCases(null);
  };

  // Next and Previous Problem Navigation
  const currentIndex = activeProblem ? problems.findIndex((p) => p.id === activeProblem.id) : -1;
  const handlePrevProblem = () => {
    if (currentIndex > 0) {
      handleProblemChange(problems[currentIndex - 1]);
    }
  };
  const handleNextProblem = () => {
    if (currentIndex >= 0 && currentIndex < problems.length - 1) {
      handleProblemChange(problems[currentIndex + 1]);
    }
  };

  // 1. RUN CODE
  const handleRunCode = async () => {
    setRunning(true);
    setActiveTab("output");
    setExecResult(null);

    try {
      const { data } = await runCodingCode({
        language: selectedLang,
        code,
        customInput,
      });
      setExecResult(data);
    } catch (err) {
      setExecResult({
        stdout: "",
        stderr: err.response?.data?.message || "Execution Error",
        executionTimeMs: 0,
        status: "Error",
      });
    } finally {
      setRunning(false);
    }
  };

  // 2. SUBMIT CODE
  const handleSubmitCode = async () => {
    if (!activeProblem) return;
    setSubmitting(true);
    setActiveTab("analysis");
    setSubmitResult(null);

    try {
      const { data } = await submitCodingCode({
        problemId: activeProblem.id,
        language: selectedLang,
        code,
      });
      setSubmitResult(data);
    } catch (err) {
      console.error("Submit code error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // 3. AI DEBUG CODE
  const handleDebugCode = async () => {
    setDebugging(true);
    setActiveTab("debug");
    try {
      const errorLog = execResult?.stderr || "Check code correctness, edge cases, and runtime efficiency.";
      const { data } = await debugCodingCode({
        language: selectedLang,
        code,
        errorLog,
      });
      setDebugResult(data);
    } catch (err) {
      console.error("Debug code error:", err);
    } finally {
      setDebugging(false);
    }
  };

  // 4. GENERATE AI TEST CASES
  const handleGenerateTestCases = async () => {
    setGeneratingTests(true);
    setActiveTab("testcases");
    try {
      const { data } = await generateCodingTestCases({
        problemDescription: activeProblem?.description || "Coding problem",
        language: selectedLang,
      });
      setAiTestCases(data.testCases || []);
    } catch (err) {
      console.error("Generate test cases error:", err);
    } finally {
      setGeneratingTests(false);
    }
  };

  // Handle keyboard tabs in editor
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const lineCount = code.split("\n").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md">
              💻
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-violet-400 tracking-wider">
                <span>LearnX AI Coding Lab</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{problems.length} Curated Problems Available</span>
              </div>
              <h1 className="text-xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Interactive Multi-Language Compiler & AI Debugger
              </h1>
            </div>
          </div>

          {/* Controls & Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleRunCode}
              disabled={running}
              className="px-4 py-2.5 rounded-2xl text-xs font-black bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95 transition-all flex items-center gap-2"
            >
              {running ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <span>▶️ Run Code</span>
              )}
            </button>

            <button
              onClick={handleSubmitCode}
              disabled={submitting}
              className="btn-gradient px-5 py-2.5 rounded-2xl text-xs font-black text-white shadow-md active:scale-95 transition-all flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <span>🚀 Submit Code</span>
              )}
            </button>

            <button
              onClick={handleDebugCode}
              disabled={debugging}
              className="px-3.5 py-2.5 rounded-2xl text-xs font-extrabold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5"
            >
              {debugging ? "⏳ Analyzing..." : "🤖 AI Debug"}
            </button>

            <button
              onClick={handleGenerateTestCases}
              disabled={generatingTests}
              className="px-3.5 py-2.5 rounded-2xl text-xs font-extrabold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 transition-all flex items-center gap-1.5"
            >
              ✨ Generate Test Cases
            </button>
          </div>
        </div>

        {/* MAIN SPLIT WORKSPACE: PROBLEM + EDITOR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: PROBLEM PANEL (4 COLS) */}
          <div className="lg:col-span-4 bg-slate-900 rounded-3xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              {/* Problem Filter Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>Select Problem ({filteredProblems.length} / {problems.length})</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevProblem}
                      disabled={currentIndex <= 0}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-[10px]"
                      title="Previous Problem"
                    >
                      ◀ Prev
                    </button>
                    <button
                      onClick={handleNextProblem}
                      disabled={currentIndex >= problems.length - 1}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-[10px]"
                      title="Next Problem"
                    >
                      Next ▶
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 150+ DSA problems..."
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-8 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-violet-500 placeholder-slate-500"
                  />
                  <span className="absolute left-2.5 top-2.5 text-xs text-slate-500">🔍</span>
                </div>

                {/* Difficulty & Category Filter Row */}
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-slate-300 rounded-xl px-2 py-1.5 text-[11px] font-bold focus:outline-none focus:border-violet-500"
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">🟢 Easy</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Hard">🔴 Hard</option>
                  </select>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-slate-300 rounded-xl px-2 py-1.5 text-[11px] font-bold focus:outline-none focus:border-violet-500 truncate"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Problem Dropdown Selector */}
                <select
                  value={activeProblem?.id || ""}
                  onChange={(e) => {
                    const found = problems.find((p) => p.id === e.target.value);
                    if (found) handleProblemChange(found);
                  }}
                  className="w-full bg-slate-950 border border-violet-500/50 text-white rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-violet-500 shadow-inner"
                >
                  {filteredProblems.length === 0 ? (
                    <option disabled>No problems match filters</option>
                  ) : (
                    filteredProblems.map((p, idx) => (
                      <option key={p.id} value={p.id}>
                        #{idx + 1} {p.title} ({p.difficulty} • {p.category})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Problem Title, Category & Difficulty Badge */}
              {activeProblem && (
                <div className="space-y-3 border-b border-slate-800 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-wider block">
                        {activeProblem.category || "DSA Topic"}
                      </span>
                      <h2 className="text-lg font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {activeProblem.title}
                      </h2>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border shrink-0 ${
                        DIFFICULTY_COLORS[activeProblem.difficulty] || DIFFICULTY_COLORS.Easy
                      }`}
                    >
                      {activeProblem.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                    {activeProblem.description}
                  </p>
                </div>
              )}

              {/* Examples */}
              {activeProblem?.examples && activeProblem.examples.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                    Example Inputs & Outputs:
                  </h4>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {activeProblem.examples.map((ex, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] space-y-1">
                        <div><span className="text-violet-400 font-bold">Input:</span> {ex.input}</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> {ex.output}</div>
                        {ex.explanation && (
                          <div className="text-slate-400 font-sans text-[10px] pt-1 italic">
                            💡 {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="pt-3 border-t border-slate-800">
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">
                Target Language:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang.id)}
                    className={`py-2 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all border ${
                      selectedLang === lang.id
                        ? "bg-violet-600 text-white border-violet-500 shadow-sm"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    <span>{lang.icon}</span>
                    <span className="truncate">{lang.id.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: CODE EDITOR & OUTPUT TERMINAL (8 COLS) */}
          <div className="lg:col-span-8 space-y-6">
            {/* CODE EDITOR CONTAINER */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
              {/* Editor Top Toolbar */}
              <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono font-bold text-slate-400 ml-2">
                    solution.{selectedLang === "python" ? "py" : selectedLang === "javascript" ? "js" : selectedLang === "cpp" ? "cpp" : selectedLang === "c" ? "c" : selectedLang === "java" ? "java" : "sql"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {lineCount} lines | UTF-8
                  </span>
                  <button
                    onClick={() => {
                      if (activeProblem?.starterCode?.[selectedLang]) {
                        setCode(activeProblem.starterCode[selectedLang]);
                      }
                    }}
                    className="text-[10px] text-slate-400 hover:text-violet-400 underline font-mono"
                    title="Reset to starter boilerplate"
                  >
                    Reset Template
                  </button>
                </div>
              </div>

              {/* Editor Line Numbers + Textarea */}
              <div className="relative flex min-h-[320px] max-h-[460px] overflow-y-auto bg-slate-950 font-mono text-xs">
                {/* Line Numbers Sidebar */}
                <div className="w-12 py-4 select-none text-right pr-3 text-slate-600 bg-slate-900/50 border-r border-slate-800/60 leading-6 shrink-0">
                  {Array.from({ length: lineCount }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Code Textarea */}
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck="false"
                  className="w-full py-4 px-4 bg-transparent text-slate-100 focus:outline-none leading-6 font-mono resize-none"
                  style={{ tabSize: 4 }}
                />
              </div>
            </div>

            {/* LOWER OUTPUT & AUDIT TABS */}
            <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
              {/* Tab Selector */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { id: "output", label: "Console & Execution" },
                    { id: "stdin", label: "Custom Stdin Input" },
                    { id: "analysis", label: `AI Audit Report ${submitResult ? "📊" : ""}` },
                    { id: "testcases", label: `Test Cases (${activeProblem?.testCases?.length || 0})` },
                    { id: "debug", label: `AI Debugger ${debugResult ? "🐞" : ""}` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === tab.id
                          ? "bg-violet-600 text-white shadow-xs"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {execResult && (
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-400">Time: {execResult.executionTimeMs}ms</span>
                    <span
                      className={`font-black ${
                        execResult.status === "Accepted" ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {execResult.status}
                    </span>
                  </div>
                )}
              </div>

              {/* TAB CONTENT: 1. Console Output */}
              {activeTab === "output" && (
                <div className="space-y-3 font-mono text-xs">
                  {running && (
                    <div className="flex items-center gap-3 py-6 justify-center text-slate-400">
                      <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                      <span>Executing code in sandboxed runtime...</span>
                    </div>
                  )}

                  {!running && !execResult && (
                    <div className="py-8 text-center text-slate-500">
                      Click <strong className="text-violet-400">▶️ Run Code</strong> to test your solution with custom stdin.
                    </div>
                  )}

                  {execResult && (
                    <div className="space-y-3">
                      {execResult.stdout && (
                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                          <span className="text-[10px] font-black uppercase text-emerald-400 block mb-1">Standard Output (STDOUT):</span>
                          <pre className="text-emerald-300 whitespace-pre-wrap">{execResult.stdout}</pre>
                        </div>
                      )}

                      {execResult.stderr && (
                        <div className="bg-rose-950/30 p-4 rounded-2xl border border-rose-800/40">
                          <span className="text-[10px] font-black uppercase text-rose-400 block mb-1">Standard Error (STDERR):</span>
                          <pre className="text-rose-300 whitespace-pre-wrap">{execResult.stderr}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: 2. Custom Stdin */}
              {activeTab === "stdin" && (
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase text-slate-400">
                    Provide Custom Input (stdin):
                  </label>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    rows={4}
                    placeholder="Enter custom stdin inputs for your program..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-violet-500"
                  />
                  <p className="text-[11px] text-slate-500">
                    This input will be piped directly into <code>sys.stdin</code> (Python), <code>fs.readFileSync(0)</code> (Node), or <code>cin/scanf</code> (C++/C).
                  </p>
                </div>
              )}

              {/* TAB CONTENT: 3. AI Submission Audit Report */}
              {activeTab === "analysis" && (
                <div className="space-y-4">
                  {submitting && (
                    <div className="py-8 text-center text-slate-400 space-y-2">
                      <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
                      <div>Evaluating submission against all hidden test cases & generating technical audit...</div>
                    </div>
                  )}

                  {!submitting && !submitResult && (
                    <div className="py-8 text-center text-slate-500">
                      Click <strong className="text-violet-400">🚀 Submit Code</strong> to run full evaluation and AI audit.
                    </div>
                  )}

                  {submitResult && (
                    <div className="space-y-5 animate-fade-in">
                      {/* Test Case Overview Badges */}
                      <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <div>
                          <div className="text-xs font-bold text-slate-400 uppercase">Test Cases Passed</div>
                          <div className="text-2xl font-black text-white">
                            {submitResult.passedCount} / {submitResult.totalCount}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1.5 rounded-xl text-xs font-black border ${
                            submitResult.isAllPassed
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                          }`}
                        >
                          {submitResult.isAllPassed ? "🎉 ALL PASSED" : "⚠️ SOME FAILED"}
                        </span>
                      </div>

                      {/* AI Audit Scores */}
                      {submitResult.aiAudit && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                            <span className="text-[10px] uppercase font-black text-slate-400">Correctness</span>
                            <div className="text-2xl font-black text-emerald-400">{submitResult.aiAudit.correctnessScore || 90}%</div>
                          </div>
                          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                            <span className="text-[10px] uppercase font-black text-slate-400">Efficiency</span>
                            <div className="text-2xl font-black text-blue-400">{submitResult.aiAudit.efficiencyScore || 85}%</div>
                          </div>
                          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                            <span className="text-[10px] uppercase font-black text-slate-400">Complexity</span>
                            <div className="text-xs font-bold text-violet-400 mt-2 font-mono">
                              Time: {submitResult.aiAudit.timeComplexity || "O(N)"} | Space: {submitResult.aiAudit.spaceComplexity || "O(1)"}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Executive Summary & Improvement */}
                      {submitResult.aiAudit?.aiSummary && (
                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                          <h4 className="text-xs font-black uppercase text-violet-400">AI Senior Examiner Feedback:</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">{submitResult.aiAudit.aiSummary}</p>
                        </div>
                      )}

                      {submitResult.aiAudit?.improvedSolution && (
                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                          <h4 className="text-xs font-black uppercase text-emerald-400">Refactored Clean Solution:</h4>
                          <pre className="text-xs font-mono text-emerald-300 bg-slate-900 p-3 rounded-xl overflow-x-auto">
                            {submitResult.aiAudit.improvedSolution}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: 4. Test Cases */}
              {activeTab === "testcases" && (
                <div className="space-y-4">
                  {generatingTests && (
                    <div className="py-6 text-center text-slate-400">
                      <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <span>Generating comprehensive corner case test cases with Gemini AI...</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-slate-400">Standard Test Cases:</h4>
                    {activeProblem?.testCases?.map((tc, idx) => (
                      <div key={idx} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs space-y-1">
                        <span className="text-violet-400 font-bold">Case #{idx + 1}</span>
                        <div>Input: <span className="text-slate-300">{tc.input}</span></div>
                        <div>Expected Output: <span className="text-emerald-400">{tc.expectedOutput}</span></div>
                      </div>
                    ))}
                  </div>

                  {aiTestCases && aiTestCases.length > 0 && (
                    <div className="space-y-3 pt-3 border-t border-slate-800">
                      <h4 className="text-xs font-black uppercase text-purple-400">AI Generated Edge Cases:</h4>
                      {aiTestCases.map((tc, idx) => (
                        <div key={idx} className="p-3 bg-purple-950/20 rounded-2xl border border-purple-800/40 font-mono text-xs space-y-1">
                          <span className="text-purple-300 font-bold">Edge Case #{idx + 1} ({tc.description})</span>
                          <div>Input: <span className="text-slate-300">{tc.input}</span></div>
                          <div>Expected: <span className="text-emerald-400">{tc.expectedOutput}</span></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: 5. AI Debugger */}
              {activeTab === "debug" && (
                <div className="space-y-4">
                  {debugging && (
                    <div className="py-6 text-center text-slate-400">
                      <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <span>Diagnosing errors and fixing code with AI...</span>
                    </div>
                  )}

                  {!debugging && !debugResult && (
                    <div className="py-8 text-center text-slate-500">
                      Click <strong className="text-amber-400">🤖 AI Debug</strong> to diagnose code issues, fix bugs, and get step-by-step explanations.
                    </div>
                  )}

                  {debugResult && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="bg-amber-950/20 p-4 rounded-2xl border border-amber-800/40 space-y-2">
                        <span className="text-xs font-black uppercase text-amber-400">Diagnostic Summary:</span>
                        <p className="text-xs text-slate-300 leading-relaxed">{debugResult.explanation}</p>
                      </div>

                      {debugResult.fixedCode && (
                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-emerald-400">Suggested Fixed Code:</span>
                            <button
                              onClick={() => setCode(debugResult.fixedCode)}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                            >
                              Apply Fix to Editor
                            </button>
                          </div>
                          <pre className="text-xs font-mono text-emerald-300 bg-slate-900 p-3 rounded-xl overflow-x-auto">
                            {debugResult.fixedCode}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingLabPage;
