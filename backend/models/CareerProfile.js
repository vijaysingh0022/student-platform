import mongoose from "mongoose";

const careerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    targetRole: {
      type: String,
      default: "Full Stack Software Engineer",
    },
    resumeText: {
      type: String,
      default: "",
    },
    atsScore: {
      type: Number,
      default: 68,
    },
    savedProjects: [
      {
        title: String,
        status: { type: String, enum: ["Planned", "In Progress", "Completed"], default: "Planned" },
      },
    ],
    mockInterviewScore: {
      type: Number,
      default: 0,
    },
    mockAttemptsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CareerProfile", careerProfileSchema);
