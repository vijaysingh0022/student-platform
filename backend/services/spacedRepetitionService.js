import SpacedRepetitionItem from "../models/SpacedRepetition.js";
import TopicProgress from "../models/TopicProgress.js";
import { Topic, Subject } from "../models/Curriculum.js";
import { CURRICULUM_TOPICS, CURRICULUM_SUBJECTS } from "../seed/curriculumData.js";

/**
 * Standard Spaced Repetition Progression intervals in days
 */
export const INTERVAL_STAGES = [1, 3, 7, 14, 30, 60, 120];

/**
 * SuperMemo SM-2 & Adaptive Schedule Calculator
 * @param {Object} currentItem Current spaced repetition state
 * @param {Number} rating Performance rating 0-5
 *   5: Perfect recall, effortless
 *   4: Correct response after hesitation
 *   3: Correct response recalled with serious difficulty
 *   2: Incorrect response; where the correct one seemed easy to recall
 *   1: Incorrect response; the correct one remembered
 *   0: Complete blackout
 */
export function calculateNextReview(currentItem, rating) {
  let { repetitionStage = 1, easeFactor = 2.5, intervalDays = 1, consecutiveCorrect = 0 } = currentItem;

  const wasCorrect = rating >= 3;

  // 1. Update Ease Factor (SM-2 formula with min floor 1.3)
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const deltaEF = 0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02);
  let newEaseFactor = Math.max(1.3, Number((easeFactor + deltaEF).toFixed(2)));

  let newStage = repetitionStage;
  let newInterval = intervalDays;
  let newConsecutive = consecutiveCorrect;

  if (wasCorrect) {
    newConsecutive += 1;
    // Map stage to interval
    if (newStage <= 1) {
      newInterval = 1;
      newStage = 2;
    } else if (newStage === 2) {
      newInterval = 3;
      newStage = 3;
    } else if (newStage === 3) {
      newInterval = 7;
      newStage = 4;
    } else if (newStage === 4) {
      newInterval = 14;
      newStage = 5;
    } else if (newStage === 5) {
      newInterval = 30;
      newStage = 6;
    } else {
      // For stage 6+, multiply interval by ease factor
      newInterval = Math.round(intervalDays * newEaseFactor);
      newStage += 1;
    }

    // Boost if rating is 5 (effortless)
    if (rating === 5) {
      newInterval = Math.round(newInterval * 1.15);
    }
  } else {
    // Student struggled or forgot: reset repetition sequence
    newConsecutive = 0;
    newStage = 1;
    newInterval = 1; // Due tomorrow
    // Penalty on ease factor for repeated failure
    newEaseFactor = Math.max(1.3, Number((newEaseFactor - 0.2).toFixed(2)));
  }

  // Calculate exact next review date (midnight boundary or 24h)
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);
  nextDate.setHours(4, 0, 0, 0); // Scheduled for 4:00 AM of that day

  // Status determination
  let status = "learning";
  if (!wasCorrect) {
    status = "at_risk";
  } else if (newInterval >= 30) {
    status = "mastered";
  } else if (newStage >= 3) {
    status = "reviewing";
  }

  return {
    repetitionStage: newStage,
    easeFactor: newEaseFactor,
    intervalDays: newInterval,
    nextReviewDate: nextDate,
    consecutiveCorrect: newConsecutive,
    wasCorrect,
    status,
  };
}

/**
 * Enroll or update a topic in the Spaced Repetition engine
 * Automatically called when topic is completed or quiz is taken
 */
export async function enrollTopicInSpacedRepetition(userId, { topicId, subjectId, initialScore = 80 }) {
  if (!userId || !topicId) return null;

  // Lookup topic details from DB or curriculum seed fallback
  let topicDoc = await Topic.findOne({ topicId }).lean().catch(() => null);
  if (!topicDoc) {
    topicDoc = CURRICULUM_TOPICS.find((t) => t.topicId === topicId);
  }

  const topicTitle = topicDoc?.title || topicId;
  const finalSubjectId = subjectId || topicDoc?.subjectId || "dsa";

  let subjectDoc = await Subject.findOne({ subjectId: finalSubjectId }).lean().catch(() => null);
  if (!subjectDoc) {
    subjectDoc = CURRICULUM_SUBJECTS.find((s) => s.subjectId === finalSubjectId);
  }
  const subjectName = subjectDoc?.name || finalSubjectId.toUpperCase();

  // Find existing or create new
  let item = await SpacedRepetitionItem.findOne({ user: userId, topicId });

  if (!item) {
    // Schedule initial review: 1 day from now
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    nextDate.setHours(4, 0, 0, 0);

    item = new SpacedRepetitionItem({
      user: userId,
      topicId,
      subjectId: finalSubjectId,
      topicTitle,
      subjectName,
      unitId: topicDoc?.unitId || "",
      chapterId: topicDoc?.chapterId || "",
      repetitionStage: 1,
      easeFactor: 2.5,
      intervalDays: 1,
      lastReviewedAt: new Date(),
      nextReviewDate: nextDate,
      retentionScore: 100,
      totalReviews: 1,
      successfulReviews: initialScore >= 60 ? 1 : 0,
      failedReviews: initialScore < 60 ? 1 : 0,
      consecutiveCorrect: initialScore >= 60 ? 1 : 0,
      status: initialScore >= 60 ? "learning" : "at_risk",
      history: [
        {
          performanceRating: initialScore >= 80 ? 4 : initialScore >= 60 ? 3 : 1,
          wasCorrect: initialScore >= 60,
          intervalDaysBefore: 1,
          intervalDaysAfter: 1,
          easeFactorBefore: 2.5,
          easeFactorAfter: 2.5,
          retentionScoreBefore: 100,
          retentionScoreAfter: 100,
          questionType: "initial_enrollment",
        },
      ],
    });
    await item.save();
  }

  return item;
}

/**
 * Fetch Spaced Repetition Dashboard Metrics & Queues
 */
export async function getRevisionDashboardData(userId) {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  // Auto-sync any completed TopicProgress records not yet in SpacedRepetition
  try {
    const completedProgress = await TopicProgress.find({ user: userId, isCompleted: true }).lean();
    for (const p of completedProgress) {
      const exists = await SpacedRepetitionItem.exists({ user: userId, topicId: p.topicId });
      if (!exists) {
        await enrollTopicInSpacedRepetition(userId, {
          topicId: p.topicId,
          subjectId: p.subjectId,
          initialScore: p.latestScore || 80,
        });
      }
    }
  } catch (syncErr) {
    console.warn("Spaced repetition auto-sync warning:", syncErr.message);
  }

  // Fetch all items for this user
  let items = await SpacedRepetitionItem.find({ user: userId, isActive: true }).sort({ nextReviewDate: 1 });

  // Update dynamic retention for each item
  let totalRetentionSum = 0;
  for (const item of items) {
    const currentRetention = item.calculateCurrentRetention();
    if (item.retentionScore !== currentRetention) {
      item.retentionScore = currentRetention;
      // Mark at_risk if retention drops below 60%
      if (currentRetention < 60 && item.status !== "mastered") {
        item.status = "at_risk";
      }
      await item.save();
    }
    totalRetentionSum += currentRetention;
  }

  // Partition queues
  const dueToday = [];
  const overdue = [];
  const upcoming = [];
  const mastered = [];

  for (const item of items) {
    const itemDate = new Date(item.nextReviewDate);
    if (item.status === "mastered") {
      mastered.push(item);
    }
    if (itemDate < startOfToday) {
      overdue.push(item);
    } else if (itemDate <= endOfToday) {
      dueToday.push(item);
    } else {
      upcoming.push(item);
    }
  }

  // Calculate streak from repetition history
  let revisionStreak = 0;
  let activeDaySet = new Set();
  items.forEach((item) => {
    item.history.forEach((h) => {
      const dayStr = new Date(h.reviewedAt).toISOString().split("T")[0];
      activeDaySet.add(dayStr);
    });
  });

  // Count consecutive days ending today or yesterday
  const checkDate = new Date();
  while (true) {
    const checkStr = checkDate.toISOString().split("T")[0];
    if (activeDaySet.has(checkStr)) {
      revisionStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (revisionStreak === 0) {
      // Check yesterday if today hasn't been completed yet
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = checkDate.toISOString().split("T")[0];
      if (activeDaySet.has(yesterdayStr)) {
        revisionStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    } else {
      break;
    }
  }

  // Overall average retention score
  const averageRetention = items.length > 0 ? Math.round(totalRetentionSum / items.length) : 88;

  // Weekly Activity (Last 7 days)
  const weeklyActivity = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    const dayStr = day.toISOString().split("T")[0];
    const dayName = day.toLocaleDateString("en-US", { weekday: "short" });

    let count = 0;
    items.forEach((item) => {
      item.history.forEach((h) => {
        if (new Date(h.reviewedAt).toISOString().split("T")[0] === dayStr) {
          count++;
        }
      });
    });

    weeklyActivity.push({
      date: dayStr,
      day: dayName,
      reviewsCount: count,
      isToday: i === 0,
    });
  }

  // Priority recommendations: At risk topics & highest decay
  const recommendations = [...items]
    .sort((a, b) => a.retentionScore - b.retentionScore || new Date(a.nextReviewDate) - new Date(b.nextReviewDate))
    .slice(0, 5)
    .map((item) => ({
      topicId: item.topicId,
      topicTitle: item.topicTitle,
      subjectId: item.subjectId,
      subjectName: item.subjectName,
      retentionScore: item.retentionScore,
      status: item.status,
      intervalDays: item.intervalDays,
      dueStatus:
        new Date(item.nextReviewDate) < startOfToday
          ? "Overdue"
          : new Date(item.nextReviewDate) <= endOfToday
          ? "Due Today"
          : `In ${Math.ceil((new Date(item.nextReviewDate) - now) / (1000 * 60 * 60 * 24))} days`,
      recommendedAction:
        item.retentionScore < 60
          ? "Critical Review: Memory decay high"
          : item.consecutiveCorrect < 2
          ? "Strengthen Concept Foundations"
          : "Standard Spaced Refresh",
    }));

  return {
    metrics: {
      dueTodayCount: dueToday.length,
      overdueCount: overdue.length,
      upcomingCount: upcoming.length,
      masteredCount: mastered.length,
      totalTrackedTopics: items.length,
      retentionScore: averageRetention,
      revisionStreak: Math.max(1, revisionStreak),
    },
    queues: {
      dueToday,
      overdue,
      upcoming: upcoming.slice(0, 10),
      mastered: mastered.slice(0, 10),
    },
    weeklyActivity,
    recommendations,
  };
}

/**
 * Generate an Intelligent Revision Session for a specific topic or due queue
 * Generates:
 * 1. Quick MCQs
 * 2. Flashcards
 * 3. Concept Recall questions
 * 4. Short-Answer questions
 * 5. Historical mistake review
 */
export async function generateRevisionSession(userId, topicId) {
  let item = await SpacedRepetitionItem.findOne({ user: userId, topicId });
  if (!item) {
    item = await enrollTopicInSpacedRepetition(userId, { topicId });
  }

  // Lookup topic content for rich question synthesis
  let topicDoc = await Topic.findOne({ topicId }).lean().catch(() => null);
  if (!topicDoc) {
    topicDoc = CURRICULUM_TOPICS.find((t) => t.topicId === topicId) || {
      title: item.topicTitle,
      subjectId: item.subjectId,
      summary: "University Computer Science syllabus topic",
    };
  }

  // 1. Flashcards (Formulae, Core Definitions, Big-O / Axioms)
  const flashcards = [
    {
      id: "fc_1",
      type: "flashcard",
      front: `What is the core definition and primary objective of ${topicDoc.title}?`,
      back:
        topicDoc.content?.simpleExplanation ||
        topicDoc.summary ||
        `${topicDoc.title} is a fundamental concept in ${item.subjectName} designed to optimize performance, minimize anomalies, and maintain invariants.`,
      category: "Definition & Concept",
      difficulty: "Easy",
    },
    {
      id: "fc_2",
      type: "flashcard",
      front: `What are the key invariants, time/space bounds, or criteria for ${topicDoc.title}?`,
      back: `Time Complexity: ${topicDoc.content?.timeComplexity || "O(log N) / O(N)"} | Space Complexity: ${
        topicDoc.content?.spaceComplexity || "O(1)"
      }. Invariants must hold across all execution cycles and state transitions.`,
      category: "Complexity & Invariants",
      difficulty: "Medium",
    },
    {
      id: "fc_3",
      type: "flashcard",
      front: `Common pitfalls & edge cases to watch out for in university exams for ${topicDoc.title}:`,
      back: `Watch for boundary off-by-one errors, null pointers, cycle creation, and violation of dependency preservation or lossy decomposition.`,
      category: "Exam Traps & Edge Cases",
      difficulty: "Hard",
    },
  ];

  // 2. Quick MCQs (3 questions)
  const mcqs = [
    {
      id: "mcq_1",
      type: "mcq",
      question: `Which of the following statements is unconditionally TRUE regarding ${topicDoc.title}?`,
      options: [
        `It guarantees correct execution while adhering to formal system constraints.`,
        `It requires exponential space complexity under all standard assumptions.`,
        `It is solely applicable to static, read-only data structures.`,
        `It eliminates the need for algorithm analysis and worst-case bounds.`,
      ],
      correctIndex: 0,
      explanation: `${topicDoc.title} is engineered to preserve formal correctness, integrity, and predictable execution within verified operational bounds.`,
    },
    {
      id: "mcq_2",
      type: "mcq",
      question: `When applying ${topicDoc.title} in a high-concurrency production workload, what is the primary optimization goal?`,
      options: [
        `Maximizing memory fragmentation`,
        `Minimizing lock contention, redundancy, or unnecessary state transitions`,
        `Disabling referential and integrity constraints`,
        `Increasing random I/O disk head seeks`,
      ],
      correctIndex: 1,
      explanation: `Modern production implementations prioritize reducing redundant operations, minimizing locking, and maximizing throughput.`,
    },
  ];

  // 3. Concept Recall Question
  const recallQuestion = {
    id: "recall_1",
    type: "recall",
    prompt: `Active Recall Challenge: In your own words, summarize the working mechanism of ${topicDoc.title} without looking at reference notes.`,
    expectedKeypoints: [
      "Core definition and domain application",
      "Step-by-step state transition or algorithmic flow",
      "Trade-offs and practical efficiency implications",
    ],
    hint: "Think about the input state, intermediate invariants, and final output guarantee.",
  };

  // 4. Short-Answer / University 5-Mark Question
  const shortAnswer = {
    id: "sa_1",
    type: "short_answer",
    question: `Explain how ${topicDoc.title} handles boundary conditions and compare it with the traditional naive alternative.`,
    modelAnswer: `${topicDoc.title} enforces structured invariant checks during initialization and traversal, guaranteeing deterministic convergence compared to naive unbounded approaches.`,
  };

  return {
    sessionId: `rev_${topicId}_${Date.now()}`,
    topicId,
    topicTitle: topicDoc.title,
    subjectId: item.subjectId,
    subjectName: item.subjectName,
    retentionScore: item.retentionScore,
    currentIntervalDays: item.intervalDays,
    cards: flashcards,
    mcqs,
    recallQuestion,
    shortAnswer,
    previousMistakes: item.mistakeLog.slice(-3),
  };
}

/**
 * Record a completed Revision Session, recalculate intervals & update streak
 */
export async function recordRevisionResult(userId, { topicId, sessionId, score, totalQuestions, performanceRating, answers = [] }) {
  let item = await SpacedRepetitionItem.findOne({ user: userId, topicId });
  if (!item) {
    item = await enrollTopicInSpacedRepetition(userId, { topicId });
  }

  // Calculate rating (0-5) if not provided directly
  let rating = performanceRating;
  if (rating === undefined || rating === null) {
    const accuracy = totalQuestions > 0 ? (score / totalQuestions) * 100 : 75;
    if (accuracy >= 90) rating = 5;
    else if (accuracy >= 75) rating = 4;
    else if (accuracy >= 60) rating = 3;
    else if (accuracy >= 40) rating = 2;
    else if (accuracy >= 20) rating = 1;
    else rating = 0;
  }

  const intervalBefore = item.intervalDays;
  const easeBefore = item.easeFactor;
  const retentionBefore = item.retentionScore;

  // Run SM-2 adaptation
  const update = calculateNextReview(item, rating);

  item.repetitionStage = update.repetitionStage;
  item.easeFactor = update.easeFactor;
  item.intervalDays = update.intervalDays;
  item.nextReviewDate = update.nextReviewDate;
  item.lastReviewedAt = new Date();
  item.consecutiveCorrect = update.consecutiveCorrect;
  item.status = update.status;
  item.totalReviews += 1;

  if (update.wasCorrect) {
    item.successfulReviews += 1;
    item.retentionScore = 100; // Reset to 100% post successful review
  } else {
    item.failedReviews += 1;
    item.retentionScore = 55; // Reset to struggling retention
  }

  // Log mistakes if any
  answers.forEach((ans) => {
    if (ans.isCorrect === false) {
      item.mistakeLog.push({
        questionText: ans.questionText || "Revision challenge question",
        userAnswer: ans.userAnswer || "",
        correctAnswer: ans.correctAnswer || "",
        explanation: ans.explanation || "",
        timestamp: new Date(),
      });
    }
  });

  // Keep mistake log trimmed to latest 10
  if (item.mistakeLog.length > 10) {
    item.mistakeLog = item.mistakeLog.slice(-10);
  }

  // Push audit log
  item.history.push({
    sessionId: sessionId || "",
    reviewedAt: new Date(),
    performanceRating: rating,
    wasCorrect: update.wasCorrect,
    timeTakenSeconds: 0,
    intervalDaysBefore: intervalBefore,
    intervalDaysAfter: update.intervalDays,
    easeFactorBefore: easeBefore,
    easeFactorAfter: update.easeFactor,
    retentionScoreBefore: retentionBefore,
    retentionScoreAfter: item.retentionScore,
    questionType: "revision_session",
  });

  await item.save();

  // Award XP for completing revision session
  let rewardResult = null;
  try {
    const { awardXP } = await import("./rewardService.js");
    rewardResult = await awardXP(userId, {
      amount: update.wasCorrect ? 40 : 20,
      source: "REVISION_COMPLETED",
      sourceId: `rev_${topicId}_${Date.now()}`,
      description: `Spaced revision completed for ${item.topicTitle}`,
      type: "XP",
    });
  } catch (err) {
    console.warn("Reward XP for revision error:", err.message);
  }

  return {
    success: true,
    item,
    nextReviewDate: update.nextReviewDate,
    intervalDays: update.intervalDays,
    retentionScore: item.retentionScore,
    status: item.status,
    reward: rewardResult,
  };
}
