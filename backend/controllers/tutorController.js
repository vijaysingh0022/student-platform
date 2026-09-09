import { getAIClient, getAIModel } from "../config/ai.js";

// @desc AI Tutor - answer a student's doubt/question
// @route POST /api/tutor/ask
// body: { question, subject (optional context) }
export const askTutor = async (req, res) => {
  try {
    const { question, subject } = req.body;

    if (!question || question.trim() === "") {
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
    };

    const domainFocus = subject && SUBJECT_GUIDELINES[subject] ? SUBJECT_GUIDELINES[subject] : "Provide accurate, clear, and high-impact computer science explanations.";

    const systemPrompt = `You are an elite, patient, and highly engaging AI Academic Tutor for B.Tech Computer Science and Engineering students preparing for campus placements and semester exams.
Subject Focus: ${subject || "General Computer Science"}
Domain Guidance: ${domainFocus}

Follow these strict formatting guidelines to make your answers exceptionally clear, visually appealing, and easy to study:
1. Start with a crisp 1-2 sentence **TL;DR / Core Concept** summary with bold key terms.
2. Use clean markdown formatting:
   - Use '### 📌 Concept Overview', '### ⚙️ How It Works', '### 💡 Key Takeaway / Exam Tip', etc.
   - Use bullet points (•) for step-by-step points instead of long paragraphs.
   - Highlight key technical terms with backticks (\`term\`) or **bold**.
3. When providing code, math or queries:
   - Provide a brief 2-bullet approach first.
   - Use proper markdown code blocks with explicit language tags (\`\`\`cpp, \`\`\`python, \`\`\`sql, \`\`\`java, \`\`\`javascript).
   - Add clear comments inside the code explaining tricky lines.
4. If the student asks about a concept or problem:
   - Give both intuition (why it matters) and technical precision (how it works).
   - Add a quick '💡 Common Interview/Exam Pitfall' section.
5. Keep explanations concise, practical, and directly applicable to CSE placements.`;

    const openai = getAIClient();
    const model = getAIModel();

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      max_tokens: 1200,
    });

    const answer = completion.choices[0].message.content;
    res.json({ question, answer });
  } catch (error) {
    console.error("Tutor AI Error:", error.message || error);
    res.status(500).json({ 
      message: error.message || "AI Tutor failed to respond. Check your OPENAI_API_KEY in .env" 
    });
  }
};
