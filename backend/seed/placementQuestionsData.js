export const PLACEMENT_SUBJECTS = [
  { id: "DSA", name: "Data Structures & Algorithms", code: "DSA", icon: "⚡", totalTopics: 6, description: "Arrays, Linked Lists, Trees, Graphs, DP, Sorting & Heaps" },
  { id: "DBMS", name: "Database Management Systems & SQL", code: "DBMS", icon: "🗄️", totalTopics: 5, description: "Normalization 1NF-BCNF, SQL Queries, Indexing & B+ Trees, ACID, Concurrency" },
  { id: "OS", name: "Operating Systems", code: "OS", icon: "💻", totalTopics: 5, description: "Process & Threads, CPU Scheduling, Synchronization, Deadlocks, Paging" },
  { id: "CN", name: "Computer Networks", code: "CN", icon: "🌐", totalTopics: 5, description: "OSI/TCP-IP Layers, TCP vs UDP, Subnetting, DNS/HTTP/HTTPS, TLS" },
  { id: "OOPS", name: "Object-Oriented Programming", code: "OOPS", icon: "🧩", totalTopics: 5, description: "4 Pillars, Polymorphism, SOLID Principles, Design Patterns, Interfaces" },
  { id: "SYSTEM_DESIGN", name: "System Design & LLD/HLD", code: "SYSTEM_DESIGN", icon: "📐", totalTopics: 5, description: "Scalability, Caching/Redis, Load Balancers, CAP Theorem, Microservices" },
  { id: "APTITUDE", name: "Quantitative Aptitude & Reasoning", code: "APTITUDE", icon: "🧠", totalTopics: 6, description: "Percentages, Time-Speed-Distance, Probability, Number Series, Syllogisms" },
  { id: "WEB_DEV", name: "Web Dev & Cloud Fundamentals", code: "WEB_DEV", icon: "☁️", totalTopics: 5, description: "JS Event Loop, REST APIs, JWT Auth, Git/GitHub, Docker & Cloud" },
  { id: "MACHINE_LEARNING", name: "Machine Learning & AI", code: "MACHINE_LEARNING", icon: "🤖", totalTopics: 5, description: "Supervised/Unsupervised Learning, Regression, Neural Networks, CNN/RNN, Model Evaluation" },
];

export const PLACEMENT_QUESTIONS = [
  // 1. DATA STRUCTURES & ALGORITHMS (DSA)
  { subject: "DSA", topic: "Arrays & Searching", questionText: "What is the worst-case time complexity of Binary Search on a sorted array of size N?", options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"], correctAnswerIndex: 1 },
  { subject: "DSA", topic: "Arrays & Searching", questionText: "In Kadane's Algorithm for finding maximum subarray sum, what is the time complexity?", options: ["O(N^2)", "O(N log N)", "O(N)", "O(1)"], correctAnswerIndex: 2 },
  { subject: "DSA", topic: "Linked Lists", questionText: "Floyd's Cycle-Finding Algorithm (Tortoise and Hare) detects a loop in a linked list using two pointers moving at speeds:", options: ["1 step and 2 steps", "1 step and 3 steps", "2 steps and 3 steps", "Both moving at 1 step from opposite ends"], correctAnswerIndex: 0 },
  { subject: "DSA", topic: "Stacks & Queues", questionText: "Which data structure is primarily used by compilers for syntax parsing and matching balanced parentheses?", options: ["Queue", "Stack", "Binary Heap", "Hash Table"], correctAnswerIndex: 1 },
  { subject: "DSA", topic: "Trees & BST", questionText: "Inorder traversal of a Binary Search Tree (BST) visits nodes in which sequence?", options: ["Random order", "Strictly sorted ascending order", "Descending order", "Level-by-level order"], correctAnswerIndex: 1 },
  { subject: "DSA", topic: "Trees & BST", questionText: "What is the minimum number of nodes in an AVL tree of height h (where h=0 is a single node)?", options: ["2^h - 1", "N(h) = N(h-1) + N(h-2) + 1", "2h + 1", "h^2"], correctAnswerIndex: 1 },
  { subject: "DSA", topic: "Graphs", questionText: "Dijkstra's Algorithm cannot correctly handle graphs containing which of the following?", options: ["Directed edges", "Cycles", "Negative edge weights", "Disconnected vertices"], correctAnswerIndex: 2 },
  { subject: "DSA", topic: "Graphs", questionText: "Which graph traversal is used to find the shortest path in an unweighted graph?", options: ["Depth First Search (DFS)", "Breadth First Search (BFS)", "Topological Sort", "Prim's Algorithm"], correctAnswerIndex: 1 },
  { subject: "DSA", topic: "Dynamic Programming", questionText: "What are the two essential characteristics of a problem that can be solved using Dynamic Programming?", options: ["Greedy Choice & Divide and Conquer", "Optimal Substructure & Overlapping Subproblems", "Randomization & Linear Scan", "Sorting & Hashing"], correctAnswerIndex: 1 },
  { subject: "DSA", topic: "Dynamic Programming", questionText: "What is the time complexity of solving the 0/1 Knapsack Problem with N items and capacity W using DP?", options: ["O(2^N)", "O(N * W)", "O(N + W)", "O(N^2)"], correctAnswerIndex: 1 },
  { subject: "DSA", topic: "Sorting & Heaps", questionText: "Which sorting algorithm is guaranteed to have O(N log N) worst-case time complexity and is in-place?", options: ["Merge Sort", "Quick Sort", "Heap Sort", "Bubble Sort"], correctAnswerIndex: 2 },
  { subject: "DSA", topic: "Sorting & Heaps", questionText: "In a Max-Heap with N elements, what is the time complexity to insert a new element and restore heap property?", options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"], correctAnswerIndex: 1 },

  // 2. DATABASE MANAGEMENT SYSTEMS (DBMS)
  { subject: "DBMS", topic: "Normalization", questionText: "A relation is in 2NF if and only if it is in 1NF and contains no:", options: ["Transitive dependency", "Partial functional dependency on candidate key", "Multivalued dependency", "Join dependency"], correctAnswerIndex: 1 },
  { subject: "DBMS", topic: "Normalization", questionText: "For a relational schema R to be in Boyce-Codd Normal Form (BCNF), for every functional dependency X → Y:", options: ["Y must be a prime attribute", "X must be a superkey", "X must be a primary key only", "R must have at most 3 attributes"], correctAnswerIndex: 1 },
  { subject: "DBMS", topic: "Indexing & B+ Trees", questionText: "Why are B+ Trees overwhelmingly preferred over Binary Search Trees in Database Storage Engines?", options: ["B+ trees use less memory", "High fanout minimizes expensive disk I/O and leaf nodes form a linked list for fast range scans", "Binary search trees are not balanced", "B+ trees store keys only in the root node"], correctAnswerIndex: 1 },
  { subject: "DBMS", topic: "Indexing & B+ Trees", questionText: "How many Clustered Indexes can exist on a single database table?", options: ["Exactly one, because it dictates the physical order of rows on disk", "As many as needed", "Up to 16", "Zero"], correctAnswerIndex: 0 },
  { subject: "DBMS", topic: "Transactions & ACID", questionText: "Which ACID property ensures that all transaction modifications are preserved even in the event of an immediate power outage or crash?", options: ["Atomicity", "Consistency", "Isolation", "Durability"], correctAnswerIndex: 3 },
  { subject: "DBMS", topic: "Transactions & ACID", questionText: "Which isolation level prevents Dirty Reads, Non-repeatable Reads, and Phantom Reads?", options: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"], correctAnswerIndex: 3 },
  { subject: "DBMS", topic: "SQL Queries", questionText: "What is the key difference between WHERE and HAVING clauses in SQL?", options: ["WHERE filters before GROUP BY aggregation; HAVING filters aggregate group results", "HAVING is used only for joins", "WHERE can only be used with numbers", "They are completely interchangeable"], correctAnswerIndex: 0 },
  { subject: "DBMS", topic: "SQL Queries", questionText: "Which SQL clause is used to eliminate duplicate records from a query result set?", options: ["DISTINCT", "UNIQUE", "GROUP BY only", "NO DUPLICATES"], correctAnswerIndex: 0 },
  { subject: "DBMS", topic: "Concurrency Control", questionText: "What guarantee does Strict Two-Phase Locking (Strict 2PL) provide?", options: ["Guarantees deadlock freedom", "Prevents cascading rollbacks by holding exclusive locks until transaction commit", "Allows dirty reads", "Removes shared locks"], correctAnswerIndex: 1 },
  { subject: "DBMS", topic: "Concurrency Control", questionText: "In Write-Ahead Logging (WAL), when must log records corresponding to a database modification be written to non-volatile disk?", options: ["After the data page is written to disk", "Before the data page is written to disk", "Only during system shutdown", "Never"], correctAnswerIndex: 1 },

  // 3. OPERATING SYSTEMS (OS)
  { subject: "OS", topic: "Process & Threads", questionText: "What is the primary difference between a Process and a Thread?", options: ["Processes share memory space while threads do not", "Threads of the same process share code, data, and OS resources, but have private stacks and registers", "Processes cannot execute in parallel", "Threads are heavier than processes"], correctAnswerIndex: 1 },
  { subject: "OS", topic: "Process & Threads", questionText: "What state does a process enter immediately after it issues a disk I/O request?", options: ["Running state", "Ready state", "Blocked / Waiting state", "Terminated state"], correctAnswerIndex: 2 },
  { subject: "OS", topic: "CPU Scheduling", questionText: "Which CPU scheduling algorithm gives the minimum average waiting time for a given set of processes?", options: ["First-Come First-Served (FCFS)", "Shortest Job First (SJF / SRTF)", "Round Robin (RR)", "Priority Scheduling"], correctAnswerIndex: 1 },
  { subject: "OS", topic: "CPU Scheduling", questionText: "In Round Robin scheduling, if the Time Quantum is extremely large, it behaves like:", options: ["Shortest Remaining Time First", "FCFS (First-Come First-Served)", "Priority Scheduling", "Multilevel Feedback Queue"], correctAnswerIndex: 1 },
  { subject: "OS", topic: "Deadlocks & Synchronization", questionText: "Which of the following is NOT one of Coffman's four conditions required for a Deadlock to occur?", options: ["Mutual Exclusion", "Hold and Wait", "Resource Preemption", "Circular Wait"], correctAnswerIndex: 2 },
  { subject: "OS", topic: "Deadlocks & Synchronization", questionText: "What is the main purpose of Dijkstra's Banker's Algorithm in Operating Systems?", options: ["Deadlock Recovery", "Deadlock Avoidance by testing for safe states", "Deadlock Detection only", "Memory Paging"], correctAnswerIndex: 1 },
  { subject: "OS", topic: "Memory Management & Paging", questionText: "What is the phenomenon called when the CPU spends more time swapping pages in and out of memory than executing processes?", options: ["External Fragmentation", "Thrashing", "Belady's Anomaly", "Deadlock"], correctAnswerIndex: 1 },
  { subject: "OS", topic: "Memory Management & Paging", questionText: "What is the primary role of the Translation Lookaside Buffer (TLB)?", options: ["To store disk sectors", "A fast hardware cache for Page Table entries to speed up Virtual-to-Physical address translation", "To schedule CPU threads", "To detect malware"], correctAnswerIndex: 1 },
  { subject: "OS", topic: "Virtual Memory", questionText: "Belady's Anomaly occurs in which Page Replacement Algorithm where increasing page frames causes more page faults?", options: ["Optimal Page Replacement", "Least Recently Used (LRU)", "First-In-First-Out (FIFO)", "Least Frequently Used (LFU)"], correctAnswerIndex: 2 },
  { subject: "OS", topic: "Virtual Memory", questionText: "What causes a Page Fault interrupt to be generated by the Memory Management Unit (MMU)?", options: ["Accessing memory outside valid bounds", "Accessing a page whose valid/invalid bit is marked invalid (page not in physical RAM)", "Dividing by zero", "Executing a privileged instruction"], correctAnswerIndex: 1 },

  // 4. COMPUTER NETWORKS (CN)
  { subject: "CN", topic: "OSI & TCP/IP Model", questionText: "At which layer of the OSI model does Routing and logical IP addressing take place?", options: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"], correctAnswerIndex: 1 },
  { subject: "CN", topic: "OSI & TCP/IP Model", questionText: "Which transport layer protocol provides connection-oriented, reliable, and ordered byte stream delivery with flow control?", options: ["UDP", "TCP", "ICMP", "IP"], correctAnswerIndex: 1 },
  { subject: "CN", topic: "TCP & UDP Protocols", questionText: "What are the three flags exchanged during a standard TCP Three-Way Handshake?", options: ["SYN, SYN-ACK, ACK", "ACK, FIN, SYN", "PING, PONG, ACK", "SYN, ACK, RST"], correctAnswerIndex: 0 },
  { subject: "CN", topic: "TCP & UDP Protocols", questionText: "Why is UDP preferred over TCP for real-time video streaming and multiplayer gaming?", options: ["UDP guarantees error-free packets", "UDP avoids connection overhead, retransmissions, and head-of-line blocking for lower latency", "UDP encrypts data by default", "UDP uses larger packet headers"], correctAnswerIndex: 1 },
  { subject: "CN", topic: "IP Addressing & Subnetting", questionText: "How many usable host IP addresses are available in a subnet with CIDR notation /28?", options: ["16", "14 (16 - Network ID - Broadcast)", "30", "12"], correctAnswerIndex: 1 },
  { subject: "CN", topic: "IP Addressing & Subnetting", questionText: "What is the primary function of NAT (Network Address Translation)?", options: ["Translate Domain Names to IP addresses", "Map private internal IP addresses to a public routable IP address", "Encrypt packet headers", "Route packets between autonomous systems"], correctAnswerIndex: 1 },
  { subject: "CN", topic: "Application Layer Protocols", questionText: "Which protocol translates human-readable domain names (e.g. google.com) into numerical IP addresses?", options: ["DHCP", "DNS", "ARP", "BGP"], correctAnswerIndex: 1 },
  { subject: "CN", topic: "Application Layer Protocols", questionText: "In HTTP/2, which feature allows multiple concurrent requests and responses over a single TCP connection?", options: ["Multiplexing", "Pipelining", "Caching", "Gzip Compression"], correctAnswerIndex: 0 },
  { subject: "CN", topic: "Security & TLS", questionText: "What cryptographic protocol provides end-to-end privacy and data integrity for HTTPS traffic?", options: ["FTP", "TLS / SSL", "SNMP", "RIP"], correctAnswerIndex: 1 },
  { subject: "CN", topic: "Security & TLS", questionText: "Address Resolution Protocol (ARP) is used to resolve:", options: ["Domain name to IP address", "IP address to MAC (hardware) address", "Port number to Process ID", "Subnet mask to Default Gateway"], correctAnswerIndex: 1 },

  // 5. OBJECT-ORIENTED PROGRAMMING (OOPS)
  { subject: "OOPS", topic: "Core OOP Pillars", questionText: "Wrapping data variables and methods together into a single unit and restricting direct outside access is called:", options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"], correctAnswerIndex: 1 },
  { subject: "OOPS", topic: "Core OOP Pillars", questionText: "Hiding internal implementation details and showing only essential functionality to the user is called:", options: ["Abstraction", "Encapsulation", "Coupling", "Composition"], correctAnswerIndex: 0 },
  { subject: "OOPS", topic: "Polymorphism & Inheritance", questionText: "Method Overloading is an example of which type of polymorphism?", options: ["Compile-time (Static) Polymorphism", "Run-time (Dynamic) Polymorphism", "Ad-hoc Inheritance", "Multiple Dispatch"], correctAnswerIndex: 0 },
  { subject: "OOPS", topic: "Polymorphism & Inheritance", questionText: "In C++ and Java, Virtual Functions (or overridden methods) achieve dynamic dispatch using:", options: ["Static Lookup Table", "vtable (Virtual Method Table) and vptr", "Hash Map", "Stack Allocation"], correctAnswerIndex: 1 },
  { subject: "OOPS", topic: "SOLID Principles", questionText: "In SOLID design principles, what does the 'L' (Liskov Substitution Principle) state?", options: ["A class should have only one reason to change", "Objects of a superclass should be replaceable with objects of its subclasses without breaking program correctness", "Depend upon abstractions, not concretions", "Many client-specific interfaces are better than one general-purpose interface"], correctAnswerIndex: 1 },
  { subject: "OOPS", topic: "SOLID Principles", questionText: "Which SOLID principle states that software entities (classes, modules) should be open for extension, but closed for modification?", options: ["Single Responsibility Principle", "Open/Closed Principle", "Interface Segregation Principle", "Dependency Inversion Principle"], correctAnswerIndex: 1 },
  { subject: "OOPS", topic: "Design Patterns", questionText: "Which creational design pattern ensures that a class has only one instance and provides a global point of access to it?", options: ["Factory Pattern", "Singleton Pattern", "Observer Pattern", "Adapter Pattern"], correctAnswerIndex: 1 },
  { subject: "OOPS", topic: "Design Patterns", questionText: "The 'Publish-Subscribe' or Event-Listener architecture is an implementation of which design pattern?", options: ["Observer Pattern", "Decorator Pattern", "Strategy Pattern", "Facade Pattern"], correctAnswerIndex: 0 },
  { subject: "OOPS", topic: "Classes & Objects", questionText: "What is the Diamond Problem in object-oriented inheritance, and how do languages like Java resolve it?", options: ["Multiple constructors; resolved via overloading", "Ambiguity when two parent classes inherit from the same grandparent and child inherits both; resolved by disallowing multiple class inheritance and using interfaces", "Memory leak in destructors", "Infinite recursion in method overriding"], correctAnswerIndex: 1 },
  { subject: "OOPS", topic: "Classes & Objects", questionText: "What is the difference between Composition and Aggregation in OOP?", options: ["Composition implies ownership where child cannot exist independently of parent; Aggregation represents a weaker 'has-a' relationship", "Aggregation destroys the child when parent is deleted", "There is no difference", "Composition only applies to interfaces"], correctAnswerIndex: 0 },

  // 6. SYSTEM DESIGN & ARCHITECTURE (SYSTEM_DESIGN)
  { subject: "SYSTEM_DESIGN", topic: "Scalability & Load Balancing", questionText: "What is the difference between Horizontal Scaling and Vertical Scaling?", options: ["Horizontal scaling adds more machines/nodes to the resource pool; Vertical scaling adds more CPU/RAM to an existing machine", "Horizontal scaling upgrades CPU cores; Vertical scaling adds servers", "Horizontal scaling is always cheaper than vertical scaling", "Vertical scaling eliminates single point of failure"], correctAnswerIndex: 0 },
  { subject: "SYSTEM_DESIGN", topic: "Scalability & Load Balancing", questionText: "Which Load Balancing algorithm distributes incoming requests sequentially across a list of servers?", options: ["Least Connections", "Round Robin", "Consistent Hashing", "IP Hash"], correctAnswerIndex: 1 },
  { subject: "SYSTEM_DESIGN", topic: "Caching & Redis", questionText: "In a Cache-Aside (Lazy Loading) pattern, what happens on a cache miss?", options: ["The application writes default data to cache", "The application reads from database, updates the cache, and returns data to the client", "An error is returned to the user", "The database automatically notifies the cache"], correctAnswerIndex: 1 },
  { subject: "SYSTEM_DESIGN", topic: "Caching & Redis", questionText: "Which eviction policy removes the key that has not been accessed for the longest time when cache memory is full?", options: ["Least Frequently Used (LFU)", "Least Recently Used (LRU)", "First In First Out (FIFO)", "Random Eviction"], correctAnswerIndex: 1 },
  { subject: "SYSTEM_DESIGN", topic: "CAP Theorem & Databases", questionText: "According to the CAP Theorem, in the presence of a Network Partition (P), a distributed system must choose between:", options: ["Consistency (C) and Availability (A)", "Performance and Security", "Latency and Throughput", "Durability and Scalability"], correctAnswerIndex: 0 },
  { subject: "SYSTEM_DESIGN", topic: "CAP Theorem & Databases", questionText: "What is Database Sharding?", options: ["Creating read-only replicas across regions", "Partitioning data horizontally across multiple database instances based on a shard key", "Normalizing tables into BCNF", "Compressing database backups on disk"], correctAnswerIndex: 1 },
  { subject: "SYSTEM_DESIGN", topic: "Microservices & Message Queues", questionText: "What is the primary benefit of introducing a Message Queue (e.g. RabbitMQ, Apache Kafka) in a distributed system?", options: ["Synchronous blocking communication", "Asynchronous decoupled processing, traffic smoothing (rate buffering), and fault tolerance", "Replacing SQL databases", "Automating frontend rendering"], correctAnswerIndex: 1 },
  { subject: "SYSTEM_DESIGN", topic: "Microservices & Message Queues", questionText: "Which architectural pattern provides a single entry point for all client requests in a microservices system, handling authentication and routing?", options: ["Circuit Breaker Pattern", "API Gateway Pattern", "Saga Pattern", "CQRS Pattern"], correctAnswerIndex: 1 },
  { subject: "SYSTEM_DESIGN", topic: "Resilience & Rate Limiting", questionText: "Which rate-limiting algorithm uses a bucket filled with tokens at a constant rate and allows bursts up to bucket capacity?", options: ["Sliding Window Counter", "Token Bucket Algorithm", "Leaky Bucket Algorithm", "Fixed Window Counter"], correctAnswerIndex: 1 },
  { subject: "SYSTEM_DESIGN", topic: "Resilience & Rate Limiting", questionText: "The Circuit Breaker pattern prevents an application from repeatedly executing an operation that is likely to fail by transitioning between states:", options: ["Running, Paused, Stopped", "Closed, Open, Half-Open", "Active, Idle, Terminated", "Lock, Unlock, Wait"], correctAnswerIndex: 1 },

  // 7. QUANTITATIVE APTITUDE & LOGICAL REASONING (APTITUDE)
  { subject: "APTITUDE", topic: "Percentages & Profit-Loss", questionText: "A software license is sold for ₹7,200 at a profit of 20%. What was the original cost price?", options: ["₹5,800", "₹6,000", "₹6,200", "₹6,400"], correctAnswerIndex: 1 },
  { subject: "APTITUDE", topic: "Percentages & Profit-Loss", questionText: "If the salary of an engineer is first increased by 20% and then decreased by 20%, what is the net percentage change in salary?", options: ["0% (No change)", "4% Decrease", "4% Increase", "2% Decrease"], correctAnswerIndex: 1 },
  { subject: "APTITUDE", topic: "Time, Speed & Distance", questionText: "A train 180 meters long is traveling at a speed of 54 km/h. How many seconds will it take to pass a stationary signal pole?", options: ["10 seconds", "12 seconds", "15 seconds", "18 seconds"], correctAnswerIndex: 1 },
  { subject: "APTITUDE", topic: "Time & Work", questionText: "Developer A can complete a sprint in 12 days, and Developer B can complete it in 6 days. Working together, how many days will they take?", options: ["3 days", "4 days", "5 days", "8 days"], correctAnswerIndex: 1 },
  { subject: "APTITUDE", topic: "Probability & Combinatorics", questionText: "In how many distinct ways can the letters of the word 'LOGIC' be arranged?", options: ["60", "120 (5!)", "240", "24"], correctAnswerIndex: 1 },
  { subject: "APTITUDE", topic: "Probability & Combinatorics", questionText: "Two fair 6-sided dice are rolled simultaneously. What is the probability that the sum of the numbers rolled is equal to 7?", options: ["1/12", "1/6 (6/36)", "1/9", "5/36"], correctAnswerIndex: 1 },
  { subject: "APTITUDE", topic: "Number Series & Patterns", questionText: "Find the next number in the series: 3, 7, 15, 31, 63, ?", options: ["125", "127 (2n + 1)", "128", "131"], correctAnswerIndex: 1 },
  { subject: "APTITUDE", topic: "Logical Deductions & Syllogisms", questionText: "Statements: All algorithms are programs. Some programs are scripts. Conclusion: I. Some algorithms are scripts. II. Some programs are algorithms. Which follows?", options: ["Only I follows", "Only II follows", "Both I and II follow", "Neither follows"], correctAnswerIndex: 1 },
  { subject: "APTITUDE", topic: "Blood Relations & Clocks", questionText: "At 3:40 PM, what is the angle between the hour hand and the minute hand of a standard analog clock?", options: ["120°", "130°", "140°", "150°"], correctAnswerIndex: 1 },
  { subject: "APTITUDE", topic: "Ratios & Proportions", questionText: "The ratio of ages of two candidates is 4:5. After 6 years, the ratio becomes 6:7. What is the present age of the younger candidate?", options: ["10 years", "12 years", "16 years", "18 years"], correctAnswerIndex: 1 },

  // 8. WEB DEVELOPMENT & CLOUD FUNDAMENTALS (WEB_DEV)
  { subject: "WEB_DEV", topic: "JavaScript & Event Loop", questionText: "In the JavaScript runtime, which queue has the highest priority and is executed immediately after the current execution context before the macrotask queue?", options: ["Callback Queue", "Microtask Queue (Promises, process.nextTick)", "Render Queue", "I/O Queue"], correctAnswerIndex: 1 },
  { subject: "WEB_DEV", topic: "JavaScript & Event Loop", questionText: "What is a Closure in JavaScript?", options: ["A function bundled together with references to its surrounding lexical environment", "A method to terminate event loops", "A way to make variables global", "An encrypted callback"], correctAnswerIndex: 0 },
  { subject: "WEB_DEV", topic: "REST APIs & HTTP", questionText: "Which HTTP status code signifies that a resource was successfully created on the server as a result of a POST request?", options: ["200 OK", "201 Created", "204 No Content", "301 Moved Permanently"], correctAnswerIndex: 1 },
  { subject: "WEB_DEV", topic: "REST APIs & HTTP", questionText: "What makes an HTTP method 'Idempotent'?", options: ["It requires authentication", "Making multiple identical requests produces the exact same server state as making a single request (e.g. GET, PUT, DELETE)", "It always returns JSON", "It executes in O(1) time"], correctAnswerIndex: 1 },
  { subject: "WEB_DEV", topic: "Authentication & Security", questionText: "What are the three dot-separated components that make up a JSON Web Token (JWT)?", options: ["Header, Payload, Signature", "Username, Password, Salt", "Origin, Body, Hash", "Issuer, Audience, Key"], correctAnswerIndex: 0 },
  { subject: "WEB_DEV", topic: "Authentication & Security", questionText: "Cross-Origin Resource Sharing (CORS) is a mechanism that allows a web server to:", options: ["Share passwords across domains", "Specify which origins (domains) are permitted to access resources on the server via browsers", "Encrypt SQL queries", "Compress CSS files"], correctAnswerIndex: 1 },
  { subject: "WEB_DEV", topic: "Git Version Control", questionText: "What is the difference between `git merge` and `git rebase`?", options: ["Merge creates a new commit preserving history; Rebase rewrites commit history onto the tip of another branch for a linear log", "Rebase deletes branches permanently", "Merge is only used for remote repositories", "They do the exact same thing"], correctAnswerIndex: 0 },
  { subject: "WEB_DEV", topic: "Git Version Control", questionText: "Which command temporarily shelves (stashes) uncommitted modifications so you can switch branches cleanly?", options: ["git reset --hard", "git stash", "git commit --amend", "git checkout -b"], correctAnswerIndex: 1 },
  { subject: "WEB_DEV", topic: "Containers & Cloud", questionText: "What is the core difference between a Docker Container and a Virtual Machine (VM)?", options: ["Containers share the host OS kernel and are lightweight, while VMs run a full guest OS on top of a hypervisor", "Containers require more RAM than VMs", "VMs do not use hypervisors", "Containers cannot run Linux"], correctAnswerIndex: 0 },
  { subject: "WEB_DEV", topic: "Containers & Cloud", questionText: "In cloud computing, what is an 'Infrastructure as Code' (IaC) tool used to define cloud infrastructure declaratively?", options: ["Terraform", "Postman", "Webpack", "Redis"], correctAnswerIndex: 0 },

  // 9. MACHINE LEARNING & AI (MACHINE_LEARNING)
  { subject: "MACHINE_LEARNING", topic: "Core Concepts", questionText: "Which type of machine learning uses labelled training data to learn a mapping from inputs to outputs?", options: ["Unsupervised Learning", "Reinforcement Learning", "Supervised Learning", "Self-Supervised Learning"], correctAnswerIndex: 2 },
  { subject: "MACHINE_LEARNING", topic: "Core Concepts", questionText: "The Bias-Variance Trade-off describes the tension between:", options: ["Model accuracy and training speed", "Underfitting (high bias) and Overfitting (high variance)", "Data size and feature count", "Learning rate and batch size"], correctAnswerIndex: 1 },
  { subject: "MACHINE_LEARNING", topic: "Algorithms", questionText: "Which algorithm constructs an ensemble of decision trees on random feature subsets and averages their predictions?", options: ["Gradient Boosting (XGBoost)", "K-Nearest Neighbours", "Random Forest", "Support Vector Machine"], correctAnswerIndex: 2 },
  { subject: "MACHINE_LEARNING", topic: "Algorithms", questionText: "In Logistic Regression, which activation function squashes the output between 0 and 1 to represent probability?", options: ["ReLU", "Tanh", "Sigmoid", "Softmax"], correctAnswerIndex: 2 },
  { subject: "MACHINE_LEARNING", topic: "Neural Networks", questionText: "During Backpropagation, gradients are computed using which calculus rule to propagate error through all network layers?", options: ["Product Rule", "Chain Rule", "Quotient Rule", "Taylor Expansion"], correctAnswerIndex: 1 },
  { subject: "MACHINE_LEARNING", topic: "Neural Networks", questionText: "Which optimisation algorithm adaptively scales learning rates per-parameter using estimates of first and second moments of gradients?", options: ["Vanilla SGD", "Momentum SGD", "RMSProp", "Adam (Adaptive Moment Estimation)"], correctAnswerIndex: 3 },
  { subject: "MACHINE_LEARNING", topic: "Deep Learning Architectures", questionText: "Convolutional Neural Networks (CNNs) achieve translation invariance for image tasks primarily through:", options: ["Fully connected dense layers", "Shared weights (filters) in convolutional layers + pooling", "Dropout regularisation", "Batch normalisation"], correctAnswerIndex: 1 },
  { subject: "MACHINE_LEARNING", topic: "Deep Learning Architectures", questionText: "LSTM (Long Short-Term Memory) networks solve the Vanishing Gradient problem in RNNs using:", options: ["Residual skip connections", "Self-attention heads", "Cell state, input gate, forget gate, and output gate", "Causal masking"], correctAnswerIndex: 2 },
  { subject: "MACHINE_LEARNING", topic: "Model Evaluation", questionText: "In a binary classification problem with class imbalance, which metric is more informative than raw Accuracy?", options: ["Mean Squared Error", "F1-Score (Harmonic Mean of Precision & Recall)", "R-squared", "Cross-Entropy Loss"], correctAnswerIndex: 1 },
  { subject: "MACHINE_LEARNING", topic: "Model Evaluation", questionText: "A ROC-AUC score of 0.5 for a binary classifier indicates:", options: ["Perfect model", "A model performing no better than random chance", "Severe overfitting", "Underfitting on training set"], correctAnswerIndex: 1 }
];

export const OFFLINE_STUDY_PACKS = {
  DSA: {
    subject: "DSA",
    title: "Data Structures & Algorithms Placement Pack",
    version: "2.0",
    sizeKB: 32,
    cheatSheet: [
      { topic: "Arrays & Searching", summary: "Binary Search requires sorted array. Kadane's algorithm finds max subarray in O(N).", keyFormulas: "mid = low + (high - low) / 2" },
      { topic: "Trees & BST", summary: "BST Inorder yields sorted order. AVL tree balances with height difference <= 1.", keyFormulas: "h = O(log N)" },
      { topic: "Graphs", summary: "BFS uses Queue for shortest path in unweighted graphs. Dijkstra handles non-negative weights.", keyFormulas: "Time: O((V + E) log V)" },
      { topic: "Dynamic Programming", summary: "Optimal Substructure + Overlapping Subproblems. Tabulation (Bottom-up) vs Memoization (Top-down).", keyFormulas: "0/1 Knapsack: O(N*W)" }
    ]
  },
  DBMS: {
    subject: "DBMS",
    title: "Database Systems & SQL Placement Pack",
    version: "2.0",
    sizeKB: 28,
    cheatSheet: [
      { topic: "Normalization", summary: "1NF: Atomic values; 2NF: No partial dependency; 3NF: No transitive dependency; BCNF: Every determinant is a superkey.", keyFormulas: "Lossless Join: R1 ∩ R2 -> R1 or R2" },
      { topic: "Indexing & B+ Trees", summary: "B+ Tree leaf nodes are linked for fast range queries. Clustered index defines disk order.", keyFormulas: "Search time: O(log_B N)" },
      { topic: "ACID & Transactions", summary: "Atomicity (WAL), Consistency, Isolation (2PL), Durability (Redo log). Strict 2PL prevents cascading rollbacks.", keyFormulas: "Serializable > Repeatable Read > Read Committed" }
    ]
  },
  OS: {
    subject: "OS",
    title: "Operating Systems Placement Pack",
    version: "2.0",
    sizeKB: 26,
    cheatSheet: [
      { topic: "Process & Threads", summary: "Processes have isolated memory; threads share code/data but have private stack. Context switch is CPU state save/restore.", keyFormulas: "PCB: PID, PC, Registers, Memory limits" },
      { topic: "CPU Scheduling", summary: "SJF minimizes average waiting time. Round Robin provides fair time-sharing without starvation.", keyFormulas: "TAT = CT - AT, WT = TAT - BT" },
      { topic: "Deadlocks & Paging", summary: "Deadlock conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait. Banker's Algorithm ensures safe state.", keyFormulas: "EAT = Hit*(TLB + Mem) + (1-Hit)*(TLB + 2*Mem)" }
    ]
  },
  CN: {
    subject: "CN",
    title: "Computer Networks Placement Pack",
    version: "2.0",
    sizeKB: 25,
    cheatSheet: [
      { topic: "OSI & TCP/IP", summary: "7 Layers: Physical, Data Link, Network (IP), Transport (TCP/UDP), Session, Presentation, Application.", keyFormulas: "IP = Logical Routing, MAC = Physical Hop" },
      { topic: "TCP Handshake", summary: "3-Way Handshake: SYN -> SYN-ACK -> ACK. Flow control via Sliding Window, Congestion control via AIMD.", keyFormulas: "Usable Hosts = 2^(32-CIDR) - 2" },
      { topic: "DNS & HTTPS", summary: "DNS resolves hostnames via UDP 53. HTTPS encrypts payload over TLS/SSL port 443.", keyFormulas: "HTTP/2 Multiplexing = 1 TCP Stream" }
    ]
  },
  OOPS: {
    subject: "OOPS",
    title: "Object-Oriented Programming Placement Pack",
    version: "2.0",
    sizeKB: 24,
    cheatSheet: [
      { topic: "4 Pillars", summary: "Encapsulation (data hiding), Abstraction (interface over impl), Inheritance (code reuse), Polymorphism (overloading/overriding).", keyFormulas: "vtable & vptr enable runtime dynamic dispatch" },
      { topic: "SOLID Principles", summary: "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.", keyFormulas: "Composition > Inheritance" },
      { topic: "Design Patterns", summary: "Singleton (single instance), Factory (object creation), Observer (pub/sub events), Strategy (interchangeable algos).", keyFormulas: "Loose Coupling, High Cohesion" }
    ]
  },
  SYSTEM_DESIGN: {
    subject: "SYSTEM_DESIGN",
    title: "System Design & LLD/HLD Placement Pack",
    version: "2.0",
    sizeKB: 30,
    cheatSheet: [
      { topic: "Scalability", summary: "Horizontal (scale-out with load balancers) vs Vertical (scale-up). Stateless servers scale horizontally effortlessly.", keyFormulas: "Throughput = QPS, Latency = p95/p99 ms" },
      { topic: "Caching & Redis", summary: "Cache-Aside, Write-Through, Write-Back. Eviction: LRU, LFU. Cache invalidation strategies.", keyFormulas: "Cache Hit Ratio = Hits / (Hits + Misses)" },
      { topic: "CAP Theorem", summary: "Under Network Partition (P), choose Consistency (CP: banking) or Availability (AP: social feeds). Sharding splits rows by key.", keyFormulas: "Consistent Hashing minimizes key redistribution" }
    ]
  },
  APTITUDE: {
    subject: "APTITUDE",
    title: "Quantitative Aptitude & Reasoning Placement Pack",
    version: "2.0",
    sizeKB: 26,
    cheatSheet: [
      { topic: "Percentages & Profit", summary: "Profit % = (Profit / CP) * 100. Net change for +x% then -x% = -(x^2 / 100)%.", keyFormulas: "SP = CP * (1 + P%/100)" },
      { topic: "Time, Speed & Work", summary: "Speed = Distance / Time. Combined work: 1/T = 1/A + 1/B. Relative speed: S1 + S2 (opposite) or |S1 - S2| (same).", keyFormulas: "km/h to m/s: multiply by 5/18" },
      { topic: "Probability & Series", summary: "Probability = Favorable / Total. Permutations nPr = n! / (n-r)!. Combinations nCr = n! / (r!(n-r)!).", keyFormulas: "Sum of 2 dice = 7 has highest prob (6/36 = 1/6)" }
    ]
  },
  WEB_DEV: {
    subject: "WEB_DEV",
    title: "Web Development & Cloud Placement Pack",
    version: "2.0",
    sizeKB: 27,
    cheatSheet: [
      { topic: "JavaScript Internals", summary: "Single-threaded non-blocking event loop. Call Stack -> Microtask Queue (Promises) -> Macrotask Queue (setTimeout).", keyFormulas: "Closures preserve outer lexical scope" },
      { topic: "REST & HTTP", summary: "GET (Safe/Idempotent), POST (Create), PUT (Idempotent update), DELETE (Idempotent). Status: 200 OK, 201 Created, 401 Unauthorized, 404 Not Found.", keyFormulas: "JWT = Header.Payload.Signature" },
      { topic: "Docker & Cloud", summary: "Docker containers share host OS kernel; VMs virtualize hardware with guest OS. Git rebase creates linear commit history.", keyFormulas: "IaC: Terraform, Cloud: AWS/GCP/Azure" }
    ]
  },
  MACHINE_LEARNING: {
    subject: "MACHINE_LEARNING",
    title: "Machine Learning & AI Placement Pack",
    version: "1.0",
    sizeKB: 29,
    cheatSheet: [
      { topic: "Learning Paradigms", summary: "Supervised (labelled data -> classification/regression), Unsupervised (clustering/PCA), Reinforcement (agent-environment reward).", keyFormulas: "Loss = -Σ y·log(ŷ) (Cross-Entropy)" },
      { topic: "Bias-Variance & Regularisation", summary: "High Bias = Underfitting (simple model). High Variance = Overfitting (memorises train data). L1 (Lasso) sparsifies; L2 (Ridge) shrinks weights.", keyFormulas: "Total Error = Bias² + Variance + Noise" },
      { topic: "Neural Networks & Metrics", summary: "Backprop uses Chain Rule to compute gradients. Adam optimizer adapts learning rate. F1 = 2·P·R/(P+R). AUC-ROC measures ranking quality.", keyFormulas: "Precision = TP/(TP+FP), Recall = TP/(TP+FN)" }
    ]
  }
};
