import express from "express";
import protect from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/rbac.js";
import {
  getAuditLogs,
  switchRoleDemo,
  getComplianceReport,
} from "../controllers/securityController.js";

const router = express.Router();

// GET /api/security/audit-logs - Accessible to admin and teacher (or authenticated users for review)
router.get("/audit-logs", protect, getAuditLogs);

// POST /api/security/switch-role - Live RBAC role switch for testing
router.post("/switch-role", protect, switchRoleDemo);

// GET /api/security/compliance-report
router.get("/compliance-report", protect, getComplianceReport);

export default router;
