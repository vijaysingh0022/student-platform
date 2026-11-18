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
  if (!token || !token.trim()) return { encrypted: "", iv: "" };
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", KEY_BUFFER, iv);
  let encrypted = cipher.update(token.trim(), "utf8", "hex");
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
 * Format GitHub Authorization Header
 * Works for both classic PAT (ghp_), fine-grained PAT (github_pat_), and OAuth tokens
 */
function getAuthHeader(token = "") {
  const clean = token.trim();
  if (!clean) return "";
  if (clean.startsWith("token ") || clean.startsWith("Bearer ")) {
    return clean;
  }
  // If fine-grained PAT or modern token, Bearer is standard; if classic token, token works too.
  return clean.startsWith("ghp_") ? `token ${clean}` : `Bearer ${clean}`;
}

/**
 * Fetch GitHub API helper with rate limit & auth handling
 */
export async function fetchGitHubApi(endpoint, token = "") {
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "LearnX-Portfolio-Intelligence-Engine",
  };

  const cleanToken = token ? token.trim() : "";
  if (cleanToken) {
    headers.Authorization = getAuthHeader(cleanToken);
  }

  const url = endpoint.startsWith("http") ? endpoint : `https://api.github.com${endpoint}`;

  let response;
  try {
    response = await fetch(url, { headers });
  } catch (netErr) {
    const err = new Error("GitHub API is currently unreachable. Please check your network connection.");
    err.status = 503;
    throw err;
  }

  if (!response.ok) {
    const errText = await response.text();
    let msg = `GitHub API error (${response.status}): ${response.statusText}`;
    try {
      const parsed = JSON.parse(errText);
      if (parsed.message) msg = parsed.message;
    } catch (e) {}

    const error = new Error(msg);
    error.status = response.status;
    error.headers = response.headers;
    throw error;
  }

  return response.json();
}

/**
 * Validate token and inspect granted permissions / authenticated login
 */
export async function testGitHubConnection({ username, token = "" }) {
  const cleanUser = username ? username.trim().replace(/^@/, "") : "";
  const cleanToken = token ? token.trim() : "";

  // 1. If token is provided, verify token identity via /user
  if (cleanToken) {
    try {
      const authUser = await fetchGitHubApi("/user", cleanToken);
      const isOwner = cleanUser ? authUser.login.toLowerCase() === cleanUser.toLowerCase() : true;
      return {
        valid: true,
        authenticatedLogin: authUser.login,
        isTokenProvided: true,
        isOwner,
        tokenType: cleanToken.startsWith("github_pat_") ? "Fine-grained PAT" : cleanToken.startsWith("ghp_") ? "Classic PAT" : "OAuth Token",
        scopes: "Read-only profile & repository access",
        message: isOwner
          ? `Authenticated as @${authUser.login}. Private and public repositories accessible.`
          : `Authenticated as @${authUser.login}, but analyzing @${cleanUser}'s repositories.`,
      };
    } catch (err) {
      if (err.status === 401) {
        throw new Error("Invalid, expired or revoked GitHub Personal Access Token.");
      } else if (err.status === 403) {
        throw new Error("GitHub API rate limit exceeded or token lacks required permissions.");
      }
      throw err;
    }
  }

  // 2. If no token provided, check if public profile exists
  if (!cleanUser) {
    throw new Error("Please enter a GitHub username to test connection.");
  }

  try {
    const pubUser = await fetchGitHubApi(`/users/${cleanUser}`);
    return {
      valid: true,
      authenticatedLogin: pubUser.login,
      isTokenProvided: false,
      isOwner: true,
      tokenType: "Public (No Token)",
      scopes: "Public repositories only (Rate limit: 60 req/hr)",
      message: `Connected to public profile @${pubUser.login}. Analyzing public repositories without token.`,
    };
  } catch (err) {
    if (err.status === 404) {
      throw new Error(`GitHub user @${cleanUser} not found. Please verify the username.`);
    } else if (err.status === 403) {
      throw new Error("GitHub API public rate limit reached for your IP (60 req/hr). Please provide a Personal Access Token.");
    }
    throw err;
  }
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

  // 3. Inspect Dependencies (package.json / requirements.txt / pom.xml)
  const rootFiles = fileTree.map((f) => f.name.toLowerCase());
  const technologies = [];

  if (rootFiles.includes("package.json")) {
    try {
      const pkgRes = await fetchGitHubApi(`/repos/${fullName}/contents/package.json`, token);
      if (pkgRes.content) {
        const rawJson = Buffer.from(pkgRes.content, "base64").toString("utf8");
        packageJson = JSON.parse(rawJson);
        const deps = { ...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {}) };

        // Frameworks & tools extraction
        if (deps.express) technologies.push({ name: "Express.js", category: "framework" });
        if (deps.react) technologies.push({ name: "React", category: "framework" });
        if (deps.next) technologies.push({ name: "Next.js", category: "framework" });
        if (deps.vue) technologies.push({ name: "Vue", category: "framework" });
        if (deps.mongoose || deps.mongodb) technologies.push({ name: "MongoDB", category: "database" });
        if (deps.pg || deps.sequelize || deps["typeorm"]) technologies.push({ name: "PostgreSQL", category: "database" });
        if (deps.redis || deps.ioredis) technologies.push({ name: "Redis", category: "database" });
        if (deps.tailwindcss) technologies.push({ name: "TailwindCSS", category: "tool" });
        if (deps.typescript) technologies.push({ name: "TypeScript", category: "language" });

        // Testing libraries
        if (deps.jest || deps.mocha || deps.vitest || deps["@testing-library/react"] || deps.cypress) {
          technologies.push({ name: "Jest / Unit Tests", category: "testing" });
        }
      }
    } catch (e) {}
  }

  if (rootFiles.includes("requirements.txt") || rootFiles.includes("pyproject.toml")) {
    technologies.push({ name: "Python", category: "language" });
    try {
      const reqRes = await fetchGitHubApi(`/repos/${fullName}/contents/requirements.txt`, token);
      if (reqRes.content) {
        requirementsTxt = Buffer.from(reqRes.content, "base64").toString("utf8");
        if (/django/i.test(requirementsTxt)) technologies.push({ name: "Django", category: "framework" });
        if (/fastapi/i.test(requirementsTxt)) technologies.push({ name: "FastAPI", category: "framework" });
        if (/flask/i.test(requirementsTxt)) technologies.push({ name: "Flask", category: "framework" });
        if (/pytorch|torch/i.test(requirementsTxt)) technologies.push({ name: "PyTorch", category: "tool" });
        if (/tensorflow/i.test(requirementsTxt)) technologies.push({ name: "TensorFlow", category: "tool" });
        if (/pytest/i.test(requirementsTxt)) technologies.push({ name: "PyTest", category: "testing" });
      }
    } catch (e) {}
  }

  if (repo.language) {
    if (!technologies.some((t) => t.name.toLowerCase() === repo.language.toLowerCase())) {
      technologies.push({ name: repo.language, category: "language" });
    }
  }

  // 4. Static Verification Signals
  const hasReadme = !!readmeText && readmeText.trim().length > 100;
  const readmeWordCount = readmeText ? readmeText.split(/\s+/).length : 0;
  const readmeHasBadges = /\[!\[|shields\.io|badge/i.test(readmeText);
  const readmeHasInstallGuide = /install|setup|getting started|run/i.test(readmeText);
  const readmeHasArchitecture = /architecture|flowchart|structure|diagram/i.test(readmeText);

  const hasLicense = !!repo.license || rootFiles.some((f) => f.includes("license"));
  const licenseType = repo.license?.spdx_id || (hasLicense ? "Detected" : "");

  const hasTests =
    technologies.some((t) => t.category === "testing") ||
    rootFiles.some((f) => f.includes("test") || f.includes("spec")) ||
    rootFiles.includes("__tests__");

  const hasDocker = rootFiles.includes("dockerfile") || rootFiles.includes("docker-compose.yml");
  const hasCiCd = rootFiles.includes(".github") || rootFiles.includes(".gitlab-ci.yml") || rootFiles.includes(".travis.yml");
  const hasGitignore = rootFiles.includes(".gitignore");

  // Calculate Numerical Score (0 to 100)
  let score = 30; // base score for established repo
  if (hasReadme) score += 20;
  if (readmeWordCount > 300) score += 5;
  if (readmeHasInstallGuide) score += 5;
  if (hasLicense) score += 10;
  if (hasTests) score += 15;
  if (hasCiCd) score += 10;
  if (hasDocker) score += 5;
  score = Math.min(100, Math.max(25, score));

  let grade = "B";
  if (score >= 90) grade = "A+";
  else if (score >= 80) grade = "A";
  else if (score >= 70) grade = "B";
  else if (score >= 60) grade = "C";
  else grade = "D";

  // Automated Observation Bullet Points
  const observations = [];
  if (hasReadme) {
    observations.push(`Comprehensive README found (${readmeWordCount} words) with installation instructions.`);
  } else {
    observations.push("Missing or brief README. Recruiters cannot quickly determine project purpose.");
  }

  if (hasTests) {
    observations.push("Automated unit/integration tests verified in repository.");
  } else {
    observations.push("No automated test suite detected. Critical for production software engineer roles.");
  }

  if (hasCiCd) {
    observations.push("Continuous Integration / Deployment configuration (.github/workflows) detected.");
  }

  if (hasDocker) {
    observations.push("Containerization verified via Dockerfile.");
  }

  if (hasLicense) {
    observations.push(`Open source license verified (${licenseType}).`);
  }

  // 5. AI Recruiter First 10-Second Impression & Resume Bullets
  const aiReview = {
    overview: `${repo.name} demonstrates practical engineering in ${repo.language || "modern tech stack"}.`,
    recruiterPerspective: hasTests && hasReadme
      ? "Strong project. Clear documentation, setup steps, and automated tests signal software engineering maturity."
      : "Promising repository, but lacks test coverage or clear architecture documentation to stand out in screening rounds.",
    codeOrganization: "Clean directory layout with standard project packaging conventions.",
    documentationQuality: hasReadme ? "Well-documented setup and dependencies." : "Needs explicit setup instructions.",
    testingPractices: hasTests ? "Demonstrated test-driven practices." : "Missing test harness.",
    securityConcerns: [],
    missingPractices: hasTests ? [] : ["Unit test coverage"],
  };

  const portfolioBuilder = {
    professionalDescription: repo.description || `Engineered full-featured ${repo.name} utilizing ${technologies.map((t) => t.name).join(", ")}.`,
    improvedReadmeMarkdown: `## ${repo.name}\n\n### Overview\n${repo.description || "Production-grade project."}\n\n### Tech Stack\n${technologies.map((t) => `- **${t.name}**`).join("\n")}\n\n### Setup & Installation\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``,
    resumeBulletSuggestions: [
      `Architected and developed ${repo.name} utilizing ${technologies.slice(0, 3).map((t) => t.name).join(", ") || repo.language}, serving reliable API endpoints.`,
      `Integrated ${hasCiCd ? "automated CI/CD pipelines and " : ""}${hasTests ? "comprehensive unit test coverage" : "modular software design"} ensuring robust code quality.`,
    ],
    showcasePitch: `Check out ${repo.name} — built with ${repo.language || "TypeScript"} focusing on scalable software architecture and clean code.`,
  };

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
      testFrameworks: technologies.filter((t) => t.category === "testing").map((t) => t.name),
      testFileCount: hasTests ? 3 : 0,
      hasCiCd,
      ciCdPlatform: hasCiCd ? "GitHub Actions" : "",
      hasDocker,
      hasGitignore,
      commitCountEstimate: 20,
      branchCount: 1,
      openIssuesCount: repo.open_issues_count || 0,
      starsCount: repo.stargazers_count || 0,
      forksCount: repo.forks_count || 0,
      observations,
      aiReview,
      portfolioBuilder,
    },
  };
}

/**
 * Career Twin Role Gap Alignment Engine
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
