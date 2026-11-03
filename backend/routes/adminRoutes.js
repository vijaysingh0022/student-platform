import express from "express";
import protect, { requireAdmin } from "../middleware/auth.js";
import {
  getAdminDashboardMetrics,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/adminController.js";
import {
  getVideoValidationReport,
  verifySingleVideoUrl,
  replaceVideoUrl,
} from "../controllers/adminVideoValidationController.js";

const router = express.Router();

// All routes in this router require authentication and admin/faculty privileges
router.use(protect);
router.use(requireAdmin);

// GET /api/admin/dashboard — metrics overview
router.get("/dashboard", getAdminDashboardMetrics);

// Video Management & Validation System (Admin)
router.get("/videos/validation-report", getVideoValidationReport);
router.post("/videos/verify-url", verifySingleVideoUrl);
router.put("/videos/:id/replace", replaceVideoUrl);

// User management endpoints
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;

