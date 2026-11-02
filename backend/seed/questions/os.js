// OS Question Bank (110 Questions)
export const OS_QUESTIONS = [
  {
    "subject": "OS",
    "topic": "Processes",
    "subtopic": "Process States",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What transition occurs when a running process initiates a disk I/O request in the 5-state process model?",
    "options": [
      "Running \u2192 Blocked (Waiting)",
      "Running \u2192 Ready",
      "Running \u2192 Terminated",
      "Blocked \u2192 Ready"
    ],
    "correctAnswerIndex": 0,
    "explanation": "When a running process invokes a blocking system call (like disk read), the OS moves it to the Blocked state until the I/O interrupt occurs.",
    "tags": [
      "OS",
      "Processes",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Processes",
    "subtopic": "Process Control Block (PCB)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Which of the following is NOT typically stored inside a Process Control Block (PCB)?",
    "options": [
      "The executable machine code instructions of other processes",
      "Program Counter (PC)",
      "CPU Register states",
      "Process ID and User ID"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The PCB stores context for its own process (registers, PID, memory bounds, open file descriptors); it never stores other processes' machine code.",
    "tags": [
      "OS",
      "Processes",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Processes",
    "subtopic": "fork() System Call",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In Unix/Linux, what does the fork() system call return to the parent process and to the child process upon success?",
    "options": [
      "Child's PID to the parent; 0 to the child",
      "0 to parent; child PID to child",
      "1 to parent; 0 to child",
      "Child PID to both"
    ],
    "correctAnswerIndex": 0,
    "explanation": "fork() returns the newly created child's PID to parent (allowing parent to track or wait), and returns 0 to child process.",
    "tags": [
      "OS",
      "Processes",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Processes",
    "subtopic": "Zombie Process",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is a Zombie Process in Unix-like operating systems?",
    "options": [
      "A process that has finished execution (called exit), but still occupies an entry in the process table because its parent has not yet read its exit status with wait()",
      "A process stuck in an infinite CPU loop",
      "A process whose parent terminated first",
      "A process that cannot be killed with SIGKILL"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A zombie process holds no code or data memory, only its exit code in the process table until the parent collects it via wait() or waitpid().",
    "tags": [
      "OS",
      "Processes",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Processes",
    "subtopic": "Orphan Process",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What happens to an Orphan Process whose parent terminates before the child finishes?",
    "options": [
      "It is automatically adopted by the system init / systemd process (PID 1)",
      "It is killed immediately by the kernel",
      "It becomes a zombie permanently",
      "It enters suspended state"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Orphaned processes are adopted by PID 1 (init/systemd), which periodically calls wait() to reap their exit codes upon termination.",
    "tags": [
      "OS",
      "Processes",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Processes",
    "subtopic": "Context Switching Overhead",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why is a process context switch considered pure OS overhead?",
    "options": [
      "During the switch, the CPU performs kernel book-keeping (saving/restoring registers, flushing TLB, switching page tables) without executing any user instructions",
      "It consumes 100% of hard drive bandwidth",
      "It requires rebooting the kernel",
      "It requires recompiling C code"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Context switching spends hundreds to thousands of CPU cycles purely preserving and restoring architectural and virtual memory state.",
    "tags": [
      "OS",
      "Processes",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Processes",
    "subtopic": "Inter-Process Communication (IPC)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the fastest Inter-Process Communication (IPC) mechanism between two processes on the same physical machine?",
    "options": [
      "Shared Memory",
      "UNIX Domain Sockets",
      "Named Pipes (FIFOs)",
      "Message Queues"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Shared Memory maps identical physical RAM frames into both processes' virtual address spaces, allowing data exchange at raw memory speeds without kernel copy overhead.",
    "tags": [
      "OS",
      "Processes",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Processes",
    "subtopic": "Copy-On-Write (COW)",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How does Copy-On-Write (COW) optimize process creation with fork() followed by exec()?",
    "options": [
      "Parent and child share physical memory pages marked read-only; a private physical page is only duplicated when either process attempts to write",
      "It duplicates all memory pages upfront",
      "It writes data directly to swap disk",
      "It disables virtual memory"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If child immediately calls exec(), copying all memory pages during fork() is wasted work. COW defers copying until a page modification occurs.",
    "tags": [
      "OS",
      "Processes",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Processes",
    "subtopic": "Unix Signals",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Which POSIX signal CANNOT be caught, blocked, or ignored by a user process?",
    "options": [
      "SIGKILL (Signal 9) and SIGSTOP",
      "SIGTERM",
      "SIGINT",
      "SIGHUP"
    ],
    "correctAnswerIndex": 0,
    "explanation": "SIGKILL and SIGSTOP are unconditionally intercepted and acted upon directly by the kernel, guaranteeing system administrator process control.",
    "tags": [
      "OS",
      "Processes",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Processes",
    "subtopic": "execve() Behavior",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "When a process calls execve() successfully, what happens to its current memory space and PID?",
    "options": [
      "The process address space (text, data, heap, stack) is overwritten with the new program binary, but the PID remains unchanged",
      "A new process with a new PID is created",
      "Both parent and child run in parallel",
      "The process is paused"
    ],
    "correctAnswerIndex": 0,
    "explanation": "execve() transforms the calling process into the new program, keeping the same PID, open file descriptors (unless FD_CLOEXEC set), and parent.",
    "tags": [
      "OS",
      "Processes",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Processes",
    "subtopic": "Process vs Program",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the fundamental difference between a Program and a Process?",
    "options": [
      "A Program is a passive executable file stored on disk; a Process is an active program instance executing in memory with dedicated resources",
      "A program is dynamic; a process is static",
      "A program has a PID; a process does not",
      "They are synonyms in computer science"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A program is passive code stored on secondary storage; a process is active, possessing a program counter, registers, stack, heap, and open resources.",
    "tags": [
      "OS",
      "Processes",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Threads",
    "subtopic": "User-Level vs Kernel-Level Threads",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is a major limitation of pure User-Level Threads (Many-to-One threading model)?",
    "options": [
      "If one user thread issues a blocking system call, the OS kernel blocks the entire process (all peer user threads)",
      "User threads are slower to context switch than kernel threads",
      "User threads require root permissions",
      "User threads cannot access heap memory"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Because the kernel is unaware of user-level threads, any blocking I/O request blocks the single kernel execution context representing the whole process.",
    "tags": [
      "OS",
      "Threads",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Threads",
    "subtopic": "Shared Resources in Multi-Threading",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Which of the following resources is strictly UNIQUE to each individual thread within a multi-threaded process?",
    "options": [
      "Register state, Program Counter, and Call Stack",
      "Heap memory",
      "Global variables",
      "Open file descriptors"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Threads share address space (code, global data, heap) and open files, but maintain private stacks, program counters, and CPU register sets.",
    "tags": [
      "OS",
      "Threads",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Threads",
    "subtopic": "Kernel 1:1 Threading Model",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Modern Linux (NPTL) and Windows implement which threading model by default?",
    "options": [
      "One-to-One (1:1) Model (each user thread maps directly to one kernel thread)",
      "Many-to-One (M:1)",
      "Two-to-One",
      "Zero-to-One"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The 1:1 model enables true multi-core hardware parallelism and ensures a blocking thread does not halt other threads in the process.",
    "tags": [
      "OS",
      "Threads",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Threads",
    "subtopic": "Thread Safety",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "A function is defined as Thread-Safe if:",
    "options": [
      "It can be called concurrently by multiple threads simultaneously without causing race conditions or data corruption",
      "It runs on a single CPU core only",
      "It does not allocate any heap memory",
      "It uses no parameters"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Thread-safe code guarantees correct execution when accessed by concurrent threads through mutual exclusion, immutability, or atomic primitives.",
    "tags": [
      "OS",
      "Threads",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Threads",
    "subtopic": "Race Condition",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is a Race Condition in concurrent software?",
    "options": [
      "A condition where the correctness of output depends on the non-deterministic relative timing or scheduling order of concurrent threads",
      "When two threads run on the same core",
      "When a thread runs faster than the CPU clock",
      "When memory leaks occur"
    ],
    "correctAnswerIndex": 0,
    "explanation": "When multiple threads read and write shared data without synchronization, interleaved execution causes unexpected and non-reproducible errors.",
    "tags": [
      "OS",
      "Threads",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Threads",
    "subtopic": "POSIX pthread_join()",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the purpose of calling pthread_join(thread_id, &status) in C/C++?",
    "options": [
      "Suspends calling thread until the target thread terminates, and reclaims its resources (similar to wait() for processes)",
      "Kills the target thread immediately",
      "Detaches the thread to run forever",
      "Pauses the target thread"
    ],
    "correctAnswerIndex": 0,
    "explanation": "pthread_join blocks the caller until the specified thread exits, retrieving the thread's return value and preventing resource leakage.",
    "tags": [
      "OS",
      "Threads",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Threads",
    "subtopic": "Thread Local Storage (TLS)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is Thread-Local Storage (TLS)?",
    "options": [
      "Static or global memory where each thread has its own dedicated, private instance of the variable",
      "Shared heap memory",
      "L1 CPU cache registers",
      "Kernel memory"
    ],
    "correctAnswerIndex": 0,
    "explanation": "TLS provides thread-isolated global variables (e.g. `__thread` in C or `ThreadLocal` in Java), avoiding locking overhead for thread-specific state.",
    "tags": [
      "OS",
      "Threads",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Threads",
    "subtopic": "Amdahl's Law",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Amdahl's Law states that if 25% of a program is strictly serial (cannot be parallelized), what is the theoretical maximum speedup on infinite CPU cores?",
    "options": [
      "4x",
      "10x",
      "Infinite speedup",
      "2.5x"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Speedup = 1 / (S + (1 - S) / N). As N approaches infinity with serial fraction S = 0.25, maximum speedup = 1 / 0.25 = 4x.",
    "tags": [
      "OS",
      "Threads",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Threads",
    "subtopic": "Hyper-Threading (SMT)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does Simultaneous Multi-Threading (Intel Hyper-Threading) provide at the physical hardware level?",
    "options": [
      "Duplicates architectural register states and program counters on a single physical core, presenting two logical cores to the OS",
      "Doubles the number of physical arithmetic logic units (ALUs)",
      "Doubles CPU clock frequency",
      "Adds secondary RAM chips to motherboard"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Hyper-threading keeps functional execution units busy by allowing instructions from two thread contexts to interleave dynamically on one physical core.",
    "tags": [
      "OS",
      "Threads",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Threads",
    "subtopic": "Reentrancy vs Thread-Safety",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the difference between a Reentrant function and a Thread-Safe function?",
    "options": [
      "A Reentrant function can be interrupted in mid-execution and re-entered by another caller (or signal) safely without locks; thread-safety may rely on mutexes",
      "They are identical concepts",
      "Thread-safe functions cannot use mutexes",
      "Reentrant functions cannot be recursive"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Reentrant code relies strictly on local/caller-supplied memory (never static data or locks), making it safe even during signal handler preemption.",
    "tags": [
      "OS",
      "Threads",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Threads",
    "subtopic": "Thread Pool Advantage",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Why do web servers utilize Thread Pools instead of creating a new thread per incoming HTTP request?",
    "options": [
      "Avoids thread creation/destruction overhead and bounds the maximum concurrent thread count to prevent memory/CPU exhaustion",
      "Guarantees zero network latency",
      "Disables database locks",
      "Encrypts incoming traffic"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Reusing existing worker threads eliminates thread lifecycle overhead and caps concurrency to avoid trashing system resources under peak load.",
    "tags": [
      "OS",
      "Threads",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "CPU Scheduling",
    "subtopic": "Preemptive vs Non-Preemptive",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the defining characteristic of Preemptive CPU scheduling?",
    "options": [
      "The OS scheduler can interrupt and remove a running process from the CPU before its CPU burst finishes (e.g. on timer interrupt or higher priority arrival)",
      "A process voluntarily relinquishes the CPU only upon completion or I/O",
      "Processes run on dedicated cores permanently",
      "Scheduling occurs without timer interrupts"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Preemption allows the kernel to forcibly context switch the running process to the Ready queue when a higher priority process arrives or time slice expires.",
    "tags": [
      "OS",
      "CPU Scheduling",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "CPU Scheduling",
    "subtopic": "Shortest Job First (SJF) Optimality",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Shortest Job First (SJF) is mathematically optimal because it achieves:",
    "options": [
      "The minimum average waiting time for any set of stationary processes",
      "The highest CPU clock frequency",
      "Zero context switches",
      "Strict FIFO fairness"
    ],
    "correctAnswerIndex": 0,
    "explanation": "By scheduling shortest CPU bursts first, waiting times for other pending processes are minimized, proving minimum average wait time mathematically.",
    "tags": [
      "OS",
      "CPU Scheduling",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "CPU Scheduling",
    "subtopic": "Round Robin Time Quantum Selection",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In Round Robin (RR) scheduling, what happens if the time quantum (time slice) is set excessively small?",
    "options": [
      "CPU context switching overhead skyrockets, degrading overall CPU throughput significantly",
      "The algorithm degrades to First-Come First-Served (FCFS)",
      "Processes starve",
      "Average response time increases to infinity"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Excessively small quantum causes the CPU to spend more time saving/restoring register state and flushing cache than executing useful work.",
    "tags": [
      "OS",
      "CPU Scheduling",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "CPU Scheduling",
    "subtopic": "Starvation in Priority Scheduling",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What standard mechanism solves the problem of Starvation (indefinite postponement) of low-priority processes in priority scheduling?",
    "options": [
      "Aging (gradually increasing the priority of processes that wait in the ready queue for a long time)",
      "Terminating low-priority processes",
      "Increasing time quantum",
      "Disabling interrupts"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Aging ensures that even the lowest priority process will eventually ascend to the highest priority level and execute.",
    "tags": [
      "OS",
      "CPU Scheduling",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "CPU Scheduling",
    "subtopic": "Convoy Effect",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In First-Come First-Served (FCFS) scheduling, what is the 'Convoy Effect'?",
    "options": [
      "Many short I/O-bound processes are forced to wait behind a single long CPU-bound process, resulting in poor CPU and I/O device utilization",
      "Processes colliding in network queues",
      "Context switches occurring too quickly",
      "Round robin queues overflowing"
    ],
    "correctAnswerIndex": 0,
    "explanation": "When a heavy CPU-burst process monopolizes the processor, all lightweight interactive tasks sit idle waiting, degrading interactive responsiveness.",
    "tags": [
      "OS",
      "CPU Scheduling",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "CPU Scheduling",
    "subtopic": "Multilevel Feedback Queue (MLFQ)",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How does a Multilevel Feedback Queue (MLFQ) dynamically prioritize interactive (I/O-bound) processes over batch (CPU-bound) processes?",
    "options": [
      "Processes that use their entire time quantum are demoted to lower-priority queues; processes that yield CPU before quantum expires remain in higher queues",
      "By examining file extensions of processes",
      "Using user password permissions",
      "By measuring RAM consumption"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Interactive processes yield quickly for user input and stay in high-priority low-quantum queues; CPU-hogs burn their full slice and sink to lower-priority queues.",
    "tags": [
      "OS",
      "CPU Scheduling",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "CPU Scheduling",
    "subtopic": "Linux CFS Scheduler",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "The Linux Completely Fair Scheduler (CFS) tracks process execution time using which metric stored in a Red-Black Tree?",
    "options": [
      "vruntime (Virtual Runtime)",
      "Priority score 1-100",
      "Remaining burst estimate",
      "I/O wait ratio"
    ],
    "correctAnswerIndex": 0,
    "explanation": "CFS picks the task with smallest vruntime from the left-most node of a red-black tree, ensuring fair CPU share scaled by nice level.",
    "tags": [
      "OS",
      "CPU Scheduling",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "CPU Scheduling",
    "subtopic": "Turnaround Time Formula",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the definition of Turnaround Time for a process?",
    "options": [
      "Completion Time minus Arrival Time (Time interval from process submission to termination)",
      "Waiting time plus I/O time",
      "Burst time minus arrival time",
      "Context switch time"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Turnaround Time = Completion Time - Arrival Time. It encompasses waiting time, CPU burst time, and I/O execution time.",
    "tags": [
      "OS",
      "CPU Scheduling",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "CPU Scheduling",
    "subtopic": "Response Time vs Waiting Time",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the difference between Waiting Time and Response Time?",
    "options": [
      "Waiting Time is total time spent in Ready queue; Response Time is time from submission to first CPU scheduling response",
      "They are identical in all schedulers",
      "Waiting time is for interactive tasks; response time is for batch",
      "Waiting time includes I/O time"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Response time measures latency to first reaction (critical for interactive UIs), whereas Waiting time aggregates all idle Ready queue intervals.",
    "tags": [
      "OS",
      "CPU Scheduling",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "CPU Scheduling",
    "subtopic": "SRTF Preemption Criterion",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In Shortest Remaining Time First (SRTF) scheduling, when does preemption occur?",
    "options": [
      "When a newly arrived process has a remaining CPU burst shorter than the remaining burst of the currently running process",
      "Every 10 milliseconds",
      "When current process requests I/O",
      "When process memory exceeds 1 GB"
    ],
    "correctAnswerIndex": 0,
    "explanation": "SRTF is preemptive SJF: if an incoming job can complete faster than the active job's remaining time, the active job is preempted immediately.",
    "tags": [
      "OS",
      "CPU Scheduling",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "CPU Scheduling",
    "subtopic": "CPU Bound vs I/O Bound",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "An I/O-bound process is characterized by:",
    "options": [
      "Many short CPU bursts interleaved with frequent I/O waits",
      "Long uninterrupted CPU calculations",
      "Zero system calls",
      "High GPU memory consumption"
    ],
    "correctAnswerIndex": 0,
    "explanation": "I/O-bound processes spend most of their existence waiting for input/output, spending very brief bursts computing between requests.",
    "tags": [
      "OS",
      "CPU Scheduling",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Deadlocks",
    "subtopic": "Coffman Conditions",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Which of the following is NOT one of the 4 necessary and sufficient Coffman conditions for a Deadlock?",
    "options": [
      "Starvation",
      "Mutual Exclusion",
      "Hold and Wait",
      "No Preemption and Circular Wait"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The 4 Coffman conditions are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Starvation is a related anomaly, not a condition.",
    "tags": [
      "OS",
      "Deadlocks",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Deadlocks",
    "subtopic": "Banker's Algorithm State Check",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the primary role of the Banker's Algorithm in operating systems?",
    "options": [
      "Deadlock Avoidance: tests if granting a resource request leaves the system in a Safe State where at least one execution sequence can finish",
      "Detecting deadlocks after they happen",
      "Terminating frozen processes",
      "Encrypting memory buffers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Banker's algorithm checks if a safe sequence exists prior to allocating resources. If no safe sequence exists, the request is denied or deferred.",
    "tags": [
      "OS",
      "Deadlocks",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Deadlocks",
    "subtopic": "Resource Allocation Graph (RAG) Single Instance",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In a Resource Allocation Graph (RAG) where every resource type has exactly ONE single instance, a deadlock exists if and only if:",
    "options": [
      "The graph contains a directed cycle",
      "The graph is bipartite",
      "There are more processes than resources",
      "A process requests memory"
    ],
    "correctAnswerIndex": 0,
    "explanation": "For single-instance resource types, a cycle is necessary AND sufficient for deadlock. For multi-instance resources, a cycle is necessary but not sufficient.",
    "tags": [
      "OS",
      "Deadlocks",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Deadlocks",
    "subtopic": "Circular Wait Prevention",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How can the Circular Wait condition be prevented system-wide in software architecture?",
    "options": [
      "Impose a strict global linear ordering on all resources, and require processes to request resources in strictly ascending order",
      "Disable multi-threading",
      "Allow infinite memory",
      "Terminate all processes on conflict"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If resources R1..Rn are numbered and every process must acquire lower-numbered resources before higher-numbered ones, cycles are mathematically impossible.",
    "tags": [
      "OS",
      "Deadlocks",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Deadlocks",
    "subtopic": "Ostrich Algorithm",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the 'Ostrich Algorithm' commonly used by general-purpose consumer operating systems (Linux, Windows, macOS)?",
    "options": [
      "Ignore the deadlock problem completely, assuming deadlocks occur rarely enough that system reboot or manual termination is acceptable",
      "Run Banker's algorithm on every malloc()",
      "Preempt CPU registers",
      "Log deadlocks to cloud"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Because deadlock avoidance adds massive runtime performance overhead on every allocation, consumer OSes choose to ignore the rare possibility.",
    "tags": [
      "OS",
      "Deadlocks",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Deadlocks",
    "subtopic": "Safe State Definition",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In deadlock avoidance, a system state is defined as 'Safe' if:",
    "options": [
      "There exists at least one sequence <P1, P2, ... Pn> of processes such that each Pi's maximum remaining claims can be satisfied by currently available resources plus resources held by all Pj (j < i)",
      "Zero resources are currently allocated",
      "All processes run simultaneously",
      "No process ever makes another request"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A safe state guarantees that even in the worst case (every process requests its maximum declared need), all processes can finish without deadlock.",
    "tags": [
      "OS",
      "Deadlocks",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Deadlocks",
    "subtopic": "Livelock vs Deadlock",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the crucial difference between a Deadlock and a Livelock?",
    "options": [
      "In Deadlock, processes are blocked in sleep state waiting for events that never occur; in Livelock, processes continuously change state in response to each other without making forward progress",
      "Livelock only happens on single-core CPUs",
      "Deadlock uses 100% CPU",
      "They are identical"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Livelock is active: processes repeatedly release and re-acquire locks or back off simultaneously (burning CPU cycles) without completing any actual task.",
    "tags": [
      "OS",
      "Deadlocks",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Deadlocks",
    "subtopic": "Hold and Wait Prevention",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "To eliminate the Hold and Wait condition, a protocol could require that a process must:",
    "options": [
      "Request and be allocated all required resources upfront at process initiation before execution begins",
      "Never hold more than one CPU register",
      "Yield the CPU every 5 ms",
      "Use only shared memory"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Requiring all resources to be acquired simultaneously before running prevents holding a resource while waiting for another, but reduces resource utilization.",
    "tags": [
      "OS",
      "Deadlocks",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Deadlocks",
    "subtopic": "Deadlock Recovery Mechanism",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "When a deadlock is detected in a system, which recovery strategy is most commonly applied?",
    "options": [
      "Process Termination (aborting one or more deadlocked processes until cycle is broken) or Resource Preemption with rollback",
      "Increasing RAM clock speed",
      "Flushing the CPU pipeline",
      "Recompiling the software"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Breaking deadlocks requires either aborting processes (killing one victim or all) or preempting resources and rolling processes back to checkpoints.",
    "tags": [
      "OS",
      "Deadlocks",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Deadlocks",
    "subtopic": "Priority Inversion",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is Priority Inversion in real-time operating systems?",
    "options": [
      "A high-priority process is blocked waiting for a lock held by a low-priority process, while a medium-priority process preempts the low-priority process, indirectly starving the high-priority process",
      "A low-priority task runs at high CPU clock",
      "The scheduler crashes",
      "Priority aging fails"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Classic Mars Pathfinder bug: Low priority task holds mutex, medium task preempts low task; high task waiting for mutex is starved by medium task.",
    "tags": [
      "OS",
      "Deadlocks",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Deadlocks",
    "subtopic": "Priority Inheritance Protocol",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How does the Priority Inheritance Protocol solve Priority Inversion?",
    "options": [
      "Temporarily raises the priority of the low-priority lock holder to match the priority of the highest-priority process waiting for that lock",
      "Aborts all medium priority processes",
      "Disables mutual exclusion locks",
      "Allocates a new CPU core"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Boosting the lock holder's priority prevents medium-priority processes from preempting it, allowing it to quickly finish its critical section and release the lock.",
    "tags": [
      "OS",
      "Deadlocks",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Memory Management",
    "subtopic": "Internal Fragmentation",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is Internal Fragmentation in memory allocation?",
    "options": [
      "Allocated memory block is larger than the requested size; the unused portion inside the allocated partition is wasted",
      "Free memory exists in small scattered holes outside allocated blocks",
      "Memory leaks caused by forgot free()",
      "Disk swap space is full"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Internal fragmentation occurs when memory is allocated in fixed-size blocks (e.g. 4KB pages); a 1KB request gets 4KB, wasting 3KB internally.",
    "tags": [
      "OS",
      "Memory Management",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Memory Management",
    "subtopic": "External Fragmentation",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is External Fragmentation and what technique eliminates it in physical memory?",
    "options": [
      "Total free memory is sufficient to satisfy a request, but the memory is fragmented into non-contiguous chunks; eliminated by Paging or Compaction",
      "Memory corrupted by buffer overflow",
      "Unused space inside an allocated chunk",
      "Stack colliding with heap"
    ],
    "correctAnswerIndex": 0,
    "explanation": "External fragmentation occurs in contiguous dynamic partition allocation. Paging eliminates external fragmentation by allowing non-contiguous allocation.",
    "tags": [
      "OS",
      "Memory Management",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Memory Management",
    "subtopic": "Best Fit vs First Fit",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In dynamic memory partition placement, how does Best-Fit allocate memory for request size S?",
    "options": [
      "Allocates the smallest free hole that is at least size S (leaving smallest leftover fragment)",
      "Allocates the first hole found that is >= S",
      "Allocates the largest available hole",
      "Splits memory in halves"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Best-Fit searches the entire free list to find the tightest match; ironically, it often leaves tiny, unusable slivers of free memory.",
    "tags": [
      "OS",
      "Memory Management",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Memory Management",
    "subtopic": "Buddy Allocation System",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How does the Linux kernel Buddy Memory Allocator satisfy allocation requests and perform deallocation coalescing?",
    "options": [
      "Divides memory blocks into powers of 2 (halves); on free, checks if the adjacent 'buddy' block of same size is free, and merges them back into a double-sized block",
      "Uses a singly linked list with first fit",
      "Allocates odd and even addresses separately",
      "Uses B+ tree on disk"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Buddy allocation provides rapid O(1) coalescence: XORing a block's address with its size yields the address of its buddy, allowing immediate merging.",
    "tags": [
      "OS",
      "Memory Management",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Memory Management",
    "subtopic": "Logical vs Physical Address",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What hardware component translates a CPU-generated Logical (Virtual) Address into a Physical RAM Address at runtime?",
    "options": [
      "Memory Management Unit (MMU)",
      "Arithmetic Logic Unit (ALU)",
      "Direct Memory Access (DMA) controller",
      "BIOS / UEFI chip"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The MMU intercepts CPU virtual memory addresses and translates them on-the-fly to physical RAM addresses using page tables.",
    "tags": [
      "OS",
      "Memory Management",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Memory Management",
    "subtopic": "Base and Limit Registers",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How do hardware Base and Limit registers enforce process memory protection?",
    "options": [
      "Physical Address = Base + Logical Address; MMU raises a trap if Logical Address >= Limit Register value",
      "They encrypt RAM data",
      "They limit process CPU usage",
      "They control thread count"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The Base register defines the physical start of the partition, and the Limit register specifies size. Any access outside [0, Limit) triggers a segmentation fault.",
    "tags": [
      "OS",
      "Memory Management",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Memory Management",
    "subtopic": "Dynamic Loading",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the primary benefit of Dynamic Loading in modern software runtimes?",
    "options": [
      "A routine/function is only loaded into physical memory when it is actually called by the program during execution",
      "Programs run without an operating system",
      "Disables memory pagination",
      "Compiles source code at runtime"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Routines used infrequently (e.g. error handling, rare dialog boxes) remain on disk until needed, preserving precious physical memory.",
    "tags": [
      "OS",
      "Memory Management",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Memory Management",
    "subtopic": "Dynamic Linking & Shared Libraries",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What advantage do Shared Libraries (.so on Linux, .dll on Windows) provide over Static Linking (.a / .lib)?",
    "options": [
      "A single copy of the library code is loaded into physical RAM and shared across all running processes, saving vast memory and disk space",
      "Programs execute faster because no function calls occur",
      "Shared libraries prevent bugs",
      "Static linking produces smaller binaries"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Multiple processes running libc or OpenSSL share the exact same physical memory frames of text/code, slashing memory footprint.",
    "tags": [
      "OS",
      "Memory Management",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Memory Management",
    "subtopic": "Swapping Mechanism",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is Swapping in traditional operating system memory managers?",
    "options": [
      "Moving an entire idle process from physical RAM out to secondary storage (swap space) to free memory for active processes",
      "Swapping CPU registers with cache",
      "Switching between user and kernel mode",
      "Replacing dynamic memory with static memory"
    ],
    "correctAnswerIndex": 0,
    "explanation": "When physical RAM is exhausted, the OS rolls inactive processes out to a backing store (swap partition) and brings them back when scheduled.",
    "tags": [
      "OS",
      "Memory Management",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Memory Management",
    "subtopic": "Slab Allocator",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Why does the Linux kernel use the Slab Allocator for kernel object allocation (like PCBs, inodes)?",
    "options": [
      "Pre-allocates caches of initialized kernel objects of specific sizes, avoiding expensive object construction/destruction overhead and fragmentation",
      "It replaces the virtual memory system",
      "It allocates memory on GPUs",
      "It handles user-space malloc()"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Kernel objects (e.g. task_struct) are frequently allocated and freed. The slab allocator keeps cached objects pre-initialized in memory.",
    "tags": [
      "OS",
      "Memory Management",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Memory Management",
    "subtopic": "Memory Compaction",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is Memory Compaction and why can it only be performed if relocation is dynamic at runtime?",
    "options": [
      "Shifting all occupied memory blocks to one end of memory to consolidate free space into one large contiguous block; requires MMU base register updates",
      "Compressing RAM with gzip",
      "Deleting background processes",
      "Clearing CPU caches"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Compaction moves processes in physical RAM. This is only possible if base registers dynamically resolve addresses at runtime; static addresses would corrupt pointers.",
    "tags": [
      "OS",
      "Memory Management",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Paging",
    "subtopic": "Page vs Frame",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the difference between a Page and a Frame in virtual memory paging?",
    "options": [
      "A Page is a fixed-size block of Logical (Virtual) memory; a Frame is a fixed-size block of Physical RAM",
      "Page is physical; Frame is logical",
      "Frame is on disk; Page is in CPU cache",
      "They have different sizes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Paging partitions logical address space into fixed-size Pages, and physical memory into identically sized Frames (commonly 4KB).",
    "tags": [
      "OS",
      "Paging",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Paging",
    "subtopic": "Page Table Entry (PTE)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What information is stored inside a Page Table Entry (PTE)?",
    "options": [
      "Physical Frame number, Present/Valid bit, Dirty/Modified bit, Read/Write permissions, and Access bit",
      "The entire contents of the page",
      "The user password",
      "The process name"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A PTE maps the virtual page number to its physical frame number and stores metadata flags for hardware protection and caching.",
    "tags": [
      "OS",
      "Paging",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Paging",
    "subtopic": "Translation Lookaside Buffer (TLB)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the primary role of the Translation Lookaside Buffer (TLB) in MMU hardware?",
    "options": [
      "An associative high-speed hardware cache that stores recent virtual-to-physical address translations to prevent two memory accesses per instruction",
      "A disk cache for swapping",
      "A buffer for keyboard interrupts",
      "A register for floating point math"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Without a TLB, every memory read requires two RAM accesses (one to read the page table, one to read data). TLB hit provides O(1) translation in <1 ns.",
    "tags": [
      "OS",
      "Paging",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Paging",
    "subtopic": "Effective Memory Access Time (EMAT)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "If TLB hit ratio is 90%, TLB access takes 10ns, and main memory access takes 100ns, what is the Effective Memory Access Time (EMAT) with a single-level page table?",
    "options": [
      "120 ns",
      "100 ns",
      "190 ns",
      "110 ns"
    ],
    "correctAnswerIndex": 0,
    "explanation": "EMAT = hit_ratio * (TLB + Mem) + (1 - hit_ratio) * (TLB + 2*Mem) = 0.9 * (10 + 100) + 0.1 * (10 + 200) = 0.9*110 + 0.1*210 = 99 + 21 = 120 ns.",
    "tags": [
      "OS",
      "Paging",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Paging",
    "subtopic": "Multi-Level Paging",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why is Multi-Level Paging essential on 64-bit operating systems?",
    "options": [
      "Avoids allocating a massive contiguous page table in RAM by creating page table levels on demand for sparsely populated address spaces",
      "Makes memory translation faster than single level",
      "Eliminates TLB misses",
      "Reduces physical RAM cost"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A flat page table for a 64-bit space would consume petabytes of RAM; multi-level paging leaves unmapped address regions null, consuming minimal memory.",
    "tags": [
      "OS",
      "Paging",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Paging",
    "subtopic": "Inverted Page Table",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What defines an Inverted Page Table compared to standard per-process page tables?",
    "options": [
      "Contains only ONE entry for each physical frame in RAM (indexed by frame number), storing (PID, virtual_page_number)",
      "Stores pages on external SSDs",
      "Has twice as many entries as virtual pages",
      "Replaces hardware TLB entirely"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Standard page tables scale with virtual address space size; Inverted Page Tables scale strictly with physical RAM size, saving massive table memory.",
    "tags": [
      "OS",
      "Paging",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Paging",
    "subtopic": "Page Size Trade-off",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the trade-off of using larger page sizes (e.g. 2MB HugePages vs 4KB)?",
    "options": [
      "Reduces TLB misses and page table overhead, but increases internal fragmentation waste for small memory allocations",
      "Decreases disk transfer rate",
      "Slows down CPU clock",
      "Causes external fragmentation"
    ],
    "correctAnswerIndex": 0,
    "explanation": "HugePages increase TLB coverage drastically (ideal for large database buffers like PostgreSQL/Oracle), but small processes waste most of the 2MB page.",
    "tags": [
      "OS",
      "Paging",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Paging",
    "subtopic": "Shared Pages",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How does paging support memory sharing between two processes (e.g. shared text of libc)?",
    "options": [
      "Page table entries of both processes point to the same physical frame numbers, marked read-only",
      "Processes take turns accessing RAM",
      "Data is copied to a shared file",
      "Using dual CPUs"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Mapping identical physical frame numbers into multiple processes' page tables enables effortless, zero-copy read-only code sharing.",
    "tags": [
      "OS",
      "Paging",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Paging",
    "subtopic": "Protection Bits",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "If a process attempts to execute instructions from a memory page marked with the No-Execute (NX / DEP) bit, what happens?",
    "options": [
      "The CPU raises a hardware protection fault / general protection trap, terminating the process",
      "The page is converted to code automatically",
      "The instructions execute in slow mode",
      "The CPU ignores the bit"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The NX bit prevents buffer overflow exploits (like stack shellcode injection) by disallowing instruction execution in data/stack pages.",
    "tags": [
      "OS",
      "Paging",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Paging",
    "subtopic": "TLB Shootdown",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is a 'TLB Shootdown' in multi-core symmetric multiprocessing (SMP)?",
    "options": [
      "An inter-processor interrupt (IPI) sent by one core to all other cores to invalidate stale cached TLB mappings after a page table modification",
      "A hardware failure in the TLB",
      "Flushing TLB during reboot",
      "Overwriting TLB with zeroes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "When core A alters a shared page mapping, it must signal all other cores via IPIs to flush their local TLB entries to prevent stale memory access.",
    "tags": [
      "OS",
      "Paging",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Paging",
    "subtopic": "Address Split Formula",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In a 32-bit system with 4KB page size (2^12 bytes), how is a 32-bit virtual address split?",
    "options": [
      "Top 20 bits: Virtual Page Number (VPN); Lower 12 bits: Page Offset",
      "Top 16 bits VPN; Lower 16 bits Offset",
      "Top 12 bits VPN; Lower 20 bits Offset",
      "Top 24 bits VPN; Lower 8 bits Offset"
    ],
    "correctAnswerIndex": 0,
    "explanation": "4KB = 2^12 bytes requires 12 bits for offset inside the page; the remaining 32 - 12 = 20 bits index into the page table (2^20 = 1M pages).",
    "tags": [
      "OS",
      "Paging",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Segmentation",
    "subtopic": "Logical Units Representation",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the primary conceptual design principle of Memory Segmentation compared to Paging?",
    "options": [
      "Segmentation views memory as variable-sized logical units reflecting the programmer's view (code, stack, heap, data)",
      "Segmentation uses fixed 4KB blocks",
      "Segmentation is hardware-only",
      "Segmentation eliminates memory protection"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Unlike paging which slices memory blindly into fixed-size chunks, segmentation divides memory into variable-sized logical segments matching program modules.",
    "tags": [
      "OS",
      "Segmentation",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Segmentation",
    "subtopic": "Segment Table Entry",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What two primary values are stored in each entry of a Segment Table?",
    "options": [
      "Base (physical starting address) and Limit (length of the segment)",
      "Page number and frame number",
      "PID and thread count",
      "File descriptor and inode"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Base specifies physical starting address in memory; Limit defines the segment length. Accesses with offset >= Limit trigger an out-of-bounds trap.",
    "tags": [
      "OS",
      "Segmentation",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Segmentation",
    "subtopic": "Segmentation Fault",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What hardware event directly generates a 'Segmentation Fault' (SIGSEGV) in Unix/C programs?",
    "options": [
      "A process attempts to access a memory address outside its allocated segment limit or violates access permissions (e.g. writing to read-only code)",
      "The CPU overheats",
      "A syntax error occurs in C code",
      "Disk space is exhausted"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The MMU detects that the offset exceeds the segment limit register or the operation violates read/write/execute permissions, triggering a hardware trap.",
    "tags": [
      "OS",
      "Segmentation",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Segmentation",
    "subtopic": "External Fragmentation in Segmentation",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why is pure segmentation prone to External Fragmentation?",
    "options": [
      "Segments have dynamic variable lengths, leaving scattered unused free memory holes between allocated segments over time",
      "Segments waste space inside pages",
      "Segment tables grow indefinitely",
      "Segments cannot be shared"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Variable-sized segment allocation creates memory holes of varying sizes; even if total free memory is large, a contiguous block of required size may not exist.",
    "tags": [
      "OS",
      "Segmentation",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Segmentation",
    "subtopic": "Segmented Paging",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does Segmented Paging (e.g. x86 architecture) combine the advantages of both approaches?",
    "options": [
      "Each logical segment is internally divided into fixed-size pages, eliminating external fragmentation while preserving logical modularity",
      "Uses two separate RAM chips",
      "Replaces virtual memory with flash",
      "Executes segments on separate cores"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Programmers retain logical segment view (code, data, stack with independent permissions), while the OS allocates physical memory in fixed-size pages.",
    "tags": [
      "OS",
      "Segmentation",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Segmentation",
    "subtopic": "Segment Sharing",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How is a shared library segment (e.g. shared text editor code) shared between processes in segmentation?",
    "options": [
      "Segment table entries of multiple processes store identical Base and Limit values with read-only permissions",
      "Data is written to a shared disk sector",
      "Processes swap base registers on every tick",
      "Shared memory is mapped to address 0"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Processes share code segments simply by pointing their segment table entries to the same physical base address with shared read-only flags.",
    "tags": [
      "OS",
      "Segmentation",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Segmentation",
    "subtopic": "Global Descriptor Table (GDT)",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In x86 protected mode, what is the role of the Global Descriptor Table (GDT)?",
    "options": [
      "A kernel data structure defining the characteristics (base, limit, privilege level) of all memory segments in the system",
      "A table storing open network sockets",
      "A list of PCI hardware devices",
      "An index of disk sectors"
    ],
    "correctAnswerIndex": 0,
    "explanation": "x86 segment registers (CS, DS, SS, ES) load 16-bit Segment Selectors that index into the GDT or LDT to retrieve 64-bit Segment Descriptors.",
    "tags": [
      "OS",
      "Segmentation",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Segmentation",
    "subtopic": "Segment Address Translation",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In address translation with segmentation, given logical address <s, d> where s is segment number and d is offset, physical address is:",
    "options": [
      "Base[s] + d (provided d < Limit[s])",
      "Base[s] * d",
      "Base[s] + PageSize",
      "Limit[s] - d"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If offset d < Limit[s], physical address is computed simply by adding offset d to Base[s]; if d >= Limit[s], a trap is raised.",
    "tags": [
      "OS",
      "Segmentation",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Segmentation",
    "subtopic": "Protection Rings",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In x86 segmentation architecture, how are OS kernel and user applications isolated using Privilege Rings?",
    "options": [
      "Ring 0 (Kernel/Supervisor mode with full hardware access) and Ring 3 (User mode with restricted privileges)",
      "Ring 1 for user, Ring 2 for kernel",
      "All code runs in Ring 0",
      "Rings are software concepts with no hardware enforcement"
    ],
    "correctAnswerIndex": 0,
    "explanation": "x86 defines 4 hierarchical privilege rings (0 to 3). Kernel executes in Ring 0, device drivers in Ring 1/2, and user applications in Ring 3.",
    "tags": [
      "OS",
      "Segmentation",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Segmentation",
    "subtopic": "Flat Memory Model",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why do modern 64-bit operating systems (Linux x86_64) use a 'Flat Memory Model' that largely bypasses segmentation?",
    "options": [
      "Segment registers are set to span the entire 64-bit address space (base 0, limit 2^64), delegating all memory protection and isolation to Paging",
      "Paging is obsolete",
      "CPUs removed MMUs",
      "Segmentation consumes too much disk space"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Modern OSes set base to 0 for all segments, rendering segmentation transparent so that multi-level paging handles all virtual memory management.",
    "tags": [
      "OS",
      "Segmentation",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Segmentation",
    "subtopic": "Dynamic Segment Growth",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In memory segmentation, in which direction do Stack and Heap segments dynamically expand?",
    "options": [
      "Heap grows upward toward higher addresses; Stack grows downward toward lower addresses",
      "Both grow upward",
      "Both grow downward",
      "Stack grows to disk"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Placing heap at low addresses growing up and stack at high addresses growing down allows both to share unused virtual address space dynamically.",
    "tags": [
      "OS",
      "Segmentation",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Virtual Memory",
    "subtopic": "Page Fault Trap",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is a Page Fault in virtual memory systems?",
    "options": [
      "A hardware interrupt/trap raised when a process accesses a page whose valid bit is 0 in the page table (not currently resident in physical RAM)",
      "A corruption of memory bits",
      "A failure of the CPU power supply",
      "An invalid SQL query"
    ],
    "correctAnswerIndex": 0,
    "explanation": "When valid bit is 0, the MMU traps to the OS kernel page fault handler, which retrieves the requested page from disk swap space into an empty frame.",
    "tags": [
      "OS",
      "Virtual Memory",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Virtual Memory",
    "subtopic": "Thrashing",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is 'Thrashing' in operating systems and what causes it?",
    "options": [
      "A pathological state where the OS spends almost all its time swapping pages in and out of disk rather than executing useful instructions, caused by over-committing memory",
      "CPU overheating under load",
      "Hard drive spinning too fast",
      "Network packet loss"
    ],
    "correctAnswerIndex": 0,
    "explanation": "When the sum of active processes' working sets exceeds total physical RAM, page faults occur continuously, driving CPU utilization to near zero.",
    "tags": [
      "OS",
      "Virtual Memory",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Virtual Memory",
    "subtopic": "B\u00e9l\u00e1dy's Anomaly",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is B\u00e9l\u00e1dy's Anomaly in page replacement algorithms?",
    "options": [
      "Under FIFO page replacement, allocating MORE physical page frames can paradoxically result in MORE page faults for certain reference strings",
      "LRU runs slower on SSDs",
      "Optimal algorithm has worst case faults",
      "Thrashing causes system reboots"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Laszlo B\u00e9l\u00e1dy demonstrated that FIFO does not satisfy the 'stack inclusion' property; increasing frames from 3 to 4 can increase faults from 9 to 10.",
    "tags": [
      "OS",
      "Virtual Memory",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Virtual Memory",
    "subtopic": "Least Recently Used (LRU) Algorithm",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How does the Least Recently Used (LRU) page replacement algorithm select a victim frame?",
    "options": [
      "Replaces the page that has not been referenced for the longest period of time in the past",
      "Replaces the oldest page loaded",
      "Replaces a randomly chosen page",
      "Replaces the smallest page"
    ],
    "correctAnswerIndex": 0,
    "explanation": "LRU leverages the principle of temporal locality: pages accessed recently will likely be accessed soon; pages untouched longest are evicted.",
    "tags": [
      "OS",
      "Virtual Memory",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Virtual Memory",
    "subtopic": "Second-Chance (Clock) Algorithm",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does the Second-Chance (Clock) page replacement algorithm approximate LRU in real operating systems?",
    "options": [
      "Uses a circular queue with a clock hand; if a page's Reference Bit is 1, clears it to 0 and advances; if Reference Bit is 0, selects it as victim",
      "Sorts pages by timestamp on every read",
      "Uses a priority heap",
      "Keeps a doubly linked list of all frames"
    ],
    "correctAnswerIndex": 0,
    "explanation": "True LRU requires expensive hardware updates on every memory read. Clock algorithm inspects the 1-bit reference flag periodically, providing near-LRU efficiency.",
    "tags": [
      "OS",
      "Virtual Memory",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Virtual Memory",
    "subtopic": "Working Set Model",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Peter Denning's Working Set Model defines a process's Working Set W(t, \u0394) as:",
    "options": [
      "The set of pages referenced by the process during the most recent \u0394 time window (working set parameter)",
      "All pages allocated on the heap",
      "The total bytes on disk swap",
      "The CPU register cache"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Monitoring the working set size ensures the scheduler only admits processes whose working sets fit simultaneously in RAM, preventing thrashing.",
    "tags": [
      "OS",
      "Virtual Memory",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Virtual Memory",
    "subtopic": "Optimal (MIN / OPT) Page Replacement",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why can B\u00e9l\u00e1dy's Optimal Page Replacement Algorithm (OPT / MIN) not be implemented in general-purpose operating systems?",
    "options": [
      "It requires future knowledge: replaces the page that will not be used for the longest period in the future",
      "It requires infinite RAM",
      "It causes CPU deadlocks",
      "It is patented"
    ],
    "correctAnswerIndex": 0,
    "explanation": "OPT serves as a theoretical benchmark (minimum possible page faults) for evaluating realistic algorithms, as the OS cannot predict future memory references.",
    "tags": [
      "OS",
      "Virtual Memory",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Virtual Memory",
    "subtopic": "Demand Paging",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is Pure Demand Paging in operating systems?",
    "options": [
      "A page is loaded into physical RAM only when a reference is made to an address within that page (never pre-fetched)",
      "All program pages are loaded before main() starts",
      "Pages are compressed with lz4",
      "Pages are locked in RAM forever"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Demand paging starts a process with zero pages in physical memory; pages fault in one by one strictly as code and data are accessed.",
    "tags": [
      "OS",
      "Virtual Memory",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Virtual Memory",
    "subtopic": "Dirty Bit (Modified Bit)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the purpose of the Dirty Bit (Modified Bit) in a Page Table Entry?",
    "options": [
      "Indicates whether the page has been modified in RAM since being loaded from disk; if clean (0), page can be discarded without writing to disk upon eviction",
      "Indicates hardware memory failure",
      "Blocks read access",
      "Indicates malware infection"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If dirty bit is 0, the disk copy is already identical, saving an expensive disk write during page replacement.",
    "tags": [
      "OS",
      "Virtual Memory",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Virtual Memory",
    "subtopic": "Page Fault Frequency (PFF)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does Page Fault Frequency (PFF) control allocate frames dynamically to processes?",
    "options": [
      "If a process's page fault rate exceeds an upper threshold, allocate it more frames; if below a lower threshold, reclaim frames",
      "Terminates processes with high fault rates",
      "Swaps all memory to disk periodically",
      "Doubles page size dynamically"
    ],
    "correctAnswerIndex": 0,
    "explanation": "PFF directly monitors page fault rate per process, establishing dynamic bounds to prevent thrashing while maximizing multiprogramming.",
    "tags": [
      "OS",
      "Virtual Memory",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Virtual Memory",
    "subtopic": "mmap() System Call",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the mmap() system call do in Unix/Linux systems?",
    "options": [
      "Maps a file or anonymous memory region directly into the calling process's virtual address space, allowing file I/O via direct memory pointer dereferences",
      "Allocates physical RAM on external machines",
      "Formats disk partitions",
      "Sets thread priorities"
    ],
    "correctAnswerIndex": 0,
    "explanation": "mmap enables zero-copy file access: file pages fault into memory on demand, bypassing user-space read()/write() buffer copying.",
    "tags": [
      "OS",
      "Virtual Memory",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "File Systems",
    "subtopic": "Inode Data Structure",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In Unix/Linux file systems (ext4), what information is stored inside an inode?",
    "options": [
      "File metadata (file size, permissions, owner, timestamps) and direct/indirect block pointers to disk data blocks, but NOT the file name",
      "The file name and full directory path",
      "The actual file content data directly",
      "The user password hash"
    ],
    "correctAnswerIndex": 0,
    "explanation": "An inode contains all file attributes and block location pointers; file names are stored separately inside directory data blocks mapped to inode numbers.",
    "tags": [
      "OS",
      "File Systems",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "File Systems",
    "subtopic": "Hard Link vs Soft Link",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the fundamental difference between a Hard Link and a Soft Link (Symbolic Link)?",
    "options": [
      "A Hard Link is a directory entry pointing directly to the existing inode number; a Soft Link is a separate file containing the text path to target file",
      "Soft links share the same inode number as target",
      "Hard links can cross file system boundaries",
      "Deleting a file preserves soft links"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Hard links share the same inode (incrementing link count); symbolic links have their own inode and store a path string (dangling if target is deleted).",
    "tags": [
      "OS",
      "File Systems",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "File Systems",
    "subtopic": "Direct vs Indirect Blocks",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In a classic Unix inode with 12 direct pointers, 1 single indirect, 1 double indirect, and 1 triple indirect pointer (block size 4KB, pointer size 4B), what is the single indirect capacity?",
    "options": [
      "4 MB (1024 pointers * 4KB)",
      "48 KB",
      "1 GB",
      "16 MB"
    ],
    "correctAnswerIndex": 0,
    "explanation": "One 4KB indirect block stores (4096 / 4) = 1024 block pointers. Each pointed block is 4KB, giving 1024 * 4KB = 4096 KB = 4 MB.",
    "tags": [
      "OS",
      "File Systems",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "File Systems",
    "subtopic": "Journaling File Systems",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does a Journaling File System (like ext4, NTFS, XFS) prevent file system corruption after a sudden power loss?",
    "options": [
      "Writes changes to a dedicated sequential journal log on disk before updating the actual file system structures; replays journal on reboot",
      "Duplicates entire hard drives in RAID 1",
      "Stores all files in non-volatile battery RAM",
      "Disables disk caching"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Journaling turns multi-step file operations into atomic log commits, allowing fast recovery on reboot by replaying committed transactions instead of full fsck.",
    "tags": [
      "OS",
      "File Systems",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "File Systems",
    "subtopic": "Contiguous vs Linked Allocation",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the major disadvantage of Linked Allocation for disk files where each block points to the next block?",
    "options": [
      "Extremely slow random (direct) access: accessing block K requires traversing K disk block pointers sequentially",
      "Severe internal fragmentation",
      "Files cannot grow dynamically",
      "Cannot store binary files"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Linked allocation eliminates external fragmentation and supports dynamic growth, but random seek to offset X requires linear disk block traversal.",
    "tags": [
      "OS",
      "File Systems",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "File Systems",
    "subtopic": "File Allocation Table (FAT)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How does FAT32 file system store block allocation chains?",
    "options": [
      "A single centralized table (FAT) at disk beginning where each entry represents a cluster and stores the index of the next cluster in the file",
      "Stores pointers inside directory files",
      "Uses multi-level B+ trees",
      "Uses per-file inodes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "FAT centralizes linked allocation pointers into an in-memory table, accelerating traversal while avoiding block pointer overhead in data sectors.",
    "tags": [
      "OS",
      "File Systems",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "File Systems",
    "subtopic": "Virtual File System (VFS)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the purpose of the Virtual File System (VFS) abstraction layer in the OS kernel?",
    "options": [
      "Provides a uniform, standardized API (open, read, write) to user applications regardless of underlying concrete file systems (ext4, NTFS, NFS)",
      "Simulates hard drives in cloud",
      "Compresses files automatically",
      "Encrypts all file system calls"
    ],
    "correctAnswerIndex": 0,
    "explanation": "VFS abstracts file operations via function pointer tables (vnode / file_operations), allowing user applications to interact identically with local and network file systems.",
    "tags": [
      "OS",
      "File Systems",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "File Systems",
    "subtopic": "Directory Structure in Unix",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In Unix operating systems, what is a Directory fundamentally?",
    "options": [
      "A special file whose data content is a list of (filename, inode_number) mapping pairs",
      "A hardware partition",
      "A memory pointer in the BIOS",
      "A table in MySQL"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Directories are files containing directory entries (dirents) that map human-readable file names to filesystem inode numbers.",
    "tags": [
      "OS",
      "File Systems",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "File Systems",
    "subtopic": "Page Cache & Buffer Cache",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the OS Page Cache do during file read/write operations?",
    "options": [
      "Caches disk blocks in unused physical RAM; subsequent reads are served at memory speeds without hitting disk hardware",
      "Stores user passwords",
      "Compresses file inodes",
      "Limits disk write speeds"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Linux uses all available free RAM as a page cache for disk data; dirty pages are periodically flushed to disk by background flusher threads.",
    "tags": [
      "OS",
      "File Systems",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "File Systems",
    "subtopic": "RAID Levels",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Which RAID configuration provides block-level striping with distributed parity across at least 3 disks to survive single-disk failure?",
    "options": [
      "RAID 5",
      "RAID 0",
      "RAID 1",
      "RAID 10"
    ],
    "correctAnswerIndex": 0,
    "explanation": "RAID 0 has striping without fault tolerance; RAID 1 is pure mirroring; RAID 5 stripes data and distributes parity blocks across N >= 3 drives.",
    "tags": [
      "OS",
      "File Systems",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "File Systems",
    "subtopic": "Disk Scheduling SCAN (Elevator)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How does the SCAN (Elevator) disk head scheduling algorithm service I/O requests?",
    "options": [
      "The disk arm moves in one direction servicing all pending cylinder requests until reaching the end, then reverses direction",
      "Services requests in strict arrival order",
      "Jumps to shortest seek time first",
      "Stays at center track"
    ],
    "correctAnswerIndex": 0,
    "explanation": "SCAN prevents starvation by sweeping across the disk surface back and forth continuously like an elevator, bounding maximum wait time.",
    "tags": [
      "OS",
      "File Systems",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Synchronization",
    "subtopic": "Critical Section Problem Requirements",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What are the 3 mandatory requirements that any valid solution to the Critical Section problem must satisfy?",
    "options": [
      "Mutual Exclusion, Progress, and Bounded Waiting",
      "Atomicity, Consistency, and Durability",
      "Speed, Low Memory, and Encryption",
      "Preemption, Aging, and Scheduling"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Mutual Exclusion (at most one process inside), Progress (selection cannot be postponed indefinitely), and Bounded Waiting (starvation must be prevented).",
    "tags": [
      "OS",
      "Synchronization",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Synchronization",
    "subtopic": "Counting vs Binary Semaphore",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the difference between a Counting Semaphore and a Binary Semaphore?",
    "options": [
      "Counting semaphore takes integer values >= 0 and controls access to a finite pool of N identical resources; binary semaphore values are strictly 0 or 1",
      "Binary semaphores allow negative values",
      "Counting semaphores are implemented in hardware only",
      "Binary semaphores have no wait queue"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Counting semaphores initialize to N available resource units. Calling wait() decrements count; signal() increments count.",
    "tags": [
      "OS",
      "Synchronization",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Synchronization",
    "subtopic": "Spinlock vs Mutex",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "When is a Spinlock (busy-waiting lock) preferred over a sleeping Mutex?",
    "options": [
      "In multi-core kernels where the lock is held for extremely short durations (less than context switch overhead time)",
      "On single-core processors for long background tasks",
      "In user-space applications with slow disk I/O",
      "When memory is exhausted"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Putting a thread to sleep and waking it up takes thousands of CPU cycles. If the critical section executes in 50 cycles on another core, spinning burns fewer cycles.",
    "tags": [
      "OS",
      "Synchronization",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Synchronization",
    "subtopic": "Compare-And-Swap (CAS)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the hardware atomic instruction Compare-And-Swap (CAS) used to build lock-free data structures?",
    "options": [
      "Atomically checks if memory location equals expected value; if true, updates it to new value and returns true; otherwise leaves unchanged and returns false",
      "Compares two registers and halts CPU",
      "Swaps two integers on disk",
      "Locks the memory bus permanently"
    ],
    "correctAnswerIndex": 0,
    "explanation": "CAS provides hardware-level atomicity without OS mutexes, enabling lock-free concurrent queues, stacks, and atomic counters (e.g. AtomicInteger).",
    "tags": [
      "OS",
      "Synchronization",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Synchronization",
    "subtopic": "Peterson's Algorithm",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Peterson's software algorithm provides mutual exclusion for two processes using which shared variables?",
    "options": [
      "boolean flag[2] (intent to enter) and int turn (whose turn it is)",
      "A binary semaphore",
      "TestAndSet instruction",
      "A single integer counter"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Peterson's algorithm combines flag[i] = true (expressing desire) with turn = j (yielding priority), satisfying all 3 critical section criteria.",
    "tags": [
      "OS",
      "Synchronization",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Synchronization",
    "subtopic": "Dining Philosophers Deadlock",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In the classic Dining Philosophers problem, what simple strategy prevents circular wait deadlock?",
    "options": [
      "Asymmetric rule: odd philosophers pick up left chopstick first, while even philosophers pick up right chopstick first",
      "Make all philosophers eat simultaneously",
      "Remove chopsticks from table",
      "Increase thinking time to 1 hour"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Asymmetry breaks the circular chain: at least one philosopher is always competing with an adjacent philosopher for the same first chopstick.",
    "tags": [
      "OS",
      "Synchronization",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Synchronization",
    "subtopic": "Readers-Writers Problem",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In the First Readers-Writers problem (favoring readers), what starvation issue can occur?",
    "options": [
      "Writers may starve indefinitely if new readers continuously arrive and acquire shared read locks before existing readers finish",
      "Readers are locked out forever",
      "Both readers and writers deadlock",
      "Memory leaks occur"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If readers keep arriving, the read count never drops to 0, preventing any waiting writer from acquiring the exclusive lock.",
    "tags": [
      "OS",
      "Synchronization",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Synchronization",
    "subtopic": "Monitors Abstraction",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is a Monitor in concurrent programming languages (e.g. Java synchronized methods)?",
    "options": [
      "A high-level language construct where only one thread can be active inside the monitor at any given time, with Condition Variables for coordination",
      "A hardware display screen",
      "A kernel profiling daemon",
      "A thread scheduler"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Monitors encapsulate shared data, procedures, and automatic mutual exclusion locks, preventing common human errors with semaphores.",
    "tags": [
      "OS",
      "Synchronization",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Synchronization",
    "subtopic": "Condition Variables wait() vs signal()",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does `condition_variable.wait(mutex)` do when called by a thread?",
    "options": [
      "Atomically releases the acquired mutex lock and suspends the calling thread on the condition queue until signaled",
      "Terminates the calling thread",
      "Spins in an infinite loop",
      "Acquires a second mutex lock"
    ],
    "correctAnswerIndex": 0,
    "explanation": "wait() must atomically release the lock so other threads can enter the monitor and satisfy the condition, re-acquiring the lock before returning.",
    "tags": [
      "OS",
      "Synchronization",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Synchronization",
    "subtopic": "Spurious Wakeup",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why MUST condition variable waits always be wrapped in a `while (!condition)` loop rather than an `if (!condition)` check?",
    "options": [
      "To protect against Spurious Wakeups (threads waking up without signal) and ensure condition is still true when the thread re-acquires the lock",
      "Compilers reject if statements",
      "While loops run faster",
      "Condition variables cannot evaluate booleans"
    ],
    "correctAnswerIndex": 0,
    "explanation": "OS signals or race conditions among multiple woken threads can cause the condition to become false again by the time a thread acquires the mutex.",
    "tags": [
      "OS",
      "Synchronization",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  },
  {
    "subject": "OS",
    "topic": "Synchronization",
    "subtopic": "Memory Barrier (Fence)",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the purpose of a Memory Barrier (Memory Fence) instruction in modern out-of-order execution CPUs?",
    "options": [
      "Prevents the compiler and CPU hardware from reordering memory read and write operations across the barrier boundary",
      "Flushes all data to SSD",
      "Disables interrupts globally",
      "Resets CPU registers to zero"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Modern CPUs reorder instructions aggressively for pipeline efficiency. A memory fence enforces strict program ordering across threads.",
    "tags": [
      "OS",
      "Synchronization",
      "Operating Systems",
      "Kernel",
      "GATE"
    ],
    "examRelevance": "GATE CS, ISRO, University OS Exams",
    "placementRelevance": "Qualcomm, Intel, Microsoft, Google Systems OA"
  }
];
