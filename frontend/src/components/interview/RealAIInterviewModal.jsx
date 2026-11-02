import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Play,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Brain,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Award,
  Clock,
  ChevronRight,
  TrendingUp,
  Sliders,
  X,
  MessageSquare,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  startCopilotInterview,
  evaluateInterviewTurn,
  submitInterviewFollowUpTurn,
  completeCopilotInterview,
} from "../../services/api";

const INTERVIEW_TYPES = [
  { id: "Technical Interview", label: "Technical Interview", icon: "💻", desc: "Rigorous system and code architecture probing" },
  { id: "Viva / University Interview", label: "Viva / University Interview", icon: "🎓", desc: "Academic definitions, derivations, proofs & oral viva" },
  { id: "Concept Interview", label: "Concept Interview", icon: "🧠", desc: "Deep conceptual invariants & first principles" },
  { id: "Placement Interview", label: "Placement Interview", icon: "💼", desc: "Tier-1 company rounds with edge case pressure" },
  { id: "Rapid Fire", label: "Rapid Fire", icon: "⚡", desc: "Fast-paced intuition & instant knowledge verification" },
  { id: "Beginner Learning Interview", label: "Beginner Learning Interview", icon: "🌱", desc: "Gentle step-by-step Socratic teaching & guidance" },
];

const SUBJECTS_CATALOG = [
  {
    name: "Computer Networks",
    topics: [
      "IP Subnetting & CIDR",
      "TCP 3-Way Handshake & Flow Control",
      "OSI & TCP/IP Reference Models",
      "DNS Resolution Architecture",
      "Routing Protocols (OSPF vs BGP)",
      "Congestion Control (TCP Reno vs Tahoe)",
    ],
  },
  {
    name: "Operating Systems",
    topics: [
      "Process vs Thread & Context Switching",
      "CPU Scheduling Algorithms",
      "Deadlock & Banker's Algorithm",
      "Virtual Memory & Paging Mechanisms",
      "Synchronization & Semaphores",
      "Disk Scheduling & Inodes",
    ],
  },
  {
    name: "Database Management Systems",
    topics: [
      "Normalization (1NF, 2NF, 3NF, BCNF)",
      "Transactions & ACID Mechanics",
      "Indexing & B+ Tree Architecture",
      "SQL Joins & Execution Query Plans",
      "Concurrency Control & 2PL Locking",
    ],
  },
  {
    name: "Data Structures & Algorithms",
    topics: [
      "Binary Search & Invariant Reasoning",
      "Binary Search Trees & AVL Balancing",
      "Dynamic Programming (Memoization vs Tabulation)",
      "Graph Algorithms (Dijkstra vs Bellman-Ford)",
      "QuickSort & Divide and Conquer Analysis",
    ],
  },
];

export const RealAIInterviewModal = ({
  isOpen,
  onClose,
  initialContext = {},
  onCompleteSession,
}) => {
  // Phase 1: Configuration, Phase 2: Live Interview, Phase 3: Mentor Verdict & Action Plan
  const [phase, setPhase] = useState("config"); // 'config' | 'live' | 'summary'

  // Configuration options
  const [subject, setSubject] = useState(initialContext.subjectName || "Computer Networks");
  const [topic, setTopic] = useState(initialContext.topicName || "IP Subnetting & CIDR");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [interviewType, setInterviewType] = useState("Technical Interview");
  const [numQuestions, setNumQuestions] = useState(5);
  const [language, setLanguage] = useState("English"); // English, Hindi, Hinglish
  const [durationMinutes, setDurationMinutes] = useState(15);

  // Live session state
  const [session, setSession] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [turnIndex, setTurnIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState(null);

  // Student answer state
  const [answerMode, setAnswerMode] = useState("text"); // 'voice' | 'text'
  const [answerText, setAnswerText] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [retestAnswer, setRetestAnswer] = useState("");

  // Sub-turn stage within active question:
  // 'answering' -> 'evaluation_reaction' -> 'follow_up' -> 'teaching' -> 'done'
  const [stage, setStage] = useState("answering");

  // Voice Interaction (Speech Recognition & Speech Synthesis)
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const recognitionRef = useRef(null);

  // Timer countdown
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const timerRef = useRef(null);

  // Keep topics in sync with chosen subject
  const currentSubjectObj = SUBJECTS_CATALOG.find((s) => s.name === subject) || SUBJECTS_CATALOG[0];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === "Hindi" ? "hi-IN" : "en-US";

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswerText((prev) => {
          const trimmed = prev.trim();
          return trimmed ? `${trimmed} ${transcript}` : transcript;
        });
      };

      recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn("Could not setup SpeechRecognition:", err);
      setVoiceSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, [language]);

  // Text-To-Speech helper
  const speakText = (text) => {
    if (!ttsEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      if (language === "Hindi") utterance.lang = "hi-IN";
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS notice:", e);
    }
  };

  // Timer runner
  useEffect(() => {
    if (phase === "live" && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleFinishInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setAnswerMode("voice");
      } catch (err) {
        console.warn("Recognition start error:", err);
      }
    }
  };

  // 1. Launch Interview
  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const res = await startCopilotInterview({
        subject,
        topic,
        difficulty,
        interviewType,
        totalQuestions: numQuestions,
        language,
        durationMinutes,
      });

      if (res.data?.session) {
        setSession(res.data.session);
        setCurrentTurn(res.data.currentTurn || res.data.session.turns[0]);
        setTurnIndex(0);
        setPhase("live");
        setStage("answering");
        setSecondsRemaining(durationMinutes * 60);
        setAnswerText("");
        setEvalResult(null);

        // Examiner introduces question
        const examinerQuestion = res.data.currentTurn?.questionText || res.data.session.turns[0]?.questionText;
        speakText(`Let's begin. ${examinerQuestion}`);
      }
    } catch (err) {
      console.error("Start interview error:", err);
      alert("Could not initialize live interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Student Answer to Examiner
  const handleSubmitAnswer = async () => {
    if (!answerText.trim() || !session) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setEvaluating(true);
    try {
      const res = await evaluateInterviewTurn(session._id, {
        turnIndex,
        studentAnswer: answerText,
        answerType: answerMode,
        timeTakenSeconds: 15,
      });

      const data = res.data;
      setEvalResult(data);

      // Examiner speaks reaction
      if (data.examinerReaction) {
        speakText(data.examinerReaction);
      }

      // Determine next flow step
      if (data.teachingIntervention?.needed) {
        setStage("teaching");
      } else if (data.followUpQuestion) {
        setStage("follow_up");
      } else {
        setStage("evaluation_reaction");
      }
    } catch (err) {
      console.error("Evaluate turn error:", err);
      alert("Evaluation failed. Retrying...");
    } finally {
      setEvaluating(false);
    }
  };

  // 3. Submit Follow-up response
  const handleFollowUpSubmit = async () => {
    if (!session || !followUpAnswer.trim()) return;
    setEvaluating(true);
    try {
      const res = await submitInterviewFollowUpTurn(session._id, {
        turnIndex,
        followUpAnswer,
        isRetest: false,
      });

      if (res.data?.hasNextTurn) {
        handleAdvanceToNextQuestion(res.data.nextQuestion, res.data.nextTurnIndex);
      } else {
        handleFinishInterview();
      }
    } catch (err) {
      console.error("Follow-up error:", err);
    } finally {
      setEvaluating(false);
    }
  };

  // 4. Submit Retest after micro-lesson
  const handleRetestSubmit = async () => {
    if (!session || !retestAnswer.trim()) return;
    setEvaluating(true);
    try {
      const res = await submitInterviewFollowUpTurn(session._id, {
        turnIndex,
        followUpAnswer: retestAnswer,
        isRetest: true,
      });

      speakText("Good recovery. You demonstrated clear improvement.");
      if (res.data?.hasNextTurn) {
        handleAdvanceToNextQuestion(res.data.nextQuestion, res.data.nextTurnIndex);
      } else {
        handleFinishInterview();
      }
    } catch (err) {
      console.error("Retest error:", err);
    } finally {
      setEvaluating(false);
    }
  };

  // 5. Advance to next question turn
  const handleAdvanceToNextQuestion = (nextQ, nextIdx) => {
    setTurnIndex(nextIdx);
    setCurrentTurn(nextQ || session.turns[nextIdx]);
    setStage("answering");
    setAnswerText("");
    setFollowUpAnswer("");
    setRetestAnswer("");
    setEvalResult(null);

    const nextPrompt = nextQ?.questionText || session.turns[nextIdx]?.questionText;
    speakText(`Next question: ${nextPrompt}`);
  };

  // 6. Complete Interview & Final Report
  const handleFinishInterview = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await completeCopilotInterview(session._id);
      if (res.data?.summary) {
        setSession((prev) => ({ ...prev, summary: res.data.summary, status: "completed" }));
        setPhase("summary");
        if (onCompleteSession) onCompleteSession(res.data.session);
      }
    } catch (err) {
      console.error("Complete interview error:", err);
      setPhase("summary");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* ================= MODAL HEADER ================= */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                  REAL AI EXAM EXAMINER
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-emerald-400 font-bold">Interactive Learning Loop</span>
              </div>
              <h2 className="text-base font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {subject} • <span className="text-slate-400 font-normal">{topic}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {phase === "live" && (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{formatTimer(secondsRemaining)}</span>
                </div>

                <button
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                  title={ttsEnabled ? "Mute Examiner Voice" : "Enable Examiner Voice"}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                >
                  {ttsEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= BODY CONTENT ================= */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* ================= PHASE 1: CONFIGURATION ================= */}
          {phase === "config" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <span className="text-3xl">🎙️</span>
                <h3 className="text-2xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Configure Your Real AI Interview
                </h3>
                <p className="text-xs text-slate-400 max-w-lg mx-auto">
                  Experience a genuine oral examination and technical defense. The AI examiner evaluates your answers, challenges boundary conditions, identifies root weaknesses, and teaches before advancing.
                </p>
              </div>

              {/* 1. Subject & Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      const sObj = SUBJECTS_CATALOG.find((s) => s.name === e.target.value);
                      if (sObj?.topics?.[0]) setTopic(sObj.topics[0]);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {SUBJECTS_CATALOG.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {currentSubjectObj.topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2. Interview Type Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Interview Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {INTERVIEW_TYPES.map((t) => {
                    const isSelected = interviewType === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setInterviewType(t.id)}
                        className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? "bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/30 text-white"
                            : "bg-slate-800/60 border-slate-700/80 hover:border-slate-600 text-slate-300"
                        }`}
                      >
                        <span className="text-xl">{t.icon}</span>
                        <div>
                          <div className="text-xs font-bold">{t.label}</div>
                          <div className="text-[11px] text-slate-400 leading-snug">{t.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Difficulty, Language, Duration & Questions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="English">English</option>
                    <option value="Hinglish">Hinglish</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Questions</label>
                  <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions</option>
                    <option value={7}>7 Questions</option>
                    <option value={10}>10 Questions</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Duration</label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value={10}>10 Mins</option>
                    <option value={15}>15 Mins</option>
                    <option value={20}>20 Mins</option>
                    <option value={30}>30 Mins</option>
                  </select>
                </div>
              </div>

              {/* Start CTA */}
              <div className="pt-4">
                <button
                  onClick={handleStartInterview}
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition transform hover:scale-[1.01]"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Initializing Live AI Examiner...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-amber-300" />
                      <span>Start Live AI Interview Now →</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ================= PHASE 2: LIVE INTERVIEW SCREEN ================= */}
          {phase === "live" && currentTurn && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Question Banner */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                    Question {turnIndex + 1} of {session.totalQuestions}
                  </span>
                  <span>•</span>
                  <span className="text-slate-300">{currentTurn.subtopic || topic}</span>
                </div>
                <span className="text-amber-400">Difficulty: {currentTurn.difficulty || difficulty}</span>
              </div>

              {/* AI Interviewer Speech Bubble */}
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20 text-xl">
                    👨‍🏫
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-black uppercase text-indigo-400 tracking-wider">
                        AI Examiner (Prof. Vance)
                      </div>
                      {ttsEnabled && (
                        <button
                          onClick={() => speakText(currentTurn.questionText)}
                          className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Replay Question</span>
                        </button>
                      )}
                    </div>
                    <p className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed">
                      "{currentTurn.questionText}"
                    </p>
                  </div>
                </div>

                {/* Socratic Feedback Reaction if already answered */}
                {evalResult && (
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-amber-300">
                        "{evalResult.examinerReaction}"
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 space-y-1.5">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>Feedback & Technical Assessment:</span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                            evalResult.status === "correct"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : evalResult.status === "partially_correct"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-rose-500/20 text-rose-300"
                          }`}
                        >
                          {evalResult.score}/100 • {evalResult.status?.toUpperCase().replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-slate-300">{evalResult.critique}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* STAGE A: Answering Question */}
              {stage === "answering" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <span>Choose Response Method:</span>
                      <button
                        onClick={() => setAnswerMode("voice")}
                        className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                          answerMode === "voice"
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>🎙️ Speak Answer</span>
                      </button>
                      <button
                        onClick={() => setAnswerMode("text")}
                        className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                          answerMode === "text"
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <span>⌨️ Type Answer</span>
                      </button>
                    </div>

                    {voiceSupported && (
                      <button
                        onClick={toggleListening}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                          isListening
                            ? "bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30"
                            : "bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                        }`}
                      >
                        {isListening ? (
                          <>
                            <MicOff className="w-4 h-4" />
                            <span>Stop Speaking</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 text-emerald-400" />
                            <span>Click to Speak</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    rows={4}
                    placeholder="Speak into microphone or type your technical response here (e.g. state formulas, boundary cases, subnet mask logic)..."
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 leading-relaxed font-sans shadow-inner"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {isListening ? "🔴 Listening to microphone..." : "Explain concept, formulas, and trade-offs clearly."}
                    </span>

                    <button
                      onClick={handleSubmitAnswer}
                      disabled={evaluating || !answerText.trim()}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
                    >
                      {evaluating ? (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          <span>AI Evaluating Accuracy...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Answer to Examiner</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE B: Socratic Follow-Up Probe */}
              {stage === "follow_up" && evalResult && (
                <div className="p-6 rounded-3xl bg-indigo-950/40 border border-indigo-800/60 space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-indigo-400">
                      <Brain className="w-4 h-4" />
                      <span>Examiner Socratic Follow-Up:</span>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      "{evalResult.followUpQuestion}"
                    </p>
                  </div>

                  <textarea
                    value={followUpAnswer}
                    onChange={(e) => setFollowUpAnswer(e.target.value)}
                    rows={3}
                    placeholder="Elaborate on this specific trade-off or boundary..."
                    className="w-full bg-slate-900 border border-indigo-800/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={handleFollowUpSubmit}
                      disabled={evaluating || !followUpAnswer.trim()}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-md"
                    >
                      {evaluating ? "Evaluating..." : "Answer Follow-up & Proceed →"}
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE C: Interactive Teaching & Retest if student struggled */}
              {stage === "teaching" && evalResult?.teachingIntervention && (
                <div className="p-6 rounded-3xl bg-purple-950/40 border border-purple-800/60 space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-purple-400">
                    <BookOpen className="w-4 h-4" />
                    <span>Examiner Teaches Before Continuing:</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-800/40 text-xs text-slate-200 leading-relaxed">
                    {evalResult.teachingIntervention.microLesson}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-purple-300">
                      Try Again (Proof of Understanding): {evalResult.teachingIntervention.retestQuestion}
                    </label>
                    <textarea
                      value={retestAnswer}
                      onChange={(e) => setRetestAnswer(e.target.value)}
                      rows={3}
                      placeholder="Apply the concept taught above to prove mastery..."
                      className="w-full bg-slate-900 border border-purple-800/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      onClick={handleRetestSubmit}
                      disabled={evaluating || !retestAnswer.trim()}
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-md"
                    >
                      {evaluating ? "Evaluating Recovery..." : "Submit Retest & Continue →"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= PHASE 3: FINAL MENTOR VERDICT & ACTION PLAN ================= */}
          {phase === "summary" && session?.summary && (
            <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
              <div className="text-center space-y-2">
                <span className="text-4xl">🏆</span>
                <h3 className="text-2xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Official Examiner Verdict & Performance Defense
                </h3>
                <p className="text-xs text-slate-400">{session.summary.overallVerdict}</p>
              </div>

              {/* KPI Score Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase">Overall Viva Score</div>
                  <div className="text-2xl font-black text-indigo-400">{session.summary.overallScore}%</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase">Mastery Delta</div>
                  <div className="text-2xl font-black text-emerald-400">+{session.summary.conceptMasteryDelta}%</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase">Identified Weaknesses</div>
                  <div className="text-2xl font-black text-amber-400">{session.summary.identifiedWeaknesses?.length || 0}</div>
                </div>
              </div>

              {/* Action Plan */}
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-indigo-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>3-Day Targeted Remediation Plan:</span>
                </div>

                <div className="space-y-2.5">
                  {session.summary.actionPlan?.map((plan) => (
                    <div key={plan.day} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                      <span className="px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-xs font-black">
                        Day {plan.day}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-white">{plan.focus}</div>
                        <div className="text-[11px] text-slate-400">{plan.action}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTAs */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setPhase("config");
                    setSession(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Take Another Interview</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
                >
                  Return to Exam Prep Portal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealAIInterviewModal;

