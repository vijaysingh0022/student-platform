import Question from "../models/Question.js";
import AdaptiveSession from "../models/AdaptiveSession.js";
import TopicProgress from "../models/TopicProgress.js";
import TestResult from "../models/TestResult.js";
import { ALL_COMPREHENSIVE_QUESTIONS } from "../seed/questions/index.js";
import { normalizeSubject } from "../controllers/testController.js";

// Mapping difficulty level to standard IRT parameter approximations
export const DIFFICULTY_IRT = {
  easy: { b: -1.0, label: "Easy", weight: 1 },
  medium: { b: 0.0, label: "Medium", weight: 2 },
  hard: { b: 1.2, label: "Hard", weight: 3 },
};

/**
 * 2-Parameter Logistic (2PL) Item Response Theory probability function:
 * P(theta) = 1 / (1 + exp(-a * (theta - b)))
 * where:
 * theta = student latent ability estimate (-3.0 to +3.0)
 * b = item difficulty parameter (-1.0 for easy, 0.0 for medium, 1.2 for hard)
 * a = item discrimination parameter (default 1.2)
 */
export function calculateProbabilityOfCorrect(theta, difficulty, discrimination = 1.2) {
  const b = DIFFICULTY_IRT[difficulty]?.b ?? 0.0;
  const exponent = -discrimination * (theta - b);
  return 1 / (1 + Math.exp(exponent));
}

/**
 * Update student theta using Bayesian-inspired Robbins-Monro update step:
 * theta_{t+1} = theta_t + K * (isCorrect - P(theta_t))
 * where K decreases slightly as confidence/attempts increase.
 */
export function updateThetaAbility(currentTheta, isCorrect, difficulty, attemptsCount = 1) {
  const p = calculateProbabilityOfCorrect(currentTheta, difficulty);
  const outcome = isCorrect ? 1 : 0;
  // Learning rate damping: responsive at start, stabilized as session deepens
  const K = Math.max(0.25, 0.65 / Math.sqrt(attemptsCount));
  const newTheta = currentTheta + K * (outcome - p);
  // Bound theta within [-3.0, +3.0]
  return Math.max(-3.0, Math.min(3.0, Number(newTheta.toFixed(3))));
}

/**
 * Determine the next target difficulty from current ability theta and recent performance
 */
export function determineTargetDifficulty(theta, recentAttempts = [], mode = "diagnostic") {
  if (mode === "mastery_challenge") {
    // Mastery challenge emphasizes medium and hard questions
    if (theta >= 0.3) return "hard";
    return "medium";
  }

  if (mode === "weak_topic") {
    // Weak topic practice builds confidence: starts easy/medium
    if (theta > 0.8) return "medium";
    if (theta < -0.5) return "easy";
    return "easy";
  }

  // Check recent consecutive streak (last 2 attempts)
  if (recentAttempts.length >= 2) {
    const last2 = recentAttempts.slice(-2);
    const bothCorrect = last2.every((a) => a.isCorrect);
    const bothWrong = last2.every((a) => !a.isCorrect);

    if (bothCorrect) {
      if (theta > 0.4) return "hard";
      return "medium";
    }
    if (bothWrong) {
      if (theta < -0.3) return "easy";
      return "medium";
    }
  }

  // Standard ability cutoffs
  if (theta >= 0.75) return "hard";
  if (theta <= -0.5) return "easy";
  return "medium";
}

/**
 * Query questions from Database, falling back seamlessly to ALL_COMPREHENSIVE_QUESTIONS
 */
export async function getSubjectQuestionsPool(subject) {
  const canonical = normalizeSubject(subject);
  try {
    const dbQuestions = await Question.find({ subject: canonical }).lean();
    if (dbQuestions && dbQuestions.length >= 10) {
      return dbQuestions;
    }
  } catch (err) {
    console.warn(`[AdaptiveEngine] Falling back to in-memory question pool for ${canonical}:`, err.message);
  }

  // Fallback to seeded 921 questions pool in memory
  return ALL_COMPREHENSIVE_QUESTIONS.filter(
    (q) => normalizeSubject(q.subject) === canonical
  );
}

/**
 * Select the next optimal question balancing:
 * 1. Target difficulty matching student ability
 * 2. Unserved questions (prevent session repeats)
 * 3. Topic coverage and concept-level weaknesses
 * 4. Mode-specific weighting
 */
export async function selectNextAdaptiveQuestion({
  subject,
  servedQuestionIds = [],
  currentTheta = 0,
  recentAttempts = [],
  targetDifficulty = "medium",
  mode = "diagnostic",
  targetTopics = [],
  userId,
}) {
  const canonical = normalizeSubject(subject);
  const pool = await getSubjectQuestionsPool(canonical);

  if (!pool || pool.length === 0) {
    throw new Error(`No questions available for subject "${canonical}"`);
  }

  const servedSet = new Set(servedQuestionIds.map((id) => String(id)));

  // Filter out already served questions in this session
  const candidatePool = pool.filter((q) => {
    const qId = q._id ? String(q._id) : `${q.subject}_${q.topic}_${q.questionText.slice(0, 30)}`;
    return !servedSet.has(qId);
  });

  const available = candidatePool.length > 0 ? candidatePool : pool;

  // Compute topic frequency already presented in this session
  const topicFrequency = {};
  for (const att of recentAttempts) {
    topicFrequency[att.topic] = (topicFrequency[att.topic] || 0) + 1;
  }

  // Retrieve user's previous topic weaknesses from historical test results or TopicProgress
  let weakTopicsList = [];
  if (userId) {
    try {
      const historicalWeak = await TopicProgress.find({
        user: userId,
        subjectId: canonical,
        masteryStatus: "weak",
      }).lean();
      weakTopicsList = historicalWeak.map((w) => w.topicId);
    } catch (e) {
      // safe ignore
    }
  }

  // Score candidate questions
  const scoredCandidates = available.map((q) => {
    let score = 100;
    const qDiff = q.difficulty || "medium";
    const qTopic = q.topic || "Core Concept";

    // 1. Difficulty Match: Highest preference to targetDifficulty
    if (qDiff === targetDifficulty) {
      score += 50;
    } else if (
      (targetDifficulty === "hard" && qDiff === "medium") ||
      (targetDifficulty === "easy" && qDiff === "medium")
    ) {
      score += 20;
    } else {
      score -= 30; // Far from target difficulty
    }

    // 2. Target Topic matching (Mode: weak_topic or custom)
    if (targetTopics.length > 0) {
      if (targetTopics.includes(qTopic)) {
        score += 80;
      } else {
        score -= 40;
      }
    }

    // 3. Prioritize known weak topics
    if (weakTopicsList.includes(qTopic)) {
      score += 35;
    }

    // 4. Topic Diversity penalty: discourage asking the same topic back-to-back in diagnostic mode
    const count = topicFrequency[qTopic] || 0;
    score -= count * 25;

    // 5. Mode adjustments
    if (mode === "interview_prep" && (q.tags?.includes("FAANG") || q.tags?.includes("Interview") || q.isPlacement)) {
      score += 30;
    }
    if (mode === "exam_prep" && (q.isPYQ || q.tags?.includes("GATE") || q.tags?.includes("Important"))) {
      score += 30;
    }

    // Random jitter (0 - 15) to prevent deterministic lock
    score += Math.random() * 15;

    return { question: q, score };
  });

  scoredCandidates.sort((a, b) => b.score - a.score);
  const best = scoredCandidates[0]?.question || pool[0];

  // Synthesize explainable selection reason
  let selectionReason = `Selected at ${targetDifficulty.toUpperCase()} tier `;
  if (recentAttempts.length > 0) {
    const lastAttempt = recentAttempts[recentAttempts.length - 1];
    if (lastAttempt.isCorrect) {
      selectionReason += `to validate deeper mastery following your correct answer on "${lastAttempt.topic}".`;
    } else {
      selectionReason += `calibrated to re-test fundamental understanding after missing the previous concept.`;
    }
  } else {
    selectionReason += `as an initial baseline benchmark for ${canonical}.`;
  }

  return {
    question: best,
    selectionReason,
    targetDifficulty,
  };
}

/**
 * Generate explainable analysis for a completed question attempt
 */
export function analyzeAttemptOutcome(question, selectedIndex, timeTakenSeconds) {
  const isCorrect = selectedIndex === question.correctAnswerIndex;
  const correctChoiceText = question.options[question.correctAnswerIndex] || "";
  const selectedChoiceText = question.options[selectedIndex] || "None";

  let misconception = "";
  if (!isCorrect) {
    misconception = `Confused "${selectedChoiceText}" with the correct principle: "${correctChoiceText}". ${question.explanation || ""}`;
  }

  return {
    isCorrect,
    conceptEvaluated: question.subtopic || question.topic,
    misconception,
    explanation: question.explanation || `The correct answer is "${correctChoiceText}".`,
  };
}

/**
 * Calculate comprehensive session results, mastery scores & explainable feedback
 */
export function evaluateCompletedSession(session) {
  const attempts = session.attempts || [];
  const total = attempts.length;
  if (total === 0) {
    return {
      accuracy: 0,
      speedAvgSeconds: 0,
      masteryPercentage: 0,
      scoreEarned: 0,
      xpAwarded: 0,
      weakTopics: [],
      strongTopics: [],
      recommendedNextTopics: [],
      topicMasteryBreakdown: [],
      aiSummaryFeedback: "No questions attempted.",
    };
  }

  const correctCount = attempts.filter((a) => a.isCorrect).length;
  const totalTime = attempts.reduce((acc, a) => acc + (a.timeTakenSeconds || 0), 0);
  const accuracy = Math.round((correctCount / total) * 100);
  const speedAvgSeconds = Math.round(totalTime / total);

  // Group performance by topic
  const topicMap = {};
  for (const a of attempts) {
    const t = a.topic || "General";
    if (!topicMap[t]) {
      topicMap[t] = {
        topic: t,
        attemptsCount: 0,
        correctCount: 0,
        difficulties: [],
      };
    }
    topicMap[t].attemptsCount += 1;
    if (a.isCorrect) topicMap[t].correctCount += 1;
    topicMap[t].difficulties.push(a.difficulty);
  }

  const topicMasteryBreakdown = Object.values(topicMap).map((tm) => {
    const acc = Math.round((tm.correctCount / tm.attemptsCount) * 100);
    // Weight by difficulty tackled
    const diffWeights = { easy: 0.6, medium: 0.85, hard: 1.15 };
    const avgWeight =
      tm.difficulties.reduce((sum, d) => sum + (diffWeights[d] || 0.85), 0) /
      tm.difficulties.length;
    const masteryScore = Math.min(100, Math.round(acc * avgWeight));

    let status = "needs_practice";
    if (masteryScore >= 80) status = "mastered";
    else if (masteryScore >= 60) status = "proficient";

    return {
      topic: tm.topic,
      attemptsCount: tm.attemptsCount,
      correctCount: tm.correctCount,
      accuracy: acc,
      masteryScore,
      currentDifficulty: tm.difficulties[tm.difficulties.length - 1] || "medium",
      theta: Number(((masteryScore - 50) / 20).toFixed(2)),
      status,
    };
  });

  const weakTopics = topicMasteryBreakdown
    .filter((t) => t.status === "needs_practice" || t.accuracy < 60)
    .map((t) => t.topic);

  const strongTopics = topicMasteryBreakdown
    .filter((t) => t.status === "mastered" || t.accuracy >= 80)
    .map((t) => t.topic);

  const recommendedNextTopics = weakTopics.length > 0 ? weakTopics : [session.subject];

  // Global session mastery
  const masteryPercentage = Math.round(
    topicMasteryBreakdown.reduce((sum, t) => sum + t.masteryScore, 0) /
      Math.max(1, topicMasteryBreakdown.length)
  );

  // Gamification score & XP
  const scoreEarned = correctCount * 20 + (session.currentTheta > 0 ? Math.round(session.currentTheta * 15) : 0);
  const xpAwarded = Math.max(50, scoreEarned * 2);

  // Misunderstanding summaries
  const misunderstandingAnalysis = attempts
    .filter((a) => !a.isCorrect)
    .map((a, idx) => ({
      questionIndex: idx + 1,
      topic: a.topic,
      concept: a.conceptEvaluated || a.subtopic || a.topic,
      misunderstanding: a.misconception || `Chose incorrect option for "${a.conceptEvaluated || a.topic}".`,
      recommendedAction: `Review core fundamentals of ${a.topic} and solve 3 targeted medium-difficulty problems.`,
    }));

  const aiSummaryFeedback =
    masteryPercentage >= 80
      ? `Exceptional performance across ${session.subject}! You demonstrated high confidence at Hard/Interview difficulty with an estimated IRT theta of ${session.currentTheta.toFixed(2)}.`
      : masteryPercentage >= 60
      ? `Solid foundation in ${session.subject}. You tackled Medium difficulty concepts well, but reinforce ${weakTopics.join(", ") || "edge cases"} to advance to Tier-1 interview readiness.`
      : `Identified critical knowledge gaps in ${weakTopics.join(", ") || session.subject}. We recommend completing foundational revisions before attempting Hard challenges.`;

  return {
    accuracy,
    speedAvgSeconds,
    totalTimeTakenSeconds: totalTime,
    masteryPercentage,
    scoreEarned,
    xpAwarded,
    weakTopics,
    strongTopics,
    recommendedNextTopics,
    topicMasteryBreakdown,
    misunderstandingAnalysis,
    aiSummaryFeedback,
  };
}

