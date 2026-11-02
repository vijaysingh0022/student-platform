import mongoose from "mongoose";

const careerTwinSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    // Core readiness
    overallReadinessScore: { type: Number, default: 0 },
    dataConfidence: {
      type: String,
      enum: ["low", "moderate", "high"],
      default: "low",
    },
    totalSignals: { type: Number, default: 0 },

    // Target role preference
    targetRole: { type: String, default: "" },

    // Skill intelligence snapshot
    skillScores: {
      dsa: { type: Number, default: 0 },
      dbms: { type: Number, default: 0 },
      os: { type: Number, default: 0 },
      cn: { type: Number, default: 0 },
      oops: { type: Number, default: 0 },
      systemDesign: { type: Number, default: 0 },
      webDev: { type: Number, default: 0 },
      coding: { type: Number, default: 0 },
      interview: { type: Number, default: 0 },
    },

    // Explainability
    scoreFactors: [
      {
        label: { type: String },
        impact: { type: String, enum: ["positive", "negative"] },
        value: { type: String },
      },
    ],

    // Bottlenecks
    topBottlenecks: [
      {
        rank: { type: Number },
        skill: { type: String },
        score: { type: Number },
        evidence: { type: String },
        whyItMatters: { type: String },
        recommendedAction: { type: String },
        actionRoute: { type: String },
      },
    ],

    // Next Best Action
    nextBestAction: {
      title: { type: String, default: "" },
      why: { type: [String], default: [] },
      estimatedMinutes: { type: Number, default: 30 },
      priority: { type: String, enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"], default: "HIGH" },
      actionLabel: { type: String, default: "Start Now" },
      actionRoute: { type: String, default: "/learn" },
    },

    // 7-day sprint
    weekSprint: [
      {
        day: { type: String },   // "MON", "TUE" etc.
        task: { type: String },
        minutes: { type: Number },
        actionRoute: { type: String },
        status: { type: String, enum: ["pending", "started", "completed", "skipped"], default: "pending" },
      },
    ],

    // Career growth timeline events
    timeline: [
      {
        date: { type: Date, default: Date.now },
        event: { type: String },
        impact: { type: String },
        type: { type: String, enum: ["assessment", "learning", "coding", "interview", "achievement", "general"] },
      },
    ],

    // AI Coach chat history
    coachChat: [
      {
        role: { type: String, enum: ["user", "assistant"] },
        message: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    // Role fit data
    roleFit: {
      targetRole: { type: String, default: "" },
      fitPercent: { type: Number, default: 0 },
      strongAreas: { type: [String], default: [] },
      missingAreas: { type: [String], default: [] },
      gapActions: { type: [String], default: [] },
    },

    lastComputedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("CareerTwin", careerTwinSchema);
