import React, { useState } from "react";
import GitHubPortfolioSection from "../components/portfolio/GitHubPortfolioSection.jsx";
import { Sparkles, ArrowRight } from "lucide-react";

export const PortfolioPage = () => {
  const [targetRole, setTargetRole] = useState("Backend Developer");

  const ROLES = [
    "Backend Developer",
    "Frontend Developer",
    "Full Stack Engineer",
    "DevOps Engineer",
    "Machine Learning Engineer",
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LearnX Developer Portfolio Intelligence</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                GitHub Portfolio & Recruiter Audit
              </h1>
              <p className="text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
                Connect your GitHub to perform static code analysis, README quality checks, automated test verification, and role gap matching.
              </p>
            </div>

            {/* Target Role Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-400">Target Role:</span>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <GitHubPortfolioSection targetRole={targetRole} />
      </div>
    </div>
  );
};

export default PortfolioPage;
