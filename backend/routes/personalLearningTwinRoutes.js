import express from "express";
import protect from "../middleware/auth.js";
import {
  getLearningTwinProfile,
  recalculateLearningTwinProfile,
  simulateLearningPlan,
} from "../controllers/personalLearningTwinController.js";

const router = express.Router();

router.get("/", protect, getLearningTwinProfile);
router.post("/recalculate", protect, recalculateLearningTwinProfile);
router.post("/simulate", protect, simulateLearningPlan);

export default router;
