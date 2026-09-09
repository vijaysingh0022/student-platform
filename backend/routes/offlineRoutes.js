import express from "express";
import protect from "../middleware/auth.js";
import { getOfflineBundle, syncOfflineBatch } from "../controllers/offlineController.js";

const router = express.Router();

router.get("/content-bundle", protect, getOfflineBundle);
router.post("/sync-batch", protect, syncOfflineBatch);

export default router;
