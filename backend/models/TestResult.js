import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    topic: { type: String, default: "" },
    totalQuestions: { type: Number, required: true },
    attemptedQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, required: true },
    wrongAnswers: { type: Number, default: 0 },
    skippedQuestions: { type: Number, default: 0 },
    scorePercent: { type: Number, required: true },
    accuracyPercent: { type: Number, default: 0 },
    timeTakenSeconds: { type: Number, default: 0 },
    topicBreakdown: { type: Object, default: {} },
    weakTopics: { type: [String], default: [] },
    strongTopics: { type: [String], default: [] },
    aiEvaluation: { type: Object, default: null },
  },
  { timestamps: true }
);

testResultSchema.index({ user: 1, subject: 1, createdAt: -1 });

const TestResult = mongoose.model("TestResult", testResultSchema);
export default TestResult;
