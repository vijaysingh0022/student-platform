import mongoose from "mongoose";

const sectionScoreSchema = new mongoose.Schema({
  score: { type: Number, default: 70 },
  weight: { type: Number, default: 15 },
  status: { type: String, default: "Good" },
  feedback: { type: String, default: "" },
  strengths: { type: [String], default: [] },
  improvements: { type: [String], default: [] },
}, { _id: false });

const jobMatchSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  targetRole: { type: String, default: "" },
  company: { type: String, default: "" },
  rawDescription: { type: String, required: true },
  matchPercentage: { type: Number, required: true, default: 0 },
  confidence: { type: String, enum: ["High", "Medium", "Calibrated"], default: "High" },
  matchingSkills: [{ name: String, category: String, evidenceInResume: String }],
  missingSkills: [{ name: String, category: String, importance: { type: String, enum: ["Must-have", "Preferred", "Good-to-have"], default: "Must-have" } }],
  partialMatches: [{ skill: String, context: String }],
  missingKeywords: [String],
  recommendations: [String],
  comparedAt: { type: Date, default: Date.now },
});

const resumeVersionSchema = new mongoose.Schema({
  versionNumber: { type: Number, default: 1 },
  label: { type: String, default: "Version 1" },
  targetRole: { type: String, default: "Full Stack Software Engineer" },
  parsedData: {
    personalInfo: {
      fullName: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },
    summary: { type: String, default: "" },
    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startYear: String,
        endYear: String,
        gradeOrGpa: String,
      },
    ],
    skills: {
      technical: [String],
      frameworks: [String],
      databases: [String],
      toolsAndCloud: [String],
      softSkills: [String],
    },
    experience: [
      {
        company: String,
        role: String,
        duration: String,
        location: String,
        bullets: [String],
      },
    ],
    projects: [
      {
        title: String,
        techStack: [String],
        liveLink: String,
        githubLink: String,
        bullets: [String],
      },
    ],
    certifications: [String],
    achievements: [String],
  },
  fullText: { type: String, default: "" },
  savedAt: { type: Date, default: Date.now },
});

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    originalFileName: { type: String, default: "resume.pdf" },
    fileType: { type: String, enum: ["pdf", "docx", "text"], default: "pdf" },
    fileSize: { type: Number, default: 0 },
    rawText: { type: String, required: true },

    // Active version and version history
    activeVersion: { type: Number, default: 1 },
    versions: [resumeVersionSchema],

    // Targeted role for this analysis
    targetRole: { type: String, default: "Full Stack Software Engineer", index: true },

    // Comprehensive Scores (0 - 100)
    overallQualityScore: { type: Number, default: 0 },
    atsCompatibilityScore: { type: Number, default: 0 },
    recruiterReadabilityScore: { type: Number, default: 0 },
    scoringMethodologyNote: {
      type: String,
      default: "Scored using LearnX AI Rubrics (Impact, Hard Skill Density, Formatting, Measurable Metrics). Internal LearnX benchmarking, not an official corporate ATS pass guarantee.",
    },

    // Section-wise Breakdown
    sections: {
      contactInfo: sectionScoreSchema,
      summary: sectionScoreSchema,
      technicalSkills: sectionScoreSchema,
      workExperience: sectionScoreSchema,
      projects: sectionScoreSchema,
      education: sectionScoreSchema,
      formattingAndStructure: sectionScoreSchema,
    },

    // Detailed Diagnostic Feedback
    strengths: [String],
    weaknesses: [String],
    actionableImprovementPlan: [
      {
        priority: { type: String, default: "High" },
        category: String,
        action: String,
        reason: String,
      },
    ],

    // Grammar & Language Checks
    languageFeedback: {
      actionVerbCount: { type: Number, default: 0 },
      passiveVoiceDetected: { type: Number, default: 0 },
      weakBullets: [String],
      recommendedVerbs: [String],
    },

    // Job Description Matching History
    jobMatches: [jobMatchSchema],

    // Connected LearnX Skill Gap Roadmaps
    skillGaps: [
      {
        skill: String,
        category: String,
        urgency: { type: String, default: "Critical" },
        matchedLearnXSubjectId: String,
        matchedLearnXTopicId: String,
        matchedLearnXTopicTitle: String,
        isCompletedInLearnX: { type: Boolean, default: false },
      },
    ],

    // Generated Interview Questions derived from student's resume
    interviewQuestions: [
      {
        questionId: String,
        question: String,
        category: { type: String, default: "Project Deep-Dive" },
        sourceContext: String, // Which project or skill in resume inspired this
        difficulty: { type: String, default: "Medium" },
        idealAnswerRubric: String,
      },
    ],

    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ResumeAnalysis = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
export default ResumeAnalysis;
