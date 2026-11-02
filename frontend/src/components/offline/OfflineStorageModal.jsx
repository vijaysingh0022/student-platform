import React from "react";
import { useOffline } from "../../context/OfflineContext.jsx";

const OfflineStorageModal = ({ isOpen, onClose }) => {
  const { storageData, downloadedSubjects, freeSubjectStorage, showNotification } = useOffline();

  if (!isOpen) return null;

  const handleClearAllPacks = async () => {
    if (
      window.confirm(
        "Are you sure you want to clear downloaded subject packs? Your synced test scores, bookmarks, and learning momentum will NOT be deleted."
      )
    ) {
      for (const s of downloadedSubjects) {
        await freeSubjectStorage(s.id);
      }
      showNotification("Cleared downloaded packs. Preserved synced progress.");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-blue-600 text-white text-base">💾</span>
            <div>
              <h3 className="text-base font-bold text-white">Manage Device Storage</h3>
              <p className="text-xs text-slate-400">Offline Cache & Space Optimization</p>
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
        <div className="p-6 space-y-6">
          {/* Storage Capacity Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-slate-700">Storage Used</span>
              <span className="font-black text-slate-900">
                {storageData?.totalUsedMB || 186} MB / {storageData?.totalCapacityMB || 1024} MB (
                {storageData?.percentUsed || 18}%)
              </span>
            </div>

            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
              <div style={{ width: "15%" }} className="bg-blue-600 h-full" title="DSA" />
              <div style={{ width: "13%" }} className="bg-teal-500 h-full" title="DBMS" />
              <div style={{ width: "12%" }} className="bg-amber-500 h-full" title="OS" />
              <div style={{ width: "13%" }} className="bg-indigo-600 h-full" title="CN" />
              <div style={{ width: "16%" }} className="bg-sky-500 h-full" title="Notes" />
              <div style={{ width: "31%" }} className="bg-slate-400 h-full" title="Other" />
            </div>

            <div className="flex flex-wrap gap-3 text-[11px] text-slate-600 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> DSA (28 MB)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> DBMS (24 MB)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> OS (22 MB)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> CN (25 MB)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Notes (31 MB)
              </span>
            </div>
          </div>

          {/* Guarantee banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
            <span className="text-base text-emerald-600 shrink-0">🛡️</span>
            <div className="leading-relaxed">
              <strong>Progress Protection Guarantee:</strong> Deleting downloaded offline content will free up your device storage, but will <strong>NEVER</strong> delete your synced learning progress, test scores, or roadmap completions.
            </div>
          </div>

          {/* Subject item list */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Downloaded Subject Content
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {downloadedSubjects.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{sub.name}</div>
                    <div className="text-slate-400 text-[11px]">
                      {sub.storageMB} MB • {sub.topicsCount} Topics
                    </div>
                  </div>
                  <button
                    onClick={() => freeSubjectStorage(sub.id)}
                    className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold text-[11px] transition-colors"
                  >
                    Free Space
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleClearAllPacks}
            className="text-xs font-bold text-red-600 hover:text-red-700"
          >
            Clear All Offline Packs
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfflineStorageModal;
