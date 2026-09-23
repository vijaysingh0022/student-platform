/**
 * LearnX Core Curriculum Seed Data
 *
 * Provides real, rigorous Computer Science educational content across 8 major domains:
 * 1. Data Structures & Algorithms (DSA)
 * 2. Database Management Systems (DBMS)
 * 3. Operating Systems (OS)
 * 4. Computer Networks (CN)
 * 5. Object-Oriented Programming (OOPS)
 * 6. System Design & Architecture
 * 7. Full Stack Web Development
 * 8. Quantitative & Logical Aptitude
 */

export const CURRICULUM_SUBJECTS = [
  {
    "subjectId": "dsa",
    "name": "Data Structures & Algorithms",
    "code": "CS201",
    "description": "Master asymptotic analysis, recurrence relations, linked lists, trees, heaps, dynamic programming, and graph algorithms.",
    "icon": "\u26a1",
    "badge": "Core CSE",
    "color": "from-blue-600 to-indigo-600",
    "accentColor": "#3b82f6",
    "order": 1
  },
  {
    "subjectId": "dbms",
    "name": "Database Management Systems",
    "code": "CS202",
    "description": "Relational algebra, complex SQL joins, normalization up to BCNF, ACID transactions, and B+ tree indexing.",
    "icon": "\ud83d\uddc4\ufe0f",
    "badge": "Core CSE",
    "color": "from-emerald-600 to-teal-600",
    "accentColor": "#10b981",
    "order": 2
  },
  {
    "subjectId": "os",
    "name": "Operating Systems",
    "code": "CS203",
    "description": "Process control block, CPU scheduling algorithms, mutexes, semaphores, deadlock avoidance, and virtual memory paging.",
    "icon": "\ud83d\udcbb",
    "badge": "Core CSE",
    "color": "from-violet-600 to-purple-600",
    "accentColor": "#8b5cf6",
    "order": 3
  },
  {
    "subjectId": "cn",
    "name": "Computer Networks",
    "code": "CS204",
    "description": "OSI & TCP/IP layered architecture, IPv4/IPv6 CIDR subnetting, sliding window protocols, TCP handshakes, and routing protocols.",
    "icon": "\ud83c\udf10",
    "badge": "Core CSE",
    "color": "from-sky-600 to-blue-600",
    "accentColor": "#0284c7",
    "order": 4
  },
  {
    "subjectId": "oops",
    "name": "Object-Oriented Programming",
    "code": "CS205",
    "description": "Encapsulation, abstraction, inheritance, dynamic polymorphism, virtual tables, SOLID principles, and design patterns.",
    "icon": "\ud83e\udde9",
    "badge": "Software Eng",
    "color": "from-amber-600 to-orange-600",
    "accentColor": "#f59e0b",
    "order": 5
  },
  {
    "subjectId": "system-design",
    "name": "System Design & Architecture",
    "code": "CS301",
    "description": "High-scale distributed systems, load balancing, Redis caching, database sharding, replication, and the CAP theorem.",
    "icon": "\ud83c\udfd7\ufe0f",
    "badge": "Advanced Tech",
    "color": "from-rose-600 to-pink-600",
    "accentColor": "#e11d48",
    "order": 6
  },
  {
    "subjectId": "web-dev",
    "name": "Full Stack Web Development",
    "code": "CS302",
    "description": "JavaScript event loop, promises, React component lifecycle, Virtual DOM reconciliation, custom hooks, and REST APIs.",
    "icon": "\u269b\ufe0f",
    "badge": "Practical Eng",
    "color": "from-cyan-600 to-blue-600",
    "accentColor": "#06b6d4",
    "order": 7
  },
  {
    "subjectId": "aptitude",
    "name": "Aptitude & Logical Reasoning",
    "code": "CS101",
    "description": "Quantitative speed math, percentages, profit & loss, time and work, relative speed, permutations, and probability.",
    "icon": "\ud83c\udfaf",
    "badge": "Placement Prep",
    "color": "from-green-600 to-emerald-600",
    "accentColor": "#059669",
    "order": 8
  }
];

export const CURRICULUM_UNITS = [
  {
    "unitId": "dsa-u1",
    "subjectId": "dsa",
    "unitNumber": 1,
    "title": "Unit 1 \u2014 Algorithmic Foundations & Complexity",
    "description": "Big-O, Omega, Theta notations, recurrence relations, Master Theorem, and space-time trade-offs.",
    "order": 1
  },
  {
    "unitId": "dsa-u2",
    "subjectId": "dsa",
    "unitNumber": 2,
    "title": "Unit 2 \u2014 Searching & Sorting Mastery",
    "description": "Binary search variants, divide-and-conquer sorting, quick sort partitioning, and two pointers.",
    "order": 2
  },
  {
    "unitId": "dsa-u3",
    "subjectId": "dsa",
    "unitNumber": 3,
    "title": "Unit 3 \u2014 Linear Data Structures",
    "description": "Singly/doubly linked lists, cycle detection, stacks, monotonic stacks, and queue architectures.",
    "order": 3
  },
  {
    "unitId": "dsa-u4",
    "subjectId": "dsa",
    "unitNumber": 4,
    "title": "Unit 4 \u2014 Trees & Hierarchical Structures",
    "description": "Binary trees, traversals, binary search trees (BST), heaps, and priority queues.",
    "order": 4
  },
  {
    "unitId": "dsa-u5",
    "subjectId": "dsa",
    "unitNumber": 5,
    "title": "Unit 5 \u2014 Balanced Trees & Advanced Structures",
    "description": "AVL Tree rotations, Red-Black Trees, and Trie prefix trees for string processing.",
    "order": 5
  },
  {
    "unitId": "dsa-u6",
    "subjectId": "dsa",
    "unitNumber": 6,
    "title": "Unit 6 \u2014 Graph Theory & Algorithms",
    "description": "BFS, DFS, cycle detection, topological sorting, Dijkstra shortest paths, and MST.",
    "order": 6
  },
  {
    "unitId": "dbms-u1",
    "subjectId": "dbms",
    "unitNumber": 1,
    "title": "Unit 1 \u2014 Relational Model & SQL Mastery",
    "description": "Relational algebra, SQL joins, aggregations, subqueries, and B+ tree indexing.",
    "order": 1
  },
  {
    "unitId": "dbms-u2",
    "subjectId": "dbms",
    "unitNumber": 2,
    "title": "Unit 2 \u2014 Database Normalization & Schema Design",
    "description": "Functional dependencies, 1NF, 2NF, 3NF, BCNF lossless decomposition, and dependency preservation.",
    "order": 2
  },
  {
    "unitId": "dbms-u3",
    "subjectId": "dbms",
    "unitNumber": 3,
    "title": "Unit 3 \u2014 Transactions & Concurrency Control",
    "description": "ACID properties, serializability, 2-phase locking (2PL), deadlock prevention, and recovery.",
    "order": 3
  },
  {
    "unitId": "os-u1",
    "subjectId": "os",
    "unitNumber": 1,
    "title": "Unit 1 \u2014 Process Management & CPU Scheduling",
    "description": "PCB, context switching, threads, FCFS, SJF, Round Robin, and MLFQ scheduling.",
    "order": 1
  },
  {
    "unitId": "os-u2",
    "subjectId": "os",
    "unitNumber": 2,
    "title": "Unit 2 \u2014 Process Synchronization & Deadlocks",
    "description": "Critical section, mutexes, semaphores, Producer-Consumer, Banker's algorithm, and deadlock prevention.",
    "order": 2
  },
  {
    "unitId": "os-u3",
    "subjectId": "os",
    "unitNumber": 3,
    "title": "Unit 3 \u2014 Memory Management & Virtual Memory",
    "description": "Paging, TLB address translation, segmentation, virtual memory, and page replacement algorithms.",
    "order": 3
  },
  {
    "unitId": "cn-u1",
    "subjectId": "cn",
    "unitNumber": 1,
    "title": "Unit 1 \u2014 Layered Network Architecture",
    "description": "OSI 7-layer model vs TCP/IP suite, data link framing, CRC error detection, and ARQ flow control.",
    "order": 1
  },
  {
    "unitId": "cn-u2",
    "subjectId": "cn",
    "unitNumber": 2,
    "title": "Unit 2 \u2014 Network Layer & IP Addressing",
    "description": "IPv4/IPv6, CIDR subnetting, usable host math, routing protocols (Dijkstra/Bellman-Ford), and ARP/ICMP.",
    "order": 2
  },
  {
    "unitId": "cn-u3",
    "subjectId": "cn",
    "unitNumber": 3,
    "title": "Unit 3 \u2014 Transport & Application Layer",
    "description": "TCP 3-way handshake, 4-way teardown, sliding window, congestion control, and DNS/HTTP protocols.",
    "order": 3
  },
  {
    "unitId": "oops-u1",
    "subjectId": "oops",
    "unitNumber": 1,
    "title": "Unit 1 \u2014 The 4 Core OOP Pillars",
    "description": "Encapsulation, Data Abstraction, Inheritance hierarchies, and Dynamic Polymorphism with vtables.",
    "order": 1
  },
  {
    "unitId": "oops-u2",
    "subjectId": "oops",
    "unitNumber": 2,
    "title": "Unit 2 \u2014 SOLID Principles & Design Patterns",
    "description": "Single Responsibility, Open-Closed, Liskov, Interface Segregation, Dependency Inversion, and Design Patterns.",
    "order": 2
  },
  {
    "unitId": "sd-u1",
    "subjectId": "system-design",
    "unitNumber": 1,
    "title": "Unit 1 \u2014 Scalability & Distributed Architecture",
    "description": "Horizontal vs vertical scaling, load balancing, Redis caching, database sharding, and the CAP theorem.",
    "order": 1
  },
  {
    "unitId": "web-u1",
    "subjectId": "web-dev",
    "unitNumber": 1,
    "title": "Unit 1 \u2014 Modern JavaScript & React Foundations",
    "description": "Event loop, promises, async/await, React component lifecycle, Virtual DOM, and hooks.",
    "order": 1
  },
  {
    "unitId": "apt-u1",
    "subjectId": "aptitude",
    "unitNumber": 1,
    "title": "Unit 1 \u2014 Quantitative & Placement Aptitude",
    "description": "Percentages, profit and loss, time and work, relative speed, permutations, and probability.",
    "order": 1
  }
];

export const CURRICULUM_CHAPTERS = [
  {
    "chapterId": "dsa-u1-c1",
    "unitId": "dsa-u1",
    "subjectId": "dsa",
    "chapterNumber": 1,
    "title": "Asymptotic Analysis & Recurrences",
    "description": "Mathematical frameworks for evaluating computational efficiency.",
    "order": 1
  },
  {
    "chapterId": "dsa-u2-c1",
    "unitId": "dsa-u2",
    "subjectId": "dsa",
    "chapterNumber": 1,
    "title": "Searching Algorithms & Two Pointers",
    "description": "Logarithmic lookup techniques and monotonic search spaces.",
    "order": 1
  },
  {
    "chapterId": "dsa-u2-c2",
    "unitId": "dsa-u2",
    "subjectId": "dsa",
    "chapterNumber": 2,
    "title": "Comparison & Divide-and-Conquer Sorting",
    "description": "Divide-and-conquer sorting, in-place partitions, and stability analysis.",
    "order": 2
  },
  {
    "chapterId": "dsa-u3-c1",
    "unitId": "dsa-u3",
    "subjectId": "dsa",
    "chapterNumber": 1,
    "title": "Linked Lists & Pointer Manipulation",
    "description": "Node structures, pointer manipulation, and cycle detection.",
    "order": 1
  },
  {
    "chapterId": "dsa-u3-c2",
    "unitId": "dsa-u3",
    "subjectId": "dsa",
    "chapterNumber": 2,
    "title": "Stacks & Queues",
    "description": "LIFO and FIFO operations, monotonic stacks, and circular buffers.",
    "order": 2
  },
  {
    "chapterId": "dsa-u4-c1",
    "unitId": "dsa-u4",
    "subjectId": "dsa",
    "chapterNumber": 1,
    "title": "Binary Trees & BST",
    "description": "Tree traversals, binary search tree operations, and BST invariants.",
    "order": 1
  },
  {
    "chapterId": "dsa-u4-c2",
    "unitId": "dsa-u4",
    "subjectId": "dsa",
    "chapterNumber": 2,
    "title": "Heaps & Priority Queues",
    "description": "Min/Max heaps, heapify operations, and priority queues.",
    "order": 2
  },
  {
    "chapterId": "dsa-u5-c1",
    "unitId": "dsa-u5",
    "subjectId": "dsa",
    "chapterNumber": 1,
    "title": "Self-Balancing Trees & Tries",
    "description": "AVL tree rotations, Red-Black trees, and Trie prefix trees.",
    "order": 1
  },
  {
    "chapterId": "dsa-u6-c1",
    "unitId": "dsa-u6",
    "subjectId": "dsa",
    "chapterNumber": 1,
    "title": "Graph Traversals & Shortest Paths",
    "description": "BFS, DFS, topological sorting, Dijkstra, and Minimum Spanning Trees.",
    "order": 1
  },
  {
    "chapterId": "dbms-u1-c1",
    "unitId": "dbms-u1",
    "subjectId": "dbms",
    "chapterNumber": 1,
    "title": "Relational Querying, Joins & Indexing",
    "description": "SQL queries, complex joins, subqueries, and B+ tree indexes.",
    "order": 1
  },
  {
    "chapterId": "dbms-u2-c1",
    "unitId": "dbms-u2",
    "subjectId": "dbms",
    "chapterNumber": 1,
    "title": "Normalization Forms (1NF to BCNF)",
    "description": "Functional dependencies and eliminating schema anomalies.",
    "order": 1
  },
  {
    "chapterId": "dbms-u3-c1",
    "unitId": "dbms-u3",
    "subjectId": "dbms",
    "chapterNumber": 1,
    "title": "Transaction ACID & Locking Protocols",
    "description": "Serializability, two-phase locking (2PL), and deadlock recovery.",
    "order": 1
  },
  {
    "chapterId": "os-u1-c1",
    "unitId": "os-u1",
    "subjectId": "os",
    "chapterNumber": 1,
    "title": "CPU Scheduling & Thread Management",
    "description": "Process Control Block (PCB), multithreading, and scheduling algorithms.",
    "order": 1
  },
  {
    "chapterId": "os-u2-c1",
    "unitId": "os-u2",
    "subjectId": "os",
    "chapterNumber": 1,
    "title": "Synchronization & Deadlock Prevention",
    "description": "Semaphores, mutexes, classical sync problems, and Banker's algorithm.",
    "order": 1
  },
  {
    "chapterId": "os-u3-c1",
    "unitId": "os-u3",
    "subjectId": "os",
    "chapterNumber": 1,
    "title": "Virtual Memory & Paging Replacement",
    "description": "Page translation, TLB, demand paging, and page replacement policies.",
    "order": 1
  },
  {
    "chapterId": "cn-u1-c1",
    "unitId": "cn-u1",
    "subjectId": "cn",
    "chapterNumber": 1,
    "title": "OSI vs TCP/IP & Data Link Layer",
    "description": "Layer architectures, framing, CRC error checking, and sliding windows.",
    "order": 1
  },
  {
    "chapterId": "cn-u2-c1",
    "unitId": "cn-u2",
    "subjectId": "cn",
    "chapterNumber": 1,
    "title": "IP Subnetting, CIDR & Routing",
    "description": "Subnet masks, prefix math, CIDR, and routing protocols.",
    "order": 1
  },
  {
    "chapterId": "cn-u3-c1",
    "unitId": "cn-u3",
    "subjectId": "cn",
    "chapterNumber": 1,
    "title": "TCP Mechanics & Application Protocols",
    "description": "TCP 3-way handshake, congestion control, DNS, and HTTP.",
    "order": 1
  },
  {
    "chapterId": "oops-u1-c1",
    "unitId": "oops-u1",
    "subjectId": "oops",
    "chapterNumber": 1,
    "title": "Core Pillars & Runtime Polymorphism",
    "description": "Encapsulation, inheritance, virtual tables, and dynamic dispatch.",
    "order": 1
  },
  {
    "chapterId": "oops-u2-c1",
    "unitId": "oops-u2",
    "subjectId": "oops",
    "chapterNumber": 1,
    "title": "SOLID Principles & Design Patterns",
    "description": "SOLID clean code principles and fundamental design patterns.",
    "order": 1
  },
  {
    "chapterId": "sd-u1-c1",
    "unitId": "sd-u1",
    "subjectId": "system-design",
    "chapterNumber": 1,
    "title": "Scalability, Caching & Sharding",
    "description": "Load balancing, distributed Redis caching, sharding, and CAP theorem.",
    "order": 1
  },
  {
    "chapterId": "web-u1-c1",
    "unitId": "web-u1",
    "subjectId": "web-dev",
    "chapterNumber": 1,
    "title": "JavaScript Async & React Ecosystem",
    "description": "Event loop, promises, React hooks, and RESTful architectures.",
    "order": 1
  },
  {
    "chapterId": "apt-u1-c1",
    "unitId": "apt-u1",
    "subjectId": "aptitude",
    "chapterNumber": 1,
    "title": "Quantitative Math & Placement Logic",
    "description": "Speed math, time-speed-distance, permutations, and probability.",
    "order": 1
  }
];

export const CURRICULUM_TOPICS = [
  {
    "topicId": "algorithm-complexity",
    "chapterId": "dsa-u1-c1",
    "unitId": "dsa-u1",
    "subjectId": "dsa",
    "topicNumber": 1,
    "title": "Asymptotic Analysis: Big-O, Omega, and Theta Notations",
    "estimatedMinutes": 25,
    "difficulty": "Beginner",
    "summary": "Mathematical framework for measuring program growth rate and memory utilization independently of hardware.",
    "subtopics": [
      "Big-O Formal Definition",
      "Big-Omega Lower Bound",
      "Big-Theta Tight Bound",
      "Dominant Term Rule",
      "Complexity Classes Hierarchy"
    ],
    "hasVisualization": false,
    "content": {
      "introduction": "Asymptotic analysis evaluates how the execution time or memory footprint of an algorithm scales as input size N grows toward infinity. By categorizing algorithms into standardized complexity classes (such as O(1), O(log N), O(N), O(N log N), O(N^2), and O(2^N)), software engineers make predictable performance decisions before running code in production environments.",
      "concepts": [
        "Big-O Notation (O): Denotes the formal asymptotic upper bound. f(N) = O(g(N)) means f(N) <= c * g(N) for all N >= N0. It guarantees that the algorithm will never exceed this growth rate in the worst-case scenario.",
        "Big-Omega Notation (\u03a9): Denotes the formal asymptotic lower bound. f(N) = \u03a9(g(N)) means f(N) >= c * g(N) for all N >= N0, representing the absolute minimum computational work required.",
        "Big-Theta Notation (\u0398): Denotes an asymptotically tight bound where the upper and lower bounds coincide: c1 * g(N) <= f(N) <= c2 * g(N).",
        "Dominant Term Principle: Lower-order polynomials and constant scalar multipliers are dropped because higher-order exponents completely dominate at scale (e.g. 7N^3 + 400N + 9000 is simply O(N^3)).",
        "Hierarchy of Complexities: O(1) Constant < O(log N) Logarithmic < O(N) Linear < O(N log N) Linearithmic < O(N^2) Quadratic < O(2^N) Exponential < O(N!) Factorial."
      ],
      "importantPoints": [
        "Big-O describes growth rate as N approaches infinity, not exact clock execution time in milliseconds.",
        "An algorithm with O(1) time complexity does not mean it takes 1 instruction, but rather that its runtime remains strictly constant regardless of dataset size.",
        "Space complexity must account for both auxiliary heap memory and recursive call-stack stack frames."
      ],
      "examples": [
        "Example 1: Single loop `for (int i = 0; i < N; i++)` runs N times -> \u0398(N) linear time.",
        "Example 2: Nested loop `for (int i = 0; i < N; i++) for (int j = 0; j < N; j++)` runs N*N times -> \u0398(N^2) quadratic time.",
        "Example 3: Halving variable `while (N > 0) { N /= 2; }` -> \u0398(log N) logarithmic time."
      ],
      "algorithmSteps": [
        "1. Identify the input size parameter N.",
        "2. Count atomic elementary operations (assignments, comparisons, arithmetic).",
        "3. Formulate total execution count as a polynomial function T(N).",
        "4. Eliminate constant coefficients and lower-order terms.",
        "5. State the dominant asymptotic bound (O, \u03a9, or \u0398)."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ Complexity Demonstrations",
          "code": "#include <iostream>\n#include <vector>\n\n// O(1) Constant Time\nint getHead(const std::vector<int>& v) {\n    return v.empty() ? -1 : v[0];\n}\n\n// O(N) Linear Time\nint findMax(const std::vector<int>& v) {\n    int mx = v[0];\n    for (int x : v) if (x > mx) mx = x;\n    return mx;\n}\n\n// O(N^2) Quadratic Time\nvoid printPairs(const std::vector<int>& v) {\n    for (size_t i = 0; i < v.size(); ++i)\n        for (size_t j = 0; j < v.size(); ++j)\n            std::cout << v[i] << \",\" << v[j] << \" \";\n}",
          "explanation": "Illustrates fundamental complexity classes in standard modern C++."
        },
        {
          "language": "python",
          "title": "Python Complexity Classes",
          "code": "def constant_op(arr: list[int]) -> int:\n    return arr[0] if arr else -1 # O(1)\n\ndef linear_search(arr: list[int], target: int) -> int:\n    for idx, val in enumerate(arr):\n        if val == target:\n            return idx\n    return -1 # O(N)\n\ndef binary_division(n: int) -> int:\n    steps = 0\n    while n > 1:\n        n //= 2\n        steps += 1\n    return steps # O(log N)",
          "explanation": "Demonstrates O(1), O(N), and O(log N) execution patterns in Python."
        }
      ],
      "timeComplexity": "O(1) to O(N!) theoretical spectrum classification",
      "spaceComplexity": "O(1) auxiliary space",
      "keyTakeaways": [
        "Always aim to optimize nested O(N^2) loops into O(N log N) or O(N) with HashMaps, Two Pointers, or Divide-and-Conquer.",
        "Space complexity analysis must include recursion stack depth.",
        "Asymptotic analysis focuses on large inputs (N -> \u221e) where constant factors become negligible."
      ],
      "commonMistakes": [
        "Assuming Big-O is always the worst-case scenario (Big-O can be applied to best, average, or worst cases).",
        "Assuming nested loops are always O(N^2) without checking if the inner loop increments multiplicatively."
      ]
    }
  },
  {
    "topicId": "recurrence-master-theorem",
    "chapterId": "dsa-u1-c1",
    "unitId": "dsa-u1",
    "subjectId": "dsa",
    "topicNumber": 2,
    "title": "Recurrence Relations & The Master Theorem",
    "estimatedMinutes": 30,
    "difficulty": "Intermediate",
    "summary": "Techniques for solving divide-and-conquer recurrence equations using closed-form Master Theorem formulas.",
    "subtopics": [
      "Divide-and-Conquer Recurrences",
      "Master Theorem Formula",
      "Case 1: Leaf Heavy",
      "Case 2: Balanced Work",
      "Case 3: Root Heavy"
    ],
    "hasVisualization": false,
    "content": {
      "introduction": "Divide-and-conquer algorithms divide a problem into smaller subproblems, solve each recursively, and combine the solutions. The execution cost is modeled by recurrence relations: T(N) = a*T(N/b) + f(N). The Master Theorem provides an instant closed-form asymptotic solution for such recurrences without expanding recursion trees.",
      "concepts": [
        "Standard Recurrence Formula: T(N) = a * T(N/b) + f(N), where 'a' is the number of recursive branches (a >= 1), 'b' is the subproblem reduction factor (b > 1), and 'f(N)' is the divide/combine cost.",
        "Critical Exponent: Evaluated as log_b(a). It represents the asymptotic work done at the leaf level of the recursion tree.",
        "Case 1 (Leaf Dominated): If f(N) = O(N^(log_b(a) - \u03b5)) for \u03b5 > 0, leaf work dominates. Result: T(N) = \u0398(N^(log_b(a))).",
        "Case 2 (Evenly Distributed): If f(N) = \u0398(N^(log_b(a)) * log^k(N)) for k >= 0, work is evenly spread across all tree levels. Result: T(N) = \u0398(N^(log_b(a)) * log^(k+1)(N)).",
        "Case 3 (Root Dominated): If f(N) = \u03a9(N^(log_b(a) + \u03b5)) for \u03b5 > 0 and regularity condition a*f(N/b) <= c*f(N) holds for c < 1, root work dominates. Result: T(N) = \u0398(f(N))."
      ],
      "importantPoints": [
        "Merge Sort: T(N) = 2T(N/2) + O(N) -> a=2, b=2, log_2(2)=1. Matches Case 2 (k=0) -> T(N) = \u0398(N log N).",
        "Binary Search: T(N) = T(N/2) + O(1) -> a=1, b=2, log_2(1)=0. Matches Case 2 (k=0) -> T(N) = \u0398(log N).",
        "Karatsuba Multiplication: T(N) = 3T(N/2) + O(N) -> log_2(3) \u2248 1.585 > 1. Matches Case 1 -> T(N) = \u0398(N^1.585)."
      ],
      "examples": [
        "Example 1: T(N) = 4T(N/2) + N. a=4, b=2, log_2(4)=2. f(N)=N^1. Since 1 < 2, Case 1 applies: T(N) = \u0398(N^2).",
        "Example 2: T(N) = 2T(N/2) + N log N. a=2, b=2, log_2(2)=1. f(N)=N^1 * log^1(N). Case 2 with k=1 applies: T(N) = \u0398(N log^2 N)."
      ],
      "algorithmSteps": [
        "1. Extract parameters a, b, and f(N) from T(N) = aT(N/b) + f(N).",
        "2. Calculate the critical exponent log_b(a).",
        "3. Compare the growth rate of f(N) with N^(log_b(a)).",
        "4. Apply Case 1, 2, or 3 to write the direct \u0398 bound.",
        "5. If Master Theorem conditions fail (e.g., non-polynomial difference), use recursion tree expansion."
      ],
      "codeSnippets": [
        {
          "language": "python",
          "title": "Python Recurrence Simulation",
          "code": "def simulate_merge_sort_work(n: int) -> int:\n    if n <= 1:\n        return 1\n    # 2 subproblems of size n/2 + n work to combine\n    return 2 * simulate_merge_sort_work(n // 2) + n\n\nprint('Total Operations for N=1024:', simulate_merge_sort_work(1024))",
          "explanation": "Simulates operational steps for divide-and-conquer recurrence equations."
        }
      ],
      "timeComplexity": "O(1) closed-form calculation using Master Theorem",
      "spaceComplexity": "O(log N) recursion depth",
      "keyTakeaways": [
        "Master theorem provides immediate answers in technical interview rounds for recursive algorithmic analysis.",
        "Minimizing recursive branching factor 'a' dramatically reduces overall time complexity."
      ],
      "commonMistakes": [
        "Applying Master Theorem when subproblem reduction is additive (e.g., T(N) = T(N-1) + O(1)).",
        "Forgetting the regularity check when applying Case 3."
      ]
    }
  },
  {
    "topicId": "binary-search",
    "chapterId": "dsa-u2-c1",
    "unitId": "dsa-u2",
    "subjectId": "dsa",
    "topicNumber": 1,
    "title": "Binary Search & Monotonic Search Space Reduction",
    "estimatedMinutes": 25,
    "difficulty": "Beginner",
    "summary": "Logarithmic time lookup algorithm for monotonically sorted sequences and monotonic boolean predicate functions.",
    "subtopics": [
      "Divide and Conquer Strategy",
      "Midpoint Overflow Prevention",
      "Lower & Upper Bound Variants",
      "Search Space Reduction"
    ],
    "hasVisualization": true,
    "content": {
      "introduction": "Binary Search is the fundamental logarithmic search technique in computer science. Operating on sorted arrays or monotonic predicate spaces, it halves the search interval in each step, reducing 1,000,000 elements to merely 20 comparisons.",
      "concepts": [
        "Monotonic Search Space: Applicable whenever elements are sorted or evaluate to a monotonic boolean property (False, False, ..., True, True).",
        "Safe Midpoint Calculation: Using `low + (high - low) / 2` avoids 32-bit signed integer overflow caused by `(low + high) / 2`.",
        "Loop Invariant: Target always lies strictly within the active search boundary `[low, high]`.",
        "Lower Bound & Upper Bound: Lower Bound finds the first element >= key; Upper Bound finds the first element > key."
      ],
      "importantPoints": [
        "Binary search reduces 1 billion elements to just 30 comparisons (2^30 \u2248 1,073,741,824).",
        "Requires random-access O(1) indexing; on linked lists, binary search degrades to O(N) due to sequential traversal."
      ],
      "examples": [
        "Example 1: Find 23 in sorted array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91].\n\u2022 Step 1: low=0, high=9, mid=4 (val=16). 23 > 16 -> low=5.\n\u2022 Step 2: low=5, high=9, mid=7 (val=56). 23 < 56 -> high=6.\n\u2022 Step 3: low=5, high=6, mid=5 (val=23). Found at index 5!"
      ],
      "algorithmSteps": [
        "1. Initialize `low = 0`, `high = array.length - 1`.",
        "2. While `low <= high`:\n   a. Compute safe midpoint: `mid = low + (high - low) / 2`.\n   b. If `array[mid] == target`, return `mid`.\n   c. If `array[mid] < target`, discard left half: `low = mid + 1`.\n   d. If `array[mid] > target`, discard right half: `high = mid - 1`.",
        "3. If loop ends without match, return -1."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ Iterative Binary Search",
          "code": "#include <vector>\n#include <iostream>\n\nint binarySearch(const std::vector<int>& arr, int target) {\n    int low = 0, high = static_cast<int>(arr.size()) - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}",
          "explanation": "Standard C++ implementation with vector references and safe midpoint calculation."
        }
      ],
      "timeComplexity": "O(log N) Best, Average, and Worst Case",
      "spaceComplexity": "O(1) Auxiliary Space for iterative implementation",
      "keyTakeaways": [
        "Binary search on answer spaces is a vital technique in LeetCode/interview problems.",
        "Be vigilant of loop boundary conditions: low <= high."
      ],
      "commonMistakes": [
        "Using (low + high) / 2 which can overflow for large arrays in C++ / Java.",
        "Off-by-one errors when setting low = mid instead of low = mid + 1."
      ]
    }
  },
  {
    "topicId": "two-pointers-sliding-window",
    "chapterId": "dsa-u2-c1",
    "unitId": "dsa-u2",
    "subjectId": "dsa",
    "topicNumber": 2,
    "title": "Two Pointers & Sliding Window Search Techniques",
    "estimatedMinutes": 25,
    "difficulty": "Intermediate",
    "summary": "Techniques for reducing O(N^2) nested subarray/pair searches into optimal O(N) linear scans.",
    "subtopics": [
      "Opposite Direction Pointers",
      "Same Direction / Fast & Slow Pointers",
      "Fixed-size Sliding Window",
      "Dynamic Variable-size Sliding Window"
    ],
    "hasVisualization": true,
    "content": {
      "introduction": "Two Pointers and Sliding Window are fundamental algorithmic optimization paradigms. By tracking subarray boundaries or converging indices simultaneously, they avoid redundant recomputation, transforming O(N^2) brute-force searches into optimal O(N) single-pass solutions.",
      "concepts": [
        "Opposite Direction Pointers: Typically initialized at array extremes (left = 0, right = N - 1) and converged based on sorted criteria.",
        "Fast and Slow Pointers: Moving pointers at different speeds (1 step vs 2 steps) to detect cycles or find list midpoints.",
        "Fixed-size Sliding Window: Maintains a window of exact width K, sliding one element right in O(1).",
        "Variable-size Sliding Window: Expands the right boundary until a condition is met, then contracts left boundary."
      ],
      "importantPoints": [
        "Transforms quadratic nested loops O(N^2) into linear time O(N).",
        "Requires continuous subarray monotonicity."
      ],
      "examples": [
        "Example: Max sum subarray of size K in `[2, 1, 5, 1, 3, 2]`, K=3 -> Max sum = 9."
      ],
      "algorithmSteps": [
        "1. Initialize `left = 0`, `right = 0`.",
        "2. Expand `right` pointer to include new elements.",
        "3. Contract `left` when condition is violated.",
        "4. Return optimal answer."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ Sliding Window (Max Subarray Sum K)",
          "code": "#include <vector>\n#include <algorithm>\n\nint maxSubarraySumK(const std::vector<int>& arr, int k) {\n    if (arr.size() < k) return -1;\n    int windowSum = 0;\n    for (int i = 0; i < k; ++i) windowSum += arr[i];\n    int maxSum = windowSum;\n    for (size_t i = k; i < arr.size(); ++i) {\n        windowSum += arr[i] - arr[i - k];\n        maxSum = std::max(maxSum, windowSum);\n    }\n    return maxSum;\n}",
          "explanation": "Maintains sliding window sum in O(1) per step."
        }
      ],
      "timeComplexity": "O(N) Linear Time",
      "spaceComplexity": "O(1) Auxiliary Space",
      "keyTakeaways": [
        "Recognize problems asking for 'longest subarray with condition X' as sliding window candidates."
      ],
      "commonMistakes": [
        "Using sliding window when array contains negative numbers (requires prefix sums with HashMaps)."
      ]
    }
  },
  {
    "topicId": "quick-sort",
    "chapterId": "dsa-u2-c2",
    "unitId": "dsa-u2",
    "subjectId": "dsa",
    "topicNumber": 3,
    "title": "Quick Sort & Partitioning Algorithms (Lomuto vs Hoare)",
    "estimatedMinutes": 30,
    "difficulty": "Intermediate",
    "summary": "High-performance in-place divide-and-conquer sorting based on pivot partitioning.",
    "subtopics": [
      "Divide and Conquer Strategy",
      "Lomuto Partition Scheme",
      "Hoare Partition Scheme",
      "Worst-case Avoidance with Randomized Pivot"
    ],
    "hasVisualization": true,
    "content": {
      "introduction": "Quick Sort is the standard in-place sorting algorithm used in language runtimes (like C++ std::sort introsort). It selects a pivot element, partitions the array such that all smaller elements move left and larger elements move right, and recursively sorts the partitions.",
      "concepts": [
        "Partitioning Invariant: After partitioning, the pivot element occupies its exact final sorted position.",
        "Lomuto Partitioning: Uses single direction scan. Simple to implement, performs ~3x more swaps than Hoare.",
        "Hoare Partitioning: Uses bidirectional converging pointers. Faster in practice.",
        "Randomized Pivot: Picking pivot randomly avoids worst-case O(N^2) on sorted inputs."
      ],
      "importantPoints": [
        "Quick sort is cache-friendly and in-place O(log N) stack space.",
        "Quick sort is NOT stable."
      ],
      "examples": [
        "Example: Partition `[10, 80, 30, 90, 40, 50, 70]`, Pivot = 70 -> Result `[10, 30, 40, 50, 70, 90, 80]`."
      ],
      "algorithmSteps": [
        "1. Choose pivot.",
        "2. Partition array around pivot.",
        "3. Recurse on left and right subarrays."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ Quick Sort",
          "code": "#include <vector>\n#include <algorithm>\n\nint partition(std::vector<int>& arr, int low, int high) {\n    int pivot = arr[high];\n    int i = low - 1;\n    for (int j = low; j < high; ++j) {\n        if (arr[j] < pivot) {\n            ++i;\n            std::swap(arr[i], arr[j]);\n        }\n    }\n    std::swap(arr[i + 1], arr[high]);\n    return i + 1;\n}\n\nvoid quickSort(std::vector<int>& arr, int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}",
          "explanation": "In-place Quick Sort using Lomuto partition."
        }
      ],
      "timeComplexity": "O(N log N) Average Case, O(N^2) Worst Case",
      "spaceComplexity": "O(log N) Recursive call stack space",
      "keyTakeaways": [
        "Quick Sort is preferred for arrays due to spatial locality and in-place partitioning."
      ],
      "commonMistakes": [
        "Choosing the first or last element as pivot on already sorted arrays without randomization."
      ]
    }
  },
  {
    "topicId": "linked-lists",
    "chapterId": "dsa-u3-c1",
    "unitId": "dsa-u3",
    "subjectId": "dsa",
    "topicNumber": 1,
    "title": "Singly & Doubly Linked List Architecture & Pointer Manipulation",
    "estimatedMinutes": 25,
    "difficulty": "Beginner",
    "summary": "Dynamic linear memory structures connected via node pointers, enabling O(1) insertions/deletions.",
    "subtopics": [
      "Node Memory Layout",
      "Singly vs Doubly Linked Lists",
      "Head & Tail Pointer Management",
      "O(1) Insertion & Deletion at Head"
    ],
    "hasVisualization": true,
    "content": {
      "introduction": "A Linked List is a linear dynamic data structure where elements are not stored in contiguous memory locations. Instead, each element (node) contains data and a pointer/reference to the next node in memory, enabling dynamic resizing without expensive reallocations.",
      "concepts": [
        "Singly Linked List: Each node contains `data` and a `next` pointer.",
        "Doubly Linked List: Each node contains `data`, `prev`, and `next` pointers, enabling bidirectional traversal.",
        "Circular Linked List: The last node's `next` loops back to the head node."
      ],
      "importantPoints": [
        "Insert/Delete at Head: O(1) time.",
        "Lookup by Index: O(N) sequential traversal."
      ],
      "examples": [
        "Example: Reversing a Singly Linked List `1 -> 2 -> 3 -> 4 -> NULL` -> Result `4 -> 3 -> 2 -> 1 -> NULL`."
      ],
      "algorithmSteps": [
        "1. Allocate new node on heap.",
        "2. Update pointers.",
        "3. Free detached memory in C++."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ Linked List Reverse",
          "code": "struct ListNode {\n    int val;\n    ListNode* next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while (curr != nullptr) {\n        ListNode* nextNode = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nextNode;\n    }\n    return prev;\n}",
          "explanation": "Iterative 3-pointer linked list reversal."
        }
      ],
      "timeComplexity": "O(1) Insertion/Deletion at known pointer, O(N) Search",
      "spaceComplexity": "O(N) Total storage space",
      "keyTakeaways": [
        "Use dummy head nodes to eliminate edge-case branching."
      ],
      "commonMistakes": [
        "Dereferencing nullptr when accessing curr->next."
      ]
    }
  },
  {
    "topicId": "stacks-and-queues",
    "chapterId": "dsa-u3-c2",
    "unitId": "dsa-u3",
    "subjectId": "dsa",
    "topicNumber": 1,
    "title": "Stacks, Queues & Monotonic Stack Applications",
    "estimatedMinutes": 30,
    "difficulty": "Beginner",
    "summary": "LIFO and FIFO linear data structures, circular queue buffers, and monotonic stack algorithms.",
    "subtopics": [
      "LIFO vs FIFO Mechanics",
      "Stack Infix to Postfix Conversion",
      "Circular Queue Array Implementation",
      "Next Greater Element (Monotonic Stack)"
    ],
    "hasVisualization": true,
    "content": {
      "introduction": "Stacks and Queues are fundamental linear abstract data types. A Stack operates on a Last-In, First-Out (LIFO) principle, while a Queue operates on a First-In, First-Out (FIFO) principle. Monotonic stacks maintain elements in strictly monotonic order, optimizing Next Greater Element queries from O(N^2) to O(N).",
      "concepts": [
        "Stack (LIFO): Insertion (push) and removal (pop) occur strictly at the top in O(1) time.",
        "Queue (FIFO): Insertion (enqueue) occurs at the rear; removal (dequeue) occurs at the front in O(1) time.",
        "Circular Queue: Avoids memory waste in fixed arrays by wrapping indices using modulo arithmetic: `(rear + 1) % capacity`.",
        "Monotonic Stack: A stack where elements are kept in monotonic increasing or decreasing order, solving Next Greater Element / Stock Span problems in linear O(N) time."
      ],
      "importantPoints": [
        "Stack is used in function call stack recursion, expression evaluation, and browser back buttons.",
        "Queue is used in CPU scheduling, BFS graph traversal, and asynchronous message buffers (RabbitMQ/Kafka)."
      ],
      "examples": [
        "Example: Next Greater Element for `[4, 5, 2, 25]` using Monotonic Stack -> Result `[5, 25, 25, -1]`."
      ],
      "algorithmSteps": [
        "1. Initialize empty Stack.",
        "2. Iterate through array.",
        "3. Pop smaller elements to maintain decreasing invariant.",
        "4. Record next greater element."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ Monotonic Stack (Next Greater Element)",
          "code": "#include <vector>\n#include <stack>\n\nstd::vector<int> nextGreaterElements(const std::vector<int>& arr) {\n    int n = arr.size();\n    std::vector<int> nge(n, -1);\n    std::stack<int> st;\n    for (int i = n - 1; i >= 0; --i) {\n        while (!st.empty() && st.top() <= arr[i]) st.pop();\n        if (!st.empty()) nge[i] = st.top();\n        st.push(arr[i]);\n    }\n    return nge;\n}",
          "explanation": "Finds Next Greater Element in O(N) linear time using monotonic stack."
        }
      ],
      "timeComplexity": "O(1) Push/Pop/Enqueue/Dequeue, O(N) Monotonic Stack Scan",
      "spaceComplexity": "O(N) Auxiliary stack memory",
      "keyTakeaways": [
        "Monotonic Stack reduces quadratic comparison loops to single pass."
      ],
      "commonMistakes": [
        "Using a standard array for Queue with shift() in JavaScript / Python causing O(N) dequeue overhead (use double-ended queue / deque instead)."
      ]
    }
  },
  {
    "topicId": "floyds-cycle-detection",
    "chapterId": "dsa-u3-c1",
    "unitId": "dsa-u3",
    "subjectId": "dsa",
    "topicNumber": 2,
    "title": "Floyd's Cycle-Finding Algorithm (Tortoise & Hare)",
    "estimatedMinutes": 25,
    "difficulty": "Intermediate",
    "summary": "O(N) time and O(1) space pointer algorithm for detecting and locating loop entry nodes in linked structures.",
    "subtopics": [
      "Two Pointer Speed Differential",
      "Cycle Detection Proof",
      "Finding Loop Entry Node",
      "Calculating Loop Length"
    ],
    "hasVisualization": true,
    "content": {
      "introduction": "Floyd's Cycle Detection Algorithm uses two pointers moving at different speeds (slow moves 1 step, fast moves 2 steps) to detect if a cycle exists in a linked list in O(N) time and O(1) auxiliary space.",
      "concepts": [
        "Speed Differential: The distance between fast and slow increases by 1 node in every step inside a cycle, ensuring collision.",
        "Collision Point: If `slow == fast`, a cycle is guaranteed.",
        "Finding Entry Point: Reset `slow = head`, advance both by 1 step until they meet at the cycle entry node."
      ],
      "importantPoints": [
        "Detects loops in O(N) time and O(1) space without using HashSets."
      ],
      "examples": [
        "Example: List with loop at node 3 -> Slow and fast meet inside loop, reset slow to head, meet at node 3."
      ],
      "algorithmSteps": [
        "1. `slow = head`, `fast = head`.",
        "2. While `fast && fast->next`: `slow = slow->next`, `fast = fast->next->next`.",
        "3. If `slow == fast`, cycle found."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ Floyd's Cycle Detection",
          "code": "ListNode* detectCycle(ListNode* head) {\n    if (!head || !head->next) return nullptr;\n    ListNode *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) {\n            ListNode* entry = head;\n            while (entry != slow) {\n                entry = entry->next;\n                slow = slow->next;\n            }\n            return entry;\n        }\n    }\n    return nullptr;\n}",
          "explanation": "Cycle detection and entry point discovery."
        }
      ],
      "timeComplexity": "O(N) Linear Time",
      "spaceComplexity": "O(1) Auxiliary Space",
      "keyTakeaways": [
        "Floyd's algorithm avoids O(N) memory overhead of HashSets."
      ],
      "commonMistakes": [
        "Accessing fast->next->next when fast->next is nullptr."
      ]
    }
  },
  {
    "topicId": "binary-search-trees",
    "chapterId": "dsa-u4-c1",
    "unitId": "dsa-u4",
    "subjectId": "dsa",
    "topicNumber": 1,
    "title": "Binary Search Trees (BST): Properties, Traversals & Invariants",
    "estimatedMinutes": 30,
    "difficulty": "Beginner",
    "summary": "Hierarchical node structures where every node's left subtree contains smaller keys and right subtree contains larger keys.",
    "subtopics": [
      "BST Ordering Property",
      "Inorder, Preorder, Postorder Traversals",
      "Search, Insert & Delete Operations",
      "Inorder Successor & Predecessor",
      "Degenerate Tree (Skewed BST)"
    ],
    "hasVisualization": true,
    "content": {
      "introduction": "A Binary Search Tree (BST) is a binary tree data structure where each node has at most two children, satisfying the strict BST invariant: for any given node X, all values in its left subtree are strictly less than X.val, and all values in its right subtree are strictly greater than X.val.",
      "concepts": [
        "BST Invariant: LeftSubtree.keys < Root.key < RightSubtree.keys.",
        "Inorder Traversal: Visits nodes in strictly sorted ascending order (Left -> Root -> Right).",
        "Search & Insertion: O(H) time where H is tree height.",
        "Deletion Cases: Leaf node (direct delete), One child (replace with child), Two children (replace with Inorder Successor)."
      ],
      "importantPoints": [
        "Inorder traversal of BST always produces sorted elements.",
        "Height of balanced BST is O(log N); skewed BST is O(N)."
      ],
      "examples": [
        "Example: Insert [50, 30, 70, 20, 40] -> Inorder traversal: [20, 30, 40, 50, 70]."
      ],
      "algorithmSteps": [
        "1. Start at root.",
        "2. If target < curr.val, go left; if target > curr.val, go right.",
        "3. Return node when found."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ BST Search & Insert",
          "code": "struct TreeNode {\n    int val;\n    TreeNode *left, *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nTreeNode* insertBST(TreeNode* root, int val) {\n    if (!root) return new TreeNode(val);\n    if (val < root->val) root->left = insertBST(root->left, val);\n    else if (val > root->val) root->right = insertBST(root->right, val);\n    return root;\n}",
          "explanation": "Recursive BST insert in C++."
        }
      ],
      "timeComplexity": "O(log N) Average Case, O(N) Worst Case",
      "spaceComplexity": "O(H) Recursion stack depth",
      "keyTakeaways": [
        "Use self-balancing trees (AVL/Red-Black) to avoid O(N) degeneration."
      ],
      "commonMistakes": [
        "Checking only immediate parent-child relation rather than full subtree range."
      ]
    }
  },
  {
    "topicId": "binary-heaps-priority-queues",
    "chapterId": "dsa-u4-c2",
    "unitId": "dsa-u4",
    "subjectId": "dsa",
    "topicNumber": 2,
    "title": "Binary Heaps (Min/Max Heaps) & Priority Queues",
    "estimatedMinutes": 30,
    "difficulty": "Intermediate",
    "summary": "Array-based complete binary tree structures providing O(1) top priority retrieval and O(log N) insertions.",
    "subtopics": [
      "Complete Binary Tree Array Representation",
      "Min-Heap vs Max-Heap Property",
      "Heapify Up & Down",
      "Priority Queue Interface"
    ],
    "hasVisualization": true,
    "content": {
      "introduction": "A Binary Heap is a complete binary tree stored compactly in an array that satisfies the Heap Property. In a Max-Heap, every parent is >= children; in a Min-Heap, every parent is <= children.",
      "concepts": [
        "Array Indices: For index i -> Parent = (i-1)/2, Left = 2i+1, Right = 2i+2.",
        "Insert (Heapify Up): Append to end, bubble up (O(log N)).",
        "Extract Top (Heapify Down): Swap root with last element, pop last, sift root down (O(log N)).",
        "Build-Heap: O(N) linear time using bottom-up heapification."
      ],
      "importantPoints": [
        "Peek Top: O(1) time.",
        "Insert/Extract: O(log N) time."
      ],
      "examples": [
        "Example: Min-Heap with elements [10, 20, 15, 30] -> Top is always 10."
      ],
      "algorithmSteps": [
        "1. Insert at end of array.",
        "2. Compare with parent and swap if smaller/larger.",
        "3. Repeat until invariant restored."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ Min-Heap",
          "code": "#include <queue>\n#include <vector>\n#include <iostream>\n\nint main() {\n    std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;\n    minHeap.push(30); minHeap.push(10); minHeap.push(20);\n    while (!minHeap.empty()) {\n        std::cout << minHeap.top() << ' '; // Prints 10, 20, 30\n        minHeap.pop();\n    }\n    return 0;\n}",
          "explanation": "C++ STL min-heap priority queue."
        }
      ],
      "timeComplexity": "O(1) Peek, O(log N) Insert & Pop, O(N) Build-Heap",
      "spaceComplexity": "O(N) contiguous array storage",
      "keyTakeaways": [
        "Building a heap from array is O(N), not O(N log N)."
      ],
      "commonMistakes": [
        "Confusing Binary Heap (complete tree) with BST (ordered tree)."
      ]
    }
  },
  {
    "topicId": "avl-tree-rotations",
    "chapterId": "dsa-u5-c1",
    "unitId": "dsa-u5",
    "subjectId": "dsa",
    "topicNumber": 1,
    "title": "AVL Trees & Self-Balancing Rotations (LL, RR, LR, RL)",
    "estimatedMinutes": 30,
    "difficulty": "Intermediate",
    "summary": "Strictly height-balanced binary search trees guaranteeing O(log N) worst-case lookups via single and double tree rotations.",
    "subtopics": [
      "Balance Factor Invariant (-1, 0, +1)",
      "Left-Left (LL) Single Right Rotation",
      "Right-Right (RR) Single Left Rotation",
      "Left-Right (LR) Double Rotation",
      "Right-Left (RL) Double Rotation"
    ],
    "hasVisualization": true,
    "content": {
      "introduction": "An AVL Tree is a self-balancing Binary Search Tree where the difference between heights of left and right subtrees (Balance Factor) for any node is strictly at most 1. Whenever an insertion or deletion violates this invariant, tree rotations restore balance in O(1) time.",
      "concepts": [
        "Balance Factor: `BF(node) = height(left) - height(right)`.",
        "LL Imbalance: Fixed with a Single Right Rotation.",
        "RR Imbalance: Fixed with a Single Left Rotation.",
        "LR / RL Imbalance: Fixed with Double Rotations.",
        "Height Guarantee: Max height is strictly bounded by `1.44 * log2(N)`."
      ],
      "importantPoints": [
        "Guarantees O(log N) worst-case search, insert, and delete."
      ],
      "examples": [
        "Example: Insert [30, 20, 10] -> Right Rotate at 30 -> 20 becomes new root."
      ],
      "algorithmSteps": [
        "1. Standard BST insert.",
        "2. Update node heights.",
        "3. Rotate if BF not in {-1, 0, 1}."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ Right Rotation",
          "code": "struct Node {\n    int key, height;\n    Node *left, *right;\n};\n\nNode* rightRotate(Node* y) {\n    Node* x = y->left;\n    Node* T2 = x->right;\n    x->right = y;\n    y->left = T2;\n    y->height = 1 + std::max(y->left ? y->left->height : 0, y->right ? y->right->height : 0);\n    x->height = 1 + std::max(x->left ? x->left->height : 0, x->right ? x->right->height : 0);\n    return x;\n}",
          "explanation": "Right rotation re-linking pointers in O(1)."
        }
      ],
      "timeComplexity": "O(log N) Search, Insert, and Delete",
      "spaceComplexity": "O(N) Memory storage",
      "keyTakeaways": [
        "AVL trees are ideal for lookup-heavy datasets."
      ],
      "commonMistakes": [
        "Forgetting to update heights after rotation."
      ]
    }
  },
  {
    "topicId": "graph-bfs-dfs",
    "chapterId": "dsa-u6-c1",
    "unitId": "dsa-u6",
    "subjectId": "dsa",
    "topicNumber": 1,
    "title": "Graph Traversals (BFS & DFS), Cycle Detection & Shortest Paths",
    "estimatedMinutes": 30,
    "difficulty": "Intermediate",
    "summary": "Fundamental graph exploration algorithms using Queues (BFS) and Stacks/Recursion (DFS) for connectivity and cycle analysis.",
    "subtopics": [
      "Adjacency List vs Matrix",
      "Breadth-First Search (BFS)",
      "Depth-First Search (DFS)",
      "Cycle Detection",
      "Topological Sorting"
    ],
    "hasVisualization": true,
    "content": {
      "introduction": "Graphs are non-linear data structures consisting of vertices and edges. Breadth-First Search (BFS) explores vertices level-by-level using a FIFO queue, while Depth-First Search (DFS) dives deep along each branch before backtracking using recursion or a LIFO stack.",
      "concepts": [
        "BFS: Level-order traversal using Queue. Finds shortest path in unweighted graphs in O(V + E).",
        "DFS: Deep exploration using recursion/Stack. Used for cycle detection and topological sorting.",
        "Cycle Detection: Track visited nodes and recursion stack (directed) or parent pointers (undirected)."
      ],
      "importantPoints": [
        "BFS guarantees shortest path in unweighted graphs."
      ],
      "examples": [
        "Example: BFS on graph 0-1, 0-2, 1-2 -> Order: 0, 1, 2."
      ],
      "algorithmSteps": [
        "1. Initialize Queue/Stack.",
        "2. Mark visited.",
        "3. Traverse neighbors."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ BFS",
          "code": "#include <vector>\n#include <queue>\n\nvoid bfs(int src, const std::vector<std::vector<int>>& adj, std::vector<bool>& visited) {\n    std::queue<int> q;\n    q.push(src);\n    visited[src] = true;\n    while (!q.empty()) {\n        int u = q.front(); q.pop();\n        for (int v : adj[u]) {\n            if (!visited[v]) {\n                visited[v] = true;\n                q.push(v);\n            }\n        }\n    }\n}",
          "explanation": "Standard BFS using queue."
        }
      ],
      "timeComplexity": "O(V + E) Linear Time with Adjacency List",
      "spaceComplexity": "O(V) Memory for visited array and queue",
      "keyTakeaways": [
        "Always maintain a visited array to prevent infinite loops."
      ],
      "commonMistakes": [
        "Using BFS on weighted graphs expecting shortest paths."
      ]
    }
  },
  {
    "topicId": "dijkstra-shortest-path",
    "chapterId": "dsa-u6-c1",
    "unitId": "dsa-u6",
    "subjectId": "dsa",
    "topicNumber": 2,
    "title": "Dijkstra's Shortest Path Algorithm & Priority Queues",
    "estimatedMinutes": 30,
    "difficulty": "Intermediate",
    "summary": "Greedy single-source shortest path algorithm on weighted graphs with non-negative edge weights.",
    "subtopics": [
      "Greedy Relaxation Principle",
      "Min-Heap Optimization",
      "Distance Array",
      "Failure on Negative Edge Weights"
    ],
    "hasVisualization": true,
    "content": {
      "introduction": "Dijkstra's Algorithm finds the shortest path from a starting source vertex to all other vertices in a weighted graph with non-negative edge weights by greedily selecting the unvisited vertex with the smallest tentative distance.",
      "concepts": [
        "Edge Relaxation: If `dist[U] + weight < dist[V]`, update `dist[V] = dist[U] + weight`.",
        "Min-Heap Priority Queue: Accelerates lookup to O((V + E) log V).",
        "Fails on Negative Weights: Negative edges violate greedy monotonic distance growth."
      ],
      "importantPoints": [
        "Dijkstra solves Single-Source Shortest Path in O((V + E) log V)."
      ],
      "examples": [
        "Example: A-(2)->C, A-(4)->B, C-(1)->B -> Shortest path to B is A->C->B with distance 3."
      ],
      "algorithmSteps": [
        "1. `dist[src] = 0`, all other dist = \u221e.",
        "2. Insert (0, src) into Min-Heap.",
        "3. Pop min distance vertex and relax neighbors."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ Dijkstra",
          "code": "#include <vector>\n#include <queue>\n\nconst int INF = 1e9;\ntypedef std::pair<int, int> pii;\n\nstd::vector<int> dijkstra(int n, int src, const std::vector<std::vector<pii>>& adj) {\n    std::vector<int> dist(n, INF);\n    std::priority_queue<pii, std::vector<pii>, std::greater<pii>> pq;\n    dist[src] = 0;\n    pq.push({0, src});\n    while (!pq.empty()) {\n        auto [d, u] = pq.top(); pq.pop();\n        if (d > dist[u]) continue;\n        for (auto [v, w] : adj[u]) {\n            if (dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n                pq.push({dist[v], v});\n            }\n        }\n    }\n    return dist;\n}",
          "explanation": "Dijkstra shortest path in C++."
        }
      ],
      "timeComplexity": "O((V + E) log V) Time Complexity",
      "spaceComplexity": "O(V + E) Memory for Adjacency List and Distance Array",
      "keyTakeaways": [
        "Dijkstra powers real-world GPS and network routing."
      ],
      "commonMistakes": [
        "Applying Dijkstra to graphs with negative edges."
      ]
    }
  },
  {
    "topicId": "sql-joins",
    "chapterId": "dbms-u1-c1",
    "unitId": "dbms-u1",
    "subjectId": "dbms",
    "topicNumber": 1,
    "title": "SQL Joins, Relational Algebra & Query Execution",
    "estimatedMinutes": 25,
    "difficulty": "Beginner",
    "summary": "Combining tables via Inner, Left, Right, Full Outer, and Cross Joins with execution plans.",
    "subtopics": [
      "Inner Join",
      "Left / Right Outer Joins",
      "Full Outer Join",
      "Cross Join Cartesian Product"
    ],
    "hasVisualization": false,
    "content": {
      "introduction": "SQL Joins combine rows from two or more tables based on a related common key (foreign key constraint), reconstructing relational views.",
      "concepts": [
        "Inner Join: Returns only matching rows in both tables (A \u2229 B).",
        "Left Join: Returns all left table records and matching right records.",
        "Cross Join: Produces Cartesian Product (A \u00d7 B)."
      ],
      "importantPoints": [
        "Always index foreign key columns to avoid full table scans."
      ],
      "examples": [
        "Example: `SELECT * FROM users u INNER JOIN orders o ON u.id = o.user_id;`"
      ],
      "algorithmSteps": [
        "1. Parse query.",
        "2. Optimize joins.",
        "3. Execute index/hash joins."
      ],
      "codeSnippets": [
        {
          "language": "javascript",
          "title": "SQL Join Queries",
          "code": "SELECT u.name, o.total FROM users u INNER JOIN orders o ON u.id = o.user_id;",
          "explanation": "Inner join example."
        }
      ],
      "timeComplexity": "O(N + M) for Hash/Merge Join",
      "spaceComplexity": "O(min(N, M)) memory",
      "keyTakeaways": [
        "Filter rows with WHERE before joins to save buffer pool memory."
      ],
      "commonMistakes": [
        "Omitting join condition causing unintentional Cross Joins."
      ]
    }
  },
  {
    "topicId": "database-indexing-btrees",
    "chapterId": "dbms-u1-c1",
    "unitId": "dbms-u1",
    "subjectId": "dbms",
    "topicNumber": 2,
    "title": "Database Indexing Architecture & B+ Tree Structures",
    "estimatedMinutes": 30,
    "difficulty": "Intermediate",
    "summary": "Storage engine indexing internals, clustered vs non-clustered indexes, and B+ Tree lookups.",
    "subtopics": [
      "Clustered vs Non-Clustered Indexes",
      "B+ Tree Data Structure",
      "Composite Indexes"
    ],
    "hasVisualization": true,
    "content": {
      "introduction": "A database index is an auxiliary B+ Tree data structure that allows the storage engine to locate specific records in O(log N) disk block I/O operations rather than performing a full table scan.",
      "concepts": [
        "B+ Tree: Balanced multi-way tree with all records in sequentially linked leaf nodes.",
        "Clustered Index: Determines physical disk order of table rows (only 1 per table).",
        "Composite Indexes: Follow Leftmost Prefix Rule."
      ],
      "importantPoints": [
        "Indexes speed up SELECT but add write overhead to INSERT/UPDATE."
      ],
      "examples": [
        "Example: `CREATE INDEX idx_email ON users(email);`"
      ],
      "algorithmSteps": [
        "1. Descend B+ tree.",
        "2. Locate leaf page.",
        "3. Fetch row."
      ],
      "codeSnippets": [
        {
          "language": "javascript",
          "title": "SQL Index",
          "code": "CREATE INDEX idx_user_email ON users(email);",
          "explanation": "Index creation."
        }
      ],
      "timeComplexity": "O(log_B N) Search and Insert",
      "spaceComplexity": "O(N) Disk space",
      "keyTakeaways": [
        "Index high-cardinality columns used in WHERE and JOIN."
      ],
      "commonMistakes": [
        "Applying SQL functions on indexed columns in WHERE clause (disables index)."
      ]
    }
  },
  {
    "topicId": "dbms-normalization",
    "chapterId": "dbms-u2-c1",
    "unitId": "dbms-u2",
    "subjectId": "dbms",
    "topicNumber": 1,
    "title": "Database Normalization: 1NF, 2NF, 3NF & Boyce-Codd (BCNF)",
    "estimatedMinutes": 30,
    "difficulty": "Intermediate",
    "summary": "Systematic schema decomposition technique to eliminate update, insertion, and deletion anomalies.",
    "subtopics": [
      "1NF: Atomic Values",
      "2NF: No Partial Dependencies",
      "3NF: No Transitive Dependencies",
      "BCNF: Determinants are Superkeys"
    ],
    "hasVisualization": false,
    "content": {
      "introduction": "Database normalization structures relational schemas to minimize redundancy and eliminate anomalies while ensuring lossless joins and dependency preservation.",
      "concepts": [
        "1NF: Atomic values per cell.",
        "2NF: No partial functional dependencies on composite keys.",
        "3NF: No transitive dependencies.",
        "BCNF: Strict 3NF where every determinant is a superkey."
      ],
      "importantPoints": [
        "BCNF guarantees lossless joins."
      ],
      "examples": [
        "Example: Split Student_Course into Students and Enrollments tables."
      ],
      "algorithmSteps": [
        "1. Compute attribute closures.",
        "2. Decompose schemas violating normal forms."
      ],
      "codeSnippets": [
        {
          "language": "javascript",
          "title": "Normalized Schema (SQL)",
          "code": "CREATE TABLE students (id INT PRIMARY KEY, name VARCHAR(100));\nCREATE TABLE enrollments (student_id INT, course_id INT, PRIMARY KEY(student_id, course_id));",
          "explanation": "Normalized schema."
        }
      ],
      "timeComplexity": "O(2^N) candidate key derivation",
      "spaceComplexity": "O(N) schema metadata",
      "keyTakeaways": [
        "OLTP systems favor 3NF normalization."
      ],
      "commonMistakes": [
        "Over-normalizing OLAP analytical databases."
      ]
    }
  },
  {
    "topicId": "acid-transactions",
    "chapterId": "dbms-u3-c1",
    "unitId": "dbms-u3",
    "subjectId": "dbms",
    "topicNumber": 1,
    "title": "ACID Properties & Database Concurrency Control",
    "estimatedMinutes": 30,
    "difficulty": "Beginner",
    "summary": "Atomicity, Consistency, Isolation, and Durability guarantees in transactional database management systems.",
    "subtopics": [
      "Atomicity",
      "Consistency",
      "Isolation Levels",
      "Durability & WAL"
    ],
    "hasVisualization": false,
    "content": {
      "introduction": "A Transaction is a logical unit of work. ACID guarantees data integrity under concurrent access and crashes.",
      "concepts": [
        "Atomicity: All or nothing execution (Undo log).",
        "Consistency: Preserves schema invariants.",
        "Isolation: Prevents dirty and non-repeatable reads (MVCC / 2PL).",
        "Durability: Committed data survives crashes (Write-Ahead Logging - WAL)."
      ],
      "importantPoints": [
        "Write-Ahead Logging flushes log records before data pages."
      ],
      "examples": [
        "Example: Bank balance transfer with BEGIN TRANSACTION and COMMIT."
      ],
      "algorithmSteps": [
        "1. BEGIN.",
        "2. Execute DML with WAL.",
        "3. COMMIT."
      ],
      "codeSnippets": [
        {
          "language": "javascript",
          "title": "SQL Transaction",
          "code": "BEGIN TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE id = 'A';\nUPDATE accounts SET balance = balance + 100 WHERE id = 'B';\nCOMMIT;",
          "explanation": "Atomic bank transfer."
        }
      ],
      "timeComplexity": "O(1) commit with WAL append",
      "spaceComplexity": "O(N) undo log space",
      "keyTakeaways": [
        "Keep transactions short to prevent row lock contention."
      ],
      "commonMistakes": [
        "Leaving transactions open during external API calls."
      ]
    }
  },
  {
    "topicId": "cpu-scheduling",
    "chapterId": "os-u1-c1",
    "unitId": "os-u1",
    "subjectId": "os",
    "topicNumber": 1,
    "title": "CPU Scheduling Algorithms (FCFS, SJF, Round Robin & Priority)",
    "estimatedMinutes": 30,
    "difficulty": "Beginner",
    "summary": "OS process scheduling strategies, preemptive vs non-preemptive execution, Gantt charts, and turnaround times.",
    "subtopics": [
      "FCFS & Convoy Effect",
      "SJF & SRTF",
      "Round Robin & Time Quantum",
      "Priority & Aging"
    ],
    "hasVisualization": true,
    "content": {
      "introduction": "CPU Scheduling allocates CPU execution time to ready processes to maximize throughput and minimize waiting time.",
      "concepts": [
        "FCFS: Simple FIFO queue, suffers from Convoy Effect.",
        "SJF: Optimal in minimizing average waiting time.",
        "Round Robin: Preemptive time-slice sharing for interactive systems.",
        "Aging: Prevents process starvation in Priority scheduling."
      ],
      "importantPoints": [
        "Turnaround Time = Completion - Arrival.",
        "Waiting Time = Turnaround - Burst."
      ],
      "examples": [
        "Example: SJF order P2(3ms), P3(3ms), P1(24ms) reduces avg waiting from 17ms to 3ms."
      ],
      "algorithmSteps": [
        "1. Ready Queue.",
        "2. Dispatcher context switch.",
        "3. Time slice / I/O interrupt."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ Round Robin",
          "code": "// Round Robin Scheduler Simulation\n#include <queue>\n#include <vector>\n// Process scheduling loop...",
          "explanation": "Round Robin execution."
        }
      ],
      "timeComplexity": "O(N log N) for priority queue, O(1) in Round Robin",
      "spaceComplexity": "O(N) queue memory",
      "keyTakeaways": [
        "SJF minimizes average waiting time."
      ],
      "commonMistakes": [
        "Setting time quantum too small causing excessive context switching."
      ]
    }
  },
  {
    "topicId": "deadlocks-bankers",
    "chapterId": "os-u2-c1",
    "unitId": "os-u2",
    "subjectId": "os",
    "topicNumber": 1,
    "title": "Deadlock Characterization & Banker's Safety Algorithm",
    "estimatedMinutes": 30,
    "difficulty": "Intermediate",
    "summary": "The 4 Coffman deadlock conditions, Resource Allocation Graphs, and Banker's algorithm safe sequence discovery.",
    "subtopics": [
      "4 Coffman Conditions",
      "Resource Allocation Graphs",
      "Banker's Algorithm",
      "Safe States"
    ],
    "hasVisualization": false,
    "content": {
      "introduction": "Deadlock occurs when processes hold resources while waiting for others in a cyclic dependency. Banker's algorithm ensures resource allocation keeps the system in a safe state.",
      "concepts": [
        "4 Coffman Conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.",
        "Banker's Algorithm: Tests if granting request leaves a valid Safe Sequence."
      ],
      "importantPoints": [
        "Eliminating any SINGLE Coffman condition prevents deadlock."
      ],
      "examples": [
        "Example: Allocation, Max, and Available matrices tested for safe sequence `<P1, P3, P4, P0, P2>`."
      ],
      "algorithmSteps": [
        "1. Find process with Need <= Available.",
        "2. Reclaim allocation.",
        "3. Repeat."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ Banker's Algorithm",
          "code": "bool isSafe(int n, int m, ...);",
          "explanation": "Banker's safety check."
        }
      ],
      "timeComplexity": "O(M * N^2) Complexity",
      "spaceComplexity": "O(N * M) Matrix storage",
      "keyTakeaways": [
        "Total resource ordering prevents Circular Wait."
      ],
      "commonMistakes": [
        "Assuming all cycles in Resource Allocation Graphs imply deadlock."
      ]
    }
  },
  {
    "topicId": "virtual-memory-paging",
    "chapterId": "os-u3-c1",
    "unitId": "os-u3",
    "subjectId": "os",
    "topicNumber": 1,
    "title": "Virtual Memory, Paging & Page Replacement Algorithms",
    "estimatedMinutes": 30,
    "difficulty": "Intermediate",
    "summary": "Memory management units (MMU), page tables, TLB address translation, demand paging, and page replacement policies.",
    "subtopics": [
      "Paging Architecture",
      "TLB Address Translation",
      "Page Fault Handling",
      "FIFO, LRU & Optimal Replacement"
    ],
    "hasVisualization": true,
    "content": {
      "introduction": "Virtual memory provides each process with a large virtual address space mapped to physical RAM frames via page tables and TLB hardware.",
      "concepts": [
        "Paging: Virtual pages (4KB) mapped to physical frames.",
        "TLB: Hardware cache for fast address translation (~1ns).",
        "Page Fault: Trap to OS when requested page is on disk swap space.",
        "Page Replacement: LRU evicts least recently used page."
      ],
      "importantPoints": [
        "Belady's Anomaly: FIFO page faults can increase with more frames."
      ],
      "examples": [
        "Example: LRU page replacement on string `7, 0, 1, 2, 0, 3` with 3 frames."
      ],
      "algorithmSteps": [
        "1. MMU checks TLB.",
        "2. On miss, walk page table.",
        "3. On fault, swap page from disk."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ LRU Simulation",
          "code": "// LRU Page Replacement in C++",
          "explanation": "LRU page fault counter."
        }
      ],
      "timeComplexity": "O(1) TLB hit, ~5ms Page Fault disk I/O",
      "spaceComplexity": "O(N) Page table storage",
      "keyTakeaways": [
        "Maintain spatial and temporal locality to prevent thrashing."
      ],
      "commonMistakes": [
        "Confusing page size with frame size (they are identical)."
      ]
    }
  },
  {
    "topicId": "osi-model-layers",
    "chapterId": "cn-u1-c1",
    "unitId": "cn-u1",
    "subjectId": "cn",
    "topicNumber": 1,
    "title": "OSI 7-Layer Reference Model vs TCP/IP Protocol Stack",
    "estimatedMinutes": 25,
    "difficulty": "Beginner",
    "summary": "Comprehensive architectural comparison of networking layers, Protocol Data Units (PDUs), and data encapsulation.",
    "subtopics": [
      "7 Layers of OSI",
      "TCP/IP Protocol Suite",
      "Data Encapsulation (PDU)",
      "Switches vs Routers"
    ],
    "hasVisualization": false,
    "content": {
      "introduction": "The OSI model provides a 7-layer theoretical networking framework, while TCP/IP is the practical 4-layer protocol suite powering the global Internet.",
      "concepts": [
        "7 OSI Layers: Physical (Bits), Data Link (Frames), Network (Packets), Transport (Segments), Session, Presentation, Application.",
        "Encapsulation: Headers added descending the stack.",
        "Layer 2 vs Layer 3: Switches inspect MAC addresses; Routers inspect IP addresses."
      ],
      "importantPoints": [
        "MAC addresses are local to subnet; IP addresses are globally routed."
      ],
      "examples": [
        "Example: Browser HTTPS request descending from Application layer to Ethernet bits."
      ],
      "algorithmSteps": [
        "1. App data -> 2. TCP Segment -> 3. IP Packet -> 4. Ethernet Frame -> 5. Physical Bits."
      ],
      "codeSnippets": [
        {
          "language": "python",
          "title": "Python TCP Socket",
          "code": "import socket\ns = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\ns.connect(('www.google.com', 80))",
          "explanation": "Socket connection over Layer 4."
        }
      ],
      "timeComplexity": "O(1) Encapsulation per packet",
      "spaceComplexity": "O(1) Interface buffer memory",
      "keyTakeaways": [
        "Layer-by-layer troubleshooting (ping for L3, curl for L7)."
      ],
      "commonMistakes": [
        "Confusing Layer 2 MAC addresses with Layer 3 IP addresses."
      ]
    }
  },
  {
    "topicId": "ip-subnetting-cidr",
    "chapterId": "cn-u2-c1",
    "unitId": "cn-u2",
    "subjectId": "cn",
    "topicNumber": 1,
    "title": "IPv4 / IPv6 Subnetting, CIDR Notation & Network Hierarchy",
    "estimatedMinutes": 25,
    "difficulty": "Intermediate",
    "summary": "Subnet masks, prefix lengths (/24, /16, /8), usable host calculations, network ID vs broadcast address, and CIDR hierarchical routing aggregation.",
    "subtopics": [
      "Classless Inter-Domain Routing (CIDR)",
      "Subnet Mask Bitwise Math",
      "Usable Host Formula: 2^(32-n) - 2",
      "Network vs Broadcast ID"
    ],
    "hasVisualization": false,
    "content": {
      "introduction": "IP Subnetting partitions a physical network into multiple logical subnets to minimize broadcast traffic, enforce security, and optimize address allocation.",
      "concepts": [
        "CIDR: Flexible prefix lengths (e.g. `/26` = 26 network bits, 6 host bits).",
        "Network ID: Bitwise AND between IP and Subnet Mask.",
        "Usable Hosts: `2^h - 2` (subtracting Network ID and Broadcast ID)."
      ],
      "importantPoints": [
        "A /24 subnet has 254 usable hosts; /30 has 2 usable hosts."
      ],
      "examples": [
        "Example: `192.168.10.75/26` -> Network ID: `192.168.10.64`, Broadcast: `192.168.10.127`, Usable: 62 hosts."
      ],
      "algorithmSteps": [
        "1. Host count H -> 2. Find h such that 2^h - 2 >= H -> 3. Prefix = 32 - h."
      ],
      "codeSnippets": [
        {
          "language": "python",
          "title": "Python Subnet Calculator",
          "code": "import ipaddress\nnet = ipaddress.IPv4Network('192.168.10.75/26', strict=False)\nprint(net.network_address, net.broadcast_address)",
          "explanation": "Subnet calculator."
        }
      ],
      "timeComplexity": "O(1) Bitwise ALU operations",
      "spaceComplexity": "O(1) Memory",
      "keyTakeaways": [
        "Always subtract 2 for network and broadcast addresses."
      ],
      "commonMistakes": [
        "Assigning Network ID or Broadcast address to a host."
      ]
    }
  },
  {
    "topicId": "tcp-handshake",
    "chapterId": "cn-u3-c1",
    "unitId": "cn-u3",
    "subjectId": "cn",
    "topicNumber": 1,
    "title": "TCP 3-Way Handshake & 4-Way Connection Teardown",
    "estimatedMinutes": 25,
    "difficulty": "Beginner",
    "summary": "Connection-oriented transport protocol mechanics, sequence numbers, SYN-ACK exchanges, and TIME_WAIT socket states.",
    "subtopics": [
      "TCP 3-Way Handshake (SYN, SYN-ACK, ACK)",
      "4-Way Teardown (FIN-ACK)",
      "TIME_WAIT State",
      "SYN Flood Protection"
    ],
    "hasVisualization": false,
    "content": {
      "introduction": "Transmission Control Protocol (TCP) provides reliable, ordered, error-checked stream delivery, establishing connections via a 3-Way Handshake.",
      "concepts": [
        "3-Way Handshake: 1. Client SYN -> 2. Server SYN-ACK -> 3. Client ACK.",
        "4-Way Teardown: Each direction closed independently with FIN-ACK.",
        "TIME_WAIT: Socket waits 2*MSL to prevent old duplicate packets from corrupting new connections."
      ],
      "importantPoints": [
        "Random ISN generation prevents TCP sequence prediction attacks."
      ],
      "examples": [
        "Example: Client Seq=1000 -> Server Ack=1001, Seq=5000 -> Client Ack=5001."
      ],
      "algorithmSteps": [
        "1. Client connect() -> 2. Server accept() -> 3. ESTABLISHED."
      ],
      "codeSnippets": [
        {
          "language": "javascript",
          "title": "Node.js TCP Server",
          "code": "const net = require('net');\nconst server = net.createServer((sock) => sock.write('Hello TCP!\\n'));\nserver.listen(8080);",
          "explanation": "TCP socket in Node.js."
        }
      ],
      "timeComplexity": "O(1) Protocol exchange",
      "spaceComplexity": "O(1) TCB socket memory",
      "keyTakeaways": [
        "TCP provides guaranteed in-order stream delivery."
      ],
      "commonMistakes": [
        "Assuming TCP connection teardown is instantaneous (requires 4-way FIN-ACK)."
      ]
    }
  },
  {
    "topicId": "oop-four-pillars",
    "chapterId": "oops-u1-c1",
    "unitId": "oops-u1",
    "subjectId": "oops",
    "topicNumber": 1,
    "title": "The 4 Pillars of Object-Oriented Programming",
    "estimatedMinutes": 25,
    "difficulty": "Beginner",
    "summary": "Encapsulation, Data Abstraction, Inheritance Hierarchies, and Polymorphism with virtual method tables.",
    "subtopics": [
      "Encapsulation",
      "Abstraction",
      "Inheritance",
      "Polymorphism & vtable"
    ],
    "hasVisualization": false,
    "content": {
      "introduction": "Object-Oriented Programming organizes code into modular objects embodying Encapsulation, Abstraction, Inheritance, and Polymorphism.",
      "concepts": [
        "Encapsulation: Bundling data and methods, restricting direct access.",
        "Abstraction: Hiding implementation details via interfaces.",
        "Inheritance: Code reusability via parent-child classes.",
        "Polymorphism: Single interface, multiple implementations via vtables."
      ],
      "importantPoints": [
        "Declare base destructors as virtual in C++."
      ],
      "examples": [
        "Example: Shape base class with Circle and Rectangle polymorphic draw() overrides."
      ],
      "algorithmSteps": [
        "1. Declare interface/abstract class.",
        "2. Override in child.",
        "3. Call polymorphically."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ Polymorphism",
          "code": "class Shape { public: virtual void draw() = 0; virtual ~Shape() = default; };",
          "explanation": "Abstract base class."
        }
      ],
      "timeComplexity": "O(1) vtable dynamic dispatch",
      "spaceComplexity": "O(1) vptr pointer per object",
      "keyTakeaways": [
        "Program to an interface, not an implementation."
      ],
      "commonMistakes": [
        "Omitting virtual keyword in C++ base classes."
      ]
    }
  },
  {
    "topicId": "solid-principles",
    "chapterId": "oops-u2-c1",
    "unitId": "oops-u2",
    "subjectId": "oops",
    "topicNumber": 1,
    "title": "SOLID Principles & Clean Code Architecture",
    "estimatedMinutes": 30,
    "difficulty": "Intermediate",
    "summary": "The 5 foundational software engineering design principles for writing scalable, decoupled, and maintainable enterprise codebases.",
    "subtopics": [
      "Single Responsibility (SRP)",
      "Open-Closed (OCP)",
      "Liskov Substitution (LSP)",
      "Interface Segregation (ISP)",
      "Dependency Inversion (DIP)"
    ],
    "hasVisualization": false,
    "content": {
      "introduction": "SOLID design principles create maintainable, flexible, and testable decoupled object-oriented systems.",
      "concepts": [
        "S: Class has one reason to change.",
        "O: Open for extension, closed for modification.",
        "L: Subtypes substitutable for base types.",
        "I: Specific client interfaces.",
        "D: Depend on abstractions, not concretions."
      ],
      "importantPoints": [
        "Dependency Injection is the practical application of DIP."
      ],
      "examples": [
        "Example: Injecting NotificationSender interface into UserService."
      ],
      "algorithmSteps": [
        "1. Audit responsibilities.",
        "2. Introduce interfaces.",
        "3. Inject dependencies."
      ],
      "codeSnippets": [
        {
          "language": "python",
          "title": "Python SOLID",
          "code": "class NotificationSender(ABC): pass\nclass EmailSender(NotificationSender): pass",
          "explanation": "SOLID implementation."
        }
      ],
      "timeComplexity": "O(1) Execution overhead",
      "spaceComplexity": "O(1) Memory footprint",
      "keyTakeaways": [
        "SOLID code is straightforward to mock and unit test."
      ],
      "commonMistakes": [
        "Creating monolithic God Objects with dozens of responsibilities."
      ]
    }
  },
  {
    "topicId": "system-design-scalability",
    "chapterId": "sd-u1-c1",
    "unitId": "sd-u1",
    "subjectId": "system-design",
    "topicNumber": 1,
    "title": "System Design: Scalability, Caching & Load Balancing",
    "estimatedMinutes": 35,
    "difficulty": "Advanced",
    "summary": "Architecting distributed web systems from 1 to 10 million users: horizontal scaling, Redis caching tiers, database sharding, and the CAP theorem.",
    "subtopics": [
      "Horizontal vs Vertical Scaling",
      "L4 vs L7 Load Balancing",
      "Redis Distributed Caching",
      "Database Sharding",
      "The CAP Theorem"
    ],
    "hasVisualization": false,
    "content": {
      "introduction": "System Design architects high-availability, fault-tolerant distributed web applications serving millions of requests per second.",
      "concepts": [
        "Horizontal Scaling: Adding commodity stateless nodes behind a Load Balancer.",
        "Caching (Redis): Cache-aside pattern reducing database read load by 90%+.",
        "Database Sharding: Partitioning rows by key across multiple database nodes.",
        "CAP Theorem: Choose CP (Consistency) or AP (Availability) under Network Partitions."
      ],
      "importantPoints": [
        "Stateless web tiers allow effortless auto-scaling."
      ],
      "examples": [
        "Example: TinyURL scaling 100M reads/day using Redis cache-aside."
      ],
      "algorithmSteps": [
        "1. DNS -> 2. Load Balancer -> 3. Stateless App Server -> 4. Redis -> 5. Database."
      ],
      "codeSnippets": [
        {
          "language": "javascript",
          "title": "Redis Cache-Aside",
          "code": "const cached = await redis.get(`user:${id}`);\nif (cached) return JSON.parse(cached);\nconst user = await db.query(...);\nawait redis.setex(`user:${id}`, 3600, JSON.stringify(user));",
          "explanation": "Cache-aside pattern."
        }
      ],
      "timeComplexity": "O(1) Redis memory cache (~1ms)",
      "spaceComplexity": "O(N) RAM storage with LRU eviction",
      "keyTakeaways": [
        "Keep application servers strictly stateless."
      ],
      "commonMistakes": [
        "Forgetting TTL on cache keys causing memory leaks."
      ]
    }
  },
  {
    "topicId": "web-http-rest",
    "chapterId": "web-u1-c1",
    "unitId": "web-u1",
    "subjectId": "web-dev",
    "topicNumber": 1,
    "title": "HTTP Protocol, REST APIs & Asynchronous Architecture",
    "estimatedMinutes": 25,
    "difficulty": "Beginner",
    "summary": "The HTTP/HTTPS request-response lifecycle, RESTful architectural constraints, status codes, and JavaScript Event Loop execution.",
    "subtopics": [
      "HTTP/1.1 vs HTTP/2",
      "REST Constraints",
      "Status Codes (200, 201, 400, 401, 403, 404, 500)",
      "JavaScript Event Loop"
    ],
    "hasVisualization": false,
    "content": {
      "introduction": "Web applications communicate over HTTP/HTTPS protocols using RESTful APIs. JavaScript executes asynchronously via a single-threaded Event Loop.",
      "concepts": [
        "REST Principles: Statelessness, Uniform Interface, Resource-based URLs.",
        "Idempotency: GET, PUT, DELETE are idempotent; POST is not.",
        "Event Loop: Microtasks (Promises) execute before Macrotasks (setTimeout)."
      ],
      "importantPoints": [
        "401 = Unauthenticated; 403 = Authenticated but Unauthorized."
      ],
      "examples": [
        "Example: `GET /api/v1/users` -> Returns list of users in JSON."
      ],
      "algorithmSteps": [
        "1. Client TLS Handshake -> 2. Send HTTP Request -> 3. Server Async Process -> 4. Return Status & JSON."
      ],
      "codeSnippets": [
        {
          "language": "javascript",
          "title": "Express REST API",
          "code": "app.get('/api/users', async (req, res) => res.json(await getUsers()));",
          "explanation": "REST endpoint in Express."
        }
      ],
      "timeComplexity": "O(1) Non-blocking event loop dispatch",
      "spaceComplexity": "O(N) Connection socket buffers",
      "keyTakeaways": [
        "Use plural nouns for REST endpoints."
      ],
      "commonMistakes": [
        "Blocking the single Node.js main thread with CPU-intensive loops."
      ]
    }
  },
  {
    "topicId": "quantitative-aptitude-reasoning",
    "chapterId": "apt-u1-c1",
    "unitId": "apt-u1",
    "subjectId": "aptitude",
    "topicNumber": 1,
    "title": "Quantitative Aptitude: Time, Speed, Distance & Work Calculations",
    "estimatedMinutes": 20,
    "difficulty": "Beginner",
    "summary": "Essential mathematical formulas, relative speed mechanics, train crossing problems, and time-and-work efficiency ratios for placement assessments.",
    "subtopics": [
      "Speed = Distance / Time",
      "Relative Speed",
      "Train Problems",
      "Time and Work Formulas",
      "Pipes and Cisterns"
    ],
    "hasVisualization": false,
    "content": {
      "introduction": "Quantitative Aptitude evaluates computational speed and mathematical reasoning for technical campus placement assessments.",
      "concepts": [
        "Speed = Distance / Time. Multiply km/h by 5/18 to get m/s.",
        "Relative Speed: Add speeds in opposite directions; subtract in same direction.",
        "Combined Work: A in X days, B in Y days -> Together = (X*Y)/(X+Y) days."
      ],
      "importantPoints": [
        "Unify all units to meters and seconds before calculation."
      ],
      "examples": [
        "Example: 150m train at 54 km/h crossing 200m platform -> Time = 350 / 15 = 23.33s."
      ],
      "algorithmSteps": [
        "1. Convert units to SI.",
        "2. Apply relative speed / work formula.",
        "3. Solve algebraically."
      ],
      "codeSnippets": [
        {
          "language": "python",
          "title": "Python Relative Speed",
          "code": "def cross_time(l1, l2, speed_kmh): return (l1 + l2) / (speed_kmh * 5/18)",
          "explanation": "Train crossing time calculator."
        }
      ],
      "timeComplexity": "O(1) Formula calculation",
      "spaceComplexity": "O(1) Auxiliary space",
      "keyTakeaways": [
        "Use LCM method for complex 3-person Time and Work problems."
      ],
      "commonMistakes": [
        "Subtracting speeds when objects move in opposite directions instead of adding."
      ]
    }
  }
];
