import express from "express";
import {
  getNotesByTopic,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

const optionalAuth = (req, res, next) => {
  next();
};

router.get("/:topicId", optionalAuth, getNotesByTopic);
router.post("/", optionalAuth, createNote);
router.put("/:id", optionalAuth, updateNote);
router.delete("/:id", optionalAuth, deleteNote);

export default router;
