import express from "express";
import protect from "../middleware/auth.js";
import {
  getRewardsOverviewHandler,
  getRewardHistoryHandler,
  getBadgesHandler,
  getChallengesHandler,
  startChallengeHandler,
  recordActivityRewardHandler,
  getStreakHandler,
  getWeeklyGoalHandler,
  updateSettingsHandler,
} from "../controllers/rewardController.js";

const router = express.Router();

// All reward endpoints require student authentication
router.use(protect);

router.get("/", getRewardsOverviewHandler);
router.get("/history", getRewardHistoryHandler);
router.get("/badges", getBadgesHandler);
router.get("/challenges", getChallengesHandler);
router.post("/challenges/:id/start", startChallengeHandler);
router.post("/activity", recordActivityRewardHandler);
router.get("/streak", getStreakHandler);
router.get("/weekly-goal", getWeeklyGoalHandler);
router.patch("/settings", updateSettingsHandler);

export default router;
