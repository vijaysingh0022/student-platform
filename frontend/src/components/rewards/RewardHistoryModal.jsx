import React, { useState, useEffect } from "react";
import { getRewardHistory } from "../../services/api.js";

const RewardHistoryModal = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState("All");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data } = await getRewardHistory(filter);
        setHistory(data.transactions || []);
      } catch (err) {
        console.error("fetchHistory error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isOpen, filter]);

  if (!isOpen) return null;

  const FILTERS = ["All", "XP", "Badges", "Challenges", "Streaks"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-blue-600 text-white text-base">🏆</span>
            <div>
              <h3 className="text-base font-bold text-white">Reward History</h3>
              <p className="text-xs text-slate-400">Verified On-Chain & Database Learning Ledger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => {
            const isSel = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSel
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* History List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-2">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading ledger records...</div>
          ) : history.length > 0 ? (
            history.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/70 transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      tx.type === "BADGE"
                        ? "bg-amber-100 text-amber-800"
                        : tx.type === "STREAK"
                        ? "bg-rose-100 text-rose-700"
                        : tx.type === "CHALLENGE"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {tx.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">{tx.description}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {tx.timeAgo} • {new Date(tx.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-3">
                  {tx.amount > 0 ? (
                    <span className="font-black text-emerald-600 text-sm">+{tx.amount} XP</span>
                  ) : (
                    <span className="font-bold text-amber-600 text-xs">Unlocked</span>
                  )}
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {tx.type}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              No reward records found in this category.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>✓ Protected by Anti-Duplication Cryptographic Index</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardHistoryModal;
