import mongoose from "mongoose";

const videoProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true, index: true },
    topicId: { type: String, required: true, index: true },
    subjectId: { type: String, default: "", index: true },

    watchedSeconds: { type: Number, default: 0 },
    lastPosition: { type: Number, default: 0 }, // seconds (for "Continue from X:XX")
    completionPercentage: { type: Number, default: 0 }, // 0 to 100

    isCompleted: { type: Boolean, default: false }, // marked true when >= 90%
    completedAt: { type: Date },

    bookmarks: [
      {
        timestampSeconds: { type: Number, required: true },
        timeLabel: { type: String, required: true },
        note: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

videoProgressSchema.index({ user: 1, topicId: 1 }, { unique: true });
videoProgressSchema.index({ user: 1, videoId: 1 });

const VideoProgress = mongoose.model("VideoProgress", videoProgressSchema);
export default VideoProgress;

