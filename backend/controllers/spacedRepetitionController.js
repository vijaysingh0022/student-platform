import {
  getRevisionDashboardData,
  generateRevisionSession,
  recordRevisionResult,
  enrollTopicInSpacedRepetition,
} from "../services/spacedRepetitionService.js";

/**
 * @route GET /api/learning/revision/dashboard
 * @desc Fetch Spaced Repetition metrics, due/overdue queues, weekly activity, and retention
 */
export const getRevisionDashboard = async (req, res) => {
  try {
    const userId = req.user?._id;
    const data = await getRevisionDashboardData(userId);
    res.json({
      success: true,
      ...data,
    });
  } catch (err) {
    console.error("getRevisionDashboard error:", err);
    res.status(500).json({ message: "Failed to load revision dashboard." });
  }
};

/**
 * @route GET /api/learning/revision/session/:topicId
 * @desc Generate an active revision session (flashcards, MCQs, recall challenge) for a topic
 */
export const getTopicRevisionSession = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { topicId } = req.params;

    if (!topicId) {
      return res.status(400).json({ message: "topicId is required." });
    }

    const session = await generateRevisionSession(userId, topicId);
    res.json({
      success: true,
      session,
    });
  } catch (err) {
    console.error("getTopicRevisionSession error:", err);
    res.status(500).json({ message: "Failed to generate revision session." });
  }
};

/**
 * @route POST /api/learning/revision/submit
 * @desc Record the outcome of a revision session, adapt interval, update retention score
 */
export const submitRevisionSession = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { topicId, sessionId, score, totalQuestions, performanceRating, answers } = req.body;

    if (!topicId) {
      return res.status(400).json({ message: "topicId is required." });
    }

    const result = await recordRevisionResult(userId, {
      topicId,
      sessionId,
      score: Number(score) || 0,
      totalQuestions: Number(totalQuestions) || 0,
      performanceRating: performanceRating !== undefined ? Number(performanceRating) : undefined,
      answers: Array.isArray(answers) ? answers : [],
    });

    res.json(result);
  } catch (err) {
    console.error("submitRevisionSession error:", err);
    res.status(500).json({ message: "Failed to submit revision results." });
  }
};

/**
 * @route POST /api/learning/revision/enroll
 * @desc Manually or programmatically enroll any topic into the spaced repetition schedule
 */
export const enrollTopic = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { topicId, subjectId } = req.body;

    if (!topicId) {
      return res.status(400).json({ message: "topicId is required." });
    }

    const item = await enrollTopicInSpacedRepetition(userId, { topicId, subjectId });
    res.json({
      success: true,
      message: "Topic successfully enrolled in Spaced Repetition schedule.",
      item,
    });
  } catch (err) {
    console.error("enrollTopic error:", err);
    res.status(500).json({ message: "Failed to enroll topic in spaced repetition." });
  }
};
