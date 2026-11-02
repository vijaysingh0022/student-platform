import ExamInterviewSession from "../models/ExamInterviewSession.js";
import TopicProgress from "../models/TopicProgress.js";
import ExamMistake from "../models/ExamMistake.js";
import { getAIClient, getAIModel } from "../config/ai.js";

// ============================================================================
// Curated Real Question Banks for CSE Domains as Robust AI Fallback
// ============================================================================
const CSE_INTERVIEW_BANKS = {
  "Computer Networks": [
    {
      q: "Suppose you are given the IP address 192.168.10.35/27. Can you tell me the subnet mask in dotted-decimal notation, and explain how many usable host addresses exist in this subnet?",
      subtopic: "IP Subnetting & CIDR",
      keyConcepts: ["255.255.255.224", "30 usable hosts", "32-27=5 host bits", "2^5 - 2 = 30"],
    },
    {
      q: "Explain what happens during the TCP Three-Way Handshake step-by-step. Specifically, why do both client and server exchange Initial Sequence Numbers (ISNs)?",
      subtopic: "Transport Layer Protocols",
      keyConcepts: ["SYN", "SYN-ACK", "ACK", "Sequence Number synchronization", "Protection against delayed segments"],
    },
    {
      q: "What is the key functional difference between a Router operating at Layer 3 and a Switch operating at Layer 2 regarding broadcast domains and collision domains?",
      subtopic: "Network Layer & Hardware",
      keyConcepts: ["Router breaks broadcast domains", "Switch breaks collision domains", "MAC table vs Routing table"],
    },
    {
      q: "How does DNS resolution work when a client types a URL for the first time? Walk through Root, TLD, and Authoritative DNS servers.",
      subtopic: "Application Layer & DNS",
      keyConcepts: ["Local DNS resolver cache", "Root DNS .", "TLD .com", "Authoritative DNS record"],
    },
    {
      q: "Compare TCP Reno Congestion Control mechanisms: Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery. What triggers the transition from exponential to linear growth?",
      subtopic: "Congestion Control",
      keyConcepts: ["ssthresh", "CWND", "Triple Duplicate ACK", "Timeout resets cwnd to 1"],
    },
  ],
  "Operating Systems": [
    {
      q: "What is the fundamental difference between a Process and a Thread in terms of memory layout, virtual address space, and kernel context-switch overhead?",
      subtopic: "Processes & Concurrency",
      keyConcepts: ["Shared heap and data segment", "Independent stack & registers", "MMU page table switch cost"],
    },
    {
      q: "Explain the four Coffman conditions necessary for a Deadlock to occur. How does the Banker's Algorithm ensure a system stays in a Safe State?",
      subtopic: "Deadlocks & Resource Allocation",
      keyConcepts: ["Mutual Exclusion", "Hold and Wait", "No Preemption", "Circular Wait", "Safe sequence vector"],
    },
    {
      q: "How does Virtual Memory Paging work? Walk me through what happens hardware-wise and OS-wise when a Page Fault interrupt occurs.",
      subtopic: "Memory Management & Paging",
      keyConcepts: ["Page table lookup", "Valid/invalid bit", "TLB miss", "Disk I/O frame swap", "Page replacement policy"],
    },
    {
      q: "Compare Preemptive Shortest Remaining Time First (SRTF) with Round Robin (RR) scheduling. How does quantum size affect turnaround time and context-switch thrashing in RR?",
      subtopic: "CPU Scheduling",
      keyConcepts: ["Convoy effect", "Quantum trade-off", "Response time vs throughput"],
    },
  ],
  "Database Management Systems": [
    {
      q: "Explain the difference between 2NF and 3NF with a practical relation example. Why does 3NF eliminate transitive functional dependencies?",
      subtopic: "Normalization",
      keyConcepts: ["Partial dependency", "Candidate key", "Transitive dependency X -> Y and Y -> Z", "Lossless join decomposition"],
    },
    {
      q: "Walk through the ACID properties of database transactions. How does Write-Ahead Logging (WAL) guarantee Atomicity and Durability during sudden crash?",
      subtopic: "Transactions & ACID",
      keyConcepts: ["Atomicity", "Consistency", "Isolation levels", "Durability", "WAL log buffer flushes before dirty pages"],
    },
    {
      q: "Why are B+ Trees preferred over Binary Search Trees or Hash Indexes for relational database primary/secondary indexes?",
      subtopic: "Indexing & B+ Trees",
      keyConcepts: ["High fanout / low tree height", "Sequential range scan via leaf node linked list", "Disk block block I/O efficiency"],
    },
  ],
  "Data Structures & Algorithms": [
    {
      q: "Given an unsorted array, how would you find the k-th smallest element in optimal average O(n) time without sorting the full array? Explain the QuickSelect partitioning invariant.",
      subtopic: "Arrays & Partitioning",
      keyConcepts: ["QuickSelect", "Pivot placement", "Divide and conquer", "O(n) average vs O(n^2) worst"],
    },
    {
      q: "Explain the core mechanics of Dijkstra's Shortest Path algorithm. Why does Dijkstra fail or enter infinite loops when negative edge weights are present?",
      subtopic: "Graph Algorithms",
      keyConcepts: ["Greedy relaxation", "Min-heap priority queue", "Assumption that once visited path cannot shrink", "Bellman-Ford needed for negative edges"],
    },
    {
      q: "Walk through Dynamic Programming Memoization (top-down) versus Tabulation (bottom-up). How do you optimize the space complexity of Fibonacci or 0/1 Knapsack from O(n) to O(1) or O(W)?",
      subtopic: "Dynamic Programming",
      keyConcepts: ["Overlapping subproblems", "Optimal substructure", "Rolling state array", "Previous row dependency"],
    },
  ],
};

// ============================================================================
// 1. START AI INTERVIEW SESSION
// @route POST /api/exam-prep/copilot/interview/start
// ============================================================================
export const startExamInterview = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const {
      subject = "Computer Networks",
      subjectId = "cn",
      topic = "IP Subnetting & CIDR",
      topicId = "subnetting",
      difficulty = "Intermediate",
      interviewType = "Technical Interview",
      totalQuestions = 5,
      language = "English",
      durationMinutes = 15,
    } = req.body;

    const count = Math.min(Math.max(parseInt(totalQuestions, 10) || 5, 3), 10);
    const bank = CSE_INTERVIEW_BANKS[subject] || CSE_INTERVIEW_BANKS["Computer Networks"];

    let generatedQuestions = [];
    const openai = getAIClient();

    if (openai && process.env.OPENAI_API_KEY) {
      try {
        const prompt = `You are a Senior Principal Technical Interviewer & University Examiner conducting a high-stakes ${interviewType} for a Computer Science student.
Subject: "${subject}"
Topic: "${topic}"
Difficulty: "${difficulty}"
Language: "${language}"

Generate exactly ${count} deep, progressive technical interview questions.
Requirements:
1. Questions must start foundational, then increase in conceptual depth and real-world system mechanics.
2. Formatted as realistic spoken interview questions (clear, concise, natural phrasing).
3. Cover exact engineering mechanics (no multiple-choice, open-ended conceptual reasoning).

Respond ONLY with valid JSON:
{
  "questions": [
    {
      "questionText": "exact interview prompt spoken by examiner",
      "subtopic": "specific subtopic",
      "difficulty": "Easy" | "Medium" | "Hard"
    }
  ]
}`;

        const completion = await openai.chat.completions.create({
          model: getAIModel() || "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a JSON-only technical interview generation system." },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
          max_tokens: 1200,
        });

        const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
        if (Array.isArray(parsed.questions) && parsed.questions.length >= 3) {
          generatedQuestions = parsed.questions.slice(0, count);
        }
      } catch (aiErr) {
        console.warn("AI Question Generation Fallback triggered:", aiErr.message);
      }
    }

    // Reliable fallback if LLM offline
    if (generatedQuestions.length === 0) {
      generatedQuestions = bank.slice(0, count).map((item, idx) => ({
        questionText: item.q,
        subtopic: item.subtopic,
        difficulty: idx === 0 ? "Easy" : idx < count - 1 ? "Medium" : "Hard",
      }));
    }

    const turns = generatedQuestions.map((q, idx) => ({
      turnNumber: idx + 1,
      questionId: `turn-${idx + 1}-${Date.now()}`,
      questionText: q.questionText,
      subtopic: q.subtopic || topic,
      difficulty: q.difficulty || difficulty,
      studentAnswer: "",
      answerType: "text",
      timeTakenSeconds: 0,
      evaluation: {
        status: "unanswered",
        score: 0,
        examinerReaction: "",
        critique: "",
        conceptGapIdentified: "",
        isWeakness: false,
      },
      teachingIntervention: {
        needed: false,
        microLesson: "",
        retestQuestion: "",
        retestAnswer: "",
        retestResolved: false,
      },
      followUp: {
        questionText: "",
        studentAnswer: "",
        evaluation: "",
        score: 0,
      },
    }));

    const session = await ExamInterviewSession.create({
      user: userId,
      subject,
      subjectId,
      topic,
      topicId,
      difficulty,
      interviewType,
      totalQuestions: turns.length,
      language,
      durationMinutes,
      status: "in-progress",
      currentTurnIndex: 0,
      turns,
    });

    res.status(201).json({
      success: true,
      session,
      currentTurn: turns[0],
    });
  } catch (err) {
    console.error("startExamInterview error:", err);
    res.status(500).json({ message: "Failed to initialize interview session." });
  }
};

// ============================================================================
// 2. SUBMIT ANSWER & REAL-TIME EVALUATE / SOCRATIC FOLLOW-UP
// @route POST /api/exam-prep/copilot/interview/:sessionId/evaluate-turn
// ============================================================================
export const evaluateInterviewTurn = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const {
      turnIndex = 0,
      studentAnswer = "",
      answerType = "voice", // 'voice' | 'text'
      timeTakenSeconds = 15,
    } = req.body;

    const session = await ExamInterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Interview session not found." });
    }

    const turn = session.turns[turnIndex];
    if (!turn) {
      return res.status(404).json({ message: "Invalid question turn index." });
    }

    turn.studentAnswer = studentAnswer.trim();
    turn.answerType = answerType;
    turn.timeTakenSeconds = timeTakenSeconds;

    const words = turn.studentAnswer.split(/\s+/).filter(Boolean).length;
    const isHindiOrHinglish = session.language === "Hindi" || session.language === "Hinglish";

    // Call Real Examiner LLM
    const openai = getAIClient();
    let evaluationData = null;

    if (openai && process.env.OPENAI_API_KEY && words > 0) {
      try {
        const prompt = `You are a real-life Technical Examiner & Viva Professor conducting a live ${session.interviewType} in Computer Science.
Subject: ${session.subject}
Topic: ${session.topic}
Question Asked: "${turn.questionText}"
Student's Spoken/Written Answer: "${turn.studentAnswer}"
Language Mode: ${session.language}

Evaluate the student like an authentic, supportive but rigorous teacher sitting directly in front of them:
1. Determine correctness status: "correct" | "partially_correct" | "incorrect".
2. Assign conceptual accuracy score (0-100).
3. "examinerReaction": A natural conversational phrase spoken directly by the examiner.
   - If correct: "Good. Now let's go one step further...", "Exactly right. That demonstrates solid fundamentals."
   - If partially correct: "That's partially correct. Can you explain why...", "You got the core number right, but overlooked the boundary."
   - If incorrect: "Not quite. Think about how the mask bits divide the network...", "Let's pause. That misses the core invariant."
   (If language is Hindi/Hinglish, write this natural conversational sentence in smooth Hinglish!)
4. "critique": 2 concise sentences pinpointing what was precise vs what was imprecise or omitted.
5. "conceptGapIdentified": Key missing concept (e.g. "CIDR boundary calculation", "Host bit reserve rule").
6. "isWeakness": boolean (true if score < 65).
7. "needsTeaching": boolean (true if student is incorrect or significantly confused).
8. "microLesson": If needsTeaching is true, a 3-sentence clear pedagogical breakdown showing the mental model or formula clearly.
9. "followUpQuestion": A sharp, contextual follow-up question digging one level deeper into trade-offs, edge cases, or proof of understanding.

Respond ONLY with valid JSON:
{
  "status": "correct" | "partially_correct" | "incorrect",
  "score": 85,
  "examinerReaction": "Good. Now let's go one step further...",
  "critique": "You identified the /27 subnet mask correctly. You also correctly calculated the 32 total block size.",
  "conceptGapIdentified": "",
  "isWeakness": false,
  "needsTeaching": false,
  "microLesson": "",
  "followUpQuestion": "Now, what is the network address and directed broadcast address for this specific block?"
}`;

        const completion = await openai.chat.completions.create({
          model: getAIModel() || "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a JSON-only interactive viva examiner." },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
          max_tokens: 800,
        });

        evaluationData = JSON.parse(completion.choices[0]?.message?.content || "{}");
      } catch (err) {
        console.warn("AI Turn Evaluation Fallback triggered:", err.message);
      }
    }

    // Heuristic Fallback Engine
    if (!evaluationData) {
      if (words === 0) {
        evaluationData = {
          status: "incorrect",
          score: 10,
          examinerReaction: isHindiOrHinglish
            ? "Koi baat nahi, try karna zaroori hai. Chalo main explain karta hoon."
            : "No problem. Let's break this down together so you understand it clearly.",
          critique: "The question was passed without conceptual elaboration.",
          conceptGapIdentified: turn.subtopic,
          isWeakness: true,
          needsTeaching: true,
          microLesson: `For ${turn.subtopic}, always start by identifying the governing invariant, bitmask division, or base-case condition.`,
          followUpQuestion: `Can you define the foundational purpose of ${turn.subtopic} in simple words?`,
        };
      } else {
        const estScore = Math.min(Math.max(words * 4.5, 45), 90);
        const isPart = estScore >= 60 && estScore < 80;
        const isCorr = estScore >= 80;

        evaluationData = {
          status: isCorr ? "correct" : isPart ? "partially_correct" : "incorrect",
          score: Math.round(estScore),
          examinerReaction: isCorr
            ? (isHindiOrHinglish ? "Bahut badhiya! Ab agle level par chalte hain..." : "Good! Now let's go one step further...")
            : isPart
            ? (isHindiOrHinglish ? "Aadhe point sahi hain. Lekin kya aap bata sakte hain aisa kyun hua?" : "That's partially correct. Can you explain why?")
            : (isHindiOrHinglish ? "Thoda sa off-track ho gaya. Chalo concept ko reset karte hain." : "Not quite. Let's look at the foundational mechanism together."),
          critique: `You addressed aspects of ${turn.subtopic}. Make sure to explicitly quantify time/space complexity and boundary conditions.`,
          conceptGapIdentified: isCorr ? "" : `${turn.subtopic} Boundary Precision`,
          isWeakness: !isCorr,
          needsTeaching: !isCorr,
          microLesson: `In ${turn.subtopic}, observe the trade-off: verify the invariant first before computing the final result.`,
          followUpQuestion: `How would your reasoning change if the input scale or network traffic doubled?`,
        };
      }
    }

    // Commit turn evaluation
    turn.evaluation = {
      status: evaluationData.status || "partially_correct",
      score: evaluationData.score || 60,
      examinerReaction: evaluationData.examinerReaction || "Good.",
      critique: evaluationData.critique || "",
      conceptGapIdentified: evaluationData.conceptGapIdentified || "",
      isWeakness: Boolean(evaluationData.isWeakness),
    };

    turn.teachingIntervention = {
      needed: Boolean(evaluationData.needsTeaching),
      microLesson: evaluationData.microLesson || "",
      retestQuestion: `Now that you understand this principle, try again: How does ${turn.subtopic} guarantee correct execution?`,
      retestAnswer: "",
      retestResolved: false,
    };

    turn.followUp = {
      questionText: evaluationData.followUpQuestion || "",
      studentAnswer: "",
      evaluation: "",
      score: 0,
    };

    turn.completedAt = new Date();

    // If weakness identified, auto-register in Personal Mistake Book
    if (evaluationData.isWeakness && req.user?._id) {
      try {
        await ExamMistake.findOneAndUpdate(
          { user: req.user._id, questionText: turn.questionText },
          {
            questionText: turn.questionText,
            subjectId: session.subjectId,
            subjectName: session.subject,
            topicId: session.topicId,
            topicName: session.topic,
            userAns: turn.studentAnswer,
            correctAns: evaluationData.critique,
            explanation: evaluationData.microLesson || evaluationData.critique,
            status: "unresolved",
            $inc: { attemptsCount: 1 },
          },
          { upsert: true }
        );
      } catch (mistakeErr) {
        console.warn("Mistake log warning:", mistakeErr.message);
      }
    }

    await session.save();

    res.json({
      success: true,
      turn,
      examinerReaction: turn.evaluation.examinerReaction,
      status: turn.evaluation.status,
      score: turn.evaluation.score,
      critique: turn.evaluation.critique,
      followUpQuestion: turn.followUp.questionText,
      teachingIntervention: turn.teachingIntervention,
    });
  } catch (err) {
    console.error("evaluateInterviewTurn error:", err);
    res.status(500).json({ message: "Failed to evaluate answer turn." });
  }
};

// ============================================================================
// 3. SUBMIT FOLLOW-UP OR RETEST ANSWER
// @route POST /api/exam-prep/copilot/interview/:sessionId/submit-followup
// ============================================================================
export const submitFollowUpTurn = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { turnIndex = 0, followUpAnswer = "", isRetest = false } = req.body;

    const session = await ExamInterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    const turn = session.turns[turnIndex];
    if (!turn) {
      return res.status(404).json({ message: "Turn not found." });
    }

    const words = followUpAnswer.trim().split(/\s+/).filter(Boolean).length;
    const earnedScore = Math.min(Math.max(words * 5, 50), 95);

    if (isRetest) {
      turn.teachingIntervention.retestAnswer = followUpAnswer;
      turn.teachingIntervention.retestResolved = earnedScore >= 65;
    } else {
      turn.followUp.studentAnswer = followUpAnswer;
      turn.followUp.score = earnedScore;
      turn.followUp.evaluation = earnedScore >= 75
        ? "Excellent depth on the follow-up inquiry."
        : "Reasonable attempt. Deepen boundary validation.";
    }

    // Advance session turn index if next turn exists
    const hasNextTurn = turnIndex + 1 < session.turns.length;
    if (hasNextTurn) {
      session.currentTurnIndex = turnIndex + 1;
    }

    await session.save();

    res.json({
      success: true,
      turn,
      hasNextTurn,
      nextTurnIndex: hasNextTurn ? turnIndex + 1 : null,
      nextQuestion: hasNextTurn ? session.turns[turnIndex + 1] : null,
    });
  } catch (err) {
    console.error("submitFollowUpTurn error:", err);
    res.status(500).json({ message: "Failed to submit follow-up response." });
  }
};

// ============================================================================
// 4. COMPLETE INTERVIEW & SYNTHESIZE MENTOR VERDICT + ACTION PLAN
// @route POST /api/exam-prep/copilot/interview/:sessionId/complete
// ============================================================================
export const completeExamInterview = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await ExamInterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    const turns = session.turns || [];
    const scoredTurns = turns.filter((t) => t.completedAt);
    const totalScore = scoredTurns.reduce((acc, t) => acc + (t.evaluation?.score || 0), 0);
    const avgScore = scoredTurns.length > 0 ? Math.round(totalScore / scoredTurns.length) : 70;

    const weaknesses = [];
    const strengths = [];

    turns.forEach((t) => {
      const topicName = t.subtopic || session.topic;
      if (t.evaluation?.score < 65) {
        if (!weaknesses.includes(topicName)) weaknesses.push(topicName);
      } else {
        if (!strengths.includes(topicName)) strengths.push(topicName);
      }
    });

    const verdict =
      avgScore >= 80
        ? "Placement Ready / Exceptional Viva Performance (Grade: A+)"
        : avgScore >= 65
        ? "Solid Conceptual Foundation with Minor Boundary Deficits (Grade: B+)"
        : "Needs Intensive Remediation on Foundational Mechanics (Grade: C)";

    session.status = "completed";
    session.summary = {
      overallScore: avgScore,
      overallVerdict: verdict,
      accuracyRate: avgScore,
      identifiedWeaknesses: weaknesses,
      masteredStrengths: strengths,
      conceptMasteryDelta: Math.round(avgScore * 0.15),
      examinerNotes: `Student completed ${scoredTurns.length} of ${turns.length} questions across ${session.subject} (${session.topic}).`,
      actionPlan: [
        {
          day: 1,
          focus: "Weakness Drill",
          action: `Deep-dive into ${weaknesses[0] || session.topic} using interactive visualizers and note synthesis.`,
        },
        {
          day: 2,
          focus: "Viva Verification",
          action: "Re-take 5 targeted viva questions to prove boundary resolution.",
        },
        {
          day: 3,
          focus: "Speed & Fluency",
          action: "Practice voice-only explanations under 90-second timers.",
        },
      ],
    };

    // Update Student TopicProgress in MongoDB
    if (req.user?._id && session.topicId) {
      try {
        await TopicProgress.findOneAndUpdate(
          { user: req.user._id, topicId: session.topicId },
          {
            $set: {
              subjectId: session.subjectId,
              masteryPercentage: avgScore,
              masteryStatus: avgScore >= 75 ? "strong" : avgScore >= 50 ? "needs_practice" : "weak",
              lastAttemptAt: new Date(),
            },
            $inc: { attemptsCount: 1 },
          },
          { upsert: true }
        );
      } catch (pErr) {
        console.warn("TopicProgress update warning:", pErr.message);
      }
    }

    await session.save();

    res.json({
      success: true,
      session,
      summary: session.summary,
    });
  } catch (err) {
    console.error("completeExamInterview error:", err);
    res.status(500).json({ message: "Failed to finalize interview summary." });
  }
};
