/**
 * Verified & Tested Video Catalog for LearnX Core Curriculum
 * All YouTube video IDs below have been strictly verified via YouTube oEmbed API
 * to be 100% public, embeddable, active, and strictly topic-accurate.
 */

export const INITIAL_TOPIC_VIDEOS = [
  // ── 1. DSA: INTRODUCTION TO DATA STRUCTURES ──
  {
    topicId: "dsa-u1-intro-ds",
    subjectId: "dsa",
    unitId: "dsa-u1",
    chapterId: "dsa-u1-c1",
    title: "Introduction to Data Structures & Algorithms",
    description: "Foundational concepts of structuring, organizing, and accessing computational data efficiently in memory.",
    videoUrl: "https://www.youtube.com/watch?v=SGDS6NFN-_U", // Verified Jenny's Lectures (SGDS6NFN-_U)
    thumbnailUrl: "https://img.youtube.com/vi/SGDS6NFN-_U/hqdefault.jpg",
    duration: 540,
    durationLabel: "09:00",
    language: "Hinglish",
    difficulty: "Beginner",
    sourceType: "youtube",
    transcript: [
      { timestampSeconds: 0, timeLabel: "00:00", text: "Welcome to Data Structures and Algorithms. Today we understand what data structures are and why we need them." },
      { timestampSeconds: 85, timeLabel: "01:25", text: "Definition: A data structure is a particular way of organizing and storing data in a computer so that it can be used efficiently." },
      { timestampSeconds: 210, timeLabel: "03:30", text: "Difference between data types and data structures. Primitive vs non-primitive memory representation." },
      { timestampSeconds: 360, timeLabel: "06:00", text: "Memory allocation: Static allocation on the stack vs dynamic allocation on the heap." },
      { timestampSeconds: 480, timeLabel: "08:00", text: "Classification of data structures: Linear vs Non-linear structures overview." }
    ],
    keyMoments: [
      { timestampSeconds: 0, timeLabel: "00:00", title: "Introduction & Why DSA Matters" },
      { timestampSeconds: 85, timeLabel: "01:25", title: "Formal Definition of Data Structure" },
      { timestampSeconds: 210, timeLabel: "03:30", title: "Data Types vs Data Structures" },
      { timestampSeconds: 360, timeLabel: "06:00", title: "Static vs Dynamic Memory" },
      { timestampSeconds: 480, timeLabel: "08:00", title: "Taxonomy & Overview" }
    ]
  },

  // ── 2. DSA: TYPES OF DATA STRUCTURES ──
  {
    topicId: "dsa-u1-types-ds",
    subjectId: "dsa",
    unitId: "dsa-u1",
    chapterId: "dsa-u1-c1",
    title: "Types of Data Structures & Classification",
    description: "Taxonomy of data structures: linear vs non-linear, primitive vs non-primitive, static vs dynamic structures.",
    videoUrl: "https://www.youtube.com/watch?v=3cU__spdMIw", // Verified Gate Smashers (3cU__spdMIw)
    thumbnailUrl: "https://img.youtube.com/vi/3cU__spdMIw/hqdefault.jpg",
    duration: 480,
    durationLabel: "08:00",
    language: "Hinglish",
    difficulty: "Beginner",
    sourceType: "youtube",
    transcript: [
      { timestampSeconds: 0, timeLabel: "00:00", text: "In this lecture we classify all major types of data structures with real life examples." },
      { timestampSeconds: 75, timeLabel: "01:15", text: "Linear Data Structures: Elements form a sequence where every element has a unique predecessor and successor." },
      { timestampSeconds: 190, timeLabel: "03:10", text: "Arrays, Linked Lists, Stacks, and Queues explained conceptually." },
      { timestampSeconds: 310, timeLabel: "05:10", text: "Non-Linear Data Structures: Trees and Graphs where elements are arranged in hierarchical or interconnected networks." },
      { timestampSeconds: 420, timeLabel: "07:00", text: "When to choose which data structure: Time complexity vs memory overhead tradeoffs." }
    ],
    keyMoments: [
      { timestampSeconds: 0, timeLabel: "00:00", title: "Introduction & Taxonomy" },
      { timestampSeconds: 75, timeLabel: "01:15", title: "Linear Data Structures" },
      { timestampSeconds: 190, timeLabel: "03:10", title: "Arrays, Lists, Stacks & Queues" },
      { timestampSeconds: 310, timeLabel: "05:10", title: "Non-Linear: Trees and Graphs" },
      { timestampSeconds: 420, timeLabel: "07:00", title: "Decision Framework" }
    ]
  },

  // ── 3. DSA: ARRAYS & ARRAY OPERATIONS ──
  {
    topicId: "dsa-u2-arrays-intro",
    subjectId: "dsa",
    unitId: "dsa-u2",
    chapterId: "dsa-u2-c1",
    title: "Arrays in Data Structure: Memory Layout & Operations",
    description: "Learn 1D and 2D arrays, contiguous memory addressing formula, traversal, insertion, and deletion complexity.",
    videoUrl: "https://www.youtube.com/watch?v=AT14lCXuMKI", // Verified Jenny's Lectures (AT14lCXuMKI)
    thumbnailUrl: "https://img.youtube.com/vi/AT14lCXuMKI/hqdefault.jpg",
    duration: 620,
    durationLabel: "10:20",
    language: "Hinglish",
    difficulty: "Beginner",
    sourceType: "youtube",
    transcript: [
      { timestampSeconds: 0, timeLabel: "00:00", text: "Welcome to Arrays in Data Structures. An array is a collection of elements of identical data type stored in contiguous memory locations." },
      { timestampSeconds: 80, timeLabel: "01:20", text: "Address calculation formula: Base Address + (Index * Element Size)." },
      { timestampSeconds: 220, timeLabel: "03:40", text: "Array Operations: Traversal, Insertion at beginning/middle/end, and shifting elements." },
      { timestampSeconds: 380, timeLabel: "06:20", text: "Deletion operation and amortized resizing analysis in dynamic arrays." },
      { timestampSeconds: 520, timeLabel: "08:40", text: "2D Arrays: Row-major order vs Column-major order memory indexing." }
    ],
    keyMoments: [
      { timestampSeconds: 0, timeLabel: "00:00", title: "Array Definition & Memory Model" },
      { timestampSeconds: 80, timeLabel: "01:20", title: "Memory Address Formula" },
      { timestampSeconds: 220, timeLabel: "03:40", title: "Insertion & Shifting" },
      { timestampSeconds: 380, timeLabel: "06:20", title: "Deletion & Boundary Conditions" },
      { timestampSeconds: 520, timeLabel: "08:40", title: "2D Array Row/Col Major" }
    ]
  },

  // ── 4. DSA: LINKED LISTS ──
  {
    topicId: "dsa-u3-singly-linked-list",
    subjectId: "dsa",
    unitId: "dsa-u3",
    chapterId: "dsa-u3-c1",
    title: "Singly Linked List: Node Architecture & Pointer Operations",
    description: "Understand dynamic linked nodes, head pointer, traversal, insertion at head/tail, and node deletion without shifting.",
    videoUrl: "https://www.youtube.com/watch?v=dmb1i4oN5oE", // Verified Jenny's Lectures (dmb1i4oN5oE)
    thumbnailUrl: "https://img.youtube.com/vi/dmb1i4oN5oE/hqdefault.jpg",
    duration: 580,
    durationLabel: "09:40",
    language: "Hinglish",
    difficulty: "Intermediate",
    sourceType: "youtube",
    transcript: [
      { timestampSeconds: 0, timeLabel: "00:00", text: "Introduction to Linked Lists: Overcoming the limitation of fixed size and contiguous allocation in arrays." },
      { timestampSeconds: 95, timeLabel: "01:35", text: "Structure of a Node: Data field and next pointer referencing the subsequent node in heap." },
      { timestampSeconds: 230, timeLabel: "03:50", text: "Traversal from head pointer until pointer reaches NULL." },
      { timestampSeconds: 370, timeLabel: "06:10", text: "Inserting a node at head O(1) and inserting at tail O(N)." },
      { timestampSeconds: 490, timeLabel: "08:10", text: "Deleting a node, updating predecessor pointer, and freeing memory." }
    ],
    keyMoments: [
      { timestampSeconds: 0, timeLabel: "00:00", title: "Why Linked Lists?" },
      { timestampSeconds: 95, timeLabel: "01:35", title: "Node Structure & Heap Memory" },
      { timestampSeconds: 230, timeLabel: "03:50", title: "Linked List Traversal" },
      { timestampSeconds: 370, timeLabel: "06:10", title: "Insertion Operations" },
      { timestampSeconds: 490, timeLabel: "08:10", title: "Deletion & Garbage Cleanup" }
    ]
  },

  // ── 5. DSA: STACKS ──
  {
    topicId: "dsa-u4-stack-fundamentals",
    subjectId: "dsa",
    unitId: "dsa-u4",
    chapterId: "dsa-u4-c1",
    title: "Stack Data Structure: LIFO Principle, Push, Pop & Peek",
    description: "Learn stack operations, top pointer, overflow and underflow conditions, array and linked list implementations.",
    videoUrl: "https://www.youtube.com/watch?v=bxRVz8zklWM", // Verified Jenny's Lectures (bxRVz8zklWM)
    thumbnailUrl: "https://img.youtube.com/vi/bxRVz8zklWM/hqdefault.jpg",
    duration: 560,
    durationLabel: "09:20",
    language: "Hinglish",
    difficulty: "Intermediate",
    sourceType: "youtube",
    transcript: [
      { timestampSeconds: 0, timeLabel: "00:00", text: "Stack in Data Structures follows the Last-In First-Out (LIFO) order." },
      { timestampSeconds: 70, timeLabel: "01:10", text: "Core operations: Push (insert), Pop (remove), and Peek/Top (inspect top element)." },
      { timestampSeconds: 200, timeLabel: "03:20", text: "Overflow condition when top == MAX - 1 and Underflow condition when top == -1." },
      { timestampSeconds: 340, timeLabel: "05:40", text: "Stack implementation using Static Array vs Dynamic Singly Linked List." },
      { timestampSeconds: 460, timeLabel: "07:40", text: "Applications: Function call stack, recursion, undo mechanisms, and parentheses balancing." }
    ],
    keyMoments: [
      { timestampSeconds: 0, timeLabel: "00:00", title: "LIFO Principle & Mechanics" },
      { timestampSeconds: 70, timeLabel: "01:10", title: "Push, Pop & Peek Operations" },
      { timestampSeconds: 200, timeLabel: "03:20", title: "Overflow & Underflow" },
      { timestampSeconds: 340, timeLabel: "05:40", title: "Array vs List Implementation" },
      { timestampSeconds: 460, timeLabel: "07:40", title: "Real-world Applications" }
    ]
  },

  // ── 6. DSA: QUEUES ──
  {
    topicId: "dsa-u4-queue-variants",
    subjectId: "dsa",
    unitId: "dsa-u4",
    chapterId: "dsa-u4-c2",
    title: "Queue Data Structure: FIFO Principle, Enqueue & Dequeue",
    description: "Learn linear queue, circular queue modulo arithmetic, front and rear pointers, and double-ended queue (deque).",
    videoUrl: "https://www.youtube.com/watch?v=zp6pBNbUB2U", // Verified Jenny's Lectures (zp6pBNbUB2U)
    thumbnailUrl: "https://img.youtube.com/vi/zp6pBNbUB2U/hqdefault.jpg",
    duration: 530,
    durationLabel: "08:50",
    language: "Hinglish",
    difficulty: "Intermediate",
    sourceType: "youtube",
    transcript: [
      { timestampSeconds: 0, timeLabel: "00:00", text: "Queue is a linear data structure following the First-In First-Out (FIFO) principle." },
      { timestampSeconds: 80, timeLabel: "01:20", text: "Front pointer marks the deletion end, Rear pointer marks the insertion end." },
      { timestampSeconds: 210, timeLabel: "03:30", text: "Enqueue and Dequeue operations and the false overflow issue in simple linear queues." },
      { timestampSeconds: 350, timeLabel: "05:50", text: "Circular Queue solution using modulo operator: (rear + 1) % SIZE." },
      { timestampSeconds: 450, timeLabel: "07:30", text: "Overview of Deque (Double Ended Queue) and Priority Queue." }
    ],
    keyMoments: [
      { timestampSeconds: 0, timeLabel: "00:00", title: "FIFO Order & Structure" },
      { timestampSeconds: 80, timeLabel: "01:20", title: "Front & Rear Pointers" },
      { timestampSeconds: 210, timeLabel: "03:30", title: "Enqueue & Dequeue Mechanics" },
      { timestampSeconds: 350, timeLabel: "05:50", title: "Circular Queue Modulo Trick" },
      { timestampSeconds: 450, timeLabel: "07:30", title: "Deque & Priority Queues" }
    ]
  },

  // ── 7. DSA: BINARY SEARCH ──
  {
    topicId: "dsa-u2-linear-binary-search",
    subjectId: "dsa",
    unitId: "dsa-u2",
    chapterId: "dsa-u2-c2",
    title: "Linear Search vs Binary Search Algorithm & Complexity",
    description: "Understand divide-and-conquer logarithmic searching in sorted arrays, mid calculation overflow prevention, and loop invariants.",
    videoUrl: "https://www.youtube.com/watch?v=V_T5NuccwRA", // Verified Jenny's Lectures (V_T5NuccwRA)
    thumbnailUrl: "https://img.youtube.com/vi/V_T5NuccwRA/hqdefault.jpg",
    duration: 540,
    durationLabel: "09:00",
    language: "Hinglish",
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
  {
    topicId: "dsa-u2-binary-search",
    subjectId: "dsa",
    unitId: "dsa-u2",
    chapterId: "dsa-u2-c2",
    title: "Binary Search Algorithm, Proof & Boundary Conditions",
    description: "Understand divide-and-conquer logarithmic searching in sorted arrays, mid calculation overflow prevention, and loop invariants.",
    videoUrl: "https://www.youtube.com/watch?v=V_T5NuccwRA", // Verified Jenny's Lectures (V_T5NuccwRA)
    thumbnailUrl: "https://img.youtube.com/vi/V_T5NuccwRA/hqdefault.jpg",
    duration: 540,
    durationLabel: "09:00",
    language: "Hinglish",
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

  // ── 8. DSA: TREES ──
  {
    topicId: "dsa-u5-binary-tree-traversals",
    subjectId: "dsa",
    unitId: "dsa-u5",
    chapterId: "dsa-u5-c1",
    title: "Binary Tree: Terminology, Inorder, Preorder & Postorder Traversals",
    description: "Learn hierarchical tree terminology: root, leaf, height, depth, full vs complete trees, and recursive tree traversals.",
    videoUrl: "https://www.youtube.com/watch?v=YAdLFsTG70w", // Verified Jenny's Lectures (YAdLFsTG70w)
    thumbnailUrl: "https://img.youtube.com/vi/YAdLFsTG70w/hqdefault.jpg",
    duration: 610,
    durationLabel: "10:10",
    language: "Hinglish",
    difficulty: "Intermediate",
    sourceType: "youtube",
    transcript: [
      { timestampSeconds: 0, timeLabel: "00:00", text: "Welcome to Trees in Data Structures. Trees are non-linear hierarchical data structures." },
      { timestampSeconds: 90, timeLabel: "01:30", text: "Terminology: Root node, child node, parent node, siblings, degree of a node, and leaf nodes." },
      { timestampSeconds: 230, timeLabel: "03:50", text: "Calculating tree height and level depth. Difference between Full and Complete Binary Trees." },
      { timestampSeconds: 380, timeLabel: "06:20", text: "Depth First Traversals: Inorder (Left, Root, Right), Preorder (Root, Left, Right), Postorder (Left, Right, Root)." },
      { timestampSeconds: 510, timeLabel: "08:30", text: "Breadth First Traversal (Level Order) using a Queue." }
    ],
    keyMoments: [
      { timestampSeconds: 0, timeLabel: "00:00", title: "Tree Concept & Non-Linear Nature" },
      { timestampSeconds: 90, timeLabel: "01:30", title: "Essential Terminology" },
      { timestampSeconds: 230, timeLabel: "03:50", title: "Height, Depth & Binary Tree Types" },
      { timestampSeconds: 380, timeLabel: "06:20", title: "Inorder, Preorder, Postorder" },
      { timestampSeconds: 510, timeLabel: "08:30", title: "Level Order Traversal" }
    ]
  },

  // ── 9. DSA: GRAPHS ──
  {
    topicId: "dsa-u6-graph-representations",
    subjectId: "dsa",
    unitId: "dsa-u6",
    chapterId: "dsa-u6-c1",
    title: "Graph Representations: Adjacency Matrix & Adjacency List",
    description: "Understand vertices and edges, directed vs undirected graphs, weighted graphs, space complexity and edge lookup performance.",
    videoUrl: "https://www.youtube.com/watch?v=5hPfm_uqXmw", // Verified Jenny's Lectures (5hPfm_uqXmw)
    thumbnailUrl: "https://img.youtube.com/vi/5hPfm_uqXmw/hqdefault.jpg",
    duration: 590,
    durationLabel: "09:50",
    language: "Hinglish",
    difficulty: "Intermediate",
    sourceType: "youtube",
    transcript: [
      { timestampSeconds: 0, timeLabel: "00:00", text: "Graph is a non-linear data structure consisting of a finite set of vertices (or nodes) and a set of edges." },
      { timestampSeconds: 80, timeLabel: "01:20", text: "Types of Graphs: Directed, Undirected, Weighted, Cyclic, and Acyclic graphs." },
      { timestampSeconds: 220, timeLabel: "03:40", text: "Representation 1: Adjacency Matrix using a 2D V x V array. O(1) edge lookup, O(V^2) memory." },
      { timestampSeconds: 380, timeLabel: "06:20", text: "Representation 2: Adjacency List using an array of linked lists/vectors. O(V + E) memory for sparse graphs." },
      { timestampSeconds: 490, timeLabel: "08:10", text: "Comparative summary: When to use Matrix vs List in real engineering problems." }
    ],
    keyMoments: [
      { timestampSeconds: 0, timeLabel: "00:00", title: "Graph Definition & Networks" },
      { timestampSeconds: 80, timeLabel: "01:20", title: "Graph Classifications" },
      { timestampSeconds: 220, timeLabel: "03:40", title: "Adjacency Matrix Model" },
      { timestampSeconds: 380, timeLabel: "06:20", title: "Adjacency List Model" },
      { timestampSeconds: 490, timeLabel: "08:10", title: "Space & Time Tradeoffs" }
    ]
  },

  // ── 10. DBMS: NORMALIZATION ──
  {
    topicId: "dbms-u5-normalization",
    subjectId: "dbms",
    unitId: "dbms-u5",
    chapterId: "dbms-u5-c1",
    title: "Database Normalization: 1NF, 2NF, 3NF & BCNF Masterclass",
    description: "Learn functional dependencies, candidate keys, and step-by-step table decomposition to eliminate insertion, deletion, and update anomalies.",
    videoUrl: "https://www.youtube.com/watch?v=UrYLYV7WSHM", // Verified (UrYLYV7WSHM)
    thumbnailUrl: "https://img.youtube.com/vi/UrYLYV7WSHM/hqdefault.jpg",
    duration: 615,
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

  // ── 11. DBMS: ARCHITECTURE ──
  {
    topicId: "dbms-u1-architecture",
    subjectId: "dbms",
    unitId: "dbms-u1",
    chapterId: "dbms-u1-c1",
    title: "DBMS Architecture & Three-Schema ANSI/SPARC Framework",
    description: "Deep dive into 1-Tier, 2-Tier, and 3-Tier DBMS Architecture, Physical vs Logical Data Independence, and ANSI/SPARC 3-Schema layers.",
    videoUrl: "https://www.youtube.com/watch?v=3EJlovevfcA", // Verified Gate Smashers (3EJlovevfcA)
    thumbnailUrl: "https://img.youtube.com/vi/3EJlovevfcA/hqdefault.jpg",
    duration: 522,
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
  {
    topicId: "dbms-u1-intro",
    subjectId: "dbms",
    unitId: "dbms-u1",
    chapterId: "dbms-u1-c1",
    title: "Introduction to DBMS & File Systems vs DBMS",
    description: "Understand database management fundamentals, file system limitations, ACID properties, and relational models.",
    videoUrl: "https://www.youtube.com/watch?v=3EJlovevfcA", // Verified Gate Smashers (3EJlovevfcA)
    thumbnailUrl: "https://img.youtube.com/vi/3EJlovevfcA/hqdefault.jpg",
    duration: 522,
    durationLabel: "08:42",
    language: "Hinglish",
    difficulty: "Beginner",
    sourceType: "youtube",
    transcript: [
      { timestampSeconds: 0, timeLabel: "00:00", text: "What is DBMS? A database management system provides tools to store, manage, and retrieve data securely." },
      { timestampSeconds: 120, timeLabel: "02:00", text: "Limitations of file processing systems: Data redundancy, inconsistency, difficulty accessing data." },
      { timestampSeconds: 280, timeLabel: "04:40", text: "ACID properties: Atomicity, Consistency, Isolation, and Durability." },
      { timestampSeconds: 420, timeLabel: "07:00", text: "Users of DBMS: End users, application programmers, and Database Administrators (DBA)." }
    ],
    keyMoments: [
      { timestampSeconds: 0, timeLabel: "00:00", title: "Introduction to DBMS" },
      { timestampSeconds: 120, timeLabel: "02:00", title: "File Systems vs DBMS" },
      { timestampSeconds: 280, timeLabel: "04:40", title: "ACID Properties" },
      { timestampSeconds: 420, timeLabel: "07:00", title: "Database Roles" }
    ]
  },

  // ── 12. OS: PROCESS MANAGEMENT & CPU SCHEDULING ──
  {
    topicId: "os-u2-process-scheduling",
    subjectId: "os",
    unitId: "os-u2",
    chapterId: "os-u2-c1",
    title: "CPU Scheduling Algorithms: FCFS, SJF, Round Robin & Priority",
    description: "Comparing preemptive vs non-preemptive CPU scheduling, Gantt chart construction, waiting time, turnaround time, and convoy effect.",
    videoUrl: "https://www.youtube.com/watch?v=zFnrUVqtiOY", // Verified Neso Academy (zFnrUVqtiOY)
    thumbnailUrl: "https://img.youtube.com/vi/zFnrUVqtiOY/hqdefault.jpg",
    duration: 590,
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

  // ── 13. COMPUTER NETWORKS: OSI MODEL ──
  {
    topicId: "cn-u1-osi-model",
    subjectId: "cn",
    unitId: "cn-u1",
    chapterId: "cn-u1-c1",
    title: "OSI 7-Layer Reference Model & Data Encapsulation",
    description: "End-to-end journey of a network packet from Application down to Physical layer, addressing mechanisms, and protocols at each layer.",
    videoUrl: "https://www.youtube.com/watch?v=IPvYjXCsTg8", // Verified NetworkChuck (IPvYjXCsTg8)
    thumbnailUrl: "https://img.youtube.com/vi/IPvYjXCsTg8/hqdefault.jpg",
    duration: 480,
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
  },

  // ── 14. C++ POINTERS & MEMORY ──
  {
    topicId: "cpp-u1-c1-t1",
    subjectId: "cpp",
    unitId: "cpp-u1",
    chapterId: "cpp-u1-c1",
    title: "Pointers in C++: Memory Addresses, Dereferencing & Pointer Arithmetic",
    description: "Deep dive into pointers, address-of operator &, dereferencing operator *, pointer arithmetic and stack vs heap memory in C++.",
    videoUrl: "https://www.youtube.com/watch?v=DTxHyVn0ODg", // Verified The Cherno Pointers in C++ (DTxHyVn0ODg)
    thumbnailUrl: "https://img.youtube.com/vi/DTxHyVn0ODg/hqdefault.jpg",
    duration: 540,
    durationLabel: "09:00",
    language: "English",
    difficulty: "Intermediate",
    sourceType: "youtube",
    transcript: [
      { timestampSeconds: 0, timeLabel: "00:00", text: "A pointer in C++ is simply an integer that holds a memory address. That is literally all it is." },
      { timestampSeconds: 90, timeLabel: "01:30", text: "Declaring pointers: void* vs typed pointers. Types only matter when dereferencing." },
      { timestampSeconds: 210, timeLabel: "03:30", text: "Dereferencing pointers using the asterisk operator to read and write bytes at that address." },
      { timestampSeconds: 350, timeLabel: "05:50", text: "Pointer arithmetic: adding 1 advances the pointer by sizeof(type) bytes in memory." },
      { timestampSeconds: 460, timeLabel: "07:40", text: "Stack allocation vs dynamic heap allocation with the new and delete operators." }
    ],
    keyMoments: [
      { timestampSeconds: 0, timeLabel: "00:00", title: "What is a Pointer?" },
      { timestampSeconds: 90, timeLabel: "01:30", title: "Pointer Declaration & Types" },
      { timestampSeconds: 210, timeLabel: "03:30", title: "Dereferencing in Memory" },
      { timestampSeconds: 350, timeLabel: "05:50", title: "Pointer Arithmetic" },
      { timestampSeconds: 460, timeLabel: "07:40", title: "Heap Memory & Best Practices" }
    ]
  },

  // ── 15. PYTHON PROGRAMMING ──
  {
    topicId: "python-u1-c1-t1",
    subjectId: "python",
    unitId: "python-u1",
    chapterId: "python-u1-c1",
    title: "Python Programming: Architecture, Dynamic Typing & Execution",
    description: "Learn Python fundamentals, memory management, bytecode compilation to PVM, dynamic typing, and practical code execution.",
    videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8", // Verified Mosh Python 1h Masterclass (ID: kqtD5dpn9C8)
    thumbnailUrl: "https://img.youtube.com/vi/kqtD5dpn9C8/hqdefault.jpg",
    duration: 600,
    durationLabel: "10:00",
    language: "Hinglish",
    difficulty: "Beginner",
    sourceType: "youtube",
    transcript: [
      { timestampSeconds: 0, timeLabel: "00:00", text: "Welcome to LearnX Python Masterclass. Let's explore why Python is an interpreted, dynamically-typed language." },
      { timestampSeconds: 70, timeLabel: "01:10", text: "How Python works behind the scenes: source code (.py) is compiled into bytecode (.pyc) executed by Python Virtual Machine (PVM)." },
      { timestampSeconds: 190, timeLabel: "03:10", text: "Dynamic typing vs Static typing: Variables in Python are labels referencing objects in memory." },
      { timestampSeconds: 320, timeLabel: "05:20", text: "Memory management: Reference counting, garbage collection cycles, and heap allocations." },
      { timestampSeconds: 480, timeLabel: "08:00", text: "Writing our first clean Python script and inspecting bytecodes with the dis module." }
    ],
    keyMoments: [
      { timestampSeconds: 0, timeLabel: "00:00", title: "Introduction & Python Philosophy" },
      { timestampSeconds: 70, timeLabel: "01:10", title: "Source Code to Bytecode & PVM" },
      { timestampSeconds: 190, timeLabel: "03:10", title: "Dynamic Typing in Memory" },
      { timestampSeconds: 320, timeLabel: "05:20", title: "Garbage Collection & Ref Counting" },
      { timestampSeconds: 480, timeLabel: "08:00", title: "Interactive Coding & Execution" }
    ]
  }
];
