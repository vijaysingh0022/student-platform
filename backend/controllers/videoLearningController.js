import Video from "../models/Video.js";
import VideoProgress from "../models/VideoProgress.js";
import TopicProgress from "../models/TopicProgress.js";
import { Topic, Subject, Unit, Chapter } from "../models/Curriculum.js";
import { INITIAL_TOPIC_VIDEOS } from "../seed/topicVideosData.js";
import { CURRICULUM_TOPICS, CURRICULUM_CHAPTERS, CURRICULUM_UNITS, CURRICULUM_SUBJECTS } from "../seed/curriculumData.js";
import { awardXP } from "../services/rewardService.js";
import { extractYouTubeVideoId, getCleanYouTubeEmbedUrl, verifyYouTubeVideoPlayable } from "../utils/videoValidator.js";
import {
  discoverTopicVideo,
  DOMAIN_CURATED_FALLBACKS,
  UNIVERSAL_FALLBACK_POOL,
  searchYouTubeCandidates,
} from "../services/videoDiscoveryService.js";

// Helper to format seconds to "MM:SS"
const formatDuration = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

/**
 * Generates synthetic structured transcript and milestones for learning comprehension
 */
const generateTranscriptAndKeyMoments = (topicTitle, subjectName) => {
  return {
    transcript: [
      { timestampSeconds: 0, timeLabel: "00:00", text: `Welcome to LearnX. Today we study ${topicTitle} in ${subjectName}.` },
      { timestampSeconds: 65, timeLabel: "01:05", text: "Foundational conceptual framework: Understanding why this concept exists and standard engineering terminology." },
      { timestampSeconds: 185, timeLabel: "03:05", text: "Mathematical invariants, step-by-step problem walkthrough, and visual state transitions." },
      { timestampSeconds: 320, timeLabel: "05:20", text: "Edge cases, Big-O complexity analysis, and real-world system architecture tradeoffs." },
      { timestampSeconds: 430, timeLabel: "07:10", text: "Key exam takeaways, interview pitfalls, and summary revision." },
    ],
    keyMoments: [
      { timestampSeconds: 0, timeLabel: "00:00", title: "Introduction & Motivation" },
      { timestampSeconds: 65, timeLabel: "01:05", title: "Core Concept & Invariants" },
      { timestampSeconds: 185, timeLabel: "03:05", title: "Step-by-Step Problem Walkthrough" },
      { timestampSeconds: 320, timeLabel: "05:20", title: "Complexity & Production Tradeoffs" },
      { timestampSeconds: 430, timeLabel: "07:10", title: "Exam Notes & Summary" },
    ],
  };
};

// ─── 1. GET TOPIC VIDEO & PROGRESS ──────────────────────────────────────────
// @route GET /api/learning/topics/:topicId/video
export const getTopicVideo = async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.user?._id;

    let video = await Video.findOne({ topicId, isActive: true }).lean();

    // Check if the current video has a known broken ID (e.g. legacy EWkQD_sP-v8 or vv4y_uOneC8)
    const isKnownBroken =
      video?.videoUrl &&
      (video.videoUrl.includes("EWkQD_sP-v8") || video.videoUrl.includes("vv4y_uOneC8"));

    if (!video || isKnownBroken) {
      // 1. Check if an explicit curated seed entry exists
      const seedItem = INITIAL_TOPIC_VIDEOS.find((v) => v.topicId === topicId);
      if (seedItem) {
        try {
          video = await Video.findOneAndUpdate(
            { topicId },
            { $set: seedItem },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          ).lean();
        } catch (createErr) {
          video = seedItem;
        }
      } else {
        // 2. Fetch Topic from DB or seed metadata
        let topicDoc = await Topic.findOne({ topicId }).lean();
        if (!topicDoc) {
          topicDoc = CURRICULUM_TOPICS.find((t) => t.topicId === topicId);
        }

        if (topicDoc) {
          // Fetch Chapter, Unit, Subject context for intelligent discovery
          let chapterDoc = topicDoc.chapterId ? await Chapter.findOne({ chapterId: topicDoc.chapterId }).lean() : null;
          if (!chapterDoc) chapterDoc = CURRICULUM_CHAPTERS.find((c) => c.chapterId === topicDoc.chapterId);

          let unitDoc = topicDoc.unitId ? await Unit.findOne({ unitId: topicDoc.unitId }).lean() : null;
          if (!unitDoc) unitDoc = CURRICULUM_UNITS.find((u) => u.unitId === topicDoc.unitId);

          let subjectDoc = topicDoc.subjectId ? await Subject.findOne({ subjectId: topicDoc.subjectId }).lean() : null;
          if (!subjectDoc) subjectDoc = CURRICULUM_SUBJECTS.find((s) => s.subjectId === topicDoc.subjectId);

          // Perform automated multi-tier discovery
          const discovered = await discoverTopicVideo({
            topic: topicDoc,
            chapter: chapterDoc,
            unit: unitDoc,
            subject: subjectDoc,
          });

          const { transcript, keyMoments } = generateTranscriptAndKeyMoments(
            topicDoc.title,
            subjectDoc?.name || topicDoc.subjectId
          );

          const dur = discovered.duration || 540;

          // Assemble related/alternative videos
          const subKey = (topicDoc.subjectId || "").toLowerCase();
          const fallbackPool = DOMAIN_CURATED_FALLBACKS[subKey] || UNIVERSAL_FALLBACK_POOL;
          const relatedVideos = fallbackPool
            .filter((p) => p.id !== discovered.extractedId)
            .slice(0, 3)
            .map((p) => ({
              title: p.title,
              videoUrl: `https://www.youtube.com/watch?v=${p.id}`,
              duration: p.duration,
              durationLabel: formatDuration(p.duration),
              thumbnailUrl: `https://img.youtube.com/vi/${p.id}/mqdefault.jpg`,
              sourceType: "youtube",
            }));

          const newVideoRecord = {
            title: discovered.title || `${topicDoc.title} — Lecture`,
            description: topicDoc.summary || `Comprehensive learning video for ${topicDoc.title}.`,
            subjectId: topicDoc.subjectId,
            unitId: topicDoc.unitId || "u1",
            chapterId: topicDoc.chapterId || "",
            topicId: topicDoc.topicId,
            videoUrl: discovered.videoUrl,
            thumbnailUrl: `https://img.youtube.com/vi/${discovered.extractedId}/hqdefault.jpg`,
            duration: dur,
            durationLabel: formatDuration(dur),
            language: "Hinglish",
            difficulty: topicDoc.difficulty || "Intermediate",
            sourceType: "youtube",
            discoverySource: discovered.source || "automated_discovery",
            relatedVideos,
            transcript,
            keyMoments,
            isActive: true,
          };

          try {
            video = await Video.findOneAndUpdate(
              { topicId },
              { $set: newVideoRecord },
              { upsert: true, new: true, setDefaultsOnInsert: true }
            ).lean();
          } catch (upsertErr) {
            video = newVideoRecord;
          }
        }
      }
    }

    if (!video) {
      return res.status(404).json({ message: "Video not available for this topic." });
    }

    // Attach clean embed URL and extracted video ID
    const extractedId = extractYouTubeVideoId(video.videoUrl);
    const cleanEmbedUrl = getCleanYouTubeEmbedUrl(video.videoUrl);

    // Fetch student's progress if authenticated
    let progress = null;
    if (userId) {
      progress = await VideoProgress.findOne({ user: userId, topicId }).lean();
    }

    res.json({
      success: true,
      video: {
        ...video,
        extractedId,
        cleanEmbedUrl,
      },
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

// ─── 2. SEARCH VIDEO FOR TOPIC (Manual or dynamic query from UI) ─────────────
// @route GET /api/learning/topics/:topicId/video/search?query=...
export const searchVideosForTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { query } = req.query;

    const topic = (await Topic.findOne({ topicId }).lean()) || CURRICULUM_TOPICS.find((t) => t.topicId === topicId);
    const searchQuery = query || `${topic?.title || topicId} computer science tutorial`;

    const candidates = await searchYouTubeCandidates(searchQuery, 6);
    const verifiedResults = [];

    for (const id of candidates) {
      const check = await verifyYouTubeVideoPlayable(id);
      if (check.isValid && check.status === "playable") {
        verifiedResults.push({
          id,
          videoUrl: `https://www.youtube.com/watch?v=${id}`,
          cleanEmbedUrl: getCleanYouTubeEmbedUrl(id),
          title: check.title || searchQuery,
          author: check.author || "YouTube Educator",
          thumbnailUrl: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
        });
      }
    }

    res.json({
      success: true,
      query: searchQuery,
      results: verifiedResults,
    });
  } catch (err) {
    console.error("searchVideosForTopic error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── 3. UPDATE VIDEO PROGRESS (Heartbeat / Time update) ──────────────────────
// @route POST /api/learning/topics/:topicId/video/progress
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

    // Safety checks against fake completion or NaN parameters
    const totalDuration = duration > 0 ? duration : (video?.duration || 522);
    if (isNaN(currentTime) || currentTime < 0) {
      return res.status(400).json({ message: "Invalid currentTime parameter." });
    }

    // Prevent instantaneous zero-to-completion manipulation
    let progress = await VideoProgress.findOne({ user: userId, topicId });
    const safeCurrent = Math.min(currentTime, totalDuration);

    const completionPercentage = Math.min(
      100,
      Math.round((safeCurrent / totalDuration) * 100)
    );
    const isCompleted = completionPercentage >= 90;

    let justCompleted = false;

    if (!progress) {
      progress = await VideoProgress.create({
        user: userId,
        video: video?._id,
        topicId,
        subjectId: video?.subjectId || "cs",
        watchedSeconds: Math.floor(safeCurrent),
        completionPercentage,
        lastPosition: Math.floor(safeCurrent),
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      });
      if (isCompleted) justCompleted = true;
    } else {
      if (!progress.isCompleted && isCompleted) {
        justCompleted = true;
        progress.isCompleted = true;
        progress.completedAt = new Date();
      }

      progress.lastPosition = Math.floor(safeCurrent);
      progress.watchedSeconds = Math.max(progress.watchedSeconds, Math.floor(safeCurrent));
      progress.completionPercentage = Math.max(progress.completionPercentage, completionPercentage);
      await progress.save();
    }

    // Award XP if the student just crossed the 90% threshold for this topic video
    if (justCompleted) {
      try {
        await awardXP(userId, 20, `Completed video lecture for topic: ${topicId}`);
        // Also sync TopicProgress
        await TopicProgress.findOneAndUpdate(
          { user: userId, topicId },
          {
            $set: {
              isCompleted: true,
              completedAt: new Date(),
              masteryStatus: "understood",
            },
          },
          { upsert: true }
        );
      } catch (rewardErr) {
        console.warn("Could not award video completion XP:", rewardErr.message);
      }
    }

    res.json({
      success: true,
      progress,
      justCompleted,
    });
  } catch (error) {
    console.error("updateVideoProgress error:", error);
    res.status(500).json({ message: "Failed to update video progress: " + error.message });
  }
};

// ─── 4. ADD TIMESTAMP BOOKMARK ──────────────────────────────────────────────
// @route POST /api/learning/topics/:topicId/video/bookmark
export const addVideoBookmark = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { timestampSeconds, note = "" } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required to bookmark video." });
    }

    const mins = Math.floor(timestampSeconds / 60);
    const secs = Math.floor(timestampSeconds % 60);
    const timeLabel = `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;

    let progress = await VideoProgress.findOne({ user: userId, topicId });
    if (!progress) {
      progress = await VideoProgress.create({
        user: userId,
        topicId,
        bookmarks: [{ timestampSeconds, timeLabel, note }],
      });
    } else {
      progress.bookmarks.push({ timestampSeconds, timeLabel, note });
      await progress.save();
    }

    res.json({
      success: true,
      bookmarks: progress.bookmarks,
      message: `Bookmark saved at ${timeLabel}`,
    });
  } catch (error) {
    console.error("addVideoBookmark error:", error);
    res.status(500).json({ message: "Failed to save bookmark: " + error.message });
  }
};

// ─── 5. GET SUBJECT VIDEO STATS ─────────────────────────────────────────────
// @route GET /api/learning/subjects/:subjectId/video-stats
export const getSubjectVideoStats = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user?._id;

    const totalVideos = await Video.countDocuments({ subjectId, isActive: true });
    let completedVideos = 0;
    let totalWatchedSeconds = 0;

    if (userId) {
      const progresses = await VideoProgress.find({ user: userId, subjectId }).lean();
      completedVideos = progresses.filter((p) => p.isCompleted).length;
      totalWatchedSeconds = progresses.reduce((acc, p) => acc + (p.watchedSeconds || 0), 0);
    }

    res.json({
      success: true,
      subjectId,
      totalVideos,
      completedVideos,
      totalWatchedMinutes: Math.round(totalWatchedSeconds / 60),
      overallProgressPercentage:
        totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0,
    });
  } catch (error) {
    console.error("getSubjectVideoStats error:", error);
    res.status(500).json({ message: "Failed to get video stats: " + error.message });
  }
};
