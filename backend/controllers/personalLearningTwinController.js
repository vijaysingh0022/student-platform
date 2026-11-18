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

    if (!twin || !twin.intelligenceMetrics) {
      const computed = await computeStudentLearningTwin(userId);
      twin = await PersonalLearningTwin.findOneAndUpdate(
        { user: userId },
        { $set: computed },
        { new: true, upsert: true }
      );
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
    const {
      currentMastery = 50,
      dailyStudyMinutes = 30,
      durationDays = 30,
      targetSubject = "DSA",
      targetTopic = "All Topics",
    } = req.body;

    const simulation = simulatePersonalizedPlan({
      currentMastery,
      dailyStudyMinutes,
      durationDays,
      targetSubject,
      targetTopic,
    });

    res.status(200).json({
      success: true,
      simulation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Toggle complete task in daily action plan
 * @route POST /api/learning-twin/task/toggle
 */
export const toggleDailyPlanTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskId } = req.body;

    const twin = await PersonalLearningTwin.findOne({ user: userId });
    if (!twin) return res.status(404).json({ success: false, message: "Twin profile not found" });

    const task = twin.dailyActionPlan?.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date() : null;
      await twin.save();
    }

    res.status(200).json({
      success: true,
      dailyActionPlan: twin.dailyActionPlan,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Dismiss or resolve an intelligent learning insight
 * @route POST /api/learning-twin/insight/resolve
 */
export const resolveLearningInsight = async (req, res) => {
  try {
    const userId = req.user._id;
    const { insightId } = req.body;

    const twin = await PersonalLearningTwin.findOne({ user: userId });
    if (!twin) return res.status(404).json({ success: false, message: "Twin profile not found" });

    const insight = twin.insights?.find((i) => i.id === insightId);
    if (insight) {
      insight.isResolved = true;
      await twin.save();
    }

    res.status(200).json({
      success: true,
      insights: twin.insights,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
