/**
 * CareerTwin Controller
 *
 * Aggregates data from TestResult, TopicProgress, MockInterview,
 * CareerProfile, PlacementPrediction, and SkillGraph to compute
 * a continuously-updated AI Career Twin profile.
 *
 * All scores are EDUCATIONAL READINESS INDICATORS.
 * They do NOT represent hiring probability or guaranteed placement.
 */

import CareerTwin from "../models/CareerTwin.js";
import CareerProfile from "../models/CareerProfile.js";
import TestResult from "../models/TestResult.js";
import TopicProgress from "../models/TopicProgress.js";
import MockInterview from "../models/MockInterview.js";
import PlacementPrediction from "../models/PlacementPrediction.js";
import { getAIClient, getAIModel } from "../config/ai.js";
import { recordAuditLog } from "../utils/auditLogger.js";

// ─── Skill Domain Map ────────────────────────────────────────────────────────
const SKILL_DOMAIN_MAP = {
  dsa: ["dsa", "data structure", "algorithm", "binary tree", "graph", "dp", "sorting", "searching", "linked list", "stack", "queue"],
  dbms: ["dbms", "database", "sql", "normalization", "indexing", "transaction", "acid", "er diagram", "query"],
  os: ["os", "operating system", "process", "thread", "scheduling", "memory", "paging", "deadlock", "semaphore"],
  cn: ["cn", "computer network", "osi", "tcp", "ip", "udp", "protocol", "subnetting", "http", "dns", "routing"],
  oops: ["oops", "oop", "object orient", "polymorphism", "inheritance", "encapsulation", "abstraction", "design pattern"],
  systemDesign: ["system design", "scalability", "load balancer", "microservice", "cache", "distributed", "cap theorem"],
  webDev: ["web", "javascript", "react", "html", "css", "node", "express", "rest api", "frontend", "backend"],
  coding: ["coding", "code", "programming"],
};

// ─── Role Skill Weights ─────────────────────────────────────────────────────
const ROLE_WEIGHTS = {
  "Software Engineer": { dsa: 0.30, dbms: 0.15, os: 0.15, cn: 0.10, oops: 0.15, webDev: 0.10, coding: 0.05 },
  "Frontend Developer": { webDev: 0.35, dsa: 0.20, oops: 0.15, dbms: 0.10, os: 0.05, cn: 0.05, coding: 0.10 },
  "Backend Developer": { dsa: 0.25, dbms: 0.25, os: 0.15, cn: 0.15, oops: 0.10, webDev: 0.05, coding: 0.05 },
  "Full Stack Developer": { webDev: 0.25, dsa: 0.20, dbms: 0.20, os: 0.10, cn: 0.10, oops: 0.10, coding: 0.05 },
  "Data Analyst": { dbms: 0.30, dsa: 0.25, os: 0.10, cn: 0.05, oops: 0.10, webDev: 0.10, coding: 0.10 },
  "AI/ML Engineer": { dsa: 0.25, dbms: 0.15, os: 0.10, oops: 0.15, webDev: 0.15, coding: 0.20 },
  "default": { dsa: 0.25, dbms: 0.20, os: 0.15, cn: 0.10, oops: 0.15, webDev: 0.10, coding: 0.05 },
};

// ─── Role Skill Requirements ─────────────────────────────────────────────────
const ROLE_REQUIREMENTS = {
  "Software Engineer": {
    strong: ["DSA", "OOP", "OS"],
    needed: ["System Design", "DBMS", "Algorithms"],
  },
  "Frontend Developer": {
    strong: ["JavaScript / Web Dev", "DSA (Fundamentals)", "OOP"],
    needed: ["React Ecosystem", "CSS Architecture", "Performance Optimization"],
  },
  "Backend Developer": {
    strong: ["DSA", "DBMS", "OS", "Computer Networks"],
    needed: ["System Design", "Security Patterns", "API Architecture"],
  },
  "Full Stack Developer": {
    strong: ["Web Dev", "DSA", "DBMS"],
    needed: ["System Design", "DevOps Basics", "CS Fundamentals"],
  },
  "Data Analyst": {
    strong: ["DBMS / SQL", "Statistical Thinking"],
    needed: ["Data Visualization", "Python / R", "Business Acumen"],
  },
  "default": {
    strong: ["DSA", "OOP"],
    needed: ["DBMS", "OS", "System Design"],
  },
};

const SPRINT_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function mapSubjectToSkill(subjectStr) {
  if (!subjectStr) return null;
  const s = subjectStr.toLowerCase();
  for (const [skill, keywords] of Object.entries(SKILL_DOMAIN_MAP)) {
    if (keywords.some((kw) => s.includes(kw))) return skill;
  }
  return null;
}

function clamp(val, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(val)));
}

function getConfidence(totalSignals) {
  if (totalSignals >= 50) return "high";
  if (totalSignals >= 15) return "moderate";
  return "low";
}

function getActionRoute(skill) {
  const routes = {
    dsa: "/test/dsa",
    dbms: "/test/dbms",
    os: "/test/os",
    cn: "/test/cn",
    oops: "/test/oops",
    webDev: "/coding-lab",
    coding: "/coding-lab",
    systemDesign: "/roadmap/DSA",
    interview: "/mock-interview",
  };
  return routes[skill] || "/learn";
}

// ─── Core Computation Engine ─────────────────────────────────────────────────
async function computeCareerTwin(userId, targetRole = "") {
  const role = targetRole || "Software Engineer";
  const weights = ROLE_WEIGHTS[role] || ROLE_WEIGHTS["default"];

  // Fetch all data in parallel
  const [
    testResults,
    topicProgressList,
    interviewList,
    latestPrediction,
    careerProfile,
  ] = await Promise.all([
    TestResult.find({ user: userId }).sort({ createdAt: -1 }).limit(30).lean(),
    TopicProgress.find({ user: userId }).lean(),
    MockInterview.find({ user: userId, completed: true }).sort({ createdAt: -1 }).limit(10).lean(),
    PlacementPrediction.findOne({ user: userId }).sort({ createdAt: -1 }).lean(),
    CareerProfile.findOne({ user: userId }).lean(),
  ]);

  // ── 1. Build skill scores from test results ──────────────────────────────
  const skillAccumulator = {};
  Object.keys(SKILL_DOMAIN_MAP).forEach((sk) => {
    skillAccumulator[sk] = { total: 0, count: 0 };
  });

  let totalSignals = 0;

  // From test results
  for (const tr of testResults) {
    const skill = mapSubjectToSkill(tr.subject);
    if (skill && skillAccumulator[skill]) {
      skillAccumulator[skill].total += tr.scorePercent || 0;
      skillAccumulator[skill].count += 1;
      totalSignals += 1;
    }

    // Topic breakdown within each test
    if (tr.topicBreakdown && typeof tr.topicBreakdown === "object") {
      for (const [topic, data] of Object.entries(tr.topicBreakdown)) {
        if (data?.total > 0) {
          const topicSkill = mapSubjectToSkill(topic);
          if (topicSkill && skillAccumulator[topicSkill]) {
            const pct = Math.round((data.correct / data.total) * 100);
            skillAccumulator[topicSkill].total += pct;
            skillAccumulator[topicSkill].count += 1;
            totalSignals += 1;
          }
        }
      }
    }
  }

  // From topic progress (quiz-based mastery)
  for (const tp of topicProgressList) {
    if (tp.attemptsCount > 0 && tp.masteryPercentage > 0) {
      const skill = mapSubjectToSkill(tp.subjectId);
      if (skill && skillAccumulator[skill]) {
        skillAccumulator[skill].total += tp.masteryPercentage;
        skillAccumulator[skill].count += 1;
        totalSignals += 1;
      }
    }
  }

  // From placement prediction feature snapshot
  if (latestPrediction?.featureSnapshot) {
    const snap = latestPrediction.featureSnapshot;
    const snapMap = {
      dsa: snap.dsa,
      dbms: snap.dbms,
      os: snap.os,
      cn: snap.cn,
      oops: snap.oops,
      webDev: snap.web_dev,
    };
    for (const [sk, val] of Object.entries(snapMap)) {
      if (val && val > 0 && skillAccumulator[sk]) {
        // Weight placement prediction lower (it may be older)
        skillAccumulator[sk].total += val * 0.5;
        skillAccumulator[sk].count += 0.5;
        totalSignals += 1;
      }
    }
  }

  // Compute raw skill scores
  const skillScores = {};
  for (const [skill, { total, count }] of Object.entries(skillAccumulator)) {
    skillScores[skill] = count > 0 ? clamp(total / count) : 0;
  }

  // ── 2. Coding score from interview & coding lab ──────────────────────────
  if (interviewList.length > 0) {
    const avgInterviewScore = interviewList.reduce((s, i) => s + (i.overallScore || 0), 0) / interviewList.length;
    skillScores.interview = clamp(avgInterviewScore);
    totalSignals += interviewList.length;
  }

  if (careerProfile?.mockInterviewScore > 0) {
    skillScores.interview = clamp(
      (skillScores.interview + careerProfile.mockInterviewScore) / 2
    );
  }

  // ── 3. Coding consistency score from topicProgress ──────────────────────
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentActivity = topicProgressList.filter(
    (tp) => tp.updatedAt && new Date(tp.updatedAt) > oneWeekAgo
  ).length;
  const codingConsistency = Math.min(100, recentActivity * 10);
  skillScores.coding = clamp(
    (skillScores.coding + codingConsistency) / (skillScores.coding > 0 ? 2 : 1)
  );

  // ── 4. Compute weighted readiness score ─────────────────────────────────
  let weightedSum = 0;
  let totalWeight = 0;
  for (const [skill, weight] of Object.entries(weights)) {
    const score = skillScores[skill] || 0;
    weightedSum += score * weight;
    totalWeight += weight;
  }
  // Add interview score with fixed weight
  if (skillScores.interview > 0) {
    weightedSum += skillScores.interview * 0.10;
    totalWeight += 0.10;
  }
  const overallReadinessScore = totalWeight > 0
    ? clamp(weightedSum / totalWeight)
    : 0;

  // ── 5. Score factors for explainability ─────────────────────────────────
  const scoreFactors = [];
  const skillLabels = {
    dsa: "DSA Performance",
    dbms: "DBMS Performance",
    os: "Operating Systems",
    cn: "Computer Networks",
    oops: "OOP Concepts",
    webDev: "Web Development",
    coding: "Coding Consistency",
    systemDesign: "System Design",
    interview: "Mock Interview Performance",
  };
  for (const [skill, score] of Object.entries(skillScores)) {
    if (score === 0) continue;
    scoreFactors.push({
      label: skillLabels[skill] || skill,
      impact: score >= 70 ? "positive" : "negative",
      value: `${score}%`,
    });
  }
  // Sort: negatives first for actionability
  scoreFactors.sort((a, b) =>
    a.impact === "negative" && b.impact !== "negative" ? -1 :
    a.impact !== "negative" && b.impact === "negative" ? 1 : 0
  );

  // ── 6. Top Bottlenecks ───────────────────────────────────────────────────
  const bottleneckCandidates = Object.entries(skillScores)
    .filter(([, score]) => score > 0 && score < 75)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3);

  const topBottlenecks = bottleneckCandidates.map(([skill, score], idx) => {
    const label = skillLabels[skill] || skill;
    return {
      rank: idx + 1,
      skill: label,
      score,
      evidence: `Your current ${label} accuracy is ${score}%, below the ${role} benchmark of 75%+.`,
      whyItMatters: `${label} is a ${(weights[skill] || 0.1) > 0.2 ? "core" : "important"} component for ${role} roles in technical assessments.`,
      recommendedAction: `Review key ${label} concepts and attempt a focused assessment.`,
      actionRoute: getActionRoute(skill),
    };
  });

  // ── 7. Next Best Action ──────────────────────────────────────────────────
  const weakest = bottleneckCandidates[0];
  let nextBestAction = {
    title: "Complete Your First Assessment",
    why: ["Start with any subject to generate your Career Twin profile"],
    estimatedMinutes: 20,
    priority: "HIGH",
    actionLabel: "Take Assessment",
    actionRoute: "/test",
  };

  if (weakest) {
    const [wSkill, wScore] = weakest;
    const label = skillLabels[wSkill] || wSkill;

    // Find specific weak topic from topic progress
    const relevantTopic = topicProgressList
      .filter((tp) => {
        const mapped = mapSubjectToSkill(tp.subjectId || tp.topicId);
        return mapped === wSkill && tp.masteryPercentage > 0 && tp.masteryPercentage < 60;
      })
      .sort((a, b) => a.masteryPercentage - b.masteryPercentage)[0];

    const topicName = relevantTopic
      ? (relevantTopic.topicId || "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : label;

    // Weak concepts as evidence
    const weakConcepts = relevantTopic?.weakConcepts?.slice(0, 2) || [];

    const whyList = [
      `Your ${label} accuracy is ${wScore}% — below 75% threshold`,
      ...weakConcepts.map((c) => `Struggled with: ${c}`),
      `${label} is a ${(weights[wSkill] || 0.1) > 0.2 ? "top" : "key"} skill for ${role}`,
    ];
    if (recentActivity < 3) {
      whyList.push("Low recent learning activity detected");
    }

    nextBestAction = {
      title: `Master ${topicName}`,
      why: whyList.slice(0, 4),
      estimatedMinutes: Math.max(20, 40 - Math.round(wScore / 5)),
      priority: wScore < 40 ? "CRITICAL" : wScore < 60 ? "HIGH" : "MEDIUM",
      actionLabel:
        wSkill === "coding" ? "Open Coding Lab" :
        wSkill === "interview" ? "Start Mock Interview" :
        "Start Assessment",
      actionRoute: getActionRoute(wSkill),
    };
  }

  // ── 8. 7-Day Sprint ──────────────────────────────────────────────────────
  const sortedSkills = Object.entries(skillScores)
    .filter(([, s]) => s > 0)
    .sort(([, a], [, b]) => a - b);

  const sprintTasks = [
    sortedSkills[0]
      ? { task: `Revise ${skillLabels[sortedSkills[0]?.[0]]}`, minutes: 35, route: getActionRoute(sortedSkills[0]?.[0]) }
      : { task: "Complete an Assessment", minutes: 25, route: "/test" },
    sortedSkills[1]
      ? { task: `Practice ${skillLabels[sortedSkills[1]?.[0]]}`, minutes: 30, route: getActionRoute(sortedSkills[1]?.[0]) }
      : { task: "Study Roadmap Topics", minutes: 30, route: "/roadmap" },
    { task: "Coding Challenge", minutes: 40, route: "/coding-lab" },
    sortedSkills[2]
      ? { task: `Deep Dive: ${skillLabels[sortedSkills[2]?.[0]]}`, minutes: 25, route: getActionRoute(sortedSkills[2]?.[0]) }
      : { task: "AI Tutor Session", minutes: 25, route: "/tutor" },
    { task: "Mock Interview Practice", minutes: 30, route: "/mock-interview" },
    { task: "Weak Topic Revision", minutes: 45, route: nextBestAction.actionRoute },
    { task: "Career Progress Review", minutes: 20, route: "/career-twin" },
  ];

  const weekSprint = SPRINT_DAYS.map((day, idx) => ({
    day,
    task: sprintTasks[idx]?.task || "Review & Practice",
    minutes: sprintTasks[idx]?.minutes || 30,
    actionRoute: sprintTasks[idx]?.route || "/learn",
    status: "pending",
  }));

  // ── 9. Role Fit ──────────────────────────────────────────────────────────
  const roleReqs = ROLE_REQUIREMENTS[role] || ROLE_REQUIREMENTS["default"];
  const roleWeights = weights;

  // Compute role fit: weighted average of skills important for this role
  let roleFitSum = 0;
  let roleFitTotalW = 0;
  for (const [skill, weight] of Object.entries(roleWeights)) {
    roleFitSum += (skillScores[skill] || 0) * weight;
    roleFitTotalW += weight;
  }
  const fitPercent = roleFitTotalW > 0 ? clamp(roleFitSum / roleFitTotalW) : 0;

  // Find which required skills are currently strong vs missing
  const roleSkillMap = {
    DSA: "dsa", DBMS: "dbms", OS: "os",
    "Computer Networks": "cn", OOP: "oops",
    "Web Dev": "webDev", Coding: "coding",
  };

  const strongAreas = [];
  const missingAreas = [];
  for (const [label, skill] of Object.entries(roleSkillMap)) {
    const score = skillScores[skill] || 0;
    if (score >= 70) strongAreas.push(`${label} (${score}%)`);
    else if (score > 0 && score < 70) missingAreas.push(`${label} (${score}%)`);
  }

  const roleFit = {
    targetRole: role,
    fitPercent,
    strongAreas: strongAreas.slice(0, 5),
    missingAreas: missingAreas.slice(0, 5),
    gapActions: roleReqs.needed.map((n) => `Improve ${n}`),
  };

  // ── 10. Build timeline from recent activity ──────────────────────────────
  const timeline = [];

  // From recent test results
  for (const tr of testResults.slice(0, 5)) {
    timeline.push({
      date: tr.createdAt,
      event: `Completed ${tr.subject} Assessment`,
      impact: `Score: ${tr.scorePercent}% — ${tr.scorePercent >= 75 ? "strength confirmed" : "weakness detected"}`,
      type: "assessment",
    });
  }

  // From recent mock interviews
  for (const mi of interviewList.slice(0, 3)) {
    timeline.push({
      date: mi.createdAt,
      event: `Completed Mock Interview (${mi.role || "General"})`,
      impact: `Score: ${mi.overallScore}/100 — Interview readiness updated`,
      type: "interview",
    });
  }

  // Sort by date desc, take top 10
  timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    overallReadinessScore,
    dataConfidence: getConfidence(totalSignals),
    totalSignals,
    targetRole: role,
    skillScores,
    scoreFactors,
    topBottlenecks,
    nextBestAction,
    weekSprint,
    roleFit,
    timeline: timeline.slice(0, 10),
  };
}

// ─── Controller Functions ────────────────────────────────────────────────────

/**
 * GET /api/career-twin
 * Returns the full Career Twin profile, recomputing if stale (>30min)
 */
export const getCareerTwin = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find existing or create new
    let twin = await CareerTwin.findOne({ user: userId });
    const staleThreshold = 30 * 60 * 1000; // 30 minutes
    const isStale =
      !twin ||
      !twin.lastComputedAt ||
      Date.now() - new Date(twin.lastComputedAt).getTime() > staleThreshold;

    if (isStale) {
      const careerProfile = await CareerProfile.findOne({ user: userId }).lean();
      const targetRole = twin?.targetRole || careerProfile?.targetRole || "Software Engineer";

      const computed = await computeCareerTwin(userId, targetRole);

      if (!twin) {
        twin = await CareerTwin.create({
          user: userId,
          ...computed,
          lastComputedAt: new Date(),
        });
      } else {
        // Merge sprint statuses (don't overwrite user progress)
        const existingSprintMap = {};
        for (const s of twin.weekSprint || []) {
          existingSprintMap[s.day] = s.status;
        }
        const mergedSprint = computed.weekSprint.map((s) => ({
          ...s,
          status: existingSprintMap[s.day] || s.status,
        }));

        // Merge timeline (append new events)
        const existingEventKeys = new Set(
          (twin.timeline || []).map((t) => `${t.event}|${new Date(t.date).toDateString()}`)
        );
        const newEvents = computed.timeline.filter(
          (t) => !existingEventKeys.has(`${t.event}|${new Date(t.date).toDateString()}`)
        );

        twin = await CareerTwin.findOneAndUpdate(
          { user: userId },
          {
            $set: {
              overallReadinessScore: computed.overallReadinessScore,
              dataConfidence: computed.dataConfidence,
              totalSignals: computed.totalSignals,
              skillScores: computed.skillScores,
              scoreFactors: computed.scoreFactors,
              topBottlenecks: computed.topBottlenecks,
              nextBestAction: computed.nextBestAction,
              weekSprint: mergedSprint,
              roleFit: computed.roleFit,
              lastComputedAt: new Date(),
            },
            $push: {
              timeline: { $each: newEvents, $position: 0, $slice: 20 },
            },
          },
          { new: true, upsert: true }
        );
      }
    }

    // Fetch user info
    const careerProfile = await CareerProfile.findOne({ user: userId }).lean();
    const targetRole = twin.targetRole || careerProfile?.targetRole || "Software Engineer";

    res.json({
      success: true,
      careerTwin: twin,
      user: {
        targetRole,
        atsScore: careerProfile?.atsScore || 0,
        projects: careerProfile?.savedProjects || [],
      },
    });
  } catch (err) {
    console.error("getCareerTwin error:", err);
    res.status(500).json({ success: false, message: "Failed to load Career Twin." });
  }
};

/**
 * POST /api/career-twin/refresh
 * Forces a recompute of Career Twin data
 */
export const refreshCareerTwin = async (req, res) => {
  try {
    const userId = req.user._id;
    const careerProfile = await CareerProfile.findOne({ user: userId }).lean();
    const twin = await CareerTwin.findOne({ user: userId }).lean();
    const targetRole = req.body.targetRole || twin?.targetRole || careerProfile?.targetRole || "Software Engineer";

    const computed = await computeCareerTwin(userId, targetRole);

    const updated = await CareerTwin.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          ...computed,
          targetRole,
          lastComputedAt: new Date(),
        },
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, careerTwin: updated });
  } catch (err) {
    console.error("refreshCareerTwin error:", err);
    res.status(500).json({ success: false, message: "Failed to refresh Career Twin." });
  }
};

/**
 * PATCH /api/career-twin/sprint/:day
 * Update sprint day status (started, completed, skipped)
 */
export const updateSprintDay = async (req, res) => {
  try {
    const userId = req.user._id;
    const { day } = req.params;
    const { status } = req.body;

    if (!["started", "completed", "skipped", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const twin = await CareerTwin.findOne({ user: userId });
    if (!twin) return res.status(404).json({ message: "Career Twin not found" });

    const sprintDay = twin.weekSprint.find((s) => s.day === day.toUpperCase());
    if (!sprintDay) return res.status(404).json({ message: "Sprint day not found" });

    sprintDay.status = status;

    // Add timeline event when completed
    if (status === "completed") {
      twin.timeline.unshift({
        date: new Date(),
        event: `Completed sprint task: ${sprintDay.task}`,
        impact: "Career Twin sprint progress updated",
        type: "achievement",
      });
      if (twin.timeline.length > 20) twin.timeline = twin.timeline.slice(0, 20);
    }

    await twin.save();
    res.json({ success: true, weekSprint: twin.weekSprint });
  } catch (err) {
    console.error("updateSprintDay error:", err);
    res.status(500).json({ message: "Failed to update sprint." });
  }
};

/**
 * PATCH /api/career-twin/target-role
 * Update target role and recompute
 */
export const updateCareerTwinRole = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetRole } = req.body;
    if (!targetRole) return res.status(400).json({ message: "targetRole required" });

    // Also update CareerProfile for consistency
    await CareerProfile.findOneAndUpdate(
      { user: userId },
      { targetRole },
      { upsert: true }
    );

    const computed = await computeCareerTwin(userId, targetRole);
    const updated = await CareerTwin.findOneAndUpdate(
      { user: userId },
      { $set: { ...computed, targetRole, lastComputedAt: new Date() } },
      { new: true, upsert: true }
    );

    res.json({ success: true, careerTwin: updated });
  } catch (err) {
    console.error("updateCareerTwinRole error:", err);
    res.status(500).json({ message: "Failed to update role." });
  }
};

/**
 * POST /api/career-twin/coach-chat
 * AI Career Twin conversational assistant
 */
export const careerTwinChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ message: "Message required" });

    const twin = await CareerTwin.findOne({ user: userId }).lean();
    if (!twin) return res.status(404).json({ message: "Career Twin not found. Please refresh first." });

    const context = `
Student Career Twin Profile:
- Overall Readiness: ${twin.overallReadinessScore}/100 (Educational indicator, not a hiring guarantee)
- Target Role: ${twin.targetRole || "Software Engineer"}
- Confidence: ${twin.dataConfidence} (based on ${twin.totalSignals} learning signals)
- Skill Scores: ${JSON.stringify(twin.skillScores, null, 2)}
- Top Bottlenecks: ${twin.topBottlenecks?.map((b) => `${b.skill} (${b.score}%)`).join(", ")}
- Next Best Action: ${twin.nextBestAction?.title}
- Strong factors: ${twin.scoreFactors?.filter((f) => f.impact === "positive").map((f) => f.label).join(", ") || "None yet"}
- Weak factors: ${twin.scoreFactors?.filter((f) => f.impact === "negative").map((f) => f.label).join(", ") || "None yet"}
- Role Fit: ${twin.roleFit?.fitPercent}% for ${twin.roleFit?.targetRole}
- Strong areas: ${twin.roleFit?.strongAreas?.join(", ") || "None yet"}
- Missing areas: ${twin.roleFit?.missingAreas?.join(", ") || "None yet"}

IMPORTANT: Always frame scores as educational readiness indicators. Never claim guaranteed placement or hiring probability.
You are the student's AI Career Coach. Answer ONLY based on their actual profile data above. Be direct, actionable, and empathetic.
    `.trim();

    let reply =
      "I'm analyzing your learning profile. Focus on your biggest skill gaps first — they'll have the highest impact on your readiness score.";

    try {
      const aiClient = getAIClient();
      if (aiClient) {
        const model = getAIModel();
        const completion = await aiClient.chat.completions.create({
          model,
          messages: [
            { role: "system", content: context },
            { role: "user", content: message },
          ],
          max_tokens: 350,
          temperature: 0.6,
        });
        reply = completion.choices?.[0]?.message?.content?.trim() || reply;
      }
    } catch (aiErr) {
      console.warn("AI coach unavailable:", aiErr.message);
    }

    // Persist last 20 messages
    await CareerTwin.findOneAndUpdate(
      { user: userId },
      {
        $push: {
          coachChat: {
            $each: [
              { role: "user", message, timestamp: new Date() },
              { role: "assistant", message: reply, timestamp: new Date() },
            ],
            $slice: -40,
          },
        },
      }
    );

    res.json({ success: true, reply });
  } catch (err) {
    console.error("careerTwinChat error:", err);
    res.status(500).json({ message: "Coach unavailable right now." });
  }
};

/**
 * GET /api/career-twin/simulate
 * Returns impact simulation when a skill improves to a target score
 */
export const simulateImprovement = async (req, res) => {
  try {
    const userId = req.user._id;
    const { skill, targetScore } = req.query;
    if (!skill || !targetScore) {
      return res.status(400).json({ message: "skill and targetScore are required" });
    }

    const twin = await CareerTwin.findOne({ user: userId }).lean();
    if (!twin) return res.status(404).json({ message: "Career Twin not found" });

    const currentScores = { ...twin.skillScores };
    const currentOverall = twin.overallReadinessScore;
    const role = twin.targetRole || "Software Engineer";
    const weights = ROLE_WEIGHTS[role] || ROLE_WEIGHTS["default"];

    // Simulate new scores
    const simulatedScores = { ...currentScores, [skill]: clamp(Number(targetScore)) };

    // Recompute weighted readiness with simulated scores
    let simWeightedSum = 0;
    let simTotalW = 0;
    for (const [sk, weight] of Object.entries(weights)) {
      simWeightedSum += (simulatedScores[sk] || 0) * weight;
      simTotalW += weight;
    }
    if (simulatedScores.interview > 0) {
      simWeightedSum += simulatedScores.interview * 0.10;
      simTotalW += 0.10;
    }
    const simulatedOverall = simTotalW > 0 ? clamp(simWeightedSum / simTotalW) : 0;

    // Role fit delta
    let simRoleFitSum = 0;
    for (const [sk, weight] of Object.entries(weights)) {
      simRoleFitSum += (simulatedScores[sk] || 0) * weight;
    }
    const simulatedFit = simTotalW > 0 ? clamp(simRoleFitSum / simTotalW) : 0;

    res.json({
      success: true,
      disclaimer: "This is an estimated educational impact based on your current profile. Not a hiring prediction.",
      currentOverall,
      simulatedOverall,
      delta: simulatedOverall - currentOverall,
      currentFit: twin.roleFit?.fitPercent || 0,
      simulatedFit,
      fitDelta: simulatedFit - (twin.roleFit?.fitPercent || 0),
      skill,
      fromScore: currentScores[skill] || 0,
      toScore: clamp(Number(targetScore)),
    });
  } catch (err) {
    console.error("simulateImprovement error:", err);
    res.status(500).json({ message: "Simulation failed." });
  }
};
