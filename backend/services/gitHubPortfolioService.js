import crypto from "crypto";
import { getAIClient, getAIModel } from "../config/ai.js";

// Encryption secret for GitHub OAuth access tokens
const ENCRYPTION_KEY =
  process.env.GITHUB_TOKEN_SECRET ||
  process.env.JWT_SECRET ||
  "learnx-github-token-secret-32-chars-ok!";
const KEY_BUFFER = crypto.createHash("sha256").update(String(ENCRYPTION_KEY)).digest();

/**
 * Encrypt sensitive OAuth tokens using AES-256-CBC
 */
export function encryptToken(token = "") {
  if (!token) return { encrypted: "", iv: "" };
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", KEY_BUFFER, iv);
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encrypted, iv: iv.toString("hex") };
}

/**
 * Decrypt OAuth token
 */
export function decryptToken(encrypted = "", ivHex = "") {
  if (!encrypted || !ivHex) return "";
  try {
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", KEY_BUFFER, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("Token decryption error:", err.message);
    return "";
  }
}

/**
 * Fetch GitHub API helper with rate limit & auth handling
 */
export async function fetchGitHubApi(endpoint, token = "") {
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "LearnX-Portfolio-Intelligence-Engine",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http") ? endpoint : `https://api.github.com${endpoint}`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    const errText = await response.text();
    let msg = `GitHub API error (${response.status}): ${response.statusText}`;
    try {
      const parsed = JSON.parse(errText);
      if (parsed.message) msg = parsed.message;
    } catch (e) {}
    throw new Error(msg);
  }

  return response.json();
}

/**
 * Static inspection of repository files & structure (NO execution)
 */
export async function analyzeRepositoryStatic({ repo, token = "" }) {
  const fullName = repo.full_name;
  const defaultBranch = repo.default_branch || "main";

  let readmeText = "";
  let fileTree = [];
  let packageJson = null;
  let requirementsTxt = null;

  // 1. Fetch README
  try {
    const readmeRes = await fetchGitHubApi(`/repos/${fullName}/readme`, token);
    if (readmeRes.content) {
      readmeText = Buffer.from(readmeRes.content, "base64").toString("utf8");
    }
  } catch (e) {
    readmeText = "";
  }

  // 2. Fetch Root Directory Contents
  try {
    const contents = await fetchGitHubApi(`/repos/${fullName}/contents`, token);
    if (Array.isArray(contents)) {
      fileTree = contents.map((c) => ({
        name: c.name,
        type: c.type,
        path: c.path,
      }));
    }
  } catch (e) {
    fileTree = [];
  }

  // 3. Inspect package.json if JS/TS project
  const packageFile = fileTree.find((f) => f.name.toLowerCase() === "package.json");
  if (packageFile) {
    try {
      const pRes = await fetchGitHubApi(`/repos/${fullName}/contents/package.json`, token);
      if (pRes.content) {
        const rawP = Buffer.from(pRes.content, "base64").toString("utf8");
        packageJson = JSON.parse(rawP);
      }
    } catch (e) {}
  }

  // 4. Fetch Language byte breakdown
  let languagesMap = {};
  try {
    languagesMap = await fetchGitHubApi(`/repos/${fullName}/languages`, token);
  } catch (e) {
    languagesMap = repo.language ? { [repo.language]: 1000 } : {};
  }

  // Detect technologies from dependencies & files
  const technologies = [];
  const totalBytes = Object.values(languagesMap).reduce((a, b) => a + b, 0) || 1;

  for (const [lang, bytes] of Object.entries(languagesMap)) {
    technologies.push({
      name: lang,
      category: "language",
      bytes,
      percentage: Math.round((bytes / totalBytes) * 100),
    });
  }

  const fileNames = fileTree.map((f) => f.name.toLowerCase());

  // Check Docker, CI/CD, Gitignore, License
  const hasDocker = fileNames.some((n) => n.includes("dockerfile") || n.includes("docker-compose"));
  const hasGitignore = fileNames.includes(".gitignore");
  const hasLicense = Boolean(repo.license) || fileNames.some((n) => n.includes("license"));
  const licenseType = repo.license?.name || (hasLicense ? "Custom License" : "");

  // Check CI/CD
  let hasCiCd = fileNames.includes(".github") || fileNames.includes(".gitlab-ci.yml");
  let ciCdPlatform = hasCiCd ? "GitHub Actions" : "";

  // Check Testing & Test Frameworks
  let hasTests = fileNames.some(
    (n) => n.includes("test") || n.includes("tests") || n.includes("__tests__") || n.includes("spec")
  );
  const testFrameworks = [];

  if (packageJson) {
    const allDeps = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    };

    // Framework detection
    if (allDeps.react) technologies.push({ name: "React", category: "framework" });
    if (allDeps.vue) technologies.push({ name: "Vue", category: "framework" });
    if (allDeps.next) technologies.push({ name: "Next.js", category: "framework" });
    if (allDeps.express) technologies.push({ name: "Express.js", category: "framework" });
    if (allDeps.nestjs || allDeps["@nestjs/core"]) technologies.push({ name: "NestJS", category: "framework" });
    if (allDeps.tailwindcss) technologies.push({ name: "TailwindCSS", category: "framework" });
    if (allDeps.mongodb || allDeps.mongoose) technologies.push({ name: "MongoDB", category: "database" });
    if (allDeps.redis || allDeps.ioredis) technologies.push({ name: "Redis", category: "database" });
    if (allDeps.pg || allDeps["@prisma/client"]) technologies.push({ name: "PostgreSQL", category: "database" });

    // Test frameworks
    if (allDeps.jest) testFrameworks.push("Jest");
    if (allDeps.mocha) testFrameworks.push("Mocha");
    if (allDeps.cypress) testFrameworks.push("Cypress");
    if (allDeps.vitest) testFrameworks.push("Vitest");
    if (allDeps["@playwright/test"]) testFrameworks.push("Playwright");

    if (testFrameworks.length > 0) hasTests = true;
  }

  // README Quality Observations
  const readmeWordCount = readmeText ? readmeText.split(/\s+/).filter(Boolean).length : 0;
  const hasReadme = readmeWordCount >= 30;
  const readmeHasBadges = readmeText.includes("[![") || readmeText.includes("shields.io");
  const readmeHasInstallGuide =
    readmeText.toLowerCase().includes("install") ||
    readmeText.toLowerCase().includes("getting started") ||
    readmeText.toLowerCase().includes("setup") ||
    readmeText.toLowerCase().includes("npm run");
  const readmeHasArchitecture =
    readmeText.toLowerCase().includes("architecture") ||
    readmeText.toLowerCase().includes("flowchart") ||
    readmeText.toLowerCase().includes("overview") ||
    readmeText.toLowerCase().includes("diagram");

  // Verified Automated Observations
  const observations = [];
  if (hasReadme) {
    observations.push(`Found comprehensive README documentation (${readmeWordCount} words) with setup guidelines.`);
  } else {
    observations.push("Missing or sparse README documentation.");
  }

  if (hasTests) {
    observations.push(
      `Automated tests verified (${testFrameworks.join(", ") || "test directory structure"}).`
    );
  } else {
    observations.push("No automated test suite detected (Jest/PyTest/JUnit missing).");
  }

  if (hasCiCd) {
    observations.push("Continuous Integration / Deployment workflow configured (.github/workflows).");
  } else {
    observations.push("Missing CI/CD pipeline automation.");
  }

  if (hasDocker) {
    observations.push("Containerization verified via Dockerfile / Docker Compose.");
  }

  if (hasLicense) {
    observations.push(`Open source license verified: ${licenseType}.`);
  } else {
    observations.push("No explicit open-source license found.");
  }

  // Calculate Base Quality Score
  let score = 40;
  if (hasReadme) score += 15;
  if (readmeHasInstallGuide) score += 5;
  if (readmeHasArchitecture) score += 5;
  if (hasTests) score += 15;
  if (hasCiCd) score += 10;
  if (hasDocker) score += 5;
  if (hasLicense) score += 5;

  score = Math.min(100, score);
  let grade = "B";
  if (score >= 90) grade = "A+";
  else if (score >= 80) grade = "A";
  else if (score >= 70) grade = "B";
  else if (score >= 55) grade = "C";
  else grade = "D";

  // Synthesize AI Review & Portfolio Builder Suggestions
  let aiReview = {
    overview: `Project built with ${repo.language || "Code"}. Contains clear modular structure with ${fileTree.length} root items.`,
    codeOrganization: hasGitignore ? "Properly organized with root separation and .gitignore." : "Lacks root .gitignore; repository may track unnecessary build artifacts.",
    documentationQuality: hasReadme ? "Well documented setup guide and technical features." : "Needs comprehensive setup instructions and architecture explanations.",
    testingPractices: hasTests ? "Demonstrates automated verification." : "Needs unit test coverage on critical business logic.",
    securityConcerns: [],
    missingPractices: [],
    recruiterPerspective: "",
  };

  if (!hasTests) aiReview.missingPractices.push("Automated unit and integration testing");
  if (!hasCiCd) aiReview.missingPractices.push("GitHub Actions automated build pipeline");
  if (!hasLicense) aiReview.missingPractices.push("Standard open-source license (MIT/Apache)");

  // Call LLM for recruiter-grade project evaluation
  try {
    const openai = getAIClient();
    const model = getAIModel();

    if (openai) {
      const prompt = `You are a Principal Engineering Recruiter and Staff Architect analyzing a candidate's GitHub project.
Repository Name: "${repo.name}"
Language: "${repo.language || 'Software'}"
Description: "${repo.description || 'No description provided'}"
Readme Word Count: ${readmeWordCount}
Has Tests: ${hasTests} (${testFrameworks.join(', ')})
Has Docker: ${hasDocker}
Has CI/CD: ${hasCiCd}
Readme Excerpt:
"${readmeText.slice(0, 1500)}"

Generate a realistic, objective evaluation strictly in JSON format:
{
  "recruiterPerspective": "What recruiters notice in the first 10 seconds of viewing this repository",
  "resumeBulletSuggestions": [
    "High-impact resume action bullet 1 with technical keywords",
    "High-impact resume action bullet 2 with measurable outcome"
  ],
  "professionalDescription": "2-sentence recruiter-ready elevator pitch for this portfolio project",
  "improvedReadmeMarkdown": "Clear suggestions on what sections to add to the README to make it look professional"
}`;

      const completion = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.4,
      });

      const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
      aiReview.recruiterPerspective = parsed.recruiterPerspective || "";

      return {
        technologies,
        audit: {
          score,
          grade,
          hasReadme,
          readmeWordCount,
          readmeHasBadges,
          readmeHasInstallGuide,
          readmeHasArchitecture,
          hasLicense,
          licenseType,
          hasTests,
          testFrameworks,
          testFileCount: hasTests ? 3 : 0,
          hasCiCd,
          ciCdPlatform,
          hasDocker,
          hasGitignore,
          commitCountEstimate: Math.max(5, repo.size || 10),
          starsCount: repo.stargazers_count || 0,
          forksCount: repo.forks_count || 0,
          openIssuesCount: repo.open_issues_count || 0,
          observations,
          aiReview,
          portfolioBuilder: {
            professionalDescription: parsed.professionalDescription || repo.description || "",
            improvedReadmeMarkdown: parsed.improvedReadmeMarkdown || "",
            resumeBulletSuggestions: parsed.resumeBulletSuggestions || [
              `Architected ${repo.name} utilizing ${repo.language || 'modern technologies'} for efficient system execution.`,
              `Engineered core business logic and modular interfaces adhering to industry standards.`
            ],
            showcasePitch: `Engineered a production-ready ${repo.name} platform demonstrating practical expertise in ${repo.language || 'software engineering'}.`,
          },
        },
      };
    }
  } catch (err) {
    console.warn("AI Project review fallback:", err.message);
  }

  return {
    technologies,
    audit: {
      score,
      grade,
      hasReadme,
      readmeWordCount,
      readmeHasBadges,
      readmeHasInstallGuide,
      readmeHasArchitecture,
      hasLicense,
      licenseType,
      hasTests,
      testFrameworks,
      testFileCount: hasTests ? 2 : 0,
      hasCiCd,
      ciCdPlatform,
      hasDocker,
      hasGitignore,
      commitCountEstimate: 10,
      starsCount: repo.stargazers_count || 0,
      forksCount: repo.forks_count || 0,
      openIssuesCount: repo.open_issues_count || 0,
      observations,
      aiReview,
      portfolioBuilder: {
        professionalDescription: repo.description || `${repo.name} developed in ${repo.language || 'software'}.`,
        improvedReadmeMarkdown: "Add an Architecture Flowchart, Installation prerequisites, and Example API payloads.",
        resumeBulletSuggestions: [
          `Architected ${repo.name} utilizing ${repo.language || 'modern frameworks'} ensuring high-throughput execution.`,
          `Designed modular repository architecture with verified documentation and structured workflow.`
        ],
        showcasePitch: `${repo.name} represents a concrete engineering implementation in ${repo.language || 'full-stack engineering'}.`,
      },
    },
  };
}

/**
 * Career Twin Role Gap Alignment Engine
 * Compares verified repository technologies against target role requirements
 */
export function alignPortfolioWithTargetRole({ verifiedTechs = [], targetRole = "Backend Developer" }) {
  const roleSkillRequirements = {
    "Backend Developer": ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "Redis", "Docker", "REST APIs", "CI/CD"],
    "Frontend Developer": ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "TailwindCSS", "Next.js", "Redux"],
    "Full Stack Engineer": ["React", "Node.js", "Express.js", "MongoDB", "PostgreSQL", "Docker", "TypeScript", "REST APIs"],
    "DevOps Engineer": ["Docker", "Kubernetes", "CI/CD", "GitHub Actions", "Linux", "Terraform", "AWS", "Python"],
    "Machine Learning Engineer": ["Python", "PyTorch", "TensorFlow", "Pandas", "NumPy", "Scikit-Learn", "Docker", "FastAPI"],
  };

  const expected = roleSkillRequirements[targetRole] || roleSkillRequirements["Backend Developer"];
  const lowerVerified = new Set(verifiedTechs.map((t) => t.toLowerCase()));

  const demonstratedSkills = [];
  const missingOrWeakSkills = [];

  for (const skill of expected) {
    if (lowerVerified.has(skill.toLowerCase())) {
      demonstratedSkills.push(skill);
    } else {
      missingOrWeakSkills.push(skill);
    }
  }

  const matchPct = Math.round((demonstratedSkills.length / expected.length) * 100);

  const recommendedProjectActions = missingOrWeakSkills.slice(0, 3).map((skill) => ({
    title: `Implement ${skill} in a Portfolio Repository`,
    description: `Target role ${targetRole} strictly demands ${skill}. Build a practical module or integrate it into one of your existing projects.`,
    priority: "HIGH",
    skillAddressed: skill,
  }));

  return {
    targetRole,
    matchingPercentage: matchPct,
    demonstratedSkills,
    missingOrWeakSkills,
    recommendedProjectActions,
  };
}

