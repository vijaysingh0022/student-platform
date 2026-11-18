/**
 * LearnX 2.0 Ecosystem Integration Test Suite
 * Validates cross-module synchronization, state derivations, and data integrity
 */

import { deriveKnowledgeState, simulatePersonalizedPlan } from "../services/personalLearningTwinService.js";
import { alignPortfolioWithTargetRole } from "../services/gitHubPortfolioService.js";
import { CORE_SUBJECTS } from "../services/personalLearningTwinService.js";

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    passedTests++;
    console.log(`✅ PASS: ${message}`);
  }
}

console.log("=== STARTING LEARNX 2.0 INTEGRATION TEST SUITE ===\n");

// 1. Spaced Repetition & Ebbinghaus Knowledge State Integration
console.log("--- 1. Spaced Repetition & Knowledge State Derivation ---");
const stateMastered = deriveKnowledgeState({
  isCompleted: true,
  attemptsCount: 3,
  accuracy: 90,
  retentionConfidence: 85,
  daysSinceReview: 2,
});
assert(stateMastered === "mastered", "Derives 'mastered' when attempts >= 2 and accuracy >= 85%");

const stateDecayed = deriveKnowledgeState({
  isCompleted: true,
  attemptsCount: 3,
  accuracy: 90,
  retentionConfidence: 50, // Decayed below 60%
  daysSinceReview: 15,
});
assert(stateDecayed === "needs_revision", "Derives 'needs_revision' when retention falls below 60% or daysSinceReview > 14");

const stateUnexplored = deriveKnowledgeState({
  isCompleted: false,
  attemptsCount: 0,
  accuracy: 0,
  retentionConfidence: 100,
  daysSinceReview: 0,
});
assert(stateUnexplored === "unexplored", "Derives 'unexplored' when topic has not been started");

// 2. Adaptive Simulation Math & Outcome Estimation
console.log("\n--- 2. Personalized Learning Simulation Math ---");
const simPlan = simulatePersonalizedPlan({
  currentMastery: 45,
  dailyStudyMinutes: 30,
  durationDays: 30,
  targetSubject: "DSA",
});
assert(simPlan.projectedMastery > simPlan.currentMastery, "Simulation correctly projects mastery increase");
assert(simPlan.targetSubject === "DSA", "Simulation preserves target subject parameter");
assert(simPlan.assumptions.length >= 3, "Simulation provides transparent educational assumptions");
assert(simPlan.disclaimer.includes("Simulated"), "Simulation explicitly flags non-guaranteed disclaimer");

// 3. GitHub Portfolio Role Alignment Integration
console.log("\n--- 3. GitHub Portfolio & Career Twin Role Gap Alignment ---");
const roleAlignment = alignPortfolioWithTargetRole({
  verifiedTechs: ["Node.js", "Express.js", "MongoDB", "JavaScript"],
  targetRole: "Backend Developer",
});
assert(roleAlignment.targetRole === "Backend Developer", "Preserves target career role");
assert(typeof roleAlignment.matchingPercentage === "number", "Calculates numerical matchingPercentage score");
assert(Array.isArray(roleAlignment.demonstratedSkills), "Returns array of demonstrated verified technologies");
assert(Array.isArray(roleAlignment.missingOrWeakSkills), "Returns array of missing skill gaps");

// 4. Core Ecosystem Subject Coverage
console.log("\n--- 4. Cross-Module Core CS Subject Registry ---");
assert(CORE_SUBJECTS.length === 7, "Registry covers all 7 core CS domains (DSA, DBMS, OS, CN, OOP, System Design, Web Dev)");
const hasDSA = CORE_SUBJECTS.some((s) => s.id === "DSA");
const hasDBMS = CORE_SUBJECTS.some((s) => s.id === "DBMS");
const hasOS = CORE_SUBJECTS.some((s) => s.id === "OS");
assert(hasDSA && hasDBMS && hasOS, "Registry contains DSA, DBMS, and OS core identifiers");

console.log(`\n=== TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED CLEANLY ===\n`);
