import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  id: { type: Number },
  prompt: { type: String, required: true },
  type: {
    type: String,
    enum: ["MCQ", "True/False", "Fill-in-blank", "Short Answer"],
    default: "MCQ",
    required: true,
  },
  options: { type: [String], default: [] },
  correctAnswer: { type: String, required: true },
  explanation: { type: String, default: "" },
  points: { type: Number, default: 1 },
});

const QuizSchema = new mongoose.Schema(
  {
    quizId: { type: String, required: true, unique: true, index: true },
    title: { type: String, default: "AI-Generated Assessment" },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    questionType: { type: String, default: "Mixed" },
    sourceName: { type: String, default: "Uploaded Content" },
    sourceType: {
      type: String,
      enum: ["file", "transcript", "text"],
      default: "file",
    },
    summary: { type: String, default: "" },
    questions: { type: [QuestionSchema], default: [] },
    totalQuestions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", QuizSchema);
