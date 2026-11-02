import React from "react";
import { MessageSquare, ArrowRight } from "lucide-react";

export const RecentConversations = ({ conversations, onSelectConversation }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400">
          Recent Conversations
        </span>
        <span className="text-[11px] font-bold text-slate-400">
          Recent
        </span>
      </div>

      <div className="space-y-1.5">
        {conversations.slice(0, 5).map((chat) => (
          <button
            key={chat.id}
            type="button"
            onClick={() => onSelectConversation(chat)}
            className="w-full p-2.5 rounded-2xl hover:bg-indigo-50/40 border border-transparent hover:border-indigo-100 text-left transition-all flex items-center justify-between gap-2 group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-indigo-100/60 flex items-center justify-center shrink-0 border border-slate-100 text-slate-400 group-hover:text-indigo-600 transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-950 truncate">
                  {chat.title}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {chat.time}
                </div>
              </div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 shrink-0 transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentConversations;
