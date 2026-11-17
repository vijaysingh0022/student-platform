import React, { useState, useEffect } from "react";
import {
  Brain,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  Clock,
  Award,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Layers,
  X,
} from "lucide-react";
import {
  startAdaptiveSession,
  getNextAdaptiveQuestion,
  submitAdaptiveAnswer,
  endAdaptiveSession,
} from "../../services/api.js";

const MODE_CONFIG = {
  diagnostic: {
    title: "Smart Diagnostic Test",
    badge: "Full Ability Scan",
    desc: "Starts at calibrated medium difficulty and rapidly zeroes in on your true latent ability level using Item Response Theory.",
    color: "from-blue-600 to-indigo-600",
  },
  weak_topic: {
    title: "Weak Topic Practice",
    badge: "Targeted Remediation",
    desc: "Prioritizes concepts with recent mistakes and low mastery scores to patch critical gaps.",
    color: "from-amber-500 to-orange-600",
  },
  mastery_challenge: {
    title: "Mastery Challenge",
    badge: "High-Caliber Testing",
    desc: "Pushes your limits with Medium-Hard problem sets, testing deep conceptual clarity and edge cases.",
    color: "from-purple-600 to-pink-600",
  },
  interview_prep: {
    title: "Interview Preparation",
    badge: "FAANG / OA Focused",
    desc: "Simulates Tier-1 technical campus recruitment assessments with practical code execution and design MCQs.",
    color: "from-emerald-600 to-teal-600",
  },
  exam_prep: {
    title: "Exam Preparation",
    badge: "University / GATE",
    desc: "Focuses on high-frequency previous exam concepts, analytical rigor, and core curriculum theory.",
    color: "from-sky-600 to-blue-700",
  },
};

export const AdaptiveAssessmentModal = ({
  subject = "DSA",
  initialMode = "diagnostic",
  targetQuestionCount = 10,
  targetTopics = [],
  onClose,
  onSessionComplete,
}) => {
  // Session lifecycle states: 'loading', 'question', 'feedback', 'summary', 'error'
  const [stage, setStage] = useState("loading");
  const [sessionId, setSessionId] = useState(null);
  const [sessionMeta, setSessionMeta] = useState(null);

  // Question state
  const [currentQData, setCurrentQData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Answer feedback
  const [feedback, setFeedback] = useState(null);

  // Final summary evaluation
  const [summary, setSummary] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Timer for active question
  useEffect(() => {
    let interval = null;
    if (stage === "question") {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stage]);

  // Start session on mount
  useEffect(() => {
    let isMounted = true;
    const initSession = async () => {
      try {
        setStage("loading");
        const res = await startAdaptiveSession({
          subject,
          mode: initialMode,
          targetQuestionCount,
          targetTopics,
        });

        if (res.data?.success && isMounted) {
          const sid = res.data.session._id;
          setSessionId(sid);
          setSessionMeta(res.data.session);
          await loadNextQuestion(sid);
        }
      } catch (err) {
        console.error("Failed to start adaptive session:", err);
        if (isMounted) {
          setErrorMsg(err.response?.data?.message || err.message || "Failed to initialize session");
          setStage("error");
        }
      }
    };

    initSession();
    return () => {
      isMounted = false;
    };
  }, [subject, initialMode]);

  // Load next adaptive question
  const loadNextQuestion = async (sid = sessionId) => {
    try {
      setStage("loading");
      setSelectedOption(null);
      setFeedback(null);
      setShowHint(false);
      setTimerSeconds(0);

      const res = await getNextAdaptiveQuestion({ sessionId: sid });
      if (res.data?.isCompleted) {
        // Complete the session
        await finalizeSession(sid);
        return;
      }

      if (res.data?.success && res.data?.question) {
        setCurrentQData(res.data);
        setStage("question");
      } else {
        await finalizeSession(sid);
      }
    } catch (err) {
      console.error("Error loading next adaptive question:", err);
      setErrorMsg("Failed to retrieve next question.");
      setStage("error");
    }
  };

  // Submit current answer
  const handleSubmitAnswer = async () => {
    if (selectedOption === null || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const res = await submitAdaptiveAnswer({
        sessionId,
        questionId: currentQData.question._id,
        questionText: currentQData.question.questionText,
        selectedOptionIndex: selectedOption,
        timeTakenSeconds: timerSeconds,
        selectionReason: currentQData.selectionReason || "",
      });

      if (res.data?.success) {
        setFeedback(res.data);
        setStage("feedback");
      }
    } catch (err) {
      console.error("Failed to submit adaptive answer:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Finalize session and retrieve explainable feedback
  const finalizeSession = async (sid = sessionId) => {
    try {
      setStage("loading");
      const res = await endAdaptiveSession({ sessionId: sid });
      if (res.data?.success) {
        setSummary(res.data);
        setStage("summary");
        if (onSessionComplete) onSessionComplete(res.data);
      }
    } catch (err) {
      console.error("Failed to finalize session:", err);
      setErrorMsg("Failed to finalize assessment evaluation.");
      setStage("error");
    }
  };

  const modeInfo = MODE_CONFIG[initialMode] || MODE_CONFIG.diagnostic;

  const getDifficultyBadge = (diff = "medium") => {
    if (diff === "easy") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
          Easy
        </span>
      );
    }
    if (diff === "hard") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-rose-50 text-rose-700 border border-rose-200">
          Hard
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-200">
        Medium
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                  {modeInfo.title}
                </h2>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                  {subject}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500">
                {modeInfo.badge} • Item Response Theory (IRT) Calibrated
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {stage === "question" && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{timerSeconds}s</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {stage === "loading" && (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-700">Calibrating next optimal question...</p>
              <p className="text-xs text-slate-400">Balancing difficulty, topic mastery, and discrimination factors</p>
            </div>
          )}

          {stage === "error" && (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Session Error</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">{errorMsg}</p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Close Assessment
              </button>
            </div>
          )}

          {/* ACTIVE QUESTION VIEW */}
          {stage === "question" && currentQData && (
            <div className="space-y-6">
              {/* Question Progress & Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900">
                    Question {currentQData.questionNumber} of {currentQData.totalQuestions}
                  </span>
                  <span>•</span>
                  <span className="text-xs font-bold text-slate-500">{currentQData.question.topic}</span>
                  {getDifficultyBadge(currentQData.question.difficulty)}
                </div>

                {/* Adaptive Reason pill */}
                {currentQData.selectionReason && (
                  <div className="text-[11px] font-medium text-indigo-700 bg-indigo-50/70 border border-indigo-100 rounded-lg px-2.5 py-1">
                    <span className="font-bold">AI Reason: </span>
                    {currentQData.selectionReason}
                  </div>
                )}
              </div>

              {/* Question Text */}
              <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-200/80">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                  {currentQData.question.questionText}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQData.question.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const letter = String.fromCharCode(65 + idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 group ${
                        isSelected
                          ? "bg-blue-50/80 border-blue-500 text-blue-950 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-800"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                        }`}
                      >
                        {letter}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold flex-1 leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Hint accordian */}
              {currentQData.question.hint && (
                <div className="pt-1">
                  {!showHint ? (
                    <button
                      onClick={() => setShowHint(true)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Need a hint?</span>
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                      <span className="font-bold">Hint: </span>
                      {currentQData.question.hint}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* FEEDBACK VIEW (Explainable Outcome) */}
          {stage === "feedback" && feedback && (
            <div className="space-y-6">
              {/* Correctness Banner */}
              <div
                className={`p-5 rounded-2xl border flex items-start gap-4 ${
                  feedback.isCorrect
                    ? "bg-emerald-50/90 border-emerald-200 text-emerald-950"
                    : "bg-rose-50/90 border-rose-200 text-rose-950"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    feedback.isCorrect
                      ? "bg-emerald-600 text-white"
                      : "bg-rose-600 text-white"
                  }`}
                >
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black">
                    {feedback.isCorrect ? "Correct! Excellent recall." : "Incorrect Answer"}
                  </h3>
                  <p className="text-xs font-semibold leading-relaxed">
                    {feedback.isCorrect
                      ? "Your concept foundation on this topic was validated by the algorithm."
                      : feedback.misconception || "You misunderstood the foundational rule behind this problem."}
                  </p>
                </div>
              </div>

              {/* Detail explanation */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500 uppercase tracking-wider">Concept Evaluated</span>
                  <span className="text-slate-800 font-extrabold">{feedback.conceptEvaluated}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {feedback.explanation}
                </p>
              </div>

              {/* Dynamic Calibration Shift */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-black text-indigo-950 block">Next Question Calibrated Level</span>
                  <span className="text-indigo-700 font-medium">
                    {feedback.isCorrect
                      ? "Raising problem difficulty to test depth."
                      : "Adjusting difficulty to reinforce core knowledge."}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold">New Target:</span>
                  {getDifficultyBadge(feedback.nextDifficulty)}
                </div>
              </div>
            </div>
          )}

          {/* FINAL SUMMARY VIEW */}
          {stage === "summary" && summary && (
            <div className="space-y-6">
              {/* Summary Hero */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                      Assessment Complete
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-300">
                    +{summary.session?.xpAwarded || 150} XP Awarded
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                    <span className="text-[10px] text-slate-300 font-bold block uppercase">Accuracy</span>
                    <span className="text-xl sm:text-2xl font-black text-white">{summary.session?.accuracy}%</span>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                    <span className="text-[10px] text-slate-300 font-bold block uppercase">Mastery Index</span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-400">{summary.session?.masteryPercentage}%</span>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                    <span className="text-[10px] text-slate-300 font-bold block uppercase">IRT Theta</span>
                    <span className="text-xl sm:text-2xl font-black text-amber-300">
                      {(summary.session?.currentTheta || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                    <span className="text-[10px] text-slate-300 font-bold block uppercase">Avg Speed</span>
                    <span className="text-xl sm:text-2xl font-black text-white">{summary.session?.speedAvgSeconds}s</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {summary.session?.aiSummaryFeedback}
                </p>
              </div>

              {/* Topic Mastery Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Concept Mastery Breakdown
                </h4>
                <div className="space-y-2">
                  {(summary.session?.topicMasteryBreakdown || []).map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 truncate block">{t.topic}</span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {t.correctCount}/{t.attemptsCount} Correct • Status:{" "}
                          <strong className={t.status === "mastered" ? "text-emerald-600" : "text-amber-600"}>
                            {t.status.replace("_", " ")}
                          </strong>
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-slate-900">{t.masteryScore}%</span>
                        <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              t.masteryScore >= 75 ? "bg-emerald-500" : t.masteryScore >= 50 ? "bg-amber-500" : "bg-rose-500"
                            }`}
                            style={{ width: `${t.masteryScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Misunderstandings and Remediation */}
              {(summary.session?.misunderstandingAnalysis || []).length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Diagnosed Misconceptions & Recommended Remediation
                  </h4>
                  <div className="space-y-2">
                    {summary.session.misunderstandingAnalysis.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-rose-800">{item.concept}</span>
                          <span className="text-[10px] font-bold text-rose-600 uppercase">Gap Identified</span>
                        </div>
                        <p className="text-slate-600">{item.misunderstanding}</p>
                        <p className="text-indigo-700 font-bold pt-1">
                          Action: {item.recommendedAction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          {stage === "question" && (
            <>
              <button
                onClick={() => finalizeSession()}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                End Test Early
              </button>
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null || isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>{isSubmitting ? "Validating..." : "Submit Answer"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {stage === "feedback" && (
            <div className="w-full flex justify-end">
              <button
                onClick={() => loadNextQuestion()}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>Continue to Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {stage === "summary" && (
            <div className="w-full flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs"
              >
                Close & View Analytics
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdaptiveAssessmentModal;

