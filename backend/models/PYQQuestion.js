import mongoose from "mongoose";

const pyqQuestionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    paperId: { type: mongoose.Schema.Types.ObjectId, ref: "PYQPaper", required: true, index: true },
    subjectId: { type: String, required: true, index: true },
    subjectName: { type: String, required: true },
    university: { type: String, default: "AKTU" },
    academicYear: { type: String, default: "2023-2024", index: true },
    examType: { type: String, default: "End Semester" },

    // Question structure
    questionNumber: { type: String, required: true }, // e.g. "Q1(a)", "Section B - Q3"
    rawQuestionText: { type: String, required: true },
    questionText: { type: String, required: true },
    marks: { type: Number, default: 5 },
    pageNumber: { type: Number, default: 1 },

    questionType: {
      type: String,
      enum: [
        "MCQ",
        "Short Answer",
        "Long Answer",
        "Numerical",
        "Derivation",
        "Programming Questions",
        "Diagram-based Questions",
        "Case-based Questions",
      ],
      default: "Long Answer",
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    // Syllabus Mapping
    unitId: { type: String, default: "" },
    unitName: { type: String, default: "" },
    chapterId: { type: String, default: "" },
    chapterName: { type: String, default: "" },
    topicId: { type: String, default: "" },
    topicTitle: { type: String, default: "" },
    subtopics: { type: [String], default: [] },
    mappingConfidence: { type: Number, default: 0 }, // 0 to 1
    mappingEvidence: { type: String, default: "" },
    verificationStatus: {
      type: String,
      enum: ["Auto Mapped", "Verified", "Needs Review"],
      default: "Auto Mapped",
      index: true,
    },
    suggestedTopics: {
      type: [
        {
          topicId: String,
          topicTitle: String,
          unitId: String,
          unitName: String,
          confidence: Number,
        },
      ],
      default: [],
    },

    // Duplicate & Similarity Intelligence
    similarityGroupId: { type: String, default: "", index: true },
    isExactDuplicate: { type: Boolean, default: false },
    isConceptuallySimilar: { type: Boolean, default: false },
    similarQuestionCount: { type: Number, default: 0 },
    matchedQuestionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "PYQQuestion" }],

    // Student Preparation Progress
    prepStatus: {
      type: String,
      enum: ["Not Started", "Learning", "Revised", "Confident"],
      default: "Not Started",
      index: true,
    },
    userNotes: { type: String, default: "" },
    lastRevisedAt: { type: Date },

    // Priority Rating
    priorityLevel: {
      type: String,
      enum: ["High Priority", "Medium Priority", "Revision Recommended"],
      default: "Medium Priority",
      index: true,
    },
    priorityReason: { type: String, default: "" },

    // Cached AI Solutions for different marks
    aiSolutions: {
      twoMarks: { type: String, default: "" },
      fiveMarks: { type: String, default: "" },
      sevenMarks: { type: String, default: "" },
      tenMarks: { type: String, default: "" },
      simpleExplanation: { type: String, default: "" },
      stepByStep: { type: String, default: "" },
      keyFormulae: { type: [String], default: [] },
      diagramExplanation: { type: String, default: "" },
      keyPoints: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

// Full text indexing for duplicate and similarity search
pyqQuestionSchema.index({ questionText: "text", rawQuestionText: "text" });

const PYQQuestion = mongoose.model("PYQQuestion", pyqQuestionSchema);
export default PYQQuestion;
