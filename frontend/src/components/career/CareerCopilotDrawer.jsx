import React, { useState } from "react";
import { chatWithCareerCopilot } from "../../services/api.js";

export const CareerCopilotDrawer = ({ isOpen, onClose, targetRole, resumeScore }) => {
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: `Hello! I am your LearnX Career Intelligence Copilot. I have analyzed your resume for the role of ${targetRole || "Software Engineer"}. What would you like to improve or explore today?`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async (textToSend) => {
    const q = textToSend || inputMessage;
    if (!q || !q.trim()) return;

    const userMsg = { sender: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setSending(true);

    try {
      const res = await chatWithCareerCopilot({
        query: q,
        chatHistory: messages,
      });

      if (res.data?.reply) {
        setMessages((prev) => [...prev, { sender: "assistant", text: res.data.reply }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: "I experienced a brief connection hiccup. Let's focus on tailoring your project bullets with quantified metrics and core CS fundamentals!",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              🤖
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                AI Career Copilot
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                Contextual mentor connected to your actual resume
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-xs font-bold text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 bg-indigo-50/50 border-b border-indigo-100 flex items-center gap-1.5 overflow-x-auto text-[10px]">
          {[
            "How do I boost my ATS score?",
            "Improve my main project description",
            "What should I learn next in LearnX?",
            "Mock interview question from resume",
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-lg bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 font-bold whitespace-nowrap shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                  m.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-none shadow-xs font-medium"
                    : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200 font-medium"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="p-3 rounded-2xl bg-slate-100 text-slate-500 rounded-bl-none text-xs flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span>Copilot is formulating guidance...</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask about your resume, missing skills, or interview tips..."
            className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={sending || !inputMessage.trim()}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs disabled:opacity-40 shadow-xs"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareerCopilotDrawer;
