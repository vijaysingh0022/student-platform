import express from "express";
import protect from "../middleware/auth.js";
import { getSkillGraph } from "../controllers/skillGraphController.js";

const router = express.Router();

router.get("/", protect, getSkillGraph);

export default router;
