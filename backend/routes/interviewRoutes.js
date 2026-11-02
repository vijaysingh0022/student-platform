import express from "express";
import protect from "../middleware/auth.js";
import {
  getInterviewRecommendations,
  startInterview,
  getQuestionHint,
  submitAnswerAndGetFollowUp,
  submitFollowUpAnswer,
  completeInterview,
  chatWithCoach,
  deleteInterview,
  getInterviewHistory,
} from "../controllers/interviewController.js";

const router = express.Router();

router.get("/recommendations", protect, getInterviewRecommendations);
router.post("/start", protect, startInterview);
router.post("/:id/hint", protect, getQuestionHint);
router.post("/:id/answer", protect, submitAnswerAndGetFollowUp);
router.post("/:id/follow-up-answer", protect, submitFollowUpAnswer);
router.post("/:id/complete", protect, completeInterview);
router.post("/:id/coach-chat", protect, chatWithCoach);
router.delete("/:id", protect, deleteInterview);
router.get("/history", protect, getInterviewHistory);

export default router;
