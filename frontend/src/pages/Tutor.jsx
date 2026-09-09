import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api.js";
import MarkdownRenderer from "../components/MarkdownRenderer.jsx";

const TypingIndicator = () => (
  <div className="flex items-start gap-3 justify-start animate-fade-in">
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
      style={{
        background: "linear-gradient(135deg, #7c3aed, #0ea5e9)",
        boxShadow: "0 0 15px rgba(124,58,237,0.3)",
      }}
    >
      🤖
    </div>
    <div
      className="px-5 py-3.5 rounded-2xl rounded-tl-sm flex gap-1.5 items-center bg-white border border-violet-200 shadow-sm"
    >
      <span className="text-xs font-bold text-violet-700 mr-2">
        AI Tutor is formulating your answer...
      </span>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full animate-bounce"
          style={{
            background: "#0ea5e9",
            animationDelay: `${i * 150}ms`,
          }}
        />
      ))}
    </div>
  </div>
);

const MessageBubble = ({ msg, index, onQuickFollowUp }) => {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex items-start gap-3 animate-fade-in-up ${
        isUser ? "justify-end" : "justify-start"
      }`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-1 text-white shadow-sm"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #0ea5e9)",
          }}
        >
          🤖
        </div>
      )}

      {/* Bubble Container */}
      <div className={`max-w-[88%] md:max-w-[80%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        {/* Author Tag */}
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-[11px] font-bold tracking-wide" style={{ color: isUser ? "#0284c7" : "#7c3aed" }}>
            {isUser ? "YOU" : "STUDENTIQ AI TUTOR"}
          </span>
          {msg.time && (
            <span className="text-[10px] text-slate-500 font-medium">
              {msg.time}
            </span>
          )}
        </div>

        {/* Bubble Content */}
        <div
          className="rounded-2xl p-4 md:p-5 transition-all duration-200"
          style={
            isUser
              ? {
                  background: "linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)",
                  borderRadius: "1.25rem 0.25rem 1.25rem 1.25rem",
                  color: "#ffffff",
                  boxShadow: "0 4px 15px rgba(124,58,237,0.25)",
                }
              : {
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.25rem 1.25rem 1.25rem 1.25rem",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  color: "#1e293b",
                }
          }
        >
          {isUser ? (
            <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
          ) : (
            <MarkdownRenderer content={msg.text} />
          )}
        </div>

        {/* AI Action Quick-Bar */}
        {!isUser && msg.text && (
          <div className="flex flex-wrap items-center gap-2 mt-2 px-1">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-200 flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
            >
              {copied ? "✓ Copied" : "📋 Copy"}
            </button>

            {onQuickFollowUp && (
              <>
                <button
                  onClick={() => onQuickFollowUp(`Can you explain the previous concept with a simple real-world analogy?`)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-200 bg-violet-50 border border-violet-200 text-violet-700 hover:bg-violet-100"
                >
                  💡 Simpler Analogy
                </button>
                <button
                  onClick={() => onQuickFollowUp(`Can you provide a practical code or SQL example for this?`)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-200 bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100"
                >
                  💻 Code Example
                </button>
                <button
                  onClick={() => onQuickFollowUp(`Give me 1 quick multiple-choice quiz question to test if I understood this concept correctly.`)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-200 bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100"
                >
                  ❓ Quiz Me
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1 text-white bg-slate-800 shadow-sm"
        >
          YOU
        </div>
      )}
    </div>
  );
};

const TUTOR_TRACKS = [
  { id: "All Subjects", label: "All Subjects", icon: "✨", color: "from-slate-700 to-slate-900" },
  { id: "DSA", label: "DSA & Algos", icon: "⚡", color: "from-blue-600 to-indigo-600" },
  { id: "DBMS", label: "DBMS & SQL", icon: "🗄️", color: "from-emerald-600 to-teal-600" },
  { id: "OS", label: "Operating Systems", icon: "💻", color: "from-violet-600 to-purple-600" },
  { id: "CN", label: "Computer Networks", icon: "🌐", color: "from-sky-600 to-cyan-600" },
  { id: "OOPS", label: "OOPs & SOLID", icon: "🧩", color: "from-amber-600 to-orange-600" },
  { id: "SYSTEM_DESIGN", label: "System Design", icon: "🏗️", color: "from-rose-600 to-pink-600" },
  { id: "APTITUDE", label: "Aptitude & Math", icon: "🧠", color: "from-fuchsia-600 to-pink-600" },
  { id: "WEB_DEV", label: "Web & DevOps", icon: "🚀", color: "from-emerald-600 to-green-600" },
];

const SUBJECT_SUGGESTIONS = {
  "All Subjects": [
    { label: "Binary Search Tree", query: "Explain Binary Search Tree operations and code in C++ with step-by-step logic." },
    { label: "Normalization in DBMS", query: "Explain 1NF, 2NF, 3NF, and BCNF with a clear relational table example." },
    { label: "TCP 3-Way Handshake", query: "Explain the TCP 3-Way Handshake step-by-step with packet diagrams." },
    { label: "Deadlock Conditions", query: "Explain the 4 necessary conditions for deadlock in Operating Systems and Banker's Algorithm." },
  ],
  DSA: [
    { label: "Graph BFS vs DFS", query: "Explain Breadth-First Search (BFS) vs Depth-First Search (DFS) with time/space complexity and C++ code." },
    { label: "DP Knapsack Patterns", query: "How does Memoization differ from Tabulation in Dynamic Programming? Show with 0/1 Knapsack." },
    { label: "Heap & Priority Queue", query: "Explain Min-Heap vs Max-Heap construction and heapify operation with O(log N) operations." },
    { label: "Two Pointer & Sliding Window", query: "Explain Two-Pointer and Sliding Window techniques with common placement interview patterns." },
  ],
  DBMS: [
    { label: "Normalization 1NF-BCNF", query: "Explain 1NF, 2NF, 3NF, and BCNF with a practical employee-department database table example." },
    { label: "B+ Tree Indexing", query: "Why are B+ Trees predominantly preferred over standard B-Trees for database indexing and range queries?" },
    { label: "ACID & Strict 2PL", query: "Explain ACID transaction properties and how Strict 2-Phase Locking (2PL) prevents cascading rollbacks." },
    { label: "SQL Complex Joins", query: "Explain INNER JOIN, LEFT JOIN, FULL OUTER JOIN and GROUP BY with SQL examples and performance tips." },
  ],
  OS: [
    { label: "Banker's Deadlock Algorithm", query: "Explain Banker's Algorithm for deadlock avoidance with resource allocation matrix and safe state check." },
    { label: "Process vs Thread", query: "Explain Process vs Thread, PCB vs TCB, and what happens during a CPU Context Switch." },
    { label: "Virtual Memory & Paging", query: "Explain Paging, Page Faults, TLB (Translation Lookaside Buffer), and Thrashing in Virtual Memory." },
    { label: "Semaphores vs Mutex", query: "What is the difference between a Binary Semaphore and a Mutex Lock? Give a Producer-Consumer example." },
  ],
  CN: [
    { label: "TCP 3-Way Handshake", query: "Explain the TCP 3-Way Handshake for connection establishment and 4-way handshake for termination." },
    { label: "Subnetting & CIDR Math", query: "Explain how to calculate subnet mask, network ID, and usable host IPs for /26 and /28 CIDR prefixes." },
    { label: "DNS Resolution Flow", query: "Trace step-by-step what happens from entering a URL in browser until DNS IP resolution." },
    { label: "HTTPS & TLS 1.3 Handshake", query: "How does HTTPS establish secure encrypted communication? Explain the TLS 1.3 cryptographic handshake." },
  ],
  OOPS: [
    { label: "Polymorphism & vtable", query: "Explain compile-time vs runtime polymorphism and how the vtable (virtual table) and vptr work under the hood in C++." },
    { label: "SOLID Principles in Code", query: "Explain each of the 5 SOLID engineering principles with bad code vs refactored good code examples." },
    { label: "Singleton & Factory Patterns", query: "Explain the Singleton Pattern (thread-safe double-checked locking) and Factory Pattern with practical code." },
    { label: "Abstract Class vs Interface", query: "What is the exact difference between an Abstract Class and an Interface in Java/C++? When should you use which?" },
  ],
  SYSTEM_DESIGN: [
    { label: "Horizontal vs Vertical Scaling", query: "Compare Horizontal Scaling vs Vertical Scaling, Load Balancer algorithms, and eliminating single points of failure." },
    { label: "Cache Stampede & Redis", query: "What is Cache Stampede and Cache Avalanche? How do you prevent it using Redis distributed mutex locks?" },
    { label: "CAP Theorem Trade-Offs", query: "Explain the CAP Theorem (Consistency vs Availability vs Partition Tolerance) with real-world examples (Cassandra vs MongoDB vs PostgreSQL)." },
    { label: "Sharding & Consistent Hashing", query: "How does Database Sharding work, and how does Consistent Hashing with virtual vnodes solve cluster rebalancing?" },
  ],
  APTITUDE: [
    { label: "Time & Work Short-Cuts", query: "Explain the standard short-cut formulas for Time & Work and Pipes & Cisterns with 2 solved examples." },
    { label: "Relative Speed & Trains", query: "Explain relative speed calculation for trains moving in opposite directions vs same direction with step-by-step math." },
    { label: "Combinatorics & Probability", query: "Explain Permutations (nPr) vs Combinations (nCr) shortcuts and probability tricks frequently asked in placement tests." },
    { label: "Profit, Loss & Discount", query: "Explain Cost Price, Selling Price, Marked Price and Successive Discount calculations with speed-math shortcuts." },
  ],
  WEB_DEV: [
    { label: "JS Event Loop & Microtasks", query: "Explain the JavaScript Event Loop, Call Stack, Microtask Queue (Promises), and Macrotask Queue (setTimeout) with execution order." },
    { label: "REST Idempotency & HTTP Codes", query: "Which HTTP methods are Idempotent? Explain the difference between PUT and PATCH, and 200 vs 201 vs 401 vs 403 vs 404 codes." },
    { label: "JWT Auth & Token Rotation", query: "Explain JSON Web Token (JWT) structure, access token vs refresh token rotation, and secure HTTP-only cookie storage." },
    { label: "Docker Containers vs VMs", query: "Explain the architectural difference between Docker Containers (sharing host OS kernel) and Virtual Machines (Hypervisor)." },
  ],
};

const Tutor = () => {
  const [searchParams] = useSearchParams();
  const [activeSubject, setActiveSubject] = useState("All Subjects");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      time: "Just now",
      text: `### 👋 Welcome to LearnX AI Academic Tutor!

I'm your 24/7 personalized Computer Science Engineering placement & semester tutor. I specialize across all **8 core placement tracks**:
* ⚡ **DSA**: Binary Search, Trees/BST, Dynamic Programming, Graphs, Heaps
* 🗄️ **DBMS & SQL**: Normalization 1NF-BCNF, B+ Trees, ACID, Transactions, Indexing
* 💻 **Operating Systems**: Processes, Semaphores, Deadlocks, Virtual Memory Paging
* 🌐 **Computer Networks**: OSI, TCP 3-Way Handshake, Subnetting CIDR, DNS, HTTPS
* 🧩 **OOPs & Design**: 4 Pillars, Polymorphism \`vtable\`, SOLID Principles, Patterns
* 🏗️ **System Design**: HLD Scalability, Redis Caching, Sharding, CAP Theorem
* 🧠 **Quantitative Aptitude**: Time-Work, Speed-Distance, Probability, Permutations
* 🚀 **Web Dev & DevOps**: JS Event Loop, REST API Idempotency, JWT, Docker

Select a subject pill above or type your question below! 🚀`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const hasAutoAsked = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Read URL query parameter (from roadmap "Ask AI Tutor" buttons)
  useEffect(() => {
    const q = searchParams.get("q") || searchParams.get("question");
    const subject = searchParams.get("subject") || "";
    if (subject) {
      setActiveSubject(subject);
    }
    if (q && !hasAutoAsked.current) {
      hasAutoAsked.current = true;
      executeQuestion(q, subject);
    }
  }, [searchParams]);

  const executeQuestion = async (questionText, subjectContext = activeSubject) => {
    if (!questionText.trim() || loading) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [
      ...prev,
      { role: "user", text: questionText, time: now },
    ]);
    setLoading(true);

    try {
      const { data } = await api.post("/tutor/ask", {
        question: questionText,
        subject: subjectContext !== "All Subjects" ? subjectContext : undefined,
      });

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.answer, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          time: now,
          text: `⚠️ **Failed to get response**: ${
            err.response?.data?.message || "Please check your network or API key."
          }`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    await executeQuestion(q);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentSuggestions = SUBJECT_SUGGESTIONS[activeSubject] || SUBJECT_SUGGESTIONS["All Subjects"];
  const currentTrackObj = TUTOR_TRACKS.find((t) => t.id === activeSubject) || TUTOR_TRACKS[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 flex flex-col" style={{ height: "calc(100vh - 80px)" }} id="tutor-page">
      {/* Top Header Card */}
      <div
        className="rounded-2xl p-4 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0 bg-gradient-to-r from-violet-100/90 via-purple-50 to-sky-100/90 border border-violet-200 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 text-white shadow-sm"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #0ea5e9)",
            }}
          >
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                AI Academic Tutor
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Active · 8 Placement Tracks</span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Step-by-step logic, code snippets, formulas & interview prep
            </p>
          </div>
        </div>

        {/* Selected subject indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-bold text-slate-500">Track:</span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-white border border-slate-200 text-slate-800 shadow-xs flex items-center gap-1.5">
            <span>{currentTrackObj.icon}</span>
            <span>{currentTrackObj.label}</span>
          </span>
        </div>
      </div>

      {/* ── 8-SUBJECT SCROLLABLE TRACK PILL SELECTOR ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-thin shrink-0">
        {TUTOR_TRACKS.map((t) => {
          const isSelected = activeSubject === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubject(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 border ${
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm scale-[1.02]"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span className="text-sm">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Scroll Area */}
      <div
        className="flex-1 overflow-y-auto space-y-5 pr-2 mb-3 scrollbar-thin"
        id="tutor-chat-messages"
      >
        {messages.map((msg, idx) => (
          <MessageBubble
            key={idx}
            msg={msg}
            index={idx}
            onQuickFollowUp={(q) => executeQuestion(q)}
          />
        ))}

        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion Starter Chips (Dynamic based on selected subject) */}
      <div className="mb-3 flex flex-wrap items-center gap-2 flex-shrink-0">
        <span className="text-[11px] font-black text-violet-900 flex items-center gap-1">
          <span>⚡ {currentTrackObj.label} Doubts:</span>
        </span>
        {currentSuggestions.slice(0, 3).map((item, i) => (
          <button
            key={i}
            onClick={() => executeQuestion(item.query)}
            className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all text-left bg-white border border-slate-200 text-slate-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-900 shadow-xs truncate max-w-[240px]"
          >
            {item.label} →
          </button>
        ))}
      </div>

      {/* Input Box Bar */}
      <div
        className="rounded-2xl p-2.5 flex items-end gap-2 flex-shrink-0 relative bg-white border border-slate-300 shadow-lg"
      >
        <div className="hidden sm:flex items-center self-center pl-2 pr-1 text-slate-400">
          <span className="text-lg">{currentTrackObj.icon}</span>
        </div>

        <textarea
          id="tutor-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask about ${activeSubject !== "All Subjects" ? currentTrackObj.label : "any CSE topic"} (e.g. "Explain with code / formula")...`}
          rows={1}
          className="flex-1 bg-transparent px-2 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none max-h-32 font-medium"
          style={{ minHeight: "40px" }}
        />

        <button
          id="tutor-send-btn"
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="btn-gradient px-4 py-2.5 rounded-xl text-sm font-black text-white flex items-center gap-1.5 disabled:opacity-40 flex-shrink-0 shadow-sm cursor-pointer"
        >
          {loading ? (
            <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          ) : (
            <>
              Send <span>↑</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Tutor;
