import express from "express";
import protect from "../middleware/auth.js";
import {
  getSubjects,
  getSubjectHierarchy,
  getTopicContent,
  markTopicRead,
  markTopicCompleted,
  getTopicQuiz,
  submitTopicQuiz,
  getStudentLearningSummary,
  getFacultyLearningAnalytics,
} from "../controllers/learningController.js";

const router = express.Router();

// Public / optional-auth routes for viewing curriculum
router.get("/subjects", protect, getSubjects);
router.get("/subjects/:subjectId", protect, getSubjectHierarchy);
router.get("/topics/:topicId", protect, getTopicContent);

// Student progress & completion actions
router.post("/topics/:topicId/read", protect, markTopicRead);
router.post("/topics/:topicId/complete", protect, markTopicCompleted);

// Topic-specific quiz & evaluation
router.get("/topics/:topicId/quiz", protect, getTopicQuiz);
router.post("/topics/:topicId/quiz/submit", protect, submitTopicQuiz);

// Student Dashboard analytics & recommendation engine
router.get("/student/dashboard-summary", protect, getStudentLearningSummary);

// Faculty analytics
router.get("/faculty/analytics", protect, getFacultyLearningAnalytics);

export default router;
