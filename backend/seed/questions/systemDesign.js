// System Design Question Bank (90 Questions)
export const SYSTEM_DESIGN_QUESTIONS = [
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Scalability",
    "subtopic": "Horizontal vs Vertical Scaling",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the difference between Vertical Scaling (Scale Up) and Horizontal Scaling (Scale Out)?",
    "options": [
      "Vertical adds more CPU/RAM to a single existing server; Horizontal adds more server nodes to a distributed pool",
      "Horizontal adds more storage to one machine",
      "Vertical scaling is infinite",
      "Horizontal scaling requires no network"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Vertical scaling hits hard hardware ceilings and single points of failure; horizontal scaling scales near-linearly by distributing load across commodity clusters.",
    "tags": [
      "System Design",
      "Scalability",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Scalability",
    "subtopic": "Stateless Architecture",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Why is a Stateless Application Tier a prerequisite for seamless horizontal auto-scaling?",
    "options": [
      "Any incoming user request can be serviced by any arbitrary server node because session state is stored in an external shared store (Redis/DB)",
      "Stateless servers use 0 bytes of RAM",
      "Stateless applications cannot use databases",
      "It eliminates the need for load balancers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If servers maintain in-memory sessions, requests must stick to specific servers (sticky sessions); stateless servers allow scaling nodes up or down dynamically.",
    "tags": [
      "System Design",
      "Scalability",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Scalability",
    "subtopic": "Read vs Write Heavy Scaling",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In a system with a 100:1 Read-to-Write ratio (like Twitter or Wikipedia), what is the most effective primary scaling strategy?",
    "options": [
      "Deploying distributed Read Replicas with an in-memory caching layer (Redis / Memcached)",
      "Adding more database write masters",
      "Disabling database indexes",
      "Increasing disk write speed"
    ],
    "correctAnswerIndex": 0,
    "explanation": "High read-ratio architectures direct reads to cached memory tiers and replicated slave databases, shielding the single primary write database.",
    "tags": [
      "System Design",
      "Scalability",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Scalability",
    "subtopic": "Database Sharding",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is Horizontal Database Partitioning (Sharding)?",
    "options": [
      "Splitting rows of a table across multiple independent physical database instances using a Shard Key (e.g. user_id % N)",
      "Splitting columns into separate tables",
      "Creating backups on tape",
      "Replicating identical data to 5 servers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Sharding partitions rows across different servers so that no single database instance is bottlenecked by CPU, disk I/O, or connection limits.",
    "tags": [
      "System Design",
      "Scalability",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Scalability",
    "subtopic": "Shard Key Selection Pitfalls",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What serious problem occurs if an inappropriate Shard Key is selected (e.g. sharding by Date/Timestamp in a time-series system)?",
    "options": [
      "Hotspotting: all current write traffic floods into the single shard representing 'today', leaving all other shards completely idle",
      "Database tables are deleted",
      "Cross-shard joins run too fast",
      "Foreign keys duplicate"
    ],
    "correctAnswerIndex": 0,
    "explanation": "An ideal shard key distributes read/write traffic evenly across all shards. Sequential keys create severe hot partitions.",
    "tags": [
      "System Design",
      "Scalability",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Scalability",
    "subtopic": "Asynchronous Processing with Queues",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How do Message Queues (Kafka, RabbitMQ) enhance system scalability during sudden traffic spikes?",
    "options": [
      "Decouples request intake from background processing, buffering peak traffic bursts and allowing workers to consume at a steady, sustainable rate",
      "Speeds up SQL queries by 10x",
      "Eliminates network latency",
      "Replaces web servers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Queue buffers prevent downstream services (like email senders or video transcoders) from crashing during peak traffic bursts.",
    "tags": [
      "System Design",
      "Scalability",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Scalability",
    "subtopic": "Content Delivery Networks (CDNs)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How do Content Delivery Networks (CDNs like Cloudflare, CloudFront) scale global web performance?",
    "options": [
      "Cache static assets (images, JS, video) at edge server locations geographically proximate to end users, offloading origin servers",
      "Compress database tables",
      "Generate dynamic HTML on origin",
      "Encrypt user passwords"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Serving static files from local edge caches slashes latency from 200ms round-trips down to <10ms and absorbs >80% of origin web traffic.",
    "tags": [
      "System Design",
      "Scalability",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Scalability",
    "subtopic": "C10K and C1000K Problem",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How do modern web servers (Nginx, Node.js, Netty) solve the C10K problem (handling 10,000+ concurrent connections) compared to traditional Apache?",
    "options": [
      "Using non-blocking, event-driven I/O multiplexing (epoll / kqueue) on a few worker threads instead of one OS thread per connection",
      "Allocating 10,000 OS threads",
      "Increasing RAM to 1 Terabyte",
      "Using multi-process fork for every connection"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Thread-per-connection architectures exhaust stack memory and CPU context-switch budgets; event loops handle tens of thousands of idle sockets per thread.",
    "tags": [
      "System Design",
      "Scalability",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Scalability",
    "subtopic": "Backpressure Handling",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is 'Backpressure' in distributed reactive data pipelines?",
    "options": [
      "A mechanism allowing a slower downstream consumer to signal an upstream producer to slow down or buffer data, preventing consumer crash from buffer overflow",
      "Network packets bouncing back",
      "CPU cooling fans blowing backwards",
      "Database disk writes reversing"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Without backpressure, a fast producer overwhelms a slow consumer's memory buffer, leading to fatal OutOfMemory crashes.",
    "tags": [
      "System Design",
      "Scalability",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Load Balancing",
    "subtopic": "L4 vs L7 Load Balancing",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the fundamental difference between a Layer 4 (L4) and a Layer 7 (L7) Load Balancer?",
    "options": [
      "L4 routes based purely on IP and TCP/UDP ports without inspecting packet payload; L7 inspects HTTP headers, cookies, and URL paths to route traffic intelligently",
      "L4 is in software; L7 is hardware only",
      "L4 inspects HTTP payloads; L7 does not",
      "L7 cannot use SSL"
    ],
    "correctAnswerIndex": 0,
    "explanation": "L4 operates at transport layer with lightning-fast routing; L7 terminates HTTP/HTTPS, enabling path routing (e.g. `/api` vs `/static`) and cookie-based affinity.",
    "tags": [
      "System Design",
      "Load Balancing",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Load Balancing",
    "subtopic": "Consistent Hashing Ring",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How does Consistent Hashing minimize cache invalidation when a cache node is added or removed from a pool of N servers?",
    "options": [
      "Arranges nodes on a virtual ring (0 to 2^32-1); adding a node only remaps keys from its immediate clockwise neighbor, remapping on average 1/N of total keys",
      "Remaps 100% of all keys",
      "Stores all keys on disk",
      "Uses round robin"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Traditional `hash(key) % N` remaps nearly all keys when N changes; consistent hashing remaps only keys adjacent to the altered node.",
    "tags": [
      "System Design",
      "Load Balancing",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Load Balancing",
    "subtopic": "Health Checks",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the purpose of periodic Active Health Checks in load balancers?",
    "options": [
      "Pings backend servers (e.g. `GET /health`); if a node fails consecutive checks, the load balancer stops routing traffic to it until it recovers",
      "Monitors room temperature",
      "Validates user passwords",
      "Reboots the server every 5 minutes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Health checks ensure zero downtime by automatically isolating unhealthy or crashing worker instances from user traffic.",
    "tags": [
      "System Design",
      "Load Balancing",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Load Balancing",
    "subtopic": "Weighted Round Robin",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "When is Weighted Round Robin load balancing chosen over standard Round Robin?",
    "options": [
      "When backend servers have heterogeneous hardware capacities (e.g. 32-core server assigned weight 4; 8-core server assigned weight 1)",
      "When all servers are identical",
      "When users have different subscription tiers",
      "To enforce sticky sessions"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Weighted round robin proportionally distributes more requests to beefier server instances in mixed hardware clusters.",
    "tags": [
      "System Design",
      "Load Balancing",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Load Balancing",
    "subtopic": "Least Connections Algorithm",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "When is the 'Least Connections' load balancing algorithm superior to Round Robin?",
    "options": [
      "When requests have highly variable processing durations (e.g. long database transactions or video encoding vs quick static reads)",
      "When all requests take exactly 2ms",
      "On UDP networks only",
      "When caching is disabled"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Round robin can accidentally pile multiple long-running requests onto the same server; least-connections routes to the server with fewest active requests.",
    "tags": [
      "System Design",
      "Load Balancing",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Load Balancing",
    "subtopic": "DNS Round Robin Limitations",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why is DNS Round Robin (returning multiple IP addresses in DNS responses) insufficient as an enterprise-grade load balancer?",
    "options": [
      "Client and ISP DNS caching ignores updated records, delaying failover for hours, and DNS cannot monitor real-time server load or health",
      "DNS only supports 2 servers",
      "DNS runs over TCP only",
      "It cannot route internet traffic"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If a server dies, intermediate DNS resolvers continue serving its cached IP until TTL expires, sending users to dead endpoints.",
    "tags": [
      "System Design",
      "Load Balancing",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Load Balancing",
    "subtopic": "SSL/TLS Termination",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is SSL/TLS Termination at the Load Balancer level?",
    "options": [
      "The load balancer decrypts incoming HTTPS requests and forwards unencrypted HTTP traffic to backend servers across the internal private VPC network",
      "The load balancer blocks all SSL traffic",
      "Disabling HTTPS completely",
      "Encrypting database hard drives"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Terminating TLS at the load balancer offloads heavy cryptographic handshake CPU calculations from backend application servers and centralizes certificate management.",
    "tags": [
      "System Design",
      "Load Balancing",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Load Balancing",
    "subtopic": "Sticky Sessions (Session Affinity)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How do Sticky Sessions work, and what is their primary architectural drawback?",
    "options": [
      "Routes all requests from a specific user session to the identical backend server (via cookie or IP); drawback is uneven load distribution and session loss on server crash",
      "Encrypts session data",
      "Makes sessions infinite",
      "Allows sessions without cookies"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Sticky sessions tie users to specific servers, preventing auto-scaling elasticity and causing users to lose session state if that single server dies.",
    "tags": [
      "System Design",
      "Load Balancing",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Load Balancing",
    "subtopic": "Anycast Routing for Global Load Balancing",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How does BGP Anycast achieve global load balancing for high-traffic platforms (like Google or Cloudflare)?",
    "options": [
      "The same IP address is advertised by multiple data centers worldwide; Internet routers automatically route packets to the topologically closest data center",
      "Assigns unique IP per country",
      "Uses satellite links",
      "Routes traffic through a single master router in USA"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Anycast leverages BGP routing metrics to route user requests to the nearest edge location with zero application-level redirection latency.",
    "tags": [
      "System Design",
      "Load Balancing",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Caching",
    "subtopic": "Cache-Aside (Lazy Loading)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In the Cache-Aside pattern, what does the application do on a Cache Miss?",
    "options": [
      "Reads data from database, writes it into the cache for future queries, and returns data to the client",
      "Returns null to user",
      "Writes data to disk immediately",
      "Invalidates the entire database"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Cache-aside loads data into cache on demand only when missed; subsequent reads hit memory directly.",
    "tags": [
      "System Design",
      "Caching",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Caching",
    "subtopic": "Write-Through vs Write-Back",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the difference between Write-Through and Write-Back (Write-Behind) caching?",
    "options": [
      "Write-Through writes to cache and database synchronously; Write-Back writes to cache immediately and flushes to database asynchronously after a delay",
      "Write-Through writes only to disk",
      "Write-Back writes only to memory and never to disk",
      "They are identical"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Write-Through ensures strong data consistency at higher write latency; Write-Back gives blistering write speed but risks data loss if cache crashes before flush.",
    "tags": [
      "System Design",
      "Caching",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Caching",
    "subtopic": "Cache Stampede (Thundering Herd)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is a 'Cache Stampede' and how is it mitigated?",
    "options": [
      "When a heavily accessed key expires, thousands of concurrent requests simultaneously hit the database; mitigated using distributed locks (mutex) or probabilistic early expiration",
      "When RAM runs out of memory",
      "When cache is cleared by admin",
      "When network cable is disconnected"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Simultaneous DB queries for the same expired popular key can overload and crash the database; locking ensures only one thread regenerates the cache.",
    "tags": [
      "System Design",
      "Caching",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Caching",
    "subtopic": "Cache Eviction Policies (LRU vs LFU)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the difference between Least Recently Used (LRU) and Least Frequently Used (LFU) cache eviction policies?",
    "options": [
      "LRU evicts the item that has not been accessed for the longest time; LFU evicts the item with the lowest total access count",
      "LRU counts access frequency",
      "LFU checks timestamp of last access",
      "They evict identical items always"
    ],
    "correctAnswerIndex": 0,
    "explanation": "LRU tracks temporal recency (time of last access); LFU tracks popularity frequency (total number of accesses).",
    "tags": [
      "System Design",
      "Caching",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Caching",
    "subtopic": "Redis vs Memcached",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What capabilities does Redis provide that standard Memcached does not?",
    "options": [
      "Rich data structures (Hashes, Sets, Sorted Sets, Bitmaps), disk persistence (RDB/AOF), pub/sub, replication, and Lua scripting",
      "Memcached supports persistence; Redis is memory-only",
      "Redis has no multi-threading",
      "Memcached is a relational database"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Memcached is a simple, multi-threaded key-value store; Redis is a versatile in-memory data structure server with persistence and replication.",
    "tags": [
      "System Design",
      "Caching",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Caching",
    "subtopic": "Cache Penetration vs Breakdown",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is Cache Penetration, and how does a Bloom Filter solve it?",
    "options": [
      "Requests query for keys that do NOT exist in DB; queries continuously bypass cache hitting the DB. A Bloom filter checks key existence before touching DB",
      "When cache key expires",
      "When Redis crashes",
      "When cache is full"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Attackers requesting non-existent IDs force DB lookups. A Bloom filter quickly confirms non-existence in memory in O(1) time without DB access.",
    "tags": [
      "System Design",
      "Caching",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Caching",
    "subtopic": "Redis AOF vs RDB Persistence",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What are the two persistence mechanisms available in Redis?",
    "options": [
      "RDB (point-in-time snapshot of dataset at specified intervals) and AOF (Append-Only File logging every write command)",
      "SQL dump and JSON export",
      "Tape backup and CD-ROM",
      "RAM mirroring only"
    ],
    "correctAnswerIndex": 0,
    "explanation": "RDB is compact and fast for disaster recovery; AOF logs every write operation, offering near-zero data loss at slightly higher disk I/O cost.",
    "tags": [
      "System Design",
      "Caching",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Caching",
    "subtopic": "TTL (Time-To-Live) Strategy",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Why is assigning a TTL (expiration time) to all cached keys considered a mandatory operational best practice?",
    "options": [
      "Guarantees that stale data will eventually be purged automatically and bounds memory growth to prevent OutOfMemory crashes",
      "Increases CPU speed",
      "Encourages faster typing by developers",
      "Disables database writes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Even if invalidation logic fails to trigger on an update, TTL provides an automatic upper bound on how long stale data can persist in cache.",
    "tags": [
      "System Design",
      "Caching",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Caching",
    "subtopic": "Spatial Locality in Caching",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is Spatial Locality in caching systems?",
    "options": [
      "The principle that accessing a particular memory address makes nearby adjacent addresses likely to be accessed soon",
      "Accessing memory at the same time every day",
      "Storing data on local hard drives",
      "Using GPS coordinates for caching"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Spatial locality is why systems fetch entire 64-byte CPU cache lines or 4KB disk blocks rather than individual isolated bytes.",
    "tags": [
      "System Design",
      "Caching",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Databases",
    "subtopic": "SQL vs NoSQL Trade-off",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "When is a Relational SQL database generally preferred over a NoSQL database?",
    "options": [
      "When the domain requires complex multi-table ACID transactions, strict schema consistency, and structured relational queries",
      "When storing petabytes of unorganized video files",
      "When horizontal scaling to 1000 nodes is primary requirement",
      "When schema changes every minute"
    ],
    "correctAnswerIndex": 0,
    "explanation": "RDBMS excels at structured, normalized financial or transactional systems where ACID guarantees are non-negotiable.",
    "tags": [
      "System Design",
      "Databases",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Databases",
    "subtopic": "NoSQL Categories",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What are the 4 primary categories of NoSQL databases?",
    "options": [
      "Document (MongoDB), Key-Value (Redis/DynamoDB), Wide-Column (Cassandra/HBase), and Graph (Neo4j)",
      "SQL, MySQL, PostgreSQL, SQLite",
      "Flat, Hierarchical, Network, Relational",
      "In-memory, On-disk, Cloud, Tape"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Each NoSQL family is optimized for distinct data models and query access patterns.",
    "tags": [
      "System Design",
      "Databases",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Databases",
    "subtopic": "Leader-Follower (Master-Slave) Replication",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In Single-Leader database replication, how are reads and writes distributed?",
    "options": [
      "All WRITE operations must go to the Leader (Master); READ operations can be distributed across multiple Followers (Slaves/Replicas)",
      "Writes go to all nodes simultaneously",
      "Reads go only to leader",
      "Any node accepts writes and reads equally"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The leader serializes writes and streams replication logs to followers; followers serve read queries, achieving high read scalability.",
    "tags": [
      "System Design",
      "Databases",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Databases",
    "subtopic": "Replication Lag & Read-Your-Writes Consistency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What problem can occur when a user updates their profile and immediately refreshes the page in an asynchronous replica setup?",
    "options": [
      "Replication Lag: the read hits a follower replica that has not yet applied the leader's update, making it appear as if the update vanished",
      "Database deadlock",
      "Data corruption on disk",
      "User password reset"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Asynchronous replication introduces a time delay (lag). Read-Your-Writes consistency routes a user's reads to the leader for a few seconds post-write.",
    "tags": [
      "System Design",
      "Databases",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Databases",
    "subtopic": "Multi-Leader Replication Conflicts",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the greatest architectural challenge of Multi-Leader (Master-Master) database replication across multiple data centers?",
    "options": [
      "Conflict Resolution: concurrent writes to the same record at different leaders must be resolved (e.g. Last-Write-Wins, CRDTs, or manual resolution)",
      "Network cables melting",
      "Multi-leader does not support reads",
      "Disk space is doubled"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If user A updates address in US datacenter and user B updates phone in EU datacenter simultaneously, the database must reconcile conflicting changes.",
    "tags": [
      "System Design",
      "Databases",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Databases",
    "subtopic": "Cassandra LSM Trees and SSTables",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How do Log-Structured Merge (LSM) Trees (used in Cassandra, RocksDB) achieve exceptional write throughput?",
    "options": [
      "Appends writes sequentially to an in-memory MemTable and commit log; flushes to immutable SSTables on disk without expensive random disk seeks",
      "Updates B+ trees in place on disk",
      "Disables disk writes entirely",
      "Stores everything in RAM permanently"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Sequential disk writes are 100x faster than random I/O. LSM trees convert all writes into sequential appends, merging files via compaction in background.",
    "tags": [
      "System Design",
      "Databases",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Databases",
    "subtopic": "Database Connection Pooling",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Why do backend applications use Database Connection Pools (HikariCP, pgBouncer)?",
    "options": [
      "Establishing a new database TCP + TLS + authentication connection is expensive; pooling maintains pre-opened connections ready for instant reuse",
      "Encrypts database data",
      "Bypasses SQL syntax checks",
      "Allows infinite simultaneous queries"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Opening a new DB connection can take 50ms and consumes megabytes of server RAM. Reusing a pool of 20 connections maximizes throughput.",
    "tags": [
      "System Design",
      "Databases",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Databases",
    "subtopic": "Polyglot Persistence",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is 'Polyglot Persistence' in modern microservice architecture?",
    "options": [
      "Using different database technologies tailored to the specific data needs of different services (e.g. Postgres for billing, Neo4j for social graph, Redis for sessions)",
      "Writing SQL queries in multiple programming languages",
      "Translating database tables to JSON",
      "Backing up databases to multiple clouds"
    ],
    "correctAnswerIndex": 0,
    "explanation": "No single database is ideal for all access patterns. Polyglot persistence selects the best storage tool for each distinct domain problem.",
    "tags": [
      "System Design",
      "Databases",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Databases",
    "subtopic": "Time-Series Databases (TSDB)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why are Time-Series Databases (InfluxDB, TimescaleDB, Prometheus) optimized for IoT and metrics monitoring?",
    "options": [
      "Optimized for high-volume sequential timestamped appends, fast time-bucket aggregations (e.g. 5-min averages), and automatic data retention aging",
      "They replace relational databases for e-commerce",
      "They don't use disks",
      "They store video files efficiently"
    ],
    "correctAnswerIndex": 0,
    "explanation": "TSDBs organize data in temporal chunks with delta-of-delta compression, enabling querying billions of metric data points over time windows.",
    "tags": [
      "System Design",
      "Databases",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Queues",
    "subtopic": "Message Queue vs Pub/Sub",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the difference between a Point-to-Point Message Queue and a Publish/Subscribe (Pub/Sub) Topic?",
    "options": [
      "In a Message Queue, each message is consumed by exactly ONE worker; in Pub/Sub, a message is broadcast to ALL subscribed consumers",
      "Queue broadcasts to all; Pub/Sub delivers to one",
      "Message Queues are in-memory only",
      "Pub/sub cannot have consumers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Point-to-point queues (RabbitMQ queue) balance tasks across competing workers; Pub/Sub (Kafka topic) fans out identical events to multiple independent services.",
    "tags": [
      "System Design",
      "Queues",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Queues",
    "subtopic": "Kafka Log Partitioning Architecture",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In Apache Kafka, what is a Partition and how does it enable massive parallel consumption?",
    "options": [
      "An immutable, append-only commit log; Kafka assigns each partition within a topic to exactly one consumer instance in a consumer group",
      "A temporary memory buffer",
      "A physical hard drive partition",
      "An encrypted message filter"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Partitioning is Kafka's unit of scalability. A topic with 10 partitions allows 10 worker instances to process messages in parallel with strict in-order guarantees per partition.",
    "tags": [
      "System Design",
      "Queues",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Queues",
    "subtopic": "Message Delivery Guarantees",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What are the 3 standard Message Delivery Semantics in distributed messaging systems?",
    "options": [
      "At-Most-Once (may drop, zero dupes), At-Least-Once (guaranteed arrival, possible dupes), and Exactly-Once (guaranteed once via deduplication)",
      "Fast, Medium, Slow",
      "Public, Private, Protected",
      "Push, Pull, Poll"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Most distributed systems operate at At-Least-Once delivery, requiring consumers to be idempotent to handle occasional retried duplicate messages.",
    "tags": [
      "System Design",
      "Queues",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Queues",
    "subtopic": "Consumer Idempotency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why MUST message consumers in an At-Least-Once messaging pipeline be Idempotent?",
    "options": [
      "Network timeouts or broker re-deliveries may send the same message twice; processing duplicate messages must not cause duplicate side effects (e.g. double charging)",
      "To speed up consumption",
      "Because queues delete unacknowledged messages",
      "To reduce network bandwidth"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If consumer crashes after charging credit card but before sending ACK to queue, message is redelivered. Unique transaction IDs prevent double charging.",
    "tags": [
      "System Design",
      "Queues",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Queues",
    "subtopic": "Dead Letter Queue (DLQ)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the purpose of a Dead Letter Queue (DLQ) in message-driven systems?",
    "options": [
      "Stores 'poison pill' messages that repeatedly fail processing after maximum retry attempts, preventing them from blocking the queue indefinitely",
      "Stores deleted messages permanently",
      "Deletes corrupted messages without logging",
      "Caches high-priority messages"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Poison messages that throw exceptions repeatedly are quarantined into the DLQ for manual developer inspection, unblocking the main message pipeline.",
    "tags": [
      "System Design",
      "Queues",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Queues",
    "subtopic": "Push vs Pull Consumption Models",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the advantage of Kafka's Pull-based consumer model over a traditional broker Push model (like RabbitMQ)?",
    "options": [
      "Consumers pull messages at their own sustainable pace, preventing fast brokers from overwhelming slow consumers, and enabling batching",
      "Pull models have zero network traffic",
      "Brokers require no CPU in pull models",
      "Pull models guarantee zero latency"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Pull-based consumers control their own throughput, pulling large batches when caught up and smaller batches when under heavy load.",
    "tags": [
      "System Design",
      "Queues",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Queues",
    "subtopic": "Message Ordering Guarantees",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does Kafka guarantee strict FIFO message ordering for messages belonging to the same user?",
    "options": [
      "Assigns messages with the same user_id as the message Partition Key, hashing them to the exact same partition",
      "Orders all messages across the entire cluster globally",
      "Sorts messages on consumer side",
      "Using timestamps in database"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Kafka guarantees strict message ordering within a single partition. Hashing by entity key ensures all events for user X route to the same partition.",
    "tags": [
      "System Design",
      "Queues",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Queues",
    "subtopic": "Compacted Topics in Kafka",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What does Kafka Log Compaction do for a topic?",
    "options": [
      "Retains at least the latest record for each message key, deleting older superseded versions of the same key to represent current state",
      "Compresses messages using gzip",
      "Deletes messages older than 7 days",
      "Encrypts message keys"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Log compaction retains the latest snapshot of state per key, enabling new consumers to restore state (like a full table cache) by replaying the log.",
    "tags": [
      "System Design",
      "Queues",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Queues",
    "subtopic": "Backlog Monitoring & Consumer Lag",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does 'Consumer Lag' measure in a distributed queue monitoring dashboard?",
    "options": [
      "The delta (difference) between the latest produced message offset and the current consumer offset (unprocessed message backlog)",
      "The network ping time between consumer and broker",
      "The time taken to serialize a message",
      "The CPU idle percentage"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Rising consumer lag indicates that consumer workers are falling behind producers, signaling the need to scale up worker instances.",
    "tags": [
      "System Design",
      "Queues",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Microservices",
    "subtopic": "Microservices vs Monolith",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the primary architectural trade-off of Microservices compared to a Monolithic architecture?",
    "options": [
      "Independent deployment, scaling, and tech stack flexibility, at the cost of distributed complexity, network latency, and eventual consistency challenges",
      "Microservices use zero network bandwidth",
      "Monoliths cannot connect to databases",
      "Microservices have zero failure points"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Microservices decouple teams and deployments, but introduce distributed systems headaches: network failures, distributed tracing, and data partitioning.",
    "tags": [
      "System Design",
      "Microservices",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Microservices",
    "subtopic": "API Gateway Pattern",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What are the primary responsibilities of an API Gateway in microservices architecture?",
    "options": [
      "Single entry point for clients, routing requests, handling authentication/authorization, rate limiting, and protocol translation (e.g. HTTP to gRPC)",
      "Directly executing SQL database queries",
      "Replacing all microservice containers",
      "Compiling backend source code"
    ],
    "correctAnswerIndex": 0,
    "explanation": "An API gateway isolates client apps from internal microservice boundaries, centralizing security, metrics, rate limiting, and cross-cutting concerns.",
    "tags": [
      "System Design",
      "Microservices",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Microservices",
    "subtopic": "Database Per Service Pattern",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why is the 'Database per Service' pattern strongly advocated in microservices design?",
    "options": [
      "Ensures services are completely decoupled; no service can directly query another service's database, preventing shared schema dependencies",
      "Saves database license costs",
      "Allows all services to share one SQL table",
      "Reduces total database instances"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Direct database sharing creates tight coupling: changing a table schema in Service A breaks Service B. Services must communicate strictly via public APIs.",
    "tags": [
      "System Design",
      "Microservices",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Microservices",
    "subtopic": "Circuit Breaker Pattern",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What are the 3 states of the Circuit Breaker Pattern (Netflix Hystrix, Resilience4j)?",
    "options": [
      "Closed (normal requests pass) \u2192 Open (downstream failing, fail fast without calling) \u2192 Half-Open (trial requests to test recovery)",
      "On, Off, Standby",
      "Active, Inactive, Blocked",
      "Read, Write, Execute"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Circuit breakers prevent cascading failures: if service B is down, service A trips the breaker to 'Open', failing fast immediately instead of exhausting threads.",
    "tags": [
      "System Design",
      "Microservices",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Microservices",
    "subtopic": "Saga Pattern (Choreography vs Orchestration)",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How does the Saga pattern maintain data consistency across distributed microservice databases without distributed 2PC locks?",
    "options": [
      "Executes a sequence of local transactions; if one fails, it executes Compensating Transactions in reverse to undo earlier steps",
      "Uses two-phase locking across network",
      "Freezes all microservices until commit",
      "Shares a global MySQL transaction"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Sagas handle multi-service workflows via Choreography (event-driven pub/sub) or Orchestration (central orchestrator directing steps and compensations).",
    "tags": [
      "System Design",
      "Microservices",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Microservices",
    "subtopic": "BFF (Backend for Frontend) Pattern",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the purpose of the Backend For Frontend (BFF) architectural pattern?",
    "options": [
      "Creates dedicated API gateway layers tailored to the specific user interface needs of different clients (e.g. Mobile BFF vs Desktop Web BFF)",
      "Replaces front-end JavaScript with backend C++",
      "Runs the browser on the server",
      "Connects frontend directly to database"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Mobile apps require lightweight, combined payloads over cellular data; desktop apps require richer data feeds. BFF customizes APIs per client type.",
    "tags": [
      "System Design",
      "Microservices",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Microservices",
    "subtopic": "Distributed Tracing (OpenTelemetry)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does Distributed Tracing (Jaeger, Zipkin) track a single user request as it traverses 20 microservices?",
    "options": [
      "Injects and propagates a unique Trace ID and Span IDs across HTTP/gRPC request headers (e.g. W3C `traceparent`) across all network hops",
      "Watches server CPU temperatures",
      "Logs all IP addresses to disk",
      "Uses GPS timestamps"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Propagating Trace IDs allows logging aggregators to stitch together the complete end-to-end call tree, showing exact latency bottlenecks across services.",
    "tags": [
      "System Design",
      "Microservices",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Microservices",
    "subtopic": "Service Discovery (Consul / Eureka)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Why is dynamic Service Discovery necessary in containerized cloud environments (Kubernetes)?",
    "options": [
      "Containers dynamically spin up, scale down, and change private IP addresses frequently; services query the discovery registry to locate healthy instances",
      "To discover open Wi-Fi networks",
      "To install software updates",
      "To register domain names with ICANN"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Service discovery registries maintain dynamic, real-time directories of active service instance IPs and ports verified by continuous health checks.",
    "tags": [
      "System Design",
      "Microservices",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Microservices",
    "subtopic": "Strangler Fig Pattern",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the Strangler Fig pattern in legacy system migration?",
    "options": [
      "Incrementally refactoring a monolithic application by gradually replacing specific features with microservices behind a proxy until the monolith is retired",
      "Deleting the monolith in one weekend",
      "Running two identical monoliths in parallel",
      "Rebuilding everything from scratch before launching"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Named after vines that gradually envelop trees, it migrates functionality piece-by-piece, routing new routes to microservices while legacy remains stable.",
    "tags": [
      "System Design",
      "Microservices",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "CAP",
    "subtopic": "CAP Theorem Definition",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does Eric Brewer's CAP Theorem state for distributed data stores?",
    "options": [
      "In the event of a Network Partition (P), a distributed system can guarantee at most Consistency (C) OR Availability (A), but CANNOT guarantee both",
      "A system can have Consistency, Availability, and Performance simultaneously",
      "Partitions can be eliminated with fiber cables",
      "Consistency is impossible"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Network partitions are inevitable physical realities in distributed networks. When a partition occurs, you must choose between consistency or availability.",
    "tags": [
      "System Design",
      "CAP",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "CAP",
    "subtopic": "Consistency in CAP (Linearizability)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does Consistency (C) specifically mean in the context of the CAP Theorem?",
    "options": [
      "Linearizability: Every read receives the most recent write or an error (all nodes see the exact same data at the exact same instant)",
      "The 'C' in ACID (schema integrity)",
      "Data is never corrupted on disk",
      "Code compiles without warnings"
    ],
    "correctAnswerIndex": 0,
    "explanation": "CAP Consistency is atomic consistency (linearizability): concurrent reads across different distributed nodes must return identical up-to-date values.",
    "tags": [
      "System Design",
      "CAP",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "CAP",
    "subtopic": "Availability in CAP Definition",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does Availability (A) specifically mean in the CAP Theorem?",
    "options": [
      "Every non-failing node must return a non-error response for every request received (even if data is stale due to a partition)",
      "System has 99.999% uptime per year",
      "Servers have backup power supplies",
      "Database connections are instant"
    ],
    "correctAnswerIndex": 0,
    "explanation": "CAP Availability mandates that any functioning replica must return a valid answer without erroring out, even if it cannot reach its peers.",
    "tags": [
      "System Design",
      "CAP",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "CAP",
    "subtopic": "Partition Tolerance (P) Non-Negotiability",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Why is Partition Tolerance (P) mandatory in any real-world distributed system?",
    "options": [
      "Network cables, switches, and internet connections physically fail or drop packets; a distributed system MUST be able to survive network partitions",
      "It is enforced by international law",
      "CPUs require partition tolerance",
      "To allow database sharding"
    ],
    "correctAnswerIndex": 0,
    "explanation": "You cannot 'choose CA' in a distributed network across multiple machines, because network partitions cannot be prevented in the physical universe.",
    "tags": [
      "System Design",
      "CAP",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "CAP",
    "subtopic": "CP System Behavior during Partition",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does a CP system (like HBase, Zookeeper, or etcd with Raft) behave when a network partition separates nodes?",
    "options": [
      "It rejects write/read requests or blocks on minority nodes to prevent inconsistent split-brain states, sacrificing Availability to preserve Consistency",
      "It answers all requests immediately with old data",
      "It deletes the database",
      "It switches to Bluetooth"
    ],
    "correctAnswerIndex": 0,
    "explanation": "CP systems prioritize correctness: if a quorum cannot be reached, the system returns errors rather than serving conflicting or stale data.",
    "tags": [
      "System Design",
      "CAP",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "CAP",
    "subtopic": "AP System Behavior during Partition",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does an AP system (like Apache Cassandra, DynamoDB, or Couchbase) behave during a network partition?",
    "options": [
      "Both partitions continue accepting reads and writes locally, keeping the system Available but sacrificing Consistency (data diverges temporarily)",
      "It shuts down the entire cluster",
      "It throws 500 Internal Server Errors",
      "It waits indefinitely for network to reconnect"
    ],
    "correctAnswerIndex": 0,
    "explanation": "AP systems prioritize availability: nodes serve requests with local data. When the partition heals, reconciliation algorithms resolve divergent updates.",
    "tags": [
      "System Design",
      "CAP",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "CAP",
    "subtopic": "PACELC Theorem Extension",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What does Daniel Abadi's PACELC Theorem add to the traditional CAP Theorem?",
    "options": [
      "If there is a Partition (P), trade off Availability (A) and Consistency (C); ELSE (E), trade off Latency (L) and Consistency (C)",
      "Calculates database licensing costs",
      "Adds Security and Encryption to CAP",
      "Measures network bandwidth"
    ],
    "correctAnswerIndex": 0,
    "explanation": "CAP only describes behavior during rare network partitions. PACELC explains normal operations: systems like MongoDB choose Latency over Consistency even when healthy.",
    "tags": [
      "System Design",
      "CAP",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "CAP",
    "subtopic": "Split-Brain Scenario",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the 'Split-Brain' hazard in distributed leader election?",
    "options": [
      "A network partition splits a cluster into two halves, each electing its own Leader and accepting writes independently, corrupting data integrity",
      "A CPU running two threads simultaneously",
      "A developer forgetting database passwords",
      "A hard drive head failure"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Split-brain results in irreconcilable divergent data. Systems require Quorum consensus (majority > N/2) so only one partition can elect a leader.",
    "tags": [
      "System Design",
      "CAP",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "CAP",
    "subtopic": "Quorum Intersection Rule (R + W > N)",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In leaderless distributed databases (Dynamo), given N replicas, read quorum R, and write quorum W, why does `R + W > N` guarantee strong consistency?",
    "options": [
      "The Pigeonhole Principle guarantees that the read quorum and write quorum must overlap by at least one node, ensuring the read set contains the latest write",
      "It eliminates network latency",
      "It allows zero-packet transmission",
      "It encrypts all data"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If R + W > N, any set of R nodes read will contain at least one node that participated in the most recent W-node write quorum, returning the latest version.",
    "tags": [
      "System Design",
      "CAP",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Consistency",
    "subtopic": "Eventual Consistency Definition",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is Eventual Consistency in distributed systems (BASE model)?",
    "options": [
      "If no new updates are made, all replicas will eventually converge to become identical over time",
      "Data is consistent immediately on write",
      "Data is only consistent on Sundays",
      "Data is never consistent"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Eventual consistency allows replicas to diverge temporarily during writes, guaranteeing convergence once update propagations settle.",
    "tags": [
      "System Design",
      "Consistency",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Consistency",
    "subtopic": "Strong vs Eventual Consistency Trade-off",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the primary trade-off of choosing Strong Consistency over Eventual Consistency?",
    "options": [
      "Higher latency and reduced write availability (requires synchronous multi-node consensus) vs ultra-fast writes with temporary stale reads",
      "Strong consistency uses more hard drive space",
      "Eventual consistency causes permanent data loss",
      "Strong consistency disables SQL"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Strong consistency requires synchronous coordination across nodes before acknowledging writes, adding network latency; eventual consistency acknowledges immediately.",
    "tags": [
      "System Design",
      "Consistency",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Consistency",
    "subtopic": "Read-Your-Writes Consistency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does 'Read-Your-Writes' consistency guarantee to a client?",
    "options": [
      "A user will always see updates submitted by themselves, even if other users have not yet seen those updates",
      "All users see updates at the same millisecond",
      "Writes are free of cost",
      "Reads never touch cache"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Prevents the jarring user experience of posting a comment, refreshing the page, and seeing the comment disappear due to hitting a lagging replica.",
    "tags": [
      "System Design",
      "Consistency",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Consistency",
    "subtopic": "Monotonic Read Consistency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does 'Monotonic Read' consistency prevent in distributed systems?",
    "options": [
      "Prevents a user from observing time move backwards (if a user reads version 3 of an object, subsequent reads will never return version 1 or 2)",
      "Prevents reading from SSDs",
      "Forces all reads to be sequential",
      "Limits user to 1 read per second"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Without monotonic reads, a user querying node A (version 2) and then node B (lagging replica with version 1) would see data travel backward in time.",
    "tags": [
      "System Design",
      "Consistency",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Consistency",
    "subtopic": "Vector Clocks",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What do Vector Clocks capture in distributed systems that physical wall-clock timestamps cannot?",
    "options": [
      "Causal Relationships (Happens-Before order) between distributed events without relying on synchronized physical clocks",
      "Network bandwidth speeds",
      "CPU clock ticks per second",
      "Disk spin speeds"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Physical clocks drift via clock skew. Vector clocks use arrays of logical counters per node to establish causal event order and detect concurrent conflicts.",
    "tags": [
      "System Design",
      "Consistency",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Consistency",
    "subtopic": "Conflict-Free Replicated Data Types (CRDTs)",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How do CRDTs (used in Figma collaborative editing, Apple Notes, Redis Enterprise) resolve concurrent edits without locks?",
    "options": [
      "Mathematical convergence properties (commutativity and associativity): operations or states can be merged in any arbitrary order yielding identical final state",
      "Using a central master server in California",
      "Prompting the user with a conflict dialog box",
      "Discarding the second edit automatically"
    ],
    "correctAnswerIndex": 0,
    "explanation": "CRDTs guarantee that regardless of network delays or message delivery order, all replicas merging the operations arrive at mathematically identical state.",
    "tags": [
      "System Design",
      "Consistency",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Consistency",
    "subtopic": "Last-Write-Wins (LWW) Data Loss",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why is the Last-Write-Wins (LWW) conflict resolution strategy dangerous in distributed databases (like Cassandra)?",
    "options": [
      "Unsynchronized NTP physical clock drift can cause a genuinely earlier update with a slightly ahead timestamp to overwrite a genuinely newer update",
      "LWW uses too much memory",
      "LWW requires manual intervention",
      "LWW causes server reboots"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If server A's clock is 50ms fast, its writes will silently overwrite subsequent writes from server B, causing silent data loss.",
    "tags": [
      "System Design",
      "Consistency",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Consistency",
    "subtopic": "Linearizability vs Serializability",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the distinction between Linearizability and Serializability?",
    "options": [
      "Serializability is a multi-operation, multi-object transactional isolation property (ACID); Linearizability is a real-time recency guarantee on a SINGLE object (CAP)",
      "They are identical concepts",
      "Linearizability is for databases; Serializability is for networks",
      "Serializability is non-blocking"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Serializability ensures transaction order equals SOME serial sequence without real-time bounds; Linearizability requires reads to reflect the latest write in real time.",
    "tags": [
      "System Design",
      "Consistency",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Consistency",
    "subtopic": "BASE Model Acronym",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does the BASE acronym in NoSQL distributed system philosophy stand for?",
    "options": [
      "Basically Available, Soft state, Eventual consistency",
      "Basic Architecture, Scalable, Encrypted",
      "Binary, Asynchronous, Synchronous, Encrypted",
      "Buffered, Atomic, Structured, Enterprise"
    ],
    "correctAnswerIndex": 0,
    "explanation": "BASE is the relaxed alternative to ACID, prioritizing continuous availability and acceptable soft-state drift that eventually becomes consistent.",
    "tags": [
      "System Design",
      "Consistency",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Availability",
    "subtopic": "High Availability Nines",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How much total downtime per year is permitted by 'Five Nines' (99.999%) availability SLA?",
    "options": [
      "Approximately 5.26 minutes per year",
      "5 hours per year",
      "5 days per year",
      "50 seconds per day"
    ],
    "correctAnswerIndex": 0,
    "explanation": "99.9% (Three Nines) = 8.76 hours/yr; 99.99% (Four Nines) = 52.6 minutes/yr; 99.999% (Five Nines) = 5.26 minutes/year.",
    "tags": [
      "System Design",
      "Availability",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Availability",
    "subtopic": "Single Point of Failure (SPOF)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is a Single Point of Failure (SPOF) in system architecture?",
    "options": [
      "Any individual hardware or software component whose failure will cause the entire system to stop functioning",
      "A point where user authentication fails",
      "A server with only one CPU core",
      "An unencrypted database table"
    ],
    "correctAnswerIndex": 0,
    "explanation": "High availability requires eliminating SPOFs at every layer (dual power supplies, redundant NICs, multi-AZ databases, load balancer pairs).",
    "tags": [
      "System Design",
      "Availability",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Availability",
    "subtopic": "Failover (Active-Active vs Active-Passive)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the difference between an Active-Active and an Active-Passive failover cluster?",
    "options": [
      "In Active-Active, all nodes actively process traffic simultaneously; in Active-Passive, backup nodes sit idle on standby until the primary node fails",
      "Active-Passive is faster",
      "Active-Active cannot handle failures",
      "Active-Passive uses zero power"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Active-Active fully utilizes all deployed hardware and provides instantaneous zero-downtime failover; Active-Passive has cold/warm standby delay.",
    "tags": [
      "System Design",
      "Availability",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Availability",
    "subtopic": "RTO vs RPO Disaster Recovery",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What do Recovery Time Objective (RTO) and Recovery Point Objective (RPO) measure in Disaster Recovery planning?",
    "options": [
      "RTO is maximum acceptable downtime duration to restore service; RPO is maximum acceptable data loss measured in time (e.g. 1 hour of lost transactions)",
      "RTO measures database speed; RPO measures network speed",
      "They are identical metrics",
      "RTO is for hardware; RPO is for software"
    ],
    "correctAnswerIndex": 0,
    "explanation": "RTO targets how quickly you get back online; RPO targets how recent your restored data backup must be (how much data you can afford to lose).",
    "tags": [
      "System Design",
      "Availability",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Availability",
    "subtopic": "Chaos Engineering (Chaos Monkey)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the philosophy of Chaos Engineering pioneered by Netflix (Chaos Monkey)?",
    "options": [
      "Intentionally injecting random hardware, network, and service failures into live production environments to proactively discover and harden system resilience",
      "Writing buggy code intentionally",
      "Rebooting all servers at midnight",
      "Deleting databases for fun"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Constantly testing automated failover under real conditions proves that services degrade gracefully and self-heal without human intervention.",
    "tags": [
      "System Design",
      "Availability",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Availability",
    "subtopic": "Graceful Degradation (Fallbacks)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does Graceful Degradation protect user experience during partial system outage (e.g. recommendation engine failure on Netflix)?",
    "options": [
      "Returns a static fallback response (e.g. popular top 10 movies) while core video playback continues functioning normally without showing error screens",
      "Crashes the entire website",
      "Displays 500 error page",
      "Locks user accounts"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Non-critical ancillary service failures should never bring down critical business paths; fallback responses preserve core platform utility.",
    "tags": [
      "System Design",
      "Availability",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Availability",
    "subtopic": "Bulkhead Pattern",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Inspired by watertight ship hulls, how does the Bulkhead Pattern isolate resources in software architecture?",
    "options": [
      "Partitions resource pools (thread pools, memory, connections) per client or feature so a failure/exhaustion in one does not sink the entire system",
      "Splits the server into two physical boxes",
      "Waterproofs server racks",
      "Encrypts memory"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If image uploads exhaust their dedicated thread pool, user logins serviced by a separate thread pool continue operating unaffected.",
    "tags": [
      "System Design",
      "Availability",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Availability",
    "subtopic": "Rate Limiting Algorithms (Token Bucket)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does the Token Bucket algorithm enforce API Rate Limiting while permitting burst traffic?",
    "options": [
      "Tokens are added to a bucket at a constant fill rate up to max capacity; each request consumes 1 token. If bucket has tokens, request proceeds; if empty, rejected (429)",
      "Drops all packets over 10KB",
      "Allows fixed number of requests per hour with no bursts",
      "Counts CPU ticks"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Token bucket allows bursts up to bucket capacity while strictly enforcing a sustainable long-term average consumption rate.",
    "tags": [
      "System Design",
      "Availability",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Availability",
    "subtopic": "Multi-AZ and Multi-Region Redundancy",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Why do cloud architects deploy services across multiple Availability Zones (Multi-AZ) within a region?",
    "options": [
      "AZs are physically isolated data centers with independent power, cooling, and networking; a flood or power failure at one AZ does not impact the others",
      "Reduces international internet bills",
      "Avoids software licensing fees",
      "Increases CPU clock frequency"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Multi-AZ deployment protects against physical data center disasters while maintaining sub-millisecond low latency cross-datacenter replication.",
    "tags": [
      "System Design",
      "Availability",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Distributed Systems",
    "subtopic": "Two Generals Problem",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What fundamental truth about distributed consensus over unreliable networks is proven by the Two Generals Problem?",
    "options": [
      "It is mathematically impossible for two nodes to reach 100% certainty of agreement over an unreliable communication channel",
      "General generals cannot communicate",
      "All networks drop packets",
      "Encryption is impossible"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Every confirmation message itself requires an acknowledgment, resulting in an infinite regress of ACKs of ACKs with lingering uncertainty.",
    "tags": [
      "System Design",
      "Distributed Systems",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Distributed Systems",
    "subtopic": "Byzantine Fault Tolerance (BFT)",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is a Byzantine Fault in distributed computing?",
    "options": [
      "A fault where a node not only fails or delays, but exhibits arbitrary, malicious, or treacherous behavior (sending conflicting information to different peers)",
      "A complete power outage",
      "A network cable cut",
      "A dropped TCP packet"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Byzantine nodes can act maliciously or exhibit corrupted state; BFT consensus algorithms (like PBFT or Proof of Work) require 3f + 1 nodes to tolerate f traitors.",
    "tags": [
      "System Design",
      "Distributed Systems",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Distributed Systems",
    "subtopic": "Raft Consensus Algorithm",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What are the 3 roles a node can occupy in the Raft Consensus protocol (used in etcd and Kubernetes)?",
    "options": [
      "Leader, Candidate, and Follower",
      "Master, Worker, and Backup",
      "Client, Server, and Proxy",
      "Publisher, Subscriber, and Broker"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Nodes start as Followers. If heartbeat times out, a follower transitions to Candidate and requests votes. Winning majority votes promotes node to Leader.",
    "tags": [
      "System Design",
      "Distributed Systems",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Distributed Systems",
    "subtopic": "Split-Brain Prevention with Quorum",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In a distributed cluster of 5 nodes running Raft or Paxos, what is the minimum Quorum size required to elect a leader or commit a log entry?",
    "options": [
      "3 nodes (strictly greater than N / 2, i.e. floor(5/2) + 1 = 3)",
      "2 nodes",
      "5 nodes",
      "1 node"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Strict majority quorum `floor(N/2) + 1` guarantees that two disjoint partitions can never both form a majority simultaneously, preventing split-brain.",
    "tags": [
      "System Design",
      "Distributed Systems",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Distributed Systems",
    "subtopic": "Gossip Protocol",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does a Gossip (Epidemic) Protocol propagate node state and cluster membership in decentralized systems (like Cassandra)?",
    "options": [
      "Each node periodically selects a few random peer nodes and exchanges state updates, propagating information exponentially across the cluster",
      "Broadcasting to all nodes simultaneously every millisecond",
      "Routing through a single master node",
      "Using satellite signals"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Gossip protocols provide highly fault-tolerant, decentralized, O(log N) state dissemination without any centralized coordinator node.",
    "tags": [
      "System Design",
      "Distributed Systems",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Distributed Systems",
    "subtopic": "Fallacies of Distributed Computing",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Which of the following is recognized as the #1 Fallacy of Distributed Computing (Peter Deutsch)?",
    "options": [
      "'The network is reliable'",
      "'Bandwidth is finite'",
      "'Topology changes'",
      "'There is one administrator'"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Architects mistakenly assume network connections never drop, latency is zero, and bandwidth is infinite, leading to fragile software designs.",
    "tags": [
      "System Design",
      "Distributed Systems",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Distributed Systems",
    "subtopic": "Distributed Locking with Redlock",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How does the Redlock algorithm (Redis) achieve reliable distributed locking across independent Redis nodes?",
    "options": [
      "The client attempts to acquire the lock with a short timeout across a majority (N/2 + 1) of independent Redis master instances",
      "Locks all databases globally forever",
      "Uses OS mutexes over the internet",
      "Relies on a single Redis master without replicas"
    ],
    "correctAnswerIndex": 0,
    "explanation": "By requiring quorum acquisition across independent nodes within a timeframe smaller than the lock validity time, Redlock survives single node crashes.",
    "tags": [
      "System Design",
      "Distributed Systems",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Distributed Systems",
    "subtopic": "Lamport Logical Timestamps",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In Leslie Lamport's Logical Clock algorithm, how does a process update its internal clock C upon receiving a message with timestamp T?",
    "options": [
      "C = max(C, T) + 1",
      "C = C + T",
      "C = min(C, T)",
      "C = T"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Setting clock to max(local, received) + 1 guarantees that if event A caused event B (A -> B), then timestamp(A) < timestamp(B).",
    "tags": [
      "System Design",
      "Distributed Systems",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  },
  {
    "subject": "SYSTEM_DESIGN",
    "topic": "Distributed Systems",
    "subtopic": "Idempotency Keys in API Design",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How do payment platforms (Stripe) use Idempotency Keys (e.g. `Idempotency-Key: UUID`) to prevent duplicate credit card charges on network retries?",
    "options": [
      "The server records the unique key and cached response; if a retry arrives with the identical key, it returns the cached result without re-charging",
      "Encrypts credit card numbers",
      "Disables retries completely",
      "Charges the card twice and refunds one"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Idempotency keys ensure safe retries: client generates UUID before sending; if network drops on ACK, client retries safely without triggering duplicate processing.",
    "tags": [
      "System Design",
      "Distributed Systems",
      "Distributed Systems",
      "Cloud",
      "Architecture"
    ],
    "examRelevance": "GATE Information Systems, Cloud Architecture Exams",
    "placementRelevance": "Google, Meta, Uber, Amazon System Design Rounds"
  }
];
