import LearnedDocument from "../models/LearnedDocument.js";
import { getAIClient, getAIModel } from "../config/ai.js";
import {
  extractDocumentContent,
  chunkDocumentText,
  generateTextEmbedding,
  retrieveRelevantChunks,
} from "../services/documentRagService.js";

/**
 * @desc Upload document, extract text, chunk and generate semantic vectors
 * @route POST /api/documents/upload
 */
export const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const userId = req.user._id;
    const originalFilename = file.originalname || "Uploaded-Document";
    const mimeType = file.mimetype || "application/octet-stream";
    const fileSize = file.size || file.buffer.length;
    const fileExtension = originalFilename.split(".").pop().toLowerCase();

    // Security & file type validation
    const allowedExtensions = ["pdf", "docx", "pptx", "ppt", "txt"];
    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported file extension (.${fileExtension}). Supported types: PDF, DOCX, PPT, PPTX, TXT.`,
      });
    }

    // Maximum file size: 25MB
    if (fileSize > 25 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "File exceeds maximum upload size limit (25MB).",
      });
    }

    // Create preliminary document in DB with 'processing' status
    const docTitle = originalFilename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    const document = await LearnedDocument.create({
      user: userId,
      title: docTitle,
      originalFilename,
      fileSize,
      mimeType,
      fileExtension,
      status: "processing",
    });

    // Asynchronous / in-flow processing: Extract text
    try {
      const { fullText, pageCount, pageTexts, charCount, wordCount } =
        await extractDocumentContent({
          buffer: file.buffer,
          originalFilename,
          mimeType,
        });

      // Semantic chunking
      const rawChunks = chunkDocumentText(fullText, pageCount, pageTexts);

      // Embed chunks (vector search ready)
      const chunksWithEmbeddings = [];
      for (const ch of rawChunks) {
        // Embed first 20 chunks to balance latency and vector depth
        let embedding = [];
        if (chunksWithEmbeddings.length < 20) {
          try {
            embedding = await generateTextEmbedding(ch.text);
          } catch (e) {
            embedding = [];
          }
        }
        chunksWithEmbeddings.push({
          ...ch,
          embedding: embedding || [],
        });
      }

      // Generate brief high-level summary & detected subject
      let summary = "";
      let detectedSubject = "Computer Science";
      let keyTopics = [];

      try {
        const openai = getAIClient();
        const model = getAIModel();
        if (openai) {
          const sample = fullText.slice(0, 3000);
          const prompt = `Analyze this student study document excerpt and output a clean JSON overview:
Excerpt:
"${sample}"

Output format:
{
  "summary": "2-3 concise sentences summarizing this document",
  "detectedSubject": "Subject domain (e.g. DBMS, Operating Systems, DSA, Networks, Machine Learning, Web Dev)",
  "keyTopics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4"]
}`;
          const completion = await openai.chat.completions.create({
            model,
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
          });

          const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
          summary = parsed.summary || "";
          detectedSubject = parsed.detectedSubject || "Computer Science";
          keyTopics = parsed.keyTopics || [];
        }
      } catch (sumErr) {
        summary = fullText.slice(0, 250) + "...";
      }

      document.pageCount = pageCount;
      document.charCount = charCount;
      document.wordCount = wordCount;
      document.detectedSubject = detectedSubject;
      document.summary = summary;
      document.keyTopics = keyTopics;
      document.chunks = chunksWithEmbeddings;
      document.status = "ready";
      await document.save();

      return res.status(201).json({
        success: true,
        document: {
          _id: document._id,
          title: document.title,
          originalFilename: document.originalFilename,
          fileSize: document.fileSize,
          pageCount: document.pageCount,
          charCount: document.charCount,
          wordCount: document.wordCount,
          detectedSubject: document.detectedSubject,
          summary: document.summary,
          keyTopics: document.keyTopics,
          status: document.status,
          createdAt: document.createdAt,
        },
      });
    } catch (processError) {
      document.status = "failed";
      document.errorMessage = processError.message;
      await document.save();
      throw processError;
    }
  } catch (error) {
    console.error("Upload Document Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get all documents uploaded by current student
 * @route GET /api/documents
 */
export const getMyDocuments = async (req, res) => {
  try {
    const userId = req.user._id;
    const documents = await LearnedDocument.find({ user: userId, isArchived: false })
      .select("title originalFilename fileSize mimeType fileExtension pageCount charCount wordCount detectedSubject summary keyTopics status createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get a single document with chunks preview, study materials and chat history
 * @route GET /api/documents/:id
 */
export const getDocumentDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const document = await LearnedDocument.findOne({ _id: req.params.id, user: userId });

    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found or access denied." });
    }

    res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Delete document and its associated vector chunks
 * @route DELETE /api/documents/:id
 */
export const deleteDocument = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await LearnedDocument.findOneAndDelete({ _id: req.params.id, user: userId });

    if (!result) {
      return res.status(404).json({ success: false, message: "Document not found or access denied." });
    }

    res.status(200).json({
      success: true,
      message: "Document, chunks, and vector embeddings deleted permanently.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc RAG-powered interactive chat grounded in the uploaded document
 * @route POST /api/documents/:id/chat
 */
export const chatWithDocument = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: "Please provide a question." });
    }

    const userId = req.user._id;
    const document = await LearnedDocument.findOne({ _id: req.params.id, user: userId });

    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found or access denied." });
    }

    // 1. Semantic retrieval of top-K chunks
    const retrieved = await retrieveRelevantChunks({
      query: question,
      chunks: document.chunks || [],
      topK: 4,
    });

    const citations = retrieved.map((item) => ({
      pageNumber: item.chunk.pageNumber || 1,
      snippet: item.chunk.text.slice(0, 240) + "...",
      documentName: document.title,
    }));

    // Build context block from retrieved passages
    const contextBlock = retrieved
      .map(
        (item, idx) =>
          `[Source ${idx + 1} | Page ${item.chunk.pageNumber}]:\n${item.chunk.text}`
      )
      .join("\n\n---\n\n");

    const openai = getAIClient();
    const model = getAIModel();

    let answer = "";
    let isGrounded = true;

    if (!openai) {
      // Fallback
      answer = `Based on your document "${document.title}", here are the key passages addressing your query:\n\n${citations.map((c) => `• [Page ${c.pageNumber}]: "${c.snippet}"`).join("\n")}`;
    } else {
      const systemPrompt = `You are LearnX Document Intelligence Copilot.
You answer students' questions STRICTLY based on the provided document passages.
Rules:
1. Always cite exact page numbers when referencing facts (e.g. "[Page 2]").
2. If the user asks in Hinglish (e.g. "Explain this in Hinglish"), answer in natural, friendly Hinglish with technical accuracy.
3. If the answer cannot be supported by or deduced from the provided document context, explicitly inform the student: "I could not find information about this in the uploaded document." Do not hallucinate or make up outside facts.
4. Keep explanations structured, crystal-clear, and academic.`;

      const userPrompt = `Document: "${document.title}" (${document.detectedSubject})

EXTRACTED CONTEXT PASSAGES:
${contextBlock}

STUDENT QUESTION:
"${question}"

Provide a detailed, helpful, and grounded response with explicit page citations:`;

      const completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3, // Lower temperature for grounded factual accuracy
      });

      answer = completion.choices[0]?.message?.content || "";
      if (answer.toLowerCase().includes("could not find information about this in the uploaded document")) {
        isGrounded = false;
      }
    }

    // Save to document chat history
    document.chatHistory.push({
      role: "user",
      content: question,
    });
    document.chatHistory.push({
      role: "assistant",
      content: answer,
      citations,
      isGrounded,
    });

    await document.save();

    res.status(200).json({
      success: true,
      answer,
      citations,
      isGrounded,
    });
  } catch (error) {
    console.error("Document Chat Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Generate structured AI study materials (short notes, MCQs, flashcards, etc.)
 * @route POST /api/documents/:id/generate
 */
export const generateStudyMaterial = async (req, res) => {
  try {
    const {
      type, // "short_notes" | "detailed_notes" | "important_questions" | "mcqs" | "flashcards" | "chapter_summary" | "revision_sheet" | "practice_test" | "concept_explanation"
      topicOrQuery = "",
    } = req.body;

    const userId = req.user._id;
    const document = await LearnedDocument.findOne({ _id: req.params.id, user: userId });

    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found or access denied." });
    }

    // Retrieve context chunks
    let relevantChunks = document.chunks || [];
    if (topicOrQuery.trim()) {
      const retrieved = await retrieveRelevantChunks({
        query: topicOrQuery,
        chunks: document.chunks || [],
        topK: 6,
      });
      relevantChunks = retrieved.map((r) => r.chunk);
    } else {
      // Sample evenly across document
      relevantChunks = (document.chunks || []).slice(0, 8);
    }

    const contextText = relevantChunks.map((c) => `[Page ${c.pageNumber}]: ${c.text}`).join("\n\n");

    const openai = getAIClient();
    const model = getAIModel();

    if (!openai) {
      return res.status(503).json({
        success: false,
        message: "AI provider is not configured. Please verify OPENAI_API_KEY.",
      });
    }

    let prompt = "";
    let expectedFormat = "json_object";

    if (type === "mcqs" || type === "practice_test") {
      prompt = `Generate 5 high-yield multiple-choice assessment questions grounded strictly in this text:
"${contextText}"

Respond ONLY in JSON format:
{
  "title": "5 Practice MCQs: ${document.title}",
  "questions": [
    {
      "questionText": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswerIndex": 0,
      "pageCitation": 1,
      "explanation": "..."
    }
  ]
}`;
    } else if (type === "flashcards") {
      prompt = `Generate 6 interactive active recall flashcards from this document text:
"${contextText}"

Respond ONLY in JSON format:
{
  "title": "Key Concept Flashcards: ${document.title}",
  "flashcards": [
    {
      "front": "Question or Key Term",
      "back": "Clear concise answer or definition",
      "pageCitation": 1,
      "category": "Core Concept"
    }
  ]
}`;
    } else if (type === "short_notes" || type === "revision_sheet") {
      prompt = `Synthesize a high-impact revision sheet with bullet points, key equations/theorems, and exam tips from this text:
"${contextText}"

Respond ONLY in JSON format:
{
  "title": "High-Yield Revision Sheet: ${document.title}",
  "overview": "Short summary",
  "bulletPoints": [
    { "concept": "Concept name", "keyTakeaway": "Takeaway", "pageCitation": 1 }
  ],
  "examTips": ["Tip 1", "Tip 2"]
}`;
    } else {
      // detailed notes, chapter summary, important questions, concept explanation
      prompt = `Generate a structured, in-depth academic study guide (${type.replace("_", " ")}) based on this document:
"${contextText}"

Respond ONLY in JSON format:
{
  "title": "${type.replace("_", " ").toUpperCase()}: ${document.title}",
  "sections": [
    {
      "heading": "Section Heading",
      "pageCitation": 1,
      "content": "Comprehensive markdown explanation with definitions and bullet points"
    }
  ],
  "keyTakeaways": ["Takeaway 1", "Takeaway 2"]
}`;
    }

    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: expectedFormat },
      temperature: 0.4,
    });

    const parsedContent = JSON.parse(completion.choices[0]?.message?.content || "{}");

    // Persist to document study materials
    const newMaterial = {
      type,
      title: parsedContent.title || `${type.replace("_", " ").toUpperCase()}`,
      content: parsedContent,
      sourceCitations: relevantChunks.map((c) => ({
        pageNumber: c.pageNumber,
        snippet: c.text.slice(0, 150) + "...",
      })),
    };

    document.studyMaterials.push(newMaterial);
    await document.save();

    res.status(200).json({
      success: true,
      material: newMaterial,
    });
  } catch (error) {
    console.error("Generate Study Material Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
