import express from "express";
import protect from "../middleware/auth.js";
import {
  getCareerTwin,
  refreshCareerTwin,
  updateSprintDay,
  updateCareerTwinRole,
  careerTwinChat,
  simulateImprovement,
} from "../controllers/careerTwinController.js";

const router = express.Router();

// All routes require authentication
router.get("/", protect, getCareerTwin);
router.post("/refresh", protect, refreshCareerTwin);
router.patch("/sprint/:day", protect, updateSprintDay);
router.patch("/target-role", protect, updateCareerTwinRole);
router.post("/coach-chat", protect, careerTwinChat);
router.get("/simulate", protect, simulateImprovement);

export default router;
