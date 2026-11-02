import express from "express";
import protect, { requireAdmin } from "../middleware/auth.js";
import {
  getAdminDashboardMetrics,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/adminController.js";

const router = express.Router();

// All routes in this router require authentication and admin/faculty privileges
router.use(protect);
router.use(requireAdmin);

// GET /api/admin/dashboard — metrics overview
router.get("/dashboard", getAdminDashboardMetrics);

// User management endpoints
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;

