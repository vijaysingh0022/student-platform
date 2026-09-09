import mongoose from "mongoose";

const placementPredictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    readinessScore: { type: Number, required: true },
    readinessTier: { type: String, required: true },
    targetTier: { type: String, default: "Product Companies (Tier 1 & 2)" },
    weeklyHours: { type: Number, default: 12 },
    estimatedWeeksToReady: { type: Number, required: true },
    estimatedHoursTotal: { type: Number, required: true },
    learningVelocity: { type: String, default: "Moderate (+12% per 2 tests)" },
    testsAnalyzed: { type: Number, default: 0 },
    overallAccuracy: { type: Number, default: 0 },
    subjectBreakdown: [
      {
        subject: { type: String },
        score: { type: Number },
        weight: { type: Number },
        status: { type: String },
      }
    ],
    improvementAreas: [
      {
        subject: { type: String, required: true },
        topic: { type: String, required: true },
        currentScore: { type: Number, required: true },
        targetScore: { type: Number, required: true },
        delta: { type: Number, required: true },
        priority: { type: String, enum: ["Critical", "High", "Medium", "Low"], default: "Medium" },
        estimatedHoursToFix: { type: Number, required: true },
        recommendedAction: { type: String },
      }
    ],
    companyTierFits: [
      {
        tier: { type: String },
        companyExamples: { type: String },
        benchmarkScore: { type: Number },
        fitPercent: { type: Number },
        status: { type: String },
      }
    ],
    projectedTrajectory: [
      {
        week: { type: String },
        score: { type: Number },
        milestone: { type: String },
      }
    ],
    // Always stored as plain text strings — never objects
    aiExecutiveSummary: { type: String, default: "" },
    aiStrategicPlan: { type: String, default: "" },
    dangerZones: [{ type: String }],
  },
  { timestamps: true }
);

// Belt-and-suspenders: ensure AI text fields are always plain strings before save
function coerceToString(val) {
  if (typeof val === "string") return val;
  if (val && typeof val === "object") {
    return Object.entries(val)
      .map(([k, v]) => {
        const header = k.replace(/([a-z])(\d)/i, "$1 $2").toUpperCase();
        if (v && typeof v === "object") {
          const topics = Array.isArray(v.focusTopics) ? v.focusTopics.join(", ") : "";
          const acts = Array.isArray(v.activities) ? v.activities.map((a) => `  • ${a}`).join("\n") : "";
          return `${header}${topics ? ` — ${topics}` : ""}:\n${acts}`;
        }
        return `${header}: ${v}`;
      })
      .join("\n\n");
  }
  return String(val ?? "");
}

placementPredictionSchema.pre("save", function (next) {
  if (this.aiExecutiveSummary !== undefined) {
    this.aiExecutiveSummary = coerceToString(this.aiExecutiveSummary);
  }
  if (this.aiStrategicPlan !== undefined) {
    this.aiStrategicPlan = coerceToString(this.aiStrategicPlan);
  }
  next();
});

// Also handle findOneAndUpdate (upsert path)
placementPredictionSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update?.aiExecutiveSummary !== undefined) {
    update.aiExecutiveSummary = coerceToString(update.aiExecutiveSummary);
  }
  if (update?.aiStrategicPlan !== undefined) {
    update.aiStrategicPlan = coerceToString(update.aiStrategicPlan);
  }
  next();
});

const PlacementPrediction = mongoose.model("PlacementPrediction", placementPredictionSchema);
export default PlacementPrediction;

