import mongoose from "mongoose";

const pyqQuestionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    paperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PYQPaper",
      required: true,
      index: true,
    },
    // Paper Context for quick querying
    subjectId: {
      type: String,
      required: true,
      index: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    examSession: {
      type: String,
      default: "End Semester",
    },
    paperTitle: {
      type: String,
      default: "",
    },
    pageNumber: {
      type: Number,
      default: 1,
    },
    // Extracted Identifiers
    questionNumber: {
      type: String, // e.g., "1(a)", "2", "3(b)(i)", "Section B - Q2"
      required: true,
      trim: true,
    },
    section: {
      type: String,
      default: "Section A", // "Section A", "Section B", "Section C", "Part 1"
    },
    questionText: {
      type: String,
      required: true,
    },
    normalizedText: {
      type: String, // Clean lowercased alphanumeric string for exact similarity deduplication
      index: true,
    },
    marks: {
      type: Number,
      default: 2,
    },
    questionType: {
      type: String,
      enum: [
        "MCQ",
        "Short Answer",
        "Long Answer",
        "Numerical",
        "Derivation",
        "Programming Question",
        "Diagram-based Question",
        "Case-based Question",
      ],
      default: "Short Answer",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    // AI Syllabus Mapping
    unitId: {
      type: String,
      default: null,
      index: true,
    },
    unitNumber: {
      type: Number,
      default: 1,
    },
    unitName: {
      type: String,
      default: "",
    },
    chapterId: {
      type: String,
      default: null,
    },
    chapterTitle: {
      type: String,
      default: "",
    },
    topicId: {
      type: String,
      default: null,
      index: true,
    },
    topicTitle: {
      type: String,
      default: "",
    },
    subtopics: {
      type: [String],
      default: [],
    },
    mappingConfidence: {
      type: Number, // 0.0 to 1.0
      default: 0.85,
    },
    mappingEvidence: {
      type: String,
      default: "",
    },
    verificationStatus: {
      type: String,
      enum: ["Verified", "Needs Review", "Manually Edited"],
      default: "Verified",
    },
    // Repeated / Similarity Grouping
    similarityGroupId: {
      type: String,
      default: null,
      index: true,
    },
    isRepeated: {
      type: Boolean,
      default: false,
      index: true,
    },
    repeatCount: {
      type: Number,
      default: 1,
    },
    repeatedYears: {
      type: [String],
      default: [],
    },
    similarQuestionReferences: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "PYQQuestion" },
        paperId: { type: mongoose.Schema.Types.ObjectId, ref: "PYQPaper" },
        year: String,
        questionNumber: String,
        similarityScore: Number, // 0 to 1
        similarityType: { type: String, enum: ["Exact Match", "Modified Variant", "Conceptually Similar"] },
      },
    ],
    // Explainable Priority Metric
    priorityLevel: {
      type: String,
      enum: ["High Priority", "Medium Priority", "Revision Recommended"],
      default: "Medium Priority",
    },
    priorityScore: {
      type: Number, // 0 - 100
      default: 50,
    },
    priorityReason: {
      type: String,
      default: "Standard exam question covering core syllabus concept.",
    },
    // Student Preparation Tracking
    studyStatus: {
      type: String,
      enum: ["Not Started", "Learning", "Revised", "Confident"],
      default: "Not Started",
    },
    studentNotes: {
      type: String,
      default: "",
    },
    // Cached Solutions for different mark formats
    solutions: {
      type: Map,
      of: new mongoose.Schema({
        simpleExplanation: String,
        examOrientedAnswer: String,
        stepByStepSolution: [String],
        importantDefinitions: [String],
        relevantFormulas: [String],
        numericalCalculation: String,
        keyPointsToRemember: [String],
        expectedStructure: String,
        generatedAt: { type: Date, default: Date.now },
      }),
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("PYQQuestion", pyqQuestionSchema);
