import mongoose from "mongoose";

const turnSchema = new mongoose.Schema({
  turnNumber: { type: Number, required: true },
  questionId: { type: String },
  questionText: { type: String, required: true },
  subtopic: { type: String, default: "" },
  difficulty: { type: String, default: "Medium" },
  
  // Student answer
  studentAnswer: { type: String, default: "" },
  answerType: { type: String, enum: ["voice", "text", "skipped"], default: "text" },
  timeTakenSeconds: { type: Number, default: 0 },

  // AI Examiner Evaluation & Response
  evaluation: {
    status: { type: String, enum: ["correct", "partially_correct", "incorrect", "unanswered"], default: "unanswered" },
    score: { type: Number, default: 0 }, // 0 to 100
    examinerReaction: { type: String, default: "" }, // e.g. "Good. Now let's go one step further..."
    critique: { type: String, default: "" },
    conceptGapIdentified: { type: String, default: "" },
    isWeakness: { type: Boolean, default: false },
  },

  // Interactive teaching if student struggled
  teachingIntervention: {
    needed: { type: Boolean, default: false },
    microLesson: { type: String, default: "" },
    retestQuestion: { type: String, default: "" },
    retestAnswer: { type: String, default: "" },
    retestResolved: { type: Boolean, default: false },
  },

  // Adaptive follow-up question asked
  followUp: {
    questionText: { type: String, default: "" },
    studentAnswer: { type: String, default: "" },
    evaluation: { type: String, default: "" },
    score: { type: Number, default: 0 },
  },

  completedAt: { type: Date },
});

const examInterviewSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subject: { type: String, required: true }, // e.g. "Computer Networks"
    subjectId: { type: String, default: "cn" },
    topic: { type: String, required: true }, // e.g. "IP Subnetting & CIDR"
    topicId: { type: String, default: "subnetting" },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Intermediate" },
    interviewType: {
      type: String,
      enum: [
        "Technical Interview",
        "Viva / University Interview",
        "Concept Interview",
        "Placement Interview",
        "Rapid Fire",
        "Beginner Learning Interview",
      ],
      default: "Technical Interview",
    },
    totalQuestions: { type: Number, default: 5 },
    language: { type: String, enum: ["English", "Hindi", "Hinglish"], default: "English" },
    durationMinutes: { type: Number, default: 15 },
    
    // State machine
    status: {
      type: String,
      enum: ["in-progress", "completed", "abandoned"],
      default: "in-progress",
    },
    currentTurnIndex: { type: Number, default: 0 },
    turns: [turnSchema],

    // Final Report Analytics
    summary: {
      overallScore: { type: Number, default: 0 },
      overallVerdict: { type: String, default: "" },
      accuracyRate: { type: Number, default: 0 },
      identifiedWeaknesses: [{ type: String }],
      masteredStrengths: [{ type: String }],
      conceptMasteryDelta: { type: Number, default: 0 },
      examinerNotes: { type: String, default: "" },
      actionPlan: [{ day: Number, focus: String, action: String }],
    },
  },
  { timestamps: true }
);

export default mongoose.model("ExamInterviewSession", examInterviewSessionSchema);
