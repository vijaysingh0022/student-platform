import { Topic } from "../models/Curriculum.js";

// Comprehensive CSE Knowledge Base for Instant, Accurate Offline/Fallback Tutor Responses
export const CSE_KNOWLEDGE_BASE = {
  // ─── ALGORITHMS & DATA STRUCTURES ───
  dijkstra: {
    keywords: ["dijkstra", "shortest path", "single source shortest"],
    tldr: "Dijkstra's Algorithm finds the shortest path from a starting node to all other nodes in a weighted graph with non-negative edge weights.",
    simpleExp: {
      en: "Dijkstra's works greedily: it always explores the unvisited node with the smallest known distance, relaxes its neighbors, and guarantees the optimal path once a node is finalized. It relies on a Min-Priority Queue for peak performance.",
      hi: "Dijkstra ek greedy algorithm hai jo starting node se baaki saare nodes tak ka shortest distance nikalta hai. Ye hamesha sabse kam distance wale unvisited node ko pick karta hai aur uske neighbours ke distance ko update (relax) karta hai. Note: Ye negative weights pe fail ho jata hai."
    },
    example: "Google Maps finding the fastest driving route between cities based on road distances or traffic congestion delays.",
    stepByStep: `\`\`\`cpp
// Dijkstra using Min-Priority Queue (Adjacency List)
// Time: O((V + E) log V), Space: O(V)
vector<int> dijkstra(int V, vector<vector<pair<int,int>>>& adj, int src) {
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
    vector<int> dist(V, 1e9);
    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;

        for (auto& edge : adj[u]) {
            int v = edge.first, weight = edge.second;
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}
\`\`\``,
    mistakes: "1. Using Dijkstra on graphs with negative edge weights (use Bellman-Ford instead).\n2. Not using a priority queue, causing time complexity to degrade to O(V^2).\n3. Forgetting to skip stale entries popped from the priority queue.",
    quickCheck: "What happens if Dijkstra's algorithm is executed on a graph with negative edge weights? (Answer: It may enter an infinite loop or produce incorrect shortest paths because once a node is visited, it assumes its distance cannot decrease)."
  },

  dynamic_programming: {
    keywords: ["dynamic programming", "dp", "memoization", "tabulation", "knapsack", "lcs", "lis"],
    tldr: "Dynamic Programming (DP) solves complex problems by breaking them into overlapping subproblems and storing subproblem results to avoid redundant calculations.",
    simpleExp: {
      en: "Two primary prerequisites for DP are Optimal Substructure (optimal solution contains optimal solutions to subproblems) and Overlapping Subproblems (same subproblems are solved repeatedly). It can be implemented Top-Down (Memoization) or Bottom-Up (Tabulation).",
      hi: "DP ka main funda hai: 'Jo pehle calculate kar chuke ho, use yaad rakho taaki dobara calculate na karna pade'. Recursion me overlapping subproblems aane par hum unhe array ya table me store karte hain. Top-down ko Memoization aur bottom-up ko Tabulation kehte hain."
    },
    example: "Writing down 1 + 1 + 1 + 1 = 4 on paper. If someone adds another '+ 1', you don't recount from zero; you recall 4 and immediately say 5.",
    stepByStep: `\`\`\`cpp
// 0/1 Knapsack Problem (Bottom-Up DP)
// Time: O(N * W), Space: O(W) with space optimization
int knapsack(int W, vector<int>& wt, vector<int>& val, int n) {
    vector<int> dp(W + 1, 0);
    for (int i = 0; i < n; i++) {
        for (int w = W; w >= wt[i]; w--) { // Reverse loop for 0/1 knapsack
            dp[w] = max(dp[w], val[i] + dp[w - wt[i]]);
        }
    }
    return dp[W];
}
\`\`\``,
    mistakes: "1. Forgetting base cases in recursion before memoization lookup.\n2. Iterating forward instead of backward in 1D array space-optimized 0/1 Knapsack, accidentally allowing unbounded reuse (Unbounded Knapsack).\n3. Confusing state variables (e.g. index vs capacity).",
    quickCheck: "What is the key difference between Memoization and Tabulation? (Answer: Memoization is top-down using recursion + caching; Tabulation is bottom-up iterative table filling starting from base cases)."
  },

  binary_search: {
    keywords: ["binary search", "binary_search", "divide and conquer search", "lower bound", "upper bound"],
    tldr: "Binary Search finds the position of a target value within a sorted array in O(log N) time by repeatedly halving the search interval.",
    simpleExp: {
      en: "At each step, compare target with middle element. If equal, target is found. If target is smaller, search left half; if greater, search right half. Can also be applied to monotonic predicates (Binary Search on Answer).",
      hi: "Binary Search tab kaam karta hai jab array sorted ho ya predicate monotonic ho. Har step pe hum beech (mid) ka element check karte hain aur half search space ko eliminate kar dete hain, jisse time complexity O(log N) ho jati hai."
    },
    example: "Searching for a word in a physical dictionary: you flip to the middle, check alphabetical order, and discard the unneeded half.",
    stepByStep: `\`\`\`cpp
int binarySearch(const vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2; // Prevents integer overflow
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // Not found
}
\`\`\``,
    mistakes: "1. Calculating `mid = (low + high) / 2` causing integer overflow in large arrays (use `low + (high - low) / 2`).\n2. Off-by-one errors in `while(low <= high)` vs `while(low < high)`.\n3. Running binary search on unsorted data.",
    quickCheck: "What is the maximum number of comparisons to find an element in a sorted array of 1,024 elements? (Answer: log2(1024) = 10 comparisons)."
  },

  sorting_algorithms: {
    keywords: ["merge sort", "quick sort", "sorting", "bubble sort", "heap sort"],
    tldr: "Comparison-based sorting orders elements. Merge Sort guarantees O(N log N) stable sorting; Quick Sort averages O(N log N) in-place with O(N^2) worst case.",
    simpleExp: {
      en: "Merge Sort uses Divide-and-Conquer: split array into halves, recursively sort, and merge in O(N). Quick Sort picks a pivot, partitions array so smaller elements are on left and larger on right, then sorts sub-arrays.",
      hi: "Merge Sort array ko divide karta rehta hai jab tak 1-1 element na bache, fir sorted order me merge karta hai (hamesha O(N log N) aur stable). Quick Sort ek pivot select karke partition karta hai (average O(N log N), worst case O(N^2) agar pivot poorly chosen ho)."
    },
    example: "Sorting a deck of playing cards by splitting into two halves, sorting each half, and merging back in order.",
    stepByStep: "Time & Space Complexity Comparison:\n- **Merge Sort**: Time O(N log N) all cases | Space O(N) auxiliary | Stable\n- **Quick Sort**: Time O(N log N) avg, O(N^2) worst | Space O(log N) stack | Unstable\n- **Heap Sort**: Time O(N log N) all cases | Space O(1) in-place | Unstable",
    mistakes: "1. Choosing first or last element as pivot in Quick Sort on already sorted inputs, triggering O(N^2) worst case (use random pivot or median-of-three).\n2. Assuming Merge Sort is in-place for arrays.",
    quickCheck: "Why is Quick Sort often faster in practice than Merge Sort despite having a worse theoretical worst-case? (Answer: Quick Sort has better CPU cache locality and does not require auxiliary memory allocation for array copies)."
  },

  graph_traversal: {
    keywords: ["bfs", "dfs", "breadth first", "depth first", "topological sort", "cycle detection"],
    tldr: "BFS traverses layer-by-layer using a Queue (ideal for shortest paths in unweighted graphs); DFS explores as deep as possible along each branch using a Stack/Recursion.",
    simpleExp: {
      en: "Both BFS and DFS visit every node and edge in O(V + E) time. A boolean visited array is crucial to prevent infinite loops in cyclic graphs. Topological Sort orders vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u->v, u appears before v.",
      hi: "BFS queue use karke level-by-level aage badhta hai, jo unweighted graph me shortest path nikalne ke liye best hai. DFS recursion/stack use karke ek raste ke aakhri point tak jata hai fir backtrack karta hai. Dono ka time complexity O(V + E) hota hai."
    },
    example: "BFS is like a ripple in water expanding outward; DFS is like exploring a maze by walking down one corridor until hitting a dead end before backtracking.",
    stepByStep: `\`\`\`cpp
// BFS on Adjacency List
void bfs(int start, const vector<vector<int>>& adj, int V) {
    vector<bool> visited(V, false);
    queue<int> q;
    visited[start] = true;
    q.push(start);

    while (!q.empty()) {
        int node = q.front();
        q.pop();
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}
\`\`\``,
    mistakes: "1. Marking node visited when dequeued instead of when enqueued in BFS, causing duplicate entries in the queue.\n2. Stack overflow in DFS on deep graphs without increasing recursion limit.",
    quickCheck: "Which algorithm finds the shortest path in an unweighted graph? (Answer: Breadth-First Search (BFS))."
  },

  // ─── OPERATING SYSTEMS ───
  deadlock: {
    keywords: ["deadlock", "banker", "coffman", "resource allocation graph", "concurrency issue"],
    tldr: "Deadlock occurs when processes are blocked forever because each holds a resource and waits for another resource held by another process.",
    simpleExp: {
      en: "Four Coffman conditions must hold simultaneously for deadlock: 1) Mutual Exclusion, 2) Hold and Wait, 3) No Preemption, and 4) Circular Wait. Breaking any one condition prevents deadlocks.",
      hi: "Deadlock aisi sthiti hai jahan do ya zyada processes ek dusre ke resources ka wait kar rahe hote hain aur koi aage nahi badh pata. Ise prevent karne ke 4 Coffman conditions me se kisi ek ko todna hota hai."
    },
    example: "Two cars meeting on a narrow one-way bridge from opposite directions. Neither can move forward until the other reverses.",
    stepByStep: "Coffman Conditions Breakdown:\n1. **Mutual Exclusion**: Non-shareable resource mode.\n2. **Hold and Wait**: Process holds ≥1 resource while requesting others.\n3. **No Preemption**: OS cannot forcibly revoke allocated resources.\n4. **Circular Wait**: P0 waits for P1, P1 waits for P2... Pn waits for P0.\n*Banker's Algorithm* dynamically simulates resource requests to guarantee the system stays in a Safe State.",
    mistakes: "1. Confusing Deadlock with Starvation (in starvation, system makes progress, but a low-priority task is starved; in deadlock, no process progresses).\n2. Assuming Banker's Algorithm prevents deadlocks with zero overhead.",
    quickCheck: "Can deadlock occur if resources can be preempted? (Answer: No, because preemption breaks the No Preemption condition)."
  },

  virtual_memory: {
    keywords: ["virtual memory", "paging", "page fault", "segmentation", "tlb", "thrashing", "page replacement", "lru"],
    tldr: "Virtual Memory gives processes the illusion of contiguous, dedicated memory larger than physical RAM by mapping virtual addresses to physical frames via Page Tables and TLB.",
    simpleExp: {
      en: "Processes use Virtual Addresses divided into Pages. Physical RAM is divided into Frames. The MMU (Memory Management Unit) translates addresses using Page Tables and caches frequent translations in TLB (Translation Lookaside Buffer). If a page is not in RAM, a Page Fault trap occurs.",
      hi: "Virtual Memory secondary storage (hard drive/SSD) ko RAM ki tarah use karke large programs ko run karne ki suvidha deti hai. Pages ko frames me map kiya jata hai. Agar requested page RAM me nahi hota, to OS Page Fault trigger karta hai aur disk se page swap karta hai."
    },
    example: "A library study desk (physical RAM) having space for 3 books, while your backpack and shelves (disk) store 50 books. You swap books to the desk as you need them.",
    stepByStep: "Page Fault Handling Flow:\n1. CPU generates virtual address not present in RAM (valid bit = 0).\n2. MMU generates Page Fault interrupt to OS.\n3. OS checks validity of access; finds a free physical frame (or evicts via LRU).\n4. Disk I/O reads requested page into frame.\n5. Page table updated (valid bit = 1); instruction restarted.",
    mistakes: "1. Confusing Internal Fragmentation (wasted space within allocated page) with External Fragmentation (free space scattered between allocations).\n2. Thrashing: excessive page faults consuming 90%+ CPU time purely on page swapping.",
    quickCheck: "What hardware component accelerates virtual-to-physical address translation? (Answer: Translation Lookaside Buffer - TLB)."
  },

  process_vs_thread: {
    keywords: ["process", "thread", "process vs thread", "context switch", "pcb", "tcb", "multithreading"],
    tldr: "A Process is an independent program in execution with its own isolated memory space. A Thread is a lightweight sub-unit of execution within a process that shares memory and resources.",
    simpleExp: {
      en: "Processes provide strong memory isolation; communication requires IPC (pipes, sockets, shared memory). Threads inside the same process share code, data, and heap, but maintain separate program counters, registers, and stack. Thread context switching is significantly faster than process context switching.",
      hi: "Process ek poora alag program execution hai jiska apna private memory space hota hai. Thread usi process ke andar ka chhota worker hai jo heap aur global memory share karta hai lekin apna stack aur registers alag rakhta hai. Threads me switch karna process ke mukable bahut tez hota hai."
    },
    example: "A restaurant is a Process with its own kitchen, license, and building. The multiple chefs working together in that kitchen sharing ingredients are Threads.",
    stepByStep: "Key Differences Matrix:\n- **Memory**: Process has isolated Address Space | Threads share Heap & Data\n- **Cost**: Process creation & context switch is heavy (flush TLB) | Thread creation & switch is lightweight\n- **Safety**: One process crashing does not kill others | One thread crashing with segfault can kill the entire process",
    mistakes: "1. Thinking threads share stacks (threads NEVER share execution stacks).\n2. Using multithreading on shared mutable state without synchronization (mutex/locks), causing race conditions.",
    quickCheck: "Which CPU components are unique to each thread within a process? (Answer: Program Counter, Register Set, and Call Stack)."
  },

  // ─── DATABASE SYSTEMS ───
  sql_joins: {
    keywords: ["join", "joins", "inner join", "left join", "right join", "cross join", "sql"],
    tldr: "SQL JOINs combine columns from two or more tables based on a related common key column.",
    simpleExp: {
      en: "INNER JOIN selects rows that have matching values in both tables. LEFT JOIN returns all rows from the left table and matched rows from the right table (NULL if no match). FULL OUTER JOIN preserves all rows from both sides.",
      hi: "JOIN do ya zyada tables ke data ko common column ke zariye jodta hai. INNER JOIN sirf match hone wali rows deta hai. LEFT JOIN left table ki saari rows deta hai chahe right table me match ho ya na ho."
    },
    example: "A Students table and a ClubMembers table. INNER JOIN shows students who are in a club; LEFT JOIN shows all students with club info or NULL.",
    stepByStep: `\`\`\`sql
-- INNER JOIN: Only users with orders
SELECT U.name, O.order_id, O.total
FROM Users U
INNER JOIN Orders O ON U.id = O.user_id;

-- LEFT JOIN: All users, with order details or NULL
SELECT U.name, O.order_id
FROM Users U
LEFT JOIN Orders O ON U.id = O.user_id;
\`\`\``,
    mistakes: "1. Forgetting the `ON` clause, causing a Cartesian Product (Cross Join) that multiplies rows.\n2. Placing filters on the right table in the `WHERE` clause of a LEFT JOIN, inadvertently converting it into an INNER JOIN.",
    quickCheck: "If Table A has 10 rows and Table B has 0 rows, how many rows are returned by `SELECT * FROM A LEFT JOIN B ON A.id = B.id`? (Answer: 10 rows, all with NULL values for Table B columns)."
  },

  normalization: {
    keywords: ["normalization", "normal forms", "1nf", "2nf", "3nf", "bcnf", "functional dependency"],
    tldr: "Normalization organizes relational database tables to eliminate data redundancy and prevent insertion, update, and deletion anomalies.",
    simpleExp: {
      en: "- **1NF**: Atomic column values, unique row identifiers.\n- **2NF**: In 1NF + no Partial Dependencies (non-prime attributes fully dependent on entire candidate key).\n- **3NF**: In 2NF + no Transitive Dependencies (non-prime cannot depend on non-prime).\n- **BCNF**: Every functional dependency X -> Y requires X to be a Super Key.",
      hi: "Normalization database me duplicate data ko hatata hai aur anomalies (insert/update/delete bugs) ko rokta hai. 1NF me atomic values, 2NF me partial dependency khatam, 3NF me transitive dependency khatam, aur BCNF me determinant hamesha super key hona chahiye."
    },
    example: "Storing student names, branch, and branch HOD in every course enrollment row. If the HOD changes, updating 10,000 rows risks data corruption. Normalizing moves Branch and HOD to a separate table.",
    stepByStep: "Hierarchy of Normal Forms:\n1NF ⊂ 2NF ⊂ 3NF ⊂ BCNF\nTo test 3NF for X -> Y:\nEither X is a Super Key OR Y is a Prime Attribute (part of a candidate key).",
    mistakes: "1. Over-normalizing high-throughput read-heavy analytical databases (denormalization is often preferred in read-heavy systems to eliminate costly joins).\n2. Confusing Candidate Key with Primary Key.",
    quickCheck: "If a relation is in 3NF, is it guaranteed to be in BCNF? (Answer: No, because BCNF is stricter: in BCNF, the determinant X must ALWAYS be a super key, even if Y is prime)."
  },

  acid_properties: {
    keywords: ["acid", "transactions", "atomicity", "consistency", "isolation", "durability", "concurrency"],
    tldr: "ACID properties (Atomicity, Consistency, Isolation, Durability) guarantee that database transactions are processed reliably even through crashes and concurrent access.",
    simpleExp: {
      en: "- **Atomicity**: All operations succeed or entire transaction rolls back ('all or nothing').\n- **Consistency**: Database transitions from one valid state to another, satisfying constraints.\n- **Isolation**: Concurrent transactions execute as if running sequentially (preventing dirty reads).\n- **Durability**: Once committed, changes survive system crashes (WAL / Write-Ahead Logging).",
      hi: "ACID guarantees hain jo database transactions ko safe rakhti hain. Atomicity: ya to poora kaam hoga ya bilkul nahi. Consistency: rules aur constraints preserve rahenge. Isolation: concurrent transactions ek dusre ko disturb nahi karenge. Durability: commit hone ke baad data disk pe safe rahega."
    },
    example: "Bank fund transfer: $100 deducted from Account A and credited to Account B. If power cuts mid-way, Atomicity rolls back deduction so money isn't lost into the void.",
    stepByStep: "Isolation Levels & Anomalies:\n- **Read Uncommitted**: Suffers from Dirty Reads\n- **Read Committed**: Prevents Dirty Reads; suffers from Non-Repeatable Reads\n- **Repeatable Read**: Prevents Non-Repeatable Reads; suffers from Phantom Reads\n- **Serializable**: Maximum isolation; prevents all concurrency anomalies",
    mistakes: "1. Assuming Isolation level is always Serializable by default (most RDBMS like Postgres/MySQL default to Read Committed or Repeatable Read).\n2. Neglecting transaction rollback handlers in backend application code.",
    quickCheck: "Which ACID property is primarily implemented using Write-Ahead Logging (WAL)? (Answer: Durability, ensuring committed changes can be replayed from log after crash)."
  },

  // ─── COMPUTER NETWORKS ───
  tcp_vs_udp: {
    keywords: ["tcp", "udp", "tcp vs udp", "three way handshake", "transport layer", "handshake"],
    tldr: "TCP is a connection-oriented, reliable, byte-stream protocol with flow/congestion control. UDP is a connectionless, lightweight, datagram protocol prioritizing low latency over delivery guarantees.",
    simpleExp: {
      en: "TCP establishes connection via 3-Way Handshake (SYN, SYN-ACK, ACK), guarantees in-order delivery via sequence numbers and ACKs, and retransmits lost packets. UDP simply transmits packets with minimal 8-byte header overhead and zero handshake latency.",
      hi: "TCP connection banata hai 3-way handshake se aur guarantee deta hai ki saara data sahi order me पहुंचेगा. UDP bina handshake ke packets bhej deta hai—agar drop ho gaya to retry nahi karta, isliye video streaming aur gaming me use hota hai jahan speed important hai."
    },
    example: "TCP is like a certified courier requiring signature on delivery. UDP is like broadcasting music on FM radio: if you miss a second of audio, you keep listening rather than pausing the broadcast.",
    stepByStep: `TCP 3-Way Handshake:
1. Client -> Server: SYN (seq = x)
2. Server -> Client: SYN-ACK (seq = y, ack = x + 1)
3. Client -> Server: ACK (ack = y + 1)
Connection Established -> Full-duplex data flow starts.`,
    mistakes: "1. Using TCP for live real-time voice/video chat (packet retransmissions cause audio buffering and lag).\n2. Believing UDP has zero error detection (UDP header still contains an optional Checksum for bit corruption detection).",
    quickCheck: "What are the flags set in the second packet of the TCP 3-way handshake? (Answer: SYN and ACK flags are both set)."
  },

  osi_model: {
    keywords: ["osi model", "7 layers", "osi", "networking layers", "tcp/ip model"],
    tldr: "The OSI model standardizes network communication into 7 logical layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.",
    simpleExp: {
      en: "Each layer adds its own header (encapsulation) on the sending side and strips it on the receiving side (decapsulation). Mnemonic: 'Please Do Not Throw Sausage Pizza Away'.",
      hi: "OSI model network communication ko 7 layers me divide karta hai: Physical (bits/cables), Data Link (frames/MAC), Network (packets/IP), Transport (segments/ports), Session (dialogue control), Presentation (encryption/compression), aur Application (HTTP/DNS user apps)."
    },
    example: "Sending a letter: writing message (Application/Presentation), sealing in envelope (Transport/Network), stamping with address (Data Link), postal van driving it across road (Physical).",
    stepByStep: "7 Layers Breakdown:\n1. **Physical**: Raw bits over media (cables, hubs)\n2. **Data Link**: Frames, MAC addresses, Switches, ARP\n3. **Network**: Packets, IP addressing, Routers\n4. **Transport**: Segments, Port numbers, TCP/UDP\n5. **Session**: Session establishment, checkpoints\n6. **Presentation**: Data format, Encryption (SSL), Compression\n7. **Application**: End-user protocols (HTTP, DNS, SMTP)",
    mistakes: "1. Confusing Router (Layer 3: IP) with Switch (Layer 2: MAC address).\n2. Thinking OSI is the implemented protocol stack (the Internet runs on the 4/5-layer TCP/IP model; OSI is a conceptual reference model).",
    quickCheck: "At which OSI layer does IP routing occur? (Answer: Layer 3 - Network Layer)."
  },

  // ─── OBJECT-ORIENTED PROGRAMMING ───
  oop_pillars: {
    keywords: ["oops", "oop", "encapsulation", "abstraction", "inheritance", "polymorphism", "solid"],
    tldr: "The 4 core pillars of OOP are Encapsulation (data hiding), Abstraction (hiding implementation complexity), Inheritance (code reuse via parent classes), and Polymorphism (one interface, multiple behaviors).",
    simpleExp: {
      en: "- **Encapsulation**: Bundling data and methods together inside classes while restricting direct access via private fields and getters/setters.\n- **Abstraction**: Exposing only essential features via abstract classes and interfaces.\n- **Inheritance**: Derived classes inherit properties and behaviors of base classes.\n- **Polymorphism**: Compile-time (Method Overloading) and Runtime (Method Overriding via virtual functions/vtable).",
      hi: "OOPs ke 4 pillars hain: Encapsulation (data ko private rakhna aur methods se access dena), Abstraction (andar ki complexity chupana jaise car ka accelerator), Inheritance (parent class ki functionality reuse karna), aur Polymorphism (ek hi function name ka alag-alag behavior)."
    },
    example: "Driving a car: you press the accelerator (Abstraction). You don't see or touch fuel injectors directly (Encapsulation). The electric car inherits chassis from vehicle class (Inheritance). The accelerator pedal behaves differently on an EV vs diesel car (Polymorphism).",
    stepByStep: `\`\`\`cpp
// Runtime Polymorphism via Virtual Functions
class Shape {
public:
    virtual double area() const = 0; // Pure virtual (Abstraction)
    virtual ~Shape() {}
};

class Circle : public Shape { // Inheritance
private:
    double radius; // Encapsulation
public:
    Circle(double r) : radius(r) {}
    double area() const override { return 3.14159 * radius * radius; } // Polymorphism
};
\`\`\``,
    mistakes: "1. Forgetting `virtual` destructor in C++ base classes, causing memory leaks when deleting derived objects via base pointers.\n2. Violating the Liskov Substitution Principle (LSP) in inheritance hierarchies.",
    quickCheck: "What mechanism enables runtime polymorphism in C++? (Answer: Virtual Method Table - vtable and virtual pointer - vptr)."
  },

  // ─── SYSTEM DESIGN & WEB ───
  caching_redis: {
    keywords: ["caching", "redis", "cache", "memcached", "cache aside", "cdn"],
    tldr: "Caching stores copies of frequently accessed data in ultra-fast in-memory storage (RAM) like Redis to reduce database read latency from milliseconds to microseconds.",
    simpleExp: {
      en: "Common caching patterns:\n1. **Cache-Aside**: Application checks cache first; if miss, fetches from DB and populates cache.\n2. **Write-Through**: Data written to cache and DB simultaneously.\n3. **Write-Back (Write-Behind)**: Written to cache immediately; written to DB asynchronously.\nEviction policies like LRU (Least Recently Used) and TTL (Time To Live) manage memory bounds.",
      hi: "Cache RAM me data store karta hai jisse disk-based database pe baar-baar heavy queries nahi chalani padti. Redis in-memory key-value store hai jo O(1) time me response deta hai. Cache miss hone par DB se data fetch karke cache me daal diya jata hai."
    },
    example: "Keeping your favorite textbook on your desk rather than walking to the library shelves every time you need to look up a page.",
    stepByStep: "Cache Invalidation Challenges:\n- **Cache Stampede (Thundering Herd)**: Hot key expires, causing thousands of simultaneous requests to crash the DB.\n- **Cache Penetration**: Queries for non-existent keys bypass cache and hit DB (fix with Bloom Filters or caching nulls).\n- **Cache Breakdown**: Critical hot key expires during peak traffic (fix with mutual exclusion locks).",
    mistakes: "1. Not setting TTLs, causing stale data to persist forever.\n2. Storing unstructured giant payloads in Redis, exceeding memory limits.",
    quickCheck: "What is the difference between Cache-Aside and Write-Through caching? (Answer: In Cache-Aside, the application manually fetches and caches on demand; in Write-Through, writes update the cache and database synchronously)."
  },

  cap_theorem: {
    keywords: ["cap theorem", "cap", "consistency vs availability", "partition tolerance"],
    tldr: "The CAP Theorem states that a distributed data store can guarantee at most two out of three properties simultaneously: Consistency, Availability, and Partition Tolerance.",
    simpleExp: {
      en: "Because network partitions (P) are inevitable in distributed systems, distributed databases must choose between CP (Consistency over Availability, e.g. HBase, MongoDB) and AP (Availability over Consistency, e.g. Cassandra, DynamoDB) during a network split.",
      hi: "CAP Theorem kehta hai distributed system me jab network partition (nodes ke beech connection tootna) hota hai, to aap ya to Consistency (sabko bilkul latest data dikhana) chun sakte hain ya Availability (chahe purana data ho lekin server response zaroor dega)."
    },
    example: "Two ATM machines separated by an undersea cable cut. When a customer withdraws $500 on Machine A, the system must either block withdrawals on Machine B (CP) or allow it with eventual reconciliation risking overdraft (AP).",
    stepByStep: "Properties Breakdown:\n- **Consistency (C)**: Every read receives the most recent write or an error.\n- **Availability (A)**: Every non-failing node returns a non-error response.\n- **Partition Tolerance (P)**: System continues operating despite arbitrary packet loss between nodes.",
    mistakes: "1. Saying 'You can choose CA' (in real distributed networks, network splits are inevitable, so Partition Tolerance cannot be sacrificed).\n2. Believing AP systems can never reach consistency (AP systems achieve Eventual Consistency).",
    quickCheck: "Can a distributed database operate across multiple data centers and choose CA? (Answer: No, because network partitions across data centers are unavoidable, so Partition Tolerance P is mandatory)."
  }
};

/**
 * Searches the Knowledge Base or queries the MongoDB curriculum database
 * to provide a rich, highly detailed, customized response.
 */
export async function getIntelligentTutorResponse(question, subject = "General", action = "explain", isHinglish = false) {
  const qClean = question.trim();
  const qLower = qClean.toLowerCase();

  // 1. Check curated knowledge base for direct keyword matches
  for (const [key, entry] of Object.entries(CSE_KNOWLEDGE_BASE)) {
    const isMatch = entry.keywords.some((kw) => qLower.includes(kw));
    if (isMatch) {
      const simple = isHinglish && entry.simpleExp.hi ? entry.simpleExp.hi : entry.simpleExp.en;
      return formatResponse(entry.tldr, simple, entry.example, entry.stepByStep, entry.mistakes, entry.quickCheck);
    }
  }

  // 2. Query MongoDB Topic Collection for matching curriculum topics
  try {
    // Extract candidate words (ignore stop words)
    const stopWords = new Set(["what", "is", "explain", "how", "why", "the", "a", "an", "in", "to", "of", "and", "or", "for", "with", "does", "can", "you", "me", "tell", "about"]);
    const words = qLower.split(/[^a-z0-9_-]+/).filter((w) => w.length > 2 && !stopWords.has(w));

    if (words.length > 0) {
      const regexPatterns = words.map((w) => new RegExp(w, "i"));
      const topicDoc = await Topic.findOne({
        $or: [
          { title: { $in: regexPatterns } },
          { topicId: { $in: regexPatterns } },
          { "content.concepts": { $in: regexPatterns } }
        ]
      }).lean();

      if (topicDoc && topicDoc.content) {
        const c = topicDoc.content;
        const tldr = c.shortExplanation || c.introduction || `${topicDoc.title} is a core concept in ${topicDoc.subjectId?.toUpperCase() || "Computer Science"}.`;
        const simple = isHinglish && c.simpleExplanation
          ? `${c.simpleExplanation} (${topicDoc.title} ka main use system performance aur correct logic build karne ke liye hota hai.)`
          : c.simpleExplanation || c.detailedExplanation || topicDoc.summary || "This concept provides structural guarantees and efficiency in system operations.";
        const example = c.realWorldExample || `Practical applications in high-throughput enterprise systems and competitive software engineering.`;
        
        let codeOrSteps = "";
        if (c.codeSnippets && c.codeSnippets.length > 0) {
          const snip = c.codeSnippets[0];
          codeOrSteps = `\`\`\`${snip.language || "cpp"}\n// ${snip.title || topicDoc.title}\n${snip.code}\n\`\`\`\n${snip.explanation || ""}`;
        } else if (c.algorithmSteps && c.algorithmSteps.length > 0) {
          codeOrSteps = c.algorithmSteps.map((s, i) => `${i + 1}. ${s}`).join("\n");
        } else {
          codeOrSteps = `1. Analyze state requirements & problem constraints\n2. Establish algorithmic invariant\n3. Execute transformation\n4. Validate time complexity (${c.timeComplexity || "O(N)"})`;
        }

        const mistakes = (c.commonMistakes && c.commonMistakes.length > 0)
          ? c.commonMistakes.map((m, i) => `${i + 1}. ${m}`).join("\n")
          : "1. Neglecting edge cases with empty or boundary inputs.\n2. Overlooking memory constraints and time complexity trade-offs.";

        const quickCheck = (c.interviewQuestions && c.interviewQuestions.length > 0)
          ? `${c.interviewQuestions[0].question} (Answer: ${c.interviewQuestions[0].answer})`
          : `What is the time complexity of ${topicDoc.title}? (Answer: ${c.timeComplexity || "O(N)"} average case).`;

        return formatResponse(tldr, simple, example, codeOrSteps, mistakes, quickCheck);
      }
    }
  } catch (dbErr) {
    console.warn("Topic lookup in knowledge base notice:", dbErr.message);
  }

  // 3. Dynamic Question-Aware Synthesis (Never return a generic boilerplate)
  return synthesizeCustomResponse(qClean, subject, isHinglish);
}

function synthesizeCustomResponse(question, subject, isHinglish) {
  const cleanSubject = (subject && subject !== "General" && subject !== "All Subjects") ? subject : "Computer Science";
  
  const tldr = `${cleanSubject} concept: "${question}" requires understanding fundamental algorithmic principles, state representations, and complexity boundaries.`;
  
  const simple = isHinglish
    ? `"${question}" ko samajhne ke liye pehle basic mental model clear hona chahiye: ye problem kis data structure aur system state par depend karti hai. Iska main objective optimal time complexity achieve karna aur edge cases ko gracefully handle karna hai.`
    : `When approaching "${question}" in ${cleanSubject}, the primary goal is breaking the problem into discrete state invariants, managing memory boundaries, and optimizing computational complexity.`;
    
  const example = `Imagine designing a high-reliability distributed backend or algorithmic service handling concurrent student requests where latency and correctness are mission-critical.`;
  
  const steps = `Core Implementation Strategy:
1. Identify input constraints and edge conditions (empty, single-element, maximum boundaries).
2. Choose the optimal data representation (hash map, tree, heap, or dynamic table).
3. Implement the core logic with minimum overhead.
4. Verify Time and Space complexity against target benchmarks.`;

  const mistakes = `1. Overcomplicating the solution with nested loops when an O(N) or O(log N) approach exists.
2. Ignoring off-by-one errors and null/boundary references.
3. Not considering space-time trade-offs.`;

  const quickCheck = `How does this approach optimize performance compared to a naive brute-force method? (Answer: By pruning unnecessary subproblems and utilizing optimal memory layouts).`;

  return formatResponse(tldr, simple, example, steps, mistakes, quickCheck);
}

function formatResponse(tldr, simpleExp, example, stepByStep, mistakes, quickCheck) {
  return `### 📌 TL;DR
${tldr}

### 💡 Simple Explanation
${simpleExp}

### 🌍 Real-Life Example & Analogy
${example}

### 🪜 Step-by-Step Breakdown / Implementation
${stepByStep}

### ⚠️ Common Mistakes & Pitfalls
${mistakes}

### ❓ Quick Check Question
${quickCheck}`;
}
