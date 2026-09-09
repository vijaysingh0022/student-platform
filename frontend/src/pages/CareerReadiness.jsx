import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const DIFF_COLORS = { "Hard": "text-rose-700 bg-rose-50 border-rose-200", "Medium": "text-amber-700 bg-amber-50 border-amber-200", "Easy": "text-emerald-700 bg-emerald-50 border-emerald-200" };

const CareerReadiness = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [targetRole, setTargetRole] = useState("Full Stack Software Engineer");
  const [updatingRole, setUpdatingRole] = useState(false);

  const [resumeText, setResumeText] = useState("");
  const [analyzingResume, setAnalyzingResume] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [resumeMode, setResumeMode] = useState("upload");
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadedFilename, setUploadedFilename] = useState("");

  const [bulletInput, setBulletInput] = useState("");
  const [optimizingBullet, setOptimizingBullet] = useState(false);
  const [bulletResult, setBulletResult] = useState(null);

  const [selectedMockIndex, setSelectedMockIndex] = useState(0);
  const [userMockAnswer, setUserMockAnswer] = useState("");
  const [evaluatingMock, setEvaluatingMock] = useState(false);
  const [mockFeedback, setMockFeedback] = useState(null);
  const [generatingQuestion, setGeneratingQuestion] = useState(false);
  const [customQuestions, setCustomQuestions] = useState(null);
  const [mockSubjectFilter, setMockSubjectFilter] = useState("All");

  const fetchCareerData = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get("/career/dashboard");
      setData(res);
      if (res.targetRole) setTargetRole(res.targetRole);
      if (res.resumeText) setResumeText(res.resumeText);
    } catch (err) {
      console.error("Failed to load career dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCareerData(); }, []);

  const handleRoleChange = async (newRole) => {
    setTargetRole(newRole);
    setUpdatingRole(true);
    setCustomQuestions(null);
    try {
      await api.post("/career/update-role", { targetRole: newRole });
      await fetchCareerData();
    } catch (err) {
      console.error("Error updating role:", err);
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleAnalyzeResume = async () => {
    if (!resumeText.trim() || resumeText.length < 15) {
      alert("Please enter or paste your resume text first.");
      return;
    }
    setAnalyzingResume(true);
    setResumeAnalysis(null);
    try {
      const { data: res } = await api.post("/career/analyze-resume", { resumeText, targetRole });
      setResumeAnalysis(res);
      fetchCareerData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to analyze resume.");
    } finally {
      setAnalyzingResume(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit. Please upload a smaller file.");
      if (e.target) e.target.value = "";
      return;
    }
    setResumeFile(file);
    setUploadingResume(true);
    setResumeAnalysis(null);
    const formData = new FormData();
    formData.append("resumeFile", file);
    formData.append("targetRole", targetRole);
    try {
      const { data: res } = await api.post("/career/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResumeAnalysis(res);
      if (res.resumeText) setResumeText(res.resumeText);
      if (res.filename) setUploadedFilename(res.filename);
      fetchCareerData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to parse and evaluate resume file. Please ensure it is a valid PDF, DOCX, or text file.");
    } finally {
      setUploadingResume(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleOptimizeBullet = async () => {
    if (!bulletInput.trim() || bulletInput.trim().length < 5) {
      alert("Please enter a valid bullet point to optimize.");
      return;
    }
    setOptimizingBullet(true);
    setBulletResult(null);
    try {
      const { data: res } = await api.post("/career/optimize-bullet", { bulletText: bulletInput, targetRole });
      setBulletResult(res);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to optimize bullet point.");
    } finally {
      setOptimizingBullet(false);
    }
  };

  const handleEvaluateMock = async () => {
    if (!userMockAnswer.trim()) {
      alert("Please enter your response before submitting.");
      return;
    }
    setEvaluatingMock(true);
    setMockFeedback(null);
    try {
      const questions = customQuestions || data?.mockQuestions || [];
      const filtered = mockSubjectFilter === "All" ? questions : questions.filter(q => q.subject === mockSubjectFilter);
      const mockQ = filtered[selectedMockIndex];
      const { data: res } = await api.post("/career/evaluate-mock", {
        question: mockQ?.question,
        answer: userMockAnswer,
        subject: mockQ?.subject,
        difficulty: mockQ?.difficulty,
      });
      setMockFeedback(res);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to evaluate answer.");
    } finally {
      setEvaluatingMock(false);
    }
  };

  const handleGenerateQuestion = async (subject, difficulty) => {
    setGeneratingQuestion(true);
    try {
      const { data: res } = await api.post("/career/generate-question", {
        subject,
        difficulty: difficulty || "Medium",
        targetRole,
      });
      const base = customQuestions || [...(data?.mockQuestions || [])];
      const updated = [...base, { ...res, id: `custom_${Date.now()}` }];
      setCustomQuestions(updated);
      setMockSubjectFilter("All");
      setSelectedMockIndex(updated.length - 1);
      setUserMockAnswer("");
      setMockFeedback(null);
    } catch (err) {
      alert("Failed to generate question.");
    } finally {
      setGeneratingQuestion(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderTopColor: "#7c3aed", borderColor: "rgba(124,58,237,0.2)" }} />
          </div>
          <h3 className="text-base font-semibold text-slate-800">Synthesizing Career Engine...</h3>
          <p className="text-xs text-slate-500">Generating AI interview questions & calculating readiness score</p>
        </div>
      </div>
    );
  }

  const score = data?.jobReadinessScore || 72;
  const ats = data?.atsScore || 65;
  const allQuestions = customQuestions || data?.mockQuestions || [];
  const filteredQuestions = mockSubjectFilter === "All" ? allQuestions : allQuestions.filter(q => q.subject === mockSubjectFilter);
  const uniqueSubjects = ["All", ...new Set(allQuestions.map(q => q.subject))];

  const TABS = [
    { id: "overview", label: "Overview", icon: "🎯" },
    { id: "roadmap", label: "Career Roadmap", icon: "🗺️" },
    { id: "projects", label: "Projects", icon: "💡" },
    { id: "resume", label: "Resume & ATS", icon: "📄" },
    { id: "skills", label: "Skill Matrix", icon: "⚡" },
    { id: "mock", label: "Mock Interview", icon: "🎙️" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6" id="career-readiness-page">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-violet-100 text-violet-800 border border-violet-200 mb-2">
            💼 CAREER + RESUME + JOB READINESS ENGINE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Career & Job <span className="gradient-text">Readiness Engine</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">AI roadmaps, ATS scanner, project recommendations & mock interviews for <strong>{targetRole}</strong>.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-700 px-2">Target Role:</div>
          <select
            value={targetRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            disabled={updatingRole}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 border border-slate-300 text-slate-900 focus:outline-none focus:border-violet-600 cursor-pointer"
          >
            {(data?.availableRoles || ["Full Stack Software Engineer"]).map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {updatingRole && <div className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin border-violet-600" />}
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-white text-violet-700 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Readiness Gauge */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-violet-200 p-6 flex flex-col justify-between shadow-sm">
              <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4">Job Readiness Score</div>
              <div className="flex items-center gap-5">
                <div className="relative w-24 h-24 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path strokeWidth="3.5" stroke="#e2e8f0" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path
                      strokeWidth="3.5"
                      strokeDasharray={`${score}, 100`}
                      strokeLinecap="round"
                      stroke={score >= 75 ? "#059669" : score >= 55 ? "#7c3aed" : "#dc2626"}
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-slate-900">{score}%</span>
                    <span className="text-[9px] text-slate-500 uppercase font-bold">Readiness</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-extrabold text-slate-900">{targetRole}</div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Tests: {data?.averageScore}% avg · ATS: {ats}% · {data?.testsTaken || 0} taken
                  </p>
                  <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${score >= 75 ? "bg-emerald-100 text-emerald-800" : score >= 55 ? "bg-violet-100 text-violet-800" : "bg-rose-100 text-rose-800"}`}>
                    {score >= 75 ? "🟢 Job Ready" : score >= 55 ? "🟡 Developing" : "🔴 Action Needed"}
                  </span>
                </div>
              </div>
              {data?.aiCareerSynthesis && (
                <div className="mt-4 p-3.5 rounded-xl bg-violet-50 border border-violet-100 text-xs space-y-1">
                  <div className="font-extrabold text-violet-800 flex items-center gap-1">🤖 AI Evaluation:</div>
                  <p className="text-slate-700 leading-relaxed font-medium">{data.aiCareerSynthesis.readinessEvaluation}</p>
                  {data.aiCareerSynthesis.keyNextStep && (
                    <p className="font-bold text-sky-700">💡 Next: {data.aiCareerSynthesis.keyNextStep}</p>
                  )}
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "ATS Resume Score", value: `${ats}%`, icon: "📄", sub: "Resume match" },
                { label: "Test Avg Score", value: `${data?.averageScore}%`, icon: "🧠", sub: "Academic mastery" },
                { label: "Assessments Taken", value: data?.testsTaken || 0, icon: "📊", sub: "Tests completed" },
                { label: "Skills Job-Ready", value: `${data?.skillMatchMatrix?.filter(s => s.masteryScore >= 75).length || 0}/${data?.skillMatchMatrix?.length || 0}`, icon: "⚡", sub: "Mastered skills" },
                { label: "Roadmap Phases", value: data?.roadmapPhases?.length || 3, icon: "🗺️", sub: "3-month plan" },
                { label: "Project Ideas", value: data?.recommendedProjects?.length || 3, icon: "💡", sub: "Portfolio blueprints" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <div className="text-lg mb-1">{s.icon}</div>
                  <div className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
                  <div className="text-[11px] font-bold text-slate-700 mt-0.5">{s.label}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Launch */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900 mb-4">🚀 Career Engine Modules</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {TABS.filter(t => t.id !== "overview").map(mod => (
                <button
                  key={mod.id}
                  onClick={() => setActiveTab(mod.id)}
                  className="p-4 rounded-xl text-left border border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-violet-50 transition-all flex flex-col gap-2 group"
                >
                  <span className="text-2xl">{mod.icon}</span>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-violet-700">{mod.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Top skill gaps */}
          {data?.skillMatchMatrix && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-extrabold text-slate-900">⚡ Skill Readiness — {targetRole}</h2>
                <button onClick={() => setActiveTab("skills")} className="text-xs font-bold text-violet-700 hover:underline">View Full Matrix →</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.skillMatchMatrix.slice(0, 6).map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{item.skill}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.masteryScore >= 75 ? "bg-emerald-100 text-emerald-700" : item.masteryScore >= 55 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>{item.status}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width: `${item.masteryScore}%`, backgroundColor: item.masteryScore >= 75 ? "#059669" : item.masteryScore >= 55 ? "#d97706" : "#dc2626" }} />
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">{item.masteryScore}% mastery</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CAREER ROADMAP ── */}
      {activeTab === "roadmap" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                🗺️ Career Roadmap — <span className="gradient-text">{targetRole}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">3-month execution path from fundamentals to job-ready deployment</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-800 border border-violet-200 self-start">3-Month Blueprint</span>
          </div>
          <div className="space-y-4">
            {(data?.roadmapPhases || []).map((phase, idx) => (
              <div key={idx} className="flex items-start gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-violet-200 transition-all">
                <div className="w-10 h-10 rounded-xl bg-violet-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-base font-extrabold text-slate-900">{phase.phase}</h3>
                  <div className="flex items-start gap-1.5">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 shrink-0 mt-0.5">FOCUS</span>
                    <p className="text-xs font-bold text-violet-700">{phase.focus}</p>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{phase.action}</p>
                  <Link
                    to={`/tutor?q=${encodeURIComponent(`Create a detailed week-by-week study plan for: "${phase.phase}" with focus on ${phase.focus}. Include daily tasks and practice problems for ${targetRole} preparation.`)}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:underline"
                  >
                    <span>📚 Get AI Weekly Study Plan</span><span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-between">
            <p className="text-xs font-medium text-slate-700">Want a personalized 90-day daily schedule?</p>
            <Link
              to={`/tutor?q=${encodeURIComponent(`Generate a full 90-day personalized preparation plan for "${targetRole}" with daily tasks, weekly goals, and practice resources.`)}`}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-violet-600 text-white hover:bg-violet-700 shadow-sm"
            >
              📅 Generate 90-Day AI Plan
            </Link>
          </div>
        </div>
      )}

      {/* ── PROJECT RECOMMENDATIONS ── */}
      {activeTab === "projects" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                💡 Portfolio Project Recommendations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Production-grade blueprints to impress recruiters for <strong>{targetRole}</strong></p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200 self-start">Curated Portfolio</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(data?.recommendedProjects || []).map((proj, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 hover:border-violet-300 hover:shadow-sm transition-all flex flex-col overflow-hidden">
                <div className="p-5 flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${proj.level === "Advanced" ? "bg-rose-50 text-rose-800 border-rose-200" : proj.level === "Intermediate" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-emerald-50 text-emerald-800 border-emerald-200"}`}>{proj.level}</span>
                    <span className="text-xs font-bold text-slate-400">Project #{idx + 1}</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900">{proj.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{proj.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.skills.map(skill => (
                      <span key={skill} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="p-4 border-t border-slate-200 grid grid-cols-2 gap-2">
                  <Link
                    to={`/tutor?q=${encodeURIComponent(`Give me a detailed technical architecture and step-by-step build guide for: "${proj.title}" using ${proj.skills.join(", ")}.`)}`}
                    className="py-2 rounded-xl text-[11px] font-extrabold bg-violet-600 text-white text-center hover:bg-violet-700"
                  >
                    🏗️ Architecture
                  </Link>
                  <Link
                    to={`/tutor?q=${encodeURIComponent(`What interview questions should I prepare for a project like "${proj.title}" using ${proj.skills.join(", ")}? Include system design and coding questions.`)}`}
                    className="py-2 rounded-xl text-[11px] font-extrabold bg-slate-100 text-slate-800 text-center hover:bg-slate-200 border border-slate-200"
                  >
                    🎤 Interview Prep
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <p className="text-xs font-medium text-slate-700">Need a custom project idea matching your exact skills?</p>
            <Link
              to={`/tutor?q=${encodeURIComponent(`Suggest 3 unique, impressive project ideas for a ${targetRole} candidate that stand out in a portfolio. Include tech stack, complexity, and real-world impact.`)}`}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-sky-600 text-white hover:bg-sky-700 shadow-sm"
            >
              ✨ Generate Custom Ideas
            </Link>
          </div>
        </div>
      )}

      {/* ── RESUME BUILDER & ATS ANALYZER ── */}
      {activeTab === "resume" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm animate-fade-in-up space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                📄 Resume Builder & ATS Analyzer
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Upload your resume or paste text — AI evaluates against ATS benchmarks for <strong>{targetRole}</strong></p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
              {[{ key: "upload", label: "📁 Upload" }, { key: "text", label: "✏️ Text" }, { key: "optimizer", label: "✨ AI Bullets" }].map(m => (
                <button
                  key={m.key}
                  onClick={() => setResumeMode(m.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${resumeMode === m.key ? "bg-white text-violet-700 shadow-sm border border-slate-200" : "text-slate-600 hover:text-slate-900"}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* FILE UPLOAD */}
              {resumeMode === "upload" && (
                <div className="space-y-4">
                  <label className="block cursor-pointer">
                    <div className={`p-8 rounded-2xl border-2 border-dashed text-center flex flex-col items-center justify-center transition-all ${uploadingResume ? "border-violet-400 bg-violet-50 animate-pulse" : "border-violet-200 bg-violet-50/40 hover:bg-violet-50 hover:border-violet-400"}`}>
                      <div className="w-14 h-14 rounded-2xl bg-white border border-violet-200 flex items-center justify-center text-3xl shadow-sm mb-3">
                        {uploadingResume ? "⏳" : "📄"}
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                        {uploadingResume ? "Parsing & Scanning with AI..." : resumeFile ? resumeFile.name : "Upload Your Resume"}
                      </h3>
                      <p className="text-xs text-slate-500 max-w-xs mb-3 font-medium">
                        {uploadingResume ? "Extracting text and running ATS evaluation..." : "Drag & drop or click. Supports PDF, DOCX, DOC, TXT (max 10MB)"}
                      </p>
                      {!uploadingResume && <span className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-violet-600 text-white shadow-sm">Select File →</span>}
                    </div>
                    <input type="file" accept=".pdf,.docx,.doc,.txt,.md" onChange={handleFileUpload} className="sr-only" disabled={uploadingResume} />
                  </label>
                  {uploadedFilename && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-800 truncate">✅ {uploadedFilename}</span>
                      <button onClick={() => setResumeMode("text")} className="text-[11px] font-bold text-sky-700 hover:underline shrink-0 ml-2">View Extracted Text →</button>
                    </div>
                  )}
                </div>
              )}

              {/* TEXT EDITOR */}
              {resumeMode === "text" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Paste / Edit Resume Text:</label>
                    <button
                      onClick={() => setResumeText(`Alex Rivera - CS Student\nGitHub: github.com/alexrivera\n\nSKILLS: JavaScript, TypeScript, React.js, Node.js, Express, MongoDB, PostgreSQL, Git, Docker\n\nPROJECTS:\n1. Student Analytics Platform — React + Express + MongoDB + JWT auth, role-based dashboards\n2. Real-time Chat App — WebSocket with Redis pub/sub, 200+ concurrent users\n\nEDUCATION: B.Tech Computer Science | GPA: 8.8/10 | 2022–2026`)}
                      className="text-[11px] font-bold text-violet-700 hover:underline"
                    >
                      + Load Sample Resume
                    </button>
                  </div>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume: skills, projects, education, experience..."
                    rows={12}
                    className="w-full p-4 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 bg-slate-50 focus:outline-none focus:border-violet-500 resize-none"
                  />
                  <button
                    onClick={handleAnalyzeResume}
                    disabled={analyzingResume}
                    className="w-full py-3 rounded-xl text-xs font-extrabold btn-gradient text-white flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {analyzingResume ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Running AI ATS Scanner...</span></> : <span>🔍 Evaluate with AI ATS Scanner</span>}
                  </button>
                </div>
              )}

              {/* BULLET OPTIMIZER */}
              {resumeMode === "optimizer" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-violet-50 border border-violet-200">
                    <h3 className="text-xs font-extrabold text-violet-900 mb-1">✨ AI Resume Bullet Rewrite Tool</h3>
                    <p className="text-[11px] text-slate-600 font-medium">Enter a weak draft bullet. AI rewrites it with active verbs, impact metrics & technical keywords for <strong>{targetRole}</strong>.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Your Draft Bullet:</label>
                    <textarea
                      value={bulletInput}
                      onChange={(e) => setBulletInput(e.target.value)}
                      placeholder="e.g. built a backend api for student management"
                      rows={3}
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] text-slate-500 font-bold self-center">Try:</span>
                    {["built a REST API", "worked on database optimization", "created a React dashboard", "did code review"].map(ex => (
                      <button key={ex} onClick={() => setBulletInput(ex)} className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200">{ex}</button>
                    ))}
                  </div>
                  <button
                    onClick={handleOptimizeBullet}
                    disabled={optimizingBullet}
                    className="w-full py-3 rounded-xl text-xs font-extrabold bg-violet-600 text-white hover:bg-violet-700 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {optimizingBullet ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Rewriting with AI...</span></> : <span>✨ Generate AI-Powered Rewrites</span>}
                  </button>
                  {bulletResult && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="text-xs font-extrabold text-slate-900">🎯 AI Rewrites:</div>
                      <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1">
                        <span className="text-[9px] font-extrabold text-emerald-800 uppercase tracking-widest">Option A — Primary Impact:</span>
                        <p className="text-xs font-semibold text-slate-900 leading-relaxed">{bulletResult.optimized}</p>
                      </div>
                      {bulletResult.alternative && (
                        <div className="p-3.5 rounded-xl bg-white border border-sky-200 space-y-1">
                          <span className="text-[9px] font-extrabold text-sky-800 uppercase tracking-widest">Option B — Technical Depth:</span>
                          <p className="text-xs font-semibold text-slate-900 leading-relaxed">{bulletResult.alternative}</p>
                        </div>
                      )}
                      {bulletResult.keyImprovement && (
                        <p className="text-[11px] text-slate-500 font-medium italic border-t border-slate-200 pt-2">💡 {bulletResult.keyImprovement}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ATS Analysis Results */}
            <div>
              {resumeAnalysis ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-sky-50 border border-violet-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-violet-700 mb-0.5">ATS Readiness Score</div>
                      <div className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {resumeAnalysis.atsScore}<span className="text-sm font-normal text-slate-400">%</span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-xs font-extrabold px-3 py-1 rounded-full bg-violet-600 text-white">{resumeAnalysis.roleFitLevel || "Analyzed"}</div>
                      <div className="text-[11px] text-slate-500 font-semibold">Format: {resumeAnalysis.formattingRating}</div>
                    </div>
                  </div>
                  {resumeAnalysis.executiveSummary && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-xs font-extrabold text-slate-900 mb-1.5">🤖 AI Recruiter Assessment:</div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">{resumeAnalysis.executiveSummary}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="text-xs font-bold text-emerald-800 mb-2 flex items-center justify-between">
                        <span>✓ Matched</span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">{resumeAnalysis.matchedSkills?.length || 0}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {resumeAnalysis.matchedSkills?.map(s => <span key={s} className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900">{s}</span>)}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                      <div className="text-xs font-bold text-rose-800 mb-2 flex items-center justify-between">
                        <span>✗ Missing</span>
                        <span className="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded font-bold">{resumeAnalysis.missingSkills?.length || 0}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {resumeAnalysis.missingSkills?.map(s => <span key={s} className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-200 text-rose-900">{s}</span>)}
                      </div>
                    </div>
                  </div>
                  {resumeAnalysis.criticalRedFlags?.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                      <h4 className="text-xs font-extrabold text-amber-900 mb-2">⚠️ Critical Red Flags:</h4>
                      <ul className="space-y-1">
                        {resumeAnalysis.criticalRedFlags.map((f, i) => <li key={i} className="text-xs text-amber-800 font-medium flex items-start gap-1.5"><span className="text-amber-600 shrink-0">•</span><span>{f}</span></li>)}
                      </ul>
                    </div>
                  )}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="text-xs font-extrabold text-slate-900">💡 AI Improvement Recommendations:</h4>
                    <ul className="space-y-2">
                      {resumeAnalysis.actionableBullets?.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="text-violet-600 font-bold shrink-0 text-xs">#{i + 1}</span>
                          <span className="text-xs text-slate-700 font-medium leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => setResumeAnalysis(null)} className="w-full py-2 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 hover:border-violet-300 hover:text-violet-700 transition-all">
                    🔄 Clear & Scan Again
                  </button>
                </div>
              ) : (
                <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                  <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center text-3xl mb-4">📄</div>
                  <h4 className="text-sm font-extrabold text-slate-800 mb-1">No Resume Scanned Yet</h4>
                  <p className="text-xs text-slate-500 max-w-xs font-medium">
                    {resumeMode === "upload" && "Upload a PDF/DOCX file above to get instant AI ATS evaluation."}
                    {resumeMode === "text" && "Paste your resume text and click Evaluate for AI ATS analysis."}
                    {resumeMode === "optimizer" && "Switch to Upload or Text mode to evaluate your full resume."}
                  </p>
                  {resumeMode === "optimizer" && (
                    <button onClick={() => setResumeMode("upload")} className="mt-4 px-4 py-2 rounded-xl text-xs font-extrabold bg-violet-600 text-white hover:bg-violet-700">Upload Resume →</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SKILL MATRIX ── */}
      {activeTab === "skills" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm animate-fade-in-up space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                ⚡ Skill & Job Matching Matrix
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Diagnostic mastery vs market expectations for <strong>{targetRole}</strong></p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold self-start">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> ≥75% Ready</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> 55–74% Developing</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> &lt;55% Action Needed</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(data?.skillMatchMatrix || []).map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 hover:border-violet-200 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{item.skill}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.masteryScore >= 75 ? "bg-emerald-100 text-emerald-800" : item.masteryScore >= 55 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"}`}>{item.status}</span>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${item.masteryScore}%`, backgroundColor: item.masteryScore >= 75 ? "#059669" : item.masteryScore >= 55 ? "#d97706" : "#dc2626" }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                    <span>{item.masteryScore}% mastery</span><span>Target: 75%+</span>
                  </div>
                </div>
                <Link
                  to={`/tutor?q=${encodeURIComponent(`I need to improve my ${item.skill} for ${targetRole} interviews. Current mastery: ${item.masteryScore}%. Give me a focused 2-week study plan with daily tasks and practice problems.`)}`}
                  className="block text-center py-1.5 rounded-lg text-[11px] font-extrabold text-violet-700 bg-violet-50 border border-violet-200 hover:bg-violet-100 transition-all"
                >
                  {item.masteryScore < 75 ? "📚 Get Improvement Plan →" : "✅ Keep Practicing →"}
                </Link>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Job-Ready: {data?.skillMatchMatrix?.filter(s => s.masteryScore >= 75).length || 0} / {data?.skillMatchMatrix?.length || 0} skills</p>
              <p className="text-xs text-slate-500">Take diagnostic tests to improve your mastery scores</p>
            </div>
            <Link to="/test" className="px-4 py-2 rounded-xl text-xs font-extrabold bg-violet-600 text-white hover:bg-violet-700 shadow-sm">
              📝 Take Diagnostic Test
            </Link>
          </div>
        </div>
      )}

      {/* ── MOCK INTERVIEW ARENA ── */}
      {activeTab === "mock" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm animate-fade-in-up space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                🎙️ Mock Technical Interview & Viva Arena
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">AI-generated questions for <strong>{targetRole}</strong> — get scored with model answers & coaching tips</p>
            </div>
            <div className="flex items-center gap-2 self-start">
              <span className="text-xs font-bold text-slate-500">{allQuestions.length} questions</span>
              <button
                onClick={() => handleGenerateQuestion("DSA", "Medium")}
                disabled={generatingQuestion}
                className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-1.5 disabled:opacity-50"
              >
                {generatingQuestion ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span>+</span>}
                <span>Add Question</span>
              </button>
            </div>
          </div>

          {/* Subject Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-600">Filter by subject:</span>
              {uniqueSubjects.map(s => (
                <button
                  key={s}
                  onClick={() => { setMockSubjectFilter(s); setSelectedMockIndex(0); setMockFeedback(null); setUserMockAnswer(""); }}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${mockSubjectFilter === s ? "bg-violet-600 text-white border-violet-600" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {filteredQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => { setSelectedMockIndex(idx); setUserMockAnswer(""); setMockFeedback(null); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${selectedMockIndex === idx ? "bg-violet-600 text-white border-violet-600" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"}`}
                >
                  <span>Q{idx + 1}</span>
                  {q.difficulty && <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${DIFF_COLORS[q.difficulty] || "text-slate-600 bg-slate-50 border-slate-200"}`}>{q.difficulty}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Question + Answer */}
            <div className="lg:col-span-7 space-y-4">
              {filteredQuestions[selectedMockIndex] && (
                <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-violet-600 text-white">{filteredQuestions[selectedMockIndex].type || "Technical"}</span>
                      <span className="text-[11px] font-bold text-violet-700">{filteredQuestions[selectedMockIndex].subject}</span>
                    </div>
                    {filteredQuestions[selectedMockIndex].difficulty && (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${DIFF_COLORS[filteredQuestions[selectedMockIndex].difficulty] || ""}`}>
                        {filteredQuestions[selectedMockIndex].difficulty}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-extrabold text-slate-900 leading-relaxed">{filteredQuestions[selectedMockIndex].question}</p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Your Detailed Answer:</label>
                  <span className="text-[10px] text-slate-400 font-medium">{userMockAnswer.split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <textarea
                  value={userMockAnswer}
                  onChange={(e) => setUserMockAnswer(e.target.value)}
                  placeholder="Write a thorough technical answer. Include: concept definition, mechanism, Big-O complexity, and a real-world example..."
                  rows={8}
                  className="w-full p-4 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 bg-slate-50 focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleEvaluateMock}
                  disabled={evaluatingMock || !userMockAnswer.trim()}
                  className="py-3 rounded-xl text-xs font-extrabold btn-gradient text-white flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {evaluatingMock ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>AI Evaluating...</span></> : <span>⚡ Evaluate My Answer</span>}
                </button>
                <button
                  onClick={() => {
                    const q = filteredQuestions[selectedMockIndex];
                    if (q) handleGenerateQuestion(q.subject, q.difficulty);
                  }}
                  disabled={generatingQuestion}
                  className="py-3 rounded-xl text-xs font-extrabold bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {generatingQuestion ? <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" /> : <span>🔀 New Similar Question</span>}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] font-bold text-slate-600 mb-1.5">💡 Tips for Higher Scores:</p>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 font-medium">
                  <span>• Define the concept clearly</span>
                  <span>• Explain the mechanism step-by-step</span>
                  <span>• Include Big-O complexity</span>
                  <span>• Give a real-world use case or example</span>
                </div>
              </div>
            </div>

            {/* Evaluation Panel */}
            <div className="lg:col-span-5">
              {mockFeedback ? (
                <div className="space-y-3 animate-fade-in">
                  {/* Score */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-sky-50 border border-violet-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-xs font-bold text-slate-500">Mock Score</div>
                        <div className="text-3xl font-extrabold text-violet-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {mockFeedback.score}<span className="text-sm text-slate-400 font-normal">/{mockFeedback.maxScore}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-extrabold px-3 py-1 rounded-xl ${mockFeedback.score >= 8 ? "bg-emerald-100 text-emerald-700" : mockFeedback.score >= 6 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                          {mockFeedback.grade || (mockFeedback.score >= 8 ? "A" : mockFeedback.score >= 6 ? "B" : "C")}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold mt-1">
                          {mockFeedback.score >= 8 ? "🌟 Excellent" : mockFeedback.score >= 6 ? "👍 Good" : "📚 Needs Work"}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width: `${(mockFeedback.score / mockFeedback.maxScore) * 100}%`, backgroundColor: mockFeedback.score >= 8 ? "#059669" : mockFeedback.score >= 6 ? "#d97706" : "#dc2626" }} />
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <h4 className="text-xs font-extrabold text-slate-900 mb-1.5">📋 AI Feedback:</h4>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">{mockFeedback.feedback}</p>
                  </div>

                  {/* Strengths & Gaps */}
                  {(mockFeedback.strengths?.length > 0 || mockFeedback.gaps?.length > 0) && (
                    <div className="grid grid-cols-2 gap-3">
                      {mockFeedback.strengths?.length > 0 && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                          <h4 className="text-[10px] font-extrabold text-emerald-800 mb-1.5">✓ What You Got Right:</h4>
                          <ul className="space-y-1">
                            {mockFeedback.strengths.map((s, i) => <li key={i} className="text-[10px] text-emerald-700 font-medium flex items-start gap-1"><span className="shrink-0">•</span><span>{s}</span></li>)}
                          </ul>
                        </div>
                      )}
                      {mockFeedback.gaps?.length > 0 && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                          <h4 className="text-[10px] font-extrabold text-rose-800 mb-1.5">✗ What Was Missing:</h4>
                          <ul className="space-y-1">
                            {mockFeedback.gaps.map((g, i) => <li key={i} className="text-[10px] text-rose-700 font-medium flex items-start gap-1"><span className="shrink-0">•</span><span>{g}</span></li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Model Answer */}
                  {mockFeedback.modelAnswer && (
                    <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200">
                      <h4 className="text-xs font-extrabold text-sky-800 mb-1.5">🏆 Model Answer (9–10/10):</h4>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">{mockFeedback.modelAnswer}</p>
                    </div>
                  )}

                  {/* Takeaway */}
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                    <h4 className="text-xs font-extrabold text-amber-900 mb-1">💡 Coach's Tip:</h4>
                    <p className="text-xs text-amber-800 font-medium leading-relaxed">{mockFeedback.keyTakeaway}</p>
                  </div>

                  <button
                    onClick={() => { setMockFeedback(null); setUserMockAnswer(""); }}
                    className="w-full py-2 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 hover:border-violet-300 hover:text-violet-700 transition-all"
                  >
                    🔄 Try Again / Next Question
                  </button>
                </div>
              ) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                  <div className="text-4xl mb-3">🎙️</div>
                  <h4 className="text-sm font-extrabold text-slate-800 mb-1">Awaiting Your Answer</h4>
                  <p className="text-xs text-slate-500 max-w-xs font-medium">
                    Write a detailed technical answer on the left, then click "Evaluate My Answer" to get an AI score, grade, strengths/gaps analysis, and the ideal model answer.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerReadiness;
