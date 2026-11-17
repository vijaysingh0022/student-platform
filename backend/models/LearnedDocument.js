import mongoose from "mongoose";

const documentChunkSchema = new mongoose.Schema(
  {
    chunkIndex: { type: Number, required: true },
    pageNumber: { type: Number, default: 1 },
    text: { type: String, required: true },
    cleanText: { type: String, default: "" },
    tokenEstimate: { type: Number, default: 0 },
    embedding: { type: [Number], default: [] }, // 1536-dim vector for embeddings
    keyTerms: [{ type: String }],
    sectionHeading: { type: String, default: "" },
  },
  { _id: true }
);

const studyMaterialItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "short_notes",
        "detailed_notes",
        "important_questions",
        "mcqs",
        "flashcards",
        "chapter_summary",
        "revision_sheet",
        "practice_test",
        "concept_explanation",
      ],
      required: true,
    },
    title: { type: String, required: true },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    sourceCitations: [
      {
        pageNumber: Number,
        snippet: String,
        relevance: String,
      },
    ],
    generatedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const documentChatMessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    citations: [
      {
        pageNumber: Number,
        snippet: String,
        documentName: String,
      },
    ],
    confidenceScore: { type: Number, default: 1.0 },
    isGrounded: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
);

const learnedDocumentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    originalFilename: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    fileExtension: { type: String, required: true },
    
    // Status tracking
    status: {
      type: String,
      enum: ["uploading", "processing", "ready", "failed"],
      default: "processing",
      index: true,
    },
    errorMessage: { type: String, default: "" },

    // Extraction metadata
    pageCount: { type: Number, default: 1 },
    charCount: { type: Number, default: 0 },
    wordCount: { type: Number, default: 0 },
    detectedSubject: { type: String, default: "General" },
    summary: { type: String, default: "" },
    keyTopics: [{ type: String }],

    // RAG Chunks
    chunks: [documentChunkSchema],

    // Generated Study Materials (Short notes, detailed notes, MCQs, flashcards, etc.)
    studyMaterials: [studyMaterialItemSchema],

    // In-document AI Chat History
    chatHistory: [documentChatMessageSchema],

    // Optional tags / category
    tags: [{ type: String }],
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

learnedDocumentSchema.index({ user: 1, createdAt: -1 });
learnedDocumentSchema.index({ user: 1, status: 1 });

const LearnedDocument = mongoose.model("LearnedDocument", learnedDocumentSchema);
export default LearnedDocument;
