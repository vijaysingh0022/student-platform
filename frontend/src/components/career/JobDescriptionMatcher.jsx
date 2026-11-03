import React, { useState } from "react";
import { matchJobDescription } from "../../services/api.js";

export const JobDescriptionMatcher = ({ currentTargetRole, resumeText, onSaveMatch }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleRunMatch = async () => {
    if (!jobDescription || jobDescription.trim().length < 25) {
      setErrorMsg("Please paste a comprehensive job description (at least 25 characters).");
      return;
    }

    setMatching(true);
    setErrorMsg(null);
    try {
      const res = await matchJobDescription({
        jobTitle: jobTitle || currentTargetRole,
        company: company || "Target Employer",
        jobDescription,
        targetRole: currentTargetRole,
        resumeText,
      });

      if (res.data?.jobMatch) {
        setMatchResult(res.data.jobMatch);
        if (onSaveMatch) onSaveMatch(res.data.jobMatch);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to compare job description.");
    } finally {
      setMatching(false);
    }
  };

  const handleLoadSampleJD = () => {
    setJobTitle("Software Engineer — Full Stack");
    setCompany("TechCorp Cloud Platform");
    setJobDescription(`We are looking for a Software Engineer to build high-scale web platforms.
REQUIREMENTS:
- 0-2 years of software engineering experience or B.Tech in Computer Science.
- Strong proficiency in JavaScript, TypeScript, React.js, and Node.js.
- Solid understanding of Relational Databases (PostgreSQL) and schema normalization.
- Experience with RESTful APIs, caching strategies (Redis), and Docker containerization.
- Knowledge of Data Structures and Algorithms (tree traversal, graph algorithms).
- Strong communication and automated testing experience (Jest / Cypress).`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Input Card ── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">🎯</span>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Intelligent Job Description Matcher
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Paste any job posting from LinkedIn, Indeed, or AngelList to evaluate exact keyword alignment.
            </p>
          </div>
          <button
            onClick={handleLoadSampleJD}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 self-start sm:self-auto hover:underline"
          >
            + Load Sample Job Description
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Job Title:</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Full Stack Developer"
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Company / Team (Optional):</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google, Amazon, Razorpay"
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Job Description Text:</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            placeholder="Paste complete job requirements, responsibilities, and qualifications..."
            className="w-full p-3.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 bg-slate-50/50 focus:outline-none focus:border-indigo-600 resize-none"
          />
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleRunMatch}
            disabled={matching}
            className="px-5 py-2.5 rounded-xl text-xs font-black bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {matching ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running ATS Matching Algorithm...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Analyze Job Description Fit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Match Results Presentation ── */}
      {matchResult && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6 animate-fade-in">
          {/* Top Metric Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                Fit Evaluation
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                {matchResult.jobTitle} {matchResult.company ? `at ${matchResult.company}` : ""}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Matched against your current uploaded resume profile.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Match Score</div>
                <div className="text-2xl font-black text-indigo-700">
                  {matchResult.matchPercentage}%
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center">
                {matchResult.matchPercentage >= 75 ? "🎉" : matchResult.matchPercentage >= 55 ? "📈" : "⚠️"}
              </div>
            </div>
          </div>

          {/* Matching vs Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matching Skills */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-900">
                  ✅ Matching Skills & Evidence ({matchResult.matchingSkills?.length || 0})
                </span>
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {(matchResult.matchingSkills || []).map((ms, i) => (
                  <div key={i} className="p-2 rounded-xl bg-white border border-emerald-100 text-xs">
                    <span className="font-bold text-slate-900">{ms.name}</span>
                    {ms.evidenceInResume && (
                      <p className="text-[11px] text-slate-500 mt-0.5 italic">"{ms.evidenceInResume}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-rose-900">
                  ❌ Missing Skills & Requirements ({matchResult.missingSkills?.length || 0})
                </span>
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {(matchResult.missingSkills || []).map((ms, i) => (
                  <div key={i} className="p-2 rounded-xl bg-white border border-rose-100 text-xs flex items-center justify-between">
                    <span className="font-bold text-slate-900">{ms.name}</span>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      {ms.importance || "Must-have"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Missing Keywords Chip Cloud */}
          {matchResult.missingKeywords && matchResult.missingKeywords.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                🔑 High-Priority Missing Keywords for ATS Parsing:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {matchResult.missingKeywords.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {matchResult.recommendations && matchResult.recommendations.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-black uppercase text-slate-900">
                💡 Targeted Tailoring Advice:
              </span>
              <ul className="space-y-1 text-xs text-slate-700">
                {matchResult.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDescriptionMatcher;
