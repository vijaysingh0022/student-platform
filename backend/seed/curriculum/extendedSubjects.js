import { createTopic } from "./builder.js";

// Helper to generate a 5-unit, multi-chapter, multi-topic syllabus for a CSE subject
export function generateSubjectCurriculum(sub) {
  const units = [];
  const chapters = [];
  const topics = [];

  sub.unitsDefinition.forEach((uDef, uIdx) => {
    const unitNumber = uIdx + 1;
    const unitId = `${sub.id}-u${unitNumber}`;

    units.push({
      unitId,
      subjectId: sub.id,
      unitNumber,
      title: `Unit ${unitNumber} — ${uDef.title}`,
      description: uDef.description,
      learningObjectives: uDef.learningObjectives || [
        `Master fundamental theory and mechanics of ${uDef.title}`,
        `Analyze algorithmic complexity and trade-offs`,
        `Apply design patterns and best practices to real-world engineering scenarios`,
        `Solve university exam questions and competitive interview problems`,
      ],
      difficulty: uDef.difficulty || (uIdx < 2 ? "Beginner" : uIdx < 4 ? "Intermediate" : "Advanced"),
      estimatedHours: uDef.estimatedHours || 8,
      prerequisites: uDef.prerequisites || (uIdx === 0 ? ["Basic Engineering Mathematics", "Basic Programming"] : [`Unit ${uIdx} — Foundations`]),
      practiceQuestionsCount: 15,
      quizQuestionsCount: 10,
      order: unitNumber,
    });

    uDef.chapters.forEach((chDef, chIdx) => {
      const chapterNumber = chIdx + 1;
      const chapterId = `${unitId}-c${chapterNumber}`;

      chapters.push({
        chapterId,
        unitId,
        subjectId: sub.id,
        chapterNumber,
        title: chDef.title,
        description: chDef.description || `In-depth exploration of ${chDef.title}`,
        order: chapterNumber,
      });

      chDef.topics.forEach((topDef, tIdx) => {
        const topicNumber = tIdx + 1;
        const topicId = `${chapterId}-t${topicNumber}`;

        topics.push(
          createTopic({
            topicId,
            chapterId,
            unitId,
            subjectId: sub.id,
            topicNumber,
            title: topDef.title,
            summary: topDef.summary,
            estimatedMinutes: topDef.estimatedMinutes || 25,
            difficulty: topDef.difficulty || (chIdx === 0 ? "Beginner" : "Intermediate"),
            subtopics: topDef.subtopics || [
              `${topDef.title} Fundamentals`,
              `Mechanics & Core Operations`,
              `Complexity & Invariant Analysis`,
              `Real-World Systems Engineering`,
            ],
            timeComplexity: topDef.timeComplexity || "O(N)",
            spaceComplexity: topDef.spaceComplexity || "O(1)",
            detailedExplanation: topDef.detailedExplanation,
            realWorldExample: topDef.realWorldExample,
          })
        );
      });
    });
  });

  return { units, chapters, topics };
}

// ── Extended Major CSE Subjects Definitions ──
export const EXTENDED_SUBJECTS_DEFINITIONS = [
  // 1. DAA (Design & Analysis of Algorithms)
  {
    id: "daa",
    unitsDefinition: [
      {
        title: "Asymptotic Analysis & Recurrence Relations",
        description: "Divide-and-conquer recurrences, Master Theorem, Substitution Method, and Recursion Tree Analysis.",
        chapters: [
          {
            title: "Recurrence Solving",
            topics: [
              { title: "Master Theorem for Divide & Conquer", timeComplexity: "O(1) evaluation", spaceComplexity: "O(1)" },
              { title: "Recursion Tree Method & Asymptotic Bounds", timeComplexity: "O(N log N)", spaceComplexity: "O(log N)" },
            ],
          },
        ],
      },
      {
        title: "Divide & Conquer Strategy",
        description: "Merge Sort, QuickSort with randomized pivoting, Closest Pair of Points, and Strassen's Matrix Multiplication.",
        chapters: [
          {
            title: "Core Divide & Conquer Algorithms",
            topics: [
              { title: "Randomized QuickSort & Median Selection", timeComplexity: "O(N log N) avg", spaceComplexity: "O(log N)" },
              { title: "Strassen's Fast Matrix Multiplication", timeComplexity: "O(N^2.81)", spaceComplexity: "O(N^2)" },
            ],
          },
        ],
      },
      {
        title: "Greedy Algorithms & Dynamic Programming",
        description: "Optimal substructure, overlapping subproblems, Fractional Knapsack, 0/1 Knapsack, LCS, and Matrix Chain Multiplication.",
        chapters: [
          {
            title: "Dynamic Programming Paradigms",
            topics: [
              { title: "Longest Common Subsequence (LCS)", timeComplexity: "O(M * N)", spaceComplexity: "O(M * N)" },
              { title: "0/1 Knapsack Problem with Memoization", timeComplexity: "O(N * W)", spaceComplexity: "O(W)" },
              { title: "Matrix Chain Multiplication (MCM)", timeComplexity: "O(N^3)", spaceComplexity: "O(N^2)" },
            ],
          },
        ],
      },
      {
        title: "Backtracking & Branch-and-Bound",
        description: "N-Queens problem, Subset Sum, Graph Coloring, Hamiltonian Cycle, and 15-Puzzle Branch & Bound.",
        chapters: [
          {
            title: "Combinatorial State Search",
            topics: [
              { title: "N-Queens Backtracking with Pruning", timeComplexity: "O(N!)", spaceComplexity: "O(N)" },
              { title: "Branch and Bound for Traveling Salesperson (TSP)", timeComplexity: "O(2^N * N^2)", spaceComplexity: "O(N)" },
            ],
          },
        ],
      },
      {
        title: "Graph Algorithms & NP-Completeness",
        description: "Bellman-Ford, Floyd-Warshall, KMP string matching, P vs NP, NP-Hard, and Cook's Theorem.",
        chapters: [
          {
            title: "Advanced Graphs & Complexity Classes",
            topics: [
              { title: "Bellman-Ford Algorithm with Negative Cycle Detection", timeComplexity: "O(V * E)", spaceComplexity: "O(V)" },
              { title: "Floyd-Warshall All-Pairs Shortest Path", timeComplexity: "O(V^3)", spaceComplexity: "O(V^2)" },
              { title: "P, NP, NP-Complete & Reductions", timeComplexity: "Non-deterministic Polynomial", spaceComplexity: "O(Poly)" },
            ],
          },
        ],
      },
    ],
  },

  // 2. COA (Computer Organization & Architecture)
  {
    id: "coa",
    unitsDefinition: [
      {
        title: "Digital Logic & Register Transfer",
        description: "Combinational circuits, flip-flops, multiplexers, register transfer bus, and arithmetic microoperations.",
        chapters: [
          {
            title: "Bus & Arithmetic Logic",
            topics: [
              { title: "Common Bus System with Multiplexers", timeComplexity: "O(1) clock cycle", spaceComplexity: "Hardware" },
              { title: "Arithmetic Microoperations & ALU Design", timeComplexity: "1-2 cycles", spaceComplexity: "Registers" },
            ],
          },
        ],
      },
      {
        title: "Basic Computer Organization & CPU Design",
        description: "Instruction cycle, fetch-decode-execute phases, direct/indirect addressing, and hardwired vs microprogrammed control.",
        chapters: [
          {
            title: "Instruction Processing",
            topics: [
              { title: "Instruction Cycle & Interrupt Handling", timeComplexity: "3-5 stages", spaceComplexity: "PC / IR" },
              { title: "Microprogrammed vs Hardwired Control Units", timeComplexity: "Deterministic", spaceComplexity: "Control ROM" },
            ],
          },
        ],
      },
      {
        title: "Instruction Pipelining & Hazards",
        description: "Linear pipelining, RISC vs CISC, structural hazards, data hazards (forwarding), and branch prediction.",
        chapters: [
          {
            title: "Pipelining & Hazards",
            topics: [
              { title: "5-Stage Instruction Pipeline (IF, ID, EX, MEM, WB)", timeComplexity: "Ideal CPI = 1", spaceComplexity: "Pipeline Registers" },
              { title: "Data Hazards & Operand Forwarding", timeComplexity: "1 stall avoidance", spaceComplexity: "Bypass Network" },
            ],
          },
        ],
      },
      {
        title: "Computer Arithmetic",
        description: "Booth's multiplication algorithm for signed numbers, restoring/non-restoring division, and IEEE 754 floating point.",
        chapters: [
          {
            title: "Arithmetic Engines",
            topics: [
              { title: "Booth's Multiplication Algorithm", timeComplexity: "O(N) shifts/adds", spaceComplexity: "Double Register" },
              { title: "IEEE 754 Single & Double Precision Float Format", timeComplexity: "Fixed bitmask", spaceComplexity: "32/64 bits" },
            ],
          },
        ],
      },
      {
        title: "Memory Hierarchy & Cache Mapping",
        description: "Locality of reference, cache mapping (Direct, Fully Associative, Set Associative), write policies, and virtual memory paging.",
        chapters: [
          {
            title: "Cache & Memory Systems",
            topics: [
              { title: "Cache Mapping Techniques (Direct, Associative, Set-Associative)", timeComplexity: "O(1) hit", spaceComplexity: "Tag Arrays" },
              { title: "Virtual Memory, Paging & Translation Lookaside Buffer (TLB)", timeComplexity: "O(1) TLB hit", spaceComplexity: "Page Tables" },
            ],
          },
        ],
      },
    ],
  },

  // 3. TOC (Theory of Computation)
  {
    id: "toc",
    unitsDefinition: [
      {
        title: "Finite Automata & Regular Languages",
        description: "Deterministic Finite Automata (DFA), NFA, NFA to DFA subset construction, and regular expressions.",
        chapters: [
          {
            title: "Automata Models",
            topics: [
              { title: "Deterministic Finite Automata (DFA) Minimization", timeComplexity: "O(K * N log N)", spaceComplexity: "O(N)" },
              { title: "NFA to DFA Conversion via Powerset Construction", timeComplexity: "O(2^Q)", spaceComplexity: "O(2^Q)" },
            ],
          },
        ],
      },
      {
        title: "Regular Expressions & Pumping Lemma",
        description: "Arden's Theorem, converting DFA to regex, closure properties of regular languages, and Pumping Lemma for non-regularity.",
        chapters: [
          {
            title: "Regular Language Proofs",
            topics: [
              { title: "Pumping Lemma for Regular Languages", timeComplexity: "Proof Technique", spaceComplexity: "Adversarial Game" },
              { title: "Closure Properties of Regular Languages", timeComplexity: "Theoretical", spaceComplexity: "States" },
            ],
          },
        ],
      },
      {
        title: "Context-Free Grammars & Pushdown Automata",
        description: "Derivation trees, ambiguity, Chomsky Normal Form (CNF), Greibach Normal Form (GNF), and deterministic vs non-deterministic PDA.",
        chapters: [
          {
            title: "Grammars & Pushdown Machines",
            topics: [
              { title: "Ambiguity in CFGs & Chomsky Normal Form (CNF)", timeComplexity: "Grammar Simplification", spaceComplexity: "Productions" },
              { title: "Pushdown Automata (PDA) Acceptance by Stack & Final State", timeComplexity: "O(N) steps", spaceComplexity: "O(N) Stack" },
            ],
          },
        ],
      },
      {
        title: "Turing Machines & Computability",
        description: "Formal definition of Turing Machines, instantaneous descriptions, multi-tape TMs, and Universal Turing Machines.",
        chapters: [
          {
            title: "Turing Architecture",
            topics: [
              { title: "Turing Machine Design for Language Recognition", timeComplexity: "O(N^2) or O(N)", spaceComplexity: "O(N) Tape" },
              { title: "Church-Turing Thesis & Universal Turing Machine", timeComplexity: "Simulation", spaceComplexity: "Infinite Tape" },
            ],
          },
        ],
      },
      {
        title: "Decidability & The Halting Problem",
        description: "Recursive vs recursively enumerable languages, Halting Problem proof by diagonalization, Post Correspondence Problem (PCP).",
        chapters: [
          {
            title: "Limits of Computation",
            topics: [
              { title: "The Halting Problem & Turing Diagonalization", timeComplexity: "Undecidable", spaceComplexity: "Proof by Contradiction" },
              { title: "Post Correspondence Problem (PCP) & Reductions", timeComplexity: "Semi-decidable", spaceComplexity: "Match Pairs" },
            ],
          },
        ],
      },
    ],
  },

  // 4. Software Engineering (se)
  {
    id: "se",
    unitsDefinition: [
      {
        title: "Software Process Models",
        description: "SDLC phases, Waterfall, V-Model, Prototyping, Spiral risk-driven model, Agile manifesto, and Scrum sprints.",
        chapters: [
          {
            title: "Process Methodologies",
            topics: [
              { title: "Agile Software Development & Scrum Framework", timeComplexity: "Iterative Sprints", spaceComplexity: "Backlog" },
              { title: "Spiral Model & Risk Analysis", timeComplexity: "Milestone Gates", spaceComplexity: "Risk Matrix" },
            ],
          },
        ],
      },
      {
        title: "Requirements Engineering",
        description: "Functional vs non-functional requirements, SRS IEEE 830 standard, Use Case modeling, and user stories.",
        chapters: [
          {
            title: "Requirements & Modeling",
            topics: [
              { title: "IEEE 830 SRS Document Specification", timeComplexity: "Phase 1", spaceComplexity: "Spec Document" },
              { title: "UML Use Case & Sequence Diagrams", timeComplexity: "Design Phase", spaceComplexity: "Actor Mappings" },
            ],
          },
        ],
      },
      {
        title: "Software Architecture & Modularity",
        description: "Coupling, cohesion, layered architecture, microservices vs monoliths, and API-first contract design.",
        chapters: [
          {
            title: "Architectural Design",
            topics: [
              { title: "Cohesion vs Coupling in Component Design", timeComplexity: "Code Metrics", spaceComplexity: "Module Dependency" },
              { title: "Microservices Architecture & Event-Driven Patterns", timeComplexity: "Distributed", spaceComplexity: "Event Bus" },
            ],
          },
        ],
      },
      {
        title: "Software Testing & Quality Assurance",
        description: "Black-box vs white-box testing, cyclomatic complexity, boundary value analysis, unit, integration, and E2E testing.",
        chapters: [
          {
            title: "Verification & Validation",
            topics: [
              { title: "McCabe's Cyclomatic Complexity & Basis Path Testing", timeComplexity: "V(G) = E - N + 2P", spaceComplexity: "CFG Graph" },
              { title: "Boundary Value Analysis & Equivalence Partitioning", timeComplexity: "Test Case Generation", spaceComplexity: "Test Vectors" },
            ],
          },
        ],
      },
      {
        title: "DevOps, CI/CD & Project Estimation",
        description: "COCOMO estimation model, Git version control, CI/CD pipelines, Docker deployment, and maintenance metrics.",
        chapters: [
          {
            title: "Modern Delivery",
            topics: [
              { title: "COCOMO Effort & Cost Estimation", timeComplexity: "E = a * (KLOC)^b", spaceComplexity: "Staff Months" },
              { title: "CI/CD Pipeline Automation & Deployment Strategies", timeComplexity: "Automated Triggers", spaceComplexity: "Build Artifacts" },
            ],
          },
        ],
      },
    ],
  },

  // 5. Compiler Design (compiler-design)
  {
    id: "compiler-design",
    unitsDefinition: [
      {
        title: "Introduction & Lexical Analysis",
        description: "Compiler phases, symbol table, Lex/Flex tool, DFA token recognition, and input buffering techniques.",
        chapters: [
          {
            title: "Tokenization",
            topics: [
              { title: "Phases of a Modern Compiler Architecture", timeComplexity: "Pipelined Passes", spaceComplexity: "AST / Symbol Table" },
              { title: "Lexical Analyzer Design & Input Buffering", timeComplexity: "O(N) stream", spaceComplexity: "Double Buffer" },
            ],
          },
        ],
      },
      {
        title: "Syntax Analysis & Top-Down Parsing",
        description: "Left recursion elimination, left factoring, FIRST and FOLLOW sets, and predictive LL(1) parsing tables.",
        chapters: [
          {
            title: "LL Parsing",
            topics: [
              { title: "FIRST and FOLLOW Sets Computation", timeComplexity: "O(Grammar Size)", spaceComplexity: "Set Table" },
              { title: "LL(1) Predictive Parsing Table Construction", timeComplexity: "O(Non-terminals * Terminals)", spaceComplexity: "Parse Table" },
            ],
          },
        ],
      },
      {
        title: "Bottom-Up LR Parsing",
        description: "Shift-reduce parsing, handles, LR(0) items, SLR(1), Canonical LR(1), and LALR(1) parser generators.",
        chapters: [
          {
            title: "LR Parsing Engines",
            topics: [
              { title: "SLR(1) Parsing Table & Shift-Reduce Conflicts", timeComplexity: "O(States * Terminals)", spaceComplexity: "DFA Items" },
              { title: "LALR(1) Parsing & Yacc / Bison Workflow", timeComplexity: "Compact LR States", spaceComplexity: "Parse Table" },
            ],
          },
        ],
      },
      {
        title: "Syntax-Directed Translation & Intermediate Code",
        description: "Synthesized vs inherited attributes, 3-Address Code (TAC), quadruples, triples, and DAG generation.",
        chapters: [
          {
            title: "IR Generation",
            topics: [
              { title: "Three-Address Code (TAC) Quadruples & Triples", timeComplexity: "O(AST Nodes)", spaceComplexity: "Instruction List" },
              { title: "Syntax-Directed Translation (SDT) & Attribute Grammars", timeComplexity: "Single-pass", spaceComplexity: "Stack" },
            ],
          },
        ],
      },
      {
        title: "Code Optimization & Code Generation",
        description: "Basic blocks, flow graphs, common subexpression elimination, loop unrolling, register allocation, and target code.",
        chapters: [
          {
            title: "Optimization & Emission",
            topics: [
              { title: "Basic Blocks & Directed Acyclic Graph (DAG) Optimization", timeComplexity: "O(Instructions)", spaceComplexity: "DAG Nodes" },
              { title: "Loop Invariant Code Motion & Dead Code Elimination", timeComplexity: "Iterative Dataflow", spaceComplexity: "Bitvectors" },
            ],
          },
        ],
      },
    ],
  },

  // 6. Artificial Intelligence (ai)
  {
    id: "ai",
    unitsDefinition: [
      {
        title: "Foundations of AI & Agent Architectures",
        description: "Turing test, rationality, agent environments (PEAS), reactive, model-based, goal-based, and utility agents.",
        chapters: [
          {
            title: "Intelligent Agents",
            topics: [
              { title: "PEAS Framework & Environment Classifications", timeComplexity: "Analysis", spaceComplexity: "State Space" },
              { title: "Agent Architectures: Goal-Based vs Utility-Based", timeComplexity: "Decision Loop", spaceComplexity: "Knowledge Base" },
            ],
          },
        ],
      },
      {
        title: "Problem Solving by Search",
        description: "Uninformed search (BFS, DFS, Uniform Cost Search), heuristic search (A*, Greedy Best-First), and heuristic admissibility.",
        chapters: [
          {
            title: "Heuristic Search",
            topics: [
              { title: "A* Search Algorithm & Admissible Heuristics", timeComplexity: "O(b^d)", spaceComplexity: "O(b^d)" },
              { title: "Uniform Cost Search (Dijkstra Variant for AI)", timeComplexity: "O(b^(1 + C*/e))", spaceComplexity: "Priority Queue" },
            ],
          },
        ],
      },
      {
        title: "Adversarial Search & Game Playing",
        description: "Minimax algorithm for zero-sum games, Alpha-Beta pruning, evaluation functions, and stochastic games.",
        chapters: [
          {
            title: "Game Trees",
            topics: [
              { title: "Minimax Algorithm with Alpha-Beta Pruning", timeComplexity: "O(b^(d/2)) best", spaceComplexity: "O(b * d)" },
              { title: "Heuristic Evaluation Functions in Game AI", timeComplexity: "O(1) per node", spaceComplexity: "O(1)" },
            ],
          },
        ],
      },
      {
        title: "Knowledge Representation & First-Order Logic",
        description: "Propositional logic, inference rules, resolution, First-Order Logic (FOL), unification, and forward/backward chaining.",
        chapters: [
          {
            title: "Logic & Inference",
            topics: [
              { title: "First-Order Logic (FOL) & Unification Algorithm", timeComplexity: "O(N^2) terms", spaceComplexity: "Substitution Set" },
              { title: "Resolution Refutation in Propositional & FOL Logic", timeComplexity: "NP-complete", spaceComplexity: "Clause Set" },
            ],
          },
        ],
      },
      {
        title: "Uncertainty & Probabilistic Reasoning",
        description: "Probability axioms, Bayes' Rule, Bayesian Belief Networks (BBN), conditional independence, and Markov Decision Processes.",
        chapters: [
          {
            title: "Probabilistic AI",
            topics: [
              { title: "Bayesian Belief Networks (BBN) & Joint Probability", timeComplexity: "O(2^Parents)", spaceComplexity: "CPT Tables" },
              { title: "Markov Decision Processes (MDP) & Bellman Equation", timeComplexity: "O(|S|^2 * |A|)", spaceComplexity: "Value Vector" },
            ],
          },
        ],
      },
    ],
  },

  // 7. Computer Graphics (computer-graphics)
  {
    id: "computer-graphics",
    unitsDefinition: [
      {
        title: "Graphics Hardware & Scan Conversion",
        description: "Raster scan vs vector scan displays, frame buffer, DDA line algorithm, and Bresenham's line & circle drawing.",
        chapters: [
          {
            title: "Rasterization",
            topics: [
              { title: "Bresenham's Line Drawing Algorithm (Integer Math)", timeComplexity: "O(N) pixels", spaceComplexity: "O(1)" },
              { title: "Midpoint Circle Generation Algorithm", timeComplexity: "O(R) octants", spaceComplexity: "O(1)" },
            ],
          },
        ],
      },
      {
        title: "2D Geometric Transformations & Clipping",
        description: "Translation, rotation, scaling, homogeneous coordinates, composite matrices, and Cohen-Sutherland line clipping.",
        chapters: [
          {
            title: "2D Transforms & Clipping",
            topics: [
              { title: "2D Affine Transformations via 3x3 Homogeneous Matrices", timeComplexity: "O(1) matrix mult", spaceComplexity: "3x3 Matrix" },
              { title: "Cohen-Sutherland Outcode Line Clipping Algorithm", timeComplexity: "O(1) bitwise checks", spaceComplexity: "4-bit Outcodes" },
            ],
          },
        ],
      },
      {
        title: "3D Concepts & Transformations",
        description: "3D coordinate systems, 3D translation, rotation, scaling, parallel projection (orthographic), and perspective projection.",
        chapters: [
          {
            title: "3D Graphics Pipeline",
            topics: [
              { title: "3D Perspective Projection & Vanishing Points", timeComplexity: "O(V) vertices", spaceComplexity: "4x4 Matrix" },
              { title: "3D Composite Transformations & Viewing Pipeline", timeComplexity: "Matrix Stacks", spaceComplexity: "GPU Uniforms" },
            ],
          },
        ],
      },
      {
        title: "Visible Surface Detection (Hidden Surface Removal)",
        description: "Object-space vs image-space methods, Depth Buffer (Z-Buffer) algorithm, A-Buffer, and Back-Face culling.",
        chapters: [
          {
            title: "Depth & Occlusion",
            topics: [
              { title: "Z-Buffer (Depth Buffer) Algorithm", timeComplexity: "O(Polygons * Pixels)", spaceComplexity: "O(Width * Height) Buffer" },
              { title: "Back-Face Culling via Normal Dot Product", timeComplexity: "O(F) face tests", spaceComplexity: "Vector3" },
            ],
          },
        ],
      },
      {
        title: "Illumination & Shading Models",
        description: "Ambient, diffuse (Lambertian), and specular (Phong) reflection, Flat shading, Gouraud shading, and Phong shading.",
        chapters: [
          {
            title: "Lighting & Shading",
            topics: [
              { title: "Phong Illumination Model (Ambient + Diffuse + Specular)", timeComplexity: "O(Light Sources)", spaceComplexity: "Color RGB" },
              { title: "Gouraud vs Phong Shading Comparison", timeComplexity: "Interpolation per pixel", spaceComplexity: "Vertex Normals" },
            ],
          },
        ],
      },
    ],
  },

  // 8. SQL & Advanced Databases (sql)
  {
    id: "sql",
    unitsDefinition: [
      {
        title: "SQL Foundations & Declarative DDL/DML",
        description: "Schema creation, constraints (PK, FK, Unique, Check), data types, joins (Inner, Left, Right, Full Outer), and set operations.",
        chapters: [
          {
            title: "Core Relational SQL",
            topics: [
              { title: "Relational Joins & Execution Mechanics", timeComplexity: "Hash / Nested Loop", spaceComplexity: "Join Buffer" },
              { title: "Integrity Constraints & Cascading Foreign Keys", timeComplexity: "O(log N) lookup", spaceComplexity: "Foreign Indexes" },
            ],
          },
        ],
      },
      {
        title: "Subqueries, Aggregations & Grouping",
        description: "GROUP BY, HAVING, correlated subqueries, EXISTS vs IN operators, and NULL handling semantics (Three-Valued Logic).",
        chapters: [
          {
            title: "Aggregations",
            topics: [
              { title: "Correlated Subqueries vs JOIN Performance", timeComplexity: "O(M * N) vs O(M + N)", spaceComplexity: "Hash Buckets" },
              { title: "GROUP BY, HAVING & Three-Valued Logic", timeComplexity: "Sort / Hash Grouping", spaceComplexity: "Temp Table" },
            ],
          },
        ],
      },
      {
        title: "Window Functions & Analytics",
        description: "OVER clause, PARTITION BY, ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG, running totals, and moving averages.",
        chapters: [
          {
            title: "Analytical SQL",
            topics: [
              { title: "ROW_NUMBER(), RANK() & DENSE_RANK()", timeComplexity: "O(N log N) sort", spaceComplexity: "Window Buffer" },
              { title: "LEAD(), LAG() & Running Totals via Window Frames", timeComplexity: "O(N) streaming", spaceComplexity: "O(Frame Size)" },
            ],
          },
        ],
      },
      {
        title: "Programmable SQL: Procedures, Triggers & Views",
        description: "Stored procedures, user-defined functions, BEFORE/AFTER triggers, updatable views, and recursive Common Table Expressions (CTEs).",
        chapters: [
          {
            title: "Programmability",
            topics: [
              { title: "Recursive Common Table Expressions (Hierarchical Trees)", timeComplexity: "O(Tree Nodes)", spaceComplexity: "Recursion Stack" },
              { title: "Triggers & Stored Procedure Execution Plans", timeComplexity: "Precompiled", spaceComplexity: "Plan Cache" },
            ],
          },
        ],
      },
      {
        title: "Query Optimization & Indexing Strategies",
        description: "EXPLAIN / ANALYZE, B+ Tree index structures, covering indexes, clustered vs non-clustered, index selectivity, and query tuning.",
        chapters: [
          {
            title: "Performance & Indexing",
            topics: [
              { title: "B+ Tree Indexing Internals & Leaf Page Layout", timeComplexity: "O(log_B N)", spaceComplexity: "Index Space" },
              { title: "EXPLAIN Query Execution Plans & Index Scans vs Seq Scans", timeComplexity: "Cost Optimizer", spaceComplexity: "Optimizer Memory" },
            ],
          },
        ],
      },
    ],
  },

  // 9. Cloud Computing (cloud)
  {
    id: "cloud",
    unitsDefinition: [
      {
        title: "Cloud Concepts & Service Models",
        description: "NIST definition of cloud, IaaS, PaaS, SaaS, public/private/hybrid deployment, elasticity, and shared responsibility model.",
        chapters: [
          {
            title: "Cloud Foundations",
            topics: [
              { title: "IaaS vs PaaS vs SaaS Architecture & Trade-Offs", timeComplexity: "Strategic", spaceComplexity: "Cloud Resources" },
              { title: "Shared Responsibility Model for Cloud Security", timeComplexity: "Governance", spaceComplexity: "Security Policies" },
            ],
          },
        ],
      },
      {
        title: "Virtualization & Hypervisors",
        description: "Type-1 (Bare Metal) vs Type-2 hypervisors, hardware-assisted virtualization (VT-x), paravirtualization, and containerization.",
        chapters: [
          {
            title: "Virtualization Technology",
            topics: [
              { title: "Type-1 vs Type-2 Hypervisors & CPU Emulation", timeComplexity: "Hardware Trap", spaceComplexity: "VMM Footprint" },
              { title: "Linux Containers (cgroups, namespaces) vs Virtual Machines", timeComplexity: "Near Native", spaceComplexity: "MBs vs GBs" },
            ],
          },
        ],
      },
      {
        title: "Cloud Storage & Distributed Databases",
        description: "Object storage (S3), block storage (EBS), file storage (EFS), CAP theorem in cloud, and eventual consistency models.",
        chapters: [
          {
            title: "Storage & Consistency",
            topics: [
              { title: "Object Storage Architecture (Amazon S3 Mechanics)", timeComplexity: "REST HTTP", spaceComplexity: "Petabyte Scale" },
              { title: "Eventual Consistency & PACELC Theorem", timeComplexity: "Distributed Quorum", spaceComplexity: "Replicas" },
            ],
          },
        ],
      },
      {
        title: "Container Orchestration & Serverless",
        description: "Docker packaging, Kubernetes pods, deployments, services, horizontal pod autoscaling, AWS Lambda, and event-driven architecture.",
        chapters: [
          {
            title: "Orchestration & Microservices",
            topics: [
              { title: "Kubernetes Cluster Architecture: Control Plane & Worker Nodes", timeComplexity: "Reconciliation Loop", spaceComplexity: "etcd Store" },
              { title: "Serverless Computing (AWS Lambda) & Cold Start Mitigation", timeComplexity: "Sub-second Invocation", spaceComplexity: "Ephemeral RAM" },
            ],
          },
        ],
      },
      {
        title: "Cloud Security, Disaster Recovery & FinOps",
        description: "IAM roles, VPC private subnets, security groups, RPO/RTO disaster recovery, multi-region failover, and cloud cost governance.",
        chapters: [
          {
            title: "Enterprise Cloud Operations",
            topics: [
              { title: "AWS Virtual Private Cloud (VPC) & Security Architecture", timeComplexity: "Packet Filter", spaceComplexity: "CIDR Blocks" },
              { title: "High Availability & Multi-Region Disaster Recovery (RPO/RTO)", timeComplexity: "Failover < 60s", spaceComplexity: "Cross-region Sync" },
            ],
          },
        ],
      },
    ],
  },

  // 10. Cyber Security (cyber-sec)
  {
    id: "cyber-sec",
    unitsDefinition: [
      {
        title: "Security Foundations & Cryptography",
        description: "CIA triad, symmetric encryption (AES), asymmetric encryption (RSA, ECC), hashing (SHA-256), and HMAC authentication.",
        chapters: [
          {
            title: "Cryptographic Primitives",
            topics: [
              { title: "AES Symmetric Encryption & Cipher Block Modes (CBC/GCM)", timeComplexity: "Hardware AES-NI", spaceComplexity: "128/256 bits" },
              { title: "RSA Asymmetric Cryptography & Prime Factorization", timeComplexity: "Modular Exponentiation", spaceComplexity: "2048/4096 bits" },
            ],
          },
        ],
      },
      {
        title: "Authentication, PKI & TLS Handshakes",
        description: "Public Key Infrastructure (PKI), digital certificates (X.509), TLS 1.3 handshake flow, multi-factor authentication, and JWT tokens.",
        chapters: [
          {
            title: "Identity & Transport Security",
            topics: [
              { title: "TLS 1.3 1-RTT Handshake & Perfect Forward Secrecy", timeComplexity: "1 Network RTT", spaceComplexity: "Ephemeral ECDHE" },
              { title: "JWT Token Security: Attacks, Revocation & Best Practices", timeComplexity: "O(1) verification", spaceComplexity: "Stateless Header" },
            ],
          },
        ],
      },
      {
        title: "Network Security & Firewalls",
        description: "Packet filtering firewalls, stateful inspection, Next-Gen Firewalls, IDS/IPS, DDoS attacks (SYN floods), and mitigation.",
        chapters: [
          {
            title: "Network Defense",
            topics: [
              { title: "Stateful Packet Inspection vs Application Firewalls", timeComplexity: "Wire-Speed", spaceComplexity: "State Connection Table" },
              { title: "DDoS Mitigation & SYN Flood Defense (SYN Cookies)", timeComplexity: "Stateless Cryptohash", spaceComplexity: "Zero Backlog Queue" },
            ],
          },
        ],
      },
      {
        title: "Web Application Security (OWASP Top 10)",
        description: "SQL Injection, Cross-Site Scripting (XSS), CSRF, SSRF, broken access control, and defensive secure coding patterns.",
        chapters: [
          {
            title: "Application Vulnerabilities",
            topics: [
              { title: "SQL Injection (SQLi) & Parameterized Prepared Statements", timeComplexity: "Pre-compiled Ast", spaceComplexity: "Parameterized Buffer" },
              { title: "Cross-Site Scripting (XSS) & Content Security Policy (CSP)", timeComplexity: "Browser Parsing", spaceComplexity: "DOM Sanitization" },
            ],
          },
        ],
      },
      {
        title: "Incident Response, Forensics & Zero Trust",
        description: "Zero Trust Architecture (ZTA), NIST cybersecurity framework, digital forensics chain of custody, and penetration testing.",
        chapters: [
          {
            title: "Advanced Security & Forensics",
            topics: [
              { title: "Zero Trust Architecture: Never Trust, Always Verify", timeComplexity: "Per-request Auth", spaceComplexity: "Identity Context" },
              { title: "Digital Forensics & Memory Volatility Analysis", timeComplexity: "Triage Acquisition", spaceComplexity: "Raw Memory Dump" },
            ],
          },
        ],
      },
    ],
  },

  // 11. Python Programming (python)
  {
    id: "python",
    unitsDefinition: [
      {
        title: "Python Syntax, Data Types & Control Flow",
        description: "Variables, dynamic typing, numeric types, strings, slicing, conditionals, loops, and list comprehensions.",
        chapters: [
          {
            title: "Core Language",
            topics: [
              { title: "Dynamic Typing, Memory Management & Python Bytecode", timeComplexity: "O(1) allocation", spaceComplexity: "PyObject Overhead" },
              { title: "List & Dictionary Comprehensions with Walrus Operator", timeComplexity: "C-Loop Speed", spaceComplexity: "Contiguous List" },
            ],
          },
        ],
      },
      {
        title: "Built-in Data Structures & Collections",
        description: "Lists vs Tuples, Sets, Dictionaries (hash table internals), deque, namedtuple, Counter, and defaultdict.",
        chapters: [
          {
            title: "Data Structures",
            topics: [
              { title: "Python Dictionary Hash Table Internals & Collision Resolution", timeComplexity: "O(1) average lookup", spaceComplexity: "Compact Array" },
              { title: "Collections Module: deque, Counter & OrderedDict", timeComplexity: "O(1) append/pop left", spaceComplexity: "Doubly Linked Blocks" },
            ],
          },
        ],
      },
      {
        title: "Functions, Functional Programming & Generators",
        description: "*args, **kwargs, lambda expressions, map/filter/reduce, closures, decorators, and yield generators for memory-efficient streams.",
        chapters: [
          {
            title: "Functions & Metaprogramming",
            topics: [
              { title: "Python Decorators & Function Wrappers", timeComplexity: "O(1) wrapper dispatch", spaceComplexity: "Closure Scope" },
              { title: "Generators, Iterators & Memory-Efficient Streaming", timeComplexity: "O(1) per yield", spaceComplexity: "O(1) Frame" },
            ],
          },
        ],
      },
      {
        title: "Object-Oriented Python & Dunder Methods",
        description: "Classes, instances, inheritance, Multiple inheritance & MRO (C3 Linearization), @classmethod, @staticmethod, and magic methods.",
        chapters: [
          {
            title: "OOP in Python",
            topics: [
              { title: "Method Resolution Order (MRO) & C3 Linearization", timeComplexity: "Compile-time Class Init", spaceComplexity: "Class Hierarchy" },
              { title: "Python Magic Methods (__init__, __str__, __enter__, __exit__)", timeComplexity: "Direct Protocol", spaceComplexity: "Context Managers" },
            ],
          },
        ],
      },
      {
        title: "Python for Computing: NumPy, Pandas & Async",
        description: "Vectorized arrays with NumPy, Pandas DataFrames, file I/O, multi-threading vs multiprocessing (GIL), and asyncio event loop.",
        chapters: [
          {
            title: "High Performance Python",
            topics: [
              { title: "Global Interpreter Lock (GIL) & Multiprocessing vs Threading", timeComplexity: "CPU vs I/O Bound", spaceComplexity: "Forked Memory" },
              { title: "Vectorized Operations with NumPy & Data Cleaning", timeComplexity: "SIMD C-Speed", spaceComplexity: "Contiguous C-Array" },
            ],
          },
        ],
      },
    ],
  },

  // 12. Java Programming (java)
  {
    id: "java",
    unitsDefinition: [
      {
        title: "Java Fundamentals & JVM Internals",
        description: "JVM, JRE, JDK, bytecode compilation, JIT compiler, ClassLoader subsystem, and Java memory model (Heap, Stack, Metaspace).",
        chapters: [
          {
            title: "JVM Architecture",
            topics: [
              { title: "JVM Architecture: ClassLoader, Execution Engine & JIT", timeComplexity: "HotSpot Optimization", spaceComplexity: "Heap + Metaspace" },
              { title: "Garbage Collection Algorithms (G1, ZGC) & Memory Tuning", timeComplexity: "Low Pause", spaceComplexity: "Generational Heap" },
            ],
          },
        ],
      },
      {
        title: "OOP & Interfaces in Java",
        description: "Inheritance, method overriding vs overloading, abstract classes, functional interfaces, lambda expressions, and records.",
        chapters: [
          {
            title: "Object-Oriented Design",
            topics: [
              { title: "Dynamic Method Dispatch & vtable Internals in Java", timeComplexity: "O(1) dispatch", spaceComplexity: "Class vtable" },
              { title: "Interfaces, Default Methods & Java 17 Records", timeComplexity: "Compile-time Check", spaceComplexity: "Immutable Objects" },
            ],
          },
        ],
      },
      {
        title: "Java Collections Framework",
        description: "ArrayList vs LinkedList, HashMap internals (bucket array + Red-Black tree treeification), HashSet, TreeMap, and ConcurrentHashMap.",
        chapters: [
          {
            title: "Collections & Data Structures",
            topics: [
              { title: "HashMap Internals & Treeification Thresholds", timeComplexity: "O(1) avg / O(log N) tree", spaceComplexity: "Node/TreeNode" },
              { title: "ConcurrentHashMap & Lock Striping / CAS Operations", timeComplexity: "Lock-free Read", spaceComplexity: "Segment / Bin Locks" },
            ],
          },
        ],
      },
      {
        title: "Multithreading & Concurrency Utilities",
        description: "Thread lifecycle, synchronization, volatile keyword, java.util.concurrent (Executors, CountDownLatch, Semaphore), and Virtual Threads.",
        chapters: [
          {
            title: "Java Concurrency",
            topics: [
              { title: "Volatile Keyword & Java Memory Model (Happens-Before)", timeComplexity: "Memory Barrier", spaceComplexity: "CPU Cache Coherence" },
              { title: "Thread Pools (ExecutorService) & Virtual Threads (Project Loom)", timeComplexity: "M:N Scheduling", spaceComplexity: "Carrier Threads" },
            ],
          },
        ],
      },
      {
        title: "Stream API, IO & JDBC Integration",
        description: "Java Stream pipeline (map, filter, reduce), Optional, NIO channel buffers, JDBC database connections, and connection pooling (HikariCP).",
        chapters: [
          {
            title: "Modern Java & IO",
            topics: [
              { title: "Java Stream API & Parallel Streams Performance", timeComplexity: "ForkJoinPool Parallelism", spaceComplexity: "Spliterator" },
              { title: "JDBC Architecture & HikariCP Connection Pooling", timeComplexity: "Reused Connections", spaceComplexity: "Pool Buffer" },
            ],
          },
        ],
      },
    ],
  },

  // 13. C/C++ Systems Programming (cpp)
  {
    id: "cpp",
    unitsDefinition: [
      {
        title: "C Foundations & Low-Level Memory",
        description: "Data types, bitwise operators, control structures, pointers, memory addresses, pointer arithmetic, and void pointers.",
        chapters: [
          {
            title: "Memory & Pointers",
            topics: [
              { title: "Pointer Arithmetic & Memory Address Resolution", timeComplexity: "O(1) hardware add", spaceComplexity: "4/8 bytes" },
              { title: "Stack vs Heap Allocation: malloc, calloc, realloc, free", timeComplexity: "Heap Allocator", spaceComplexity: "Heap Metadata" },
            ],
          },
        ],
      },
      {
        title: "Arrays, Strings & Function Pointers",
        description: "1D/2D arrays as pointers, null-terminated strings, string manipulation functions, function pointers, and callback routines.",
        chapters: [
          {
            title: "Arrays & Callbacks",
            topics: [
              { title: "Function Pointers & Dynamic Callback Systems in C", timeComplexity: "O(1) indirect jump", spaceComplexity: "Address Pointer" },
              { title: "Buffer Overflows & Memory Safety Vulnerabilities", timeComplexity: "Exploit Boundary", spaceComplexity: "Corrupted Stack" },
            ],
          },
        ],
      },
      {
        title: "Structures, Unions & File I/O",
        description: "struct padding & byte alignment, bitfields, unions for type punning, file streams (fopen, fread, fwrite), and preprocessor macros.",
        chapters: [
          {
            title: "Structures & Alignment",
            topics: [
              { title: "Struct Memory Padding & Word Alignment Optimization", timeComplexity: "Hardware Alignment", spaceComplexity: "Packed Bytes" },
              { title: "Unions & Low-Level Hardware Register Access", timeComplexity: "Shared Memory", spaceComplexity: "Max Member Size" },
            ],
          },
        ],
      },
      {
        title: "C++ Core & RAII Paradigm",
        description: "References, const correctness, constructors/destructors, Resource Acquisition Is Initialization (RAII), and smart pointers.",
        chapters: [
          {
            title: "Modern C++ Memory Management",
            topics: [
              { title: "RAII & Smart Pointers (unique_ptr, shared_ptr, weak_ptr)", timeComplexity: "Zero-Cost Abstraction", spaceComplexity: "Control Block" },
              { title: "Move Semantics & Rvalue References (std::move)", timeComplexity: "O(1) resource transfer", spaceComplexity: "Zero Copy" },
            ],
          },
        ],
      },
      {
        title: "C++ STL & Generic Programming",
        description: "Templates, STL containers (vector, list, unordered_map), iterators, lambda expressions, and performance profiling.",
        chapters: [
          {
            title: "STL Containers & Algorithms",
            topics: [
              { title: "std::vector Dynamic Resizing & Amortized Complexity", timeComplexity: "O(1) amortized push", spaceComplexity: "2x Geometric Growth" },
              { title: "Template Metaprogramming & Compile-Time Evaluation", timeComplexity: "Compile-time Execution", spaceComplexity: "Zero Runtime Overhead" },
            ],
          },
        ],
      },
    ],
  },

  // 14. Discrete Mathematics (discrete-math)
  {
    id: "discrete-math",
    unitsDefinition: [
      {
        title: "Set Theory, Relations & Functions",
        description: "Set operations, power sets, Cartesian products, equivalence relations, partial orders (Poset, Hasse diagrams), and bijections.",
        chapters: [
          {
            title: "Sets & Relations",
            topics: [
              { title: "Equivalence Relations, Partitions & Congruence Classes", timeComplexity: "Proof Technique", spaceComplexity: "Disjoint Sets" },
              { title: "Partially Ordered Sets (Poset) & Hasse Diagrams", timeComplexity: "Transitive Reduction", spaceComplexity: "DAG Ordering" },
            ],
          },
        ],
      },
      {
        title: "Propositional & Predicate Logic",
        description: "Logical connectives, truth tables, tautologies, normal forms (CNF, DNF), quantifiers (universal, existential), and rules of inference.",
        chapters: [
          {
            title: "Mathematical Logic",
            topics: [
              { title: "Propositional Logic: Tautologies, Fallacies & Truth Tables", timeComplexity: "O(2^N) evaluations", spaceComplexity: "Truth Table" },
              { title: "Predicate Logic & First-Order Quantifiers (Universal / Existential)", timeComplexity: "Expressive Logic", spaceComplexity: "Domain Universe" },
            ],
          },
        ],
      },
      {
        title: "Combinatorics & Counting Principles",
        description: "Pigeonhole principle, permutations and combinations, binomial coefficients, Pascal's triangle, and Principle of Inclusion-Exclusion.",
        chapters: [
          {
            title: "Counting & Probabilities",
            topics: [
              { title: "Pigeonhole Principle & Non-Intuitive Existence Proofs", timeComplexity: "Floor((N-1)/K) + 1", spaceComplexity: "Partition Buckets" },
              { title: "Principle of Inclusion-Exclusion (PIE) for Set Cardinalities", timeComplexity: "O(2^N) terms", spaceComplexity: "Alternating Sums" },
            ],
          },
        ],
      },
      {
        title: "Recurrence Relations & Generating Functions",
        description: "Homogeneous and non-homogeneous linear recurrences, characteristic equation method, and generating function transformations.",
        chapters: [
          {
            title: "Recurrences",
            topics: [
              { title: "Solving Linear Homogeneous Recurrences via Characteristic Roots", timeComplexity: "O(Degree^3)", spaceComplexity: "Closed Form Formula" },
              { title: "Generating Functions for Counting Sequences", timeComplexity: "Algebraic Power Series", spaceComplexity: "Polynomial Coefficients" },
            ],
          },
        ],
      },
      {
        title: "Graph Theory Fundamentals",
        description: "Graphs, subgraphs, Euler and Hamiltonian paths, planar graphs, Kuratowski's theorem, vertex coloring, and chromatic number.",
        chapters: [
          {
            title: "Graphs & Trees",
            topics: [
              { title: "Eulerian & Hamiltonian Circuits: Handshaking Lemma & Dirac's Theorem", timeComplexity: "O(V + E) for Euler", spaceComplexity: "Adjacency List" },
              { title: "Planar Graphs & Euler's Formula (V - E + F = 2)", timeComplexity: "Kuratowski K5/K3,3", spaceComplexity: "Planar Embeddings" },
            ],
          },
        ],
      },
    ],
  },

  // 15. Engineering Mathematics (engg-math)
  {
    id: "engg-math",
    unitsDefinition: [
      {
        title: "Matrices & Linear Algebra",
        description: "Rank of a matrix, Gaussian elimination, eigenvalues, eigenvectors, Cayley-Hamilton theorem, and singular value decomposition.",
        chapters: [
          {
            title: "Matrix Systems",
            topics: [
              { title: "Eigenvalues, Eigenvectors & Diagonalization", timeComplexity: "O(N^3) characteristic eq", spaceComplexity: "Eigenspaces" },
              { title: "Cayley-Hamilton Theorem & Matrix Inverse Computation", timeComplexity: "Characteristic Polynomial", spaceComplexity: "Matrix Powers" },
            ],
          },
        ],
      },
      {
        title: "Differential Calculus",
        description: "Rolle's theorem, Mean Value Theorem, Taylor and Maclaurin series expansion, partial derivatives, and maxima/minima.",
        chapters: [
          {
            title: "Calculus Optimization",
            topics: [
              { title: "Partial Derivatives & Gradient Vectors in Multi-Dimensional Spaces", timeComplexity: "Analytic Gradient", spaceComplexity: "Jacobian Matrix" },
              { title: "Lagrange Multipliers for Constrained Optimization", timeComplexity: "System of Equations", spaceComplexity: "Lagrangian Form" },
            ],
          },
        ],
      },
      {
        title: "Integral Calculus & Vector Spaces",
        description: "Double and triple integrals, change of order of integration, line integrals, Green's theorem, Stokes' theorem, and divergence theorem.",
        chapters: [
          {
            title: "Vector Calculus",
            topics: [
              { title: "Double & Triple Integrals with Coordinate Transformations", timeComplexity: "Riemann Sum Limit", spaceComplexity: "Area Elements" },
              { title: "Gradient, Divergence & Curl (Vector Differential Operators)", timeComplexity: "Del Operator", spaceComplexity: "Vector Fields" },
            ],
          },
        ],
      },
      {
        title: "Differential Equations",
        description: "First-order exact differential equations, higher-order linear differential equations with constant coefficients, and variation of parameters.",
        chapters: [
          {
            title: "Differential Equations",
            topics: [
              { title: "Higher-Order Linear Differential Equations with Constant Coefficients", timeComplexity: "Complementary + PI", spaceComplexity: "Function Basis" },
              { title: "Euler-Cauchy Equations & Method of Variation of Parameters", timeComplexity: "Wronskian Determinant", spaceComplexity: "Integral Solution" },
            ],
          },
        ],
      },
      {
        title: "Probability & Statistics for CS",
        description: "Random variables, probability density functions, Binomial, Poisson, and Normal distributions, and Central Limit Theorem.",
        chapters: [
          {
            title: "Probability Distributions",
            topics: [
              { title: "Probability Distributions: Binomial, Poisson & Gaussian Normal", timeComplexity: "PDF / CDF Evaluation", spaceComplexity: "Distribution Moments" },
              { title: "Central Limit Theorem & Hypothesis Testing for CS Experiments", timeComplexity: "Sample Mean Convergence", spaceComplexity: "Z / T Statistics" },
            ],
          },
        ],
      },
    ],
  },
];
