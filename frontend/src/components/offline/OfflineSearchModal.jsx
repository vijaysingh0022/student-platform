import React, { useState, useEffect, useRef } from "react";
import { offlineDB } from "../../services/indexedDBService.js";

const OfflineSearchModal = ({ isOpen, onClose, onSelectResult }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      const res = await offlineDB.searchContent(query);
      setResults(res);
      setSearching(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <span className="text-slate-400 text-lg">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search downloaded topics, notes, questions, cheat sheets..."
            className="w-full text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-slate-400 hover:text-slate-600 px-1"
            >
              ✕
            </button>
          )}
          <kbd className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {searching ? (
            <div className="py-8 text-center text-xs text-slate-400">Searching offline cache...</div>
          ) : results.length > 0 ? (
            results.map((res, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (onSelectResult) onSelectResult(res);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-start gap-3 group"
              >
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold shrink-0 mt-0.5 ${
                    res.badge === "Note"
                      ? "bg-blue-100 text-blue-800"
                      : res.badge === "Question"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {res.badge}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 line-clamp-1 transition-colors">
                    {res.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{res.subtext}</div>
                </div>
              </button>
            ))
          ) : query.trim() ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching offline content found for "{query}".
            </div>
          ) : (
            <div className="py-6 px-4 text-xs text-slate-400 space-y-2">
              <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Offline Search Suggestions
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Binary Search Trees", "BCNF Normalization", "Round Robin", "TCP 3-Way", "AVL Tree Rotations"].map(
                  (item, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(item)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>⚡ Instant IndexedDB Full-Text Search</span>
          <button onClick={onClose} className="hover:text-slate-600 font-semibold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfflineSearchModal;
