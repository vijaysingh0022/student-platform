import mongoose from "mongoose";

const examAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    mode: {
      type: String,
      enum: ["exam", "timed", "instant", "revision"],
      default: "exam",
    },
    filters: {
      university: { type: String, default: "All" },
      semester: { type: String, default: "All" },
      subjectId: { type: String, default: "dsa" },
      unitId: { type: String, default: "All" },
      year: { type: String, default: "All" },
      difficulty: { type: String, default: "All" },
      questionType: { type: String, default: "All" },
    },
    score: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    accuracyPercentage: { type: Number, required: true },
    timeTakenSeconds: { type: Number, default: 0 },
    questionsCount: { type: Number, required: true },
    
    weakTopics: { type: [String], default: [] },
    strongTopics: { type: [String], default: [] },
    recommendedRevision: [
      {
        topicId: { type: String },
        topicName: { type: String },
        reason: { type: String },
      },
    ],
    details: [
      {
        questionId: { type: String },
        questionText: { type: String },
        userAns: { type: String },
        correctAns: { type: String },
        isCorrect: { type: Boolean },
        topicId: { type: String },
        topicName: { type: String },
        explanation: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const ExamAttempt = mongoose.model("ExamAttempt", examAttemptSchema);
export default ExamAttempt;
