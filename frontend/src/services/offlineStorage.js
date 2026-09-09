/**
 * Client-Side Offline Storage & Synchronization Engine
 * Handles saving offline packs, queuing offline test attempts, and calculating local diagnostic scores.
 */

const STORAGE_KEYS = {
  OFFLINE_PACKS: "studentiq_offline_packs",
  OFFLINE_QUESTIONS: "studentiq_offline_questions",
  OFFLINE_QUEUE: "studentiq_offline_sync_queue",
  LOW_DATA_MODE: "studentiq_low_data_mode",
  OFFLINE_SIMULATOR: "studentiq_offline_simulator_active",
};

// Fallback embedded base questions for instant offline access even without initial download
const DEFAULT_OFFLINE_QUESTIONS = [
  { id: "off_dsa_1", subject: "DSA", topic: "Arrays & Searching", questionText: "What is the worst-case time complexity of standard Binary Search on a sorted array of N elements?", options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"], correctAnswerIndex: 1 },
  { id: "off_dsa_2", subject: "DSA", topic: "Trees & BST", questionText: "Inorder traversal of a Binary Search Tree (BST) visits nodes in which specific ordering?", options: ["Strictly descending order", "Strictly ascending (sorted) order", "Level-by-level breadth order", "Post-order reverse sequence"], correctAnswerIndex: 1 },
  { id: "off_dbms_1", subject: "DBMS", topic: "Normalization", questionText: "Which normal form requires every determinant in a functional dependency to be a candidate key / superkey?", options: ["1NF", "2NF", "3NF", "BCNF (Boyce-Codd)"], correctAnswerIndex: 3 },
  { id: "off_dbms_2", subject: "DBMS", topic: "Indexing & B+ Trees", questionText: "Why are B+ Trees predominantly preferred over standard B-Trees for database indexing?", options: ["Store keys in root only", "All record pointers reside in linked leaf nodes enabling fast range scans", "Consume zero cache memory", "Have O(N) scan time"], correctAnswerIndex: 1 },
  { id: "off_os_1", subject: "OS", topic: "Process Synchronization & Deadlocks", questionText: "Which of the following deadlock prevention strategies directly violates the 'Hold and Wait' condition?", options: ["Imposing a linear resource ordering", "Requiring processes to request all resources at once", "Allowing arbitrary preemption", "Time-slice preemption"], correctAnswerIndex: 1 },
  { id: "off_os_2", subject: "OS", topic: "Memory Management & Paging", questionText: "In virtual memory paging, what is the term for the phenomenon where excessive page swapping degrades CPU utilization to near zero?", options: ["Belady's Anomaly", "Thrashing", "External Fragmentation", "Deadlock Starvation"], correctAnswerIndex: 1 },
  { id: "off_cn_1", subject: "CN", topic: "Transport Layer & Protocols", questionText: "How many packets are exchanged in a standard TCP connection establishment handshake?", options: ["2 packets (SYN, ACK)", "3 packets (SYN, SYN-ACK, ACK)", "4 packets (SYN, ACK, DATA, ACK)", "1 packet (SYN)"], correctAnswerIndex: 1 },
  { id: "off_oops_1", subject: "OOPS", topic: "Polymorphism & Virtual Functions", questionText: "In C++ and Java, how is runtime (dynamic) polymorphism resolved under the hood?", options: ["Preprocessor macros", "vtable (virtual method table) and vptr pointer", "Static bytecode rewriting", "Thread execution stack hashing"], correctAnswerIndex: 1 },
  { id: "off_sys_1", subject: "SYSTEM_DESIGN", topic: "Distributed Caching & Scalability", questionText: "In high-scale web systems, what problem occurs when multiple concurrent requests miss the cache simultaneously and slam the DB?", options: ["Cache Penetration", "Cache Stampede / Avalanche", "Write-Back Throttling", "Dirty Read Contention"], correctAnswerIndex: 1 },
  { id: "off_apt_1", subject: "APTITUDE", topic: "Time & Work", questionText: "A can complete a project in 12 days, and B can complete it in 24 days. Working together, how many days will they take?", options: ["6 days", "8 days", "9 days", "18 days"], correctAnswerIndex: 1 },
  { id: "off_web_1", subject: "WEB_DEV", topic: "HTTP & REST APIs", questionText: "Which HTTP request method is strictly Idempotent according to RFC 7231?", options: ["POST", "PUT", "PATCH (without conditional headers)", "CONNECT"], correctAnswerIndex: 1 },
];

export const getStoredPacks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_PACKS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading offline packs:", e);
    return [];
  }
};

export const saveOfflineBundle = (bundle) => {
  try {
    if (bundle.studyPacks) {
      localStorage.setItem(STORAGE_KEYS.OFFLINE_PACKS, JSON.stringify(bundle.studyPacks));
    }
    if (bundle.questions && bundle.questions.length > 0) {
      localStorage.setItem(STORAGE_KEYS.OFFLINE_QUESTIONS, JSON.stringify(bundle.questions));
    }
    return true;
  } catch (e) {
    console.error("Error saving offline bundle:", e);
    return false;
  }
};

export const getStoredQuestions = (subject = "All") => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUESTIONS);
    const questions = raw ? JSON.parse(raw) : DEFAULT_OFFLINE_QUESTIONS;
    if (subject === "All") return questions;
    const filtered = questions.filter((q) => q.subject === subject);
    return filtered.length > 0 ? filtered : DEFAULT_OFFLINE_QUESTIONS.filter((q) => q.subject === subject || subject === "All");
  } catch (e) {
    return DEFAULT_OFFLINE_QUESTIONS;
  }
};

export const queueOfflineTest = (testResult) => {
  try {
    const queue = getOfflineQueue();
    const item = {
      ...testResult,
      offlineAttemptId: `off_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      completedAt: new Date().toISOString(),
    };
    queue.push(item);
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
    return item;
  } catch (e) {
    console.error("Error queueing offline test:", e);
    return null;
  }
};

export const getOfflineQueue = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const clearSyncedItems = (syncedAttemptIds = []) => {
  try {
    const queue = getOfflineQueue();
    const remaining = queue.filter((item) => !syncedAttemptIds.includes(item.offlineAttemptId));
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(remaining));
  } catch (e) {
    console.error("Error clearing synced items:", e);
  }
};

export const getStorageUsageKB = () => {
  try {
    let totalBytes = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith("studentiq_")) {
        totalBytes += (localStorage[key].length + key.length) * 2;
      }
    }
    return (totalBytes / 1024).toFixed(1);
  } catch (e) {
    return "0.0";
  }
};

export const clearOfflineStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_PACKS);
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
    return true;
  } catch (e) {
    return false;
  }
};

export const getLowDataMode = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.LOW_DATA_MODE) === "true";
  } catch (e) {
    return false;
  }
};

export const setLowDataMode = (enabled) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LOW_DATA_MODE, enabled ? "true" : "false");
  } catch (e) {}
};

export const getOfflineSimulator = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.OFFLINE_SIMULATOR) === "true";
  } catch (e) {
    return false;
  }
};

export const setOfflineSimulator = (active) => {
  try {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_SIMULATOR, active ? "true" : "false");
  } catch (e) {}
};
