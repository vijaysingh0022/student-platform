import React, { useRef } from "react";
import { Paperclip, Mic, MicOff, Send, X } from "lucide-react";
import QuickActions from "./QuickActions.jsx";

export const TutorInput = ({
  input,
  setInput,
  onSend,
  loading,
  attachment,
  setAttachment,
  onAttachClick,
  isListening,
  toggleListening,
  activeSubject,
  activeTopic,
  onTriggerAction,
}) => {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const subjectLabel =
    activeSubject && activeSubject !== "All Subjects" ? activeSubject : "CSE";

  return (
    <div className="p-4 border-t border-slate-100 bg-white space-y-3 shrink-0">
      {/* File Attachment Chip */}
      {attachment && (
        <div className="px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs text-indigo-950 shrink-0 shadow-2xs">
          <div className="flex items-center gap-2 truncate">
            <Paperclip className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="font-bold truncate">{attachment.name}</span>
            <span className="text-slate-400 text-[10px]">({attachment.size})</span>
          </div>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            className="p-1 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Remove attachment"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Pill Input Bar */}
      <div className="relative flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl sm:rounded-full border border-slate-200/90 bg-slate-50/70 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-3 focus-within:ring-indigo-100/70 transition-all shadow-xs">
        {/* Attachment Button */}
        <button
          type="button"
          onClick={onAttachClick}
          className="p-2 sm:p-2.5 rounded-xl sm:rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/60 transition-colors shrink-0 ml-1"
          title="Attach file (code, notes, data)"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Text Area Input */}
        <textarea
          ref={textareaRef}
          id="tutor-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask anything about ${subjectLabel} (e.g. "Explain Dijkstra's algorithm with code")...`}
          rows={1}
          className="flex-1 bg-transparent px-2 py-1 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none max-h-24 font-medium leading-relaxed"
        />

        {/* Voice Input Mic */}
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2 sm:p-2.5 rounded-xl sm:rounded-full transition-all shrink-0 ${
            isListening
              ? "bg-rose-100 text-rose-600 animate-pulse ring-2 ring-rose-200"
              : "text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          }`}
          title={isListening ? "Listening... Click to stop" : "Voice input"}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Send Button */}
        <button
          id="tutor-send-btn"
          type="button"
          onClick={onSend}
          disabled={!input.trim() || loading}
          className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-[#4F46E5] hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-sm shadow-indigo-500/25 shrink-0 cursor-pointer disabled:cursor-not-allowed group mr-0.5"
          title="Send question"
        >
          <Send className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Quick Actions Bar */}
      <QuickActions
        onTriggerAction={onTriggerAction}
        activeSubject={activeSubject}
        activeTopic={activeTopic}
      />
    </div>
  );
};

export default TutorInput;
