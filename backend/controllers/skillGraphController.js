import TopicProgress from "../models/TopicProgress.js";
import { Subject } from "../models/Curriculum.js";
import { Topic } from "../models/Curriculum.js";
import {
  CURRICULUM_SUBJECTS,
  CURRICULUM_TOPICS,
} from "../seed/curriculumData.js";

// Subject domain groupings aligned with curriculum badge/subjectId
const SUBJECT_DOMAINS = [
  { id: "dsa",            label: "DSA",             icon: "⚡", color: "#2563eb" },
  { id: "dbms",           label: "DBMS",            icon: "🗄️", color: "#059669" },
  { id: "os",             label: "Operating Systems",icon: "💻", color: "#7c3aed" },
  { id: "cn",             label: "Computer Networks",icon: "🌐", color: "#0284c7" },
  { id: "oops",           label: "OOP",             icon: "🧩", color: "#d97706" },
  { id: "system-design",  label: "System Design",   icon: "🏗️", color: "#dc2626" },
  { id: "daa",            label: "Algorithms",      icon: "📐", color: "#9333ea" },
  { id: "web-dev",        label: "Web Development", icon: "⚛️", color: "#06b6d4" },
  { id: "cloud-computing",label: "Cloud",           icon: "☁️", color: "#0ea5e9" },
  { id: "ml-ai",          label: "AI / ML",         icon: "🧠", color: "#8b5cf6" },
  { id: "cyber-security", label: "Cyber Security",  icon: "🔐", color: "#ef4444" },
  { id: "aptitude",       label: "Aptitude",        icon: "🎯", color: "#14b8a6" },
];

const getMasteryStatus = (pct) => {
  if (pct >= 90) return "mastered";
  if (pct >= 75) return "strong";
  if (pct >= 50) return "developing";
  if (pct > 0)   return "weak";
  return "not_started";
};

// @route GET /api/skillgraph
export const getSkillGraph = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all topics and student progress in parallel
    let [allTopics, allSubjects, userProgress] = await Promise.all([
      Topic.find({ isActive: true }).lean().catch(() => []),
      Subject.find({ isActive: true }).lean().catch(() => []),
      TopicProgress.find({ user: userId }).lean(),
    ]);

    if (!allTopics || allTopics.length < CURRICULUM_TOPICS.length) allTopics = CURRICULUM_TOPICS;
    if (!allSubjects || allSubjects.length < CURRICULUM_SUBJECTS.length) allSubjects = CURRICULUM_SUBJECTS;

    // Build a fast progress map: topicId => progress
    const progressMap = new Map();
    userProgress.forEach(p => progressMap.set(p.topicId, p));

    // Velocity: topics completed in the last 7 days
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentlyCompleted = userProgress.filter(
      p => p.isCompleted && p.completedAt && new Date(p.completedAt) > oneWeekAgo
    ).length;

    // Improvement: mastery gained in last 7 days
    const recentlyImproved = userProgress.filter(
      p => p.attemptsCount > 0 && p.updatedAt && new Date(p.updatedAt) > oneWeekAgo
    ).length;

    // Build per-subject skill data
    const subjectSkills = SUBJECT_DOMAINS.map(domain => {
      const subjectTopics = allTopics.filter(t => t.subjectId === domain.id);
      const totalTopics = subjectTopics.length;

      if (totalTopics === 0) {
        return {
          ...domain,
          totalTopics: 0,
          completedTopics: 0,
          attemptedTopics: 0,
          masteryPercentage: 0,
          masteryStatus: "not_started",
          topicBreakdown: [],
        };
      }

      let totalMastery = 0;
      let masteredCount = 0;
      let attemptedCount = 0;
      let completedCount = 0;

      const topicBreakdown = subjectTopics.map(t => {
        const prog = progressMap.get(t.topicId);
        const pct = prog?.masteryPercentage || 0;
        const status = prog?.isCompleted
          ? getMasteryStatus(pct)
          : prog?.isRead
          ? "developing"
          : "not_started";

        if (prog) {
          if (prog.isCompleted) completedCount++;
          if (prog.attemptsCount > 0) {
            attemptedCount++;
            totalMastery += pct;
          }
          if (pct >= 90) masteredCount++;
        }

        return {
          topicId: t.topicId,
          title: t.title,
          masteryPercentage: pct,
          masteryStatus: status,
          attemptsCount: prog?.attemptsCount || 0,
          weakConcepts: prog?.weakConcepts || [],
          strongConcepts: prog?.strongConcepts || [],
          lastAttemptAt: prog?.lastAttemptAt || null,
        };
      });

      const avgMastery = attemptedCount > 0
        ? Math.round(totalMastery / attemptedCount)
        : completedCount > 0
        ? Math.round((completedCount / totalTopics) * 40) // Partial credit for completion without quiz
        : 0;

      return {
        ...domain,
        totalTopics,
        completedTopics: completedCount,
        attemptedTopics: attemptedCount,
        masteredCount,
        masteryPercentage: avgMastery,
        masteryStatus: getMasteryStatus(avgMastery),
        topicBreakdown: topicBreakdown.sort((a, b) => b.masteryPercentage - a.masteryPercentage),
      };
    });

    // Overall CSE mastery
    const subjectsWithData = subjectSkills.filter(s => s.attemptedTopics > 0 || s.completedTopics > 0);
    const overallMastery = subjectsWithData.length > 0
      ? Math.round(subjectsWithData.reduce((sum, s) => sum + s.masteryPercentage, 0) / subjectsWithData.length)
      : 0;

    // Global topic stats
    const allTopicBreakdowns = subjectSkills.flatMap(s => s.topicBreakdown);
    const strongTopics = allTopicBreakdowns
      .filter(t => t.masteryPercentage >= 75)
      .sort((a, b) => b.masteryPercentage - a.masteryPercentage)
      .slice(0, 5);

    const weakTopics = allTopicBreakdowns
      .filter(t => t.masteryPercentage > 0 && t.masteryPercentage < 60)
      .sort((a, b) => a.masteryPercentage - b.masteryPercentage)
      .slice(0, 5);

    res.json({
      overallMastery,
      masteryStatus: getMasteryStatus(overallMastery),
      subjectSkills,
      strongTopics,
      weakTopics,
      velocity: {
        topicsThisWeek: recentlyCompleted,
        improvedThisWeek: recentlyImproved,
      },
      totalTopicsInCurriculum: allTopics.length,
      totalTopicsCompleted: userProgress.filter(p => p.isCompleted).length,
      totalTopicsAttempted: userProgress.filter(p => p.attemptsCount > 0).length,
    });
  } catch (err) {
    console.error("getSkillGraph error:", err);
    res.status(500).json({ message: "Failed to fetch skill graph." });
  }
};
