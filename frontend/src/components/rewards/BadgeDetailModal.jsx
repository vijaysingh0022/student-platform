import React from "react";
import { useNavigate } from "react-router-dom";

const BadgeDetailModal = ({ isOpen, onClose, badge }) => {
  const navigate = useNavigate();

  if (!isOpen || !badge) return null;

  const progressPercent = Math.min(
    100,
    Math.round(((badge.currentProgress || 0) / (badge.targetProgress || 1)) * 100)
  );

  const handleAction = () => {
    onClose();
    if (badge.actionRoute) {
      navigate(badge.actionRoute);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>

          <div className="w-20 h-20 mx-auto rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-4xl shadow-inner mb-3">
            {badge.icon}
          </div>

          <h3 className="text-xl font-black text-white">{badge.name}</h3>
          <p className="text-xs text-indigo-200 mt-1 max-w-xs mx-auto leading-relaxed">
            {badge.description}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border">
            {badge.isUnlocked ? (
              <span className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                ✓ Unlocked on{" "}
                {badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString() : "Active Record"}
              </span>
            ) : (
              <span className="bg-amber-500/20 text-amber-200 border-amber-400/30">
                🔒 In Progress ({badge.currentProgress} / {badge.targetProgress})
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1.5">
              <span>Milestone Progress</span>
              <span className="text-slate-900 font-black">
                {badge.currentProgress} / {badge.targetProgress} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  badge.isUnlocked ? "bg-emerald-500" : "bg-blue-600"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* What it unlocks — prominent benefit */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-1">🎁 What This Unlocks</p>
            <p className="font-black text-emerald-900 text-sm">{badge.unlocks || "+100 XP + Learning Benefit"}</p>
            <p className="text-[10px] text-emerald-700 mt-1">
              {badge.isUnlocked
                ? "This learning benefit is now available to you."
                : "Complete the requirement above to unlock this benefit."}
            </p>
          </div>

          {/* Details */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">XP Reward:</span>
              <span className="font-bold text-blue-600">+100 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Category:</span>
              <span className="font-bold text-slate-800 capitalize">{badge.category}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:text-slate-800"
          >
            Close
          </button>
          {!badge.isUnlocked ? (
            <button
              onClick={handleAction}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <span>Continue Learning</span>
              <span>→</span>
            </button>
          ) : (
            <button
              onClick={handleAction}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
            >
              Review Topic Content
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BadgeDetailModal;
