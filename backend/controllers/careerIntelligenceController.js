import ResumeAnalysis from "../models/ResumeAnalysis.js";
import CareerProfile from "../models/CareerProfile.js";
import TestResult from "../models/TestResult.js";
import TopicProgress from "../models/TopicProgress.js";
import {
  executeAIResumeAnalysis,
  matchResumeAgainstJobDescription,
  executeAIStudioRewrite,
  askCareerCopilot,
} from "../services/careerIntelligenceService.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// ─── 1. GET FULL CAREER INTELLIGENCE DASHBOARD ──────────────────────────────
// @route GET /api/career-intelligence/profile
export const getCareerIntelligenceProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch latest Resume Analysis
    const latestAnalysis = await ResumeAnalysis.findOne({ user: userId, isArchived: false })
      .sort({ updatedAt: -1 })
      .lean();

    // Fetch user Career Profile & Test telemetry
    const [careerProfile, testResults, topicsProgress] = await Promise.all([
      CareerProfile.findOne({ user: userId }).lean(),
      TestResult.find({ user: userId }).lean(),
      TopicProgress.find({ user: userId }).lean(),
    ]);

    const targetRole = latestAnalysis?.targetRole || careerProfile?.targetRole || "Full Stack Software Engineer";

    // Calculate dynamic 5-Pillar Career Readiness
    const academicAvg = testResults.length > 0
      ? Math.round(testResults.reduce((acc, t) => acc + (t.scorePercent || 70), 0) / testResults.length)
      : 74;

    const completedTopicsCount = topicsProgress.filter((p) => p.isCompleted).length;
    const technicalReadiness = Math.min(96, Math.max(50, Math.round(academicAvg * 0.6 + Math.min(40, completedTopicsCount * 2))));
    const resumeReadiness = latestAnalysis?.overallQualityScore || careerProfile?.atsScore || 68;
    const projectReadiness = latestAnalysis?.sections?.projects?.score || 72;
    const communicationReadiness = latestAnalysis?.sections?.summary?.score || 75;
    const interviewReadiness = careerProfile?.mockInterviewScore || 70;

    const overallReadinessScore = Math.round(
      technicalReadiness * 0.3 +
      projectReadiness * 0.25 +
      resumeReadiness * 0.2 +
      interviewReadiness * 0.15 +
      communicationReadiness * 0.1
    );

    res.json({
      success: true,
      profile: {
        targetRole,
        overallReadinessScore,
        confidenceLevel: testResults.length > 3 ? "High (Empirically Verified)" : "Calibrated (Based on Resume & Initial Diagnostics)",
        pillars: {
          technicalReadiness,
          projectReadiness,
          resumeReadiness,
          interviewReadiness,
          communicationReadiness,
        },
        resumeAnalysis: latestAnalysis || null,
        careerProfile: careerProfile || null,
      },
    });
  } catch (err) {
    console.error("getCareerIntelligenceProfile error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── 2. UPLOAD & RUN COMPLETE RESUME INTELLIGENCE ───────────────────────────
// @route POST /api/career-intelligence/analyze-file
export const uploadAndAnalyzeFullResume = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetRole = "Full Stack Software Engineer" } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a valid resume file (PDF, DOCX, or TXT)." });
    }

    let extractedText = "";
    const fileName = req.file.originalname || "resume";
    const fileExt = fileName.split(".").pop().toLowerCase();

    if (fileExt === "pdf") {
      const pdfParseModule = require("pdf-parse");
      const pdfData = await pdfParseModule(req.file.buffer);
      extractedText = pdfData.text || "";
    } else if (fileExt === "docx" || fileExt === "doc") {
      const mammoth = require("mammoth");
      const docData = await mammoth.extractRawText({ buffer: req.file.buffer });
      extractedText = docData.value || "";
    } else {
      extractedText = req.file.buffer.toString("utf-8");
    }

    if (!extractedText || extractedText.trim().length < 40) {
      return res.status(400).json({
        success: false,
        message: "Could not extract readable text from the uploaded document. Ensure it is not a flat image.",
      });
    }

    // Run AI Intelligence Engine
    const analysisResult = await executeAIResumeAnalysis(extractedText, targetRole);

    // Save initial version
    const initialVersion = {
      versionNumber: 1,
      label: "Uploaded Original",
      targetRole,
      parsedData: analysisResult.parsedData,
      fullText: extractedText,
      savedAt: new Date(),
    };

    // Upsert / Create ResumeAnalysis document
    const analysisDoc = await ResumeAnalysis.create({
      user: userId,
      originalFileName: fileName,
      fileType: fileExt === "docx" || fileExt === "doc" ? "docx" : fileExt === "pdf" ? "pdf" : "text",
      fileSize: req.file.size || 0,
      rawText: extractedText,
      targetRole,
      activeVersion: 1,
      versions: [initialVersion],
      overallQualityScore: analysisResult.overallQualityScore,
      atsCompatibilityScore: analysisResult.atsCompatibilityScore,
      recruiterReadabilityScore: analysisResult.recruiterReadabilityScore,
      sections: analysisResult.sections,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      actionableImprovementPlan: analysisResult.actionableImprovementPlan,
      languageFeedback: analysisResult.languageFeedback,
      skillGaps: analysisResult.skillGaps,
      interviewQuestions: analysisResult.interviewQuestions,
    });

    // Update CareerProfile
    await CareerProfile.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          targetRole,
          resumeText: extractedText,
          atsScore: analysisResult.atsCompatibilityScore,
        },
      },
      { upsert: true }
    );

    res.json({
      success: true,
      message: "Resume analyzed successfully with LearnX Career Intelligence.",
      analysis: analysisDoc,
    });
  } catch (err) {
    console.error("uploadAndAnalyzeFullResume error:", err);
    res.status(500).json({ success: false, message: "Resume analysis failed: " + err.message });
  }
};

// ─── 3. MATCH RESUME WITH JOB DESCRIPTION ───────────────────────────────────
// @route POST /api/career-intelligence/match-job
export const matchJobDescription = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobTitle, company, jobDescription, targetRole } = req.body;

    if (!jobDescription || jobDescription.trim().length < 30) {
      return res.status(400).json({ success: false, message: "Please provide a detailed job description to match against." });
    }

    const latestAnalysis = await ResumeAnalysis.findOne({ user: userId, isArchived: false }).sort({ updatedAt: -1 });
    const resumeText = latestAnalysis?.rawText || req.body.resumeText;

    if (!resumeText) {
      return res.status(400).json({ success: false, message: "Please upload or analyze a resume first before running job matching." });
    }

    const roleToMatch = targetRole || latestAnalysis?.targetRole || "Software Engineer";
    const matchResult = await matchResumeAgainstJobDescription(resumeText, jobDescription, roleToMatch);

    const newMatchEntry = {
      jobTitle: jobTitle || roleToMatch,
      targetRole: roleToMatch,
      company: company || "Target Employer",
      rawDescription: jobDescription,
      matchPercentage: matchResult.matchPercentage,
      confidence: matchResult.confidence || "High",
      matchingSkills: matchResult.matchingSkills || [],
      missingSkills: matchResult.missingSkills || [],
      partialMatches: matchResult.partialMatches || [],
      missingKeywords: matchResult.missingKeywords || [],
      recommendations: matchResult.recommendations || [],
      comparedAt: new Date(),
    };

    if (latestAnalysis) {
      latestAnalysis.jobMatches.unshift(newMatchEntry);
      if (latestAnalysis.jobMatches.length > 15) {
        latestAnalysis.jobMatches = latestAnalysis.jobMatches.slice(0, 15);
      }
      await latestAnalysis.save();
    }

    res.json({
      success: true,
      jobMatch: newMatchEntry,
    });
  } catch (err) {
    console.error("matchJobDescription error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── 4. AI RESUME STUDIO: REWRITE SECTION / BULLET ──────────────────────────
// @route POST /api/career-intelligence/studio-rewrite
export const studioRewrite = async (req, res) => {
  try {
    const { sectionName, currentContent, targetRole, instruction } = req.body;

    if (!currentContent || currentContent.trim().length < 5) {
      return res.status(400).json({ success: false, message: "Please provide content to rewrite." });
    }

    const rewriteResult = await executeAIStudioRewrite({
      sectionName: sectionName || "Experience Bullet",
      currentContent,
      targetRole: targetRole || "Full Stack Software Engineer",
      instruction,
    });

    res.json({
      success: true,
      rewrite: rewriteResult,
    });
  } catch (err) {
    console.error("studioRewrite error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── 5. SAVE RESUME VERSION (Studio Versioning) ─────────────────────────────
// @route POST /api/career-intelligence/save-version
export const saveResumeVersion = async (req, res) => {
  try {
    const userId = req.user._id;
    const { label, parsedData, fullText, targetRole } = req.body;

    const analysis = await ResumeAnalysis.findOne({ user: userId, isArchived: false }).sort({ updatedAt: -1 });
    if (!analysis) {
      return res.status(404).json({ success: false, message: "Resume analysis record not found." });
    }

    const nextVer = (analysis.versions?.length || 0) + 1;
    const newVersion = {
      versionNumber: nextVer,
      label: label || `Version ${nextVer}`,
      targetRole: targetRole || analysis.targetRole,
      parsedData: parsedData || analysis.versions[0]?.parsedData,
      fullText: fullText || analysis.rawText,
      savedAt: new Date(),
    };

    analysis.versions.push(newVersion);
    analysis.activeVersion = nextVer;
    await analysis.save();

    res.json({
      success: true,
      message: `Saved ${newVersion.label} successfully.`,
      activeVersion: nextVer,
      versions: analysis.versions,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── 6. AI CAREER COPILOT CHAT ──────────────────────────────────────────────
// @route POST /api/career-intelligence/copilot
export const chatWithCareerCopilot = async (req, res) => {
  try {
    const userId = req.user._id;
    const { query, chatHistory = [] } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, message: "Query message is required." });
    }

    const latestAnalysis = await ResumeAnalysis.findOne({ user: userId, isArchived: false }).sort({ updatedAt: -1 }).lean();
    const reply = await askCareerCopilot({
      query,
      candidateProfile: latestAnalysis || {},
      chatHistory,
    });

    res.json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error("chatWithCareerCopilot error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── 7. DELETE RESUME & ASSOCIATED DATA (Privacy Compliance) ────────────────
// @route DELETE /api/career-intelligence/resume/:id
export const deleteResumeData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const deleted = await ResumeAnalysis.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Resume record not found or unauthorized." });
    }

    // Reset CareerProfile resume text
    await CareerProfile.findOneAndUpdate({ user: userId }, { $set: { resumeText: "", atsScore: 65 } });

    res.json({ success: true, message: "Resume and analysis data permanently deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
