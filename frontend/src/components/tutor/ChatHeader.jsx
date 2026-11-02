import React from "react";
import { Bot, Paperclip, Trash2 } from "lucide-react";

export const ChatHeader = ({
  isHinglish,
  onToggleHinglish,
  onUploadClick,
  onClearChat,
  activeSubject,
}) => {
  return (
    <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0 bg-white">
      {/* Left: Avatar, Title, Status, Subtitle */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-2xl bg-[#0B1020] border border-slate-700/60 flex items-center justify-center text-white shrink-0 shadow-sm relative">
          <Bot className="w-5 h-5 text-indigo-400" />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-[15px] font-black text-[#0B1220] tracking-tight">
              LearnX AI Tutor
            </h3>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-[10px] font-bold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
            Ask doubts, learn concepts, get code help, or practice questions.
          </p>
        </div>
      </div>

      {/* Right: Actions (Hinglish Mode, Upload File, Clear Chat) */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Hinglish Toggle Button */}
        <button
          type="button"
          onClick={onToggleHinglish}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-2xs ${
            isHinglish
              ? "bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-100 font-extrabold"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
          title="Toggle Hinglish / English explanations"
        >
          <span className="text-sm">🇮🇳</span>
          <span className="hidden sm:inline">
            {isHinglish ? "Hinglish: ON" : "Hinglish Mode"}
          </span>
        </button>

        {/* Upload File Button */}
        <button
          type="button"
          onClick={onUploadClick}
          className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/40 transition-colors flex items-center gap-1.5 shadow-2xs"
          title="Attach code snippet or text notes"
        >
          <Paperclip className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload File</span>
        </button>

        {/* Clear Chat Button */}
        <button
          type="button"
          onClick={onClearChat}
          className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/60 transition-colors flex items-center gap-1.5 shadow-2xs"
          title="Clear chat history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
