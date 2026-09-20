import { Subject, Unit, Chapter, Topic } from "../models/Curriculum.js";
import TopicProgress from "../models/TopicProgress.js";
import TopicQuestion from "../models/TopicQuestion.js";
import User from "../models/User.js";
import crypto from "crypto";

// ─── MASTERY CLASSIFICATION THRESHOLDS ───────────────────────────────────────
const MASTERY_THRESHOLDS = {
  STRONG_MIN: 80, // >= 80%
  NEEDS_PRACTICE_MIN: 60, // 60% - 79%
  // Below 60% = Weak
};

const calculateMasteryStatus = (percentage) => {
  if (percentage >= MASTERY_THRESHOLDS.STRONG_MIN) return "strong";
  if (percentage >= MASTERY_THRESHOLDS.NEEDS_PRACTICE_MIN) return "needs_practice";
  return "weak";
};

// ─── 1. GET ALL SUBJECTS WITH STUDENT PROGRESS ───────────────────────────────
// @route GET /api/learning/subjects
export const getSubjects = async (req, res) => {
  try {
    const userId = req.user?._id;
    const subjects = await Subject.find({ isActive: true }).sort({ order: 1 }).lean();

    // Fetch all topics and units count
    const [allTopics, allUnits, userProgressList] = await Promise.all([
      Topic.find({ isActive: true }).select("topicId subjectId").lean(),
      Unit.find({}).select("unitId subjectId").lean(),
      userId ? TopicProgress.find({ user: userId }).lean() : Promise.resolve([]),
    ]);

    // Map progress by topicId
    const progressMap = new Map();
    userProgressList.forEach((p) => progressMap.set(p.topicId, p));

    const enrichedSubjects = subjects.map((sub) => {
      const subTopics = allTopics.filter((t) => t.subjectId === sub.subjectId);
      const subUnits = allUnits.filter((u) => u.subjectId === sub.subjectId);

      const totalTopics = subTopics.length;
      let completedTopics = 0;
      let readTopics = 0;
      let weakTopicCount = 0;
      let strongTopicCount = 0;
      let totalMasteryScore = 0;
      let attemptedTopicsCount = 0;

      subTopics.forEach((t) => {
        const prog = progressMap.get(t.topicId);
        if (prog) {
          if (prog.isCompleted) completedTopics++;
          if (prog.isRead) readTopics++;
          if (prog.masteryStatus === "weak") weakTopicCount++;
          if (prog.masteryStatus === "strong") strongTopicCount++;
          if (prog.attemptsCount > 0) {
            totalMasteryScore += prog.masteryPercentage || 0;
            attemptedTopicsCount++;
          }
        }
      });

      const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
      const avgMastery = attemptedTopicsCount > 0 ? Math.round(totalMasteryScore / attemptedTopicsCount) : 0;

      return {
        ...sub,
        totalUnits: subUnits.length,
        totalTopics,
        completedTopics,
        readTopics,
        progressPercent,
        avgMastery,
        weakTopicCount,
        strongTopicCount,
      };
    });

    res.json(enrichedSubjects);
  } catch (err) {
    console.error("getSubjects error:", err);
    res.status(500).json({ message: "Failed to fetch subjects." });
  }
};

// ─── 2. GET SUBJECT DETAIL & HIERARCHICAL TREE ──────────────────────────────
// @route GET /api/learning/subjects/:subjectId
export const getSubjectHierarchy = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user?._id;

    const subject = await Subject.findOne({ subjectId }).lean();
    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    const [units, chapters, topics, userProgress] = await Promise.all([
      Unit.find({ subjectId }).sort({ order: 1, unitNumber: 1 }).lean(),
      Chapter.find({ subjectId }).sort({ order: 1, chapterNumber: 1 }).lean(),
      Topic.find({ subjectId, isActive: true }).sort({ order: 1, topicNumber: 1 }).lean(),
      userId ? TopicProgress.find({ user: userId, subjectId }).lean() : Promise.resolve([]),
    ]);

    const progressMap = new Map();
    userProgress.forEach((p) => progressMap.set(p.topicId, p));

    // Build hierarchical tree: Unit -> Chapters -> Topics
    const structuredUnits = units.map((u) => {
      const unitChapters = chapters.filter((c) => c.unitId === u.unitId);

      const enrichedChapters = unitChapters.map((ch) => {
        const chapterTopics = topics.filter((t) => t.chapterId === ch.chapterId);

        const enrichedTopics = chapterTopics.map((t) => {
          const prog = progressMap.get(t.topicId);
          return {
            topicId: t.topicId,
            chapterId: t.chapterId,
            unitId: t.unitId,
            subjectId: t.subjectId,
            topicNumber: t.topicNumber,
            title: t.title,
            estimatedMinutes: t.estimatedMinutes,
            difficulty: t.difficulty,
            summary: t.summary,
            subtopics: t.subtopics,
            isRead: !!prog?.isRead,
            isCompleted: !!prog?.isCompleted,
            masteryStatus: prog?.masteryStatus || "not_attempted",
            masteryPercentage: prog?.masteryPercentage || 0,
            latestScore: prog?.latestScore || 0,
            bestScore: prog?.bestScore || 0,
            attemptsCount: prog?.attemptsCount || 0,
            weakConcepts: prog?.weakConcepts || [],
            strongConcepts: prog?.strongConcepts || [],
          };
        });

        const chCompleted = enrichedTopics.filter((t) => t.isCompleted).length;
        const chTotal = enrichedTopics.length;

        return {
          ...ch,
          topics: enrichedTopics,
          totalTopics: chTotal,
          completedTopics: chCompleted,
          progressPercent: chTotal > 0 ? Math.round((chCompleted / chTotal) * 100) : 0,
        };
      });

      // Unit aggregate progress
      const allUnitTopics = enrichedChapters.flatMap((c) => c.topics);
      const unitCompleted = allUnitTopics.filter((t) => t.isCompleted).length;
      const unitTotal = allUnitTopics.length;

      return {
        ...u,
        chapters: enrichedChapters,
        totalTopics: unitTotal,
        completedTopics: unitCompleted,
        progressPercent: unitTotal > 0 ? Math.round((unitCompleted / unitTotal) * 100) : 0,
      };
    });

    const totalTopics = topics.length;
    const completedTopics = userProgress.filter((p) => p.isCompleted).length;
    const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    res.json({
      subject,
      units: structuredUnits,
      stats: {
        totalUnits: units.length,
        totalChapters: chapters.length,
        totalTopics,
        completedTopics,
        progressPercent,
      },
    });
  } catch (err) {
    console.error("getSubjectHierarchy error:", err);
    res.status(500).json({ message: "Failed to fetch subject curriculum." });
  }
};

// ─── 3. GET TOPIC LEARNING CONTENT & BREADCRUMBS ────────────────────────────
// @route GET /api/learning/topics/:topicId
export const getTopicContent = async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.user?._id;

    const topic = await Topic.findOne({ topicId, isActive: true }).lean();
    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    const [subject, unit, chapter, progress, nextTopic, prevTopic] = await Promise.all([
      Subject.findOne({ subjectId: topic.subjectId }).lean(),
      Unit.findOne({ unitId: topic.unitId }).lean(),
      Chapter.findOne({ chapterId: topic.chapterId }).lean(),
      userId ? TopicProgress.findOne({ user: userId, topicId }).lean() : Promise.resolve(null),
      Topic.findOne({ subjectId: topic.subjectId, order: { $gt: topic.order } }).sort({ order: 1 }).select("topicId title").lean(),
      Topic.findOne({ subjectId: topic.subjectId, order: { $lt: topic.order } }).sort({ order: -1 }).select("topicId title").lean(),
    ]);

    // Auto-mark topic as read on open if not already marked
    if (userId && (!progress || !progress.isRead)) {
      await TopicProgress.findOneAndUpdate(
        { user: userId, topicId: topic.topicId },
        {
          $set: {
            subjectId: topic.subjectId,
            unitId: topic.unitId,
            chapterId: topic.chapterId,
            isRead: true,
            readAt: new Date(),
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).catch(() => {});
    }

    res.json({
      topic,
      breadcrumbs: {
        subject: { id: subject?.subjectId || topic.subjectId, name: subject?.name || topic.subjectId },
        unit: { id: unit?.unitId || topic.unitId, title: unit?.title || `Unit ${unit?.unitNumber || 1}` },
        chapter: { id: chapter?.chapterId || topic.chapterId, title: chapter?.title || `Chapter ${chapter?.chapterNumber || 1}` },
        topic: { id: topic.topicId, title: topic.title },
      },
      navigation: {
        next: nextTopic,
        prev: prevTopic,
      },
      progress: progress || {
        isRead: true,
        isCompleted: false,
        masteryStatus: "not_attempted",
        masteryPercentage: 0,
        attemptsCount: 0,
      },
    });
  } catch (err) {
    console.error("getTopicContent error:", err);
    res.status(500).json({ message: "Failed to fetch topic content." });
  }
};

// ─── 4. MARK TOPIC AS READ ──────────────────────────────────────────────────
// @route POST /api/learning/topics/:topicId/read
export const markTopicRead = async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.user?._id;

    const topic = await Topic.findOne({ topicId }).lean();
    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    const progress = await TopicProgress.findOneAndUpdate(
      { user: userId, topicId },
      {
        $set: {
          subjectId: topic.subjectId,
          unitId: topic.unitId,
          chapterId: topic.chapterId,
          isRead: true,
          readAt: new Date(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, progress });
  } catch (err) {
    console.error("markTopicRead error:", err);
    res.status(500).json({ message: "Failed to mark topic as read." });
  }
};

// ─── 5. MARK TOPIC AS COMPLETED ─────────────────────────────────────────────
// @route POST /api/learning/topics/:topicId/complete
export const markTopicCompleted = async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.user?._id;

    const topic = await Topic.findOne({ topicId }).lean();
    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    const progress = await TopicProgress.findOneAndUpdate(
      { user: userId, topicId },
      {
        $set: {
          subjectId: topic.subjectId,
          unitId: topic.unitId,
          chapterId: topic.chapterId,
          isRead: true,
          isCompleted: true,
          completedAt: new Date(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      message: "Topic marked as completed! Test your understanding with the topic quiz.",
      progress,
    });
  } catch (err) {
    console.error("markTopicCompleted error:", err);
    res.status(500).json({ message: "Failed to mark topic as completed." });
  }
};

// ─── 6. GET TOPIC-SPECIFIC QUIZ ─────────────────────────────────────────────
// @route GET /api/learning/topics/:topicId/quiz
export const getTopicQuiz = async (req, res) => {
  try {
    const { topicId } = req.params;
    const count = parseInt(req.query.count) || 10; // 5, 10, or 15

    const topic = await Topic.findOne({ topicId }).lean();
    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    let questions = await TopicQuestion.find({ topicId }).lean();

    // Fallback if less than requested: fetch matching from general question bank
    if (questions.length === 0) {
      questions = await TopicQuestion.find({ subjectId: topic.subjectId }).lean();
    }

    // Shuffle and slice requested count
    const shuffled = questions.sort(() => 0.5 - Math.random()).slice(0, count);

    // Sanitize output (omit correctAnswerIndex from initial quiz payload)
    const sanitizedQuestions = shuffled.map((q, idx) => ({
      _id: q._id,
      questionNumber: idx + 1,
      subtopic: q.subtopic || "Core Concept",
      questionText: q.questionText,
      options: q.options,
      difficulty: q.difficulty || "medium",
    }));

    res.json({
      topicId: topic.topicId,
      topicTitle: topic.title,
      subjectId: topic.subjectId,
      totalQuestions: sanitizedQuestions.length,
      questions: sanitizedQuestions,
    });
  } catch (err) {
    console.error("getTopicQuiz error:", err);
    res.status(500).json({ message: "Failed to fetch topic quiz." });
  }
};

// ─── 7. SUBMIT TOPIC QUIZ & PERFORMANCE ANALYSIS ────────────────────────────
// @route POST /api/learning/topics/:topicId/quiz/submit
// body: { answers: { [questionId]: selectedOptionIndex }, timeTakenSeconds: 120 }
export const submitTopicQuiz = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { answers = {}, timeTakenSeconds = 0 } = req.body;
    const userId = req.user?._id;

    const topic = await Topic.findOne({ topicId }).lean();
    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    const questionIds = Object.keys(answers);
    const questions = await TopicQuestion.find({ _id: { $in: questionIds } }).lean();

    let correctCount = 0;
    const totalQuestions = questions.length || 1;
    const detailedResults = [];
    const subtopicBreakdown = {};

    questions.forEach((q) => {
      const selectedIndex = answers[q._id.toString()];
      const isCorrect = Number(selectedIndex) === q.correctAnswerIndex;
      if (isCorrect) correctCount++;

      const subtopicKey = q.subtopic || "Core Understanding";
      if (!subtopicBreakdown[subtopicKey]) {
        subtopicBreakdown[subtopicKey] = { correct: 0, total: 0 };
      }
      subtopicBreakdown[subtopicKey].total++;
      if (isCorrect) subtopicBreakdown[subtopicKey].correct++;

      detailedResults.push({
        questionId: q._id,
        questionText: q.questionText,
        options: q.options,
        selectedAnswerIndex: selectedIndex,
        correctAnswerIndex: q.correctAnswerIndex,
        isCorrect,
        subtopic: subtopicKey,
        explanation: q.explanation || "Review the topic concepts to solidify this understanding.",
      });
    });

    const accuracyPercent = Math.round((correctCount / totalQuestions) * 100);
    const masteryStatus = calculateMasteryStatus(accuracyPercent);

    // Identify weak (<60%) and strong (>=60%) concepts
    const weakConcepts = [];
    const strongConcepts = [];

    Object.entries(subtopicBreakdown).forEach(([concept, stats]) => {
      const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      if (pct < 60) {
        weakConcepts.push(concept);
      } else {
        strongConcepts.push(concept);
      }
    });

    // Update student's TopicProgress in database
    const attemptId = crypto.randomUUID();
    const revisionRecord = {
      attemptId,
      date: new Date(),
      score: correctCount,
      totalQuestions,
      accuracyPercent,
      timeTakenSeconds,
      weakConcepts,
      strongConcepts,
    };

    let updatedProgress = null;
    if (userId) {
      const existingProgress = await TopicProgress.findOne({ user: userId, topicId }).lean();
      const bestScore = Math.max(existingProgress?.bestScore || 0, correctCount);
      const bestTotal = totalQuestions;

      updatedProgress = await TopicProgress.findOneAndUpdate(
        { user: userId, topicId },
        {
          $set: {
            subjectId: topic.subjectId,
            unitId: topic.unitId,
            chapterId: topic.chapterId,
            isCompleted: true,
            completedAt: existingProgress?.completedAt || new Date(),
            masteryStatus,
            masteryPercentage: accuracyPercent,
            latestScore: correctCount,
            latestTotal: totalQuestions,
            bestScore,
            bestTotal,
            weakConcepts,
            strongConcepts,
            lastAttemptAt: new Date(),
          },
          $inc: { attemptsCount: 1 },
          $push: { revisionHistory: revisionRecord },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // Recommendation logic
    let recommendedAction = "";
    if (masteryStatus === "weak") {
      recommendedAction = `Your current mastery is ${accuracyPercent}%. We recommend revising ${weakConcepts.join(", ") || topic.title} and asking AI Tutor for assistance before retaking the quiz.`;
    } else if (masteryStatus === "needs_practice") {
      recommendedAction = `Good effort (${accuracyPercent}%)! Polish up on ${weakConcepts.join(", ") || "edge cases"} and practice one more time to reach full mastery.`;
    } else {
      recommendedAction = `Outstanding mastery (${accuracyPercent}%)! You have demonstrated strong understanding of ${topic.title}. You are ready for the next topic!`;
    }

    res.json({
      attemptId,
      topicId: topic.topicId,
      topicTitle: topic.title,
      subjectId: topic.subjectId,
      totalQuestions,
      correctCount,
      incorrectCount: totalQuestions - correctCount,
      accuracyPercent,
      masteryStatus, // "strong" | "needs_practice" | "weak"
      timeTakenSeconds,
      subtopicBreakdown,
      weakConcepts,
      strongConcepts,
      recommendedAction,
      detailedResults,
      progress: updatedProgress,
    });
  } catch (err) {
    console.error("submitTopicQuiz error:", err);
    res.status(500).json({ message: "Failed to evaluate topic quiz." });
  }
};

// ─── 8. GET STUDENT LEARNING SUMMARY & RECOMMENDATIONS ──────────────────────
// @route GET /api/learning/student/dashboard-summary
export const getStudentLearningSummary = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const [allTopics, allSubjects, userProgressList] = await Promise.all([
      Topic.find({ isActive: true }).sort({ order: 1 }).lean(),
      Subject.find({ isActive: true }).sort({ order: 1 }).lean(),
      TopicProgress.find({ user: userId }).sort({ updatedAt: -1 }).lean(),
    ]);

    const progressMap = new Map();
    userProgressList.forEach((p) => progressMap.set(p.topicId, p));

    // 1. "Continue Learning" — find most recent active topic or first incomplete
    let continueLearning = null;
    const mostRecentProgress = userProgressList[0]; // sorted by updatedAt: -1

    if (mostRecentProgress) {
      const topic = allTopics.find((t) => t.topicId === mostRecentProgress.topicId);
      const subject = allSubjects.find((s) => s.subjectId === mostRecentProgress.subjectId);
      if (topic) {
        continueLearning = {
          topicId: topic.topicId,
          topicTitle: topic.title,
          subjectId: topic.subjectId,
          subjectName: subject?.name || topic.subjectId,
          unitId: topic.unitId,
          isCompleted: mostRecentProgress.isCompleted,
          masteryStatus: mostRecentProgress.masteryStatus,
          masteryPercentage: mostRecentProgress.masteryPercentage,
          lastActivityDate: mostRecentProgress.updatedAt,
        };
      }
    }

    if (!continueLearning && allTopics.length > 0) {
      const firstTopic = allTopics[0];
      const subject = allSubjects.find((s) => s.subjectId === firstTopic.subjectId);
      continueLearning = {
        topicId: firstTopic.topicId,
        topicTitle: firstTopic.title,
        subjectId: firstTopic.subjectId,
        subjectName: subject?.name || firstTopic.subjectId,
        unitId: firstTopic.unitId,
        isCompleted: false,
        masteryStatus: "not_attempted",
        masteryPercentage: 0,
      };
    }

    // 2. "Your Weak Topics" — topics with masteryStatus === 'weak' or score < 60%
    const weakTopics = [];
    userProgressList.forEach((p) => {
      if (p.masteryStatus === "weak" || (p.attemptsCount > 0 && p.masteryPercentage < 60)) {
        const topic = allTopics.find((t) => t.topicId === p.topicId);
        const subject = allSubjects.find((s) => s.subjectId === p.subjectId);
        if (topic) {
          weakTopics.push({
            topicId: topic.topicId,
            title: topic.title,
            subjectId: topic.subjectId,
            subjectName: subject?.name || topic.subjectId,
            unitId: topic.unitId,
            masteryPercentage: p.masteryPercentage || 0,
            weakConcepts: p.weakConcepts || [],
            attemptsCount: p.attemptsCount || 0,
            lastAttemptAt: p.lastAttemptAt,
          });
        }
      }
    });

    // 3. "Recommended Next" — Intelligent priority engine:
    //    Priority 1: Weak topics (<60%)
    //    Priority 2: Topics needing practice (60-79%)
    //    Priority 3: Next uncompleted/unstarted topics
    const recommendations = [];

    // Add up to 2 weak topics
    weakTopics.slice(0, 2).forEach((wt) => {
      recommendations.push({
        topicId: wt.topicId,
        title: wt.title,
        subjectId: wt.subjectId,
        subjectName: wt.subjectName,
        type: "revise_weak",
        reason: `Weak Topic (${wt.masteryPercentage}% mastery) — Revise concepts in ${wt.weakConcepts.slice(0, 2).join(", ") || wt.title}`,
        priority: 1,
        actionLabel: "📖 Revise & Practice",
      });
    });

    // Add topics needing practice (60-79%)
    userProgressList.forEach((p) => {
      if (p.masteryStatus === "needs_practice" && recommendations.length < 4) {
        const topic = allTopics.find((t) => t.topicId === p.topicId);
        const subject = allSubjects.find((s) => s.subjectId === p.subjectId);
        if (topic && !recommendations.some((r) => r.topicId === topic.topicId)) {
          recommendations.push({
            topicId: topic.topicId,
            title: topic.title,
            subjectId: topic.subjectId,
            subjectName: subject?.name || topic.subjectId,
            type: "needs_practice",
            reason: `Needs Practice (${p.masteryPercentage}% mastery) — One more practice quiz to reach Strong mastery!`,
            priority: 2,
            actionLabel: "📝 Practice Quiz",
          });
        }
      }
    });

    // Add next unstarted / uncompleted topics
    allTopics.forEach((t) => {
      if (recommendations.length < 4) {
        const prog = progressMap.get(t.topicId);
        if (!prog || !prog.isCompleted) {
          if (!recommendations.some((r) => r.topicId === t.topicId)) {
            const subject = allSubjects.find((s) => s.subjectId === t.subjectId);
            recommendations.push({
              topicId: t.topicId,
              title: t.title,
              subjectId: t.subjectId,
              subjectName: subject?.name || t.subjectId,
              type: "new_topic",
              reason: "Next Core Topic in your syllabus",
              priority: 3,
              actionLabel: "🚀 Start Learning",
            });
          }
        }
      }
    });

    // Global curriculum stats
    const totalTopics = allTopics.length;
    const completedTopics = userProgressList.filter((p) => p.isCompleted).length;
    const readTopics = userProgressList.filter((p) => p.isRead).length;
    const strongTopicsCount = userProgressList.filter((p) => p.masteryStatus === "strong").length;
    const needsPracticeCount = userProgressList.filter((p) => p.masteryStatus === "needs_practice").length;
    const quizzesTaken = userProgressList.filter((p) => p.attemptsCount > 0).length;
    const overallProgressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    res.json({
      continueLearning,
      weakTopics,
      recommendations,
      stats: {
        totalSubjects: allSubjects.length,
        totalTopics,
        completedTopics,
        readTopics,
        strongTopicsCount,
        needsPracticeCount,
        quizzesTaken,
        weakTopicsCount: weakTopics.length,
        overallProgressPercent,
      },
    });
  } catch (err) {
    console.error("getStudentLearningSummary error:", err);
    res.status(500).json({ message: "Failed to fetch student learning summary." });
  }
};

// ─── 9. GET FACULTY LEARNING ANALYTICS ───────────────────────────────────────
// @route GET /api/learning/faculty/analytics
export const getFacultyLearningAnalytics = async (req, res) => {
  try {
    const [allProgress, allTopics, allSubjects, studentsCount] = await Promise.all([
      TopicProgress.find({}).lean(),
      Topic.find({ isActive: true }).lean(),
      Subject.find({ isActive: true }).lean(),
      User.countDocuments({ role: "student" }),
    ]);

    // Aggregate topic difficulty across all student attempts
    const topicStats = new Map();

    allProgress.forEach((p) => {
      if (!topicStats.has(p.topicId)) {
        topicStats.set(p.topicId, {
          topicId: p.topicId,
          subjectId: p.subjectId,
          totalAttempts: 0,
          totalScore: 0,
          weakCount: 0,
          strongCount: 0,
        });
      }
      const st = topicStats.get(p.topicId);
      if (p.attemptsCount > 0) {
        st.totalAttempts++;
        st.totalScore += p.masteryPercentage || 0;
        if (p.masteryStatus === "weak") st.weakCount++;
        if (p.masteryStatus === "strong") st.strongCount++;
      }
    });

    // Top most weak / difficult topics
    const aggregatedTopics = [];
    topicStats.forEach((st) => {
      const topic = allTopics.find((t) => t.topicId === st.topicId);
      const subject = allSubjects.find((s) => s.subjectId === st.subjectId);
      const avgMastery = st.totalAttempts > 0 ? Math.round(st.totalScore / st.totalAttempts) : 0;

      aggregatedTopics.push({
        topicId: st.topicId,
        title: topic?.title || st.topicId,
        subjectId: st.subjectId,
        subjectName: subject?.name || st.subjectId,
        avgMastery,
        weakStudentsCount: st.weakCount,
        totalAttempts: st.totalAttempts,
      });
    });

    // Sort by lowest average mastery
    aggregatedTopics.sort((a, b) => a.avgMastery - b.avgMastery);
    const mostDifficultTopics = aggregatedTopics.slice(0, 5);

    // Subject-wise completion rates
    const subjectCompletionStats = allSubjects.map((sub) => {
      const subTopics = allTopics.filter((t) => t.subjectId === sub.subjectId);
      const subProgress = allProgress.filter((p) => p.subjectId === sub.subjectId && p.isCompleted);
      const expectedTotalCompletions = subTopics.length * (studentsCount || 1);
      const completionRate = expectedTotalCompletions > 0 ? Math.round((subProgress.length / expectedTotalCompletions) * 100) : 0;

      return {
        subjectId: sub.subjectId,
        name: sub.name,
        totalTopics: subTopics.length,
        completionRate: Math.min(completionRate, 100),
      };
    });

    res.json({
      totalStudents: studentsCount || 1,
      mostDifficultTopics,
      subjectCompletionStats,
    });
  } catch (err) {
    console.error("getFacultyLearningAnalytics error:", err);
    res.status(500).json({ message: "Failed to fetch faculty analytics." });
  }
};
