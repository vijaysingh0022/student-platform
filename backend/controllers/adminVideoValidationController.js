import Video from "../models/Video.js";
import { Topic, Subject } from "../models/Curriculum.js";
import { extractYouTubeVideoId, verifyYouTubeVideoPlayable } from "../utils/videoValidator.js";

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
        videoId: v._id,
        topicId: v.topicId,
        subjectId: v.subjectId,
        title: v.title,
        videoUrl: v.videoUrl,
        extractedId: check.extractedId,
        isValid: check.isValid,
        status: check.status, // "playable" | "unavailable" | "restricted" | "invalid_url"
        message: check.message,
        videoTitle: check.title,
      });
    }

    const brokenCount = report.filter((r) => !r.isValid).length;
    const playableCount = report.filter((r) => r.isValid).length;

    res.json({
      success: true,
      totalVideos: videos.length,
      playableCount,
      brokenCount,
      report,
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

    const updates = { videoUrl };
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
