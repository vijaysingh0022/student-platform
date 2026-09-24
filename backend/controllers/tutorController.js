import { getAIClient, getAIModel } from "../config/ai.js";
import TopicProgress from "../models/TopicProgress.js";
import User from "../models/User.js";
import { Topic, Subject } from "../models/Curriculum.js";

// @desc AI Tutor - answer a student's doubt/question with context
// @route POST /api/tutor/ask
// body: { question, subject, topic, history }
export const askTutor = async (req, res) => {
  try {
    const { question, subject, topic, history = [] } = req.body;
    const userId = req.user?._id;

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
      MACHINE_LEARNING: "Focus on Supervised vs Unsupervised Learning, Linear/Logistic Regression math, Bias-Variance Trade-off, Decision Trees & Random Forests, Neural Network backpropagation, CNN/RNN architectures, model evaluation metrics (Precision/Recall/F1/AUC-ROC), and practical Python (scikit-learn/TensorFlow/PyTorch) implementations.",
    };

    const domainFocus = subject && SUBJECT_GUIDELINES[subject] ? SUBJECT_GUIDELINES[subject] : "Provide accurate, clear, and high-impact computer science explanations.";

    // 1. Fetch Student Context if logged in
    let studentContextStr = "Student Context: Anonymous Student.";
    if (userId) {
      const [user, progressList] = await Promise.all([
        User.findById(userId).lean(),
        TopicProgress.find({ user: userId }).lean()
      ]);

      if (user) {
        const completedCount = progressList.filter(p => p.isCompleted).length;
        const weakTopics = progressList.filter(p => p.masteryStatus === "weak").map(p => p.topicId);
        
        studentContextStr = `Student Context:
- Target Role/Goal: ${user.targetRole || "Software Engineer"}
- Completed Topics: ${completedCount}
- Weak Topics/Concepts: ${weakTopics.length > 0 ? weakTopics.slice(0, 5).join(", ") : "None detected"}
- Current Focus: Subject: ${subject || "General"}, Topic: ${topic || "General"}
`;
      }
    }

    const systemPrompt = `You are an elite, patient, and highly engaging AI Personal CSE Mentor for B.Tech Computer Science and Engineering students.
You MUST NOT behave like a generic chatbot. You are a mentor who knows the student's progress.

${studentContextStr}
Domain Guidance: ${domainFocus}

Follow these strict guidelines:
1. ALWAYS acknowledge the student's context if relevant. E.g., if they ask about a topic they are weak in, say "I noticed you are currently weak in... Let's break it down."
2. Structure your answers in clear steps when explaining a concept. E.g.:
   Step 1 — Concept
   Step 2 — Visual Example
   Step 3 — Dry Run
   Step 4 — Code
   Step 5 — Practice
3. Keep formatting clean with markdown. Use \`term\` or **bold** for key concepts. Provide syntax highlighted code blocks.
4. Keep explanations concise, practical, and directly applicable to placements. Do not output walls of text. Use bullet points.`;

    const openai = getAIClient();
    const model = getAIModel();

    // Map history to OpenAI format
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.text
    })).slice(-5); // Keep last 5 messages for context

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...formattedHistory,
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
