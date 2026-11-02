import express from "express";
import protect, { requireAdmin } from "../middleware/auth.js";
import {
  getMyCertificates,
  checkCertificateEligibility,
  claimCertificate,
  verifyCertificate,
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
router.get("/eligibility/:courseId", protect, checkCertificateEligibility);
router.post("/claim", protect, claimCertificate);

// ── Admin Protected Routes ────────────────────────────────────────────────────
router.get("/admin/all", protect, requireAdmin, getAllCertificatesAdmin);
router.post("/admin/issue", protect, requireAdmin, adminIssueCertificate);
router.post("/admin/:id/revoke", protect, requireAdmin, adminRevokeCertificate);
router.post("/admin/:id/reissue", protect, requireAdmin, adminReissueCertificate);

export default router;
