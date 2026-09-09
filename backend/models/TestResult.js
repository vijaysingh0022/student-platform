import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    scorePercent: { type: Number, required: true },
    // topic-wise breakdown: { "Normalization": { correct: 3, total: 5 }, ... }
    topicBreakdown: { type: Object, required: true },
  },
  { timestamps: true }
);

const TestResult = mongoose.model("TestResult", testResultSchema);
export default TestResult;
