import mongoose from "mongoose";

const daySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  topic: { type: String, default: "" },
  difficulty: { type: String, default: "Intermediate" },
  duration: { type: String, default: "45 mins" },
  keyConcepts: { type: [String], default: [] },
  actionItem: { type: String, default: "" },
  proTip: { type: String, default: "" },
  completed: { type: Boolean, default: false },
});

const roadmapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    weakTopics: { type: [String], required: true },
    overview: { type: String, default: "" },
    days: [daySchema],
    planText: { type: String, default: "" },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);
export default Roadmap;
