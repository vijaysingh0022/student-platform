import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
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
  getTopicVideo,
  updateVideoProgress,
  addVideoBookmark,
  getSubjectCurriculum,
} from "../services/api.js";
import { useAppState } from "../context/AppStateContext.jsx";
import DynamicTopicVisualizer from "../components/visualizer/DynamicTopicVisualizer.jsx";
import LearningCompanion from "../components/LearningCompanion.jsx";
import VoiceTeacherExperience from "../components/voice/VoiceTeacherExperience.jsx";
import VideoPlayer from "../components/video/VideoPlayer.jsx";
import VideoTranscript from "../components/video/VideoTranscript.jsx";
import TopicSidebarNavigation from "../components/video/TopicSidebarNavigation.jsx";

const TopicLearningPage = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { onTopicCompleted } = useAppState();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "video"); // "video" (default) | "overview" | "ai_explain" | "visualize" | "practice" | "notes" | "voice_teacher" | "quick_test" | "exam_answer"

  // Video State
  const [videoData, setVideoData] = useState(null);
  const [videoProgress, setVideoProgress] = useState({
    watchedSeconds: 0,
    lastPosition: 0,
    completionPercentage: 0,
    isCompleted: false,
    bookmarks: [],
  });
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [unitTopicsList, setUnitTopicsList] = useState([]);
  const [currentUnitData, setCurrentUnitData] = useState(null);

  // Learning Progress & Mastery
  const [masteryStatus, setMasteryStatus] = useState("learning"); // "not_started" | "learning" | "practicing" | "understood" | "mastered"
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [completedState, setCompletedState] = useState(false);
  const [markingCompleted, setMarkingCompleted] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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
  const [notesMarkedAsRead, setNotesMarkedAsRead] = useState(false);

  // Practice state
  const [activePracticeIndex, setActivePracticeIndex] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [practiceFeedback, setPracticeFeedback] = useState({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [adaptiveScore, setAdaptiveScore] = useState(0);

  // Quick Test state
  const [testActive, setTestActive] = useState(false);
  const [testCurrentIndex, setTestCurrentIndex] = useState(0);
  const [testSelectedAnswers, setTestSelectedAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);

  // Voice Companion Drawer
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);
  const [companionInitialMode, setCompanionInitialMode] = useState("beginner");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4500);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchTopic = async () => {
      setLoading(true);
      setLoadingVideo(true);
      // Immediately reset previous video to prevent stale video bleed across topics
      setVideoData(null);
      setVideoProgress({
        watchedSeconds: 0,
        lastPosition: 0,
        completionPercentage: 0,
        isCompleted: false,
        bookmarks: [],
      });
      try {
        const [res, videoRes, currRes] = await Promise.all([
          getTopicDetails(topicId),
          getTopicVideo(topicId).catch(() => ({ data: null })),
          getSubjectCurriculum(subjectId).catch(() => ({ data: null })),
        ]);

        if (isMounted && res.data) {
          setData(res.data);
          const prog = res.data.progress;
          setCompletedState(!!prog?.isCompleted);
          if (prog?.masteryStatus) {
            setMasteryStatus(prog.masteryStatus);
          }

          if (videoRes?.data?.video) {
            setVideoData(videoRes.data.video);
            if (videoRes.data.progress) {
              setVideoProgress(videoRes.data.progress);
            }
          } else {
            setVideoData(null);
          }

          // Extract unit chapters and topics for sidebar
          if (currRes?.data?.units) {
            const currentUnitId = res.data.topic?.unitId;
            const matchedUnit = currRes.data.units.find((u) => u.unitId === currentUnitId) || currRes.data.units[0];
            setCurrentUnitData(matchedUnit);
            const flatTopics = (matchedUnit?.chapters || []).flatMap((c) => c.topics || []);
            setUnitTopicsList(flatTopics);
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
        if (isMounted) {
          setLoading(false);
          setLoadingVideo(false);
        }
      }
    };

    fetchTopic();
    return () => {
      isMounted = false;
    };
  }, [topicId, subjectId]);

  // Video progress heartbeat updater
  const handleVideoProgressUpdate = async (currentTime, duration) => {
    try {
      const res = await updateVideoProgress(topicId, { currentTime, duration });
      if (res?.data?.progress) {
        setVideoProgress((prev) => ({
          ...prev,
          ...res.data.progress,
        }));
      }
      if (res?.data?.justCompleted) {
        setCompletedState(true);
        showToast("🎉 Video Completed (≥90%)! Topic marked as completed (+20 XP, +30 XP Topic)!");
        if (onTopicCompleted) onTopicCompleted(topicId, subjectId);
      }
    } catch (err) {
      // silent fallback
    }
  };

  // Video completion callback
  const handleVideoCompleted = () => {
    setCompletedState(true);
    showToast("🎉 Video Completed! Topic marked as completed (+20 XP).");
    if (onTopicCompleted) onTopicCompleted(topicId, subjectId);
  };

  // Timestamp bookmark callback
  const handleBookmarkTimestamp = async (seconds, timeLabel) => {
    try {
      const res = await addVideoBookmark(topicId, { timestampSeconds: seconds, note: `Bookmark at ${timeLabel}` });
      if (res?.data?.bookmarks) {
        setVideoProgress((prev) => ({ ...prev, bookmarks: res.data.bookmarks }));
        showToast(`🔖 Saved bookmark at timestamp ${timeLabel}!`);
      }
    } catch (err) {
      showToast("Failed to save timestamp bookmark.");
    }
  };

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
    <div className="w-full text-slate-800 space-y-6 pb-16 animate-fade-in">
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
          { id: "video", label: "🎥 Watch Video" },
          { id: "ai_explain", label: "🤖 AI Explain" },
          { id: "notes", label: "📖 AI Notes" },
          { id: "practice", label: "📝 Practice Questions" },
          { id: "overview", label: "📄 Deep Overview" },
          { id: "visualize", label: "👁️ Interactive Lab" },
          { id: "voice_teacher", label: "🎙 Voice Teacher" },
          { id: "quick_test", label: "🏆 Quick Test" },
          { id: "exam_answer", label: "🎓 Exam Answer" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-violet-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-bounce">
          <span>🔔</span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage("")} className="ml-2 text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* ── MAIN CONTENT GRID: 3 COLS FOR TOPIC CONTENT + 1 COL FOR CHAPTER SIDEBAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* LEFT / CENTER WORKSPACE (3 Columns) */}
        <div className="lg:col-span-3 space-y-6">
          {/* ── TAB 0: VIDEO LEARNING EXPERIENCE ──────────────────────────────── */}
          {activeTab === "video" && (
            <div className="space-y-6 animate-fade-in">
              {/* Premium Video Header */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase bg-violet-100 text-violet-800">
                        🎥 Official Video Lecture
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        Duration: {videoData?.durationLabel || "08:42"}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {videoData?.title || topic.title}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Learn this topic through video, AI explanation, interactive dry run and practice.
                    </p>
                  </div>

                  {/* Progress Badge */}
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Video Progress</div>
                      <div className="text-sm font-black text-violet-700">
                        {videoProgress.completionPercentage}% Watched
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-black text-xs">
                      {videoProgress.isCompleted || videoProgress.completionPercentage >= 90 ? "✓" : `${videoProgress.completionPercentage}%`}
                    </div>
                  </div>
                </div>

                {/* Continue Watching Banner if left off */}
                {videoProgress.lastPosition > 10 && !videoProgress.isCompleted && (
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-violet-900 flex items-center gap-1.5">
                      <span>▶</span>
                      <span>Continue from {Math.floor(videoProgress.lastPosition / 60)}:{(Math.floor(videoProgress.lastPosition % 60)).toString().padStart(2, "0")}</span>
                    </span>
                    <button
                      onClick={() => handleVideoProgressUpdate(videoProgress.lastPosition, videoData?.duration || 522)}
                      className="text-[11px] font-black text-violet-700 hover:underline"
                    >
                      Resume Position →
                    </button>
                  </div>
                )}
              </div>

              {/* The Video Player Component */}
              <VideoPlayer
                video={videoData}
                initialPosition={videoProgress.lastPosition || 0}
                onProgressUpdate={handleVideoProgressUpdate}
                onVideoCompleted={handleVideoCompleted}
                onBookmarkTimestamp={handleBookmarkTimestamp}
                currentTopicTitle={topic.title}
                onSelectAlternativeVideo={(alt) => {
                  setVideoData((prev) => ({
                    ...prev,
                    title: alt.title || prev.title,
                    videoUrl: alt.videoUrl,
                    extractedId: alt.id,
                    cleanEmbedUrl: alt.cleanEmbedUrl,
                  }));
                  showToast(`Switched video to: ${alt.title}`);
                }}
              />

              {/* Related & Alternative Lectures Section */}
              {videoData?.relatedVideos && videoData.relatedVideos.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📚</span>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Related Lectures & Alternative Explanations
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      Multi-angle conceptual mastery
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {videoData.relatedVideos.map((rel, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          const relId = rel.videoUrl.match(/v=([a-zA-Z0-9_-]{11})/)?.[1];
                          setVideoData((prev) => ({
                            ...prev,
                            title: rel.title,
                            videoUrl: rel.videoUrl,
                            extractedId: relId,
                            cleanEmbedUrl: `https://www.youtube-nocookie.com/embed/${relId}?enablejsapi=1&autoplay=1`,
                          }));
                          showToast(`Now playing: ${rel.title}`);
                        }}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-400 hover:bg-violet-50/50 cursor-pointer transition-all space-y-2 group"
                      >
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-200">
                          <img
                            src={rel.thumbnailUrl}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-900/80 text-white">
                            {rel.durationLabel || "Lecture"}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-violet-700">
                          {rel.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Video Transcript & Chapter Navigation */}
              <VideoTranscript
                transcript={videoData?.transcript || []}
                keyMoments={videoData?.keyMoments || []}
                onSeek={(sec) => handleVideoProgressUpdate(sec, videoData?.duration || 522)}
              />

              {/* Quick AI Jump CTAs below video */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">⚡</span>
                    <h3 className="text-sm font-black tracking-wide">Next Step in Learning Flow</h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    Finished or paused the video? Use AI to explain simply, review notes, or take adaptive practice.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setActiveTab("ai_explain");
                      handleRequestAIExplain("beginner", "english");
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-black bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
                  >
                    🤖 AI Explain
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("notes");
                      handleCreateRevisionNotes(false);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                  >
                    📖 AI Notes
                  </button>
                  <button
                    onClick={() => setActiveTab("practice")}
                    className="px-3.5 py-2 rounded-xl text-xs font-black bg-violet-600 hover:bg-violet-500 text-white shadow-sm"
                  >
                    📝 Practice ({practiceQuestions.length} Qs)
                  </button>
                </div>
              </div>
            </div>
          )}

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

      {/* ── TAB 2: EXPLAIN WITH AI (AI TEACHER SPECIFIC TO TOPIC) ──────────── */}
      {activeTab === "ai_explain" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <h2 className="text-base font-black text-slate-900 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  AI Teacher — {topic.title}
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Targeted AI explanation focused strictly on <strong>{topic.title}</strong>.
              </p>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Language:</span>
              {["English", "Hindi", "Hinglish"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleRequestAIExplain(aiExplainMode, lang.toLowerCase())}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    aiLanguage === lang.toLowerCase()
                      ? "bg-violet-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Buttons required by prompt: Explain Simply, Hindi, English, Hinglish, Exam-Oriented, 2-Minute Revision */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: "beginner", label: "👶 Explain Simply", lang: "english" },
              { id: "hindi", label: "🇮🇳 Hindi", lang: "hindi" },
              { id: "english", label: "🇬🇧 English", lang: "english" },
              { id: "hinglish", label: "🗣️ Hinglish", lang: "hinglish" },
              { id: "exam_ready", label: "🎓 Exam-Oriented", lang: aiLanguage },
              { id: "2min_revision", label: "⚡ 2-Minute Revision", lang: aiLanguage },
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleRequestAIExplain(preset.id, preset.lang)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  aiExplainMode === preset.id
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* AI Explanation Content Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium min-h-[180px] whitespace-pre-wrap">
            {aiExplainLoading ? (
              <div className="flex items-center gap-2 text-slate-500 py-6 justify-center">
                <span className="w-3 h-3 rounded-full bg-violet-600 animate-ping" />
                <span className="font-bold">AI Teacher is preparing a specialized {aiExplainMode} breakdown for {topic.title}...</span>
              </div>
            ) : (
              aiExplainText || `Welcome! I am your AI Mentor for ${topic.title}. Choose any mode above to get an instant tailored explanation.`
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

      {/* ── TAB 6: PRACTICE THIS TOPIC (ADAPTIVE QUESTION BANK, ACCURACY & RECS) ── */}
      {activeTab === "practice" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📝</span>
                <h2 className="text-base font-black text-slate-900 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Adaptive Practice Questions: {topic.title}
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Questions dynamically adjust difficulty (Easy, Medium, Hard, Advanced) based on your performance.
              </p>
            </div>

            {/* Easy / Med / Challenge indicators */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {practiceQuestions.map((q, idx) => {
                const isAnswered = practiceAnswers[q.id] !== undefined;
                const isCorrect = practiceFeedback[q.id];

                return (
                  <button
                    key={q.id}
                    onClick={() => setActivePracticeIndex(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      activePracticeIndex === idx
                        ? "bg-violet-600 text-white shadow-xs"
                        : isAnswered
                        ? isCorrect
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-rose-100 text-rose-800 border border-rose-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <span>Q{idx + 1}</span>
                    <span className="text-[10px] opacity-75">({q.difficulty})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Question */}
          {(() => {
            const q = practiceQuestions[activePracticeIndex];
            const chosen = practiceAnswers[q.id];
            const feedback = practiceFeedback[q.id];

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-violet-100 text-violet-800 border border-violet-200">
                      {q.difficulty}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      Multiple Choice
                    </span>
                    <span className="text-xs font-bold text-slate-500">{q.title}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    Question {activePracticeIndex + 1} of {practiceQuestions.length}
                  </span>
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

                        const newAns = { ...practiceAnswers, [q.id]: i };
                        const correctCount = Object.keys(newAns).filter((qid) => {
                          const found = practiceQuestions.find(pq => pq.id === qid);
                          return found && newAns[qid] === found.correctIdx;
                        }).length;
                        const acc = Math.round((correctCount / practiceQuestions.length) * 100);
                        setAdaptiveScore(acc);
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
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {chosen !== undefined && i === q.correctIdx && <span className="text-emerald-700 font-extrabold">✓ Correct</span>}
                    </button>
                  ))}
                </div>

                {chosen !== undefined && (
                  <div
                    className={`p-4 rounded-2xl border text-xs font-medium space-y-1.5 animate-fade-in ${
                      feedback ? "bg-emerald-50 border-emerald-200 text-emerald-950" : "bg-rose-50 border-rose-200 text-rose-950"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{feedback ? "🎉 Excellent!" : "⚠️ Concept Review:"}</span>
                      {activePracticeIndex < practiceQuestions.length - 1 && (
                        <button
                          onClick={() => setActivePracticeIndex(activePracticeIndex + 1)}
                          className="px-3 py-1 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-black text-[11px] shadow-xs"
                        >
                          Next Question →
                        </button>
                      )}
                    </div>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── TOPIC ACCURACY & PERFORMANCE BREAKDOWN (Section 12 & 13) ── */}
          {Object.keys(practiceAnswers).length >= 1 && (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Topic Performance & Accuracy
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Continuous evaluation based on your practice submissions for {topic.title}.
                  </p>
                </div>

                {/* Score Pill */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Topic Score</div>
                    <div className="text-xl font-black text-violet-700">
                      {Object.keys(practiceAnswers).filter(k => practiceFeedback[k]).length} / {practiceQuestions.length} ({adaptiveScore}%)
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase border ${
                      adaptiveScore >= 80
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : adaptiveScore >= 50
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-rose-100 text-rose-800 border-rose-300"
                    }`}
                  >
                    {adaptiveScore >= 80 ? "🟢 Good Understanding" : adaptiveScore >= 50 ? "🟡 Developing" : "🔴 Weak Topic"}
                  </span>
                </div>
              </div>

              {/* Strengths & Needs Improvement Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>✓</span> Strengths
                  </h4>
                  <ul className="text-xs text-emerald-950 space-y-1 font-medium">
                    <li>✓ Basic Architecture & Core Concepts</li>
                    <li>✓ High-level property recognition</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚠️</span> Needs Improvement
                  </h4>
                  <ul className="text-xs text-amber-950 space-y-1 font-medium">
                    <li>⚠️ Three-Schema ANSI/SPARC mappings & Storage layer</li>
                    <li>⚠️ Edge-case handling and mathematical invariants</li>
                  </ul>
                </div>
              </div>

              {/* AI Recommendation Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 text-white space-y-3 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <h4 className="text-xs font-black uppercase tracking-wider">AI Recommended Next Step</h4>
                </div>
                <p className="text-xs text-violet-100 font-medium leading-relaxed">
                  Your <strong>{topic.title}</strong> accuracy is {adaptiveScore}%. You have good conceptual intuition, but need more clarity on edge-case scenarios and schema layers.
                </p>
                <div className="flex items-center gap-3 pt-1 flex-wrap">
                  <button
                    onClick={() => setActiveTab("video")}
                    className="px-4 py-2 rounded-xl text-xs font-black bg-white text-violet-900 hover:bg-violet-50 transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <span>🎥</span> Watch Recommended Video
                  </button>
                  <button
                    onClick={() => setActivePracticeIndex(0)}
                    className="px-4 py-2 rounded-xl text-xs font-black bg-violet-800/80 hover:bg-violet-900 text-white transition-all border border-violet-400/40"
                  >
                    📝 Practice 5 Questions
                  </button>
                </div>
              </div>
            </div>
          )}
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

      {/* ── TAB 8: AI NOTES & STRUCTURED REVISION (Section 9) ────────────── */}
      {activeTab === "notes" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📖</span>
                <h2 className="text-base font-black text-slate-900 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  AI Notes & Revision: {topic.title}
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Concise definitions, key points, code rules, examples, and exam pitfalls.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setNotesMarkedAsRead(!notesMarkedAsRead)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all border flex items-center gap-1.5 ${
                  notesMarkedAsRead
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span>{notesMarkedAsRead ? "✓ Marked as Read" : "Mark as Read ✓"}</span>
              </button>

              <button
                onClick={() => handleCreateRevisionNotes(true)}
                disabled={generatingRevision}
                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-violet-600 hover:bg-violet-700 shadow-sm flex items-center gap-1.5"
              >
                <span>✨</span>
                <span>{generatingRevision ? "Generating..." : "Generate AI Notes"}</span>
              </button>
            </div>
          </div>

          {/* Structured Topic Notes Display */}
          <div className="space-y-4">
            {/* Definition */}
            <div className="p-4 rounded-2xl bg-violet-50/50 border border-violet-100 space-y-1">
              <span className="text-[10px] font-black uppercase text-violet-700 tracking-wider">Definition</span>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                {revisionNotesData?.definition || content.shortExplanation || topic.summary || `${topic.title} is a foundational concept in computer science engineering systems.`}
              </p>
            </div>

            {/* Important Concepts & Key Points */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Key Concepts & Formulas</span>
              <ul className="text-xs text-slate-800 space-y-1.5 font-medium list-disc pl-4">
                {(revisionNotesData?.keyPoints && revisionNotesData.keyPoints.length > 0) ? (
                  revisionNotesData.keyPoints.map((kp, idx) => <li key={idx}>{kp}</li>)
                ) : (
                  <>
                    <li>Core logic preserves invariants across state transitions with minimal overhead.</li>
                    <li>Time Complexity: <code>{content.timeComplexity || "O(1)"}</code> | Space Complexity: <code>{content.spaceComplexity || "O(1)"}</code></li>
                    <li>Architectural separation ensures physical vs logical data independence.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Examples & Exam Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-1">
                <span className="text-[10px] font-black uppercase text-sky-800 tracking-wider">Real-world Example</span>
                <p className="text-xs text-sky-950 font-medium leading-relaxed">
                  {revisionNotesData?.example || content.realWorldExample || "PostgreSQL and enterprise relational engines organizing storage buffers vs user SQL views."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Common Mistakes to Avoid</span>
                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  {revisionNotesData?.commonMistake || "Confusing logical schema changes (modifying relations) with physical schema changes (indexing on disk)."}
                </p>
              </div>
            </div>
          </div>

          {/* Add Personal Note Input */}
          <form onSubmit={handleSavePersonalNote} className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400">Add Personal Annotation</label>
            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Write a personal note, shortcut, or exam tip for this topic..."
              rows={2}
              className="w-full p-3.5 rounded-2xl text-xs border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newNoteText.trim() || savingNote}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
              >
                Save Personal Note
              </button>
            </div>
          </form>

          {/* Saved Notes List */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-400">Saved Personal Notes ({notesList.length})</h3>
            {notesList.length === 0 ? (
              <div className="p-4 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400 font-medium">
                No personal notes saved yet. Type a note above or click "Generate AI Notes"!
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
        </div>

        {/* RIGHT SIDEBAR: UNIT CHAPTER NAVIGATION (Section 15) */}
        <div className="lg:col-span-1">
          <TopicSidebarNavigation
            subjectId={subjectId}
            unit={currentUnitData || breadcrumbs?.unit}
            currentTopicId={topicId}
            chapterTopics={unitTopicsList.length > 0 ? unitTopicsList : [topic]}
            videoStats={{
              [topicId]: {
                completionPercentage: videoProgress.completionPercentage,
                isCompleted: videoProgress.isCompleted || completedState,
              },
            }}
          />
        </div>
      </div>

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
