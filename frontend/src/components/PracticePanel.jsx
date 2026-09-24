import React, { useState, useEffect } from "react";
import api from "../services/api.js";
import MarkdownRenderer from "./MarkdownRenderer.jsx";

export default function PracticePanel({ topicId, subjectId }) {
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  // States: 'start', 'generating', 'answering', 'feedback', 'summary'
  const [phase, setPhase] = useState("start"); 
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [summary, setSummary] = useState(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (phase === "answering") {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  const startPractice = async () => {
    try {
      setPhase("generating");
      const { data } = await api.post("/adaptive/start", { subjectId, topicId });
      setSession(data.session);
      await fetchNextQuestion(data.session._id);
    } catch (err) {
      console.error(err);
      setPhase("start");
    }
  };

  const fetchNextQuestion = async (sid) => {
    setPhase("generating");
    setTimer(0);
    try {
      const { data } = await api.post("/adaptive/next", { sessionId: sid });
      setCurrentQuestion(data);
      setSelectedOption("");
      setFeedback(null);
      setPhase("answering");
    } catch (err) {
      console.error(err);
      setPhase("summary");
    }
  };

  const submitAnswer = async () => {
    if (!selectedOption) return;
    try {
      const { data } = await api.post("/adaptive/submit", {
        sessionId: session._id,
        questionId: currentQuestion.questionId,
        userAnswer: selectedOption,
        timeTakenSeconds: timer
      });
      setFeedback(data);
      setPhase("feedback");
    } catch (err) {
      console.error(err);
    }
  };

  const endPractice = async () => {
    try {
      setPhase("generating");
      const { data } = await api.post("/adaptive/end", { sessionId: session._id });
      setSummary(data.session);
      setPhase("summary");
    } catch (err) {
      console.error(err);
    }
  };

  const getDifficultyColor = (diff) => {
    if (diff === "easy") return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (diff === "hard") return "bg-rose-100 text-rose-800 border-rose-200";
    if (diff === "interview") return "bg-indigo-100 text-indigo-800 border-indigo-200";
    return "bg-amber-100 text-amber-800 border-amber-200";
  };

  if (phase === "start") {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
          🧠
        </div>
        <h3 className="text-xl font-black text-slate-900">Adaptive Practice Engine</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Not just random questions. The AI adapts to your skill level in real-time. Perform well, and it scales to interview level. Struggle, and it reinforces concepts.
        </p>
        <button
          onClick={startPractice}
          className="btn-gradient px-6 py-3 rounded-2xl text-sm font-black text-white shadow-md hover:scale-105 transition-all mt-4"
        >
          🚀 Start Adaptive Session
        </button>
      </div>
    );
  }

  if (phase === "generating") {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto"></div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">AI is analyzing your profile...</h3>
          <p className="text-xs text-slate-500 mt-2">Generating the perfect question for your mastery level</p>
        </div>
      </div>
    );
  }

  if (phase === "summary" && summary) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fade-in-up">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <span className="text-3xl">📊</span>
          <div>
            <h3 className="text-xl font-black text-slate-900">Session Diagnostic Report</h3>
            <p className="text-xs text-slate-500 font-bold tracking-wide uppercase">AI Adaptive Profiling</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Accuracy</div>
            <div className="text-2xl font-black text-slate-900">{summary.accuracy}%</div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Avg Speed</div>
            <div className="text-2xl font-black text-slate-900">{summary.speedAvgSeconds}s</div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Questions</div>
            <div className="text-2xl font-black text-slate-900">{summary.attempts.length}</div>
          </div>
          <div className="p-4 bg-violet-50 border border-violet-200 rounded-2xl text-center">
            <div className="text-xs font-black text-violet-600 uppercase tracking-wider mb-1">Mastery</div>
            <div className="text-2xl font-black text-violet-900">{summary.masteryPercentage}%</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="text-rose-500">⚠️</span> Weaknesses & Mistakes
            </h4>
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
              {summary.mistakePatterns?.map((m, i) => (
                <div key={i} className="text-xs font-medium text-rose-900 flex gap-2">
                  <span>•</span> {m}
                </div>
              ))}
              {(!summary.mistakePatterns || summary.mistakePatterns.length === 0) && (
                <div className="text-xs text-slate-500 italic">No major mistake patterns detected.</div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="text-emerald-500">💡</span> AI Recommendations
            </h4>
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
              {summary.recommendations?.map((r, i) => (
                <div key={i} className="text-xs font-bold text-emerald-900 flex gap-2">
                  <span>→</span> {r}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <div className="text-xs font-bold text-slate-500">
            Next optimal topic: <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{summary.recommendedNextTopic || "Continue down roadmap"}</span>
          </div>
          <button
            onClick={() => setPhase("start")}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-xl shadow-inner border border-violet-200">
            🧠
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">Adaptive Engine</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${getDifficultyColor(currentQuestion?.difficulty)}`}>
                {currentQuestion?.difficulty}
              </span>
              <span className="text-[10px] font-bold text-slate-400">Time: {timer}s</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={endPractice}
          className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
        >
          End Session
        </button>
      </div>

      {/* Question */}
      <div className="space-y-5">
        <h4 className="text-base sm:text-lg font-black text-slate-900 leading-relaxed">
          <MarkdownRenderer content={currentQuestion?.questionText} />
        </h4>

        <div className="space-y-2">
          {currentQuestion?.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const showCorrect = phase === "feedback" && feedback?.correctAnswer === opt;
            const showWrong = phase === "feedback" && isSelected && !feedback?.isCorrect;

            let btnClass = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300";
            if (isSelected && phase !== "feedback") btnClass = "bg-violet-50 border-violet-400 text-violet-900 ring-2 ring-violet-200";
            if (showCorrect) btnClass = "bg-emerald-50 border-emerald-400 text-emerald-900";
            if (showWrong) btnClass = "bg-rose-50 border-rose-400 text-rose-900";

            return (
              <button
                key={idx}
                disabled={phase === "feedback"}
                onClick={() => setSelectedOption(opt)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 font-medium text-sm flex gap-3 ${btnClass}`}
              >
                <span className={`font-black ${showCorrect ? 'text-emerald-600' : showWrong ? 'text-rose-600' : isSelected ? 'text-violet-600' : 'text-slate-400'}`}>
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="flex-1">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action / Feedback Area */}
      <div className="pt-4">
        {phase === "answering" && (
          <button
            onClick={submitAnswer}
            disabled={!selectedOption}
            className="w-full btn-gradient px-6 py-3.5 rounded-2xl text-sm font-black text-white shadow-md disabled:opacity-50 transition-all"
          >
            Submit Answer
          </button>
        )}

        {phase === "feedback" && feedback && (
          <div className="space-y-4 animate-fade-in-up">
            <div className={`p-4 rounded-2xl border ${feedback.isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{feedback.isCorrect ? "✅" : "❌"}</span>
                <span className={`font-black ${feedback.isCorrect ? "text-emerald-800" : "text-rose-800"}`}>
                  {feedback.isCorrect ? "Excellent!" : "Incorrect"}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                {feedback.explanation}
              </p>
            </div>

            <button
              onClick={() => fetchNextQuestion(session._id)}
              className="w-full px-6 py-3.5 rounded-2xl text-sm font-black text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Next Question</span>
              <span className={`px-2 py-0.5 rounded text-[10px] ${getDifficultyColor(feedback.nextDifficulty)}`}>
                Adaptive Level: {feedback.nextDifficulty}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
