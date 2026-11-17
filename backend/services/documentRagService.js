import { createRequire } from "module";
import { getAIClient, getAIModel } from "../config/ai.js";
import zlib from "zlib";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

/**
 * Text normalization and sanitization
 */
export function sanitizeDocumentText(raw = "") {
  return raw
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[\r\t]+/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Extract text from PPTX by parsing XML slides from the zip buffer
 */
export function extractTextFromPptxBuffer(buffer) {
  try {
    const textPieces = [];
    let offset = 0;

    // Standard zip local file header signature: 0x04034b50 (PK\x03\x04)
    while (offset < buffer.length - 30) {
      if (
        buffer[offset] === 0x50 &&
        buffer[offset + 1] === 0x4b &&
        buffer[offset + 2] === 0x03 &&
        buffer[offset + 3] === 0x04
      ) {
        const compressionMethod = buffer.readUInt16LE(offset + 8);
        const compressedSize = buffer.readUInt32LE(offset + 18);
        const fileNameLength = buffer.readUInt16LE(offset + 26);
        const extraFieldLength = buffer.readUInt16LE(offset + 28);

        const fileName = buffer.toString(
          "utf8",
          offset + 30,
          offset + 30 + fileNameLength
        );
        const dataStart = offset + 30 + fileNameLength + extraFieldLength;
        const dataEnd = dataStart + compressedSize;

        // Slide XMLs contain slide content: ppt/slides/slide1.xml, etc.
        if (
          fileName.startsWith("ppt/slides/slide") &&
          fileName.endsWith(".xml") &&
          dataEnd <= buffer.length
        ) {
          const compressedData = buffer.slice(dataStart, dataEnd);
          let xmlStr = "";
          if (compressionMethod === 8) {
            // Deflated
            try {
              xmlStr = zlib.inflateRawSync(compressedData).toString("utf8");
            } catch (zErr) {
              // Try standard inflate
              try {
                xmlStr = zlib.inflateSync(compressedData).toString("utf8");
              } catch (e) {}
            }
          } else if (compressionMethod === 0) {
            // Stored
            xmlStr = compressedData.toString("utf8");
          }

          if (xmlStr) {
            // Extract text inside <a:t> tags
            const textMatches = xmlStr.match(/<a:t[^>]*>(.*?)<\/a:t>/gi);
            if (textMatches) {
              const slideText = textMatches
                .map((m) => m.replace(/<[^>]*>/g, ""))
                .join(" ");
              textPieces.push(slideText);
            }
          }
        }

        offset = dataEnd;
      } else {
        offset++;
      }
    }

    if (textPieces.length > 0) {
      return textPieces.join("\n\n");
    }
  } catch (err) {
    console.warn("PPTX zip parse warning:", err.message);
  }

  // Fallback to ASCII string extraction
  const ascii = buffer.toString("utf8", 0, Math.min(buffer.length, 500000));
  const matches = ascii.match(/[A-Za-z0-9\s.,!?:;()\-]{5,}/g);
  return matches ? matches.slice(0, 1000).join(" ") : "";
}

/**
 * Universal Document Text & Page Extractor
 * Supports: PDF, DOCX, PPT/PPTX, TXT
 */
export async function extractDocumentContent({ buffer, originalFilename, mimeType }) {
  const ext = originalFilename.split(".").pop().toLowerCase();
  let fullText = "";
  let pageCount = 1;
  const pageTexts = [];

  if (ext === "pdf" || mimeType.includes("pdf")) {
    const data = await pdfParse(buffer, {
      pagerender: (pageData) => {
        return pageData.getTextContent().then((textContent) => {
          let lastY, text = "";
          for (const item of textContent.items) {
            if (lastY === item.transform[5] || !lastY) {
              text += item.str + " ";
            } else {
              text += "\n" + item.str + " ";
            }
            lastY = item.transform[5];
          }
          pageTexts.push(text);
          return text;
        });
      },
    });
    fullText = sanitizeDocumentText(data.text || "");
    pageCount = Math.max(1, data.numpages || pageTexts.length || 1);
  } else if (ext === "docx" || mimeType.includes("wordprocessingml") || mimeType.includes("docx")) {
    const res = await mammoth.extractRawText({ buffer });
    fullText = sanitizeDocumentText(res.value || "");
    // Estimate page count: ~500 words per standard document page
    const words = fullText.split(/\s+/).filter(Boolean);
    pageCount = Math.max(1, Math.ceil(words.length / 500));
  } else if (ext === "pptx" || ext === "ppt" || mimeType.includes("presentation") || mimeType.includes("powerpoint")) {
    const pptxText = extractTextFromPptxBuffer(buffer);
    fullText = sanitizeDocumentText(pptxText);
    const slides = fullText.split(/\n\n+/).filter(Boolean);
    pageCount = Math.max(1, slides.length);
  } else if (ext === "txt" || mimeType.includes("text/plain")) {
    fullText = sanitizeDocumentText(buffer.toString("utf8"));
    const words = fullText.split(/\s+/).filter(Boolean);
    pageCount = Math.max(1, Math.ceil(words.length / 500));
  } else {
    // Attempt fallback utf8 read
    fullText = sanitizeDocumentText(buffer.toString("utf8"));
  }

  if (!fullText || fullText.length < 20) {
    throw new Error(
      `Could not extract legible text from "${originalFilename}". The document may be empty, image-only, or corrupted.`
    );
  }

  return {
    fullText,
    pageCount,
    pageTexts,
    charCount: fullText.length,
    wordCount: fullText.split(/\s+/).filter(Boolean).length,
  };
}

/**
 * Intelligent Semantic Chunking
 * Splits text into overlapping chunks (~400-600 tokens / 1800-2400 chars) with page mapping
 */
export function chunkDocumentText(fullText, pageCount = 1, pageTexts = []) {
  const chunks = [];
  const chunkSize = 2000; // characters
  const chunkOverlap = 300;

  // If per-page text is preserved (e.g. from PDF renderer), chunk per page
  if (pageTexts.length > 0) {
    let globalIndex = 0;
    pageTexts.forEach((pText, pIdx) => {
      const pNum = pIdx + 1;
      const clean = sanitizeDocumentText(pText);
      if (!clean) return;

      if (clean.length <= chunkSize) {
        chunks.push({
          chunkIndex: globalIndex++,
          pageNumber: pNum,
          text: clean,
          tokenEstimate: Math.round(clean.length / 4),
          keyTerms: extractKeyTerms(clean),
        });
      } else {
        let start = 0;
        while (start < clean.length) {
          const end = Math.min(clean.length, start + chunkSize);
          const piece = clean.slice(start, end);
          chunks.push({
            chunkIndex: globalIndex++,
            pageNumber: pNum,
            text: piece,
            tokenEstimate: Math.round(piece.length / 4),
            keyTerms: extractKeyTerms(piece),
          });
          start += chunkSize - chunkOverlap;
        }
      }
    });

    if (chunks.length > 0) return chunks;
  }

  // Otherwise, partition full text and map proportional page numbers
  const totalLength = fullText.length;
  let start = 0;
  let chunkIdx = 0;

  while (start < totalLength) {
    let end = Math.min(totalLength, start + chunkSize);
    // Find next paragraph or sentence boundary near end
    if (end < totalLength) {
      const boundary = fullText.lastIndexOf("\n\n", end);
      if (boundary > start + 800) {
        end = boundary;
      } else {
        const sentenceBoundary = fullText.lastIndexOf(". ", end);
        if (sentenceBoundary > start + 800) {
          end = sentenceBoundary + 1;
        }
      }
    }

    const chunkContent = fullText.slice(start, end).trim();
    if (chunkContent.length > 30) {
      const proportionalPage = Math.min(
        pageCount,
        Math.max(1, Math.round(((start + end) / (2 * totalLength)) * pageCount))
      );

      chunks.push({
        chunkIndex: chunkIdx++,
        pageNumber: proportionalPage,
        text: chunkContent,
        tokenEstimate: Math.round(chunkContent.length / 4),
        keyTerms: extractKeyTerms(chunkContent),
      });
    }

    start += chunkSize - chunkOverlap;
  }

  return chunks;
}

/**
 * Keyword extraction helper
 */
export function extractKeyTerms(text = "") {
  const stopWords = new Set([
    "the", "and", "for", "that", "this", "with", "from", "have", "are",
    "will", "which", "into", "their", "about", "what", "when", "where",
    "these", "can", "also", "using", "between", "than", "more", "each"
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !stopWords.has(w));

  const freq = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w);
}

/**
 * Compute semantic embedding for text using OpenAI Embeddings API (if available)
 */
export async function generateTextEmbedding(text) {
  try {
    const openai = getAIClient();
    if (!openai || typeof openai.embeddings?.create !== "function") {
      return null;
    }
    const res = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text.slice(0, 4000),
    });
    return res.data[0]?.embedding || null;
  } catch (err) {
    // If embedding API fails or key is Claude/OpenRouter, graceful fallback
    return null;
  }
}

/**
 * Calculate cosine similarity between two numeric vectors
 */
export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * BM25 / TF-IDF hybrid lexical scoring
 */
export function lexicalRelevanceScore(query = "", chunkText = "", keyTerms = []) {
  const queryTerms = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3);

  if (queryTerms.length === 0) return 0;

  const target = chunkText.toLowerCase();
  let hits = 0;
  let exactMatchBonus = 0;

  if (target.includes(query.toLowerCase().trim())) {
    exactMatchBonus = 2.5;
  }

  for (const term of queryTerms) {
    const count = (target.match(new RegExp(`\\b${term}\\b`, "g")) || []).length;
    if (count > 0) {
      hits += 1 + Math.log(count + 1);
    }
    if (keyTerms.includes(term)) {
      hits += 1.2;
    }
  }

  return (hits / queryTerms.length) + exactMatchBonus;
}

/**
 * High-performance RAG Semantic Retrieval
 * Retrieves top-K most relevant chunks using Vector Cosine Similarity + Hybrid Lexical Score
 */
export async function retrieveRelevantChunks({ query, chunks = [], topK = 4 }) {
  if (!chunks || chunks.length === 0) return [];

  // Attempt query embedding
  const queryEmbedding = await generateTextEmbedding(query);

  const scored = chunks.map((chunk) => {
    let vectorScore = 0;
    if (queryEmbedding && chunk.embedding && chunk.embedding.length > 0) {
      vectorScore = cosineSimilarity(queryEmbedding, chunk.embedding);
    }

    const lexicalScore = lexicalRelevanceScore(query, chunk.text, chunk.keyTerms || []);
    // Combined hybrid score (vector weights 0.65, lexical weights 0.35)
    const combinedScore = vectorScore > 0 ? vectorScore * 0.65 + Math.min(1, lexicalScore / 5) * 0.35 : lexicalScore;

    return {
      chunk,
      score: combinedScore,
      vectorScore,
      lexicalScore,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
