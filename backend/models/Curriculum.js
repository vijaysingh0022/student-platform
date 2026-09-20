import mongoose from "mongoose";

// ─── 1. SUBJECT SCHEMA ───────────────────────────────────────────────────────
const subjectSchema = new mongoose.Schema(
  {
    subjectId: { type: String, required: true, unique: true, index: true }, // e.g. "dsa", "dbms", "os", "cn", "oops", "system-design", "web-dev", "aptitude"
    name: { type: String, required: true }, // e.g. "Data Structures & Algorithms"
    code: { type: String, default: "" }, // e.g. "CS201"
    description: { type: String, default: "" },
    icon: { type: String, default: "📚" },
    badge: { type: String, default: "Core CSE" },
    color: { type: String, default: "from-blue-600 to-indigo-600" },
    accentColor: { type: String, default: "#3b82f6" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ─── 2. UNIT SCHEMA ──────────────────────────────────────────────────────────
const unitSchema = new mongoose.Schema(
  {
    unitId: { type: String, required: true, unique: true, index: true }, // e.g. "dsa-u1"
    subjectId: { type: String, required: true, index: true }, // e.g. "dsa"
    unitNumber: { type: Number, required: true },
    title: { type: String, required: true }, // e.g. "Unit 1 — Introduction & Complexity Analysis"
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── 3. CHAPTER SCHEMA ───────────────────────────────────────────────────────
const chapterSchema = new mongoose.Schema(
  {
    chapterId: { type: String, required: true, unique: true, index: true }, // e.g. "dsa-u2-c1"
    unitId: { type: String, required: true, index: true },
    subjectId: { type: String, required: true, index: true },
    chapterNumber: { type: Number, required: true },
    title: { type: String, required: true }, // e.g. "Searching & Sorting Algorithms"
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── 4. TOPIC SCHEMA ─────────────────────────────────────────────────────────
const codeSnippetSchema = new mongoose.Schema({
  language: { type: String, required: true }, // "cpp" | "java" | "python" | "javascript" | "sql"
  title: { type: String, default: "" },
  code: { type: String, required: true },
  explanation: { type: String, default: "" },
});

const topicContentSchema = new mongoose.Schema({
  introduction: { type: String, default: "" },
  concepts: { type: [String], default: [] },
  explanationMarkdown: { type: String, default: "" },
  importantPoints: { type: [String], default: [] },
  examples: { type: [String], default: [] },
  algorithmSteps: { type: [String], default: [] },
  codeSnippets: [codeSnippetSchema],
  timeComplexity: { type: String, default: "O(N)" },
  spaceComplexity: { type: String, default: "O(1)" },
  keyTakeaways: { type: [String], default: [] },
  commonMistakes: { type: [String], default: [] },
  relatedTopics: { type: [String], default: [] },
});

const topicSchema = new mongoose.Schema(
  {
    topicId: { type: String, required: true, unique: true, index: true }, // e.g. "quick-sort", "binary-search"
    chapterId: { type: String, required: true, index: true },
    unitId: { type: String, required: true, index: true },
    subjectId: { type: String, required: true, index: true },
    topicNumber: { type: Number, required: true },
    title: { type: String, required: true }, // e.g. "Quick Sort"
    estimatedMinutes: { type: Number, default: 20 },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Intermediate" },
    summary: { type: String, default: "" },
    subtopics: { type: [String], default: [] }, // e.g. ["Partition Logic", "Pivot Selection", "Worst-case Complexity", "Space Complexity"]
    content: { type: topicContentSchema, default: () => ({}) },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Subject = mongoose.model("Subject", subjectSchema);
export const Unit = mongoose.model("Unit", unitSchema);
export const Chapter = mongoose.model("Chapter", chapterSchema);
export const Topic = mongoose.model("Topic", topicSchema);
