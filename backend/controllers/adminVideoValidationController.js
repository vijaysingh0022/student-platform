import Video from "../models/Video.js";
import { Topic, Subject, Unit, Chapter } from "../models/Curriculum.js";
import { CURRICULUM_TOPICS, CURRICULUM_SUBJECTS, CURRICULUM_CHAPTERS, CURRICULUM_UNITS } from "../seed/curriculumData.js";
import { extractYouTubeVideoId, verifyYouTubeVideoPlayable, getCleanYouTubeEmbedUrl } from "../utils/videoValidator.js";
import { discoverTopicVideo } from "../services/videoDiscoveryService.js";

// @desc Validate all videos across the platform or for a specific course/subject
// @route GET /api/admin/videos/validation-report
export const getVideoValidationReport = async (req, res) => {
  try {
    const { subjectId } = req.query;
    const filter = { isActive: true };
    if (subjectId && subjectId !== "All") {
      filter.subjectId = subjectId;
    }

    const videos = await Video.find(filter).lean();
    const report = [];

    for (const v of videos) {
      const check = await verifyYouTubeVideoPlayable(v.videoUrl);
      report.push({
        id: v._id,
        videoId: v._id,
        topicId: v.topicId,
        subjectId: v.subjectId,
        title: v.title,
        videoUrl: v.videoUrl,
        discoverySource: v.discoverySource || "seed",
        validation: {
          youtubeId: check.extractedId,
          playable: check.isValid && check.status === "playable",
          status: check.status,
          title: check.title,
          error: !check.isValid ? check.message : null,
        },
      });
    }

    const brokenCount = report.filter((r) => !r.validation?.playable).length;
    const playableCount = report.filter((r) => r.validation?.playable).length;

    res.json({
      success: true,
      summary: {
        total: videos.length,
        playable: playableCount,
        broken: brokenCount,
      },
      videos: report,
    });
  } catch (err) {
    console.error("getVideoValidationReport error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Verify a specific video URL on the fly (for admin input validation)
// @route POST /api/admin/videos/verify-url
export const verifySingleVideoUrl = async (req, res) => {
  try {
    const { videoUrl } = req.body;
    if (!videoUrl) {
      return res.status(400).json({ success: false, message: "videoUrl is required." });
    }

    const result = await verifyYouTubeVideoPlayable(videoUrl);
    res.json({
      success: true,
      ...result,
      cleanEmbedUrl: getCleanYouTubeEmbedUrl(videoUrl),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Replace/Update a broken video URL in the database
// @route PUT /api/admin/videos/:id/replace
export const replaceVideoUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { videoUrl, title, duration } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ success: false, message: "New videoUrl is required." });
    }

    // Verify playability before saving
    const check = await verifyYouTubeVideoPlayable(videoUrl);
    if (!check.isValid) {
      return res.status(400).json({
        success: false,
        message: `The provided video URL cannot be verified as playable: ${check.message}`,
        details: check,
      });
    }

    const updates = { videoUrl, discoverySource: "manual_admin" };
    if (title) updates.title = title;
    if (check.title && !title) updates.title = check.title;
    if (duration) {
      updates.duration = duration;
      const m = Math.floor(duration / 60);
      const s = Math.floor(duration % 60);
      updates.durationLabel = `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
    }

    const updated = await Video.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Video record not found." });
    }

    res.json({
      success: true,
      message: "Video updated and verified successfully.",
      video: updated,
    });
  } catch (err) {
    console.error("replaceVideoUrl error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Admin manually adds a video for a topic
// @route POST /api/admin/videos
export const addVideo = async (req, res) => {
  try {
    const { topicId, subjectId, unitId, chapterId, title, videoUrl, duration } = req.body;
    if (!topicId || !videoUrl) {
      return res.status(400).json({ success: false, message: "topicId and videoUrl are required." });
    }

    const check = await verifyYouTubeVideoPlayable(videoUrl);
    if (!check.isValid) {
      return res.status(400).json({
        success: false,
        message: `Video cannot be verified: ${check.message}`,
      });
    }

    const dur = duration || 522;
    const m = Math.floor(dur / 60);
    const s = Math.floor(dur % 60);

    const video = await Video.findOneAndUpdate(
      { topicId },
      {
        $set: {
          title: title || check.title || "Topic Lecture",
          videoUrl,
          subjectId: subjectId || "cs",
          unitId: unitId || "u1",
          chapterId: chapterId || "",
          duration: dur,
          durationLabel: `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`,
          discoverySource: "manual_admin",
          isActive: true,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, message: "Video added successfully.", video });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Admin removes a video for a topic
// @route DELETE /api/admin/videos/:id
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Video.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Video not found." });
    }
    res.json({ success: true, message: "Video removed successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
