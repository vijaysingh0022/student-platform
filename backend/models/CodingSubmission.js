import mongoose from "mongoose";

const codingSubmissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    problemId: { type: String, required: true, index: true },
    problemTitle: { type: String, required: true },
    category: { type: String, default: "Algorithms", index: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy", index: true },
    language: { type: String, default: "python", index: true },
    code: { type: String, required: true },
    status: {
      type: String,
      enum: ["Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error", "Compilation Error"],
      default: "Accepted",
      index: true,
    },
    passedCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 },
    executionTimeMs: { type: Number, default: 0 },
    memoryMb: { type: Number, default: 0 },
    testResults: [
      {
        testCaseNumber: Number,
        input: String,
        expectedOutput: String,
        actualOutput: String,
        passed: Boolean,
        executionTimeMs: Number,
        status: String,
      },
    ],
    aiEvaluation: {
      correctnessScore: Number,
      efficiencyScore: Number,
      codeQualityScore: Number,
      timeComplexity: String,
      spaceComplexity: String,
      potentialIssues: [String],
      edgeCasesHandled: [String],
      edgeCasesMissed: [String],
      aiSummary: String,
      improvedSolution: String,
      interviewFollowUp: [String],
    },
    isMistake: { type: Boolean, default: false, index: true },
    mistakeCategory: { type: String, default: "" },
    codeVersions: [
      {
        versionNumber: Number,
        code: String,
        language: String,
        status: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

codingSubmissionSchema.index({ user: 1, problemId: 1, createdAt: -1 });

const CodingSubmission = mongoose.model("CodingSubmission", codingSubmissionSchema);
export default CodingSubmission;
