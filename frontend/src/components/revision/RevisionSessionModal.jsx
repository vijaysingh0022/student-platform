import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Brain,
  HelpCircle,
  Clock,
  Layers,
  ChevronRight,
  Award,
} from "lucide-react";
import { getTopicRevisionSession, submitRevisionSession } from "../../services/api.js";

export const RevisionSessionModal = ({ topicId, onClose, onSessionComplete }) => {
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [activeStep, setActiveStep] = useState("flashcards"); // "flashcards" | "mcqs" | "recall" | "rating" | "summary"

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // MCQs state
  const [currentMcqIndex, setCurrentMcqIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isMcqSubmitted, setIsMcqSubmitted] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState([]);

  // Recall state
  const [recallInput, setRecallInput] = useState("");
  const [showRecallHint, setShowRecallHint] = useState(false);
  const [isRecallRevealed, setIsRecallRevealed] = useState(false);

  // Final performance rating (0-5)
  const [rating, setRating] = useState(4);
  const [submitting, setSubmitting] = useState(false);
  const [completionResult, setCompletionResult] = useState(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        const res = await getTopicRevisionSession(topicId);
        if (res?.data?.session) {
          setSessionData(res.data.session);
        }
      } catch (err) {
        console.warn("Failed to load revision session:", err);
      } finally {
        setLoading(false);
      }
    };
    if (topicId) loadSession();
  }, [topicId]);

  if (!topicId) return null;

  // Handler for MCQ selection
  const handleSelectOption = (idx) => {
    if (isMcqSubmitted) return;
    setSelectedOption(idx);
  };

  const handleCheckMcq = () => {
    if (selectedOption === null) return;
    const currentQuestion = sessionData.mcqs[currentMcqIndex];
    const isCorrect = selectedOption === currentQuestion.correctIndex;

    const answerRecord = {
      questionText: currentQuestion.question,
      userAnswer: currentQuestion.options[selectedOption],
      correctAnswer: currentQuestion.options[currentQuestion.correctIndex],
      explanation: currentQuestion.explanation,
      isCorrect,
    };

    setMcqAnswers((prev) => [...prev, answerRecord]);
    setIsMcqSubmitted(true);
  };

  const handleNextMcq = () => {
    if (currentMcqIndex + 1 < (sessionData?.mcqs?.length || 0)) {
      setCurrentMcqIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsMcqSubmitted(false);
    } else {
      setActiveStep("recall");
    }
  };

  // Submit complete session to server
  const handleFinalSubmit = async (selectedRating) => {
    setSubmitting(true);
    const finalRating = selectedRating !== undefined ? selectedRating : rating;
    const correctMcqs = mcqAnswers.filter((a) => a.isCorrect).length;
    const totalQuestions = (sessionData?.mcqs?.length || 0) + 1;

    try {
      const payload = {
        topicId: sessionData.topicId,
        sessionId: sessionData.sessionId,
        score: correctMcqs + (finalRating >= 3 ? 1 : 0),
        totalQuestions,
        performanceRating: finalRating,
        answers: mcqAnswers,
      };
      const res = await submitRevisionSession(payload);
      if (res?.data?.success) {
        setCompletionResult(res.data);
        setActiveStep("summary");
        if (onSessionComplete) onSessionComplete(res.data);
      }
    } catch (err) {
      console.warn("Error submitting revision session:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                  AI Spaced Repetition Session
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-extrabold">
                  {sessionData?.subjectName || "Core CSE"}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 truncate max-w-sm sm:max-w-md">
                {sessionData?.topicTitle || "Active Topic Recall"}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-8 h-8 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
              <p className="text-xs font-bold text-slate-600">Loading AI Spaced Revision Session...</p>
            </div>
          ) : (
            <>
              {/* Stepper Tabs */}
              {activeStep !== "summary" && (
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs font-bold">
                  <div
                    className={`flex items-center gap-1.5 ${
                      activeStep === "flashcards" ? "text-indigo-600 font-extrabold" : "text-slate-400"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">1</span>
                    <span>Flashcards</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                  <div
                    className={`flex items-center gap-1.5 ${
                      activeStep === "mcqs" ? "text-indigo-600 font-extrabold" : "text-slate-400"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">2</span>
                    <span>Diagnostic MCQs</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                  <div
                    className={`flex items-center gap-1.5 ${
                      activeStep === "recall" || activeStep === "rating" ? "text-indigo-600 font-extrabold" : "text-slate-400"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">3</span>
                    <span>Active Recall</span>
                  </div>
                </div>
              )}

              {/* ── STEP 1: FLASHCARDS ─────────────────────────────────── */}
              {activeStep === "flashcards" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>
                      Card {currentCardIndex + 1} of {sessionData?.cards?.length || 1}
                    </span>
                    <span className="text-indigo-600 font-bold">Click card to reveal answer</span>
                  </div>

                  {/* Flippable Flashcard Container */}
                  <div
                    onClick={() => setIsFlipped((prev) => !prev)}
                    className="min-h-[220px] rounded-3xl p-6 sm:p-8 cursor-pointer border-2 transition-all flex flex-col justify-between shadow-sm relative overflow-hidden"
                    style={{
                      backgroundColor: isFlipped ? "#f8fafc" : "#ffffff",
                      borderColor: isFlipped ? "#c7d2fe" : "#e2e8f0",
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase">
                          {sessionData?.cards?.[currentCardIndex]?.category || "Concept Recall"}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          {isFlipped ? "Answer" : "Question Prompt"}
                        </span>
                      </div>

                      <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-relaxed">
                        {isFlipped
                          ? sessionData?.cards?.[currentCardIndex]?.back
                          : sessionData?.cards?.[currentCardIndex]?.front}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>{isFlipped ? "Tap to flip back" : "Tap to flip"}</span>
                      <RotateCcw className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Card Navigation */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        if (currentCardIndex > 0) {
                          setCurrentCardIndex((prev) => prev - 1);
                          setIsFlipped(false);
                        }
                      }}
                      disabled={currentCardIndex === 0}
                      className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {currentCardIndex + 1 < (sessionData?.cards?.length || 0) ? (
                      <button
                        onClick={() => {
                          setCurrentCardIndex((prev) => prev + 1);
                          setIsFlipped(false);
                        }}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                      >
                        Next Card
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveStep("mcqs")}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs flex items-center gap-1.5"
                      >
                        <span>Continue to MCQs</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ── STEP 2: DIAGNOSTIC MCQS ─────────────────────────────── */}
              {activeStep === "mcqs" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>
                      Question {currentMcqIndex + 1} of {sessionData?.mcqs?.length || 1}
                    </span>
                    <span className="text-purple-600 font-bold">Fast Retrieval Test</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-sm font-extrabold text-slate-900 leading-relaxed">
                    {sessionData?.mcqs?.[currentMcqIndex]?.question}
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {sessionData?.mcqs?.[currentMcqIndex]?.options?.map((opt, oIdx) => {
                      const isSelected = selectedOption === oIdx;
                      const isCorrect = oIdx === sessionData.mcqs[currentMcqIndex].correctIndex;

                      let btnStyle = "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-800";
                      if (isMcqSubmitted) {
                        if (isCorrect) {
                          btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
                        } else if (isSelected) {
                          btnStyle = "border-rose-400 bg-rose-50 text-rose-950 font-bold";
                        } else {
                          btnStyle = "border-slate-200 bg-white opacity-50";
                        }
                      } else if (isSelected) {
                        btnStyle = "border-indigo-500 bg-indigo-50/80 text-indigo-950 font-bold ring-2 ring-indigo-200";
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(oIdx)}
                          className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation feedback */}
                  {isMcqSubmitted && (
                    <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-xs text-indigo-950 space-y-1">
                      <span className="font-extrabold uppercase tracking-wider text-[10px] text-indigo-700 block">
                        Explanation
                      </span>
                      <p>{sessionData?.mcqs?.[currentMcqIndex]?.explanation}</p>
                    </div>
                  )}

                  {/* MCQ Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    {!isMcqSubmitted ? (
                      <button
                        onClick={handleCheckMcq}
                        disabled={selectedOption === null}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-xs"
                      >
                        Verify Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNextMcq}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs flex items-center gap-1.5"
                      >
                        <span>
                          {currentMcqIndex + 1 < (sessionData?.mcqs?.length || 0) ? "Next Question" : "Continue to Active Recall"}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ── STEP 3: ACTIVE RECALL CHALLENGE ─────────────────────── */}
              {activeStep === "recall" && (
                <div className="space-y-5">
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block">
                      Active Recall Challenge
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 leading-relaxed">
                      {sessionData?.recallQuestion?.prompt}
                    </h4>
                  </div>

                  {/* Textarea for self-explanation */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Type your mental model / key steps:</label>
                    <textarea
                      value={recallInput}
                      onChange={(e) => setRecallInput(e.target.value)}
                      placeholder="e.g. The core mechanism works by partitioning elements around a pivot..."
                      rows={4}
                      className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  {/* Hint Toggle */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setShowRecallHint((prev) => !prev)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{showRecallHint ? "Hide Hint" : "Show Hint"}</span>
                    </button>

                    <button
                      onClick={() => setIsRecallRevealed(true)}
                      className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      Reveal Expected Keypoints
                    </button>
                  </div>

                  {showRecallHint && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      💡 <strong>Hint:</strong> {sessionData?.recallQuestion?.hint}
                    </div>
                  )}

                  {isRecallRevealed && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                        Expected Academic Keypoints
                      </span>
                      <ul className="space-y-1 text-xs text-emerald-950">
                        {sessionData?.recallQuestion?.expectedKeypoints?.map((kp, kIdx) => (
                          <li key={kIdx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{kp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-end pt-3">
                    <button
                      onClick={() => setActiveStep("rating")}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs flex items-center gap-1.5"
                    >
                      <span>Rate Recall Effort</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 4: SELF PERFORMANCE RATING (SM-2 Rating 0-5) ──── */}
              {activeStep === "rating" && (
                <div className="space-y-5">
                  <div className="text-center space-y-1">
                    <h4 className="text-base font-black text-slate-900">How effortless was your recall?</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      The AI Spaced Repetition engine adapts your next review interval using your honesty.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      {
                        r: 5,
                        label: "Effortless (Perfect Recall)",
                        desc: "Instant, confident recall. Expands interval significantly.",
                        color: "border-emerald-200 hover:border-emerald-500 bg-emerald-50/50",
                      },
                      {
                        r: 4,
                        label: "Good (Correct after hesitation)",
                        desc: "Remembered well with minor pause. Expands interval.",
                        color: "border-blue-200 hover:border-blue-500 bg-blue-50/50",
                      },
                      {
                        r: 3,
                        label: "Hard (Recalled with serious difficulty)",
                        desc: "Struggled but got it right. Increments interval slightly.",
                        color: "border-amber-200 hover:border-amber-500 bg-amber-50/50",
                      },
                      {
                        r: 1,
                        label: "Forgot (Need urgent review)",
                        desc: "Blackout or wrong answers. Resets interval to 1 day.",
                        color: "border-rose-200 hover:border-rose-500 bg-rose-50/50",
                      },
                    ].map((opt) => (
                      <button
                        key={opt.r}
                        onClick={() => handleFinalSubmit(opt.r)}
                        disabled={submitting}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${opt.color} group hover:shadow-xs`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">{opt.label}</span>
                          <span className="text-xs font-bold text-slate-400">Score {opt.r}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
                          {opt.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 5: SESSION COMPLETION SUMMARY ─────────────────── */}
              {activeStep === "summary" && completionResult && (
                <div className="py-6 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                    <Award className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                      Revision Completed
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">Memory Consolidated!</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Your memory stability for <strong className="text-slate-800">{sessionData?.topicTitle}</strong> has been reinforced.
                    </p>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-center">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Next Review</span>
                      <span className="text-base font-black text-indigo-600 mt-1 block">
                        +{completionResult.intervalDays} Days
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-center">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Retention</span>
                      <span className="text-base font-black text-emerald-600 mt-1 block">
                        {completionResult.retentionScore}%
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-center">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">XP Earned</span>
                      <span className="text-base font-black text-purple-600 mt-1 block">+40 XP</span>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    Return to Revision Dashboard
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevisionSessionModal;
