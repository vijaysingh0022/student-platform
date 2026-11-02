import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Clock,
  Mic,
  MicOff,
  Send,
  HelpCircle,
  Code2,
  ChevronRight,
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowRight,
  LogOut,
  Volume2,
  VolumeX,
  Bot,
  Terminal,
  Play
} from 'lucide-react';

export default function InterviewRoom({
  interview,
  onAnswerSubmit,
  onFollowUpSubmit,
  onRequestHint,
  onEndEarly,
  loading = false
}) {
  const [answerText, setAnswerText] = useState('');
  const [codeAnswer, setCodeAnswer] = useState('');
  const [activeTab, setActiveTab] = useState('explanation'); // 'explanation' | 'code'
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [hints, setHints] = useState([]);
  const [hintLoading, setHintLoading] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(
    (interview?.durationMinutes || 30) * 60
  );

  const recognitionRef = useRef(null);
  const currentQIndex = interview?.currentQuestionIndex || 0;
  const questions = interview?.questions || [];
  const currentQ = questions[currentQIndex] || {};
  const isCoding = currentQ.type === 'coding' || currentQ.topic?.toLowerCase().includes('dsa') || currentQ.topic?.toLowerCase().includes('array');
  const isFollowUpActive = Boolean(currentQ.followUpQuestion && !currentQ.followUpAnswer);

  // Synchronize hints from server whenever current question changes
  useEffect(() => {
    setHints(currentQ.hints || []);
    setAnswerText('');
    setCodeAnswer(currentQ.codeSolution || (isCoding ? '# Write your solution below\ndef solution(args):\n    # TODO: Implement\n    pass' : ''));
  }, [currentQIndex, currentQ]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Web Speech API initialization
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswerText((prev) => {
          const trimmed = prev.trim();
          return trimmed ? `${trimmed} ${transcript}` : transcript;
        });
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Could not initialize speech recognition:', err);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Error starting speech:', err);
      }
    }
  };

  const handleHintClick = async () => {
    if (hintLoading) return;
    const nextLevel = hints.length + 1;
    if (nextLevel > 3) return;

    setHintLoading(true);
    try {
      const hintObj = await onRequestHint(currentQIndex, nextLevel);
      if (hintObj) {
        setHints((prev) => [...prev, hintObj]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setHintLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const payload = isCoding
      ? `${answerText}\n\n[Code Submission (${interview.language || 'python'})]:\n${codeAnswer}`
      : answerText;

    if (!payload.trim()) return;

    if (isFollowUpActive) {
      onFollowUpSubmit(currentQIndex, answerText);
    } else {
      onAnswerSubmit(currentQIndex, payload, codeAnswer);
    }
  };

  const getDifficultyBadge = (diff) => {
    const map = {
      easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      medium: 'bg-amber-50 text-amber-700 border-amber-200',
      hard: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return map[diff?.toLowerCase()] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 px-4 sm:px-6 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Simulator
            </span>
          </div>
          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
          <div>
            <span className="text-xs sm:text-sm font-semibold text-white capitalize">
              {interview?.interviewType?.replace('-', ' ')} Interview
            </span>
            <span className="text-[11px] text-slate-400 hidden md:inline ml-2">
              • Simulated for {interview?.targetRole || 'Software Engineer'}
            </span>
          </div>
        </div>

        {/* Center Progress & Timer */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-center hidden sm:block">
            <div className="text-xs font-medium text-slate-400">
              Question <span className="text-white font-bold">{currentQIndex + 1}</span> of{' '}
              <span className="text-white font-bold">{questions.length || 5}</span>
            </div>
            <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQIndex + 1) / (questions.length || 1)) * 100}%`
                }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs sm:text-sm font-mono font-bold text-slate-200">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span className={secondsRemaining < 300 ? 'text-rose-400 animate-pulse' : ''}>
              {formatTimer(secondsRemaining)}
            </span>
          </div>

          <button
            onClick={() => setShowExitConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
            title="Exit Interview"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </header>

      {/* Main Interview Body: 2 Columns */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto">
        {/* Left / Center Area: Interviewer + Question + Answer */}
        <main className="flex-1 flex flex-col overflow-y-auto px-4 sm:px-8 py-6 max-w-5xl mx-auto w-full space-y-6">
          
          {/* AI Interviewer Avatar & Prompt Header */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/60 border border-slate-800/90 shadow-lg flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Bot className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {interview?.interviewerPersonality?.name || 'Dr. Sarah Vance'}
                    <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      AI Interviewer
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {interview?.interviewerPersonality?.role || 'Professional Technical Interviewer'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold uppercase px-2.5 py-1 rounded-md border ${getDifficultyBadge(currentQ.difficulty)}`}>
                    {currentQ.difficulty || 'Intermediate'}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {currentQ.topic || 'System Design'}
                  </span>
                </div>
              </div>

              {/* Conversational lead-in */}
              <div className="mt-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs sm:text-sm text-slate-300 flex items-center gap-2.5">
                <div className="flex gap-0.5">
                  <span className="w-1 h-3 bg-indigo-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-4 bg-indigo-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
                </div>
                <span>
                  {isFollowUpActive
                    ? 'Let’s go one step deeper on your response:'
                    : 'Let’s discuss your technical approach and conceptual reasoning for this problem:'}
                </span>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/80 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                {isFollowUpActive ? currentQ.followUpQuestion : currentQ.questionText}
              </h2>
            </div>

            {/* If there are hints unlocked */}
            {hints.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Hints Provided ({hints.length}/3)
                </div>
                {hints.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200"
                  >
                    <span className="font-semibold text-amber-300">Level {h.level || i + 1}: </span>
                    {h.text}
                  </div>
                ))}
              </div>
            )}

            {/* Hint action button */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleHintClick}
                disabled={hintLoading || hints.length >= 3}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-40 disabled:hover:text-indigo-400 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                {hints.length >= 3
                  ? 'All 3 hints unlocked'
                  : hintLoading
                  ? 'Generating hint...'
                  : `Need a hint? (Level ${hints.length + 1} of 3)`}
              </button>

              <span className="text-[11px] text-slate-500">
                Hints slightly adjust final score weighting
              </span>
            </div>
          </div>

          {/* Answer Area */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isCoding && (
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('explanation')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'explanation'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Conceptual Approach
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                    activeTab === 'code'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Code Solution ({interview.language || 'python'})
                </button>
              </div>
            )}

            {/* Text input area */}
            {(!isCoding || activeTab === 'explanation') && (
              <div className="relative">
                <textarea
                  rows={isCoding ? 5 : 7}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder={
                    isFollowUpActive
                      ? 'Provide your follow-up reasoning, addressing edge cases or trade-offs...'
                      : 'Explain your reasoning, architectural decisions, complexity, and trade-offs clearly...'
                  }
                  className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 leading-relaxed resize-none shadow-inner font-sans"
                />

                <div className="flex items-center justify-between text-xs text-slate-500 px-1 mt-1.5">
                  <span className="flex items-center gap-1.5">
                    {answerText.trim().split(/\s+/).filter(Boolean).length} words
                    {isListening && (
                      <span className="flex items-center gap-1 text-rose-400 font-semibold animate-pulse ml-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Microphone Active — Listening...
                      </span>
                    )}
                  </span>
                  <span>Shift + Enter for new lines</span>
                </div>
              </div>
            )}

            {/* Code Solution area */}
            {isCoding && activeTab === 'code' && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner">
                <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-mono text-slate-300">solution.{interview.language === 'python' ? 'py' : 'js'}</span>
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-indigo-400 font-semibold">
                    {interview.language || 'python'} 3.11
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={codeAnswer}
                  onChange={(e) => setCodeAnswer(e.target.value)}
                  className="w-full p-4 bg-slate-950 text-indigo-200 font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed"
                  spellCheck="false"
                />
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                      isListening
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4" />
                        Stop Voice
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 text-indigo-400" />
                        Speak Answer
                      </>
                    )}
                  </button>
                )}

                {!speechSupported && (
                  <span className="text-[11px] text-slate-500">
                    Voice input unsupported on this browser (fallback to typing).
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || (!answerText.trim() && !codeAnswer.trim())}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                    Evaluating Intelligence...
                  </>
                ) : isFollowUpActive ? (
                  <>
                    Submit Follow-up
                    <Send className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Submit Answer
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </main>

        {/* Right Sidebar: Question Flow & Real-Time Telemetry */}
        <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-950/60 p-5 shrink-0 flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Interview Roadmap
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Adaptive flow adjusts dynamically
              </p>
            </div>

            <div className="space-y-2">
              {questions.map((q, idx) => {
                const isCompleted = idx < currentQIndex;
                const isCurrent = idx === currentQIndex;
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      isCurrent
                        ? 'bg-indigo-600/10 border-indigo-500/40 text-white font-medium shadow-sm'
                        : isCompleted
                        ? 'bg-slate-900/50 border-slate-800 text-slate-400'
                        : 'bg-transparent border-slate-800/60 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <span className="w-4 h-4 rounded-full border-2 border-indigo-400 flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                        </span>
                      ) : (
                        <Circle className="w-4 h-4 text-slate-700 shrink-0" />
                      )}
                      <span className="truncate">
                        {idx + 1}. {q.topic || `Question ${idx + 1}`}
                      </span>
                    </div>

                    {isCurrent && (
                      <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                        Live
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pressure & Simulation Info */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Simulated Style</span>
                <span className="text-slate-200 capitalize font-medium">
                  {interview?.companyStyle || 'Product Company'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Pressure Mode</span>
                <span className={`capitalize font-semibold ${
                  interview?.pressureLevel === 'high' ? 'text-rose-400' : 'text-slate-200'
                }`}>
                  {interview?.pressureLevel || 'Medium'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Hints Remaining</span>
                <span className="text-slate-200 font-mono font-bold">
                  {3 - hints.length}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-800/80">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">Coach Note:</span> Answer questions thoroughly with complexity analysis. Follow-ups probe deep conceptual understanding.
            </div>
          </div>
        </aside>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h4 className="text-base font-bold text-white">End Interview Early?</h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Are you sure you want to exit? Your answers evaluated so far will still generate an educational performance report and update your Skill Graph accordingly.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Continue Interview
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  onEndEarly();
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all"
              >
                End & View Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
