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
  Lock,
  FolderGit2,
  ListFilter,
  SlidersHorizontal,
  ChevronRight,
  CheckSquare,
} from "lucide-react";
import {
  connectGitHubProfile,
  getGitHubPortfolio,
  refreshGitHubPortfolio,
  disconnectGitHubProfile,
  testGitHubConnection,
} from "../../services/api.js";

const GithubIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const GitHubPortfolioSection = ({ targetRole = "Backend Developer" }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedRepo, setSelectedRepo] = useState(null);

  // Tab Navigation for Clean Organization
  // "overview" | "explorer" | "audit" | "skills" | "roadmap"
  const [activeTab, setActiveTab] = useState("overview");

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

  const handleTestConnection = async () => {
    if (!usernameInput.trim()) {
      setErrorMsg("Please enter a GitHub username to test.");
      return;
    }

    try {
      setIsTesting(true);
      setErrorMsg("");
      setTestResult(null);
      const res = await testGitHubConnection({
        username: usernameInput.trim(),
        token: tokenInput.trim(),
      });

      if (res.data?.success) {
        setTestResult(res.data);
      }
    } catch (err) {
      console.error("Test connection error:", err);
      setTestResult(null);
      setErrorMsg(err.response?.data?.message || err.message || "Connection test failed.");
    } finally {
      setIsTesting(false);
    }
  };

  const handleConnect = async (e) => {
    if (e) e.preventDefault();
    if (!usernameInput.trim()) return;

    try {
      setIsConnecting(true);
      setErrorMsg("");
      setTestResult(null);
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
      setErrorMsg(err.response?.data?.message || err.message || "Failed to connect GitHub account.");
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

  // ── 1. DISCONNECTED STATE: PREMIUM HERO & CONNECTION CARD ──
  if (!portfolio || !portfolio.isConnected) {
    return (
      <div className="space-y-8">
        
        {/* HERO SECTION (Clean White SaaS Theme with Deep Navy Contrast) */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>LearnX Developer Portfolio Intelligence</span>
            </div>

            {/* Accessible Crisp White Headings */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Analyze Your GitHub Like a Tech Recruiter
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              Connect your GitHub account for static code analysis, README documentation scoring, automated test suite verification, and role gap matching against: <strong className="text-amber-300 font-bold">{targetRole}</strong>.
            </p>

            {/* What LearnX Analyzes Pill Grid */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-medium text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>README & Documentation Quality</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-medium text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Automated Tests & CI/CD Pipelines</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-medium text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Frameworks & Tech Stacks</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-medium text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ATS Resume Action Bullets</span>
              </span>
            </div>
          </div>
        </div>

        {/* GITHUB CONNECTION CARD */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md">
                <GithubIcon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Connect GitHub Account
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Status: <span className="text-rose-600 font-bold">Disconnected</span> • Public Read-Only Access
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Encrypted Credentials</span>
            </div>
          </div>

          <form onSubmit={handleConnect} className="space-y-5 max-w-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
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
                  className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                We will analyze your public repositories, languages, tests, and documentation.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Personal Access Token <span className="text-[10px] text-slate-400 font-normal lowercase">(optional — for private repos or rate limit bypass)</span>
              </label>
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (Stored with AES-256 encryption)"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              <p className="text-[11px] text-slate-400 font-medium">
                Tokens are encrypted with AES-256 in the database and never stored in plaintext or browser localStorage.
              </p>
            </div>

            {testResult && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Connection Verified: @{testResult.authenticatedLogin}</span>
                </div>
                <p className="text-[11px] text-emerald-700">{testResult.message}</p>
                <div className="text-[10px] text-emerald-600 font-bold">
                  Mode: {testResult.tokenType} • Scope: {testResult.scopes}
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="submit"
                disabled={isConnecting || isTesting}
                className="px-7 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 font-black text-xs text-white shadow-md transition-all flex items-center justify-center gap-2"
              >
                <GithubIcon className="w-4 h-4" />
                <span>{isConnecting ? "Analyzing Repositories..." : "Connect & Analyze Portfolio →"}</span>
              </button>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || isConnecting}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <Activity className={`w-3.5 h-3.5 ${isTesting ? "animate-spin text-indigo-600" : ""}`} />
                <span>{isTesting ? "Testing Auth..." : "Test Connection"}</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    );
  }

  // ── 2. CONNECTED STATE: PORTFOLIO DASHBOARD LAYOUT ──
  const alignment = portfolio.targetRoleAlignment || {};

  return (
    <div className="space-y-6">
      
      {/* Top Connected Account Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4 min-w-0">
            <img
              src={portfolio.avatarUrl || "https://github.com/github.png"}
              alt={portfolio.username}
              className="w-14 h-14 rounded-2xl border border-slate-200 object-cover shadow-2xs"
            />
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  @{portfolio.username}
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Connected
                </span>
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
                {portfolio.bio || "Active GitHub Contributor"} • {portfolio.publicReposCount} Repositories Analyzed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-indigo-600" : ""}`} />
              <span>{refreshing ? "Re-analyzing..." : "Refresh Intelligence"}</span>
            </button>
            <button
              onClick={handleDisconnect}
              className="px-3 py-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors text-xs font-bold flex items-center gap-1"
              title="Disconnect GitHub"
            >
              <Unlink className="w-3.5 h-3.5" />
              <span>Disconnect</span>
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
              {alignment.demonstratedSkills?.length || 0} Verified Skills
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

      {/* ── 3. PORTFOLIO DASHBOARD TABS ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: "overview", label: "Portfolio Overview", icon: Layers },
          { id: "explorer", label: "Repository Explorer", icon: FolderGit2 },
          { id: "audit", label: "AI Code Audit", icon: ShieldCheck },
          { id: "skills", label: "Technical Skills & Role Match", icon: Code },
          { id: "roadmap", label: "Improvement Roadmap", icon: CheckSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: OVERVIEW ── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Target Role Skill Gap Alignment (Career Twin Integration) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-black text-slate-900 tracking-tight">
                  Career Twin Role Gap Alignment: {targetRole}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Comparing verified technologies in your repositories against target industry job requirements.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                {alignment.matchingPercentage || 0}% Match
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Quick Repo Preview Highlights */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-black text-slate-900 tracking-tight">
                Featured Repositories ({(portfolio.repositories || []).length})
              </h4>
              <button
                onClick={() => setActiveTab("explorer")}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>View All Repositories</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {(portfolio.repositories || []).slice(0, 6).map((repo) => (
                <div
                  key={repo._id || repo.name}
                  onClick={() => {
                    setSelectedRepo(repo);
                    setActiveTab("audit");
                  }}
                  className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200/80 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition-all space-y-2 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md">
                      {repo.language || "Code"}
                    </span>
                    <span className="text-[10px] font-black uppercase text-indigo-600">
                      Score: {repo.audit?.score || 70}/100
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                    {repo.name}
                  </h5>

                  <p className="text-xs text-slate-500 line-clamp-2 font-medium">
                    {repo.description || "No description provided."}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold pt-1">
                    <span className={repo.audit?.hasTests ? "text-emerald-600" : "text-slate-400"}>
                      {repo.audit?.hasTests ? "✓ Tests" : "✗ No Tests"}
                    </span>
                    <span>•</span>
                    <span className={repo.audit?.hasReadme ? "text-emerald-600" : "text-slate-400"}>
                      {repo.audit?.hasReadme ? "✓ README" : "✗ No README"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: REPOSITORY EXPLORER ── */}
      {activeTab === "explorer" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Select Repository ({(portfolio.repositories || []).length})
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
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
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
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            {!selectedRepo ? (
              <p className="text-xs text-slate-400 text-center py-10">Select a repository from the left panel.</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-black text-slate-900">{selectedRepo.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">Default Branch: {selectedRepo.defaultBranch || "main"}</p>
                  </div>
                  <a
                    href={selectedRepo.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>View on GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold">Stars</span>
                    <span className="text-base font-black text-slate-900">{selectedRepo.audit?.starsCount || 0}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold">Test Suites</span>
                    <span className="text-base font-black text-slate-900">{selectedRepo.audit?.hasTests ? "Present" : "Missing"}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold">License</span>
                    <span className="text-base font-black text-slate-900">{selectedRepo.audit?.licenseType || "None"}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("audit")}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Open Deep AI Code Audit →</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: AI CODE AUDIT & RECRUITER PERSPECTIVE ── */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
          {!selectedRepo ? (
            <p className="text-xs text-slate-400 text-center py-10">Select a repository to view deep AI audit.</p>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedRepo.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">
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
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: TECHNICAL SKILLS & ROLE MATCH ── */}
      {activeTab === "skills" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">Verified Technical Skills Spectrum</h3>
              <p className="text-xs text-slate-500 font-medium">Extracted from repository package dependencies and languages.</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {targetRole} Match
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">Demonstrated Technologies:</span>
              <div className="flex flex-wrap gap-2">
                {(alignment.demonstratedSkills || []).map((tech, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                    ✓ {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">Target Role Skills Missing:</span>
              <div className="flex flex-wrap gap-2">
                {(alignment.missingOrWeakSkills || []).map((tech, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">
                    + {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: IMPROVEMENT ROADMAP ── */}
      {activeTab === "roadmap" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">Portfolio Improvement Roadmap</h3>
              <p className="text-xs text-slate-500 font-medium">Prioritized action checklist to elevate portfolio score to Tier-1 recruiter level.</p>
            </div>
          </div>

          <div className="space-y-3">
            {(portfolio.portfolioChecklist || []).length === 0 ? (
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-800 block">Add Automated Unit & Integration Tests</span>
                  <p className="text-slate-500 font-medium">Configure Jest, PyTest, or Go test runner with GitHub Actions CI badge.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-800 block">Enhance README Architecture Diagrams</span>
                  <p className="text-slate-500 font-medium">Include system flowcharts or component diagrams in your top repository.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-800 block">Add Open Source License</span>
                  <p className="text-slate-500 font-medium">Add MIT or Apache 2.0 license to demonstrate software engineering rigor.</p>
                </div>
              </div>
            ) : (
              portfolio.portfolioChecklist.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">{item.task}</span>
                    <span className="text-[10px] text-slate-500">{item.category} • {item.repoName}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${item.completed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {item.completed ? "Done" : "Pending"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default GitHubPortfolioSection;
