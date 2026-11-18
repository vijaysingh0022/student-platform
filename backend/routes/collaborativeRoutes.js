import express from "express";
import protect from "../middleware/auth.js";
import {
  getGroups,
  createGroup,
  getGroupDetails,
  joinGroup,
  leaveGroup,
  manageGroupMember,
  addGroupResource,
  addGroupAnnouncement,
  assignGroupChallenge,
  getDiscussions,
  getDiscussionById,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  replyToDiscussion,
  voteDiscussion,
  voteReply,
  bookmarkDiscussion,
  acceptAnswer,
  reportDiscussion,
  getUserCommunityProfile,
  aiCommunityAssistant,
  getLeaderboards,
  getMyNotifications,
} from "../controllers/collaborativeController.js";

const router = express.Router();

// Groups Management
router.get("/groups", protect, getGroups);
router.post("/groups", protect, createGroup);
router.get("/groups/:id", protect, getGroupDetails);
router.post("/groups/:id/join", protect, joinGroup);
router.post("/groups/:id/leave", protect, leaveGroup);
router.post("/groups/:id/members/manage", protect, manageGroupMember);
router.post("/groups/:id/resources", protect, addGroupResource);
router.post("/groups/:id/announcements", protect, addGroupAnnouncement);
router.post("/groups/:id/challenges", protect, assignGroupChallenge);

// Peer Discussions Forum
router.get("/discussions", protect, getDiscussions);
router.get("/discussions/:id", protect, getDiscussionById);
router.post("/discussions", protect, createDiscussion);
router.put("/discussions/:id", protect, updateDiscussion);
router.delete("/discussions/:id", protect, deleteDiscussion);
router.post("/discussions/:id/replies", protect, replyToDiscussion);
router.post("/discussions/:id/vote", protect, voteDiscussion);
router.post("/discussions/:id/replies/:replyId/vote", protect, voteReply);
router.post("/discussions/:id/bookmark", protect, bookmarkDiscussion);
router.post("/discussions/:id/replies/:replyId/accept", protect, acceptAnswer);
router.post("/discussions/:id/report", protect, reportDiscussion);
router.get("/users/:userId/profile", protect, getUserCommunityProfile);

// Legacy route alias for backward compatibility
router.post("/discussions/:id/upvote", protect, (req, res, next) => {
  req.body.voteType = "upvote";
  return voteDiscussion(req, res, next);
});

// AI Assistant
router.post("/ai-assistant", protect, aiCommunityAssistant);

// Leaderboard & Notifications
router.get("/leaderboards", protect, getLeaderboards);
router.get("/notifications", protect, getMyNotifications);

export default router;
