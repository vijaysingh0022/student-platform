import mongoose from "mongoose";

const userNoteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    topicId: { type: String, required: true, index: true },
    title: { type: String, default: "Personal Note" },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

const UserNote = mongoose.model("UserNote", userNoteSchema);
export default UserNote;
