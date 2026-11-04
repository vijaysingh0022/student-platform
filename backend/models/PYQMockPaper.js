import mongoose from "mongoose";

const pyqMockPaperSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    subjectId: { type: String, required: true, index: true },
    subjectName: { type: String, required: true },
    university: { type: String, default: "AKTU" },
    semester: { type: Number, default: 3 },
    totalMarks: { type: Number, default: 70 },
    durationMinutes: { type: Number, default: 180 }, // 3 hours
    difficulty: { type: String, default: "Medium" },
    unitsCovered: { type: [String], default: [] },
    blueprint: {
      sections: [
        {
          sectionName: String,
          description: String,
          totalQuestions: Number,
          attemptRequired: Number,
          marksPerQuestion: Number,
        },
      ],
    },
    sections: [
      {
        sectionName: String, // e.g. "Section A (Short Compulsory)", "Section B (Medium)", "Section C (Long)"
        instructions: String,
        marksPerQuestion: Number,
        questions: [
          {
            questionNumber: String,
            questionText: String,
            marks: Number,
            unitId: String,
            unitName: String,
            topicId: String,
            topicTitle: String,
            questionType: String,
            isAiGenerated: { type: Boolean, default: false },
            sourcePYQId: { type: mongoose.Schema.Types.ObjectId, ref: "PYQQuestion" },
            sourcePaperYear: String,
            modelAnswer: String,
          },
        ],
      },
    ],
    isCompleted: { type: Boolean, default: false },
    score: { type: Number, default: null },
    attemptedAt: { type: Date },
  },
  { timestamps: true }
);

const PYQMockPaper = mongoose.model("PYQMockPaper", pyqMockPaperSchema);
export default PYQMockPaper;
