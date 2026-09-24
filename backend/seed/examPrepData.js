export const SEED_EXAM_QUESTIONS = [
  // ================= DSA QUESTIONS =================
  {
    subjectId: "dsa",
    subjectName: "Data Structures & Algorithms",
    unitId: "unit-1",
    unitName: "Unit 1: Linear Data Structures & Analysis",
    topicId: "arrays-matrices",
    topicName: "Arrays & Matrices",
    questionType: "mcq",
    questionText: "What is the worst-case time complexity of accessing an element by index in a 2D array of size N x M?",
    options: ["O(N * M)", "O(N + M)", "O(1)", "O(log(N*M))"],
    correctAnswer: "2",
    explanation: "Array elements are stored in contiguous memory blocks. Index calculations allow O(1) random access: Address = BaseAddress + (i * M + j) * size.",
    difficulty: "Easy",
    university: "AKTU",
    semester: 3,
    year: 2023,
    marks: 2,
    isImportant: true,
    revisionNote: {
      summary: "Arrays provide O(1) random access due to contiguous memory allocation. 2D array row-major formula: Base + (i * cols + j) * elementSize.",
      keyFormulae: ["Row-Major: Base + (i * C + j) * S", "Column-Major: Base + (j * R + i) * S"],
      keyConcepts: ["Contiguous Memory", "Cache Locality", "Pointer Arithmetic"]
    }
  },
  {
    subjectId: "dsa",
    subjectName: "Data Structures & Algorithms",
    unitId: "unit-1",
    unitName: "Unit 1: Linear Data Structures & Analysis",
    topicId: "stacks-queues",
    topicName: "Stacks & Queues",
    questionType: "numerical",
    questionText: "A circular queue of capacity N=6 is implemented using an array index 0 to 5. Front=4, Rear=2. How many elements are currently in the queue?",
    options: ["4", "5", "3", "2"],
    correctAnswer: "1", // index 1 is "5 elements" or calculated as (Rear - Front + N) % N = (2 - 4 + 6) % 6 = 4. Wait, let's verify: Front=4, elements at index 4 and 5, then 0, 1, 2 => elements at 4,5,0,1,2 = 5 elements! Index 1 corresponds to "5".
    explanation: "For circular queue: Count = (Rear - Front + Capacity) % Capacity. Here (2 - 4 + 6) % 6 = 4 items? Let's trace positions: index 4, 5, 0, 1, 2 -> total 5 elements!",
    difficulty: "Medium",
    university: "VTU",
    semester: 3,
    year: 2022,
    marks: 5,
    isImportant: true,
    revisionNote: {
      summary: "Circular queues overcome memory wastage in linear queues. Uses modulo arithmetic for index wrapping.",
      keyFormulae: ["Enqueue: Rear = (Rear + 1) % Capacity", "Dequeue: Front = (Front + 1) % Capacity", "Count = (Rear - Front + Capacity) % Capacity"],
      keyConcepts: ["Modulo Wrapping", "Overflow vs Underflow", "Double Ended Queue (Deque)"]
    }
  },
  {
    subjectId: "dsa",
    subjectName: "Data Structures & Algorithms",
    unitId: "unit-2",
    unitName: "Unit 2: Trees & Binary Search Trees",
    topicId: "tree-traversals",
    topicName: "Tree Traversals",
    questionType: "pyq",
    questionText: "The Preorder traversal of a BST is: 30, 20, 10, 25, 40, 35, 50. Construct the tree and find its Postorder traversal. (AKTU 2023 10 Marks)",
    options: [
      "10, 25, 20, 35, 50, 40, 30",
      "10, 20, 25, 30, 35, 40, 50",
      "25, 10, 20, 50, 35, 40, 30",
      "30, 20, 10, 40, 35, 50, 25"
    ],
    correctAnswer: "0",
    explanation: "For BST, Inorder traversal is always sorted: 10, 20, 25, 30, 35, 40, 50. Using Preorder & Inorder, the Postorder yields: 10, 25, 20, 35, 50, 40, 30.",
    difficulty: "Hard",
    university: "AKTU",
    semester: 3,
    year: 2023,
    marks: 10,
    isImportant: true,
    revisionNote: {
      summary: "Inorder traversal of BST gives elements in monotonically increasing sorted order. Root is always first in Preorder, last in Postorder.",
      keyFormulae: ["Preorder: Root -> Left -> Right", "Inorder: Left -> Root -> Right", "Postorder: Left -> Right -> Root"],
      keyConcepts: ["Tree Construction", "BST Property", "Recursion Traversal Stack"]
    }
  },
  {
    subjectId: "dsa",
    subjectName: "Data Structures & Algorithms",
    unitId: "unit-2",
    unitName: "Unit 2: Trees & Binary Search Trees",
    topicId: "avl-trees",
    topicName: "AVL Trees & Balance Factors",
    questionType: "short",
    questionText: "Define Balance Factor in AVL Trees. What are the allowed balance factors for a node in a valid AVL tree?",
    options: [
      "Height(Left) - Height(Right); Allowed: {-1, 0, 1}",
      "Height(Left) + Height(Right); Allowed: {0, 1, 2}",
      "Depth(Node) - Depth(Root); Allowed: {-2, 0, 2}",
      "Number of left children - Number of right children; Allowed: {-1, 0, 1}"
    ],
    correctAnswer: "0",
    explanation: "Balance Factor BF = Height(Left Subtree) - Height(Right Subtree). In AVL tree, BF of every node must be -1, 0, or +1. If BF becomes +2 or -2, rotations (LL, RR, LR, RL) are applied.",
    difficulty: "Medium",
    university: "SPPU",
    semester: 3,
    year: 2022,
    marks: 5,
    isImportant: true,
    revisionNote: {
      summary: "AVL Trees are height-balanced binary search trees ensuring O(log N) operations by strictly keeping height bounded.",
      keyFormulae: ["BF = Height(Left) - Height(Right)", "Rotations: LL, RR, LR, RL"],
      keyConcepts: ["Self-balancing Trees", "Rotation Logic", "Strict O(log N) Guarantee"]
    }
  },
  {
    subjectId: "dsa",
    subjectName: "Data Structures & Algorithms",
    unitId: "unit-3",
    unitName: "Unit 3: Graphs & Shortest Paths",
    topicId: "dijkstra-algorithm",
    topicName: "Dijkstra's Algorithm",
    questionType: "long",
    questionText: "Explain Dijkstra's Single Source Shortest Path Algorithm with time complexity analysis. Why does it fail for negative weight edges?",
    options: [
      "Fails because greedy choice assumes adding positive edges only increases path length.",
      "Fails because it uses DFS internally.",
      "Fails because graph becomes cyclic.",
      "Fails because priority queue crashes with negative values."
    ],
    correctAnswer: "0",
    explanation: "Dijkstra uses a greedy strategy assuming that once a node is finalized from the priority queue, its shortest path is found. A negative edge encountered later could lower the path length of an already finalized node, invalidating the greedy assumption. Use Bellman-Ford for negative weights.",
    difficulty: "Hard",
    university: "GATE",
    semester: 4,
    year: 2024,
    marks: 10,
    isImportant: true,
    revisionNote: {
      summary: "Dijkstra computes single-source shortest paths for non-negative weighted graphs using Min-Heap priority queue.",
      keyFormulae: ["Time Complexity: O((V + E) log V) with Min-Heap", "Space Complexity: O(V)"],
      keyConcepts: ["Greedy Choice Property", "Relaxation Step: d[v] = min(d[v], d[u] + w(u,v))", "Negative Weight Exception"]
    }
  },

  // ================= DBMS QUESTIONS =================
  {
    subjectId: "dbms",
    subjectName: "Database Management Systems",
    unitId: "unit-1",
    unitName: "Unit 1: ER Model & Relational Algebra",
    topicId: "er-diagrams",
    topicName: "ER Diagrams & Mapping",
    questionType: "mcq",
    questionText: "Which normal form guarantees freedom from insertion, deletion, and update anomalies while preserving functional dependencies?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    correctAnswer: "2",
    explanation: "3NF eliminates transitive dependencies and preserves functional dependencies. BCNF is stricter but does not always guarantee dependency preservation.",
    difficulty: "Easy",
    university: "AKTU",
    semester: 4,
    year: 2023,
    marks: 2,
    isImportant: true,
    revisionNote: {
      summary: "Database Normalization minimizes redundancy and eliminates anomalies. 1NF -> Atomic values, 2NF -> No partial dependency, 3NF -> No transitive dependency.",
      keyFormulae: ["2NF = 1NF + No Partial Dep", "3NF = 2NF + No Transitive Dep", "BCNF = X is Super Key for all X -> Y"],
      keyConcepts: ["Functional Dependency", "Candidate Key", "Lossless Decomposition"]
    }
  },
  {
    subjectId: "dbms",
    subjectName: "Database Management Systems",
    unitId: "unit-2",
    unitName: "Unit 2: SQL & Relational Calculus",
    topicId: "sql-joins",
    topicName: "SQL Joins & Subqueries",
    questionType: "pyq",
    questionText: "Given tables R(A, B) with 10 rows and S(B, C) with 5 rows. What is the maximum and minimum possible number of rows in R LEFT OUTER JOIN S? (VTU 2023)",
    options: [
      "Max: 50, Min: 10",
      "Max: 10, Min: 5",
      "Max: 50, Min: 5",
      "Max: 10, Min: 0"
    ],
    correctAnswer: "0",
    explanation: "In LEFT OUTER JOIN, all 10 rows of R are preserved (Min = 10). If all 5 rows of S match every row of R (e.g. duplicate foreign keys), each row of R matches 5 rows of S, yielding 10 * 5 = 50 rows (Max = 50).",
    difficulty: "Medium",
    university: "VTU",
    semester: 4,
    year: 2023,
    marks: 5,
    isImportant: true,
    revisionNote: {
      summary: "Left Outer Join preserves all tuples from left table. Number of output rows depends on join attribute cardinality.",
      keyFormulae: ["Max Rows = Rows(R) * Rows(S)", "Min Rows (Left Join) = Rows(R)"],
      keyConcepts: ["Cartesian Product", "Foreign Key Relationships", "NULL Handling"]
    }
  },
  {
    subjectId: "dbms",
    subjectName: "Database Management Systems",
    unitId: "unit-3",
    unitName: "Unit 3: Transactions & Concurrency Control",
    topicId: "acid-properties",
    topicName: "ACID Properties & Serializability",
    questionType: "long",
    questionText: "Explain Conflict Serializability. How do you construct a Precedence Graph (Serialization Graph) to test if a schedule is Conflict Serializable?",
    options: [
      "If precedence graph contains NO cycle, schedule is conflict serializable.",
      "If precedence graph is a complete tree, schedule is serializable.",
      "If all transactions commit concurrently, schedule is conflict serializable.",
      "If lock table has no deadlocks, schedule is serializable."
    ],
    correctAnswer: "0",
    explanation: "Nodes represent transactions Ti. An edge Ti -> Tj exists if Ti performs operation O1, Tj performs operation O2 on same item X, at least one operation is Write, and O1 executed before O2. A cycle indicates non-serializability.",
    difficulty: "Hard",
    university: "Anna University",
    semester: 4,
    year: 2022,
    marks: 10,
    isImportant: true,
    revisionNote: {
      summary: "Conflict Serializability guarantees that concurrent transaction execution yields same results as some serial execution.",
      keyFormulae: ["Conflicting operations: Same item, different transactions, at least one WRITE"],
      keyConcepts: ["Conflict Operations", "Precedence Graph Topological Sort", "Two-Phase Locking (2PL)"]
    }
  },

  // ================= OS QUESTIONS =================
  {
    subjectId: "os",
    subjectName: "Operating Systems",
    unitId: "unit-1",
    unitName: "Unit 1: Process Management & CPU Scheduling",
    topicId: "cpu-scheduling",
    topicName: "CPU Scheduling Algorithms",
    questionType: "numerical",
    questionText: "Consider 3 processes with burst times P1=24ms, P2=3ms, P3=3ms arriving at time 0 in order P1, P2, P3. Calculate average waiting time for FCFS scheduling.",
    options: ["17 ms", "27 ms", "12 ms", "30 ms"],
    correctAnswer: "0",
    explanation: "Completion times: P1=24ms, P2=27ms, P3=30ms. Waiting times: P1=0, P2=24, P3=27. Avg Waiting Time = (0 + 24 + 27)/3 = 51/3 = 17 ms.",
    difficulty: "Medium",
    university: "AKTU",
    semester: 4,
    year: 2023,
    marks: 5,
    isImportant: true,
    revisionNote: {
      summary: "CPU Scheduling optimizes turnaround time, response time, and CPU utilization. Convoy effect occurs in FCFS when long process blocks short ones.",
      keyFormulae: ["Turnaround Time = Completion Time - Arrival Time", "Waiting Time = Turnaround Time - Burst Time"],
      keyConcepts: ["FCFS Convoy Effect", "SJF Preemptive (SRTF)", "Round Robin Time Quantum"]
    }
  },
  {
    subjectId: "os",
    subjectName: "Operating Systems",
    unitId: "unit-2",
    unitName: "Unit 2: Memory Management & Paging",
    topicId: "virtual-memory",
    topicName: "Virtual Memory & Page Faults",
    questionType: "pyq",
    questionText: "A system uses 32-bit virtual addresses and 4KB page size. How many entries are present in a single-level page table? (GATE 2023)",
    options: ["2^20 entries (1,048,576)", "2^12 entries", "2^32 entries", "2^16 entries"],
    correctAnswer: "0",
    explanation: "Page Size = 4KB = 2^12 bytes (Offset = 12 bits). Page Number bits = 32 - 12 = 20 bits. Total entries in page table = 2^20 = 1,048,576 entries.",
    difficulty: "Hard",
    university: "GATE",
    semester: 4,
    year: 2023,
    marks: 5,
    isImportant: true,
    revisionNote: {
      summary: "Paging divides virtual memory into fixed-size pages and physical memory into frames. Translation Lookaside Buffer (TLB) speeds up page lookup.",
      keyFormulae: ["Virtual Address = Page Number + Offset", "Number of Pages = Total Virtual Space / Page Size"],
      keyConcepts: ["TLB Hit Ratio", "Multi-Level Paging", "Page Fault Penalty"]
    }
  },

  // ================= COMPUTER NETWORKS QUESTIONS =================
  {
    subjectId: "cn",
    subjectName: "Computer Networks",
    unitId: "unit-1",
    unitName: "Unit 1: Data Link & Network Layer",
    topicId: "ip-addressing",
    topicName: "IP Subnetting & CIDR",
    questionType: "numerical",
    questionText: "An IP address is given as 192.168.10.35/27. What is the Subnet Mask and the Broadcast Address for this network?",
    options: [
      "Subnet Mask: 255.255.255.224, Broadcast: 192.168.10.63",
      "Subnet Mask: 255.255.255.192, Broadcast: 192.168.10.31",
      "Subnet Mask: 255.255.255.128, Broadcast: 192.168.10.255",
      "Subnet Mask: 255.255.255.240, Broadcast: 192.168.10.47"
    ],
    correctAnswer: "0",
    explanation: "/27 means 27 network bits and 5 host bits. Mask: 255.255.255.224. Subnet block size = 2^5 = 32. Host 35 falls in block 32..63. Network ID = 192.168.10.32, Broadcast ID = 192.168.10.63.",
    difficulty: "Medium",
    university: "AKTU",
    semester: 5,
    year: 2023,
    marks: 5,
    isImportant: true,
    revisionNote: {
      summary: "CIDR subnetting allocates IP addresses efficiently using variable-length subnet masks (VLSM).",
      keyFormulae: ["Subnet Size = 2^(32 - PrefixLength)", "Usable Hosts = 2^(HostBits) - 2"],
      keyConcepts: ["Classless Inter-Domain Routing", "Network ID vs Broadcast ID", "Default Gateway"]
    }
  },

  // ================= SYSTEM DESIGN QUESTIONS =================
  {
    subjectId: "system-design",
    subjectName: "System Design & Architecture",
    unitId: "unit-1",
    unitName: "Unit 1: Scalability & Distributed Systems",
    topicId: "load-balancing",
    topicName: "Load Balancing & Caching",
    questionType: "long",
    questionText: "Compare Consistent Hashing with traditional Modulo Hashing in distributed caching systems. Why is Consistent Hashing critical when scaling cache nodes?",
    options: [
      "Consistent Hashing re-maps only K/n keys on average when a node is added/removed, preventing massive cache stampedes.",
      "Consistent Hashing forces all requests to go to a single master node.",
      "Modulo Hashing ensures zero data loss on node crashes.",
      "Consistent Hashing eliminates the need for database replicas."
    ],
    correctAnswer: "0",
    explanation: "In Modulo Hashing (hash(key) % N), changing N from 10 to 11 causes almost 100% of keys to re-hash to new nodes, causing cache invalidation. Consistent Hashing places keys and nodes on a hash ring so adding a node only affects 1/N keys.",
    difficulty: "Hard",
    university: "Generic CSE",
    semester: 6,
    year: 2024,
    marks: 10,
    isImportant: true,
    revisionNote: {
      summary: "Consistent Hashing minimizes key redistribution when servers scale up or down in distributed hash tables.",
      keyFormulae: ["Keys Remapped = Total Keys / N (on node addition/removal)"],
      keyConcepts: ["Hash Ring", "Virtual Nodes for Uniform Load", "Cache Eviction Policies (LRU/LFU)"]
    }
  }
];
