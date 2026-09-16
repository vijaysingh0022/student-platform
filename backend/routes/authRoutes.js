import express from "express";
import { syncUser, getMe } from "../controllers/authController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/sync — called after every Clerk sign-in to upsert the MongoDB user profile
router.post("/sync", syncUser);

// GET /api/auth/me — returns the current user's MongoDB profile (requires Clerk session)
router.get("/me", protect, getMe);

export default router;
