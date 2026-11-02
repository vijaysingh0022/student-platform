/**
 * Concept Hierarchy & Prerequisite Registry for LearnX
 * Reusable across ANY subject (DBMS, DSA, OS, CN, OOPS, System Design, Web Dev, etc.)
 */

export const SUBJECT_CONCEPT_HIERARCHIES = {
  dbms: {
    subjectId: "dbms",
    subjectName: "Database Management Systems",
    concepts: [
      {
        id: "dbms-intro",
        name: "Introduction to Databases & File Systems",
        level: "Beginner",
        order: 1,
        prerequisites: [],
        subconcepts: ["Data vs Information", "File System Limitations", "DBMS Advantages", "DBMS Architecture Overview"],
      },
      {
        id: "dbms-architecture",
        name: "Three-Schema Architecture & Data Independence",
        level: "Beginner",
        order: 2,
        prerequisites: ["dbms-intro"],
        subconcepts: ["External Level (Views)", "Conceptual Level (Logical)", "Internal Level (Physical)", "Physical & Logical Data Independence"],
      },
      {
        id: "dbms-er-model",
        name: "Entity-Relationship (ER) Model",
        level: "Beginner",
        order: 3,
        prerequisites: ["dbms-intro"],
        subconcepts: ["Entities & Attributes", "Relationships & Cardinality", "Weak Entity Sets", "ER to Relational Mapping"],
      },
      {
        id: "dbms-keys",
        name: "Relational Keys & Integrity Constraints",
        level: "Intermediate",
        order: 4,
        prerequisites: ["dbms-er-model"],
        subconcepts: ["Super Key", "Candidate Key", "Primary Key", "Foreign Key", "Referential Integrity"],
      },
      {
        id: "dbms-functional-dependency",
        name: "Functional Dependency (FD) & Attribute Closure",
        level: "Intermediate",
        order: 5,
        prerequisites: ["dbms-keys"],
        subconcepts: ["Armstrong's Axioms", "Attribute Closure X+", "Finding Candidate Keys", "Canonical / Minimal Cover"],
      },
      {
        id: "dbms-normalization",
        name: "Database Normalization (1NF, 2NF, 3NF, BCNF)",
        level: "Advanced",
        order: 6,
        prerequisites: ["dbms-functional-dependency", "dbms-keys"],
        subconcepts: [
          "Data Redundancy & Anomalies (Insert, Update, Delete)",
          "1NF (Atomicity)",
          "2NF (No Partial Dependency)",
          "3NF (No Transitive Dependency)",
          "BCNF (Strict Super Key LHS)",
          "Lossless Decomposition & Dependency Preservation",
        ],
      },
      {
        id: "dbms-sql",
        name: "SQL & Relational Algebra",
        level: "Intermediate",
        order: 7,
        prerequisites: ["dbms-keys"],
        subconcepts: ["DDL, DML, DQL", "Multi-table Joins", "Aggregations & Grouping", "Subqueries & Views"],
      },
      {
        id: "dbms-transactions",
        name: "Transactions & ACID Properties",
        level: "Intermediate",
        order: 8,
        prerequisites: ["dbms-sql"],
        subconcepts: ["Atomicity", "Consistency", "Isolation Levels", "Durability", "Transaction States"],
      },
      {
        id: "dbms-concurrency",
        name: "Concurrency Control & Serializability",
        level: "Advanced",
        order: 9,
        prerequisites: ["dbms-transactions"],
        subconcepts: ["Conflict & View Serializability", "Two-Phase Locking (2PL)", "Deadlock Detection & Prevention", "Timestamp Ordering"],
      },
      {
        id: "dbms-recovery-indexing",
        name: "Recovery & Indexing (B/B+ Trees)",
        level: "Advanced",
        order: 10,
        prerequisites: ["dbms-concurrency"],
        subconcepts: ["Write-Ahead Logging (WAL)", "Checkpoints", "B-Tree & B+ Tree Indexing", "Query Optimization Basics"],
      },
    ],
  },

  dsa: {
    subjectId: "dsa",
    subjectName: "Data Structures & Algorithms",
    concepts: [
      { id: "dsa-complexity", name: "Time & Space Complexity", level: "Beginner", order: 1, prerequisites: [], subconcepts: ["Big-O, Omega, Theta", "Recursion Trees", "Master Theorem"] },
      { id: "dsa-arrays-strings", name: "Arrays & Strings", level: "Beginner", order: 2, prerequisites: ["dsa-complexity"], subconcepts: ["Two Pointers", "Sliding Window", "Prefix Sums"] },
      { id: "dsa-linked-lists", name: "Linked Lists", level: "Beginner", order: 3, prerequisites: ["dsa-arrays-strings"], subconcepts: ["Singly, Doubly, Circular", "Fast & Slow Pointers", "Reverse in Groups"] },
      { id: "dsa-stacks-queues", name: "Stacks & Queues", level: "Beginner", order: 4, prerequisites: ["dsa-linked-lists"], subconcepts: ["Monotonic Stack", "Circular Queue", "Deque"] },
      { id: "dsa-trees", name: "Binary Trees & BST", level: "Intermediate", order: 5, prerequisites: ["dsa-stacks-queues"], subconcepts: ["Traversals (In, Pre, Post, Level)", "BST Properties", "LCA", "Diameter"] },
      { id: "dsa-avl-heaps", name: "Heaps & Balanced Trees", level: "Intermediate", order: 6, prerequisites: ["dsa-trees"], subconcepts: ["Min/Max Heap", "Heapify & Priority Queue", "AVL Rotations"] },
      { id: "dsa-graphs", name: "Graphs & Traversals", level: "Advanced", order: 7, prerequisites: ["dsa-trees", "dsa-stacks-queues"], subconcepts: ["BFS & DFS", "Topological Sort", "Cycle Detection", "Dijkstra & Bellman-Ford", "MST (Kruskal & Prim)"] },
      { id: "dsa-dp", name: "Dynamic Programming", level: "Advanced", order: 8, prerequisites: ["dsa-complexity", "dsa-trees"], subconcepts: ["Memoization vs Tabulation", "0/1 Knapsack", "LCS & LIS", "DP on Trees & Bitmasking"] },
    ],
  },

  os: {
    subjectId: "os",
    subjectName: "Operating Systems",
    concepts: [
      { id: "os-intro", name: "OS Architecture & System Calls", level: "Beginner", order: 1, prerequisites: [], subconcepts: ["Kernel vs User Mode", "System Calls", "Interrupts & Traps"] },
      { id: "os-processes-threads", name: "Processes & Threads", level: "Beginner", order: 2, prerequisites: ["os-intro"], subconcepts: ["Process Control Block (PCB)", "Fork & Exec", "Context Switching", "User vs Kernel Threads"] },
      { id: "os-cpu-scheduling", name: "CPU Scheduling", level: "Intermediate", order: 3, prerequisites: ["os-processes-threads"], subconcepts: ["FCFS, SJF, SRTF", "Round Robin", "Priority Scheduling", "Multilevel Queue"] },
      { id: "os-synchronization", name: "Process Synchronization", level: "Intermediate", order: 4, prerequisites: ["os-processes-threads"], subconcepts: ["Critical Section Problem", "Peterson's Solution", "Semaphores & Mutex", "Classic Problems (Producer-Consumer, Dining Philosophers)"] },
      { id: "os-deadlocks", name: "Deadlocks", level: "Advanced", order: 5, prerequisites: ["os-synchronization"], subconcepts: ["Coffman Conditions", "Resource Allocation Graph (RAG)", "Banker's Algorithm", "Deadlock Detection & Recovery"] },
      { id: "os-memory-mgmt", name: "Memory Management & Paging", level: "Advanced", order: 6, prerequisites: ["os-intro"], subconcepts: ["Contiguous vs Paging", "Page Table & TLB", "Segmentation", "Virtual Memory & Demand Paging", "Page Replacement (LRU, Optimal, FIFO)"] },
    ],
  },

  cn: {
    subjectId: "cn",
    subjectName: "Computer Networks",
    concepts: [
      { id: "cn-intro", name: "Networking Models (OSI & TCP/IP)", level: "Beginner", order: 1, prerequisites: [], subconcepts: ["7 Layers of OSI", "TCP/IP 4-Layer Model", "Packet Encapsulation", "Topology & Hardware Devices"] },
      { id: "cn-physical-datalink", name: "Data Link Layer & Framing", level: "Beginner", order: 2, prerequisites: ["cn-intro"], subconcepts: ["Error Detection (CRC, Checksum)", "Sliding Window (Stop-and-Wait, Go-Back-N, Selective Repeat)", "MAC Addressing & Ethernet", "CSMA/CD & CSMA/CA"] },
      { id: "cn-network-layer", name: "Network Layer & IP Addressing", level: "Intermediate", order: 3, prerequisites: ["cn-physical-datalink"], subconcepts: ["IPv4 & IPv6 Addressing", "Subnetting & CIDR", "Routing Algorithms (Dijkstra Link-State, Distance Vector)", "ARP, ICMP, NAT"] },
      { id: "cn-transport-layer", name: "Transport Layer (TCP vs UDP)", level: "Intermediate", order: 4, prerequisites: ["cn-network-layer"], subconcepts: ["3-Way Handshake & Connection Teardown", "Flow Control (Window Sizing)", "Congestion Control (Slow Start, AIMD)", "UDP Characteristics"] },
      { id: "cn-application-layer", name: "Application Layer & Security", level: "Advanced", order: 5, prerequisites: ["cn-transport-layer"], subconcepts: ["HTTP/1.1 vs HTTP/2 vs HTTP/3", "DNS Resolution Architecture", "SSL/TLS Handshake", "Symmetric vs Asymmetric Encryption"] },
    ],
  },

  oops: {
    subjectId: "oops",
    subjectName: "Object-Oriented Programming & SOLID",
    concepts: [
      { id: "oops-basics", name: "Classes, Objects & Constructors", level: "Beginner", order: 1, prerequisites: [], subconcepts: ["Class vs Object", "Constructors & Destructors", "this/self pointer", "Memory Allocation (Stack vs Heap)"] },
      { id: "oops-pillars", name: "4 Core Pillars of OOP", level: "Beginner", order: 2, prerequisites: ["oops-basics"], subconcepts: ["Encapsulation & Access Modifiers", "Abstraction (Abstract Classes & Interfaces)", "Inheritance (Single, Multiple, Hierarchical)", "Polymorphism (Method Overloading vs Overriding)"] },
      { id: "oops-advanced", name: "Virtual Functions & Dynamic Binding", level: "Intermediate", order: 3, prerequisites: ["oops-pillars"], subconcepts: ["vtable and vptr Mechanics", "Pure Virtual Functions", "Diamond Problem & Virtual Inheritance", "Object Slicing"] },
      { id: "oops-solid", name: "SOLID Design Principles", level: "Advanced", order: 4, prerequisites: ["oops-pillars"], subconcepts: ["Single Responsibility (SRP)", "Open/Closed (OCP)", "Liskov Substitution (LSP)", "Interface Segregation (ISP)", "Dependency Inversion (DIP)"] },
      { id: "oops-design-patterns", name: "Design Patterns", level: "Advanced", order: 5, prerequisites: ["oops-solid"], subconcepts: ["Singleton & Factory", "Observer & Strategy", "Decorator & Adapter"] },
    ],
  },
};

/**
 * Find concept and specific subconcept by query or keyword
 */
export const matchConceptInHierarchy = (subjectId = "dbms", queryText = "") => {
  const normSubject = (subjectId || "dbms").toLowerCase();
  const hierarchy = SUBJECT_CONCEPT_HIERARCHIES[normSubject] || SUBJECT_CONCEPT_HIERARCHIES.dbms;
  const q = (queryText || "").toLowerCase();

  let activeSubconcept = null;

  // Specific subconcept detection
  if (q.includes("2nf")) activeSubconcept = "Second Normal Form (2NF)";
  else if (q.includes("1nf")) activeSubconcept = "First Normal Form (1NF)";
  else if (q.includes("3nf")) activeSubconcept = "Third Normal Form (3NF)";
  else if (q.includes("bcnf")) activeSubconcept = "Boyce-Codd Normal Form (BCNF)";
  else if (q.includes("anomaly") || q.includes("anomalies")) activeSubconcept = "Data Redundancy & Anomalies (Insert, Update, Delete)";
  else if (q.includes("closure")) activeSubconcept = "Attribute Closure X+";
  else if (q.includes("candidate key")) activeSubconcept = "Candidate Key";
  else if (q.includes("primary key")) activeSubconcept = "Primary Key";
  else if (q.includes("foreign key")) activeSubconcept = "Foreign Key";

  // Keyword to concept mapping
  let matchedConcept = null;
  if (normSubject === "dbms") {
    if (q.includes("bcnf") || q.includes("norm") || q.includes("1nf") || q.includes("2nf") || q.includes("3nf") || q.includes("anomaly")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "dbms-normalization");
    } else if (q.includes("fd") || q.includes("functional dep") || q.includes("closure") || q.includes("armstrong")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "dbms-functional-dependency");
    } else if (q.includes("key") || q.includes("primary") || q.includes("foreign") || q.includes("candidate")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "dbms-keys");
    } else if (q.includes("schema") || q.includes("architecture") || q.includes("3-schema") || q.includes("independence")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "dbms-architecture");
    } else if (q.includes("acid") || q.includes("transaction")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "dbms-transactions");
    } else if (q.includes("concurrency") || q.includes("2pl") || q.includes("deadlock") || q.includes("serializ")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "dbms-concurrency");
    } else if (q.includes("sql") || q.includes("join") || q.includes("group by")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "dbms-sql");
    } else if (q.includes("er") || q.includes("entity") || q.includes("cardinality")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "dbms-er-model");
    } else if (q.includes("b tree") || q.includes("index") || q.includes("recovery") || q.includes("wal")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "dbms-recovery-indexing");
    }
  } else if (normSubject === "os") {
    if (q.includes("process") || q.includes("thread") || q.includes("pcb") || q.includes("fork")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "os-processes-threads");
      if (q.includes("thread")) activeSubconcept = "User vs Kernel Threads";
      else if (q.includes("pcb")) activeSubconcept = "Process Control Block (PCB)";
    } else if (q.includes("schedul") || q.includes("round robin") || q.includes("fcfs") || q.includes("sjf")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "os-cpu-scheduling");
    } else if (q.includes("deadlock") || q.includes("banker") || q.includes("coffman") || q.includes("rag")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "os-deadlocks");
    } else if (q.includes("synchroniz") || q.includes("semaphore") || q.includes("mutex") || q.includes("critical section")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "os-synchronization");
    } else if (q.includes("page") || q.includes("tlb") || q.includes("virtual memory") || q.includes("segment")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "os-memory-mgmt");
    }
  } else if (normSubject === "dsa") {
    if (q.includes("binary search") || q.includes("bst") || q.includes("tree")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "dsa-trees");
      if (q.includes("binary search")) activeSubconcept = "Binary Search Tree (BST) & Search Invariants";
    } else if (q.includes("graph") || q.includes("bfs") || q.includes("dfs") || q.includes("dijkstra")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "dsa-graphs");
    } else if (q.includes("dp") || q.includes("dynamic programming") || q.includes("knapsack")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "dsa-dp");
    } else if (q.includes("heap") || q.includes("priority queue")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "dsa-avl-heaps");
    } else if (q.includes("linked list")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "dsa-linked-lists");
    } else if (q.includes("stack") || q.includes("queue")) {
      matchedConcept = hierarchy.concepts.find((c) => c.id === "dsa-stacks-queues");
    }
  }

  // Check across other subjects if query explicitly references a concept outside current subject
  if (!matchedConcept) {
    if (q.includes("process") || q.includes("thread") || q.includes("deadlock") || q.includes("scheduling") || q.includes("semaphore")) {
      const osH = SUBJECT_CONCEPT_HIERARCHIES.os;
      if (q.includes("process") || q.includes("thread")) {
        matchedConcept = osH.concepts.find((c) => c.id === "os-processes-threads");
        activeSubconcept = "Process vs Thread (Execution Context)";
      } else if (q.includes("deadlock")) {
        matchedConcept = osH.concepts.find((c) => c.id === "os-deadlocks");
      }
    } else if (q.includes("binary search") || q.includes("bst") || q.includes("array") || q.includes("dijkstra")) {
      const dsaH = SUBJECT_CONCEPT_HIERARCHIES.dsa;
      if (q.includes("binary search") || q.includes("tree")) {
        matchedConcept = dsaH.concepts.find((c) => c.id === "dsa-trees");
        activeSubconcept = "Binary Search & Optimal Search Invariants";
      }
    }
  }

  // Generic lookup: find direct title/subconcept match
  if (!matchedConcept) {
    for (const c of hierarchy.concepts) {
      if (q.includes(c.name.toLowerCase())) {
        matchedConcept = c;
        break;
      }
      for (const sub of c.subconcepts) {
        if (q.includes(sub.toLowerCase())) {
          matchedConcept = c;
          activeSubconcept = sub;
          break;
        }
      }
      if (matchedConcept) break;
    }
  }

  const result = matchedConcept || hierarchy.concepts[0];
  return {
    ...result,
    activeSubconcept,
  };
};

/**
 * Check missing prerequisites for a concept
 */
export const checkConceptPrerequisites = (subjectId = "dbms", conceptId = "", masteredConcepts = []) => {
  const normSubject = (subjectId || "dbms").toLowerCase();
  const hierarchy = SUBJECT_CONCEPT_HIERARCHIES[normSubject] || SUBJECT_CONCEPT_HIERARCHIES.dbms;
  const targetConcept = hierarchy.concepts.find((c) => c.id === conceptId);

  if (!targetConcept || !targetConcept.prerequisites || targetConcept.prerequisites.length === 0) {
    return { hasMissingPrereq: false, missingPrerequisites: [], targetConcept };
  }

  const missing = targetConcept.prerequisites
    .filter((prereqId) => !masteredConcepts.includes(prereqId))
    .map((prereqId) => hierarchy.concepts.find((c) => c.id === prereqId))
    .filter(Boolean);

  return {
    hasMissingPrereq: missing.length > 0,
    missingPrerequisites: missing,
    targetConcept,
  };
};
