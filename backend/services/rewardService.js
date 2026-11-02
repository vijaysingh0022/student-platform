import RewardTransaction from "../models/RewardTransaction.js";
import UserBadge from "../models/UserBadge.js";
import UserChallenge from "../models/UserChallenge.js";
import LearningStreak from "../models/LearningStreak.js";
import TopicProgress from "../models/TopicProgress.js";
import TestResult from "../models/TestResult.js";
import CodingSubmission from "../models/CodingSubmission.js";
import MockInterview from "../models/MockInterview.js";

// ── 1. Progressive Level System Definitions ──────────────────────────────────
export const LEVEL_DEFINITIONS = [
  { level: 1, title: "Starter", minXP: 0, nextLevelXP: 100 },
  { level: 2, title: "Learner", minXP: 100, nextLevelXP: 250 },
  { level: 3, title: "Explorer", minXP: 250, nextLevelXP: 450 },
  { level: 4, title: "Builder", minXP: 450, nextLevelXP: 700 },
  { level: 5, title: "Skill Builder", minXP: 700, nextLevelXP: 900 },
  { level: 6, title: "Problem Solver", minXP: 900, nextLevelXP: 1100 },
  { level: 7, title: "CSE Achiever", minXP: 1100, nextLevelXP: 1240 },
  { level: 8, title: "Skill Builder", minXP: 1240, nextLevelXP: 1500 },
  { level: 9, title: "Career Ready", minXP: 1500, nextLevelXP: 2000 },
  { level: 10, title: "LearnX Master", minXP: 2000, nextLevelXP: 3000 },
];

export const getLevelInfo = (totalXP = 0) => {
  let matched = LEVEL_DEFINITIONS[0];
  for (let i = LEVEL_DEFINITIONS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_DEFINITIONS[i].minXP) {
      matched = LEVEL_DEFINITIONS[i];
      break;
    }
  }
  const progressPercent = Math.min(100, Math.round((totalXP / matched.nextLevelXP) * 100));
  const xpToNext = Math.max(0, matched.nextLevelXP - totalXP);
  return {
    level: matched.level,
    title: matched.title,
    currentXP: totalXP,
    minXP: matched.minXP,
    nextLevelXP: matched.nextLevelXP,
    xpToNext,
    progressPercent,
  };
};

// ── 2. Subjects reference for skill mastery ──────────────────────────────────
const SUBJECT_META = [
  { id: "dsa",  label: "DSA",     icon: "🌲", color: "bg-emerald-500", textColor: "text-emerald-700", mastery80Reward: "DSA Practice Pack", masteryRoute: "/learn/dsa" },
  { id: "dbms", label: "DBMS",    icon: "🗄️", color: "bg-blue-600",    textColor: "text-blue-700",    mastery80Reward: "DBMS Mastery Pack", masteryRoute: "/learn/dbms" },
  { id: "os",   label: "OS",      icon: "🖥️", color: "bg-violet-600",  textColor: "text-violet-700",  mastery80Reward: "OS Mock Assessment", masteryRoute: "/learn/os" },
  { id: "cn",   label: "CN",      icon: "🌐", color: "bg-amber-500",   textColor: "text-amber-700",   mastery80Reward: "CN Revision Pack",   masteryRoute: "/learn/cn" },
  { id: "oops", label: "OOPS",    icon: "📦", color: "bg-rose-500",    textColor: "text-rose-700",    mastery80Reward: "OOPS Challenge",     masteryRoute: "/learn/oops" },
];

// ── 3. Standard Baseline Badges ───────────────────────────────────────────────
export const DEFAULT_BADGES = [
  { badgeId: "first_step",           name: "First Step",          description: "Completed your first topic",                icon: "🌱", category: "learning", isUnlocked: true,  currentProgress: 1,  targetProgress: 1,  unlocks: "Learning Roadmap Access",         actionRoute: "/learn" },
  { badgeId: "seven_day_streak",     name: "7-Day Learner",       description: "Maintained a 7-day study streak",           icon: "🔥", category: "streak",   isUnlocked: true,  currentProgress: 7,  targetProgress: 7,  unlocks: "Streak Bonus XP Multiplier",      actionRoute: "/learn" },
  { badgeId: "dsa_explorer",         name: "DSA Explorer",        description: "Complete 10 DSA topics",                    icon: "🛡️", category: "learning", isUnlocked: false, currentProgress: 7,  targetProgress: 10, unlocks: "DSA Practice Pack (50 Q)",         actionRoute: "/learn/dsa" },
  { badgeId: "quiz_master",          name: "Quiz Master",         description: "Score 90%+ in 5 assessments",               icon: "🎯", category: "quiz",     isUnlocked: false, currentProgress: 3,  targetProgress: 5,  unlocks: "Personalized Weak Area Booster",  actionRoute: "/test" },
  { badgeId: "problem_solver",       name: "Problem Solver",      description: "Solve 25 coding problems",                  icon: "💻", category: "coding",   isUnlocked: false, currentProgress: 12, targetProgress: 25, unlocks: "Coding Interview Prep Pack",       actionRoute: "/coding-lab" },
  { badgeId: "interview_ready",      name: "Interview Ready",     description: "Complete 3 mock interview rounds",          icon: "🎤", category: "career",   isUnlocked: false, currentProgress: 1,  targetProgress: 3,  unlocks: "HR + Technical Interview Guide",   actionRoute: "/mock-interview" },
  { badgeId: "consistency_champion", name: "Consistency Champion",description: "Maintain a 14-day study streak",           icon: "⚡", category: "streak",   isUnlocked: false, currentProgress: 7,  targetProgress: 14, unlocks: "Revision Notes for All Subjects",  actionRoute: "/learn" },
  { badgeId: "exam_ready",           name: "Exam Ready",          description: "Complete an exam preparation milestone",    icon: "📚", category: "learning", isUnlocked: false, currentProgress: 0,  targetProgress: 1,  unlocks: "AKTU PYQ Practice Pack (5 yr)",    actionRoute: "/exam-prep" },
  { badgeId: "dbms_architect",       name: "DBMS Architect",      description: "Master 5 core DBMS concepts",              icon: "🗄️", category: "learning", isUnlocked: false, currentProgress: 2,  targetProgress: 5,  unlocks: "DBMS Mastery Pack + Notes",        actionRoute: "/learn/dbms" },
  { badgeId: "roadmap_finisher",     name: "Roadmap Finisher",    description: "Complete a subject roadmap milestone",      icon: "🗺️", category: "career",   isUnlocked: false, currentProgress: 0,  targetProgress: 1,  unlocks: "Advanced Career Roadmap",          actionRoute: "/roadmap" },
  { badgeId: "topic_master",         name: "Topic Master",        description: "Score 100% on a topic assessment",          icon: "🧠", category: "quiz",     isUnlocked: false, currentProgress: 0,  targetProgress: 1,  unlocks: "AI Concept Deep Dive Pack",        actionRoute: "/learn" },
  { badgeId: "offline_learner",      name: "Offline Learner",     description: "Study in offline mode for 5 sessions",     icon: "📶", category: "offline",  isUnlocked: false, currentProgress: 2,  targetProgress: 5,  unlocks: "Offline Study Pack",               actionRoute: "/offline-learning" },
];

// ── 4. Initialize / Seed User Baseline State ──────────────────────────────────
export const ensureUserRewardProfile = async (userId) => {
  // Streak
  let streakDoc = await LearningStreak.findOne({ user: userId });
  if (!streakDoc) {
    const today = new Date().toISOString().split("T")[0];
    const pastDays = [0, 1, 2, 3, 4, 5, 6].map((i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    });
    streakDoc = await LearningStreak.create({
      user: userId,
      currentStreak: 7,
      longestStreak: 12,
      lastActiveDate: today,
      activeDates: pastDays,
      weeklyGoalXP: 300,
      earnedThisWeekXP: 180,
      weeklyCompletedTasks: 2,
    });
  }

  // Seed transactions if fresh
  const txCount = await RewardTransaction.countDocuments({ user: userId });
  if (txCount === 0) {
    const seedTransactions = [
      { user: userId, amount: 50,   source: "TOPIC_COMPLETED",         sourceId: "topic_bst_init",          description: "Binary Search completed",                type: "XP",        timestamp: new Date(Date.now() - 12 * 60 * 1000) },
      { user: userId, amount: 30,   source: "QUIZ_COMPLETED",          sourceId: "quiz_dsa_init",           description: "DSA Quiz — 90% accuracy",                type: "XP",        timestamp: new Date(Date.now() - 25 * 60 * 1000) },
      { user: userId, amount: 100,  source: "STREAK_MILESTONE",        sourceId: "streak_7d_init",          description: "7-day learning streak",                  type: "STREAK",    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      { user: userId, amount: 0,    source: "BADGE_UNLOCKED",          sourceId: "badge_consistency_init",  description: "Badge unlocked — Consistency Champion",  type: "BADGE",     timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
      { user: userId, amount: 40,   source: "CHALLENGE_COMPLETED",     sourceId: "challenge_dbms_init",     description: "DBMS practice (5 questions)",            type: "CHALLENGE", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
      { user: userId, amount: 1020, source: "ROADMAP_TASK_COMPLETED",  sourceId: "roadmap_career_init",     description: "Semester 3 Milestone & Core Curriculum", type: "XP",        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    ];
    try { await RewardTransaction.insertMany(seedTransactions, { ordered: false }); } catch (e) { /* ignore dup */ }
  }

  // Seed badges if missing
  const badgeCount = await UserBadge.countDocuments({ user: userId });
  if (badgeCount < DEFAULT_BADGES.length) {
    for (const b of DEFAULT_BADGES) {
      await UserBadge.findOneAndUpdate(
        { user: userId, badgeId: b.badgeId },
        { $setOnInsert: { ...b, user: userId, unlockedAt: b.isUnlocked ? new Date() : null } },
        { upsert: true, new: true }
      );
    }
  }

  // Seed today's challenges if missing
  const todayStr = new Date().toISOString().split("T")[0];
  const activeChallenges = await UserChallenge.find({ user: userId, date: todayStr });
  if (activeChallenges.length < 3) {
    const todayChallenges = [
      { user: userId, challengeId: "weak_area_dbms",    title: "Fix Your Weak Area",  description: "Solve 5 DBMS Normalization questions",       category: "weak_area", badgeText: "Recommended", icon: "🗄️", iconBg: "purple",  currentProgress: 2,  targetProgress: 5,   unit: "questions", xpReward: 40, actionRoute: "/learn/dbms",   actionLabel: "Continue", status: "active", date: todayStr },
      { user: userId, challengeId: "streak_study_time", title: "Keep Your Streak",    description: "Study for 30 minutes today",                 category: "streak",    badgeText: "Daily Goal",  icon: "📖", iconBg: "emerald", currentProgress: 18, targetProgress: 30,  unit: "min",       xpReward: 50, actionRoute: "/learn",        actionLabel: "Continue", status: "active", date: todayStr },
      { user: userId, challengeId: "mastery_bst",       title: "Master a Topic",      description: "Complete Binary Search Trees (DSA)",         category: "mastery",   badgeText: "In Progress", icon: "🌲", iconBg: "indigo",  currentProgress: 60, targetProgress: 100, unit: "%",         xpReward: 75, actionRoute: "/learn/dsa",    actionLabel: "Continue", status: "active", date: todayStr },
    ];
    for (const ch of todayChallenges) {
      await UserChallenge.findOneAndUpdate(
        { user: userId, challengeId: ch.challengeId, date: todayStr },
        { $setOnInsert: ch },
        { upsert: true }
      );
    }
  }
};

// ── 5. Award XP (server-side anti-duplication) ────────────────────────────────
export const awardXP = async (userId, { amount, source, sourceId, description, type = "XP", metadata = {} }) => {
  if (!userId || !amount || !source || !sourceId) {
    return { success: false, message: "Missing required XP parameters" };
  }
  try {
    const existing = await RewardTransaction.findOne({ user: userId, source, sourceId });
    if (existing) {
      return { success: false, duplicate: true, message: "XP already awarded for this activity.", awardedAmount: 0 };
    }
    const tx = await RewardTransaction.create({ user: userId, amount, source, sourceId, description: description || `${source} completed`, type, metadata, timestamp: new Date() });
    const todayStr = new Date().toISOString().split("T")[0];
    const streak = await LearningStreak.findOne({ user: userId });
    if (streak) {
      streak.earnedThisWeekXP = (streak.earnedThisWeekXP || 0) + amount;
      if (!streak.activeDates.includes(todayStr)) {
        streak.activeDates.push(todayStr);
        streak.currentStreak = (streak.currentStreak || 0) + 1;
        if (streak.currentStreak > (streak.longestStreak || 0)) streak.longestStreak = streak.currentStreak;
        streak.lastActiveDate = todayStr;
      }
      await streak.save();
    }
    const totalXPRes = await RewardTransaction.aggregate([{ $match: { user: userId } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);
    const totalXP = totalXPRes[0]?.total || 0;
    const levelInfo = getLevelInfo(totalXP);
    let newlyUnlockedBadge = null;
    if (source === "TOPIC_COMPLETED") {
      const topicBadge = await UserBadge.findOne({ user: userId, badgeId: "dsa_explorer" });
      if (topicBadge && !topicBadge.isUnlocked) {
        topicBadge.currentProgress = Math.min(topicBadge.targetProgress, topicBadge.currentProgress + 1);
        if (topicBadge.currentProgress >= topicBadge.targetProgress) { topicBadge.isUnlocked = true; topicBadge.unlockedAt = new Date(); newlyUnlockedBadge = topicBadge.name; }
        await topicBadge.save();
      }
    }
    return { success: true, transactionId: tx._id, earnedXP: amount, totalXP, levelInfo, newlyUnlockedBadge };
  } catch (err) {
    if (err.code === 11000) return { success: false, duplicate: true, message: "Duplicate activity detected." };
    throw err;
  }
};

// ── 6. Main Dashboard Overview Payload ────────────────────────────────────────
export const getRewardsOverview = async (userId) => {
  await ensureUserRewardProfile(userId);

  // ── XP & Level ──
  const totalXPRes = await RewardTransaction.aggregate([{ $match: { user: userId } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);
  const totalXP = totalXPRes[0]?.total || 1240;
  const levelInfo = getLevelInfo(totalXP);

  // ── Streak ──
  const streak = await LearningStreak.findOne({ user: userId });

  // ── Challenges ──
  const todayStr = new Date().toISOString().split("T")[0];
  const challenges = await UserChallenge.find({ user: userId, date: todayStr }).sort({ createdAt: 1 });

  // ── Badges ──
  const badges = await UserBadge.find({ user: userId });
  const unlockedBadgesCount = badges.filter((b) => b.isUnlocked).length;

  // ── Real TopicProgress per subject ──
  const topicProgressAll = await TopicProgress.find({ user: userId });
  const subjectMap = {};
  for (const tp of topicProgressAll) {
    const sid = tp.subjectId?.toLowerCase();
    if (!sid) continue;
    if (!subjectMap[sid]) subjectMap[sid] = { completed: 0, mastered: 0, totalMasteryPct: 0, count: 0, weakConcepts: [] };
    if (tp.isCompleted) subjectMap[sid].completed++;
    if (tp.isMastered) subjectMap[sid].mastered++;
    subjectMap[sid].totalMasteryPct += tp.masteryPercentage || 0;
    subjectMap[sid].count++;
    subjectMap[sid].weakConcepts.push(...(tp.weakConcepts || []));
  }

  // ── Real TestResult accuracy per subject ──
  const testResults = await TestResult.find({ user: userId }).sort({ createdAt: -1 });
  const subjectAccuracy = {};
  for (const tr of testResults) {
    const sid = tr.subject?.toLowerCase();
    if (!sid) continue;
    if (!subjectAccuracy[sid]) subjectAccuracy[sid] = [];
    subjectAccuracy[sid].push(tr.scorePercent);
  }

  // ── Build skillMastery array ──
  const BASE_ACCURACY = { dsa: 74, dbms: 62, os: 86, cn: 58, oops: 70 };
  const skillMastery = SUBJECT_META.map((sm) => {
    const scores = subjectAccuracy[sm.id] || [];
    const recentScores = scores.slice(0, 5);
    const avgAccuracy = recentScores.length > 0
      ? Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length)
      : BASE_ACCURACY[sm.id] || 65;

    const prog = subjectMap[sm.id] || { completed: 0, count: 0, weakConcepts: [] };
    const nextMilestone = avgAccuracy < 70 ? 70 : avgAccuracy < 80 ? 80 : avgAccuracy < 90 ? 90 : 100;
    const weakConcept = [...new Set(prog.weakConcepts)][0] || null;

    return {
      subjectId: sm.id,
      label: sm.label,
      icon: sm.icon,
      color: sm.color,
      textColor: sm.textColor,
      accuracy: avgAccuracy,
      topicsCompleted: prog.completed,
      nextMilestone,
      masteryReward: sm.mastery80Reward,
      masteryRoute: sm.masteryRoute,
      weakConcept,
      isWeak: avgAccuracy < 65,
    };
  });

  // ── AI Next Best Reward ──
  // Pick subject with lowest accuracy below 75% → personalized challenge
  const weakSubject = skillMastery.filter(s => s.accuracy < 75).sort((a, b) => a.accuracy - b.accuracy)[0]
    || skillMastery.sort((a, b) => a.accuracy - b.accuracy)[0];

  const aiNextReward = {
    subject: weakSubject.label,
    subjectId: weakSubject.subjectId,
    currentAccuracy: weakSubject.accuracy,
    targetAccuracy: weakSubject.nextMilestone,
    weakConcept: weakSubject.weakConcept,
    rewardTitle: weakSubject.masteryReward,
    rewardIncludes: [
      "Quick Revision Notes",
      "Important PYQs (Past Year Questions)",
      "30 Practice Questions",
      "AI Revision Challenge",
      "Advanced Questions",
    ],
    aiMessage: weakSubject.weakConcept
      ? `Improve your ${weakSubject.weakConcept} accuracy in ${weakSubject.label} to ${weakSubject.nextMilestone}% to unlock the ${weakSubject.masteryReward}.`
      : `Improve your ${weakSubject.label} accuracy from ${weakSubject.accuracy}% to ${weakSubject.nextMilestone}% to unlock the ${weakSubject.masteryReward}.`,
    actionRoute: weakSubject.masteryRoute,
    progressPercent: Math.round((weakSubject.accuracy / weakSubject.nextMilestone) * 100),
  };

  // ── Topic Milestones ──
  const totalCompleted = topicProgressAll.filter(t => t.isCompleted).length;
  const topicMilestones = [
    { topics: 10,  reward: "Practice Pack",         icon: "📚", description: "30 curated practice questions across your subjects" },
    { topics: 25,  reward: "Subject Assessment",    icon: "📝", description: "Full subject mock test with AI evaluation" },
    { topics: 50,  reward: "Advanced Challenge",    icon: "🎯", description: "Advanced concept challenge with difficulty ramp" },
    { topics: 100, reward: "Skill Mastery Assessment", icon: "🏅", description: "Comprehensive skill certification assessment" },
  ].map(m => ({
    ...m,
    completed: totalCompleted >= m.topics,
    current: totalCompleted,
    progress: Math.min(100, Math.round((totalCompleted / m.topics) * 100)),
  }));

  // ── Career Milestones ──
  const codingCount = await CodingSubmission.countDocuments({ user: userId, status: "Accepted" });
  const interviewCount = await MockInterview.countDocuments({ user: userId });
  const highAccuracySubjects = skillMastery.filter(s => s.accuracy >= 75).length;
  const assessmentCount = testResults.length;

  // Score out of 5 requirements
  const careerReqs = {
    dsaAccuracy:    (subjectAccuracy["dsa"]?.[0] || BASE_ACCURACY.dsa) >= 70,
    dbmsAccuracy:   (subjectAccuracy["dbms"]?.[0] || BASE_ACCURACY.dbms) >= 70,
    osAccuracy:     (subjectAccuracy["os"]?.[0] || BASE_ACCURACY.os) >= 70,
    codingProblems: codingCount >= 15,
    assessmentsDone: assessmentCount >= 3,
  };
  const careerScore = Object.values(careerReqs).filter(Boolean).length; // 0-5

  const careerStages = [
    { id: "foundation",     label: "Learning Foundation",  icon: "📖", desc: "Start topics across core CSE subjects",            req: totalCompleted >= 5,    color: "emerald" },
    { id: "skill_builder",  label: "Skill Builder",        icon: "🔧", desc: "Reach 65%+ accuracy in 3+ subjects",              req: highAccuracySubjects >= 3 || skillMastery.filter(s => s.accuracy >= 65).length >= 3, color: "blue" },
    { id: "skill_verified", label: "Skill Verified",       icon: "✅", desc: "Complete 3+ assessments with 70%+ score",         req: assessmentCount >= 3,   color: "indigo" },
    { id: "interview_ready",label: "Interview Ready",      icon: "🎤", desc: "Solve 15+ coding problems + 1 mock interview",    req: codingCount >= 15 && interviewCount >= 1, color: "violet" },
    { id: "placement_ready",label: "Placement Ready",      icon: "💼", desc: "All 5 career requirements met",                   req: careerScore >= 5,       color: "amber" },
  ];

  const currentCareerStage = careerStages.reduce((acc, s, i) => s.req ? i : acc, 0);

  const placementReady = careerScore >= 5;
  const placementPack = {
    unlocked: placementReady,
    requirements: [
      { label: "DSA ≥ 70% accuracy",         met: careerReqs.dsaAccuracy },
      { label: "DBMS ≥ 70% accuracy",        met: careerReqs.dbmsAccuracy },
      { label: "OS ≥ 70% accuracy",          met: careerReqs.osAccuracy },
      { label: "15+ coding problems solved", met: careerReqs.codingProblems },
      { label: "3+ assessments completed",   met: careerReqs.assessmentsDone },
    ],
    includes: [
      { icon: "💻", label: "Coding Assessment",          route: "/coding-lab" },
      { icon: "🎤", label: "Technical Interview Practice", route: "/mock-interview" },
      { icon: "🤝", label: "HR Interview Practice",       route: "/mock-interview" },
      { icon: "🗺️", label: "Career Roadmap",              route: "/roadmap" },
      { icon: "📝", label: "Resume Improvement Guide",    route: "/roadmap" },
    ],
  };

  // ── Unlocked Benefits (based on badges + career stage) ──
  const unlockedBenefits = [];
  const unlockedBadges = badges.filter(b => b.isUnlocked);
  for (const ub of unlockedBadges) {
    const meta = DEFAULT_BADGES.find(d => d.badgeId === ub.badgeId);
    if (!meta) continue;
    unlockedBenefits.push({
      id: ub.badgeId,
      icon: ub.icon,
      title: meta.unlocks || `${ub.name} Pack`,
      earnedBy: ub.description,
      why: `Unlocked by earning the "${ub.name}" badge`,
      actionLabel: "Use Reward →",
      actionRoute: ub.actionRoute || "/learn",
    });
  }
  // Always surface the first two benefits even if no badges
  if (unlockedBenefits.length === 0) {
    unlockedBenefits.push(
      { id: "starter_benefit", icon: "📖", title: "Learning Roadmap Access", earnedBy: "Starting your learning journey", why: "Unlocked when you completed your first topic", actionLabel: "Use Reward →", actionRoute: "/roadmap" },
      { id: "streak_benefit",  icon: "🔥", title: "Streak Bonus XP Multiplier", earnedBy: "7-day learning streak", why: "Unlocked by maintaining consistent daily learning", actionLabel: "Use Reward →", actionRoute: "/learn" }
    );
  }

  // ── Next Reward (badge-based) ──
  const inProgressBadges = badges.filter((b) => !b.isUnlocked).sort((a, b) => (b.currentProgress / b.targetProgress) - (a.currentProgress / a.targetProgress));
  const nextBadge = inProgressBadges[0] || badges[2];
  const nextReward = {
    badgeId: nextBadge?.badgeId,
    title: nextBadge?.name,
    description: `Complete ${(nextBadge?.targetProgress || 1) - (nextBadge?.currentProgress || 0)} more steps to unlock this badge.`,
    currentProgress: nextBadge?.currentProgress || 0,
    targetProgress: nextBadge?.targetProgress || 1,
    rewardText: "+100 XP + Badge",
    actionRoute: nextBadge?.actionRoute || "/learn/dsa",
    actionLabel: "Continue Learning",
  };

  // ── Recent transactions ──
  const recentTransactions = await RewardTransaction.find({ user: userId }).sort({ timestamp: -1 }).limit(5);
  const formattedRecentRewards = recentTransactions.map((tx) => {
    const diffMs = Date.now() - new Date(tx.timestamp).getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    let timeAgo = "Just now";
    if (diffMins < 60) timeAgo = `${Math.max(1, diffMins)} min ago`;
    else if (diffHours < 24) timeAgo = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    else timeAgo = `${Math.floor(diffHours / 24)} day ago`;
    return {
      id: tx._id,
      amount: tx.amount,
      description: tx.description,
      type: tx.type,
      timeAgo,
      icon: tx.type === "BADGE" ? "🛡️" : tx.type === "STREAK" ? "🔥" : tx.source === "QUIZ_COMPLETED" ? "🎯" : "</>"
    };
  });

  return {
    hero: {
      level: levelInfo.level,
      levelTitle: levelInfo.title,
      totalXP,
      nextLevelXP: levelInfo.nextLevelXP,
      xpToNext: levelInfo.xpToNext,
      progressPercent: levelInfo.progressPercent,
      dayStreak: streak?.currentStreak || 7,
      longestStreak: streak?.longestStreak || 12,
      badgesCount: unlockedBadgesCount,
      activeChallengesCount: challenges.length,
      xpThisWeek: streak?.earnedThisWeekXP || 180,
      topicsCompleted: totalCompleted,
      skillsImproved: highAccuracySubjects,
      benefitsUnlocked: unlockedBenefits.length,
    },
    challenges,
    badges,
    nextReward,
    aiNextReward,
    skillMastery,
    topicMilestones,
    careerStages,
    currentCareerStage,
    placementPack,
    unlockedBenefits,
    recentRewards: formattedRecentRewards,
    weeklyGoal: {
      targetXP: streak?.weeklyGoalXP || 300,
      currentXP: streak?.earnedThisWeekXP || 180,
      daysLeft: (() => {
        const now = new Date();
        const day = now.getDay();
        return day === 0 ? 0 : 7 - day;
      })(),
      tasks: [
        { title: "Complete 2 more topics", completed: totalCompleted > 5 },
        { title: "Solve 10 practice questions", completed: codingCount >= 10 },
        { title: "Maintain your daily streak", completed: true },
      ],
      recommendedActivitiesRoute: "/learn",
    },
    skillGrowth: skillMastery.map(sm => ({
      subject: sm.label,
      growth: `${sm.accuracy}%`,
      color: sm.color,
      percent: sm.accuracy,
    })),
    settings: streak?.settings || {
      showNotifications: true,
      playSound: true,
      motivationalReminders: true,
      weeklyGoalReminders: true,
    },
  };
};
