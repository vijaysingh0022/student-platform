import { createRequire } from "module";
import { createWorker } from "tesseract.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

/**
 * Normalizes text for similarity and keyword matching
 */
export const normalizeText = (text = "") => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Extracts raw text from Buffer (PDF, Images, etc.)
 * Intelligently switches between direct text stream extraction and OCR.
 */
export async function extractTextFromBuffer(buffer, mimeType, filename = "") {
  const isPdf = mimeType.includes("pdf") || filename.toLowerCase().endsWith(".pdf");
  const isImage =
    mimeType.includes("image") ||
    filename.toLowerCase().endsWith(".png") ||
    filename.toLowerCase().endsWith(".jpg") ||
    filename.toLowerCase().endsWith(".jpeg");

  if (isPdf) {
    try {
      const data = await pdfParse(buffer);
      const text = (data.text || "").trim();
      const pageCount = data.numpages || 1;

      // If PDF has sufficient selectable text (at least 60 characters)
      if (text.length > 60) {
        return {
          text,
          pageCount,
          isOcrUsed: false,
          charCount: text.length,
        };
      }
      console.log(`PDF "${filename}" has sparse text (${text.length} chars). Falling back to OCR.`);
    } catch (pdfErr) {
      console.warn("pdf-parse encountered error, falling back to OCR if possible:", pdfErr.message);
    }
  }

  // If image or scanned PDF requiring OCR
  try {
    const worker = await createWorker("eng");
    const ret = await worker.recognize(buffer);
    await worker.terminate();

    return {
      text: (ret.data?.text || "").trim(),
      pageCount: 1,
      isOcrUsed: true,
      charCount: (ret.data?.text || "").length,
    };
  } catch (ocrErr) {
    console.error("OCR error during extraction:", ocrErr.message);
    throw new Error(`Failed to extract text via OCR: ${ocrErr.message}`);
  }
}

/**
 * Parses raw text into discrete university question blocks.
 * Handles AKTU / Indian University standard pattern:
 * - Section A: Q1 (a) to (j) [2 marks each]
 * - Section B: Q2 (a) to (e) [7 or 10 marks each]
 * - Section C: Q3, Q4, Q5, Q6, Q7 with (a) OR (b) internal choices
 */
export function parseRawTextIntoQuestions(rawText, defaultMarks = 2) {
  if (!rawText || rawText.length < 20) return [];

  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const questions = [];

  let currentSection = "Section A";
  let activeQuestion = null;

  // Regex patterns for section headers
  const sectionHeaderRegex = /^(?:SECTION|PART|GROUP)\s*[-:]?\s*([A-E1-5])/i;

  // Regex patterns for questions:
  // Examples:
  // "1. (a) Define Abstract Data Type."
  // "Q.1 a) Explain B-Tree."
  // "1(a) Differentiate between stack and queue."
  // "2. Attempt any three of the following:"
  // "(a) Construct AVL tree..."
  // "Q3. What is normalisation?"
  const qNumRegex =
    /^(?:Q(?:uestion)?\.?\s*)?(\d{1,2})\s*(?:[.)\s]|\((?:[a-z]|[0-9]+)\)|(?:[a-z]\)))/i;
  const subQRegex = /^\(?([a-jA-J]|\d{1,2})\)?\s*[\.\):\-]\s*(.*)$/;

  let runningQNumber = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check Section change
    const secMatch = line.match(sectionHeaderRegex);
    if (secMatch) {
      currentSection = `Section ${secMatch[1].toUpperCase()}`;
      continue;
    }

    // Skip university header noise and instructions
    if (
      line.match(/roll\s*no/i) ||
      line.match(/printed\s*pages/i) ||
      line.match(/paper\s*id/i) ||
      line.match(/total\s*marks/i) ||
      line.match(/time\s*:\s*\d/i) ||
      line.match(/b\.?\s*tech/i) ||
      line.match(/dr\.\s*a\.p\.j/i) ||
      line.match(/examination\s*\d/i) ||
      line.match(/semester\s*examination/i) ||
      line.match(/data\s*structures\s*&\s*algorithms\s*\(kcs/i) ||
      line.match(/attempt\s*(?:all|any)/i) ||
      line.match(/note\s*:\s*attempt/i)
    ) {
      continue;
    }

    // Check if line starts a question
    const qMatch = line.match(/^(?:Q\.?\s*)?(\d{1,2})\s*[\.\)]\s*(.*)$/i);
    const subMatch = line.match(/^[\(\[]?([a-jA-J])[\)\]\.]\s*(.*)$/);

    if (qMatch) {
      if (activeQuestion && activeQuestion.text.length > 5) {
        questions.push(finalizeQuestion(activeQuestion, defaultMarks));
      }
      const qNum = qMatch[1];
      const rest = qMatch[2] || "";
      activeQuestion = {
        number: `Q${qNum}`,
        section: currentSection,
        text: rest,
        marks: deriveMarksFromLine(line, currentSection),
      };
      runningQNumber = parseInt(qNum, 10) + 1;
    } else if (subMatch) {
      if (activeQuestion && activeQuestion.text.length > 5) {
        questions.push(finalizeQuestion(activeQuestion, defaultMarks));
      }
      const subLetter = subMatch[1].toLowerCase();
      const rest = subMatch[2] || "";
      const parentNum = activeQuestion ? activeQuestion.number.replace(/[a-z\(\)]/gi, "") : `Q${runningQNumber}`;
      activeQuestion = {
        number: `${parentNum}(${subLetter})`,
        section: currentSection,
        text: rest,
        marks: deriveMarksFromLine(line, currentSection),
      };
    } else if (activeQuestion) {
      // Continue appending text to the current question
      // Check if line indicates marks e.g. "(7 Marks)" or "[10]"
      const explicitMarks = line.match(/[\(\[]\s*(\d{1,2})\s*(?:marks?|m)?\s*[\)\]]$/i);
      if (explicitMarks) {
        activeQuestion.marks = parseInt(explicitMarks[1], 10);
      }
      activeQuestion.text += " " + line;
    } else if (line.length > 15 && !line.includes("===")) {
      // Freeform line without clear prefix
      activeQuestion = {
        number: `Q${runningQNumber}`,
        section: currentSection,
        text: line,
        marks: deriveMarksFromLine(line, currentSection),
      };
      runningQNumber++;
    }
  }

  if (activeQuestion && activeQuestion.text.length > 5) {
    questions.push(finalizeQuestion(activeQuestion, defaultMarks));
  }

  return questions.filter((q) => q.questionText && q.questionText.length > 8);
}

function deriveMarksFromLine(line, section) {
  const explicit = line.match(/[\(\[]\s*(\d{1,2})\s*(?:marks?|m)?\s*[\)\]]/i);
  if (explicit) {
    return parseInt(explicit[1], 10);
  }
  if (section.toLowerCase().includes("b") || section.toLowerCase().includes("c")) {
    return 7;
  }
  return 2;
}

function finalizeQuestion(rawObj, defaultMarks) {
  const cleanText = rawObj.text.replace(/\s+/g, " ").trim();
  const qType = detectQuestionType(cleanText);
  return {
    questionNumber: rawObj.number,
    section: rawObj.section,
    questionText: cleanText,
    marks: rawObj.marks || defaultMarks,
    questionType: qType,
    difficulty: deriveDifficulty(cleanText, rawObj.marks || defaultMarks),
  };
}

export function detectQuestionType(text) {
  const lower = text.toLowerCase();
  if (lower.match(/^(?:calculate|find|solve|evaluate|determine the value|for the following data)/i) || lower.match(/\b(?:eigenvalue|fifo|sjf|round robin|disk scheduling|b-tree insertion|avl rotation|dijkstra)\b/i)) {
    return "Numerical";
  }
  if (lower.match(/\b(?:derive|prove that|mathematical proof|induction)\b/i)) {
    return "Derivation";
  }
  if (lower.match(/\b(?:write a (?:program|c|c\+\+|python|java|function|algorithm)|code|pseudo-?code|implement)\b/i)) {
    return "Programming Question";
  }
  if (lower.match(/\b(?:draw|diagram|architecture|schematic|illustrate with diagram)\b/i)) {
    return "Diagram-based Question";
  }
  if (lower.match(/\b(?:case study|scenario|assume you are|real-world application)\b/i)) {
    return "Case-based Question";
  }
  if (lower.length < 80 || lower.match(/\b(?:define|what is|state|list|name)\b/i)) {
    return "Short Answer";
  }
  return "Long Answer";
}

function deriveDifficulty(text, marks) {
  if (marks >= 10 || text.toLowerCase().includes("design and analyze") || text.toLowerCase().includes("prove that")) {
    return "Hard";
  }
  if (marks >= 5 || text.length > 150) {
    return "Medium";
  }
  return "Easy";
}
