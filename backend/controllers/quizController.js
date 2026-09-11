import crypto from "crypto";
import { createRequire } from "module";
import Quiz from "../models/Quiz.js";
import { getAIClient, getAIModel } from "../config/ai.js";

const require = createRequire(import.meta.url);
const mammoth = require("mammoth");

/**
 * Clean subtitle files (.srt, .vtt) by removing timestamps and sequence numbers
 */
function cleanSubtitleText(raw) {
  if (!raw) return "";
  return raw
    .replace(/WEBVTT[^\r\n]*/g, "")
    .replace(/^\d+\s*$/gm, "")
    .replace(/\d{1,2}:\d{2}:\d{2}[.,]\d{3}\s*-->\s*\d{1,2}:\d{2}:\d{2}[.,]\d{3}.*/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

/**
 * Extract plain text from PPTX buffer by parsing slide text elements
 */
function extractTextFromPptx(buffer) {
  try {
    const rawStr = buffer.toString("binary");
    const regex = /<a:t>([^<]+)<\/a:t>/g;
    const matches = [];
    let m;
    while ((m = regex.exec(rawStr)) !== null) {
      if (m[1] && m[1].trim()) {
        matches.push(m[1].trim());
      }
    }
    if (matches.length > 0) {
      return matches.join(" ");
    }
    return buffer.toString("utf8").replace(/[^a-zA-Z0-9.,?!\s]/g, " ").replace(/\s+/g, " ").trim();
  } catch (err) {
    return "";
  }
}

/**
 * Extract text from uploaded file buffer based on extension and mimeType
 */
async function extractTextFromFile(file) {
  if (!file || !file.buffer) return "";
  const originalName = (file.originalname || "").toLowerCase();
  const mimeType = (file.mimetype || "").toLowerCase();
  const buffer = file.buffer;

  try {
    if (originalName.endsWith(".pdf") || mimeType === "application/pdf") {
      const pdfParseModule = require("pdf-parse");
      if (typeof pdfParseModule.PDFParse === "function") {
        const parser = new pdfParseModule.PDFParse({ data: new Uint8Array(buffer) });
        await parser.load();
        const parsed = await parser.getText();
        return typeof parsed === "string" ? parsed : (parsed?.text || "");
      } else if (typeof pdfParseModule === "function") {
        const parsed = await pdfParseModule(buffer);
        return typeof parsed === "string" ? parsed : (parsed?.text || "");
      }
    }

    if (
      originalName.endsWith(".docx") ||
      mimeType.includes("wordprocessingml") ||
      mimeType.includes("msword")
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    }

    if (originalName.endsWith(".pptx") || originalName.endsWith(".ppt")) {
      const pptText = extractTextFromPptx(buffer);
      if (pptText && pptText.length > 40) return pptText;
    }

    const textStr = buffer.toString("utf-8");
    if (originalName.endsWith(".vtt") || originalName.endsWith(".srt")) {
      return cleanSubtitleText(textStr);
    }

    return textStr;
  } catch (err) {
    console.error("Text extraction error:", err.message);
    return buffer.toString("utf-8").replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, "");
  }
}

/**
 * Generate intelligent heuristic quiz fallback if AI service fails/quota exceeded
 */
function generateFallbackQuiz(text, difficulty, questionType, numQuestions = 5) {
  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 35 && s.length < 220);

  const cleanWords = text
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4);

  const uniqueWords = [...new Set(cleanWords)];

  const questions = [];
  const count = Math.min(Math.max(sentences.length, 3), numQuestions);

  for (let i = 0; i < count; i++) {
    const sentence = sentences[i % sentences.length] || ("Key concept regarding " + (uniqueWords[i] || "topic"));
    const wordsInSentence = sentence.split(/\s+/).filter((w) => w.length > 4);
    const targetWord = wordsInSentence[0] || uniqueWords[i % uniqueWords.length] || "Concept";

    const type =
      questionType === "Mixed" || !questionType
        ? (i % 4 === 0 ? "MCQ" : i % 4 === 1 ? "True/False" : i % 4 === 2 ? "Fill-in-blank" : "Short Answer")
        : questionType;

    if (type === "True/False") {
      questions.push({
        id: i + 1,
        prompt: `True or False: According to the material, "${sentence}"`,
        type: "True/False",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation: `As stated in the source content: "${sentence}".`,
        points: 1,
      });
    } else if (type === "Fill-in-blank") {
      const blankSentence = sentence.replace(new RegExp(`\\b${targetWord}\\b`, "i"), "_______");
      questions.push({
        id: i + 1,
        prompt: `Fill in the blank: "${blankSentence}"`,
        type: "Fill-in-blank",
        options: [],
        correctAnswer: targetWord,
        explanation: `The missing key term is "${targetWord}".`,
        points: 1,
      });
    } else if (type === "Short Answer") {
      questions.push({
        id: i + 1,
        prompt: `Explain the significance of the following principle: "${sentence}"`,
        type: "Short Answer",
        options: [],
        correctAnswer: targetWord,
        explanation: `Key concept emphasizes ${targetWord} within: "${sentence}".`,
        points: 1,
      });
    } else {
      const distractors = uniqueWords
        .filter((w) => w.toLowerCase() !== targetWord.toLowerCase())
        .slice(i * 3, i * 3 + 3);

      while (distractors.length < 3) {
        distractors.push(`Alternative Concept ${distractors.length + 1}`);
      }

      const options = [targetWord, ...distractors].sort(() => 0.5 - Math.random());

      questions.push({
        id: i + 1,
        prompt: `Which key term correctly completes this principle: "${sentence.replace(new RegExp(`\\b${targetWord}\\b`, "i"), "____")}"?`,
        type: "MCQ",
        options,
        correctAnswer: targetWord,
        explanation: `"${targetWord}" is the central concept discussed in the context: "${sentence}".`,
        points: 1,
      });
    }
  }

  return {
    title: `${difficulty} Assessment: ${uniqueWords.slice(0, 3).join(" & ") || "Study Document"}`,
    summary: `Automated assessment generated covering key concepts from your uploaded study material.`,
    questions,
  };
}

/**
 * POST /api/quiz/generate
 */
export const generateQuizHandler = async (req, res) => {
  try {
    let rawText = "";
    let sourceName = "Pasted Content";
    let sourceType = "text";

    if (req.file) {
      sourceName = req.file.originalname || "Uploaded File";
      sourceType = "file";
      rawText = await extractTextFromFile(req.file);
    } else if (req.body.transcript && typeof req.body.transcript === "string") {
      rawText = cleanSubtitleText(req.body.transcript);
      sourceName = req.body.videoTitle || "Video Transcript / Notes";
      sourceType = "transcript";
    } else if (req.body.text && typeof req.body.text === "string") {
      rawText = req.body.text.trim();
      sourceName = req.body.topic || "Provided Notes";
      sourceType = "text";
    }

    if (!rawText || rawText.trim().length < 30) {
      return res.status(400).json({
        message: "Could not extract sufficient text. Please upload a valid PDF, DOCX, PPT, or paste a transcript (at least 30 characters).",
      });
    }

    const difficulty = req.body.difficulty || "Medium";
    const questionType = req.body.questionType || "Mixed";
    const count = Math.min(Math.max(parseInt(req.body.count, 10) || 5, 3), 15);

    const contextSlice = rawText.slice(0, 9000);

    let generatedQuizData = null;

    try {
      const openai = getAIClient();
      const model = getAIModel();

      const systemPrompt = `You are an expert university examiner and assessment specialist.
Analyze the provided study text/transcript and create a rigorous, high-yield assessment.

Specifications:
- Difficulty: ${difficulty} (Easy: direct definitions & fundamental facts; Medium: conceptual understanding & application; Hard: deep reasoning, analysis, edge cases, problem-solving).
- Question Types Requested: ${questionType}
  * If "Mixed", provide a balanced combination of MCQ, True/False, Fill-in-blank, and Short Answer.
  * If a specific type (e.g. "MCQ", "True/False", "Fill-in-blank", "Short Answer"), only generate questions of that type.
- Number of Questions: exactly ${count} questions.
- Every question MUST include:
  * "id": numeric 1 to ${count}
  * "prompt": clear, unambiguous question text
  * "type": one of "MCQ", "True/False", "Fill-in-blank", "Short Answer"
  * "options": array of 4 distinct strings for MCQ, ["True", "False"] for True/False, empty array [] for Fill-in-blank and Short Answer
  * "correctAnswer": exact correct string answer (must match one of the options for MCQ and True/False)
  * "explanation": thorough 2-3 sentence explanation elucidating why this is correct and why other options are wrong
  * "points": 1

Respond ONLY with valid JSON in this exact structure:
{
  "title": "Concise Assessment Title",
  "summary": "Brief 2-sentence summary of the core topics covered in this quiz",
  "questions": [
    {
      "id": 1,
      "prompt": "...",
      "type": "MCQ",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "...",
      "points": 1
    }
  ]
}`;

      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Study Content:\n${contextSlice}\n\nGenerate the JSON quiz now.` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const responseText = response.choices[0]?.message?.content?.trim();
      if (responseText) {
        generatedQuizData = JSON.parse(responseText);
      }
    } catch (aiErr) {
      console.warn("AI generation call error, falling back to local extractor:", aiErr.message);
    }

    if (!generatedQuizData || !Array.isArray(generatedQuizData.questions) || generatedQuizData.questions.length === 0) {
      generatedQuizData = generateFallbackQuiz(rawText, difficulty, questionType, count);
    }

    const quizId = "quiz_" + crypto.randomBytes(6).toString("hex");

    const savedQuiz = await Quiz.create({
      quizId,
      title: generatedQuizData.title || `AI ${difficulty} Assessment`,
      difficulty,
      questionType,
      sourceName,
      sourceType,
      summary: generatedQuizData.summary || "",
      questions: generatedQuizData.questions.map((q, idx) => ({
        id: q.id || idx + 1,
        prompt: q.prompt,
        type: q.type || "MCQ",
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswer: String(q.correctAnswer || ""),
        explanation: q.explanation || "Correct based on source document.",
        points: q.points || 1,
      })),
      totalQuestions: generatedQuizData.questions.length,
    });

    const clientQuestions = savedQuiz.questions.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      type: q.type,
      options: q.options,
      points: q.points,
    }));

    return res.status(201).json({
      success: true,
      quizId: savedQuiz.quizId,
      title: savedQuiz.title,
      difficulty: savedQuiz.difficulty,
      questionType: savedQuiz.questionType,
      sourceName: savedQuiz.sourceName,
      summary: savedQuiz.summary,
      totalQuestions: savedQuiz.totalQuestions,
      questions: clientQuestions,
    });
  } catch (err) {
    console.error("generateQuizHandler fatal error:", err);
    return res.status(500).json({ message: "Quiz generation failed. " + err.message });
  }
};

/**
 * POST /api/quiz/evaluate
 */
export const evaluateQuizHandler = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    if (!quizId) {
      return res.status(400).json({ message: "quizId is required" });
    }

    const quiz = await Quiz.findOne({ quizId });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;
    const total = quiz.questions.length;

    const detailed = quiz.questions.map((q, index) => {
      let userAnswer = "";
      if (Array.isArray(answers)) {
        if (typeof answers[index] === "object" && answers[index] !== null) {
          userAnswer = answers[index].answer || "";
        } else {
          userAnswer = answers[index] || "";
        }
      } else if (typeof answers === "object" && answers !== null) {
        userAnswer = answers[q.id] || answers[index] || "";
      }

      userAnswer = String(userAnswer || "").trim();
      const expected = String(q.correctAnswer || "").trim();

      let isCorrect = false;

      if (q.type === "MCQ" || q.type === "True/False") {
        isCorrect = userAnswer.toLowerCase() === expected.toLowerCase();
      } else if (q.type === "Fill-in-blank") {
        isCorrect =
          userAnswer.toLowerCase() === expected.toLowerCase() ||
          (expected.toLowerCase().includes(userAnswer.toLowerCase()) && userAnswer.length > 2);
      } else {
        isCorrect =
          userAnswer.toLowerCase() === expected.toLowerCase() ||
          (userAnswer.length >= 3 && expected.toLowerCase().includes(userAnswer.toLowerCase()));
      }

      if (isCorrect) {
        score += q.points || 1;
      }

      return {
        id: q.id,
        prompt: q.prompt,
        type: q.type,
        options: q.options,
        userAnswer: userAnswer || "Unanswered",
        correctAnswer: expected,
        isCorrect,
        explanation: q.explanation || "Based on the provided context.",
      };
    });

    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    let performanceFeedback = "Good effort! Review the detailed solutions below.";
    if (percentage >= 80) {
      performanceFeedback = "Outstanding mastery! You demonstrated deep comprehension of the material.";
    } else if (percentage >= 60) {
      performanceFeedback = "Solid grasp of core concepts. Inspect the missed explanations to strengthen retention.";
    } else {
      performanceFeedback = "Needs reinforcement. Review the highlighted explanations and re-test.";
    }

    return res.json({
      success: true,
      quizId,
      title: quiz.title,
      difficulty: quiz.difficulty,
      score,
      total,
      percentage,
      performanceFeedback,
      detailed,
    });
  } catch (err) {
    console.error("evaluateQuizHandler error:", err);
    return res.status(500).json({ message: "Evaluation failed. " + err.message });
  }
};

/**
 * GET /api/quiz/:quizId
 */
export const getQuizByIdHandler = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ quizId: req.params.quizId });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    return res.json({
      quizId: quiz.quizId,
      title: quiz.title,
      difficulty: quiz.difficulty,
      questionType: quiz.questionType,
      sourceName: quiz.sourceName,
      summary: quiz.summary,
      totalQuestions: quiz.totalQuestions,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        type: q.type,
        options: q.options,
        points: q.points,
      })),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/quiz/recent
 */
export const getRecentQuizzesHandler = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("quizId title difficulty questionType sourceName totalQuestions createdAt");
    return res.json({ quizzes });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
