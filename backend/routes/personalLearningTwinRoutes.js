import express from "express";
import protect from "../middleware/auth.js";
import {
  getLearningTwinProfile,
  recalculateLearningTwinProfile,
  simulateLearningPlan,
  toggleDailyPlanTask,
  resolveLearningInsight,
} from "../controllers/personalLearningTwinController.js";

const router = express.Router();

router.get("/", protect, getLearningTwinProfile);
router.post("/recalculate", protect, recalculateLearningTwinProfile);
router.post("/simulate", protect, simulateLearningPlan);
router.post("/task/toggle", protect, toggleDailyPlanTask);
router.post("/insight/resolve", protect, resolveLearningInsight);

export default router;
