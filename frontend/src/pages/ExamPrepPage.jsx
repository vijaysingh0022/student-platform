import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getExamFilters,
  getExamQuestions,
  submitExamAttempt,
  getExamHistory,
} from "../services/api";

const EXAM_MODES = [
  {
    id: "exam",
    name: "Exam Mode",
    icon: "📝",
    tag: "Standard Exam",
    desc: "Full exam simulation with final comprehensive score and skill graph sync.",
    actionText: "Start Exam",
  },
  {
    id: "timed",
    name: "Timed Test",
    icon: "⏱️",
    tag: "Time Crunch",
    desc: "Strict countdown timer with auto-submission. Practice exam pacing.",
    actionText: "Start Timed",
  },
  {
    id: "instant",
    name: "Instant Evaluation",
    icon: "⚡",
    tag: "Instant Feedback",
    desc: "Check answers and view detailed pedagogical explanations right after each question.",
    actionText: "Start Instant",
  },
  {
    id: "revision",
    name: "Revision Mode",
    icon: "📚",
    tag: "Unit Notes & PYQ",
    desc: "Explore unit notes, key formulas, and PYQ solutions before taking tests.",
    actionText: "View Revision Notes",
  },
  {
    id: "weak",
    name: "Weak Topic Focus",
    icon: "🎯",
    tag: "Targeted Remediation",
    desc: "Target high-yield, complex, and previously missed questions to boost your score.",
    actionText: "Practice Weak Topics",
  },
];

const DEFAULT_FILTER_OPTIONS = {
  universities: ["All Universities", "AKTU", "VTU", "SPPU", "Anna University", "GATE", "Generic CSE"],
  semesters: ["All Semesters", "Semester 3", "Semester 4", "Semester 5", "Semester 6"],
  years: ["All Years", 2024, 2023, 2022],
  questionTypes: [
    { id: "All", name: "All Types" },
    { id: "mcq", name: "MCQs (Multiple Choice)" },
    { id: "short", name: "Short Answer Questions" },
    { id: "long", name: "Long Answer Questions" },
    { id: "numerical", name: "Numerical Problems" },
    { id: "pyq", name: "PYQs (Previous Year Questions)" },
  ],
  difficulties: ["All", "Easy", "Medium", "Hard"],
  subjects: [
    {
      id: "dsa",
      name: "Data Structures & Algorithms",
      units: [
        {
          id: "unit-1",
          name: "Unit 1: Linear Data Structures & Analysis",
          topics: [
            { id: "arrays-matrices", name: "Arrays & Matrices" },
            { id: "stacks-queues", name: "Stacks & Queues" },
          ],
        },
        {
          id: "unit-2",
          name: "Unit 2: Trees & Binary Search Trees",
          topics: [
            { id: "tree-traversals", name: "Tree Traversals" },
            { id: "avl-trees", name: "AVL Trees & Balance Factors" },
          ],
        },
        {
          id: "unit-3",
          name: "Unit 3: Graphs & Shortest Paths",
          topics: [{ id: "dijkstra-algorithm", name: "Dijkstra's Algorithm" }],
        },
      ],
    },
    {
      id: "dbms",
      name: "Database Management Systems",
      units: [
        {
          id: "unit-1",
          name: "Unit 1: ER Model & Relational Algebra",
          topics: [{ id: "er-diagrams", name: "ER Diagrams & Mapping" }],
        },
        {
          id: "unit-2",
          name: "Unit 2: SQL & Relational Calculus",
          topics: [{ id: "sql-joins", name: "SQL Joins & Subqueries" }],
        },
        {
          id: "unit-3",
          name: "Unit 3: Transactions & Concurrency Control",
          topics: [{ id: "acid-properties", name: "ACID Properties & Serializability" }],
        },
      ],
    },
    {
      id: "os",
      name: "Operating Systems",
      units: [
        {
          id: "unit-1",
          name: "Unit 1: Process Management & CPU Scheduling",
          topics: [{ id: "cpu-scheduling", name: "CPU Scheduling Algorithms" }],
        },
        {
          id: "unit-2",
          name: "Unit 2: Memory Management & Paging",
          topics: [{ id: "virtual-memory", name: "Virtual Memory & Page Faults" }],
        },
      ],
    },
    {
      id: "cn",
      name: "Computer Networks",
      units: [
        {
          id: "unit-1",
          name: "Unit 1: Data Link & Network Layer",
          topics: [{ id: "ip-addressing", name: "IP Subnetting & CIDR" }],
        },
      ],
    },
    {
      id: "system-design",
      name: "System Design & Architecture",
      units: [
        {
          id: "unit-1",
          name: "Unit 1: Scalability & Distributed Systems",
          topics: [{ id: "load-balancing", name: "Load Balancing & Caching" }],
        },
      ],
    },
  ],
};

export default function ExamPrepPage() {
  const [filters, setFilters] = useState({
    university: "All Universities",
    semester: "All Semesters",
    subjectId: "dsa",
    unitId: "All",
    year: "All Years",
    difficulty: "All",
    questionType: "All",
    topicId: "All",
  });

  const [filterOptions, setFilterOptions] = useState(DEFAULT_FILTER_OPTIONS);
  const [activeMode, setActiveMode] = useState("exam");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [revisionSearch, setRevisionSearch] = useState("");

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Active Test State
  const [inTest, setInTest] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { qIndex: selectedAns }
  const [flagged, setFlagged] = useState({}); // { qIndex: true }
  const [instantChecked, setInstantChecked] = useState({}); // { qIndex: true }
  const [timeLeft, setTimeLeft] = useState(1800); // in seconds
  const [totalTimeLimit, setTotalTimeLimit] = useState(1800);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [examHistory, setExamHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("practice"); // 'practice' | 'revision' | 'history'
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Load Filters & Questions on mount
  useEffect(() => {
    fetchFilters();
    fetchHistory();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  // Countdown timer for Timed Test
  useEffect(() => {
    let timer;
    if (inTest && activeMode === "timed" && timeLeft > 0 && !testCompleted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            executeFinalSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [inTest, activeMode, timeLeft, testCompleted]);

  const fetchFilters = async () => {
    try {
      const res = await getExamFilters();
      if (res.data && res.data.subjects && res.data.subjects.length > 0) {
        setFilterOptions(res.data);
      }
    } catch (err) {
      console.warn("Failed to load online filters, using defaults:", err.message);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await getExamQuestions({
        university: filters.university,
        semester: filters.semester,
        subjectId: filters.subjectId,
        unitId: filters.unitId,
        year: filters.year,
        difficulty: filters.difficulty,
        questionType: filters.questionType,
        topicId: filters.topicId,
      });
      if (res.data && Array.isArray(res.data.questions)) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      console.warn("Failed to fetch questions:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await getExamHistory();
      if (res.data && res.data.history) {
        setExamHistory(res.data.history);
      }
    } catch (err) {
      // Fallback: check localStorage for offline records
      const savedHistory = localStorage.getItem("learnx_exam_history");
      if (savedHistory) {
        try {
          setExamHistory(JSON.parse(savedHistory));
        } catch (_) {}
      }
    }
  };

  // Launch test with selected mode
  const handleStartTest = (modeToStart = activeMode) => {
    if (modeToStart === "revision") {
      setActiveTab("revision");
      return;
    }

    if (questions.length === 0) {
      alert("No questions found for the current configuration. Please select another subject or reset filters.");
      return;
    }

    setActiveMode(modeToStart);

    // Apply special ordering if Weak Topic Focus
    let activeQuestions = [...questions];
    if (modeToStart === "weak") {
      activeQuestions.sort((a, b) => {
        const aScore = (a.difficulty === "Hard" ? 2 : 1) + (a.isImportant ? 1 : 0);
        const bScore = (b.difficulty === "Hard" ? 2 : 1) + (b.isImportant ? 1 : 0);
        return bScore - aScore;
      });
    }

    // Set time: 90s per question in timed mode, 120s in standard mode
    const duration = modeToStart === "timed" ? activeQuestions.length * 90 : activeQuestions.length * 120;
    setTotalTimeLimit(duration);
    setTimeLeft(duration);
    setCurrentQIndex(0);
    setAnswers({});
    setFlagged({});
    setInstantChecked({});
    setTestCompleted(false);
    setTestResult(null);
    setShowSubmitModal(false);
    setInTest(true);
  };

  const handleSelectOption = (optIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQIndex]: String(optIndex),
    }));
  };

  const toggleFlagQuestion = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentQIndex]: !prev[currentQIndex],
    }));
  };

  const handleCheckInstant = () => {
    setInstantChecked((prev) => ({
      ...prev,
      [currentQIndex]: true,
    }));
  };

  const executeFinalSubmit = async () => {
    setSubmitting(true);
    setShowSubmitModal(false);

    const responses = questions.map((q, idx) => ({
      questionId: q._id || `q-${idx}`,
      questionText: q.questionText,
      userAns: answers[idx] !== undefined ? answers[idx] : "",
      correctAns: q.correctAnswer,
      topicId: q.topicId || "general",
      topicName: q.topicName || "General Topic",
      subjectId: q.subjectId || filters.subjectId,
      marks: q.marks || 5,
      explanation: q.explanation || "",
    }));

    const timeSpent = totalTimeLimit - timeLeft;

    const payload = {
      mode: activeMode,
      filters,
      responses,
      timeTakenSeconds: Math.max(1, timeSpent),
    };

    try {
      const res = await submitExamAttempt(payload);
      if (res.data && res.data.summary) {
        setTestResult(res.data.summary);
        setTestCompleted(true);
        setInTest(false);
        fetchHistory();
        return;
      }
    } catch (err) {
      console.warn("Backend submit error, generating local evaluation fallback:", err.message);
    }

    // Client-side evaluation fallback (always guarantees immediate grading & feedback)
    let totalMarks = 0;
    let score = 0;
    let correctCount = 0;
    const weakTopics = [];
    const strongTopics = [];

    responses.forEach((resp) => {
      totalMarks += resp.marks;
      const isCorrect = String(resp.userAns).trim() === String(resp.correctAns).trim();
      if (isCorrect) {
        score += resp.marks;
        correctCount++;
        if (!strongTopics.includes(resp.topicName)) strongTopics.push(resp.topicName);
      } else {
        if (!weakTopics.includes(resp.topicName)) weakTopics.push(resp.topicName);
      }
    });

    const accuracyPercentage = Math.round((correctCount / responses.length) * 100);
    const localSummary = {
      score,
      totalMarks,
      accuracyPercentage,
      timeTakenSeconds: Math.max(1, timeSpent),
      questionsCount: responses.length,
      correctCount,
      weakTopics,
      strongTopics,
      recommendedRevision: weakTopics.map((wt) => ({
        topicName: wt,
        reason: "Review core unit notes and formulas before retaking this section.",
      })),
    };

    // Save offline history
    const historyItem = {
      _id: "local-" + Date.now(),
      mode: activeMode,
      score,
      totalMarks,
      accuracyPercentage,
      timeTakenSeconds: Math.max(1, timeSpent),
      createdAt: new Date().toISOString(),
      weakTopics,
      strongTopics,
    };
    const updatedHistory = [historyItem, ...examHistory];
    setExamHistory(updatedHistory);
    localStorage.setItem("learnx_exam_history", JSON.stringify(updatedHistory));

    setTestResult(localSummary);
    setTestCompleted(true);
    setInTest(false);
    setSubmitting(false);
  };

  const currentSubjectObj = filterOptions.subjects?.find((s) => s.id === filters.subjectId);
  const currentUnits = currentSubjectObj?.units || [];
  const answeredCount = Object.keys(answers).length;
  const currentQ = questions[currentQIndex];

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-16">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ================= HEADER HERO ================= */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0d1527] to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-cyan-500/10 via-blue-500/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
                <span>🎓 CSE Exam Preparation Engine</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Subject & University <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">Exam Prep</span>
              </h1>
              <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-2xl leading-relaxed">
                Practice university semester exams and PYQs with calibrated MCQs, numerical problems, instant AI feedback, timed tests, and automatic Skill Graph tracking.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/skill-graph"
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold flex items-center gap-2 transition shadow-sm"
              >
                <span>📊 View Skill Graph</span>
              </Link>
              <button
                onClick={() => setActiveTab(activeTab === "revision" ? "practice" : "revision")}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition border ${
                  activeTab === "revision"
                    ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/25"
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-cyan-400/30 shadow-md"
                }`}
              >
                <span>{activeTab === "revision" ? "📝 Return to Practice" : "📚 Revision Notes & PYQs"}</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800/80 mt-8 gap-8">
            <button
              onClick={() => { setActiveTab("practice"); setInTest(false); setTestCompleted(false); }}
              className={`pb-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                activeTab === "practice"
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>📝 Exam Practice & Modes</span>
            </button>
            <button
              onClick={() => { setActiveTab("revision"); setInTest(false); setTestCompleted(false); }}
              className={`pb-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                activeTab === "revision"
                  ? "border-purple-400 text-purple-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>📚 Revision Notes & Formulae</span>
            </button>
            <button
              onClick={() => { setActiveTab("history"); setInTest(false); setTestCompleted(false); }}
              className={`pb-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                activeTab === "history"
                  ? "border-blue-400 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>📜 Attempt History</span>
              <span className="px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
                {examHistory.length}
              </span>
            </button>
          </div>
        </div>

        {/* ================= TAB 1: PRACTICE & EXAM MODES ================= */}
        {activeTab === "practice" && !inTest && !testCompleted && (
          <div className="space-y-6">
            
            {/* 1. CHOOSE TEST MODE CARDS */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🎯 Choose Test Mode</span>
                </h2>
                <span className="text-xs text-slate-400">Click a card to select, or press Start Now</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {EXAM_MODES.map((mode) => {
                  const isSelected = activeMode === mode.id;
                  return (
                    <div
                      key={mode.id}
                      onClick={() => setActiveMode(mode.id)}
                      className={`group cursor-pointer p-5 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                        isSelected
                          ? "bg-slate-800/90 border-cyan-400 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-400/50"
                          : "bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-3xl">{mode.icon}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                            isSelected ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30" : "bg-slate-800 text-slate-400"
                          }`}>
                            {mode.tag}
                          </span>
                        </div>
                        <div className="font-bold text-white text-base group-hover:text-cyan-300 transition">
                          {mode.name}
                        </div>
                        <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {mode.desc}
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartTest(mode.id);
                          }}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20"
                              : "bg-slate-800 group-hover:bg-cyan-600/30 text-slate-200 group-hover:text-cyan-200"
                          }`}
                        >
                          <span>{mode.actionText}</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. INSTANT ACTION LAUNCH BAR (Always Visible directly under the cards) */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                
                {/* Left: Current Selection Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{EXAM_MODES.find((m) => m.id === activeMode)?.icon}</span>
                    <span className="text-base font-bold text-white">
                      Selected: <span className="text-cyan-400">{EXAM_MODES.find((m) => m.id === activeMode)?.name}</span>
                    </span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {questions.length} Questions Ready
                    </span>
                  </div>

                  {/* Subject Quick Selector Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-semibold text-slate-400">Subject:</span>
                    {filterOptions.subjects.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setFilters({ ...filters, subjectId: sub.id, unitId: "All", topicId: "All" })}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                          filters.subjectId === sub.id
                            ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                        }`}
                      >
                        {sub.name.split(" ")[0]} ({sub.id.toUpperCase()})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Primary Start Button & Filter Toggle */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
                  >
                    <span>⚙️ {showAdvancedFilters ? "Hide Filters" : "Filters"}</span>
                    <span className="text-[10px]">{showAdvancedFilters ? "▲" : "▼"}</span>
                  </button>

                  <button
                    onClick={() => handleStartTest(activeMode)}
                    disabled={questions.length === 0 || loading}
                    className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <span>🚀 Start {EXAM_MODES.find((m) => m.id === activeMode)?.name}</span>
                    <span>({questions.length} Qs)</span>
                  </button>
                </div>
              </div>

              {/* 3. COLLAPSIBLE ADVANCED FILTERS */}
              {showAdvancedFilters && (
                <div className="mt-6 pt-6 border-t border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
                  {/* University */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">University</label>
                    <select
                      value={filters.university}
                      onChange={(e) => setFilters({ ...filters, university: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      {filterOptions.universities.map((u, i) => (
                        <option key={i} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>

                  {/* Semester */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Semester</label>
                    <select
                      value={filters.semester}
                      onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      {filterOptions.semesters.map((s, i) => (
                        <option key={i} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Unit</label>
                    <select
                      value={filters.unitId}
                      onChange={(e) => setFilters({ ...filters, unitId: e.target.value, topicId: "All" })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="All">All Units</option>
                      {currentUnits.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Difficulty</label>
                    <select
                      value={filters.difficulty}
                      onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      {filterOptions.difficulties.map((d, i) => (
                        <option key={i} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* 4. QUESTION BANK PREVIEW */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>📋 Question Bank Preview ({questions.length})</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Calibrated semester exam questions for {currentSubjectObj?.name || "Selected Subject"}
                  </p>
                </div>

                <button
                  onClick={() => handleStartTest(activeMode)}
                  disabled={questions.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition"
                >
                  🚀 Launch Test Now
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>Loading exam questions...</span>
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <div className="text-3xl mb-2">🔍</div>
                  <p>No questions match your current filters.</p>
                  <button
                    onClick={() => setFilters({ ...filters, unitId: "All", difficulty: "All", university: "All Universities" })}
                    className="mt-3 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={q._id || idx} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 hover:border-slate-600 transition">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold">
                            {q.questionType?.toUpperCase()}
                          </span>
                          <span className="px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-400 text-xs font-mono">
                            {q.university} ({q.year})
                          </span>
                          <span className="px-2.5 py-0.5 rounded bg-slate-700 text-slate-300 text-xs font-mono">
                            {q.difficulty} • {q.marks || 5} Marks
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">{q.unitName}</span>
                      </div>

                      <h3 className="font-semibold text-slate-100 text-base mt-2">
                        {idx + 1}. {q.questionText}
                      </h3>

                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] text-cyan-400">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= ACTIVE TEST INTERFACE ================= */}
        {inTest && !testCompleted && currentQ && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
            
            {/* Top Status Bar with Timer and Question Counter */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-5 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                    Question {currentQIndex + 1} of {questions.length}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-semibold text-slate-400">
                    {EXAM_MODES.find((m) => m.id === activeMode)?.name}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  {currentQ.subjectName || currentSubjectObj?.name}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {activeMode === "timed" && (
                  <div className={`px-4 py-2 rounded-xl font-mono font-bold text-sm flex items-center gap-2 border ${
                    timeLeft < 300
                      ? "bg-red-500/10 border-red-500/40 text-red-400 animate-pulse"
                      : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                  }`}>
                    <span>⏱️ Time:</span>
                    <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</span>
                  </div>
                )}

                <button
                  onClick={toggleFlagQuestion}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                    flagged[currentQIndex]
                      ? "bg-amber-500/20 border-amber-500 text-amber-300"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <span>{flagged[currentQIndex] ? "🚩 Flagged" : "🏳️ Flag for Review"}</span>
                </button>

                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition"
                >
                  Finish & Submit ({answeredCount}/{questions.length})
                </button>
              </div>
            </div>

            {/* Question Navigator Palette */}
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-2">Jump to:</span>
              {questions.map((_, idx) => {
                const isCurrent = currentQIndex === idx;
                const isAnswered = answers[idx] !== undefined;
                const isFlagged = flagged[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center relative ${
                      isCurrent
                        ? "bg-cyan-500 text-slate-950 ring-2 ring-cyan-300"
                        : isFlagged
                        ? "bg-amber-500/30 border border-amber-500 text-amber-200"
                        : isAnswered
                        ? "bg-emerald-600/40 border border-emerald-500 text-emerald-300"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Main Question Display */}
            <div className="bg-slate-800/40 border border-slate-700/80 rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-mono font-semibold">
                  {currentQ.questionType?.toUpperCase()}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-slate-700 text-slate-300 text-xs font-mono">
                  {currentQ.marks || 5} Marks
                </span>
                <span className="text-xs text-slate-400">
                  Topic: <strong className="text-slate-300">{currentQ.topicName}</strong> ({currentQ.unitName})
                </span>
              </div>

              <h3 className="text-xl font-bold text-white leading-relaxed">
                {currentQ.questionText}
              </h3>
            </div>

            {/* Options Selector */}
            {currentQ.options && currentQ.options.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = answers[currentQIndex] === String(oIdx);
                  const isInstantEvaluated = activeMode === "instant" && instantChecked[currentQIndex];
                  const isCorrect = String(oIdx) === String(currentQ.correctAnswer);

                  let optClasses = "bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-slate-300";
                  if (isSelected) {
                    optClasses = "bg-cyan-500/20 border-cyan-400 text-cyan-200 font-semibold ring-1 ring-cyan-400";
                  }
                  if (isInstantEvaluated) {
                    if (isCorrect) {
                      optClasses = "bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold ring-1 ring-emerald-400";
                    } else if (isSelected && !isCorrect) {
                      optClasses = "bg-red-500/20 border-red-400 text-red-200 font-semibold ring-1 ring-red-400";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`p-4 rounded-xl border text-left transition flex items-center justify-between ${optClasses}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                          isSelected ? "bg-cyan-400 text-slate-950" : "bg-slate-700 text-slate-300"
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="text-sm">{opt}</span>
                      </div>

                      {isInstantEvaluated && isCorrect && (
                        <span className="text-emerald-400 text-xs font-bold">✓ Correct Answer</span>
                      )}
                      {isInstantEvaluated && isSelected && !isCorrect && (
                        <span className="text-red-400 text-xs font-bold">✗ Incorrect</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Your Written Solution / Working Steps:
                </label>
                <textarea
                  rows={5}
                  value={answers[currentQIndex] || ""}
                  onChange={(e) => handleSelectOption(e.target.value)}
                  placeholder="Type your explanation, numerical formulas, or step-by-step logic here..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
            )}

            {/* Instant Evaluation Solution Box */}
            {activeMode === "instant" && (
              <div className="pt-2">
                {!instantChecked[currentQIndex] ? (
                  <button
                    onClick={handleCheckInstant}
                    disabled={answers[currentQIndex] === undefined}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition flex items-center gap-2"
                  >
                    <span>⚡ Check Answer & View Detailed Solution</span>
                  </button>
                ) : (
                  <div className="bg-purple-950/40 border border-purple-800/60 rounded-2xl p-5 text-sm text-purple-200 space-y-2 animate-fadeIn">
                    <div className="font-bold flex items-center gap-2">
                      <span>💡 Solution & Concept Breakdown:</span>
                    </div>
                    <p className="text-xs text-purple-300 leading-relaxed">
                      {currentQ.explanation || "Review fundamental concepts of this unit in the Revision Notes tab."}
                    </p>
                    {currentQ.revisionNote?.keyFormulae?.length > 0 && (
                      <div className="text-xs font-mono bg-purple-900/50 p-2.5 rounded-xl border border-purple-700/50 text-purple-200 mt-2">
                        <strong>Key Formula: </strong> {currentQ.revisionNote.keyFormulae.join(" | ")}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Pagination & Next/Prev Controls */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-8">
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex((prev) => prev - 1)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <span>← Previous</span>
              </button>

              <div className="text-xs text-slate-400 font-mono">
                {answeredCount} of {questions.length} answered
              </div>

              {currentQIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQIndex((prev) => prev + 1)}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-600/20"
                >
                  <span>Next Question →</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <span>Submit Exam ✓</span>
                </button>
              )}
            </div>

            {/* Submit Confirmation Modal */}
            {showSubmitModal && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl animate-scaleIn">
                  <div className="text-4xl">📝</div>
                  <h3 className="text-xl font-bold text-white">Ready to Submit?</h3>
                  <p className="text-slate-400 text-sm">
                    You have answered <strong className="text-cyan-400">{answeredCount}</strong> out of <strong className="text-white">{questions.length}</strong> questions.
                  </p>
                  {answeredCount < questions.length && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                      ⚠️ You have {questions.length - answeredCount} unanswered questions remaining.
                    </div>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowSubmitModal(false)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Keep Answering
                    </button>
                    <button
                      onClick={executeFinalSubmit}
                      disabled={submitting}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                    >
                      {submitting ? "Evaluating..." : "Confirm & Submit"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: REVISION NOTES & FORMULAE ================= */}
        {activeTab === "revision" && (
          <div className="space-y-6">
            
            {/* Subject Selector & Search Bar */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>📖 Select Subject for Revision Notes</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">High-yield concepts, unit formulas, and solved university PYQs</p>
                </div>

                <div className="relative max-w-xs w-full">
                  <input
                    type="text"
                    value={revisionSearch}
                    onChange={(e) => setRevisionSearch(e.target.value)}
                    placeholder="Search formula, concept..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  />
                  {revisionSearch && (
                    <button
                      onClick={() => setRevisionSearch("")}
                      className="absolute right-3 top-2 text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Subject Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {filterOptions.subjects.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setFilters({ ...filters, subjectId: sub.id, unitId: "All" })}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      filters.subjectId === sub.id
                        ? "bg-purple-600/20 border-purple-500 text-purple-300 font-semibold shadow-lg shadow-purple-500/10 ring-1 ring-purple-400"
                        : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <div className="text-[10px] text-slate-500 uppercase font-mono">{sub.id}</div>
                    <div className="text-sm font-bold line-clamp-1 mt-1">{sub.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Units & Formulas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentUnits.length > 0 ? (
                currentUnits.map((u) => {
                  const filteredTopics = u.topics?.filter((tp) =>
                    tp.name.toLowerCase().includes(revisionSearch.toLowerCase())
                  );
                  if (revisionSearch && filteredTopics?.length === 0) return null;

                  return (
                    <div key={u.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 hover:border-purple-500/40 transition flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            {u.name}
                          </span>
                          <span className="text-xs text-slate-500">{u.topics?.length || 0} Key Topics</span>
                        </div>

                        <div className="space-y-4">
                          {filteredTopics?.map((tp) => {
                            const noteQ = questions.find((q) => q.topicId === tp.id && q.revisionNote);
                            return (
                              <div key={tp.id} className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/60 space-y-2">
                                <div className="font-bold text-slate-100 text-sm flex items-center justify-between">
                                  <span>{tp.name}</span>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">High Yield</span>
                                </div>

                                {noteQ?.revisionNote ? (
                                  <div className="text-xs text-slate-300 space-y-2">
                                    <p className="leading-relaxed">
                                      <strong className="text-purple-300">Summary: </strong> 
                                      {noteQ.revisionNote.summary}
                                    </p>

                                    {noteQ.revisionNote.keyFormulae?.length > 0 && (
                                      <div>
                                        <span className="text-cyan-300 font-bold block mb-1">Key Formulas:</span>
                                        <ul className="list-disc list-inside space-y-1 font-mono text-cyan-200 bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-800/40">
                                          {noteQ.revisionNote.keyFormulae.map((f, i) => (
                                            <li key={i}>{f}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {noteQ.revisionNote.keyConcepts?.length > 0 && (
                                      <div className="flex flex-wrap gap-1.5 pt-1">
                                        {noteQ.revisionNote.keyConcepts.map((c, i) => (
                                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-700/80 text-slate-300 font-mono text-[10px]">
                                            #{c}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-xs text-slate-500 italic">
                                    Core university definitions, derivations, and practice questions loaded.
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end">
                        <button
                          onClick={() => {
                            setFilters({ ...filters, unitId: u.id });
                            setActiveTab("practice");
                            handleStartTest("exam");
                          }}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                        >
                          <span>Practice {u.name.split(":")[0]} Questions</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
                  Select a subject above to view detailed revision notes and unit formulae.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: ATTEMPTS HISTORY ================= */}
        {activeTab === "history" && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>📜 Past Exam Attempt Records</span>
              </h2>
              <button
                onClick={() => { setActiveTab("practice"); handleStartTest("exam"); }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
              >
                + New Exam Attempt
              </button>
            </div>

            {examHistory.length === 0 ? (
              <div className="text-center py-16 text-slate-400 space-y-3">
                <div className="text-4xl">📝</div>
                <p className="text-base font-semibold text-slate-300">No exam attempts recorded yet.</p>
                <p className="text-xs text-slate-500">Complete an exam mode or timed test to automatically track and analyze your progress.</p>
                <button
                  onClick={() => { setActiveTab("practice"); handleStartTest("exam"); }}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  🚀 Take First Exam Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {examHistory.map((h, i) => (
                  <div key={h._id || i} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-600 transition">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold uppercase border border-cyan-500/20">
                          {h.mode || "Exam"} Mode
                        </span>
                        <span className="text-slate-400 text-xs font-mono">
                          {h.createdAt ? new Date(h.createdAt).toLocaleDateString() : "Recent"}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-white mt-1.5">
                        Score: {h.score} / {h.totalMarks} Marks ({h.accuracyPercentage}% Accuracy)
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {h.weakTopics?.map((wt, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
                            ⚠️ Weak: {wt}
                          </span>
                        ))}
                        {h.strongTopics?.map((st, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                            ✅ Strong: {st}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-700">
                      <div className="text-right font-mono">
                        <div className="text-xs text-slate-400">Time Taken</div>
                        <div className="text-sm font-semibold text-slate-200">
                          {Math.floor((h.timeTakenSeconds || 0) / 60)}m {(h.timeTakenSeconds || 0) % 60}s
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab("practice");
                          handleStartTest("weak");
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-cyan-300 transition"
                      >
                        Re-try Weak Topics
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= POST-TEST RESULT DASHBOARD ================= */}
        {testCompleted && testResult && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl mx-auto mb-3">
                🎉
              </div>
              <h2 className="text-3xl font-extrabold text-white">Exam Attempt Completed!</h2>
              <p className="text-slate-400 text-sm">
                Your performance has been evaluated and synced directly to your <strong className="text-cyan-400">Student Skill Graph</strong>.
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 text-center">
                <div className="text-xs text-slate-400 font-mono">Total Score</div>
                <div className="text-3xl font-black text-cyan-400 mt-1">{testResult.score} / {testResult.totalMarks}</div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 text-center">
                <div className="text-xs text-slate-400 font-mono">Accuracy</div>
                <div className="text-3xl font-black text-emerald-400 mt-1">{testResult.accuracyPercentage}%</div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 text-center">
                <div className="text-xs text-slate-400 font-mono">Time Taken</div>
                <div className="text-3xl font-black text-purple-400 mt-1">
                  {Math.floor(testResult.timeTakenSeconds / 60)}m {testResult.timeTakenSeconds % 60}s
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 text-center">
                <div className="text-xs text-slate-400 font-mono">Correct Answers</div>
                <div className="text-3xl font-black text-blue-400 mt-1">
                  {testResult.correctCount} / {testResult.questionsCount}
                </div>
              </div>
            </div>

            {/* Weak & Strong Topic Detection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6">
                <h3 className="text-base font-bold text-red-400 mb-3 flex items-center gap-2">
                  <span>⚠️ Weak Topics Identified</span>
                </h3>
                {testResult.weakTopics?.length > 0 ? (
                  <ul className="space-y-2 text-sm text-slate-300">
                    {testResult.weakTopics.map((wt, idx) => (
                      <li key={idx} className="bg-red-950/30 border border-red-800/40 rounded-xl p-3 flex items-center justify-between">
                        <span>{wt}</span>
                        <span className="text-xs text-red-400 font-semibold">&lt; 60% Mastery</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400">No major weak topics detected! Outstanding performance.</p>
                )}
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6">
                <h3 className="text-base font-bold text-emerald-400 mb-3 flex items-center gap-2">
                  <span>✅ Strong Topics Demonstrated</span>
                </h3>
                {testResult.strongTopics?.length > 0 ? (
                  <ul className="space-y-2 text-sm text-slate-300">
                    {testResult.strongTopics.map((st, idx) => (
                      <li key={idx} className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 flex items-center justify-between">
                        <span>{st}</span>
                        <span className="text-xs text-emerald-400 font-semibold">High Proficiency</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400">Keep practicing to build strong topic badges!</p>
                )}
              </div>
            </div>

            {/* Recommended AI Revision Action Plan */}
            {testResult.recommendedRevision?.length > 0 && (
              <div className="bg-purple-950/30 border border-purple-800/50 rounded-2xl p-6">
                <h3 className="text-base font-bold text-purple-300 mb-4 flex items-center gap-2">
                  <span>💡 Recommended AI Revision Action Plan</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {testResult.recommendedRevision.map((rec, idx) => (
                    <div key={idx} className="bg-slate-900/80 border border-purple-800/40 rounded-xl p-4">
                      <div className="font-bold text-white text-sm">{rec.topicName}</div>
                      <div className="text-xs text-slate-400 mt-1">{rec.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setInTest(false);
                  setTestCompleted(false);
                  setActiveTab("practice");
                }}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition"
              >
                🔄 Take Another Exam Test
              </button>

              <button
                onClick={() => {
                  setInTest(false);
                  setTestCompleted(false);
                  setActiveTab("revision");
                }}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold shadow-md transition"
              >
                📚 Review Unit Notes & PYQs
              </button>

              <Link
                to="/skill-graph"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 transition"
              >
                📊 View Updated Skill Graph
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
