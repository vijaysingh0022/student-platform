import express from "express";
import protect from "../middleware/auth.js";
import {
  exportUserData,
  updatePrivacyConsent,
  purgeUserData,
} from "../controllers/privacyController.js";

const router = express.Router();

// GET /api/privacy/export-data
router.get("/export-data", protect, exportUserData);

// POST /api/privacy/consent
router.post("/consent", protect, updatePrivacyConsent);

// DELETE /api/privacy/purge
router.delete("/purge", protect, purgeUserData);

export default router;
