import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  subject: { type: String, required: true }, // e.g. "DBMS", "DSA", "OS"
  topic: { type: String, required: true }, // e.g. "Normalization", "Indexing"
  questionText: { type: String, required: true },
  options: { type: [String], required: true }, // 4 options
  correctAnswerIndex: { type: Number, required: true }, // 0-3
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
});

const Question = mongoose.model("Question", questionSchema);
export default Question;
