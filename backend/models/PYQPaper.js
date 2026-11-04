import mongoose from "mongoose";

const pyqPaperSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    university: { type: String, default: "AKTU", index: true },
    course: { type: String, default: "B.Tech" },
    branch: { type: String, default: "Computer Science & Engineering" },
    semester: { type: Number, default: 3, index: true },
    subjectId: { type: String, required: true, index: true },
    subjectName: { type: String, required: true },
    subjectCode: { type: String, default: "" },
    academicYear: { type: String, default: "2023-2024", index: true },
    examType: {
      type: String,
      enum: ["End Semester", "Mid Semester / Sessional", "Back Paper / Carry Over", "Model Paper"],
      default: "End Semester",
    },
    fileName: { type: String, required: true },
    fileSize: { type: Number, default: 0 },
    mimeType: { type: String, default: "application/pdf" },
    rawText: { type: String, default: "" },
    pageCount: { type: Number, default: 1 },
    processingStatus: {
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
    progressPercent: { type: Number, default: 0 },
    statusMessage: { type: String, default: "Queued for extraction" },
    errorMessage: { type: String, default: "" },
    extractedQuestionCount: { type: Number, default: 0 },
    mappedQuestionCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const PYQPaper = mongoose.model("PYQPaper", pyqPaperSchema);
export default PYQPaper;

