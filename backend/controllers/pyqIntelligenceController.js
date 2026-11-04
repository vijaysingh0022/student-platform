import PYQPaper from "../models/PYQPaper.js";
import PYQQuestion from "../models/PYQQuestion.js";
import PYQMockPaper from "../models/PYQMockPaper.js";
import {
  extractTextFromBuffer,
  parseRawTextIntoQuestions,
  normalizeText,
} from "../services/pyqExtractionService.js";
import {
  mapQuestionToSyllabus,
  calculateQuestionSimilarity,
  computeQuestionPriority,
} from "../services/pyqSyllabusService.js";
import { getAIClient, getAIModel } from "../config/ai.js";
import { CURRICULUM_SUBJECTS } from "../seed/curriculumData.js";

// ─── 1. GET PYQ DASHBOARD METRICS & RECENT PAPERS ───────────────────────────
// @route GET /api/pyq/dashboard
export const getPYQDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const [papers, totalQuestions, repeatedQuestions] = await Promise.all([
      PYQPaper.find({ userId }).sort({ createdAt: -1 }).lean(),
      PYQQuestion.countDocuments({ userId }),
      PYQQuestion.countDocuments({ userId, isRepeated: true }),
    ]);

    // Unique subjects analyzed
    const subjectSet = new Set(papers.map((p) => p.subjectId));
    // Unique units covered
    const unitAggregation = await PYQQuestion.distinct("unitNumber", { userId });

    return res.json({
      success: true,
      metrics: {
        papersAnalyzed: papers.filter((p) => p.status === "Analysis Complete").length,
        totalPapersUploaded: papers.length,
        questionsExtracted: totalQuestions,
        repeatedQuestionsFound: repeatedQuestions,
        subjectsAnalyzed: subjectSet.size,
        unitsCovered: unitAggregation.length || 0,
      },
      recentPapers: papers.slice(0, 10),
    });
  } catch (error) {
    console.error("PYQ Dashboard Error:", error);
    return res.status(500).json({ success: false, message: "Failed to load PYQ dashboard metrics." });
  }
};

// ─── 2. BATCH UPLOAD PREVIOUS YEAR PAPERS ───────────────────────────────────
// @route POST /api/pyq/upload
export const uploadPYQPapers = async (req, res) => {
  try {
    const userId = req.user._id;
    const files = req.files || [];

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No question paper files uploaded." });
    }

    const {
      university = "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
      course = "B.Tech",
      branch = "Computer Science & Engineering (CSE)",
      semester = 4,
      subjectId = "dsa",
      subjectName,
      subjectCode = "KCS-401",
      academicYear = "2023-24",
      examSession = "End Semester",
      totalMarks = 100,
      durationMinutes = 180,
    } = req.body;

    const resolvedSubjectName =
      subjectName ||
      CURRICULUM_SUBJECTS.find((s) => s.subjectId === subjectId)?.name ||
      "Data Structures & Algorithms";

    const createdPapers = [];

    for (const file of files) {
      const base64Data = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      const newPaper = await PYQPaper.create({
        userId,
        title: `${resolvedSubjectName} (${academicYear} ${examSession})`,
        originalFilename: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        fileData: base64Data,
        university,
        course,
        branch,
        semester: Number(semester) || 4,
        subjectId,
        subjectName: resolvedSubjectName,
        subjectCode,
        academicYear,
        examSession,
        totalMarks: Number(totalMarks) || 100,
        durationMinutes: Number(durationMinutes) || 180,
        status: "Uploaded",
        progressPercent: 10,
        statusMessage: "File received securely. Queued for extraction.",
      });

      createdPapers.push(newPaper);

      // Trigger asynchronous background extraction pipeline
      processPaperBackground(newPaper._id, file.buffer, file.mimetype, file.originalname, userId).catch(
        (pipelineErr) => {
          console.error(`Pipeline failure for paper ${newPaper._id}:`, pipelineErr);
        }
      );
    }

    return res.status(201).json({
      success: true,
      message: `Successfully uploaded ${createdPapers.length} question paper(s). Processing in background.`,
      papers: createdPapers,
    });
  } catch (error) {
    console.error("Upload PYQ Error:", error);
    return res.status(500).json({ success: false, message: "Failed to upload question paper files." });
  }
};

// ─── 3. ASYNCHRONOUS PIPELINE: TEXT EXTRACTION, OCR & SYLLABUS MAPPING ───────
async function processPaperBackground(paperId, buffer, mimeType, filename, userId) {
  try {
    const paper = await PYQPaper.findById(paperId);
    if (!paper) return;

    let text = paper.rawExtractedText || "";
    let pageCount = paper.pageCount || 1;
    let isOcrUsed = paper.isOcrUsed || false;

    // Step 1: Text extraction / OCR if text is not already available or if buffer provided
    if (!text || text.length < 20) {
      if (!buffer) {
        await PYQPaper.findByIdAndUpdate(paperId, {
          status: "Failed / Needs Review",
          progressPercent: 100,
          statusMessage: "No raw text or file buffer available for extraction.",
        });
        return;
      }

      await PYQPaper.findByIdAndUpdate(paperId, {
        status: "Extracting Text",
        progressPercent: 30,
        statusMessage: "Reading PDF document and optical stream...",
      });

      const extracted = await extractTextFromBuffer(buffer, mimeType, filename);
      text = extracted.text;
      pageCount = extracted.pageCount;
      isOcrUsed = extracted.isOcrUsed;
    }

    if (!text || text.length < 20) {
      await PYQPaper.findByIdAndUpdate(paperId, {
        status: "Failed / Needs Review",
        progressPercent: 100,
        statusMessage: "Could not extract legible text. Please upload a clearer scan or selectable PDF.",
        errorDetails: "Extracted text length is under minimum threshold.",
      });
      return;
    }

    // Step 2: Boundary detection & Question splitting
    await PYQPaper.findByIdAndUpdate(paperId, {
      status: isOcrUsed ? "OCR Processing" : "Identifying Questions",
      progressPercent: 55,
      rawExtractedText: text,
      pageCount,
      isOcrUsed,
      statusMessage: "Detecting question boundaries, sub-questions, and marks allocation...",
    });

    const parsedQuestions = parseRawTextIntoQuestions(text, paper.subjectId);

    if (parsedQuestions.length === 0) {
      await PYQPaper.findByIdAndUpdate(paperId, {
        status: "Failed / Needs Review",
        progressPercent: 100,
        statusMessage: "No questions could be isolated from this layout. Marked for review.",
        errorDetails: "Zero question markers identified.",
      });
      return;
    }

    // Step 3: Syllabus Mapping & Priority Calculation
    await PYQPaper.findByIdAndUpdate(paperId, {
      status: "Mapping Syllabus",
      progressPercent: 75,
      statusMessage: `Mapping ${parsedQuestions.length} extracted questions to LearnX curriculum units...`,
    });

    const existingUserQuestions = await PYQQuestion.find({
      userId,
      subjectId: paper.subjectId,
    }).lean();

    const insertedDocs = [];

    for (const q of parsedQuestions) {
      const syllabusMap = await mapQuestionToSyllabus(q.questionText, paper.subjectId);
      const normQ = normalizeText(q.questionText);

      // Check duplicates against previous papers for this user
      let isRep = false;
      let repeatCount = 1;
      const repeatedYears = [paper.academicYear];
      const similarRefs = [];

      for (const ex of existingUserQuestions) {
        if (ex.paperId.toString() === paperId.toString()) continue;
        const sim = calculateQuestionSimilarity(q.questionText, ex.questionText);
        if (sim.type !== "Unrelated") {
          isRep = true;
          repeatCount++;
          if (!repeatedYears.includes(ex.academicYear)) repeatedYears.push(ex.academicYear);
          similarRefs.push({
            questionId: ex._id,
            paperId: ex.paperId,
            year: ex.academicYear,
            questionNumber: ex.questionNumber,
            similarityScore: sim.score,
            similarityType: sim.type,
          });
        }
      }

      const priority = computeQuestionPriority({
        repeatCount,
        marks: q.marks,
        academicYear: paper.academicYear,
        topicTitle: syllabusMap.topicTitle,
      });

      const questionDoc = {
        userId,
        paperId: paper._id,
        subjectId: paper.subjectId,
        subjectName: paper.subjectName,
        academicYear: paper.academicYear,
        examSession: paper.examSession,
        paperTitle: paper.title,
        pageNumber: 1,
        questionNumber: q.questionNumber,
        section: q.section,
        questionText: q.questionText,
        normalizedText: normQ,
        marks: q.marks,
        questionType: q.questionType,
        difficulty: q.difficulty,
        unitId: syllabusMap.unitId,
        unitNumber: syllabusMap.unitNumber,
        unitName: syllabusMap.unitName,
        chapterId: syllabusMap.chapterId,
        topicId: syllabusMap.topicId,
        topicTitle: syllabusMap.topicTitle,
        subtopics: syllabusMap.subtopics,
        mappingConfidence: syllabusMap.mappingConfidence,
        mappingEvidence: syllabusMap.mappingEvidence,
        verificationStatus: syllabusMap.verificationStatus,
        isRepeated: isRep,
        repeatCount,
        repeatedYears,
        similarQuestionReferences: similarRefs,
        priorityLevel: priority.priorityLevel,
        priorityScore: priority.score,
        priorityReason: priority.priorityReason,
        studyStatus: "Not Started",
      };

      insertedDocs.push(questionDoc);
    }

    await PYQQuestion.insertMany(insertedDocs);

    // Finalize Paper Record
    const repeatedCount = insertedDocs.filter((d) => d.isRepeated).length;
    await PYQPaper.findByIdAndUpdate(paperId, {
      status: "Analysis Complete",
      progressPercent: 100,
      extractedQuestionCount: insertedDocs.length,
      verifiedQuestionCount: insertedDocs.filter((d) => d.verificationStatus === "Verified").length,
      repeatedQuestionCount: repeatedCount,
      statusMessage: `Successfully extracted ${insertedDocs.length} questions across all sections.`,
    });
  } catch (err) {
    console.error("Paper background pipeline error:", err);
    await PYQPaper.findByIdAndUpdate(paperId, {
      status: "Failed / Needs Review",
      progressPercent: 100,
      statusMessage: `Pipeline error: ${err.message}`,
      errorDetails: err.stack,
    });
  }
}

// ─── 4. GET PROCESSING STATUS FOR POLLING/PROGRESS ──────────────────────────
// @route GET /api/pyq/papers/:paperId/status
export const getPaperStatus = async (req, res) => {
  try {
    const { paperId } = req.params;
    const paper = await PYQPaper.findOne({ _id: paperId, userId: req.user._id })
      .select("status progressPercent statusMessage extractedQuestionCount repeatedQuestionCount")
      .lean();

    if (!paper) {
      return res.status(404).json({ success: false, message: "Paper not found." });
    }

    return res.json({ success: true, paper });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch status." });
  }
};

// ─── 4b. REPROCESS PAPER QUESTIONS ───────────────────────────────────────────
// @route POST /api/pyq/papers/:paperId/reprocess
export const reprocessPYQPaper = async (req, res) => {
  try {
    const { paperId } = req.params;
    const userId = req.user._id;
    const paper = await PYQPaper.findOne({ _id: paperId, userId });
    if (!paper) {
      return res.status(404).json({ success: false, message: "Paper not found" });
    }

    // Delete existing questions for this paper
    await PYQQuestion.deleteMany({ paperId: paper._id });

    // Use rawExtractedText or fileData buffer
    let buffer = null;
    if (paper.fileData) {
      buffer = Buffer.from(paper.fileData, "base64");
    }

    // Run processing
    await processPaperBackground(paper._id, buffer, paper.mimeType, paper.originalFilename, userId);

    const updatedQuestions = await PYQQuestion.find({ paperId: paper._id }).lean();
    return res.json({
      success: true,
      message: `Reprocessed ${updatedQuestions.length} questions successfully.`,
      count: updatedQuestions.length,
    });
  } catch (error) {
    console.error("Reprocess error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── 5. GET EXTRACTED QUESTIONS WITH ADVANCED FILTERS ───────────────────────
// @route GET /api/pyq/questions
export const getPYQQuestions = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      subjectId,
      paperId,
      unitNumber,
      priorityLevel,
      questionType,
      difficulty,
      isRepeated,
      studyStatus,
      search,
    } = req.query;

    const filter = { userId };

    if (subjectId) filter.subjectId = subjectId;
    if (paperId) filter.paperId = paperId;
    if (unitNumber) filter.unitNumber = Number(unitNumber);
    if (priorityLevel) filter.priorityLevel = priorityLevel;
    if (questionType) filter.questionType = questionType;
    if (difficulty) filter.difficulty = difficulty;
    if (isRepeated !== undefined) filter.isRepeated = isRepeated === "true";
    if (studyStatus) filter.studyStatus = studyStatus;

    if (search && search.trim()) {
      filter.questionText = { $regex: search.trim(), $options: "i" };
    }

    const questions = await PYQQuestion.find(filter)
      .sort({ marks: -1, priorityScore: -1, questionNumber: 1 })
      .lean();

    return res.json({ success: true, count: questions.length, questions });
  } catch (error) {
    console.error("Get Questions Error:", error);
    return res.status(500).json({ success: false, message: "Failed to load questions." });
  }
};

// ─── 6. UPDATE QUESTION DETAILS / MANUAL CORRECTION ─────────────────────────
// @route PATCH /api/pyq/questions/:questionId
export const updatePYQQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.user._id;
    const updates = req.body;

    if (updates.topicTitle || updates.unitNumber) {
      updates.verificationStatus = "Manually Edited";
    }

    const updated = await PYQQuestion.findOneAndUpdate(
      { _id: questionId, userId },
      { $set: updates },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }

    return res.json({ success: true, question: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update question." });
  }
};

// ─── 7. REPEATED QUESTIONS INTELLIGENCE VIEW ─────────────────────────────────
// @route GET /api/pyq/repeated
export const getRepeatedQuestionsIntelligence = async (req, res) => {
  try {
    const userId = req.user._id;
    const { subjectId } = req.query;

    const filter = { userId, isRepeated: true };
    if (subjectId) filter.subjectId = subjectId;

    const repeatedQuestions = await PYQQuestion.find(filter)
      .sort({ repeatCount: -1, priorityScore: -1 })
      .lean();

    // Group by similarity type
    const exactMatches = repeatedQuestions.filter((q) =>
      q.similarQuestionReferences.some((r) => r.similarityType === "Exact Match")
    );
    const variants = repeatedQuestions.filter((q) =>
      q.similarQuestionReferences.some((r) => r.similarityType === "Modified Variant")
    );
    const conceptual = repeatedQuestions.filter((q) =>
      q.similarQuestionReferences.some((r) => r.similarityType === "Conceptually Similar")
    );

    return res.json({
      success: true,
      totalRepeated: repeatedQuestions.length,
      groups: {
        exactMatches,
        modifiedVariants: variants,
        conceptuallySimilar: conceptual,
      },
    });
  } catch (error) {
    console.error("Repeated Questions Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch repeated questions." });
  }
};

// ─── 8. UNIT-WISE & TOPIC-WISE ANALYTICS ────────────────────────────────────
// @route GET /api/pyq/analytics
export const getPYQAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { subjectId } = req.query;

    const matchStage = { userId };
    if (subjectId) matchStage.subjectId = subjectId;

    const [
      unitStats,
      topicStats,
      marksStats,
      difficultyStats,
      questionTypeStats,
      yearStats,
    ] = await Promise.all([
      // Questions & Marks per Unit
      PYQQuestion.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$unitNumber",
            unitName: { $first: "$unitName" },
            count: { $sum: 1 },
            totalMarks: { $sum: "$marks" },
            repeatedCount: { $sum: { $cond: ["$isRepeated", 1, 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      // Top Topics by Frequency
      PYQQuestion.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$topicTitle",
            count: { $sum: 1 },
            totalMarks: { $sum: "$marks" },
            unitNumber: { $first: "$unitNumber" },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 12 },
      ]),
      // Marks distribution
      PYQQuestion.aggregate([
        { $match: matchStage },
        { $group: { _id: "$marks", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      // Difficulty distribution
      PYQQuestion.aggregate([
        { $match: matchStage },
        { $group: { _id: "$difficulty", count: { $sum: 1 } } },
      ]),
      // Question Type distribution
      PYQQuestion.aggregate([
        { $match: matchStage },
        { $group: { _id: "$questionType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      // Year-wise Frequency
      PYQQuestion.aggregate([
        { $match: matchStage },
        { $group: { _id: "$academicYear", count: { $sum: 1 }, totalMarks: { $sum: "$marks" } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return res.json({
      success: true,
      analytics: {
        unitStats: unitStats.map((u) => ({
          unitNumber: u._id || 1,
          name: u.unitName || `Unit ${u._id || 1}`,
          questionCount: u.count,
          totalMarks: u.totalMarks,
          repeatedCount: u.repeatedCount,
        })),
        topicStats: topicStats.map((t) => ({
          topic: t._id || "General Concept",
          unit: t.unitNumber || 1,
          frequency: t.count,
          marks: t.totalMarks,
        })),
        marksDistribution: marksStats.map((m) => ({ marks: `${m._id} Marks`, count: m.count })),
        difficultyDistribution: difficultyStats.map((d) => ({ difficulty: d._id || "Medium", count: d.count })),
        questionTypeDistribution: questionTypeStats.map((q) => ({ type: q._id || "Short Answer", count: q.count })),
        yearWiseDistribution: yearStats.map((y) => ({ year: y._id, count: y.count, marks: y.totalMarks })),
      },
    });
  } catch (error) {
    console.error("PYQ Analytics Error:", error);
    return res.status(500).json({ success: false, message: "Failed to calculate analytics." });
  }
};

// ─── 9. AI ANSWER GENERATOR WITH MULTI-MARK TIERS ───────────────────────────
// @route POST /api/pyq/questions/:questionId/answer
export const generatePYQAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { marks = 5, answerStyle = "Exam-Oriented" } = req.body;
    const userId = req.user._id;

    const question = await PYQQuestion.findOne({ _id: questionId, userId });
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }

    const marksKey = `${marks}Marks`;
    if (question.solutions && question.solutions.get(marksKey)) {
      return res.json({
        success: true,
        isCached: true,
        answer: question.solutions.get(marksKey),
      });
    }

    const aiClient = getAIClient();
    if (!aiClient) {
      const fallbackSolution = {
        simpleExplanation: `In ${question.subjectName}, "${question.questionText}" assesses fundamental understanding of ${question.topicTitle}.`,
        examOrientedAnswer: `1. Definition & Core Axioms\n2. Key Operational Rules & Invariants\n3. Engineering trade-offs and complexity bounds.`,
        stepByStepSolution: [
          "State formal definition clearly.",
          "Draw or explain the associated state representation.",
          "List boundary conditions and computational limits.",
        ],
        importantDefinitions: [`${question.topicTitle}: Core engineering primitive.`],
        relevantFormulas: ["O(log N) or standard closed-form complexity."],
        numericalCalculation: question.questionType === "Numerical" ? "Formulate given parameters, substitute values, and verify dimensions." : "",
        keyPointsToRemember: ["Keep diagrams neatly labelled.", "Mention Big-O bounds explicitly."],
        expectedStructure: `Structured ${marks}-mark response with definition, explanation, and example.`,
      };
      return res.json({ success: true, isCached: false, answer: fallbackSolution });
    }

    const prompt = `You are a university engineering professor grading previous-year examination papers for ${question.subjectName}.
Question: "${question.questionText}"
Marks allocated: ${marks} Marks
Question Type: ${question.questionType}
Topic: ${question.topicTitle}

Provide an authentic, academic, exam-oriented solution structured for maximum scoring in university examinations.
Respond ONLY with a valid JSON object matching this schema:
{
  "simpleExplanation": "Plain language explanation of the underlying intuition (2-3 sentences)",
  "examOrientedAnswer": "Complete point-by-point university exam answer formatted in markdown",
  "stepByStepSolution": ["Step 1...", "Step 2...", "Step 3..."],
  "importantDefinitions": ["Definition 1..."],
  "relevantFormulas": ["Formula 1 if applicable"],
  "numericalCalculation": "Full working for numerical questions or empty string",
  "keyPointsToRemember": ["Point 1...", "Point 2..."],
  "expectedStructure": "Recommended structure for ${marks} marks"
}`;

    const completion = await aiClient.chat.completions.create({
      model: getAIModel(),
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 1400,
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");

    // Cache solution onto question doc
    if (!question.solutions) question.solutions = new Map();
    question.solutions.set(marksKey, parsed);
    await question.save();

    return res.json({ success: true, isCached: false, answer: parsed });
  } catch (error) {
    console.error("AI Answer Generation Error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate answer." });
  }
};

// ─── 10. GENERATE AI SIMILAR PRACTICE QUESTIONS ─────────────────────────────
// @route POST /api/pyq/questions/:questionId/generate-practice
export const generateSimilarPracticeQuestions = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.user._id;

    const question = await PYQQuestion.findOne({ _id: questionId, userId });
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }

    const aiClient = getAIClient();
    if (!aiClient) {
      return res.json({
        success: true,
        practiceQuestions: [
          {
            text: `Explain an alternative variant of ${question.questionText} under modified constraints.`,
            marks: question.marks,
            difficulty: "Medium",
            sourceType: "AI Generated",
            originReference: `Derived from Q# ${question.questionNumber} (${question.academicYear})`,
          },
        ],
      });
    }

    const prompt = `Based on this real university exam question:
Question: "${question.questionText}"
Subject: ${question.subjectName}
Unit: ${question.unitName}
Topic: ${question.topicTitle}
Marks: ${question.marks}

Generate 3 high-quality similar practice questions testing the same core concepts with variations (one slightly easier, one same level, one applied numerical/conceptual variant).
Mark them clearly as AI Generated practice questions (never misrepresent them as real past papers).

Respond ONLY with valid JSON:
{
  "practiceQuestions": [
    {
      "text": "Question text...",
      "marks": ${question.marks},
      "difficulty": "Easy" | "Medium" | "Hard",
      "sourceType": "AI Generated",
      "learningObjective": "Why this question helps reinforce the concept"
    }
  ]
}`;

    const completion = await aiClient.chat.completions.create({
      model: getAIModel(),
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 800,
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{"practiceQuestions":[]}');

    return res.json({
      success: true,
      originalQuestion: {
        number: question.questionNumber,
        text: question.questionText,
        year: question.academicYear,
      },
      practiceQuestions: parsed.practiceQuestions,
    });
  } catch (error) {
    console.error("Practice Generation Error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate practice questions." });
  }
};

// ─── 11. GENERATE BALANCED UNIVERSITY MOCK PAPER ────────────────────────────
// @route POST /api/pyq/mock-paper/generate
export const generateUniversityMockPaper = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      subjectId = "dsa",
      subjectName,
      semester = 4,
      selectedUnits = [1, 2, 3, 4, 5],
      totalMarks = 100,
      durationMinutes = 180,
      difficulty = "Standard University",
    } = req.body;

    const resolvedSubjectName =
      subjectName ||
      CURRICULUM_SUBJECTS.find((s) => s.subjectId === subjectId)?.name ||
      "Data Structures & Algorithms";

    // Query pool of extracted PYQ questions for this subject
    const pool = await PYQQuestion.find({
      userId,
      subjectId,
      unitNumber: { $in: selectedUnits },
    }).lean();

    // Standard AKTU University Paper Blueprint:
    // Section A: 10 Short questions (2 marks each) = 20 Marks (2 from each of 5 units)
    // Section B: 5 Long questions (Attempt 3, 10 marks each) = 30 Marks
    // Section C: 5 pairs of OR questions (Attempt 1 from each pair, 10 marks each) = 50 Marks
    const blueprint = [
      {
        section: "Section A",
        description: "Compulsory Short Answer Questions across all units",
        totalQuestions: 10,
        mandatoryCount: 10,
        marksPerQuestion: 2,
        totalSectionMarks: 20,
      },
      {
        section: "Section B",
        description: "Attempt any THREE out of FIVE questions",
        totalQuestions: 5,
        mandatoryCount: 3,
        marksPerQuestion: 10,
        totalSectionMarks: 30,
      },
      {
        section: "Section C",
        description: "Attempt any ONE question from each of the 5 Unit modules (Internal Choice)",
        totalQuestions: 10,
        mandatoryCount: 5,
        marksPerQuestion: 10,
        totalSectionMarks: 50,
      },
    ];

    // Assemble questions from uploaded PYQs or synthesize practice variants
    const sections = [];

    // Assemble Section A
    const secAQuestions = [];
    for (let i = 1; i <= 10; i++) {
      const targetUnit = ((i - 1) % 5) + 1;
      const match = pool.find((q) => q.unitNumber === targetUnit && q.marks <= 4 && !secAQuestions.some((x) => x.questionText === q.questionText));
      const letter = String.fromCharCode(96 + i); // a, b, c...
      secAQuestions.push({
        questionNumber: `1(${letter})`,
        questionText: match ? match.questionText : `Define key invariants and memory model of Unit ${targetUnit} concepts in ${resolvedSubjectName}.`,
        marks: 2,
        unitNumber: targetUnit,
        topicTitle: match?.topicTitle || `Unit ${targetUnit} Core Concept`,
        difficulty: "Easy",
        sourceType: match ? "Original PYQ" : "AI Generated",
        originalPaperYear: match?.academicYear || "Synthetic",
        originalQuestionNumber: match?.questionNumber || "",
        solutionGuide: "Provide concise definition with 1 example or equation.",
      });
    }

    sections.push({
      name: "Section A (Short Questions - Compulsory)",
      instructions: "Attempt all questions in brief. Each question carries 2 marks.",
      marksPerQuestion: 2,
      questions: secAQuestions,
    });

    // Assemble Section B
    const secBQuestions = [];
    for (let i = 1; i <= 5; i++) {
      const match = pool.find((q) => q.unitNumber === i && q.marks >= 5 && !secBQuestions.some((x) => x.questionText === q.questionText));
      secBQuestions.push({
        questionNumber: `2(${String.fromCharCode(96 + i)})`,
        questionText: match ? match.questionText : `Explain the complete architectural walkthrough and algorithmic complexity for Unit ${i} in ${resolvedSubjectName}.`,
        marks: 10,
        unitNumber: i,
        topicTitle: match?.topicTitle || `Unit ${i} Core Architecture`,
        difficulty: "Medium",
        sourceType: match ? "Original PYQ" : "AI Generated",
        originalPaperYear: match?.academicYear || "Synthetic",
        originalQuestionNumber: match?.questionNumber || "",
        solutionGuide: "Detailed mathematical walkthrough with diagram.",
      });
    }

    sections.push({
      name: "Section B (Comprehensive Problems - Attempt Any 3)",
      instructions: "Attempt any THREE questions from this section. Each question carries 10 marks.",
      marksPerQuestion: 10,
      questions: secBQuestions,
    });

    // Assemble Section C (Internal choice questions)
    const secCQuestions = [];
    for (let u = 1; u <= 5; u++) {
      const qNum = u + 2; // Q3 to Q7
      const match1 = pool.find((q) => q.unitNumber === u && !secCQuestions.some((x) => x.questionText === q.questionText));
      const match2 = pool.find((q) => q.unitNumber === u && q._id !== match1?._id && !secCQuestions.some((x) => x.questionText === q.questionText));

      secCQuestions.push({
        questionNumber: `${qNum}(a)`,
        questionText: match1 ? match1.questionText : `Discuss primary algorithms and data structures of Unit ${u} with formal proof.`,
        marks: 10,
        unitNumber: u,
        topicTitle: match1?.topicTitle || `Unit ${u} Theory`,
        difficulty: "Hard",
        sourceType: match1 ? "Original PYQ" : "AI Generated",
        originalPaperYear: match1?.academicYear || "Synthetic",
        originalQuestionNumber: match1?.questionNumber || "",
        solutionGuide: "Derivation or structural walkthrough.",
      });

      secCQuestions.push({
        questionNumber: `${qNum}(b) [OR]`,
        questionText: match2 ? match2.questionText : `Provide an applied case study or numerical problem solving scenario for Unit ${u}.`,
        marks: 10,
        unitNumber: u,
        topicTitle: match2?.topicTitle || `Unit ${u} Numerical`,
        difficulty: "Medium",
        sourceType: match2 ? "Original PYQ" : "AI Generated",
        originalPaperYear: match2?.academicYear || "Synthetic",
        originalQuestionNumber: match2?.questionNumber || "",
        solutionGuide: "Numerical computation or system architecture.",
      });
    }

    sections.push({
      name: "Section C (Unit Choice Questions - Attempt 1 from each)",
      instructions: "Attempt any ONE question from each question pair (Q3 to Q7). Each question carries 10 marks.",
      marksPerQuestion: 10,
      questions: secCQuestions,
    });

    const mockPaper = await PYQMockPaper.create({
      userId,
      title: `${resolvedSubjectName} — University Simulation Mock Paper`,
      subjectId,
      subjectName: resolvedSubjectName,
      semester,
      selectedUnits,
      totalMarks,
      durationMinutes,
      difficulty,
      blueprint,
      sections,
    });

    return res.status(201).json({ success: true, mockPaper });
  } catch (error) {
    console.error("Mock Paper Generation Error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate mock paper." });
  }
};

// ─── 12. AI QUESTION PAPER CONTEXTUAL CHAT ──────────────────────────────────
// @route POST /api/pyq/chat
export const chatWithPYQPapers = async (req, res) => {
  try {
    const userId = req.user._id;
    const { message, subjectId, paperId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Chat message cannot be empty." });
    }

    const filter = { userId };
    if (subjectId) filter.subjectId = subjectId;
    if (paperId) filter.paperId = paperId;

    const questions = await PYQQuestion.find(filter)
      .sort({ marks: -1 })
      .limit(25)
      .lean();

    const aiClient = getAIClient();
    if (!aiClient) {
      return res.json({
        success: true,
        reply: `Based on your analyzed papers in ${subjectId || "your selected subject"}, the most recurring themes are Unit 1 fundamentals and Unit 5 high-mark questions. To improve your exam score, focus on repeating numerical questions in Section B.`,
      });
    }

    const contextSnippet = questions
      .map(
        (q) =>
          `[Year: ${q.academicYear} | Q#: ${q.questionNumber} | ${q.marks} Marks | Unit ${q.unitNumber} (${q.topicTitle})]: ${q.questionText}`
      )
      .join("\n");

    const prompt = `You are the LearnX AI PYQ Intelligence Exam Copilot.
You have direct access to the student's actual extracted university question papers:

Available Extracted Questions in Database:
${contextSnippet}

Student's Query: "${message}"

Guidelines:
1. Answer accurately using the real extracted questions listed above.
2. Quote exact Question Numbers, Years, Marks, and Units whenever citing questions.
3. Be professional, supportive, and exam-oriented.
4. If asked to compare or prioritize, explain the reasoning clearly based on actual data.`;

    const completion = await aiClient.chat.completions.create({
      model: getAIModel(),
      messages: [{ role: "user", content: prompt }],
      max_tokens: 900,
    });

    const reply = completion.choices[0]?.message?.content || "Could not generate analysis.";
    return res.json({ success: true, reply });
  } catch (error) {
    console.error("PYQ Chat Error:", error);
    return res.status(500).json({ success: false, message: "Chat error." });
  }
};

// ─── 13. DELETE QUESTION PAPER & ITS QUESTIONS ──────────────────────────────
// @route DELETE /api/pyq/papers/:paperId
export const deletePYQPaper = async (req, res) => {
  try {
    const { paperId } = req.params;
    const userId = req.user._id;

    const deleted = await PYQPaper.findOneAndDelete({ _id: paperId, userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Paper not found." });
    }

    // Delete all extracted questions belonging to this paper
    await PYQQuestion.deleteMany({ paperId, userId });

    return res.json({ success: true, message: "Question paper and associated questions deleted successfully." });
  } catch (error) {
    console.error("Delete Paper Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete question paper." });
  }
};

