import express from "express";
import protect from "../middleware/auth.js";
import { 
  generateRoadmap, 
  getRoadmap, 
  toggleRoadmapDay 
} from "../controllers/roadmapController.js";

const router = express.Router();

router.post("/generate", protect, generateRoadmap);
router.get("/:subject", protect, getRoadmap);
router.patch("/:id/toggle-day", protect, toggleRoadmapDay);

export default router;
