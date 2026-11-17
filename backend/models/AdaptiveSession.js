import mongoose from "mongoose";

const adaptiveAttemptSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswerIndex: { type: Number, required: true },
    selectedOptionIndex: { type: Number, default: -1 },
    isCorrect: { type: Boolean, default: false },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    topic: { type: String, required: true },
    subtopic: { type: String, default: "" },
    timeTakenSeconds: { type: Number, default: 0 },
    explanation: { type: String, default: "" },
    
    // Explainable intelligence
    selectionReason: { type: String, default: "" },
    conceptEvaluated: { type: String, default: "" },
    misconception: { type: String, default: "" },
    thetaBefore: { type: Number, default: 0 },
    thetaAfter: { type: Number, default: 0 },
  },
  { _id: true, timestamps: true }
);

const topicMasterySchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    attemptsCount: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 }, // 0 to 100
    masteryScore: { type: Number, default: 50 }, // 0 to 100
    currentDifficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
    theta: { type: Number, default: 0 }, // IRT ability score (-3.0 to +3.0)
    status: { type: String, enum: ["needs_practice", "proficient", "mastered"], default: "needs_practice" },
  },
  { _id: false }
);

const adaptiveSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subject: { type: String, required: true, index: true }, // e.g. "DSA", "DBMS", "OS", "CN", "OOP", etc.
    mode: {
      type: String,
      enum: ["diagnostic", "weak_topic", "mastery_challenge", "interview_prep", "exam_prep"],
      default: "diagnostic",
    },
    targetQuestionCount: { type: Number, default: 10 },
    status: { type: String, enum: ["active", "completed", "abandoned"], default: "active", index: true },

    // IRT student ability estimate (-3.0 to +3.0, centered around 0)
    currentTheta: { type: Number, default: 0 },
    currentDifficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },

    // Target topic filters if in weak_topic or topic specific mode
    targetTopics: [{ type: String }],

    // Session attempts history
    attempts: [adaptiveAttemptSchema],
    servedQuestionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],

    // Dynamic Topic Mastery Tracking during and after session
    topicMasteryBreakdown: [topicMasterySchema],

    // Aggregates & Insights
    accuracy: { type: Number, default: 0 },
    speedAvgSeconds: { type: Number, default: 0 },
    totalTimeTakenSeconds: { type: Number, default: 0 },
    masteryPercentage: { type: Number, default: 0 },
    scoreEarned: { type: Number, default: 0 },
    xpAwarded: { type: Number, default: 0 },

    weakTopics: [{ type: String }],
    strongTopics: [{ type: String }],
    recommendedNextTopics: [{ type: String }],
    misunderstandingAnalysis: [
      {
        questionIndex: Number,
        topic: String,
        concept: String,
        misunderstanding: String,
        recommendedAction: String,
      },
    ],
    aiSummaryFeedback: { type: String, default: "" },
  },
  { timestamps: true }
);

adaptiveSessionSchema.index({ user: 1, subject: 1, status: 1 });
adaptiveSessionSchema.index({ user: 1, createdAt: -1 });

const AdaptiveSession = mongoose.model("AdaptiveSession", adaptiveSessionSchema);
export default AdaptiveSession;
