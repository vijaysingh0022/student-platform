import express from "express";
import multer from "multer";
import {
  generateQuizHandler,
  evaluateQuizHandler,
  getQuizByIdHandler,
  getRecentQuizzesHandler,
} from "../controllers/quizController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max for presentations, docs, audio/transcripts
});

// GET /api/quiz/recent
router.get("/recent", getRecentQuizzesHandler);

// GET /api/quiz/:quizId
router.get("/:quizId", getQuizByIdHandler);

// POST /api/quiz/generate
router.post("/generate", upload.single("file"), generateQuizHandler);

// POST /api/quiz/evaluate
router.post("/evaluate", evaluateQuizHandler);

export default router;
