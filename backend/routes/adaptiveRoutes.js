import express from "express";
import protect from "../middleware/auth.js";
import {
  startSession,
  nextQuestion,
  submitAnswer,
  endSession,
  getAdaptiveHistory,
} from "../controllers/adaptiveController.js";

const router = express.Router();

router.post("/start", protect, startSession);
router.post("/next", protect, nextQuestion);
router.post("/submit", protect, submitAnswer);
router.post("/end", protect, endSession);
router.get("/history", protect, getAdaptiveHistory);

export default router;
