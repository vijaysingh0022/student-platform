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
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isAcceptedSolution: { type: Boolean, default: false },
    parentReplyId: { type: mongoose.Schema.Types.ObjectId, default: null }, // nested replies
    attachments: [
      {
        fileName: { type: String, required: true },
        fileType: { type: String, required: true },
        dataUrl: { type: String, required: true },
        fileSize: { type: Number, default: 0 },
      },
    ],
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
    topic: { type: String, default: "General Discussion" },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    codeSnippet: { type: String, default: "" },
    codeLanguage: { type: String, default: "javascript" },

    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    authorName: { type: String, required: true },
    authorRole: { type: String, enum: ["student", "faculty", "admin"], default: "student" },
    authorAvatar: { type: String, default: "" },

    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: [discussionReplySchema],
    tags: [{ type: String }],

    attachments: [
      {
        fileName: { type: String, required: true },
        fileType: { type: String, required: true },
        dataUrl: { type: String, required: true },
        fileSize: { type: Number, default: 0 },
      },
    ],

    isPinned: { type: Boolean, default: false },
    isResolved: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },

    // AI Discussion Assistant / Digest
    aiSummary: { type: String, default: "" },
    aiRecommendedTopics: [{ type: String }],
    aiGeneratedAnswer: { type: String, default: "" },

    // Moderation
    isReported: { type: Boolean, default: false },
    reports: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reason: { type: String, required: true },
        reportedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

discussionThreadSchema.index({ group: 1, createdAt: -1 });
discussionThreadSchema.index({ subject: 1, createdAt: -1 });
discussionThreadSchema.index({ tags: 1 });
discussionThreadSchema.index({ title: "text", content: "text", tags: "text" });

const DiscussionThread = mongoose.model("DiscussionThread", discussionThreadSchema);
export default DiscussionThread;
