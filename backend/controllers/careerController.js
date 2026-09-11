import CareerProfile from "../models/CareerProfile.js";
import TestResult from "../models/TestResult.js";
import { getAIClient, getAIModel } from "../config/ai.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const mammoth = require("mammoth");

const extractTextFromBuffer = async (buffer, mimeType = "", originalName = "") => {
  let rawText = "";
  const lowerName = (originalName || "").toLowerCase();

  try {
    if (lowerName.endsWith(".pdf") || mimeType === "application/pdf") {
      const pdfParseModule = require("pdf-parse");
      if (typeof pdfParseModule.PDFParse === "function") {
        const parser = new pdfParseModule.PDFParse({ data: new Uint8Array(buffer) });
        await parser.load();
        const parsed = await parser.getText();
        rawText = typeof parsed === "string" ? parsed : (parsed?.text || "");
      } else if (typeof pdfParseModule === "function") {
        const parsed = await pdfParseModule(buffer);
        rawText = typeof parsed === "string" ? parsed : (parsed?.text || "");
      }
    } else if (lowerName.endsWith(".docx") || mimeType.includes("wordprocessingml") || mimeType.includes("docx")) {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value || "";
    } else {
      rawText = buffer.toString("utf-8");
    }
  } catch (err) {
    console.error("Resume file extraction error:", err.message);
    try {
      rawText = buffer.toString("utf-8");
    } catch (_) {
      rawText = "";
    }
  }

  if (!rawText || typeof rawText !== "string") {
    try {
      rawText = buffer.toString("utf-8");
    } catch (_) {
      rawText = "";
    }
  }

  return (rawText || "")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Target Role Benchmarks & Skill Expectations
const ROLE_BENCHMARKS = {
  "Full Stack Software Engineer": {
    requiredSkills: ["JavaScript/TypeScript", "React", "Node.js/Express", "DBMS & SQL", "DSA & Complexity", "Git & REST APIs"],
    coreSubjects: ["DBMS", "DSA", "OS"],
    roadmapPhases: [
      { phase: "Phase 1: Foundation (Weeks 1-4)", focus: "Core CS Data Structures & Relational Databases", action: "Master B+ Trees, Normalization, and Big-O Complexity." },
      { phase: "Phase 2: Full-Stack Stack (Weeks 5-8)", focus: "MERN/Next.js Architecture & API Design", action: "Build state-managed React applications with JWT Auth." },
      { phase: "Phase 3: Production Engineering (Weeks 9-12)", focus: "Caching, System Design & Cloud Deploy", action: "Integrate Redis caching, Docker containerization, and CI/CD." },
    ],
    projects: [
      { title: "Distributed Job Scheduler API", level: "Advanced", skills: ["Node.js", "Redis", "MongoDB"], desc: "High-throughput task queue handling background retries and rate limiting." },
      { title: "Real-time Collaborative Canvas", level: "Intermediate", skills: ["React", "WebSockets", "Canvas API"], desc: "Multi-user drawing board with state sync and conflict resolution." },
      { title: "Student Analytics & AI Platform", level: "Advanced", skills: ["React", "Express", "OpenAI", "MongoDB"], desc: "AI-powered skill gap analyzer with automated roadmaps and ATS resume scoring." }
    ]
  },
  "Backend Systems Engineer": {
    requiredSkills: ["Node.js/Go/Java", "DBMS & Indexing", "Concurrency & OS", "DSA & Graphs", "Redis/Kafka", "Microservices"],
    coreSubjects: ["DBMS", "OS", "DSA"],
    roadmapPhases: [
      { phase: "Phase 1: Deep OS & Database Internals (Weeks 1-4)", focus: "Process Sync, ACID Transactions & Indexing", action: "Solve deadlock & indexing problems in DBMS and OS." },
      { phase: "Phase 2: High Performance APIs (Weeks 5-8)", focus: "gRPC, REST, and Connection Pooling", action: "Optimize database queries and implement connection pools." },
      { phase: "Phase 3: Distributed Systems (Weeks 9-12)", focus: "Event Brokers & Load Balancing", action: "Build microservice architecture with Kafka & Redis." },
    ],
    projects: [
      { title: "High-Throughput Rate Limiter", level: "Intermediate", skills: ["Node.js", "Redis", "Lua"], desc: "Token bucket & sliding window rate limiter middleware." },
      { title: "Distributed Key-Value Store", level: "Advanced", skills: ["Go", "Raft Consensus", "gRPC"], desc: "Fault-tolerant distributed storage node with leader election." }
    ]
  },
  "Data Engineer & Analytics": {
    requiredSkills: ["SQL & Data Modeling", "Python/Pandas", "ETL Pipelines", "PostgreSQL/DBMS", "Spark/BigQuery", "Data Structures"],
    coreSubjects: ["DBMS", "DSA"],
    roadmapPhases: [
      { phase: "Phase 1: Advanced SQL & Database Tuning (Weeks 1-4)", focus: "Complex Joins, Indexing & Normalization", action: "Master window functions, CTEs, and query execution plans." },
      { phase: "Phase 2: ETL Pipeline Development (Weeks 5-8)", focus: "Python, Airflow, and Data Ingestion", action: "Build automated data pipelines with data validation." },
      { phase: "Phase 3: Warehousing & Data Lakes (Weeks 9-12)", focus: "BigQuery, Snowflake & Spark", action: "Design star schemas and transform multi-GB datasets." },
    ],
    projects: [
      { title: "Automated Financial Data ETL", level: "Intermediate", skills: ["Python", "PostgreSQL", "Airflow"], desc: "Pipeline ingesting stock tickers, normalizing schema, and generating daily rollups." }
    ]
  },
  "AI & Machine Learning Engineer": {
    requiredSkills: ["Python/PyTorch", "DSA & Math", "DBMS & Vector DBs", "REST API Integration", "LLM Fine-Tuning", "Model Deployment"],
    coreSubjects: ["DSA", "DBMS"],
    roadmapPhases: [
      { phase: "Phase 1: Math & Data Structures (Weeks 1-4)", focus: "Linear Algebra, DSA & Vector Math", action: "Master matrix operations and fundamental search algorithms." },
      { phase: "Phase 2: RAG & LLM Integration (Weeks 5-8)", focus: "LangChain, Vector Stores, OpenAI API", action: "Build Retrieval-Augmented Generation engines." },
      { phase: "Phase 3: Model Serving & Optimization (Weeks 9-12)", focus: "FastAPI, Docker & ONNX", action: "Deploy quantized LLM endpoints with sub-100ms latency." },
    ],
    projects: [
      { title: "RAG Knowledge Base Assistant", level: "Advanced", skills: ["Python", "Pinecone", "OpenAI", "FastAPI"], desc: "Semantic search engine over PDF documentation with citation tracking." }
    ]
  }
};

// GET /api/career/dashboard
export const getCareerDashboard = async (req, res) => {
  try {
    let profile = await CareerProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await CareerProfile.create({ user: req.user._id, targetRole: "Full Stack Software Engineer" });
    }

    const testResults = await TestResult.find({ user: req.user._id });
    const targetRole = profile.targetRole || "Full Stack Software Engineer";
    const roleData = ROLE_BENCHMARKS[targetRole] || ROLE_BENCHMARKS["Full Stack Software Engineer"];

    // Compute Subject Mastery Scores
    const subjectMap = { DBMS: [], DSA: [], OS: [] };
    testResults.forEach((tr) => {
      if (subjectMap[tr.subject]) {
        subjectMap[tr.subject].push(tr.scorePercent);
      }
    });

    const getAvg = (arr) => (arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 55);

    const dbmsScore = getAvg(subjectMap.DBMS);
    const dsaScore = getAvg(subjectMap.DSA);
    const osScore = getAvg(subjectMap.OS);

    const overallAvgScore = Math.round((dbmsScore + dsaScore + osScore) / 3);

    // Job Readiness Score Calculation
    // Base: 40% from academic test scores, 30% from ATS resume match, 30% from test velocity/coverage
    const testCoverageBonus = Math.min(30, testResults.length * 10);
    const atsScore = profile.atsScore || 65;
    const jobReadinessScore = Math.min(98, Math.max(35, Math.round(overallAvgScore * 0.4 + atsScore * 0.35 + testCoverageBonus)));

    // Skill Match Matrix
    const skillMatchMatrix = roleData.requiredSkills.map((skill) => {
      let score = 50;
      if (skill.includes("DBMS") || skill.includes("SQL")) score = dbmsScore;
      else if (skill.includes("DSA") || skill.includes("Graphs") || skill.includes("Trees")) score = dsaScore;
      else if (skill.includes("OS") || skill.includes("Concurrency")) score = osScore;
      else score = Math.round(overallAvgScore * 0.9);

      return {
        skill,
        masteryScore: score,
        status: score >= 75 ? "Job Ready" : score >= 55 ? "Developing" : "Action Needed",
      };
    });

    // AI-generated role-specific mock interview questions
    let mockQuestions = [
      {
        id: "mq1",
        subject: roleData.coreSubjects[0] || "DBMS",
        type: "Technical Viva",
        question: "Explain the difference between B-Trees and B+ Trees, and why B+ Trees are used for database indexing.",
        difficulty: "Medium",
      },
      {
        id: "mq2",
        subject: roleData.coreSubjects[1] || "DSA",
        type: "Algorithm Logic",
        question: "How would you detect a cycle in a directed graph using DFS? Explain the three-color marking approach.",
        difficulty: "Hard",
      },
      {
        id: "mq3",
        subject: "System Design",
        type: "Architecture",
        question: `Design a scalable REST API system for ${targetRole}. Discuss database choice, caching strategy, and handling concurrent requests.`,
        difficulty: "Hard",
      },
      {
        id: "mq4",
        subject: "Behavioral",
        type: "Engineering Culture",
        question: "Describe a complex technical bug you encountered in a project. How did you isolate the root cause and resolve it?",
        difficulty: "Easy",
      },
      {
        id: "mq5",
        subject: roleData.coreSubjects[0] || "DBMS",
        type: "Concept Depth",
        question: `Explain ACID properties in databases. Give a real-world example where violating any one property causes a critical failure.`,
        difficulty: "Medium",
      },
    ];

    // Try to generate AI-powered role-specific questions
    try {
      const openai = getAIClient();
      const model = getAIModel();
      const mqPrompt = `You are a Senior ${targetRole} hiring manager at a top tech company.
Generate 5 diverse technical interview questions for a Computer Science student targeting the role of "${targetRole}".
Cover these topics: ${roleData.requiredSkills.join(", ")}.
Include 2 core CS theory questions, 1 system design, 1 coding/algorithm, and 1 behavioral question.

Respond strictly in valid JSON format:
[
  { "id": "mq1", "subject": "DBMS", "type": "Technical Viva", "question": "...", "difficulty": "Medium" },
  { "id": "mq2", "subject": "DSA", "type": "Algorithm Logic", "question": "...", "difficulty": "Hard" },
  { "id": "mq3", "subject": "System Design", "type": "Architecture", "question": "...", "difficulty": "Hard" },
  { "id": "mq4", "subject": "Coding", "type": "Problem Solving", "question": "...", "difficulty": "Medium" },
  { "id": "mq5", "subject": "Behavioral", "type": "Engineering Culture", "question": "...", "difficulty": "Easy" }
]`;
      const mqRes = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: mqPrompt }],
        temperature: 0.6,
      });
      const rawMq = mqRes.choices[0]?.message?.content || "";
      const cleanMq = rawMq.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      const aiQuestions = JSON.parse(cleanMq);
      if (Array.isArray(aiQuestions) && aiQuestions.length >= 3) {
        mockQuestions = aiQuestions;
      }
    } catch (mqErr) {
      console.error("AI mock question generation failed, using defaults:", mqErr.message);
    }

    // AI Career Readiness Evaluation Synthesis
    let aiCareerSynthesis = null;
    try {
      const openai = getAIClient();
      const model = getAIModel();
      const prompt = `Act as a Senior Director of Engineering evaluating a Computer Science student for the role of "${targetRole}".
STUDENT METRICS:
- Overall Job Readiness Score: ${jobReadinessScore}%
- Academic Test Average: ${overallAvgScore}% across ${testResults.length} assessments
- Resume ATS Score: ${atsScore}%
- Target Role Required Skills: ${roleData.requiredSkills.join(", ")}

Respond strictly in valid JSON format:
{
  "readinessEvaluation": "2-sentence executive summary of job readiness for ${targetRole}.",
  "keyNextStep": "Top priority action item to increase candidate placement odds."
}`;

      const aiRes = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      const raw = aiRes.choices[0]?.message?.content || "";
      const clean = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      aiCareerSynthesis = JSON.parse(clean);
    } catch (aiErr) {
      aiCareerSynthesis = {
        readinessEvaluation: `Your current Job Readiness Score for ${targetRole} is ${jobReadinessScore}%. Continue completing assessments and updating your resume to maximize readiness.`,
        keyNextStep: `Focus on mastering required skills: ${roleData.requiredSkills.slice(0, 2).join(", ")}.`,
      };
    }

    res.json({
      targetRole,
      jobReadinessScore,
      atsScore,
      testsTaken: testResults.length,
      averageScore: overallAvgScore,
      resumeText: profile.resumeText,
      roadmapPhases: roleData.roadmapPhases,
      recommendedProjects: roleData.projects,
      skillMatchMatrix,
      mockQuestions,
      aiCareerSynthesis,
      availableRoles: Object.keys(ROLE_BENCHMARKS),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching career dashboard", error: error.message });
  }
};

// POST /api/career/update-role
export const updateTargetRole = async (req, res) => {
  try {
    const { targetRole } = req.body;
    let profile = await CareerProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new CareerProfile({ user: req.user._id });
    }
    profile.targetRole = targetRole;
    await profile.save();
    res.json({ message: "Target role updated", targetRole: profile.targetRole });
  } catch (error) {
    res.status(500).json({ message: "Error updating target role", error: error.message });
  }
};

// Helper for AI ATS Resume Evaluation
export const analyzeResumeCore = async (resumeText, targetRole, userId) => {
  const role = targetRole || "Full Stack Software Engineer";
  const roleData = ROLE_BENCHMARKS[role] || ROLE_BENCHMARKS["Full Stack Software Engineer"];

  let analysis = null;
  const openai = getAIClient();
  const model = getAIModel();

  try {
    const prompt = `Act as an elite Silicon Valley Tech Recruiter & Lead ATS Architect.
Analyze this candidate's resume text for the target role of "${role}".

RESUME TEXT:
"""
${resumeText}
"""

REQUIRED CORE SKILLS FOR "${role}":
${roleData.requiredSkills.join(", ")}

Respond strictly in valid JSON format:
{
  "atsScore": 82,
  "formattingRating": "Executive Grade",
  "roleFitLevel": "Strong Fit",
  "executiveSummary": "2-3 detailed sentences evaluating candidate's alignment with ${role}.",
  "matchedSkills": ["JavaScript/TypeScript", "React", "Node.js/Express"],
  "missingSkills": ["Docker & Containers", "CI/CD Deployment", "Redis Caching"],
  "strengthAreas": [
    "Clear separation of technical projects with relevant stack details",
    "Solid academic computer science foundation"
  ],
  "criticalRedFlags": [
    "Lacks quantified metrics (e.g. %, ms latency, user scale) in project accomplishment bullets",
    "Missing system design, indexing, and cloud deployment keywords for ${role}"
  ],
  "actionableBullets": [
    "Rewrite project bullets to follow Action Verb + Task + Quantified Result (e.g., 'Optimized database queries reducing API latency by 35%').",
    "Add an explicit section for CS Core Fundamentals (DSA, DBMS, OS, Computer Networks).",
    "Include Docker, Redis, and CI/CD pipelines under your Technical Skills section."
  ],
  "atsKeywordDensity": [
    { "keyword": "React / Frontend Architecture", "status": "Matched" },
    { "keyword": "Node.js / Express APIs", "status": "Matched" },
    { "keyword": "DBMS / Indexing & Normalization", "status": "Missing" },
    { "keyword": "Docker & Redis Caching", "status": "Missing" }
  ]
}`;

    const aiRes = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const raw = aiRes.choices[0]?.message?.content || "";
    const clean = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    analysis = JSON.parse(clean);
  } catch (aiErr) {
    console.error("OpenAI Resume Analysis error, using smart fallback:", aiErr.message);
  }

  // Fallback if AI fails or returns incomplete output
  if (!analysis || typeof analysis.atsScore !== "number") {
    const lowerText = resumeText.toLowerCase();
    const matched = roleData.requiredSkills.filter((s) => lowerText.includes(s.toLowerCase().split("/")[0]));
    const missing = roleData.requiredSkills.filter((s) => !lowerText.includes(s.toLowerCase().split("/")[0]));

    const calculatedScore = Math.min(94, Math.max(48, Math.round(55 + (matched.length / roleData.requiredSkills.length) * 38)));

    analysis = {
      atsScore: calculatedScore,
      formattingRating: lowerText.includes("project") && lowerText.includes("education") ? "Good" : "Needs Structure",
      roleFitLevel: calculatedScore >= 75 ? "Strong Fit" : calculatedScore >= 60 ? "Moderate Fit" : "Requires Skill Expansion",
      executiveSummary: `Candidate shows baseline readiness for ${role} with ${matched.length} matched core skills. Adding missing technical keywords and quantified metrics will elevate ATS matching.`,
      matchedSkills: matched.length > 0 ? matched : [roleData.requiredSkills[0]],
      missingSkills: missing.length > 0 ? missing : ["Docker & Microservices", "CI/CD Deployment"],
      strengthAreas: ["Relevant Computer Science coursework", "Hands-on project experience"],
      criticalRedFlags: [
        "Unquantified bullet points — add percentage improvements, scale, or performance metrics.",
        `Missing critical role keywords for ${role}: ${missing.slice(0, 2).join(", ")}.`
      ],
      actionableBullets: [
        `Incorporate missing role keywords for ${role}: ${missing.slice(0, 2).join(", ")}`,
        "Quantify project results (e.g., 'Improved database query speed by 40%')",
        "Highlight system design, database indexing, and API optimization experience under technical skills"
      ],
      atsKeywordDensity: roleData.requiredSkills.map((sk) => ({
        keyword: sk,
        status: matched.includes(sk) ? "Matched" : "Missing"
      }))
    };
  }

  // Save ATS score & resume text to user's CareerProfile
  if (userId) {
    let profile = await CareerProfile.findOne({ user: userId });
    if (!profile) {
      profile = new CareerProfile({ user: userId });
    }
    profile.resumeText = resumeText;
    profile.atsScore = analysis.atsScore;
    await profile.save();
  }

  return analysis;
};

// POST /api/career/analyze-resume
export const analyzeResume = async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;
    if (!resumeText || resumeText.length < 15) {
      return res.status(400).json({ message: "Please provide valid resume content." });
    }

    const analysis = await analyzeResumeCore(resumeText, targetRole, req.user._id);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: "Error analyzing resume", error: error.message });
  }
};

// POST /api/career/upload-resume
export const uploadAndAnalyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume file uploaded." });
    }

    const { targetRole } = req.body;
    const extractedText = await extractTextFromBuffer(req.file.buffer, req.file.mimetype, req.file.originalname);

    if (!extractedText || extractedText.length < 15) {
      return res.status(400).json({ message: "Could not extract readable text from uploaded file. Please upload a PDF, DOCX, or text file." });
    }

    const analysis = await analyzeResumeCore(extractedText, targetRole, req.user._id);

    res.json({
      filename: req.file.originalname,
      resumeText: extractedText,
      ...analysis,
    });
  } catch (error) {
    console.error("Upload & Analyze Resume Error:", error);
    res.status(500).json({ message: "Failed to process resume file upload.", error: error.message });
  }
};

// POST /api/career/optimize-bullet
export const optimizeResumeBullet = async (req, res) => {
  try {
    const { bulletText, targetRole } = req.body;
    if (!bulletText || bulletText.trim().length < 5) {
      return res.status(400).json({ message: "Please enter a valid resume bullet point." });
    }

    const role = targetRole || "Full Stack Software Engineer";
    const openai = getAIClient();
    const model = getAIModel();

    let result = null;
    try {
      const prompt = `Act as an expert Tech Resume Writer.
Rewrite and optimize this resume bullet point for a candidate applying for the role of "${role}".
Make it high-impact, active-voice, professional, and include placeholder metrics (e.g. [X]%, [Y] ms, [Z] users).

ORIGINAL BULLET: "${bulletText}"

Respond strictly in valid JSON format:
{
  "original": "${bulletText.replace(/"/g, '\\"')}",
  "optimized": "High impact rewritten bullet point with action verb and quantified outcome.",
  "alternative": "Second high impact variation highlighting tech stack and system performance.",
  "keyImprovement": "Explanation of why this rewrite ranks higher in ATS and recruiter screening."
}`;

      const aiRes = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      const raw = aiRes.choices[0]?.message?.content || "";
      const clean = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      result = JSON.parse(clean);
    } catch (aiErr) {
      console.error("OpenAI Optimize Bullet error:", aiErr.message);
    }

    if (!result) {
      result = {
        original: bulletText,
        optimized: `Engineered and optimized ${bulletText.toLowerCase().replace(/^(built|created|made|worked on|did)\s*/i, "")}, boosting system performance by 35% and reducing response latency.`,
        alternative: `Architected scalable features for ${bulletText.toLowerCase()}, ensuring 99.9% uptime and streamlined API integration.`,
        keyImprovement: "Transformed passive phrasing into strong action verbs with quantified performance metrics."
      };
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error optimizing bullet point", error: error.message });
  }
};

// POST /api/career/evaluate-mock
export const evaluateMockAnswer = async (req, res) => {
  try {
    const { question, answer, subject, difficulty } = req.body;
    if (!answer || answer.trim().length < 2) {
      return res.status(400).json({ message: "Please enter an answer before evaluating." });
    }

    const trimmedAns = answer.trim();
    let evaluation = null;

    const openai = getAIClient();
    const model = getAIModel();

    try {
      const prompt = `Act as a Senior Technical Interviewer & Computer Science Professor conducting a ${difficulty || "Medium"} difficulty technical interview.
Evaluate this student's response thoroughly.

SUBJECT: ${subject || "Computer Science"}
QUESTION: "${question || "Technical Interview Question"}"
CANDIDATE ANSWER: "${trimmedAns}"

Provide a thorough evaluation. Respond strictly in valid JSON format:
{
  "score": 7,
  "maxScore": 10,
  "grade": "B+",
  "feedback": "2-3 detailed sentences analyzing what the student got right, what concepts they demonstrated, and what technical depth was missing.",
  "strengths": ["Correctly identified X concept", "Good explanation of Y"],
  "gaps": ["Did not mention Z mechanism", "Missing Big-O complexity analysis", "No mention of edge cases"],
  "modelAnswer": "A concise 2-3 sentence ideal answer that would score 9-10, covering all key concepts, mechanisms, and trade-offs a senior engineer would mention.",
  "keyTakeaway": "One specific, actionable coaching tip to immediately improve performance in the next live interview round."
}`;

      const aiRes = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      const raw = aiRes.choices[0]?.message?.content || "";
      const clean = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      evaluation = JSON.parse(clean);
    } catch (aiErr) {
      console.error("OpenAI Mock Evaluation error, using smart fallback:", aiErr.message);
    }

    // Smart Fallback Evaluation
    if (!evaluation || typeof evaluation.score !== "number") {
      const lowerAns = trimmedAns.toLowerCase();
      const length = trimmedAns.length;
      const wordCount = trimmedAns.split(/\s+/).length;
      const technicalKeywords = ["index", "leaf", "range", "dfs", "bfs", "stack", "queue", "heap", "tree",
        "query", "process", "lock", "transaction", "acid", "cache", "hash", "complexity", "big-o",
        "pointer", "recursion", "dynamic", "greedy", "graph", "node", "edge", "binary"];
      const matchedKeywords = technicalKeywords.filter(k => lowerAns.includes(k));

      let score, grade, feedback, strengths, gaps;

      if (matchedKeywords.length >= 4 && wordCount >= 40) {
        score = 9; grade = "A";
        feedback = `Strong technical response covering ${matchedKeywords.slice(0,3).join(", ")} and demonstrating solid conceptual grasp. The answer covers the key mechanisms well.`;
        strengths = ["Good technical vocabulary", "Covered core mechanisms", "Structured explanation"];
        gaps = ["Could include time/space complexity", "Edge cases not discussed"];
      } else if (matchedKeywords.length >= 2 && wordCount >= 20) {
        score = 7; grade = "B";
        feedback = "Decent foundational response that touches on key concepts. Needs deeper technical elaboration and trade-off analysis to score higher.";
        strengths = ["Basic concept understanding shown", "Relevant terminology used"];
        gaps = ["Answer lacks depth", "No Big-O or complexity discussion", "Missing implementation detail"];
      } else if (wordCount >= 8) {
        score = 5; grade = "C";
        feedback = "Partial answer. While some understanding is shown, the response needs significantly more technical detail, examples, and mechanism-level explanation.";
        strengths = ["Attempted an answer"];
        gaps = ["Too brief", "Missing core technical concepts", "No examples or trade-off analysis"];
      } else {
        score = 3; grade = "D";
        feedback = "Very brief answer. Technical interviews require detailed explanations with mechanisms, data structures, algorithms, and real-world applicability.";
        strengths = [];
        gaps = ["Answer too short", "No technical substance", "Lacks any mechanism explanation"];
      }

      evaluation = {
        score,
        maxScore: 10,
        grade,
        feedback,
        strengths,
        gaps,
        modelAnswer: `A strong answer would explain the core ${subject} mechanism step-by-step, mention relevant data structures and their Big-O complexity, discuss trade-offs, and provide a real-world application example.`,
        keyTakeaway: "Structure your answer as: 1) Define the concept, 2) Explain the mechanism, 3) Give Big-O/performance analysis, 4) Provide a real-world use case.",
      };
    }

    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ message: "Error evaluating mock answer", error: error.message });
  }
};

// POST /api/career/generate-question
export const generateMockQuestion = async (req, res) => {
  try {
    const { subject, difficulty, targetRole } = req.body;
    const role = targetRole || "Full Stack Software Engineer";
    const openai = getAIClient();
    const model = getAIModel();

    let question = null;
    try {
      const prompt = `Generate one fresh ${difficulty || "Medium"} difficulty technical interview question for a ${role} candidate.
Subject focus: ${subject || "Computer Science"}.
The question should test deep conceptual understanding, not just surface definitions.
Respond in valid JSON:
{ "question": "...", "subject": "${subject || "CS"}", "type": "Technical Viva", "difficulty": "${difficulty || "Medium"}" }`;

      const aiRes = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      });
      const raw = aiRes.choices[0]?.message?.content || "";
      const clean = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      question = JSON.parse(clean);
    } catch (err) {
      question = {
        question: `Explain the internal working of ${subject || "Hash Tables"} and discuss time complexity for insert, search, and delete operations with collision handling strategies.`,
        subject: subject || "DSA",
        type: "Concept Depth",
        difficulty: difficulty || "Medium"
      };
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: "Error generating question", error: error.message });
  }
};
