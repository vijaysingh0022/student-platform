import mongoose from "mongoose";

const userChallengeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    challengeId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["weak_area", "streak", "mastery", "coding", "roadmap", "quiz"],
      default: "mastery",
    },
    badgeText: {
      type: String,
      default: "Recommended",
    },
    icon: {
      type: String,
      default: "🎯",
    },
    iconBg: {
      type: String,
      default: "purple",
    },
    currentProgress: {
      type: Number,
      default: 0,
    },
    targetProgress: {
      type: Number,
      required: true,
      default: 1,
    },
    unit: {
      type: String,
      default: "%",
    },
    xpReward: {
      type: Number,
      required: true,
      default: 40,
    },
    actionRoute: {
      type: String,
      required: true,
      default: "/learn",
    },
    actionLabel: {
      type: String,
      default: "Continue",
    },
    status: {
      type: String,
      enum: ["active", "completed", "claimed"],
      default: "active",
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

userChallengeSchema.index({ user: 1, challengeId: 1, date: 1 }, { unique: true });

const UserChallenge = mongoose.model("UserChallenge", userChallengeSchema);
export default UserChallenge;
