import express from "express";
import protect, { requireAdmin } from "../middleware/auth.js";
import {
  getMyCertificates,
  getCourseCertificateStatus,
  recordCourseProgress,
  claimCertificateStrict,
  verifyCertificate,
  getAdminCourseRules,
  updateAdminCourseRule,
  getAdminStudentsProgress,
  getAllCertificatesAdmin,
  adminIssueCertificate,
  adminRevokeCertificate,
  adminReissueCertificate,
} from "../controllers/certificateController.js";

const router = express.Router();

// ── Public Routes ─────────────────────────────────────────────────────────────
// Public QR Verification (anyone scanning the certificate QR code can verify)
router.get("/verify/:tokenOrId", verifyCertificate);

// ── Student Protected Routes ──────────────────────────────────────────────────
router.get("/my", protect, getMyCertificates);
router.get("/status/:courseId", protect, getCourseCertificateStatus);
router.post("/progress", protect, recordCourseProgress);
router.post("/claim", protect, claimCertificateStrict);

// ── Admin Protected Routes ────────────────────────────────────────────────────
router.get("/admin/rules", protect, requireAdmin, getAdminCourseRules);
router.put("/admin/rules/:courseId", protect, requireAdmin, updateAdminCourseRule);
router.get("/admin/students-progress", protect, requireAdmin, getAdminStudentsProgress);
router.get("/admin/all", protect, requireAdmin, getAllCertificatesAdmin);
router.post("/admin/issue", protect, requireAdmin, adminIssueCertificate);
router.post("/admin/:id/revoke", protect, requireAdmin, adminRevokeCertificate);
router.post("/admin/:id/reissue", protect, requireAdmin, adminReissueCertificate);

export default router;
