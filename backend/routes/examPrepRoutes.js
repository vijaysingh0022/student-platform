import express from "express";
import {
  getExamFilters,
  getExamQuestions,
  submitExamAttempt,
  getExamHistory,
  generateAIExamQuestions,
} from "../controllers/examPrepController.js";
import {
  askExamCopilot,
  getMistakeBook,
  toggleMistakeBookItem,
  evaluateSimilarQuestion,
} from "../controllers/examCopilotController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/filters", getExamFilters);
router.get("/questions", getExamQuestions);
router.post("/submit", protect, submitExamAttempt);
router.get("/history", protect, getExamHistory);
router.post("/generate-ai", protect, generateAIExamQuestions);

// AI Exam Copilot Endpoints
router.post("/copilot/ask", protect, askExamCopilot);
router.get("/copilot/mistake-book", protect, getMistakeBook);
router.post("/copilot/mistake-book", protect, toggleMistakeBookItem);
router.post("/copilot/evaluate-similar", protect, evaluateSimilarQuestion);

export default router;
