import express from "express";
import protect from "../middleware/auth.js";
import {
  getProblems,
  getCodingStats,
  runCode,
  submitCode,
  codingCopilot,
  getSubmissions,
  getBookmarks,
  toggleBookmark,
  getCodingMistakes,
  debugCode,
  generateTestCases,
} from "../controllers/codingController.js";

const router = express.Router();

router.get("/problems", protect, getProblems);
router.get("/stats", protect, getCodingStats);
router.post("/run", protect, runCode);
router.post("/submit", protect, submitCode);
router.post("/copilot", protect, codingCopilot);
router.get("/submissions", protect, getSubmissions);
router.get("/bookmarks", protect, getBookmarks);
router.post("/bookmarks", protect, toggleBookmark);
router.get("/mistakes", protect, getCodingMistakes);
router.post("/debug", protect, debugCode);
router.post("/generate-testcases", protect, generateTestCases);

export default router;
