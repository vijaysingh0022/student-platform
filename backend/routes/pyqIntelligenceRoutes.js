import express from "express";
import multer from "multer";
import protect from "../middleware/auth.js";
import {
  getPYQDashboard,
  uploadPYQPapers,
  getPaperStatus,
  getPYQQuestions,
  updatePYQQuestion,
  getRepeatedQuestionsIntelligence,
  getPYQAnalytics,
  generatePYQAnswer,
  generateSimilarPracticeQuestions,
  generateUniversityMockPaper,
  chatWithPYQPapers,
  deletePYQPaper,
} from "../controllers/pyqIntelligenceController.js";

const router = express.Router();

// Configure Multer for PDF and image uploads in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max file size
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(pdf|png|jpg|jpeg|webp)$/i)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format. Please upload PDF or image files."));
    }
  },
});

// All routes are protected by user authentication
router.use(protect);

// Dashboard & Upload
router.get("/dashboard", getPYQDashboard);
router.post("/upload", upload.array("papers", 10), uploadPYQPapers);
router.get("/papers/:paperId/status", getPaperStatus);
router.delete("/papers/:paperId", deletePYQPaper);

// Extracted Questions & Syllabus
router.get("/questions", getPYQQuestions);
router.patch("/questions/:questionId", updatePYQQuestion);

// Repeated Questions & Analytics
router.get("/repeated", getRepeatedQuestionsIntelligence);
router.get("/analytics", getPYQAnalytics);

// AI Answer Studio & Similar Practice
router.post("/questions/:questionId/answer", generatePYQAnswer);
router.post("/questions/:questionId/generate-practice", generateSimilarPracticeQuestions);

// Mock Paper & AI Chat
router.post("/mock-paper/generate", generateUniversityMockPaper);
router.post("/chat", chatWithPYQPapers);

export default router;
