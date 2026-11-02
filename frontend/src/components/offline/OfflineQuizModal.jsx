import React, { useState, useEffect } from "react";
import { offlineDB } from "../../services/indexedDBService.js";
import { useOffline } from "../../context/OfflineContext.jsx";

const OfflineQuizModal = ({ isOpen, onClose, initialSubject = "Data Structures & Algorithms", initialUnit = "Trees", initialDifficulty = "Medium", initialCount = 5 }) => {
  const { queueOfflineTest, isOnline } = useOffline();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const loadQuestions = async () => {
      setLoading(true);
      const allQ = await offlineDB.getQuestions(initialSubject);
      // Filter by unit if available, or fall back to all
      const filtered = allQ.filter(
        (q) => !initialUnit || q.unit?.toLowerCase() === initialUnit.toLowerCase()
      );
      const pool = filtered.length >= initialCount ? filtered : allQ;
      const selected = pool.slice(0, initialCount);

      setQuestions(selected);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setShowExplanation(false);
      setSubmitted(false);
      setScore(0);
      setLoading(false);
    };

    loadQuestions();
  }, [isOpen, initialSubject, initialUnit, initialCount]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleSelectAnswer = (optIndex) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

  const handleFinishQuiz = async () => {
    let correct = 0;
    const topicBreakdown = {};

    questions.forEach((q, idx) => {
      const userAns = selectedAnswers[idx];
      const isCorrect = userAns === q.correctAnswerIndex;
      if (isCorrect) correct++;

      const unitName = q.unit || "General";
      if (!topicBreakdown[unitName]) topicBreakdown[unitName] = { correct: 0, total: 0 };
      topicBreakdown[unitName].total++;
      if (isCorrect) topicBreakdown[unitName].correct++;
    });

    const scorePercent = Math.round((correct / (questions.length || 1)) * 100);
    setScore(scorePercent);
    setSubmitted(true);

    // Save completely offline into IndexedDB sync queue
    await queueOfflineTest({
      subject: initialSubject,
      unit: initialUnit,
      totalQuestions: questions.length,
      correctAnswers: correct,
      scorePercent,
      topicBreakdown,
      completedAt: new Date().toISOString(),
      offlineAttemptId: `off_quiz_${Date.now()}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/20 text-white text-base">🎯</span>
            <div>
              <h3 className="text-base font-bold text-white">Offline Quiz Arena</h3>
              <p className="text-xs text-blue-100 font-medium">
                {initialSubject} • {initialUnit} • {!isOnline ? "🔴 Offline Engine" : "🟢 Evaluated Locally"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              <span className="inline-block animate-spin mr-2">⚙️</span>
              Loading offline question bank...
            </div>
          ) : submitted ? (
            /* Results Screen */
            <div className="text-center py-6 space-y-5">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border-4 border-emerald-500 flex items-center justify-center text-3xl font-extrabold text-emerald-600 shadow-inner">
                {score}%
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-slate-900">
                  {score >= 80 ? "Mastery Demonstrated!" : score >= 50 ? "Solid Attempt!" : "Keep Practicing!"}
                </h4>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Your answers were evaluated locally on your device. The result has been added to your local sync queue and will automatically synchronize with your student profile.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs font-semibold text-slate-700 max-w-md mx-auto">
                <div className="flex justify-between pb-1 border-b border-slate-200">
                  <span>Subject:</span>
                  <span className="text-slate-900 font-bold">{initialSubject}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-200">
                  <span>Unit:</span>
                  <span className="text-slate-900 font-bold">{initialUnit}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-200">
                  <span>Correct Answers:</span>
                  <span className="text-emerald-700 font-bold">
                    {Math.round((score / 100) * questions.length)} / {questions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sync Status:</span>
                  <span className={isOnline ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                    {isOnline ? "✓ Auto-synced with server" : "☁️ Saved in Offline Queue"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setCurrentIndex(0);
                    setSelectedAnswers({});
                    setShowExplanation(false);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
                >
                  Return to Hub
                </button>
              </div>
            </div>
          ) : currentQ ? (
            /* Active Question Screen */
            <div className="space-y-6">
              {/* Question progress pill */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>
                  Question <strong className="text-slate-900">{currentIndex + 1}</strong> of {questions.length}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-100">
                  {currentQ.difficulty || initialDifficulty}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question text */}
              <h4 className="text-base font-bold text-slate-900 leading-snug">
                {currentQ.questionText}
              </h4>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options?.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectAnswer(optIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs font-medium transition-all flex items-start gap-3 ${
                        isSelected
                          ? "bg-blue-50/80 border-blue-500 text-blue-900 shadow-sm ring-1 ring-blue-500/30"
                          : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50/80 hover:border-slate-300"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600 border border-slate-300"
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation toggle */}
              {showExplanation && currentQ.explanation && (
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-1 animate-fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-indigo-800">
                    <span>💡</span> Explanation
                  </div>
                  <p className="leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs">
              No questions found for this topic in the offline pack.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!submitted && questions.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              {showExplanation ? "Hide Explanation" : "Reveal Explanation"}
            </button>

            <div className="flex gap-2.5">
              {currentIndex > 0 && (
                <button
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-white transition-colors"
                >
                  Previous
                </button>
              )}
              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => {
                    setCurrentIndex((prev) => prev + 1);
                    setShowExplanation(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleFinishQuiz}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Submit Offline Quiz
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineQuizModal;
