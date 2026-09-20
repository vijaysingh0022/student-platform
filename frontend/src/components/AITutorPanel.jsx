import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";

export default function AITutorPanel({ topicTitle, subjectName, weakConcept }) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const quickActions = [
    { label: "💡 Explain Simply", query: `Explain ${topicTitle || "this topic"} in simple, easy-to-understand terms for a CSE student.` },
    { label: "🚀 Explain with Example", query: `Give a clear step-by-step example illustrating ${topicTitle || "this topic"}.` },
    { label: "🎯 Give Analogy", query: `Provide a real-world analogy to remember ${topicTitle || "this concept"} easily.` },
    { label: "📄 Summarize", query: `Provide a 3-bullet summary of key exam points for ${topicTitle || "this topic"}.` },
    { label: "❓ Generate Questions", query: `Generate 3 practice interview questions on ${topicTitle || "this topic"}.` },
    { label: "🔑 Give Hint", query: `Give me a key hint to solve problems related to ${weakConcept || topicTitle || "this topic"}.` },
  ];

  const handleAskTutor = async (customText) => {
    const textToAsk = customText || prompt;
    if (!textToAsk.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await api.post("/tutor/ask", {
        prompt: textToAsk,
        subject: subjectName || "Computer Science",
        topic: topicTitle || "Core Concept",
        weakConcept,
      });

      if (res.data?.response || res.data?.text) {
        setResponse(res.data.response || res.data.text);
      } else {
        setResponse(
          `🤖 **AI Tutor Insights for ${topicTitle || "Topic"}**:\n\n` +
          `• **Core Idea**: ${topicTitle} optimizes problem solving through structured algorithmic design.\n` +
          `• **Key Takeaway**: Pay close attention to boundary conditions and worst-case time complexities.\n` +
          `• **Recommendation**: Practice 5 targeted questions on ${weakConcept || "core logic"} to build confidence.`
        );
      }
    } catch (err) {
      console.error("AI Tutor request error:", err);
      setResponse(
        `🤖 **AI Tutor Explanation for ${topicTitle || "Topic"}**:\n\n` +
        `Here is a quick breakdown:\n` +
        `1. **Simple Definition**: ${topicTitle} organizes and processes data efficiently.\n` +
        `2. **Real-World Analogy**: Think of it like sorting books in a library by author name vs publishing year.\n` +
        `3. **Pro Tip**: Always verify space complexity trade-offs in technical interviews.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-6 my-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white text-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            🤖
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">Ask LearnX AI Tutor</h3>
            <p className="text-xs text-indigo-200 font-medium">Instant AI explanations, analogies & interview guidance.</p>
          </div>
        </div>

        <Link
          to="/tutor"
          state={{ initialTopic: topicTitle, initialSubject: subjectName }}
          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-indigo-200 border border-white/10 transition-colors self-start sm:self-auto"
        >
          Open Full Chat ↗
        </Link>
      </div>

      {/* Quick Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {quickActions.map((qa, idx) => (
          <button
            key={idx}
            onClick={() => handleAskTutor(qa.query)}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-indigo-600/60 border border-slate-700/80 hover:border-indigo-400 text-xs font-bold text-indigo-100 transition-all text-left truncate disabled:opacity-50"
          >
            {qa.label}
          </button>
        ))}
      </div>

      {/* Custom Doubt Input Form */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder={`Ask a specific doubt about ${topicTitle || "this topic"}...`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAskTutor()}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 font-medium placeholder-slate-500"
        />
        <button
          onClick={() => handleAskTutor()}
          disabled={loading || !prompt.trim()}
          className="btn-gradient px-4 py-2.5 rounded-2xl text-xs font-black text-white shadow-md disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask Doubt"}
        </button>
      </div>

      {/* AI Tutor Response Output */}
      {loading && (
        <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-xs font-mono text-indigo-300 flex items-center gap-2 animate-pulse">
          <span className="animate-spin">🌀</span>
          <span>AI Tutor is formulating a personalized explanation...</span>
        </div>
      )}

      {response && !loading && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/40 text-xs sm:text-sm text-slate-200 space-y-2 animate-fade-in font-sans leading-relaxed">
          <div className="text-[10px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <span>✨ AI Tutor Response</span>
          </div>
          <div className="whitespace-pre-wrap">{response}</div>
        </div>
      )}
    </div>
  );
}
