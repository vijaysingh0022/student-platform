import GitHubPortfolio from "../models/GitHubPortfolio.js";
import CareerTwin from "../models/CareerTwin.js";
import {
  encryptToken,
  decryptToken,
  fetchGitHubApi,
  analyzeRepositoryStatic,
  alignPortfolioWithTargetRole,
} from "../services/gitHubPortfolioService.js";

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

    // Encrypt token if provided
    const { encrypted, iv } = encryptToken(token);

    // 1. Fetch User Profile
    const profile = await fetchGitHubApi(`/users/${cleanUser}`, token);

    // 2. Fetch Repositories
    const repos = await fetchGitHubApi(
      `/users/${cleanUser}/repos?sort=updated&per_page=12&type=all`,
      token
    );

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
    portfolio.publicReposCount = profile.public_repos || repos.length || 0;
    portfolio.followersCount = profile.followers || 0;
    portfolio.followingCount = profile.following || 0;
    portfolio.bio = profile.bio || "";
    portfolio.accessTokenEncrypted = encrypted;
    portfolio.tokenIv = iv;
    portfolio.isConnected = true;

    // 3. Static Analysis on Top 4 Active/Starred Repositories
    const topRepos = repos
      .filter((r) => !r.fork)
      .slice(0, 4);

    const analyzedRepos = [];
    const allDetectedTechs = new Set();
    let totalScore = 0;
    let docScoreSum = 0;
    let testScoreSum = 0;

    for (const repo of topRepos) {
      try {
        const { technologies, audit } = await analyzeRepositoryStatic({ repo, token });
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
      analyzedRepos.length > 0 ? Math.round(docScoreSum / analyzedRepos.length) : 50;
    portfolio.testingScore =
      analyzedRepos.length > 0 ? Math.round(testScoreSum / analyzedRepos.length) : 30;

    portfolio.verifiedTechnologies = Array.from(allDetectedTechs).map((tech) => ({
      name: tech,
      count: 1,
      category: "framework",
    }));

    // 4. Align with Target Role & Career Twin
    const alignment = alignPortfolioWithTargetRole({
      verifiedTechs: Array.from(allDetectedTechs),
      targetRole,
    });
    portfolio.targetRoleAlignment = alignment;

    // 5. Generate Concrete Checklist
    portfolio.portfolioChecklist = [
      {
        id: "chk-1",
        task: "Add Architecture diagrams and API documentation to top repository README",
        category: "Documentation",
        completed: portfolio.documentationScore >= 70,
        repoName: topRepos[0]?.name || "Primary Repo",
      },
      {
        id: "chk-2",
        task: "Set up automated test suite (Jest / PyTest / Vitest) for core business logic",
        category: "Testing",
        completed: portfolio.testingScore >= 60,
        repoName: topRepos[0]?.name || "Primary Repo",
      },
      {
        id: "chk-3",
        task: "Configure GitHub Actions CI workflow (.github/workflows/ci.yml)",
        category: "DevOps",
        completed: analyzedRepos.some((r) => r.audit?.hasCiCd),
        repoName: topRepos[0]?.name || "Primary Repo",
      },
    ];

    portfolio.lastAnalyzedAt = new Date();
    await portfolio.save();

    // 6. Sync into Career Twin Signals & Timeline
    try {
      await CareerTwin.findOneAndUpdate(
        { user: userId },
        {
          $push: {
            timeline: {
              date: new Date(),
              event: `Connected GitHub Portfolio (@${cleanUser}) with ${analyzedRepos.length} verified projects`,
              impact: `+${Math.round(portfolio.overallPortfolioScore * 0.1)} Portfolio Points`,
              type: "achievement",
            },
          },
        }
      );
    } catch (twinErr) {
      // Continue safely
    }

    res.status(200).json({
      success: true,
      portfolio,
    });
  } catch (error) {
    console.error("Connect GitHub Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get student's GitHub Portfolio Intelligence profile
 * @route GET /api/github/portfolio
 */
export const getGitHubPortfolio = async (req, res) => {
  try {
    const userId = req.user._id;
    const portfolio = await GitHubPortfolio.findOne({ user: userId });

    if (!portfolio || !portfolio.isConnected) {
      return res.status(200).json({
        success: true,
        isConnected: false,
        portfolio: null,
      });
    }

    res.status(200).json({
      success: true,
      isConnected: true,
      portfolio,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Refresh repository analysis
 * @route POST /api/github/refresh
 */
export const refreshGitHubPortfolio = async (req, res) => {
  try {
    const userId = req.user._id;
    const portfolio = await GitHubPortfolio.findOne({ user: userId });

    if (!portfolio || !portfolio.username) {
      return res.status(404).json({ success: false, message: "No connected GitHub profile found." });
    }

    const token = decryptToken(portfolio.accessTokenEncrypted, portfolio.tokenIv);

    // Re-run connection workflow with saved token & username
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
 * @desc Disconnect GitHub profile
 * @route POST /api/github/disconnect
 */
export const disconnectGitHub = async (req, res) => {
  try {
    const userId = req.user._id;
    await GitHubPortfolio.findOneAndDelete({ user: userId });

    res.status(200).json({
      success: true,
      message: "GitHub account disconnected and repository portfolio data cleared.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

