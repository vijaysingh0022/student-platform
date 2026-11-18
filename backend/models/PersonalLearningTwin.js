import mongoose from "mongoose";

// Topic Knowledge State Schema
const topicKnowledgeStateSchema = new mongoose.Schema(
  {
    topicId: { type: String, required: true },
    topicName: { type: String, required: true },
    subjectId: { type: String, required: true },
    // Knowledge State derived from measurable rules:
    // 'unexplored' | 'learning' | 'developing' | 'strong' | 'mastered' | 'needs_revision'
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
    retentionConfidence: { type: Number, default: 100 }, // Ebbinghaus retention index (0-100)
    daysSinceReview: { type: Number, default: 0 },
    missingPrerequisites: [{ type: String }],
    repeatedMistakes: [{ type: String }],
  },
  { _id: false }
);

// Subject Mastery Schema
const subjectLearningDnaSchema = new mongoose.Schema(
  {
    subjectId: { type: String, required: true },
    subjectName: { type: String, required: true },
    overallMastery: { type: Number, default: 0 }, // 0 to 100
    topicsCount: { type: Number, default: 0 },
    masteredCount: { type: Number, default: 0 },
    strongCount: { type: Number, default: 0 },
    developingCount: { type: Number, default: 0 },
    learningCount: { type: Number, default: 0 },
    unexploredCount: { type: Number, default: 0 },
    needsRevisionCount: { type: Number, default: 0 },
  },
  { _id: false }
);

// Next Best Action Schema
const nextBestActionSchema = new mongoose.Schema(
  {
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
    
    // Explainability
    whySelected: { type: String, required: true },
    supportingData: [{ type: String }],
    expectedBenefit: { type: String, required: true },
  },
  { _id: false }
);

// Personalized Learning Simulation Scenario Schema
const learningSimulationScenarioSchema = new mongoose.Schema(
  {
    targetSubject: { type: String, default: "DSA" },
    dailyStudyMinutes: { type: Number, default: 30 },
    durationDays: { type: Number, default: 30 },
    currentMastery: { type: Number, default: 45 },
    projectedMastery: { type: Number, default: 75 },
    projectedMasteredTopics: { type: Number, default: 8 },
    retentionStabilityProjected: { type: String, default: "High" },
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

    // 1. Learning DNA Indicators
    overallLearningIndex: { type: Number, default: 50 }, // 0 to 100
    retentionHealthScore: { type: Number, default: 78 }, // Ebbinghaus aggregate
    consistencyStreakDays: { type: Number, default: 1 },
    activeStudyHoursWeekly: { type: Number, default: 3.5 },

    // 2. Knowledge State Matrix
    subjectsDna: [subjectLearningDnaSchema],
    topicKnowledgeStates: [topicKnowledgeStateSchema],

    // 3. Learning Gaps Detected
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
      },
    ],

    // 4. Strengths & Growth Areas
    strongestSkills: [{ type: String }],
    weakestSkills: [{ type: String }],

    // 5. Next Best Learning Action
    nextBestAction: nextBestActionSchema,
    topPersonalizedRecommendations: [nextBestActionSchema],

    // 6. Recent Learning Simulations
    simulations: [learningSimulationScenarioSchema],

    // 7. Explainable Learning Milestone Forecast
    learningOutcomeEstimation: {
      targetMilestone: { type: String, default: "Core CS Exam & OA Readiness" },
      estimatedCompletionWeeks: { type: Number, default: 6 },
      confidenceLevel: { type: String, enum: ["High", "Moderate", "Developing"], default: "Moderate" },
      skillGapReductionProjected: { type: String, default: "45% reduction over 3 weeks" },
      disclaimer: {
        type: String,
        default: "Simulated estimates are based on historical student study velocity and standard learning curve assumptions; actual results depend on consistent practice.",
      },
    },

    // 8. Centralized Learning Event Audit Log
    eventsTimeline: [
      {
        timestamp: { type: Date, default: Date.now },
        eventType: { type: String, enum: ["quiz", "topic_completion", "coding", "interview", "revision", "rag_doc"] },
        subjectId: String,
        topicId: String,
        score: Number,
        impact: String,
      },
    ],

    lastRecalculatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const PersonalLearningTwin = mongoose.model("PersonalLearningTwin", personalLearningTwinSchema);
export default PersonalLearningTwin;
