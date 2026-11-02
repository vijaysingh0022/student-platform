import React, { useState, useEffect, useRef } from "react";
import { X, Minus, ArrowLeft } from "lucide-react";
import VoiceTeacherExperience from "./voice/VoiceTeacherExperience.jsx";
import { askLearningCompanion } from "../services/api.js";

const QUICK_PROMPTS = [
  { label: "💡 Explain Simpler", mode: "simpler", prompt: "Isko simple language aur real-life analogy ke saath samjhao." },
  { label: "🌍 Give Example", mode: "example", prompt: "Iska ek practical real-world example aur software code/query example do." },
  { label: "🎓 Exam Answer", mode: "exam_ready", prompt: "University exam ke liye iska standard structured 5-mark answer kaise likhe?" },
  { label: "🗣️ Explain in Hinglish", mode: "hinglish", prompt: "Simple conversational Hinglish mein explain karo jaise ek dost samjhata hai." },
  { label: "❓ Quick Check", mode: "teach_me", prompt: "Mujhse is topic par ek conceptual question pucho aur check karo mera concept clear hai ya nahi." },
  { label: "💼 Interview Tip", mode: "interview_ready", prompt: "Yeh concept tech interviews mein kaise pucha jata hai aur iske edge cases kya hain?" },
];

const LearningCompanion = ({
  topicId = "dbms-u1-intro",
  topicTitle = "Database & DBMS Fundamentals",
  subjectId = "dbms",
  subjectName = "Database Management Systems",
  isOpen = false,
  onClose,
  initialMode = "beginner",
}) => {
  const [activeTab, setActiveTab] = useState(initialMode === "voice" ? "voice" : "chat");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello! I'm your **LearnX AI Learning Companion**. I'm currently tracking your study on **${topicTitle}** in **${subjectName}**.\n\nYou can ask doubts in English or Hinglish, or tap below to get instant explanations, exam answers, or hands-free voice guidance.`,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Sync initial tab when mode changes externally
  useEffect(() => {
    if (initialMode === "voice") {
      setActiveTab("voice");
    } else if (initialMode === "teach_me" || initialMode === "beginner") {
      setActiveTab("chat");
    }
  }, [initialMode]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen && activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, activeTab]);

  // Audio & Speech Synthesis Safe Stopper
  const stopAudioAndVoice = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn("Could not cancel speechSynthesis:", e);
      }
    }
  };

  const handleClose = () => {
    stopAudioAndVoice();
    if (onClose) onClose();
  };

  const handleMinimize = () => {
    stopAudioAndVoice();
    if (onClose) onClose();
  };

  // Keyboard shortcut: ESC to close/minimize
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = async (queryText, mode = "beginner") => {
    const q = (queryText || chatInput).trim();
    if (!q) return;

    const userMsg = { role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setLoading(true);

    try {
      const res = await askLearningCompanion({
        topicId,
        subjectId,
        prompt: q,
        mode,
        language: "english",
        history: messages.slice(-4),
      });

      const reply = res?.data?.text || `In ${topicTitle}, this concept ensures data integrity and high performance.`;
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.warn("Companion error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `In **${topicTitle}**, this concept ensures data integrity and performance. Let me know if you want an example or exam structure!`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── SUBTLE BACKDROP OVERLAY (DESKTOP/TABLET) ── */}
      {isOpen && (
        <div
          onClick={() => {
            // Clicking outside panel closes on desktop/tablet; mobile requires explicit close button
            if (typeof window !== "undefined" && window.innerWidth >= 640) {
              handleClose();
            }
          }}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px] transition-opacity duration-300 animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* ── MAIN AI COMPANION DRAWER ── */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] md:w-[520px] lg:w-[540px] bg-white shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none invisible"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="LearnX AI Learning Companion"
      >
        {/* ==================================================
            STICKY HEADER WITH CLEAR CLOSE & MINIMIZE BUTTONS
            ================================================== */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-200/90 shadow-2xs flex items-center justify-between gap-2.5">
          {/* Left: Mobile Back + Robot Branding + Topic Subtitle */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Mobile Back button */}
            <button
              onClick={handleClose}
              className="sm:hidden p-2 -ml-1 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
              aria-label="Back to learning"
              title="Back to learning"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Robot Badge */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center text-lg shadow-xs shrink-0 font-black">
              🤖
            </div>

            {/* Title & Subtitle */}
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-black tracking-tight text-slate-900 truncate">
                LearnX AI Learning Companion
              </h3>
              <p
                className="text-[11px] font-semibold text-slate-500 truncate"
                title={`${topicTitle} · ${subjectName}`}
              >
                {topicTitle}
              </p>
            </div>
          </div>

          {/* Right Controls: Tab Switcher + [ Minimize ] + [ X Close ] */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Voice vs Chat Switcher */}
            <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveTab("voice")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 ${
                  activeTab === "voice"
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <span>🎙 Voice</span>
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 ${
                  activeTab === "chat"
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <span>💬 Chat</span>
              </button>
            </div>

            {/* [ Minimize ] Button */}
            <button
              onClick={handleMinimize}
              title="Minimize AI Companion"
              aria-label="Minimize AI Learning Companion"
              className="w-11 h-11 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:scale-95 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent hover:border-slate-200"
            >
              <Minus className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* [ X ] Close Button */}
            <button
              onClick={handleClose}
              title="Close AI Companion"
              aria-label="Close AI Learning Companion"
              className="w-11 h-11 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 active:scale-95 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-red-400 border border-transparent hover:border-red-200 group"
            >
              <X className="w-5 h-5 stroke-[2.5] group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Selector (Visible on mobile screens) */}
        <div className="sm:hidden flex items-center justify-center p-2 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center w-full bg-slate-200/70 p-0.5 rounded-xl">
            <button
              onClick={() => setActiveTab("voice")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 ${
                activeTab === "voice" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600"
              }`}
            >
              <span>🎙 Voice Teacher</span>
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 ${
                activeTab === "chat" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600"
              }`}
            >
              <span>💬 AI Chat</span>
            </button>
          </div>
        </div>

        {/* ==================================================
            MAIN CONTENT (VOICE OR CHAT)
            ================================================== */}
        {activeTab === "voice" ? (
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
            <VoiceTeacherExperience
              topicId={topicId}
              topicTitle={topicTitle}
              subjectId={subjectId}
              subjectName={subjectName}
              embedded={false}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-white">
            {/* Quick Prompts Bar */}
            <div className="p-2.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {QUICK_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(p.prompt, p.mode)}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-100 hover:border-slate-300 transition-all whitespace-nowrap shadow-2xs"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none shadow-xs font-medium"
                        : "bg-slate-50 text-slate-800 border border-slate-200/80 rounded-bl-none shadow-2xs whitespace-pre-wrap font-medium"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl w-36 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  <span className="text-xs font-bold text-slate-600">AI Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3.5 border-t border-slate-200 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Ask about ${topicTitle}...`}
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || loading}
                  className="px-4 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors shadow-xs"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LearningCompanion;
