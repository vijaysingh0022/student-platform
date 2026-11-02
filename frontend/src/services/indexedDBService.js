/**
 * LearnX Production-Ready IndexedDB Offline Storage Engine
 * Manages full offline subjects, topics, questions, cheat sheets,
 * bookmarks, progress, sync queue, and local activity log.
 */

const DB_NAME = "learnx_offline_db";
const DB_VERSION = 1;

const STORES = {
  SUBJECTS: "subjects",
  TOPICS: "topics",
  QUESTIONS: "questions",
  CHEATSHEETS: "cheatsheets",
  PROGRESS: "progress",
  QUIZ_ATTEMPTS: "quiz_attempts",
  SYNC_QUEUE: "sync_queue",
  ACTIVITY_LOG: "activity_log",
  SETTINGS: "settings",
  BOOKMARKS: "bookmarks",
};

// Seed baseline data matching production LearnX standards
const SEED_SUBJECTS = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    shortCode: "DSA",
    semester: 3,
    storageMB: 28,
    topicsCount: 42,
    totalTopics: 42,
    questionsCount: 280,
    notesCount: 18,
    progressPercent: 68,
    lastUpdated: "Today, 5:40 PM",
    isOfflineReady: true,
    accentColor: "#2563eb",
    icon: "⚡",
  },
  {
    id: "dbms",
    name: "Database Management Systems",
    shortCode: "DBMS",
    semester: 5,
    storageMB: 24,
    topicsCount: 36,
    totalTopics: 36,
    questionsCount: 240,
    notesCount: 22,
    progressPercent: 52,
    lastUpdated: "Today, 4:12 PM",
    isOfflineReady: true,
    accentColor: "#0284c7",
    icon: "🗄️",
  },
  {
    id: "os",
    name: "Operating Systems",
    shortCode: "OS",
    semester: 4,
    storageMB: 22,
    topicsCount: 34,
    totalTopics: 34,
    questionsCount: 210,
    notesCount: 16,
    progressPercent: 38,
    lastUpdated: "Yesterday, 8:54 PM",
    isOfflineReady: true,
    accentColor: "#7c3aed",
    icon: "💻",
  },
  {
    id: "cn",
    name: "Computer Networks",
    shortCode: "CN",
    semester: 4,
    storageMB: 25,
    topicsCount: 32,
    totalTopics: 32,
    questionsCount: 180,
    notesCount: 12,
    progressPercent: 46,
    lastUpdated: "Today, 1:20 PM",
    isOfflineReady: true,
    accentColor: "#059669",
    icon: "🌐",
  },
];

const SEED_CONTINUE_TOPIC = {
  subjectId: "dsa",
  subjectName: "Data Structures & Algorithms",
  subjectCode: "DSA",
  semester: 3,
  topicId: "bst-intro",
  topicTitle: "Binary Search Trees",
  progressPercent: 68,
  lastStudied: "12 min ago",
  nextTopic: "Insertion in BST",
  pendingQuestionsCount: 3,
  bookmarkedNotesCount: 1,
};

const SEED_ACTIVITIES = [
  { id: "act_1", title: "Completed Binary Search", timeAgo: "12 min ago", type: "topic", icon: "✓", timestamp: Date.now() - 12 * 60 * 1000 },
  { id: "act_2", title: "Solved 10 questions (Trees)", timeAgo: "18 min ago", type: "quiz", icon: "🎯", timestamp: Date.now() - 18 * 60 * 1000 },
  { id: "act_3", title: "Bookmarked AVL Trees", timeAgo: "25 min ago", type: "bookmark", icon: "🔖", timestamp: Date.now() - 25 * 60 * 1000 },
  { id: "act_4", title: "Read Normalization Notes", timeAgo: "1 hour ago", type: "note", icon: "📄", timestamp: Date.now() - 60 * 60 * 1000 },
  { id: "act_5", title: "Attempted OS Unit Test", timeAgo: "2 hours ago", type: "quiz", icon: "📝", timestamp: Date.now() - 120 * 60 * 1000 },
];

const SEED_QUESTIONS = [
  {
    id: "q_dsa_1",
    subject: "Data Structures & Algorithms",
    subjectCode: "DSA",
    unit: "Trees",
    difficulty: "Medium",
    questionText: "In a Binary Search Tree (BST), what is the worst-case time complexity of searching for a key when the tree is degenerate (skewed)?",
    options: ["O(log N)", "O(1)", "O(N)", "O(N log N)"],
    correctAnswerIndex: 2,
    explanation: "When a BST is skewed (like a linked list), height h = N, so searching requires traversing all N nodes in the worst case, giving O(N).",
  },
  {
    id: "q_dsa_2",
    subject: "Data Structures & Algorithms",
    subjectCode: "DSA",
    unit: "Trees",
    difficulty: "Medium",
    questionText: "Which tree traversal visits the nodes of a Binary Search Tree in strictly ascending sorted order?",
    options: ["Preorder traversal", "Inorder traversal", "Postorder traversal", "Level-order traversal"],
    correctAnswerIndex: 1,
    explanation: "Inorder traversal visits Left Subtree -> Root -> Right Subtree. Since BST property enforces Left < Root < Right, this yields elements in ascending order.",
  },
  {
    id: "q_dsa_3",
    subject: "Data Structures & Algorithms",
    subjectCode: "DSA",
    unit: "Trees",
    difficulty: "Hard",
    questionText: "What is the maximum balance factor allowed for any node in an AVL Tree?",
    options: ["0 only", "-1, 0, or +1", "-2 or +2", "Any integer"],
    correctAnswerIndex: 1,
    explanation: "An AVL tree is a strictly self-balancing BST where the balance factor (Height(Left) - Height(Right)) of every node must be -1, 0, or +1.",
  },
  {
    id: "q_dbms_1",
    subject: "Database Management Systems",
    subjectCode: "DBMS",
    unit: "Normalization",
    difficulty: "Medium",
    questionText: "A relation is in Boyce-Codd Normal Form (BCNF) if and only if for every non-trivial functional dependency X -> Y:",
    options: ["Y is a candidate key", "X is a candidate key / superkey", "X is a primary attribute", "X and Y are disjoint"],
    correctAnswerIndex: 1,
    explanation: "BCNF is a stricter version of 3NF. It requires that for every functional dependency X -> Y, X must be a superkey of the relation.",
  },
  {
    id: "q_dbms_2",
    subject: "Database Management Systems",
    subjectCode: "DBMS",
    unit: "Normalization",
    difficulty: "Easy",
    questionText: "Which normal form prohibits partial functional dependencies on candidate keys composed of multiple attributes?",
    options: ["1NF", "2NF", "3NF", "4NF"],
    correctAnswerIndex: 1,
    explanation: "2NF requires the relation to be in 1NF and guarantees that no non-prime attribute is functionally dependent on any proper subset of any candidate key.",
  },
  {
    id: "q_os_1",
    subject: "Operating Systems",
    subjectCode: "OS",
    unit: "Process Scheduling",
    difficulty: "Medium",
    questionText: "Which CPU scheduling algorithm is completely free from starvation of long processes?",
    options: ["Shortest Job First (SJF)", "Priority Scheduling without aging", "Round Robin (RR)", "Shortest Remaining Time First (SRTF)"],
    correctAnswerIndex: 2,
    explanation: "Round Robin uses fixed time slices (quanta). Every ready process gets equal turn, guaranteeing that no process can starve.",
  },
  {
    id: "q_os_2",
    subject: "Operating Systems",
    subjectCode: "OS",
    unit: "Process Scheduling",
    difficulty: "Hard",
    questionText: "In Banker's Algorithm for deadlock avoidance, a state is considered 'safe' if:",
    options: [
      "Deadlock will occur in at least 50% of paths",
      "There exists at least one sequence of process execution that allows all processes to finish without deadlock",
      "No process is requesting any additional resources",
      "All memory is fully allocated to one process",
    ],
    correctAnswerIndex: 1,
    explanation: "A safe state means the system can allocate resources to each process (up to its maximum) in some safe sequence and still avoid a deadlock.",
  },
  {
    id: "q_cn_1",
    subject: "Computer Networks",
    subjectCode: "CN",
    unit: "Transport Layer",
    difficulty: "Medium",
    questionText: "How does TCP guarantee reliable byte-stream transmission across an unreliable IP network layer?",
    options: [
      "By using UDP datagrams",
      "Through Sequence numbers, Cumulative Acknowledgments, and Timeout/Retransmission",
      "By disallowing multi-hop routing",
      "By hardware-level physical packet locking",
    ],
    correctAnswerIndex: 1,
    explanation: "TCP uses sequence numbers to order packets, cumulative ACKs to acknowledge received bytes, and retransmission timers (RTO) to recover lost segments.",
  },
];

const SEED_CHEAT_SHEETS = [
  {
    subjectCode: "DSA",
    title: "Data Structures & Algorithms Quick Revision",
    sections: [
      { heading: "Time Complexities", content: "Binary Search: O(log N) • QuickSort avg: O(N log N), worst: O(N²) • MergeSort: O(N log N) • Hash Table search avg: O(1), worst: O(N)" },
      { heading: "Trees Key Rules", content: "BST Inorder is always sorted. AVL max height difference = 1. Red-Black Tree guarantees max path <= 2 * min path." },
      { heading: "Graph Algorithms", content: "BFS (Queue) for unweighted shortest path O(V+E). Dijkstra (Min-Heap) for non-negative weights O((V+E)log V)." },
    ],
  },
  {
    subjectCode: "DBMS",
    title: "Database Management Systems Quick Revision",
    sections: [
      { heading: "Normal Forms Cheat Sheet", content: "1NF: Atomic values only • 2NF: No partial dependency • 3NF: No transitive dependency • BCNF: Every determinant X in X->Y is a superkey." },
      { heading: "ACID Properties", content: "Atomicity (WAL / Undo log) • Consistency (Integrity constraints) • Isolation (2-Phase Locking) • Durability (Redo log)." },
      { heading: "Indexing", content: "B+ Tree has all data pointers in linked leaf nodes, enabling blazing-fast range queries O(log_B N)." },
    ],
  },
  {
    subjectCode: "OS",
    title: "Operating Systems Quick Revision",
    sections: [
      { heading: "Process vs Thread", content: "Processes have separate virtual address space; threads share code/data/heap but have private stack and registers." },
      { heading: "Deadlock 4 Conditions (Coffman)", content: "1. Mutual Exclusion  2. Hold and Wait  3. No Preemption  4. Circular Wait." },
      { heading: "Virtual Memory & Paging", content: "Page fault occurs when page is not in RAM. Thrashing occurs when CPU spending >90% time swapping pages." },
    ],
  },
  {
    subjectCode: "CN",
    title: "Computer Networks Quick Revision",
    sections: [
      { heading: "OSI vs TCP/IP", content: "OSI: 7 layers (Physical, Data Link, Network, Transport, Session, Presentation, Application). TCP/IP: 4 layers." },
      { heading: "TCP 3-Way Handshake", content: "Client sends SYN(seq=x) -> Server replies SYN-ACK(seq=y, ack=x+1) -> Client sends ACK(ack=y+1)." },
      { heading: "Subnetting", content: "IPv4 32-bit. /24 provides 256 IPs (254 usable). Default gateway routes packets outside local subnet." },
    ],
  },
];

const SEED_NOTES = [
  {
    id: "note_1",
    subjectCode: "DSA",
    title: "Binary Search Trees & AVL Balancing",
    unit: "Trees",
    readTime: "8 min read",
    content: `# Binary Search Trees (BST) & Self-Balancing Trees
A Binary Search Tree satisfies the property:
- All keys in left subtree < Node key
- All keys in right subtree > Node key

### Key Operations
1. Search: O(h) where h is tree height
2. Insert: O(h)
3. Delete: 3 cases (Leaf node, One child, Two children: replace with Inorder Successor)

### AVL Rotations:
- LL Rotation (Right Rotate)
- RR Rotation (Left Rotate)
- LR Rotation (Left then Right)
- RL Rotation (Right then Left)`,
  },
  {
    id: "note_2",
    subjectCode: "DBMS",
    title: "Relational Database Normalization (1NF to BCNF)",
    unit: "Normalization",
    readTime: "10 min read",
    content: `# Database Normalization Master Notes
Normalization eliminates redundancy and insertion/deletion/update anomalies.

### 1NF (First Normal Form)
- Attributes must be atomic (no arrays, lists, or multivalued columns).

### 2NF (Second Normal Form)
- In 1NF + No partial dependencies on composite candidate keys.

### 3NF (Third Normal Form)
- In 2NF + For every X -> Y:
  - Either X is a superkey OR Y is a prime attribute.

### BCNF (Boyce-Codd Normal Form)
- For EVERY non-trivial FD X -> Y, X MUST be a superkey.`,
  },
  {
    id: "note_3",
    subjectCode: "OS",
    title: "CPU Scheduling Algorithms & Deadlock Prevention",
    unit: "Process Scheduling",
    readTime: "12 min read",
    content: `# Operating Systems: CPU Scheduling & Synchronization
### CPU Schedulers
- FCFS: Non-preemptive, suffers from Convoy effect.
- SJF: Optimal average waiting time, but provably causes starvation.
- Round Robin: Time quantum q. Fair, zero starvation.

### Deadlock Handling:
- Prevention: Eliminate at least one Coffman condition.
- Avoidance: Banker's algorithm safe-state verification.
- Detection & Recovery: Resource Allocation Graph cycle detection.`,
  },
];

class IndexedDBStorage {
  constructor() {
    this.db = null;
    this.initPromise = null;
  }

  async getDB() {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.indexedDB) {
        console.warn("IndexedDB not supported in current environment.");
        resolve(null);
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        Object.values(STORES).forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            if (storeName === STORES.SETTINGS) {
              db.createObjectStore(storeName, { keyPath: "key" });
            } else if (storeName === STORES.QUESTIONS) {
              const qStore = db.createObjectStore(storeName, { keyPath: "id" });
              qStore.createIndex("subject", "subject", { unique: false });
              qStore.createIndex("subjectCode", "subjectCode", { unique: false });
            } else if (storeName === STORES.TOPICS) {
              const tStore = db.createObjectStore(storeName, { keyPath: "topicId" });
              tStore.createIndex("subjectId", "subjectId", { unique: false });
            } else {
              db.createObjectStore(storeName, { keyPath: "id" });
            }
          }
        });
      };

      request.onsuccess = async (event) => {
        this.db = event.target.result;
        await this.seedDefaultsIfNeeded();
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error("IndexedDB open error:", event.target.error);
        resolve(null);
      };
    });

    return this.initPromise;
  }

  async seedDefaultsIfNeeded() {
    try {
      const subjects = await this.getAll(STORES.SUBJECTS);
      if (!subjects || subjects.length === 0) {
        // Seed subjects
        for (const s of SEED_SUBJECTS) {
          await this.put(STORES.SUBJECTS, s);
        }
        // Seed continue learning
        await this.put(STORES.SETTINGS, { key: "continue_learning", data: SEED_CONTINUE_TOPIC });
        // Seed activities
        for (const act of SEED_ACTIVITIES) {
          await this.put(STORES.ACTIVITY_LOG, act);
        }
        // Seed questions
        for (const q of SEED_QUESTIONS) {
          await this.put(STORES.QUESTIONS, q);
        }
        // Seed cheat sheets
        for (const cs of SEED_CHEAT_SHEETS) {
          await this.put(STORES.CHEATSHEETS, { id: cs.subjectCode, ...cs });
        }
        // Seed notes
        for (const note of SEED_NOTES) {
          await this.put(STORES.TOPICS, { id: note.id, topicId: note.id, ...note });
        }
        // Seed settings
        await this.put(STORES.SETTINGS, {
          key: "low_data_mode",
          data: {
            enabled: true,
            autoSync: true,
            textFirst: true,
            disableHeavyMedia: true,
          },
        });
      }
    } catch (e) {
      console.warn("Could not seed default offline data:", e);
    }
  }

  async getAll(storeName) {
    const db = await this.getDB();
    if (!db) return [];
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (err) {
        resolve([]);
      }
    });
  }

  async get(storeName, key) {
    const db = await this.getDB();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (err) {
        resolve(null);
      }
    });
  }

  async put(storeName, value) {
    const db = await this.getDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const req = store.put(value);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (err) {
        resolve(false);
      }
    });
  }

  async delete(storeName, key) {
    const db = await this.getDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const req = store.delete(key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (err) {
        resolve(false);
      }
    });
  }

  async clear(storeName) {
    const db = await this.getDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const req = store.clear();
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (err) {
        resolve(false);
      }
    });
  }

  // ── High-Level Business Methods ──

  async getContinueLearning() {
    const setting = await this.get(STORES.SETTINGS, "continue_learning");
    return setting?.data || SEED_CONTINUE_TOPIC;
  }

  async setContinueLearning(data) {
    return this.put(STORES.SETTINGS, { key: "continue_learning", data });
  }

  async getSubjects() {
    const list = await this.getAll(STORES.SUBJECTS);
    return list && list.length > 0 ? list : SEED_SUBJECTS;
  }

  async getQuestions(subjectFilter = "All") {
    const all = await this.getAll(STORES.QUESTIONS);
    const questions = all && all.length > 0 ? all : SEED_QUESTIONS;
    if (subjectFilter === "All") return questions;
    return questions.filter(
      (q) =>
        q.subject?.toLowerCase().includes(subjectFilter.toLowerCase()) ||
        q.subjectCode?.toLowerCase() === subjectFilter.toLowerCase()
    );
  }

  async getCheatSheets() {
    const list = await this.getAll(STORES.CHEATSHEETS);
    return list && list.length > 0 ? list : SEED_CHEAT_SHEETS;
  }

  async getNotes() {
    const list = await this.getAll(STORES.TOPICS);
    return list && list.length > 0 ? list : SEED_NOTES;
  }

  async getRecentActivities() {
    const list = await this.getAll(STORES.ACTIVITY_LOG);
    if (!list || list.length === 0) return SEED_ACTIVITIES;
    return list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).slice(0, 8);
  }

  async addActivity(title, type = "topic", icon = "✓") {
    const item = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title,
      type,
      icon,
      timeAgo: "Just now",
      timestamp: Date.now(),
    };
    await this.put(STORES.ACTIVITY_LOG, item);
    return item;
  }

  async getSyncQueue() {
    return this.getAll(STORES.SYNC_QUEUE);
  }

  async enqueueSyncItem(type, payload) {
    const item = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type, // 'test' | 'topic_completed' | 'bookmark'
      payload,
      createdAt: new Date().toISOString(),
      status: "pending", // 'pending' | 'syncing' | 'failed'
    };
    await this.put(STORES.SYNC_QUEUE, item);
    return item;
  }

  async removeSyncItem(id) {
    return this.delete(STORES.SYNC_QUEUE, id);
  }

  async clearSyncedItems(ids = []) {
    for (const id of ids) {
      await this.delete(STORES.SYNC_QUEUE, id);
    }
  }

  async getLowDataSettings() {
    const setting = await this.get(STORES.SETTINGS, "low_data_mode");
    return (
      setting?.data || {
        enabled: true,
        autoSync: true,
        textFirst: true,
        disableHeavyMedia: true,
      }
    );
  }

  async setLowDataSettings(settings) {
    return this.put(STORES.SETTINGS, { key: "low_data_mode", data: settings });
  }

  async getStorageBreakdown() {
    const subjects = await this.getSubjects();
    const items = [
      { name: "DSA", sizeMB: 28, color: "bg-blue-600" },
      { name: "DBMS", sizeMB: 24, color: "bg-teal-500" },
      { name: "OS", sizeMB: 22, color: "bg-amber-500" },
      { name: "CN", sizeMB: 25, color: "bg-indigo-600" },
      { name: "Notes", sizeMB: 31, color: "bg-sky-500" },
      { name: "Other", sizeMB: 56, color: "bg-slate-400" },
    ];
    const totalUsedMB = items.reduce((acc, cur) => acc + cur.sizeMB, 0); // 186 MB
    const totalCapacityMB = 1024; // 1 GB
    return {
      items,
      totalUsedMB,
      totalCapacityMB,
      percentUsed: Math.round((totalUsedMB / totalCapacityMB) * 100),
    };
  }

  async freeSubjectStorage(subjectId) {
    // Free content storage without deleting user's saved progress or bookmarks
    const subjects = await this.getSubjects();
    const updated = subjects.map((s) => {
      if (s.id === subjectId) {
        return { ...s, isOfflineReady: false, storageMB: 0, lastUpdated: "Removed from offline" };
      }
      return s;
    });
    for (const s of updated) {
      await this.put(STORES.SUBJECTS, s);
    }
    await this.addActivity(`Cleaned offline cache for ${subjectId.toUpperCase()}`, "storage", "🗑️");
    return updated;
  }

  async searchContent(query) {
    if (!query || query.trim().length === 0) return [];
    const q = query.toLowerCase().trim();
    const results = [];

    // Search topics & notes
    const notes = await this.getNotes();
    notes.forEach((n) => {
      if (n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q)) {
        results.push({
          type: "Note",
          badge: "Note",
          title: n.title,
          subtext: `${n.subjectCode} • ${n.unit}`,
          item: n,
        });
      }
    });

    // Search questions
    const questions = await this.getQuestions();
    questions.forEach((qu) => {
      if (qu.questionText?.toLowerCase().includes(q) || qu.unit?.toLowerCase().includes(q)) {
        results.push({
          type: "Question",
          badge: "Question",
          title: qu.questionText,
          subtext: `${qu.subjectCode} • ${qu.difficulty}`,
          item: qu,
        });
      }
    });

    // Search cheat sheets
    const sheets = await this.getCheatSheets();
    sheets.forEach((cs) => {
      if (cs.title?.toLowerCase().includes(q)) {
        results.push({
          type: "Cheat Sheet",
          badge: "Cheat Sheet",
          title: cs.title,
          subtext: `${cs.subjectCode} Quick Reference`,
          item: cs,
        });
      }
    });

    return results.slice(0, 10);
  }
}

export const offlineDB = new IndexedDBStorage();
