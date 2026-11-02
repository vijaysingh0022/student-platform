import mongoose from "mongoose";

const learningBookmarkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    itemType: { type: String, enum: ["topic", "subject", "concept", "note"], default: "topic" },
    itemId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    subjectId: { type: String, default: "" },
    subjectName: { type: String, default: "" },
    unitId: { type: String, default: "" },
    difficulty: { type: String, default: "Intermediate" },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

learningBookmarkSchema.index({ user: 1, itemId: 1 }, { unique: true });

const LearningBookmark = mongoose.model("LearningBookmark", learningBookmarkSchema);
export default LearningBookmark;
