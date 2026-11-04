import express from "express";
import multer from "multer";
import protect from "../middleware/auth.js";
import {
  getPYQDashboardMetrics,
  uploadAndProcessPaper,
  getPYQQuestions,
  updatePYQQuestion,
  getAIExamAnswer,
  getRepeatedQuestions,
  generateMockPaper,
  chatWithPYQs,
  deletePYQPaper,
} from "../controllers/pyqIntelligenceController.js";

const router = express.Router();

// Memory storage for multer to parse buffers directly with pdf-parse and tesseract
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max limit
});

// All endpoints protected with student JWT/Clerk authentication
router.get("/dashboard", protect, getPYQDashboardMetrics);
router.post("/upload", protect, upload.single("file"), uploadAndProcessPaper);
router.get("/questions", protect, getPYQQuestions);
router.patch("/questions/:questionId", protect, updatePYQQuestion);
router.post("/questions/:questionId/solution", protect, getAIExamAnswer);
router.get("/repeated", protect, getRepeatedQuestions);
router.post("/mock-paper/generate", protect, generateMockPaper);
router.post("/chat", protect, chatWithPYQs);
router.delete("/papers/:paperId", protect, deletePYQPaper);

export default router;
