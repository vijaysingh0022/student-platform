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
    "description": "Master computational problem-solving, asymptotic complexity, foundational data structures, tree algorithms, and dynamic programming.",
    "icon": "⚡",
    "badge": "Core CSE",
    "color": "from-blue-600 to-indigo-600",
    "accentColor": "#3b82f6",
    "order": 1
  },
  {
    "subjectId": "dbms",
    "name": "Database Management Systems",
    "code": "CS202",
    "description": "Relational modeling, SQL mastery, normalization up to BCNF, ACID concurrency control, transactions, and indexing structures.",
    "icon": "🗄️",
    "badge": "Core CSE",
    "color": "from-emerald-600 to-teal-600",
    "accentColor": "#10b981",
    "order": 2
  },
  {
    "subjectId": "os",
    "name": "Operating Systems",
    "code": "CS203",
    "description": "Process lifecycle, thread concurrency, CPU scheduling algorithms, deadlock prevention, virtual memory paging, and file systems.",
    "icon": "💻",
    "badge": "Core CSE",
    "color": "from-violet-600 to-purple-600",
    "accentColor": "#8b5cf6",
    "order": 3
  },
  {
    "subjectId": "cn",
    "name": "Computer Networks",
    "code": "CS204",
    "description": "Layered architectures, TCP 3-way handshakes, reliable data transfer, IP subnetting CIDR, routing protocols, and HTTP/DNS.",
    "icon": "🌐",
    "badge": "Core CSE",
    "color": "from-sky-600 to-blue-600",
    "accentColor": "#0284c7",
    "order": 4
  },
  {
    "subjectId": "oops",
    "name": "Object-Oriented Programming",
    "code": "CS205",
    "description": "Encapsulation, Polymorphism, Inheritance, Abstraction, SOLID design principles, and enterprise design patterns.",
    "icon": "🧩",
    "badge": "Software Eng",
    "color": "from-amber-600 to-orange-600",
    "accentColor": "#f59e0b",
    "order": 5
  },
  {
    "subjectId": "system-design",
    "name": "System Design & Architecture",
    "code": "CS301",
    "description": "High-level distributed systems design, load balancing, caching tiers, CAP theorem, database sharding, and message queues.",
    "icon": "🏗️",
    "badge": "Advanced Tech",
    "color": "from-rose-600 to-pink-600",
    "accentColor": "#e11d48",
    "order": 6
  },
  {
    "subjectId": "web-dev",
    "name": "Full Stack Web Development",
    "code": "CS302",
    "description": "Modern JavaScript (ES6+), DOM lifecycle, asynchronous promises, React hooks, REST APIs, and authentication flows.",
    "icon": "⚛️",
    "badge": "Practical Eng",
    "color": "from-cyan-600 to-blue-600",
    "accentColor": "#06b6d4",
    "order": 7
  },
  {
    "subjectId": "aptitude",
    "name": "Aptitude & Logical Reasoning",
    "code": "CS101",
    "description": "Quantitative mathematics, probability, permutations, logical reasoning, and data interpretation for technical campus placements.",
    "icon": "🎯",
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
    "title": "Unit 1 — Algorithmic Foundations & Complexity",
    "description": "Big-O, Omega, Theta notations, recurrence relations, and space-time trade-offs.",
    "order": 1
  },
  {
    "unitId": "dsa-u2",
    "subjectId": "dsa",
    "unitNumber": 2,
    "title": "Unit 2 — Searching & Sorting Mastery",
    "description": "Divide-and-conquer algorithms, comparison sorts, binary search variants, and partitioning mechanics.",
    "order": 2
  },
  {
    "unitId": "dsa-u3",
    "subjectId": "dsa",
    "unitNumber": 3,
    "title": "Unit 3 — Linear Data Structures & Dynamic Arrays",
    "description": "Singly, doubly, and circular linked lists, stacks, monotonic queues, and amortized array resizing.",
    "order": 3
  },
  {
    "unitId": "dsa-u4",
    "subjectId": "dsa",
    "unitNumber": 4,
    "title": "Unit 4 — Non-Linear Data Structures & Trees",
    "description": "Binary search trees, AVL self-balancing rotations, heaps, priority queues, and graph traversals.",
    "order": 4
  },
  {
    "unitId": "dsa-u5",
    "subjectId": "dsa",
    "unitNumber": 5,
    "title": "Unit 5 — Balanced Trees & Self-Balancing Structures",
    "description": "AVL Tree rotations, Red-Black Trees, B-Trees, and height-balancing invariants.",
    "order": 5
  },
  {
    "unitId": "dsa-u6",
    "subjectId": "dsa",
    "unitNumber": 6,
    "title": "Unit 6 — Graph Theory & Advanced Algorithms",
    "description": "Breadth-First Search (BFS), Depth-First Search (DFS), Shortest Path (Dijkstra), and Minimum Spanning Trees.",
    "order": 6
  },
  {
    "unitId": "dbms-u1",
    "subjectId": "dbms",
    "unitNumber": 1,
    "title": "Unit 1 — Relational Model & SQL Querying",
    "description": "Schema architecture, entity relationship modeling, relational algebra, and complex SQL joins.",
    "order": 1
  },
  {
    "unitId": "dbms-u2",
    "subjectId": "dbms",
    "unitNumber": 2,
    "title": "Unit 2 — Database Normalization & Schema Design",
    "description": "Functional dependencies, 1NF, 2NF, 3NF, BCNF lossless decomposition, and dependency preservation.",
    "order": 2
  },
  {
    "unitId": "dbms-u3",
    "subjectId": "dbms",
    "unitNumber": 3,
    "title": "Unit 3 — Transactions & Concurrency Control",
    "description": "ACID properties, serializability, 2-phase locking (2PL), deadlock prevention, and isolation levels.",
    "order": 3
  },
  {
    "unitId": "os-u1",
    "subjectId": "os",
    "unitNumber": 1,
    "title": "Unit 1 — Process Management & CPU Scheduling",
    "description": "Process Control Block (PCB), context switching, preemptive scheduling (FCFS, SJF, Round Robin), and multithreading.",
    "order": 1
  },
  {
    "unitId": "os-u2",
    "subjectId": "os",
    "unitNumber": 2,
    "title": "Unit 2 — Process Synchronization & Deadlocks",
    "description": "Critical section problem, mutexes, semaphores, Banker's algorithm, and resource allocation graphs.",
    "order": 2
  },
  {
    "unitId": "os-u3",
    "subjectId": "os",
    "unitNumber": 3,
    "title": "Unit 3 — Memory Management & Virtual Memory",
    "description": "Paging, translation lookaside buffers (TLB), segmentation, page fault handling, and page replacement algorithms.",
    "order": 3
  },
  {
    "unitId": "cn-u1",
    "subjectId": "cn",
    "unitNumber": 1,
    "title": "Unit 1 — Layered Network Architecture",
    "description": "OSI 7-layer reference model, TCP/IP protocol suite, packet encapsulation, and transmission media.",
    "order": 1
  },
  {
    "unitId": "cn-u2",
    "subjectId": "cn",
    "unitNumber": 2,
    "title": "Unit 2 — Network Layer & IP Addressing",
    "description": "IPv4/IPv6 addressing, CIDR subnetting, ARP, ICMP, Dijkstra link-state, and Distance Vector routing.",
    "order": 2
  },
  {
    "unitId": "cn-u3",
    "subjectId": "cn",
    "unitNumber": 3,
    "title": "Unit 3 — Transport Layer & Reliable Delivery",
    "description": "TCP 3-way handshake, 4-way termination, sliding window flow control, congestion control, and UDP.",
    "order": 3
  },
  {
    "unitId": "oops-u1",
    "subjectId": "oops",
    "unitNumber": 1,
    "title": "Unit 1 — The 4 Core OOP Pillars",
    "description": "Encapsulation, Data Abstraction, Inheritance hierarchies, and Static/Dynamic Polymorphism.",
    "order": 1
  },
  {
    "unitId": "oops-u2",
    "subjectId": "oops",
    "unitNumber": 2,
    "title": "Unit 2 — SOLID Design Principles",
    "description": "Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.",
    "order": 2
  },
  {
    "unitId": "sd-u1",
    "subjectId": "system-design",
    "unitNumber": 1,
    "title": "Unit 1 — Scalability & High Availability",
    "description": "Horizontal vs vertical scaling, load balancers, reverse proxies, and consistent hashing.",
    "order": 1
  },
  {
    "unitId": "web-u1",
    "subjectId": "web-dev",
    "unitNumber": 1,
    "title": "Unit 1 — Modern JavaScript & React Foundations",
    "description": "Event loop, asynchronous promises, React component lifecycle, virtual DOM, and custom hooks.",
    "order": 1
  },
  {
    "unitId": "apt-u1",
    "subjectId": "aptitude",
    "unitNumber": 1,
    "title": "Unit 1 — Quantitative & Placement Aptitude",
    "description": "Speed math, percentages, profit & loss, time and work, permutations, and probability shortcuts.",
    "order": 1
  }
];

export const CURRICULUM_CHAPTERS = [
  {
    "chapterId": "dsa-u1-c1",
    "unitId": "dsa-u1",
    "subjectId": "dsa",
    "chapterNumber": 1,
    "title": "Asymptotic Analysis & Recurrence Relations",
    "description": "Mathematical models for program performance.",
    "order": 1
  },
  {
    "chapterId": "dsa-u2-c1",
    "unitId": "dsa-u2",
    "subjectId": "dsa",
    "chapterNumber": 1,
    "title": "Searching Algorithms",
    "description": "Sequential and logarithmic lookup techniques.",
    "order": 1
  },
  {
    "chapterId": "dsa-u2-c2",
    "unitId": "dsa-u2",
    "subjectId": "dsa",
    "chapterNumber": 2,
    "title": "Comparison & Non-Comparison Sorting",
    "description": "Divide-and-conquer sorting, in-place partitions, and stability analysis.",
    "order": 2
  },
  {
    "chapterId": "dsa-u3-c1",
    "unitId": "dsa-u3",
    "subjectId": "dsa",
    "chapterNumber": 1,
    "title": "Linked Lists & Memory Management",
    "description": "Node structures, pointer manipulation, and cycle detection.",
    "order": 1
  },
  {
    "chapterId": "dsa-u4-c1",
    "unitId": "dsa-u4",
    "subjectId": "dsa",
    "chapterNumber": 1,
    "title": "Binary Trees & Self-Balancing Structures",
    "description": "Tree traversals, binary search tree operations, and AVL rotations.",
    "order": 1
  },
  {
    "chapterId": "dsa-u5-c1",
    "unitId": "dsa-u5",
    "subjectId": "dsa",
    "chapterNumber": 1,
    "title": "Self-Balancing Trees & AVL Rotations",
    "description": "Single and double rotations (LL, RR, LR, RL) for height balance.",
    "order": 1
  },
  {
    "chapterId": "dsa-u6-c1",
    "unitId": "dsa-u6",
    "subjectId": "dsa",
    "chapterNumber": 1,
    "title": "Graph Traversal & Shortest Paths",
    "description": "Breadth-First Search, Depth-First Search, and Dijkstra shortest path algorithm.",
    "order": 1
  },
  {
    "chapterId": "dbms-u1-c1",
    "unitId": "dbms-u1",
    "subjectId": "dbms",
    "chapterNumber": 1,
    "title": "Relational Querying & Joins",
    "description": "Inner, Outer, Cross Joins, Subqueries, and Aggregate functions.",
    "order": 1
  },
  {
    "chapterId": "dbms-u2-c1",
    "unitId": "dbms-u2",
    "subjectId": "dbms",
    "chapterNumber": 1,
    "title": "Normalization Forms (1NF to BCNF)",
    "description": "Eliminating update anomalies and redundancy.",
    "order": 1
  },
  {
    "chapterId": "dbms-u3-c1",
    "unitId": "dbms-u3",
    "subjectId": "dbms",
    "chapterNumber": 1,
    "title": "Transaction ACID & Locking Protocols",
    "description": "Concurrency anomalies and serializability guarantees.",
    "order": 1
  },
  {
    "chapterId": "os-u1-c1",
    "unitId": "os-u1",
    "subjectId": "os",
    "chapterNumber": 1,
    "title": "CPU Scheduling Mechanisms",
    "description": "Gantt charts, turnaround time, waiting time, and starvation avoidance.",
    "order": 1
  },
  {
    "chapterId": "os-u2-c1",
    "unitId": "os-u2",
    "subjectId": "os",
    "chapterNumber": 1,
    "title": "Concurrency Synchronization & Deadlocks",
    "description": "Mutexes, counting semaphores, and Banker's algorithm safe sequences.",
    "order": 1
  },
  {
    "chapterId": "os-u3-c1",
    "unitId": "os-u3",
    "subjectId": "os",
    "chapterNumber": 1,
    "title": "Virtual Memory & Paging Replacement",
    "description": "Page fault handling, FIFO, LRU, Optimal page replacement, and Belady's anomaly.",
    "order": 1
  },
  {
    "chapterId": "cn-u1-c1",
    "unitId": "cn-u1",
    "subjectId": "cn",
    "chapterNumber": 1,
    "title": "OSI vs TCP/IP Models",
    "description": "Protocol data units, encapsulation, and layer responsibilities.",
    "order": 1
  },
  {
    "chapterId": "cn-u2-c1",
    "unitId": "cn-u2",
    "subjectId": "cn",
    "chapterNumber": 1,
    "title": "IP Subnetting & CIDR",
    "description": "Subnet masks, broadcast addresses, usable hosts, and classless addressing.",
    "order": 1
  },
  {
    "chapterId": "cn-u3-c1",
    "unitId": "cn-u3",
    "subjectId": "cn",
    "chapterNumber": 1,
    "title": "TCP Mechanics & Connection Handshakes",
    "description": "SYN-ACK handshake, sequence numbers, window sizing, and teardown states.",
    "order": 1
  },
  {
    "chapterId": "oops-u1-c1",
    "unitId": "oops-u1",
    "subjectId": "oops",
    "chapterNumber": 1,
    "title": "Core Pillars & Runtime Polymorphism",
    "description": "Virtual tables, function overriding, dynamic dispatch, and interface design.",
    "order": 1
  },
  {
    "chapterId": "oops-u2-c1",
    "unitId": "oops-u2",
    "subjectId": "oops",
    "chapterNumber": 1,
    "title": "SOLID Principles in Practice",
    "description": "Clean code design patterns and decoupled architectural patterns.",
    "order": 1
  },
  {
    "chapterId": "sd-u1-c1",
    "unitId": "sd-u1",
    "subjectId": "system-design",
    "chapterNumber": 1,
    "title": "Load Balancing & Caching Architectures",
    "description": "L4 vs L7 load balancing, Redis caching strategies, and CDN edge caching.",
    "order": 1
  },
  {
    "chapterId": "web-u1-c1",
    "unitId": "web-u1",
    "subjectId": "web-dev",
    "chapterNumber": 1,
    "title": "Asynchronous JavaScript & React Hooks",
    "description": "Promises, async/await, closures, useState, useEffect, and custom hook patterns.",
    "order": 1
  },
  {
    "chapterId": "apt-u1-c1",
    "unitId": "apt-u1",
    "subjectId": "aptitude",
    "chapterNumber": 1,
    "title": "Probability, Permutations & Speed Math",
    "description": "Combinatorics, Bayes' theorem, relative speed, and work efficiency.",
    "order": 1
  }
];

export const CURRICULUM_TOPICS = [
  {
    "topicId": "binary-search",
    "chapterId": "dsa-u2-c1",
    "unitId": "dsa-u2",
    "subjectId": "dsa",
    "topicNumber": 1,
    "title": "Binary Search & Search Space Reduction",
    "estimatedMinutes": 20,
    "difficulty": "Beginner",
    "summary": "Logarithmic time lookup algorithm for monotonically sorted sequences and monotonic predicate functions.",
    "subtopics": [
      "Divide and Conquer Strategy",
      "Midpoint Overflow Prevention",
      "Lower & Upper Bound Variants",
      "Time & Space Complexity"
    ],
    "content": {
      "introduction": "Binary Search is one of the most fundamental divide-and-conquer algorithms in computer science. Operating strictly on sorted sequences, it divides the search space in half with every single comparison, achieving optimal O(log N) query time.",
      "concepts": [
        "Monotonic Search Space: The sequence must be sorted or exhibit a monotonic boolean predicate (e.g. false, false, true, true).",
        "Midpoint Calculation: Using `low + (high - low) / 2` avoids 32-bit integer arithmetic overflow encountered in `(low + high) / 2`.",
        "Invariant Maintenance: Ensuring that the target element always remains strictly within the bounds `[low, high]`.",
        "Boundary Variants: Finding exact index vs finding Lower Bound (first element >= key) and Upper Bound (first element > key)."
      ],
      "importantPoints": [
        "Binary search reduces 1,000,000 items to just ~20 comparisons (2^20 ≈ 1,048,576).",
        "Array must be random-access O(1); applying binary search directly on a standard Singly Linked List yields O(N) due to sequential node traversal.",
        "Infinite loop bugs typically occur when `low <= high` and `low = mid` without `+ 1`."
      ],
      "examples": [
        "Find index of key = 23 in sorted array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91].",
        "Finding the peak element in a mountain array using binary search.",
        "Finding the square root of an integer N to integer precision in O(log N) time."
      ],
      "algorithmSteps": [
        "1. Initialize two pointer indices: `low = 0`, `high = array.length - 1`.",
        "2. While `low <= high`:",
        "   a. Compute safe midpoint `mid = low + Math.floor((high - low) / 2)`.",
        "   b. If `array[mid] === target`, return `mid`.",
        "   c. If `array[mid] < target`, discard left half: set `low = mid + 1`.",
        "   d. If `array[mid] > target`, discard right half: set `high = mid - 1`.",
        "3. If loop terminates without match, return `-1` (element not present)."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ Iterative Binary Search",
          "code": "#include <vector>\n#include <iostream>\n\nint binarySearch(const std::vector<int>& arr, int target) {\n    int low = 0, high = static_cast<int>(arr.size()) - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2; // Prevents integer overflow\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1; // Target not found\n}",
          "explanation": "Standard C++ implementation using vector references and safe midpoint calculation."
        },
        {
          "language": "java",
          "title": "Java Binary Search Implementation",
          "code": "public class BinarySearch {\n    public static int search(int[] arr, int target) {\n        int low = 0;\n        int high = arr.length - 1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (arr[mid] == target) {\n                return mid;\n            } else if (arr[mid] < target) {\n                low = mid + 1;\n            } else {\n                high = mid - 1;\n            }\n        }\n        return -1;\n    }\n}",
          "explanation": "Thread-safe static method implementation conforming to Java standard library semantics."
        },
        {
          "language": "python",
          "title": "Pythonic Binary Search",
          "code": "def binary_search(arr: list[int], target: int) -> int:\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1",
          "explanation": "Clean Python type-hinted implementation using integer floor division."
        },
        {
          "language": "javascript",
          "title": "JavaScript ES6 Binary Search",
          "code": "function binarySearch(arr, target) {\n  let low = 0;\n  let high = arr.length - 1;\n  while (low <= high) {\n    const mid = low + Math.floor((high - low) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}",
          "explanation": "ES6 implementation compatible with Node.js and modern browser runtimes."
        }
      ],
      "timeComplexity": "O(log N) worst/average, O(1) best (element found at initial mid)",
      "spaceComplexity": "O(1) auxiliary space (iterative), O(log N) stack space (recursive)",
      "keyTakeaways": [
        "Binary search cuts the problem size in half on every step: T(N) = T(N/2) + O(1).",
        "Always guard against integer overflow in languages with fixed-size integers by computing `mid = low + (high - low) / 2`.",
        "Can be generalized to search spaces of arbitrary predicate functions ('Binary Search on Answer')."
      ],
      "commonMistakes": [
        "Using `(low + high) / 2` leading to 32-bit integer overflow when `low + high > 2,147,483,647`.",
        "Setting `low = mid` or `high = mid` inside the loop causing infinite loops when `high - low === 1`.",
        "Attempting binary search on unsorted arrays without prior sorting."
      ],
      "relatedTopics": [
        "Linear Search",
        "Binary Search Trees",
        "Ternary Search",
        "Divide and Conquer"
      ]
    }
  },
  {
    "topicId": "quick-sort",
    "chapterId": "dsa-u2-c2",
    "unitId": "dsa-u2",
    "subjectId": "dsa",
    "topicNumber": 2,
    "title": "Quick Sort & Partitioning Algorithms",
    "estimatedMinutes": 25,
    "difficulty": "Intermediate",
    "summary": "In-place divide-and-conquer sorting algorithm based on Lomuto or Hoare partitioning around a chosen pivot.",
    "subtopics": [
      "Pivot Selection Strategies",
      "Lomuto Partition Scheme",
      "Hoare Partition Scheme",
      "Worst-case Quadratic Degradation",
      "Tail Call Optimization"
    ],
    "content": {
      "introduction": "Quick Sort is a highly practical, in-place, divide-and-conquer comparison sort developed by Tony Hoare. In practice, it outperforms Merge Sort and Heap Sort due to superior CPU cache locality, though it requires randomized pivot selection to avoid worst-case O(N^2) complexity.",
      "concepts": [
        "Divide and Conquer: Select a pivot element, partition the array so all elements smaller than pivot precede it, and recursively sort subarrays.",
        "Lomuto Partitioning: Simpler to implement; uses one scanning pointer and one slow pointer, placing pivot at array end.",
        "Hoare Partitioning: More efficient than Lomuto (performs roughly 3x fewer swaps); uses two pointers moving towards each other from both ends.",
        "Worst-case O(N^2) Trigger: Occurs when pivot is consistently the minimum or maximum element (e.g., sorting an already-sorted array with first/last element as pivot)."
      ],
      "importantPoints": [
        "Quick Sort is an in-place sort: auxiliary memory is O(log N) for the recursion call stack.",
        "Quick Sort is UNSTABLE by default (equal keys can have their relative order swapped during partitioning).",
        "C++ `std::sort` and Java `Arrays.sort(primitive[])` use Dual-Pivot QuickSort / Introsort (hybrid of QuickSort, HeapSort, and InsertionSort)."
      ],
      "examples": [
        "Partitioning array [10, 80, 30, 90, 40, 50, 70] with pivot = 70.",
        "Median of Three pivot selection: choosing median of arr[low], arr[mid], arr[high] to prevent quadratic degradation."
      ],
      "algorithmSteps": [
        "1. Choose a pivot element `P` from array `arr[low..high]`.",
        "2. Partition `arr` around `P` such that all elements `< P` are placed to its left, and elements `> P` are to its right.",
        "3. Let `pIndex` be the final index of pivot `P`.",
        "4. Recursively call `quickSort(arr, low, pIndex - 1)`.",
        "5. Recursively call `quickSort(arr, pIndex + 1, high)`."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ QuickSort with Lomuto Partition",
          "code": "#include <vector>\n#include <algorithm>\n\nint partition(std::vector<int>& arr, int low, int high) {\n    int pivot = arr[high];\n    int i = low - 1;\n    for (int j = low; j < high; ++j) {\n        if (arr[j] <= pivot) {\n            ++i;\n            std::swap(arr[i], arr[j]);\n        }\n    }\n    std::swap(arr[i + 1], arr[high]);\n    return i + 1;\n}\n\nvoid quickSort(std::vector<int>& arr, int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}",
          "explanation": "In-place C++ QuickSort implementing Lomuto partitioning."
        },
        {
          "language": "java",
          "title": "Java QuickSort Implementation",
          "code": "public class QuickSort {\n    public static void sort(int[] arr, int low, int high) {\n        if (low < high) {\n            int pi = partition(arr, low, high);\n            sort(arr, low, pi - 1);\n            sort(arr, pi + 1, high);\n        }\n    }\n\n    private static int partition(int[] arr, int low, int high) {\n        int pivot = arr[high];\n        int i = low - 1;\n        for (int j = low; j < high; j++) {\n            if (arr[j] < pivot) {\n                i++;\n                int temp = arr[i];\n                arr[i] = arr[j];\n                arr[j] = temp;\n            }\n        }\n        int temp = arr[i + 1];\n        arr[i + 1] = arr[high];\n        arr[high] = temp;\n        return i + 1;\n    }\n}",
          "explanation": "Java recursive implementation with clear helper partition method."
        },
        {
          "language": "python",
          "title": "Python In-Place QuickSort",
          "code": "def quick_sort(arr: list[int], low: int, high: int) -> None:\n    if low < high:\n        pi = partition(arr, low, high)\n        quick_sort(arr, low, pi - 1)\n        quick_sort(arr, pi + 1, high)\n\ndef partition(arr: list[int], low: int, high: int) -> int:\n    pivot = arr[high]\n    i = low - 1\n    for j in range(low, high):\n        if arr[j] <= pivot:\n            i += 1\n            arr[i], arr[j] = arr[j], arr[i]\n    arr[i + 1], arr[high] = arr[high], arr[i + 1]\n    return i + 1",
          "explanation": "Python in-place recursive sorting utilizing tuple unpacking for swaps."
        }
      ],
      "timeComplexity": "O(N log N) average/best, O(N^2) worst case when poorly partitioned",
      "spaceComplexity": "O(log N) recursion stack space (worst case O(N) without tail call optimization)",
      "keyTakeaways": [
        "QuickSort's inner loop is extremely tight and hardware cache friendly.",
        "Randomizing the pivot selection completely protects against adversarial O(N^2) worst-case inputs.",
        "Unlike MergeSort, QuickSort requires O(1) extra auxiliary array storage."
      ],
      "commonMistakes": [
        "Assuming Quick Sort is always O(N log N); without randomization, already-sorted input degenerates to O(N^2).",
        "Believing Quick Sort is stable; partition swaps can alter relative positions of duplicates.",
        "Stack overflow on massive arrays due to lack of tail call elimination."
      ],
      "relatedTopics": [
        "Merge Sort",
        "Heap Sort",
        "Introsort",
        "Divide and Conquer"
      ]
    }
  },
  {
    "topicId": "merge-sort",
    "chapterId": "dsa-u2-c2",
    "unitId": "dsa-u2",
    "subjectId": "dsa",
    "topicNumber": 3,
    "title": "Merge Sort & Stable Sorting Mechanics",
    "estimatedMinutes": 20,
    "difficulty": "Intermediate",
    "summary": "Guaranteed O(N log N) divide-and-conquer sorting algorithm with stable order preservation.",
    "subtopics": [
      "Divide Phase Recurrence",
      "Merge Two Sorted Arrays",
      "Inversion Counting",
      "Stability Properties"
    ],
    "content": {
      "introduction": "Merge Sort is an archetype of divide-and-conquer design, dividing an array into two equal halves, sorting each recursively, and then merging the sorted halves in linear time. It guarantees O(N log N) time complexity under all conditions.",
      "concepts": [
        "Stable Sorting: Elements with identical keys maintain their original relative order after sorting.",
        "Divide Step: Continually split array at midpoint until single-element base cases are reached: T(N) = 2T(N/2) + O(N).",
        "Merge Step: Two-pointer technique comparing front elements of left and right subarrays, copying the smaller to temporary buffer.",
        "External Sorting: Ideal for sorting data that exceeds RAM capacity (e.g. multi-gigabyte disk files) because sequential access patterns match disk hardware."
      ],
      "importantPoints": [
        "Merge Sort requires O(N) auxiliary space for the merge buffer when implemented on arrays.",
        "Preferred algorithm for sorting Linked Lists because merge operations require O(1) extra memory with pointer rewiring.",
        "Inversion counting (used in collaborative filtering and ranking) can be computed in O(N log N) alongside the merge routine."
      ],
      "examples": [
        "Sorting [38, 27, 43, 3, 9, 82, 10] step-by-step through recursive tree splits.",
        "Counting inversions where arr[i] > arr[j] and i < j."
      ],
      "algorithmSteps": [
        "1. If `low >= high`, return (base case).",
        "2. Calculate `mid = low + (high - low) / 2`.",
        "3. Recursively call `mergeSort(arr, low, mid)`.",
        "4. Recursively call `mergeSort(arr, mid + 1, high)`.",
        "5. Merge sorted subarrays `arr[low..mid]` and `arr[mid+1..high]` into temporary array and copy back."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ Merge Sort",
          "code": "#include <vector>\n\nvoid merge(std::vector<int>& arr, int l, int m, int r) {\n    int n1 = m - l + 1, n2 = r - m;\n    std::vector<int> L(n1), R(n2);\n    for (int i = 0; i < n1; i++) L[i] = arr[l + i];\n    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];\n\n    int i = 0, j = 0, k = l;\n    while (i < n1 && j < n2) {\n        if (L[i] <= R[j]) arr[k++] = L[i++];\n        else arr[k++] = R[j++];\n    }\n    while (i < n1) arr[k++] = L[i++];\n    while (j < n2) arr[k++] = R[j++];\n}\n\nvoid mergeSort(std::vector<int>& arr, int l, int r) {\n    if (l < r) {\n        int m = l + (r - l) / 2;\n        mergeSort(arr, l, m);\n        mergeSort(arr, m + 1, r);\n        merge(arr, l, m, r);\n    }\n}",
          "explanation": "Standard stable C++ Merge Sort implementation."
        },
        {
          "language": "java",
          "title": "Java Merge Sort",
          "code": "public class MergeSort {\n    public static void sort(int[] arr, int l, int r) {\n        if (l < r) {\n            int m = l + (r - l) / 2;\n            sort(arr, l, m);\n            sort(arr, m + 1, r);\n            merge(arr, l, m, r);\n        }\n    }\n\n    private static void merge(int[] arr, int l, int m, int r) {\n        int[] temp = new int[r - l + 1];\n        int i = l, j = m + 1, k = 0;\n        while (i <= m && j <= r) {\n            if (arr[i] <= arr[j]) temp[k++] = arr[i++];\n            else temp[k++] = arr[j++];\n        }\n        while (i <= m) temp[k++] = arr[i++];\n        while (j <= r) temp[k++] = arr[j++];\n        System.arraycopy(temp, 0, arr, l, temp.length);\n    }\n}",
          "explanation": "Clean Java implementation using System.arraycopy for buffer transfer."
        }
      ],
      "timeComplexity": "O(N log N) in all cases (Best, Average, and Worst)",
      "spaceComplexity": "O(N) auxiliary space + O(log N) call stack",
      "keyTakeaways": [
        "Merge Sort is deterministic: its runtime is strictly O(N log N) regardless of input ordering.",
        "Preserves duplicate order (Stable), making it ideal for multi-column sorting.",
        "Primary choice for linked list sorting and external disk sorting."
      ],
      "commonMistakes": [
        "Using `<` instead of `<=` in the merge comparator, accidentally destroying stability.",
        "Reallocating temporary arrays inside the recursive loop instead of using a single preallocated buffer.",
        "Overlooking the O(N) space requirement when comparing against Quick Sort or Heap Sort."
      ],
      "relatedTopics": [
        "Quick Sort",
        "External Sorting",
        "Inversion Count",
        "Linked List Sorting"
      ]
    }
  },
  {
    "topicId": "sql-joins",
    "chapterId": "dbms-u1-c1",
    "unitId": "dbms-u1",
    "subjectId": "dbms",
    "topicNumber": 1,
    "title": "SQL Joins & Relational Querying",
    "estimatedMinutes": 20,
    "difficulty": "Beginner",
    "summary": "Combining relational tuples across primary and foreign keys using INNER, LEFT, RIGHT, FULL, and CROSS JOIN operations.",
    "subtopics": [
      "INNER JOIN Logic",
      "LEFT/RIGHT OUTER JOIN",
      "FULL OUTER JOIN & Cartesian Product",
      "Self Joins & NULL Handling"
    ],
    "content": {
      "introduction": "SQL Joins allow relational databases to stitch normalized tables together based on matching primary-foreign key relationships. Understanding join semantics and NULL propagation is vital for writing high-performance database queries.",
      "concepts": [
        "INNER JOIN: Returns only rows where matching values exist in both tables.",
        "LEFT OUTER JOIN: Returns all rows from left table, with matched values from right table, or NULL if no match exists.",
        "RIGHT OUTER JOIN: Returns all rows from right table, with matched values from left table, or NULL if no match exists.",
        "FULL OUTER JOIN: Returns all rows from both tables, filling missing matches with NULLs.",
        "CROSS JOIN (Cartesian Product): Pairs every row in table A with every row in table B (size = |A| * |B|)."
      ],
      "importantPoints": [
        "Joins on indexed columns use Hash Join or Nested Loop Index Scan, yielding fast execution.",
        "Filtering in the `ON` clause vs `WHERE` clause has different effects in LEFT JOINs (filtering in WHERE turns LEFT JOIN into INNER JOIN).",
        "Self Joins allow querying hierarchical structures within a single table (e.g. Employee-Manager table)."
      ],
      "examples": [
        "Joining `Students` table with `CourseEnrollments` to find all enrolled students.",
        "Finding students who have NEVER submitted an assignment using `LEFT JOIN ... WHERE submission_id IS NULL`."
      ],
      "algorithmSteps": [
        "1. Identify primary table and joining tables.",
        "2. Determine primary key / foreign key join condition (`ON a.id = b.a_id`).",
        "3. Choose join type based on whether unmatched rows must be preserved.",
        "4. Apply filtering criteria in `WHERE` and aggregate using `GROUP BY`."
      ],
      "codeSnippets": [
        {
          "language": "sql",
          "title": "SQL Join Examples",
          "code": "-- 1. INNER JOIN: Only students with enrolled courses\nSELECT s.student_id, s.name, c.course_title\nFROM Students s\nINNER JOIN Enrollments e ON s.student_id = e.student_id\nINNER JOIN Courses c ON e.course_id = c.course_id;\n\n-- 2. LEFT JOIN: All students, even if they have 0 test attempts\nSELECT s.name, COUNT(tr.id) AS total_tests_taken\nFROM Students s\nLEFT JOIN TestResults tr ON s.student_id = tr.student_id\nGROUP BY s.student_id, s.name;\n\n-- 3. Self Join: Employee and Manager Hierarchy\nSELECT e.name AS Employee, m.name AS Manager\nFROM Employees e\nLEFT JOIN Employees m ON e.manager_id = m.employee_id;",
          "explanation": "Production SQL examples illustrating INNER, LEFT with aggregations, and Self-Joins."
        }
      ],
      "timeComplexity": "O(M + N) with Hash Join on indexed keys, O(M * N) with unindexed Nested Loop Join",
      "spaceComplexity": "O(M) memory for building in-memory hash tables during join resolution",
      "keyTakeaways": [
        "Use INNER JOIN when you strictly need matched pairs.",
        "Use LEFT JOIN when you must preserve all master records regardless of transaction existence.",
        "Ensure foreign keys have indexes created to avoid slow full-table scans."
      ],
      "commonMistakes": [
        "Putting left table filtering conditions in the `WHERE` clause after a `LEFT JOIN`, inadvertently converting it into an `INNER JOIN`.",
        "Creating unintentional Cartesian products (`CROSS JOIN`) by omitting join predicates in `ON` clauses."
      ],
      "relatedTopics": [
        "Primary Keys",
        "Normalization",
        "Indexing & B-Trees",
        "Subqueries"
      ]
    }
  },
  {
    "topicId": "dbms-normalization",
    "chapterId": "dbms-u2-c1",
    "unitId": "dbms-u2",
    "subjectId": "dbms",
    "topicNumber": 2,
    "title": "Database Normalization (1NF, 2NF, 3NF, BCNF)",
    "estimatedMinutes": 25,
    "difficulty": "Intermediate",
    "summary": "Systematic schema decomposition to eliminate insertion, deletion, and update anomalies using functional dependencies.",
    "subtopics": [
      "Functional Dependencies",
      "1NF Atomic Values",
      "2NF Partial Dependency Removal",
      "3NF Transitive Dependency Removal",
      "Boyce-Codd Normal Form (BCNF)"
    ],
    "content": {
      "introduction": "Database Normalization is the formal process of structuring relational schemas to minimize data redundancy and eliminate update anomalies (Insertion, Deletion, and Modification anomalies) while preserving data integrity.",
      "concepts": [
        "1NF (First Normal Form): Every column contains atomic (indivisible) values; no multi-valued attributes or repeating groups.",
        "2NF (Second Normal Form): Must be in 1NF AND have no Partial Dependencies (no non-prime attribute may depend on a proper subset of any candidate key).",
        "3NF (Third Normal Form): Must be in 2NF AND have no Transitive Dependencies (no non-prime attribute depends on another non-prime attribute). In X -> Y, X is super key OR Y is prime attribute.",
        "BCNF (Boyce-Codd Normal Form): Stricter than 3NF. For every non-trivial functional dependency X -> Y, X MUST be a Super Key."
      ],
      "importantPoints": [
        "Lossless Join Decomposition: When decomposing relation R into R1 and R2, R1 ∩ R2 must determine at least R1 or R2.",
        "Dependency Preservation: All functional dependencies of the original schema must be verifiable in the individual decomposed tables.",
        "3NF always guarantees both Lossless Join AND Dependency Preservation; BCNF guarantees Lossless Join but may not preserve dependencies."
      ],
      "examples": [
        "Decomposing `StudentCourse(StudentID, CourseID, StudentName, CourseFee)` from 1NF to 2NF.",
        "Decomposing `Employee(EmpID, DeptID, DeptName)` from 2NF to 3NF to eliminate `EmpID -> DeptID -> DeptName` transitive dependency."
      ],
      "algorithmSteps": [
        "1. Identify all Candidate Keys using closure of attribute sets.",
        "2. Check for 1NF (ensure atomic scalar columns).",
        "3. Check for 2NF: If compound candidate key exists, ensure no non-prime attribute depends on a partial key.",
        "4. Check for 3NF: Ensure non-prime attributes only depend directly on Candidate Keys.",
        "5. Decompose relations using projection preserving candidate key determinants."
      ],
      "codeSnippets": [
        {
          "language": "sql",
          "title": "Normalized Schema DDL",
          "code": "-- Normalized 3NF Schema Example\nCREATE TABLE Departments (\n    dept_id INT PRIMARY KEY,\n    dept_name VARCHAR(100) NOT NULL\n);\n\nCREATE TABLE Students (\n    student_id INT PRIMARY KEY,\n    name VARCHAR(100) NOT NULL,\n    dept_id INT REFERENCES Departments(dept_id)\n);\n\nCREATE TABLE Courses (\n    course_id INT PRIMARY KEY,\n    title VARCHAR(100) NOT NULL,\n    credits INT NOT NULL\n);\n\nCREATE TABLE Enrollments (\n    student_id INT REFERENCES Students(student_id),\n    course_id INT REFERENCES Courses(course_id),\n    grade CHAR(2),\n    PRIMARY KEY (student_id, course_id)\n);",
          "explanation": "3NF relational schema free from partial and transitive dependencies."
        }
      ],
      "timeComplexity": "O(2^N) theoretical attribute closure analysis in worst case, O(N^2) in standard schema designs",
      "spaceComplexity": "Eliminates duplicate storage rows, dramatically reducing disk footprint",
      "keyTakeaways": [
        "1NF: Atomic attributes.",
        "2NF: No partial dependency (relevant when candidate key is composite).",
        "3NF: No transitive dependency.",
        "BCNF: Determinant in every non-trivial FD must be a Super Key."
      ],
      "commonMistakes": [
        "Confusing candidate keys with primary keys (2NF checks against ALL candidate keys, not just the chosen primary key).",
        "Assuming BCNF is always superior to 3NF without realizing BCNF can drop dependency preservation.",
        "Over-normalizing OLAP analytics databases (where intentional denormalization is preferred for read speed)."
      ],
      "relatedTopics": [
        "Functional Dependencies",
        "Candidate Keys",
        "Denormalization",
        "SQL Joins"
      ]
    }
  },
  {
    "topicId": "cpu-scheduling",
    "chapterId": "os-u1-c1",
    "unitId": "os-u1",
    "subjectId": "os",
    "topicNumber": 1,
    "title": "CPU Scheduling Algorithms (FCFS, SJF, Round Robin)",
    "estimatedMinutes": 20,
    "difficulty": "Beginner",
    "summary": "Preemptive and non-preemptive algorithms for allocating CPU burst cycles to active ready processes.",
    "subtopics": [
      "FCFS & Convoy Effect",
      "SJF & Shortest Remaining Time First (SRTF)",
      "Round Robin & Time Quantum Sizing",
      "Turnaround & Waiting Time Metrics"
    ],
    "content": {
      "introduction": "CPU Scheduling is the process by which the operating system decides which process in the Ready Queue should be allocated CPU execution time. Efficient scheduling maximizes CPU utilization, minimizes turnaround time, and ensures responsive interactive systems.",
      "concepts": [
        "First-Come, First-Served (FCFS): Non-preemptive. Simple FIFO queue, but suffers from the Convoy Effect (short processes stuck waiting behind huge CPU bursts).",
        "Shortest Job First (SJF): Provably optimal in minimizing average waiting time, but impractical in pure form because future burst times cannot be known in advance.",
        "Shortest Remaining Time First (SRTF): Preemptive variant of SJF. Preempts current process if a newly arrived process has a shorter remaining burst.",
        "Round Robin (RR): Preemptive with a fixed Time Quantum `Q`. Ensures fairness and responsiveness in timesharing systems."
      ],
      "importantPoints": [
        "Time Quantum Selection in Round Robin: If `Q` is too large, RR degenerates to FCFS. If `Q` is too small, context switching overhead dominates CPU cycles.",
        "Rule of Thumb: 80% of CPU bursts should be shorter than the chosen Time Quantum `Q`.",
        "Starvation: In Priority and SJF scheduling, long jobs can starve indefinitely if shorter jobs continuously arrive."
      ],
      "examples": [
        "Calculate Waiting Time and Turnaround Time for processes P1(burst=6), P2(burst=8), P3(burst=7), P4(burst=3) with arrival time 0.",
        "Gantt Chart construction for Round Robin with Time Quantum = 4ms."
      ],
      "algorithmSteps": [
        "1. Turnaround Time = Completion Time - Arrival Time.",
        "2. Waiting Time = Turnaround Time - Burst Time.",
        "3. Response Time = Time at which process first gets CPU - Arrival Time.",
        "4. Average Waiting Time = Sum of Waiting Times / Total Processes."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ Round Robin Scheduling Simulation",
          "code": "#include <iostream>\n#include <vector>\n#include <queue>\n\nstruct Process {\n    int id;\n    int burstTime;\n    int remainingTime;\n    int completionTime;\n};\n\nvoid roundRobin(std::vector<Process>& proc, int quantum) {\n    int time = 0;\n    std::queue<int> q;\n    for (size_t i = 0; i < proc.size(); i++) q.push(i);\n\n    while (!q.empty()) {\n        int idx = q.front();\n        q.pop();\n        if (proc[idx].remainingTime > quantum) {\n            time += quantum;\n            proc[idx].remainingTime -= quantum;\n            q.push(idx);\n        } else {\n            time += proc[idx].remainingTime;\n            proc[idx].remainingTime = 0;\n            proc[idx].completionTime = time;\n        }\n    }\n}",
          "explanation": "Round Robin CPU scheduler simulation using FIFO process queues."
        }
      ],
      "timeComplexity": "O(N log N) using priority queues for SJF/Priority, O(N * (Burst/Q)) for Round Robin",
      "spaceComplexity": "O(N) for Ready Queue and PCB descriptor state storage",
      "keyTakeaways": [
        "SJF produces minimum average waiting time.",
        "Round Robin is the foundation of interactive multitasking operating systems.",
        "Aging technique (gradually increasing priority of waiting processes) prevents starvation in priority scheduling."
      ],
      "commonMistakes": [
        "Confusing Waiting Time with Turnaround Time (Turnaround = Completion - Arrival; Waiting = Turnaround - Burst).",
        "Forgetting context switch latency when modeling Round Robin performance."
      ],
      "relatedTopics": [
        "Process Control Block",
        "Context Switching",
        "Multilevel Feedback Queues",
        "Process Synchronization"
      ]
    }
  },
  {
    "topicId": "virtual-memory-paging",
    "chapterId": "os-u3-c1",
    "unitId": "os-u3",
    "subjectId": "os",
    "topicNumber": 2,
    "title": "Virtual Memory, Paging & Page Replacement",
    "estimatedMinutes": 25,
    "difficulty": "Intermediate",
    "summary": "Translating logical addresses to physical frames, handling page faults, and page replacement algorithms (FIFO, LRU, Optimal).",
    "subtopics": [
      "Page Table & MMU Translation",
      "Translation Lookaside Buffer (TLB)",
      "Page Fault Interrupt Handling",
      "Page Replacement (FIFO, LRU, Belady's Anomaly)"
    ],
    "content": {
      "introduction": "Virtual Memory gives each running process the illusion of a contiguous address space larger than physical RAM. The Memory Management Unit (MMU) maps logical page numbers to physical frame numbers using Page Tables and TLBs.",
      "concepts": [
        "Paging: Dividing logical memory into fixed-size Pages (typically 4KB) and physical memory into identical-size Frames.",
        "Page Fault: Hardware interrupt triggered when a process attempts to access a page whose valid/invalid bit is set to invalid (not currently present in RAM).",
        "TLB (Translation Lookaside Buffer): High-speed hardware associative cache storing recent virtual-to-physical translations.",
        "Page Replacement Algorithms: Deciding which victim page to swap out to disk when all physical frames are occupied."
      ],
      "importantPoints": [
        "Effective Access Time (EAT) = (TLB hit ratio * (TLB time + Memory time)) + ((1 - TLB hit ratio) * (TLB time + 2 * Memory time)).",
        "Belady's Anomaly: In FIFO page replacement, increasing the number of physical page frames can paradoxically increase the number of page faults.",
        "LRU (Least Recently Used) is an approximation of the theoretical Optimal Page Replacement (MIN/OPT) algorithm and is immune to Belady's anomaly."
      ],
      "examples": [
        "Reference string: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1 with 3 physical frames.",
        "Calculating page fault count under FIFO vs LRU."
      ],
      "algorithmSteps": [
        "1. CPU generates virtual address (Page Number `p`, Page Offset `d`).",
        "2. Check TLB: If TLB hit, fetch frame number `f` immediately.",
        "3. If TLB miss, lookup Page Table in main memory.",
        "4. If Valid bit is 0, trigger Page Fault Trap to OS.",
        "5. OS finds empty frame or invokes Page Replacement Algorithm (LRU) to evict victim page.",
        "6. Swap requested page from disk into RAM, update Page Table valid bit to 1, restart CPU instruction."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ LRU Page Replacement Simulation",
          "code": "#include <vector>\n#include <unordered_map>\n#include <list>\n#include <iostream>\n\nint countLRUPageFaults(const std::vector<int>& pages, int capacity) {\n    std::unordered_map<int, std::list<int>::iterator> pageMap;\n    std::list<int> lruList;\n    int pageFaults = 0;\n\n    for (int page : pages) {\n        if (pageMap.find(page) == pageMap.end()) {\n            pageFaults++;\n            if (static_cast<int>(lruList.size()) == capacity) {\n                int victim = lruList.back();\n                lruList.pop_back();\n                pageMap.erase(victim);\n            }\n        } else {\n            lruList.erase(pageMap[page]);\n        }\n        lruList.push_front(page);\n        pageMap[page] = lruList.begin();\n    }\n    return pageFaults;\n}",
          "explanation": "O(1) LRU Page Replacement using Hash Map and Doubly Linked List."
        }
      ],
      "timeComplexity": "O(1) memory lookup with TLB hit; ~10-20ms penalty on Page Fault due to disk I/O",
      "spaceComplexity": "O(P) Page table size proportional to number of virtual pages (mitigated by Multi-level page tables)",
      "keyTakeaways": [
        "Page Offset `d` passes through unchanged from logical to physical address.",
        "LRU and Optimal algorithms never suffer from Belady's anomaly (they are Stack algorithms).",
        "Thrashing occurs when the system spends more time swapping pages than executing instructions."
      ],
      "commonMistakes": [
        "Believing FIFO always improves with more memory (Belady's anomaly counterexamples prove otherwise).",
        "Assuming page offset changes during MMU translation (only the page number is replaced by frame number).",
        "Ignoring the massive performance cost of page faults (~100,000x slower than RAM access)."
      ],
      "relatedTopics": [
        "Segmentation",
        "Thrashing",
        "Working Set Model",
        "Memory Management Unit"
      ]
    }
  },
  {
    "topicId": "tcp-handshake",
    "chapterId": "cn-u3-c1",
    "unitId": "cn-u3",
    "subjectId": "cn",
    "topicNumber": 1,
    "title": "TCP 3-Way Handshake & Connection Teardown",
    "estimatedMinutes": 20,
    "difficulty": "Beginner",
    "summary": "Reliable bidirectional stream connection establishment (SYN, SYN-ACK, ACK) and graceful 4-way termination (FIN-ACK).",
    "subtopics": [
      "SYN / SYN-ACK / ACK Mechanics",
      "Initial Sequence Numbers (ISN)",
      "TCP 4-Way FIN Teardown",
      "TIME_WAIT State & SYN Flood Attacks"
    ],
    "content": {
      "introduction": "Transmission Control Protocol (TCP) is a connection-oriented, reliable transport protocol that guarantees ordered, error-checked packet delivery. Before any application data (HTTP, SSH) flows, endpoints establish synchronized sequence numbers via the 3-Way Handshake.",
      "concepts": [
        "SYN (Synchronize): Client sends randomly chosen initial sequence number `ISN_C`.",
        "SYN-ACK: Server acknowledges client's sequence number (`ACK = ISN_C + 1`) and sends its own `ISN_S`.",
        "ACK: Client acknowledges server's sequence number (`ACK = ISN_S + 1`). Connection is now ESTABLISHED.",
        "TIME_WAIT State: Client waits 2 * MSL (Maximum Segment Lifetime, typically 60-120s) before closing to guarantee last ACK reached server and flush lingering duplicate packets."
      ],
      "importantPoints": [
        "SYN Flooding: DoS attack sending thousands of SYN packets without completing the 3rd ACK, exhausting server connection backlogs (mitigated by SYN Cookies).",
        "TCP Half-Close: One endpoint finishes sending data (sends FIN) but can continue receiving data from the peer.",
        "Piggybacking: The final ACK packet of the handshake can simultaneously carry initial application payload (e.g. HTTP GET request in TCP Fast Open)."
      ],
      "examples": [
        "Wireshark packet capture showing SYN (Seq=100) -> SYN-ACK (Seq=300, Ack=101) -> ACK (Seq=101, Ack=301).",
        "Analyzing why `netstat` displays thousands of sockets stuck in `TIME_WAIT`."
      ],
      "algorithmSteps": [
        "1. Client -> Server: `[SYN], Seq = x`",
        "2. Server -> Client: `[SYN, ACK], Seq = y, Ack = x + 1`",
        "3. Client -> Server: `[ACK], Seq = x + 1, Ack = y + 1`",
        "4. Both sides transition to `ESTABLISHED` state."
      ],
      "codeSnippets": [
        {
          "language": "javascript",
          "title": "Node.js TCP Client/Server Handshake Verification",
          "code": "const net = require('net');\n\n// TCP Server\nconst server = net.createServer((socket) => {\n  console.log('Client connected (3-Way Handshake Completed)');\n  socket.write('Hello TCP Client!\\n');\n  socket.on('data', (data) => console.log('Received:', data.toString()));\n});\nserver.listen(8080, () => console.log('TCP Server listening on port 8080'));\n\n// TCP Client\nconst client = net.createConnection({ port: 8080 }, () => {\n  console.log('Connected to server');\n  client.write('Client ready for communication');\n});",
          "explanation": "Low-level Node.js socket demonstration triggering kernel TCP handshake."
        }
      ],
      "timeComplexity": "1 RTT (Round Trip Time) connection latency overhead prior to payload delivery",
      "spaceComplexity": "O(1) memory for Socket TCB (Transmission Control Block) kernel struct",
      "keyTakeaways": [
        "Handshake establishes mutual agreement on starting sequence numbers for reliable byte streaming.",
        "Connection termination requires 4 packets (FIN -> ACK -> FIN -> ACK) because TCP is full-duplex.",
        "SYN Cookies defend servers against denial-of-service memory exhaustion."
      ],
      "commonMistakes": [
        "Believing the 3-way handshake carries user payload (unless TCP Fast Open is specifically negotiated).",
        "Assuming `TIME_WAIT` is a bug; it is an essential safeguard to prevent delayed duplicate packets from corrupting new connections."
      ],
      "relatedTopics": [
        "UDP vs TCP",
        "Flow Control & Sliding Window",
        "Congestion Control",
        "SYN Flood Attacks"
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
    "estimatedMinutes": 20,
    "difficulty": "Intermediate",
    "summary": "Five essential design principles for building maintainable, decoupled, and extensible object-oriented software.",
    "subtopics": [
      "Single Responsibility (SRP)",
      "Open/Closed (OCP)",
      "Liskov Substitution (LSP)",
      "Interface Segregation (ISP)",
      "Dependency Inversion (DIP)"
    ],
    "content": {
      "introduction": "SOLID is an acronym for five foundational design principles introduced by Robert C. Martin (Uncle Bob). Following SOLID produces modular systems that are easy to test, refactor, and extend without causing cascading code regressions.",
      "concepts": [
        "S — Single Responsibility Principle (SRP): A class should have one, and only one, reason to change.",
        "O — Open/Closed Principle (OCP): Software entities should be open for extension, but closed for modification.",
        "L — Liskov Substitution Principle (LSP): Subtypes must be substitutable for their base types without altering program correctness.",
        "I — Interface Segregation Principle (ISP): Clients should not be forced to depend upon interfaces they do not use.",
        "D — Dependency Inversion Principle (DIP): High-level modules should not depend on low-level modules; both should depend on abstractions (interfaces)."
      ],
      "importantPoints": [
        "LSP Violation Classic: Making a `Square` class inherit from `Rectangle` and overriding `setWidth`/`setHeight` breaks client code expecting independent dimensions.",
        "Dependency Injection (DI) is the primary design pattern used to realize the Dependency Inversion Principle.",
        "Open/Closed principle is achieved through Polymorphism and Strategy patterns."
      ],
      "examples": [
        "Refactoring a monolithic `UserManager` (handles validation, database saving, and email sending) into 3 focused SRP classes.",
        "Using Payment Gateway interfaces to add PayPal/Stripe support without modifying checkout logic (OCP)."
      ],
      "algorithmSteps": [
        "1. Identify responsibilities in classes and split if multiple change actors exist (SRP).",
        "2. Replace conditionals on type (`switch (type)`) with Polymorphic strategies (OCP).",
        "3. Ensure derived classes uphold all contracts and invariants of base class (LSP).",
        "4. Break monolithic fat interfaces into small client-specific interfaces (ISP).",
        "5. Inject interface abstractions rather than instantiating concrete classes with `new` (DIP)."
      ],
      "codeSnippets": [
        {
          "language": "java",
          "title": "Java Dependency Inversion Principle (DIP)",
          "code": "// Interface Abstraction\ninterface NotificationService {\n    void send(String message, String recipient);\n}\n\n// Low-level modules\nclass EmailService implements NotificationService {\n    public void send(String msg, String to) { System.out.println(\"Email to \" + to + \": \" + msg); }\n}\n\nclass SmsService implements NotificationService {\n    public void send(String msg, String to) { System.out.println(\"SMS to \" + to + \": \" + msg); }\n}\n\n// High-level module depends on Abstraction, NOT concrete classes\nclass OrderProcessor {\n    private final NotificationService notifier;\n\n    public OrderProcessor(NotificationService notifier) { // Injected via constructor\n        this.notifier = notifier;\n    }\n\n    public void completeOrder(String user) {\n        // ... process payment ...\n        notifier.send(\"Your order is confirmed!\", user);\n    }\n}",
          "explanation": "Dependency Inversion in Java: OrderProcessor is decoupled from concrete notification implementations."
        },
        {
          "language": "python",
          "title": "Python Open/Closed Principle (OCP)",
          "code": "from abc import ABC, abstractmethod\n\nclass PaymentStrategy(ABC):\n    @abstractmethod\n    def pay(self, amount: float) -> None:\n        pass\n\nclass CreditCardPayment(PaymentStrategy):\n    def pay(self, amount: float) -> None:\n        print(f\"Paid ${amount} via Credit Card\")\n\nclass CryptoPayment(PaymentStrategy):\n    def pay(self, amount: float) -> None:\n        print(f\"Paid ${amount} via Ethereum\")\n\n# Open for extension (new payment methods), closed for modification\nclass Checkout:\n    def process(self, payment: PaymentStrategy, amount: float):\n        payment.pay(amount)",
          "explanation": "Python Strategy pattern satisfying the Open/Closed Principle."
        }
      ],
      "timeComplexity": "O(1) runtime dispatch overhead through virtual tables / interface lookups",
      "spaceComplexity": "Negligible memory overhead for interface references",
      "keyTakeaways": [
        "SOLID prevents software rot and fragile dependencies.",
        "Always favor composition and interfaces over deep inheritance trees.",
        "Single Responsibility is the most violated principle in real-world codebases."
      ],
      "relatedTopics": [
        "Factory Pattern",
        "Dependency Injection",
        "Design Patterns",
        "Polymorphism"
      ]
    }
  },
  {
    "topicId": "algorithm-complexity",
    "chapterId": "dsa-u1-c1",
    "unitId": "dsa-u1",
    "subjectId": "dsa",
    "topicNumber": 1,
    "title": "Asymptotic Analysis & Big-O Notation",
    "estimatedMinutes": 25,
    "difficulty": "Beginner",
    "summary": "Asymptotic growth rate analysis, Big-O, Big-Omega, Big-Theta, and recurrence relation solutions.",
    "subtopics": [
      "Big-O Upper Bound",
      "Big-Omega Lower Bound",
      "Big-Theta Tight Bound",
      "Space-Time Tradeoffs"
    ],
    "content": {
      "introduction": "Asymptotic Analysis is the foundational tool used to evaluate the efficiency of algorithms independently of machine hardware, programming language, or compiler optimizations.",
      "concepts": [
        "Big-O (Worst-Case Upper Bound): Describes the upper limit of running time.",
        "Big-Omega (Best-Case Lower Bound): Describes the minimum running time.",
        "Big-Theta (Tight Bound): Characterizes running time when upper and lower bounds coincide."
      ],
      "importantPoints": [
        "Drop constant factors: O(2N) simplifies to O(N).",
        "Focus on highest-degree terms: O(N^2 + 5N + 100) simplifies to O(N^2)."
      ],
      "examples": [
        "Single loop over N elements: O(N).",
        "Nested loops over N elements: O(N^2).",
        "Halving search space at each step: O(log N)."
      ],
      "algorithmSteps": [
        "1. Identify input size N.",
        "2. Count primitive operations executed as a function of N.",
        "3. Keep dominant term and drop lower-order terms."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "Linear vs Quadratic Growth Example",
          "code": "#include <iostream>\nusing namespace std;\n\nvoid analyzeLoops(int n) {\n    // Linear loop: O(n)\n    for(int i=0; i<n; i++) cout << i << \" \";\n    cout << endl;\n    // Quadratic nested loop: O(n^2)\n    for(int i=0; i<n; i++) {\n        for(int j=0; j<n; j++) cout << \"(\" << i << \",\" << j << \") \";\n    }\n}",
          "explanation": "Comparison of O(n) single loop vs O(n^2) nested loop."
        }
      ],
      "timeComplexity": "O(1) calculation method for asymptotic classification",
      "spaceComplexity": "O(1) auxiliary space",
      "keyTakeaways": [
        "Always express time complexity in terms of input size N."
      ],
      "commonMistakes": [
        "Confusing Big-O worst case with average case behavior."
      ]
    }
  },
  {
    "topicId": "linked-lists",
    "chapterId": "dsa-u3-c1",
    "unitId": "dsa-u3",
    "subjectId": "dsa",
    "topicNumber": 1,
    "title": "Singly & Doubly Linked List Operations",
    "estimatedMinutes": 25,
    "difficulty": "Beginner",
    "summary": "Dynamic memory allocation, node pointer manipulation, insertion, deletion, and Floyd's Cycle Detection.",
    "subtopics": [
      "Node Pointer Structures",
      "Head & Tail References",
      "Cycle Detection",
      "Reversal Algorithm"
    ],
    "content": {
      "introduction": "Linked Lists store elements in non-contiguous memory locations connected via explicit node pointers.",
      "concepts": [
        "Node Structure: Contains data field and pointer to next node.",
        "Singly vs Doubly: Doubly linked lists maintain both next and prev pointers.",
        "Floyd's Cycle Finding: Two-pointer slow and fast approach to detect loops in O(N) time and O(1) space."
      ],
      "importantPoints": [
        "Insertion at head is O(1) whereas array insertion at index 0 is O(N)."
      ],
      "examples": [
        "Reversing a Singly Linked List in-place."
      ],
      "algorithmSteps": [
        "1. Initialize prev = NULL, curr = head.",
        "2. Save next node.",
        "3. Reverse pointer: curr->next = prev.",
        "4. Advance pointers."
      ],
      "codeSnippets": [
        {
          "language": "python",
          "title": "Python Linked List Reversal",
          "code": "class Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n\ndef reverse_list(head):\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev",
          "explanation": "In-place iterative linked list reversal."
        }
      ],
      "timeComplexity": "Insertion at head: O(1), Search: O(N)",
      "spaceComplexity": "O(1) auxiliary space for pointer manipulations",
      "keyTakeaways": [
        "Handle boundary cases: empty list, single node, two nodes."
      ],
      "commonMistakes": [
        "Losing reference to next node during pointer assignment leading to memory leaks."
      ]
    }
  },
  {
    "topicId": "binary-search-trees",
    "chapterId": "dsa-u4-c1",
    "unitId": "dsa-u4",
    "subjectId": "dsa",
    "topicNumber": 1,
    "title": "Binary Search Trees & Traversal Algorithms",
    "estimatedMinutes": 30,
    "difficulty": "Intermediate",
    "summary": "Hierarchical tree structures, BST invariant property, Inorder, Preorder, Postorder traversals, and deletion algorithms.",
    "subtopics": [
      "BST Invariant",
      "Inorder Traversal (Sorted Output)",
      "Preorder/Postorder",
      "Deletion Scenarios"
    ],
    "content": {
      "introduction": "A Binary Search Tree (BST) is a binary tree where left child < root < right child for every subtree.",
      "concepts": [
        "BST Invariant: Enables O(log N) average lookup, insertion, and deletion.",
        "Inorder Traversal: Visits Left -> Root -> Right, generating strictly sorted sequence."
      ],
      "importantPoints": [
        "Inorder traversal of BST always produces sorted keys."
      ],
      "examples": [
        "Inserting keys [50, 30, 70, 20, 40] into empty BST."
      ],
      "algorithmSteps": [
        "1. Compare key with root node.",
        "2. Recurse left if key < root, right if key > root."
      ],
      "codeSnippets": [
        {
          "language": "java",
          "title": "Java Inorder Traversal",
          "code": "class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int x) { val = x; }\n}\n\nvoid inorder(TreeNode root) {\n    if (root == null) return;\n    inorder(root.left);\n    System.out.print(root.val + \" \");\n    inorder(root.right);\n}",
          "explanation": "Recursive inorder traversal of Binary Search Tree."
        }
      ],
      "timeComplexity": "Average: O(log N), Worst-case (skewed): O(N)",
      "spaceComplexity": "O(H) recursion stack space where H is tree height",
      "keyTakeaways": [
        "BST lookup degenerates to O(N) when inserted with sorted inputs."
      ],
      "commonMistakes": [
        "Forgetting to update parent pointers during node deletion."
      ]
    }
  },
  {
    "topicId": "avl-tree-rotations",
    "chapterId": "dsa-u5-c1",
    "unitId": "dsa-u5",
    "subjectId": "dsa",
    "topicNumber": 1,
    "title": "AVL Trees & Self-Balancing Rotations",
    "estimatedMinutes": 30,
    "difficulty": "Advanced",
    "summary": "Strict height-balanced binary search tree with Balance Factor in {-1, 0, 1} and LL, RR, LR, RL tree rotations.",
    "subtopics": [
      "Balance Factor Invariant",
      "LL & RR Single Rotations",
      "LR & RL Double Rotations",
      "Strict O(log N) Guarantee"
    ],
    "content": {
      "introduction": "AVL Trees are self-balancing binary search trees where height difference between left and right subtrees never exceeds 1.",
      "concepts": [
        "Balance Factor = Height(Left) - Height(Right). Must be -1, 0, or +1.",
        "Single Rotations: LL rotation fixes left-heavy subtree; RR rotation fixes right-heavy subtree.",
        "Double Rotations: LR rotation = Left rotate left child then Right rotate root."
      ],
      "importantPoints": [
        "AVL trees guarantee strict O(log N) lookup time even in worst-case insertions."
      ],
      "examples": [
        "LL Rotation when key 10 is inserted into root 30 -> child 20."
      ],
      "algorithmSteps": [
        "1. Perform standard BST insertion.",
        "2. Update node height.",
        "3. Compute balance factor.",
        "4. Apply single or double rotation if imbalanced."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ Right Rotation (LL Fix)",
          "code": "struct Node {\n    int key, height;\n    Node *left, *right;\n};\n\nNode* rightRotate(Node* y) {\n    Node* x = y->left;\n    Node* T2 = x->right;\n    x->right = y;\n    y->left = T2;\n    y->height = max(height(y->left), height(y->right)) + 1;\n    x->height = max(height(x->left), height(x->right)) + 1;\n    return x;\n}",
          "explanation": "Right rotation to re-balance an LL-imbalanced AVL node."
        }
      ],
      "timeComplexity": "O(log N) for Search, Insertion, and Deletion guaranteed",
      "spaceComplexity": "O(N) node storage space",
      "keyTakeaways": [
        "AVL trees provide faster lookups than Red-Black trees due to stricter height balancing."
      ],
      "commonMistakes": [
        "Failing to update height attributes after pointer re-assignments."
      ]
    }
  },
  {
    "topicId": "graph-bfs-dfs",
    "chapterId": "dsa-u6-c1",
    "unitId": "dsa-u6",
    "subjectId": "dsa",
    "topicNumber": 1,
    "title": "Graph Traversal (BFS & DFS) & Shortest Path",
    "estimatedMinutes": 35,
    "difficulty": "Advanced",
    "summary": "Breadth-First Search queue traversal, Depth-First Search recursion stack, connected components, and Dijkstra's algorithm.",
    "subtopics": [
      "Adjacency List/Matrix Representation",
      "BFS Queue Level Order",
      "DFS Recursion Stack",
      "Dijkstra Priority Queue"
    ],
    "content": {
      "introduction": "Graphs represent complex networks of vertices connected by edges. Traversals visit every vertex systematically.",
      "concepts": [
        "BFS (Breadth-First Search): Uses Queue data structure to explore level-by-level, finding unweighted shortest paths.",
        "DFS (Depth-First Search): Uses Stack/Recursion to explore deeply along branches before backtracking.",
        "Dijkstra's Algorithm: Uses Min-Heap Priority Queue to find shortest paths in non-negative edge-weighted graphs."
      ],
      "importantPoints": [
        "BFS finds the shortest path in unweighted graphs."
      ],
      "examples": [
        "Social network degree of separation lookup using BFS."
      ],
      "algorithmSteps": [
        "1. Mark source visited.",
        "2. Enqueue source into Queue.",
        "3. While queue not empty, pop u, visit unvisited neighbors v."
      ],
      "codeSnippets": [
        {
          "language": "python",
          "title": "Python Breadth-First Search",
          "code": "from collections import deque\n\ndef bfs(adj, start):\n    visited = set([start])\n    queue = deque([start])\n    while queue:\n        node = queue.popleft()\n        print(node, end=\" \")\n        for neighbor in adj[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)",
          "explanation": "Standard BFS traversal using deque."
        }
      ],
      "timeComplexity": "O(V + E) for BFS & DFS; O((V + E) log V) for Dijkstra",
      "spaceComplexity": "O(V) visited set and queue memory",
      "keyTakeaways": [
        "Always maintain a visited set to avoid infinite loops in cyclic graphs."
      ],
      "commonMistakes": [
        "Forgetting to mark nodes visited upon enqueueing leading to duplicate queue entries."
      ]
    }
  },
  {
    "topicId": "acid-transactions",
    "chapterId": "dbms-u3-c1",
    "unitId": "dbms-u3",
    "subjectId": "dbms",
    "topicNumber": 1,
    "title": "ACID Properties & Transaction Concurrency",
    "estimatedMinutes": 25,
    "difficulty": "Intermediate",
    "summary": "Atomicity, Consistency, Isolation, Durability, 2-Phase Locking (2PL), serializability, and isolation levels.",
    "subtopics": [
      "Atomicity & Rollbacks",
      "Isolation Levels",
      "2-Phase Locking (2PL)",
      "Deadlock Detection"
    ],
    "content": {
      "introduction": "Database transactions ensure reliable execution of database operations under concurrent user access and system failures.",
      "concepts": [
        "Atomicity: All-or-nothing execution.",
        "Consistency: Database transitions from one valid state to another.",
        "Isolation: Concurrent transactions execute independently without mutual interference.",
        "Durability: Committed transactions persist permanently across crashes."
      ],
      "importantPoints": [
        "Serializable isolation level provides the highest guarantees but lowest concurrency throughput."
      ],
      "examples": [
        "Bank transfer of $500 from Account A to Account B."
      ],
      "algorithmSteps": [
        "1. BEGIN TRANSACTION",
        "2. DEBIT Account A",
        "3. CREDIT Account B",
        "4. COMMIT TRANSACTION"
      ],
      "codeSnippets": [
        {
          "language": "sql",
          "title": "SQL Transaction Control",
          "code": "BEGIN TRANSACTION;\nUPDATE accounts SET balance = balance - 500 WHERE account_id = 'A';\nUPDATE accounts SET balance = balance + 500 WHERE account_id = 'B';\nCOMMIT;",
          "explanation": "Atomic bank transfer transaction block."
        }
      ],
      "timeComplexity": "O(1) transaction lock acquisition overhead",
      "spaceComplexity": "O(L) log buffer storage for WAL (Write-Ahead Logging)",
      "keyTakeaways": [
        "Write-Ahead Logging (WAL) ensures Durability across system crashes."
      ],
      "commonMistakes": [
        "Failing to handle deadlock exceptions in application business logic."
      ]
    }
  },
  {
    "topicId": "deadlocks-bankers",
    "chapterId": "os-u2-c1",
    "unitId": "os-u2",
    "subjectId": "os",
    "topicNumber": 1,
    "title": "Process Synchronization & Banker's Algorithm",
    "estimatedMinutes": 30,
    "difficulty": "Intermediate",
    "summary": "Mutual exclusion, semaphores, deadlock prevention, detection, and Banker's safety state algorithm.",
    "subtopics": [
      "4 Deadlock Conditions",
      "Mutex & Semaphores",
      "Banker's Safety Algorithm",
      "Resource Allocation Graph"
    ],
    "content": {
      "introduction": "Process synchronization coordinates concurrent execution to prevent data races and deadlock states.",
      "concepts": [
        "4 Deadlock Necessary Conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.",
        "Banker's Algorithm: Tests for safety by simulating allocation of maximum declared resources."
      ],
      "importantPoints": [
        "All 4 conditions must hold simultaneously for a deadlock to occur."
      ],
      "examples": [
        "Dining Philosophers problem synchronization using semaphores."
      ],
      "algorithmSteps": [
        "1. Calculate Need = Max - Allocation.",
        "2. Find process P whose Need <= Available.",
        "3. Assume P finishes and releases Allocation to Available.",
        "4. Repeat until all finish."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ Mutex Synchronization",
          "code": "#include <mutex>\n#include <thread>\n\nstd::mutex mtx;\nint counter = 0;\n\nvoid increment() {\n    std::lock_guard<std::mutex> lock(mtx);\n    counter++;\n}",
          "explanation": "Thread-safe counter increment using mutex lock_guard."
        }
      ],
      "timeComplexity": "O(N^2 * M) safety check for N processes and M resource types",
      "spaceComplexity": "O(N * M) allocation matrix memory",
      "keyTakeaways": [
        "Banker's algorithm guarantees deadlock avoidance by maintaining a safe state."
      ],
      "commonMistakes": [
        "Holding mutex locks while making blocking I/O calls causing circular waits."
      ]
    }
  },
  {
    "topicId": "osi-model-layers",
    "chapterId": "cn-u1-c1",
    "unitId": "cn-u1",
    "subjectId": "cn",
    "topicNumber": 1,
    "title": "OSI 7-Layer & TCP/IP Reference Model",
    "estimatedMinutes": 20,
    "difficulty": "Beginner",
    "summary": "Physical, Data Link, Network, Transport, Session, Presentation, Application layers, and data encapsulation.",
    "subtopics": [
      "Physical to Application Layer",
      "Data Encapsulation Headers",
      "MAC vs IP vs Port Addresses",
      "PDU Types"
    ],
    "content": {
      "introduction": "The OSI 7-Layer model standardizes network communication functions across heterogeneous hardware systems.",
      "concepts": [
        "7 OSI Layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.",
        "Encapsulation: Headers added at each layer (Bits -> Frames -> Packets -> Segments -> Data)."
      ],
      "importantPoints": [
        "Switches operate at Layer 2 (Data Link), Routers at Layer 3 (Network)."
      ],
      "examples": [
        "Web browser fetching web page over HTTPS (Layer 7 Application down to Layer 1 Physical)."
      ],
      "algorithmSteps": [
        "1. Application creates Data.",
        "2. Transport adds TCP Port header.",
        "3. Network adds IP header.",
        "4. Data Link adds MAC Ethernet header."
      ],
      "codeSnippets": [
        {
          "language": "python",
          "title": "Python Socket Application Layer Test",
          "code": "import socket\n\ns = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\ns.connect((\"example.com\", 80))\ns.sendall(b\"GET / HTTP/1.1\\r\\nHost: example.com\\r\\n\\r\\n\")\nresponse = s.recv(4096)\nprint(response.decode()[:100])",
          "explanation": "Low-level socket HTTP GET request across OSI layers."
        }
      ],
      "timeComplexity": "O(L) header processing per protocol layer",
      "spaceComplexity": "O(H) header memory overhead per packet",
      "keyTakeaways": [
        "TCP/IP combines OSI layers 5-7 into the single Application layer."
      ],
      "commonMistakes": [
        "Confusing Layer 2 MAC addresses with Layer 3 IP addresses."
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
    "summary": "Encapsulation, Data Abstraction, Inheritance, and Method Overloading/Overriding Polymorphism.",
    "subtopics": [
      "Encapsulation & Access Modifiers",
      "Abstraction Interfaces",
      "Inheritance Code Reuse",
      "Polymorphism Virtual Functions"
    ],
    "content": {
      "introduction": "OOP structures programs around self-contained objects encapsulating state data and behavior methods.",
      "concepts": [
        "Encapsulation: Bundling data and methods into a single class with private access control.",
        "Abstraction: Hiding internal implementation details behind clean public interfaces.",
        "Inheritance: Creating sub-classes that derive attributes and methods from super-classes.",
        "Polymorphism: Overriding methods to execute different runtime behavior through uniform interface pointers."
      ],
      "importantPoints": [
        "Polymorphism enables open-closed extensibility."
      ],
      "examples": [
        "Shape super-class with Circle and Rectangle derived classes overriding draw()."
      ],
      "algorithmSteps": [
        "1. Define Class interface.",
        "2. Encapsulate data variables private.",
        "3. Expose getter/setter methods."
      ],
      "codeSnippets": [
        {
          "language": "java",
          "title": "Java Polymorphism Example",
          "code": "abstract class Shape {\n    abstract double area();\n}\n\nclass Circle extends Shape {\n    double r;\n    Circle(double r) { this.r = r; }\n    double area() { return Math.PI * r * r; }\n}\n\nclass Rectangle extends Shape {\n    double w, h;\n    Rectangle(double w, double h) { this.w = w; this.h = h; }\n    double area() { return w * h; }\n}",
          "explanation": "Polymorphic area calculation in Java."
        }
      ],
      "timeComplexity": "O(1) method dispatch overhead via virtual method tables (vtables)",
      "spaceComplexity": "O(1) memory overhead per object instance",
      "keyTakeaways": [
        "Favor composition over inheritance to avoid tight coupling."
      ],
      "commonMistakes": [
        "Making class data members public, violating encapsulation."
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
    "summary": "Horizontal scaling, Round-Robin load balancing, Redis caching strategies, and Consistent Hashing.",
    "subtopics": [
      "Horizontal vs Vertical Scaling",
      "Load Balancer Algorithms",
      "Cache Eviction (LRU)",
      "Consistent Hashing"
    ],
    "content": {
      "introduction": "System Design focuses on building distributed web systems capable of serving millions of concurrent requests reliably.",
      "concepts": [
        "Horizontal Scaling: Adding more server instances behind a load balancer.",
        "Caching (Redis/Memcached): Storing hot data in memory to reduce database read pressure.",
        "Consistent Hashing: Distributes keys evenly across dynamically scaling cache server clusters."
      ],
      "importantPoints": [
        "Caching read-heavy data reduces database latency from 50ms to <1ms."
      ],
      "examples": [
        "Designing URL Shortener (TinyURL) or Twitter Feed Architecture."
      ],
      "algorithmSteps": [
        "1. Client sends request to DNS.",
        "2. DNS resolves to Load Balancer IP.",
        "3. Load Balancer forwards to stateless Web Server.",
        "4. Server checks Redis cache before querying DB."
      ],
      "codeSnippets": [
        {
          "language": "javascript",
          "title": "Node.js Redis Caching Middleware",
          "code": "const redis = require('redis');\nconst client = redis.createClient();\n\nasync function getCachedData(req, res, next) {\n    const cacheKey = req.originalUrl;\n    const data = await client.get(cacheKey);\n    if (data) {\n        return res.json(JSON.parse(data));\n    }\n    next();\n}",
          "explanation": "Express middleware serving cached JSON responses from Redis."
        }
      ],
      "timeComplexity": "O(1) Redis memory cache lookup",
      "spaceComplexity": "O(N) cache memory footprint",
      "keyTakeaways": [
        "Design for stateless web servers to allow easy horizontal auto-scaling."
      ],
      "commonMistakes": [
        "Using single point of failure (SPOF) database instances without read replicas."
      ]
    }
  },
  {
    "topicId": "web-http-rest",
    "chapterId": "web-u1-c1",
    "unitId": "web-dev",
    "subjectId": "web-dev",
    "topicNumber": 1,
    "title": "HTTP Protocol, REST APIs & Full Stack Architecture",
    "estimatedMinutes": 25,
    "difficulty": "Beginner",
    "summary": "HTTP methods (GET, POST, PUT, DELETE), status codes, REST architectural constraints, and CORS.",
    "subtopics": [
      "HTTP Request/Response Lifecycle",
      "RESTful Resource Paths",
      "HTTP Status Codes",
      "CORS Headers"
    ],
    "content": {
      "introduction": "REST (Representational State Transfer) is the standard architectural style for client-server web API communications.",
      "concepts": [
        "Stateless Communications: Every request contains all context needed to execute.",
        "CRUD Mappings: GET (Read), POST (Create), PUT (Update), DELETE (Remove)."
      ],
      "importantPoints": [
        "HTTP status codes 2xx indicate success, 4xx client errors, 5xx server errors."
      ],
      "examples": [
        "RESTful API endpoint `GET /api/v1/users/123` returning JSON user payload."
      ],
      "algorithmSteps": [
        "1. Client sends HTTP request.",
        "2. Server parses URL route & headers.",
        "3. Controller queries database.",
        "4. Server returns HTTP response."
      ],
      "codeSnippets": [
        {
          "language": "javascript",
          "title": "Express.js REST Controller",
          "code": "const express = require('express');\nconst app = express();\n\napp.get('/api/users/:id', async (req, res) => {\n    const user = await User.findById(req.params.id);\n    if (!user) return res.status(404).json({ message: \"User not found\" });\n    res.json(user);\n});",
          "explanation": "Express RESTful GET endpoint returning JSON response."
        }
      ],
      "timeComplexity": "O(1) route parsing overhead",
      "spaceComplexity": "O(R) response payload buffer space",
      "keyTakeaways": [
        "Always use nouns for REST resource endpoints, not verbs."
      ],
      "commonMistakes": [
        "Returning HTTP 200 OK status for server failure responses."
      ]
    }
  },
  {
    "topicId": "quantitative-aptitude-reasoning",
    "chapterId": "apt-u1-c1",
    "unitId": "aptitude",
    "subjectId": "aptitude",
    "topicNumber": 1,
    "title": "Quantitative Reasoning: Time, Speed, Distance & Work",
    "estimatedMinutes": 20,
    "difficulty": "Beginner",
    "summary": "Speed-distance-time formulas, relative speed, train problems, and time-and-work efficiency ratios.",
    "subtopics": [
      "Speed = Distance / Time",
      "Relative Speed Same/Opposite Direction",
      "Work = Rate * Time",
      "Pipes & Cisterns"
    ],
    "content": {
      "introduction": "Quantitative aptitude evaluates numerical problem-solving efficiency required during Round 1 placement assessments.",
      "concepts": [
        "Speed = Distance / Time.",
        "Relative Speed: Add speeds when objects move in opposite directions; subtract when moving in same direction."
      ],
      "importantPoints": [
        "Convert km/h to m/s by multiplying with (5/18)."
      ],
      "examples": [
        "Two trains 150m and 200m long moving in opposite directions at 54 km/h and 36 km/h."
      ],
      "algorithmSteps": [
        "1. Convert units to SI (m/s).",
        "2. Calculate total distance = length1 + length2.",
        "3. Calculate relative speed = speed1 + speed2.",
        "4. Time = Distance / Relative Speed."
      ],
      "codeSnippets": [
        {
          "language": "python",
          "title": "Python Relative Speed Calculator",
          "code": "def time_to_cross(l1, l2, s1_kmh, s2_kmh):\n    total_dist = l1 + l2 # meters\n    rel_speed_ms = (s1_kmh + s2_kmh) * (5 / 18) # m/s\n    return total_dist / rel_speed_ms\n\nprint(\"Cross time:\", time_to_cross(150, 200, 54, 36), \"seconds\")",
          "explanation": "Calculates time taken for two trains to cross each other."
        }
      ],
      "timeComplexity": "O(1) formula calculation",
      "spaceComplexity": "O(1) auxiliary space",
      "keyTakeaways": [
        "Always double check unit consistency (meters vs kilometers, seconds vs hours)."
      ],
      "commonMistakes": [
        "Subtracting speeds when moving in opposite directions instead of adding."
      ]
    }
  },
  {
    "topicId": "instruction-set-architecture",
    "chapterId": "coa-u1-c1",
    "unitId": "coa",
    "subjectId": "coa",
    "topicNumber": 1,
    "title": "Instruction Set Architecture & Von Neumann Model",
    "estimatedMinutes": 25,
    "difficulty": "Beginner",
    "summary": "Von Neumann architecture, fetch-decode-execute cycle, registers, memory bus, and CISC vs RISC processors.",
    "subtopics": [
      "Von Neumann Architecture",
      "Fetch-Decode-Execute Cycle",
      "RISC vs CISC",
      "ALU & Registers"
    ],
    "content": {
      "introduction": "Computer Organization defines the hardware implementation of the Instruction Set Architecture (ISA).",
      "concepts": [
        "Von Neumann Model: Shared memory storing both data and program instructions.",
        "Fetch-Decode-Execute Cycle: CPU reads instruction from memory (PC), decodes opcode, and executes in ALU."
      ],
      "importantPoints": [
        "Von Neumann bottleneck occurs due to shared bus for data and instructions."
      ],
      "examples": [
        "MIPS 32-bit R-type instruction execution in ALU."
      ],
      "algorithmSteps": [
        "1. Fetch instruction from address in Program Counter (PC).",
        "2. Increment PC.",
        "3. Decode instruction opcode.",
        "4. Execute in ALU."
      ],
      "codeSnippets": [
        {
          "language": "cpp",
          "title": "C++ CPU Fetch-Execute Simulation",
          "code": "struct CPU {\n    int PC = 0;\n    int registers[8] = {0};\n    void step(int instruction) {\n        int opcode = (instruction >> 12) & 0xF;\n        int reg1 = (instruction >> 8) & 0xF;\n        int reg2 = instruction & 0xFF;\n        if (opcode == 1) registers[reg1] += reg2; // ADD\n        PC++;\n    }\n};",
          "explanation": "Basic simulation of CPU instruction fetch-decode-execute step."
        }
      ],
      "timeComplexity": "O(1) clock cycle step per instruction pipeline stage",
      "spaceComplexity": "O(R) register file memory",
      "keyTakeaways": [
        "Pipelining improves CPU instruction throughput by overlapping execution stages."
      ],
      "commonMistakes": [
        "Confusing RISC simple single-cycle instructions with CISC complex instructions."
      ]
    }
  },
  {
    "topicId": "sdlc-agile-scrum",
    "chapterId": "se-u1-c1",
    "unitId": "se",
    "subjectId": "software-engineering",
    "topicNumber": 1,
    "title": "Software Development Life Cycle (SDLC) & Agile Scrum",
    "estimatedMinutes": 20,
    "difficulty": "Beginner",
    "summary": "Waterfall vs Agile methodology, Scrum roles (Product Owner, Scrum Master, Team), Sprints, and User Stories.",
    "subtopics": [
      "SDLC Phases",
      "Agile Manifesto Values",
      "Scrum Roles & Ceremonies",
      "Sprint Backlog"
    ],
    "content": {
      "introduction": "Software Engineering applies structured processes to design, develop, test, and maintain large-scale software systems.",
      "concepts": [
        "Waterfall Model: Sequential phases (Requirements -> Design -> Implementation -> Verification -> Maintenance).",
        "Agile Methodology: Iterative development delivering working software increments in 2-4 week Sprints."
      ],
      "importantPoints": [
        "Agile prioritizes responding to change over following a rigid plan."
      ],
      "examples": [
        "Planning a 2-week Sprint backlog for LearnX feature release."
      ],
      "algorithmSteps": [
        "1. Backlog Grooming.",
        "2. Sprint Planning.",
        "3. Daily Standup (15 min).",
        "4. Sprint Review & Retrospective."
      ],
      "codeSnippets": [
        {
          "language": "python",
          "title": "Python User Story Velocity Calculator",
          "code": "def calculate_sprint_velocity(completed_story_points):\n    return sum(completed_story_points) / len(completed_story_points)\n\npoints = [24, 30, 28, 32]\nprint(\"Average Velocity:\", calculate_sprint_velocity(points), \"points/sprint\")",
          "explanation": "Calculates average team velocity across past Agile sprints."
        }
      ],
      "timeComplexity": "O(1) velocity computation",
      "spaceComplexity": "O(1) memory overhead",
      "keyTakeaways": [
        "Daily Standups focus on: what I did yesterday, what I will do today, and any blockers."
      ],
      "commonMistakes": [
        "Treating Sprints as mini-waterfall phases within a 2-week cycle."
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
      "Classful vs Classless Inter-Domain Routing (CIDR)",
      "Subnet Mask Binary Math & Bitwise ANDing",
      "Calculating Usable Hosts (2^(32-n) - 2)",
      "Network Address vs Directed Broadcast Address",
      "IPv6 128-bit Hexadecimal Addressing & Transition"
    ],
    "content": {
      "introduction": "IP Subnetting is the fundamental networking process of partitioning a single physical network into multiple logical sub-networks (subnets). By segmenting address spaces, organizations minimize broadcast domain traffic, enforce security boundaries between departments, and dramatically optimize IP address utilization.",
      "concepts": [
        "CIDR (Classless Inter-Domain Routing): Deprecates rigid Class A/B/C addressing by using flexible prefix lengths (e.g., 192.168.1.0/26 means 26 bits are dedicated to the Network ID, leaving 6 bits for Host IDs).",
        "Network ID Determination: Computed by performing a bitwise AND operation between the 32-bit IP Address and the 32-bit Subnet Mask.",
        "Total vs Usable Hosts: A subnet with `h` host bits has `2^h` total addresses. The first address (all host bits 0) is reserved as the Network ID, and the last address (all host bits 1) is reserved as the Directed Broadcast Address. Therefore, usable hosts = `2^h - 2`.",
        "Subnetting vs Supernetting (Route Aggregation): Subnetting divides large address blocks into smaller subnets; Supernetting aggregates multiple contiguous small subnets into a single routing table entry to reduce router memory overhead.",
        "IPv6 Advantages: Expands address space from 32-bit (4.3 billion addresses) to 128-bit (3.4 × 10^38 addresses), eliminating the strict requirement for NAT (Network Address Translation) and incorporating IPSec security by default."
      ],
      "importantPoints": [
        "A /24 subnet has 256 total IP addresses, but only 254 usable host addresses.",
        "A /30 subnet has 4 total IP addresses, providing exactly 2 usable host addresses — ideal for point-to-point router serial links.",
        "Private IP ranges (RFC 1918): 10.0.0.0/8 (Class A), 172.16.0.0/12 (Class B), 192.168.0.0/16 (Class C)."
      ],
      "examples": [
        "Example 1: Given IP `192.168.10.75/26`.\n• Subnet mask: `255.255.255.192` (26 ones, 6 zeros).\n• Host bits `h = 32 - 26 = 6`.\n• Total addresses per subnet = `2^6 = 64`.\n• Usable hosts = `64 - 2 = 62`.\n• Subnet boundaries: `192.168.10.0–63`, `192.168.10.64–127`, `192.168.10.128–191`, `192.168.10.192–255`.\n• For IP `192.168.10.75`: Network ID = `192.168.10.64`, First usable = `192.168.10.65`, Last usable = `192.168.10.126`, Broadcast = `192.168.10.127`.",
        "Example 2: A company needs 4 departments with 25 computers each. Starting from `192.168.1.0/24`, allocate `/27` subnets (`2^5 - 2 = 30` usable hosts per department)."
      ],
      "algorithmSteps": [
        "1. Identify required host count `H` per department.",
        "2. Find smallest integer `h` such that `2^h - 2 >= H`.",
        "3. Compute new prefix length: `prefix = 32 - h`.",
        "4. Calculate Block Size (magic number) = `2^h` (or `256 - interesting_octet_mask`).",
        "5. List subnets by incrementing network ID in multiples of Block Size from 0.",
        "6. Assign first host = `Network ID + 1`, last host = `Broadcast ID - 1`, Broadcast = `Next Network ID - 1`."
      ],
      "codeSnippets": [
        {
          "language": "python",
          "title": "Python IPv4 Subnet & Usable Host Calculator",
          "code": "import ipaddress\n\ndef calculate_subnet_details(cidr_str: str):\n    network = ipaddress.IPv4Network(cidr_str, strict=False)\n    \n    print(f\"Network ID:        {network.network_address}\")\n    print(f\"Netmask:           {network.netmask}\")\n    print(f\"Broadcast ID:      {network.broadcast_address}\")\n    print(f\"Total Addresses:   {network.num_addresses}\")\n    print(f\"Usable Hosts:      {network.num_addresses - 2 if network.prefixlen < 31 else network.num_addresses}\")\n    print(f\"First Usable Host: {network.network_address + 1}\")\n    print(f\"Last Usable Host:  {network.broadcast_address - 1}\")\n\n# Example: 192.168.10.75 with /26 prefix\ncalculate_subnet_details(\"192.168.10.75/26\")",
          "explanation": "Utilizes Python standard ipaddress library to compute network boundaries, host ranges, and broadcast addresses."
        },
        {
          "language": "javascript",
          "title": "JavaScript Bitwise Subnet Mask Calculator",
          "code": "function getSubnetInfo(ipStr, cidrPrefix) {\n  const ipParts = ipStr.split(\".\").map(Number);\n  const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];\n  \n  const maskNum = cidrPrefix === 0 ? 0 : (~0 << (32 - cidrPrefix));\n  const netNum = (ipNum & maskNum) >>> 0;\n  const broadcastNum = (netNum | (~maskNum >>> 0)) >>> 0;\n  \n  const numToIp = (num) => [\n    (num >>> 24) & 255,\n    (num >>> 16) & 255,\n    (num >>> 8) & 255,\n    num & 255\n  ].join(\".\");\n\n  const hostBits = 32 - cidrPrefix;\n  const totalHosts = Math.pow(2, hostBits);\n  const usableHosts = hostBits >= 2 ? totalHosts - 2 : 0;\n\n  return {\n    networkId: numToIp(netNum),\n    broadcastId: numToIp(broadcastNum),\n    netmask: numToIp(maskNum >>> 0),\n    totalHosts,\n    usableHosts\n  };\n}\n\nconsole.log(getSubnetInfo(\"192.168.10.75\", 26));",
          "explanation": "Performs bitwise AND and shift arithmetic to derive network address and broadcast address in Node.js/JS."
        },
        {
          "language": "cpp",
          "title": "C++ Bitwise Network ID Calculation",
          "code": "#include <iostream>\n#include <string>\n#include <cstdint>\n\nuint32_t ipToUint(uint8_t a, uint8_t b, uint8_t c, uint8_t d) {\n    return (a << 24) | (b << 16) | (c << 8) | d;\n}\n\nvoid printIp(uint32_t ip) {\n    std::cout << ((ip >> 24) & 0xFF) << \".\"\n              << ((ip >> 16) & 0xFF) << \".\"\n              << ((ip >> 8) & 0xFF) << \".\"\n              << (ip & 0xFF) << \"\\n\";\n}\n\nint main() {\n    uint32_t ip = ipToUint(192, 168, 10, 75);\n    int prefix = 26;\n    uint32_t mask = (~0U) << (32 - prefix);\n    uint32_t networkId = ip & mask;\n    uint32_t broadcastId = networkId | (~mask);\n\n    std::cout << \"Network ID:   \"; printIp(networkId);\n    std::cout << \"Broadcast ID: \"; printIp(broadcastId);\n    return 0;\n}",
          "explanation": "High-performance C++ bitwise IP manipulation using 32-bit unsigned integers."
        }
      ],
      "timeComplexity": "O(1) bitwise ALU operations",
      "spaceComplexity": "O(1) register allocation",
      "keyTakeaways": [
        "Usable hosts formula is always 2^(32 - prefix) - 2.",
        "Always subtract 2 for the Network address and Broadcast address.",
        "CIDR allows variable length subnet masking (VLSM) for flexible network engineering."
      ],
      "commonMistakes": [
        "Assigning the Network ID or Broadcast address to a physical computer host interface.",
        "Assuming all subnets must be equal size (VLSM allows subnets of varying prefix lengths like /24, /27, and /30 in the same network)."
      ]
    }
  }
];
