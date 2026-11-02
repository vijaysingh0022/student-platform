import mongoose from "mongoose";

const userBadgeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    badgeId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "🏅",
    },
    category: {
      type: String,
      enum: ["learning", "streak", "quiz", "coding", "career", "offline"],
      default: "learning",
    },
    isUnlocked: {
      type: Boolean,
      default: false,
    },
    currentProgress: {
      type: Number,
      default: 0,
    },
    targetProgress: {
      type: Number,
      default: 1,
    },
    unlockedAt: {
      type: Date,
      default: null,
    },
    actionRoute: {
      type: String,
      default: "/learn",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

userBadgeSchema.index({ user: 1, badgeId: 1 }, { unique: true });

const UserBadge = mongoose.model("UserBadge", userBadgeSchema);
export default UserBadge;
