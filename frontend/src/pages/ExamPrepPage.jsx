import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getExamFilters,
  getExamQuestions,
  submitExamAttempt,
  getExamHistory,
  generateAIExamQuestions,
} from "../services/api";

const EXAM_MODES = [
  { id: "exam", name: "Exam Mode", icon: "📝", desc: "Full exam simulation with final grading." },
  { id: "timed", name: "Timed Test", icon: "⏱️", desc: "Strict countdown timer with auto-submission." },
  { id: "instant", name: "Instant Evaluation", icon: "⚡", desc: "Get instant explanation after answering each question." },
  { id: "revision", name: "Revision Mode", icon: "📚", desc: "Unit notes, key formulas, and PYQ review." },
  { id: "weak", name: "Weak Topic Focus", icon: "🎯", desc: "Targeted practice on topics needing improvement." },
];

const DEFAULT_FILTER_OPTIONS = {
  universities: ["All Universities", "AKTU", "VTU", "SPPU", "Anna University", "GATE", "Generic CSE"],
  semesters: ["All Semesters", "Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"],
  years: ["All Years", 2024, 2023, 2022, 2021, 2020],
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
        { id: "unit-1", name: "Unit 1: Linear Data Structures & Analysis", topics: [{ id: "arrays-matrices", name: "Arrays & Matrices" }, { id: "stacks-queues", name: "Stacks & Queues" }] },
        { id: "unit-2", name: "Unit 2: Trees & Binary Search Trees", topics: [{ id: "tree-traversals", name: "Tree Traversals" }, { id: "avl-trees", name: "AVL Trees & Balance Factors" }] },
        { id: "unit-3", name: "Unit 3: Graphs & Shortest Paths", topics: [{ id: "dijkstra-algorithm", name: "Dijkstra's Algorithm" }] },
      ],
    },
    {
      id: "dbms",
      name: "Database Management Systems",
      units: [
        { id: "unit-1", name: "Unit 1: ER Model & Relational Algebra", topics: [{ id: "er-diagrams", name: "ER Diagrams & Mapping" }] },
        { id: "unit-2", name: "Unit 2: SQL & Relational Calculus", topics: [{ id: "sql-joins", name: "SQL Joins & Subqueries" }] },
        { id: "unit-3", name: "Unit 3: Transactions & Concurrency Control", topics: [{ id: "acid-properties", name: "ACID Properties & Serializability" }] },
      ],
    },
    {
      id: "os",
      name: "Operating Systems",
      units: [
        { id: "unit-1", name: "Unit 1: Process Management & CPU Scheduling", topics: [{ id: "cpu-scheduling", name: "CPU Scheduling Algorithms" }] },
        { id: "unit-2", name: "Unit 2: Memory Management & Paging", topics: [{ id: "virtual-memory", name: "Virtual Memory & Page Faults" }] },
      ],
    },
    {
      id: "cn",
      name: "Computer Networks",
      units: [
        { id: "unit-1", name: "Unit 1: Data Link & Network Layer", topics: [{ id: "ip-addressing", name: "IP Subnetting & CIDR" }] },
      ],
    },
    {
      id: "system-design",
      name: "System Design & Architecture",
      units: [
        { id: "unit-1", name: "Unit 1: Scalability & Distributed Systems", topics: [{ id: "load-balancing", name: "Load Balancing & Caching" }] },
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
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Active Test State
  const [inTest, setInTest] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { qIndex: selectedAns }
  const [instantChecked, setInstantChecked] = useState({}); // { qIndex: true }
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [examHistory, setExamHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("practice"); // 'practice' | 'revision' | 'history'

  // Load Filters & Questions
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
            handleFinalSubmit();
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
      console.error("Failed to load filters:", err);
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
      console.error("Failed to fetch questions:", err);
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
      console.error("Failed to fetch exam history:", err);
    }
  };

  const handleStartTest = () => {
    if (questions.length === 0) return;
    setInTest(true);
    setCurrentQIndex(0);
    setAnswers({});
    setInstantChecked({});
    setTestCompleted(false);
    setTestResult(null);
    setTimeLeft(questions.length * 120); // 2 mins per question
  };

  const handleSelectOption = (optIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQIndex]: String(optIndex),
    }));
  };

  const handleCheckInstant = () => {
    setInstantChecked((prev) => ({
      ...prev,
      [currentQIndex]: true,
    }));
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const responses = questions.map((q, idx) => ({
        questionId: q._id || `q-${idx}`,
        questionText: q.questionText,
        userAns: answers[idx] !== undefined ? answers[idx] : "",
        correctAns: q.correctAnswer,
        topicId: q.topicId,
        topicName: q.topicName,
        subjectId: q.subjectId,
        marks: q.marks || 5,
        explanation: q.explanation,
      }));

      const payload = {
        mode: activeMode,
        filters,
        responses,
        timeTakenSeconds: (questions.length * 120) - timeLeft,
      };

      const res = await submitExamAttempt(payload);
      if (res.data && res.data.summary) {
        setTestResult(res.data.summary);
        setTestCompleted(true);
        fetchHistory();
      }
    } catch (err) {
      console.error("Failed to submit exam attempt:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentSubjectObj = filterOptions.subjects?.find((s) => s.id === filters.subjectId);
  const currentUnits = currentSubjectObj?.units || [];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans pb-16">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header Hero */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-cyan-500/10 via-blue-500/5 to-transparent pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
                <span>🎓 CSE Exam Preparation Engine</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Subject & University <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Exam Prep</span>
              </h1>
              <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-2xl">
                Master university exams with unit-wise topics, PYQs, instant AI evaluation, timed tests, and seamless updates to your Student Skill Graph.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/skill-graph"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold flex items-center gap-2 transition"
              >
                <span>📊 View Skill Graph</span>
              </Link>
              <button
                onClick={() => setActiveTab(activeTab === "revision" ? "practice" : "revision")}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition border ${
                  activeTab === "revision"
                    ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/25"
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-cyan-400/30"
                }`}
              >
                <span>{activeTab === "revision" ? "📝 Return to Exam Practice" : "📚 Revision Notes & PYQs"}</span>
              </button>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex border-b border-slate-800/80 mt-8 gap-8">
            <button
              onClick={() => setActiveTab("practice")}
              className={`pb-3 text-sm font-semibold border-b-2 transition ${
                activeTab === "practice"
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              📝 Exam Practice & Modes
            </button>
            <button
              onClick={() => setActiveTab("revision")}
              className={`pb-3 text-sm font-semibold border-b-2 transition ${
                activeTab === "revision"
                  ? "border-purple-400 text-purple-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              📚 Revision Notes & Important Formulae
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-3 text-sm font-semibold border-b-2 transition ${
                activeTab === "history"
                  ? "border-blue-400 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              📜 Exam Attempts History ({examHistory.length})
            </button>
          </div>
        </div>

        {/* ================= REVISION NOTES & PYQS TAB ================= */}
        {activeTab === "revision" && (
          <div className="space-y-6">
            {/* Subject Selector */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📖 Select Subject for Revision Notes</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {filterOptions.subjects.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setFilters({ ...filters, subjectId: sub.id })}
                    className={`p-3 rounded-xl border text-left transition ${
                      filters.subjectId === sub.id
                        ? "bg-purple-600/20 border-purple-500 text-purple-300 font-semibold shadow-lg shadow-purple-500/10"
                        : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <div className="text-xs text-slate-500 uppercase font-mono">{sub.id}</div>
                    <div className="text-sm line-clamp-1 mt-1">{sub.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Units list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentUnits.length > 0 ? (
                currentUnits.map((u, uIdx) => (
                  <div key={u.id} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-purple-500/40 transition">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {u.name}
                      </span>
                      <span className="text-xs text-slate-500">{u.topics?.length || 0} Key Topics</span>
                    </div>

                    <div className="space-y-3 mt-4">
                      {u.topics?.map((tp) => {
                        const noteQ = questions.find((q) => q.topicId === tp.id && q.revisionNote);
                        return (
                          <div key={tp.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <div className="font-semibold text-slate-200 text-sm">{tp.name}</div>
                            {noteQ?.revisionNote ? (
                              <div className="mt-2 text-xs text-slate-400 space-y-2">
                                <p><strong className="text-purple-300">Summary:</strong> {noteQ.revisionNote.summary}</p>
                                {noteQ.revisionNote.keyFormulae?.length > 0 && (
                                  <div>
                                    <strong className="text-cyan-300">Key Formulas:</strong>
                                    <ul className="list-disc list-inside mt-1 font-mono text-cyan-200 bg-cyan-950/30 p-2 rounded border border-cyan-800/40">
                                      {noteQ.revisionNote.keyFormulae.map((f, i) => (
                                        <li key={i}>{f}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {noteQ.revisionNote.keyConcepts?.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {noteQ.revisionNote.keyConcepts.map((c, i) => (
                                      <span key={i} className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono text-[10px]">
                                        #{c}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500 italic mt-1">Core concepts and PYQ notes loaded in exam database.</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                  Select a subject above to view detailed revision notes and unit formulae.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= ATTEMPTS HISTORY TAB ================= */}
        {activeTab === "history" && (
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>📜 Past Exam Attempt Records</span>
            </h2>
            {examHistory.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <div className="text-4xl mb-3">📝</div>
                <p>No past exam attempts found. Complete your first exam mode test to track progress!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {examHistory.map((h) => (
                  <div key={h._id} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase">
                          {h.mode} Mode
                        </span>
                        <span className="text-slate-400 text-xs font-mono">
                          {new Date(h.createdAt).toLocaleDateString()} at {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-white mt-1">
                        Score: {h.score} / {h.totalMarks} Marks ({h.accuracyPercentage}% Accuracy)
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {h.weakTopics?.map((wt, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
                            ⚠️ Weak: {wt}
                          </span>
                        ))}
                        {h.strongTopics?.map((st, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                            ✅ Strong: {st}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-700">
                      <div className="text-right font-mono">
                        <div className="text-xs text-slate-400">Time Taken</div>
                        <div className="text-sm font-semibold text-slate-200">{Math.floor(h.timeTakenSeconds / 60)}m {h.timeTakenSeconds % 60}s</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= MAIN PRACTICE & EXAM MODES TAB ================= */}
        {activeTab === "practice" && !inTest && !testCompleted && (
          <div className="space-y-8">
            {/* Exam Mode Selector Cards */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🎯 Choose Test Mode</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {EXAM_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={`p-5 rounded-2xl border text-left transition relative overflow-hidden flex flex-col justify-between ${
                      activeMode === mode.id
                        ? "bg-slate-800 border-cyan-400 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-400"
                        : "bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="text-3xl mb-3">{mode.icon}</div>
                      <div className="font-bold text-white text-base">{mode.name}</div>
                      <div className="text-xs text-slate-400 mt-1 leading-relaxed">{mode.desc}</div>
                    </div>
                    {activeMode === mode.id && (
                      <div className="mt-4 text-xs font-semibold text-cyan-400 flex items-center gap-1">
                        <span>Active Mode</span>
                        <span>✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Control Bar */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🎛️ Exam & Subject Filters</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Subject Filter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Subject</label>
                  <select
                    value={filters.subjectId}
                    onChange={(e) => setFilters({ ...filters, subjectId: e.target.value, unitId: "All", topicId: "All" })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    {filterOptions.subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                {/* University Filter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">University</label>
                  <select
                    value={filters.university}
                    onChange={(e) => setFilters({ ...filters, university: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    {filterOptions.universities.map((u, i) => (
                      <option key={i} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                {/* Semester Filter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Semester</label>
                  <select
                    value={filters.semester}
                    onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    {filterOptions.semesters.map((s, i) => (
                      <option key={i} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Unit Filter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Unit</label>
                  <select
                    value={filters.unitId}
                    onChange={(e) => setFilters({ ...filters, unitId: e.target.value, topicId: "All" })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="All">All Units</option>
                    {currentUnits.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                {/* Question Type Filter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Question Type</label>
                  <select
                    value={filters.questionType}
                    onChange={(e) => setFilters({ ...filters, questionType: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    {filterOptions.questionTypes.map((q) => (
                      <option key={q.id} value={q.id}>{q.name}</option>
                    ))}
                  </select>
                </div>

                {/* Year Filter (PYQs) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">PYQ Year</label>
                  <select
                    value={filters.year}
                    onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    {filterOptions.years.map((y, i) => (
                      <option key={i} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Difficulty Level</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    {filterOptions.difficulties.map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Start Exam CTA */}
              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-400">
                  Found <span className="text-cyan-400 font-bold">{questions.length}</span> matching exam questions for your selected configuration.
                </div>
                <button
                  onClick={handleStartTest}
                  disabled={questions.length === 0 || loading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <span>🚀 Start {EXAM_MODES.find(m => m.id === activeMode)?.name}</span>
                </button>
              </div>
            </div>

            {/* Questions Bank Preview List */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>📋 Question Bank Preview ({questions.length})</span>
              </h2>

              {loading ? (
                <div className="text-center py-12 text-slate-400">Loading exam questions...</div>
              ) : questions.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  No questions match your current filters. Try relaxing the filters or select another subject.
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
        {inTest && !testCompleted && (
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            {/* Top Bar with Timer */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Question {currentQIndex + 1} of {questions.length}</span>
                <h2 className="text-lg font-bold text-white">{questions[currentQIndex]?.subjectName}</h2>
              </div>

              <div className="flex items-center gap-4">
                {activeMode === "timed" && (
                  <div className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono font-bold text-sm flex items-center gap-2 animate-pulse">
                    <span>⏱️ Time Remaining:</span>
                    <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</span>
                  </div>
                )}
                <button
                  onClick={handleFinalSubmit}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition"
                >
                  Finish & Submit Test
                </button>
              </div>
            </div>

            {/* Question Box */}
            <div className="space-y-6">
              <div className="bg-slate-800/40 border border-slate-700/80 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-mono font-semibold">
                    {questions[currentQIndex]?.questionType?.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400">
                    Topic: {questions[currentQIndex]?.topicName}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white leading-relaxed">
                  {questions[currentQIndex]?.questionText}
                </h3>
              </div>

              {/* Options */}
              {questions[currentQIndex]?.options && questions[currentQIndex]?.options.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {questions[currentQIndex].options.map((opt, oIdx) => {
                    const isSelected = answers[currentQIndex] === String(oIdx);
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(oIdx)}
                        className={`p-4 rounded-xl border text-left transition flex items-center gap-3 ${
                          isSelected
                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 font-semibold ring-1 ring-cyan-400"
                            : "bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-slate-300"
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                          isSelected ? "bg-cyan-400 text-slate-950" : "bg-slate-700 text-slate-300"
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="text-sm">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Your Written Response / Solution Summary:</label>
                  <textarea
                    rows={5}
                    value={answers[currentQIndex] || ""}
                    onChange={(e) => setAnswers({ ...answers, [currentQIndex]: e.target.value })}
                    placeholder="Type your response or numerical steps here..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              {/* Instant Evaluation Mode Solution Box */}
              {activeMode === "instant" && (
                <div className="pt-2">
                  {!instantChecked[currentQIndex] ? (
                    <button
                      onClick={handleCheckInstant}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition"
                    >
                      ⚡ Check Answer & View Solution
                    </button>
                  ) : (
                    <div className="bg-purple-950/40 border border-purple-800/60 rounded-2xl p-5 text-sm text-purple-200">
                      <div className="font-bold mb-1">
                        Correct Answer Index: {questions[currentQIndex]?.correctAnswer}
                      </div>
                      <p className="text-xs text-purple-300 leading-relaxed">
                        {questions[currentQIndex]?.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Prev / Next Pagination */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-8">
                <button
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => prev - 1)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold transition"
                >
                  ← Previous Question
                </button>

                <div className="text-xs text-slate-500 font-mono">
                  {Object.keys(answers).length} of {questions.length} Answered
                </div>

                <button
                  disabled={currentQIndex === questions.length - 1}
                  onClick={() => setCurrentQIndex((prev) => prev + 1)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-semibold transition"
                >
                  Next Question →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= POST-TEST ANALYTICS DASHBOARD ================= */}
        {testCompleted && testResult && (
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            <div className="text-center max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
                🎉
              </div>
              <h2 className="text-3xl font-extrabold text-white">Exam Attempt Completed!</h2>
              <p className="text-slate-400 text-sm mt-2">
                Your performance has been evaluated and synced directly to your <strong className="text-cyan-400">Student Skill Graph</strong>.
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                <div className="text-3xl font-black text-purple-400 mt-1">{Math.floor(testResult.timeTakenSeconds / 60)}m {testResult.timeTakenSeconds % 60}s</div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 text-center">
                <div className="text-xs text-slate-400 font-mono">Correct Answers</div>
                <div className="text-3xl font-black text-blue-400 mt-1">{testResult.correctCount} / {testResult.questionsCount}</div>
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
                  <p className="text-xs text-slate-400">No major weak topics detected in this attempt!</p>
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

            {/* Recommended Revision */}
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
                }}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition"
              >
                🔄 Take Another Exam Test
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
