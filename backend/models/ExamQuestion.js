import mongoose from "mongoose";

const examQuestionSchema = new mongoose.Schema(
  {
    subjectId: { type: String, required: true, index: true },
    subjectName: { type: String, required: true },
    unitId: { type: String, required: true, index: true },
    unitName: { type: String, required: true },
    topicId: { type: String, required: true, index: true },
    topicName: { type: String, required: true },
    
    questionType: {
      type: String,
      enum: ["mcq", "short", "long", "numerical", "pyq"],
      default: "mcq",
      index: true,
    },
    questionText: { type: String, required: true },
    options: { type: [String], default: [] },
    correctAnswer: { type: String, required: true }, // Index for MCQ ("0", "1") or textual answer key
    explanation: { type: String, required: true },
    
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
      index: true,
    },
    university: {
      type: String,
      default: "Generic CSE",
      index: true,
    },
    semester: { type: Number, default: 3, index: true },
    year: { type: Number, default: 2023, index: true }, // For PYQs
    marks: { type: Number, default: 5 },
    isImportant: { type: Boolean, default: true, index: true },
    
    revisionNote: {
      summary: { type: String, default: "" },
      keyFormulae: { type: [String], default: [] },
      keyConcepts: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

const ExamQuestion = mongoose.model("ExamQuestion", examQuestionSchema);
export default ExamQuestion;
