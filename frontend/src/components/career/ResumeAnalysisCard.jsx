import React from "react";

export const ResumeAnalysisCard = ({ analysis, onOpenStudio, onRunJobMatch }) => {
  if (!analysis || !analysis.overallQualityScore) {
    return (
      <div className="p-10 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <span className="text-4xl block">📊</span>
        <h3 className="text-base font-black text-slate-800">No Resume Analyzed Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Use the upload component above to upload your resume (PDF or DOCX). Once uploaded, your section-by-section ATS breakdown, recruiter readability, and missing keywords will appear here automatically.
        </p>
      </div>
    );
  }

  const {
    overallQualityScore = null,
    atsCompatibilityScore = null,
    recruiterReadabilityScore = null,
    sections = {},
    strengths = [],
    weaknesses = [],
    actionableImprovementPlan = [],
    languageFeedback = {},
    scoringMethodologyNote,
  } = analysis;

  const sectionKeys = [
    { key: "contactInfo", label: "Contact Info & Links", icon: "🌐" },
    { key: "summary", label: "Professional Summary", icon: "📝" },
    { key: "technicalSkills", label: "Technical Skills", icon: "⚡" },
    { key: "workExperience", label: "Work & Internships", icon: "💼" },
    { key: "projects", label: "Technical Projects", icon: "🚀" },
    { key: "education", label: "Education & Degree", icon: "🎓" },
    { key: "formattingAndStructure", label: "ATS Layout & Format", icon: "📐" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── 1. Top High-Impact Score Banners ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Overall Quality */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">
              Resume Quality Score
            </span>
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-black">{overallQualityScore}</span>
            <span className="text-sm text-slate-400 font-bold">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1">
            Holistic LearnX evaluation based on engineering impact, formatting, and skill depth.
          </p>
        </div>

        {/* ATS Compatibility */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              ATS Compatibility
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
              {atsCompatibilityScore >= 75 ? "High Pass" : atsCompatibilityScore >= 60 ? "Moderate" : "Low"}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-black text-emerald-600">{atsCompatibilityScore}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Estimated parsing rate across automated enterprise parsers (Workday, Greenhouse, Taleo).
          </p>
        </div>

        {/* Recruiter Readability */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Recruiter Readability
            </span>
            <span className="text-base">⏱️</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-black text-blue-600">{recruiterReadabilityScore}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Evaluation of the 6-second scan: bullet visual density, hierarchy, and active verbs.
          </p>
        </div>
      </div>

      {/* Methodology Disclaimer */}
      {scoringMethodologyNote && (
        <div className="p-3.5 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-[11px] text-slate-600 flex items-center gap-2 font-medium">
          <span className="text-sm">ℹ️</span>
          <span>{scoringMethodologyNote}</span>
        </div>
      )}

      {/* ── 2. Section-by-Section Diagnostic Audit ── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Section-by-Section ATS Diagnostic
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Individual section ratings, feedback, and optimization targets
            </p>
          </div>
          {onOpenStudio && (
            <button
              onClick={onOpenStudio}
              className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span>✨</span> Open in AI Resume Studio
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sectionKeys.map((sec) => {
            const data = sections[sec.key] || { score: 70, status: "Good", feedback: "Standard section content." };
            return (
              <div
                key={sec.key}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-indigo-300 transition-all space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{sec.icon}</span>
                    <span className="text-xs font-black text-slate-800">{sec.label}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      data.score >= 80
                        ? "bg-emerald-100 text-emerald-800"
                        : data.score >= 65
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {data.score}%
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  {data.feedback}
                </p>

                {data.improvements && data.improvements.length > 0 && (
                  <div className="pt-1 border-t border-slate-200/60 text-[10px] font-bold text-indigo-700">
                    💡 Tip: {data.improvements[0]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. Strengths vs Weaknesses ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-700">
            <span>✅</span>
            <h4 className="text-xs font-black uppercase tracking-wider">Identified Resume Strengths</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-700">
            <span>⚠️</span>
            <h4 className="text-xs font-black uppercase tracking-wider">ATS & Recruiter Bottlenecks</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {weaknesses.map((wk, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>{wk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── 4. Actionable Improvement Plan ── */}
      {actionableImprovementPlan && actionableImprovementPlan.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
            🎯 Actionable Improvement Roadmap
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {actionableImprovementPlan.map((plan, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-indigo-700">{plan.category}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-100 text-rose-800">
                    {plan.priority} Priority
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 leading-snug">{plan.action}</div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{plan.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 5. Grammar & Power Verb Insights ── */}
      {languageFeedback && (
        <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Grammar & Vocabulary Power
            </span>
            <div className="text-xs text-slate-700 font-medium">
              Found <strong>{languageFeedback.actionVerbCount || 0} active power verbs</strong> and{" "}
              <strong>{languageFeedback.passiveVoiceDetected || 0} passive voice phrases</strong>.
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400">Recommended Verbs:</span>
            {(languageFeedback.recommendedVerbs || ["Architected", "Engineered", "Optimized"]).map((v, i) => (
              <span key={i} className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white text-indigo-700 border border-slate-200">
                {v}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalysisCard;
