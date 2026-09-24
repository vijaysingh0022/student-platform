import express from "express";
import protect from "../middleware/auth.js";
import {
  startInterview,
  submitAnswerAndGetFollowUp,
  submitFollowUpAnswer,
  completeInterview,
  getInterviewHistory,
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/start", protect, startInterview);
router.post("/:id/answer", protect, submitAnswerAndGetFollowUp);
router.post("/:id/follow-up-answer", protect, submitFollowUpAnswer);
router.post("/:id/complete", protect, completeInterview);
router.get("/history", protect, getInterviewHistory);

export default router;
