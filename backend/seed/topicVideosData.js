/**
 * Comprehensive Seed Data for LearnX Video Learning
 * Covers core CSE topics including DBMS Architecture, Normalization, SQL,
 * Binary Search, Sorting, Processes, Virtual Memory, OSI Model, etc.
 */

export const INITIAL_TOPIC_VIDEOS = [
  // ── 1. DBMS ARCHITECTURE (Primary Example) ──
  {
    topicId: "dbms-u1-architecture",
    subjectId: "dbms",
    unitId: "dbms-u1",
    chapterId: "dbms-u1-c1",
    title: "DBMS Architecture & Three-Schema ANSI/SPARC Framework",
    description: "Deep dive into 1-Tier, 2-Tier, and 3-Tier DBMS Architecture, Physical vs Logical Data Independence, and ANSI/SPARC 3-Schema layers.",
    videoUrl: "https://www.youtube.com/watch?v=3EJlovevfcA", // Standard embeddable tutorial
    thumbnailUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
    duration: 522, // 8 minutes 42 seconds
    durationLabel: "08:42",
    language: "Hinglish",
    difficulty: "Intermediate",
    sourceType: "youtube",
    transcript: [
      { timestampSeconds: 0, timeLabel: "00:00", text: "Welcome to LearnX DBMS Lecture. Today we explore DBMS Architecture and why data independence is crucial." },
      { timestampSeconds: 65, timeLabel: "01:05", text: "First, what is 1-tier, 2-tier client-server, and modern 3-tier web architecture in databases." },
      { timestampSeconds: 154, timeLabel: "02:34", text: "Now look at the ANSI/SPARC 3-Level Architecture: External View, Conceptual Schema, and Internal Physical Level." },
      { timestampSeconds: 275, timeLabel: "04:35", text: "Physical Data Independence: Modifying internal storage paths or indexes without touching conceptual queries." },
      { timestampSeconds: 380, timeLabel: "06:20", text: "Logical Data Independence: Altering logical tables (adding columns) without breaking user view programs." },
      { timestampSeconds: 470, timeLabel: "07:50", text: "Summary: Three-schema architecture guarantees modularity, security, and enterprise database performance." }
    ],
    keyMoments: [
      { timestampSeconds: 0, timeLabel: "00:00", title: "Introduction & Motivation" },
      { timestampSeconds: 65, timeLabel: "01:05", title: "1-Tier, 2-Tier vs 3-Tier Setup" },
      { timestampSeconds: 154, timeLabel: "02:34", title: "3-Schema ANSI/SPARC Architecture" },
      { timestampSeconds: 275, timeLabel: "04:35", title: "Physical Data Independence" },
      { timestampSeconds: 380, timeLabel: "06:20", title: "Logical Data Independence" },
      { timestampSeconds: 470, timeLabel: "07:50", title: "Exam Highlights & Key Takeaways" }
    ]
  },

  // ── 2. DBMS NORMALIZATION ──
  {
    topicId: "dbms-u5-normalization",
    subjectId: "dbms",
    unitId: "dbms-u5",
    chapterId: "dbms-u5-c1",
    title: "Database Normalization: 1NF, 2NF, 3NF & BCNF Masterclass",
    description: "Learn functional dependencies, candidate keys, and step-by-step table decomposition to eliminate insertion, deletion, and update anomalies.",
    videoUrl: "https://www.youtube.com/watch?v=UrYLYV7WSHM",
    thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    duration: 615, // 10:15
    durationLabel: "10:15",
    language: "Hinglish",
    difficulty: "Intermediate",
    sourceType: "youtube",
    transcript: [
      { timestampSeconds: 0, timeLabel: "00:00", text: "Normalization is the foundation of relational database design to eliminate redundant data." },
      { timestampSeconds: 90, timeLabel: "01:30", text: "First Normal Form (1NF): Every cell must hold atomic single values, zero repeating groups." },
      { timestampSeconds: 210, timeLabel: "03:30", text: "Second Normal Form (2NF): Must be in 1NF and have zero partial dependency on composite candidate keys." },
      { timestampSeconds: 350, timeLabel: "05:50", text: "Third Normal Form (3NF): Must be in 2NF and have zero transitive dependency: X -> Y where Y is non-prime." },
      { timestampSeconds: 490, timeLabel: "08:10", text: "Boyce-Codd Normal Form (BCNF): A stricter 3NF where for every functional dependency X -> Y, X must be a super key." }
    ],
    keyMoments: [
      { timestampSeconds: 0, timeLabel: "00:00", title: "Why We Need Normalization" },
      { timestampSeconds: 90, timeLabel: "01:30", title: "1NF: Atomic Values" },
      { timestampSeconds: 210, timeLabel: "03:30", title: "2NF: Partial Dependencies" },
      { timestampSeconds: 350, timeLabel: "05:50", title: "3NF: Transitive Dependencies" },
      { timestampSeconds: 490, timeLabel: "08:10", title: "BCNF Strict Superkey Rule" }
    ]
  },

  // ── 3. DSA: BINARY SEARCH ──
  {
    topicId: "dsa-u2-binary-search",
    subjectId: "dsa",
    unitId: "dsa-u2",
    chapterId: "dsa-u2-c1",
    title: "Binary Search Algorithm, Proof & Boundary Conditions",
    description: "Understand divide-and-conquer logarithmic searching in sorted arrays, mid calculation overflow prevention, and loop invariants.",
    videoUrl: "https://www.youtube.com/watch?v=fDKIpRe8GW4",
    thumbnailUrl: "https://images.unsplash.com/photo-1516116211227-bbc13c748281?auto=format&fit=crop&w=800&q=80",
    duration: 540, // 9:00
    durationLabel: "09:00",
    language: "English",
    difficulty: "Beginner",
    sourceType: "youtube",
    transcript: [
      { timestampSeconds: 0, timeLabel: "00:00", text: "Binary search drops search space by half at every single step, giving O(log N) time complexity." },
      { timestampSeconds: 110, timeLabel: "01:50", text: "Calculating mid = low + (high - low) / 2 to avoid integer 32-bit overflow bug." },
      { timestampSeconds: 240, timeLabel: "04:00", text: "Three comparison branches: target == arr[mid], target < arr[mid], or target > arr[mid]." },
      { timestampSeconds: 400, timeLabel: "06:40", text: "Corner cases: Element not found, duplicate keys, and lower bound vs upper bound implementations." }
    ],
    keyMoments: [
      { timestampSeconds: 0, timeLabel: "00:00", title: "Search Space Halving Concept" },
      { timestampSeconds: 110, timeLabel: "01:50", title: "Overflow Safe Mid Calculation" },
      { timestampSeconds: 240, timeLabel: "04:00", title: "Loop Invariants & Pointers" },
      { timestampSeconds: 400, timeLabel: "06:40", title: "Lower Bound & Upper Bound" }
    ]
  },

  // ── 4. OS: PROCESS MANAGEMENT & CPU SCHEDULING ──
  {
    topicId: "os-u2-process-scheduling",
    subjectId: "os",
    unitId: "os-u2",
    chapterId: "os-u2-c1",
    title: "CPU Scheduling Algorithms: FCFS, SJF, Round Robin & Priority",
    description: "Comparing preemptive vs non-preemptive CPU scheduling, Gantt chart construction, waiting time, turnaround time, and convoy effect.",
    videoUrl: "https://www.youtube.com/watch?v=EWkQD_sP-v8",
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    duration: 590, // 9:50
    durationLabel: "09:50",
    language: "Hinglish",
    difficulty: "Intermediate",
    sourceType: "youtube",
    transcript: [
      { timestampSeconds: 0, timeLabel: "00:00", text: "CPU scheduling determines which process in ready queue gets CPU burst allocation." },
      { timestampSeconds: 120, timeLabel: "02:00", text: "FCFS (First-Come, First-Served) and how CPU bursts suffer from the Convoy Effect." },
      { timestampSeconds: 250, timeLabel: "04:10", text: "SJF (Shortest Job First) is mathematically optimal for minimum average waiting time." },
      { timestampSeconds: 380, timeLabel: "06:20", text: "Round Robin uses time quantum slices to ensure interactive fair sharing without starvation." }
    ],
    keyMoments: [
      { timestampSeconds: 0, timeLabel: "00:00", title: "Scheduler Architecture" },
      { timestampSeconds: 120, timeLabel: "02:00", title: "FCFS & Convoy Effect" },
      { timestampSeconds: 250, timeLabel: "04:10", title: "SJF Optimal Theorem" },
      { timestampSeconds: 380, timeLabel: "06:20", title: "Round Robin Time Quantum" }
    ]
  },

  // ── 5. COMPUTER NETWORKS: OSI 7-LAYER MODEL ──
  {
    topicId: "cn-u1-osi-model",
    subjectId: "cn",
    unitId: "cn-u1",
    chapterId: "cn-u1-c1",
    title: "OSI 7-Layer Reference Model & Data Encapsulation",
    description: "End-to-end journey of a network packet from Application down to Physical layer, addressing mechanisms, and protocols at each layer.",
    videoUrl: "https://www.youtube.com/watch?v=vv4y_uOneC8",
    thumbnailUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    duration: 480, // 8:00
    durationLabel: "08:00",
    language: "Hinglish",
    difficulty: "Beginner",
    sourceType: "youtube",
    transcript: [
      { timestampSeconds: 0, timeLabel: "00:00", text: "OSI Model standardizes network communication into seven well-defined abstraction layers." },
      { timestampSeconds: 90, timeLabel: "01:30", text: "Upper layers: Application (HTTP/DNS), Presentation (TLS encryption), Session." },
      { timestampSeconds: 220, timeLabel: "03:40", text: "Transport layer: Port numbers, TCP segments, UDP datagrams, reliable delivery." },
      { timestampSeconds: 340, timeLabel: "05:40", text: "Network & Data Link: IP routing packets and MAC frame switching." }
    ],
    keyMoments: [
      { timestampSeconds: 0, timeLabel: "00:00", title: "Layer Abstraction Purpose" },
      { timestampSeconds: 90, timeLabel: "01:30", title: "Application, Presentation & Session" },
      { timestampSeconds: 220, timeLabel: "03:40", title: "Transport Layer & Port Numbers" },
      { timestampSeconds: 340, timeLabel: "05:40", title: "IP Packets vs MAC Frames" }
    ]
  }
];
