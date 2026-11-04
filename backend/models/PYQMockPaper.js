import mongoose from "mongoose";

const pyqMockPaperSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subjectId: {
      type: String,
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    university: {
      type: String,
      default: "AKTU / University Standard",
    },
    semester: {
      type: Number,
      default: 4,
    },
    selectedUnits: {
      type: [Number],
      default: [1, 2, 3, 4, 5],
    },
    totalMarks: {
      type: Number,
      default: 100,
    },
    durationMinutes: {
      type: Number,
      default: 180,
    },
    difficulty: {
      type: String,
      enum: ["Balanced", "Standard University", "Challenging", "High-Scoring"],
      default: "Standard University",
    },
    blueprint: [
      {
        section: String,
        description: String,
        totalQuestions: Number,
        mandatoryCount: Number,
        marksPerQuestion: Number,
        totalSectionMarks: Number,
      },
    ],
    sections: [
      {
        name: String, // e.g. "Section A: Short Answer Questions (Attempt all)"
        instructions: String,
        marksPerQuestion: Number,
        questions: [
          {
            questionNumber: String,
            questionText: String,
            marks: Number,
            unitNumber: Number,
            topicTitle: String,
            difficulty: String,
            sourceType: {
              type: String,
              enum: ["Original PYQ", "Similar Practice", "AI Generated"],
              default: "Original PYQ",
            },
            originalPaperYear: String,
            originalQuestionNumber: String,
            solutionGuide: String,
            expectedKeywords: [String],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("PYQMockPaper", pyqMockPaperSchema);
