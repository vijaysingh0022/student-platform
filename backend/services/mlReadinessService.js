import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { extractStudentFeatures } from "./featureExtractor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODEL_WEIGHTS_PATH = path.resolve(__dirname, "../../ml/models/model_weights.json");
const MODEL_VERSION = "v1.0";

// Fallback baseline weights if model_weights.json is still being generated or missing
const FALLBACK_WEIGHTS = {
  modelVersion: "v1.0-fallback",
  featureOrder: [
    "dsa", "dbms", "os", "cn", "oops", "system_design",
    "aptitude", "web_dev", "overall_accuracy", "attempts",
    "improvement_rate", "learning_velocity", "consistency_score",
    "weak_topic_count"
  ],
  scalerMeans: [60.0, 58.0, 56.0, 54.0, 59.0, 52.0, 62.0, 57.0, 57.5, 3.5, 8.0, 5.5, 72.0, 2.5],
  scalerScales: [18.0, 17.0, 17.5, 18.0, 16.5, 19.0, 16.0, 17.5, 15.0, 2.8, 12.0, 3.2, 14.0, 2.0],
  coefficients: [4.8, 3.2, 2.4, 2.2, 2.5, 3.6, 2.6, 1.4, 3.5, 1.8, 1.2, 2.1, 1.5, -2.8],
  intercept: 68.5,
};

let loadedModel = null;

function getModelWeights() {
  if (loadedModel) return loadedModel;
  try {
    if (fs.existsSync(MODEL_WEIGHTS_PATH)) {
      const data = fs.readFileSync(MODEL_WEIGHTS_PATH, "utf-8");
      loadedModel = JSON.parse(data);
      return loadedModel;
    }
  } catch (err) {
    console.warn("Could not load ML model weights file, using calibrated fallback:", err.message);
  }
  return FALLBACK_WEIGHTS;
}

/**
 * Predicts placement readiness score using the trained ML model weights and feature extractor.
 * @param {string} userId - Student ID
 * @param {string} [assessmentId] - Optional assessment ID
 * @returns {Promise<Object>} Formatted placement readiness analysis
 */
export const predictStudentReadiness = async (userId, assessmentId = null) => {
  // 1. Extract feature vector from student's actual assessment history in MongoDB
  const extracted = await extractStudentFeatures(userId, assessmentId);
  const { featureVector, subjectBreakdown, strengths, improvementAreas, weakTopics, historyTrend, testsAnalyzed } = extracted;

  // 2. Load model
  const model = getModelWeights();
  const featureOrder = model.featureOrder || FALLBACK_WEIGHTS.featureOrder;
  const means = model.scalerMeans || FALLBACK_WEIGHTS.scalerMeans;
  const scales = model.scalerScales || FALLBACK_WEIGHTS.scalerScales;
  const coefs = model.coefficients || FALLBACK_WEIGHTS.coefficients;
  const intercept = model.intercept ?? FALLBACK_WEIGHTS.intercept;

  // 3. Compute scaled features and model score: y = intercept + sum(coef_i * (x_i - mean_i) / scale_i)
  let rawScore = intercept;
  const featureContributions = [];

  for (let i = 0; i < featureOrder.length; i++) {
    const featName = featureOrder[i];
    const rawVal = Number(featureVector[featName] ?? 50.0);
    const mean = Number(means[i] ?? 50.0);
    const scale = Number(scales[i] || 1.0);
    const coef = Number(coefs[i] ?? 0.0);

    const standardizedVal = (rawVal - mean) / scale;
    const contribution = standardizedVal * coef;
    rawScore += contribution;

    featureContributions.push({
      feature: featName,
      rawValue: rawVal,
      contribution: Math.round(contribution * 10) / 10,
    });
  }

  // 4. Bound final score within [0, 100] and round to 1 decimal place
  const readinessScore = Math.round(Math.max(10, Math.min(99, rawScore)));

  // 5. Categorize into standardized readiness tiers
  let readinessTier = "Foundational Stage (<58%)";
  let tierLevel = "Level 1";
  if (readinessScore >= 85) {
    readinessTier = "Tier-1 Product Company Ready (85%+)";
    tierLevel = "Level 4 (Elite)";
  } else if (readinessScore >= 72) {
    readinessTier = "Product & FinTech Ready (72-84%)";
    tierLevel = "Level 3 (Advanced)";
  } else if (readinessScore >= 58) {
    readinessTier = "IT Services & Digital Tier Ready (58-71%)";
    tierLevel = "Level 2 (Competent)";
  }

  // 6. Generate explainable factors (major positive & negative indicators)
  const sortedContributions = [...featureContributions].sort((a, b) => b.contribution - a.contribution);
  const positiveFactors = sortedContributions.filter((c) => c.contribution > 0).slice(0, 3);
  const negativeFactors = sortedContributions.filter((c) => c.contribution < 0).reverse().slice(0, 2);

  const topStrengthNames = strengths.map((s) => s.name).join(" and ");
  const topWeakNames = improvementAreas.map((w) => w.name).join(" and ");

  const explanations = [
    `Strong demonstrated performance in ${topStrengthNames || "core concepts"} contributes positively to your placement readiness.`,
    improvementAreas.length > 0
      ? `${topWeakNames} represent the highest-leverage areas for competency improvement.`
      : "Maintain regular assessment practice across all domains to preserve topic mastery.",
    testsAnalyzed >= 2
      ? `Recent assessment trajectory shows an improvement delta of ${featureVector.improvement_rate >= 0 ? "+" : ""}${featureVector.improvement_rate}% across ${testsAnalyzed} tests.`
      : "Complete diagnostic tests across all 8 tracks to increase score fidelity.",
  ];

  return {
    readinessScore,
    readinessTier,
    tierLevel,
    modelVersion: model.modelVersion || MODEL_VERSION,
    featureSnapshot: featureVector,
    subjectBreakdown,
    strengths,
    improvementAreas,
    weakTopics,
    featureContributions,
    positiveFactors,
    negativeFactors,
    explanations,
    historyTrend,
    testsAnalyzed,
    disclaimer: "This score represents competency and learning readiness based on assessment performance. It is not an employment guarantee.",
    generatedAt: new Date(),
  };
};
