import React, { useState, useEffect } from "react";
import {
  GitBranch,
  Star,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  RefreshCw,
  ExternalLink,
  Code,
  Layers,
  Sparkles,
  ShieldCheck,
  FileText,
  Terminal,
  Activity,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Check,
  Unlink,
  Eye,
} from "lucide-react";

const GithubIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
import {
  connectGitHubProfile,
  getGitHubPortfolio,
  refreshGitHubPortfolio,
  disconnectGitHubProfile,
} from "../../services/api.js";

export const GitHubPortfolioSection = ({ targetRole = "Backend Developer" }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedRepo, setSelectedRepo] = useState(null);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const res = await getGitHubPortfolio();
      if (res.data?.success && res.data?.portfolio) {
        setPortfolio(res.data.portfolio);
        if (res.data.portfolio.repositories?.length > 0) {
          setSelectedRepo(res.data.portfolio.repositories[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load GitHub portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleConnect = async (e) => {
    if (e) e.preventDefault();
    if (!usernameInput.trim()) return;

    try {
      setIsConnecting(true);
      setErrorMsg("");
      const res = await connectGitHubProfile({
        username: usernameInput.trim(),
        token: tokenInput.trim(),
        targetRole,
      });

      if (res.data?.success && res.data?.portfolio) {
        setPortfolio(res.data.portfolio);
        if (res.data.portfolio.repositories?.length > 0) {
          setSelectedRepo(res.data.portfolio.repositories[0]);
        }
        setUsernameInput("");
        setTokenInput("");
      }
    } catch (err) {
      console.error("Connect error:", err);
      setErrorMsg(err.response?.data?.message || "Failed to connect GitHub account.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const res = await refreshGitHubPortfolio();
      if (res.data?.success && res.data?.portfolio) {
        setPortfolio(res.data.portfolio);
      }
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Are you sure you want to disconnect your GitHub portfolio?")) return;
    try {
      await disconnectGitHubProfile();
      setPortfolio(null);
      setSelectedRepo(null);
    } catch (err) {
      console.error("Disconnect error:", err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-2xs">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-600">Inspecting GitHub portfolio & static analysis...</p>
      </div>
    );
  }

  // DISCONNECTED STATE: PROMPT USER TO CONNECT
  if (!portfolio || !portfolio.isConnected) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Developer Portfolio & Recruiter Lens</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Analyze Your GitHub Like a Tech Recruiter
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Connect your GitHub profile to get concrete project scoring, static code audits, automated README inspection, and skill gap alignment for your target role: <strong className="text-amber-300">{targetRole}</strong>.
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 border border-white/20 text-white shadow-inner">
            <GithubIcon className="w-10 h-10" />
          </div>
        </div>

        {/* Connect Form */}
        <form onSubmit={handleConnect} className="space-y-4 max-w-xl">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              GitHub Username
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                @
              </span>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. vijaysingh0022"
                required
                className="w-full pl-8 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-400 focus:bg-white/15"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Personal Access Token <span className="text-[10px] text-slate-400 font-normal">(Optional, for private repos or high rate limits)</span>
            </label>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx (Stored with AES-256 encryption)"
              className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-400 focus:bg-white/15"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isConnecting}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 font-black text-xs text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <GithubIcon className="w-4 h-4" />
            <span>{isConnecting ? "Analyzing Repositories..." : "Analyze GitHub Portfolio Now →"}</span>
          </button>
        </form>
      </div>
    );
  }

  // CONNECTED INTELLIGENCE DASHBOARD
  const alignment = portfolio.targetRoleAlignment || {};

  return (
    <div className="space-y-6">
      
      {/* Portfolio Top Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4 min-w-0">
            <img
              src={portfolio.avatarUrl || "https://github.com/github.png"}
              alt={portfolio.username}
              className="w-14 h-14 rounded-2xl border border-slate-200 object-cover shadow-2xs"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  @{portfolio.username}
                </h3>
                <a
                  href={portfolio.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-md">
                {portfolio.bio || "Active GitHub Contributor"} • {portfolio.publicReposCount} Repositories
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-indigo-600" : ""}`} />
              <span>{refreshing ? "Re-analyzing..." : "Refresh Intelligence"}</span>
            </button>
            <button
              onClick={handleDisconnect}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Disconnect GitHub"
            >
              <Unlink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* KPI Score Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block mb-1">
              Portfolio Quality
            </span>
            <div className="text-2xl sm:text-3xl font-black text-indigo-700">
              {portfolio.overallPortfolioScore}/100
            </div>
            <span className="text-[11px] font-bold text-indigo-600">Recruiter Benchmark</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block mb-1">
              Role Match ({targetRole})
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700">
              {alignment.matchingPercentage || 65}%
            </div>
            <span className="text-[11px] font-bold text-emerald-600">
              {alignment.demonstratedSkills?.length || 0} Skills Demonstrated
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block mb-1">
              Documentation Score
            </span>
            <div className="text-2xl sm:text-3xl font-black text-blue-700">
              {portfolio.documentationScore}%
            </div>
            <span className="text-[11px] font-bold text-blue-600">README & Architecture</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block mb-1">
              Testing Health
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-700">
              {portfolio.testingScore}%
            </div>
            <span className="text-[11px] font-bold text-amber-600">Automated Test Suites</span>
          </div>
        </div>
      </div>

      {/* Target Role Skill Gap Alignment (Career Twin Integration) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-black text-slate-900 tracking-tight">
              Career Twin Role Gap Alignment: {targetRole}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Comparing technologies verified in your actual repositories against target industry expectations.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
            {alignment.matchingPercentage || 0}% Fit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Demonstrated Skills */}
          <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-2">
            <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Demonstrated in Repositories</span>
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(alignment.demonstratedSkills || []).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-xs font-bold text-emerald-800 shadow-2xs"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing or Insufficiently Demonstrated */}
          <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-2">
            <span className="text-[11px] font-black text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Missing or Not Demonstrated</span>
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(alignment.missingOrWeakSkills || []).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-xs font-bold text-rose-800 shadow-2xs"
                >
                  + {skill} Needed
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Repositories & Static Code Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Repo Selector List (4 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Analyzed Repositories ({(portfolio.repositories || []).length})
          </h4>

          <div className="space-y-2.5">
            {(portfolio.repositories || []).map((repo) => {
              const isSelected = selectedRepo?._id === repo._id || selectedRepo?.name === repo.name;
              const grade = repo.audit?.grade || "B";

              return (
                <div
                  key={repo._id || repo.name}
                  onClick={() => setSelectedRepo(repo)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "bg-indigo-50/80 border-indigo-400 shadow-2xs"
                      : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700">
                          {repo.language || "Code"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            grade.startsWith("A")
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          Grade {grade}
                        </span>
                      </div>
                      <h5 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                        {repo.name}
                      </h5>
                    </div>

                    <span className="text-xs font-black text-slate-700">
                      {repo.audit?.score || 70}/100
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium line-clamp-2">
                    {repo.description || "No repository description provided."}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold pt-1">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{repo.audit?.starsCount || 0}</span>
                    </span>
                    <span>•</span>
                    <span className={repo.audit?.hasTests ? "text-emerald-600" : "text-slate-400"}>
                      {repo.audit?.hasTests ? "✓ Tests" : "✗ No Tests"}
                    </span>
                    <span>•</span>
                    <span className={repo.audit?.hasReadme ? "text-emerald-600" : "text-slate-400"}>
                      {repo.audit?.hasReadme ? "✓ README" : "✗ No README"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Repo Deep Audit & AI Portfolio Builder (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {!selectedRepo ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-xs text-slate-400">
              Select a repository to view static analysis and AI project review.
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">{selectedRepo.name}</h3>
                    <a
                      href={selectedRepo.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Static Code Health Score: <strong className="text-indigo-600 font-bold">{selectedRepo.audit?.score || 70}/100</strong> (Grade {selectedRepo.audit?.grade})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedRepo.audit?.hasDocker && (
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold">Docker</span>
                  )}
                  {selectedRepo.audit?.hasCiCd && (
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold">CI/CD</span>
                  )}
                </div>
              </div>

              {/* Recruiter First-Impression Perspective */}
              {selectedRepo.audit?.aiReview?.recruiterPerspective && (
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Recruiter First 10-Second Impression</span>
                  </span>
                  <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                    {selectedRepo.audit.aiReview.recruiterPerspective}
                  </p>
                </div>
              )}

              {/* Concrete Observations */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Verified Automated Audit
                </span>
                <div className="space-y-1.5">
                  {(selectedRepo.audit?.observations || []).map((obs, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-700 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span>{obs}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Portfolio Builder: Resume Bullet Suggestions */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Resume Action Bullets (ATS Optimized)</span>
                </span>
                <div className="space-y-2">
                  {(selectedRepo.audit?.portfolioBuilder?.resumeBulletSuggestions || []).map((bullet, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/70 text-xs font-semibold text-amber-950 flex items-start gap-2.5"
                    >
                      <span className="text-amber-600 font-black shrink-0">•</span>
                      <p className="leading-relaxed">{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Improved README Suggestion */}
              {selectedRepo.audit?.portfolioBuilder?.improvedReadmeMarkdown && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-black text-slate-800">
                    Recommended README Enhancements
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {selectedRepo.audit.portfolioBuilder.improvedReadmeMarkdown}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubPortfolioSection;
