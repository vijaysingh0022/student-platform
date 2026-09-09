import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.js";
import {
  getOfflineQueue,
  clearSyncedItems,
  getLowDataMode,
  setLowDataMode,
  getOfflineSimulator,
  setOfflineSimulator,
} from "../services/offlineStorage.js";

const OfflineContext = createContext(null);

export const OfflineProvider = ({ children }) => {
  const [browserOnline, setBrowserOnline] = useState(navigator.onLine);
  const [simulatorActive, setSimulatorActiveState] = useState(getOfflineSimulator());
  const [lowDataMode, setLowDataModeState] = useState(getLowDataMode());
  const [syncQueue, setSyncQueue] = useState(getOfflineQueue());
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [toastNotification, setToastNotification] = useState("");

  // Effective online state: True if browser is online AND simulator is not forcing offline
  const isOnline = browserOnline && !simulatorActive;

  const showNotification = (msg) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(""), 4500);
  };

  // Refresh queue count
  const refreshQueue = () => {
    setSyncQueue(getOfflineQueue());
  };

  // Flush offline test results queue to server
  const syncNow = async () => {
    if (!isOnline) {
      showNotification("Cannot synchronize while in Offline Mode. Reconnect first.");
      return;
    }

    const currentQueue = getOfflineQueue();
    if (currentQueue.length === 0) {
      showNotification("All assessments are already synchronized with server.");
      return;
    }

    setSyncing(true);
    try {
      const { data: res } = await api.post("/offline/sync-batch", { tests: currentQueue });
      const syncedIds = (res.syncedResults || []).map((r) => r.offlineAttemptId);
      clearSyncedItems(syncedIds);
      refreshQueue();
      setLastSyncTime(new Date().toLocaleTimeString());
      showNotification(`🎉 Auto-Synced ${syncedIds.length} offline test(s) to server successfully!`);
    } catch (err) {
      console.error("Auto-sync error:", err);
      showNotification("Sync attempt failed. Will retry automatically when network is stable.");
    } finally {
      setSyncing(false);
    }
  };

  // Listen to browser network changes
  useEffect(() => {
    const handleOnline = () => {
      setBrowserOnline(true);
      showNotification("🌐 Connection Restored: Online");
      // Auto-trigger sync on reconnect
      setTimeout(() => {
        if (!simulatorActive) syncNow();
      }, 1000);
    };

    const handleOffline = () => {
      setBrowserOnline(false);
      showNotification("⚠️ Network Offline: Uninterrupted Learning Mode active");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial sync check if online and items exist
    if (navigator.onLine && !simulatorActive && getOfflineQueue().length > 0) {
      syncNow();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [simulatorActive]);

  const toggleLowDataMode = () => {
    const next = !lowDataMode;
    setLowDataModeState(next);
    setLowDataMode(next);
    showNotification(next ? "⚡ Low Data Mode enabled (minimal bandwidth & reduced animations)" : "Standard data mode restored");
  };

  const toggleOfflineSimulator = () => {
    const next = !simulatorActive;
    setSimulatorActiveState(next);
    setOfflineSimulator(next);
    showNotification(next ? "🔴 Offline Simulator Active (Testing offline learning engine)" : "🟢 Offline Simulator Deactivated (Live online)");
    if (!next && browserOnline) {
      setTimeout(() => syncNow(), 800);
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        browserOnline,
        isSimulatorActive: simulatorActive,
        isLowDataMode: lowDataMode,
        pendingSyncCount: syncQueue.length,
        syncQueue,
        syncing,
        lastSyncTime,
        syncNow,
        refreshQueue,
        toggleLowDataMode,
        toggleOfflineSimulator,
        showNotification,
      }}
    >
      {children}

      {/* Floating Offline Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-3 rounded-2xl bg-slate-900/95 text-white text-xs font-bold shadow-2xl border border-slate-700 flex items-center gap-2 backdrop-blur-md animate-fade-in-up">
          <span>{toastNotification}</span>
        </div>
      )}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error("useOffline must be used within an OfflineProvider");
  }
  return context;
};
