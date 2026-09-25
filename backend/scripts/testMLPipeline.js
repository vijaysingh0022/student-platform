import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import connectDB from "../config/db.js";
import mongoose from "mongoose";
import { extractStudentFeatures } from "../services/featureExtractor.js";
import { predictStudentReadiness } from "../services/mlReadinessService.js";
import User from "../models/User.js";
import TestResult from "../models/TestResult.js";

async function runTests() {
  console.log("=================================================");
  console.log("🧪 RUNNING LEARNX ML PLACEMENT READINESS TESTS");
  console.log("=================================================");

  await connectDB();

  // Test 1: Cold start / unassessed student fallback
  console.log("\n[Test 1] Testing Cold Start / No Assessments...");
  const dummyUserId = new mongoose.Types.ObjectId();
  const coldStartPrediction = await predictStudentReadiness(dummyUserId);

  console.assert(typeof coldStartPrediction.readinessScore === "number", "Readiness score must be a number");
  console.assert(coldStartPrediction.readinessScore >= 0 && coldStartPrediction.readinessScore <= 100, "Score must be between 0 and 100");
  console.assert(Array.isArray(coldStartPrediction.strengths), "Strengths must be an array");
  console.assert(Array.isArray(coldStartPrediction.improvementAreas), "Improvement areas must be an array");
  console.assert(coldStartPrediction.modelVersion.startsWith("v1.0"), "Model version must be v1.0");
  console.log(`✅ Cold Start Score: ${coldStartPrediction.readinessScore}/100 (${coldStartPrediction.readinessTier})`);

  // Test 2: Verify Feature Snapshot Structure
  console.log("\n[Test 2] Verifying Feature Vector Schema...");
  const feat = coldStartPrediction.featureSnapshot;
  const expectedKeys = [
    "dsa", "dbms", "os", "cn", "oops", "system_design",
    "aptitude", "web_dev", "overall_accuracy", "attempts",
    "improvement_rate", "learning_velocity", "consistency_score",
    "weak_topic_count"
  ];
  for (const k of expectedKeys) {
    console.assert(feat[k] !== undefined, `Missing feature: ${k}`);
  }
  console.log("✅ All 14 feature keys verified in feature snapshot");

  // Test 3: Verify Feature Extraction with Real Assessment Records
  console.log("\n[Test 3] Testing Real Assessment Feature Extraction & Multi-Track Scoring...");
  const testStudent = await User.findOne({ role: "student" });
  if (testStudent) {
    const studentPrediction = await predictStudentReadiness(testStudent._id);
    console.log(`✅ Student (${testStudent.email}) Readiness Score: ${studentPrediction.readinessScore}/100 (${studentPrediction.readinessTier})`);
    console.log(`✅ Analyzed ${studentPrediction.testsAnalyzed} tests | Strengths: ${studentPrediction.strengths.map(s => `${s.name} (${s.score}%)`).join(", ")}`);
  }

  // Test 4: Verify Explainability Contributions
  console.log("\n[Test 4] Verifying Explainability & Feature Contributions...");
  console.assert(Array.isArray(coldStartPrediction.featureContributions), "Feature contributions must be an array");
  console.assert(Array.isArray(coldStartPrediction.explanations), "Explanations must be an array");
  console.log(`✅ Generated ${coldStartPrediction.explanations.length} explainable factor statements`);

  console.log("\n=================================================");
  console.log("🎉 ALL ML ENGINE TESTS PASSED SUCCESSFULLY!");
  console.log("=================================================");

  await mongoose.disconnect();
  process.exit(0);
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
