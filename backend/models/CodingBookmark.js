import mongoose from "mongoose";

const codingBookmarkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    problemId: { type: String, required: true, index: true },
    problemTitle: { type: String, required: true },
    difficulty: { type: String, default: "Easy" },
    category: { type: String, default: "Algorithms" },
  },
  { timestamps: true }
);

codingBookmarkSchema.index({ user: 1, problemId: 1 }, { unique: true });

const CodingBookmark = mongoose.model("CodingBookmark", codingBookmarkSchema);
export default CodingBookmark;
