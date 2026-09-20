/**
 * LearnX Topic-Specific Question Seed Data
 *
 * Provides real, rigorous CSE assessment questions mapped to individual topics
 * and tagged with specific subtopic/concept diagnostics to power granular weakness detection.
 */

export const TOPIC_QUESTIONS = [
  // ─── QUICK SORT QUESTIONS (dsa -> quick-sort) ──────────────────────────────
  {
    topicId: "quick-sort",
    subjectId: "dsa",
    subtopic: "Worst-case Quadratic Degradation",
    questionText: "Under which condition does standard Quick Sort with the last element chosen as pivot degrade to its worst-case time complexity O(N^2)?",
    options: [
      "When the input array elements are completely distinct and randomized",
      "When the input array is already sorted in ascending or descending order",
      "When the array size is a power of 2",
      "When all elements in the array are positive integers"
    ],
    correctAnswerIndex: 1,
    difficulty: "easy",
    explanation: "When the array is already sorted and the last element is chosen as pivot, every partition creates an extreme unbalanced split of sizes (N-1) and 0, resulting in N recursive levels and O(N^2) total comparisons.",
  },
  {
    topicId: "quick-sort",
    subjectId: "dsa",
    subtopic: "Partition Logic",
    questionText: "In Lomuto's partitioning scheme, what is the primary role of the slow pointer `i`?",
    options: [
      "It always points to the pivot element throughout execution",
      "It marks the boundary of elements known to be smaller than or equal to the pivot",
      "It stores the maximum element discovered so far in the scan",
      "It tracks the recursion depth to prevent call stack overflow"
    ],
    correctAnswerIndex: 1,
    difficulty: "medium",
    explanation: "In Lomuto partition, pointer `i` maintains the invariant that all elements from index `low` to `i` are <= pivot. When scanning pointer `j` finds an element <= pivot, `i` is incremented and swapped with `arr[j]`.",
  },
  {
    topicId: "quick-sort",
    subjectId: "dsa",
    subtopic: "Space Complexity",
    questionText: "What is the auxiliary memory space complexity of Quick Sort on an array of size N when using tail call optimization?",
    options: [
      "O(1) strict constant space",
      "O(log N) auxiliary recursion stack space",
      "O(N) auxiliary array space for temporary subarrays",
      "O(N log N) total memory allocation"
    ],
    correctAnswerIndex: 1,
    difficulty: "medium",
    explanation: "Quick Sort is an in-place sorting algorithm. It requires no additional array buffers, but the recursive function call stack occupies O(log N) memory on average.",
  },
  {
    topicId: "quick-sort",
    subjectId: "dsa",
    subtopic: "Pivot Selection Strategies",
    questionText: "Which technique is most effective at preventing worst-case O(N^2) degradation in QuickSort without changing its average-case speed?",
    options: [
      "Always choosing the first element of the subarray as pivot",
      "Randomized Pivot Selection or Median-of-Three pivot selection",
      "Replacing recursion with nested while loops",
      "Pre-sorting the array using Bubble Sort first"
    ],
    correctAnswerIndex: 1,
    difficulty: "easy",
    explanation: "Randomized pivot selection or Median-of-Three (median of first, middle, and last elements) prevents adversarial or sorted inputs from causing unbalanced 1-element partitions with high probability.",
  },
  {
    topicId: "quick-sort",
    subjectId: "dsa",
    subtopic: "Stability Properties",
    questionText: "Is standard in-place Quick Sort a stable sorting algorithm, and why?",
    options: [
      "Yes, because equal elements are never swapped across the array",
      "No, because non-adjacent swaps during partitioning can alter the relative order of duplicate elements",
      "Yes, because it uses divide-and-conquer recursion identical to Merge Sort",
      "No, because it requires O(N) auxiliary memory"
    ],
    correctAnswerIndex: 1,
    difficulty: "medium",
    explanation: "Standard in-place Quick Sort is NOT stable because long-distance swaps across the pivot during partitioning can move an earlier duplicate behind a later duplicate.",
  },

  // ─── BINARY SEARCH QUESTIONS (dsa -> binary-search) ────────────────────────
  {
    topicId: "binary-search",
    subjectId: "dsa",
    subtopic: "Midpoint Overflow Prevention",
    questionText: "In Java/C++, why is `mid = low + (high - low) / 2` preferred over `mid = (low + high) / 2`?",
    options: [
      "It executes in fewer CPU clock cycles due to bitwise optimization",
      "It prevents 32-bit signed integer arithmetic overflow when `low + high > 2,147,483,647`",
      "It guarantees that `mid` is always an even index",
      "It allows searching in unsorted arrays"
    ],
    correctAnswerIndex: 1,
    difficulty: "easy",
    explanation: "When `low` and `high` are both large positive integers, `low + high` can exceed Integer.MAX_VALUE (2^31 - 1), overflowing into a negative number and causing an ArrayOutOfBoundsException.",
  },
  {
    topicId: "binary-search",
    subjectId: "dsa",
    subtopic: "Divide and Conquer Strategy",
    questionText: "What is the maximum number of comparisons Binary Search requires to find a key or conclude absence in a sorted array of 1,000,000 elements?",
    options: [
      "~20 comparisons",
      "~1,000 comparisons",
      "~500,000 comparisons",
      "~1,000,000 comparisons"
    ],
    correctAnswerIndex: 0,
    difficulty: "easy",
    explanation: "Binary search divides the search space in half each time: ceil(log2(1,000,000)) ≈ 20 comparisons (since 2^20 = 1,048,576).",
  },
  {
    topicId: "binary-search",
    subjectId: "dsa",
    subtopic: "Lower & Upper Bound Variants",
    questionText: "Given sorted array `[2, 4, 4, 4, 7, 9]`, what are the index return values of Lower Bound and Upper Bound for target value 4?",
    options: [
      "Lower Bound = 1, Upper Bound = 4",
      "Lower Bound = 1, Upper Bound = 3",
      "Lower Bound = 0, Upper Bound = 5",
      "Lower Bound = 2, Upper Bound = 4"
    ],
    correctAnswerIndex: 0,
    difficulty: "hard",
    explanation: "Lower Bound finds the first element >= 4 (index 1). Upper Bound finds the first element strictly > 4 (element 7 at index 4).",
  },
  {
    topicId: "binary-search",
    subjectId: "dsa",
    subtopic: "Time & Space Complexity",
    questionText: "If Binary Search is executed on a standard Singly Linked List of length N with sorted node values, what is its actual running time?",
    options: [
      "O(log N)",
      "O(N)",
      "O(N log N)",
      "O(1)"
    ],
    correctAnswerIndex: 1,
    difficulty: "medium",
    explanation: "Even though the number of logical comparisons is O(log N), traversing to the middle node in a Singly Linked List takes O(N/2) sequential pointer steps, bringing total time to O(N).",
  },
  {
    topicId: "binary-search",
    subjectId: "dsa",
    subtopic: "Divide and Conquer Strategy",
    questionText: "What recurrence relation accurately describes standard iterative or recursive Binary Search?",
    options: [
      "T(N) = 2T(N/2) + O(N)",
      "T(N) = T(N/2) + O(1)",
      "T(N) = T(N - 1) + O(1)",
      "T(N) = 2T(N/2) + O(1)"
    ],
    correctAnswerIndex: 1,
    difficulty: "medium",
    explanation: "Binary search divides the problem into one half subproblem (not two) and performs O(1) comparison at the midpoint: T(N) = T(N/2) + O(1), which solves to O(log N) by Master Theorem Case 2.",
  },

  // ─── MERGE SORT QUESTIONS (dsa -> merge-sort) ──────────────────────────────
  {
    topicId: "merge-sort",
    subjectId: "dsa",
    subtopic: "Stability Properties",
    questionText: "What makes Merge Sort inherently stable when merging two sorted subarrays `L` and `R`?",
    options: [
      "Using `<` in the comparison `if (L[i] < R[j])`",
      "Using `<=` in the comparison `if (L[i] <= R[j])` so left duplicate is prioritized before right duplicate",
      "Because Merge Sort does not use recursion",
      "Because it runs in O(N log N) in all cases"
    ],
    correctAnswerIndex: 1,
    difficulty: "medium",
    explanation: "Using `<=` ensures that whenever identical elements are compared between the Left and Right subarrays, the element from the Left subarray is chosen first, preserving original relative index order.",
  },
  {
    topicId: "merge-sort",
    subjectId: "dsa",
    subtopic: "Divide Phase Recurrence",
    questionText: "What is the worst-case, average-case, and best-case time complexity of Merge Sort on an array of N elements?",
    options: [
      "Best: O(N), Average: O(N log N), Worst: O(N^2)",
      "O(N log N) in all three cases",
      "Best: O(1), Average: O(N log N), Worst: O(N log N)",
      "O(N^2) in all three cases"
    ],
    correctAnswerIndex: 1,
    difficulty: "easy",
    explanation: "Merge Sort is completely deterministic. It unconditionally divides the array into halves down to base cases and merges them in O(N) time at each level, ensuring O(N log N) across all inputs.",
  },
  {
    topicId: "merge-sort",
    subjectId: "dsa",
    subtopic: "Inversion Counting",
    questionText: "During the merge step of Merge Sort, if `L[i] > R[j]`, how many inversions are contributed by `R[j]` with elements remaining in the left subarray `L[i..m]`?",
    options: [
      "1 inversion",
      "(m - i + 1) inversions",
      "(j - m) inversions",
      "0 inversions"
    ],
    correctAnswerIndex: 1,
    difficulty: "hard",
    explanation: "Since subarray `L` is sorted, if `L[i] > R[j]`, then all subsequent elements from `L[i]` to `L[m]` are also strictly greater than `R[j]`, contributing `(m - i + 1)` inversions at once in O(1) time.",
  },

  // ─── SQL JOINS QUESTIONS (dbms -> sql-joins) ───────────────────────────────
  {
    topicId: "sql-joins",
    subjectId: "dbms",
    subtopic: "LEFT/RIGHT OUTER JOIN",
    questionText: "In PostgreSQL/MySQL, what happens if a WHERE condition filters on a column from the RIGHT table after a LEFT JOIN, such as `LEFT JOIN Orders o ON u.id = o.user_id WHERE o.status = 'active'`?",
    options: [
      "The query retains all unmatched users with NULL values for order columns",
      "The LEFT JOIN is effectively converted into an INNER JOIN, excluding users with 0 orders because NULL = 'active' evaluates to UNKNOWN",
      "The query throws a SQL syntax error",
      "PostgreSQL automatically optimizes the query into a FULL OUTER JOIN"
    ],
    correctAnswerIndex: 1,
    difficulty: "hard",
    explanation: "Because the `WHERE` clause evaluates after the join, unmatched rows from the left table have NULL for `o.status`. The expression `NULL = 'active'` evaluates to UNKNOWN (false in WHERE), filtering out all unmatched users and destroying the LEFT JOIN behavior. The condition should be placed in the `ON` clause instead.",
  },
  {
    topicId: "sql-joins",
    subjectId: "dbms",
    subtopic: "INNER JOIN Logic",
    questionText: "Given Table A with 5 rows (all keys = 1) and Table B with 4 rows (all keys = 1), how many rows will `SELECT * FROM A INNER JOIN B ON A.key = B.key` return?",
    options: [
      "5 rows",
      "4 rows",
      "20 rows",
      "9 rows"
    ],
    correctAnswerIndex: 2,
    difficulty: "medium",
    explanation: "An INNER JOIN matches every row in A with every matching row in B. Since all 5 rows in A match all 4 rows in B, it produces 5 * 4 = 20 rows.",
  },
  {
    topicId: "sql-joins",
    subjectId: "dbms",
    subtopic: "Self Joins & NULL Handling",
    questionText: "Which SQL join type is required to display an organization hierarchy of ALL employees along with their manager's name, including the CEO who has `manager_id IS NULL`?",
    options: [
      "INNER JOIN Employees m ON e.manager_id = m.id",
      "LEFT OUTER JOIN Employees m ON e.manager_id = m.id",
      "CROSS JOIN Employees m",
      "NATURAL JOIN Employees m"
    ],
    correctAnswerIndex: 1,
    difficulty: "easy",
    explanation: "A LEFT OUTER JOIN preserves the CEO record from the left employee table, returning NULL for the manager's columns instead of discarding the CEO row.",
  },

  // ─── DBMS NORMALIZATION QUESTIONS (dbms -> dbms-normalization) ─────────────
  {
    topicId: "dbms-normalization",
    subjectId: "dbms",
    subtopic: "2NF Partial Dependency Removal",
    questionText: "A relation R(A, B, C, D) has Candidate Key (A, B). Which of the following functional dependencies violates Second Normal Form (2NF)?",
    options: [
      "(A, B) -> C",
      "A -> C",
      "(A, B) -> D",
      "C -> D where C is non-prime"
    ],
    correctAnswerIndex: 1,
    difficulty: "medium",
    explanation: "2NF requires that no non-prime attribute depends on a proper subset of any candidate key. In `A -> C`, non-prime attribute C depends only on A (a partial part of candidate key (A, B)), which is a Partial Dependency violating 2NF.",
  },
  {
    topicId: "dbms-normalization",
    subjectId: "dbms",
    subtopic: "3NF Transitive Dependency Removal",
    questionText: "What condition must hold for every non-trivial functional dependency `X -> Y` in Third Normal Form (3NF)?",
    options: [
      "X must be a candidate key AND Y must be a candidate key",
      "X is a Super Key OR Y is a Prime Attribute (part of some candidate key)",
      "X must be a single scalar column",
      "Y must not contain NULL values"
    ],
    correctAnswerIndex: 1,
    difficulty: "medium",
    explanation: "In 3NF, for every functional dependency X -> Y: either X is a Super Key (left side is key) OR Y is a Prime Attribute (right side is part of a candidate key).",
  },
  {
    topicId: "dbms-normalization",
    subjectId: "dbms",
    subtopic: "Boyce-Codd Normal Form (BCNF)",
    questionText: "How does Boyce-Codd Normal Form (BCNF) differ from 3NF?",
    options: [
      "BCNF allows multi-valued attributes while 3NF forbids them",
      "BCNF removes the second condition of 3NF: in every non-trivial FD `X -> Y`, X MUST strictly be a Super Key",
      "BCNF is strictly weaker than 3NF",
      "BCNF guarantees functional dependency preservation while 3NF does not"
    ],
    correctAnswerIndex: 1,
    difficulty: "hard",
    explanation: "BCNF is stricter than 3NF. In BCNF, the exception allowing Y to be a prime attribute is eliminated: for every non-trivial dependency X -> Y, the determinant X must strictly be a Super Key.",
  },

  // ─── CPU SCHEDULING QUESTIONS (os -> cpu-scheduling) ───────────────────────
  {
    topicId: "cpu-scheduling",
    subjectId: "os",
    subtopic: "FCFS & Convoy Effect",
    questionText: "What causes the 'Convoy Effect' in operating system CPU scheduling?",
    options: [
      "When a high-priority process preempts a low-priority process",
      "When one CPU-bound process with a huge burst holds the CPU in FCFS, causing many fast I/O-bound processes to wait behind it",
      "When the Round Robin time quantum is set too small",
      "When two processes cause a mutual exclusion deadlock on semaphores"
    ],
    correctAnswerIndex: 1,
    difficulty: "easy",
    explanation: "In non-preemptive FCFS scheduling, when a CPU-intensive process occupies the CPU, all other processes (including interactive jobs needing only 1ms) queue up behind it, tanking device utilization and average waiting time.",
  },
  {
    topicId: "cpu-scheduling",
    subjectId: "os",
    subtopic: "SJF & Shortest Remaining Time First (SRTF)",
    questionText: "Why is Shortest Job First (SJF) scheduling provably optimal for minimizing average waiting time?",
    options: [
      "Because it executes long processes first to free memory",
      "Because placing shorter bursts earlier minimizes the waiting time contribution for all subsequent waiting processes",
      "Because it never requires context switches",
      "Because it uses lottery tickets for fair share allocation"
    ],
    correctAnswerIndex: 1,
    difficulty: "medium",
    explanation: "In any sequence of waiting jobs, moving a shorter job ahead of a longer job decreases the waiting time of the shorter job by the longer job's burst, while only increasing the longer job's wait by the shorter burst, giving a net reduction in total waiting time.",
  },
  {
    topicId: "cpu-scheduling",
    subjectId: "os",
    subtopic: "Round Robin & Time Quantum Sizing",
    questionText: "What happens if the Time Quantum `Q` in Round Robin scheduling is set to an infinitesimally small value (e.g. 1 nanosecond)?",
    options: [
      "The CPU achieves 100% throughput and instantaneous response time",
      "The system suffers massive overhead from constant context switching, spending nearly all CPU cycles on register saving/loading rather than useful work",
      "The scheduling algorithm degenerates into FCFS",
      "Deadlock occurs immediately"
    ],
    correctAnswerIndex: 1,
    difficulty: "easy",
    explanation: "A context switch takes CPU cycles to save registers, flush TLB caches, and reload process states. If `Q` is tiny, context switch latency dwarfs actual process execution time.",
  },

  // ─── VIRTUAL MEMORY PAGING QUESTIONS (os -> virtual-memory-paging) ─────────
  {
    topicId: "virtual-memory-paging",
    subjectId: "os",
    subtopic: "Page Replacement (FIFO, LRU, Belady's Anomaly)",
    questionText: "What is Belady's Anomaly in operating systems?",
    options: [
      "Increasing CPU speed causes more page faults",
      "In FIFO page replacement, increasing the number of allocated physical page frames can paradoxically increase the total number of page faults",
      "LRU page replacement performing worse than random eviction",
      "A thread deadlocking on its own recursive mutex lock"
    ],
    correctAnswerIndex: 1,
    difficulty: "medium",
    explanation: "Laszlo Belady proved that with FIFO page replacement on certain reference strings (e.g. 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5), allocating 4 frames results in 10 page faults while 3 frames results in only 9 page faults.",
  },
  {
    topicId: "virtual-memory-paging",
    subjectId: "os",
    subtopic: "Translation Lookaside Buffer (TLB)",
    questionText: "Given a TLB access time of 10ns, Main Memory access time of 100ns, and a TLB Hit Ratio of 90%, what is the Effective Access Time (EAT) for a single-level page table?",
    options: [
      "120 ns",
      "100 ns",
      "190 ns",
      "119 ns"
    ],
    correctAnswerIndex: 0,
    difficulty: "hard",
    explanation: "Hit EAT = 10ns (TLB) + 100ns (Memory) = 110ns. Miss EAT = 10ns (TLB) + 100ns (Page Table) + 100ns (Data) = 210ns. EAT = 0.90 * 110 + 0.10 * 210 = 99 + 21 = 120 ns.",
  },

  // ─── TCP HANDSHAKE QUESTIONS (cn -> tcp-handshake) ─────────────────────────
  {
    topicId: "tcp-handshake",
    subjectId: "cn",
    subtopic: "SYN / SYN-ACK / ACK Mechanics",
    questionText: "During the TCP 3-Way Handshake, if Client sends `SYN (Seq = 500)`, what are the exact values of `Seq` and `Ack` in the Server's `SYN-ACK` response?",
    options: [
      "Seq = 500, Ack = 501",
      "Seq = Server_ISN (e.g. 800), Ack = 501",
      "Seq = 501, Ack = 800",
      "Seq = Server_ISN (e.g. 800), Ack = 500"
    ],
    correctAnswerIndex: 1,
    difficulty: "medium",
    explanation: "The server generates its own Initial Sequence Number (e.g. `Seq = 800`) and acknowledges the client's SYN byte by setting `Ack = Client_Seq + 1 = 501`.",
  },
  {
    topicId: "tcp-handshake",
    subjectId: "cn",
    subtopic: "TIME_WAIT State & SYN Flood Attacks",
    questionText: "Why does the client endpoint transition into the `TIME_WAIT` state for 2 * MSL (Maximum Segment Lifetime) before closing a TCP connection?",
    options: [
      "To wait for the CPU to cool down",
      "To ensure the final ACK reached the server, and to ensure any lingering delayed packets on the network expire without corrupting future new connections on the same port",
      "Because the server requires 2 minutes to reboot",
      "To encrypt the finished data stream"
    ],
    correctAnswerIndex: 1,
    difficulty: "medium",
    explanation: "If the client's final ACK was dropped by the network, the server will retransmit FIN. The client must stay in TIME_WAIT to resend ACK. Furthermore, waiting 2 * MSL guarantees all old packets in the network are dropped before a new connection reuses the same socket tuple.",
  },

  // ─── SOLID PRINCIPLES QUESTIONS (oops -> solid-principles) ─────────────────
  {
    topicId: "solid-principles",
    subjectId: "oops",
    subtopic: "Liskov Substitution (LSP)",
    questionText: "Why is having class `Square` inherit from `Rectangle` and overriding `setWidth(w)` to also change height considered a classic violation of the Liskov Substitution Principle (LSP)?",
    options: [
      "Because Square has fewer lines of code than Rectangle",
      "Because client functions expecting a Rectangle assume modifying width does NOT mutate height; passing a Square breaks these behavioral invariants",
      "Because inheritance is forbidden in C++",
      "Because Square is an abstract class"
    ],
    correctAnswerIndex: 1,
    difficulty: "medium",
    explanation: "LSP states that any function designed to accept a base type `Rectangle` must behave correctly without unexpected side-effects when passed a subtype `Square`. Mutating width changing height breaks caller assumptions that `rect.setWidth(5); rect.setHeight(10); assert(rect.getArea() == 50)` holds.",
  },
  {
    topicId: "solid-principles",
    subjectId: "oops",
    subtopic: "Dependency Inversion (DIP)",
    questionText: "What is the core recommendation of the Dependency Inversion Principle (DIP)?",
    options: [
      "Low-level modules should dictate how high-level modules are designed",
      "High-level business logic modules and low-level detail modules should both depend upon shared Abstractions (interfaces), not concrete implementations",
      "Functions should never accept more than 2 parameters",
      "Every class must be declared as static"
    ],
    correctAnswerIndex: 1,
    difficulty: "easy",
    explanation: "DIP states that high-level policy (e.g. Order Processing) should not directly instantiate or depend on low-level details (e.g. MySQLDatabaseDriver or SmtpEmailClient); both should depend on interfaces/abstractions, allowing seamless swapping of implementations via Dependency Injection.",
  }
];
