import express from "express";
import protect, { optionalAuth } from "../middleware/auth.js";
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
  generateUnitRoadmap,
  searchCurriculum,
  askLearningCompanion,
  evaluateStudentAnswer,
  generateExamAnswer,
  generateRevisionNotes,
  getBookmarks,
  toggleBookmark,
  updateTopicMastery,
} from "../controllers/learningController.js";
import {
  getTopicVideo,
  updateVideoProgress,
  addVideoBookmark,
  getSubjectVideoStats,
} from "../controllers/videoLearningController.js";

const router = express.Router();

// Search across curriculum
router.get("/search", optionalAuth, searchCurriculum);

// Video Learning & Progress APIs (Inside My Learning)
router.get("/topics/:topicId/video", optionalAuth, getTopicVideo);
router.post("/topics/:topicId/video/progress", protect, updateVideoProgress);
router.post("/topics/:topicId/video/bookmark", protect, addVideoBookmark);
router.get("/subjects/:subjectId/video-stats", protect, getSubjectVideoStats);

// Public / optional-auth routes for viewing curriculum
router.get("/subjects", optionalAuth, getSubjects);
router.get("/subjects/:subjectId", optionalAuth, getSubjectHierarchy);
router.get("/topics/:topicId", optionalAuth, getTopicContent);

// Unit Dynamic AI Roadmap generator
router.post("/units/:unitId/roadmap", protect, generateUnitRoadmap);

// Student progress & completion actions
router.post("/topics/:topicId/read", protect, markTopicRead);
router.post("/topics/:topicId/complete", protect, markTopicCompleted);
router.post("/topics/:topicId/mastery", protect, updateTopicMastery);

// Topic-specific quiz & evaluation
router.get("/topics/:topicId/quiz", protect, getTopicQuiz);
router.post("/topics/:topicId/quiz/submit", protect, submitTopicQuiz);

// Student Dashboard analytics & recommendation engine
router.get("/student/dashboard-summary", protect, getStudentLearningSummary);

// Faculty analytics
router.get("/faculty/analytics", protect, getFacultyLearningAnalytics);

// AI Learning Companion & Voice Teacher
router.post("/companion", optionalAuth, askLearningCompanion);
router.post("/evaluate-answer", optionalAuth, evaluateStudentAnswer);

// Exam Answer Generator & Revision Notes
router.post("/exam-answer", optionalAuth, generateExamAnswer);
router.post("/revision-notes", optionalAuth, generateRevisionNotes);

// Learning Bookmarks
router.get("/bookmarks", protect, getBookmarks);
router.post("/bookmarks/toggle", protect, toggleBookmark);

export default router;
