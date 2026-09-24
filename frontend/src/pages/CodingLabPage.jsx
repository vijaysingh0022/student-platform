import React, { useState, useEffect, useRef } from "react";
import {
  getCodingProblems,
  runCodingCode,
  submitCodingCode,
  debugCodingCode,
  generateCodingTestCases,
} from "../services/api.js";

const LANGUAGES = [
  { id: "python", name: "Python 3", icon: "🐍", defaultCode: "def twoSum(nums, target):\n    # Write your solution here\n    pass\n" },
  { id: "javascript", name: "JavaScript (Node.js)", icon: "⚡", defaultCode: "function twoSum(nums, target) {\n    // Write your solution here\n}\n" },
  { id: "cpp", name: "C++ 17", icon: "⚙️", defaultCode: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code\n    cout << \"[0, 1]\" << endl;\n    return 0;\n}\n" },
  { id: "c", name: "C (GCC)", icon: "🔧", defaultCode: "#include <stdio.h>\n\nint main() {\n    printf(\"[0, 1]\\n\");\n    return 0;\n}\n" },
  { id: "java", name: "Java 17", icon: "☕", defaultCode: "public class Solution {\n    public static void main(String[] args) {\n        System.out.println(\"[0, 1]\");\n    }\n}\n" },
  { id: "sql", name: "SQL (Database)", icon: "🗄️", defaultCode: "SELECT id, name, salary FROM employees WHERE salary > 50000 ORDER BY salary DESC;" },
];

const CodingLabPage = () => {
  const [problems, setProblems] = useState([]);
  const [activeProblem, setActiveProblem] = useState(null);
  const [selectedLang, setSelectedLang] = useState("python");
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState("[2, 7, 11, 15]\n9");

  // Output & Execution States
  const [activeTab, setActiveTab] = useState("output"); // 'output' | 'testcases' | 'analysis' | 'debug' | 'explanation'
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [debugging, setDebugging] = useState(false);
  const [generatingTests, setGeneratingTests] = useState(false);

  const [execResult, setExecResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [debugResult, setDebugResult] = useState(null);
  const [aiTestCases, setAiTestCases] = useState(null);
  const [codeExplanation, setCodeExplanation] = useState(null);

  const textareaRef = useRef(null);

  // Fetch problems on mount
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await getCodingProblems();
        setProblems(data);
        if (data.length > 0) {
          setActiveProblem(data[0]);
          setCode(data[0].starterCode[selectedLang] || LANGUAGES[0].defaultCode);
        }
      } catch (err) {
        console.error("Fetch problems error:", err);
      }
    };
    fetchProblems();
  }, []);

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
    }
    setExecResult(null);
    setSubmitResult(null);
    setDebugResult(null);
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
      const errorLog = execResult?.stderr || "Check code correctness and runtime execution.";
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
                <span>Sandbox Active</span>
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
          <div className="lg:col-span-4 bg-slate-900 rounded-3xl p-5 border border-slate-800 space-y-5 flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              {/* Problem Selector Dropdown */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                  Select Problem:
                </label>
                <select
                  value={activeProblem?.id || ""}
                  onChange={(e) => {
                    const found = problems.find((p) => p.id === e.target.value);
                    if (found) handleProblemChange(found);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-violet-500"
                >
                  {problems.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.difficulty})
                    </option>
                  ))}
                </select>
              </div>

              {/* Problem Title & Difficulty Badge */}
              {activeProblem && (
                <div className="space-y-2 border-b border-slate-800 pb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {activeProblem.title}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {activeProblem.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {activeProblem.description}
                  </p>
                </div>
              )}

              {/* Examples */}
              {activeProblem?.examples && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wide text-slate-400">
                    Example Inputs & Outputs:
                  </h4>
                  {activeProblem.examples.map((ex, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
                      <div><span className="text-violet-400 font-bold">Input:</span> {ex.input}</div>
                      <div><span className="text-emerald-400 font-bold">Output:</span> {ex.output}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector Selector */}
            <div className="pt-4 border-t border-slate-800">
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
                <span className="text-xs font-mono font-bold text-slate-500">
                  {lineCount} lines | UTF-8
                </span>
              </div>

              {/* Editor Line Numbers + Textarea */}
              <div className="relative flex min-h-[320px] max-h-[460px] overflow-y-auto bg-slate-950 font-mono text-xs">
                {/* Line Numbers Sidebar */}
                <div className="w-12 py-4 select-none text-right pr-3 text-slate-600 bg-slate-900/50 border-r border-slate-800/60 leading-6">
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
                <div className="flex items-center gap-2">
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
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                    execResult.status === "Accepted" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                  }`}>
                    {execResult.status} ({execResult.executionTimeMs} ms)
                  </span>
                )}
              </div>

              {/* TAB CONTENT: CONSOLE OUTPUT */}
              {activeTab === "output" && (
                <div className="space-y-3 font-mono text-xs">
                  {execResult ? (
                    <div className="space-y-3">
                      {execResult.stdout && (
                        <div>
                          <div className="text-[10px] font-black uppercase text-emerald-400 mb-1">Standard Output (stdout):</div>
                          <pre className="p-3.5 rounded-2xl bg-slate-950 text-emerald-300 border border-slate-800 whitespace-pre-wrap">
                            {execResult.stdout}
                          </pre>
                        </div>
                      )}

                      {execResult.stderr && (
                        <div>
                          <div className="text-[10px] font-black uppercase text-rose-400 mb-1">Standard Error (stderr):</div>
                          <pre className="p-3.5 rounded-2xl bg-slate-950 text-rose-300 border border-rose-900/50 whitespace-pre-wrap">
                            {execResult.stderr}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 font-bold">
                      Click "▶️ Run Code" to execute code against stdin inputs.
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: CUSTOM STDIN INPUT */}
              {activeTab === "stdin" && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400">
                    Input (stdin):
                  </label>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-2xl p-3.5 font-mono text-xs focus:outline-none focus:border-violet-500"
                    placeholder="Provide custom arguments or stdin lines here..."
                  />
                </div>
              )}

              {/* TAB CONTENT: POST-SUBMISSION AI AUDIT REPORT */}
              {activeTab === "analysis" && (
                <div className="space-y-5 animate-fade-in">
                  {submitResult ? (
                    <div className="space-y-5">
                      {/* Status & Scores */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="text-[10px] font-black uppercase text-slate-400">Submission Result:</div>
                          <h3 className={`text-xl font-black ${submitResult.status === "Accepted" ? "text-emerald-400" : "text-rose-400"}`}>
                            {submitResult.status} ({submitResult.passedCount} / {submitResult.totalCount} Test Cases Passed)
                          </h3>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-center p-2 rounded-xl bg-violet-950/60 border border-violet-800">
                            <div className="text-[10px] text-violet-300 font-bold uppercase">Correctness</div>
                            <div className="text-base font-black text-violet-400">{submitResult.aiEvaluation?.correctnessScore}%</div>
                          </div>
                          <div className="text-center p-2 rounded-xl bg-emerald-950/60 border border-emerald-800">
                            <div className="text-[10px] text-emerald-300 font-bold uppercase">Efficiency</div>
                            <div className="text-base font-black text-emerald-400">{submitResult.aiEvaluation?.efficiencyScore}%</div>
                          </div>
                          <div className="text-center p-2 rounded-xl bg-sky-950/60 border border-sky-800">
                            <div className="text-[10px] text-sky-300 font-bold uppercase">Code Quality</div>
                            <div className="text-base font-black text-sky-400">{submitResult.aiEvaluation?.codeQualityScore}%</div>
                          </div>
                        </div>
                      </div>

                      {/* Complexity & Issues Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                          <h4 className="text-xs font-black text-violet-400 uppercase tracking-wide">
                            ⏱️ Complexity Analysis:
                          </h4>
                          <div className="flex items-center gap-4 text-xs font-mono font-bold">
                            <div className="px-3 py-1.5 rounded-xl bg-violet-900/40 text-violet-300 border border-violet-800">
                              Time: {submitResult.aiEvaluation?.timeComplexity}
                            </div>
                            <div className="px-3 py-1.5 rounded-xl bg-sky-900/40 text-sky-300 border border-sky-800">
                              Space: {submitResult.aiEvaluation?.spaceComplexity}
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                          <h4 className="text-xs font-black text-amber-400 uppercase tracking-wide">
                            ⚠️ Potential Bottlenecks / Code Issues:
                          </h4>
                          <ul className="text-xs text-slate-300 font-medium list-disc pl-4 space-y-1">
                            {submitResult.aiEvaluation?.potentialIssues?.map((issue, iIdx) => (
                              <li key={iIdx}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Improved Solution */}
                      {submitResult.aiEvaluation?.improvedSolution && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wide">
                            ✨ AI Optimized Solution:
                          </h4>
                          <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-300 border border-slate-800 font-mono text-xs overflow-x-auto">
                            {submitResult.aiEvaluation.improvedSolution}
                          </pre>
                        </div>
                      )}

                      {/* Interview Follow-Up Questions */}
                      {submitResult.aiEvaluation?.interviewFollowUp && (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-800 space-y-2">
                          <h4 className="text-xs font-black text-purple-300 uppercase tracking-wide">
                            🎯 FAANG Interview Follow-Up Questions:
                          </h4>
                          <ul className="text-xs text-slate-200 font-medium space-y-1.5 list-decimal pl-4">
                            {submitResult.aiEvaluation.interviewFollowUp.map((q, qIdx) => (
                              <li key={qIdx}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 font-bold">
                      Click "🚀 Submit Code" to run test cases and generate full AI submission audit.
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: TEST CASES */}
              {activeTab === "testcases" && (
                <div className="space-y-3 font-mono text-xs">
                  {activeProblem?.testCases?.map((tc, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 font-bold">
                        <span>Test Case {idx + 1}</span>
                      </div>
                      <div><span className="text-violet-400">Input:</span> {tc.input}</div>
                      <div><span className="text-emerald-400">Expected Output:</span> {tc.expectedOutput}</div>
                    </div>
                  ))}

                  {/* AI Generated Test Cases if any */}
                  {aiTestCases && (
                    <div className="pt-2 space-y-2">
                      <h4 className="text-xs font-black uppercase text-purple-400">✨ AI Generated Boundary Cases:</h4>
                      {aiTestCases.map((tc, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-purple-950/40 border border-purple-800 space-y-1">
                          <div><span className="text-purple-300 font-bold">Input:</span> {tc.input}</div>
                          <div><span className="text-emerald-400 font-bold">Expected:</span> {tc.expectedOutput}</div>
                          <div className="text-[10px] text-slate-400">Reason: {tc.reason}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: AI DEBUGGER */}
              {activeTab === "debug" && (
                <div className="space-y-3">
                  {debugResult ? (
                    <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80 text-amber-200 space-y-3 text-xs">
                      <div className="flex items-center justify-between font-black">
                        <span>🐞 Error Type: {debugResult.errorType}</span>
                        <span className="text-amber-400">{debugResult.errorLine}</span>
                      </div>
                      <p className="font-medium leading-relaxed">{debugResult.explanation}</p>
                      {debugResult.fix && (
                        <div>
                          <div className="text-[10px] font-black uppercase text-amber-300 mb-1">Suggested Fix:</div>
                          <pre className="p-3 rounded-xl bg-slate-950 text-emerald-300 border border-slate-800 font-mono">
                            {debugResult.fix}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 font-bold">
                      Click "🤖 AI Debug" to analyze errors and receive fixes.
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
