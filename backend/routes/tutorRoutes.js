import express from "express";
import { optionalAuth } from "../middleware/auth.js";
import { askTutor } from "../controllers/tutorController.js";

const router = express.Router();

router.post("/ask", optionalAuth, askTutor);
router.post("/chat", optionalAuth, askTutor);

export default router;
