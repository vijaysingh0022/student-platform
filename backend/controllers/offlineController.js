import Question from "../models/Question.js";
import TestResult from "../models/TestResult.js";
import User from "../models/User.js";
import { OFFLINE_STUDY_PACKS } from "../seed/placementQuestionsData.js";


// 1. GET /api/offline/content-bundle
export const getOfflineBundle = async (req, res) => {
  try {
    const { subject = "All" } = req.query;

    let questionsQuery = {};
    if (subject && subject !== "All") {
      questionsQuery.subject = subject;
    }

    const questions = await Question.find(questionsQuery);

    let packs = [];
    if (subject === "All") {
      packs = Object.values(OFFLINE_STUDY_PACKS);
    } else if (OFFLINE_STUDY_PACKS[subject]) {
      packs = [OFFLINE_STUDY_PACKS[subject]];
    } else {
      packs = Object.values(OFFLINE_STUDY_PACKS);
    }

    res.json({
      bundleVersion: "2026.1",
      downloadedAt: new Date().toISOString(),
      totalQuestions: questions.length,
      questions: questions.map((q) => ({
        id: q._id,
        subject: q.subject,
        topic: q.topic,
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
      })),
      studyPacks: packs,
    });
  } catch (error) {
    res.status(500).json({ message: "Error downloading offline content bundle", error: error.message });
  }
};

// 2. POST /api/offline/sync-batch
export const syncOfflineBatch = async (req, res) => {
  try {
    const { tests = [] } = req.body;
    if (!Array.isArray(tests) || tests.length === 0) {
      return res.status(400).json({ message: "No offline test records provided to sync." });
    }

    const syncedResults = [];

    for (const item of tests) {
      const {
        subject,
        totalQuestions,
        correctAnswers,
        scorePercent,
        topicBreakdown,
        completedAt,
        offlineAttemptId,
      } = item;

      if (!subject || scorePercent === undefined) continue;

      const created = await TestResult.create({
        user: req.user._id,
        subject,
        totalQuestions: totalQuestions || 10,
        correctAnswers: correctAnswers || 0,
        scorePercent,
        topicBreakdown: topicBreakdown || {},
        createdAt: completedAt ? new Date(completedAt) : new Date(),
      });

      syncedResults.push({
        offlineAttemptId,
        serverId: created._id,
        subject: created.subject,
        scorePercent: created.scorePercent,
        syncedAt: new Date().toISOString(),
      });
    }

    res.json({
      message: `Successfully synchronized ${syncedResults.length} offline assessment records.`,
      syncedCount: syncedResults.length,
      syncedResults,
    });
  } catch (error) {
    res.status(500).json({ message: "Error synchronizing offline records", error: error.message });
  }
};
