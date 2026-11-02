import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      uppercase: true,
    },
    verificationToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    studentEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    courseId: {
      type: String,
      required: true,
      trim: true,
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    courseDuration: {
      type: String,
      default: "40 Hours",
    },
    skills: {
      type: [String],
      default: ["HTML & CSS", "JavaScript", "Responsive Design", "Web Projects"],
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    completionDate: {
      type: Date,
      default: Date.now,
    },
    completionPercentage: {
      type: Number,
      default: 100,
    },
    score: {
      type: Number,
      default: 85,
    },
    status: {
      type: String,
      enum: ["Valid", "Revoked"],
      default: "Valid",
      index: true,
    },
    revocationReason: {
      type: String,
      default: "",
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    issuedBy: {
      type: String,
      default: "LearnX Academic Council",
    },
    isManualIssue: {
      type: Boolean,
      default: false,
    },
    qrCodeDataUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;

