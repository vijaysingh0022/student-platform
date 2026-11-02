import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true }, // e.g. "DBMS", "DSA", "OS"
    topic: { type: String, required: true }, // e.g. "Binary Search", "Normalization"
    questionText: { type: String, required: true },
    options: { type: [String], required: true }, // 4 options
    correctAnswerIndex: { type: Number, required: true }, // 0-3
    difficulty: { type: String, enum: ["easy", "medium", "hard", "expert"], default: "medium" },
    subtopic: { type: String, default: "" },
    explanation: { type: String, default: "" },
    codeSnippet: { type: String, default: "" },
    tags: { type: [String], default: ["FAANG", "Important"] },
    isPYQ: { type: Boolean, default: false },
    isPlacement: { type: Boolean, default: true },
    questionType: { type: String, enum: ["MCQ", "Multiple Select", "True/False", "Numerical", "Output Based", "Code Tracing"], default: "MCQ" },
    hint: { type: String, default: "" },
    examRelevance: { type: String, default: "GATE & Campus Recruitment" },
    placementRelevance: { type: String, default: "Tier-1 Tech Companies" },
  },
  { timestamps: true }
);

questionSchema.index({ subject: 1, topic: 1 });
questionSchema.index({ subject: 1, difficulty: 1 });

const Question = mongoose.model("Question", questionSchema);
export default Question;
