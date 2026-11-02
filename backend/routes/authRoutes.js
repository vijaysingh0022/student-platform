import express from "express";
import { syncUser, getMe, login, register, demoLogin, ssoLogin } from "../controllers/authController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/sync — called after every Clerk sign-in to upsert the MongoDB user profile
router.post("/sync", syncUser);

// Standard & Demo authentication routes
router.post("/login", login);
router.post("/register", register);
router.post("/demo", demoLogin);
router.post("/sso", ssoLogin);

// GET /api/auth/me — returns the current user's MongoDB profile
router.get("/me", protect, getMe);

export default router;
