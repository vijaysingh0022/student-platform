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
 * Cleans raw OCR/PDF text by stripping HTML tags, <br>, formatting entities,
 * and page-footer artifacts (such as website watermarks, roll numbers, print timestamps).
 */
export const sanitizeRawText = (raw = "") => {
  return raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&nbsp;/gi, " ")
    .replace(/[\r\t]+/g, " ")
    .replace(/[ ]{2,}/g, " ")
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
      const text = sanitizeRawText(data.text || "");
      const pageCount = data.numpages || 1;

      // Check if text is legible and has meaningful English words
      const words = text.split(/\s+/).filter((w) => w.length >= 3);
      if (words.length >= 35) {
        return {
          text,
          pageCount,
          isOcrUsed: false,
          charCount: text.length,
        };
      }
      console.log(`PDF "${filename}" has sparse/unreadable text (${words.length} words). Invoking OCR worker.`);
    } catch (pdfErr) {
      console.warn("pdf-parse encountered error, falling back to OCR if possible:", pdfErr.message);
    }
  }

  // If image or scanned PDF requiring OCR
  try {
    const worker = await createWorker("eng");
    const ret = await worker.recognize(buffer);
    await worker.terminate();

    const text = sanitizeRawText(ret.data?.text || "");
    return {
      text,
      pageCount: 1,
      isOcrUsed: true,
      charCount: text.length,
    };
  } catch (ocrErr) {
    console.error("OCR error during extraction:", ocrErr.message);
    throw new Error(`Failed to extract text via OCR: ${ocrErr.message}`);
  }
}

/**
 * Parses raw text into discrete university question blocks.
 * Supports both line-by-line indexed papers AND tokenized/scanned papers where questions
 * are inline with OCR tags (<br>, CO codes, K-levels).
 */
export function parseRawTextIntoQuestions(rawText, defaultMarks = 2) {
  if (!rawText || rawText.length < 20) return [];

  const cleanText = sanitizeRawText(rawText);
  const questions = [];

  // First, try standard line-by-line parsing if distinct question headers exist
  const lines = cleanText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  let currentSection = "Section A";
  let activeQuestion = null;

  const sectionHeaderRegex = /^(?:SECTION|PART|GROUP)\s*[-:]?\s*([A-E1-5])/i;
  const standardQRegex = /^(?:Q(?:uestion)?\.?\s*)?(\d{1,2})\s*(?:[.)\s]|\((?:[a-z]|[0-9]+)\)|(?:[a-z]\)))/i;
  const subQRegex = /^[\(\[]?([a-jA-J]|\d{1,2})[\)\]\.]\s*(.*)$/;

  let standardFoundCount = 0;
  for (const line of lines) {
    if (
      !isAdministrativeNoise(line) &&
      (line.match(/^(?:Q\.?\s*)?\d{1,2}\s*[\.\)]\s*[A-Z]/i) ||
        line.match(/^[\(\[]?[a-jA-J][\)\]\.]\s*[A-Z]/))
    ) {
      standardFoundCount++;
    }
  }

  // If at least 6 questions cleanly matched standard start-of-line numbering with text
  if (standardFoundCount >= 6) {
    let runningQNumber = 1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      const secMatch = line.match(sectionHeaderRegex);
      if (secMatch) {
        currentSection = `Section ${secMatch[1].toUpperCase()}`;
        continue;
      }

      if (isAdministrativeNoise(line)) continue;

      const qMatch = line.match(/^(?:Q\.?\s*)?(\d{1,2})\s*[\.\)]\s*(.*)$/i);
      const subMatch = line.match(/^[\(\[]?([a-jA-J])[\)\]\.]\s*(.*)$/);

      if (qMatch) {
        if (activeQuestion && activeQuestion.text.length > 5) {
          questions.push(finalizeQuestion(activeQuestion, defaultMarks));
        }
        const qNum = qMatch[1];
        activeQuestion = {
          number: `Q${qNum}`,
          section: currentSection,
          text: qMatch[2] || "",
          marks: deriveMarksFromLine(line, currentSection),
        };
        runningQNumber = parseInt(qNum, 10) + 1;
      } else if (subMatch) {
        if (activeQuestion && activeQuestion.text.length > 5) {
          questions.push(finalizeQuestion(activeQuestion, defaultMarks));
        }
        const subLetter = subMatch[1].toLowerCase();
        const parentNum = activeQuestion ? activeQuestion.number.replace(/[a-z\(\)]/gi, "") : `Q${runningQNumber}`;
        activeQuestion = {
          number: `${parentNum}(${subLetter})`,
          section: currentSection,
          text: subMatch[2] || "",
          marks: deriveMarksFromLine(line, currentSection),
        };
      } else if (activeQuestion) {
        activeQuestion.text += " " + line;
      }
    }

    if (activeQuestion && activeQuestion.text.length > 5) {
      questions.push(finalizeQuestion(activeQuestion, defaultMarks));
    }

    if (questions.length >= 4) {
      return questions;
    }
  }

  // ── SECOND PASS: TOKENIZED STREAM EXTRACTION (For Scanned/OCR AKTU Papers) ──
  // When text is flattened or separated by table delimiters
  const flattened = cleanText
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Split by common Indian university question starter triggers or terminal question marks
  const boundaryPattern =
    /(?:(?<=[?.!])\s+(?=[A-Z0-9(])|(?=\b(?:SECTION\s+[A-C]|Attempt\s+any|Qucstion|Question)\b)|(?=\b(?:Explain|Illustrate|Construct|Demonstrate|Evaluate|Differentiate|What\s+is|Define|Write\s+a|Discuss|Compare|If\s+an?\s+array|The\s+following\s+sequence|Insert\s+values)\b))/gi;

  const chunks = flattened.split(boundaryPattern);
  let sec = "Section A";
  let qNum = 1;

  for (let chunk of chunks) {
    let t = chunk.trim();
    if (!t) continue;

    if (t.match(/\bSECTION\s+B\b/i)) {
      sec = "Section B";
    } else if (t.match(/\bSECTION\s+C\b/i)) {
      sec = "Section C";
    }

    // Strip header prefixes and OCR metadata tags
    t = t
      .replace(
        /^(?:SECTION\s+[A-C]|Attempt\s+(?:all|any)[^.:]*[.:]|Note:[^.:]*[.:]|PAPER\s+ID[^.:]*|Roll\s+No[^.:]*|\(SEM[^)]*\)|THEORY\s+EXAMINATION[^.:]*|DATA\s+STRUCTURE|BTECH|Qucstion|Printed\s+Page[^.:]*|Subj?ect\s+Code[^.:]*|M\.MARKS[^.:]*|\d+\s*x\s*\d+\s*=\s*\d+|CO\d*|Level\s*K\d*|K\d+|By\s+Notesgallery[^.:]*|Free\s+Educational[^.:]*|[0-9]{2}-[A-Za-z]{3}-[0-9]{4}[^.:]*)+/gi,
        ""
      )
      .trim();

    // Strip trailing OCR watermarks & course outcomes
    t = t
      .replace(
        /(?:Printed\s+Page:.*|By\s+Notesgallery.*|Free\s+Educational.*|M\.MARKS:.*|\bCO\s*\d\b.*|\bLevel\s*K\d.*|\bQP25DP2\b.*)$/gi,
        ""
      )
      .trim();

    const isQuestionVerb = t.match(
      /^(?:Explain|Illustrate|Construct|Demonstrate|Evaluate|Differentiate|What\s+is|Define|Write|Discuss|Compare|If\s+an?\s+array|The\s+following|Insert|Show|Prove|Find|Calculate|State|Describe)/i
    );
    const hasQuestionMark = t.includes("?");

    if (t.length >= 22 && (isQuestionVerb || hasQuestionMark)) {
      if (t.match(/^(?:TIME:|Roll\s+No|BTECH|M\.MARKS|Free\s+Educational|PAPER\s+ID)/i)) {
        continue;
      }

      let marks = sec === "Section A" ? 2 : 7;
      if (t.match(/\b(?:10|7|2)\s*marks?\b/i)) {
        const m = t.match(/\b(10|7|2)\s*marks?\b/i);
        marks = parseInt(m[1], 10);
      }

      questions.push({
        questionNumber: `Q${qNum}`,
        section: sec,
        questionText: t,
        marks,
        questionType: detectQuestionType(t),
        difficulty: deriveDifficulty(t, marks),
      });
      qNum++;
    }
  }

  return questions;
}

function isAdministrativeNoise(line) {
  return !!line.match(
    /^(?:roll\s*no|printed\s*pages|paper\s*id|total\s*marks|time\s*:\s*\d|b\.?\s*tech|dr\.\s*a\.p\.j|examination\s*\d|semester\s*examination|attempt\s*(?:all|any)|note\s*:\s*attempt|notesgallery)/i
  );
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
  if (
    lower.match(/^(?:calculate|find|solve|evaluate|determine the value|for the following data)/i) ||
    lower.match(/\b(?:eigenvalue|fifo|sjf|round robin|disk scheduling|b-tree insertion|avl rotation|dijkstra|address of arr|hash table)\b/i)
  ) {
    return "Numerical";
  }
  if (lower.match(/\b(?:derive|prove that|mathematical proof|induction)\b/i)) {
    return "Derivation";
  }
  if (lower.match(/\b(?:write a (?:program|c|c\+\+|python|java|function|algorithm)|code|pseudo-?code|implement|c program to)\b/i)) {
    return "Programming Question";
  }
  if (lower.match(/\b(?:draw|diagram|architecture|schematic|illustrate with diagram|representation of nodes)\b/i)) {
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
