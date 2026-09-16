import express from "express";
import protect from "../middleware/auth.js";
import {
  getQuestions,
  generateFreshQuestions,
  submitTest,
  getMyResults,
  getSkillGap,
} from "../controllers/testController.js";

const router = express.Router();

router.get("/questions/:subject", protect, getQuestions);
router.post("/generate-questions", protect, generateFreshQuestions);
router.post("/submit", protect, submitTest);
router.get("/results", protect, getMyResults);
router.get("/skill-gap/:subject", protect, getSkillGap);

export default router;
