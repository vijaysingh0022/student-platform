import PersonalLearningTwin from "../models/PersonalLearningTwin.js";
import {
  computeStudentLearningTwin,
  simulatePersonalizedPlan,
} from "../services/personalLearningTwinService.js";

/**
 * @desc Get or compute student's Personal Learning Twin profile
 * @route GET /api/learning-twin
 */
export const getLearningTwinProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    let twin = await PersonalLearningTwin.findOne({ user: userId });

    if (!twin) {
      const computed = await computeStudentLearningTwin(userId);
      twin = await PersonalLearningTwin.create({
        user: userId,
        ...computed,
      });
    }

    res.status(200).json({
      success: true,
      twin,
    });
  } catch (error) {
    console.error("Get Learning Twin Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Recalculate student learning twin with latest platform signals
 * @route POST /api/learning-twin/recalculate
 */
export const recalculateLearningTwinProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const computed = await computeStudentLearningTwin(userId);

    const updated = await PersonalLearningTwin.findOneAndUpdate(
      { user: userId },
      { $set: { ...computed, lastRecalculatedAt: new Date() } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      twin: updated,
    });
  } catch (error) {
    console.error("Recalculate Learning Twin Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Simulate hypothetical learning plan
 * @route POST /api/learning-twin/simulate
 */
export const simulateLearningPlan = async (req, res) => {
  try {
    const { currentMastery = 50, dailyStudyMinutes = 30, durationDays = 30, targetSubject = "DSA" } = req.body;

    const simulation = simulatePersonalizedPlan({
      currentMastery,
      dailyStudyMinutes,
      durationDays,
      targetSubject,
    });

    res.status(200).json({
      success: true,
      simulation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
