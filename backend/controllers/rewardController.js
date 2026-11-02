import {
  getRewardsOverview,
  awardXP,
  getLevelInfo,
  ensureUserRewardProfile,
} from "../services/rewardService.js";
import RewardTransaction from "../models/RewardTransaction.js";
import UserBadge from "../models/UserBadge.js";
import UserChallenge from "../models/UserChallenge.js";
import LearningStreak from "../models/LearningStreak.js";

// 1. GET /api/rewards
export const getRewardsOverviewHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    const overview = await getRewardsOverview(userId);
    res.json({ success: true, data: overview });
  } catch (error) {
    console.error("getRewardsOverview error:", error);
    res.status(500).json({ message: "Failed to fetch rewards overview", error: error.message });
  }
};

// 2. GET /api/rewards/history?type=All|XP|BADGE|CHALLENGE|STREAK
export const getRewardHistoryHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type = "All" } = req.query;

    const query = { user: userId };
    if (type !== "All") {
      query.type = type.toUpperCase();
    }

    const transactions = await RewardTransaction.find(query)
      .sort({ timestamp: -1 })
      .limit(50);

    const formatted = transactions.map((tx) => {
      const diffMs = Date.now() - new Date(tx.timestamp).getTime();
      const diffMins = Math.floor(diffMs / (60 * 1000));
      const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
      let timeAgo = "Just now";
      if (diffMins < 60) timeAgo = `${Math.max(1, diffMins)} min ago`;
      else if (diffHours < 24) timeAgo = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      else timeAgo = `${Math.floor(diffHours / 24)} day ago`;

      return {
        id: tx._id,
        amount: tx.amount,
        description: tx.description,
        type: tx.type,
        source: tx.source,
        timestamp: tx.timestamp,
        timeAgo,
        icon:
          tx.type === "BADGE"
            ? "🛡️"
            : tx.type === "STREAK"
            ? "🔥"
            : tx.type === "CHALLENGE"
            ? "🎯"
            : "</>",
      };
    });

    res.json({ success: true, transactions: formatted });
  } catch (error) {
    console.error("getRewardHistory error:", error);
    res.status(500).json({ message: "Failed to fetch reward history", error: error.message });
  }
};

// 3. GET /api/rewards/badges
export const getBadgesHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    await ensureUserRewardProfile(userId);
    const badges = await UserBadge.find({ user: userId });
    res.json({ success: true, badges });
  } catch (error) {
    console.error("getBadges error:", error);
    res.status(500).json({ message: "Failed to fetch badges", error: error.message });
  }
};

// 4. GET /api/rewards/challenges
export const getChallengesHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    await ensureUserRewardProfile(userId);
    const todayStr = new Date().toISOString().split("T")[0];
    const challenges = await UserChallenge.find({ user: userId, date: todayStr });
    res.json({ success: true, challenges });
  } catch (error) {
    console.error("getChallenges error:", error);
    res.status(500).json({ message: "Failed to fetch challenges", error: error.message });
  }
};

// 5. POST /api/rewards/challenges/:id/start
export const startChallengeHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const challenge = await UserChallenge.findOne({ user: userId, _id: id });
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    challenge.status = "active";
    await challenge.save();

    res.json({
      success: true,
      message: "Challenge started! Navigate to activity.",
      actionRoute: challenge.actionRoute,
    });
  } catch (error) {
    console.error("startChallenge error:", error);
    res.status(500).json({ message: "Failed to start challenge", error: error.message });
  }
};

// 6. POST /api/rewards/activity
// Secure, server-side validated endpoint to award XP for genuine learning achievements
export const recordActivityRewardHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    const { activityType, sourceId, title, scorePercent, questionsCount } = req.body;

    if (!activityType || !sourceId) {
      return res.status(400).json({ message: "activityType and sourceId are required" });
    }

    // Determine legitimate XP amount based on real activity type
    let amount = 0;
    let description = title || "Learning Activity Completed";
    let rewardType = "XP";
    let source = "TOPIC_COMPLETED";

    if (activityType === "topic_completed") {
      source = "TOPIC_COMPLETED";
      amount = 50;
      description = `${title || "Topic"} completed`;
    } else if (activityType === "quiz_completed") {
      source = "QUIZ_COMPLETED";
      amount = scorePercent && scorePercent >= 90 ? 50 : 30;
      description = `${title || "Quiz"} completed (${scorePercent || 80}% score)`;
    } else if (activityType === "coding_solved") {
      source = "CODING_SOLVED";
      amount = 40;
      description = `Solved problem: ${title || "Coding Challenge"}`;
    } else if (activityType === "mock_interview") {
      source = "MOCK_INTERVIEW_COMPLETED";
      amount = 60;
      description = `Completed Mock Interview: ${title || "Technical Round"}`;
    } else if (activityType === "offline_sync") {
      source = "OFFLINE_SYNC_COMPLETED";
      amount = 25;
      description = `Synced offline learning records`;
    } else {
      return res.status(400).json({ message: "Invalid learning activity type" });
    }

    const result = await awardXP(userId, {
      amount,
      source,
      sourceId,
      description,
      type: rewardType,
    });

    if (result.duplicate) {
      return res.json({
        success: false,
        duplicate: true,
        message: result.message,
        awardedXP: 0,
      });
    }

    res.json({
      success: true,
      awardedXP: amount,
      totalXP: result.totalXP,
      levelInfo: result.levelInfo,
      newlyUnlockedBadge: result.newlyUnlockedBadge,
      message: `🎉 +${amount} XP: ${description}`,
    });
  } catch (error) {
    console.error("recordActivityReward error:", error);
    res.status(500).json({ message: "Error awarding reward", error: error.message });
  }
};

// 7. GET /api/rewards/streak
export const getStreakHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    await ensureUserRewardProfile(userId);
    const streak = await LearningStreak.findOne({ user: userId });
    res.json({ success: true, streak });
  } catch (error) {
    console.error("getStreak error:", error);
    res.status(500).json({ message: "Failed to fetch streak", error: error.message });
  }
};

// 8. GET /api/rewards/weekly-goal
export const getWeeklyGoalHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    await ensureUserRewardProfile(userId);
    const streak = await LearningStreak.findOne({ user: userId });
    res.json({
      success: true,
      weeklyGoal: {
        targetXP: streak?.weeklyGoalXP || 300,
        currentXP: streak?.earnedThisWeekXP || 180,
        daysLeft: 3,
        tasks: [
          { title: "Complete 2 more topics", completed: false },
          { title: "Solve 10 practice questions", completed: false },
          { title: "Maintain your daily streak", completed: true },
        ],
        recommendedActivitiesRoute: "/learn",
      },
    });
  } catch (error) {
    console.error("getWeeklyGoal error:", error);
    res.status(500).json({ message: "Failed to fetch weekly goal", error: error.message });
  }
};

// 9. PATCH /api/rewards/settings
export const updateSettingsHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    const { settings } = req.body;
    const streak = await LearningStreak.findOne({ user: userId });
    if (streak && settings) {
      streak.settings = { ...streak.settings, ...settings };
      await streak.save();
    }
    res.json({ success: true, settings: streak?.settings });
  } catch (error) {
    console.error("updateSettings error:", error);
    res.status(500).json({ message: "Failed to update settings", error: error.message });
  }
};
