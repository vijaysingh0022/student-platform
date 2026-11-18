import mongoose from "mongoose";

// Study Group Member Schema
const groupMemberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, default: "" },
    role: {
      type: String,
      enum: ["creator", "admin", "member", "faculty_mentor"],
      default: "member",
    },
    joinedAt: { type: Date, default: Date.now },
    reputationPoints: { type: Number, default: 0 },
    challengesSolved: { type: Number, default: 0 },
    contributionsCount: { type: Number, default: 0 },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// Group Shared Resource Schema
const groupResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["pdf", "notes", "link", "code", "cheatsheet"], default: "notes" },
    urlOrSnippet: { type: String, required: true },
    sharedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sharedByName: { type: String, default: "Peer" },
    upvotes: { type: Number, default: 0 },
    tags: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// Group Coding Challenge Schema
const groupChallengeSchema = new mongoose.Schema(
  {
    problemId: { type: String, required: true },
    title: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    category: { type: String, default: "Algorithms" },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deadline: { type: Date },
    completions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        userName: String,
        status: { type: String, enum: ["Accepted", "Wrong Answer", "Time Limit Exceeded"], default: "Accepted" },
        language: String,
        solvedAt: { type: Date, default: Date.now },
        runtimeMs: { type: Number, default: 0 },
      },
    ],
    status: { type: String, enum: ["active", "completed", "expired"], default: "active" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// Group Activity Timeline Schema
const groupActivitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["member_joined", "resource_shared", "challenge_assigned", "challenge_solved", "announcement_posted", "role_updated"],
      default: "member_joined",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Study Group Schema
const studyGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, default: "" },
    subject: {
      type: String,
      enum: ["DSA", "DBMS", "OS", "CN", "OOP", "SYSTEM_DESIGN", "WEB_DEV", "APTITUDE", "PROGRAMMING", "GENERAL"],
      default: "DSA",
    },
    tags: [{ type: String }],
    learningGoals: [{ type: String }],
    weeklyTargetHours: { type: Number, default: 5 },
    bannerColor: { type: String, default: "from-blue-600 to-indigo-600" },
    isPrivate: { type: Boolean, default: false },
    inviteCode: { type: String, unique: true, sparse: true, index: true },
    isOfficialFacultyGroup: { type: Boolean, default: false },
    facultyMentor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [groupMemberSchema],
    pendingJoinRequests: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        email: String,
        requestedAt: { type: Date, default: Date.now },
      },
    ],

    resources: [groupResourceSchema],
    challenges: [groupChallengeSchema],
    activities: [groupActivitySchema],

    announcements: [
      {
        id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        title: String,
        message: String,
        authorName: String,
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    weeklyLearningPoints: { type: Number, default: 0 },
    totalChallengesCompleted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

studyGroupSchema.index({ subject: 1, isPrivate: 1 });
studyGroupSchema.index({ "members.user": 1 });

const StudyGroup = mongoose.model("StudyGroup", studyGroupSchema);
export default StudyGroup;
