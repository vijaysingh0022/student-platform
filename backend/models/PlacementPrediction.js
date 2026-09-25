import mongoose from "mongoose";

const placementPredictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    readinessScore: { type: Number, required: true },
    readinessTier: { type: String, required: true },
    tierLevel: { type: String, default: "Level 2 (Competent)" },
    targetTier: { type: String, default: "Product Companies (Tier 1 & 2)" },
    weeklyHours: { type: Number, default: 12 },
    estimatedWeeksToReady: { type: Number, default: 4 },
    estimatedHoursTotal: { type: Number, default: 24 },
    learningVelocity: { type: String, default: "Moderate (+12% per 2 tests)" },
    testsAnalyzed: { type: Number, default: 0 },
    overallAccuracy: { type: Number, default: 0 },
    modelVersion: { type: String, default: "v1.0" },
    featureSnapshot: {
      dsa: { type: Number, default: 50 },
      dbms: { type: Number, default: 50 },
      os: { type: Number, default: 50 },
      cn: { type: Number, default: 50 },
      oops: { type: Number, default: 50 },
      system_design: { type: Number, default: 50 },
      aptitude: { type: Number, default: 50 },
      web_dev: { type: Number, default: 50 },
      overall_accuracy: { type: Number, default: 50 },
      attempts: { type: Number, default: 1 },
      improvement_rate: { type: Number, default: 0 },
      learning_velocity: { type: Number, default: 5.0 },
      consistency_score: { type: Number, default: 70 },
      weak_topic_count: { type: Number, default: 0 },
    },
    strengths: [
      {
        name: { type: String },
        score: { type: Number },
        status: { type: String },
      }
    ],
    improvementAreas: [
      {
        name: { type: String },
        score: { type: Number },
        status: { type: String },
        subject: { type: String },
        topic: { type: String },
        currentScore: { type: Number },
        targetScore: { type: Number },
        delta: { type: Number },
        priority: { type: String, enum: ["Critical", "High", "Medium", "Low"], default: "Medium" },
        estimatedHoursToFix: { type: Number },
        recommendedAction: { type: String },
      }
    ],
    weakTopics: [
      {
        subject: { type: String },
        topic: { type: String },
        score: { type: Number },
        targetScore: { type: Number },
        delta: { type: Number },
      }
    ],
    featureContributions: [
      {
        feature: { type: String },
        rawValue: { type: Number },
        contribution: { type: Number },
      }
    ],
    explanations: [{ type: String }],
    subjectBreakdown: [
      {
        subject: { type: String },
        score: { type: Number },
        weight: { type: Number },
        status: { type: String },
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
    aiExecutiveSummary: { type: String, default: "" },
    aiStrategicPlan: { type: String, default: "" },
    dangerZones: [{ type: String }],
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

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

export const PlacementPrediction = mongoose.model("PlacementPrediction", placementPredictionSchema);
export const CareerReadiness = PlacementPrediction;
export default PlacementPrediction;
