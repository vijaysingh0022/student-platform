import mongoose from "mongoose";

/**
 * Spaced Repetition Item Schema
 * Implements SuperMemo SM-2 + Ebbinghaus memory decay adaptations.
 */
const repetitionLogSchema = new mongoose.Schema(
  {
    sessionId: { type: String, default: "" },
    reviewedAt: { type: Date, default: Date.now },
    performanceRating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      // 0: Complete blackout, 1: Incorrect, 2: Incorrect with recall difficulty,
      // 3: Correct with serious difficulty, 4: Correct after hesitation, 5: Perfect recall
    },
    wasCorrect: { type: Boolean, required: true },
    timeTakenSeconds: { type: Number, default: 0 },
    intervalDaysBefore: { type: Number, default: 1 },
    intervalDaysAfter: { type: Number, default: 1 },
    easeFactorBefore: { type: Number, default: 2.5 },
    easeFactorAfter: { type: Number, default: 2.5 },
    retentionScoreBefore: { type: Number, default: 100 },
    retentionScoreAfter: { type: Number, default: 100 },
    questionType: { type: String, default: "mcq" }, // mcq, flashcard, recall, short_answer
  },
  { _id: true }
);

const spacedRepetitionItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    topicId: { type: String, required: true, index: true },
    subjectId: { type: String, required: true, index: true },
    topicTitle: { type: String, required: true },
    subjectName: { type: String, default: "" },
    unitId: { type: String, default: "" },
    chapterId: { type: String, default: "" },

    // SM-2 & Adaptive Scheduling Parameters
    // Interval stages: 1 day -> 3 days -> 7 days -> 14 days -> 30 days -> 60 days
    repetitionStage: { type: Number, default: 1 }, // 1, 2, 3, 4, 5, 6...
    easeFactor: { type: Number, default: 2.5, min: 1.3 }, // Minimum ease factor 1.3
    intervalDays: { type: Number, default: 1 }, // Days until next review
    lastReviewedAt: { type: Date, default: Date.now },
    nextReviewDate: { type: Date, required: true, index: true },

    // Retention & Decay Metrics
    retentionScore: { type: Number, default: 100, min: 0, max: 100 }, // Current calculated retention % (Ebbinghaus decay)
    decayHalflifeDays: { type: Number, default: 7 }, // Memory stability half-life in days

    // Performance Stats
    totalReviews: { type: Number, default: 0 },
    successfulReviews: { type: Number, default: 0 },
    failedReviews: { type: Number, default: 0 },
    consecutiveCorrect: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },

    // Mastery classification
    // 'new' | 'learning' | 'reviewing' | 'mastered' | 'at_risk'
    status: {
      type: String,
      enum: ["new", "learning", "reviewing", "mastered", "at_risk"],
      default: "learning",
      index: true,
    },
    difficultyLevel: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    // Concept & Mistake Tracking
    weakConcepts: { type: [String], default: [] },
    strongConcepts: { type: [String], default: [] },
    mistakeLog: [
      {
        questionText: { type: String, default: "" },
        userAnswer: { type: String, default: "" },
        correctAnswer: { type: String, default: "" },
        explanation: { type: String, default: "" },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    // Complete audit of revision history
    history: [repetitionLogSchema],
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Compound Unique Index: One tracking document per user per topic
spacedRepetitionItemSchema.index({ user: 1, topicId: 1 }, { unique: true });
spacedRepetitionItemSchema.index({ user: 1, nextReviewDate: 1, status: 1 });

/**
 * Method to calculate current retention based on Ebbinghaus forgetting curve
 * R = e^(-t / S), where t is days since last review and S is memory stability
 */
spacedRepetitionItemSchema.methods.calculateCurrentRetention = function () {
  const now = new Date();
  const daysSince = Math.max(0, (now - new Date(this.lastReviewedAt)) / (1000 * 60 * 60 * 24));
  // Stability increases with interval and ease factor
  const stability = Math.max(1, this.intervalDays * (this.easeFactor / 2));
  // Exponential decay
  const retention = Math.round(100 * Math.exp(-daysSince / stability));
  return Math.min(100, Math.max(10, retention));
};

const SpacedRepetitionItem = mongoose.model("SpacedRepetitionItem", spacedRepetitionItemSchema);
export default SpacedRepetitionItem;
