import express from "express";
import protect from "../middleware/auth.js";
import {
  getQuestions,
  generateFreshQuestions,
  submitTest,
  getMyResults,
  getSkillGap,
  getSubjectStats,
  getTopicTestsHierarchy,
  getRecommendedTests,
} from "../controllers/testController.js";

const router = express.Router();

router.get("/subject-stats", protect, getSubjectStats);
router.get("/topics", protect, getTopicTestsHierarchy);
router.get("/topics/:subject", protect, getTopicTestsHierarchy);
router.get("/recommended", protect, getRecommendedTests);
router.get("/questions", protect, getQuestions);
router.get("/questions/:subject", protect, getQuestions);
router.post("/generate-questions", protect, generateFreshQuestions);
router.post("/submit", protect, submitTest);
router.get("/results", protect, getMyResults);
router.get("/skill-gap/:subject", protect, getSkillGap);

export default router;
