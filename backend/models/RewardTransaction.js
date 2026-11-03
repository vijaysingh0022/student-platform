import mongoose from "mongoose";

const rewardTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    source: {
      type: String,
      required: true,
      enum: [
        "TOPIC_COMPLETED",
        "VIDEO_COMPLETED",
        "QUIZ_COMPLETED",
        "QUIZ_HIGH_SCORE",
        "CODING_SOLVED",
        "MOCK_INTERVIEW_COMPLETED",
        "ROADMAP_TASK_COMPLETED",
        "STREAK_MILESTONE",
        "CHALLENGE_COMPLETED",
        "BADGE_UNLOCKED",
        "OFFLINE_SYNC_COMPLETED",
      ],
    },
    sourceId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["XP", "BADGE", "CHALLENGE", "STREAK"],
      default: "XP",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Anti-duplication compound index: Ensures user cannot earn XP twice for the exact same sourceId
rewardTransactionSchema.index({ user: 1, source: 1, sourceId: 1 }, { unique: true });

const RewardTransaction = mongoose.model("RewardTransaction", rewardTransactionSchema);
export default RewardTransaction;
