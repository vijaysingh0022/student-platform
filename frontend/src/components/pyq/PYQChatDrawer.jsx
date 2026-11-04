import React, { useState, useEffect, useRef } from "react";
import { chatWithPYQPapers } from "../../services/api.js";

export const PYQChatDrawer = ({ isOpen, onClose, selectedSubject = "dsa" }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I am your AI Exam Copilot. Ask me anything about previous year question patterns, repeated topics, high-scoring numericals, or specific questions from your uploaded papers.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || sending) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setSending(true);

    try {
      const res = await chatWithPYQPapers({
        message: userText,
        subjectId: selectedSubject,
      });

      if (res.data?.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: res.data.reply },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I encountered an error querying your paper database. Please verify your connection.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const samplePrompts = [
    "Which topics appeared most frequently across papers?",
    "List all 10-mark repeated questions from Unit 2.",
    "Give me important numerical problems in this subject.",
    "Compare the 2023 and 2024 paper difficulty.",
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-slideLeft">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            🤖
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 leading-tight">
              AI Question Paper Assistant
            </h4>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected to Analyzed Papers
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 text-xs font-bold"
        >
          ✕
        </button>
      </div>

      {/* Message History */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/30">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "bg-indigo-600 text-white font-medium rounded-br-xs"
                  : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs font-normal whitespace-pre-line"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              <span>Scanning paper database...</span>
            </div>
          </div>
        )}
      </div>

      {/* Prompt Suggestions */}
      <div className="p-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto text-[10px] font-bold">
        {samplePrompts.slice(0, 2).map((sp, i) => (
          <button
            key={i}
            onClick={() => {
              setInput(sp);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 shrink-0 truncate max-w-[200px]"
          >
            {sp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your exam papers..."
          className="flex-1 px-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default PYQChatDrawer;
