import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getTopicDetails,
  markTopicAsCompleted,
  askLearningCompanion,
  generateExamAnswer,
  generateRevisionNotes,
  toggleLearningBookmark,
  updateTopicMastery,
  getTopicNotes,
  createTopicNote,
  deleteTopicNote,
} from "../services/api.js";
import { useAppState } from "../context/AppStateContext.jsx";
import DynamicTopicVisualizer from "../components/visualizer/DynamicTopicVisualizer.jsx";
import LearningCompanion from "../components/LearningCompanion.jsx";
import VoiceTeacherExperience from "../components/voice/VoiceTeacherExperience.jsx";

const TopicLearningPage = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();
  const { onTopicCompleted } = useAppState();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "ai_explain" | "visualize" | "examples" | "quick_check" | "practice" | "quick_test" | "notes" | "exam_answer"

  // Learning Progress & Mastery
  const [masteryStatus, setMasteryStatus] = useState("learning"); // "not_started" | "learning" | "practicing" | "understood" | "mastered"
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [completedState, setCompletedState] = useState(false);
  const [markingCompleted, setMarkingCompleted] = useState(false);

  // AI Explain State
  const [aiExplainMode, setAiExplainMode] = useState("beginner");
  const [aiExplainText, setAiExplainText] = useState("");
  const [aiExplainLoading, setAiExplainLoading] = useState(false);
  const [aiLanguage, setAiLanguage] = useState("english");

  // Exam Answer State
  const [selectedMarks, setSelectedMarks] = useState(5);
  const [examAnswerText, setExamAnswerText] = useState("");
  const [examAnswerLoading, setExamAnswerLoading] = useState(false);

  // Quick Check active learning state
  const [selectedOption, setSelectedOption] = useState(null);
  const [quickCheckAnswered, setQuickCheckAnswered] = useState(false);

  // 20-min Focus Learning Session Mode
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStep, setSessionStep] = useState(1);

  // Notes state
  const [notesList, setNotesList] = useState([]);
  const [newNoteText, setNewNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [generatingRevision, setGeneratingRevision] = useState(false);
  const [revisionNotesData, setRevisionNotesData] = useState(null);

  // Practice state
  const [activePracticeIndex, setActivePracticeIndex] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [practiceFeedback, setPracticeFeedback] = useState({});

  // Quick Test state
  const [testActive, setTestActive] = useState(false);
  const [testCurrentIndex, setTestCurrentIndex] = useState(0);
  const [testSelectedAnswers, setTestSelectedAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);

  // Voice Companion Drawer
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);
  const [companionInitialMode, setCompanionInitialMode] = useState("beginner");

  useEffect(() => {
    let isMounted = true;
    const fetchTopic = async () => {
      setLoading(true);
      try {
        const res = await getTopicDetails(topicId);
        if (isMounted && res.data) {
          setData(res.data);
          const prog = res.data.progress;
          setCompletedState(!!prog?.isCompleted);
          if (prog?.masteryStatus) {
            setMasteryStatus(prog.masteryStatus);
          }

          // Fetch personal notes
          getTopicNotes(topicId)
            .then((nRes) => {
              if (isMounted && nRes?.data?.notes) setNotesList(nRes.data.notes);
            })
            .catch(() => {});
        }
      } catch (err) {
        console.error("Error loading topic:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTopic();
    return () => {
      isMounted = false;
    };
  }, [topicId]);

  // Load AI Explanation when tab changes to "ai_explain"
  useEffect(() => {
    if (activeTab === "ai_explain" && !aiExplainText && data?.topic) {
      handleRequestAIExplain(aiExplainMode, aiLanguage);
    }
  }, [activeTab]);

  const handleRequestAIExplain = async (mode = "beginner", lang = "english") => {
    setAiExplainLoading(true);
    setAiExplainMode(mode);
    setAiLanguage(lang);
    try {
      const res = await askLearningCompanion({
        topicId,
        subjectId,
        prompt: `Explain ${data?.topic?.title || topicId} thoroughly.`,
        mode,
        language: lang,
      });
      if (res?.data?.text) {
        setAiExplainText(res.data.text);
      }
    } catch (e) {
      console.warn("AI explain failed:", e);
    } finally {
      setAiExplainLoading(false);
    }
  };

  const handleGenerateExamAnswer = async (marks = 5) => {
    setExamAnswerLoading(true);
    setSelectedMarks(marks);
    try {
      const res = await generateExamAnswer({
        topicId,
        subjectId,
        marks,
      });
      if (res?.data?.answer) {
        setExamAnswerText(res.data.answer);
      }
    } catch (e) {
      console.warn("Exam answer generator error:", e);
    } finally {
      setExamAnswerLoading(false);
    }
  };

  const handleCreateRevisionNotes = async (save = false) => {
    setGeneratingRevision(true);
    try {
      const res = await generateRevisionNotes({
        topicId,
        subjectId,
        saveToNotes: save,
      });
      if (res?.data?.notes) {
        setRevisionNotesData(res.data.notes);
        if (save && res.data.savedNote) {
          setNotesList((prev) => [res.data.savedNote, ...prev]);
        }
      }
    } catch (e) {
      console.warn("Revision notes generation error:", e);
    } finally {
      setGeneratingRevision(false);
    }
  };

  const handleSavePersonalNote = async (e) => {
    if (e) e.preventDefault();
    if (!newNoteText.trim()) return;
    setSavingNote(true);
    try {
      const res = await createTopicNote({
        topicId,
        title: `Note on ${data?.topic?.title || topicId}`,
        content: newNoteText.trim(),
        tags: [subjectId.toUpperCase(), "Personal"],
      });
      if (res?.data?.note) {
        setNotesList((prev) => [res.data.note, ...prev]);
        setNewNoteText("");
      }
    } catch (e) {
      console.warn("Failed to save note:", e);
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteTopicNote(id);
      setNotesList((prev) => prev.filter((n) => n._id !== id));
    } catch (e) {
      console.warn("Failed to delete note:", e);
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      const res = await toggleLearningBookmark({
        itemId: topicId,
        itemType: "topic",
        title: data?.topic?.title || topicId,
        subjectId,
        subjectName: data?.breadcrumbs?.subject?.name || subjectId,
        unitId: data?.topic?.unitId || "",
      });
      setIsBookmarked(!!res?.data?.isBookmarked);
    } catch (e) {
      console.warn("Bookmark toggle error:", e);
    }
  };

  const handleMarkComplete = async () => {
    setMarkingCompleted(true);
    try {
      await markTopicAsCompleted(topicId);
      await updateTopicMastery(topicId, { masteryStatus: "mastered", accuracy: 100 });
      setCompletedState(true);
      setMasteryStatus("mastered");
      if (onTopicCompleted) onTopicCompleted(topicId, subjectId);
    } catch (err) {
      console.error("Error marking topic completed:", err);
    } finally {
      setMarkingCompleted(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-600">Loading topic workspace...</p>
      </div>
    );
  }

  if (!data || !data.topic) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="text-4xl">📄</div>
        <h2 className="text-xl font-bold text-slate-900">Topic Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm">The requested topic could not be located in the curriculum.</p>
        <Link to={`/learn/${subjectId}`} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600">
          Back to Subject
        </Link>
      </div>
    );
  }

  const { topic, breadcrumbs } = data;
  const content = topic.content || {};

  // Check which visualizer to load
  const isNormalization = topicId.includes("norm") || topic.title.toLowerCase().includes("normal");
  const isBST = topicId.includes("bst") || topic.title.toLowerCase().includes("tree");
  const isStackQueue = topicId.includes("stack") || topicId.includes("queue");
  const isProcess = topicId.includes("process") || topicId.includes("schedul");

  // Sample quick check question
  const quickCheckQuestion = {
    question: isNormalization
      ? "In which Normal Form must all non-prime attributes be fully functionally dependent on the entire primary key, eliminating partial dependencies?"
      : isBST
      ? "What is the worst-case time complexity of searching a key in an un-balanced degenerate Binary Search Tree?"
      : "What is the primary benefit of decomposing a data structure or database relation?",
    options: isNormalization
      ? ["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)"]
      : isBST
      ? ["O(1)", "O(log N)", "O(N)", "O(N log N)"]
      : ["Increases disk storage", "Eliminates anomalies & prevents corruption", "Slows down query speed", "Requires manual backups"],
    correctIdx: isNormalization ? 1 : isBST ? 2 : 1,
    explanation: isNormalization
      ? "Second Normal Form (2NF) enforces that no non-prime attribute should depend on a proper subset of any candidate key (eliminates Partial Dependency)."
      : isBST
      ? "When items are inserted in sorted order, an un-balanced BST degrades into a linear linked list where search takes O(N) worst-case time."
      : "Decomposition breaks apart monolithic tables or structures to eliminate update, insertion, and deletion anomalies.",
  };

  // Sample practice questions
  const practiceQuestions = [
    {
      id: "p1",
      difficulty: "Easy",
      title: "Core Definition Check",
      question: `Define the primary objective of ${topic.title} and identify its main constraint.`,
      options: [
        "Eliminate data redundancy while preserving dependencies",
        "Merge all data into one single table",
        "Discard indexes to save memory",
        "Enforce strict linear search",
      ],
      correctIdx: 0,
      hint: "Think about why databases decompose tables into clean relations.",
      explanation: "The core goal is to reduce redundancy and prevent update/delete anomalies without losing data.",
    },
    {
      id: "p2",
      difficulty: "Medium",
      title: "Transitive Dependency & Functional Analysis",
      question: "If relation R has attributes (A, B, C) with FDs: A → B and B → C, which normal form is violated?",
      options: ["1NF", "2NF", "3NF", "None (Already normalized)"],
      correctIdx: 2,
      hint: "A is primary key. Non-key attribute C depends on another non-key attribute B.",
      explanation: "Transitive dependency occurs when non-key attribute depends on another non-key attribute (A → B → C). This violates 3NF.",
    },
    {
      id: "p3",
      difficulty: "Challenge",
      title: "Decomposition Verification",
      question: "Which mathematical condition guarantees that a decomposition is Lossless Join?",
      options: [
        "R1 ∩ R2 must be empty",
        "R1 ∩ R2 must functionally determine (R1 - R2) or (R2 - R1)",
        "Both tables must have identical row counts",
        "R1 ∪ R2 must contain NULL values only",
      ],
      correctIdx: 1,
      hint: "Common attributes must form a superkey of at least one of the decomposed relations.",
      explanation: "Lossless Join is mathematically guaranteed if and only if R1 ∩ R2 → (R1 - R2) or R1 ∩ R2 → (R2 - R1) holds true in the FD set.",
    },
  ];

  // Quick Test 5 questions
  const quickTestQuestions = [
    {
      q: "What does 1NF strictly mandate for all table columns?",
      options: ["Foreign keys only", "Atomic (indivisible) values", "Composite primary keys", "No NULL values"],
      correct: 1,
    },
    {
      q: "A partial functional dependency occurs when a non-key attribute depends on:",
      options: ["The entire primary key", "A proper subset of a composite candidate key", "Another non-prime attribute", "Foreign keys"],
      correct: 1,
    },
    {
      q: "Which normal form is strictly stronger than 3NF by requiring every determinant to be a super key?",
      options: ["2NF", "BCNF (Boyce-Codd)", "4NF", "5NF"],
      correct: 1,
    },
    {
      q: "What is an 'Update Anomaly'?",
      options: [
        "Database crashing during server boot",
        "Inconsistency caused when redundant copies of a data item are not all updated simultaneously",
        "Slow network throughput",
        "Corrupted hard drive sectors",
      ],
      correct: 1,
    },
    {
      q: "Lossless join decomposition ensures that:",
      options: [
        "Natural join of decomposed tables produces exactly the original relation without spurious tuples",
        "No columns are repeated",
        "Queries execute in zero milliseconds",
        "All tables are merged into one file",
      ],
      correct: 0,
    },
  ];

  const handleQuickTestSubmit = () => {
    let score = 0;
    quickTestQuestions.forEach((q, i) => {
      if (testSelectedAnswers[i] === q.correct) score++;
    });
    setTestScore(score);
    setTestSubmitted(true);
    const accuracy = Math.round((score / quickTestQuestions.length) * 100);
    if (accuracy >= 80) {
      updateTopicMastery(topicId, { masteryStatus: "mastered", accuracy });
      setMasteryStatus("mastered");
    } else if (accuracy >= 60) {
      updateTopicMastery(topicId, { masteryStatus: "understood", accuracy });
      setMasteryStatus("understood");
    } else {
      updateTopicMastery(topicId, { masteryStatus: "practicing", accuracy });
      setMasteryStatus("practicing");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 py-6 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 flex-wrap">
        <Link to="/learn" className="hover:text-blue-600 transition-colors">
          My Learning
        </Link>
        <span>/</span>
        <Link to={`/learn/${subjectId}`} className="hover:text-blue-600 transition-colors">
          {breadcrumbs?.subject?.name || subjectId.toUpperCase()}
        </Link>
        <span>/</span>
        <span className="text-slate-500">{breadcrumbs?.unit?.title || "Unit"}</span>
        <span>/</span>
        <span className="text-slate-900 font-extrabold">{topic.title}</span>
      </div>

      {/* TOPIC HEADER CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-200">
                Topic #{topic.topicNumber || 1}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                ⏱️ {topic.estimatedMinutes || 20} Mins
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                {topic.difficulty || "Intermediate"}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase border ${
                  masteryStatus === "mastered"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : masteryStatus === "understood"
                    ? "bg-blue-100 text-blue-800 border-blue-300"
                    : "bg-slate-100 text-slate-600 border-slate-300"
                }`}
              >
                ● {masteryStatus.toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {topic.title}
            </h1>
          </div>

          {/* Quick Flagship Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setCompanionInitialMode("teach_me");
                setIsCompanionOpen(true);
              }}
              className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>🎓 TEACH ME</span>
            </button>

            <button
              onClick={() => setActiveTab("voice_teacher")}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1.5"
            >
              <span>🎙 Voice Teacher</span>
            </button>

            <button
              onClick={handleBookmarkToggle}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                isBookmarked
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{isBookmarked ? "🔖 Bookmarked" : "🔖 Bookmark"}</span>
            </button>

            <button
              onClick={handleMarkComplete}
              disabled={markingCompleted || completedState}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                completedState
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default"
                  : "bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300"
              }`}
            >
              <span>{completedState ? "✓ Mastered" : "Mark Mastered"}</span>
            </button>
          </div>
        </div>

        {/* 20-min Focus Learning Session Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black">
              ⏱️
            </span>
            <div>
              <div className="text-xs font-black text-slate-900">20-Minute Focus Learning Session</div>
              <div className="text-[11px] text-slate-500 font-medium">
                Step 1: Learn (5m) → Step 2: Visual (4m) → Step 3: Quick Check (2m) → Step 4: Practice (6m) → Step 5: Recap (3m)
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsSessionActive(!isSessionActive);
              if (!isSessionActive) {
                setActiveTab("overview");
                setSessionStep(1);
              }
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 shadow-2xs shrink-0"
          >
            {isSessionActive ? `In Session: Step ${sessionStep} / 5` : "Start 20-min Session"}
          </button>
        </div>
      </div>

      {/* TOPIC NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs overflow-x-auto scrollbar-none">
        {[
          { id: "overview", label: "📖 Learn & Overview" },
          { id: "voice_teacher", label: "🎙 Voice Teacher" },
          { id: "ai_explain", label: "✨ Explain with AI" },
          { id: "visualize", label: "👁️ Visualize" },
          { id: "examples", label: "🌍 Examples & Dry Run" },
          { id: "quick_check", label: "⚡ Quick Check (30s)" },
          { id: "practice", label: "📝 Practice This Topic" },
          { id: "quick_test", label: "🏆 Quick Test (5 Qs)" },
          { id: "notes", label: "📓 Notes & Revision" },
          { id: "exam_answer", label: "🎓 Exam Answer" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: VOICE TEACHER EXPERIENCE ───────────────────────────────────── */}
      {activeTab === "voice_teacher" && (
        <VoiceTeacherExperience
          topicId={topicId}
          topicTitle={topic.title}
          subjectId={subjectId}
          subjectName={breadcrumbs?.subject?.name || subjectId.toUpperCase()}
          embedded={true}
        />
      )}

      {/* ── TAB 1: OVERVIEW & DEEP READING EXPERIENCE ──────────────────────── */}
      {activeTab === "overview" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
          {/* Summary / WHAT */}
          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>📌</span>
              <span>WHAT IS IT?</span>
            </h2>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              {content.shortExplanation || topic.summary || "Core concept fundamental in computer science and engineering systems."}
            </p>
          </div>

          {/* WHY DOES IT MATTER? */}
          <div className="space-y-2 p-4 rounded-2xl bg-blue-50/40 border border-blue-100">
            <h3 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-2">
              <span>💡</span>
              <span>WHY DO WE NEED THIS?</span>
            </h3>
            <p className="text-xs text-blue-950 font-medium leading-relaxed">
              {content.simpleExplanation ||
                "Without this concept, systems suffer from high storage redundancy, potential data corruption during concurrent transactions, and unbounded worst-case processing times."}
            </p>
          </div>

          {/* HOW DOES IT WORK? (Numbered steps) */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>🪜</span>
              <span>HOW DOES IT WORK? (STEP-BY-STEP)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="text-xs font-black text-blue-600">STEP 1</span>
                <h4 className="text-xs font-bold text-slate-900">Inspect Invariants & Constraints</h4>
                <p className="text-[11px] text-slate-500">Analyze the input parameters, schema attributes, and dependencies.</p>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="text-xs font-black text-indigo-600">STEP 2</span>
                <h4 className="text-xs font-bold text-slate-900">Decompose / Rebalance Structure</h4>
                <p className="text-[11px] text-slate-500">Apply algorithmic transformations to eliminate redundancies or imbalances.</p>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="text-xs font-black text-emerald-600">STEP 3</span>
                <h4 className="text-xs font-bold text-slate-900">Verify Correctness & Dependencies</h4>
                <p className="text-[11px] text-slate-500">Confirm lossless properties, dependency preservation, or log-N height bounds.</p>
              </div>
            </div>
          </div>

          {/* WHERE IS IT USED? */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>🌍</span>
              <span>WHERE IS IT USED IN INDUSTRY?</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {content.realWorldExample ||
                "Used in relational databases like PostgreSQL/MySQL to guarantee ACID consistency, and in search indexing engines to retrieve records with minimal disk I/O."}
            </p>
          </div>

          {/* HOW IS IT ASKED IN EXAMS? */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-2">
                <span>🎓</span>
                <span>HOW IS THIS ASKED IN UNIVERSITY SEMESTER EXAMS?</span>
              </h3>
              <button
                onClick={() => setActiveTab("exam_answer")}
                className="text-xs font-bold text-amber-800 underline hover:text-amber-900"
              >
                View 5-Mark Answer Format →
              </button>
            </div>
            <p className="text-xs text-amber-950 font-medium">
              Common questions include: "Explain 2NF and 3NF with real-life database schema", "Prove why BCNF is stricter than 3NF", or numerical problems calculating Candidate Keys and identifying partial dependencies.
            </p>
          </div>
        </div>
      )}

      {/* ── TAB 2: EXPLAIN WITH AI (ALL PRESET MODES) ───────────────────────── */}
      {activeTab === "ai_explain" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-lg">✨</span>
                <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
                  Explain with AI
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Switch explanation level dynamically based on your current need.
              </p>
            </div>

            {/* Language & Mode buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleRequestAIExplain(aiExplainMode, aiLanguage === "english" ? "hinglish" : "english")}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
              >
                🗣️ Language: {aiLanguage === "english" ? "English" : "Hinglish"}
              </button>
            </div>
          </div>

          {/* Mode Switcher Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: "beginner", label: "👶 Beginner / Simpler" },
              { id: "exam_ready", label: "🎓 Exam Ready (5 Marks)" },
              { id: "interview_ready", label: "💼 Interview Ready" },
              { id: "deep_dive", label: "🔬 Deep Dive (Internal Details)" },
              { id: "hinglish", label: "🇮🇳 Explain in Hinglish" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => handleRequestAIExplain(m.id, m.id === "hinglish" ? "hinglish" : aiLanguage)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  aiExplainMode === m.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* AI Explanation Box */}
          <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium min-h-[160px] whitespace-pre-wrap">
            {aiExplainLoading ? (
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                <span>Generating explanation tailored for CSE students...</span>
              </div>
            ) : (
              aiExplainText || "Click any explanation mode above to generate an instant conceptual breakdown."
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: VISUALIZE (INTERACTIVE CSE LABS) ─────────────────────────── */}
      {activeTab === "visualize" && (
        <div className="space-y-6">
          <DynamicTopicVisualizer
            topicId={topicId}
            topicTitle={topic.title}
            subjectId={subjectId}
            subjectName={breadcrumbs?.subject?.name || subjectId.toUpperCase()}
          />
        </div>
      )}

      {/* ── TAB 4: EXAMPLES & DRY RUN ───────────────────────────────────────── */}
      {activeTab === "examples" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
          <h2 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span>🌍</span>
            <span>THREE PERSPECTIVES: REAL-LIFE, TECHNICAL & EXAM</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Real Life */}
            <div className="p-5 rounded-2xl border border-blue-100 bg-blue-50/30 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                Real-Life Example
              </span>
              <h4 className="text-xs font-bold text-slate-900">Hospital Patient Management</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                A patient has one unique PatientID. Instead of copying their medical history, insurance, and doctor name into every billing slip, the hospital references PatientID across appointments.
              </p>
            </div>

            {/* Technical */}
            <div className="p-5 rounded-2xl border border-indigo-100 bg-indigo-50/30 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-800">
                Technical Architecture
              </span>
              <h4 className="text-xs font-bold text-slate-900">Foreign Key Integrity & Indexing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Relational engines create B-Tree indexes on Primary and Foreign keys. Queries use index seeks (O(log N)) to join tables without full table scans.
              </p>
            </div>

            {/* Exam */}
            <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/30 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                University Exam Example
              </span>
              <h4 className="text-xs font-bold text-slate-900">Given Relation R(A, B, C, D)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                FDs: A → B, BC → D. Compute candidate key (AC), test for 2NF violation (A → B violates 2NF because A is part of candidate key AC).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: ACTIVE LEARNING QUICK CHECK (30 SECONDS) ────────────────── */}
      {activeTab === "quick_check" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200">
              ⚡ 30-Second Active Check
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-2">
              {quickCheckQuestion.question}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickCheckQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                disabled={quickCheckAnswered}
                onClick={() => {
                  setSelectedOption(idx);
                  setQuickCheckAnswered(true);
                }}
                className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                  quickCheckAnswered
                    ? idx === quickCheckQuestion.correctIdx
                      ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                      : selectedOption === idx
                      ? "bg-rose-50 border-rose-400 text-rose-900"
                      : "bg-slate-50 border-slate-200 text-slate-400"
                    : selectedOption === idx
                    ? "bg-blue-50 border-blue-400 text-blue-900"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{opt}</span>
                {quickCheckAnswered && idx === quickCheckQuestion.correctIdx && <span>✓ Correct</span>}
                {quickCheckAnswered && selectedOption === idx && idx !== quickCheckQuestion.correctIdx && (
                  <span>✕ Incorrect</span>
                )}
              </button>
            ))}
          </div>

          {quickCheckAnswered && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 font-medium space-y-1 animate-fade-in">
              <span className="font-bold">💡 Why this is the correct answer:</span>
              <p>{quickCheckQuestion.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 6: PRACTICE THIS TOPIC (ADAPTIVE QUESTION BANK) ─────────────── */}
      {activeTab === "practice" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Targeted Practice
              </span>
              <h2 className="text-base font-black text-slate-900">
                Practice Questions for {topic.title}
              </h2>
            </div>

            {/* Easy / Med / Challenge indicators */}
            <div className="flex items-center gap-1.5">
              {practiceQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setActivePracticeIndex(idx)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    activePracticeIndex === idx
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Q{idx + 1} ({q.difficulty})
                </button>
              ))}
            </div>
          </div>

          {/* Current Question */}
          {(() => {
            const q = practiceQuestions[activePracticeIndex];
            const chosen = practiceAnswers[q.id];
            const feedback = practiceFeedback[q.id];

            return (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                    {q.difficulty}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{q.title}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-relaxed">{q.question}</h3>

                <div className="space-y-2">
                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      disabled={chosen !== undefined}
                      onClick={() => {
                        const isCorrect = i === q.correctIdx;
                        setPracticeAnswers((prev) => ({ ...prev, [q.id]: i }));
                        setPracticeFeedback((prev) => ({ ...prev, [q.id]: isCorrect }));
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                        chosen !== undefined
                          ? i === q.correctIdx
                            ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                            : chosen === i
                            ? "bg-rose-50 border-rose-400 text-rose-900"
                            : "bg-white border-slate-200 text-slate-400"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{opt}</span>
                      {chosen !== undefined && i === q.correctIdx && <span>✓ Correct</span>}
                    </button>
                  ))}
                </div>

                {chosen !== undefined && (
                  <div
                    className={`p-4 rounded-2xl border text-xs font-medium space-y-1 ${
                      feedback ? "bg-emerald-50 border-emerald-200 text-emerald-950" : "bg-rose-50 border-rose-200 text-rose-950"
                    }`}
                  >
                    <span className="font-bold">{feedback ? "🎉 Excellent!" : "⚠️ Concept Review:"}</span>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── TAB 7: QUICK TEST (5 QUESTIONS TIMED EVALUATION) ───────────────── */}
      {activeTab === "quick_test" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
          {!testSubmitted ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-blue-100 text-blue-800">
                    Topic Mini Test
                  </span>
                  <h2 className="text-base font-black text-slate-900 mt-1">
                    5-Question Diagnostic Test
                  </h2>
                </div>
                <span className="text-xs font-bold text-slate-400">⏱️ Est: 5 mins</span>
              </div>

              {quickTestQuestions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900">
                    Q{idx + 1}. {q.q}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => setTestSelectedAnswers((prev) => ({ ...prev, [idx]: oIdx }))}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                          testSelectedAnswers[idx] === oIdx
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleQuickTestSubmit}
                disabled={Object.keys(testSelectedAnswers).length < quickTestQuestions.length}
                className="w-full py-3 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50"
              >
                Submit Quick Test
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-4 text-center">
              <span className="text-3xl">🏆</span>
              <h3 className="text-lg font-black text-slate-900">
                Diagnostic Test Completed!
              </h3>
              <div className="text-2xl font-black text-emerald-700">
                Score: {testScore} / {quickTestQuestions.length} ({Math.round((testScore / quickTestQuestions.length) * 100)}% Accuracy)
              </div>
              <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto">
                {testScore >= 4
                  ? "Outstanding mastery! You have demonstrated a clear understanding of the core concepts."
                  : "Good effort! Revise the weak areas below and retake the test to reach 100% mastery."}
              </p>
              <button
                onClick={() => {
                  setTestSubmitted(false);
                  setTestSelectedAnswers({});
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Retake Test
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 8: NOTES & AI REVISION NOTES GENERATOR ─────────────────────── */}
      {activeTab === "notes" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
                Topic Revision Notes
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Save personal definitions, exam tips, and AI generated summary notes.
              </p>
            </div>

            <button
              onClick={() => handleCreateRevisionNotes(true)}
              disabled={generatingRevision}
              className="px-3.5 py-2 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs flex items-center gap-1.5"
            >
              <span>✨</span>
              <span>{generatingRevision ? "Generating..." : "Create AI Revision Notes"}</span>
            </button>
          </div>

          {/* Add Personal Note Input */}
          <form onSubmit={handleSavePersonalNote} className="space-y-2">
            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Write a personal note, shortcut, or exam tip for this topic..."
              rows={3}
              className="w-full p-3.5 rounded-2xl text-xs border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newNoteText.trim() || savingNote}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                Save Note
              </button>
            </div>
          </form>

          {/* Saved Notes List */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-400">Saved Notes ({notesList.length})</h3>
            {notesList.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400 font-medium">
                No personal notes saved yet. Type a note above or click "Create AI Revision Notes"!
              </div>
            ) : (
              notesList.map((n) => (
                <div key={n._id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{n.title || "Note"}</span>
                    <button
                      onClick={() => handleDeleteNote(n._id)}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-bold"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 font-medium whitespace-pre-wrap">{n.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── TAB 9: EXAM ANSWER GENERATOR (2, 5, 10 MARKS) ──────────────────── */}
      {activeTab === "exam_answer" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>🎓</span>
                <span>University Exam Answer Generator</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Generate structured university semester examination answers tailored for your university syllabus.
              </p>
            </div>

            {/* Marks Selector */}
            <div className="flex items-center gap-2">
              {[2, 5, 10].map((m) => (
                <button
                  key={m}
                  onClick={() => handleGenerateExamAnswer(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedMarks === m
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {m} Marks
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap min-h-[160px]">
            {examAnswerLoading ? (
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                <span>Formatting {selectedMarks}-mark university answer structure...</span>
              </div>
            ) : (
              examAnswerText || "Select 2, 5, or 10 marks above to generate a university-ready structured answer."
            )}
          </div>
        </div>
      )}

      {/* Persistent Floating Learning Companion Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setCompanionInitialMode("beginner");
            setIsCompanionOpen(true);
          }}
          className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 border border-slate-700/80 group"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>🎓 Learning Companion</span>
        </button>
      </div>

      {/* Floating Learning Companion Drawer */}
      <LearningCompanion
        isOpen={isCompanionOpen}
        onClose={() => setIsCompanionOpen(false)}
        topicId={topicId}
        topicTitle={topic.title}
        subjectId={subjectId}
        subjectName={breadcrumbs?.subject?.name || subjectId.toUpperCase()}
        initialMode={companionInitialMode}
      />
    </div>
  );
};

export default TopicLearningPage;
