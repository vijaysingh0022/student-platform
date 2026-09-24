import express from "express";
import {
  getExamFilters,
  getExamQuestions,
  submitExamAttempt,
  getExamHistory,
  generateAIExamQuestions,
} from "../controllers/examPrepController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/filters", getExamFilters);
router.get("/questions", getExamQuestions);
router.post("/submit", protect, submitExamAttempt);
router.get("/history", protect, getExamHistory);
router.post("/generate-ai", protect, generateAIExamQuestions);

export default router;
