import mongoose from "mongoose";

// Topic Knowledge State Schema
const topicKnowledgeStateSchema = new mongoose.Schema(
  {
    topicId: { type: String, required: true },
    topicName: { type: String, required: true },
    subjectId: { type: String, required: true },
    unitName: { type: String, default: "Core Concepts" },
    state: {
      type: String,
      enum: ["unexplored", "learning", "developing", "strong", "mastered", "needs_revision"],
      default: "unexplored",
    },
    masteryScore: { type: Number, default: 0 }, // 0 to 100
    accuracy: { type: Number, default: 0 }, // 0 to 100
    attemptsCount: { type: Number, default: 0 },
    lastStudiedAt: { type: Date },
    lastRevisedAt: { type: Date },
    retentionConfidence: { type: Number, default: 100 }, // calibrated retention (0-100)
    daysSinceReview: { type: Number, default: 0 },
    missingPrerequisites: [{ type: String }],
    dependentConcepts: [{ type: String }],
    repeatedMistakes: [{ type: String }],
  },
  { _id: false }
);

// Subject Learning DNA Schema
const subjectLearningDnaSchema = new mongoose.Schema(
  {
    subjectId: { type: String, required: true },
    subjectName: { type: String, required: true },
    overallMastery: { type: Number, default: 0 },
    topicsCount: { type: Number, default: 0 },
    masteredCount: { type: Number, default: 0 },
    strongCount: { type: Number, default: 0 },
    developingCount: { type: Number, default: 0 },
    learningCount: { type: Number, default: 0 },
    unexploredCount: { type: Number, default: 0 },
    needsRevisionCount: { type: Number, default: 0 },
    measuredAccuracy: { type: Number, default: 0 },
    consistencyScore: { type: Number, default: 0 },
    retentionStability: { type: Number, default: 0 },
    codingVelocity: { type: Number, default: 0 },
  },
  { _id: false }
);

// Action Item Schema
const nextBestActionSchema = new mongoose.Schema(
  {
    id: { type: String },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["revise_topic", "solve_coding", "concept_learning", "take_assessment", "mock_interview"],
      default: "concept_learning",
    },
    subjectId: { type: String, default: "DSA" },
    topicId: { type: String, default: "" },
    priority: { type: String, enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"], default: "HIGH" },
    estimatedMinutes: { type: Number, default: 20 },
    actionRoute: { type: String, default: "/learn" },
    actionLabel: { type: String, default: "Start Now" },
    whySelected: { type: String, required: true },
    evidence: { type: String, default: "" },
    supportingData: [{ type: String }],
    expectedBenefit: { type: String, required: true },
    confidenceScore: { type: Number, default: 85 }, // Data sufficiency indicator
    completed: { type: Boolean, default: false },
    snoozed: { type: Boolean, default: false },
  },
  { _id: false }
);

// Daily Action Plan Task Schema
const dailyPlanTaskSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["overdue_revision", "prerequisite_gap", "weak_skill", "coding_practice", "milestone_goal"],
      default: "weak_skill",
    },
    subjectId: { type: String, default: "DSA" },
    topicId: { type: String, default: "" },
    estimatedMinutes: { type: Number, default: 20 },
    priority: { type: String, enum: ["CRITICAL", "HIGH", "MEDIUM"], default: "HIGH" },
    actionRoute: { type: String, default: "/learn" },
    actionLabel: { type: String, default: "Start Task" },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { _id: false }
);

// Learning Insights Schema
const learningInsightSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    category: {
      type: String,
      enum: ["improvement", "forgetting_risk", "inconsistency", "repeated_mistake", "velocity_shift"],
      default: "improvement",
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    subjectId: { type: String },
    supportingEvidence: { type: String, required: true },
    recommendedAction: { type: String, required: true },
    actionRoute: { type: String, default: "/learning-twin" },
    isResolved: { type: Boolean, default: false },
  },
  { _id: false }
);

// Personalized Learning Simulation Scenario Schema
const learningSimulationScenarioSchema = new mongoose.Schema(
  {
    targetSubject: { type: String, default: "DSA" },
    targetTopic: { type: String, default: "All Topics" },
    dailyStudyMinutes: { type: Number, default: 30 },
    durationDays: { type: Number, default: 30 },
    currentMastery: { type: Number, default: 45 },
    projectedMastery: { type: Number, default: 75 },
    projectedMasteredTopics: { type: Number, default: 8 },
    retentionStabilityProjected: { type: String, default: "High" },
    suggestedSchedule: [
      {
        week: Number,
        focus: String,
        targetTopics: [String],
        weeklyPracticeHours: Number,
      },
    ],
    assumptions: [{ type: String }],
    simulatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Central Learning Twin Profile Schema
const personalLearningTwinSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // 1. Primary Intelligence Metrics (with historical comparisons & trend indicators)
    intelligenceMetrics: {
      learningDnaIndex: {
        value: { type: Number, default: 68 },
        previousValue: { type: Number, default: 62 },
        trend: { type: String, enum: ["UP", "DOWN", "STABLE"], default: "UP" },
        explanation: { type: String, default: "Holistic multi-dimensional learning readiness index." },
        source: { type: String, default: "Cross-subject diagnostic & practical data" },
      },
      overallTopicMastery: {
        value: { type: Number, default: 58 },
        previousValue: { type: Number, default: 52 },
        trend: { type: String, enum: ["UP", "DOWN", "STABLE"], default: "UP" },
        explanation: { type: String, default: "Percentage of curriculum concepts operating at strong or mastered levels." },
        source: { type: String, default: "TopicProgress & assessment accuracy records" },
      },
      memoryRetentionHealth: {
        value: { type: Number, default: 82 },
        previousValue: { type: Number, default: 84 },
        trend: { type: String, enum: ["UP", "DOWN", "STABLE"], default: "DOWN" },
        explanation: { type: String, default: "Calibrated recall probability across all learned concepts." },
        source: { type: String, default: "Spaced Repetition SM-2 active recall signals" },
      },
      learningVelocity: {
        value: { type: Number, default: 5.4 }, // hrs/week
        previousValue: { type: Number, default: 4.8 },
        trend: { type: String, enum: ["UP", "DOWN", "STABLE"], default: "UP" },
        explanation: { type: String, default: "Active weekly study time invested in assessments and coding." },
        source: { type: String, default: "Active session telemetry" },
      },
      identifiedKnowledgeGaps: {
        value: { type: Number, default: 3 },
        previousValue: { type: Number, default: 5 },
        trend: { type: String, enum: ["UP", "DOWN", "STABLE"], default: "UP" }, // UP here means improvement (fewer gaps)
        explanation: { type: String, default: "Concepts requiring prerequisite or active recall intervention." },
        source: { type: String, default: "Concept prerequisite & error pattern analyzer" },
      },
      learningConsistency: {
        value: { type: Number, default: 86 }, // 0 to 100 consistency index
        previousValue: { type: Number, default: 80 },
        trend: { type: String, enum: ["UP", "DOWN", "STABLE"], default: "UP" },
        explanation: { type: String, default: "Regularity of daily active learning sessions without dormancy." },
        source: { type: String, default: "Study streak & daily event distributions" },
      },
    },

    // 2. Learning DNA Profile & Radar Dimensions
    learningDnaDimensions: [
      {
        dimension: { type: String, required: true },
        measuredScore: { type: Number, default: 50 },
        inferredTendency: { type: String, default: "Emerging" },
        description: { type: String, default: "" },
      },
    ],

    // Top subjects & topics
    strongestSubjects: [{ type: String }],
    weakestSubjects: [{ type: String }],
    strongestTopics: [{ type: String }],
    weakestTopics: [{ type: String }],

    // 3. Knowledge State Matrix & Subject DNA
    subjectsDna: [subjectLearningDnaSchema],
    topicKnowledgeStates: [topicKnowledgeStateSchema],

    // 4. Memory & Retention Intelligence
    retentionTrend: [
      {
        date: String,
        retentionScore: Number,
        topicsReviewed: Number,
      },
    ],
    forgettingRiskTopics: [
      {
        topicId: String,
        topicName: String,
        subjectId: String,
        daysSinceReview: Number,
        currentRetention: Number,
        riskLevel: { type: String, enum: ["HIGH", "MEDIUM", "LOW"], default: "HIGH" },
      },
    ],

    // 5. AI Next Best Action Engine (Primary & Alternatives)
    nextBestAction: nextBestActionSchema,
    alternativeActions: [nextBestActionSchema],

    // 6. Knowledge Gaps & Prerequisites
    learningGaps: [
      {
        type: {
          type: String,
          enum: ["weak_concept", "missing_prerequisite", "repeated_mistake", "poor_retention", "dormant_skill"],
        },
        subjectId: String,
        topicId: String,
        topicName: String,
        severity: { type: String, enum: ["critical", "high", "moderate"], default: "high" },
        evidence: String,
        prerequisiteNeeded: String,
        prerequisitesChain: [{ type: String }],
        recommendedCorrection: String,
      },
    ],

    // 7. Learning Behaviour Analytics
    weeklyActivityHeatmap: [
      {
        day: String, // e.g. Mon, Tue, etc.
        hours: Number,
        assessmentsCount: Number,
        codingCount: Number,
      },
    ],

    // 8. Learning Insights Feed
    insights: [learningInsightSchema],

    // 9. Personalized Daily Action Plan
    dailyActionPlan: [dailyPlanTaskSchema],

    // 10. Scenario Simulations
    simulations: [learningSimulationScenarioSchema],

    lastRecalculatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const PersonalLearningTwin = mongoose.model("PersonalLearningTwin", personalLearningTwinSchema);
export default PersonalLearningTwin;
