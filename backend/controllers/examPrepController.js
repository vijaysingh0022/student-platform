import ExamQuestion from "../models/ExamQuestion.js";
import ExamAttempt from "../models/ExamAttempt.js";
import TopicProgress from "../models/TopicProgress.js";
import { SEED_EXAM_QUESTIONS } from "../seed/examPrepData.js";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Helper to seed database if empty
const ensureSeedQuestions = async () => {
  try {
    const count = await ExamQuestion.countDocuments();
    if (count === 0) {
      console.log("Seeding Exam Questions...");
      await ExamQuestion.insertMany(SEED_EXAM_QUESTIONS);
      console.log("Exam Questions seeded successfully.");
    }
  } catch (err) {
    console.error("Error seeding exam questions:", err);
  }
};

// @route GET /api/exam-prep/filters
export const getExamFilters = async (req, res) => {
  try {
    await ensureSeedQuestions();

    const questions = await ExamQuestion.find({}).lean();
    const sourceData = questions.length > 0 ? questions : SEED_EXAM_QUESTIONS;

    const universities = [...new Set(sourceData.map((q) => q.university))].filter(Boolean);
    const semesters = [...new Set(sourceData.map((q) => q.semester))].sort((a, b) => a - b);
    const years = [...new Set(sourceData.map((q) => q.year))].sort((a, b) => b - a);

    const subjectsMap = {};
    sourceData.forEach((q) => {
      if (!subjectsMap[q.subjectId]) {
        subjectsMap[q.subjectId] = {
          id: q.subjectId,
          name: q.subjectName,
          units: {},
        };
      }
      if (!subjectsMap[q.subjectId].units[q.unitId]) {
        subjectsMap[q.subjectId].units[q.unitId] = {
          id: q.unitId,
          name: q.unitName,
          topics: {},
        };
      }
      if (!subjectsMap[q.subjectId].units[q.unitId].topics[q.topicId]) {
        subjectsMap[q.subjectId].units[q.unitId].topics[q.topicId] = {
          id: q.topicId,
          name: q.topicName,
        };
      }
    });

    const subjects = Object.values(subjectsMap).map((s) => ({
      ...s,
      units: Object.values(s.units).map((u) => ({
        ...u,
        topics: Object.values(u.topics),
      })),
    }));

    res.json({
      universities: ["All Universities", ...universities],
      semesters: ["All Semesters", ...semesters.map((s) => `Semester ${s}`)],
      years: ["All Years", ...years],
      questionTypes: [
        { id: "All", name: "All Types" },
        { id: "mcq", name: "MCQs (Multiple Choice)" },
        { id: "short", name: "Short Answer Questions" },
        { id: "long", name: "Long Answer Questions" },
        { id: "numerical", name: "Numerical Problems" },
        { id: "pyq", name: "PYQs (Previous Year Questions)" },
      ],
      difficulties: ["All", "Easy", "Medium", "Hard"],
      subjects,
    });
  } catch (err) {
    console.error("getExamFilters error:", err);
    res.status(500).json({ message: "Failed to fetch exam filters." });
  }
};

// @route GET /api/exam-prep/questions
export const getExamQuestions = async (req, res) => {
  try {
    await ensureSeedQuestions();

    const {
      university,
      semester,
      subjectId,
      unitId,
      year,
      difficulty,
      questionType,
      topicId,
      isImportant,
    } = req.query;

    const query = {};

    if (university && university !== "All" && university !== "All Universities") {
      query.university = university;
    }
    if (semester && semester !== "All" && semester !== "All Semesters") {
      const semNum = parseInt(semester.replace("Semester ", ""), 10);
      if (!isNaN(semNum)) query.semester = semNum;
    }
    if (subjectId && subjectId !== "All") {
      query.subjectId = subjectId;
    }
    if (unitId && unitId !== "All") {
      query.unitId = unitId;
    }
    if (topicId && topicId !== "All") {
      query.topicId = topicId;
    }
    if (year && year !== "All" && year !== "All Years") {
      const yearNum = parseInt(year, 10);
      if (!isNaN(yearNum)) query.year = yearNum;
    }
    if (difficulty && difficulty !== "All") {
      query.difficulty = difficulty;
    }
    if (questionType && questionType !== "All") {
      query.questionType = questionType;
    }
    if (isImportant === "true") {
      query.isImportant = true;
    }

    let questions = await ExamQuestion.find(query).lean();

    // Fallback filter on seed data if DB returned empty
    if (questions.length === 0) {
      questions = SEED_EXAM_QUESTIONS.filter((q) => {
        if (subjectId && subjectId !== "All" && q.subjectId !== subjectId) return false;
        if (unitId && unitId !== "All" && q.unitId !== unitId) return false;
        if (questionType && questionType !== "All" && q.questionType !== questionType) return false;
        if (difficulty && difficulty !== "All" && q.difficulty !== difficulty) return false;
        return true;
      });
    }

    res.json({
      count: questions.length,
      questions,
    });
  } catch (err) {
    console.error("getExamQuestions error:", err);
    res.status(500).json({ message: "Failed to fetch exam questions." });
  }
};

// @route POST /api/exam-prep/submit
export const submitExamAttempt = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mode, filters, responses, timeTakenSeconds } = req.body;
    // responses: [{ questionId, questionText, userAns, correctAns, topicId, topicName, marks, explanation }]

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ message: "No responses submitted." });
    }

    let totalMarks = 0;
    let score = 0;
    let correctCount = 0;

    const topicStats = {}; // topicId => { total, correct, topicName, subjectId }

    const details = responses.map((resp) => {
      const qMarks = resp.marks || 5;
      totalMarks += qMarks;

      const isCorrect = String(resp.userAns).trim().toLowerCase() === String(resp.correctAns).trim().toLowerCase();
      if (isCorrect) {
        score += qMarks;
        correctCount++;
      }

      const tId = resp.topicId || "general-topic";
      if (!topicStats[tId]) {
        topicStats[tId] = {
          total: 0,
          correct: 0,
          topicName: resp.topicName || tId,
          subjectId: resp.subjectId || filters?.subjectId || "dsa",
        };
      }
      topicStats[tId].total += 1;
      if (isCorrect) topicStats[tId].correct += 1;

      return {
        questionId: resp.questionId,
        questionText: resp.questionText,
        userAns: String(resp.userAns),
        correctAns: String(resp.correctAns),
        isCorrect,
        topicId: tId,
        topicName: resp.topicName || tId,
        explanation: resp.explanation || "",
      };
    });

    const accuracyPercentage = Math.round((correctCount / responses.length) * 100);

    const weakTopics = [];
    const strongTopics = [];
    const recommendedRevision = [];

    Object.entries(topicStats).forEach(([tId, stat]) => {
      const pct = Math.round((stat.correct / stat.total) * 100);
      if (pct < 60) {
        weakTopics.push(stat.topicName);
        recommendedRevision.push({
          topicId: tId,
          topicName: stat.topicName,
          reason: `Accuracy is ${pct}%. Review unit notes and practice PYQs.`,
        });
      } else {
        strongTopics.push(stat.topicName);
      }
    });

    // Save ExamAttempt
    const attempt = new ExamAttempt({
      user: userId,
      mode: mode || "exam",
      filters: filters || {},
      score,
      totalMarks,
      accuracyPercentage,
      timeTakenSeconds: timeTakenSeconds || 0,
      questionsCount: responses.length,
      weakTopics,
      strongTopics,
      recommendedRevision,
      details,
    });

    await attempt.save();

    // INTEGRATION WITH STUDENT SKILL GRAPH: Update TopicProgress for each tested topic
    await Promise.all(
      Object.entries(topicStats).map(async ([tId, stat]) => {
        const topicAccuracy = Math.round((stat.correct / stat.total) * 100);
        let progress = await TopicProgress.findOne({ user: userId, topicId: tId });

        if (!progress) {
          progress = new TopicProgress({
            user: userId,
            topicId: tId,
            subjectId: stat.subjectId,
            attemptsCount: 0,
          });
        }

        progress.attemptsCount += 1;
        progress.latestScore = stat.correct;
        progress.latestTotal = stat.total;
        if (stat.correct > progress.bestScore) {
          progress.bestScore = stat.correct;
          progress.bestTotal = stat.total;
        }
        progress.lastAttemptAt = new Date();

        // Calculate weighted mastery update
        const newMastery = Math.min(
          100,
          Math.max(0, Math.round((progress.masteryPercentage * 0.4) + (topicAccuracy * 0.6)))
        );
        progress.masteryPercentage = newMastery;

        if (newMastery >= 80) {
          progress.masteryStatus = "strong";
          if (newMastery >= 90) {
            progress.masteryStatus = "mastered";
            progress.isMastered = true;
            progress.masteredAt = new Date();
          }
        } else if (newMastery >= 60) {
          progress.masteryStatus = "needs_practice";
        } else {
          progress.masteryStatus = "weak";
        }

        if (topicAccuracy < 60 && !progress.weakConcepts.includes(stat.topicName)) {
          progress.weakConcepts.push(stat.topicName);
        } else if (topicAccuracy >= 80) {
          progress.weakConcepts = progress.weakConcepts.filter((c) => c !== stat.topicName);
          if (!progress.strongConcepts.includes(stat.topicName)) {
            progress.strongConcepts.push(stat.topicName);
          }
        }

        progress.revisionHistory.push({
          attemptId: attempt._id.toString(),
          date: new Date(),
          score: stat.correct,
          totalQuestions: stat.total,
          accuracyPercent: topicAccuracy,
          timeTakenSeconds: timeTakenSeconds || 0,
          weakConcepts: topicAccuracy < 60 ? [stat.topicName] : [],
          strongConcepts: topicAccuracy >= 80 ? [stat.topicName] : [],
        });

        await progress.save();
      })
    );

    res.json({
      success: true,
      attemptId: attempt._id,
      summary: {
        score,
        totalMarks,
        accuracyPercentage,
        timeTakenSeconds,
        questionsCount: responses.length,
        correctCount,
        weakTopics,
        strongTopics,
        recommendedRevision,
      },
    });
  } catch (err) {
    console.error("submitExamAttempt error:", err);
    res.status(500).json({ message: "Failed to process exam attempt submission." });
  }
};

// @route GET /api/exam-prep/history
export const getExamHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await ExamAttempt.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({ history });
  } catch (err) {
    console.error("getExamHistory error:", err);
    res.status(500).json({ message: "Failed to fetch exam history." });
  }
};

// @route POST /api/exam-prep/generate-ai-questions
export const generateAIExamQuestions = async (req, res) => {
  try {
    const { subject, topic, university, questionType, count = 5 } = req.body;

    if (!openai) {
      // Fallback AI simulation generator if no API key
      const generated = SEED_EXAM_QUESTIONS.map((q, idx) => ({
        ...q,
        _id: `ai-gen-${Date.now()}-${idx}`,
        questionText: `[AI Generated for ${subject || "CSE"}] ${q.questionText}`,
      })).slice(0, count);

      return res.json({ questions: generated });
    }

    const prompt = `Generate ${count} high-quality ${questionType || "MCQ"} exam questions for CSE subject "${subject || "Data Structures"}" on topic "${topic || "General"}".
Target university standard: ${university || "Generic CSE"}.
Return JSON array with structure:
[
  {
    "subjectId": "${subject?.toLowerCase() || "dsa"}",
    "subjectName": "${subject || "Data Structures"}",
    "unitId": "unit-1",
    "unitName": "Unit 1: Fundamentals",
    "topicId": "${topic?.toLowerCase().replace(/\\s+/g, "-") || "general"}",
    "topicName": "${topic || "General Topic"}",
    "questionType": "mcq",
    "questionText": "Question text...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "0",
    "explanation": "Detailed explanation...",
    "difficulty": "Medium",
    "university": "${university || "Generic CSE"}",
    "semester": 4,
    "year": 2024,
    "marks": 5,
    "isImportant": true,
    "revisionNote": {
      "summary": "Key concept summary...",
      "keyFormulae": ["Formula 1"],
      "keyConcepts": ["Concept A", "Concept B"]
    }
  }
]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert Computer Science exam question generator." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(completion.choices[0].message.content);
    const questions = parsed.questions || parsed.data || parsed;

    res.json({ questions: Array.isArray(questions) ? questions : [questions] });
  } catch (err) {
    console.error("generateAIExamQuestions error:", err);
    res.status(500).json({ message: "Failed to generate AI exam questions." });
  }
};
