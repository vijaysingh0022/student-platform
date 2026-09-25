import express from "express";
import protect from "../middleware/auth.js";
import {
  getPlacementReadiness,
  evaluatePlacementReadiness,
  recalculatePlacementReadiness,
} from "../controllers/predictionController.js";

const router = express.Router();

router.get("/readiness", protect, getPlacementReadiness);
router.post("/readiness", protect, evaluatePlacementReadiness);
router.post("/recalculate", protect, recalculatePlacementReadiness);

export default router;
