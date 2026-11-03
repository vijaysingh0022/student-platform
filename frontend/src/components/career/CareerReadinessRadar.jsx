import React from "react";

export const CareerReadinessRadar = ({ pillars = {}, overallScore = null, confidenceLevel, dataCoverage }) => {
  const {
    technicalReadiness = null,
    projectReadiness = null,
    resumeReadiness = null,
    interviewReadiness = null,
    communicationReadiness = null,
  } = pillars;

  const pillarItems = [
    { label: "Technical Competence", score: technicalReadiness, weight: "30%", icon: "💻", desc: "Core algorithms, DBMS, system architecture", source: "Assessments" },
    { label: "Project Depth", score: projectReadiness, weight: "25%", icon: "🚀", desc: "Engineering implementation & deployment proof", source: "Uploaded Resume" },
    { label: "ATS Resume Readiness", score: resumeReadiness, weight: "20%", icon: "📄", desc: "Keyword density & quantifiable metrics", source: "Uploaded Resume" },
    { label: "Interview Readiness", score: interviewReadiness, weight: "15%", icon: "🎙️", desc: "Technical viva & problem explanation", source: "Mock Interviews" },
    { label: "Communication & Clarity", score: communicationReadiness, weight: "10%", icon: "🗣️", desc: "Summary & active voice metrics", source: "Uploaded Resume" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">📊</span>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              5-Pillar Career Readiness Profile
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Holistic readiness calculated strictly from your verified assessments, uploaded resume, and mock interviews.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {dataCoverage && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200">
              {dataCoverage}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
            Status: {confidenceLevel || (overallScore !== null ? "Empirically Verified" : "Awaiting Data")}
          </span>
        </div>
      </div>

      {/* Progress Bars for the 5 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {pillarItems.map((p, idx) => {
          const hasData = typeof p.score === "number" && p.score !== null;

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border space-y-2 flex flex-col justify-between ${
                hasData ? "bg-slate-50/70 border-slate-200/80" : "bg-slate-50/30 border-dashed border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5 truncate">
                    <span>{p.icon}</span>
                    <span className="truncate">{p.label}</span>
                  </span>
                  <span className={hasData ? "text-indigo-600 font-black" : "text-slate-400 font-bold"}>
                    {hasData ? `${p.score}%` : "Not Enough Data"}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-700 ${
                      hasData ? "bg-gradient-to-r from-indigo-500 to-violet-600" : "bg-transparent"
                    }`}
                    style={{ width: hasData ? `${p.score}%` : "0%" }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-200/50">
                <span>Weight: {p.weight}</span>
                <span className="text-slate-500 truncate" title={`Source: ${p.source}`}>
                  {p.source}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CareerReadinessRadar;
