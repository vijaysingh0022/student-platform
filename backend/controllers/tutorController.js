import { getAIClient, getAIModel } from "../config/ai.js";
import TopicProgress from "../models/TopicProgress.js";
import User from "../models/User.js";
import PlacementPrediction from "../models/PlacementPrediction.js";
import { getIntelligentTutorResponse } from "./tutorKnowledgeBase.js";

// Standard CSE knowledge base fallback generator for high reliability
const generateStructuredFallback = (question, subject = "General", action = "explain", isHinglish = false) => {
  const qLower = question.toLowerCase();

  let tldr = "Core computer science concept essential for technical evaluations.";
  let simpleExp = "This concept is a foundational building block in modern software engineering and systems architecture.";
  let example = "Consider an e-commerce platform handling thousands of simultaneous order transactions.";
  let stepByStep = "1. Initialize resources\n2. Execute state transformation\n3. Verify consistency\n4. Commit updates";
  let mistakes = "Failing to account for edge cases, null references, and unbounded memory growth.";
  let quickCheck = "What is the time complexity difference between average and worst case?";

  if (qLower.includes("join") || qLower.includes("sql")) {
    tldr = "SQL JOINs combine rows from two or more tables based on a related common column.";
    simpleExp = isHinglish
      ? "JOIN ka matlab hai do alag tables ke data ko common column ke through ek saath jodna. INNER JOIN sirf wahi rows lata hai jo dono tables me match karti hain, jabki LEFT JOIN left table ki saari rows lata hai chahe right table me match ho ya na ho."
      : "SQL JOINs allow relational databases to query data normalized across separate tables. INNER JOIN extracts rows with matching keys in both tables, whereas LEFT JOIN preserves every row from the left table regardless of right-table matches.";
    example = "Imagine a 'Customers' table and an 'Orders' table linked by CustomerID. An INNER JOIN gives only customers who made orders; a LEFT JOIN gives all customers, including those with zero orders.";
    stepByStep = "```sql\n-- INNER JOIN: Only customers with active orders\nSELECT C.Name, O.OrderDate, O.Amount\nFROM Customers C\nINNER JOIN Orders O ON C.CustomerID = O.CustomerID;\n\n-- LEFT JOIN: All customers, NULL if no orders\nSELECT C.Name, O.OrderID\nFROM Customers C\nLEFT JOIN Orders O ON C.CustomerID = O.CustomerID;\n```";
    mistakes = "1. Forgetting ON clause causing an accidental Cartesian Product (CROSS JOIN).\n2. Using WHERE on the right table in a LEFT JOIN, which converts it back to an INNER JOIN.\n3. Missing index on the foreign key column causing full table scans.";
    quickCheck = "If Table A has 5 rows and Table B has 0 rows, how many rows are returned by `SELECT * FROM A LEFT JOIN B ON A.id = B.id`?";
  } else if (qLower.includes("deadlock") || qLower.includes("banker")) {
    tldr = "A Deadlock occurs when processes are blocked forever because each holds a resource and waits for another held by another process.";
    simpleExp = isHinglish
      ? "Deadlock ek aisi sthiti hai jahan do ya zyada processes ek dusre ke resources ka wait kar rahe hote hain aur koi bhi aage nahi badh sakta. Ise prevent karne ke 4 conditions (Coffman conditions) me se kisi ek ko todna hota hai."
      : "Deadlock is an operating system state where a set of concurrent processes are permanently blocked because each process holds resources needed by others while waiting for resources held by those same processes.";
    example = "Two cars driving toward each other on a narrow one-lane bridge. Neither car can move forward until the other reverses.";
    stepByStep = "Four Coffman Conditions required for deadlock:\n1. **Mutual Exclusion**: Resources cannot be shared simultaneously.\n2. **Hold and Wait**: Process holds ≥1 resource while waiting for others.\n3. **No Preemption**: Resources cannot be forcibly taken away.\n4. **Circular Wait**: P0 waits for P1, P1 waits for P2 ... Pn waits for P0.";
    mistakes = "1. Confusing Deadlock with Starvation (starvation means a process waits indefinitely due to low priority, but the system continues making progress).\n2. Assuming Banker's Algorithm prevents deadlocks at zero CPU cost (it requires prior knowledge of maximum resource claims).";
    quickCheck = "Can deadlock occur if resources are fully preemptible? (Answer: No, because preemption breaks the No Preemption condition).";
  } else if (qLower.includes("tree") || qLower.includes("bst") || qLower.includes("traversal")) {
    tldr = "Binary Search Trees (BST) maintain Left < Root < Right order, enabling O(log N) search.";
    simpleExp = isHinglish
      ? "BST ek binary tree hai jisme root ke left side wale saare nodes chhote hote hain aur right side wale nodes bade hote hain. In-order traversal karne par hamesha sorted ascending order milta hai."
      : "A Binary Search Tree is a hierarchical node structure where every node's left subtree contains values strictly smaller, and the right subtree contains values strictly larger. An In-Order traversal naturally yields keys in sorted order.";
    example = "A dictionary lookup where looking at the middle entry immediately tells you whether to search in the left half or right half.";
    stepByStep = "```cpp\n// In-order traversal (Left -> Root -> Right)\nvoid inOrder(Node* root) {\n    if (root == nullptr) return;\n    inOrder(root->left);\n    cout << root->val << \" \"; // Outputs sorted sequence\n    inOrder(root->right);\n}\n```";
    mistakes = "1. Forgetting to balance the tree, causing it to degrade into a linked list with O(N) worst-case time complexity.\n2. Incomplete pointer updates during node deletion with two children.";
    quickCheck = "Which traversal order yields sorted output for any valid BST? (Answer: In-order traversal).";
  }

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
};

// @desc AI Tutor - answer a student's doubt/question with rich context
// @route POST /api/tutor/ask
// body: { question, subject, topic, history, action, isHinglish }
export const askTutor = async (req, res) => {
  try {
    const { subject, topic, history = [], action = "explain" } = req.body;
    const question = req.body.question || req.body.message || req.body.prompt;
    const isHinglish = Boolean(req.body.isHinglish || req.body.hinglish);
    const userId = req.user?._id;

    if (!question || typeof question !== "string" || question.trim() === "") {
      return res.status(400).json({ message: "Question is required" });
    }

    const SUBJECT_GUIDELINES = {
      DSA: "Focus on Time & Space complexity (Big-O), edge cases, dry-run trace, and optimized C++/Java/Python code solutions.",
      DBMS: "Focus on Relational schema, Normalization steps (1NF to BCNF), SQL queries with syntax, Indexing mechanics, and ACID guarantees.",
      OS: "Focus on Process states, CPU scheduling math, Synchronization primitives (Mutex/Semaphores), Banker's algorithm safe sequence, and Virtual Memory paging.",
      CN: "Focus on OSI & TCP/IP layers, Packet headers, TCP 3-Way Handshake step-by-step flow, CIDR subnetting math, and application protocols (HTTP/HTTPS/DNS).",
      OOPS: "Focus on OOP pillars (Encapsulation, Abstraction, Inheritance, Polymorphism), vtable/vptr runtime internals, SOLID principles with code refactoring, and Design Patterns.",
      SYSTEM_DESIGN: "Focus on High-Level Architecture (HLD), Load balancing, Caching (Redis/Memcached), CAP theorem trade-offs, Database Sharding, and Message Queues (Kafka/RabbitMQ).",
      APTITUDE: "Focus on Quantitative Aptitude shortcut tricks, Speed-Math formulas, step-by-step calculation breakdown, and common campus OA test patterns.",
      WEB_DEV: "Focus on Modern Full-Stack Web Development, JavaScript Event Loop & Async Microtasks, RESTful API design & Idempotency, JWT security, and Docker/DevOps containerization.",
      MACHINE_LEARNING: "Focus on Supervised vs Unsupervised Learning, Bias-Variance, Loss functions, and neural network math.",
    };

    const domainFocus = subject && SUBJECT_GUIDELINES[subject] ? SUBJECT_GUIDELINES[subject] : "Provide accurate, clear, and high-impact computer science explanations.";

    // 1. Fetch Student Context if logged in
    let studentContextStr = "Student Context: CSE Student Scholar.";
    if (userId) {
      try {
        const [user, progressList, placementDoc] = await Promise.all([
          User.findById(userId).lean(),
          TopicProgress.find({ user: userId }).lean(),
          PlacementPrediction.findOne({ user: userId }).lean(),
        ]);

        if (user) {
          const completedCount = progressList ? progressList.filter((p) => p.isCompleted).length : 0;
          const weakTopics = progressList ? progressList.filter((p) => p.masteryStatus === "weak").map((p) => p.topicId) : [];

          studentContextStr = `Student Context:
- Target Role/Goal: ${user.targetRole || "Software Engineer"}
- ML Placement Readiness Score: ${placementDoc?.readinessScore ?? 68}/100 (${placementDoc?.readinessTier ?? "Developing"})
- Key Strengths: ${placementDoc?.strengths?.map((s) => s.name).join(", ") || "Foundations"}
- Completed Topics Count: ${completedCount}
- Weak Topics Flagged: ${weakTopics.length > 0 ? weakTopics.slice(0, 4).join(", ") : "None detected yet"}
- Current Focus: Subject: ${subject || "General"}, Topic: ${topic || "General"}
`;
        }
      } catch (ctxErr) {
        console.warn("Student context retrieval warning:", ctxErr.message);
      }
    }

    const languageInstruction = isHinglish
      ? "Use clear, friendly, and natural Hinglish (Hindi + English terminology commonly used in Indian engineering colleges) to explain intuitive mental models."
      : "Use clear, professional English with precise engineering terminology.";

    const actionInstruction = (() => {
      switch (action) {
        case "explain":
          return "Focus on explaining the underlying concept intuitively without overwhelming boilerplate.";
        case "example":
          return "Provide a vivid real-life engineering analogy and practical scenario.";
        case "code":
          return "Provide syntax-highlighted code in C++, Java, and Python with detailed line-by-line commentary and Big-O analysis.";
        case "quiz":
          return "Provide a short 3-question diagnostic quiz with multiple choices and instant answer keys.";
        case "exam":
          return "Format as a university semester 10-mark model answer with diagrams, structured bullet points, and key definitions.";
        case "mistakes":
          return "Focus specifically on the top 3 traps, syntax bugs, and common misconceptions that cost students marks or placement offers.";
        default:
          return "Provide a balanced, structured academic and placement explanation.";
      }
    })();

    const systemPrompt = `You are an elite, patient, and engaging Personal AI CSE Mentor for LearnX.
You MUST NOT behave like a generic chatbot. You are a mentor who understands the student's progress.

${studentContextStr}
Domain Focus: ${domainFocus}
Language Mode: ${languageInstruction}
Mode Objective: ${actionInstruction}

MANDATORY RESPONSE FORMAT:
Always format your response using this exact 6-part structure:
### 📌 TL;DR
[One to two sentences summarizing the exact answer]

### 💡 Simple Explanation
[Clear conceptual explanation with intuitive mental model]

### 🌍 Real-Life Example & Analogy
[Vivid system or daily-life analogy]

### 🪜 Step-by-Step Breakdown / Code
[Numbered steps or syntax-highlighted code snippet]

### ⚠️ Common Mistakes & Pitfalls
[The top traps students or interviewees make]

### ❓ Quick Check Question
[A quick question with hidden answer to test understanding]`;

    try {
      const openai = getAIClient();
      const model = getAIModel();

      // Guard: If no AI client is available (missing API key), skip to fallback
      if (!openai) {
        console.warn("AI client unavailable (no API key configured). Using knowledge base fallback.");
        throw new Error("AI client not configured");
      }

      const formattedHistory = history.map((msg) => ({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.text,
      })).slice(-5);

      let completion;
      try {
        completion = await openai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            ...formattedHistory,
            { role: "user", content: question },
          ],
          max_tokens: 1024,
          temperature: 0.3,
        });
      } catch (firstErr) {
        console.warn("AI Tutor primary call error:", firstErr.status, firstErr.message);
        // Retry on credit issues (402), model-not-found (404), or rate limits (429)
        if (firstErr.status === 402 || firstErr.status === 404 || firstErr.status === 429 ||
            firstErr.message?.includes("credits") || firstErr.message?.includes("max_tokens") ||
            firstErr.message?.includes("not available") || firstErr.message?.includes("no longer")) {
          try {
            // Retry with minimal context and reduced tokens
            completion = await openai.chat.completions.create({
              model,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: question },
              ],
              max_tokens: 512,
              temperature: 0.3,
            });
          } catch (retryErr) {
            console.warn("AI Tutor retry also failed:", retryErr.message);
            throw retryErr;
          }
        } else {
          throw firstErr;
        }
      }

      const answer = completion?.choices?.[0]?.message?.content;
      if (answer && answer.trim().length > 20) {
        return res.json({ question, answer });
      }
    } catch (llmErr) {
      console.warn("LLM direct call notice (activating calibrated knowledge base):", llmErr.message);
    }

    // High quality intelligent knowledge base fallback tailored to the question
    const answer = await getIntelligentTutorResponse(question, subject, action, isHinglish);
    res.json({ question, answer });
  } catch (error) {
    console.error("Tutor AI Error:", error.message || error);
    const answer = await getIntelligentTutorResponse(
      req.body?.question || "Question",
      req.body?.subject,
      req.body?.action,
      req.body?.isHinglish
    );
    res.json({
      question: req.body?.question || "Question",
      answer,
    });
  }
};
