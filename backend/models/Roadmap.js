import mongoose from "mongoose";

const daySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  date: { type: String, default: "" },
  title: { type: String, required: true },
  topic: { type: String, default: "" },
  difficulty: { type: String, default: "Intermediate" },
  duration: { type: String, default: "45 min" },
  durationMinutes: { type: Number, default: 45 },
  pipeline: { type: [String], default: ["Learn", "Practice", "Quiz"] },
  keyConcepts: { type: [String], default: [] },
  actionItem: { type: String, default: "" },
  proTip: { type: String, default: "" },
  status: {
    type: String,
    enum: ["not-started", "in-progress", "completed", "paused", "skipped"],
    default: "not-started",
  },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  performanceRating: { type: String, default: "good" },
});

const roadmapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    examGoal: { type: String, default: "Placement & GATE Preparation" },
    examDate: { type: Date },
    availableHoursPerDay: { type: Number, default: 2 },
    skillLevel: { type: String, default: "Intermediate" },
    targetScore: { type: String, default: "90%" },
    preferredStudyTime: { type: String, default: "Evening" },
    weakTopics: { type: [String], default: [] },
    masteredTopics: { type: [String], default: [] },
    overview: { type: String, default: "" },
    aiRecommendation: { type: String, default: "" },
    days: [daySchema],
    planText: { type: String, default: "" },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);
export default Roadmap;
