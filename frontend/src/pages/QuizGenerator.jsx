import React, { useState, useEffect } from "react";
import { generateQuiz, evaluateQuiz, getRecentQuizzes, getQuizById } from "../services/api";

const PRESET_TOPICS = [
  {
    title: "Operating Systems: Virtual Memory & Paging",
    category: "OS",
    icon: "💻",
    text: "Virtual memory maps virtual addresses used by an application onto physical addresses in computer memory (RAM). The Memory Management Unit (MMU) performs address translation. Paging divides virtual address space into fixed-size blocks called pages, and physical memory into frames. The Page Table stores page-to-frame mappings. A Page Fault occurs when a program attempts to access a page that is mapped in address space but not loaded into physical RAM. Demand paging loads pages only when requested. Thrashing happens when the OS spends more time swapping pages in and out of secondary storage than executing actual processes due to high memory contention.",
  },
  {
    title: "Database Systems: ACID & Transactions",
    category: "DBMS",
    icon: "🗄️",
    text: "A database transaction is a logical unit of processing that includes one or more database access operations. ACID properties guarantee database reliability: Atomicity ensures all transaction operations succeed or none are applied (All-or-Nothing). Consistency ensures the database transitions between valid states preserving all integrity constraints. Isolation ensures concurrent transactions execute without interfering with one another, preventing dirty reads and non-repeatable reads. Durability guarantees that once a transaction commits, its changes survive power loss or system failure through Write-Ahead Logging (WAL).",
  },
  {
    title: "Machine Learning: Overfitting & Bias-Variance",
    category: "AI/ML",
    icon: "🤖",
    text: "Supervised machine learning algorithms learn a mapping from input features to target outputs. Overfitting occurs when a model learns noise and idiosyncrasies of training data instead of generalizable patterns, resulting in low training error but high test error. Underfitting occurs when the model is too simple to capture the underlying pattern. The Bias-Variance Tradeoff is the fundamental balance in supervised learning: High Bias causes underfitting, whereas High Variance causes overfitting. Regularization techniques like L1 (Lasso) and L2 (Ridge) add penalty terms to the loss function to constrain model complexity.",
  },
  {
    title: "Computer Networks: TCP vs UDP & 3-Way Handshake",
    category: "CN",
    icon: "🌐",
    text: "The Transport Layer provides process-to-process communication. Transmission Control Protocol (TCP) is a connection-oriented, reliable protocol offering ordered delivery, flow control via sliding windows, and congestion control. Establishing a TCP connection requires a 3-way handshake: Client sends SYN, Server replies with SYN-ACK, and Client confirms with ACK. User Datagram Protocol (UDP) is connectionless, unreliable, and lightweight with minimal header overhead (8 bytes compared to TCP 20-60 bytes), making it ideal for real-time applications like video streaming, gaming, and DNS queries.",
  },
];

export default function QuizGenerator() {
  // Input states
  const [activeTab, setActiveTab] = useState("upload"); // "upload" | "transcript" | "presets"
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");
  const [sourceTitle, setSourceTitle] = useState("");
  
  // Quiz config
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionType, setQuestionType] = useState("Mixed");
  const [questionCount, setQuestionCount] = useState(5);

  // Process & Assessment states
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [evaluating, setEvaluating] = useState(false);
  const [results, setResults] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "correct" | "incorrect"
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [copiedStatus, setCopiedStatus] = useState(false);

  // Fetch recent quizzes on mount
  useEffect(() => {
    fetchRecent();
  }, []);

  const fetchRecent = async () => {
    try {
      const res = await getRecentQuizzes();
      if (res.data?.quizzes) {
        setRecentQuizzes(res.data.quizzes);
      }
    } catch (err) {
      // ignore
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (activeTab === "upload" && !file) {
      alert("Please select or drop a file (PDF, PPT, DOC, or Video transcript).");
      return;
    }
    if (activeTab === "transcript" && (!transcriptText || transcriptText.trim().length < 30)) {
      alert("Please enter or paste at least 30 characters of transcript or study text.");
      return;
    }

    setLoading(true);
    setQuiz(null);
    setResults(null);
    setUserAnswers({});
    setCurrentQuestionIdx(0);

    const steps = [
      "Parsing content & extracting knowledge graph...",
      "Analyzing difficulty parameters & key terminology...",
      "Synthesizing high-yield questions with multi-tiered options...",
      "Formulating explanations and validation criteria...",
    ];
    let stepIdx = 0;
    setLoadingMessage(steps[0]);
    const stepInterval = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setLoadingMessage(steps[stepIdx]);
    }, 1600);

    try {
      let resp;
      if (activeTab === "upload" && file) {
        const form = new FormData();
        form.append("file", file);
        form.append("difficulty", difficulty);
        form.append("questionType", questionType);
        form.append("count", questionCount);
        resp = await generateQuiz(form);
      } else {
        const payload = {
          text: transcriptText,
          topic: sourceTitle || "Study Material",
          difficulty,
          questionType,
          count: questionCount,
        };
        resp = await generateQuiz(payload);
      }

      clearInterval(stepInterval);
      setLoading(false);

      if (resp.data?.success && resp.data?.questions?.length > 0) {
        setQuiz(resp.data);
        fetchRecent();
      } else {
        alert("Could not generate quiz from this source. Please try another file or topic.");
      }
    } catch (err) {
      clearInterval(stepInterval);
      setLoading(false);
      console.error(err);
      alert(err.response?.data?.message || "Quiz generation failed. Please try again.");
    }
  };

  const handleSelectAnswer = (qId, answerVal) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: answerVal,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    const answeredCount = Object.keys(userAnswers).length;
    if (answeredCount < quiz.questions.length) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${quiz.questions.length} questions. Submit anyway?`
      );
      if (!confirmSubmit) return;
    }

    setEvaluating(true);
    try {
      const answersPayload = quiz.questions.map((q) => ({
        questionId: q.id,
        answer: userAnswers[q.id] || "",
      }));

      const res = await evaluateQuiz({
        quizId: quiz.quizId,
        answers: answersPayload,
      });

      setEvaluating(false);
      if (res.data?.success) {
        setResults(res.data);
      }
    } catch (err) {
      setEvaluating(false);
      console.error(err);
      alert(err.response?.data?.message || "Evaluation failed. Please try again.");
    }
  };

  const loadPastQuiz = async (quizId) => {
    try {
      setLoading(true);
      setLoadingMessage("Loading past assessment...");
      const res = await getQuizById(quizId);
      setLoading(false);
      if (res.data) {
        setQuiz(res.data);
        setResults(null);
        setUserAnswers({});
        setCurrentQuestionIdx(0);
      }
    } catch (err) {
      setLoading(false);
      alert("Could not load selected quiz.");
    }
  };

  const handleCopySummary = () => {
    if (!results) return;
    const text = `LearnX AI Quiz: ${results.title}\nScore: ${results.score}/${results.total} (${results.percentage}%)\nVerdict: ${results.performanceFeedback}`;
    navigator.clipboard.writeText(text);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  const currentQ = quiz?.questions ? quiz.questions[currentQuestionIdx] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold mb-3">
          <span>✨</span> AI Assessment & MCQ Intelligence
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI Quiz & MCQ Generator
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl mx-auto text-sm md:text-base">
          Convert study PDFs, lecture PPTs, Word documents, or video transcripts into interactive assessments with instant evaluation and deep contextual explanations.
        </p>
      </div>

      {/* Generator Form Card */}
      {!quiz && !results && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-10 transition-all hover:shadow-md">
          {/* Source Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/70 p-2 gap-2">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === "upload"
                  ? "bg-white text-violet-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <span>📁</span> Upload Document / Slides
            </button>
            <button
              onClick={() => setActiveTab("transcript")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === "transcript"
                  ? "bg-white text-violet-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <span>🎬</span> Paste Video Transcript / Notes
            </button>
            <button
              onClick={() => setActiveTab("presets")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === "presets"
                  ? "bg-white text-violet-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <span>⚡</span> 1-Click CSE Presets
            </button>
          </div>

          <div className="p-6">
            {/* Tab 1: Upload */}
            {activeTab === "upload" && (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive
                    ? "border-violet-500 bg-violet-50/60"
                    : file
                    ? "border-emerald-400 bg-emerald-50/30"
                    : "border-slate-300 hover:border-violet-400 bg-slate-50/30"
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.vtt,.srt"
                  onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center text-2xl mb-3 shadow-xs">
                    {file ? "📄" : "📤"}
                  </div>
                  {file ? (
                    <div>
                      <p className="font-bold text-slate-800 text-base">{file.name}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for AI assessment generation
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="mt-3 text-xs text-rose-600 font-semibold hover:underline"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Drag and drop your file here, or <span className="text-violet-600 underline">browse</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Supports PDF (.pdf), PowerPoint (.ppt, .pptx), Word (.doc, .docx), and Video Subtitles (.vtt, .srt, .txt) up to 25MB
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-200/80 text-[11px] font-bold text-slate-700">PDF</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-[11px] font-bold text-amber-800">PPT / PPTX</span>
                        <span className="px-2 py-0.5 rounded-md bg-sky-100 text-[11px] font-bold text-sky-800">DOC / DOCX</span>
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-[11px] font-bold text-purple-800">Video Transcript (VTT/SRT)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Transcript */}
            {activeTab === "transcript" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Source / Topic Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Stanford CS144 - Lecture 4 TCP Handshake"
                    value={sourceTitle}
                    onChange={(e) => setSourceTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Paste Video Transcript, Subtitles, or Study Notes
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Paste YouTube auto-generated transcript, lecture notes, textbook passages, or research articles..."
                    value={transcriptText}
                    onChange={(e) => setTranscriptText(e.target.value)}
                    className="w-full p-3.5 rounded-lg border border-slate-200 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                  />
                  <div className="flex justify-between items-center text-xs text-slate-500 mt-1">
                    <span>{transcriptText.length} characters</span>
                    <button
                      type="button"
                      onClick={() => setTranscriptText("")}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Presets */}
            {activeTab === "presets" && (
              <div>
                <p className="text-xs text-slate-500 mb-3">
                  Click any verified CS placement topic below to auto-populate study content and generate an instant quiz:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PRESET_TOPICS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setTranscriptText(preset.text);
                        setSourceTitle(preset.title);
                        setActiveTab("transcript");
                      }}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-violet-400 hover:bg-violet-50/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-lg">{preset.icon}</span>
                        <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-violet-100 group-hover:text-violet-700">
                          {preset.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-violet-700">
                        {preset.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {preset.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Configuration Controls */}
            <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Difficulty */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
                  {["Easy", "Medium", "Hard"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        difficulty === lvl
                          ? lvl === "Easy"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : lvl === "Medium"
                            ? "bg-violet-600 text-white shadow-xs"
                            : "bg-rose-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Types */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Question Format
                </label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                >
                  <option value="Mixed">Mixed (MCQ, T/F, Fill-in, Short)</option>
                  <option value="MCQ">Multiple Choice Only (MCQ)</option>
                  <option value="True/False">True / False Only</option>
                  <option value="Fill-in-blank">Fill-in-the-Blank Only</option>
                  <option value="Short Answer">Short Answer / Conceptual</option>
                </select>
              </div>

              {/* Question Count */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Number of Questions
                </label>
                <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl">
                  {[3, 5, 8, 12].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        questionCount === cnt
                          ? "bg-violet-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {cnt} Qs
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-sky-600 hover:from-violet-700 hover:to-sky-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>⚡</span> Generate AI Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="bg-white rounded-2xl border border-violet-200 p-12 text-center shadow-md mb-10 animate-pulse">
          <div className="w-16 h-16 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">Synthesizing AI Quiz</h3>
          <p className="text-sm text-violet-600 font-medium mt-1">{loadingMessage}</p>
          <p className="text-xs text-slate-400 mt-3">Analyzing document content and engineering questions...</p>
        </div>
      )}

      {/* Active Quiz Taking Interface */}
      {quiz && !results && !loading && (
        <div className="space-y-6 mb-12">
          {/* Quiz Header Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    quiz.difficulty === "Easy"
                      ? "bg-emerald-100 text-emerald-800"
                      : quiz.difficulty === "Medium"
                      ? "bg-violet-100 text-violet-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {quiz.difficulty} Difficulty
                </span>
                <span className="text-xs text-slate-500">• {quiz.sourceName}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{quiz.title}</h2>
              {quiz.summary && (
                <p className="text-xs text-slate-600 mt-1 max-w-2xl">{quiz.summary}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-500 font-medium">Progress</span>
                <p className="text-sm font-extrabold text-violet-700">
                  {Object.keys(userAnswers).length} / {quiz.questions.length} Answered
                </p>
              </div>
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={evaluating}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all"
              >
                {evaluating ? "Evaluating..." : "Submit & Grade"}
              </button>
            </div>
          </div>

          {/* Question Stepper / Navigator */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {quiz.questions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== "";
              const isCurrent = idx === currentQuestionIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`flex-shrink-0 w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-violet-600 text-white ring-2 ring-violet-300 shadow-xs"
                      : isAnswered
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Active Question Card */}
          {currentQ && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <span className="text-xs font-extrabold text-violet-700 uppercase tracking-wider">
                  Question {currentQuestionIdx + 1} of {quiz.questions.length}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {currentQ.type}
                </span>
              </div>

              <h3 className="text-base md:text-lg font-bold text-slate-900 leading-relaxed mb-6">
                {currentQ.prompt}
              </h3>

              {/* Multiple Choice Options */}
              {currentQ.type === "MCQ" && currentQ.options && (
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, oIdx) => {
                    const isSelected = userAnswers[currentQ.id] === opt;
                    const letter = String.fromCharCode(65 + oIdx);
                    return (
                      <div
                        key={oIdx}
                        onClick={() => handleSelectAnswer(currentQ.id, opt)}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-violet-50/80 border-violet-500 text-violet-950 font-semibold shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                            isSelected
                              ? "bg-violet-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {letter}
                        </div>
                        <span className="text-sm flex-1">{opt}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* True / False Options */}
              {currentQ.type === "True/False" && (
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  {["True", "False"].map((tfVal) => {
                    const isSelected = userAnswers[currentQ.id] === tfVal;
                    return (
                      <div
                        key={tfVal}
                        onClick={() => handleSelectAnswer(currentQ.id, tfVal)}
                        className={`p-4 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                          isSelected
                            ? tfVal === "True"
                              ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs"
                              : "bg-rose-50 border-rose-500 text-rose-800 shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-xl block mb-1">
                          {tfVal === "True" ? "👍" : "👎"}
                        </span>
                        {tfVal}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Fill in Blank */}
              {currentQ.type === "Fill-in-blank" && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600">
                    Type the missing keyword or term:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter missing term..."
                    value={userAnswers[currentQ.id] || ""}
                    onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
                    className="w-full max-w-md px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                  />
                </div>
              )}

              {/* Short Answer */}
              {currentQ.type === "Short Answer" && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600">
                    Write your conceptual explanation:
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide your concise explanation..."
                    value={userAnswers[currentQ.id] || ""}
                    onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                  />
                </div>
              )}

              {/* Navigation Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  ← Previous
                </button>
                {currentQuestionIdx < quiz.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIdx((p) => Math.min(quiz.questions.length - 1, p + 1))}
                    className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-xs"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    disabled={evaluating}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                  >
                    {evaluating ? "Grading..." : "Submit All Answers"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results & Instant Evaluation View */}
      {results && (
        <div className="space-y-6 mb-12 animate-fade-in-up">
          {/* Score Card Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div
                  className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-extrabold text-white shadow-md ${
                    results.percentage >= 80
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                      : results.percentage >= 60
                      ? "bg-gradient-to-br from-violet-500 to-indigo-600"
                      : "bg-gradient-to-br from-rose-500 to-amber-600"
                  }`}
                >
                  <span className="text-2xl leading-none">{results.percentage}%</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Score</span>
                </div>
                <div>
                  <span className="text-xs font-extrabold text-violet-700 uppercase tracking-wide">
                    Instant Evaluation Complete
                  </span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-0.5">
                    {results.title}
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    {results.performanceFeedback}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5"
                >
                  <span>📋</span> {copiedStatus ? "Copied!" : "Copy Report"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResults(null);
                    setUserAnswers({});
                    setCurrentQuestionIdx(0);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-violet-200 bg-violet-50 text-xs font-bold text-violet-700 hover:bg-violet-100 transition-all"
                >
                  Retake Quiz
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuiz(null);
                    setResults(null);
                    setFile(null);
                    setTranscriptText("");
                    setUserAnswers({});
                  }}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-xs transition-all"
                >
                  + Generate Another
                </button>
              </div>
            </div>

            {/* Score Stats Bar */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100 text-center">
              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                <span className="text-xs text-emerald-800 font-bold block">Correct</span>
                <span className="text-lg font-extrabold text-emerald-700">
                  {results.detailed.filter((d) => d.isCorrect).length}
                </span>
              </div>
              <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-100">
                <span className="text-xs text-rose-800 font-bold block">Needs Review</span>
                <span className="text-lg font-extrabold text-rose-700">
                  {results.detailed.filter((d) => !d.isCorrect).length}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-600 font-bold block">Total Items</span>
                <span className="text-lg font-extrabold text-slate-800">{results.total}</span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Detailed Explanations & Solutions</h3>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {[
                { id: "all", label: "All Items" },
                { id: "correct", label: "Correct Only" },
                { id: "incorrect", label: "Missed Only" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeFilter === tab.id
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question Breakdown List */}
          <div className="space-y-4">
            {results.detailed
              .filter((item) => {
                if (activeFilter === "correct") return item.isCorrect;
                if (activeFilter === "incorrect") return !item.isCorrect;
                return true;
              })
              .map((item, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                    item.isCorrect
                      ? "border-emerald-200/80 hover:border-emerald-300"
                      : "border-rose-200/80 hover:border-rose-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          item.isCorrect
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {item.isCorrect ? "✓" : "✗"}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Item {item.id} • {item.type}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        item.isCorrect
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {item.isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>

                  <h4 className="text-sm md:text-base font-bold text-slate-900 mb-3">
                    {item.prompt}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-4">
                    <div
                      className={`p-3 rounded-xl border ${
                        item.isCorrect
                          ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                          : "bg-rose-50/50 border-rose-200 text-rose-950"
                      }`}
                    >
                      <span className="font-bold block mb-0.5 opacity-75">Your Answer:</span>
                      <span className="font-medium">{item.userAnswer || "No answer provided"}</span>
                    </div>

                    <div className="p-3 rounded-xl border bg-emerald-50/50 border-emerald-200 text-emerald-950">
                      <span className="font-bold block mb-0.5 text-emerald-800">Correct Answer:</span>
                      <span className="font-semibold text-emerald-900">{item.correctAnswer}</span>
                    </div>
                  </div>

                  {/* Explanation Banner */}
                  <div className="bg-violet-50/60 border border-violet-200/80 rounded-xl p-3.5 text-xs text-slate-700">
                    <div className="flex items-center gap-1.5 text-violet-800 font-bold mb-1">
                      <span>💡</span>
                      <span>Explanation & Technical Rationale:</span>
                    </div>
                    <p className="leading-relaxed text-slate-600 pl-4 border-l-2 border-violet-400">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recent AI Assessments Footer Section */}
      {recentQuizzes.length > 0 && !quiz && (
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>📚</span> Recent AI Assessments
            </h3>
            <span className="text-xs text-slate-500">Available to retake</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recentQuizzes.slice(0, 6).map((q) => (
              <div
                key={q.quizId}
                onClick={() => loadPastQuiz(q.quizId)}
                className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded ${
                      q.difficulty === "Easy"
                        ? "bg-emerald-100 text-emerald-800"
                        : q.difficulty === "Medium"
                        ? "bg-violet-100 text-violet-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  <span className="text-slate-400">{q.totalQuestions} Questions</span>
                </div>
                <h4 className="font-bold text-slate-800 text-xs line-clamp-1 group-hover:text-violet-700">
                  {q.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  Source: {q.sourceName}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
