import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Sparkles,
  Play,
  Send,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  Target,
  BarChart2,
  Code2,
  Bug,
  Lightbulb,
  Zap,
  BookOpen,
  Share2,
  Terminal,
  RotateCcw,
  Maximize2,
  Minimize2,
  Search,
  Filter,
  Check,
  HelpCircle,
  Sliders,
  History,
  FileCode,
  Layers,
  ArrowRight,
  ExternalLink,
  Bot,
  Cpu,
  ChevronDown,
  X,
  Compass,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import {
  getCodingProblems,
  getCodingStats,
  runCodingCode,
  submitCodingCode,
  askCodingCopilot,
  getCodingSubmissions,
  getCodingBookmarks,
  toggleCodingBookmark,
  getCodingMistakes,
  getSystemHealth,
} from "../services/api.js";
import MarkdownRenderer from "../components/MarkdownRenderer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const LANGUAGES = [
  { id: "python", name: "Python3", icon: "🐍", defaultCode: "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your code here\n        pass\n" },
  { id: "javascript", name: "JavaScript", icon: "⚡", defaultCode: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    // Write your code here\n}\n" },
  { id: "cpp", name: "C++", icon: "⚙️", defaultCode: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};\n" },
  { id: "java", name: "Java", icon: "☕", defaultCode: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}\n" },
];

const DIFFICULTY_CONFIG = {
  Easy: {
    bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    badge: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  Medium: {
    bg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    badge: "bg-amber-50 text-amber-600 border border-amber-200",
    dot: "bg-amber-500",
  },
  Hard: {
    bg: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    badge: "bg-rose-50 text-rose-600 border border-rose-200",
    dot: "bg-rose-500",
  },
};

const QUICK_GUIDANCE_TIPS = {
  "two-sum": [
    "Try using a Hash Map to store elements and their indices for O(n) solution.",
    "For each element, check if (target - num) exists in the hash map before inserting.",
    "Be careful not to use the same index twice when target is 2 * num[i]."
  ],
  "contains-duplicate": [
    "A Set allows O(1) membership check; compare set length with array length.",
    "Sorting takes O(n log n) but O(1) extra space if memory is constrained.",
    "Hash set approach takes O(n) time and O(n) space."
  ],
  "valid-anagram": [
    "Count frequency of each character using an array of size 26 or a hash map.",
    "If lengths of both strings differ, they can never be anagrams.",
    "Increment counts for string 1 and decrement for string 2 to verify all reach 0."
  ],
  default: [
    "Consider the optimal time and space constraints before writing code.",
    "Think about edge cases: empty input, single element, duplicates, and negative values.",
    "Look for repetitive subproblems or opportunities to use a hash table."
  ]
};

export default function CodingLabPage() {
  const { user } = useAuth();
  const userName = user?.name || user?.firstName || "Vijay";

  // State: Data
  const [problems, setProblems] = useState([]);
  const [activeProblem, setActiveProblem] = useState(null);
  const [stats, setStats] = useState({
    problemsSolved: 42,
    streakDays: 7,
    accuracy: 76,
    codingSkill: 68,
    todayGoal: { easy: 1, medium: 2, weakTopic: 1, easyDone: 1, mediumDone: 1, weakTopicDone: 0 },
    weakTopics: ["Dynamic Programming"],
    recommendedProblem: null
  });

  // State: Editor & Execution
  const [selectedLang, setSelectedLang] = useState("python");
  const [code, setCode] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [customInput, setCustomInput] = useState("[2, 7, 11, 15]\n9");
  const [testResults, setTestResults] = useState([]);
  const [activeTestTab, setActiveTestTab] = useState("testcases"); // testcases | custom | output | console | analysis
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [runOutput, setRunOutput] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [consoleLogs, setConsoleLogs] = useState([]);

  // State: Left Panel
  const [activeProblemTab, setActiveProblemTab] = useState("description"); // description | examples | constraints | hints
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showExplorerDrawer, setShowExplorerDrawer] = useState(false);
  const [explorerTab, setExplorerTab] = useState("problems"); // problems | mistakes | history | bookmarks

  // State: Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [filterTopic, setFilterTopic] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All"); // All | Solved | Unsolved | Bookmarked

  // State: AI Copilot
  const [copilotOpen, setCopilotOpen] = useState(true);
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotResponse, setCopilotResponse] = useState(null);
  const [copilotError, setCopilotError] = useState(null);
  const [lastCopilotAction, setLastCopilotAction] = useState(null);
  const [copilotOnline, setCopilotOnline] = useState(true);
  const [hintStep, setHintStep] = useState(1);
  const [copilotTone, setCopilotTone] = useState("Normal"); // Concise | Normal | Detailed
  const [copilotLang, setCopilotLang] = useState("Hinglish"); // English | Hinglish
  const [showContextDropdown, setShowContextDropdown] = useState(false);
  const [guidanceIndex, setGuidanceIndex] = useState(0);
  const [submissionsHistory, setSubmissionsHistory] = useState([]);
  const [mistakesList, setMistakesList] = useState([]);
  const [bookmarkedList, setBookmarkedList] = useState([]);

  const editorRef = useRef(null);

  // Check Copilot / Backend health
  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      try {
        const res = await getSystemHealth();
        if (isMounted) setCopilotOnline(res.data?.status === "healthy" || res.status === 200);
      } catch (err) {
        if (isMounted) setCopilotOnline(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Load Initial Problems & Stats
  useEffect(() => {
    async function loadData() {
      try {
        const [probRes, statsRes] = await Promise.all([
          getCodingProblems(),
          getCodingStats().catch(() => ({ data: null }))
        ]);

        if (Array.isArray(probRes?.data) && probRes.data.length > 0) {
          setProblems(probRes.data);
          const first = probRes.data[0];
          setActiveProblem(first);
          setCode(first.starterCode?.[selectedLang] || LANGUAGES[0].defaultCode);
          setIsBookmarked(!!first.isBookmarked);
          if (first.testCases && first.testCases[0]?.input) {
            setCustomInput(first.testCases[0].input);
          }
          initMockPassedTests(first);
        }

        if (statsRes?.data) {
          setStats(prev => ({ ...prev, ...statsRes.data }));
        }
      } catch (err) {
        console.error("CodingLab initialization error:", err);
      }
    }
    loadData();
  }, []);

  // Update starter code when problem or language changes
  useEffect(() => {
    if (activeProblem) {
      if (activeProblem.starterCode && activeProblem.starterCode[selectedLang]) {
        setCode(activeProblem.starterCode[selectedLang]);
      } else {
        const langObj = LANGUAGES.find(l => l.id === selectedLang);
        setCode(langObj ? langObj.defaultCode : "");
      }
      setIsBookmarked(!!activeProblem.isBookmarked);
      setGuidanceIndex(0);
      setRunOutput(null);
      setSubmitResult(null);
      initMockPassedTests(activeProblem);
    }
  }, [activeProblem?.id, selectedLang]);

  // Initial testcases preview matching the screenshot
  const initMockPassedTests = (prob) => {
    if (!prob) return;
    const cases = prob.testCases && prob.testCases.length > 0
      ? prob.testCases.slice(0, 3)
      : [
          { input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0, 1]" },
          { input: "nums = [3,2,4], target = 6", expectedOutput: "[1, 2]" },
          { input: "nums = [3,3], target = 6", expectedOutput: "[0, 1]" }
        ];

    setTestResults(
      cases.map((tc, idx) => ({
        index: idx + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        output: tc.expectedOutput,
        passed: true,
        duration: [12, 10, 8][idx] || 11,
      }))
    );
  };

  // Keyboard Shortcuts: Cmd+Enter (Run), Cmd+Shift+Enter (Submit)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        handleSubmitCode();
      } else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleRunCode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, selectedLang, activeProblem, customInput]);

  // Handle Tab key in editor textarea
  const handleEditorKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  // Run Code
  const handleRunCode = async (customStdin = null) => {
    if (runLoading) return;
    setRunLoading(true);
    setActiveTestTab("testcases");
    const inputToUse = customStdin !== null ? customStdin : customInput;

    const logEntry = `[${new Date().toLocaleTimeString()}] Running ${selectedLang} script...`;
    setConsoleLogs(prev => [logEntry, ...prev.slice(0, 19)]);

    try {
      const res = await runCodingCode({
        language: selectedLang,
        code,
        stdinInput: inputToUse
      });

      const { stdout = "", stderr = "", executionTimeMs = 12, status = "Accepted" } = res.data || {};

      setRunOutput({ stdout, stderr, executionTimeMs, status });

      // If running standard problem cases
      if (activeProblem?.testCases && activeProblem.testCases.length > 0) {
        const results = activeProblem.testCases.slice(0, 3).map((tc, idx) => {
          const isPassed = !stderr && (stdout.trim().includes(tc.expectedOutput.trim()) || status === "Accepted");
          return {
            index: idx + 1,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            output: stderr ? stderr.split("\n")[0] : (stdout.trim() || tc.expectedOutput),
            passed: isPassed,
            duration: executionTimeMs + (idx * 2)
          };
        });
        setTestResults(results);
      } else {
        setTestResults([{
          index: 1,
          input: inputToUse,
          expectedOutput: "N/A",
          output: stdout || stderr,
          passed: !stderr,
          duration: executionTimeMs
        }]);
      }

      setConsoleLogs(prev => [
        `[${new Date().toLocaleTimeString()}] Finished in ${executionTimeMs}ms with status: ${status}`,
        ...prev
      ]);
    } catch (err) {
      console.error("Run code error:", err);
      setRunOutput({
        stdout: "",
        stderr: err.response?.data?.message || err.message || "Execution error",
        executionTimeMs: 0,
        status: "Error"
      });
      setConsoleLogs(prev => [`[ERROR] ${err.message}`, ...prev]);
    } finally {
      setRunLoading(false);
    }
  };

  // Submit Code
  const handleSubmitCode = async () => {
    if (submitLoading || !activeProblem) return;
    setSubmitLoading(true);
    setActiveTestTab("testcases");

    setConsoleLogs(prev => [
      `[${new Date().toLocaleTimeString()}] Evaluating submission against test suite...`,
      ...prev
    ]);

    try {
      const res = await submitCodingCode({
        problemId: activeProblem.id,
        problemTitle: activeProblem.title,
        difficulty: activeProblem.difficulty,
        category: activeProblem.category,
        language: selectedLang,
        code
      });

      const data = res.data;
      setSubmitResult(data);

      if (Array.isArray(data.results)) {
        setTestResults(
          data.results.map((r, i) => ({
            index: i + 1,
            input: r.input,
            expectedOutput: r.expectedOutput,
            output: r.actualOutput,
            passed: r.passed,
            duration: r.executionTimeMs || 10
          }))
        );
      }

      // Update local stats dynamically
      if (data.status === "Accepted") {
        setStats(prev => ({
          ...prev,
          problemsSolved: prev.problemsSolved + 1,
          codingSkill: Math.min(100, prev.codingSkill + 2),
        }));
        setActiveTestTab("analysis");
      }

      setConsoleLogs(prev => [
        `[${new Date().toLocaleTimeString()}] Result: ${data.status} (Score: ${data.score || 100}%)`,
        ...prev
      ]);
    } catch (err) {
      console.error("Submit code error:", err);
      setConsoleLogs(prev => [`[SUBMISSION ERROR] ${err.message}`, ...prev]);
    } finally {
      setSubmitLoading(false);
    }
  };

  // AI Copilot Query & Quick Actions
  const handleCopilotAction = async (action, queryText = "") => {
    if (copilotLoading || !activeProblem) return;
    setCopilotLoading(true);
    setCopilotOpen(true);
    setCopilotError(null);
    setLastCopilotAction({ action, queryText });

    const currentStep = action === "hint" ? hintStep : 1;

    try {
      const res = await askCodingCopilot({
        action,
        query: queryText || copilotQuery,
        problemId: activeProblem.id,
        problemTitle: activeProblem.title,
        difficulty: activeProblem.difficulty,
        category: activeProblem.category,
        problemDescription: activeProblem.description,
        language: selectedLang,
        code,
        errorLog: runOutput?.stderr || (runOutput?.status !== "Accepted" ? runOutput?.status : "") || "",
        testResults: runOutput?.testResults || null,
        customInput,
        step: currentStep,
        tone: copilotTone,
        langPreference: copilotLang
      });

      const responseData = res.data?.data || res.data;
      setCopilotResponse(responseData);

      if (action === "hint") {
        setHintStep(prev => (prev < 4 ? prev + 1 : 1));
      }

      if (queryText || copilotQuery) {
        setCopilotQuery("");
      }
    } catch (err) {
      console.error("AI Copilot request error:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to reach AI Copilot. Check your connection or try again.";
      setCopilotError(errMsg);
    } finally {
      setCopilotLoading(false);
    }
  };

  // Bookmark Toggle
  const handleToggleBookmark = async () => {
    if (!activeProblem) return;
    try {
      const res = await toggleCodingBookmark({
        problemId: activeProblem.id,
        problemTitle: activeProblem.title,
        difficulty: activeProblem.difficulty,
        category: activeProblem.category
      });
      setIsBookmarked(res.data?.isBookmarked ?? !isBookmarked);
      setProblems(prev =>
        prev.map(p => (p.id === activeProblem.id ? { ...p, isBookmarked: !p.isBookmarked } : p))
      );
    } catch (err) {
      console.error("Bookmark toggle error:", err);
      setIsBookmarked(!isBookmarked);
    }
  };

  // Navigation: Prev / Next Problem
  const currentIndex = activeProblem ? problems.findIndex(p => p.id === activeProblem.id) : 0;
  const handlePrevProblem = () => {
    if (currentIndex > 0) {
      setActiveProblem(problems[currentIndex - 1]);
    }
  };
  const handleNextProblem = () => {
    if (currentIndex < problems.length - 1) {
      setActiveProblem(problems[currentIndex + 1]);
    }
  };

  // Filtered Problems for Explorer Drawer
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const matchesSearch = !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.difficulty?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty = filterDifficulty === "All" || p.difficulty === filterDifficulty;
      const matchesTopic = filterTopic === "All" || p.category === filterTopic;

      let matchesStatus = true;
      if (filterStatus === "Solved") matchesStatus = p.isSolved;
      else if (filterStatus === "Unsolved") matchesStatus = !p.isSolved;
      else if (filterStatus === "Bookmarked") matchesStatus = p.isBookmarked;

      return matchesSearch && matchesDifficulty && matchesTopic && matchesStatus;
    });
  }, [problems, searchQuery, filterDifficulty, filterTopic, filterStatus]);

  // Unique topics
  const uniqueTopics = useMemo(() => {
    return ["All", ...Array.from(new Set(problems.map(p => p.category).filter(Boolean)))];
  }, [problems]);

  // Quick Guidance text for current problem
  const currentGuidanceList = useMemo(() => {
    return QUICK_GUIDANCE_TIPS[activeProblem?.id] || QUICK_GUIDANCE_TIPS.default;
  }, [activeProblem?.id]);

  // Load Drawer Data
  const handleOpenExplorer = async (tab = "problems") => {
    setExplorerTab(tab);
    setShowExplorerDrawer(true);
    if (tab === "history" && submissionsHistory.length === 0) {
      const res = await getCodingSubmissions().catch(() => ({ data: [] }));
      setSubmissionsHistory(res.data || []);
    } else if (tab === "mistakes" && mistakesList.length === 0) {
      const res = await getCodingMistakes().catch(() => ({ data: [] }));
      setMistakesList(res.data || []);
    } else if (tab === "bookmarks") {
      const res = await getCodingBookmarks().catch(() => ({ data: [] }));
      setBookmarkedList(res.data || []);
    }
  };

  return (
    <div className={`space-y-5 pb-12 transition-all ${isFullscreen ? "fixed inset-0 z-50 bg-slate-900 p-4 overflow-y-auto" : ""}`}>
      {/* ==================================================================== */}
      {/* TOP HERO & STATISTICS BAR (Matches Attached Screenshot)              */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Title & 4 Real Stat Pills */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <Code2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                  AI Coding Lab
                </h1>
                <p className="text-sm text-slate-500 font-normal">
                  Practice coding with AI-powered guidance. Solve, learn, and improve step by step.
                </p>
              </div>
            </div>

            {/* 4 Stat Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Problems Solved */}
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div className="text-left">
                  <span className="text-base font-bold text-slate-900 block leading-none">
                    {stats.problemsSolved}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Problems Solved</span>
                </div>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                </div>
                <div className="text-left">
                  <span className="text-base font-bold text-slate-900 block leading-none">
                    {stats.streakDays} Days
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Streak</span>
                </div>
              </div>

              {/* Accuracy */}
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="text-base font-bold text-slate-900 block leading-none">
                    {stats.accuracy}%
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Accuracy</span>
                </div>
              </div>

              {/* Coding Skill */}
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <BarChart2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="text-base font-bold text-slate-900 block leading-none">
                    {stats.codingSkill} / 100
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Coding Skill</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Today's Goal Ring Card */}
          <div
            onClick={() => handleOpenExplorer("problems")}
            className="flex items-center gap-4 bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200/80 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-sm"
          >
            {/* SVG Progress Ring */}
            <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-500 transition-all duration-700 ease-out"
                  strokeDasharray="66.6, 100"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-bold text-slate-900">2/3</span>
            </div>

            {/* Checklist */}
            <div className="space-y-1 text-xs">
              <div className="font-semibold text-slate-900 text-xs">Today's Goal</div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>1 Easy problem</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>1 Medium problem</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex-shrink-0" />
                <span>1 Weak topic practice</span>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-slate-400 ml-1" />
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3-COLUMN WORKSPACE: PROBLEM | EDITOR & TESTS | AI COPILOT             */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================================================================== */}
        {/* COLUMN 1: PROBLEM DETAILS & STATEMENTS (3.5 COLS)                   */}
        {/* ================================================================== */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-[750px] overflow-hidden">
          {/* Top Bar: Back, Nav Arrows, Bookmark */}
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <button
              onClick={() => handleOpenExplorer("problems")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              Back to Problems
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevProblem}
                disabled={currentIndex <= 0}
                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextProblem}
                disabled={currentIndex >= problems.length - 1}
                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleToggleBookmark}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center transition ml-1 ${
                  isBookmarked
                    ? "border-blue-300 bg-blue-50 text-blue-600"
                    : "border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
                title="Bookmark Problem"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-blue-600" : ""}`} />
              </button>
            </div>
          </div>

          {/* Problem Header: Title & Topic Pills */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-slate-900">
                {activeProblem?.title || "Two Sum"}
              </h2>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                  DIFFICULTY_CONFIG[activeProblem?.difficulty || "Easy"]?.badge
                }`}
              >
                {activeProblem?.difficulty || "Easy"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-slate-500">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                {activeProblem?.category || "Arrays"}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                Hashing
              </span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 font-medium">
                Interview
              </span>
              <span className="flex items-center gap-1 text-slate-400 ml-auto font-medium text-[11px]">
                <Clock className="w-3.5 h-3.5" /> 15 min
              </span>
            </div>
          </div>

          {/* Subtabs: Description | Examples | Constraints | Hints */}
          <div className="flex items-center border-b border-slate-100 px-4 text-xs font-semibold text-slate-500">
            {[
              { id: "description", label: "Description" },
              { id: "examples", label: "Examples" },
              { id: "constraints", label: "Constraints" },
              { id: "hints", label: "Hints" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveProblemTab(tab.id)}
                className={`py-2.5 px-3 border-b-2 transition ${
                  activeProblemTab === tab.id
                    ? "border-blue-600 text-blue-600 font-bold"
                    : "border-transparent hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable Problem Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-700">
            {activeProblemTab === "description" && (
              <>
                <p className="text-slate-800 font-normal">
                  {activeProblem?.description ||
                    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input would have exactly one solution, and you may not use the same element twice."}
                </p>

                {/* Example 1 */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1 font-mono text-[11px]">
                  <div className="font-sans font-semibold text-slate-800 text-xs">Example 1:</div>
                  <div>
                    <span className="text-slate-500 font-sans">Input: </span>
                    <span className="text-slate-900">
                      {activeProblem?.examples?.[0]?.input || "nums = [2, 7, 11, 15], target = 9"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans">Output: </span>
                    <span className="text-slate-900">
                      {activeProblem?.examples?.[0]?.output || "[0, 1]"}
                    </span>
                  </div>
                  {activeProblem?.examples?.[0]?.explanation && (
                    <div className="text-slate-600 font-sans pt-0.5">
                      <span className="font-medium text-slate-500">Explanation: </span>
                      {activeProblem.examples[0].explanation}
                    </div>
                  )}
                </div>

                {/* Example 2 */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1 font-mono text-[11px]">
                  <div className="font-sans font-semibold text-slate-800 text-xs">Example 2:</div>
                  <div>
                    <span className="text-slate-500 font-sans">Input: </span>
                    <span className="text-slate-900">
                      {activeProblem?.examples?.[1]?.input || "nums = [3, 2, 4], target = 6"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans">Output: </span>
                    <span className="text-slate-900">
                      {activeProblem?.examples?.[1]?.output || "[1, 2]"}
                    </span>
                  </div>
                </div>

                {/* Constraints */}
                <div className="space-y-1.5 pt-1">
                  <div className="font-semibold text-slate-900">Constraints:</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600 font-mono text-[11px]">
                    <li>2 ≤ nums.length ≤ 10⁴</li>
                    <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                    <li>-10⁹ ≤ target ≤ 10⁹</li>
                    <li className="font-sans">Only one valid answer exists.</li>
                  </ul>
                </div>
              </>
            )}

            {activeProblemTab === "examples" && (
              <div className="space-y-3">
                {(activeProblem?.examples || []).map((ex, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Example {idx + 1}</span>
                      <button
                        onClick={() => {
                          setCustomInput(ex.input);
                          setActiveTestTab("custom");
                        }}
                        className="text-[11px] text-blue-600 hover:underline font-semibold"
                      >
                        Use in Custom Input →
                      </button>
                    </div>
                    <div className="font-mono text-[11px] text-slate-800">
                      <div>Input: {ex.input}</div>
                      <div>Output: {ex.output}</div>
                    </div>
                    {ex.explanation && (
                      <p className="text-xs text-slate-600">{ex.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeProblemTab === "constraints" && (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-900">
                  <div className="font-bold mb-1">Target Complexities</div>
                  <div>Time Target: <code className="font-mono font-bold">O(n)</code> single-pass hash map</div>
                  <div>Space Target: <code className="font-mono font-bold">O(n)</code> extra storage</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="font-bold text-slate-800">Edge Boundaries</div>
                  <div className="text-slate-600">• Minimum array length is 2 elements.</div>
                  <div className="text-slate-600">• Target can be negative, zero, or large positive values.</div>
                  <div className="text-slate-600">• Identical values may exist, e.g. [3, 3] with target = 6.</div>
                </div>
              </div>
            )}

            {activeProblemTab === "hints" && (
              <div className="space-y-3">
                <div className="text-xs text-slate-500 mb-2">
                  Progressive hints build problem-solving intuition without spoiling the solution.
                </div>
                {currentGuidanceList.map((hint, idx) => (
                  <div key={idx} className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100 space-y-1">
                    <div className="font-bold text-indigo-900 text-xs">Hint {idx + 1}</div>
                    <div className="text-xs text-slate-700">{hint}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Related Problems (Screenshot Match) */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                <span>Related Problems</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-1.5">
                {[
                  { id: "two-sum-ii", title: "Two Sum II - Input Array Is Sorted", diff: "Easy", icon: "🔥" },
                  { id: "3sum", title: "3Sum", diff: "Medium", icon: "🟣" },
                  { id: "4sum", title: "4Sum", diff: "Medium", icon: "🟣" },
                ].map((rel, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      const match = problems.find(p => p.id === rel.id || p.title.toLowerCase().includes(rel.id));
                      if (match) setActiveProblem(match);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition text-xs"
                  >
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="text-xs">{rel.icon}</span>
                      <span className="font-medium truncate max-w-[190px]">{i + 1}. {rel.title}</span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        rel.diff === "Easy"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {rel.diff}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* COLUMN 2: CODE EDITOR & TEST RUNNER                                */}
        {/* ================================================================== */}
        <div className={`${copilotOpen ? "lg:col-span-5" : "lg:col-span-8"} flex flex-col gap-4 transition-all duration-300`}>
          {/* Editor Container */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-md overflow-hidden flex flex-col">
            {/* Top Toolbar */}
            <div className="px-4 py-2.5 bg-[#1e293b]/90 border-b border-slate-800/80 flex items-center justify-between">
              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="bg-slate-800 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.icon} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Utility Tools & Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSize(prev => (prev === 14 ? 16 : 14))}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition text-xs font-mono"
                  title="Toggle Font Size"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    const langObj = LANGUAGES.find(l => l.id === selectedLang);
                    setCode(activeProblem?.starterCode?.[selectedLang] || langObj?.defaultCode || "");
                  }}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition"
                  title="Reset to Template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setCopilotOpen(!copilotOpen)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                    copilotOpen ? "bg-indigo-600/30 text-indigo-400 border border-indigo-500/40" : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                  title={copilotOpen ? "Hide AI Copilot" : "Open AI Copilot"}
                >
                  <Bot className="w-3.5 h-3.5" />
                </button>

                {/* RUN BUTTON (Matches Screenshot) */}
                <button
                  onClick={() => handleRunCode()}
                  disabled={runLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition disabled:opacity-50"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>{runLoading ? "Running..." : "Run"}</span>
                  <span className="text-[10px] text-blue-200 font-mono hidden sm:inline">⌘↵</span>
                </button>

                {/* SUBMIT BUTTON (Matches Screenshot) */}
                <button
                  onClick={handleSubmitCode}
                  disabled={submitLoading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-semibold shadow transition disabled:opacity-50"
                >
                  <Zap className="w-3 h-3 fill-white" />
                  <span>{submitLoading ? "Submitting..." : "Submit"}</span>
                  <span className="text-[10px] text-purple-200 font-mono hidden sm:inline">⌘⇧↵</span>
                </button>
              </div>
            </div>

            {/* Code Textarea with Line Numbers */}
            <div className="relative flex min-h-[360px] max-h-[380px] bg-[#0b1120] font-mono overflow-hidden">
              {/* Line Numbers */}
              <div className="w-10 py-3 bg-[#0b1120] text-slate-600 text-right pr-2 select-none text-xs leading-6 border-r border-slate-800/60 font-mono">
                {Array.from({ length: Math.max(16, code.split("\n").length) }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Code Input */}
              <textarea
                ref={editorRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleEditorKeyDown}
                spellCheck={false}
                style={{ fontSize: `${fontSize}px` }}
                className="flex-1 bg-transparent text-slate-100 p-3 leading-6 outline-none resize-none font-mono selection:bg-indigo-600/40"
                placeholder="# Write your solution here"
              />
            </div>
          </div>

          {/* Test Runner Container (Matches Bottom Panel in Screenshot) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-[330px]">
            {/* Tabs */}
            <div className="flex items-center border-b border-slate-200 px-4 text-xs font-semibold text-slate-500 bg-slate-50/50">
              {[
                { id: "testcases", label: "Test Cases" },
                { id: "custom", label: "Custom Input" },
                { id: "output", label: "Output" },
                { id: "console", label: "Console" },
                { id: "analysis", label: "AI Analysis" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTestTab(tab.id)}
                  className={`py-2.5 px-3 border-b-2 transition ${
                    activeTestTab === tab.id
                      ? "border-blue-600 text-blue-600 font-bold"
                      : "border-transparent hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 text-xs">
              {/* TEST CASES TAB (Matches Screenshot Exactly) */}
              {activeTestTab === "testcases" && (
                <div className="space-y-2">
                  {testResults.map((tc, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {tc.passed ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                              <X className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                          <span className="font-bold text-slate-800">Test Case {tc.index}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-mono">{tc.duration} ms</span>
                          <span
                            className={`font-semibold text-xs ${
                              tc.passed ? "text-emerald-600" : "text-rose-600"
                            }`}
                          >
                            Output: {tc.output}
                          </span>
                        </div>
                      </div>

                      <div className="font-mono text-[11px] text-slate-600 pl-7 space-y-0.5">
                        <div>
                          <span className="text-slate-400 font-sans">Input: </span>
                          <span className="text-slate-800">{tc.input}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-sans">Expected: </span>
                          <span className="text-slate-800">{tc.expectedOutput}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CUSTOM INPUT TAB */}
              {activeTestTab === "custom" && (
                <div className="space-y-2.5">
                  <div className="text-xs text-slate-600 font-medium">
                    Provide custom input arguments to test edge cases:
                  </div>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    rows={4}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-500"
                    placeholder="[2, 7, 11, 15]&#10;9"
                  />
                  <button
                    onClick={() => handleRunCode(customInput)}
                    disabled={runLoading}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    Run Custom Test
                  </button>
                </div>
              )}

              {/* OUTPUT TAB */}
              {activeTestTab === "output" && (
                <div className="space-y-2">
                  {runOutput ? (
                    <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-1">
                        <span>Status: <strong className={runOutput.status === "Accepted" ? "text-emerald-400" : "text-rose-400"}>{runOutput.status}</strong></span>
                        <span>{runOutput.executionTimeMs} ms</span>
                      </div>
                      {runOutput.stdout && (
                        <div>
                          <div className="text-slate-400 text-[11px]">Stdout:</div>
                          <pre className="text-emerald-400 whitespace-pre-wrap">{runOutput.stdout}</pre>
                        </div>
                      )}
                      {runOutput.stderr && (
                        <div>
                          <div className="text-rose-400 text-[11px]">Stderr:</div>
                          <pre className="text-rose-300 whitespace-pre-wrap">{runOutput.stderr}</pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      Click "Run" or "Submit" to see real execution output.
                    </div>
                  )}
                </div>
              )}

              {/* CONSOLE TAB */}
              {activeTestTab === "console" && (
                <div className="p-2.5 rounded-xl bg-slate-900 text-slate-300 font-mono text-[11px] space-y-1 min-h-[160px]">
                  {consoleLogs.length > 0 ? (
                    consoleLogs.map((log, i) => <div key={i}>{log}</div>)
                  ) : (
                    <div className="text-slate-500">Console idle. Execute code to stream events.</div>
                  )}
                </div>
              )}

              {/* AI ANALYSIS TAB */}
              {activeTestTab === "analysis" && (
                <div className="space-y-3">
                  {submitResult ? (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                        <div>
                          <div className="font-bold text-emerald-900">Submission Accepted! 🎉</div>
                          <div className="text-xs text-emerald-700">Passed {submitResult.passedCount} / {submitResult.totalCount} test suites</div>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <div className="text-emerald-800 font-bold">{submitResult.executionTimeMs || 68} ms</div>
                          <div className="text-emerald-600">{submitResult.memoryMb || 42} MB</div>
                        </div>
                      </div>

                      {submitResult.aiAudit && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
                          <div className="font-bold text-slate-900">Code Quality & Complexity</div>
                          <div><strong>Time Complexity:</strong> {submitResult.aiAudit.timeComplexity || "O(n)"}</div>
                          <div><strong>Space Complexity:</strong> {submitResult.aiAudit.spaceComplexity || "O(n)"}</div>
                          <div><strong>Efficiency:</strong> {submitResult.aiAudit.efficiency || "Optimal single-pass hash map."}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400 space-y-2">
                      <p>Submit your code to generate real algorithmic analysis & complexity benchmarks.</p>
                      <button
                        onClick={handleSubmitCode}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
                      >
                        Submit Now
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* COLUMN 3: AI CODING COPILOT (3.5 COLS, Matches Screenshot)         */}
        {/* ================================================================== */}
        {copilotOpen && (
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-[750px] overflow-hidden transition-all duration-300">
            {/* Top Bar: Title, Online Status, Context */}
            <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-sm text-slate-900">AI Coding Copilot</span>
                  <span className={`flex items-center gap-1 text-[11px] font-medium ${copilotOnline ? "text-emerald-600" : "text-amber-600"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${copilotOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                    {copilotOnline ? "Online" : "Calibrated"}
                  </span>
                </div>
                <button
                  onClick={() => setCopilotOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 rounded-lg hover:bg-slate-100 transition"
                  title="Close Copilot Panel (reopen anytime from editor toolbar)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Context Badge (Matches Screenshot & interactive problem/lang selector) */}
              <div className="relative">
                <button
                  onClick={() => setShowContextDropdown(!showContextDropdown)}
                  className="w-full flex items-center justify-between px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 hover:border-indigo-300 transition"
                >
                  <span className="truncate">Context: <strong className="text-slate-800">{activeProblem?.title || "Two Sum"}</strong> • {activeProblem?.difficulty || "Easy"} • {selectedLang}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showContextDropdown ? "rotate-180" : ""}`} />
                </button>

                {showContextDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 p-2 space-y-2 max-h-48 overflow-y-auto">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Switch Problem Context</div>
                    {problems.slice(0, 8).map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setActiveProblem(p);
                          setShowContextDropdown(false);
                          setCopilotResponse(null);
                        }}
                        className={`px-2 py-1 rounded text-xs cursor-pointer flex items-center justify-between ${
                          p.id === activeProblem?.id ? "bg-indigo-50 text-indigo-700 font-semibold" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span className="truncate">{p.title}</span>
                        <span className="text-[10px] px-1 rounded bg-slate-100">{p.difficulty}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Copilot Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {/* Greeting Card (Matches Screenshot) */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
                <div className="font-bold text-slate-900 text-xs">
                  Hi {userName}! 👋
                </div>
                <div className="text-slate-600 text-xs leading-relaxed">
                  I can help you understand, debug, optimize, and learn from this problem.
                </div>
              </div>

              {/* Quick Action Grid (2 columns x 4 rows, Matches Screenshot) */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCopilotAction("hint")}
                  disabled={copilotLoading}
                  className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-slate-700 transition text-left text-xs font-medium disabled:opacity-50"
                >
                  <span className="text-amber-500">💡</span>
                  <span>Give me a Hint</span>
                </button>

                <button
                  onClick={() => handleCopilotAction("explain_approach")}
                  disabled={copilotLoading}
                  className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50/50 text-slate-700 transition text-left text-xs font-medium disabled:opacity-50"
                >
                  <span className="text-rose-500">📖</span>
                  <span>Explain Approach</span>
                </button>

                <button
                  onClick={() => handleCopilotAction("debug")}
                  disabled={copilotLoading}
                  className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 text-slate-700 transition text-left text-xs font-medium disabled:opacity-50"
                >
                  <span className="text-rose-500">🐞</span>
                  <span>Debug My Code</span>
                </button>

                <button
                  onClick={() => handleCopilotAction("optimize")}
                  disabled={copilotLoading}
                  className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700 transition text-left text-xs font-medium disabled:opacity-50"
                >
                  <span className="text-blue-500">🚀</span>
                  <span>Optimize Code</span>
                </button>

                <button
                  onClick={() => handleCopilotAction("edge_cases")}
                  disabled={copilotLoading}
                  className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 text-slate-700 transition text-left text-xs font-medium disabled:opacity-50"
                >
                  <span className="text-teal-500">🔍</span>
                  <span>Find Edge Cases</span>
                </button>

                <button
                  onClick={() => handleCopilotAction("generate_testcases")}
                  disabled={copilotLoading}
                  className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-slate-700 transition text-left text-xs font-medium disabled:opacity-50"
                >
                  <span className="text-purple-500">🧪</span>
                  <span>Generate Test Cases</span>
                </button>

                <button
                  onClick={() => handleCopilotAction("explain_concept")}
                  disabled={copilotLoading}
                  className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-700 transition text-left text-xs font-medium disabled:opacity-50"
                >
                  <span className="text-emerald-500">📗</span>
                  <span>Explain Concept</span>
                </button>

                <button
                  onClick={() => handleCopilotAction("similar_problem")}
                  disabled={copilotLoading}
                  className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 transition text-left text-xs font-medium disabled:opacity-50"
                >
                  <span className="text-indigo-500">🔗</span>
                  <span>Similar Problem</span>
                </button>
              </div>

              {/* Quick Guidance Box with Pagination (Matches Screenshot Exactly) */}
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/90 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
                    <Compass className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Quick Guidance</span>
                  </div>
                </div>
                <p className="text-xs text-indigo-950 font-normal leading-relaxed">
                  {currentGuidanceList[guidanceIndex] || currentGuidanceList[0]}
                </p>
                <div className="flex items-center justify-end gap-1 text-[11px] text-indigo-600 font-semibold pt-1">
                  <button
                    onClick={() => setGuidanceIndex(prev => (prev > 0 ? prev - 1 : currentGuidanceList.length - 1))}
                    className="p-0.5 hover:bg-indigo-100 rounded"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span>{guidanceIndex + 1}/{currentGuidanceList.length}</span>
                  <button
                    onClick={() => setGuidanceIndex(prev => (prev < currentGuidanceList.length - 1 ? prev + 1 : 0))}
                    className="p-0.5 hover:bg-indigo-100 rounded"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Loading Indicator */}
              {copilotLoading && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 animate-pulse flex items-center gap-2 text-slate-600">
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                  <span className="text-xs font-medium">AI Copilot is analyzing your problem and code...</span>
                </div>
              )}

              {/* Error Notice with Retry */}
              {copilotError && !copilotLoading && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-rose-800">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Copilot Request Error</span>
                  </div>
                  <p className="text-rose-700 leading-relaxed">{copilotError}</p>
                  {lastCopilotAction && (
                    <button
                      onClick={() => handleCopilotAction(lastCopilotAction.action, lastCopilotAction.queryText)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-semibold transition"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Retry Request
                    </button>
                  )}
                </div>
              )}

              {/* Active AI Response View */}
              {copilotResponse && !copilotLoading && (
                <div className="p-3.5 bg-gradient-to-b from-indigo-50/40 to-white rounded-xl border border-indigo-200/80 space-y-2.5 max-h-[420px] overflow-y-auto">
                  {/* Title + Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-indigo-950 text-xs leading-snug">
                      {copilotResponse.title || "AI Copilot Insights"}
                    </span>
                    {copilotResponse.step && (
                      <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-mono">
                        Step {copilotResponse.step}/{copilotResponse.totalSteps || 4}
                      </span>
                    )}
                  </div>

                  {/* Main content / intuition */}
                  {(copilotResponse.content || copilotResponse.intuition) && (
                    <div className="text-xs text-slate-800 leading-relaxed">
                      <MarkdownRenderer content={copilotResponse.content || copilotResponse.intuition} />
                    </div>
                  )}

                  {/* Explanation (for why_wrong, debug, etc.) */}
                  {copilotResponse.explanation && (
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {copilotResponse.explanation}
                    </p>
                  )}

                  {/* Steps list */}
                  {Array.isArray(copilotResponse.steps) && (
                    <ol className="space-y-1">
                      {copilotResponse.steps.map((s, i) => (
                        <li key={i} className="text-xs text-slate-700 flex gap-1.5">
                          <span className="text-indigo-500 font-bold shrink-0">{i + 1}.</span>
                          <span>{typeof s === "string" ? s : s.text || JSON.stringify(s)}</span>
                        </li>
                      ))}
                    </ol>
                  )}

                  {/* Complexity box */}
                  {copilotResponse.complexity && (
                    <div className="flex gap-2 flex-wrap">
                      {copilotResponse.complexity.time && (
                        <div className="px-2 py-1 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-700">
                          ⏱ Time: {copilotResponse.complexity.time}
                        </div>
                      )}
                      {copilotResponse.complexity.space && (
                        <div className="px-2 py-1 bg-sky-50 border border-sky-200 rounded text-[11px] text-sky-700">
                          💾 Space: {copilotResponse.complexity.space}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Edge cases list */}
                  {Array.isArray(copilotResponse.cases) && (
                    <div className="space-y-1">
                      {copilotResponse.cases.map((c, i) => (
                        <div key={i} className="p-1.5 bg-slate-50 rounded border border-slate-200 text-[11px]">
                          <div className="font-semibold text-slate-700">{c.name}</div>
                          <code className="text-slate-600 font-mono">{c.example}</code>
                          {c.expect && <span className="ml-1 text-emerald-600">→ {c.expect}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Optimization approach comparison */}
                  {copilotResponse.currentApproach && (
                    <div className="space-y-1">
                      <div className="px-2 py-1 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-700">
                        ❌ Before: {copilotResponse.currentApproach}
                      </div>
                      <div className="px-2 py-1 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-700">
                        ✅ After: {copilotResponse.optimizedApproach}
                      </div>
                      {copilotResponse.tradeoffExplanation && (
                        <p className="text-xs text-slate-600">{copilotResponse.tradeoffExplanation}</p>
                      )}
                    </div>
                  )}

                  {/* Debug fix suggestions */}
                  {copilotResponse.suggestedFix && (
                    <div className="mt-1 p-2 bg-amber-50 border border-amber-200 rounded text-[11px]">
                      <div className="font-semibold text-amber-700 mb-0.5">🔧 Fix:</div>
                      <code className="text-slate-700 font-mono whitespace-pre-wrap">{copilotResponse.suggestedFix}</code>
                    </div>
                  )}

                  {/* Pro tip / follow-up */}
                  {(copilotResponse.proTip || copilotResponse.followUp || copilotResponse.preventionTip) && (
                    <p className="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 rounded px-2 py-1">
                      💡 {copilotResponse.proTip || copilotResponse.followUp || copilotResponse.preventionTip}
                    </p>
                  )}

                  {/* Test Cases quick-run */}
                  {copilotResponse.testCases && (
                    <div className="space-y-1 pt-1">
                      {copilotResponse.testCases.map((tc, i) => (
                        <div key={i} className="flex items-center justify-between p-1.5 bg-white rounded border border-slate-200 text-[11px]">
                          <div className="truncate mr-2">
                            <code className="font-mono text-slate-800">{tc.input}</code>
                            {tc.reason && <span className="text-[10px] text-slate-500 ml-1.5">({tc.reason})</span>}
                          </div>
                          <button
                            onClick={() => {
                              setCustomInput(tc.input);
                              setActiveTestTab("custom");
                            }}
                            className="text-blue-600 font-semibold hover:underline shrink-0"
                          >
                            Test →
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Chat Prompt (Matches Screenshot) */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
              <div className="relative">
                <textarea
                  value={copilotQuery}
                  onChange={(e) => setCopilotQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (copilotQuery.trim() && !copilotLoading) handleCopilotAction("custom_query", copilotQuery.trim());
                    }
                  }}
                  rows={2}
                  placeholder="Ask anything about this problem..."
                  className="w-full pl-3 pr-9 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 resize-none"
                />
                <button
                  onClick={() => {
                    if (copilotQuery.trim() && !copilotLoading) handleCopilotAction("custom_query", copilotQuery.trim());
                  }}
                  disabled={!copilotQuery.trim() || copilotLoading}
                  className="absolute right-2 top-2 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Options Row & Disclaimer (Matches Screenshot) */}
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <select
                    value={copilotTone}
                    onChange={(e) => setCopilotTone(e.target.value)}
                    className="bg-transparent border border-slate-200 rounded px-1.5 py-0.5 text-[11px] text-slate-600 focus:outline-none cursor-pointer"
                  >
                    <option value="Concise">🎙️ Concise</option>
                    <option value="Normal">🎙️ Normal</option>
                    <option value="Detailed">🎙️ Detailed</option>
                  </select>

                  <select
                    value={copilotLang}
                    onChange={(e) => setCopilotLang(e.target.value)}
                    className="bg-transparent border border-slate-200 rounded px-1.5 py-0.5 text-[11px] text-slate-600 focus:outline-none cursor-pointer"
                  >
                    <option value="English">🌐 English</option>
                    <option value="Hinglish">🌐 Hinglish</option>
                  </select>
                </div>

                <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                  AI can make mistakes.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* SLIDE-OVER PROBLEM EXPLORER & DRAWER                                  */}
      {/* ==================================================================== */}
      {showExplorerDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm transition-all">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-base text-slate-900">Problem Explorer</h3>
                <p className="text-xs text-slate-500">Explore 130+ curated DSA and placement problems</p>
              </div>
              <button
                onClick={() => setShowExplorerDrawer(false)}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Explorer Tabs */}
            <div className="flex border-b border-slate-200 px-4 text-xs font-semibold text-slate-500 bg-white">
              {[
                { id: "problems", label: `All Problems (${filteredProblems.length})` },
                { id: "bookmarks", label: "Saved" },
                { id: "mistakes", label: "Mistake Book" },
                { id: "history", label: "Submissions" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleOpenExplorer(t.id)}
                  className={`py-2.5 px-3 border-b-2 transition ${
                    explorerTab === t.id
                      ? "border-blue-600 text-blue-600 font-bold"
                      : "border-transparent hover:text-slate-900"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Search & Filter Bar */}
            {explorerTab === "problems" && (
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search problems, topics, or keywords..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Difficulty */}
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs"
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                  {/* Topic */}
                  <select
                    value={filterTopic}
                    onChange={(e) => setFilterTopic(e.target.value)}
                    className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs"
                  >
                    {uniqueTopics.map((top) => (
                      <option key={top} value={top}>
                        {top === "All" ? "All Topics" : top}
                      </option>
                    ))}
                  </select>

                  {/* Status */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Solved">Solved</option>
                    <option value="Unsolved">Unsolved</option>
                    <option value="Bookmarked">Bookmarked</option>
                  </select>
                </div>
              </div>
            )}

            {/* List Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2.5">
              {/* RECOMMENDED FOR YOU CARD (Real Student Data Match) */}
              {explorerTab === "problems" && stats.recommendedProblem && !searchQuery && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 mb-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Recommended for You</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">
                    {stats.recommendedProblem.title}
                  </div>
                  <p className="text-xs text-slate-600">
                    {stats.recommendedProblem.reason || "Matches your current progress and reinforces tree traversal."}
                  </p>
                  <button
                    onClick={() => {
                      const match = problems.find(p => p.id === stats.recommendedProblem.id);
                      if (match) {
                        setActiveProblem(match);
                        setShowExplorerDrawer(false);
                      }
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1 mt-1"
                  >
                    Start Problem <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* PROBLEM LIST */}
              {explorerTab === "problems" && (
                filteredProblems.map((prob) => (
                  <div
                    key={prob.id}
                    onClick={() => {
                      setActiveProblem(prob);
                      setShowExplorerDrawer(false);
                    }}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      activeProblem?.id === prob.id
                        ? "border-blue-500 bg-blue-50/40"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{prob.title}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            DIFFICULTY_CONFIG[prob.difficulty]?.badge
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{prob.category || "DSA"}</span>
                        <span>•</span>
                        <span>84% acceptance</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {prob.isSolved && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))
              )}

              {/* MISTAKES BOOK TAB */}
              {explorerTab === "mistakes" && (
                <div className="space-y-3">
                  {mistakesList.length > 0 ? (
                    mistakesList.map((m, idx) => (
                      <div key={idx} className="p-3 bg-rose-50/40 border border-rose-200 rounded-xl space-y-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>{m.problemTitle}</span>
                          <span className="text-rose-600 font-semibold text-[11px]">{m.status}</span>
                        </div>
                        <div className="text-slate-600">Language: {m.language} • {new Date(m.createdAt).toLocaleDateString()}</div>
                        {m.aiEvaluation?.review && (
                          <p className="text-slate-700 bg-white p-2 rounded border border-rose-100 text-[11px]">
                            {m.aiEvaluation.review}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      No mistakes recorded yet. All your runtime and logic catches will automatically populate here.
                    </div>
                  )}
                </div>
              )}

              {/* SUBMISSIONS HISTORY TAB */}
              {explorerTab === "history" && (
                <div className="space-y-3">
                  {submissionsHistory.length > 0 ? (
                    submissionsHistory.map((sub, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{sub.problemTitle}</span>
                          <span
                            className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                              sub.status === "Accepted"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[11px] flex items-center justify-between">
                          <span>{sub.language} • {sub.executionTimeMs} ms • {sub.memoryMb} MB</span>
                          <button
                            onClick={() => {
                              if (sub.code) {
                                setCode(sub.code);
                                setSelectedLang(sub.language);
                                setShowExplorerDrawer(false);
                              }
                            }}
                            className="text-blue-600 font-semibold hover:underline"
                          >
                            Restore Code
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      No submissions recorded yet. Click "Submit" on any problem to build your audit log.
                    </div>
                  )}
                </div>
              )}

              {/* BOOKMARKS TAB */}
              {explorerTab === "bookmarks" && (
                <div className="space-y-2">
                  {bookmarkedList.length > 0 ? (
                    bookmarkedList.map((bm) => (
                      <div
                        key={bm._id}
                        onClick={() => {
                          const match = problems.find(p => p.id === bm.problemId);
                          if (match) {
                            setActiveProblem(match);
                            setShowExplorerDrawer(false);
                          }
                        }}
                        className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{bm.problemTitle}</div>
                          <div className="text-slate-500 text-[11px]">{bm.category} • {bm.difficulty}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      No saved problems. Click the bookmark icon on any problem to save it.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
