import GitHubPortfolio from "../models/GitHubPortfolio.js";
import CareerTwin from "../models/CareerTwin.js";
import {
  encryptToken,
  decryptToken,
  fetchGitHubApi,
  testGitHubConnection,
  analyzeRepositoryStatic,
  alignPortfolioWithTargetRole,
} from "../services/gitHubPortfolioService.js";

/**
 * @desc Test GitHub connection and inspect credentials without saving
 * @route POST /api/github/test-connection
 */
export const testConnection = async (req, res) => {
  try {
    const { username, token = "" } = req.body;
    const result = await testGitHubConnection({ username, token });
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    const statusCode = error.status || (error.message.includes("not found") ? 404 : 400);
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Connect GitHub profile (via username or OAuth token)
 * @route POST /api/github/connect
 */
export const connectGitHub = async (req, res) => {
  try {
    const { username, token = "", targetRole = "Backend Developer" } = req.body;
    const userId = req.user._id;

    if (!username || !username.trim()) {
      return res.status(400).json({ success: false, message: "Please provide a valid GitHub username." });
    }

    const cleanUser = username.trim().replace(/^@/, "");
    const cleanToken = token ? token.trim() : "";

    // 0. Verify connection and credentials upfront
    await testGitHubConnection({ username: cleanUser, token: cleanToken });

    // Encrypt token if provided
    const { encrypted, iv } = encryptToken(cleanToken);

    // 1. Fetch User Profile
    const profile = await fetchGitHubApi(`/users/${cleanUser}`, cleanToken);

    // 2. Fetch Repositories
    // If cleanToken provided, use /user/repos if analyzing own account to catch private repos, else /users/:user/repos
    let repos = [];
    try {
      repos = await fetchGitHubApi(
        `/users/${cleanUser}/repos?sort=updated&per_page=12&type=all`,
        cleanToken
      );
    } catch (repoErr) {
      // Fallback if type=all restricted without authorization
      repos = await fetchGitHubApi(
        `/users/${cleanUser}/repos?sort=updated&per_page=12`,
        cleanToken
      );
    }

    let portfolio = await GitHubPortfolio.findOne({ user: userId });
    if (!portfolio) {
      portfolio = new GitHubPortfolio({
        user: userId,
        username: cleanUser,
      });
    }

    portfolio.username = cleanUser;
    portfolio.githubId = String(profile.id || "");
    portfolio.profileUrl = profile.html_url || `https://github.com/${cleanUser}`;
    portfolio.avatarUrl = profile.avatar_url || "";
    portfolio.publicReposCount = profile.public_repos ?? repos.length;
    portfolio.followersCount = profile.followers || 0;
    portfolio.followingCount = profile.following || 0;
    portfolio.bio = profile.bio || "";
    portfolio.accessTokenEncrypted = encrypted;
    portfolio.tokenIv = iv;
    portfolio.isConnected = true;

    // 3. Static Analysis on Top 4 Active/Starred Repositories
    const topRepos = (repos || [])
      .filter((r) => !r.fork)
      .slice(0, 4);

    const analyzedRepos = [];
    const allDetectedTechs = new Set();
    let totalScore = 0;
    let docScoreSum = 0;
    let testScoreSum = 0;

    for (const repo of topRepos) {
      try {
        const { technologies, audit } = await analyzeRepositoryStatic({ repo, token: cleanToken });
        technologies.forEach((t) => allDetectedTechs.add(t.name));

        totalScore += audit.score;
        if (audit.hasReadme) docScoreSum += 80;
        if (audit.hasTests) testScoreSum += 80;

        analyzedRepos.push({
          repoId: String(repo.id),
          name: repo.name,
          fullName: repo.full_name,
          htmlUrl: repo.html_url,
          description: repo.description || "",
          isPrivate: repo.private,
          isFork: repo.fork,
          defaultBranch: repo.default_branch || "main",
          pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : new Date(),
          language: repo.language || "",
          topics: repo.topics || [],
          technologies,
          audit,
          analyzedAt: new Date(),
        });
      } catch (repoErr) {
        console.warn(`Could not fully analyze ${repo.name}:`, repoErr.message);
      }
    }

    portfolio.repositories = analyzedRepos;
    portfolio.overallPortfolioScore =
      analyzedRepos.length > 0 ? Math.round(totalScore / analyzedRepos.length) : 60;
    portfolio.documentationScore =
      analyzedRepos.length > 0 ? Math.round(docScoreSum / analyzedRepos.length) : 70;
    portfolio.testingScore =
      analyzedRepos.length > 0 ? Math.round(testScoreSum / analyzedRepos.length) : 50;

    // 4. Align with Career Twin target role
    const verifiedList = Array.from(allDetectedTechs);
    const alignment = alignPortfolioWithTargetRole({
      verifiedTechs: verifiedList,
      targetRole,
    });
    portfolio.targetRoleAlignment = alignment;

    // 5. Build prioritized improvement checklist
    portfolio.portfolioChecklist = [
      {
        id: "check-1",
        task: "Add unit/integration tests with Jest, PyTest or Go test runner",
        category: "Testing",
        completed: portfolio.testingScore >= 70,
        repoName: analyzedRepos[0]?.name || "Top Repository",
      },
      {
        id: "check-2",
        task: "Add comprehensive README setup instructions and badges",
        category: "Documentation",
        completed: portfolio.documentationScore >= 75,
        repoName: analyzedRepos[0]?.name || "Top Repository",
      },
      {
        id: "check-3",
        task: "Configure GitHub Actions CI/CD pipeline",
        category: "DevOps",
        completed: analyzedRepos.some((r) => r.audit?.hasCiCd),
        repoName: analyzedRepos[0]?.name || "Top Repository",
      },
      {
        id: "check-4",
        task: "Include open source license (MIT / Apache-2.0)",
        category: "Standards",
        completed: analyzedRepos.some((r) => r.audit?.hasLicense),
        repoName: analyzedRepos[0]?.name || "Top Repository",
      },
    ];

    portfolio.lastAnalyzedAt = new Date();
    await portfolio.save();

    // Cross-module synchronization with Career Twin
    try {
      await CareerTwin.findOneAndUpdate(
        { user: userId },
        {
          $set: {
            "portfolioSignals.githubUsername": cleanUser,
            "portfolioSignals.portfolioScore": portfolio.overallPortfolioScore,
            "portfolioSignals.verifiedTechnologies": verifiedList,
            "portfolioSignals.lastUpdated": new Date(),
          },
        }
      );
    } catch (twinErr) {
      console.warn("Could not sync with Career Twin:", twinErr.message);
    }

    // Never return access token or IV in responses
    const safePortfolio = portfolio.toObject();
    delete safePortfolio.accessTokenEncrypted;
    delete safePortfolio.tokenIv;

    res.status(200).json({
      success: true,
      message: cleanToken
        ? "GitHub account connected with token authorization."
        : "Public GitHub profile connected successfully without token.",
      portfolio: safePortfolio,
    });
  } catch (error) {
    console.error("Connect GitHub Error:", error.message);
    // Disambiguate error statuses accurately
    const status = error.status || (error.message.includes("not found") ? 404 : 400);
    res.status(status).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get student's GitHub portfolio intelligence
 * @route GET /api/github/portfolio
 */
export const getGitHubPortfolio = async (req, res) => {
  try {
    const userId = req.user._id;
    const portfolio = await GitHubPortfolio.findOne({ user: userId }).select("-accessTokenEncrypted -tokenIv");

    if (!portfolio || !portfolio.isConnected) {
      return res.status(200).json({
        success: true,
        portfolio: null,
      });
    }

    res.status(200).json({
      success: true,
      portfolio,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Re-analyze connected repositories with existing token
 * @route POST /api/github/refresh
 */
export const refreshGitHubPortfolio = async (req, res) => {
  try {
    const userId = req.user._id;
    const portfolio = await GitHubPortfolio.findOne({ user: userId });

    if (!portfolio || !portfolio.isConnected) {
      return res.status(404).json({ success: false, message: "No connected GitHub account found." });
    }

    const token = decryptToken(portfolio.accessTokenEncrypted, portfolio.tokenIv);

    // Reuse connectGitHub logic
    req.body = {
      username: portfolio.username,
      token,
      targetRole: portfolio.targetRoleAlignment?.targetRole || "Backend Developer",
    };

    return connectGitHub(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Disconnect GitHub account and clear credentials safely
 * @route POST /api/github/disconnect
 */
export const disconnectGitHub = async (req, res) => {
  try {
    const userId = req.user._id;
    await GitHubPortfolio.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          isConnected: false,
          accessTokenEncrypted: "",
          tokenIv: "",
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "GitHub account disconnected and credentials safely cleared.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
