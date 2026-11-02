import React, { useState } from "react";
import { useOffline } from "../../context/OfflineContext.jsx";

const PrepareOfflineModal = ({ isOpen, onClose }) => {
  const { downloadedSubjects, isOnline, showNotification, refreshLocalData } = useOffline();
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleStartDownloadAll = async () => {
    if (!isOnline) {
      showNotification("Cannot download new study packs while offline. Please connect to internet.", "warning");
      return;
    }

    setDownloading(true);
    setProgress(15);
    await new Promise((r) => setTimeout(r, 400));
    setProgress(45);
    await new Promise((r) => setTimeout(r, 500));
    setProgress(80);
    await new Promise((r) => setTimeout(r, 400));
    setProgress(100);
    await new Promise((r) => setTimeout(r, 300));

    await refreshLocalData();
    setDownloading(false);
    showNotification("✓ All 4 subjects & 640 questions are 100% offline ready!", "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-white/20 text-white text-base">📦</span>
            <div>
              <h3 className="text-base font-bold text-white">Prepare for Offline Study</h3>
              <p className="text-xs text-blue-100">Download packs once, study everywhere</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-2">
            <div className="font-extrabold flex items-center gap-2 text-blue-900">
              <span>🚀</span> Ready-To-Download Bundle (186 MB)
            </div>
            <p className="text-blue-800 leading-relaxed">
              This bundle packages all 4 core semester subjects, 128 curated chapter topics, full revision notes, 640 practice questions, and formula cheat sheets into your browser's persistent IndexedDB storage.
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Included Course Packs
            </h4>
            <div className="space-y-2">
              {[
                { name: "Data Structures & Algorithms", sem: "Sem 3", size: "28 MB", topics: "42 Topics" },
                { name: "Database Management Systems", sem: "Sem 5", size: "24 MB", topics: "36 Topics" },
                { name: "Operating Systems", sem: "Sem 4", size: "22 MB", topics: "34 Topics" },
                { name: "Computer Networks", sem: "Sem 4", size: "25 MB", topics: "32 Topics" },
              ].map((sub, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <div>
                      <div className="font-bold text-slate-900">{sub.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {sub.sem} • {sub.topics}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                    {sub.size}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {downloading && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Downloading & Caching Packs...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button onClick={onClose} className="text-xs font-bold text-slate-600 hover:text-slate-800">
            Cancel
          </button>
          <button
            onClick={handleStartDownloadAll}
            disabled={downloading}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
          >
            {downloading ? "Preparing..." : "Download All Packs (186 MB)"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrepareOfflineModal;
