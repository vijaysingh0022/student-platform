import express from "express";
import protect from "../middleware/auth.js";
import { askTutor } from "../controllers/tutorController.js";

const router = express.Router();

router.post("/ask", protect, askTutor);

export default router;
