import TestResult from "../models/TestResult.js";
import PlacementPrediction from "../models/PlacementPrediction.js";
import { getAIClient, getAIModel } from "../config/ai.js";

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

export const calculatePrediction = async (userId, userPreferences = {}) => {
  const weeklyHours = userPreferences.weeklyHours ? Math.max(4, Math.min(40, Number(userPreferences.weeklyHours))) : 12;
  const targetTier = userPreferences.targetTier || "Product Companies (Tier 1 & 2)";

  // Fetch all historical test results for user
  const results = await TestResult.find({ user: userId }).sort({ createdAt: 1 });

  // Map to store latest topic scores: { "DBMS:Normalization": { correct, total, percent } }
  const topicStats = {};
  const subjectScores = {
    DSA: [],
    DBMS: [],
    OS: [],
    CN: [],
    OOPS: [],
    SYSTEM_DESIGN: [],
    APTITUDE: [],
    WEB_DEV: [],
  };

  for (const r of results) {
    if (subjectScores[r.subject]) {
      subjectScores[r.subject].push(r.scorePercent);
    }
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

  // Calculate learning velocity if user took multiple tests
  let velocityText = "Baseline diagnostic established";
  let velocityScore = 0;
  if (results.length >= 2) {
    const firstScore = results[0].scorePercent;
    const latestScore = results[results.length - 1].scorePercent;
    const diff = latestScore - firstScore;
    velocityScore = diff;
    if (diff > 0) {
      velocityText = `Accelerating (+${diff}% growth across ${results.length} assessments)`;
    } else if (diff === 0) {
      velocityText = `Steady performance across ${results.length} assessments`;
    } else {
      velocityText = `Fluctuating (${diff}% delta across ${results.length} assessments)`;
    }
  } else if (results.length === 1) {
    velocityText = `Initial assessment recorded (${results[0].scorePercent}% score)`;
  } else {
    velocityText = `Diagnostic pending (Default engineering benchmarks applied)`;
  }

  // Evaluate Subject Breakdowns & Topic Deltas ("What to improve and How much")
  const improvementAreas = [];
  const subjectBreakdown = [];
  let totalWeightedScore = 0;
  let totalWeight = 0;
  let totalHoursNeeded = 0;

  const subjectWeights = { DSA: 0.45, DBMS: 0.30, OS: 0.25 };

  for (const [subj, defaultTopics] of Object.entries(BENCHMARK_CURRICULUM)) {
    const scores = subjectScores[subj] || [];
    let avgSubjectScore = 0;
    let subjectStatus = "Unassessed";

    if (scores.length > 0) {
      avgSubjectScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      subjectStatus = avgSubjectScore >= 75 ? "Strong" : avgSubjectScore >= 55 ? "Moderate" : "Needs Attention";
    } else {
      avgSubjectScore = 40; // baseline unassessed default
      subjectStatus = "Diagnostic Recommended";
    }

    const sWeight = subjectWeights[subj] || 0.33;
    totalWeightedScore += avgSubjectScore * sWeight;
    totalWeight += sWeight;

    subjectBreakdown.push({
      subject: subj,
      score: avgSubjectScore,
      weight: Math.round(sWeight * 100),
      status: subjectStatus,
    });

    // Check each benchmark topic
    for (const bTopic of defaultTopics) {
      const recorded = topicStats[`${subj}:${bTopic.topic}`];
      let currentScore = 0;
      if (recorded) {
        currentScore = recorded.percent;
      } else if (scores.length > 0) {
        currentScore = Math.max(30, avgSubjectScore - 15);
      } else {
        currentScore = 35; // unassessed estimate
      }

      const targetScore = bTopic.target;
      const delta = Math.max(0, targetScore - currentScore);

      let priority = "Low";
      if (delta >= 35) priority = "Critical";
      else if (delta >= 20) priority = "High";
      else if (delta > 0) priority = "Medium";

      // Calculate hours needed based on delta and topic complexity
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

      improvementAreas.push({
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

  // Calculate overall readiness score (0-100)
  let baseReadiness = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 50;
  // Boost slightly if positive velocity, dampen if high gap
  if (velocityScore > 0) baseReadiness = Math.min(99, baseReadiness + Math.round(velocityScore * 0.15));

  // Determine Readiness Tier
  let readinessTier = "Foundational Stage (<50%)";
  if (baseReadiness >= 85) readinessTier = "Tier-1 Product Company Ready (85%+)";
  else if (baseReadiness >= 72) readinessTier = "Product & FinTech Ready (72-84%)";
  else if (baseReadiness >= 58) readinessTier = "IT Services & Digital Tier Ready (58-71%)";
  else readinessTier = "Foundational Stage (<58%)";

  // Calculate estimated weeks to placement ready
  const estimatedWeeksToReady = Math.max(1, Math.ceil(totalHoursNeeded / weeklyHours));

  // Company Tier Fits
  const companyTierFits = COMPANY_TIERS.map((tier) => {
    const fit = Math.min(100, Math.round((baseReadiness / tier.benchmarkScore) * 100));
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
    { week: "Current", score: baseReadiness, milestone: "Diagnostic Baseline" },
    { week: "Week 2", score: Math.min(95, baseReadiness + Math.round((totalHoursNeeded > 0 ? 1 : 0) * 8)), milestone: "Core Weak Topics Fixed" },
    { week: "Week 4", score: Math.min(96, baseReadiness + Math.round((totalHoursNeeded > 0 ? 1 : 0) * 16)), milestone: "Advanced Problem Sets" },
    { week: "Week 6", score: Math.min(98, baseReadiness + Math.round((totalHoursNeeded > 0 ? 1 : 0) * 22)), milestone: "Mock Interview Simulation" },
    { week: "Week 8", score: Math.min(99, Math.max(88, baseReadiness + 26)), milestone: "Placement-Ready Benchmark" },
  ];

  // Critical interview danger zones
  const criticalWeakAreas = improvementAreas.filter((a) => a.priority === "Critical" || a.priority === "High");
  const dangerZones = criticalWeakAreas.map(
    (a) => `${a.subject}: ${a.topic} (Current accuracy is ${a.currentScore}%, required ${a.targetScore}%)`
  );

  if (dangerZones.length === 0) {
    dangerZones.push("Concurrency and Concurrency Control edge-cases in DBMS");
    dangerZones.push("Dynamic Programming state-transition proofs in DSA");
  }

  // Build AI qualitative synthesis (or fallback)
  let aiExecutiveSummary = "";
  let aiStrategicPlan = "";

  try {
    const openai = getAIClient();
    const model = getAIModel();

    if (process.env.OPENAI_API_KEY) {
      const prompt = `You are a Principal Tech Hiring Manager & Career Coach evaluating a Computer Science student's placement readiness.
      
STUDENT PROFILE:
- Tests Taken: ${results.length}
- Overall Readiness Score: ${baseReadiness}% (${readinessTier})
- Weekly Prep Commitment: ${weeklyHours} hours/week
- Estimated Time to Ready: ${estimatedWeeksToReady} weeks (${totalHoursNeeded} total study hours needed)
- Velocity: ${velocityText}
- Subject Performance: ${JSON.stringify(subjectBreakdown)}
- Weak Topics requiring improvement: ${JSON.stringify(criticalWeakAreas.map(c => ({ topic: c.topic, current: c.currentScore, target: c.targetScore, delta: c.delta })))}

CRITICAL INSTRUCTIONS:
- Both "executiveSummary" and "strategicPlan" MUST be plain strings (NOT objects, NOT arrays, NOT nested JSON).
- "strategicPlan" must be a single plain-text string with bullet points using "•" and newlines, like:
  "• Week 1: Focus on Normalization and BCNF\n• Week 2: Practice Dynamic Programming problems\n• Week 3: Run mock tests\n• Week 4: Final revision and speed drills"

Respond ONLY with valid JSON matching exactly:
{
  "executiveSummary": "<2-3 sentence plain text summary>",
  "strategicPlan": "<4-week bullet-point plan as a SINGLE plain text string>"
}
Do NOT nest objects inside strategicPlan. Only plain text strings.`;

      const aiRes = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 600,
      });

      const raw = aiRes.choices[0]?.message?.content || "";
      const clean = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      const parsed = JSON.parse(clean);

      aiExecutiveSummary = typeof parsed.executiveSummary === "string"
        ? parsed.executiveSummary
        : "";

      // strategicPlan can sometimes be returned as a { week1, week2, ... } object by the LLM.
      // Always normalise to a plain string before storing.
      const rawPlan = parsed.strategicPlan;
      if (typeof rawPlan === "string") {
        aiStrategicPlan = rawPlan;
      } else if (rawPlan && typeof rawPlan === "object") {
        // Convert { week1: { focusTopics, activities }, ... } → readable bullet text
        aiStrategicPlan = Object.entries(rawPlan)
          .map(([weekKey, val]) => {
            const label = weekKey.replace(/([a-z])(\d)/i, "$1 $2").toUpperCase();
            const topics = Array.isArray(val?.focusTopics) ? val.focusTopics.join(", ") : "";
            const activities = Array.isArray(val?.activities)
              ? val.activities.map((a) => `  • ${a}`).join("\n")
              : "";
            return `${label}${topics ? ` — ${topics}` : ""}:\n${activities}`;
          })
          .join("\n\n");
      } else {
        aiStrategicPlan = "";
      }
    }
  } catch (err) {
    console.warn("AI generation note for prediction:", err.message);
  }

  // Fallback AI content if API was skipped or failed
  if (!aiExecutiveSummary) {
    aiExecutiveSummary = `Student has established a readiness rating of ${baseReadiness}% (${readinessTier}). Core competencies are developing steadily, with ${totalHoursNeeded} targeted hours needed to bridge the remaining conceptual gaps across ${criticalWeakAreas.length} high-priority topics.`;
  }
  if (!aiStrategicPlan) {
    aiStrategicPlan = `• Week 1-2: Eliminate critical blockers in ${criticalWeakAreas.slice(0, 2).map(a => a.topic).join(" & ") || "Core Fundamentals"}.\n• Week 3: Practice mixed problem sets and dry-run code implementations.\n• Week 4: Complete full-length mock assessments and optimize speed under timed constraints.`;
  }

  // Save/Update prediction record in DB
  const predictionDoc = await PlacementPrediction.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      readinessScore: baseReadiness,
      readinessTier,
      targetTier,
      weeklyHours,
      estimatedWeeksToReady,
      estimatedHoursTotal: totalHoursNeeded,
      learningVelocity: velocityText,
      testsAnalyzed: results.length,
      overallAccuracy: baseReadiness,
      subjectBreakdown,
      improvementAreas,
      companyTierFits,
      projectedTrajectory,
      aiExecutiveSummary,
      aiStrategicPlan,
      dangerZones,
    },
    { upsert: true, new: true }
  );

  return predictionDoc;
};

// @desc Get placement readiness prediction for authenticated student
// @route GET /api/prediction/readiness
export const getPlacementReadiness = async (req, res) => {
  try {
    const prediction = await calculatePrediction(req.user._id);
    res.json(prediction);
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({ message: error.message || "Failed to generate prediction" });
  }
};

// @desc Recalculate prediction with modified weekly hours or target tier
// @route POST /api/prediction/recalculate
// body: { weeklyHours, targetTier }
export const recalculatePlacementReadiness = async (req, res) => {
  try {
    const { weeklyHours, targetTier } = req.body;
    const prediction = await calculatePrediction(req.user._id, { weeklyHours, targetTier });
    res.json(prediction);
  } catch (error) {
    console.error("Recalculate prediction error:", error);
    res.status(500).json({ message: error.message || "Failed to recalculate prediction" });
  }
};
