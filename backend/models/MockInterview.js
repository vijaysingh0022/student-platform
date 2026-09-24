import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  questionType: { type: String, enum: ["mcq", "text", "coding"], default: "text" },
  options: { type: [String], default: [] },
  correctOption: { type: Number },
  studentAnswer: { type: String, default: "" },
  selectedOption: { type: Number },
  aiFollowUpQuestion: { type: String, default: "" },
  aiFollowUpAnswer: { type: String, default: "" },
  evaluation: {
    technicalAccuracy: { type: Number, default: 0 },
    conceptUnderstanding: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    problemSolving: { type: Number, default: 0 },
    answerStructure: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    feedback: { type: String, default: "" },
    sampleIdealAnswer: { type: String, default: "" },
  },
});

const roundSchema = new mongoose.Schema({
  roundNumber: { type: Number, required: true }, // 1 to 5
  roundName: {
    type: String,
    enum: [
      "Technical MCQ",
      "Technical Questions",
      "Coding",
      "Project Discussion",
      "HR / Behavioral",
    ],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed", "skipped"],
    default: "pending",
  },
  questions: [questionSchema],
});

const mockInterviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: {
      type: String,
      enum: [
        "Software Developer",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "Data Analyst",
        "AI/ML Engineer",
        "Cyber Security",
        "Cloud Engineer",
      ],
      required: true,
    },
    rounds: [roundSchema],
    overallScore: { type: Number, default: 0 },
    hiringDecision: {
      type: String,
      enum: ["Strong Hire", "Hire", "Needs Improvement", "Reject"],
      default: "Needs Improvement",
    },
    strengths: { type: [String], default: [] },
    topicsToImprove: { type: [String], default: [] },
    questionsMissed: [
      {
        question: { type: String },
        yourAnswer: { type: String },
        recommendedAnswer: { type: String },
      },
    ],
    recommendedLearning: { type: [String], default: [] },
    preparationPlan: [
      {
        day: { type: Number },
        focus: { type: String },
        action: { type: String },
      },
    ],
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

const MockInterview = mongoose.model("MockInterview", mockInterviewSchema);
export default MockInterview;
