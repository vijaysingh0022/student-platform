import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import PersonalLearningTwin from "../models/PersonalLearningTwin.js";
import TopicProgress from "../models/TopicProgress.js";
import SpacedRepetitionItem from "../models/SpacedRepetition.js";
import {
  computeStudentLearningTwin,
  simulatePersonalizedPlan,
  deriveKnowledgeState,
} from "../services/personalLearningTwinService.js";
import {
  getLearningTwinProfile,
  recalculateLearningTwinProfile,
  simulateLearningPlan,
} from "../controllers/personalLearningTwinController.js";

dotenv.config({ path: "./backend/.env" });

async function runComprehensiveVerification() {
  console.log("=================================================================");
  console.log("  LEARNX 2.0: FULL COMPREHENSIVE VERIFICATION & AUDIT SUITE");
  console.log("=================================================================\n");

  const results = {
    passed: 0,
    failed: 0,
    tests: [],
  };

  function testAssert(name, condition, details = "") {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      results.passed++;
      results.tests.push({ name, status: "PASS", details });
    } else {
      console.error(`  ❌ [FAIL] ${name} - ${details}`);
      results.failed++;
      results.tests.push({ name, status: "FAIL", details });
    }
  }

  try {
    // 1. DATABASE & MONGO PERSISTENCE VERIFICATION
    console.log("--- 1. Testing MongoDB Live Connection & Model Schemas ---");
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
    testAssert("MongoDB Atlas Live Connection", mongoose.connection.readyState === 1, "ReadyState is 1 (Connected)");

    // Find or create test student
    let student = await User.findOne({ email: "demo@example.com" });
    if (!student) {
      student = await User.findOne();
    }
    testAssert("Student User Resolution", !!student, `Resolved student: ${student?.email || "none"}`);

    if (!student) {
      throw new Error("No student record found to perform verification tests.");
    }

    const userId = student._id;

    // 2. KNOWLEDGE STATE TRANSITION & EDGE CASE AUDIT
    console.log("\n--- 2. Testing 6 Knowledge State Boundary Rules & Decay ---");
    const testCases = [
      {
        input: { isCompleted: false, attemptsCount: 0, accuracy: 0, retentionConfidence: 100, daysSinceReview: 0 },
        expected: "unexplored",
        desc: "New unexplored topic",
      },
      {
        input: { isCompleted: true, attemptsCount: 1, accuracy: 45, retentionConfidence: 90, daysSinceReview: 1 },
        expected: "developing",
        desc: "Low accuracy completed attempt",
      },
      {
        input: { isCompleted: true, attemptsCount: 1, accuracy: 65, retentionConfidence: 85, daysSinceReview: 2 },
        expected: "developing",
        desc: "Developing topic (50-74% accuracy)",
      },
      {
        input: { isCompleted: true, attemptsCount: 1, accuracy: 80, retentionConfidence: 85, daysSinceReview: 2 },
        expected: "strong",
        desc: "Strong topic (>=75% accuracy)",
      },
      {
        input: { isCompleted: true, attemptsCount: 2, accuracy: 90, retentionConfidence: 85, daysSinceReview: 2 },
        expected: "mastered",
        desc: "Mastered topic (2+ attempts, >=85% accuracy, completed)",
      },
      {
        input: { isCompleted: true, attemptsCount: 2, accuracy: 90, retentionConfidence: 55, daysSinceReview: 4 },
        expected: "needs_revision",
        desc: "Retention decay < 60% triggers needs_revision",
      },
      {
        input: { isCompleted: true, attemptsCount: 2, accuracy: 90, retentionConfidence: 90, daysSinceReview: 16 },
        expected: "needs_revision",
        desc: "Interval > 14 days without active recall triggers needs_revision",
      },
    ];

    for (const tc of testCases) {
      const state = deriveKnowledgeState(tc.input);
      testAssert(`State Transition: ${tc.desc}`, state === tc.expected, `Got: ${state}, Expected: ${tc.expected}`);
    }

    // 3. SERVICE LAYER COMPUTATION VERIFICATION
    console.log("\n--- 3. Testing computeStudentLearningTwin Service Engine ---");
    const computed = await computeStudentLearningTwin(userId);
    testAssert("Computed Learning DNA Index is valid number (0-100)", typeof computed.overallLearningIndex === "number" && computed.overallLearningIndex >= 0 && computed.overallLearningIndex <= 100, `Value: ${computed.overallLearningIndex}`);
    testAssert("Computed Retention Health is valid number (0-100)", typeof computed.retentionHealthScore === "number" && computed.retentionHealthScore >= 0 && computed.retentionHealthScore <= 100, `Value: ${computed.retentionHealthScore}`);
    testAssert("Computed 7 Core CS Subject DNA records", computed.subjectsDna.length === 7, `Count: ${computed.subjectsDna.length}`);
    testAssert("Computed Next Best Action is defined and structured", !!computed.nextBestAction && !!computed.nextBestAction.title && !!computed.nextBestAction.actionRoute, `Action: ${computed.nextBestAction?.title}`);
    testAssert("Next Best Action includes educational explainability", !!computed.nextBestAction?.whySelected && !!computed.nextBestAction?.expectedBenefit, "Includes whySelected & expectedBenefit");

    // 4. MONGODB PERSISTENCE & UPSERT VERIFICATION
    console.log("\n--- 4. Testing MongoDB Persistence & Twin Recalculate Save ---");
    const savedTwin = await PersonalLearningTwin.findOneAndUpdate(
      { user: userId },
      { $set: { ...computed, lastRecalculatedAt: new Date() } },
      { new: true, upsert: true }
    );
    testAssert("Twin saved and persisted in MongoDB Atlas", !!savedTwin && savedTwin.user.toString() === userId.toString(), `Record ID: ${savedTwin?._id}`);

    const retrievedTwin = await PersonalLearningTwin.findOne({ user: userId });
    testAssert("Retrieved persisted Twin matches saved metrics", retrievedTwin?.overallLearningIndex === savedTwin?.overallLearningIndex, `Index: ${retrievedTwin?.overallLearningIndex}`);

    // 5. API CONTROLLERS END-TO-END EXECUTION
    console.log("\n--- 5. Testing API Controllers (Mock Req/Res Execution) ---");
    
    // Test A: getLearningTwinProfile
    let getProfileStatus = null;
    let getProfileData = null;
    const mockResGet = {
      status(code) { getProfileStatus = code; return this; },
      json(data) { getProfileData = data; return this; }
    };
    await getLearningTwinProfile({ user: { _id: userId } }, mockResGet);
    testAssert("Controller GET /api/learning-twin returns 200", getProfileStatus === 200 && getProfileData?.success === true, `Status: ${getProfileStatus}`);
    testAssert("GET controller returns populated twin", !!getProfileData?.twin?.subjectsDna, "Populated subjectsDna array");

    // Test B: recalculateLearningTwinProfile
    let recalcStatus = null;
    let recalcData = null;
    const mockResRecalc = {
      status(code) { recalcStatus = code; return this; },
      json(data) { recalcData = data; return this; }
    };
    await recalculateLearningTwinProfile({ user: { _id: userId } }, mockResRecalc);
    testAssert("Controller POST /api/learning-twin/recalculate returns 200", recalcStatus === 200 && recalcData?.success === true, `Status: ${recalcStatus}`);

    // Test C: simulateLearningPlan (Valid Inputs)
    let simStatus = null;
    let simData = null;
    const mockResSim = {
      status(code) { simStatus = code; return this; },
      json(data) { simData = data; return this; }
    };
    await simulateLearningPlan({
      body: {
        currentMastery: 50,
        dailyStudyMinutes: 45,
        durationDays: 21,
        targetSubject: "DBMS",
      }
    }, mockResSim);
    testAssert("Controller POST /api/learning-twin/simulate returns 200", simStatus === 200 && simData?.success === true, `Status: ${simStatus}`);
    testAssert("Simulation calculates projected growth", simData?.simulation?.projectedMastery > 50, `Projected: ${simData?.simulation?.projectedMastery}%`);
    testAssert("Simulation provides transparent assumptions and disclaimer", simData?.simulation?.assumptions?.length >= 3 && !!simData?.simulation?.disclaimer, "Assumptions & Disclaimer populated");

    // 6. TESTING EDGE CASES & INVALID INPUTS
    console.log("\n--- 6. Testing Edge Cases & Invalid Inputs ---");
    
    // Edge case 1: Simulation with extreme/negative numbers
    const edgeSim1 = simulatePersonalizedPlan({
      currentMastery: -10,
      dailyStudyMinutes: 0,
      durationDays: -5,
      targetSubject: "",
    });
    testAssert("Simulation handles zero/negative inputs without crashing", edgeSim1.projectedMastery >= 0 && edgeSim1.dailyStudyMinutes === 0, `Projected: ${edgeSim1.projectedMastery}`);

    // Edge case 2: Simulation with capped mastery (100%)
    const edgeSim2 = simulatePersonalizedPlan({
      currentMastery: 95,
      dailyStudyMinutes: 120,
      durationDays: 90,
      targetSubject: "DSA",
    });
    testAssert("Simulation caps maximum projected mastery at <= 98%", edgeSim2.projectedMastery <= 98, `Capped: ${edgeSim2.projectedMastery}`);

    // Edge case 3: State derivation with undefined parameters
    const edgeState = deriveKnowledgeState({});
    testAssert("deriveKnowledgeState safely defaults undefined values to unexplored", edgeState === "unexplored", `Got: ${edgeState}`);

    // 7. AUTHENTICATION & TOKEN VERIFICATION
    console.log("\n--- 7. Testing Authentication & Security Authorization ---");
    const testToken = jwt.sign({ id: userId, email: student.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
    testAssert("JWT token generation and signature verification", decoded?.id === userId.toString(), `Decoded ID matches: ${decoded?.id}`);

    // 8. VERIFY INTEGRATION WITH EXISTING PLATFORM MODULES
    console.log("\n--- 8. Verifying Platform Co-Existence & Dependencies ---");
    const progressCount = await TopicProgress.countDocuments();
    const repCount = await SpacedRepetitionItem.countDocuments();
    testAssert("Platform TopicProgress collection queryable", typeof progressCount === "number", `Total: ${progressCount} records`);
    testAssert("Platform SpacedRepetition collection queryable", typeof repCount === "number", `Total: ${repCount} records`);

    console.log("\n=================================================================");
    console.log(`  AUDIT COMPLETE: ${results.passed} PASSED / ${results.failed} FAILED`);
    console.log("=================================================================\n");

    await mongoose.disconnect();
    process.exit(results.failed > 0 ? 1 : 0);
  } catch (err) {
    console.error("Verification Suite Exception:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runComprehensiveVerification();
