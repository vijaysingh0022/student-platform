import TestResult from "../models/TestResult.js";

// Standard CSE Placement Domains
export const PLACEMENT_DOMAINS = [
  "DSA",
  "DBMS",
  "OS",
  "CN",
  "OOPS",
  "SYSTEM_DESIGN",
  "APTITUDE",
  "WEB_DEV",
];

const DOMAIN_KEY_MAP = {
  DSA: "dsa",
  DBMS: "dbms",
  OS: "os",
  CN: "cn",
  OOPS: "oops",
  SYSTEM_DESIGN: "system_design",
  APTITUDE: "aptitude",
  WEB_DEV: "web_dev",
};

/**
 * Extracts quantifiable learning & assessment features from a student's historical test results.
 * @param {string} userId - MongoDB ObjectId of the student
 * @param {string} [assessmentId] - Optional specific assessment ID to anchor against
 * @returns {Promise<Object>} Feature vector and structured domain breakdown
 */
export const extractStudentFeatures = async (userId, assessmentId = null) => {
  // Query actual student assessment records from MongoDB
  const query = { user: userId };
  if (assessmentId) {
    // If specific assessment is requested, fetch up to that assessment
    const target = await TestResult.findById(assessmentId);
    if (target) {
      query.createdAt = { $lte: target.createdAt };
    }
  }

  const results = await TestResult.find(query).sort({ createdAt: 1 });

  // Map to store per-subject test scores and topic breakdowns
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

  const topicBreakdowns = {};
  let totalCorrectSum = 0;
  let totalQuestionsSum = 0;

  for (const r of results) {
    if (subjectScores[r.subject]) {
      subjectScores[r.subject].push(r.scorePercent);
    }
    if (r.topicBreakdown) {
      for (const [topicName, stats] of Object.entries(r.topicBreakdown)) {
        const key = `${r.subject}:${topicName}`;
        if (!topicBreakdowns[key]) {
          topicBreakdowns[key] = { subject: r.subject, topic: topicName, correct: 0, total: 0 };
        }
        topicBreakdowns[key].correct += stats.correct || 0;
        topicBreakdowns[key].total += stats.total || 0;
        totalCorrectSum += stats.correct || 0;
        totalQuestionsSum += stats.total || 0;
      }
    }
  }

  // Calculate subject average scores (fallback to neutral baseline if not yet assessed)
  const features = {};
  const subjectBreakdown = [];
  const subjectScoresArray = [];

  for (const domain of PLACEMENT_DOMAINS) {
    const scores = subjectScores[domain] || [];
    let avgScore = 0;
    let assessed = false;

    if (scores.length > 0) {
      avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      assessed = true;
    } else {
      avgScore = 40.0; // Baseline unassessed initial standard
    }

    const featureKey = DOMAIN_KEY_MAP[domain];
    features[featureKey] = avgScore;
    subjectScoresArray.push(avgScore);

    subjectBreakdown.push({
      subject: domain,
      featureKey,
      score: avgScore,
      assessed,
      testCount: scores.length,
      status: avgScore >= 75 ? "Strong" : avgScore >= 55 ? "Moderate" : "Needs Attention",
    });
  }

  // 1. Overall Accuracy across all assessment attempts
  const attempts = Math.max(1, results.length);
  features.attempts = attempts;

  if (totalQuestionsSum > 0) {
    features.overall_accuracy = Math.round((totalCorrectSum / totalQuestionsSum) * 100);
  } else {
    features.overall_accuracy = Math.round(
      subjectScoresArray.reduce((a, b) => a + b, 0) / subjectScoresArray.length
    );
  }

  // 2. Improvement Rate (Delta between first and latest score)
  let improvementRate = 0;
  if (results.length >= 2) {
    const firstScore = results[0].scorePercent || 0;
    const latestScore = results[results.length - 1].scorePercent || 0;
    improvementRate = latestScore - firstScore;
  }
  features.improvement_rate = improvementRate;

  // 3. Learning Velocity (Rate of competency progress per test attempt)
  const velocityFactor = Math.round(
    Math.min(15.0, Math.max(0.5, ((improvementRate + 15) / (attempts + 1)) * 1.8 + (features.overall_accuracy / 100) * 4.0)) * 10
  ) / 10;
  features.learning_velocity = velocityFactor;

  // 4. Consistency Score (Uniformity across domain scores)
  const meanScore = subjectScoresArray.reduce((a, b) => a + b, 0) / subjectScoresArray.length;
  const variance = subjectScoresArray.reduce((a, b) => a + Math.pow(b - meanScore, 2), 0) / subjectScoresArray.length;
  const stdDev = Math.sqrt(variance);
  features.consistency_score = Math.round(Math.max(20, Math.min(98, 100 - stdDev * 3.2)));

  // 5. Weak Topic Count (<60% accuracy in topic breakdown)
  let weakTopicCount = 0;
  const weakTopicList = [];
  const strongTopicList = [];

  for (const [key, tStats] of Object.entries(topicBreakdowns)) {
    const pct = tStats.total > 0 ? Math.round((tStats.correct / tStats.total) * 100) : 0;
    if (pct < 60) {
      weakTopicCount++;
      weakTopicList.push({
        subject: tStats.subject,
        topic: tStats.topic,
        score: pct,
        targetScore: 85,
        delta: 85 - pct,
      });
    } else if (pct >= 75) {
      strongTopicList.push({
        subject: tStats.subject,
        topic: tStats.topic,
        score: pct,
      });
    }
  }

  // If no detailed topic breakdown recorded yet, extrapolate from subject averages
  if (weakTopicCount === 0 && results.length > 0) {
    subjectBreakdown.forEach((s) => {
      if (s.score < 60) {
        weakTopicCount++;
        weakTopicList.push({
          subject: s.subject,
          topic: `${s.subject} Core Fundamentals`,
          score: s.score,
          targetScore: 85,
          delta: 85 - s.score,
        });
      }
    });
  }

  features.weak_topic_count = weakTopicCount;

  // Identify Top 3 Strengths and Top 3 Improvement Areas
  const sortedByScore = [...subjectBreakdown].sort((a, b) => b.score - a.score);
  const strengths = sortedByScore.slice(0, 3).map((s) => ({
    name: s.subject,
    score: s.score,
    status: "Strong Competency",
  }));
  const improvementAreas = sortedByScore.slice(-3).reverse().map((s) => ({
    name: s.subject,
    score: s.score,
    status: s.score < 60 ? "Critical Gap" : "Development Area",
  }));

  // Historical score progression
  const historyTrend = results.map((r, idx) => ({
    attempt: idx + 1,
    subject: r.subject,
    score: r.scorePercent,
    date: r.createdAt,
  }));

  return {
    featureVector: features,
    subjectBreakdown,
    strengths,
    improvementAreas,
    weakTopics: weakTopicList,
    strongTopics: strongTopicList,
    historyTrend,
    testsAnalyzed: results.length,
  };
};
