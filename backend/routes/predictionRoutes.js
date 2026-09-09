import express from "express";
import protect from "../middleware/auth.js";
import {
  getPlacementReadiness,
  recalculatePlacementReadiness,
} from "../controllers/predictionController.js";

const router = express.Router();

router.get("/readiness", protect, getPlacementReadiness);
router.post("/recalculate", protect, recalculatePlacementReadiness);

export default router;
