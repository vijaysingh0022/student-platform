import mongoose from "mongoose";

const repoTechnologySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["language", "framework", "database", "devops", "testing", "tool", "other"],
      default: "other",
    },
    bytes: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
  },
  { _id: false }
);

const repoQualityAuditSchema = new mongoose.Schema(
  {
    score: { type: Number, default: 0 }, // 0 to 100
    grade: { type: String, enum: ["A+", "A", "B", "C", "D"], default: "B" },
    
    // Concrete Verified Observations
    hasReadme: { type: Boolean, default: false },
    readmeWordCount: { type: Number, default: 0 },
    readmeHasBadges: { type: Boolean, default: false },
    readmeHasInstallGuide: { type: Boolean, default: false },
    readmeHasArchitecture: { type: Boolean, default: false },
    
    hasLicense: { type: Boolean, default: false },
    licenseType: { type: String, default: "" },
    
    hasTests: { type: Boolean, default: false },
    testFrameworks: [{ type: String }], // Jest, PyTest, JUnit, Mocha, etc.
    testFileCount: { type: Number, default: 0 },
    
    hasCiCd: { type: Boolean, default: false },
    ciCdPlatform: { type: String, default: "" }, // GitHub Actions, Travis, CircleCI
    
    hasDocker: { type: Boolean, default: false },
    hasGitignore: { type: Boolean, default: false },
    
    commitCountEstimate: { type: Number, default: 0 },
    branchCount: { type: Number, default: 1 },
    openIssuesCount: { type: Number, default: 0 },
    starsCount: { type: Number, default: 0 },
    forksCount: { type: Number, default: 0 },

    // Automated Observation Bullet Points
    observations: [{ type: String }],

    // AI Recruiter & Technical Review
    aiReview: {
      overview: { type: String, default: "" },
      codeOrganization: { type: String, default: "" },
      documentationQuality: { type: String, default: "" },
      testingPractices: { type: String, default: "" },
      securityConcerns: [{ type: String }],
      missingPractices: [{ type: String }],
      recruiterPerspective: { type: String, default: "" },
    },

    // AI Portfolio Builder generated recommendations
    portfolioBuilder: {
      professionalDescription: { type: String, default: "" },
      improvedReadmeMarkdown: { type: String, default: "" },
      resumeBulletSuggestions: [{ type: String }],
      showcasePitch: { type: String, default: "" },
    },
  },
  { _id: false }
);

const analyzedRepoSchema = new mongoose.Schema(
  {
    repoId: { type: String, required: true },
    name: { type: String, required: true },
    fullName: { type: String, required: true },
    htmlUrl: { type: String, required: true },
    description: { type: String, default: "" },
    isPrivate: { type: Boolean, default: false },
    isFork: { type: Boolean, default: false },
    defaultBranch: { type: String, default: "main" },
    pushedAt: { type: Date },
    language: { type: String, default: "" },
    topics: [{ type: String }],
    
    technologies: [repoTechnologySchema],
    audit: repoQualityAuditSchema,

    analyzedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const gitHubPortfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    // GitHub Identity
    username: { type: String, required: true, index: true },
    githubId: { type: String },
    profileUrl: { type: String },
    avatarUrl: { type: String },
    publicReposCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    bio: { type: String, default: "" },

    // Encrypted OAuth access token (or empty if public username import)
    accessTokenEncrypted: { type: String, default: "" },
    tokenIv: { type: String, default: "" },
    scope: { type: String, default: "read:user,repo" },
    isConnected: { type: Boolean, default: true },

    // Repositories analyzed
    repositories: [analyzedRepoSchema],

    // Aggregated Portfolio Metrics
    overallPortfolioScore: { type: Number, default: 0 }, // 0 to 100
    verifiedTechnologies: [
      {
        name: { type: String },
        count: { type: Number, default: 1 },
        category: { type: String },
      },
    ],
    documentationScore: { type: Number, default: 0 },
    testingScore: { type: Number, default: 0 },
    architectureScore: { type: Number, default: 0 },
    productionReadinessScore: { type: Number, default: 0 },

    // Career Twin Role Gap Alignment
    targetRoleAlignment: {
      targetRole: { type: String, default: "Full Stack Engineer" },
      matchingPercentage: { type: Number, default: 0 },
      demonstratedSkills: [{ type: String }],
      missingOrWeakSkills: [{ type: String }],
      recommendedProjectActions: [
        {
          title: String,
          description: String,
          priority: { type: String, enum: ["HIGH", "MEDIUM", "LOW"], default: "HIGH" },
          skillAddressed: String,
        },
      ],
    },

    // Improvement Checklist
    portfolioChecklist: [
      {
        id: String,
        task: String,
        category: String,
        completed: { type: Boolean, default: false },
        repoName: String,
      },
    ],

    lastAnalyzedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

gitHubPortfolioSchema.index({ user: 1 });
gitHubPortfolioSchema.index({ username: 1 });

const GitHubPortfolio = mongoose.model("GitHubPortfolio", gitHubPortfolioSchema);
export default GitHubPortfolio;
