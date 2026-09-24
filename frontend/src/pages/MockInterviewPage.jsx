import React, { useState, useEffect } from "react";
import {
  startMockInterview,
  submitInterviewAnswer,
  submitInterviewFollowUp,
  completeMockInterview,
  getMockInterviewHistory,
} from "../services/api.js";

const ROLES = [
  { id: "Software Developer", name: "Software Developer", icon: "💻", color: "from-blue-600 to-indigo-600", desc: "Core algorithms, OOP, data structures & general software engineering." },
  { id: "Frontend Developer", name: "Frontend Developer", icon: "⚛️", color: "from-cyan-600 to-blue-600", desc: "React, DOM mechanics, JavaScript ES6+, CSS layouts & web performance." },
  { id: "Backend Developer", name: "Backend Developer", icon: "⚡", color: "from-violet-600 to-purple-600", desc: "REST APIs, database indexing/sharding, caching, microservices & security." },
  { id: "Full Stack Developer", name: "Full Stack Developer", icon: "🚀", color: "from-purple-600 to-pink-600", desc: "End-to-end architecture, API integration, database design & frontend UX." },
  { id: "Data Analyst", name: "Data Analyst", icon: "📊", color: "from-amber-600 to-orange-600", desc: "Advanced SQL, data visualization, Pandas/NumPy & business analytics." },
  { id: "AI/ML Engineer", name: "AI/ML Engineer", icon: "🧠", color: "from-emerald-600 to-teal-600", desc: "Deep learning, PyTorch/TensorFlow, model evaluation & MLOps." },
  { id: "Cyber Security", name: "Cyber Security Specialist", icon: "🛡️", color: "from-rose-600 to-pink-600", desc: "Network security, penetration testing, cryptography & threat mitigation." },
  { id: "Cloud Engineer", name: "Cloud Engineer (AWS/GCP)", icon: "☁️", color: "from-sky-600 to-blue-600", desc: "Docker, Kubernetes, CI/CD pipelines, IAM & cloud infrastructure." },
];

const ROUND_NAMES = [
  "Technical MCQ",
  "Technical Questions",
  "Coding",
  "Project Discussion",
  "HR / Behavioral",
];

const MockInterviewPage = () => {
  const [selectedRole, setSelectedRole] = useState("Software Developer");
  const [interview, setInterview] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Active state during live interview
  const [activeRoundIdx, setActiveRoundIdx] = useState(0); // 0 to 4
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [answerInput, setAnswerInput] = useState("");
  const [selectedMcqOption, setSelectedMcqOption] = useState(null);
  const [followUpAnswerInput, setFollowUpAnswerInput] = useState("");

  // Loading & Processing states
  const [starting, setStarting] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [submittingFollowUp, setSubmittingFollowUp] = useState(false);
  const [completing, setCompleting] = useState(false);

  // Active question dynamic evaluation state
  const [currentEval, setCurrentEval] = useState(null);
  const [activeFollowUpQuestion, setActiveFollowUpQuestion] = useState("");

  // Fetch interview history on load
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await getMockInterviewHistory();
      setHistory(data);
    } catch (err) {
      console.error("Fetch history error:", err);
    }
  };

  // 1. START MOCK INTERVIEW
  const handleStartInterview = async () => {
    setStarting(true);
    setInterview(null);
    setCurrentEval(null);
    setActiveFollowUpQuestion("");
    setActiveRoundIdx(0);
    setActiveQuestionIdx(0);

    try {
      const { data } = await startMockInterview(selectedRole);
      setInterview(data);
    } catch (err) {
      console.error("Start interview error:", err);
    } finally {
      setStarting(false);
    }
  };

  // 2. SUBMIT QUESTION ANSWER
  const handleSubmitAnswer = async () => {
    if (!interview) return;
    const currentRound = interview.rounds[activeRoundIdx];
    const currentQ = currentRound.questions[activeQuestionIdx];

    setSubmittingAnswer(true);

    try {
      const { data } = await submitInterviewAnswer(interview._id, {
        roundNumber: currentRound.roundNumber,
        questionId: currentQ.questionId,
        studentAnswer: answerInput,
        selectedOption: selectedMcqOption,
      });

      setCurrentEval(data.question.evaluation);
      setActiveFollowUpQuestion(data.question.aiFollowUpQuestion || "");
    } catch (err) {
      console.error("Submit answer error:", err);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // 3. SUBMIT AI FOLLOW-UP ANSWER & ADVANCE
  const handleSubmitFollowUp = async () => {
    if (!interview) return;
    const currentRound = interview.rounds[activeRoundIdx];
    const currentQ = currentRound.questions[activeQuestionIdx];

    setSubmittingFollowUp(true);

    try {
      const { data } = await submitInterviewFollowUp(interview._id, {
        roundNumber: currentRound.roundNumber,
        questionId: currentQ.questionId,
        followUpAnswer: followUpAnswerInput,
      });

      setInterview(data);
      setCurrentEval(null);
      setActiveFollowUpQuestion("");
      setAnswerInput("");
      setSelectedMcqOption(null);
      setFollowUpAnswerInput("");

      // Advance to next question or next round
      if (activeQuestionIdx < currentRound.questions.length - 1) {
        setActiveQuestionIdx((prev) => prev + 1);
      } else if (activeRoundIdx < 4) {
        setActiveRoundIdx((prev) => prev + 1);
        setActiveQuestionIdx(0);
      } else {
        // All rounds complete -> Trigger Final Evaluation
        handleCompleteInterview(data._id);
      }
    } catch (err) {
      console.error("Submit follow up error:", err);
    } finally {
      setSubmittingFollowUp(false);
    }
  };

  // 4. COMPLETE INTERVIEW SESSION
  const handleCompleteInterview = async (interviewId = null) => {
    const targetId = interviewId || interview?._id;
    if (!targetId) return;

    setCompleting(true);
    try {
      const { data } = await completeMockInterview(targetId);
      setInterview(data);
      fetchHistory();
    } catch (err) {
      console.error("Complete interview error:", err);
    } finally {
      setCompleting(false);
    }
  };

  const activeRound = interview?.rounds[activeRoundIdx];
  const activeQuestion = activeRound?.questions[activeQuestionIdx];

  const getHiringBadge = (decision) => {
    switch (decision) {
      case "Strong Hire":
        return { bg: "bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-400", label: "🌟 STRONG HIRE" };
      case "Hire":
        return { bg: "bg-blue-500/20", border: "border-blue-500/40", text: "text-blue-400", label: "👍 HIRE" };
      case "Needs Improvement":
        return { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400", label: "⚠️ NEEDS IMPROVEMENT" };
      default:
        return { bg: "bg-rose-500/20", border: "border-rose-500/40", text: "text-rose-400", label: "❌ REJECT" };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="space-y-3 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-black uppercase border border-violet-500/30">
              <span>🎙️ AI Technical Mock Interviewer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Simulate 5 Live Technical Interview Rounds
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl font-medium leading-relaxed">
              Experience dynamic AI follow-up probing, 6-point technical evaluation, questions missed breakdown, and a personalized 7-Day Interview Preparation Action Plan.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10 flex-shrink-0">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="px-4 py-2.5 rounded-2xl text-xs font-black bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all"
            >
              📜 Interview History ({history.length})
            </button>

            {interview && (
              <button
                onClick={() => setInterview(null)}
                className="px-4 py-2.5 rounded-2xl text-xs font-black bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all"
              >
                ✕ Exit Session
              </button>
            )}
          </div>
        </div>

        {/* STEP 1: ROLE SELECTION (IF NO ACTIVE SESSION) */}
        {!interview && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-lg font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                1. Select Target Engineering Role:
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Choose the technical role you are preparing for. The AI will customize all 5 rounds and follow-ups.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ROLES.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-5 rounded-3xl cursor-pointer transition-all duration-300 border space-y-3 flex flex-col justify-between ${
                      isSelected
                        ? "bg-gradient-to-br from-violet-900/60 via-purple-900/60 to-slate-900 text-white border-violet-500 shadow-xl scale-[1.02]"
                        : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="text-3xl">{role.icon}</div>
                      <h3 className="text-base font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {role.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        {role.desc}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                      <span className="text-[10px] font-black uppercase text-violet-400">
                        {isSelected ? "✓ Selected" : "Click to select"}
                      </span>
                      <span className="text-xs">→</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Start Button Hero Callout */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <h3 className="text-base font-black text-white">
                  Target Role: <span className="text-violet-400">{selectedRole}</span>
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  5 Rounds: Technical MCQ → Technical Questions → Coding → Project System Design → HR / Behavioral
                </p>
              </div>

              <button
                onClick={handleStartInterview}
                disabled={starting}
                className="btn-gradient px-8 py-3.5 rounded-2xl text-xs font-black text-white shadow-xl active:scale-95 transition-all flex items-center gap-2 flex-shrink-0"
              >
                {starting ? "Initializing Session..." : "🚀 Launch Live 5-Round Interview"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ACTIVE LIVE MOCK INTERVIEW ROOM */}
        {interview && !interview.completed && (
          <div className="space-y-6 animate-fade-in">
            {/* 5-ROUND PROGRESS STEPPER */}
            <div className="grid grid-cols-5 gap-2 bg-slate-900 p-2.5 rounded-2xl border border-slate-800">
              {interview.rounds.map((r, rIdx) => {
                const isActive = activeRoundIdx === rIdx;
                const isDone = r.status === "completed";

                return (
                  <button
                    key={r.roundNumber}
                    onClick={() => {
                      if (isDone || isActive) {
                        setActiveRoundIdx(rIdx);
                        setActiveQuestionIdx(0);
                      }
                    }}
                    className={`py-2.5 px-2 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center transition-all border ${
                      isActive
                        ? "bg-violet-600 text-white border-violet-500 shadow-md"
                        : isDone
                        ? "bg-emerald-950/60 text-emerald-300 border-emerald-800"
                        : "bg-slate-950 text-slate-500 border-slate-800 cursor-not-allowed"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold opacity-80">Round {r.roundNumber}</span>
                    <span className="truncate text-xs font-black">{r.roundName}</span>
                  </button>
                );
              })}
            </div>

            {/* LIVE INTERVIEW QUESTION & ANSWER AREA */}
            {activeQuestion && (
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
                {/* Question Header */}
                <div className="space-y-2 border-b border-slate-800 pb-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {activeRound.roundName} (Question {activeQuestionIdx + 1} of {activeRound.questions.length})
                    </span>
                    <span>Role: {interview.role}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    "{activeQuestion.questionText}"
                  </h2>
                </div>

                {/* ANSWER INPUT FORM (MCQ vs TEXT vs CODING) */}
                {!currentEval ? (
                  <div className="space-y-4">
                    {/* MCQ Options */}
                    {activeQuestion.questionType === "mcq" && (
                      <div className="grid grid-cols-1 gap-3">
                        {activeQuestion.options?.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => setSelectedMcqOption(oIdx)}
                            className={`p-4 rounded-2xl text-xs font-extrabold text-left transition-all border flex items-center justify-between ${
                              selectedMcqOption === oIdx
                                ? "bg-violet-600 text-white border-violet-500 shadow-md scale-[1.01]"
                                : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                            }`}
                          >
                            <span>Option {oIdx + 1}: {opt}</span>
                            {selectedMcqOption === oIdx && <span>✓ Selected</span>}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Text / Coding / Behavioral Input */}
                    {activeQuestion.questionType !== "mcq" && (
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase text-slate-400">
                          Your Technical Response:
                        </label>
                        <textarea
                          value={answerInput}
                          onChange={(e) => setAnswerInput(e.target.value)}
                          rows={6}
                          placeholder="Type your response... (Be clear, specify trade-offs, time/space complexity, and architecture)"
                          className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-2xl p-4 text-xs font-mono leading-relaxed focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={submittingAnswer || (activeQuestion.questionType === "mcq" ? selectedMcqOption === null : !answerInput.trim())}
                        className="btn-gradient px-6 py-3 rounded-2xl text-xs font-black text-white shadow-md active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {submittingAnswer ? "Evaluating Answer..." : "Submit Answer & Trigger Follow-Up →"}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* EVALUATION RESULTS & AI DYNAMIC FOLLOW-UP QUESTION PANEL */
                  <div className="space-y-6 animate-fade-in">
                    {/* 6-Metric Evaluation Score Badges */}
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                      <h4 className="text-xs font-black text-violet-400 uppercase tracking-wide">
                        📊 Live Response Evaluation Scores:
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                        <div className="p-2.5 rounded-xl bg-violet-950/60 border border-violet-800 text-center">
                          <div className="text-[10px] text-violet-300 font-bold uppercase">Accuracy</div>
                          <div className="text-base font-black text-violet-400">{currentEval.technicalAccuracy}%</div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-800 text-center">
                          <div className="text-[10px] text-indigo-300 font-bold uppercase">Concept</div>
                          <div className="text-base font-black text-indigo-400">{currentEval.conceptUnderstanding}%</div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-sky-950/60 border border-sky-800 text-center">
                          <div className="text-[10px] text-sky-300 font-bold uppercase">Communication</div>
                          <div className="text-base font-black text-sky-400">{currentEval.communication}%</div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-center">
                          <div className="text-[10px] text-emerald-300 font-bold uppercase">Problem Solving</div>
                          <div className="text-base font-black text-emerald-400">{currentEval.problemSolving}%</div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800 text-center">
                          <div className="text-[10px] text-purple-300 font-bold uppercase">Structure</div>
                          <div className="text-base font-black text-purple-400">{currentEval.answerStructure}%</div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800 text-center">
                          <div className="text-[10px] text-amber-300 font-bold uppercase">Confidence</div>
                          <div className="text-base font-black text-amber-400">{currentEval.confidence}%</div>
                        </div>
                      </div>

                      {/* Feedback & Ideal Answer */}
                      <div className="space-y-2 text-xs">
                        <p className="text-slate-300 font-medium">
                          <strong>Interviewer Feedback:</strong> {currentEval.feedback}
                        </p>
                      </div>
                    </div>

                    {/* DYNAMIC AI FOLLOW-UP QUESTION BOX */}
                    {activeFollowUpQuestion && (
                      <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 border border-purple-800 space-y-4 shadow-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🤖</span>
                          <h4 className="text-xs font-black uppercase text-purple-300 tracking-wide">
                            Interviewer Follow-Up Question:
                          </h4>
                        </div>

                        <p className="text-sm font-bold text-white leading-relaxed">
                          "{activeFollowUpQuestion}"
                        </p>

                        <div className="space-y-2">
                          <textarea
                            value={followUpAnswerInput}
                            onChange={(e) => setFollowUpAnswerInput(e.target.value)}
                            rows={3}
                            placeholder="Type your follow-up explanation..."
                            className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-2xl p-3 text-xs font-mono focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={handleSubmitFollowUp}
                            disabled={submittingFollowUp || !followUpAnswerInput.trim()}
                            className="btn-gradient px-6 py-2.5 rounded-2xl text-xs font-black text-white shadow-md active:scale-95 transition-all disabled:opacity-50"
                          >
                            {submittingFollowUp ? "Submitting..." : "Submit Follow-Up & Next Question →"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: COMPREHENSIVE FINAL INTERVIEW REPORT */}
        {interview && interview.completed && (
          <div className="space-y-6 animate-fade-in">
            {/* Hiring Decision Banner */}
            {(() => {
              const badge = getHiringBadge(interview.hiringDecision);
              return (
                <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 ${badge.bg} ${badge.border}`}>
                  <div className="space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-black border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {badge.label}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Interview Overall Score: {interview.overallScore}%
                    </h2>
                    <p className="text-xs text-slate-300 font-medium">
                      Role: <strong>{interview.role}</strong> | Completed 5 Rounds
                    </p>
                  </div>

                  <button
                    onClick={() => setInterview(null)}
                    className="btn-gradient px-6 py-3 rounded-2xl text-xs font-black text-white shadow-md"
                  >
                    🚀 Start New Mock Session
                  </button>
                </div>
              );
            })()}

            {/* STRENGTHS & TOPICS TO IMPROVE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
                <h3 className="text-xs font-black uppercase text-emerald-400 tracking-wide flex items-center gap-2">
                  <span>🌟 Key Technical Strengths:</span>
                </h3>
                <ul className="text-xs text-slate-300 font-medium space-y-2 list-disc pl-4">
                  {interview.strengths?.map((str, sIdx) => (
                    <li key={sIdx}>{str}</li>
                  ))}
                </ul>
              </div>

              {/* Topics to Improve */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
                <h3 className="text-xs font-black uppercase text-amber-400 tracking-wide flex items-center gap-2">
                  <span>⚠️ Technical Topics to Improve:</span>
                </h3>
                <ul className="text-xs text-slate-300 font-medium space-y-2 list-disc pl-4">
                  {interview.topicsToImprove?.map((top, tIdx) => (
                    <li key={tIdx}>{top}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* QUESTIONS MISSED & RECOMMENDED ANSWERS */}
            {interview.questionsMissed && interview.questionsMissed.length > 0 && (
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4 shadow-xl">
                <h3 className="text-xs font-black uppercase text-rose-400 tracking-wide">
                  ❌ Questions Missed & Ideal Answers:
                </h3>

                <div className="space-y-4 font-mono text-xs">
                  {interview.questionsMissed.map((qm, qIdx) => (
                    <div key={qIdx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="font-bold text-white text-sm font-sans">
                        Q{qIdx + 1}: {qm.question}
                      </div>
                      <div className="text-rose-300">
                        <span className="font-bold text-rose-400">Your Answer:</span> {qm.yourAnswer}
                      </div>
                      <div className="text-emerald-300">
                        <span className="font-bold text-emerald-400">Recommended Answer:</span> {qm.recommendedAnswer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7-DAY INTERVIEW PREPARATION PLAN */}
            {interview.preparationPlan && (
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4 shadow-xl">
                <h3 className="text-xs font-black uppercase text-purple-400 tracking-wide">
                  🗓️ 7-Day Interview Preparation Action Plan:
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {interview.preparationPlan.map((planItem, pIdx) => (
                    <div key={pIdx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                        <span>Day {planItem.day || pIdx + 1}</span>
                        <span>{planItem.focus}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">
                        {planItem.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* INTERVIEW HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-slate-800 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  📜 Past Mock Interview Sessions
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Review your score progress across technical roles.
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 font-bold"
              >
                ✕
              </button>
            </div>

            {history.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-bold">
                No past interview sessions found.
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((sess) => (
                  <div
                    key={sess._id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-sm font-black text-white">{sess.role}</div>
                      <div className="text-xs text-slate-400 font-medium">
                        {new Date(sess.createdAt).toLocaleDateString()} | {sess.rounds?.length || 5} Rounds
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-black text-violet-400">{sess.overallScore || 0}%</div>
                        <div className="text-[10px] text-slate-400 font-bold">{sess.hiringDecision || "Completed"}</div>
                      </div>

                      <button
                        onClick={() => {
                          setInterview(sess);
                          setShowHistoryModal(false);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white"
                      >
                        View Report →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterviewPage;
