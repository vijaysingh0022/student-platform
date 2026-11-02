import React, { useState } from "react";
import {
  Bot,
  Copy,
  Check,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Code,
  FileText,
  Briefcase,
  Target,
  Layers,
} from "lucide-react";
import MarkdownRenderer from "../MarkdownRenderer.jsx";

export const STARTER_PROMPTS = [
  {
    id: "explain",
    title: "Explain a concept",
    desc: "with examples",
    icon: BookOpen,
    iconColor: "text-blue-500",
    bg: "bg-blue-50/70 border-blue-100 hover:border-blue-300",
    getQuery: (subject) => `Explain the core concepts and mental model of ${subject || "this topic"} with simple examples.`,
  },
  {
    id: "debug",
    title: "Debug my code",
    desc: "and fix errors",
    icon: Code,
    iconColor: "text-cyan-600",
    bg: "bg-cyan-50/70 border-cyan-100 hover:border-cyan-300",
    getQuery: (subject) => `Help me debug my code for ${subject || "this problem"} and fix edge cases and time complexity issues.`,
  },
  {
    id: "practice",
    title: "Give me practice",
    desc: "questions",
    icon: FileText,
    iconColor: "text-purple-600",
    bg: "bg-purple-50/70 border-purple-100 hover:border-purple-300",
    getQuery: (subject) => `Give me 3 practice problems on ${subject || "this topic"} with step-by-step hints and complexity benchmarks.`,
  },
  {
    id: "interview",
    title: "Prepare for interviews",
    desc: "with real questions",
    icon: Briefcase,
    iconColor: "text-emerald-600",
    bg: "bg-emerald-50/70 border-emerald-100 hover:border-emerald-300",
    getQuery: (subject) => `What are the top 3 interview questions asked at top product companies for ${subject || "this domain"}?`,
  },
  {
    id: "plan",
    title: "Create a study plan",
    desc: "for my weak topics",
    icon: Target,
    iconColor: "text-rose-500",
    bg: "bg-rose-50/70 border-rose-100 hover:border-rose-300",
    getQuery: (subject) => `Create a targeted 5-day study plan to master ${subject || "my weak CSE areas"} from scratch.`,
  },
  {
    id: "visualize",
    title: "Visualize this topic",
    desc: "with diagrams",
    icon: Layers,
    iconColor: "text-indigo-600",
    bg: "bg-indigo-50/70 border-indigo-100 hover:border-indigo-300",
    getQuery: (subject) => `Explain ${subject || "this topic"} using ASCII architectural memory diagrams and step-by-step state traces.`,
  },
];

export const StarterPromptCards = ({ onSelectPrompt, activeSubject }) => {
  return (
    <div className="pt-2 space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {STARTER_PROMPTS.map((prompt) => {
          const Icon = prompt.icon;
          return (
            <button
              key={prompt.id}
              onClick={() => onSelectPrompt(prompt.getQuery(activeSubject))}
              className={`p-3 rounded-2xl border ${prompt.bg} transition-all duration-200 text-left flex items-start gap-2.5 group shadow-2xs`}
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform mt-0.5">
                <Icon className={`w-4 h-4 ${prompt.iconColor}`} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-950 transition-colors truncate">
                  {prompt.title}
                </div>
                <div className="text-[11px] text-slate-500 font-medium leading-tight">
                  {prompt.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const ChatMessage = ({
  msg,
  index,
  totalMsgs,
  onQuickFollowUp,
  onRegenerate,
  onSelectPrompt,
  activeSubject,
}) => {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex items-start gap-3 animate-in fade-in duration-200 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-[#0B1020] border border-slate-700/80 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
          <Bot className="w-4 h-4 text-indigo-400" />
        </div>
      )}

      {/* Bubble Container */}
      <div className={`max-w-[88%] md:max-w-[84%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        {/* Message Author and Timestamp */}
        <div className="flex items-center gap-2 mb-1 px-1">
          <span
            className="text-[10px] font-black tracking-wider uppercase"
            style={{ color: isUser ? "#4F46E5" : "#0B1220" }}
          >
            {isUser ? "YOU" : "LEARNX AI TUTOR"}
          </span>
          {msg.time && (
            <span className="text-[10px] text-slate-400 font-medium">
              {msg.time}
            </span>
          )}
        </div>

        {/* Message Bubble Body */}
        <div
          className={`p-4 sm:p-5 transition-all text-xs sm:text-sm leading-relaxed ${
            isUser
              ? "bg-[#0B1220] text-white rounded-2xl rounded-tr-xs shadow-sm font-medium"
              : "bg-white text-slate-800 border border-slate-200/90 rounded-2xl rounded-tl-xs shadow-2xs space-y-3"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{msg.text}</p>
          ) : (
            <div className="prose-slate max-w-none text-slate-800">
              <MarkdownRenderer content={msg.text} />
            </div>
          )}

          {/* Show starter prompt cards inside initial AI welcome message */}
          {!isUser && index === 0 && onSelectPrompt && (
            <StarterPromptCards
              onSelectPrompt={onSelectPrompt}
              activeSubject={activeSubject}
            />
          )}
        </div>

        {/* AI Action Quick-Bar (Copy, Regenerate, Thumbs, Quick Follow-ups) */}
        {!isUser && (
          <div className="flex flex-wrap items-center gap-2 mt-2 px-1">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-1 shadow-2xs"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            {onRegenerate && index === totalMsgs - 1 && (
              <button
                onClick={onRegenerate}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-1 shadow-2xs"
                title="Regenerate response"
              >
                <RefreshCw className="w-3 h-3 text-slate-400" />
                <span>Regenerate</span>
              </button>
            )}

            <div className="flex items-center gap-0.5 border border-slate-200 rounded-lg p-0.5 bg-white shadow-2xs">
              <button
                onClick={() => setFeedback("up")}
                className={`p-1 rounded-md text-[10px] transition-colors ${
                  feedback === "up"
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-400 hover:text-slate-700"
                }`}
                title="Helpful answer"
              >
                <ThumbsUp className="w-3 h-3" />
              </button>
              <button
                onClick={() => setFeedback("down")}
                className={`p-1 rounded-md text-[10px] transition-colors ${
                  feedback === "down"
                    ? "bg-rose-50 text-rose-700"
                    : "text-slate-400 hover:text-slate-700"
                }`}
                title="Not helpful"
              >
                <ThumbsDown className="w-3 h-3" />
              </button>
            </div>

            {onQuickFollowUp && index === totalMsgs - 1 && (
              <div className="flex items-center gap-1.5 flex-wrap ml-1">
                <button
                  onClick={() => onQuickFollowUp("Explain Simply")}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-100 shadow-2xs"
                >
                  Explain Simply
                </button>
                <button
                  onClick={() => onQuickFollowUp("Show Code")}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-100 shadow-2xs"
                >
                  Show Code
                </button>
                <button
                  onClick={() => onQuickFollowUp("Quiz Me")}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-100 shadow-2xs"
                >
                  Quiz Me
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-sm mt-0.5">
          YOU
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
