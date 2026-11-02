import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  askExamCopilot,
  toggleMistakeBookItem,
  evaluateSimilarQuestion,
} from "../../services/api";
import { RealAIInterviewModal } from "../interview/RealAIInterviewModal.jsx";
import {
  Sparkles,
  X,
  Lightbulb,
  BookOpen,
  ListOrdered,
  AlertCircle,
  Zap,
  Target,
  FileText,
  Brain,
  Send,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  HelpCircle,
  RefreshCw,
  Sliders,
  ChevronRight,
  CheckCircle2,
  Mic,
} from "lucide-react";

export const ExamCopilotDrawer = ({
  isOpen,
  onClose,
  questionContext = {},
  onMistakeAdded,
}) => {
  const navigate = useNavigate();

  // Control toggles
  const [answerLength, setAnswerLength] = useState("normal"); // 'short' | 'normal' | 'detailed'
  const [examMarks, setExamMarks] = useState(5); // 2 | 5 | 10
  const [language, setLanguage] = useState("english"); // 'english' | 'simple' | 'hinglish'

  // Hint Stepper State
  const [hintStep, setHintStep] = useState(1);

  // Active AI View / State
  const [activeAction, setActiveAction] = useState(null); // 'hint' | 'concept' | 'step_by_step' | 'why_wrong' | 'shortcut' | 'similar' | 'quiz' | 'notes' | 'answer' | 'custom'
  const [copilotData, setCopilotData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Freeform user query
  const [userQuery, setUserQuery] = useState("");

  // Mistake Book state
  const [inMistakeBook, setInMistakeBook] = useState(false);
  const [savingMistake, setSavingMistake] = useState(false);

  // Similar Question interactive state
  const [similarSelectedOpt, setSimilarSelectedOpt] = useState(null);
  const [similarEvaluation, setSimilarEvaluation] = useState(null);
  const [evaluatingSimilar, setEvaluatingSimilar] = useState(false);

  // Mini Quiz interactive state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Real AI Live Interview Modal
  const [realInterviewModalOpen, setRealInterviewModalOpen] = useState(false);

  // Copy feedback
  const [copiedText, setCopiedText] = useState(false);
  const [toastNote, setToastNote] = useState(null);

  const scrollRef = useRef(null);

  // Auto-scroll on content update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [copilotData, activeAction]);

  // Reset state on question change
  useEffect(() => {
    setHintStep(1);
    setSimilarSelectedOpt(null);
    setSimilarEvaluation(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setInMistakeBook(false);
  }, [questionContext?.questionId, questionContext?.questionText]);

  const showToast = (msg) => {
    setToastNote(msg);
    setTimeout(() => setToastNote(null), 3000);
  };

  const handleActionClick = async (actionType, customPrompt = "", step = 1) => {
    setLoading(true);
    setError(null);
    setActiveAction(actionType);
    setCopilotData(null);

    try {
      const payload = {
        action: actionType,
        query: customPrompt || userQuery,
        context: {
          questionId: questionContext.questionId || "q-active",
          questionText: questionContext.questionText || "Active Exam Question",
          options: questionContext.options || [],
          userAns: questionContext.userAns !== undefined ? String(questionContext.userAns) : "",
          correctAns: questionContext.correctAns !== undefined ? String(questionContext.correctAns) : "0",
          subjectId: questionContext.subjectId || "dsa",
          subjectName: questionContext.subjectName || "Data Structures & Algorithms",
          unitName: questionContext.unitName || "Unit 1",
          topicId: questionContext.topicId || "general",
          topicName: questionContext.topicName || "Core Concept",
          explanation: questionContext.explanation || "",
          difficulty: questionContext.difficulty || "Medium",
          marks: questionContext.marks || 5,
        },
        options: {
          answerLength,
          examMarks,
          language,
          hintStep: step,
        },
      };

      const res = await askExamCopilot(payload);
      if (res.data && res.data.data) {
        setCopilotData(res.data.data);
      } else {
        setError("Unable to generate response. Please try again.");
      }
    } catch (err) {
      console.error("Copilot action error:", err);
      setError("AI Copilot is temporarily calibrating. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextHint = () => {
    const next = hintStep + 1;
    setHintStep(next);
    handleActionClick("hint", "", next);
  };

  const handleAddToMistakeBook = async () => {
    setSavingMistake(true);
    try {
      const res = await toggleMistakeBookItem({
        questionId: questionContext.questionId || `mistake-${Date.now()}`,
        questionText: questionContext.questionText,
        options: questionContext.options || [],
        subjectId: questionContext.subjectId || "dsa",
        subjectName: questionContext.subjectName || "Computer Science",
        unitName: questionContext.unitName || "",
        topicId: questionContext.topicId || "general",
        topicName: questionContext.topicName || "Core Topic",
        userAns: String(questionContext.userAns || ""),
        correctAns: String(questionContext.correctAns || ""),
        explanation: questionContext.explanation || "",
        action: inMistakeBook ? "remove" : "add",
      });

      if (res.data?.success) {
        setInMistakeBook(!inMistakeBook);
        showToast(!inMistakeBook ? "Added to your Personal Mistake Book! 🔖" : "Removed from Mistake Book.");
        if (onMistakeAdded) onMistakeAdded();
      }
    } catch (err) {
      console.error("Mistake book update error:", err);
      showToast("Mistake recorded locally.");
    } finally {
      setSavingMistake(false);
    }
  };

  const handleEvaluateSimilar = async () => {
    if (similarSelectedOpt === null || !copilotData) return;
    setEvaluatingSimilar(true);
    try {
      const res = await evaluateSimilarQuestion({
        topicId: questionContext.topicId || "general",
        topicName: questionContext.topicName || "Concept",
        subjectId: questionContext.subjectId || "dsa",
        userAns: String(similarSelectedOpt),
        correctAns: String(copilotData.correctAnswer || "0"),
        explanation: copilotData.explanation,
      });
      if (res.data) {
        setSimilarEvaluation(res.data);
        showToast(res.data.isCorrect ? "Mastery boosted! 🚀" : "Review explanation below.");
      }
    } catch (err) {
      console.error("Evaluate similar error:", err);
      const isCorrect = String(similarSelectedOpt) === String(copilotData.correctAnswer);
      setSimilarEvaluation({
        isCorrect,
        message: isCorrect ? "Correct answer! Well done." : "Incorrect. Try reviewing the rule.",
        explanation: copilotData.explanation,
      });
    } finally {
      setEvaluatingSimilar(false);
    }
  };

  const handleCopyContent = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
      showToast("Copied to clipboard!");
    }
  };

  const handleOpenInTutor = () => {
    const qSnippet = (questionContext.questionText || "").slice(0, 100);
    const tutorUrl = `/tutor?subject=${encodeURIComponent(questionContext.subjectId || "dsa")}&topic=${encodeURIComponent(questionContext.topicName || "General")}&contextQuestion=${encodeURIComponent(qSnippet)}`;
    navigate(tutorUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none select-none">
      {/* Light Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-2xs pointer-events-auto transition-opacity"
      />

      {/* Slide-over Drawer Panel */}
      <div className="absolute inset-y-0 right-0 w-full max-w-[460px] bg-white border-l border-slate-200 shadow-2xl flex flex-col pointer-events-auto z-10 transition-transform duration-300">
        {/* Toast Note inside Drawer */}
        {toastNote && (
          <div className="absolute top-16 left-4 right-4 z-50 bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2 animate-fade-in border border-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>{toastNote}</span>
          </div>
        )}

        {/* 1. Header */}
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900 tracking-tight">AI EXAM COPILOT</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ready
                </span>
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-1">
                {questionContext.subjectName || "Computer Science"} → {questionContext.topicName || "Core Concept"}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close Copilot"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Controls & Preferences Strip */}
        <div className="px-5 py-2.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between text-[11px] font-semibold text-slate-600 gap-2 shrink-0">
          {/* Answer Length */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              onClick={() => setAnswerLength("short")}
              className={`px-2 py-0.5 rounded text-[10px] transition ${
                answerLength === "short" ? "bg-blue-600 text-white font-bold" : "hover:text-slate-900"
              }`}
            >
              Short
            </button>
            <button
              onClick={() => setAnswerLength("normal")}
              className={`px-2 py-0.5 rounded text-[10px] transition ${
                answerLength === "normal" ? "bg-blue-600 text-white font-bold" : "hover:text-slate-900"
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setAnswerLength("detailed")}
              className={`px-2 py-0.5 rounded text-[10px] transition ${
                answerLength === "detailed" ? "bg-blue-600 text-white font-bold" : "hover:text-slate-900"
              }`}
            >
              Detailed
            </button>
          </div>

          {/* Exam Marks */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
            {[2, 5, 10].map((m) => (
              <button
                key={m}
                onClick={() => setExamMarks(m)}
                className={`px-2 py-0.5 rounded text-[10px] transition ${
                  examMarks === m ? "bg-indigo-600 text-white font-bold" : "hover:text-slate-900"
                }`}
              >
                {m}M
              </button>
            ))}
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "hinglish" ? "english" : "hinglish")}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
              language === "hinglish"
                ? "bg-amber-50 text-amber-800 border-amber-300 font-bold"
                : "bg-white text-slate-600 border-slate-200 hover:text-slate-900"
            }`}
          >
            {language === "hinglish" ? "🇮🇳 Hinglish" : "🇬🇧 English"}
          </button>
        </div>

        {/* 3. Main Scrollable Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Active Question Context Banner */}
          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100/90 text-xs text-slate-700">
            <div className="flex items-center justify-between text-[11px] font-bold text-blue-800 mb-1">
              <span className="uppercase tracking-wider font-mono">Current Question Context</span>
              <span className="font-mono">{questionContext.marks || 5} Marks</span>
            </div>
            <p className="font-bold text-slate-900 line-clamp-2">
              &quot;{questionContext.questionText || "Select or open any question to trigger contextual assistance."}&quot;
            </p>
            {questionContext.userAns !== undefined && questionContext.userAns !== "" && (
              <div className="mt-2 flex items-center gap-2 pt-2 border-t border-blue-100 text-[11px]">
                <span className="text-slate-500">Your Selection:</span>
                <span className="font-bold text-slate-800 font-mono">
                  {questionContext.options?.[parseInt(questionContext.userAns, 10)] || questionContext.userAns}
                </span>
              </div>
            )}
          </div>

          {/* Home Screen: Quick Actions Grid */}
          {!activeAction && (
            <div className="space-y-4">
              {/* Highlighted Banner: Start Real AI Interview */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-200">
                      LIVE ORAL DEFENSE & VIVA
                    </span>
                  </div>
                  <span className="text-xs">🎙️ ⌨️</span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Start Real AI Interview on Topic
                  </h4>
                  <p className="text-[11px] text-indigo-100 leading-snug mt-0.5">
                    Live voice or text examination with AI examiner Prof. Vance. Think → Answer → AI evaluates → AI asks follow-up → AI teaches weaknesses.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRealInterviewModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Mic className="w-4 h-4 text-indigo-600" />
                  <span>Start AI Interview Session →</span>
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-1">How can I help you with this question?</h4>
                <p className="text-[11px] text-slate-500">Choose a focused exam assistance mode below:</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Hint */}
                <button
                  onClick={() => handleActionClick("hint", "", 1)}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-blue-50/40 hover:border-blue-300 text-left transition shadow-2xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-900 text-xs">Give me a Hint</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Progressive hints without spoilers</div>
                </button>

                {/* 2. Explain Concept */}
                <button
                  onClick={() => handleActionClick("explain_concept")}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-purple-50/40 hover:border-purple-300 text-left transition shadow-2xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-900 text-xs">Explain Concept</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Core intuition, tips & traps</div>
                </button>

                {/* 3. Step-by-Step */}
                <button
                  onClick={() => handleActionClick("step_by_step")}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50/40 hover:border-indigo-300 text-left transition shadow-2xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <ListOrdered className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-900 text-xs">Step-by-Step</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Structured mathematical flow</div>
                </button>

                {/* 4. Why Wrong */}
                <button
                  onClick={() => handleActionClick("why_wrong")}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-rose-50/40 hover:border-rose-300 text-left transition shadow-2xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-900 text-xs">Why is my answer wrong?</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Cognitive trap breakdown</div>
                </button>

                {/* 5. Exam Shortcut */}
                <button
                  onClick={() => handleActionClick("shortcut")}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-teal-50/40 hover:border-teal-300 text-left transition shadow-2xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-900 text-xs">Exam Shortcut</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Elimination & memory tricks</div>
                </button>

                {/* 6. Similar Question */}
                <button
                  onClick={() => handleActionClick("similar_question")}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-blue-50/40 hover:border-blue-300 text-left transition shadow-2xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-900 text-xs">Similar Question</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Practice identical concept</div>
                </button>

                {/* 7. Revision Notes */}
                <button
                  onClick={() => handleActionClick("revision_notes")}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50/40 hover:border-emerald-300 text-left transition shadow-2xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-900 text-xs">Revision Notes</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">High-yield study summary</div>
                </button>

                {/* 8. Test Me */}
                <button
                  onClick={() => handleActionClick("mini_quiz")}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-violet-50/40 hover:border-violet-300 text-left transition shadow-2xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-900 text-xs">Test Me on Topic</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">3-question rapid check</div>
                </button>
              </div>

              {/* Ecosystem Cross-Links */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <button
                  onClick={handleAddToMistakeBook}
                  disabled={savingMistake}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {inMistakeBook ? (
                      <BookmarkCheck className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Bookmark className="w-4 h-4 text-slate-500" />
                    )}
                    <span>{inMistakeBook ? "Saved in Personal Mistake Book" : "Add to Mistake Book"}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Personal Vault</span>
                </button>

                <button
                  onClick={handleOpenInTutor}
                  className="w-full py-2 px-3 rounded-xl bg-purple-50/70 hover:bg-purple-100/70 border border-purple-200 text-purple-800 text-xs font-bold transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Need a deeper explanation? Open in AI Tutor</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-12 text-center text-xs text-slate-500 space-y-3">
              <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
              <div className="font-semibold text-slate-800">LearnX AI is analyzing your question...</div>
              <div className="text-[11px] text-slate-400">Contextualizing against university syllabus & topic mastery</div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>AI Copilot Notice</span>
              </div>
              <p>{error}</p>
              <button
                onClick={() => handleActionClick(activeAction || "explain_concept")}
                className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg text-[11px]"
              >
                Retry Request
              </button>
            </div>
          )}

          {/* Active Copilot Response Screen */}
          {copilotData && !loading && (
            <div className="space-y-4 animate-fade-in">
              {/* Back to actions bar */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <button
                  onClick={() => {
                    setActiveAction(null);
                    setCopilotData(null);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>← All Copilot Actions</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyContent(JSON.stringify(copilotData, null, 2))}
                    className="p-1 rounded text-slate-400 hover:text-slate-600"
                    title="Copy response"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleActionClick(activeAction)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600"
                    title="Regenerate"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title Header */}
              {copilotData.title && (
                <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <span>{copilotData.title}</span>
                </div>
              )}

              {/* 1. HINT MODE VIEW */}
              {copilotData.type === "hint" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 uppercase font-mono">
                      <span>Hint {copilotData.step} of {copilotData.totalSteps}</span>
                      <span>Progressive Clue</span>
                    </div>
                    <p className="font-medium text-slate-800 leading-relaxed text-xs sm:text-sm">
                      {copilotData.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {copilotData.step < 3 ? (
                      <button
                        onClick={handleNextHint}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Give me Hint {copilotData.step + 1} →</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActionClick("step_by_step")}
                        className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                      >
                        <span>Reveal Full Explanation →</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 2. CONCEPT EXPLANATION VIEW */}
              {copilotData.type === "concept" && (
                <div className="space-y-3">
                  {copilotData.sections?.map((sec, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                      <div className="font-bold text-slate-900">{sec.heading}</div>
                      <p className="text-slate-600 leading-relaxed">{sec.body}</p>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleActionClick("shortcut")}
                      className="flex-1 py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs transition"
                    >
                      ⚡ Exam Shortcut
                    </button>
                    <button
                      onClick={handleOpenInTutor}
                      className="flex-1 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold text-xs transition flex items-center justify-center gap-1"
                    >
                      <span>Explain Deeper</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* 3. STEP BY STEP VIEW */}
              {copilotData.type === "step_by_step" && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    {copilotData.steps?.map((st) => (
                      <div key={st.stepNumber} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                        <div className="font-bold text-indigo-700 flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-mono">
                            {st.stepNumber}
                          </span>
                          <span>{st.title}</span>
                        </div>
                        <p className="text-slate-600 pl-5.5 leading-relaxed">{st.detail}</p>
                      </div>
                    ))}
                  </div>

                  {copilotData.conclusion && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900">
                      {copilotData.conclusion}
                    </div>
                  )}
                </div>
              )}

              {/* 4. WHY WRONG ANALYSIS VIEW */}
              {copilotData.type === "why_wrong" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                      <div className="text-[10px] uppercase font-bold text-rose-600">Your Selection</div>
                      <div className="font-extrabold truncate mt-0.5">{copilotData.yourAnswer}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                      <div className="text-[10px] uppercase font-bold text-emerald-600">Correct Option</div>
                      <div className="font-extrabold truncate mt-0.5">{copilotData.correctAnswer}</div>
                    </div>
                  </div>

                  {copilotData.sections?.map((sec, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                      <div className="font-bold text-slate-900">{sec.heading}</div>
                      <p className="text-slate-600 leading-relaxed">{sec.body}</p>
                    </div>
                  ))}

                  <button
                    onClick={handleAddToMistakeBook}
                    className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{inMistakeBook ? "Saved to Mistake Book ✓" : "Add this Question to Mistake Book"}</span>
                  </button>
                </div>
              )}

              {/* 5. EXAM SHORTCUT VIEW */}
              {copilotData.type === "shortcut" && (
                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 space-y-3">
                  <div className="font-bold text-teal-900 text-sm flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-teal-600" />
                    <span>{copilotData.techniqueName}</span>
                  </div>
                  <ul className="space-y-2 text-slate-700">
                    {copilotData.tips?.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-teal-600 font-bold shrink-0">✓</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                  {copilotData.summary && (
                    <div className="pt-2 border-t border-teal-200 text-[11px] text-teal-800 italic">
                      {copilotData.summary}
                    </div>
                  )}
                </div>
              )}

              {/* 6. SIMILAR QUESTION PRACTICE VIEW */}
              {copilotData.type === "similar_question" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 text-xs space-y-3">
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      {copilotData.questionText}
                    </div>

                    <div className="space-y-2">
                      {copilotData.options?.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => setSimilarSelectedOpt(oIdx)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs transition flex items-center gap-2 ${
                            similarSelectedOpt === oIdx
                              ? "bg-blue-600 text-white font-bold border-blue-600 shadow-2xs"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                            similarSelectedOpt === oIdx ? "bg-white text-blue-600" : "bg-slate-100 text-slate-600"
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {!similarEvaluation ? (
                    <button
                      onClick={handleEvaluateSimilar}
                      disabled={similarSelectedOpt === null || evaluatingSimilar}
                      className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition"
                    >
                      {evaluatingSimilar ? "Evaluating..." : "Check My Answer"}
                    </button>
                  ) : (
                    <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      similarEvaluation.isCorrect
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                        : "bg-rose-50 border-rose-200 text-rose-900"
                    }`}>
                      <div className="font-bold flex items-center gap-1.5">
                        {similarEvaluation.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                        <span>{similarEvaluation.message}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {similarEvaluation.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 7. REVISION NOTES VIEW */}
              {copilotData.type === "revision_notes" && (
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-emerald-800">Definition</div>
                    <p className="text-slate-800 font-medium mt-0.5">{copilotData.definition}</p>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-bold text-emerald-800">Key High-Yield Points</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 mt-1">
                      {copilotData.keyPoints?.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  {copilotData.keyFormula && (
                    <div className="p-2.5 rounded-xl bg-white border border-emerald-200 font-mono text-emerald-900 text-xs flex items-center justify-between">
                      <span>Formula: {copilotData.keyFormula}</span>
                      <button
                        onClick={() => handleCopyContent(copilotData.keyFormula)}
                        className="text-slate-400 hover:text-emerald-700"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      handleCopyContent(JSON.stringify(copilotData, null, 2));
                      showToast("Revision note saved to clipboard!");
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                  >
                    Save to Revision Notes
                  </button>
                </div>
              )}

              {/* 8. MINI QUIZ VIEW */}
              {copilotData.type === "mini_quiz" && (
                <div className="space-y-3">
                  {copilotData.questions?.map((q, idx) => {
                    const selected = quizAnswers[idx];
                    return (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                        <div className="font-bold text-slate-900">
                          Q{idx + 1}. {q.text}
                        </div>
                        <div className="space-y-1.5">
                          {q.options?.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => setQuizAnswers({ ...quizAnswers, [idx]: oIdx })}
                              className={`w-full p-2 rounded-lg border text-left text-[11px] transition flex items-center gap-2 ${
                                selected === oIdx
                                  ? "bg-purple-600 text-white font-bold border-purple-600"
                                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <span>{String.fromCharCode(65 + oIdx)}.</span>
                              <span>{opt}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {!quizSubmitted ? (
                    <button
                      onClick={() => {
                        setQuizSubmitted(true);
                        showToast("Quiz evaluated! Check results.");
                      }}
                      disabled={Object.keys(quizAnswers).length < 2}
                      className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition"
                    >
                      Submit Diagnostic Quiz
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-900 text-center">
                      Quiz Complete! Review explanations or continue practicing with Exam Engine.
                    </div>
                  )}
                </div>
              )}

              {/* 9. MODEL EXAM ANSWER VIEW */}
              {copilotData.type === "exam_answer" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 text-xs space-y-3">
                    <div className="font-extrabold text-indigo-900 text-sm">
                      {copilotData.title}
                    </div>
                    {copilotData.structure?.map((sec, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="font-bold text-slate-900">{sec.section}</div>
                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">{sec.content}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCopyContent(JSON.stringify(copilotData.structure, null, 2))}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
                  >
                    Copy Model Answer
                  </button>
                </div>
              )}

              {/* 10. GENERAL / CUSTOM ANSWER VIEW */}
              {copilotData.type === "general" && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-2 whitespace-pre-line leading-relaxed">
                  {copilotData.content}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Bottom Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white shrink-0 space-y-2">
          {/* Quick suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[10px]">
            <button
              onClick={() => handleActionClick("why_wrong", "Why is my choice wrong?")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition"
            >
              Why is my choice wrong?
            </button>
            <button
              onClick={() => handleActionClick("exam_answer", "Give me a 5-mark answer")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition"
            >
              5-Mark Model Answer
            </button>
            <button
              onClick={() => handleActionClick("custom_query", "Dry run this algorithm step by step")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition"
            >
              Dry Run Code
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && userQuery.trim()) {
                  handleActionClick("custom_query", userQuery);
                  setUserQuery("");
                }
              }}
              placeholder="Ask anything about this question..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
            <button
              onClick={() => {
                if (userQuery.trim()) {
                  handleActionClick("custom_query", userQuery);
                  setUserQuery("");
                }
              }}
              disabled={!userQuery.trim() || loading}
              className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition shrink-0 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-[10px] text-center text-slate-400 leading-tight">
            LearnX AI Copilot is an educational companion. Verify critical academic definitions.
          </div>
        </div>
      </div>

      {/* Real AI Interview Full Screen Interactive Modal */}
      <RealAIInterviewModal
        isOpen={realInterviewModalOpen}
        onClose={() => setRealInterviewModalOpen(false)}
        initialContext={{
          subjectName: questionContext?.subjectName || "Computer Networks",
          topicName: questionContext?.topicName || "IP Subnetting & CIDR",
        }}
        onCompleteSession={() => {
          if (onMistakeAdded) onMistakeAdded();
        }}
      />
    </div>
  );
};

export default ExamCopilotDrawer;
