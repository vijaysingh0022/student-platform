import mongoose from "mongoose";

const topicQuestionSchema = new mongoose.Schema(
  {
    topicId: { type: String, required: true, index: true }, // e.g. "quick-sort", "binary-search"
    subjectId: { type: String, required: true, index: true },
    subtopic: { type: String, required: true, default: "Core Understanding" }, // e.g. "Partition Logic", "Complexity Analysis"
    questionText: { type: String, required: true },
    options: {
      type: [String],
      required: true,
      validate: [
        (val) => val.length === 4,
        "Question must have exactly 4 options",
      ],
    },
    correctAnswerIndex: { type: Number, required: true, min: 0, max: 3 },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    explanation: { type: String, default: "" },
    codeSnippet: { type: String, default: "" },
  },
  { timestamps: true }
);

const TopicQuestion = mongoose.model("TopicQuestion", topicQuestionSchema);
export default TopicQuestion;
