import express from "express";
import protect from "../middleware/auth.js";
import {
  getProblems,
  runCode,
  submitCode,
  debugCode,
  generateTestCases,
} from "../controllers/codingController.js";

const router = express.Router();

router.get("/problems", protect, getProblems);
router.post("/run", protect, runCode);
router.post("/submit", protect, submitCode);
router.post("/debug", protect, debugCode);
router.post("/generate-testcases", protect, generateTestCases);

export default router;
