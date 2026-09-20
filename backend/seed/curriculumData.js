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
    subjectId: "dsa",
    name: "Data Structures & Algorithms",
    code: "CS201",
    description: "Master computational problem-solving, asymptotic complexity, foundational data structures, tree algorithms, and dynamic programming.",
    icon: "⚡",
    badge: "Core CSE",
    color: "from-blue-600 to-indigo-600",
    accentColor: "#3b82f6",
    order: 1,
  },
  {
    subjectId: "dbms",
    name: "Database Management Systems",
    code: "CS202",
    description: "Relational modeling, SQL mastery, normalization up to BCNF, ACID concurrency control, transactions, and indexing structures.",
    icon: "🗄️",
    badge: "Core CSE",
    color: "from-emerald-600 to-teal-600",
    accentColor: "#10b981",
    order: 2,
  },
  {
    subjectId: "os",
    name: "Operating Systems",
    code: "CS203",
    description: "Process lifecycle, thread concurrency, CPU scheduling algorithms, deadlock prevention, virtual memory paging, and file systems.",
    icon: "💻",
    badge: "Core CSE",
    color: "from-violet-600 to-purple-600",
    accentColor: "#8b5cf6",
    order: 3,
  },
  {
    subjectId: "cn",
    name: "Computer Networks",
    code: "CS204",
    description: "Layered architectures, TCP 3-way handshakes, reliable data transfer, IP subnetting CIDR, routing protocols, and HTTP/DNS.",
    icon: "🌐",
    badge: "Core CSE",
    color: "from-sky-600 to-blue-600",
    accentColor: "#0284c7",
    order: 4,
  },
  {
    subjectId: "oops",
    name: "Object-Oriented Programming",
    code: "CS205",
    description: "Encapsulation, Polymorphism, Inheritance, Abstraction, SOLID design principles, and enterprise design patterns.",
    icon: "🧩",
    badge: "Software Eng",
    color: "from-amber-600 to-orange-600",
    accentColor: "#f59e0b",
    order: 5,
  },
  {
    subjectId: "system-design",
    name: "System Design & Architecture",
    code: "CS301",
    description: "High-level distributed systems design, load balancing, caching tiers, CAP theorem, database sharding, and message queues.",
    icon: "🏗️",
    badge: "Advanced Tech",
    color: "from-rose-600 to-pink-600",
    accentColor: "#e11d48",
    order: 6,
  },
  {
    subjectId: "web-dev",
    name: "Full Stack Web Development",
    code: "CS302",
    description: "Modern JavaScript (ES6+), DOM lifecycle, asynchronous promises, React hooks, REST APIs, and authentication flows.",
    icon: "⚛️",
    badge: "Practical Eng",
    color: "from-cyan-600 to-blue-600",
    accentColor: "#06b6d4",
    order: 7,
  },
  {
    subjectId: "aptitude",
    name: "Aptitude & Logical Reasoning",
    code: "CS101",
    description: "Quantitative mathematics, probability, permutations, logical reasoning, and data interpretation for technical campus placements.",
    icon: "🎯",
    badge: "Placement Prep",
    color: "from-green-600 to-emerald-600",
    accentColor: "#059669",
    order: 8,
  },
];

export const CURRICULUM_UNITS = [
  // ─── DSA UNITS ─────────────────────────────────────────────────────────────
  {
    unitId: "dsa-u1",
    subjectId: "dsa",
    unitNumber: 1,
    title: "Unit 1 — Algorithmic Foundations & Complexity",
    description: "Big-O, Omega, Theta notations, recurrence relations, and space-time trade-offs.",
    order: 1,
  },
  {
    unitId: "dsa-u2",
    subjectId: "dsa",
    unitNumber: 2,
    title: "Unit 2 — Searching & Sorting Mastery",
    description: "Divide-and-conquer algorithms, comparison sorts, binary search variants, and partitioning mechanics.",
    order: 2,
  },
  {
    unitId: "dsa-u3",
    subjectId: "dsa",
    unitNumber: 3,
    title: "Unit 3 — Linear Data Structures & Dynamic Arrays",
    description: "Singly, doubly, and circular linked lists, stacks, monotonic queues, and amortized array resizing.",
    order: 3,
  },
  {
    unitId: "dsa-u4",
    subjectId: "dsa",
    unitNumber: 4,
    title: "Unit 4 — Non-Linear Data Structures & Trees",
    description: "Binary search trees, AVL self-balancing rotations, heaps, priority queues, and graph traversals.",
    order: 4,
  },

  // ─── DBMS UNITS ────────────────────────────────────────────────────────────
  {
    unitId: "dbms-u1",
    subjectId: "dbms",
    unitNumber: 1,
    title: "Unit 1 — Relational Model & SQL Querying",
    description: "Schema architecture, entity relationship modeling, relational algebra, and complex SQL joins.",
    order: 1,
  },
  {
    unitId: "dbms-u2",
    subjectId: "dbms",
    unitNumber: 2,
    title: "Unit 2 — Database Normalization & Schema Design",
    description: "Functional dependencies, 1NF, 2NF, 3NF, BCNF lossless decomposition, and dependency preservation.",
    order: 2,
  },
  {
    unitId: "dbms-u3",
    subjectId: "dbms",
    unitNumber: 3,
    title: "Unit 3 — Transactions & Concurrency Control",
    description: "ACID properties, serializability, 2-phase locking (2PL), deadlock prevention, and isolation levels.",
    order: 3,
  },

  // ─── OS UNITS ──────────────────────────────────────────────────────────────
  {
    unitId: "os-u1",
    subjectId: "os",
    unitNumber: 1,
    title: "Unit 1 — Process Management & CPU Scheduling",
    description: "Process Control Block (PCB), context switching, preemptive scheduling (FCFS, SJF, Round Robin), and multithreading.",
    order: 1,
  },
  {
    unitId: "os-u2",
    subjectId: "os",
    unitNumber: 2,
    title: "Unit 2 — Process Synchronization & Deadlocks",
    description: "Critical section problem, mutexes, semaphores, Banker's algorithm, and resource allocation graphs.",
    order: 2,
  },
  {
    unitId: "os-u3",
    subjectId: "os",
    unitNumber: 3,
    title: "Unit 3 — Memory Management & Virtual Memory",
    description: "Paging, translation lookaside buffers (TLB), segmentation, page fault handling, and page replacement algorithms.",
    order: 3,
  },

  // ─── COMPUTER NETWORKS UNITS ───────────────────────────────────────────────
  {
    unitId: "cn-u1",
    subjectId: "cn",
    unitNumber: 1,
    title: "Unit 1 — Layered Network Architecture",
    description: "OSI 7-layer reference model, TCP/IP protocol suite, packet encapsulation, and transmission media.",
    order: 1,
  },
  {
    unitId: "cn-u2",
    subjectId: "cn",
    unitNumber: 2,
    title: "Unit 2 — Network Layer & IP Addressing",
    description: "IPv4/IPv6 addressing, CIDR subnetting, ARP, ICMP, Dijkstra link-state, and Distance Vector routing.",
    order: 2,
  },
  {
    unitId: "cn-u3",
    subjectId: "cn",
    unitNumber: 3,
    title: "Unit 3 — Transport Layer & Reliable Delivery",
    description: "TCP 3-way handshake, 4-way termination, sliding window flow control, congestion control, and UDP.",
    order: 3,
  },

  // ─── OOPS UNITS ────────────────────────────────────────────────────────────
  {
    unitId: "oops-u1",
    subjectId: "oops",
    unitNumber: 1,
    title: "Unit 1 — The 4 Core OOP Pillars",
    description: "Encapsulation, Data Abstraction, Inheritance hierarchies, and Static/Dynamic Polymorphism.",
    order: 1,
  },
  {
    unitId: "oops-u2",
    subjectId: "oops",
    unitNumber: 2,
    title: "Unit 2 — SOLID Design Principles",
    description: "Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.",
    order: 2,
  },

  // ─── SYSTEM DESIGN UNITS ───────────────────────────────────────────────────
  {
    unitId: "sd-u1",
    subjectId: "system-design",
    unitNumber: 1,
    title: "Unit 1 — Scalability & High Availability",
    description: "Horizontal vs vertical scaling, load balancers, reverse proxies, and consistent hashing.",
    order: 1,
  },

  // ─── WEB DEV UNITS ─────────────────────────────────────────────────────────
  {
    unitId: "web-u1",
    subjectId: "web-dev",
    unitNumber: 1,
    title: "Unit 1 — Modern JavaScript & React Foundations",
    description: "Event loop, asynchronous promises, React component lifecycle, virtual DOM, and custom hooks.",
    order: 1,
  },

  // ─── APTITUDE UNITS ────────────────────────────────────────────────────────
  {
    unitId: "apt-u1",
    subjectId: "aptitude",
    unitNumber: 1,
    title: "Unit 1 — Quantitative & Placement Aptitude",
    description: "Speed math, percentages, profit & loss, time and work, permutations, and probability shortcuts.",
    order: 1,
  },
];

export const CURRICULUM_CHAPTERS = [
  // ─── DSA CHAPTERS ──────────────────────────────────────────────────────────
  {
    chapterId: "dsa-u1-c1",
    unitId: "dsa-u1",
    subjectId: "dsa",
    chapterNumber: 1,
    title: "Asymptotic Analysis & Recurrence Relations",
    description: "Mathematical models for program performance.",
    order: 1,
  },
  {
    chapterId: "dsa-u2-c1",
    unitId: "dsa-u2",
    subjectId: "dsa",
    chapterNumber: 1,
    title: "Searching Algorithms",
    description: "Sequential and logarithmic lookup techniques.",
    order: 1,
  },
  {
    chapterId: "dsa-u2-c2",
    unitId: "dsa-u2",
    subjectId: "dsa",
    chapterNumber: 2,
    title: "Comparison & Non-Comparison Sorting",
    description: "Divide-and-conquer sorting, in-place partitions, and stability analysis.",
    order: 2,
  },
  {
    chapterId: "dsa-u3-c1",
    unitId: "dsa-u3",
    subjectId: "dsa",
    chapterNumber: 1,
    title: "Linked Lists & Memory Management",
    description: "Node structures, pointer manipulation, and cycle detection.",
    order: 1,
  },
  {
    chapterId: "dsa-u4-c1",
    unitId: "dsa-u4",
    subjectId: "dsa",
    chapterNumber: 1,
    title: "Binary Trees & Self-Balancing Structures",
    description: "Tree traversals, binary search tree operations, and AVL rotations.",
    order: 1,
  },

  // ─── DBMS CHAPTERS ─────────────────────────────────────────────────────────
  {
    chapterId: "dbms-u1-c1",
    unitId: "dbms-u1",
    subjectId: "dbms",
    chapterNumber: 1,
    title: "Relational Querying & Joins",
    description: "Inner, Outer, Cross Joins, Subqueries, and Aggregate functions.",
    order: 1,
  },
  {
    chapterId: "dbms-u2-c1",
    unitId: "dbms-u2",
    subjectId: "dbms",
    chapterNumber: 1,
    title: "Normalization Forms (1NF to BCNF)",
    description: "Eliminating update anomalies and redundancy.",
    order: 1,
  },
  {
    chapterId: "dbms-u3-c1",
    unitId: "dbms-u3",
    subjectId: "dbms",
    chapterNumber: 1,
    title: "Transaction ACID & Locking Protocols",
    description: "Concurrency anomalies and serializability guarantees.",
    order: 1,
  },

  // ─── OS CHAPTERS ───────────────────────────────────────────────────────────
  {
    chapterId: "os-u1-c1",
    unitId: "os-u1",
    subjectId: "os",
    chapterNumber: 1,
    title: "CPU Scheduling Mechanisms",
    description: "Gantt charts, turnaround time, waiting time, and starvation avoidance.",
    order: 1,
  },
  {
    chapterId: "os-u2-c1",
    unitId: "os-u2",
    subjectId: "os",
    chapterNumber: 1,
    title: "Concurrency Synchronization & Deadlocks",
    description: "Mutexes, counting semaphores, and Banker's algorithm safe sequences.",
    order: 1,
  },
  {
    chapterId: "os-u3-c1",
    unitId: "os-u3",
    subjectId: "os",
    chapterNumber: 1,
    title: "Virtual Memory & Paging Replacement",
    description: "Page fault handling, FIFO, LRU, Optimal page replacement, and Belady's anomaly.",
    order: 1,
  },

  // ─── CN CHAPTERS ───────────────────────────────────────────────────────────
  {
    chapterId: "cn-u1-c1",
    unitId: "cn-u1",
    subjectId: "cn",
    chapterNumber: 1,
    title: "OSI vs TCP/IP Models",
    description: "Protocol data units, encapsulation, and layer responsibilities.",
    order: 1,
  },
  {
    chapterId: "cn-u2-c1",
    unitId: "cn-u2",
    subjectId: "cn",
    chapterNumber: 1,
    title: "IP Subnetting & CIDR",
    description: "Subnet masks, broadcast addresses, usable hosts, and classless addressing.",
    order: 1,
  },
  {
    chapterId: "cn-u3-c1",
    unitId: "cn-u3",
    subjectId: "cn",
    chapterNumber: 1,
    title: "TCP Mechanics & Connection Handshakes",
    description: "SYN-ACK handshake, sequence numbers, window sizing, and teardown states.",
    order: 1,
  },

  // ─── OOPS CHAPTERS ─────────────────────────────────────────────────────────
  {
    chapterId: "oops-u1-c1",
    unitId: "oops-u1",
    subjectId: "oops",
    chapterNumber: 1,
    title: "Core Pillars & Runtime Polymorphism",
    description: "Virtual tables, function overriding, dynamic dispatch, and interface design.",
    order: 1,
  },
  {
    chapterId: "oops-u2-c1",
    unitId: "oops-u2",
    subjectId: "oops",
    chapterNumber: 1,
    title: "SOLID Principles in Practice",
    description: "Clean code design patterns and decoupled architectural patterns.",
    order: 1,
  },

  // ─── SYSTEM DESIGN CHAPTERS ────────────────────────────────────────────────
  {
    chapterId: "sd-u1-c1",
    unitId: "sd-u1",
    subjectId: "system-design",
    chapterNumber: 1,
    title: "Load Balancing & Caching Architectures",
    description: "L4 vs L7 load balancing, Redis caching strategies, and CDN edge caching.",
    order: 1,
  },

  // ─── WEB DEV CHAPTERS ──────────────────────────────────────────────────────
  {
    chapterId: "web-u1-c1",
    unitId: "web-u1",
    subjectId: "web-dev",
    chapterNumber: 1,
    title: "Asynchronous JavaScript & React Hooks",
    description: "Promises, async/await, closures, useState, useEffect, and custom hook patterns.",
    order: 1,
  },

  // ─── APTITUDE CHAPTERS ─────────────────────────────────────────────────────
  {
    chapterId: "apt-u1-c1",
    unitId: "apt-u1",
    subjectId: "aptitude",
    chapterNumber: 1,
    title: "Probability, Permutations & Speed Math",
    description: "Combinatorics, Bayes' theorem, relative speed, and work efficiency.",
    order: 1,
  },
];

export const CURRICULUM_TOPICS = [
  // ───────────────────────────────────────────────────────────────────────────
  // DSA TOPICS
  // ───────────────────────────────────────────────────────────────────────────
  {
    topicId: "binary-search",
    chapterId: "dsa-u2-c1",
    unitId: "dsa-u2",
    subjectId: "dsa",
    topicNumber: 1,
    title: "Binary Search & Search Space Reduction",
    estimatedMinutes: 20,
    difficulty: "Beginner",
    summary: "Logarithmic time lookup algorithm for monotonically sorted sequences and monotonic predicate functions.",
    subtopics: ["Divide and Conquer Strategy", "Midpoint Overflow Prevention", "Lower & Upper Bound Variants", "Time & Space Complexity"],
    content: {
      introduction: "Binary Search is one of the most fundamental divide-and-conquer algorithms in computer science. Operating strictly on sorted sequences, it divides the search space in half with every single comparison, achieving optimal O(log N) query time.",
      concepts: [
        "Monotonic Search Space: The sequence must be sorted or exhibit a monotonic boolean predicate (e.g. false, false, true, true).",
        "Midpoint Calculation: Using `low + (high - low) / 2` avoids 32-bit integer arithmetic overflow encountered in `(low + high) / 2`.",
        "Invariant Maintenance: Ensuring that the target element always remains strictly within the bounds `[low, high]`.",
        "Boundary Variants: Finding exact index vs finding Lower Bound (first element >= key) and Upper Bound (first element > key)."
      ],
      importantPoints: [
        "Binary search reduces 1,000,000 items to just ~20 comparisons (2^20 ≈ 1,048,576).",
        "Array must be random-access O(1); applying binary search directly on a standard Singly Linked List yields O(N) due to sequential node traversal.",
        "Infinite loop bugs typically occur when `low <= high` and `low = mid` without `+ 1`."
      ],
      examples: [
        "Find index of key = 23 in sorted array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91].",
        "Finding the peak element in a mountain array using binary search.",
        "Finding the square root of an integer N to integer precision in O(log N) time."
      ],
      algorithmSteps: [
        "1. Initialize two pointer indices: `low = 0`, `high = array.length - 1`.",
        "2. While `low <= high`:",
        "   a. Compute safe midpoint `mid = low + Math.floor((high - low) / 2)`.",
        "   b. If `array[mid] === target`, return `mid`.",
        "   c. If `array[mid] < target`, discard left half: set `low = mid + 1`.",
        "   d. If `array[mid] > target`, discard right half: set `high = mid - 1`.",
        "3. If loop terminates without match, return `-1` (element not present)."
      ],
      codeSnippets: [
        {
          language: "cpp",
          title: "C++ Iterative Binary Search",
          code: `#include <vector>
#include <iostream>

int binarySearch(const std::vector<int>& arr, int target) {
    int low = 0, high = static_cast<int>(arr.size()) - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2; // Prevents integer overflow
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // Target not found
}`,
          explanation: "Standard C++ implementation using vector references and safe midpoint calculation."
        },
        {
          language: "java",
          title: "Java Binary Search Implementation",
          code: `public class BinarySearch {
    public static int search(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }
}`,
          explanation: "Thread-safe static method implementation conforming to Java standard library semantics."
        },
        {
          language: "python",
          title: "Pythonic Binary Search",
          code: `def binary_search(arr: list[int], target: int) -> int:
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
          explanation: "Clean Python type-hinted implementation using integer floor division."
        },
        {
          language: "javascript",
          title: "JavaScript ES6 Binary Search",
          code: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
          explanation: "ES6 implementation compatible with Node.js and modern browser runtimes."
        }
      ],
      timeComplexity: "O(log N) worst/average, O(1) best (element found at initial mid)",
      spaceComplexity: "O(1) auxiliary space (iterative), O(log N) stack space (recursive)",
      keyTakeaways: [
        "Binary search cuts the problem size in half on every step: T(N) = T(N/2) + O(1).",
        "Always guard against integer overflow in languages with fixed-size integers by computing `mid = low + (high - low) / 2`.",
        "Can be generalized to search spaces of arbitrary predicate functions ('Binary Search on Answer')."
      ],
      commonMistakes: [
        "Using `(low + high) / 2` leading to 32-bit integer overflow when `low + high > 2,147,483,647`.",
        "Setting `low = mid` or `high = mid` inside the loop causing infinite loops when `high - low === 1`.",
        "Attempting binary search on unsorted arrays without prior sorting."
      ],
      relatedTopics: ["Linear Search", "Binary Search Trees", "Ternary Search", "Divide and Conquer"]
    }
  },
  {
    topicId: "quick-sort",
    chapterId: "dsa-u2-c2",
    unitId: "dsa-u2",
    subjectId: "dsa",
    topicNumber: 2,
    title: "Quick Sort & Partitioning Algorithms",
    estimatedMinutes: 25,
    difficulty: "Intermediate",
    summary: "In-place divide-and-conquer sorting algorithm based on Lomuto or Hoare partitioning around a chosen pivot.",
    subtopics: ["Pivot Selection Strategies", "Lomuto Partition Scheme", "Hoare Partition Scheme", "Worst-case Quadratic Degradation", "Tail Call Optimization"],
    content: {
      introduction: "Quick Sort is a highly practical, in-place, divide-and-conquer comparison sort developed by Tony Hoare. In practice, it outperforms Merge Sort and Heap Sort due to superior CPU cache locality, though it requires randomized pivot selection to avoid worst-case O(N^2) complexity.",
      concepts: [
        "Divide and Conquer: Select a pivot element, partition the array so all elements smaller than pivot precede it, and recursively sort subarrays.",
        "Lomuto Partitioning: Simpler to implement; uses one scanning pointer and one slow pointer, placing pivot at array end.",
        "Hoare Partitioning: More efficient than Lomuto (performs roughly 3x fewer swaps); uses two pointers moving towards each other from both ends.",
        "Worst-case O(N^2) Trigger: Occurs when pivot is consistently the minimum or maximum element (e.g., sorting an already-sorted array with first/last element as pivot)."
      ],
      importantPoints: [
        "Quick Sort is an in-place sort: auxiliary memory is O(log N) for the recursion call stack.",
        "Quick Sort is UNSTABLE by default (equal keys can have their relative order swapped during partitioning).",
        "C++ `std::sort` and Java `Arrays.sort(primitive[])` use Dual-Pivot QuickSort / Introsort (hybrid of QuickSort, HeapSort, and InsertionSort)."
      ],
      examples: [
        "Partitioning array [10, 80, 30, 90, 40, 50, 70] with pivot = 70.",
        "Median of Three pivot selection: choosing median of arr[low], arr[mid], arr[high] to prevent quadratic degradation."
      ],
      algorithmSteps: [
        "1. Choose a pivot element `P` from array `arr[low..high]`.",
        "2. Partition `arr` around `P` such that all elements `< P` are placed to its left, and elements `> P` are to its right.",
        "3. Let `pIndex` be the final index of pivot `P`.",
        "4. Recursively call `quickSort(arr, low, pIndex - 1)`.",
        "5. Recursively call `quickSort(arr, pIndex + 1, high)`."
      ],
      codeSnippets: [
        {
          language: "cpp",
          title: "C++ QuickSort with Lomuto Partition",
          code: `#include <vector>
#include <algorithm>

int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; ++j) {
        if (arr[j] <= pivot) {
            ++i;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
          explanation: "In-place C++ QuickSort implementing Lomuto partitioning."
        },
        {
          language: "java",
          title: "Java QuickSort Implementation",
          code: `public class QuickSort {
    public static void sort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }
}`,
          explanation: "Java recursive implementation with clear helper partition method."
        },
        {
          language: "python",
          title: "Python In-Place QuickSort",
          code: `def quick_sort(arr: list[int], low: int, high: int) -> None:
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr: list[int], low: int, high: int) -> int:
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
          explanation: "Python in-place recursive sorting utilizing tuple unpacking for swaps."
        }
      ],
      timeComplexity: "O(N log N) average/best, O(N^2) worst case when poorly partitioned",
      spaceComplexity: "O(log N) recursion stack space (worst case O(N) without tail call optimization)",
      keyTakeaways: [
        "QuickSort's inner loop is extremely tight and hardware cache friendly.",
        "Randomizing the pivot selection completely protects against adversarial O(N^2) worst-case inputs.",
        "Unlike MergeSort, QuickSort requires O(1) extra auxiliary array storage."
      ],
      commonMistakes: [
        "Assuming Quick Sort is always O(N log N); without randomization, already-sorted input degenerates to O(N^2).",
        "Believing Quick Sort is stable; partition swaps can alter relative positions of duplicates.",
        "Stack overflow on massive arrays due to lack of tail call elimination."
      ],
      relatedTopics: ["Merge Sort", "Heap Sort", "Introsort", "Divide and Conquer"]
    }
  },
  {
    topicId: "merge-sort",
    chapterId: "dsa-u2-c2",
    unitId: "dsa-u2",
    subjectId: "dsa",
    topicNumber: 3,
    title: "Merge Sort & Stable Sorting Mechanics",
    estimatedMinutes: 20,
    difficulty: "Intermediate",
    summary: "Guaranteed O(N log N) divide-and-conquer sorting algorithm with stable order preservation.",
    subtopics: ["Divide Phase Recurrence", "Merge Two Sorted Arrays", "Inversion Counting", "Stability Properties"],
    content: {
      introduction: "Merge Sort is an archetype of divide-and-conquer design, dividing an array into two equal halves, sorting each recursively, and then merging the sorted halves in linear time. It guarantees O(N log N) time complexity under all conditions.",
      concepts: [
        "Stable Sorting: Elements with identical keys maintain their original relative order after sorting.",
        "Divide Step: Continually split array at midpoint until single-element base cases are reached: T(N) = 2T(N/2) + O(N).",
        "Merge Step: Two-pointer technique comparing front elements of left and right subarrays, copying the smaller to temporary buffer.",
        "External Sorting: Ideal for sorting data that exceeds RAM capacity (e.g. multi-gigabyte disk files) because sequential access patterns match disk hardware."
      ],
      importantPoints: [
        "Merge Sort requires O(N) auxiliary space for the merge buffer when implemented on arrays.",
        "Preferred algorithm for sorting Linked Lists because merge operations require O(1) extra memory with pointer rewiring.",
        "Inversion counting (used in collaborative filtering and ranking) can be computed in O(N log N) alongside the merge routine."
      ],
      examples: [
        "Sorting [38, 27, 43, 3, 9, 82, 10] step-by-step through recursive tree splits.",
        "Counting inversions where arr[i] > arr[j] and i < j."
      ],
      algorithmSteps: [
        "1. If `low >= high`, return (base case).",
        "2. Calculate `mid = low + (high - low) / 2`.",
        "3. Recursively call `mergeSort(arr, low, mid)`.",
        "4. Recursively call `mergeSort(arr, mid + 1, high)`.",
        "5. Merge sorted subarrays `arr[low..mid]` and `arr[mid+1..high]` into temporary array and copy back."
      ],
      codeSnippets: [
        {
          language: "cpp",
          title: "C++ Merge Sort",
          code: `#include <vector>

void merge(std::vector<int>& arr, int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    std::vector<int> L(n1), R(n2);
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(std::vector<int>& arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
          explanation: "Standard stable C++ Merge Sort implementation."
        },
        {
          language: "java",
          title: "Java Merge Sort",
          code: `public class MergeSort {
    public static void sort(int[] arr, int l, int r) {
        if (l < r) {
            int m = l + (r - l) / 2;
            sort(arr, l, m);
            sort(arr, m + 1, r);
            merge(arr, l, m, r);
        }
    }

    private static void merge(int[] arr, int l, int m, int r) {
        int[] temp = new int[r - l + 1];
        int i = l, j = m + 1, k = 0;
        while (i <= m && j <= r) {
            if (arr[i] <= arr[j]) temp[k++] = arr[i++];
            else temp[k++] = arr[j++];
        }
        while (i <= m) temp[k++] = arr[i++];
        while (j <= r) temp[k++] = arr[j++];
        System.arraycopy(temp, 0, arr, l, temp.length);
    }
}`,
          explanation: "Clean Java implementation using System.arraycopy for buffer transfer."
        }
      ],
      timeComplexity: "O(N log N) in all cases (Best, Average, and Worst)",
      spaceComplexity: "O(N) auxiliary space + O(log N) call stack",
      keyTakeaways: [
        "Merge Sort is deterministic: its runtime is strictly O(N log N) regardless of input ordering.",
        "Preserves duplicate order (Stable), making it ideal for multi-column sorting.",
        "Primary choice for linked list sorting and external disk sorting."
      ],
      commonMistakes: [
        "Using `<` instead of `<=` in the merge comparator, accidentally destroying stability.",
        "Reallocating temporary arrays inside the recursive loop instead of using a single preallocated buffer.",
        "Overlooking the O(N) space requirement when comparing against Quick Sort or Heap Sort."
      ],
      relatedTopics: ["Quick Sort", "External Sorting", "Inversion Count", "Linked List Sorting"]
    }
  },

  // ───────────────────────────────────────────────────────────────────────────
  // DBMS TOPICS
  // ───────────────────────────────────────────────────────────────────────────
  {
    topicId: "sql-joins",
    chapterId: "dbms-u1-c1",
    unitId: "dbms-u1",
    subjectId: "dbms",
    topicNumber: 1,
    title: "SQL Joins & Relational Querying",
    estimatedMinutes: 20,
    difficulty: "Beginner",
    summary: "Combining relational tuples across primary and foreign keys using INNER, LEFT, RIGHT, FULL, and CROSS JOIN operations.",
    subtopics: ["INNER JOIN Logic", "LEFT/RIGHT OUTER JOIN", "FULL OUTER JOIN & Cartesian Product", "Self Joins & NULL Handling"],
    content: {
      introduction: "SQL Joins allow relational databases to stitch normalized tables together based on matching primary-foreign key relationships. Understanding join semantics and NULL propagation is vital for writing high-performance database queries.",
      concepts: [
        "INNER JOIN: Returns only rows where matching values exist in both tables.",
        "LEFT OUTER JOIN: Returns all rows from left table, with matched values from right table, or NULL if no match exists.",
        "RIGHT OUTER JOIN: Returns all rows from right table, with matched values from left table, or NULL if no match exists.",
        "FULL OUTER JOIN: Returns all rows from both tables, filling missing matches with NULLs.",
        "CROSS JOIN (Cartesian Product): Pairs every row in table A with every row in table B (size = |A| * |B|)."
      ],
      importantPoints: [
        "Joins on indexed columns use Hash Join or Nested Loop Index Scan, yielding fast execution.",
        "Filtering in the `ON` clause vs `WHERE` clause has different effects in LEFT JOINs (filtering in WHERE turns LEFT JOIN into INNER JOIN).",
        "Self Joins allow querying hierarchical structures within a single table (e.g. Employee-Manager table)."
      ],
      examples: [
        "Joining `Students` table with `CourseEnrollments` to find all enrolled students.",
        "Finding students who have NEVER submitted an assignment using `LEFT JOIN ... WHERE submission_id IS NULL`."
      ],
      algorithmSteps: [
        "1. Identify primary table and joining tables.",
        "2. Determine primary key / foreign key join condition (`ON a.id = b.a_id`).",
        "3. Choose join type based on whether unmatched rows must be preserved.",
        "4. Apply filtering criteria in `WHERE` and aggregate using `GROUP BY`."
      ],
      codeSnippets: [
        {
          language: "sql",
          title: "SQL Join Examples",
          code: `-- 1. INNER JOIN: Only students with enrolled courses
SELECT s.student_id, s.name, c.course_title
FROM Students s
INNER JOIN Enrollments e ON s.student_id = e.student_id
INNER JOIN Courses c ON e.course_id = c.course_id;

-- 2. LEFT JOIN: All students, even if they have 0 test attempts
SELECT s.name, COUNT(tr.id) AS total_tests_taken
FROM Students s
LEFT JOIN TestResults tr ON s.student_id = tr.student_id
GROUP BY s.student_id, s.name;

-- 3. Self Join: Employee and Manager Hierarchy
SELECT e.name AS Employee, m.name AS Manager
FROM Employees e
LEFT JOIN Employees m ON e.manager_id = m.employee_id;`,
          explanation: "Production SQL examples illustrating INNER, LEFT with aggregations, and Self-Joins."
        }
      ],
      timeComplexity: "O(M + N) with Hash Join on indexed keys, O(M * N) with unindexed Nested Loop Join",
      spaceComplexity: "O(M) memory for building in-memory hash tables during join resolution",
      keyTakeaways: [
        "Use INNER JOIN when you strictly need matched pairs.",
        "Use LEFT JOIN when you must preserve all master records regardless of transaction existence.",
        "Ensure foreign keys have indexes created to avoid slow full-table scans."
      ],
      commonMistakes: [
        "Putting left table filtering conditions in the `WHERE` clause after a `LEFT JOIN`, inadvertently converting it into an `INNER JOIN`.",
        "Creating unintentional Cartesian products (`CROSS JOIN`) by omitting join predicates in `ON` clauses."
      ],
      relatedTopics: ["Primary Keys", "Normalization", "Indexing & B-Trees", "Subqueries"]
    }
  },
  {
    topicId: "dbms-normalization",
    chapterId: "dbms-u2-c1",
    unitId: "dbms-u2",
    subjectId: "dbms",
    topicNumber: 2,
    title: "Database Normalization (1NF, 2NF, 3NF, BCNF)",
    estimatedMinutes: 25,
    difficulty: "Intermediate",
    summary: "Systematic schema decomposition to eliminate insertion, deletion, and update anomalies using functional dependencies.",
    subtopics: ["Functional Dependencies", "1NF Atomic Values", "2NF Partial Dependency Removal", "3NF Transitive Dependency Removal", "Boyce-Codd Normal Form (BCNF)"],
    content: {
      introduction: "Database Normalization is the formal process of structuring relational schemas to minimize data redundancy and eliminate update anomalies (Insertion, Deletion, and Modification anomalies) while preserving data integrity.",
      concepts: [
        "1NF (First Normal Form): Every column contains atomic (indivisible) values; no multi-valued attributes or repeating groups.",
        "2NF (Second Normal Form): Must be in 1NF AND have no Partial Dependencies (no non-prime attribute may depend on a proper subset of any candidate key).",
        "3NF (Third Normal Form): Must be in 2NF AND have no Transitive Dependencies (no non-prime attribute depends on another non-prime attribute). In X -> Y, X is super key OR Y is prime attribute.",
        "BCNF (Boyce-Codd Normal Form): Stricter than 3NF. For every non-trivial functional dependency X -> Y, X MUST be a Super Key."
      ],
      importantPoints: [
        "Lossless Join Decomposition: When decomposing relation R into R1 and R2, R1 ∩ R2 must determine at least R1 or R2.",
        "Dependency Preservation: All functional dependencies of the original schema must be verifiable in the individual decomposed tables.",
        "3NF always guarantees both Lossless Join AND Dependency Preservation; BCNF guarantees Lossless Join but may not preserve dependencies."
      ],
      examples: [
        "Decomposing `StudentCourse(StudentID, CourseID, StudentName, CourseFee)` from 1NF to 2NF.",
        "Decomposing `Employee(EmpID, DeptID, DeptName)` from 2NF to 3NF to eliminate `EmpID -> DeptID -> DeptName` transitive dependency."
      ],
      algorithmSteps: [
        "1. Identify all Candidate Keys using closure of attribute sets.",
        "2. Check for 1NF (ensure atomic scalar columns).",
        "3. Check for 2NF: If compound candidate key exists, ensure no non-prime attribute depends on a partial key.",
        "4. Check for 3NF: Ensure non-prime attributes only depend directly on Candidate Keys.",
        "5. Decompose relations using projection preserving candidate key determinants."
      ],
      codeSnippets: [
        {
          language: "sql",
          title: "Normalized Schema DDL",
          code: `-- Normalized 3NF Schema Example
CREATE TABLE Departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL
);

CREATE TABLE Students (
    student_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dept_id INT REFERENCES Departments(dept_id)
);

CREATE TABLE Courses (
    course_id INT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    credits INT NOT NULL
);

CREATE TABLE Enrollments (
    student_id INT REFERENCES Students(student_id),
    course_id INT REFERENCES Courses(course_id),
    grade CHAR(2),
    PRIMARY KEY (student_id, course_id)
);`,
          explanation: "3NF relational schema free from partial and transitive dependencies."
        }
      ],
      timeComplexity: "O(2^N) theoretical attribute closure analysis in worst case, O(N^2) in standard schema designs",
      spaceComplexity: "Eliminates duplicate storage rows, dramatically reducing disk footprint",
      keyTakeaways: [
        "1NF: Atomic attributes.",
        "2NF: No partial dependency (relevant when candidate key is composite).",
        "3NF: No transitive dependency.",
        "BCNF: Determinant in every non-trivial FD must be a Super Key."
      ],
      commonMistakes: [
        "Confusing candidate keys with primary keys (2NF checks against ALL candidate keys, not just the chosen primary key).",
        "Assuming BCNF is always superior to 3NF without realizing BCNF can drop dependency preservation.",
        "Over-normalizing OLAP analytics databases (where intentional denormalization is preferred for read speed)."
      ],
      relatedTopics: ["Functional Dependencies", "Candidate Keys", "Denormalization", "SQL Joins"]
    }
  },

  // ───────────────────────────────────────────────────────────────────────────
  // OPERATING SYSTEMS TOPICS
  // ───────────────────────────────────────────────────────────────────────────
  {
    topicId: "cpu-scheduling",
    chapterId: "os-u1-c1",
    unitId: "os-u1",
    subjectId: "os",
    topicNumber: 1,
    title: "CPU Scheduling Algorithms (FCFS, SJF, Round Robin)",
    estimatedMinutes: 20,
    difficulty: "Beginner",
    summary: "Preemptive and non-preemptive algorithms for allocating CPU burst cycles to active ready processes.",
    subtopics: ["FCFS & Convoy Effect", "SJF & Shortest Remaining Time First (SRTF)", "Round Robin & Time Quantum Sizing", "Turnaround & Waiting Time Metrics"],
    content: {
      introduction: "CPU Scheduling is the process by which the operating system decides which process in the Ready Queue should be allocated CPU execution time. Efficient scheduling maximizes CPU utilization, minimizes turnaround time, and ensures responsive interactive systems.",
      concepts: [
        "First-Come, First-Served (FCFS): Non-preemptive. Simple FIFO queue, but suffers from the Convoy Effect (short processes stuck waiting behind huge CPU bursts).",
        "Shortest Job First (SJF): Provably optimal in minimizing average waiting time, but impractical in pure form because future burst times cannot be known in advance.",
        "Shortest Remaining Time First (SRTF): Preemptive variant of SJF. Preempts current process if a newly arrived process has a shorter remaining burst.",
        "Round Robin (RR): Preemptive with a fixed Time Quantum `Q`. Ensures fairness and responsiveness in timesharing systems."
      ],
      importantPoints: [
        "Time Quantum Selection in Round Robin: If `Q` is too large, RR degenerates to FCFS. If `Q` is too small, context switching overhead dominates CPU cycles.",
        "Rule of Thumb: 80% of CPU bursts should be shorter than the chosen Time Quantum `Q`.",
        "Starvation: In Priority and SJF scheduling, long jobs can starve indefinitely if shorter jobs continuously arrive."
      ],
      examples: [
        "Calculate Waiting Time and Turnaround Time for processes P1(burst=6), P2(burst=8), P3(burst=7), P4(burst=3) with arrival time 0.",
        "Gantt Chart construction for Round Robin with Time Quantum = 4ms."
      ],
      algorithmSteps: [
        "1. Turnaround Time = Completion Time - Arrival Time.",
        "2. Waiting Time = Turnaround Time - Burst Time.",
        "3. Response Time = Time at which process first gets CPU - Arrival Time.",
        "4. Average Waiting Time = Sum of Waiting Times / Total Processes."
      ],
      codeSnippets: [
        {
          language: "cpp",
          title: "C++ Round Robin Scheduling Simulation",
          code: `#include <iostream>
#include <vector>
#include <queue>

struct Process {
    int id;
    int burstTime;
    int remainingTime;
    int completionTime;
};

void roundRobin(std::vector<Process>& proc, int quantum) {
    int time = 0;
    std::queue<int> q;
    for (size_t i = 0; i < proc.size(); i++) q.push(i);

    while (!q.empty()) {
        int idx = q.front();
        q.pop();
        if (proc[idx].remainingTime > quantum) {
            time += quantum;
            proc[idx].remainingTime -= quantum;
            q.push(idx);
        } else {
            time += proc[idx].remainingTime;
            proc[idx].remainingTime = 0;
            proc[idx].completionTime = time;
        }
    }
}`,
          explanation: "Round Robin CPU scheduler simulation using FIFO process queues."
        }
      ],
      timeComplexity: "O(N log N) using priority queues for SJF/Priority, O(N * (Burst/Q)) for Round Robin",
      spaceComplexity: "O(N) for Ready Queue and PCB descriptor state storage",
      keyTakeaways: [
        "SJF produces minimum average waiting time.",
        "Round Robin is the foundation of interactive multitasking operating systems.",
        "Aging technique (gradually increasing priority of waiting processes) prevents starvation in priority scheduling."
      ],
      commonMistakes: [
        "Confusing Waiting Time with Turnaround Time (Turnaround = Completion - Arrival; Waiting = Turnaround - Burst).",
        "Forgetting context switch latency when modeling Round Robin performance."
      ],
      relatedTopics: ["Process Control Block", "Context Switching", "Multilevel Feedback Queues", "Process Synchronization"]
    }
  },
  {
    topicId: "virtual-memory-paging",
    chapterId: "os-u3-c1",
    unitId: "os-u3",
    subjectId: "os",
    topicNumber: 2,
    title: "Virtual Memory, Paging & Page Replacement",
    estimatedMinutes: 25,
    difficulty: "Intermediate",
    summary: "Translating logical addresses to physical frames, handling page faults, and page replacement algorithms (FIFO, LRU, Optimal).",
    subtopics: ["Page Table & MMU Translation", "Translation Lookaside Buffer (TLB)", "Page Fault Interrupt Handling", "Page Replacement (FIFO, LRU, Belady's Anomaly)"],
    content: {
      introduction: "Virtual Memory gives each running process the illusion of a contiguous address space larger than physical RAM. The Memory Management Unit (MMU) maps logical page numbers to physical frame numbers using Page Tables and TLBs.",
      concepts: [
        "Paging: Dividing logical memory into fixed-size Pages (typically 4KB) and physical memory into identical-size Frames.",
        "Page Fault: Hardware interrupt triggered when a process attempts to access a page whose valid/invalid bit is set to invalid (not currently present in RAM).",
        "TLB (Translation Lookaside Buffer): High-speed hardware associative cache storing recent virtual-to-physical translations.",
        "Page Replacement Algorithms: Deciding which victim page to swap out to disk when all physical frames are occupied."
      ],
      importantPoints: [
        "Effective Access Time (EAT) = (TLB hit ratio * (TLB time + Memory time)) + ((1 - TLB hit ratio) * (TLB time + 2 * Memory time)).",
        "Belady's Anomaly: In FIFO page replacement, increasing the number of physical page frames can paradoxically increase the number of page faults.",
        "LRU (Least Recently Used) is an approximation of the theoretical Optimal Page Replacement (MIN/OPT) algorithm and is immune to Belady's anomaly."
      ],
      examples: [
        "Reference string: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1 with 3 physical frames.",
        "Calculating page fault count under FIFO vs LRU."
      ],
      algorithmSteps: [
        "1. CPU generates virtual address (Page Number `p`, Page Offset `d`).",
        "2. Check TLB: If TLB hit, fetch frame number `f` immediately.",
        "3. If TLB miss, lookup Page Table in main memory.",
        "4. If Valid bit is 0, trigger Page Fault Trap to OS.",
        "5. OS finds empty frame or invokes Page Replacement Algorithm (LRU) to evict victim page.",
        "6. Swap requested page from disk into RAM, update Page Table valid bit to 1, restart CPU instruction."
      ],
      codeSnippets: [
        {
          language: "cpp",
          title: "C++ LRU Page Replacement Simulation",
          code: `#include <vector>
#include <unordered_map>
#include <list>
#include <iostream>

int countLRUPageFaults(const std::vector<int>& pages, int capacity) {
    std::unordered_map<int, std::list<int>::iterator> pageMap;
    std::list<int> lruList;
    int pageFaults = 0;

    for (int page : pages) {
        if (pageMap.find(page) == pageMap.end()) {
            pageFaults++;
            if (static_cast<int>(lruList.size()) == capacity) {
                int victim = lruList.back();
                lruList.pop_back();
                pageMap.erase(victim);
            }
        } else {
            lruList.erase(pageMap[page]);
        }
        lruList.push_front(page);
        pageMap[page] = lruList.begin();
    }
    return pageFaults;
}`,
          explanation: "O(1) LRU Page Replacement using Hash Map and Doubly Linked List."
        }
      ],
      timeComplexity: "O(1) memory lookup with TLB hit; ~10-20ms penalty on Page Fault due to disk I/O",
      spaceComplexity: "O(P) Page table size proportional to number of virtual pages (mitigated by Multi-level page tables)",
      keyTakeaways: [
        "Page Offset `d` passes through unchanged from logical to physical address.",
        "LRU and Optimal algorithms never suffer from Belady's anomaly (they are Stack algorithms).",
        "Thrashing occurs when the system spends more time swapping pages than executing instructions."
      ],
      commonMistakes: [
        "Believing FIFO always improves with more memory (Belady's anomaly counterexamples prove otherwise).",
        "Assuming page offset changes during MMU translation (only the page number is replaced by frame number).",
        "Ignoring the massive performance cost of page faults (~100,000x slower than RAM access)."
      ],
      relatedTopics: ["Segmentation", "Thrashing", "Working Set Model", "Memory Management Unit"]
    }
  },

  // ───────────────────────────────────────────────────────────────────────────
  // COMPUTER NETWORKS TOPICS
  // ───────────────────────────────────────────────────────────────────────────
  {
    topicId: "tcp-handshake",
    chapterId: "cn-u3-c1",
    unitId: "cn-u3",
    subjectId: "cn",
    topicNumber: 1,
    title: "TCP 3-Way Handshake & Connection Teardown",
    estimatedMinutes: 20,
    difficulty: "Beginner",
    summary: "Reliable bidirectional stream connection establishment (SYN, SYN-ACK, ACK) and graceful 4-way termination (FIN-ACK).",
    subtopics: ["SYN / SYN-ACK / ACK Mechanics", "Initial Sequence Numbers (ISN)", "TCP 4-Way FIN Teardown", "TIME_WAIT State & SYN Flood Attacks"],
    content: {
      introduction: "Transmission Control Protocol (TCP) is a connection-oriented, reliable transport protocol that guarantees ordered, error-checked packet delivery. Before any application data (HTTP, SSH) flows, endpoints establish synchronized sequence numbers via the 3-Way Handshake.",
      concepts: [
        "SYN (Synchronize): Client sends randomly chosen initial sequence number `ISN_C`.",
        "SYN-ACK: Server acknowledges client's sequence number (`ACK = ISN_C + 1`) and sends its own `ISN_S`.",
        "ACK: Client acknowledges server's sequence number (`ACK = ISN_S + 1`). Connection is now ESTABLISHED.",
        "TIME_WAIT State: Client waits 2 * MSL (Maximum Segment Lifetime, typically 60-120s) before closing to guarantee last ACK reached server and flush lingering duplicate packets."
      ],
      importantPoints: [
        "SYN Flooding: DoS attack sending thousands of SYN packets without completing the 3rd ACK, exhausting server connection backlogs (mitigated by SYN Cookies).",
        "TCP Half-Close: One endpoint finishes sending data (sends FIN) but can continue receiving data from the peer.",
        "Piggybacking: The final ACK packet of the handshake can simultaneously carry initial application payload (e.g. HTTP GET request in TCP Fast Open)."
      ],
      examples: [
        "Wireshark packet capture showing SYN (Seq=100) -> SYN-ACK (Seq=300, Ack=101) -> ACK (Seq=101, Ack=301).",
        "Analyzing why `netstat` displays thousands of sockets stuck in `TIME_WAIT`."
      ],
      algorithmSteps: [
        "1. Client -> Server: `[SYN], Seq = x`",
        "2. Server -> Client: `[SYN, ACK], Seq = y, Ack = x + 1`",
        "3. Client -> Server: `[ACK], Seq = x + 1, Ack = y + 1`",
        "4. Both sides transition to `ESTABLISHED` state."
      ],
      codeSnippets: [
        {
          language: "javascript",
          title: "Node.js TCP Client/Server Handshake Verification",
          code: `const net = require('net');

// TCP Server
const server = net.createServer((socket) => {
  console.log('Client connected (3-Way Handshake Completed)');
  socket.write('Hello TCP Client!\\n');
  socket.on('data', (data) => console.log('Received:', data.toString()));
});
server.listen(8080, () => console.log('TCP Server listening on port 8080'));

// TCP Client
const client = net.createConnection({ port: 8080 }, () => {
  console.log('Connected to server');
  client.write('Client ready for communication');
});`,
          explanation: "Low-level Node.js socket demonstration triggering kernel TCP handshake."
        }
      ],
      timeComplexity: "1 RTT (Round Trip Time) connection latency overhead prior to payload delivery",
      spaceComplexity: "O(1) memory for Socket TCB (Transmission Control Block) kernel struct",
      keyTakeaways: [
        "Handshake establishes mutual agreement on starting sequence numbers for reliable byte streaming.",
        "Connection termination requires 4 packets (FIN -> ACK -> FIN -> ACK) because TCP is full-duplex.",
        "SYN Cookies defend servers against denial-of-service memory exhaustion."
      ],
      commonMistakes: [
        "Believing the 3-way handshake carries user payload (unless TCP Fast Open is specifically negotiated).",
        "Assuming `TIME_WAIT` is a bug; it is an essential safeguard to prevent delayed duplicate packets from corrupting new connections."
      ],
      relatedTopics: ["UDP vs TCP", "Flow Control & Sliding Window", "Congestion Control", "SYN Flood Attacks"]
    }
  },

  // ───────────────────────────────────────────────────────────────────────────
  // OOPS TOPICS
  // ───────────────────────────────────────────────────────────────────────────
  {
    topicId: "solid-principles",
    chapterId: "oops-u2-c1",
    unitId: "oops-u2",
    subjectId: "oops",
    topicNumber: 1,
    title: "SOLID Principles & Clean Code Architecture",
    estimatedMinutes: 20,
    difficulty: "Intermediate",
    summary: "Five essential design principles for building maintainable, decoupled, and extensible object-oriented software.",
    subtopics: ["Single Responsibility (SRP)", "Open/Closed (OCP)", "Liskov Substitution (LSP)", "Interface Segregation (ISP)", "Dependency Inversion (DIP)"],
    content: {
      introduction: "SOLID is an acronym for five foundational design principles introduced by Robert C. Martin (Uncle Bob). Following SOLID produces modular systems that are easy to test, refactor, and extend without causing cascading code regressions.",
      concepts: [
        "S — Single Responsibility Principle (SRP): A class should have one, and only one, reason to change.",
        "O — Open/Closed Principle (OCP): Software entities should be open for extension, but closed for modification.",
        "L — Liskov Substitution Principle (LSP): Subtypes must be substitutable for their base types without altering program correctness.",
        "I — Interface Segregation Principle (ISP): Clients should not be forced to depend upon interfaces they do not use.",
        "D — Dependency Inversion Principle (DIP): High-level modules should not depend on low-level modules; both should depend on abstractions (interfaces)."
      ],
      importantPoints: [
        "LSP Violation Classic: Making a `Square` class inherit from `Rectangle` and overriding `setWidth`/`setHeight` breaks client code expecting independent dimensions.",
        "Dependency Injection (DI) is the primary design pattern used to realize the Dependency Inversion Principle.",
        "Open/Closed principle is achieved through Polymorphism and Strategy patterns."
      ],
      examples: [
        "Refactoring a monolithic `UserManager` (handles validation, database saving, and email sending) into 3 focused SRP classes.",
        "Using Payment Gateway interfaces to add PayPal/Stripe support without modifying checkout logic (OCP)."
      ],
      algorithmSteps: [
        "1. Identify responsibilities in classes and split if multiple change actors exist (SRP).",
        "2. Replace conditionals on type (`switch (type)`) with Polymorphic strategies (OCP).",
        "3. Ensure derived classes uphold all contracts and invariants of base class (LSP).",
        "4. Break monolithic fat interfaces into small client-specific interfaces (ISP).",
        "5. Inject interface abstractions rather than instantiating concrete classes with `new` (DIP)."
      ],
      codeSnippets: [
        {
          language: "java",
          title: "Java Dependency Inversion Principle (DIP)",
          code: `// Interface Abstraction
interface NotificationService {
    void send(String message, String recipient);
}

// Low-level modules
class EmailService implements NotificationService {
    public void send(String msg, String to) { System.out.println("Email to " + to + ": " + msg); }
}

class SmsService implements NotificationService {
    public void send(String msg, String to) { System.out.println("SMS to " + to + ": " + msg); }
}

// High-level module depends on Abstraction, NOT concrete classes
class OrderProcessor {
    private final NotificationService notifier;

    public OrderProcessor(NotificationService notifier) { // Injected via constructor
        this.notifier = notifier;
    }

    public void completeOrder(String user) {
        // ... process payment ...
        notifier.send("Your order is confirmed!", user);
    }
}`,
          explanation: "Dependency Inversion in Java: OrderProcessor is decoupled from concrete notification implementations."
        },
        {
          language: "python",
          title: "Python Open/Closed Principle (OCP)",
          code: `from abc import ABC, abstractmethod

class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount: float) -> None:
        pass

class CreditCardPayment(PaymentStrategy):
    def pay(self, amount: float) -> None:
        print(f"Paid \${amount} via Credit Card")

class CryptoPayment(PaymentStrategy):
    def pay(self, amount: float) -> None:
        print(f"Paid \${amount} via Ethereum")

# Open for extension (new payment methods), closed for modification
class Checkout:
    def process(self, payment: PaymentStrategy, amount: float):
        payment.pay(amount)`,
          explanation: "Python Strategy pattern satisfying the Open/Closed Principle."
        }
      ],
      timeComplexity: "O(1) runtime dispatch overhead through virtual tables / interface lookups",
      spaceComplexity: "Negligible memory overhead for interface references",
      keyTakeaways: [
        "SOLID prevents software rot and fragile dependencies.",
        "Always favor composition and interfaces over deep inheritance trees.",
        "Single Responsibility is the most violated principle in real-world codebases."
      ],
      commonMistakes: [
        "Inheriting for code reuse rather than genuine is-a polymorphism, violating LSP.",
        "Creating giant 'God' interfaces with 50 methods, violating ISP.",
        "Hardcoding concrete database clients inside business logic controllers, violating DIP."
      ],
      relatedTopics: ["Factory Pattern", "Dependency Injection", "Design Patterns", "Polymorphism"]
    }
  }
];
