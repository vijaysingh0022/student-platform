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
    const { tests = [], topicsCompleted = [], bookmarks = [] } = req.body;
    const userId = req.user?._id;

    if ((!tests || tests.length === 0) && (!topicsCompleted || topicsCompleted.length === 0) && (!bookmarks || bookmarks.length === 0)) {
      return res.status(400).json({ message: "No offline learning records provided to sync." });
    }

    const syncedResults = [];

    // 1. Sync offline test attempts safely
    for (const item of (tests || [])) {
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

      // Duplicate prevention: check if test with this offlineAttemptId was already recorded
      let existing = null;
      if (offlineAttemptId) {
        existing = await TestResult.findOne({ user: userId, notes: offlineAttemptId }).lean();
      }

      if (existing) {
        syncedResults.push({
          offlineAttemptId,
          serverId: existing._id,
          subject: existing.subject,
          scorePercent: existing.scorePercent,
          syncedAt: new Date().toISOString(),
          status: "already_synced",
        });
        continue;
      }

      const created = await TestResult.create({
        user: userId,
        subject,
        totalQuestions: totalQuestions || 10,
        correctAnswers: correctAnswers || 0,
        scorePercent,
        topicBreakdown: topicBreakdown || {},
        notes: offlineAttemptId || `offline_${Date.now()}`,
        createdAt: completedAt ? new Date(completedAt) : new Date(),
      });

      syncedResults.push({
        offlineAttemptId,
        serverId: created._id,
        subject: created.subject,
        scorePercent: created.scorePercent,
        syncedAt: new Date().toISOString(),
        status: "created",
      });

      // Award XP for newly synced test attempt (anti-duplication guaranteed by offlineAttemptId)
      try {
        const { awardXP } = await import("../services/rewardService.js");
        await awardXP(userId, {
          amount: scorePercent >= 90 ? 50 : 30,
          source: "QUIZ_COMPLETED",
          sourceId: offlineAttemptId || `quiz_${created._id}`,
          description: `Offline ${created.subject} Quiz Synced (${scorePercent}%)`,
          type: "XP",
        });
      } catch (rewardErr) {
        // Silently continue if duplicate or error
      }
    }

    // 2. Sync offline topic completions
    const TopicProgress = (await import("../models/TopicProgress.js")).default;
    const Topic = (await import("../models/Topic.js")).default;
    const syncedTopics = [];

    for (const t of (topicsCompleted || [])) {
      if (!t.topicId) continue;
      const topicDoc = await Topic.findOne({ topicId: t.topicId }).lean();
      await TopicProgress.findOneAndUpdate(
        { user: userId, topicId: t.topicId },
        {
          $set: {
            subjectId: topicDoc?.subjectId || t.subjectId || "dsa",
            unitId: topicDoc?.unitId || t.unitId,
            chapterId: topicDoc?.chapterId || t.chapterId,
            isRead: true,
            isCompleted: true,
            completedAt: t.completedAt ? new Date(t.completedAt) : new Date(),
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      syncedTopics.push(t.topicId);

      // Award XP for topic completion (anti-duplication by topicId)
      try {
        const { awardXP } = await import("../services/rewardService.js");
        await awardXP(userId, {
          amount: 50,
          source: "TOPIC_COMPLETED",
          sourceId: `topic_${t.topicId}`,
          description: `Offline completed: ${topicDoc?.title || t.topicId}`,
          type: "XP",
        });
      } catch (rewardErr) {
        // Anti-duplication will skip safely
      }
    }

    res.json({
      success: true,
      message: `Successfully synchronized ${syncedResults.length} assessment(s) and ${syncedTopics.length} topic(s). XP credited.`,
      syncedCount: syncedResults.length + syncedTopics.length,
      syncedResults,
      syncedTopics,
    });
  } catch (error) {
    console.error("Offline batch sync error:", error);
    res.status(500).json({ message: "Error synchronizing offline records", error: error.message });
  }
};
