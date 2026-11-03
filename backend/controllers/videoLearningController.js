import Video from "../models/Video.js";
import VideoProgress from "../models/VideoProgress.js";
import TopicProgress from "../models/TopicProgress.js";
import { Topic, Subject, Unit, Chapter } from "../models/Curriculum.js";
import { INITIAL_TOPIC_VIDEOS } from "../seed/topicVideosData.js";
import { awardXP } from "../services/rewardService.js";

// Helper to format seconds to "M:SS" or "MM:SS"
const formatDuration = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// Helper to create synthetic video fallback for topics without explicit DB seed
const generateFallbackVideoForTopic = (topic) => {
  const sampleVideos = [
    { url: "https://www.youtube.com/watch?v=3EJlovevfcA", dur: 522 },
    { url: "https://www.youtube.com/watch?v=UrYLYV7WSHM", dur: 615 },
    { url: "https://www.youtube.com/watch?v=fDKIpRe8GW4", dur: 540 },
    { url: "https://www.youtube.com/watch?v=EWkQD_sP-v8", dur: 590 },
    { url: "https://www.youtube.com/watch?v=vv4y_uOneC8", dur: 480 },
  ];
  const hash = Math.abs(
    (topic.topicId || "topic").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  );
  const pick = sampleVideos[hash % sampleVideos.length];

  return {
    title: `${topic.title} — Comprehensive Tutorial`,
    description: topic.summary || `Comprehensive conceptual and practical explanation of ${topic.title}.`,
    subjectId: topic.subjectId,
    unitId: topic.unitId,
    chapterId: topic.chapterId || "",
    topicId: topic.topicId,
    videoUrl: pick.url,
    thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    duration: pick.dur,
    durationLabel: formatDuration(pick.dur),
    language: "Hinglish",
    difficulty: topic.difficulty || "Intermediate",
    sourceType: "youtube",
    transcript: [
      { timestampSeconds: 0, timeLabel: "00:00", text: `Welcome to LearnX. Today we study ${topic.title}.` },
      { timestampSeconds: 60, timeLabel: "01:00", text: "Understanding the foundational intuition and why this concept exists." },
      { timestampSeconds: 180, timeLabel: "03:00", text: "Exam requirements and step-by-step problem solving." },
      { timestampSeconds: 320, timeLabel: "05:20", text: "Key tradeoffs, interview questions, and real-world architectures." },
      { timestampSeconds: 420, timeLabel: "07:00", text: "Final summary and practice recap." },
    ],
    keyMoments: [
      { timestampSeconds: 0, timeLabel: "00:00", title: "Introduction & Context" },
      { timestampSeconds: 60, timeLabel: "01:00", title: "Core Intuition & Concepts" },
      { timestampSeconds: 180, timeLabel: "03:00", title: "Deep Dive & Examples" },
      { timestampSeconds: 320, timeLabel: "05:20", title: "Interview Gaps & Nuances" },
      { timestampSeconds: 420, timeLabel: "07:00", title: "Summary & Revision" },
    ],
    isActive: true,
  };
};

// ─── 1. GET TOPIC VIDEO & PROGRESS ──────────────────────────────────────────
// @route GET /api/learning/topics/:topicId/video
export const getTopicVideo = async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.user?._id;

    let video = await Video.findOne({ topicId, isActive: true }).lean();

    if (!video) {
      // Look in INITIAL_TOPIC_VIDEOS
      const seedItem = INITIAL_TOPIC_VIDEOS.find((v) => v.topicId === topicId);
      if (seedItem) {
        try {
          video = await Video.create(seedItem);
          video = video.toObject();
        } catch (createErr) {
          video = seedItem;
        }
      } else {
        // Fallback: look up topic metadata to generate dynamic entry
        const topic = await Topic.findOne({ topicId }).lean();
        if (topic) {
          const generated = generateFallbackVideoForTopic(topic);
          try {
            video = await Video.create(generated);
            video = video.toObject();
          } catch (genErr) {
            video = generated;
          }
        }
      }
    }

    if (!video) {
      return res.status(404).json({ message: "Video not available for this topic." });
    }

    // Fetch student's progress if authenticated
    let progress = null;
    if (userId) {
      progress = await VideoProgress.findOne({ user: userId, topicId }).lean();
    }

    res.json({
      success: true,
      video,
      progress: progress || {
        watchedSeconds: 0,
        lastPosition: 0,
        completionPercentage: 0,
        isCompleted: false,
        bookmarks: [],
      },
    });
  } catch (error) {
    console.error("getTopicVideo error:", error);
    res.status(500).json({ message: "Failed to load topic video: " + error.message });
  }
};

// ─── 2. UPDATE VIDEO PROGRESS (Heartbeat / Time update) ──────────────────────
// @route POST /api/learning/topics/:topicId/video/progress
// body: { currentTime: number, duration: number }
export const updateVideoProgress = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { currentTime = 0, duration = 1 } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required to save video progress." });
    }

    let video = await Video.findOne({ topicId });
    if (!video) {
      const seedItem = INITIAL_TOPIC_VIDEOS.find((v) => v.topicId === topicId);
      if (seedItem) {
        video = await Video.create(seedItem);
      }
    }

    const totalDuration = duration > 0 ? duration : (video?.duration || 522);
    const safeCurrent = Math.max(0, Math.min(currentTime, totalDuration));
    const completionPercentage = Math.min(100, Math.round((safeCurrent / totalDuration) * 100));

    // Threshold: 90% is marked as completed
    const meetsCompletion = completionPercentage >= 90;

    let progress = await VideoProgress.findOne({ user: userId, topicId });

    const wasAlreadyCompleted = progress?.isCompleted;

    if (!progress) {
      progress = new VideoProgress({
        user: userId,
        videoId: video?._id || new (await import("mongoose")).default.Types.ObjectId(),
        topicId,
        subjectId: video?.subjectId || "",
        watchedSeconds: safeCurrent,
        lastPosition: safeCurrent,
        completionPercentage,
        isCompleted: meetsCompletion,
        completedAt: meetsCompletion ? new Date() : null,
      });
    } else {
      progress.lastPosition = safeCurrent;
      if (safeCurrent > progress.watchedSeconds) {
        progress.watchedSeconds = safeCurrent;
      }
      if (completionPercentage > progress.completionPercentage) {
        progress.completionPercentage = completionPercentage;
      }
      if (meetsCompletion && !progress.isCompleted) {
        progress.isCompleted = true;
        progress.completedAt = new Date();
      }
    }

    await progress.save();

    let rewardResult = null;
    let topicCompletedResult = false;

    // If student just crossed 90% video completion, award XP (+20 XP) and mark Topic as completed (+30 XP)
    if (meetsCompletion && !wasAlreadyCompleted) {
      // 1. Award Video Completed XP (+20 XP, anti-duplicate via sourceId)
      rewardResult = await awardXP(userId, {
        amount: 20,
        source: "VIDEO_COMPLETED",
        sourceId: `video-${topicId}`,
        description: `Watched topic video: ${video?.title || topicId}`,
      });

      // 2. Mark the Topic itself completed in TopicProgress
      const existingTopicProg = await TopicProgress.findOne({ user: userId, topicId });
      if (!existingTopicProg || !existingTopicProg.isCompleted) {
        await TopicProgress.findOneAndUpdate(
          { user: userId, topicId },
          {
            $set: {
              subjectId: video?.subjectId || "",
              unitId: video?.unitId || "",
              chapterId: video?.chapterId || "",
              isCompleted: true,
              completedAt: new Date(),
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        topicCompletedResult = true;

        // Award Topic Completed XP (+30 XP)
        await awardXP(userId, {
          amount: 30,
          source: "TOPIC_COMPLETED",
          sourceId: `topic-${topicId}`,
          description: `Completed learning topic: ${topicId}`,
        });
      }
    }

    res.json({
      success: true,
      progress: {
        watchedSeconds: progress.watchedSeconds,
        lastPosition: progress.lastPosition,
        completionPercentage: progress.completionPercentage,
        isCompleted: progress.isCompleted,
        completedAt: progress.completedAt,
      },
      justCompleted: meetsCompletion && !wasAlreadyCompleted,
      topicCompleted: topicCompletedResult,
      reward: rewardResult,
    });
  } catch (error) {
    console.error("updateVideoProgress error:", error);
    res.status(500).json({ message: "Failed to record video progress: " + error.message });
  }
};

// ─── 3. ADD VIDEO TIMESTAMP BOOKMARK ────────────────────────────────────────
// @route POST /api/learning/topics/:topicId/video/bookmark
// body: { timestampSeconds: number, note?: string }
export const addVideoBookmark = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { timestampSeconds = 0, note = "" } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required to bookmark timestamps." });
    }

    const timeLabel = formatDuration(timestampSeconds);

    const progress = await VideoProgress.findOneAndUpdate(
      { user: userId, topicId },
      {
        $push: {
          bookmarks: {
            timestampSeconds,
            timeLabel,
            note: note.trim() || `Bookmark at ${timeLabel}`,
            createdAt: new Date(),
          },
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      message: `Bookmarked timestamp at ${timeLabel}`,
      bookmarks: progress.bookmarks,
    });
  } catch (error) {
    console.error("addVideoBookmark error:", error);
    res.status(500).json({ message: "Failed to save bookmark: " + error.message });
  }
};

// ─── 4. GET SUBJECT VIDEO STATS (FOR MY LEARNING DASHBOARD ACCURACY) ─────────
// @route GET /api/learning/subjects/:subjectId/video-stats
export const getSubjectVideoStats = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user?._id;

    const topicList = await Topic.find({ subjectId, isActive: true }).select("topicId").lean();
    const topicIds = topicList.map((t) => t.topicId);

    let completedVideosCount = 0;
    let videoProgressMap = {};

    if (userId && topicIds.length > 0) {
      const records = await VideoProgress.find({
        user: userId,
        topicId: { $in: topicIds },
      }).lean();

      records.forEach((r) => {
        videoProgressMap[r.topicId] = {
          completionPercentage: r.completionPercentage,
          isCompleted: r.isCompleted,
          lastPosition: r.lastPosition,
        };
        if (r.isCompleted || r.completionPercentage >= 90) {
          completedVideosCount++;
        }
      });
    }

    res.json({
      success: true,
      totalTopics: topicIds.length,
      completedVideosCount,
      videoProgressMap,
    });
  } catch (error) {
    console.error("getSubjectVideoStats error:", error);
    res.status(500).json({ message: "Failed to get video statistics." });
  }
};
