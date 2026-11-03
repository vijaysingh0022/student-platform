import mongoose from "mongoose";

const transcriptItemSchema = new mongoose.Schema({
  timestampSeconds: { type: Number, required: true }, // e.g. 75 (1:15)
  timeLabel: { type: String, required: true }, // e.g. "01:15"
  text: { type: String, required: true },
});

const relatedVideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  duration: { type: Number, default: 522 },
  durationLabel: { type: String, default: "08:42" },
  thumbnailUrl: { type: String, default: "" },
  sourceType: { type: String, default: "youtube" },
});

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    subjectId: { type: String, required: true, index: true }, // e.g. "dbms", "dsa", "os"
    unitId: { type: String, required: true, index: true }, // e.g. "dbms-u1"
    chapterId: { type: String, default: "", index: true },
    topicId: { type: String, required: true, unique: true, index: true }, // e.g. "dbms-u1-architecture"

    videoUrl: { type: String, required: true }, // YouTube URL, MP4/HLS stream URL, or uploaded video
    thumbnailUrl: { type: String, default: "" },
    duration: { type: Number, required: true, default: 522 }, // Duration in seconds (e.g. 522s = 8:42)
    durationLabel: { type: String, default: "08:42" }, // Formatted e.g. "8:42"

    language: { type: String, enum: ["English", "Hindi", "Hinglish"], default: "Hinglish" },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },

    sourceType: {
      type: String,
      enum: ["youtube", "uploaded", "external", "ai_generated"],
      default: "youtube",
    },

    // Hierarchical discovery flag
    discoverySource: {
      type: String,
      default: "seed", // "seed" | "search_topic_exact" | "search_chapter_fallback" | "search_unit_fallback" | "curated_domain_fallback" | "manual_admin"
    },

    // Alternative/Related videos for multi-angle learning
    relatedVideos: [relatedVideoSchema],

    transcript: [transcriptItemSchema],
    keyMoments: [
      {
        timestampSeconds: { type: Number, required: true },
        timeLabel: { type: String, required: true },
        title: { type: String, required: true },
      },
    ],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);
export default Video;
