import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getTopicQuizQuestions, submitTopicQuizAnswers } from "../services/api.js";
import { useAppState } from "../context/AppStateContext.jsx";

const TopicQuizPage = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();
  const { onTopicQuizSubmitted } = useAppState();

  const [questionCount, setQuestionCount] = useState(10);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Fetch questions
  const fetchQuestions = async (count = questionCount) => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    setCurrentIdx(0);
    setTimerSeconds(0);

    try {
      const res = await getTopicQuizQuestions(topicId, count);
      setQuizData(res.data);
    } catch (err) {
      console.error("Error loading topic quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(questionCount);
  }, [topicId, questionCount]);

  // Timer interval
  useEffect(() => {
    if (loading || result) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, result]);

  const handleSelectOption = (questionId, optionIdx) => {
    if (result) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleSubmitQuiz = async () => {
    const questions = quizData?.questions || [];
    const answeredCount = Object.keys(answers).length;

    if (answeredCount < questions.length) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${questions.length} questions. Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    try {
      const res = await submitTopicQuizAnswers(topicId, {
        answers,
        timeTakenSeconds: timerSeconds,
      });
      setResult(res.data);
      onTopicQuizSubmitted(topicId, subjectId, res.data);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Failed to evaluate quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAskTutor = () => {
    if (!result) return;
    const weakList = result.weakConcepts?.length > 0 ? result.weakConcepts.join(", ") : result.topicTitle;
    const prompt = `I just completed a practice quiz on ${result.topicTitle} in ${subjectId.toUpperCase()} with a mastery score of ${result.accuracyPercent}%. I struggled specifically with: ${weakList}. Can you explain these concepts simply and provide guidance to master them?`;
    navigate(`/tutor?q=${encodeURIComponent(prompt)}&subject=${encodeURIComponent(subjectId.toUpperCase())}`);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-600">Loading topic quiz questions...</p>
      </div>
    );
  }

  const questions = quizData?.questions || [];
  const currentQ = questions[currentIdx];
  const totalQ = questions.length;
  const answeredCount = Object.keys(answers).length;

  // ─── 1. PERFORMANCE ANALYSIS RESULT VIEW ─────────────────────────────────
  if (result) {
    const isStrong = result.masteryStatus === "strong";
    const isNeedsPractice = result.masteryStatus === "needs_practice";
    const isWeak = result.masteryStatus === "weak";

    return (
      <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Link to="/learn" className="hover:text-violet-600">
              All Subjects
            </Link>
            <span>/</span>
            <Link to={`/learn/${subjectId}`} className="hover:text-violet-600">
              {subjectId.toUpperCase()}
            </Link>
            <span>/</span>
            <Link to={`/learn/${subjectId}/${topicId}`} className="hover:text-violet-600">
              {result.topicTitle}
            </Link>
            <span>/</span>
            <span className="text-slate-900">Performance Report</span>
          </div>

          {/* Performance Hero Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border ${
                      isStrong
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : isNeedsPractice
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-rose-100 text-rose-800 border-rose-200"
                    }`}
                  >
                    {isStrong ? "🟢 Strong Mastery" : isNeedsPractice ? "🟡 Needs Practice" : "🔴 Weak Topic Detected"}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    ⏱️ Time: {formatTime(result.timeTakenSeconds || 0)}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {result.topicTitle} Analysis
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
                  {result.recommendedAction}
                </p>
              </div>

              {/* Circular Score Visualizer */}
              <div className="flex-shrink-0 flex items-center justify-center">
                <div
                  className="w-28 h-28 rounded-full flex flex-col items-center justify-center font-black"
                  style={{
                    background: `conic-gradient(${
                      isStrong ? "#10b981" : isNeedsPractice ? "#f59e0b" : "#ef4444"
                    } ${result.accuracyPercent * 3.6}deg, #f1f5f9 0deg)`,
                    boxShadow: `0 0 20px ${
                      isStrong ? "rgba(16,185,129,0.2)" : isNeedsPractice ? "rgba(245,158,11,0.2)" : "rgba(239,68,68,0.2)"
                    }`,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  <div className="w-22 h-22 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                    <span className="text-2xl font-black text-slate-900 leading-none">
                      {result.accuracyPercent}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                      {result.correctCount}/{result.totalQuestions} Correct
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Four Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
              <Link
                to={`/learn/${subjectId}/${topicId}`}
                className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs text-center flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>📖 Revise Topic</span>
              </Link>

              <button
                onClick={() => fetchQuestions(questionCount)}
                className="p-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black text-xs text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>📝 Practice Again</span>
              </button>

              <button
                onClick={handleAskTutor}
                className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs text-center flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <span>🤖 Ask AI Tutor</span>
              </button>

              <Link
                to={`/roadmap/${subjectId}`}
                state={{ autoRoadmap: true, weakTopics: result.weakConcepts || [result.topicTitle] }}
                className="p-3 rounded-2xl btn-gradient text-white font-black text-xs text-center flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>🗺️ AI 7-Day Roadmap</span>
              </Link>
            </div>
          </div>

          {/* Subtopic / Concept Diagnostic Breakdown */}
          {result.subtopicBreakdown && Object.keys(result.subtopicBreakdown).length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>🎯</span>
                <span>Concept-by-Concept Diagnostic Breakdown</span>
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {Object.entries(result.subtopicBreakdown).map(([concept, data], cIdx) => {
                  const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                  const isConceptWeak = pct < 60;

                  return (
                    <div key={cIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800 font-black">{concept}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            isConceptWeak
                              ? "bg-rose-100 text-rose-700 border border-rose-200"
                              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {pct}% ({data.correct}/{data.total})
                        </span>
                      </div>

                      <div className="h-2 rounded-full overflow-hidden bg-slate-200">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            background: pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question-by-Question Review */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>📋</span>
              <span>Detailed Question Review</span>
            </h3>

            <div className="space-y-4">
              {result.detailedResults.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border ${
                    item.isCorrect ? "bg-emerald-50/30 border-emerald-200" : "bg-rose-50/30 border-rose-200"
                  } space-y-3`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Question #{idx + 1} • {item.subtopic}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                        {item.questionText}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-black flex-shrink-0 ${
                        item.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {item.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {item.options.map((opt, oIdx) => {
                      const isSelected = Number(item.selectedAnswerIndex) === oIdx;
                      const isCorrectAnswer = item.correctAnswerIndex === oIdx;

                      return (
                        <div
                          key={oIdx}
                          className={`p-3 rounded-xl border font-medium ${
                            isCorrectAnswer
                              ? "bg-emerald-100/80 border-emerald-300 text-emerald-900 font-bold"
                              : isSelected
                              ? "bg-rose-100/80 border-rose-300 text-rose-900 line-through"
                              : "bg-white border-slate-200 text-slate-600"
                          }`}
                        >
                          <span className="font-bold mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Note */}
                  {item.explanation && (
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      <strong className="text-violet-700 block mb-0.5">💡 Explanation:</strong>
                      {item.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── 2. ACTIVE QUIZ TAKING INTERFACE ─────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="text-4xl">📝</div>
        <h2 className="text-xl font-bold text-slate-900">No Questions Found for this Topic</h2>
        <p className="text-xs text-slate-500 max-w-sm">Generating new AI assessment questions for {topicId}...</p>
        <Link to={`/learn/${subjectId}/${topicId}`} className="btn-gradient px-4 py-2 rounded-xl text-xs font-bold text-white">
          Back to Topic Content
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Breadcrumb & Question Count Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Link to={`/learn/${subjectId}/${topicId}`} className="hover:text-violet-600">
              ← Back to {quizData.topicTitle}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Questions:</span>
            {[5, 10, 15].map((cnt) => (
              <button
                key={cnt}
                onClick={() => setQuestionCount(cnt)}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                  questionCount === cnt
                    ? "bg-violet-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cnt} Qs
              </button>
            ))}
          </div>
        </div>

        {/* Quiz Progress & Timer Header */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wide">
              {quizData.topicTitle} Quiz
            </div>
            <div className="text-sm font-black text-slate-900">
              Question {currentIdx + 1} of {totalQ}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-black font-mono">
              ⏱️ {formatTime(timerSeconds)}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-violet-50 text-violet-700 border border-violet-200 text-xs font-black">
              {answeredCount}/{totalQ} Answered
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="h-2 rounded-full overflow-hidden bg-slate-200">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / totalQ) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        {currentQ && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-violet-100 text-violet-800 border border-violet-200">
                  {currentQ.subtopic || "Core Concept"}
                </span>
                <span className="text-xs font-semibold text-slate-400 capitalize">
                  • {currentQ.difficulty || "medium"} difficulty
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-relaxed">
                {currentQ.questionText}
              </h3>
            </div>

            {/* 4 Interactive Options */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((option, oIdx) => {
                const isSelected = answers[currentQ._id] === oIdx;

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(currentQ._id, oIdx)}
                    className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all duration-200 flex items-start gap-3.5 ${
                      isSelected
                        ? "bg-violet-50 border-violet-500 text-violet-900 ring-2 ring-violet-500/20 shadow-xs"
                        : "bg-slate-50/50 hover:bg-slate-100/60 border-slate-200 text-slate-700"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 border ${
                        isSelected
                          ? "bg-violet-600 text-white border-violet-600"
                          : "bg-white text-slate-600 border-slate-300"
                      }`}
                    >
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Question Navigation Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-2">
                {currentIdx < totalQ - 1 ? (
                  <button
                    onClick={() => setCurrentIdx((p) => Math.min(totalQ - 1, p + 1))}
                    className="btn-gradient px-5 py-2 rounded-xl text-xs font-black text-white shadow-xs"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={submitting}
                    className="px-6 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all active:scale-95"
                  >
                    {submitting ? "Evaluating..." : "✓ Submit Assessment"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Jump Question Grid */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-center gap-2 flex-wrap">
          {questions.map((q, qIdx) => {
            const isAnswered = answers[q._id] !== undefined;
            const isCurrent = currentIdx === qIdx;

            return (
              <button
                key={q._id}
                onClick={() => setCurrentIdx(qIdx)}
                className={`w-7 h-7 rounded-lg text-xs font-black transition-all ${
                  isCurrent
                    ? "bg-slate-900 text-white ring-2 ring-slate-900/30"
                    : isAnswered
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {qIdx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopicQuizPage;
