import mongoose from "mongoose";
import AdaptiveSession from "../models/AdaptiveSession.js";
import TopicProgress from "../models/TopicProgress.js";
import TestResult from "../models/TestResult.js";
import { normalizeSubject } from "./testController.js";
import {
  selectNextAdaptiveQuestion,
  updateThetaAbility,
  determineTargetDifficulty,
  analyzeAttemptOutcome,
  evaluateCompletedSession,
} from "../services/adaptiveAssessmentService.js";

/**
 * @desc Start or resume an adaptive assessment session
 * @route POST /api/adaptive/start
 */
export const startSession = async (req, res) => {
  try {
    const {
      subject,
      subjectId,
      mode = "diagnostic", // "diagnostic" | "weak_topic" | "mastery_challenge" | "interview_prep" | "exam_prep"
      targetQuestionCount = 10,
      targetTopics = [],
    } = req.body;

    const userId = req.user?._id;
    const canonicalSubject = normalizeSubject(subject || subjectId || "DSA");

    // Look for an existing in-progress active session for this subject & mode
    let session = await AdaptiveSession.findOne({
      user: userId,
      subject: canonicalSubject,
      mode,
      status: "active",
    });

    if (!session) {
      session = await AdaptiveSession.create({
        user: userId,
        subject: canonicalSubject,
        mode,
        targetQuestionCount: Math.min(30, Math.max(5, targetQuestionCount)),
        currentDifficulty: mode === "mastery_challenge" ? "medium" : "medium",
        currentTheta: 0,
        targetTopics: Array.isArray(targetTopics) ? targetTopics : [],
        attempts: [],
        servedQuestionIds: [],
        status: "active",
      });
    }

    res.status(200).json({
      success: true,
      session: {
        _id: session._id,
        subject: session.subject,
        mode: session.mode,
        targetQuestionCount: session.targetQuestionCount,
        currentDifficulty: session.currentDifficulty,
        currentTheta: session.currentTheta,
        attemptsCount: session.attempts.length,
        status: session.status,
      },
    });
  } catch (error) {
    console.error("Adaptive startSession Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get the next dynamically selected adaptive question
 * @route POST /api/adaptive/next
 */
export const nextQuestion = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await AdaptiveSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found." });
    }

    if (session.status === "completed") {
      return res.status(400).json({ success: false, message: "Session is already completed." });
    }

    // Check if target question count reached
    if (session.attempts.length >= session.targetQuestionCount) {
      return res.status(200).json({
        success: true,
        isCompleted: true,
        message: "Target question count reached. Ready to finalize session.",
      });
    }

    // Select optimal next question using the Adaptive Intelligence Engine
    const targetDifficulty = determineTargetDifficulty(
      session.currentTheta,
      session.attempts,
      session.mode
    );

    const { question, selectionReason } = await selectNextAdaptiveQuestion({
      subject: session.subject,
      servedQuestionIds: session.servedQuestionIds || [],
      currentTheta: session.currentTheta,
      recentAttempts: session.attempts,
      targetDifficulty,
      mode: session.mode,
      targetTopics: session.targetTopics,
      userId: session.user,
    });

    const questionDocId = question._id ? String(question._id) : new mongoose.Types.ObjectId().toString();

    // Store question metadata into session served questions
    if (!session.servedQuestionIds.includes(questionDocId)) {
      session.servedQuestionIds.push(questionDocId);
      session.currentDifficulty = question.difficulty || targetDifficulty;
      await session.save();
    }

    // Never send correctAnswerIndex or answers to client
    res.status(200).json({
      success: true,
      isCompleted: false,
      questionNumber: session.attempts.length + 1,
      totalQuestions: session.targetQuestionCount,
      question: {
        _id: questionDocId,
        questionText: question.questionText,
        options: question.options,
        difficulty: question.difficulty || targetDifficulty,
        topic: question.topic || "Computer Science",
        subtopic: question.subtopic || "",
        tags: question.tags || [],
        questionType: question.questionType || "MCQ",
        hint: question.hint || "",
      },
      currentDifficulty: session.currentDifficulty,
      currentTheta: session.currentTheta,
      selectionReason,
    });
  } catch (error) {
    console.error("Adaptive nextQuestion Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Submit answer for current question, update theta ability, and evaluate misconception
 * @route POST /api/adaptive/submit
 */
export const submitAnswer = async (req, res) => {
  try {
    const {
      sessionId,
      questionId,
      questionText,
      selectedOptionIndex,
      timeTakenSeconds = 0,
      selectionReason = "",
    } = req.body;

    const session = await AdaptiveSession.findById(sessionId);
    if (!session || session.status === "completed") {
      return res.status(400).json({ success: false, message: "Invalid or completed session." });
    }

    // Prevent duplicate submission of the same question in this session
    const alreadySubmitted = session.attempts.find(
      (a) => String(a.questionId) === String(questionId) || a.questionText === questionText
    );
    if (alreadySubmitted) {
      return res.status(200).json({
        success: true,
        alreadySubmitted: true,
        isCorrect: alreadySubmitted.isCorrect,
        correctAnswerIndex: alreadySubmitted.correctAnswerIndex,
        explanation: alreadySubmitted.explanation,
        misconception: alreadySubmitted.misconception,
      });
    }

    // Resolve authoritative question data
    const { getSubjectQuestionsPool } = await import("../services/adaptiveAssessmentService.js");
    const pool = await getSubjectQuestionsPool(session.subject);
    const resolvedQuestion =
      pool.find((q) => String(q._id) === String(questionId) || q.questionText === questionText) || pool[0];

    // Evaluate answer outcome & misconception
    const analysis = analyzeAttemptOutcome(
      resolvedQuestion,
      Number(selectedOptionIndex),
      Number(timeTakenSeconds)
    );

    const thetaBefore = session.currentTheta;
    const thetaAfter = updateThetaAbility(
      session.currentTheta,
      analysis.isCorrect,
      resolvedQuestion.difficulty || session.currentDifficulty,
      session.attempts.length + 1
    );

    session.currentTheta = thetaAfter;

    // Record attempt
    session.attempts.push({
      questionId: resolvedQuestion._id || new mongoose.Types.ObjectId(),
      questionText: resolvedQuestion.questionText,
      options: resolvedQuestion.options,
      correctAnswerIndex: resolvedQuestion.correctAnswerIndex,
      selectedOptionIndex: Number(selectedOptionIndex),
      isCorrect: analysis.isCorrect,
      difficulty: resolvedQuestion.difficulty || "medium",
      topic: resolvedQuestion.topic || "Core Concept",
      subtopic: resolvedQuestion.subtopic || "",
      timeTakenSeconds: Number(timeTakenSeconds),
      explanation: analysis.explanation,
      selectionReason,
      conceptEvaluated: analysis.conceptEvaluated,
      misconception: analysis.misconception,
      thetaBefore,
      thetaAfter,
    });

    // Determine next calibrated difficulty
    const nextDifficulty = determineTargetDifficulty(
      session.currentTheta,
      session.attempts,
      session.mode
    );
    session.currentDifficulty = nextDifficulty;

    await session.save();

    res.status(200).json({
      success: true,
      isCorrect: analysis.isCorrect,
      correctAnswerIndex: resolvedQuestion.correctAnswerIndex,
      explanation: analysis.explanation,
      conceptEvaluated: analysis.conceptEvaluated,
      misconception: analysis.misconception,
      thetaBefore,
      thetaAfter,
      nextDifficulty,
      isSessionComplete: session.attempts.length >= session.targetQuestionCount,
    });
  } catch (error) {
    console.error("Adaptive submitAnswer Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Finalize adaptive session, compute IRT theta, topic mastery breakdown, and save TestResult
 * @route POST /api/adaptive/end
 */
export const endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await AdaptiveSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found." });
    }

    const evaluation = evaluateCompletedSession(session);

    session.accuracy = evaluation.accuracy;
    session.speedAvgSeconds = evaluation.speedAvgSeconds;
    session.totalTimeTakenSeconds = evaluation.totalTimeTakenSeconds;
    session.masteryPercentage = evaluation.masteryPercentage;
    session.scoreEarned = evaluation.scoreEarned;
    session.xpAwarded = evaluation.xpAwarded;
    session.weakTopics = evaluation.weakTopics;
    session.strongTopics = evaluation.strongTopics;
    session.recommendedNextTopics = evaluation.recommendedNextTopics;
    session.topicMasteryBreakdown = evaluation.topicMasteryBreakdown;
    session.misunderstandingAnalysis = evaluation.misunderstandingAnalysis;
    session.aiSummaryFeedback = evaluation.aiSummaryFeedback;
    session.status = "completed";

    await session.save();

    // 1. Sync with TopicProgress
    for (const tm of session.topicMasteryBreakdown) {
      try {
        await TopicProgress.findOneAndUpdate(
          { user: session.user, topicId: tm.topic },
          {
            $set: {
              masteryPercentage: tm.masteryScore,
              masteryStatus: tm.status === "mastered" ? "strong" : tm.status === "proficient" ? "needs_practice" : "weak",
            },
          },
          { upsert: true }
        );
      } catch (err) {
        // Continue loop
      }
    }

    // 2. Persist to standard TestResult collection to preserve history across the platform
    try {
      const topicBreakdownObj = {};
      session.topicMasteryBreakdown.forEach((tm) => {
        topicBreakdownObj[tm.topic] = {
          correct: tm.correctCount,
          total: tm.attemptsCount,
          wrong: tm.attemptsCount - tm.correctCount,
          attempted: tm.attemptsCount,
        };
      });

      await TestResult.create({
        user: session.user,
        subject: session.subject,
        topic: `Adaptive: ${session.mode.replace("_", " ").toUpperCase()}`,
        score: evaluation.scoreEarned,
        totalQuestions: session.attempts.length,
        correctAnswers: session.attempts.filter((a) => a.isCorrect).length,
        wrongAnswers: session.attempts.filter((a) => !a.isCorrect).length,
        accuracy: evaluation.accuracy,
        timeTakenSeconds: evaluation.totalTimeTakenSeconds,
        topicBreakdown: topicBreakdownObj,
        weakTopics: evaluation.weakTopics,
        strongTopics: evaluation.strongTopics,
        aiEvaluation: evaluation.aiSummaryFeedback,
      });
    } catch (testResultErr) {
      console.warn("Could not persist to TestResult:", testResultErr.message);
    }

    res.status(200).json({
      success: true,
      session,
      evaluation,
    });
  } catch (error) {
    console.error("Adaptive endSession Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get student's adaptive assessment history and mastery trends
 * @route GET /api/adaptive/history
 */
export const getAdaptiveHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const sessions = await AdaptiveSession.find({ user: userId, status: "completed" })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
