import mongoose from "mongoose";

const pyqPaperSchema = new mongoose.Schema(
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
    originalFilename: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: "application/pdf",
    },
    fileData: {
      type: String, // Base64 data URI for reliable standalone persistence
      select: false, // Don't fetch by default for faster metadata queries
    },
    // Configuration details
    university: {
      type: String,
      default: "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
      trim: true,
    },
    course: {
      type: String,
      default: "B.Tech",
      trim: true,
    },
    branch: {
      type: String,
      default: "Computer Science & Engineering (CSE)",
      trim: true,
    },
    semester: {
      type: Number,
      default: 4,
    },
    subjectId: {
      type: String,
      required: true,
      index: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    subjectCode: {
      type: String,
      default: "KCS-401",
      trim: true,
    },
    academicYear: {
      type: String,
      default: "2023-24",
      trim: true,
    },
    examSession: {
      type: String,
      enum: ["End Semester", "Mid Semester", "Carry Over / Special", "Class Test", "Supplementary"],
      default: "End Semester",
    },
    totalMarks: {
      type: Number,
      default: 100,
    },
    durationMinutes: {
      type: Number,
      default: 180,
    },
    // Processing Pipeline Status
    status: {
      type: String,
      enum: [
        "Uploaded",
        "Extracting Text",
        "OCR Processing",
        "Identifying Questions",
        "Mapping Syllabus",
        "Analysis Complete",
        "Failed / Needs Review",
      ],
      default: "Uploaded",
      index: true,
    },
    progressPercent: {
      type: Number,
      default: 0,
    },
    statusMessage: {
      type: String,
      default: "Paper queued for extraction and analysis.",
    },
    pageCount: {
      type: Number,
      default: 1,
    },
    rawExtractedText: {
      type: String,
      default: "",
    },
    isOcrUsed: {
      type: Boolean,
      default: false,
    },
    extractedQuestionCount: {
      type: Number,
      default: 0,
    },
    verifiedQuestionCount: {
      type: Number,
      default: 0,
    },
    repeatedQuestionCount: {
      type: Number,
      default: 0,
    },
    errorDetails: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PYQPaper", pyqPaperSchema);
