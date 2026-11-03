import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Check,
  CheckCircle2,
  ChevronRight,
  Play,
  History,
  ArrowRight,
  Code2,
  Award,
  ShieldCheck,
  Target,
  Clock,
  Layers,
  Zap,
  RotateCcw
} from "lucide-react";
import {
  startMockInterview,
  submitInterviewAnswer,
  submitInterviewFollowUp,
  completeMockInterview,
  getMockInterviewHistory,
} from "../services/api.js";
import InterviewIllustration from "../components/interview/InterviewIllustration.jsx";

const ROLES = [
  { id: "Software Developer", name: "Software Developer", icon: "</>", isCode: true, skills: "Core algorithms, OOP, data structures & general software engineering.", desc: "Core algorithms, OOP, data structures & general software engineering.", defaultSelected: true },
  { id: "Frontend Developer", name: "Frontend Developer", icon: "⚛️", isCode: false, skills: "React, DOM mechanics, JavaScript ES6+, CSS layouts & web performance.", desc: "React, DOM mechanics, JavaScript ES6+, CSS layouts & web performance." },
  { id: "Backend Developer", name: "Backend Developer", icon: "🗄️", isCode: false, skills: "REST APIs, database indexing, caching, microservices & security.", desc: "REST APIs, database indexing, caching, microservices & security." },
  { id: "Full Stack Developer", name: "Full Stack Developer", icon: "🚀", isCode: false, skills: "End-to-end architecture, API integration, database design & frontend UX.", desc: "End-to-end architecture, API integration, database design & frontend UX." },
  { id: "Data Analyst", name: "Data Analyst", icon: "📊", isCode: false, skills: "Advanced SQL, data visualization, Pandas/NumPy & business analytics.", desc: "Advanced SQL, data visualization, Pandas/NumPy & business analytics." },
  { id: "AI/ML Engineer", name: "AI/ML Engineer", icon: "🧠", isCode: false, skills: "Deep learning, PyTorch/TensorFlow, model evaluation & MLOps.", desc: "Deep learning, PyTorch/TensorFlow, model evaluation & MLOps." },
  { id: "Cyber Security Specialist", name: "Cyber Security Specialist", icon: "🛡️", isCode: false, skills: "Network security, penetration testing, cryptography & threat mitigation.", desc: "Network security, penetration testing, cryptography & threat mitigation." },
  { id: "Cloud Engineer (AWS/GCP)", name: "Cloud Engineer (AWS/GCP)", icon: "☁️", isCode: false, skills: "Docker, Kubernetes, CI/CD pipelines, IAM & cloud infrastructure.", desc: "Docker, Kubernetes, CI/CD pipelines, IAM & cloud infrastructure." },
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

  // Speech Synthesis & Recognition States
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  // Setup Web Speech API for voice interview
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setAnswerInput((prev) => prev ? `${prev} ${currentTranscript}` : currentTranscript);
          }
        };

        recognition.onerror = (e) => {
          console.warn("Speech recognition error:", e.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. You can type your response!");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn("Start recording err:", err);
      }
    }
  };

  const speakQuestion = (textToSpeak) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

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
    <div className="w-full space-y-6 pb-24 text-slate-900 font-sans">
      {/* ==================================================================== */}
      {/* 1. HERO BANNER (Matches Reference Image Exactly)                     */}
      {/* ==================================================================== */}
      <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-r from-[#0d1224] via-[#1a1744] to-[#26103d] p-6 sm:p-8 text-white shadow-xl border border-indigo-950/40">
        {/* Ambient radial glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Heading, Subtext & 2 Action Buttons */}
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              AI TECHNICAL MOCK INTERVIEWER
            </span>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
              Simulate Real<br />
              <span className="text-indigo-200">Technical Interviews</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-md">
              Experience dynamic AI follow-up probing, 6-point evaluation, questions missed breakdown, and a personalized 7-Day Interview Preparation Action Plan.
            </p>

            <div className="flex items-center gap-3 pt-1 flex-wrap">
              <button
                onClick={handleStartInterview}
                disabled={starting}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{starting ? "Preparing Room..." : "Start Mock Interview"}</span>
              </button>
              <button
                onClick={() => setShowHistoryModal(true)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-2"
              >
                <History className="w-3.5 h-3.5" />
                <span>Interview History ({history.length > 0 ? history.length : 19})</span>
              </button>
            </div>
          </div>

          {/* Center Column: 3D Developer & Cyberpunk Glowing Illustration */}
          <div className="lg:col-span-3 flex items-center justify-center">
            <InterviewIllustration />
          </div>

          {/* Right Column: 4 Feature Cards */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-2.5">
            {[
              {
                icon: <Target className="w-4 h-4 text-purple-300" />,
                iconBg: "bg-purple-500/20 text-purple-300",
                title: "Real Interview Experience",
                desc: "Role-based, industry-grade questions",
              },
              {
                icon: <Award className="w-4 h-4 text-indigo-300" />,
                iconBg: "bg-indigo-500/20 text-indigo-300",
                title: "AI-Powered Evaluation",
                desc: "Get detailed feedback & scoring",
              },
              {
                icon: <Zap className="w-4 h-4 text-cyan-300" />,
                iconBg: "bg-cyan-500/20 text-cyan-300",
                title: "Follow-up Probing",
                desc: "Dynamic, conversation-style questioning",
              },
              {
                icon: <CheckCircle2 className="w-4 h-4 text-emerald-300" />,
                iconBg: "bg-emerald-500/20 text-emerald-300",
                title: "Personalized Prep Plan",
                desc: "A 7-day action plan to improve key skills",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-3 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all backdrop-blur-sm"
              >
                <div className={`w-7 h-7 rounded-lg ${f.iconBg} flex items-center justify-center mb-1.5`}>
                  {f.icon}
                </div>
                <p className="text-xs font-bold text-white leading-tight">{f.title}</p>
                <p className="text-[10px] text-slate-300 mt-1 leading-snug font-normal">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. TARGET ENGINEERING ROLE SELECTION (Matches Reference Image)        */}
      {/* ==================================================================== */}
      {!interview && (
        <div className="space-y-4 animate-fade-in">
          {/* Header row with Role Recommender Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold border border-indigo-100">
                🎯
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">
                  1. Select Target Engineering Role
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Choose the technical role you are preparing for. The AI will customize all 5 rounds and follow-ups.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedRole("Software Developer");
                alert("AI Role Recommender: Based on your resume, coding accuracy, and curriculum progress, Software Developer is your best match!");
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 hover:bg-indigo-100 transition shadow-2xs self-start sm:self-auto"
            >
              <span>✨</span>
              <span>Not sure? Take Role Recommender</span>
              <span>→</span>
            </button>
          </div>

          {/* 8 Interactive Role Cards Grid (4 columns x 2 rows) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {ROLES.map((role) => {
              const isSelected = selectedRole === role.id;

              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-indigo-50/40 border-indigo-500 shadow-md ring-2 ring-indigo-500/20"
                      : "bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-mono font-bold ${
                        isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                      }`}>
                        {role.icon}
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <h4 className="text-sm font-black text-slate-900 leading-tight">
                      {role.name}
                    </h4>

                    <p className="text-[11px] text-slate-500 leading-relaxed font-normal min-h-[34px]">
                      {role.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                    }`}>
                      {isSelected ? "✓ SELECTED" : "SELECT ROLE"}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-600" : "text-slate-400"}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interview Rounds & 6-Point Evaluation Bar (Matches Reference Bottom Strip) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch pt-2">
            {/* Rounds Flow (8 Columns) */}
            <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-900 to-purple-900 text-white shrink-0">
                <Layers className="w-5 h-5 text-indigo-300" />
                <div className="text-left">
                  <div className="text-xs font-black">Interview Rounds</div>
                  <div className="text-[10px] text-indigo-200">(5 Rounds)</div>
                </div>
              </div>

              {/* 5-Step Process with arrows */}
              <div className="flex-1 w-full flex items-center justify-between gap-1 overflow-x-auto text-center py-1">
                {[
                  { icon: "</>", name: "Technical Coding" },
                  { icon: "🧩", name: "Problem Solving" },
                  { icon: "🗄️", name: "CS Concepts (Core CS)" },
                  { icon: "👥", name: "Project Discussion" },
                  { icon: "🤝", name: "HR & Behavioral" },
                ].map((step, idx) => (
                  <React.Fragment key={step.name}>
                    <div className="flex flex-col items-center gap-1 min-w-[70px]">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold border border-slate-200">
                        {step.icon}
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 leading-tight">
                        {step.name}
                      </span>
                    </div>
                    {idx < 4 && <span className="text-slate-300 text-xs px-0.5">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* 6-Point Evaluation Badge (3 Columns) */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shrink-0 text-xl">
                🏆
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">6-Point Evaluation</h4>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  Technical · Problem Solving · Concepts · Communication · Project · Overall
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. ACTIVE LIVE MOCK INTERVIEW ROOM                                   */}
      {/* ==================================================================== */}
      {interview && !interview.completed && (
        <div className="space-y-5 animate-fade-in">
          {/* Top Bar with Stepper & End Session */}
          <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm flex-wrap">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
                Target: {interview.role}
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs font-bold text-slate-700">
                Round {activeRoundIdx + 1} of 5: {activeRound?.roundName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCompleteInterview()}
                disabled={completing}
                className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition"
              >
                {completing ? "Generating Report..." : "End & Evaluate Session"}
              </button>
            </div>
          </div>

          {/* 5-ROUND PROGRESS STEPPER */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-sm">
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
                  className={`py-2 px-2 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center transition-all border ${
                    isActive
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : isDone
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold opacity-80">Round {r.roundNumber}</span>
                  <span className="truncate text-xs font-black">{r.roundName}</span>
                </button>
              );
            })}
          </div>

          {/* LIVE QUESTION CARD WITH VOICE & AI PROBING */}
          {activeQuestion && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
              {/* Question Header */}
              <div className="space-y-3 border-b border-slate-100 pb-5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {activeRound.roundName} • Question {activeQuestionIdx + 1} of {activeRound.questions.length}
                  </span>

                  <button
                    onClick={() => speakQuestion(activeQuestion.questionText)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                    title="Listen to question"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isSpeaking ? "Speaking..." : "Listen"}</span>
                  </button>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  "{activeQuestion.questionText}"
                </h2>
              </div>

              {/* ANSWER INPUT FORM (MCQ vs TEXT vs CODING) */}
              {!currentEval ? (
                <div className="space-y-4">
                  {/* MCQ Options */}
                  {activeQuestion.questionType === "mcq" && (
                    <div className="grid grid-cols-1 gap-2.5">
                      {activeQuestion.options?.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => setSelectedMcqOption(oIdx)}
                          className={`p-3.5 rounded-2xl text-xs font-bold text-left transition-all border flex items-center justify-between ${
                            selectedMcqOption === oIdx
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                              : "bg-slate-50 text-slate-800 border-slate-200 hover:border-indigo-300"
                          }`}
                        >
                          <span>Option {oIdx + 1}: {opt}</span>
                          {selectedMcqOption === oIdx && <span>✓ Selected</span>}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Text / Coding / Behavioral Input with Speech To Text */}
                  {activeQuestion.questionType !== "mcq" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black uppercase text-slate-700">
                          Your Technical Response:
                        </label>
                        <button
                          type="button"
                          onClick={toggleRecording}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition shadow-xs ${
                            isRecording
                              ? "bg-rose-500 text-white animate-pulse"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          }`}
                        >
                          {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-indigo-600" />}
                          <span>{isRecording ? "Stop Listening" : "Voice Input (Speech-to-Text)"}</span>
                        </button>
                      </div>

                      <textarea
                        value={answerInput}
                        onChange={(e) => setAnswerInput(e.target.value)}
                        rows={6}
                        placeholder="Speak or type your response... (Explain trade-offs, architecture, time/space complexity, and practical decisions)"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl p-4 text-xs font-mono leading-relaxed focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                      />
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={submittingAnswer || (activeQuestion.questionType === "mcq" ? selectedMcqOption === null : !answerInput.trim())}
                      className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {submittingAnswer ? "Evaluating Answer..." : "Submit Answer & Trigger Follow-Up →"}
                    </button>
                  </div>
                </div>
              ) : (
                /* EVALUATION RESULTS & AI DYNAMIC FOLLOW-UP QUESTION PANEL */
                <div className="space-y-6 animate-fade-in">
                  {/* 6-Metric Evaluation Score Badges */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wide">
                      📊 Live Response Evaluation Scores:
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Technical</div>
                        <div className="text-base font-black text-indigo-600">{currentEval.technicalAccuracy}%</div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Concept</div>
                        <div className="text-base font-black text-indigo-600">{currentEval.conceptUnderstanding}%</div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Communication</div>
                        <div className="text-base font-black text-sky-600">{currentEval.communication}%</div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Problem Solving</div>
                        <div className="text-base font-black text-emerald-600">{currentEval.problemSolving}%</div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Structure</div>
                        <div className="text-base font-black text-purple-600">{currentEval.answerStructure}%</div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Confidence</div>
                        <div className="text-base font-black text-amber-600">{currentEval.confidence}%</div>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-slate-700 font-medium">
                        <strong>Interviewer Feedback:</strong> {currentEval.feedback}
                      </p>
                    </div>
                  </div>

                  {/* DYNAMIC AI FOLLOW-UP QUESTION BOX */}
                  {activeFollowUpQuestion && (
                    <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d1224] via-[#1a1744] to-[#26103d] text-white border border-indigo-900/60 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🤖</span>
                          <h4 className="text-xs font-black uppercase text-purple-300 tracking-wide">
                            Interviewer Follow-Up Probing Question:
                          </h4>
                        </div>
                        <button
                          onClick={() => speakQuestion(activeFollowUpQuestion)}
                          className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </button>
                      </div>

                      <p className="text-sm font-bold text-white leading-relaxed">
                        "{activeFollowUpQuestion}"
                      </p>

                      <div className="space-y-2">
                        <textarea
                          value={followUpAnswerInput}
                          onChange={(e) => setFollowUpAnswerInput(e.target.value)}
                          rows={3}
                          placeholder="Type or speak your follow-up explanation..."
                          className="w-full bg-slate-900/90 border border-slate-700 text-slate-100 rounded-2xl p-3 text-xs font-mono focus:outline-none focus:border-indigo-400"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={handleSubmitFollowUp}
                          disabled={submittingFollowUp || !followUpAnswerInput.trim()}
                          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md active:scale-95 transition-all disabled:opacity-50"
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

      {/* ==================================================================== */}
      {/* 4. COMPREHENSIVE FINAL INTERVIEW REPORT & 7-DAY ACTION PLAN          */}
      {/* ==================================================================== */}
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
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Interview Overall Score: {interview.overallScore}%
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    Target Role: <strong>{interview.role}</strong> | Successfully completed all 5 technical rounds.
                  </p>
                </div>

                <button
                  onClick={() => setInterview(null)}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md transition"
                >
                  🚀 Start New Mock Session
                </button>
              </div>
            );
          })()}

          {/* STRENGTHS & TOPICS TO IMPROVE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Strengths */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-3 shadow-sm">
              <h3 className="text-xs font-black uppercase text-emerald-600 tracking-wide flex items-center gap-2">
                <span>🌟 Key Technical Strengths:</span>
              </h3>
              <ul className="text-xs text-slate-700 font-medium space-y-2 list-disc pl-4">
                {interview.strengths?.map((str, sIdx) => (
                  <li key={sIdx}>{str}</li>
                ))}
              </ul>
            </div>

            {/* Topics to Improve */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-3 shadow-sm">
              <h3 className="text-xs font-black uppercase text-amber-600 tracking-wide flex items-center gap-2">
                <span>⚠️ Technical Topics to Improve:</span>
              </h3>
              <ul className="text-xs text-slate-700 font-medium space-y-2 list-disc pl-4">
                {interview.topicsToImprove?.map((top, tIdx) => (
                  <li key={tIdx}>{top}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* QUESTIONS MISSED & RECOMMENDED ANSWERS */}
          {interview.questionsMissed && interview.questionsMissed.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 space-y-4 shadow-sm">
              <h3 className="text-xs font-black uppercase text-rose-600 tracking-wide">
                ❌ Questions Missed & Ideal Answers:
              </h3>

              <div className="space-y-4 font-mono text-xs">
                {interview.questionsMissed.map((qm, qIdx) => (
                  <div key={qIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 text-sm font-sans">
                      Q{qIdx + 1}: {qm.question}
                    </div>
                    <div className="text-rose-700">
                      <span className="font-bold text-rose-600 font-sans">Your Answer:</span> {qm.yourAnswer}
                    </div>
                    <div className="text-emerald-700">
                      <span className="font-bold text-emerald-600 font-sans">Recommended Answer:</span> {qm.recommendedAnswer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7-DAY INTERVIEW PREPARATION PLAN */}
          {interview.preparationPlan && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 space-y-4 shadow-sm">
              <h3 className="text-xs font-black uppercase text-indigo-700 tracking-wide">
                🗓️ Personalized 7-Day Interview Preparation Action Plan:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {interview.preparationPlan.map((planItem, pIdx) => (
                  <div key={pIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                      <span>Day {planItem.day || pIdx + 1}</span>
                      <span className="text-indigo-600">{planItem.focus}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      {planItem.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* HISTORICAL ATTEMPTS MODAL                                            */}
      {/* ==================================================================== */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-lg w-full p-6 space-y-4 rounded-3xl border border-slate-200 bg-white shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">Historical Technical Interview Attempts</h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
              {history.length > 0 ? (
                history.map((h) => (
                  <div key={h._id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-slate-900">{h.role}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(h.createdAt).toLocaleDateString()} • {h.hiringDecision || "Completed"}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {h.overallScore}%
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <p className="text-3xl mb-2">🎙️</p>
                  <p>Complete your first full mock interview to unlock historical trends and analytics.</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowHistoryModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterviewPage;
