import React, { useState } from "react";
import { studioRewrite, saveResumeVersion } from "../../services/api.js";

export const ResumeStudio = ({ initialParsedData, targetRole, onVersionSaved }) => {
  const [data, setData] = useState(
    initialParsedData || {
      personalInfo: { fullName: "Engineering Student", email: "student@learnx.edu", phone: "+91 98765 43210" },
      summary: "Dedicated Computer Science student with hands-on full stack project experience.",
      skills: { technical: ["JavaScript", "Python", "React", "Node.js", "SQL"] },
      experience: [
        {
          company: "Software Lab",
          role: "Engineering Intern",
          duration: "Summer 2024",
          bullets: ["Built RESTful APIs using Express and Node.js with database integration."],
        },
      ],
      projects: [
        {
          title: "Full Stack Web Platform",
          techStack: ["React", "Node.js", "MongoDB"],
          bullets: ["Engineered responsive student dashboard with authentication."],
        },
      ],
    }
  );

  const [activeTab, setActiveTab] = useState("experience"); // "summary" | "experience" | "projects" | "skills"
  const [rewriting, setRewriting] = useState(false);
  const [rewriteSuggestion, setRewriteSuggestion] = useState(null);
  const [targetBulletContext, setTargetBulletContext] = useState(null); // { type: "experience"|"projects", idx: number, bulletIdx: number }
  const [toastMsg, setToastMsg] = useState("");
  const [template, setTemplate] = useState("modern"); // "modern" | "classic" | "minimal"

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Trigger AI Rewrite on specific bullet
  const handleRequestRewrite = async (text, type, idx, bulletIdx) => {
    setRewriting(true);
    setRewriteSuggestion(null);
    setTargetBulletContext({ type, idx, bulletIdx });

    try {
      const res = await studioRewrite({
        sectionName: `${type === "experience" ? "Work Experience" : "Project"} Bullet`,
        currentContent: text,
        targetRole,
      });

      if (res.data?.rewrite) {
        setRewriteSuggestion(res.data.rewrite);
      }
    } catch (err) {
      showToast("AI rewrite failed. Try again.");
    } finally {
      setRewriting(false);
    }
  };

  // Apply suggestion
  const handleApplyRewrite = (newText) => {
    if (!targetBulletContext) return;
    const { type, idx, bulletIdx } = targetBulletContext;

    setData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (type === "experience" && copy.experience?.[idx]?.bullets) {
        copy.experience[idx].bullets[bulletIdx] = newText;
      } else if (type === "projects" && copy.projects?.[idx]?.bullets) {
        copy.projects[idx].bullets[bulletIdx] = newText;
      }
      return copy;
    });

    setRewriteSuggestion(null);
    setTargetBulletContext(null);
    showToast("✨ Applied AI optimization to resume bullet!");
  };

  // Save new version
  const handleSaveVersion = async () => {
    try {
      const res = await saveResumeVersion({
        label: `Studio Edit (${new Date().toLocaleDateString()})`,
        parsedData: data,
        targetRole,
      });
      if (res.data?.success) {
        showToast("💾 Saved new resume version in your history!");
        if (onVersionSaved) onVersionSaved();
      }
    } catch (err) {
      showToast("Failed to save resume version.");
    }
  };

  // Print / Export PDF
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Studio Top Toolbar ── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
            Interactive Workspace
          </span>
          <h2 className="text-lg font-black text-slate-900 mt-1">
            AI Resume Studio & Live Formatter
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Fine-tune bullets with action verbs, preview in ATS-friendly layouts, and download PDF.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Template Picker */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700">
            <span className="text-[10px] text-slate-400 px-1">Layout:</span>
            {["modern", "classic", "minimal"].map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                className={`px-2 py-1 rounded-lg capitalize ${template === t ? "bg-white text-violet-700 shadow-2xs" : "hover:text-slate-900"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleSaveVersion}
            className="px-4 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>💾</span> Save Version
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2 rounded-xl text-xs font-black bg-slate-800 hover:bg-slate-700 text-white shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>📥</span> Export PDF
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="fixed top-24 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <span>🔔</span> {toastMsg}
        </div>
      )}

      {/* ── Studio Split Workspace (Editor on Left, Live ATS Sheet on Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Section Editor with AI Polish Controls (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto">
            {["experience", "projects", "summary", "skills"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap ${
                  activeTab === tab ? "bg-white text-indigo-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Experience Editor */}
          {activeTab === "experience" && (
            <div className="space-y-4">
              {(data.experience || []).map((exp, eIdx) => (
                <div key={eIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const copy = { ...data };
                        copy.experience[eIdx].role = e.target.value;
                        setData(copy);
                      }}
                      className="font-black text-xs text-slate-900 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const copy = { ...data };
                        copy.experience[eIdx].company = e.target.value;
                        setData(copy);
                      }}
                      className="text-xs text-slate-500 text-right bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Bullets */}
                  <div className="space-y-2">
                    {(exp.bullets || []).map((bullet, bIdx) => (
                      <div key={bIdx} className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-2">
                        <textarea
                          value={bullet}
                          onChange={(e) => {
                            const copy = { ...data };
                            copy.experience[eIdx].bullets[bIdx] = e.target.value;
                            setData(copy);
                          }}
                          rows={2}
                          className="w-full text-xs text-slate-800 bg-transparent focus:outline-none resize-none"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleRequestRewrite(bullet, "experience", eIdx, bIdx)}
                            disabled={rewriting}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center gap-1"
                          >
                            <span>✨</span> AI Rewrite Bullet
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects Editor */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              {(data.projects || []).map((proj, pIdx) => (
                <div key={pIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => {
                      const copy = { ...data };
                      copy.projects[pIdx].title = e.target.value;
                      setData(copy);
                    }}
                    className="font-black text-xs text-slate-900 w-full bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                  />
                  <div className="space-y-2">
                    {(proj.bullets || []).map((bullet, bIdx) => (
                      <div key={bIdx} className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-2">
                        <textarea
                          value={bullet}
                          onChange={(e) => {
                            const copy = { ...data };
                            copy.projects[pIdx].bullets[bIdx] = e.target.value;
                            setData(copy);
                          }}
                          rows={2}
                          className="w-full text-xs text-slate-800 bg-transparent focus:outline-none resize-none"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleRequestRewrite(bullet, "projects", pIdx, bIdx)}
                            disabled={rewriting}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center gap-1"
                          >
                            <span>✨</span> AI Rewrite Bullet
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary Editor */}
          {activeTab === "summary" && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700">Executive Summary:</label>
              <textarea
                value={data.summary}
                onChange={(e) => setData({ ...data, summary: e.target.value })}
                rows={6}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          )}

          {/* Skills Editor */}
          {activeTab === "skills" && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700">Technical Skills (Comma separated):</label>
              <textarea
                value={(data.skills?.technical || []).join(", ")}
                onChange={(e) =>
                  setData({
                    ...data,
                    skills: { ...data.skills, technical: e.target.value.split(",").map((s) => s.trim()) },
                  })
                }
                rows={4}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          )}

          {/* AI Rewrite Review Modal / Drawer */}
          {rewriteSuggestion && (
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-indigo-800">
                  ✨ AI Bullet Rewrite Review
                </span>
                <button
                  onClick={() => setRewriteSuggestion(null)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 rounded-xl bg-white border border-indigo-100 space-y-1">
                <span className="text-[9px] font-black uppercase text-emerald-700">Option 1 — High Impact:</span>
                <p className="text-xs font-semibold text-slate-900">{rewriteSuggestion.optimized}</p>
                <button
                  onClick={() => handleApplyRewrite(rewriteSuggestion.optimized)}
                  className="mt-1 px-3 py-1 rounded-lg text-[10px] font-black bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Accept & Replace
                </button>
              </div>

              {rewriteSuggestion.alternative && (
                <div className="p-3 rounded-xl bg-white border border-indigo-100 space-y-1">
                  <span className="text-[9px] font-black uppercase text-sky-700">Option 2 — Technical Depth:</span>
                  <p className="text-xs font-semibold text-slate-900">{rewriteSuggestion.alternative}</p>
                  <button
                    onClick={() => handleApplyRewrite(rewriteSuggestion.alternative)}
                    className="mt-1 px-3 py-1 rounded-lg text-[10px] font-black bg-sky-600 text-white hover:bg-sky-700"
                  >
                    Accept & Replace
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Live ATS-Compliant Sheet Preview (7 Columns) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-300 shadow-md p-8 sm:p-10 font-sans text-slate-900 space-y-5 print:shadow-none print:p-0 print:border-none">
          {/* Header */}
          <div className="text-center pb-4 border-b border-slate-300 space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              {data.personalInfo?.fullName || "Candidate Name"}
            </h1>
            <p className="text-[11px] text-slate-600 font-medium">
              {data.personalInfo?.email} • {data.personalInfo?.phone} • {data.personalInfo?.location}
            </p>
            <div className="text-[10px] font-mono text-indigo-700 font-bold space-x-2">
              <span>{data.personalInfo?.github}</span>
              <span>{data.personalInfo?.linkedin}</span>
            </div>
          </div>

          {/* Summary */}
          {data.summary && (
            <div className="space-y-1">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                Professional Summary
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">{data.summary}</p>
            </div>
          )}

          {/* Technical Skills */}
          {data.skills?.technical && (
            <div className="space-y-1">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                Technical Skills
              </h2>
              <p className="text-xs text-slate-700 font-medium">
                <strong>Languages & Frameworks:</strong> {data.skills.technical.join(", ")}
              </p>
            </div>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                Experience
              </h2>
              {data.experience.map((exp, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{exp.role} — {exp.company}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{exp.duration}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11.5px] leading-relaxed">
                    {(exp.bullets || []).map((b, bI) => (
                      <li key={bI}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                Featured Projects
              </h2>
              {data.projects.map((proj, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{proj.title}</span>
                    <span className="text-[10px] text-indigo-700 font-mono font-semibold">
                      {(proj.techStack || []).join(" • ")}
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11.5px] leading-relaxed">
                    {(proj.bullets || []).map((b, bI) => (
                      <li key={bI}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeStudio;
