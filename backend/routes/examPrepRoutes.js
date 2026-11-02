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
import {
  startExamInterview,
  evaluateInterviewTurn,
  submitFollowUpTurn,
  completeExamInterview,
} from "../controllers/examInterviewController.js";
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

// Real Interactive AI Interview & Learning System Endpoints
router.post("/copilot/interview/start", protect, startExamInterview);
router.post("/copilot/interview/:sessionId/evaluate-turn", protect, evaluateInterviewTurn);
router.post("/copilot/interview/:sessionId/submit-followup", protect, submitFollowUpTurn);
router.post("/copilot/interview/:sessionId/complete", protect, completeExamInterview);

export default router;
