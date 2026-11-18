import mongoose from "mongoose";

const discussionReplySchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    authorRole: { type: String, enum: ["student", "faculty", "admin", "ai_assistant"], default: "student" },
    authorAvatar: { type: String, default: "" },
    content: { type: String, required: true },
    codeSnippet: { type: String, default: "" },
    codeLanguage: { type: String, default: "javascript" },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isAcceptedSolution: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const discussionThreadSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: "StudyGroup", index: true },
    subject: {
      type: String,
      enum: ["DSA", "DBMS", "OS", "CN", "OOP", "SYSTEM_DESIGN", "WEB_DEV", "APTITUDE", "PROGRAMMING", "GENERAL"],
      default: "DSA",
      index: true,
    },
    topic: { type: String, default: "Core Concept" },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    codeSnippet: { type: String, default: "" },
    codeLanguage: { type: String, default: "javascript" },

    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    authorName: { type: String, required: true },
    authorRole: { type: String, enum: ["student", "faculty", "admin"], default: "student" },
    authorAvatar: { type: String, default: "" },

    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: [discussionReplySchema],
    tags: [{ type: String }],

    isPinned: { type: Boolean, default: false },
    isResolved: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },

    // AI Discussion Digest
    aiSummary: { type: String, default: "" },
    aiRecommendedTopics: [{ type: String }],

    // Moderation
    isReported: { type: Boolean, default: false },
    reports: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reason: String,
        reportedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

discussionThreadSchema.index({ group: 1, createdAt: -1 });
discussionThreadSchema.index({ subject: 1, createdAt: -1 });
discussionThreadSchema.index({ tags: 1 });

const DiscussionThread = mongoose.model("DiscussionThread", discussionThreadSchema);
export default DiscussionThread;

