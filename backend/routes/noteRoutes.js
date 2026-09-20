import express from "express";
import {
  getNotesByTopic,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:topicId", optionalAuth, getNotesByTopic);
router.post("/", optionalAuth, createNote);
router.put("/:id", optionalAuth, updateNote);
router.delete("/:id", optionalAuth, deleteNote);

export default router;
