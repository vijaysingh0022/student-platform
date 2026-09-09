import express from "express";
import protect from "../middleware/auth.js";
import {
  getClassOverview,
  getWeakTopicsAnalytics,
  getAtRiskStudents,
  getStudentDirectory,
  getStudentDrilldown,
  getInstitutionAnalytics,
  generateAIInstitutionalReport,
  generateRemedialPlan,
} from "../controllers/institutionController.js";

const router = express.Router();

router.get("/overview", protect, getClassOverview);
router.get("/weak-topics", protect, getWeakTopicsAnalytics);
router.get("/at-risk", protect, getAtRiskStudents);
router.get("/students", protect, getStudentDirectory);
router.get("/students/:id", protect, getStudentDrilldown);
router.get("/analytics", protect, getInstitutionAnalytics);
router.post("/generate-ai-report", protect, generateAIInstitutionalReport);
router.post("/generate-remedial-plan", protect, generateRemedialPlan);

export default router;
