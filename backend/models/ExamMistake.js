import mongoose from "mongoose";

const examMistakeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    questionId: { type: String, required: true, index: true },
    questionText: { type: String, required: true },
    options: { type: [String], default: [] },
    subjectId: { type: String, default: "dsa", index: true },
    subjectName: { type: String, default: "Computer Science" },
    unitName: { type: String, default: "" },
    topicId: { type: String, default: "general", index: true },
    topicName: { type: String, default: "General Concept" },
    userAns: { type: String, default: "" },
    correctAns: { type: String, default: "" },
    explanation: { type: String, default: "" },
    copilotAnalysis: { type: String, default: "" },
    status: {
      type: String,
      enum: ["unresolved", "reviewing", "resolved"],
      default: "unresolved",
      index: true,
    },
    attemptsCount: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Unique mistake per user per questionId
examMistakeSchema.index({ user: 1, questionId: 1 }, { unique: true });

const ExamMistake = mongoose.model("ExamMistake", examMistakeSchema);
export default ExamMistake;
