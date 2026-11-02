import React from "react";
import { useNavigate } from "react-router-dom";

const ChallengesModal = ({ isOpen, onClose, challenges }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAction = (route) => {
    onClose();
    if (route) navigate(route);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-blue-600 text-white text-base">🎯</span>
            <div>
              <h3 className="text-base font-bold text-white">Today's Learning Challenges</h3>
              <p className="text-xs text-slate-400">Personalized tasks targeting your growth areas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {challenges && challenges.length > 0 ? (
            challenges.map((ch) => {
              const progressPct = Math.min(
                100,
                Math.round(((ch.currentProgress || 0) / (ch.targetProgress || 1)) * 100)
              );

              return (
                <div
                  key={ch._id || ch.challengeId}
                  className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          ch.iconBg === "purple"
                            ? "bg-purple-100 text-purple-700"
                            : ch.iconBg === "emerald"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {ch.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900">{ch.title}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              ch.badgeText === "Recommended"
                                ? "bg-rose-100 text-rose-700"
                                : ch.badgeText === "Daily Goal"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {ch.badgeText}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {ch.description}
                        </p>
                      </div>
                    </div>

                    <span className="font-extrabold text-blue-600 text-xs shrink-0">
                      +{ch.xpReward} XP
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-1">
                    <div className="flex-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                        <span>Progress</span>
                        <span>
                          {ch.currentProgress} / {ch.targetProgress} {ch.unit}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleAction(ch.actionRoute)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shrink-0 flex items-center gap-1"
                    >
                      <span>{ch.actionLabel || "Continue"}</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">No active challenges.</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengesModal;
