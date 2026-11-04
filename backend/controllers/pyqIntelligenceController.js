import PYQPaper from "../models/PYQPaper.js";
import PYQQuestion from "../models/PYQQuestion.js";
import PYQMockPaper from "../models/PYQMockPaper.js";
import { extractDocumentText, segmentQuestionsFromText } from "../services/pyqExtractionService.js";
import { mapQuestionToSyllabus, computeQuestionSimilarity } from "../services/pyqSyllabusService.js";
import {
  generateExamAnswerForQuestion,
  generateAIPracticeQuestions,
  askPYQChat,
} from "../services/pyqAIService.js";

// ── 1. GET DASHBOARD METRICS ──────────────────────────────────────────────────
export const getPYQDashboardMetrics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { subjectId } = req.query;

    const paperFilter = { userId };
    const questionFilter = { userId };
    if (subjectId) {
      paperFilter.subjectId = subjectId;
      questionFilter.subjectId = subjectId;
    }

    const [papers, questions, mockPapers] = await Promise.all([
      PYQPaper.find(paperFilter).sort({ createdAt: -1 }).lean(),
      PYQQuestion.find(questionFilter).lean(),
      PYQMockPaper.find({ userId }).sort({ createdAt: -1 }).lean(),
    ]);

    const subjectsSet = new Set(papers.map((p) => p.subjectId).filter(Boolean));
    const unitsSet = new Set(questions.map((q) => q.unitId).filter(Boolean));
    const repeatedQuestions = questions.filter(
      (q) => q.isExactDuplicate || q.isConceptuallySimilar || q.similarQuestionCount > 0
    );

    // Group questions by unit
    const unitStats = {};
    const topicStats = {};
    const yearStats = {};
    const typeStats = {};

    questions.forEach((q) => {
      // Unit stats
      const uKey = q.unitName || q.unitId || "General";
      unitStats[uKey] = (unitStats[uKey] || 0) + 1;

      // Topic stats
      if (q.topicTitle) {
        topicStats[q.topicTitle] = (topicStats[q.topicTitle] || 0) + 1;
      }

      // Year stats
      const yKey = q.academicYear || "Unknown";
      yearStats[yKey] = (yearStats[yKey] || 0) + 1;

      // Type stats
      const tKey = q.questionType || "Long Answer";
      typeStats[tKey] = (typeStats[tKey] || 0) + 1;
    });

    const unitDistribution = Object.entries(unitStats).map(([name, count]) => ({ name, count }));
    const topicDistribution = Object.entries(topicStats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
    const yearDistribution = Object.entries(yearStats).map(([name, count]) => ({ name, count }));
    const typeDistribution = Object.entries(typeStats).map(([name, count]) => ({ name, count }));

    // Preparation status breakdown
    const prepBreakdown = {
      notStarted: questions.filter((q) => q.prepStatus === "Not Started").length,
      learning: questions.filter((q) => q.prepStatus === "Learning").length,
      revised: questions.filter((q) => q.prepStatus === "Revised").length,
      confident: questions.filter((q) => q.prepStatus === "Confident").length,
    };

    return res.json({
      success: true,
      metrics: {
        papersAnalyzed: papers.length,
        questionsExtracted: questions.length,
        repeatedQuestionsFound: repeatedQuestions.length,
        subjectsAnalyzed: subjectsSet.size,
        unitsCovered: unitsSet.size,
        mockPapersGenerated: mockPapers.length,
      },
      papers: papers.slice(0, 10),
      charts: {
        unitDistribution,
        topicDistribution,
        yearDistribution,
        typeDistribution,
      },
      prepBreakdown,
    });
  } catch (err) {
    console.error("PYQ Dashboard metrics error:", err);
    return res.status(500).json({ success: false, message: "Failed to load dashboard metrics" });
  }
};

// ── 2. UPLOAD & PROCESS PYQ PAPER ─────────────────────────────────────────────
export const uploadAndProcessPaper = async (req, res) => {
  try {
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "No file provided for upload" });
    }

    const {
      university = "AKTU",
      course = "B.Tech",
      branch = "Computer Science & Engineering",
      semester = 3,
      subjectId = "dsa",
      subjectName = "Data Structures & Algorithms",
      subjectCode = "KCS-301",
      academicYear = "2023-2024",
      examType = "End Semester",
    } = req.body;

    // 1. Create Paper record
    const paper = new PYQPaper({
      userId,
      university,
      course,
      branch,
      semester: Number(semester),
      subjectId,
      subjectName,
      subjectCode,
      academicYear,
      examType,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      processingStatus: "Extracting Text",
      progressPercent: 20,
      statusMessage: "Reading document contents...",
    });

    await paper.save();

    // 2. Perform Extraction (Synchronous in request or async)
    const docResult = await extractDocumentText(file.buffer, file.mimetype);
    paper.rawText = docResult.text || "";
    paper.pageCount = docResult.pageCount || 1;
    paper.processingStatus = "Identifying Questions";
    paper.progressPercent = 50;
    paper.statusMessage = "Segmenting questions and boundary markers...";
    await paper.save();

    // 3. Segment Questions
    const rawQuestions = segmentQuestionsFromText(paper.rawText, {
      academicYear,
      university,
      subjectId,
      subjectName,
    });

    paper.processingStatus = "Mapping Syllabus";
    paper.progressPercent = 75;
    paper.statusMessage = `Mapping ${rawQuestions.length} extracted questions to curriculum topics...`;
    await paper.save();

    // 4. Map questions to LearnX curriculum & insert
    const insertedQuestions = [];
    const existingSubjectQuestions = await PYQQuestion.find({ userId, subjectId }).lean();

    for (const rq of rawQuestions) {
      const mapping = await mapQuestionToSyllabus(rq.questionText, subjectId);

      // Check duplicates against existing questions in this subject
      let isExact = false;
      let isSimilar = false;
      let matchedId = null;

      for (const ex of existingSubjectQuestions) {
        const sim = computeQuestionSimilarity(rq.questionText, ex.questionText);
        if (sim.isExact) {
          isExact = true;
          matchedId = ex._id;
          break;
        } else if (sim.isConceptuallySimilar) {
          isSimilar = true;
          matchedId = ex._id;
        }
      }

      // Priority calculation
      let priorityLevel = "Medium Priority";
      let priorityReason = "Standard curriculum topic";
      if (isExact || isSimilar) {
        priorityLevel = "High Priority";
        priorityReason = "Frequently observed across multiple previous exam cycles";
      } else if (mapping.mappingConfidence > 0.6) {
        priorityLevel = "High Priority";
        priorityReason = `Core high-yield topic in ${mapping.topicTitle || "curriculum"}`;
      }

      const qDoc = new PYQQuestion({
        userId,
        paperId: paper._id,
        subjectId,
        subjectName,
        university,
        academicYear,
        examType,
        questionNumber: rq.questionNumber,
        rawQuestionText: rq.rawQuestionText,
        questionText: rq.questionText,
        marks: rq.marks,
        pageNumber: rq.pageNumber,
        questionType: rq.questionType,
        difficulty: rq.difficulty,

        unitId: mapping.unitId,
        unitName: mapping.unitName,
        chapterId: mapping.chapterId,
        chapterName: mapping.chapterName,
        topicId: mapping.topicId,
        topicTitle: mapping.topicTitle,
        subtopics: mapping.subtopics,
        mappingConfidence: mapping.mappingConfidence,
        mappingEvidence: mapping.mappingEvidence,
        verificationStatus: mapping.verificationStatus,
        suggestedTopics: mapping.suggestedTopics,

        isExactDuplicate: isExact,
        isConceptuallySimilar: isSimilar,
        similarQuestionCount: isExact || isSimilar ? 1 : 0,
        matchedQuestionIds: matchedId ? [matchedId] : [],
        priorityLevel,
        priorityReason,
      });

      await qDoc.save();
      insertedQuestions.push(qDoc);
    }

    // 5. Finalize Paper Status
    paper.extractedQuestionCount = insertedQuestions.length;
    paper.mappedQuestionCount = insertedQuestions.filter(
      (q) => q.verificationStatus === "Auto Mapped"
    ).length;
    paper.processingStatus = "Analysis Complete";
    paper.progressPercent = 100;
    paper.statusMessage = `Analysis complete! Successfully extracted ${insertedQuestions.length} questions.`;
    await paper.save();

    return res.json({
      success: true,
      paper,
      questionsCount: insertedQuestions.length,
    });
  } catch (err) {
    console.error("Upload & Process PYQ error:", err);
    return res.status(500).json({ success: false, message: `Processing failed: ${err.message}` });
  }
};

// ── 3. LIST EXTRACTED QUESTIONS WITH ADVANCED FILTERS ──────────────────────────
export const getPYQQuestions = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      subjectId,
      paperId,
      unitId,
      topicId,
      questionType,
      difficulty,
      marks,
      priorityLevel,
      prepStatus,
      search,
    } = req.query;

    const filter = { userId };
    if (subjectId) filter.subjectId = subjectId;
    if (paperId) filter.paperId = paperId;
    if (unitId) filter.unitId = unitId;
    if (topicId) filter.topicId = topicId;
    if (questionType) filter.questionType = questionType;
    if (difficulty) filter.difficulty = difficulty;
    if (marks) filter.marks = Number(marks);
    if (priorityLevel) filter.priorityLevel = priorityLevel;
    if (prepStatus) filter.prepStatus = prepStatus;

    if (search) {
      filter.$text = { $search: search };
    }

    const questions = await PYQQuestion.find(filter)
      .sort({ createdAt: -1 })
      .populate("paperId", "fileName academicYear examType")
      .lean();

    return res.json({ success: true, count: questions.length, questions });
  } catch (err) {
    console.error("Get PYQ questions error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch questions" });
  }
};

// ── 4. UPDATE QUESTION PREPARATION STATUS OR MANUAL SYLLABUS CORRECTION ─────
export const updatePYQQuestion = async (req, res) => {
  try {
    const userId = req.user._id;
    const { questionId } = req.params;
    const {
      prepStatus,
      userNotes,
      topicId,
      topicTitle,
      unitId,
      unitName,
      verificationStatus,
    } = req.body;

    const updates = {};
    if (prepStatus) {
      updates.prepStatus = prepStatus;
      updates.lastRevisedAt = new Date();
    }
    if (userNotes !== undefined) updates.userNotes = userNotes;
    if (topicId) updates.topicId = topicId;
    if (topicTitle) updates.topicTitle = topicTitle;
    if (unitId) updates.unitId = unitId;
    if (unitName) updates.unitName = unitName;
    if (verificationStatus) updates.verificationStatus = verificationStatus;

    const updated = await PYQQuestion.findOneAndUpdate(
      { _id: questionId, userId },
      { $set: updates },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    return res.json({ success: true, question: updated });
  } catch (err) {
    console.error("Update PYQ Question error:", err);
    return res.status(500).json({ success: false, message: "Failed to update question" });
  }
};

// ── 5. AI EXAM ANSWER STUDIO ──────────────────────────────────────────────────
export const getAIExamAnswer = async (req, res) => {
  try {
    const userId = req.user._id;
    const { questionId } = req.params;
    const { marks = 5, mode = "standard" } = req.body;

    const question = await PYQQuestion.findOne({ _id: questionId, userId });
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    const answer = await generateExamAnswerForQuestion({
      questionText: question.questionText,
      marks: Number(marks) || question.marks || 5,
      subjectName: question.subjectName,
      topicTitle: question.topicTitle,
      mode,
    });

    return res.json({
      success: true,
      questionId,
      questionText: question.questionText,
      marks,
      mode,
      answer,
    });
  } catch (err) {
    console.error("AI Exam Answer error:", err);
    return res.status(500).json({ success: false, message: "Failed to generate answer" });
  }
};

// ── 6. REPEATED QUESTIONS INTELLIGENCE ────────────────────────────────────────
export const getRepeatedQuestions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { subjectId } = req.query;

    const filter = {
      userId,
      $or: [{ isExactDuplicate: true }, { isConceptuallySimilar: true }, { similarQuestionCount: { $gt: 0 } }],
    };
    if (subjectId) filter.subjectId = subjectId;

    const repeated = await PYQQuestion.find(filter)
      .populate("paperId", "fileName academicYear examType")
      .populate("matchedQuestionIds", "questionNumber questionText academicYear marks")
      .sort({ marks: -1 })
      .lean();

    return res.json({ success: true, count: repeated.length, questions: repeated });
  } catch (err) {
    console.error("Get repeated questions error:", err);
    return res.status(500).json({ success: false, message: "Failed to load repeated questions" });
  }
};

// ── 7. GENERATE AI MOCK PAPER ────────────────────────────────────────────────
export const generateMockPaper = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      subjectId = "dsa",
      subjectName = "Data Structures & Algorithms",
      totalMarks = 70,
      durationMinutes = 180,
      difficulty = "Medium",
      units = [],
    } = req.body;

    // Fetch existing PYQs for this subject
    const pyqs = await PYQQuestion.find({ userId, subjectId }).lean();

    // Group questions into university style sections
    // Section A: 7 Short questions (2 marks each = 14 marks)
    // Section B: 3 Medium questions out of 5 (7 marks each = 21 marks)
    // Section C: 5 Long questions (7 marks each = 35 marks)
    const shortPool = pyqs.filter((q) => q.marks <= 3 || q.questionType === "Short Answer");
    const mediumPool = pyqs.filter((q) => q.marks > 3 && q.marks <= 7);
    const longPool = pyqs.filter((q) => q.marks > 7 || q.questionType === "Long Answer");

    const sample = (arr, count) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const sectionAQuestions = (shortPool.length >= 7 ? sample(shortPool, 7) : pyqs.slice(0, 7)).map(
      (q, idx) => ({
        questionNumber: `1.${String.fromCharCode(97 + idx)}`,
        questionText: q.questionText,
        marks: 2,
        unitId: q.unitId,
        unitName: q.unitName,
        topicId: q.topicId,
        topicTitle: q.topicTitle,
        questionType: "Short Answer",
        isAiGenerated: false,
        sourcePYQId: q._id,
        sourcePaperYear: q.academicYear,
      })
    );

    const sectionBQuestions = (mediumPool.length >= 5 ? sample(mediumPool, 5) : pyqs.slice(2, 7)).map(
      (q, idx) => ({
        questionNumber: `2.${String.fromCharCode(97 + idx)}`,
        questionText: q.questionText,
        marks: 7,
        unitId: q.unitId,
        unitName: q.unitName,
        topicId: q.topicId,
        topicTitle: q.topicTitle,
        questionType: "Medium Answer",
        isAiGenerated: false,
        sourcePYQId: q._id,
        sourcePaperYear: q.academicYear,
      })
    );

    const sectionCQuestions = (longPool.length >= 5 ? sample(longPool, 5) : pyqs.slice(0, 5)).map(
      (q, idx) => ({
        questionNumber: `${3 + idx}`,
        questionText: q.questionText,
        marks: 7,
        unitId: q.unitId,
        unitName: q.unitName,
        topicId: q.topicId,
        topicTitle: q.topicTitle,
        questionType: "Long Answer",
        isAiGenerated: false,
        sourcePYQId: q._id,
        sourcePaperYear: q.academicYear,
      })
    );

    const mockPaper = new PYQMockPaper({
      userId,
      title: `${subjectName} University Mock Examination`,
      subjectId,
      subjectName,
      totalMarks,
      durationMinutes,
      difficulty,
      unitsCovered: units,
      blueprint: {
        sections: [
          { sectionName: "Section A", description: "Short Compulsory Questions", totalQuestions: 7, attemptRequired: 7, marksPerQuestion: 2 },
          { sectionName: "Section B", description: "Analytical & Problem Solving", totalQuestions: 5, attemptRequired: 3, marksPerQuestion: 7 },
          { sectionName: "Section C", description: "In-depth Long Design & Proof Questions", totalQuestions: 5, attemptRequired: 5, marksPerQuestion: 7 },
        ],
      },
      sections: [
        { sectionName: "Section A (Compulsory Short Answers)", instructions: "Attempt all questions (2 Marks each).", marksPerQuestion: 2, questions: sectionAQuestions },
        { sectionName: "Section B (Attempt Any 3)", instructions: "Attempt any three questions (7 Marks each).", marksPerQuestion: 7, questions: sectionBQuestions },
        { sectionName: "Section C (Attempt All Questions)", instructions: "Attempt all questions (7 Marks each).", marksPerQuestion: 7, questions: sectionCQuestions },
      ],
    });

    await mockPaper.save();

    return res.json({ success: true, mockPaper });
  } catch (err) {
    console.error("Generate mock paper error:", err);
    return res.status(500).json({ success: false, message: "Failed to generate mock paper" });
  }
};

// ── 8. AI PYQ CONTEXTUAL CHAT ─────────────────────────────────────────────────
export const chatWithPYQs = async (req, res) => {
  try {
    const userId = req.user._id;
    const { query, subjectId = "dsa", subjectName = "Data Structures & Algorithms" } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, message: "Query text is required" });
    }

    const [papers, questions] = await Promise.all([
      PYQPaper.find({ userId, subjectId }).lean(),
      PYQQuestion.find({ userId, subjectId }).limit(30).lean(),
    ]);

    const paperSummary = {
      totalPapers: papers.length,
      years: papers.map((p) => p.academicYear),
      examTypes: papers.map((p) => p.examType),
    };

    const reply = await askPYQChat({
      query,
      subjectName,
      paperSummary,
      extractedQuestions: questions,
    });

    return res.json({ success: true, response: reply });
  } catch (err) {
    console.error("Chat with PYQs error:", err);
    return res.status(500).json({ success: false, message: "Chat assistance failed" });
  }
};

// ── 9. DELETE PAPER & ASSOCIATED QUESTIONS ───────────────────────────────────
export const deletePYQPaper = async (req, res) => {
  try {
    const userId = req.user._id;
    const { paperId } = req.params;

    const paper = await PYQPaper.findOne({ _id: paperId, userId });
    if (!paper) {
      return res.status(404).json({ success: false, message: "Paper not found" });
    }

    await Promise.all([
      PYQPaper.deleteOne({ _id: paperId, userId }),
      PYQQuestion.deleteMany({ paperId, userId }),
    ]);

    return res.json({ success: true, message: "Paper and associated questions removed successfully" });
  } catch (err) {
    console.error("Delete PYQ paper error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete paper" });
  }
};

