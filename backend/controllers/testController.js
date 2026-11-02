import Question from "../models/Question.js";
import TestResult from "../models/TestResult.js";
import { getAIClient, getAIModel } from "../config/ai.js";
import { recordAuditLog } from "../utils/auditLogger.js";
import { calculatePrediction } from "./predictionController.js";

// Canonical subject normalization
export const normalizeSubject = (input = "") => {
  const s = String(input).trim().toUpperCase();
  if (s === "DSA" || s.includes("DATA STRUCTURE") || s.includes("ALGORITHM")) return "DSA";
  if (s === "DBMS" || s.includes("DATABASE") || s.includes("SQL")) return "DBMS";
  if (s === "OS" || s.includes("OPERATING SYSTEM")) return "OS";
  if (s === "CN" || s.includes("NETWORK")) return "CN";
  if (s === "OOP" || s === "OOPS" || s.includes("OBJECT ORIENTED")) return "OOP";
  if (s === "SYSTEM_DESIGN" || s.includes("SYSTEM DESIGN") || s.includes("SYS DESIGN")) return "SYSTEM_DESIGN";
  if (s === "WEB_DEV" || s.includes("WEB DEV") || s.includes("WEB DEVELOPMENT")) return "WEB_DEV";
  if (s === "APTITUDE" || s.includes("APTITUDE") || s.includes("REASONING")) return "APTITUDE";
  if (s === "PROGRAMMING" || s.includes("PROGRAMMING") || s.includes("CODING")) return "PROGRAMMING";
  return s;
};

// Fisher-Yates array shuffle helper
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Generate fresh AI questions for a subject (if needed)
export const generateFreshQuestionsForSubject = async (subject, count = 10) => {
  try {
    const canonical = normalizeSubject(subject);
    const openai = getAIClient();
    const model = getAIModel();

    const prompt = `You are a Principal Technical Interviewer and Academic Computer Science Examiner.
Generate ${count} completely NEW, diverse, high-quality multiple-choice questions for the subject "${canonical}".

Requirements:
1. Cover different core sub-topics within ${canonical}.
2. Questions must test practical problem-solving, code execution, architecture, or deep conceptual understanding (similar to GATE / Tier-1 Campus Recruitment Technical OA tests).
3. Ensure every question has 4 plausible, distinct choices.
4. Specify the exact zero-based index (0, 1, 2, or 3) of the correct answer.
5. Provide a realistic topic name for each question.

Respond strictly in valid JSON format:
{
  "questions": [
    {
      "topic": "Topic Name",
      "questionText": "Clear technical question text...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "difficulty": "medium",
      "explanation": "Clear reason why option is correct"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a JSON-only API that outputs rigorous computer science multiple choice assessment questions." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const raw = response.choices[0]?.message?.content || "";
    const clean = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(clean);

    const questionsToSave = [];
    if (parsed && Array.isArray(parsed.questions)) {
      for (const q of parsed.questions) {
        if (q.questionText && Array.isArray(q.options) && q.options.length >= 2 && q.correctAnswerIndex !== undefined) {
          questionsToSave.push({
            subject: canonical,
            topic: q.topic || "General",
            questionText: q.questionText,
            options: q.options,
            correctAnswerIndex: Math.min(Math.max(0, q.correctAnswerIndex), q.options.length - 1),
            difficulty: q.difficulty || "medium",
            explanation: q.explanation || "",
            tags: ["AI Generated", canonical],
          });
        }
      }
    }

    if (questionsToSave.length > 0) {
      await Question.insertMany(questionsToSave);
      console.log(`Inserted ${questionsToSave.length} AI questions for ${canonical}`);
    }
    return questionsToSave;
  } catch (error) {
    console.error("AI Question Generation Error:", error.message);
    return [];
  }
};

export const generateFreshQuestions = async (req, res) => {
  try {
    const { subject, count = 10 } = req.body;
    if (!subject) return res.status(400).json({ message: "Subject is required" });
    const questions = await generateFreshQuestionsForSubject(subject, count);
    res.json({ message: `Generated ${questions.length} questions for ${subject}`, count: questions.length });
  } catch (error) {
    console.error("Generate fresh questions error:", error);
    res.status(500).json({ message: error.message || "Failed to generate fresh questions" });
  }
};

// @desc Get questions for a subject / topic with pagination, dynamic count, and zero duplicates
// @route GET /api/tests/questions/:subject or GET /api/tests/questions?subject=...&topic=...
export const getQuestions = async (req, res) => {
  try {
    const rawSubject = req.params.subject || req.query.subject || "DSA";
    const canonicalSubject = normalizeSubject(rawSubject);
    const { topic, difficulty, questionType, page, limit, count, random = "true" } = req.query;

    const filter = { subject: canonicalSubject };

    if (topic && topic.trim()) {
      const trimmedTopic = topic.trim();
      const escaped = trimmedTopic.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      filter.topic = { $regex: new RegExp(`^${escaped}$`, "i") };
    }

    if (difficulty && difficulty.trim()) {
      filter.difficulty = difficulty.trim().toLowerCase();
    }

    if (questionType && questionType.trim()) {
      filter.questionType = questionType.trim();
    }

    const total = await Question.countDocuments(filter);

    // If explicit pagination is requested via page parameter
    if (page !== undefined) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit || count, 10) || 20));
      const skip = (pageNum - 1) * limitNum;

      const questions = await Question.find(filter)
        .select("-correctAnswerIndex")
        .skip(skip)
        .limit(limitNum)
        .lean();

      return res.json({
        questions,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      });
    }

    // Otherwise, this is a test attempt request with a requested count (e.g. 10, 20, 30, 50, etc.)
    const requestedCount = count ? parseInt(count, 10) : limit ? parseInt(limit, 10) : 10;
    const finalCount = Math.min(Math.max(1, requestedCount), total || 10);

    // Fetch all matching questions without answer index
    let allMatching = await Question.find(filter).select("-correctAnswerIndex").lean();

    // If database is completely empty for this subject, try generating
    if (allMatching.length === 0) {
      await generateFreshQuestionsForSubject(canonicalSubject, 10);
      allMatching = await Question.find(filter).select("-correctAnswerIndex").lean();
    }

    // Randomize without duplicates if random !== "false"
    const selected = random === "false" 
      ? allMatching.slice(0, finalCount)
      : shuffleArray(allMatching).slice(0, finalCount);

    res.setHeader("X-Total-Count", total.toString());
    res.setHeader("X-Available-Questions", total.toString());

    // If caller expects an object with total metadata
    if (req.query.format === "meta") {
      return res.json({
        questions: selected,
        total,
        count: selected.length,
      });
    }

    // Default: return selected questions array directly for standard test takers
    return res.json(selected);
  } catch (error) {
    console.error("Get questions error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Submit test answers, calculate authoritative score + topic-wise skill gap + AI Evaluation
// @route POST /api/tests/submit
export const submitTest = async (req, res) => {
  try {
    const { subject, topic, answers = [], timeTakenSeconds = 0, questionIds = [] } = req.body;
    const canonicalSubject = normalizeSubject(subject || "DSA");

    // Identify target questions evaluated in this test session
    const targetIds = questionIds.length > 0 
      ? questionIds 
      : answers.map((a) => a.questionId).filter(Boolean);

    let questions = [];
    if (targetIds.length > 0) {
      questions = await Question.find({ _id: { $in: targetIds } });
    } else {
      questions = await Question.find({ subject: canonicalSubject });
    }

    if (questions.length === 0) {
      return res.status(400).json({ message: "No questions found to evaluate for this test" });
    }

    let correctCount = 0;
    let wrongCount = 0;
    let attemptedCount = 0;
    const topicBreakdown = {};

    for (const question of questions) {
      const qTopic = question.topic || "General Concepts";
      if (!topicBreakdown[qTopic]) {
        topicBreakdown[qTopic] = { correct: 0, total: 0, wrong: 0, attempted: 0 };
      }
      topicBreakdown[qTopic].total += 1;

      const userAnswer = answers.find(
        (a) => String(a.questionId) === question._id.toString()
      );

      if (userAnswer && userAnswer.selectedIndex !== null && userAnswer.selectedIndex !== undefined && userAnswer.selectedIndex !== -1) {
        attemptedCount += 1;
        topicBreakdown[qTopic].attempted += 1;

        if (userAnswer.selectedIndex === question.correctAnswerIndex) {
          correctCount += 1;
          topicBreakdown[qTopic].correct += 1;
        } else {
          wrongCount += 1;
          topicBreakdown[qTopic].wrong += 1;
        }
      }
    }

    const totalQuestions = questions.length;
    const skippedCount = Math.max(0, totalQuestions - attemptedCount);
    const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const accuracyPercent = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

    // AI Evaluation of Test Submission
    let aiEvaluation = null;
    try {
      const openai = getAIClient();
      const model = getAIModel();

      const prompt = `Act as an expert Academic CS Examiner evaluating a student's test submission.
SUBJECT: ${canonicalSubject}
TOPIC FOCUS: ${topic || "Comprehensive Diagnostic"}
SCORE: ${scorePercent}% (${correctCount}/${totalQuestions} questions correct, ${attemptedCount} attempted, accuracy ${accuracyPercent}%)
TOPIC BREAKDOWN: ${JSON.stringify(topicBreakdown)}

Respond strictly in valid JSON format:
{
  "aiSummary": "2-sentence diagnostic evaluation highlighting key strengths and areas needing improvement.",
  "recommendedFocus": "Specific topic or concept the student should revise next.",
  "estimatedStudyMinutes": 25
}`;

      const aiRes = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      const raw = aiRes.choices[0]?.message?.content || "";
      const clean = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      aiEvaluation = JSON.parse(clean);
    } catch (aiErr) {
      console.warn("AI Test Evaluation fallback:", aiErr.message);
      aiEvaluation = {
        aiSummary: `You scored ${scorePercent}% on your ${canonicalSubject} test (${correctCount}/${totalQuestions} correct). ${scorePercent >= 70 ? "Great performance on core concepts!" : "Focus on reviewing your weak topics to strengthen foundational knowledge."}`,
        recommendedFocus: `${canonicalSubject} Topic Practice`,
        estimatedStudyMinutes: 20
      };
    }

    const topicScores = Object.entries(topicBreakdown).map(([top, data]) => ({
      topic: top,
      correct: data.correct,
      total: data.total,
      attempted: data.attempted,
      percent: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    }));

    const weakTopics = topicScores.filter((t) => t.percent < 60).map((t) => t.topic);
    const strongTopics = topicScores.filter((t) => t.percent >= 60).map((t) => t.topic);

    const result = await TestResult.create({
      user: req.user._id,
      subject: canonicalSubject,
      topic: topic || "",
      totalQuestions,
      attemptedQuestions: attemptedCount,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      skippedQuestions: skippedCount,
      scorePercent,
      accuracyPercent,
      timeTakenSeconds,
      topicBreakdown,
      weakTopics,
      strongTopics,
      aiEvaluation,
    });

    // Auto update prediction and audit logs asynchronously
    calculatePrediction(req.user._id).catch((pErr) =>
      console.warn("Auto-prediction recalculation warning:", pErr.message)
    );

    recordAuditLog({
      req,
      action: "ASSESSMENT_SUBMITTED",
      details: {
        subject: canonicalSubject,
        topic: topic || "All",
        scorePercent,
        correctAnswers: correctCount,
        totalQuestions,
        accuracyPercent,
      },
    }).catch((aErr) => console.warn("Audit logging warning:", aErr.message));

    res.status(201).json({
      ...result.toObject(),
      topicScores,
      weakTopics,
      strongTopics,
    });
  } catch (error) {
    console.error("Submit test error:", error);
    res.status(500).json({ message: error.message || "Failed to submit test" });
  }
};

// @desc Get real subject-level intelligence strip stats
// @route GET /api/tests/subject-stats
export const getSubjectStats = async (req, res) => {
  try {
    const subjects = [
      { id: "DSA", name: "Data Structures & Algorithms", code: "DSA" },
      { id: "DBMS", name: "Database Management Systems", code: "DBMS" },
      { id: "OS", name: "Operating Systems", code: "OS" },
      { id: "CN", name: "Computer Networks", code: "Networks" },
      { id: "OOP", name: "Object Oriented Programming", code: "OOP" },
      { id: "SYSTEM_DESIGN", name: "System Design", code: "System Design" },
      { id: "WEB_DEV", name: "Web Development", code: "Web Dev" },
      { id: "APTITUDE", name: "Aptitude & Reasoning", code: "Aptitude" },
      { id: "PROGRAMMING", name: "Programming Core", code: "Programming" },
    ];

    // Fetch user test results
    const results = await TestResult.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Count questions per subject from database
    const dbCounts = await Question.aggregate([
      { $group: { _id: "$subject", count: { $sum: 1 } } }
    ]);
    const countMap = {};
    dbCounts.forEach((c) => {
      countMap[c._id] = c.count;
    });

    const stats = subjects.map((sub) => {
      const qCount = countMap[sub.id] || 0;

      // Find user attempts for this canonical subject
      const subAttempts = results.filter(
        (r) => normalizeSubject(r.subject) === sub.id
      );

      let attemptedQuestions = 0;
      let totalScoreSum = 0;

      subAttempts.forEach((a) => {
        attemptedQuestions += a.totalQuestions || 0;
        totalScoreSum += a.scorePercent || 0;
      });

      const masteryPercent =
        subAttempts.length > 0
          ? Math.round(totalScoreSum / subAttempts.length)
          : 0;

      let status = "Not Started";
      if (subAttempts.length > 0) {
        if (masteryPercent >= 65) status = "Strong";
        else if (masteryPercent >= 35) status = "Developing";
        else status = "Weak";
      }

      return {
        id: sub.id,
        subject: sub.id,
        name: sub.name,
        shortName: sub.code,
        totalQuestions: qCount, // Real question count from database
        attemptedQuestions,
        attempts: subAttempts.length,
        avgScore: masteryPercent,
        masteryPercent,
        status,
      };
    });

    res.json(stats);
  } catch (error) {
    console.error("Subject stats error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get real topic test hierarchy with accuracy, attempts, and recommendation
// @route GET /api/tests/topics/:subject
export const getTopicTestsHierarchy = async (req, res) => {
  try {
    const rawSubject = req.params.subject || req.query.subject || "DSA";
    const canonicalSubject = normalizeSubject(rawSubject);

    // 1. Group actual questions from the database for THIS canonical subject
    const topicAgg = await Question.aggregate([
      { $match: { subject: canonicalSubject } },
      {
        $group: {
          _id: "$topic",
          questionCount: { $sum: 1 },
          difficulty: { $first: "$difficulty" },
          isPlacement: { $first: "$isPlacement" },
          isPYQ: { $first: "$isPYQ" },
        },
      },
      { $sort: { questionCount: -1, _id: 1 } },
    ]);

    // 2. Fetch student's test history for this subject
    const userResults = await TestResult.find({
      user: req.user._id,
      subject: canonicalSubject,
    }).sort({ createdAt: -1 });

    // 3. Build response matching ONLY this subject's real topics
    const topicsList = topicAgg.map((t) => {
      const topicName = t._id || "General";
      let correct = 0;
      let total = 0;

      userResults.forEach((r) => {
        if (r.topicBreakdown && r.topicBreakdown[topicName]) {
          correct += r.topicBreakdown[topicName].correct || 0;
          total += r.topicBreakdown[topicName].total || 0;
        }
      });

      const mastery = total > 0 ? Math.round((correct / total) * 100) : 0;
      const status = total === 0 ? "Not Started" : mastery >= 70 ? "Strong" : mastery >= 40 ? "Developing" : "Weak";

      return {
        topic: topicName,
        questionCount: t.questionCount,
        mastery,
        attempted: total,
        difficulty: t.difficulty ? t.difficulty.charAt(0).toUpperCase() + t.difficulty.slice(1) : "Medium",
        recommended: total === 0 || mastery < 40,
        status,
      };
    });

    res.json(topicsList);
  } catch (error) {
    console.error("Topics hierarchy error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get student's own test history
// @route GET /api/tests/results
export const getMyResults = async (req, res) => {
  try {
    const results = await TestResult.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json(results);
  } catch (error) {
    console.error("Get results error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get skill gap analysis for a specific subject
// @route GET /api/tests/skill-gap/:subject
export const getSkillGap = async (req, res) => {
  try {
    const rawSubject = req.params.subject || "DSA";
    const canonical = normalizeSubject(rawSubject);

    const results = await TestResult.find({
      user: req.user._id,
      subject: canonical,
    }).sort({ createdAt: -1 }).limit(15);

    if (results.length === 0) {
      return res.json({ subject: canonical, message: "No test attempts yet", skillGap: [] });
    }

    const topicMap = {};
    results.forEach((r) => {
      if (r.topicBreakdown) {
        Object.entries(r.topicBreakdown).forEach(([topic, data]) => {
          if (!topicMap[topic]) topicMap[topic] = { correct: 0, total: 0 };
          topicMap[topic].correct += data.correct || 0;
          topicMap[topic].total += data.total || 0;
        });
      }
    });

    const skillGap = Object.entries(topicMap).map(([topic, data]) => ({
      topic,
      mastery: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      correct: data.correct,
      total: data.total,
      status: data.total > 0 && data.correct / data.total >= 0.7 ? "Strong" : data.total > 0 && data.correct / data.total >= 0.4 ? "Developing" : "Weak",
    })).sort((a, b) => a.mastery - b.mastery);

    res.json({ subject: canonical, skillGap, totalAttempts: results.length });
  } catch (error) {
    console.error("Skill gap error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get recommended tests for student based on weak topics & recent mistakes
// @route GET /api/tests/recommended
export const getRecommendedTests = async (req, res) => {
  try {
    const results = await TestResult.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);

    const weakTopicsList = [];
    results.forEach((r) => {
      if (r.weakTopics && Array.isArray(r.weakTopics)) {
        r.weakTopics.forEach((t) => weakTopicsList.push({ topic: t, subject: r.subject }));
      }
    });

    // Provide contextual recommendations based on real weak topics or defaults
    const recommendations = [
      {
        id: "rec-1",
        title: weakTopicsList[0] ? `${weakTopicsList[0].subject} — ${weakTopicsList[0].topic}` : "Binary Search — Boundary Conditions",
        subject: weakTopicsList[0] ? weakTopicsList[0].subject : "DSA",
        topic: weakTopicsList[0] ? weakTopicsList[0].topic : "Binary Search",
        questionCount: 10,
        estimatedMinutes: 15,
        difficulty: "Medium",
        reason: weakTopicsList[0] ? `Recent weak performance in ${weakTopicsList[0].topic}.` : "Key FAANG campus recruitment screening topic.",
        interviewRelevance: "High (FAANG, Top Tier)",
      },
      {
        id: "rec-2",
        title: "DBMS Normalization & Functional Dependencies",
        subject: "DBMS",
        topic: "Normalization",
        questionCount: 10,
        estimatedMinutes: 15,
        difficulty: "Hard",
        reason: "Core GATE and software engineering technical interview assessment topic.",
        interviewRelevance: "High (GATE & Core Systems)",
      },
      {
        id: "rec-3",
        title: "Operating Systems — CPU Scheduling & Deadlocks",
        subject: "OS",
        topic: "CPU Scheduling",
        questionCount: 15,
        estimatedMinutes: 20,
        difficulty: "Medium",
        reason: "Preemptive starvation and Gantt-chart calculation practice recommended.",
        interviewRelevance: "Medium (Campus OA)",
      },
    ];

    res.json(recommendations);
  } catch (error) {
    console.error("Recommendations error:", error);
    res.status(500).json({ message: error.message });
  }
};
