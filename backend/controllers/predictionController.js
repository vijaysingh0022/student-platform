import TestResult from "../models/TestResult.js";
import PlacementPrediction from "../models/PlacementPrediction.js";
import { getAIClient, getAIModel } from "../config/ai.js";
import { predictStudentReadiness } from "../services/mlReadinessService.js";

// Standard CSE placement benchmark topics
const BENCHMARK_CURRICULUM = {
  DSA: [
    { topic: "Arrays & Searching", target: 90, weight: 1.2, complexity: "Medium", baseHours: 4 },
    { topic: "Trees & Binary Search Trees", target: 90, weight: 1.3, complexity: "High", baseHours: 8 },
    { topic: "Graph Algorithms", target: 85, weight: 1.3, complexity: "High", baseHours: 8 },
    { topic: "Dynamic Programming", target: 85, weight: 1.4, complexity: "High", baseHours: 10 },
  ],
  DBMS: [
    { topic: "Normalization", target: 85, weight: 1.2, complexity: "High", baseHours: 6 },
    { topic: "Indexing & B+ Trees", target: 85, weight: 1.1, complexity: "High", baseHours: 5 },
    { topic: "ACID & Transactions", target: 80, weight: 1.0, complexity: "Medium", baseHours: 4 },
    { topic: "SQL Queries & Optimization", target: 85, weight: 1.0, complexity: "Medium", baseHours: 4 },
  ],
  OS: [
    { topic: "Process Synchronization & Deadlocks", target: 85, weight: 1.2, complexity: "High", baseHours: 6 },
    { topic: "Virtual Memory & Paging", target: 80, weight: 1.0, complexity: "Medium", baseHours: 5 },
    { topic: "CPU Scheduling", target: 85, weight: 0.9, complexity: "Low", baseHours: 3 },
    { topic: "Disk Scheduling & Storage", target: 80, weight: 0.9, complexity: "Low", baseHours: 3 },
  ],
  CN: [
    { topic: "OSI & TCP/IP Model", target: 85, weight: 1.0, complexity: "Medium", baseHours: 4 },
    { topic: "TCP & UDP Protocols", target: 90, weight: 1.2, complexity: "High", baseHours: 5 },
    { topic: "IP Addressing & Subnetting", target: 85, weight: 1.1, complexity: "Medium", baseHours: 5 },
    { topic: "Application Protocols & Security", target: 80, weight: 1.0, complexity: "Medium", baseHours: 4 },
  ],
  OOPS: [
    { topic: "Core OOP Pillars & Polymorphism", target: 90, weight: 1.2, complexity: "High", baseHours: 5 },
    { topic: "SOLID Principles & Clean Code", target: 85, weight: 1.2, complexity: "High", baseHours: 6 },
    { topic: "Design Patterns", target: 80, weight: 1.1, complexity: "Medium", baseHours: 5 },
    { topic: "Memory Management & vtable", target: 85, weight: 1.1, complexity: "Medium", baseHours: 4 },
  ],
  SYSTEM_DESIGN: [
    { topic: "Scalability & Load Balancing", target: 85, weight: 1.3, complexity: "High", baseHours: 7 },
    { topic: "Caching & Redis", target: 85, weight: 1.2, complexity: "Medium", baseHours: 5 },
    { topic: "CAP Theorem & Databases", target: 80, weight: 1.2, complexity: "High", baseHours: 6 },
    { topic: "Microservices & Message Queues", target: 80, weight: 1.1, complexity: "High", baseHours: 6 },
  ],
  APTITUDE: [
    { topic: "Percentages & Profit-Loss", target: 85, weight: 1.0, complexity: "Low", baseHours: 3 },
    { topic: "Time, Speed & Distance", target: 85, weight: 1.1, complexity: "Medium", baseHours: 4 },
    { topic: "Time & Work", target: 85, weight: 1.1, complexity: "Medium", baseHours: 4 },
    { topic: "Probability & Permutations", target: 80, weight: 1.2, complexity: "High", baseHours: 5 },
  ],
  WEB_DEV: [
    { topic: "JavaScript & Event Loop", target: 90, weight: 1.2, complexity: "High", baseHours: 5 },
    { topic: "REST APIs & HTTP Protocol", target: 85, weight: 1.0, complexity: "Medium", baseHours: 4 },
    { topic: "Authentication & Security (JWT)", target: 85, weight: 1.1, complexity: "Medium", baseHours: 4 },
    { topic: "DevOps & Containers (Docker/Git)", target: 80, weight: 1.0, complexity: "Medium", baseHours: 4 },
  ],
};

const COMPANY_TIERS = [
  {
    tier: "Tier-1 Product & Tech Giants",
    companyExamples: "Google, Microsoft, Amazon, Atlassian, Adobe",
    benchmarkScore: 88,
  },
  {
    tier: "FinTech & High-Growth Unicorns",
    companyExamples: "Razorpay, Swiggy, CRED, Zomato, PhonePe",
    benchmarkScore: 78,
  },
  {
    tier: "Emerging Startups & Tech Core",
    companyExamples: "Series A/B Startups, SaaS Engineering Teams",
    benchmarkScore: 70,
  },
  {
    tier: "IT Services & Digital Consultancies",
    companyExamples: "TCS Digital, Infosys Power Programmer, Accenture, Wipro",
    benchmarkScore: 60,
  },
];

export const calculatePrediction = async (userId, userPreferences = {}, assessmentId = null) => {
  const weeklyHours = userPreferences.weeklyHours ? Math.max(4, Math.min(40, Number(userPreferences.weeklyHours))) : 12;
  const targetTier = userPreferences.targetTier || "Product Companies (Tier 1 & 2)";

  // 1. Run ML Model Inference & Feature Extraction Layer
  const mlOutput = await predictStudentReadiness(userId, assessmentId);
  const {
    readinessScore,
    readinessTier,
    tierLevel,
    modelVersion,
    featureSnapshot,
    subjectBreakdown,
    strengths,
    improvementAreas,
    weakTopics,
    featureContributions,
    explanations,
    historyTrend,
    testsAnalyzed,
  } = mlOutput;

  // 2. Fetch raw test results for topic-level gap analysis
  const results = await TestResult.find({ user: userId }).sort({ createdAt: 1 });
  const topicStats = {};

  for (const r of results) {
    if (r.topicBreakdown) {
      for (const [tName, data] of Object.entries(r.topicBreakdown)) {
        const key = `${r.subject}:${tName}`;
        const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
        topicStats[key] = {
          subject: r.subject,
          topic: tName,
          correct: data.correct,
          total: data.total,
          percent: pct,
          lastTested: r.createdAt,
        };
      }
    }
  }

  // Calculate detailed improvement areas with estimated study hours
  const detailedImprovements = [];
  let totalHoursNeeded = 0;

  for (const [subj, defaultTopics] of Object.entries(BENCHMARK_CURRICULUM)) {
    const sObj = subjectBreakdown.find((s) => s.subject === subj);
    const avgSubjectScore = sObj ? sObj.score : 40;

    for (const bTopic of defaultTopics) {
      const recorded = topicStats[`${subj}:${bTopic.topic}`];
      let currentScore = 0;
      if (recorded) {
        currentScore = recorded.percent;
      } else if (sObj && sObj.assessed) {
        currentScore = Math.max(30, avgSubjectScore - 15);
      } else {
        currentScore = 35;
      }

      const targetScore = bTopic.target;
      const delta = Math.max(0, targetScore - currentScore);

      let priority = "Low";
      if (delta >= 35) priority = "Critical";
      else if (delta >= 20) priority = "High";
      else if (delta > 0) priority = "Medium";

      const hoursToFix = delta > 0 ? Math.max(2, Math.round((delta / 100) * bTopic.baseHours * 1.5)) : 0;
      totalHoursNeeded += hoursToFix;

      let recAction = "";
      if (delta === 0) {
        recAction = "Concept mastered. Maintain proficiency with periodic mock questions.";
      } else if (priority === "Critical") {
        recAction = `Deep revision required. Study foundational definitions, solve 10+ standard problems, and clear doubts with AI Tutor.`;
      } else if (priority === "High") {
        recAction = `Focus on edge cases, trade-offs, and typical interview viva questions.`;
      } else {
        recAction = `Quick review and 3-5 practice questions to reach interview mastery.`;
      }

      detailedImprovements.push({
        subject: subj,
        topic: bTopic.topic,
        currentScore,
        targetScore,
        delta,
        priority,
        estimatedHoursToFix: hoursToFix,
        recommendedAction: recAction,
      });
    }
  }

  // Learning Velocity Text
  let velocityText = "Baseline diagnostic established";
  if (results.length >= 2) {
    const diff = featureSnapshot.improvement_rate || 0;
    if (diff > 0) velocityText = `Accelerating (+${diff}% growth across ${results.length} assessments)`;
    else if (diff === 0) velocityText = `Steady performance across ${results.length} assessments`;
    else velocityText = `Fluctuating (${diff}% delta across ${results.length} assessments)`;
  } else if (results.length === 1) {
    velocityText = `Initial assessment recorded (${results[0].scorePercent}% score)`;
  } else {
    velocityText = "Diagnostic pending (Default engineering benchmarks applied)";
  }

  const estimatedWeeksToReady = Math.max(1, Math.ceil(totalHoursNeeded / weeklyHours));

  // Company Tier Fits based on real score
  const companyTierFits = COMPANY_TIERS.map((tier) => {
    const fit = Math.min(100, Math.round((readinessScore / tier.benchmarkScore) * 100));
    let status = "Not Ready";
    if (fit >= 95) status = "Highly Ready";
    else if (fit >= 80) status = "Competitive";
    else if (fit >= 60) status = "In Reach with Revision";
    else status = "Preparation Required";

    return {
      tier: tier.tier,
      companyExamples: tier.companyExamples,
      benchmarkScore: tier.benchmarkScore,
      fitPercent: fit,
      status,
    };
  });

  // Projected Trajectory over 8 weeks
  const projectedTrajectory = [
    { week: "Current", score: readinessScore, milestone: "Diagnostic Baseline" },
    { week: "Week 2", score: Math.min(95, readinessScore + Math.round((totalHoursNeeded > 0 ? 1 : 0) * 8)), milestone: "Core Weak Topics Fixed" },
    { week: "Week 4", score: Math.min(96, readinessScore + Math.round((totalHoursNeeded > 0 ? 1 : 0) * 16)), milestone: "Advanced Problem Sets" },
    { week: "Week 6", score: Math.min(98, readinessScore + Math.round((totalHoursNeeded > 0 ? 1 : 0) * 22)), milestone: "Mock Interview Simulation" },
    { week: "Week 8", score: Math.min(99, Math.max(88, readinessScore + 26)), milestone: "Placement-Ready Benchmark" },
  ];

  // Critical danger zones
  const criticalWeakAreas = detailedImprovements.filter((a) => a.priority === "Critical" || a.priority === "High");
  const dangerZones = criticalWeakAreas.map(
    (a) => `${a.subject}: ${a.topic} (Current accuracy is ${a.currentScore}%, required ${a.targetScore}%)`
  );
  if (dangerZones.length === 0) {
    dangerZones.push("Concurrency and Concurrency Control edge-cases in DBMS");
    dangerZones.push("Dynamic Programming state-transition proofs in DSA");
  }

  // Qualitative AI synthesis (or fallback)
  let aiExecutiveSummary = "";
  let aiStrategicPlan = "";

  try {
    const openai = getAIClient();
    const model = getAIModel();

    if (process.env.OPENAI_API_KEY) {
      const prompt = `You are a Principal Tech Hiring Manager & Career Coach evaluating a Computer Science student's placement readiness.
      
STUDENT PROFILE (From ML Feature Extractor):
- Tests Taken: ${results.length}
- ML Placement Readiness Score: ${readinessScore}/100 (${readinessTier})
- Model Version: ${modelVersion}
- Weekly Prep Commitment: ${weeklyHours} hours/week
- Estimated Time to Ready: ${estimatedWeeksToReady} weeks (${totalHoursNeeded} total study hours needed)
- Velocity: ${velocityText}
- Strengths: ${JSON.stringify(strengths)}
- Top Weak Areas: ${JSON.stringify(criticalWeakAreas.slice(0, 4).map(c => ({ topic: c.topic, current: c.currentScore, target: c.targetScore, delta: c.delta })))}

CRITICAL INSTRUCTIONS:
- Both "executiveSummary" and "strategicPlan" MUST be plain strings.
- "strategicPlan" must be a single plain-text string with bullet points using "•" and newlines.
- Do NOT make unrealistic guarantees of employment.

Respond ONLY with valid JSON:
{
  "executiveSummary": "<2-3 sentence plain text summary of student's current competency and primary focus>",
  "strategicPlan": "<4-week bullet-point plan as a plain text string>"
}`;

      const aiRes = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        max_tokens: 500,
      });

      const raw = aiRes.choices[0]?.message?.content || "";
      const clean = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      const parsed = JSON.parse(clean);

      aiExecutiveSummary = typeof parsed.executiveSummary === "string" ? parsed.executiveSummary : "";
      aiStrategicPlan = typeof parsed.strategicPlan === "string" ? parsed.strategicPlan : "";
    }
  } catch (err) {
    console.warn("AI generation note for prediction:", err.message);
  }

  if (!aiExecutiveSummary) {
    aiExecutiveSummary = `Student has achieved a Placement Readiness Score of ${readinessScore}/100 (${readinessTier}) evaluated by ML model ${modelVersion}. Foundational competencies are developing steadily, with ~${totalHoursNeeded} targeted hours recommended to bridge the remaining conceptual gaps across ${criticalWeakAreas.length} high-priority topics.`;
  }
  if (!aiStrategicPlan) {
    aiStrategicPlan = `• Week 1-2: Eliminate critical blockers in ${criticalWeakAreas.slice(0, 2).map(a => a.topic).join(" & ") || "Core Fundamentals"}.\n• Week 3: Practice mixed problem sets and dry-run code implementations.\n• Week 4: Complete full-length mock assessments and optimize speed under timed constraints.`;
  }

  // Save/Update in DB with complete feature snapshot
  const predictionDoc = await PlacementPrediction.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      readinessScore,
      readinessTier,
      tierLevel,
      targetTier,
      weeklyHours,
      estimatedWeeksToReady,
      estimatedHoursTotal: totalHoursNeeded,
      learningVelocity: velocityText,
      testsAnalyzed: results.length,
      overallAccuracy: featureSnapshot.overall_accuracy || readinessScore,
      modelVersion,
      featureSnapshot,
      strengths,
      improvementAreas: detailedImprovements,
      weakTopics,
      featureContributions,
      explanations,
      subjectBreakdown,
      companyTierFits,
      projectedTrajectory,
      aiExecutiveSummary,
      aiStrategicPlan,
      dangerZones,
      generatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return predictionDoc;
};

// @desc Get placement readiness prediction for authenticated student
// @route GET /api/prediction/readiness
// @route GET /api/career/readiness
export const getPlacementReadiness = async (req, res) => {
  try {
    const studentId = req.user._id;
    const prediction = await calculatePrediction(studentId);
    res.json(prediction);
  } catch (error) {
    console.error("Placement Readiness Prediction error:", error);
    res.status(500).json({ message: error.message || "Failed to generate placement readiness score" });
  }
};

// @desc POST endpoint to evaluate readiness with custom parameters or assessment ID
// @route POST /api/career/readiness
// @route POST /api/prediction/readiness
export const evaluatePlacementReadiness = async (req, res) => {
  try {
    // Authenticated user ID is authoritative — never trust arbitrary client scores
    const studentId = req.user._id;
    const { assessmentId, weeklyHours, targetTier } = req.body || {};
    const prediction = await calculatePrediction(studentId, { weeklyHours, targetTier }, assessmentId);
    res.json(prediction);
  } catch (error) {
    console.error("Evaluate Placement Readiness error:", error);
    res.status(500).json({ message: error.message || "Failed to evaluate placement readiness" });
  }
};

// @desc Recalculate prediction with modified weekly hours or target tier
// @route POST /api/prediction/recalculate
export const recalculatePlacementReadiness = async (req, res) => {
  try {
    const { weeklyHours, targetTier, assessmentId } = req.body;
    const prediction = await calculatePrediction(req.user._id, { weeklyHours, targetTier }, assessmentId);
    res.json(prediction);
  } catch (error) {
    console.error("Recalculate prediction error:", error);
    res.status(500).json({ message: error.message || "Failed to recalculate prediction" });
  }
};
