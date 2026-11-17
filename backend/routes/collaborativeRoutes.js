import express from "express";
import protect from "../middleware/auth.js";
import {
  getGroups,
  createGroup,
  getGroupDetails,
  joinGroup,
  addGroupResource,
  assignGroupChallenge,
  getDiscussions,
  createDiscussion,
  replyToDiscussion,
  upvoteDiscussion,
  aiCommunityAssistant,
  getLeaderboards,
  getMyNotifications,
} from "../controllers/collaborativeController.js";

const router = express.Router();

// Groups
router.get("/groups", protect, getGroups);
router.post("/groups", protect, createGroup);
router.get("/groups/:id", protect, getGroupDetails);
router.post("/groups/:id/join", protect, joinGroup);
router.post("/groups/:id/resources", protect, addGroupResource);
router.post("/groups/:id/challenges", protect, assignGroupChallenge);

// Discussions
router.get("/discussions", protect, getDiscussions);
router.post("/discussions", protect, createDiscussion);
router.post("/discussions/:id/replies", protect, replyToDiscussion);
router.post("/discussions/:id/upvote", protect, upvoteDiscussion);

// AI Assistant
router.post("/ai-assistant", protect, aiCommunityAssistant);

// Leaderboard & Notifications
router.get("/leaderboards", protect, getLeaderboards);
router.get("/notifications", protect, getMyNotifications);

export default router;
