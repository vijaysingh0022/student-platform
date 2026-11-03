import express from "express";
import multer from "multer";
import protect from "../middleware/auth.js";
import {
  getCareerIntelligenceProfile,
  uploadAndAnalyzeFullResume,
  matchJobDescription,
  studioRewrite,
  saveResumeVersion,
  chatWithCareerCopilot,
  deleteResumeData,
} from "../controllers/careerIntelligenceController.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// All routes require authentication
router.use(protect);

router.get("/profile", getCareerIntelligenceProfile);
router.post("/analyze-file", upload.single("resumeFile"), uploadAndAnalyzeFullResume);
router.post("/match-job", matchJobDescription);
router.post("/studio-rewrite", studioRewrite);
router.post("/save-version", saveResumeVersion);
router.post("/copilot", chatWithCareerCopilot);
router.delete("/resume/:id", deleteResumeData);

export default router;
