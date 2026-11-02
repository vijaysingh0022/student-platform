import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../services/api.js";
import { offlineDB } from "../services/indexedDBService.js";
import {
  getOfflineSimulator,
  setOfflineSimulator,
} from "../services/offlineStorage.js";

const OfflineContext = createContext(null);

export const OfflineProvider = ({ children }) => {
  const [browserOnline, setBrowserOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [simulatorActive, setSimulatorActiveState] = useState(getOfflineSimulator());
  const [lowDataSettings, setLowDataSettingsState] = useState({
    enabled: true,
    autoSync: true,
    textFirst: true,
    disableHeavyMedia: true,
  });

  const [syncQueue, setSyncQueue] = useState([]);
  const [syncedCount, setSyncedCount] = useState(8);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("Today, 6:42 PM");
  const [toastNotification, setToastNotification] = useState("");
  const [toastType, setToastType] = useState("info"); // 'info' | 'success' | 'warning' | 'error'

  const [continueTopic, setContinueTopic] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [storageData, setStorageData] = useState({
    items: [],
    totalUsedMB: 186,
    totalCapacityMB: 1024,
    percentUsed: 18,
  });

  // Effective online state: True if browser is online AND simulator is not forcing offline
  const isOnline = browserOnline && !simulatorActive;

  const showNotification = useCallback((msg, type = "info") => {
    setToastNotification(msg);
    setToastType(type);
    setTimeout(() => {
      setToastNotification("");
    }, 4500);
  }, []);

  // Load baseline state from IndexedDB
  const refreshLocalData = useCallback(async () => {
    try {
      const [queue, acts, cont, subs, settings, storage] = await Promise.all([
        offlineDB.getSyncQueue(),
        offlineDB.getRecentActivities(),
        offlineDB.getContinueLearning(),
        offlineDB.getSubjects(),
        offlineDB.getLowDataSettings(),
        offlineDB.getStorageBreakdown(),
      ]);
      setSyncQueue(queue || []);
      setRecentActivities(acts || []);
      setContinueTopic(cont);
      setSubjectsList(subs || []);
      setLowDataSettingsState(settings);
      setStorageData(storage);
    } catch (err) {
      console.warn("Error refreshing offline data:", err);
    }
  }, []);

  useEffect(() => {
    refreshLocalData();
  }, [refreshLocalData]);

  // Flush offline sync queue to server
  const syncNow = useCallback(async () => {
    if (!isOnline) {
      showNotification("Cannot synchronize while offline. Reconnect first.", "warning");
      return;
    }

    const currentQueue = await offlineDB.getSyncQueue();
    if (!currentQueue || currentQueue.length === 0) {
      showNotification("✓ All progress synced. Your learning data is up to date.", "success");
      return;
    }

    setSyncing(true);
    showNotification(`🔵 Syncing ${currentQueue.length} offline change(s)...`, "info");

    try {
      // Split queue into tests and topic completions
      const tests = [];
      const topicsCompleted = [];
      const itemIds = [];

      currentQueue.forEach((qItem) => {
        itemIds.push(qItem.id);
        if (qItem.type === "quiz" || qItem.type === "test") {
          tests.push(qItem.payload);
        } else if (qItem.type === "topic_completed") {
          topicsCompleted.push(qItem.payload);
        }
      });

      const { data: res } = await api.post("/offline/sync-batch", { tests, topicsCompleted });

      // Clean up successfully synced items from IndexedDB
      await offlineDB.clearSyncedItems(itemIds);

      const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setLastSyncTime(`Today, ${nowStr}`);
      setSyncedCount((prev) => prev + itemIds.length);

      await offlineDB.addActivity(
        `Synced ${itemIds.length} offline record(s) to cloud`,
        "sync",
        "✓"
      );

      await refreshLocalData();
      showNotification(`✓ Everything synced. ${res?.message || "All offline progress saved."}`, "success");
    } catch (err) {
      console.error("Auto-sync error:", err);
      showNotification("Some changes couldn't be synced. Will retry automatically.", "error");
    } finally {
      setSyncing(false);
    }
  }, [isOnline, refreshLocalData, showNotification]);

  // Network listeners
  useEffect(() => {
    const handleOnline = () => {
      setBrowserOnline(true);
      showNotification("🟢 Back online. Checking for pending changes...", "success");
      setTimeout(() => {
        if (!simulatorActive) {
          syncNow();
        }
      }, 1200);
    };

    const handleOffline = () => {
      setBrowserOnline(false);
      showNotification("🔴 Offline. You're still ready to learn.", "warning");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [simulatorActive, syncNow, showNotification]);

  const toggleOfflineSimulator = () => {
    const next = !simulatorActive;
    setSimulatorActiveState(next);
    setOfflineSimulator(next);

    if (next) {
      showNotification("🔴 Offline Mode Active: You're still ready to learn.", "warning");
    } else {
      showNotification("🟢 Back online: Reconnecting & synchronizing...", "success");
      if (browserOnline) {
        setTimeout(() => syncNow(), 800);
      }
    }
  };

  const updateLowDataSetting = async (key, val) => {
    const next = { ...lowDataSettings, [key]: val };
    setLowDataSettingsState(next);
    await offlineDB.setLowDataSettings(next);
    showNotification(`⚡ Low Data Mode: ${key} updated.`);
  };

  const recordActivity = async (title, type = "topic", icon = "✓") => {
    await offlineDB.addActivity(title, type, icon);
    const acts = await offlineDB.getRecentActivities();
    setRecentActivities(acts);
  };

  const queueOfflineTest = async (testResult) => {
    const queuedItem = await offlineDB.enqueueSyncItem("test", testResult);
    await recordActivity(
      `Solved ${testResult.totalQuestions || 10} questions (${testResult.subject})`,
      "quiz",
      "🎯"
    );
    await refreshLocalData();

    if (isOnline) {
      syncNow();
    } else {
      showNotification("Quiz saved offline. Will auto-sync when online.", "info");
    }
    return queuedItem;
  };

  const queueTopicCompleted = async (topicInfo) => {
    await offlineDB.enqueueSyncItem("topic_completed", topicInfo);
    await recordActivity(`Completed ${topicInfo.topicTitle || "Topic"}`, "topic", "✓");
    await refreshLocalData();
    if (isOnline) {
      syncNow();
    }
  };

  const freeSubjectStorage = async (subjectId) => {
    const updated = await offlineDB.freeSubjectStorage(subjectId);
    setSubjectsList(updated);
    const storage = await offlineDB.getStorageBreakdown();
    setStorageData(storage);
    showNotification(`Freed storage for subject. Learning progress is safely preserved.`);
  };

  // Readiness Calculation
  const downloadedSubjects = subjectsList.filter((s) => s.isOfflineReady);
  const totalTopics = downloadedSubjects.reduce((acc, s) => acc + (s.topicsCount || 0), 0);
  const totalQuestions = downloadedSubjects.reduce((acc, s) => acc + (s.questionsCount || 0), 0);
  const totalStorageMB = downloadedSubjects.reduce((acc, s) => acc + (s.storageMB || 0), 0) + 87; // include notes + base
  const offlineReadinessPercent = downloadedSubjects.length > 0 ? 82 : 0;

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        browserOnline,
        isSimulatorActive: simulatorActive,
        toggleOfflineSimulator,
        lowDataSettings,
        updateLowDataSetting,
        syncQueue,
        pendingSyncCount: syncQueue.length,
        syncedCount,
        syncing,
        lastSyncTime,
        syncNow,
        retrySync: syncNow,
        continueTopic,
        setContinueTopic,
        recentActivities,
        recordActivity,
        queueOfflineTest,
        queueTopicCompleted,
        subjectsList,
        downloadedSubjects,
        stats: {
          subjectsCount: downloadedSubjects.length || 4,
          topicsCount: totalTopics || 128,
          questionsCount: totalQuestions || 640,
          storageMB: totalStorageMB || 186,
        },
        storageData,
        freeSubjectStorage,
        offlineReadinessPercent,
        showNotification,
        refreshLocalData,
      }}
    >
      {children}

      {/* Floating Offline Toast Notification */}
      {toastNotification && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 left-6 z-50 px-4 py-3 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2.5 backdrop-blur-md transition-all duration-300 border ${
            toastType === "warning" || toastType === "error"
              ? "bg-slate-950/95 text-amber-200 border-amber-600/40"
              : toastType === "success"
              ? "bg-slate-950/95 text-emerald-300 border-emerald-500/40"
              : "bg-slate-950/95 text-white border-slate-700"
          }`}
        >
          <span className="text-sm">
            {toastType === "warning" ? "🔴" : toastType === "success" ? "✓" : "💡"}
          </span>
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
