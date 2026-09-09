import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api.js";
import { LearnXIcon } from "../components/LearnXLogo.jsx";

const PLACEMENT_TRACKS = [
  { id: "DSA", name: "Data Structures & Algorithms", shortName: "DSA", icon: "⚡", questionsCount: 12, tag: "Top Priority", color: "from-blue-600 to-indigo-600" },
  { id: "DBMS", name: "Database Systems & SQL", shortName: "DBMS", icon: "🗄️", questionsCount: 10, tag: "Core CSE", color: "from-emerald-600 to-teal-600" },
  { id: "OS", name: "Operating Systems", shortName: "OS", icon: "💻", questionsCount: 10, tag: "Core CSE", color: "from-violet-600 to-purple-600" },
  { id: "CN", name: "Computer Networks", shortName: "Networks", icon: "🌐", questionsCount: 10, tag: "Infra & Cloud", color: "from-sky-600 to-cyan-600" },
  { id: "OOPS", name: "OOPs & SOLID Principles", shortName: "OOPs", icon: "🧩", questionsCount: 10, tag: "Software Eng", color: "from-amber-600 to-orange-600" },
  { id: "SYSTEM_DESIGN", name: "System Design & Arch", shortName: "Sys Design", icon: "🏗️", questionsCount: 10, tag: "Top Tier Giants", color: "from-rose-600 to-pink-600" },
  { id: "APTITUDE", name: "Aptitude & Reasoning", shortName: "Aptitude", icon: "🧠", questionsCount: 10, tag: "Round 1 OA", color: "from-fuchsia-600 to-pink-600" },
  { id: "WEB_DEV", name: "Web Dev & DevOps", shortName: "Web & DevOps", icon: "🚀", questionsCount: 10, tag: "Full Stack", color: "from-emerald-600 to-green-600" },
];

const TestPage = () => {
  const { subject: urlSubject } = useParams();
  const navigate = useNavigate();
  const activeSubject = urlSubject || "DSA";

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);
  const questionRefs = useRef({});

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError("");
      setAnswers({});
      setTestResult(null);
      setReviewMode(false);
      try {
        const { data } = await api.get(`/tests/questions/${activeSubject}`);
        setQuestions(data);
      } catch (err) {
        setError(`Failed to load ${activeSubject} questions. Please check connection.`);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [activeSubject]);

  const handleSelect = (questionId, index) => {
    if (reviewMode) return; // Locked in review mode
    setAnswers((prev) => ({
      ...prev,
      [questionId]: index,
    }));
  };

  const executeSubmit = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        subject: activeSubject,
        answers: Object.entries(answers).map(([questionId, selectedIndex]) => ({
          questionId,
          selectedIndex,
        })),
      };

      const { data } = await api.post("/tests/submit", payload);
      setTestResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitClick = () => {
    const unansweredCount = questions.length - Object.keys(answers).length;
    if (unansweredCount > 0) {
      setShowConfirmModal(true);
    } else {
      executeSubmit();
    }
  };

  const scrollToFirstUnanswered = () => {
    setShowConfirmModal(false);
    const firstUnanswered = questions.find((q) => answers[q._id] === undefined);
    if (firstUnanswered && questionRefs.current[firstUnanswered._id]) {
      questionRefs.current[firstUnanswered._id].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      questionRefs.current[firstUnanswered._id].classList.add("ring-2", "ring-violet-500");
      setTimeout(() => {
        questionRefs.current[firstUnanswered._id]?.classList.remove("ring-2", "ring-violet-500");
      }, 1800);
    }
  };

  const currentTrack = PLACEMENT_TRACKS.find((t) => t.id === activeSubject) || PLACEMENT_TRACKS[0];
  const answeredCount = Object.keys(answers).length;
  const total = questions.length;
  const progress = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  // Next Subject in progression
  const currentIdx = PLACEMENT_TRACKS.findIndex((t) => t.id === activeSubject);
  const nextTrack = PLACEMENT_TRACKS[(currentIdx + 1) % PLACEMENT_TRACKS.length];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 pb-28" id="test-page">
      {/* ── 8-SUBJECT PLACEMENT TRACK SELECTOR CAROUSEL ── */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <h1 className="text-lg font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Take CSE Placement Test
            </h1>
          </div>
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            Select Track ({PLACEMENT_TRACKS.length} Subjects)
          </span>
        </div>

        {/* Scrollable Track Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {PLACEMENT_TRACKS.map((track) => {
            const isSelected = track.id === activeSubject;
            return (
              <button
                key={track.id}
                onClick={() => navigate(`/test/${track.id}`)}
                id={`track-pill-${track.id.toLowerCase()}`}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black transition-all shrink-0 border ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className="text-base">{track.icon}</span>
                <div className="text-left">
                  <div className="leading-tight">{track.shortName}</div>
                  <span className={`text-[9px] font-bold ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                    {track.questionsCount} MCQs
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── ACTIVE SUBJECT HEADER CARD ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm mb-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentTrack.color} text-white text-2xl flex items-center justify-center shadow-md shrink-0`}>
              {currentTrack.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {currentTrack.name}
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  {currentTrack.tag}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Calibrated against campus recruitment OAs & technical interview benchmarks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <Link
              to="/offline-learning"
              className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5"
            >
              <span>🛡️</span>
              <span>Offline Cheatsheet</span>
            </Link>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Progress: {answeredCount} of {total} Questions Answered ({progress}%)</span>
            <span className={answeredCount === total ? "text-emerald-600" : "text-violet-600"}>
              {answeredCount === total ? "Ready for Evaluation ✓" : `${total - answeredCount} Pending`}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-violet-600 to-indigo-600"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── LOADING STATE ── */}
      {loading && (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div
              className="w-10 h-10 mx-auto rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "rgba(124,58,237,0.3)", borderTopColor: "#7c3aed" }}
            />
            <p className="text-xs font-extrabold text-slate-600">Loading {currentTrack.name} questions...</p>
          </div>
        </div>
      )}

      {/* ── EMPTY QUESTIONS / ERROR STATE ── */}
      {!loading && questions.length === 0 && (
        <div className="glass-card p-10 text-center max-w-md mx-auto space-y-4 border border-slate-200 bg-white rounded-2xl">
          <div className="text-4xl">📚</div>
          <h3 className="text-base font-extrabold text-slate-900">
            No questions found
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {error || `No questions currently found for ${activeSubject}.`}
          </p>
          <button
            onClick={() => navigate("/test/DSA")}
            className="btn-gradient px-4 py-2 rounded-xl text-xs font-extrabold text-white"
          >
            Try DSA Track →
          </button>
        </div>
      )}

      {/* ── QUESTIONS LIST ── */}
      {!loading && questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const isAnswered = answers[q._id] !== undefined;
            const userAnswer = answers[q._id];

            return (
              <div
                key={q._id}
                ref={(el) => (questionRefs.current[q._id] = el)}
                id={`question-${idx + 1}`}
                className={`p-5 sm:p-6 rounded-2xl bg-white border transition-all duration-200 shadow-sm ${
                  isAnswered ? "border-violet-300 ring-1 ring-violet-200" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Question Header & Meta */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black text-white shrink-0 mt-0.5 ${
                        isAnswered ? "bg-emerald-600" : "bg-slate-900"
                      }`}
                    >
                      {isAnswered ? "✓" : idx + 1}
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-relaxed">
                      {q.questionText}
                    </h3>
                  </div>

                  {q.topic && (
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md shrink-0 bg-violet-50 text-violet-800 border border-violet-200">
                      {q.topic}
                    </span>
                  )}
                </div>

                {/* Options List */}
                <div className="space-y-2.5 mt-4">
                  {q.options.map((opt, i) => {
                    const isSelected = userAnswer === i;

                    return (
                      <div
                        key={i}
                        id={`q${idx + 1}-opt-${i}`}
                        onClick={() => handleSelect(q._id, i)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all border select-none ${
                          isSelected
                            ? "bg-violet-50 border-violet-500 shadow-xs"
                            : "bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            isSelected
                              ? "bg-violet-600 text-white"
                              : "border-2 border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className={`text-xs sm:text-sm font-bold ${isSelected ? "text-slate-900" : "text-slate-700"}`}>
                          {opt}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── ERROR MESSAGE ── */}
      {error && (
        <div className="mt-4 px-4 py-3 rounded-xl text-xs bg-rose-50 border border-rose-200 text-rose-800 font-bold">
          ⚠️ {error}
        </div>
      )}

      {/* ── STICKY SUBMIT FOOTER BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 py-3.5 px-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600">
              {answeredCount === total ? (
                <span className="text-emerald-700 font-extrabold">All {total} questions completed!</span>
              ) : (
                <span>{answeredCount} of {total} answered</span>
              )}
            </span>
          </div>

          <button
            id="test-submit-btn"
            onClick={handleSubmitClick}
            disabled={submitting}
            className="btn-gradient flex-1 sm:flex-initial sm:px-8 py-3 rounded-xl font-black text-xs sm:text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Evaluating Test Results...</span>
              </>
            ) : answeredCount === total ? (
              <span>Submit Test (All Completed) ✓</span>
            ) : (
              <span>Submit Test ({answeredCount}/{total} Answered)</span>
            )}
          </button>
        </div>
      </div>

      {/* ── UNANSWERED CONFIRMATION MODAL ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-md w-full p-6 space-y-4 text-center rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="text-4xl">⚠️</div>
            <h3 className="text-base font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Unanswered Questions Detected
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              You answered <strong className="text-slate-900">{answeredCount}</strong> of <strong className="text-slate-900">{total}</strong> questions. Unanswered questions will receive 0 marks in your skill gap diagnostic.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={scrollToFirstUnanswered}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
              >
                Review Unanswered
              </button>
              <button
                onClick={executeSubmit}
                className="btn-gradient flex-1 px-4 py-2 rounded-xl text-xs font-bold text-white"
              >
                Submit Anyway →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── POST-TEST COMPREHENSIVE RESULT MODAL ── */}
      {testResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 space-y-5 rounded-2xl bg-white border border-slate-200 shadow-2xl animate-fade-in my-8">
            <div className="text-center space-y-2">
              <div className="text-5xl animate-bounce">🎯</div>
              <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Test Complete!
              </h2>
              <p className="text-xs font-bold text-slate-500">
                {currentTrack.name} · Diagnostic Evaluation Report
              </p>
            </div>

            {/* Score Ring / Card */}
            <div className="rounded-2xl p-5 bg-violet-50 border border-violet-200 text-center space-y-1">
              <span className="text-4xl font-black text-violet-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {testResult.scorePercent}%
              </span>
              <p className="text-xs font-bold text-slate-700">
                {testResult.correctAnswers} of {testResult.totalQuestions} questions correct
              </p>
            </div>

            {/* Topic Breakdown */}
            {testResult.topicBreakdown && Object.keys(testResult.topicBreakdown).length > 0 && (
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Topic-by-Topic Performance:
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {Object.entries(testResult.topicBreakdown).map(([tName, data], i) => {
                    const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                    const isWeak = pct < 60;

                    return (
                      <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                        <span className="font-bold text-slate-700 truncate max-w-[200px]">{tName}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isWeak ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {pct}% ({data.correct}/{data.total})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI Examiner Summary if present */}
            {testResult.aiEvaluation?.aiSummary && (
              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 font-medium leading-relaxed">
                <strong className="font-black text-indigo-900 block mb-1">🤖 AI Diagnostic Note:</strong>
                {testResult.aiEvaluation.aiSummary}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-gradient w-full py-3 rounded-xl font-black text-xs sm:text-sm text-white shadow-md flex items-center justify-center gap-2"
              >
                <span>⚡ Go to Dashboard & 7-Day Roadmap</span>
                <span>→</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setTestResult(null);
                    setAnswers({});
                  }}
                  className="py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-center"
                >
                  🔄 Retake Test
                </button>
                <button
                  onClick={() => {
                    setTestResult(null);
                    navigate(`/test/${nextTrack.id}`);
                  }}
                  className="py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white text-center"
                >
                  Next: {nextTrack.shortName} →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;
