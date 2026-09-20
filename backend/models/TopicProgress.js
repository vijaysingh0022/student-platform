import mongoose from "mongoose";

const revisionEntrySchema = new mongoose.Schema({
  attemptId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  accuracyPercent: { type: Number, required: true },
  timeTakenSeconds: { type: Number, default: 0 },
  weakConcepts: { type: [String], default: [] },
  strongConcepts: { type: [String], default: [] },
});

const topicProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    topicId: { type: String, required: true, index: true }, // e.g. "quick-sort"
    subjectId: { type: String, required: true, index: true },
    unitId: { type: String, default: "" },
    chapterId: { type: String, default: "" },

    // Learning states
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },

    // Mastery status
    // masteryStatus: 'not_attempted' | 'weak' (<60%) | 'needs_practice' (60-79%) | 'strong' (>=80%)
    masteryStatus: {
      type: String,
      enum: ["not_attempted", "weak", "needs_practice", "strong"],
      default: "not_attempted",
    },
    masteryPercentage: { type: Number, default: 0 }, // 0 to 100

    // Quiz statistics
    attemptsCount: { type: Number, default: 0 },
    latestScore: { type: Number, default: 0 },
    latestTotal: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    bestTotal: { type: Number, default: 0 },
    lastAttemptAt: { type: Date },

    // Concept-level diagnostics
    weakConcepts: { type: [String], default: [] }, // e.g. ["Partition Logic", "Worst-case Complexity"]
    strongConcepts: { type: [String], default: [] }, // e.g. ["Pivot Selection"]

    // Full revision history
    revisionHistory: [revisionEntrySchema],
  },
  { timestamps: true }
);

// Compound index to ensure 1 progress record per user per topic
topicProgressSchema.index({ user: 1, topicId: 1 }, { unique: true });

const TopicProgress = mongoose.model("TopicProgress", topicProgressSchema);
export default TopicProgress;
