import pdf from "pdf-parse/lib/pdf-parse.js";

/**
 * Extracts raw text from an uploaded buffer (PDF, scanned PDF, or image).
 * If PDF contains selectable text, returns it directly.
 * If PDF has minimal or zero text (scanned PDF), runs OCR on image buffers or passes to fallback OCR.
 */
export async function extractDocumentText(buffer, mimeType = "application/pdf") {
  const isImage =
    mimeType.includes("image") ||
    mimeType.includes("jpeg") ||
    mimeType.includes("jpg") ||
    mimeType.includes("png");

  if (isImage) {
    return await runTesseractOCR(buffer);
  }

  // Handle PDF
  try {
    const data = await pdf(buffer);
    const text = data.text ? data.text.trim() : "";

    // If text has reasonable length (> 120 characters), standard extraction worked
    if (text.length > 120) {
      return {
        text,
        pageCount: data.numpages || 1,
        sourceType: "pdf_selectable",
      };
    }

    // Otherwise, likely a scanned PDF image! Try OCR fallback
    const ocrResult = await runTesseractOCR(buffer);
    return {
      text: ocrResult.text || text,
      pageCount: data.numpages || 1,
      sourceType: "pdf_scanned_ocr",
    };
  } catch (err) {
    console.warn("PDF parse fallback to OCR:", err.message);
    try {
      const ocrResult = await runTesseractOCR(buffer);
      return {
        text: ocrResult.text,
        pageCount: 1,
        sourceType: "ocr_direct",
      };
    } catch (ocrErr) {
      throw new Error(`Text extraction failed: ${err.message}. OCR error: ${ocrErr.message}`);
    }
  }
}

/**
 * Tesseract OCR Engine wrapper with dynamic lazy import
 */
async function runTesseractOCR(buffer) {
  let worker = null;
  try {
    const tesseract = await import("tesseract.js");
    const createWorker = tesseract.createWorker || tesseract.default?.createWorker;
    if (!createWorker) {
      throw new Error("createWorker not found in tesseract.js");
    }
    worker = await createWorker("eng");
    const ret = await worker.recognize(buffer);
    await worker.terminate();
    return {
      text: ret.data.text || "",
      confidence: ret.data.confidence || 0,
    };
  } catch (err) {
    if (worker) {
      try {
        await worker.terminate();
      } catch (_) {}
    }
    console.error("Tesseract OCR execution error:", err.message);
    return {
      text: "",
      confidence: 0,
      error: err.message,
    };
  }
}

/**
 * Segments raw examination paper text into structured question objects.
 * Handles patterns like:
 * - "Q1(a) Explain...", "1. (b) What is...", "Section A", "Attempt any five...", etc.
 */
export function segmentQuestionsFromText(rawText, paperMeta = {}) {
  if (!rawText || typeof rawText !== "string") return [];

  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const questions = [];

  // Patterns for Question boundaries
  const questionNumberRegex = /^(?:Q(?:uestion)?\.?\s*(\d+)|(\d+)[\.\)]|(?:Part|Section)\s*([A-Za-z0-9]+))(?:\s*[\(\[]?([a-zA-Z0-9]+)[\)\]]?)?/i;
  const marksRegex = /(?:\[\s*(\d+)\s*(?:Marks?|M)?\s*\]|\(\s*(\d+)\s*(?:Marks?|M)?\s*\)|(?:Marks?|CO\d+)\s*[:=-]?\s*(\d+)|(\d+)\s*Marks)/i;

  let currentQuestion = null;
  let currentSection = "Section A";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect section header
    if (/^section\s+[a-c]/i.test(line) || /^part\s+[a-c]/i.test(line)) {
      currentSection = line;
      continue;
    }

    // Skip university header noise and meta instructions like "Attempt any three...", "Attempt all questions..."
    if (
      /^(roll no|paper id|time\s*:|maximum marks|printed pages|total marks|b\.tech|examination|note\s*:|attempt\s+(?:all|any|one)|answer\s+(?:any|all))/i.test(
        line
      ) ||
      /^(\d+[\.\)]\s*attempt\s+(?:all|any|one))/i.test(line)
    ) {
      continue;
    }

    const match = line.match(questionNumberRegex);
    if (match) {
      // Save previous question
      if (currentQuestion && currentQuestion.lines.join(" ").trim().length > 15) {
        questions.push(finalizeQuestion(currentQuestion, paperMeta));
      }

      // Start new question
      const qNum = match[1] || match[2] || `${questions.length + 1}`;
      const subPart = match[4] ? `(${match[4]})` : "";
      const fullQNumber = subPart ? `Q${qNum}${subPart}` : `Q${qNum}`;

      // Extract marks if present on this line
      const marksMatch = line.match(marksRegex);
      const marksVal = marksMatch ? parseInt(marksMatch[1] || marksMatch[2] || marksMatch[3] || marksMatch[4], 10) : 5;

      // Clean line from question prefix
      const strippedText = line.replace(questionNumberRegex, "").trim();

      currentQuestion = {
        questionNumber: fullQNumber,
        section: currentSection,
        lines: strippedText ? [strippedText] : [],
        marks: marksVal || 5,
        pageNumber: 1,
      };
    } else if (currentQuestion) {
      // Check if this continuation line has marks indicator
      const marksMatch = line.match(marksRegex);
      if (marksMatch && currentQuestion.marks === 5) {
        currentQuestion.marks = parseInt(
          marksMatch[1] || marksMatch[2] || marksMatch[3] || marksMatch[4],
          10
        );
      }
      currentQuestion.lines.push(line);
    }
  }

  if (currentQuestion && currentQuestion.lines.join(" ").trim().length > 15) {
    questions.push(finalizeQuestion(currentQuestion, paperMeta));
  }

  // Fallback if regex found 0 questions (e.g. non-standard format)
  if (questions.length === 0 && lines.length > 5) {
    return fallbackQuestionChunking(lines, paperMeta);
  }

  return questions;
}

function finalizeQuestion(qObj, paperMeta) {
  const fullText = qObj.lines.join(" ").replace(/\s+/g, " ").trim();
  const qType = detectQuestionType(fullText, qObj.marks);
  const diff = detectDifficulty(fullText, qObj.marks);

  return {
    questionNumber: qObj.questionNumber || "Q1",
    questionText: fullText,
    rawQuestionText: fullText,
    marks: qObj.marks || (qType === "Short Answer" ? 2 : 7),
    questionType: qType,
    difficulty: diff,
    pageNumber: qObj.pageNumber || 1,
    academicYear: paperMeta.academicYear || "2023-2024",
    university: paperMeta.university || "AKTU",
    subjectId: paperMeta.subjectId || "dsa",
    subjectName: paperMeta.subjectName || "Data Structures & Algorithms",
  };
}

function fallbackQuestionChunking(lines, paperMeta) {
  const chunks = [];
  let current = [];
  for (const line of lines) {
    if (
      /^[a-z0-9][\.\)]/i.test(line) ||
      /\?\s*$/i.test(line) ||
      current.length >= 4
    ) {
      if (current.length > 0) {
        chunks.push(current.join(" "));
        current = [];
      }
    }
    current.push(line);
  }
  if (current.length > 0) chunks.push(current.join(" "));

  return chunks
    .filter((c) => c.length > 20)
    .map((text, idx) => ({
      questionNumber: `Q${idx + 1}`,
      questionText: text,
      rawQuestionText: text,
      marks: text.length > 200 ? 7 : 5,
      questionType: detectQuestionType(text, 5),
      difficulty: "Medium",
      pageNumber: 1,
      academicYear: paperMeta.academicYear || "2023-2024",
      university: paperMeta.university || "AKTU",
      subjectId: paperMeta.subjectId || "dsa",
      subjectName: paperMeta.subjectName || "Data Structures & Algorithms",
    }));
}

function detectQuestionType(text, marks) {
  const lower = text.toLowerCase();
  if (/\b(mcq|choose the correct|select the)\b/i.test(lower)) return "MCQ";
  if (/\b(derive|derivation|prove that|mathematical proof)\b/i.test(lower)) return "Derivation";
  if (/\b(calculate|compute|solve for|find the value|evaluate the following expression)\b/i.test(lower) || /\d+\s*[\+\*\-\/]\s*\d+/.test(lower)) return "Numerical";
  if (/\b(write a program|c\+\+|java|python|pseudo-code|algorithm to|code)\b/i.test(lower)) return "Programming Questions";
  if (/\b(diagram|draw|schematic|architecture diagram|flowchart)\b/i.test(lower)) return "Diagram-based Questions";
  if (/\b(case study|scenario|consider a company|suppose an organization)\b/i.test(lower)) return "Case-based Questions";
  if (marks <= 2 || /\b(define|what is|name the|state)\b/i.test(lower)) return "Short Answer";
  return "Long Answer";
}

function detectDifficulty(text, marks) {
  const lower = text.toLowerCase();
  if (marks >= 10 || /\b(design|synthesize|derive|prove that|critically analyze)\b/i.test(lower)) {
    return "Hard";
  }
  if (marks <= 2 || /\b(define|list|state|what is)\b/i.test(lower)) {
    return "Easy";
  }
  return "Medium";
}
