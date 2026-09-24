import mongoose from "mongoose";

// ─── 1. SUBJECT SCHEMA ───────────────────────────────────────────────────────
const subjectSchema = new mongoose.Schema(
  {
    subjectId: { type: String, required: true, unique: true, index: true }, // e.g. "dsa", "dbms", "os", "cn", "oops", "system-design", "aptitude", "web-dev", "ml-ai"
    name: { type: String, required: true }, // e.g. "Data Structures & Algorithms"
    code: { type: String, default: "" }, // e.g. "CS201"
    description: { type: String, default: "" },
    icon: { type: String, default: "📚" },
    badge: { type: String, default: "Core CSE" },
    color: { type: String, default: "from-blue-600 to-indigo-600" },
    accentColor: { type: String, default: "#0284c7" },
    semester: { type: Number, default: 3, index: true }, // Semesters 1 to 8
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Intermediate" },
    estimatedHours: { type: Number, default: 45 },
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
    title: { type: String, required: true }, // e.g. "Unit 1 — Introduction & Algorithm Analysis"
    description: { type: String, default: "" },
    learningObjectives: { type: [String], default: [] },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Intermediate" },
    estimatedHours: { type: Number, default: 3 },
    prerequisites: { type: [String], default: [] },
    practiceQuestionsCount: { type: Number, default: 10 },
    quizQuestionsCount: { type: Number, default: 10 },
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

const interviewQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  companyTags: { type: [String], default: [] },
});

const practiceProblemSchema = new mongoose.Schema({
  id: { type: String, default: "" },
  question: { type: String, required: true },
  difficulty: { type: String, default: "Medium" },
  hint: { type: String, default: "" },
  solution: { type: String, default: "" },
});

const mcqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctIndex: { type: Number, required: true },
  explanation: { type: String, default: "" },
});

const importantQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  marks: { type: Number, default: 5 },
  answer: { type: String, required: true },
});

const pyqSchema = new mongoose.Schema({
  year: { type: String, default: "GATE 2023" },
  exam: { type: String, default: "GATE / University" },
  marks: { type: Number, default: 2 },
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const dryRunRowSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  line: { type: String, default: "" },
  state: { type: String, default: "" },
  explanation: { type: String, default: "" },
});

const codingPracticeSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  problemStatement: { type: String, default: "" },
  constraints: { type: String, default: "" },
  sampleInput: { type: String, default: "" },
  sampleOutput: { type: String, default: "" },
  starterCode: { type: String, default: "" },
  solutionCode: { type: String, default: "" },
});

const topicContentSchema = new mongoose.Schema({
  introduction: { type: String, default: "" },
  simpleExplanation: { type: String, default: "" },
  shortExplanation: { type: String, default: "" },
  detailedExplanation: { type: String, default: "" },
  realWorldExample: { type: String, default: "" },
  concepts: { type: [String], default: [] },
  explanationMarkdown: { type: String, default: "" },
  importantPoints: { type: [String], default: [] },
  examples: { type: [String], default: [] },
  algorithmSteps: { type: [String], default: [] },
  visualDiagram: { type: String, default: "" },
  codeSnippets: [codeSnippetSchema],
  timeComplexity: { type: String, default: "O(1)" },
  spaceComplexity: { type: String, default: "O(1)" },
  dryRunSteps: { type: [String], default: [] },
  dryRunTable: [dryRunRowSchema],
  keyTakeaways: { type: [String], default: [] },
  commonMistakes: { type: [String], default: [] },
  examNotes: { type: [String], default: [] },
  importantQuestions: [importantQuestionSchema],
  pyqs: [pyqSchema],
  interviewQuestions: [interviewQuestionSchema],
  practiceQuestions: [practiceProblemSchema],
  codingPractice: { type: codingPracticeSchema, default: () => ({}) },
  mcqs: [mcqSchema],
  relatedTopics: { type: [String], default: [] },
});

const topicSchema = new mongoose.Schema(
  {
    topicId: { type: String, required: true, unique: true, index: true }, // e.g. "binary-search", "avl-tree"
    chapterId: { type: String, required: true, index: true },
    unitId: { type: String, required: true, index: true },
    subjectId: { type: String, required: true, index: true },
    topicNumber: { type: Number, required: true },
    title: { type: String, required: true },
    estimatedMinutes: { type: Number, default: 20 },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Intermediate" },
    summary: { type: String, default: "" },
    subtopics: { type: [String], default: [] },
    content: { type: topicContentSchema, default: () => ({}) },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ─── 5. UNIT DYNAMIC ROADMAP SCHEMA ──────────────────────────────────────────
const unitRoadmapDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  topicIds: { type: [String], default: [] },
  topicTitles: { type: [String], default: [] },
  practiceCount: { type: Number, default: 5 },
  focusArea: { type: String, default: "" },
  isCompleted: { type: Boolean, default: false },
});

const unitRoadmapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    unitId: { type: String, required: true, index: true },
    subjectId: { type: String, required: true, index: true },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    dailyMinutes: { type: Number, default: 60 },
    totalDays: { type: Number, default: 5 },
    days: [unitRoadmapDaySchema],
    status: { type: String, enum: ["active", "completed"], default: "active" },
  },
  { timestamps: true }
);

export const Subject = mongoose.model("Subject", subjectSchema);
export const Unit = mongoose.model("Unit", unitSchema);
export const Chapter = mongoose.model("Chapter", chapterSchema);
export const Topic = mongoose.model("Topic", topicSchema);
export const UnitRoadmap = mongoose.model("UnitRoadmap", unitRoadmapSchema);
