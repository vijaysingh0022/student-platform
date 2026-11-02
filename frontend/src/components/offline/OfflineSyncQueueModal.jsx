import React from "react";
import { useOffline } from "../../context/OfflineContext.jsx";

const OfflineSyncQueueModal = ({ isOpen, onClose }) => {
  const { syncQueue, syncedCount, isOnline, syncing, syncNow, lastSyncTime } = useOffline();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-blue-600 text-white text-base">☁️</span>
            <div>
              <h3 className="text-base font-bold text-white">Synchronization Queue</h3>
              <p className="text-xs text-slate-400">Offline-to-Cloud Bi-directional Engine</p>
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
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Connection Status
              </div>
              <div className="text-sm font-black text-slate-900 mt-0.5 flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-red-500"}`} />
                {isOnline ? "Online & Synchronized" : "Offline (Local Queue Active)"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Last Successful Sync
              </div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{lastSyncTime || "Today"}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Pending Local Changes ({syncQueue.length})</span>
              <span>Synced ({syncedCount})</span>
            </div>

            {syncQueue.length === 0 ? (
              <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold">
                  ✓
                </div>
                <div className="text-xs font-black text-emerald-950">Everything Synced</div>
                <p className="text-[11px] text-emerald-800 max-w-xs mx-auto">
                  All your quizzes, progress, and activity are safely backed up in the LearnX cloud database.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {syncQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">
                        {item.type === "test" || item.type === "quiz"
                          ? `Quiz Attempt: ${item.payload?.subject || "Subject"}`
                          : item.type === "topic_completed"
                          ? `Completed Topic: ${item.payload?.topicTitle || "Topic"}`
                          : "Saved Bookmark"}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        Queued {new Date(item.createdAt || Date.now()).toLocaleTimeString()}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                      Waiting for network
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {isOnline ? "Auto-sync runs automatically on change" : "Sync will resume once internet returns"}
          </span>
          <button
            onClick={syncNow}
            disabled={syncing || !isOnline}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              syncing
                ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                : isOnline
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            {syncing ? "Syncing..." : "Sync Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfflineSyncQueueModal;
