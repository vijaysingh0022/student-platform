import { getAIClient, getAIModel } from "../config/ai.js";
import MockInterview from "../models/MockInterview.js";
import CareerProfile from "../models/CareerProfile.js";
import { recordAuditLog } from "../utils/auditLogger.js";

// Role Question Bank Fallbacks for robust generation
const ROLE_QUESTION_BANKS = {
  "Software Developer": {
    mcq: [
      { id: "q1", text: "Which data structure provides average O(1) time complexity for lookup operations?", options: ["Array", "Hash Table", "Binary Search Tree", "Linked List"], correct: 1 },
      { id: "q2", text: "What is the key principle of Polymorphism in Object-Oriented Programming?", options: ["Hiding internal states", "Ability of a function to take multiple forms", "Bundling data and methods", "Reusing code via inheritance"], correct: 1 },
      { id: "q3", text: "Which HTTP method is idempotent and used to replace an entire resource?", options: ["POST", "PUT", "PATCH", "DELETE"], correct: 1 },
    ],
    technical: [
      { id: "t1", text: "Explain the difference between Process and Thread in Operating Systems. How do they share memory?" },
      { id: "t2", text: "How would you optimize a SQL query that is running slowly on a table with 10 million rows?" },
    ],
    coding: [
      { id: "c1", text: "Given an array of integers, find the contiguous subarray with the maximum sum (Kadane's Algorithm)." },
    ],
    project: [
      { id: "p1", text: "Walk me through the architecture of a major project you built. What was the toughest technical decision or trade-off you made?" },
    ],
    hr: [
      { id: "h1", text: "Describe a situation where you had a disagreement with a team member on technical design. How did you resolve it?" },
      { id: "h2", text: "Why do you want to join our engineering team as a Software Developer?" },
    ],
  },
  "Backend Developer": {
    mcq: [
      { id: "q1", text: "Which database ACID property guarantees that all database operations in a transaction succeed or all fail?", options: ["Atomicity", "Consistency", "Isolation", "Durability"], correct: 0 },
      { id: "q2", text: "What is the primary benefit of Redis in a backend architecture?", options: ["Persistent cold storage", "In-memory caching & pub/sub", "Relational querying", "Full-text indexing"], correct: 1 },
      { id: "q3", text: "Which header is used for JWT Bearer token authentication?", options: ["Accept", "Authorization", "Content-Type", "Host"], correct: 1 },
    ],
    technical: [
      { id: "t1", text: "Explain Database Sharding vs Replication. When would you choose one over the other?" },
      { id: "t2", text: "How do you handle API Rate Limiting to prevent DDoS attacks and server overload?" },
    ],
    coding: [
      { id: "c1", text: "Implement a Least Recently Used (LRU) Cache data structure with O(1) get and put operations." },
    ],
    project: [
      { id: "p1", text: "Describe how your backend server handles authentication, session state, and database connection pooling." },
    ],
    hr: [
      { id: "h1", text: "How do you handle severe production downtime or high server error spikes during off-hours?" },
      { id: "h2", text: "Where do you see yourself as a Backend Engineer in 3 years?" },
    ],
  },
  "Frontend Developer": {
    mcq: [
      { id: "q1", text: "What triggers a React component re-render?", options: ["Changes in props or state", "Console log statement", "Importing CSS file", "Calling a helper function"], correct: 0 },
      { id: "q2", text: "Which CSS property is used to create a flexbox container layout?", options: ["display: flex", "position: absolute", "float: left", "box-sizing: border-box"], correct: 0 },
      { id: "q3", text: "What is Event Bubbling in JavaScript DOM?", options: ["Events firing from root to target", "Events propagating from child target up to parent elements", "Canceling event handlers", "Handling async operations"], correct: 1 },
    ],
    technical: [
      { id: "t1", text: "Explain the React Virtual DOM reconciliation process. How does diffing work?" },
      { id: "t2", text: "How do you optimize Web Performance (Core Web Vitals, code splitting, image optimization)?" },
    ],
    coding: [
      { id: "c1", text: "Implement a Debounce function in JavaScript that limits how often a function can fire." },
    ],
    project: [
      { id: "p1", text: "Discuss the state management approach (Context/Redux/Zustand) you used in your latest web application." },
    ],
    hr: [
      { id: "h1", text: "How do you handle changing UX design requirements right before a product release deadline?" },
      { id: "h2", text: "What motivates you to specialize in Frontend Development?" },
    ],
  },
  "AI/ML Engineer": {
    mcq: [
      { id: "q1", text: "Which issue occurs when a machine learning model performs well on training data but poorly on test data?", options: ["Underfitting", "Overfitting", "Bias", "High entropy"], correct: 1 },
      { id: "q2", text: "What activation function is commonly used in output layers for multi-class classification?", options: ["ReLU", "Sigmoid", "Softmax", "Tanh"], correct: 2 },
      { id: "q3", text: "Which metric is best suited for evaluating an imbalanced classification dataset?", options: ["Accuracy", "F1-Score / PR-AUC", "Mean Squared Error", "R-Squared"], correct: 1 },
    ],
    technical: [
      { id: "t1", text: "Explain the Vanishing Gradient problem in Deep Neural Networks and how ResNets or ReLU mitigate it." },
      { id: "t2", text: "How does the Transformer Self-Attention mechanism work conceptually compared to RNNs?" },
    ],
    coding: [
      { id: "c1", text: "Write Python code using NumPy to implement Softmax function and Cross-Entropy Loss." },
    ],
    project: [
      { id: "p1", text: "Walk me through an AI/ML project you built. What feature engineering and hyperparameter tuning did you perform?" },
    ],
    hr: [
      { id: "h1", text: "How do you stay updated with rapidly evolving AI research papers and state-of-the-art models?" },
      { id: "h2", text: "Describe an AI ethical dilemma or bias risk you considered while deploying a machine learning model." },
    ],
  },
};

// @desc Start a new AI Mock Interview session
// @route POST /api/interview/start
// body: { role }
export const startInterview = async (req, res) => {
  try {
    const { role = "Software Developer" } = req.body;
    const userId = req.user._id;

    const bank = ROLE_QUESTION_BANKS[role] || ROLE_QUESTION_BANKS["Software Developer"];

    const rounds = [
      {
        roundNumber: 1,
        roundName: "Technical MCQ",
        status: "in-progress",
        questions: bank.mcq.map((q) => ({
          questionId: q.id,
          questionText: q.text,
          questionType: "mcq",
          options: q.options,
          correctOption: q.correct,
        })),
      },
      {
        roundNumber: 2,
        roundName: "Technical Questions",
        status: "pending",
        questions: bank.technical.map((q) => ({
          questionId: q.id,
          questionText: q.text,
          questionType: "text",
        })),
      },
      {
        roundNumber: 3,
        roundName: "Coding",
        status: "pending",
        questions: bank.coding.map((q) => ({
          questionId: q.id,
          questionText: q.text,
          questionType: "coding",
        })),
      },
      {
        roundNumber: 4,
        roundName: "Project Discussion",
        status: "pending",
        questions: bank.project.map((q) => ({
          questionId: q.id,
          questionText: q.text,
          questionType: "text",
        })),
      },
      {
        roundNumber: 5,
        roundName: "HR / Behavioral",
        status: "pending",
        questions: bank.hr.map((q) => ({
          questionId: q.id,
          questionText: q.text,
          questionType: "text",
        })),
      },
    ];

    const interview = await MockInterview.create({
      user: userId,
      role,
      rounds,
      completed: false,
    });

    res.status(201).json(interview);
  } catch (error) {
    console.error("Start interview error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Submit answer to a question & generate dynamic AI follow-up
// @route POST /api/interview/:id/answer
// body: { roundNumber, questionId, studentAnswer, selectedOption }
export const submitAnswerAndGetFollowUp = async (req, res) => {
  try {
    const { id } = req.params;
    const { roundNumber, questionId, studentAnswer = "", selectedOption = null } = req.body;

    const interview = await MockInterview.findOne({ _id: id, user: req.user._id });
    if (!interview) {
      return res.status(404).json({ message: "Interview session not found" });
    }

    const round = interview.rounds.find((r) => r.roundNumber === Number(roundNumber));
    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    const qItem = round.questions.find((q) => q.questionId === questionId);
    if (!qItem) {
      return res.status(404).json({ message: "Question not found in round" });
    }

    qItem.studentAnswer = studentAnswer;
    if (selectedOption !== null) qItem.selectedOption = Number(selectedOption);

    // AI Evaluation & Follow-Up Generation
    if (qItem.questionType === "mcq") {
      const isCorrect = qItem.selectedOption === qItem.correctOption;
      qItem.evaluation = {
        technicalAccuracy: isCorrect ? 100 : 0,
        conceptUnderstanding: isCorrect ? 100 : 30,
        communication: 100,
        problemSolving: isCorrect ? 100 : 20,
        answerStructure: 100,
        confidence: 100,
        feedback: isCorrect
          ? "Correct option selected! Clean technical recall."
          : `Selected option was incorrect. Option ${qItem.correctOption + 1} (${qItem.options[qItem.correctOption]}) is the correct answer.`,
        sampleIdealAnswer: `Option ${qItem.correctOption + 1}: ${qItem.options[qItem.correctOption]}`,
      };
      qItem.aiFollowUpQuestion = isCorrect
        ? `Great job! Can you briefly explain why option ${qItem.options[qItem.correctOption]} is optimal?`
        : `Let's review: why do you think option ${qItem.options[qItem.correctOption]} is preferred in this scenario?`;
    } else {
      // Prompt LLM for technical answer evaluation + dynamic follow-up question
      const prompt = `You are a Principal Technical Interviewer evaluating a Computer Science candidate for the role of "${interview.role}".

Question Asked: "${qItem.questionText}"
Candidate's Answer: "${studentAnswer}"

Analyze the candidate's answer strictly across 6 criteria (0-100 score):
1. Technical Accuracy
2. Concept Understanding
3. Communication Clarity
4. Problem Solving & Trade-offs
5. Answer Structure (STAR / Logical Flow)
6. Measurable Confidence (evaluate based on technical precision, lack of filler, and depth)

Then, generate ONE smart, context-aware FOLLOW-UP QUESTION directly probing deeper into what the student said or missed in their answer.

Respond ONLY with valid JSON matching this schema:
{
  "technicalAccuracy": 85,
  "conceptUnderstanding": 80,
  "communication": 90,
  "problemSolving": 75,
  "answerStructure": 85,
  "confidence": 80,
  "feedback": "2-sentence actionable coaching feedback directly referencing candidate's specific points.",
  "sampleIdealAnswer": "Comprehensive ideal response expected by top tech companies.",
  "aiFollowUpQuestion": "Smart technical follow-up question directly building on their answer."
}`;

      const openai = getAIClient();
      let aiRes = null;

      if (openai && process.env.OPENAI_API_KEY) {
        try {
          const completion = await openai.chat.completions.create({
            model: getAIModel() || "openai/gpt-4o-mini",
            messages: [
              { role: "system", content: "You are a JSON-only technical interviewer API." },
              { role: "user", content: prompt },
            ],
            max_tokens: 1000,
          });

          const content = completion.choices[0]?.message?.content || "";
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) aiRes = JSON.parse(jsonMatch[0]);
        } catch (aiErr) {
          console.warn("AI Interview evaluation warning:", aiErr.message);
        }
      }

      // Fallback heuristics if API call unavailable
      if (!aiRes) {
        const wordCount = studentAnswer.trim().split(/\s+/).length;
        const score = Math.min(Math.max(wordCount * 4, 45), 92);

        aiRes = {
          technicalAccuracy: score,
          conceptUnderstanding: score,
          communication: Math.min(score + 10, 95),
          problemSolving: Math.max(score - 5, 50),
          answerStructure: score,
          confidence: Math.min(score + 5, 90),
          feedback:
            wordCount > 25
              ? "Detailed answer provided with good technical terms. Make sure to clearly state trade-offs."
              : "Concise response. In technical interviews, elaborate further on data structures, time complexity, and edge cases.",
          sampleIdealAnswer: `A comprehensive answer for "${qItem.questionText}" includes key principles, real-world examples, and time/space complexity trade-offs.`,
          aiFollowUpQuestion: `Building on your point, how would you handle high concurrency or edge case failures in this scenario?`,
        };
      }

      qItem.evaluation = {
        technicalAccuracy: aiRes.technicalAccuracy,
        conceptUnderstanding: aiRes.conceptUnderstanding,
        communication: aiRes.communication,
        problemSolving: aiRes.problemSolving,
        answerStructure: aiRes.answerStructure,
        confidence: aiRes.confidence,
        feedback: aiRes.feedback,
        sampleIdealAnswer: aiRes.sampleIdealAnswer,
      };

      qItem.aiFollowUpQuestion = aiRes.aiFollowUpQuestion;
    }

    await interview.save();
    res.json({ question: qItem, round });
  } catch (error) {
    console.error("Submit answer error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Submit answer to AI follow-up question
// @route POST /api/interview/:id/follow-up-answer
// body: { roundNumber, questionId, followUpAnswer }
export const submitFollowUpAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { roundNumber, questionId, followUpAnswer = "" } = req.body;

    const interview = await MockInterview.findOne({ _id: id, user: req.user._id });
    if (!interview) {
      return res.status(404).json({ message: "Interview session not found" });
    }

    const round = interview.rounds.find((r) => r.roundNumber === Number(roundNumber));
    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    const qItem = round.questions.find((q) => q.questionId === questionId);
    if (!qItem) {
      return res.status(404).json({ message: "Question not found" });
    }

    qItem.aiFollowUpAnswer = followUpAnswer;

    // Check if all questions in this round are answered
    const allAnswered = round.questions.every((q) => q.studentAnswer.trim().length > 0);
    if (allAnswered) {
      round.status = "completed";
      // Unlock next round if exists
      const nextRound = interview.rounds.find((r) => r.roundNumber === Number(roundNumber) + 1);
      if (nextRound) nextRound.status = "in-progress";
    }

    await interview.save();
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Complete interview session and generate comprehensive final report
// @route POST /api/interview/:id/complete
export const completeInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await MockInterview.findOne({ _id: id, user: req.user._id });

    if (!interview) {
      return res.status(404).json({ message: "Interview session not found" });
    }

    // Calculate overall average scores across all answered questions
    let totalScore = 0;
    let totalQuestionsCount = 0;
    const questionsMissed = [];

    interview.rounds.forEach((r) => {
      r.questions.forEach((q) => {
        if (q.evaluation && q.evaluation.technicalAccuracy !== undefined) {
          const avgQScore = Math.round(
            (q.evaluation.technicalAccuracy +
              q.evaluation.conceptUnderstanding +
              q.evaluation.communication +
              q.evaluation.problemSolving +
              q.evaluation.answerStructure +
              q.evaluation.confidence) /
              6
          );
          totalScore += avgQScore;
          totalQuestionsCount++;

          if (avgQScore < 70) {
            questionsMissed.push({
              question: q.questionText,
              yourAnswer: q.studentAnswer || "No answer provided",
              recommendedAnswer: q.evaluation.sampleIdealAnswer || "Refer to core CS fundamentals.",
            });
          }
        }
      });
    });

    const overallScore = totalQuestionsCount > 0 ? Math.round(totalScore / totalQuestionsCount) : 75;

    let hiringDecision = "Needs Improvement";
    if (overallScore >= 85) hiringDecision = "Strong Hire";
    else if (overallScore >= 72) hiringDecision = "Hire";
    else if (overallScore < 50) hiringDecision = "Reject";

    // AI Final Summary Report Synthesis
    const prompt = `You are LearnX's Lead Technical Hiring Manager.
Synthesize the final interview evaluation report for a candidate who applied for "${interview.role}".
Overall Interview Score: ${overallScore}% (${hiringDecision})
Questions Missed: ${questionsMissed.length}

Generate a structured final report in valid JSON:
{
  "strengths": ["Strong technical terminology", "Clear communication in behavioral scenarios"],
  "topicsToImprove": ["Data structure time complexities", "System design caching invalidation"],
  "recommendedLearning": ["LearnX DSA Masterclass", "Database Normalization & Sharding"],
  "preparationPlan": [
    { "day": 1, "focus": "Core CS Concepts", "action": "Review OS process management and memory allocation" },
    { "day": 2, "focus": "System Design", "action": "Practice load balancer and caching patterns" }
  ]
}`;

    const openai = getAIClient();
    let reportData = null;

    if (openai && process.env.OPENAI_API_KEY) {
      try {
        const completion = await openai.chat.completions.create({
          model: getAIModel() || "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a JSON-only hiring manager report API." },
            { role: "user", content: prompt },
          ],
        });
        const content = completion.choices[0]?.message?.content || "";
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) reportData = JSON.parse(jsonMatch[0]);
      } catch (err) {}
    }

    if (!reportData) {
      reportData = {
        strengths: ["Clear communication", "Structured approach to problem solving"],
        topicsToImprove: ["Deep technical trade-offs", "Edge case boundary handling"],
        recommendedLearning: [`LearnX ${interview.role} Advanced Track`, "System Design & Algorithms"],
        preparationPlan: [
          { day: 1, focus: "Weak Topic Review", action: "Revise missed questions and core CS definitions" },
          { day: 2, focus: "Mock Retake", action: "Retake mock interview to boost confidence score above 85%" },
        ],
      };
    }

    interview.overallScore = overallScore;
    interview.hiringDecision = hiringDecision;
    interview.strengths = reportData.strengths;
    interview.topicsToImprove = reportData.topicsToImprove;
    interview.questionsMissed = questionsMissed.slice(0, 5);
    interview.recommendedLearning = reportData.recommendedLearning;
    interview.preparationPlan = reportData.preparationPlan;
    interview.completed = true;
    interview.completedAt = new Date();

    await interview.save();

    // Also update student's CareerProfile mock interview score
    try {
      await CareerProfile.findOneAndUpdate(
        { user: req.user._id },
        {
          $set: { mockInterviewScore: overallScore },
          $inc: { mockAttemptsCount: 1 },
        },
        { upsert: true }
      );
    } catch (cpErr) {
      console.warn("Could not update CareerProfile mock score:", cpErr.message);
    }

    recordAuditLog({
      req,
      action: "QUIZ_EVALUATED",
      details: {
        role: interview.role,
        overallScore,
        hiringDecision,
      },
    }).catch(() => {});

    res.json(interview);
  } catch (error) {
    console.error("Complete interview error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Fetch interview history for user
// @route GET /api/interview/history
export const getInterviewHistory = async (req, res) => {
  try {
    const history = await MockInterview.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
