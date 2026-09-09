import express from "express";
import multer from "multer";
import protect from "../middleware/auth.js";
import {
  getCareerDashboard,
  updateTargetRole,
  analyzeResume,
  uploadAndAnalyzeResume,
  optimizeResumeBullet,
  evaluateMockAnswer,
  generateMockQuestion
} from "../controllers/careerController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.get("/dashboard", protect, getCareerDashboard);
router.post("/update-role", protect, updateTargetRole);
router.post("/analyze-resume", protect, analyzeResume);
router.post("/upload-resume", protect, upload.single("resumeFile"), uploadAndAnalyzeResume);
router.post("/optimize-bullet", protect, optimizeResumeBullet);
router.post("/evaluate-mock", protect, evaluateMockAnswer);
router.post("/generate-question", protect, generateMockQuestion);

export default router;
