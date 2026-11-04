import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getPYQDashboard,
  getPYQQuestions,
  getPYQRepeatedQuestions,
  getPYQAnalytics,
  updatePYQQuestion,
  deletePYQPaper,
} from "../services/api.js";
import PYQIntelligenceIllustration from "../components/pyq/PYQIntelligenceIllustration.jsx";
import UploadPaperModal from "../components/pyq/UploadPaperModal.jsx";
import QuestionDetailModal from "../components/pyq/QuestionDetailModal.jsx";
import MockPaperModal from "../components/pyq/MockPaperModal.jsx";
import PYQChatDrawer from "../components/pyq/PYQChatDrawer.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const SUBJECT_FILTER_LIST = [
  { id: "all", name: "All Subjects" },
  { id: "dsa", name: "Data Structures & Algorithms" },
  { id: "dbms", name: "Database Management Systems" },
  { id: "os", name: "Operating Systems" },
  { id: "cn", name: "Computer Networks" },
  { id: "oops", name: "Object Oriented Programming" },
  { id: "coa", name: "Computer Org & Architecture" },
  { id: "toc", name: "Theory of Computation" },
];

const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"];

export const PYQIntelligencePage = () => {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "questions" | "repeated" | "important" | "analytics" | "prep_plan"
  const [selectedSubject, setSelectedSubject] = useState("all");

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [repeatedGroups, setRepeatedGroups] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals & Drawers
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMockModalOpen, setIsMockModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Question Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [unitFilter, setUnitFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const loadData = async () => {
    setLoading(true);
    try {
      const subParam = selectedSubject === "all" ? undefined : selectedSubject;

      const [dashRes, qRes, repRes, analRes] = await Promise.all([
        getPYQDashboard().catch(() => ({ data: { success: true, metrics: {}, recentPapers: [] } })),
        getPYQQuestions({ subjectId: subParam }).catch(() => ({ data: { success: true, questions: [] } })),
        getPYQRepeatedQuestions({ subjectId: subParam }).catch(() => ({ data: { success: true, groups: {} } })),
        getPYQAnalytics({ subjectId: subParam }).catch(() => ({ data: { success: true, analytics: {} } })),
      ]);

      if (dashRes.data?.success) setDashboardData(dashRes.data);
      if (qRes.data?.success) setQuestions(qRes.data.questions || []);
      if (repRes.data?.success) setRepeatedGroups(repRes.data.groups || {});
      if (analRes.data?.success) setAnalyticsData(analRes.data.analytics || {});
    } catch (err) {
      console.error("Failed to load PYQ intelligence data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedSubject]);

  const handleUpdateStudyStatus = async (questionId, newStatus) => {
    try {
      const res = await updatePYQQuestion(questionId, { studyStatus: newStatus });
      if (res.data?.success) {
        setQuestions((prev) =>
          prev.map((q) => (q._id === questionId ? { ...q, studyStatus: newStatus } : q))
        );
        if (selectedQuestion && selectedQuestion._id === questionId) {
          setSelectedQuestion((prev) => ({ ...prev, studyStatus: newStatus }));
        }
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDeletePaper = async (paperId) => {
    if (!window.confirm("Are you sure you want to delete this question paper and its extracted questions?")) return;
    try {
      await deletePYQPaper(paperId);
      loadData();
    } catch (err) {
      alert("Failed to delete paper.");
    }
  };

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    if (searchQuery && !q.questionText.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (unitFilter !== "all" && q.unitNumber !== Number(unitFilter)) return false;
    if (priorityFilter !== "all" && q.priorityLevel !== priorityFilter) return false;
    if (typeFilter !== "all" && q.questionType !== typeFilter) return false;
    if (difficultyFilter !== "all" && q.difficulty !== difficultyFilter) return false;
    return true;
  });

  const metrics = dashboardData?.metrics || {
    papersAnalyzed: 0,
    questionsExtracted: 0,
    repeatedQuestionsFound: 0,
    subjectsAnalyzed: 0,
    unitsCovered: 0,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-3 sm:px-6">
      {/* ── TOP BREADCRUMB & CONTEXT HEADER ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link to="/test" className="hover:text-indigo-600 transition-colors">
            Assessments
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-extrabold">PYQ Intelligence</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsChatOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>🤖</span>
            <span>AI Paper Copilot</span>
          </button>
          <button
            onClick={() => setIsMockModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>🏆</span>
            <span>Mock Paper Generator</span>
          </button>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>📤</span>
            <span>Upload Papers</span>
          </button>
        </div>
      </div>

      {/* ── 1. PREMIUM HERO BANNER ── */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0d1226] via-[#161a38] to-[#1c183b] p-6 sm:p-8 text-white relative overflow-hidden border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-500/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Left Text */}
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-black uppercase tracking-wider text-indigo-300">
              <span>⚡</span> AI PYQ INTELLIGENCE
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              University Exam Intelligence & Question Paper Analyzer
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-2xl">
              Understand exam patterns, identify repeated questions, discover important topics and prepare smarter with AI. Calibrated directly against authentic university curriculum blueprints.
            </p>

            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <span>📄</span> Upload Previous Papers
              </button>
              <button
                onClick={() => setActiveTab("repeated")}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2"
              >
                <span>🔥</span> View Repeated Questions ({metrics.repeatedQuestionsFound})
              </button>
            </div>
          </div>

          {/* Right 3D Isometric Illustration */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <PYQIntelligenceIllustration />
          </div>
        </div>
      </div>

      {/* ── 2. ACTUAL METRICS STRIP (NO FABRICATED NUMBERS) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Papers Analyzed", value: metrics.papersAnalyzed, icon: "📑", color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Questions Extracted", value: metrics.questionsExtracted, icon: "❔", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Repeated Questions", value: metrics.repeatedQuestionsFound, icon: "🔥", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Subjects Analyzed", value: metrics.subjectsAnalyzed, icon: "📚", color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Units Covered", value: metrics.unitsCovered, icon: "🏷️", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Uploads", value: metrics.totalPapersUploaded, icon: "🗂️", color: "text-slate-700", bg: "bg-slate-100" },
        ].map((m, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`w-8 h-8 rounded-xl ${m.bg} flex items-center justify-center text-sm`}>
                {m.icon}
              </span>
              <span className="text-[10px] font-bold text-slate-400">Verified</span>
            </div>
            <div>
              <p className={`text-xl font-black ${m.color} leading-none mb-1`}>{m.value}</p>
              <p className="text-[11px] font-bold text-slate-600 leading-tight">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. SUBJECT FILTER SELECTOR & NAVIGATION TABS ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Subject Filter Bar */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mr-1">
              Subject:
            </span>
            {SUBJECT_FILTER_LIST.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedSubject === sub.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          <div className="text-xs font-bold text-slate-500">
            Target University: <span className="text-slate-900">AKTU B.Tech CSE</span>
          </div>
        </div>

        {/* Feature Tabs */}
        <div className="flex items-center px-4 border-b border-slate-100 gap-1 bg-white overflow-x-auto">
          {[
            { id: "overview", label: "Paper Overview", icon: "📑" },
            { id: "questions", label: "Extracted Questions", icon: "📋", count: filteredQuestions.length },
            { id: "repeated", label: "Repeated Questions Intelligence", icon: "🔥", count: metrics.repeatedQuestionsFound },
            { id: "important", label: "Important Topics Priority", icon: "⭐" },
            { id: "analytics", label: "Unit & Topic Analytics", icon: "📊" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-700 font-black"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6">
          {/* TAB 1: PAPER OVERVIEW & UPLOADED PAPERS */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Uploaded Examination Papers</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Manage your raw papers, check background extraction pipeline, or add new years.
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-all flex items-center gap-1.5"
                >
                  <span>+</span> Upload Another Paper
                </button>
              </div>

              {dashboardData?.recentPapers && dashboardData.recentPapers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dashboardData.recentPapers.map((paper) => (
                    <div
                      key={paper._id}
                      className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                            {paper.subjectCode || paper.subjectId}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              paper.status === "Analysis Complete"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : paper.status.includes("Failed")
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {paper.status}
                          </span>
                        </div>

                        <h4 className="text-xs font-black text-slate-900 leading-snug">{paper.title}</h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {paper.university} • Sem {paper.semester}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                          <span>Questions Extracted:</span>
                          <span className="text-indigo-600">{paper.extractedQuestionCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                          <span>Repeated in Other Years:</span>
                          <span className="text-amber-600">{paper.repeatedQuestionCount}</span>
                        </div>
                        {paper.isOcrUsed && (
                          <div className="text-[10px] font-bold text-purple-700 bg-purple-50 p-1.5 rounded-lg border border-purple-100">
                            🔍 Optical Character Recognition (OCR) processed
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => {
                            setActiveTab("questions");
                            setSearchQuery("");
                          }}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                        >
                          View Extracted Questions →
                        </button>
                        <button
                          onClick={() => handleDeletePaper(paper._id)}
                          className="text-slate-400 hover:text-rose-600 text-xs font-bold p-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                  <div className="text-3xl">📄</div>
                  <h4 className="text-xs font-black text-slate-800">No question papers uploaded yet</h4>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Upload your university previous-year papers (PDF or camera scans) to start AI extraction and pattern analysis.
                  </p>
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
                  >
                    Upload Paper Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXTRACTED QUESTIONS (SEARCHABLE, FILTERABLE) */}
          {activeTab === "questions" && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <input
                  type="text"
                  placeholder="Search question text or concept..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                />
                <select
                  value={unitFilter}
                  onChange={(e) => setUnitFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white"
                >
                  <option value="all">All Units</option>
                  {[1, 2, 3, 4, 5].map((u) => (
                    <option key={u} value={u}>Unit {u}</option>
                  ))}
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white"
                >
                  <option value="all">All Priorities</option>
                  <option value="High Priority">High Priority</option>
                  <option value="Medium Priority">Medium Priority</option>
                  <option value="Revision Recommended">Revision Recommended</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="Short Answer">Short Answer</option>
                  <option value="Long Answer">Long Answer</option>
                  <option value="Numerical">Numerical</option>
                  <option value="Derivation">Derivation</option>
                  <option value="Programming Question">Programming</option>
                </select>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Questions List */}
              {filteredQuestions.length > 0 ? (
                <div className="space-y-3">
                  {filteredQuestions.map((q) => (
                    <div
                      key={q._id}
                      className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-900 text-white">
                            {q.questionNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            Unit {q.unitNumber}: {q.topicTitle}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            {q.marks} Marks
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              q.priorityLevel === "High Priority"
                                ? "bg-rose-50 text-rose-700 border-rose-200 font-black"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {q.priorityLevel}
                          </span>
                          {q.isRepeated && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Repeated ({q.repeatCount}x)
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-bold text-slate-900 leading-relaxed">
                          {q.questionText}
                        </p>

                        <p className="text-[10px] text-slate-400 font-medium">
                          {q.paperTitle} • Session: {q.examSession} ({q.academicYear}) • Status: {q.studyStatus}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => setSelectedQuestion(q)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-all flex items-center gap-1"
                        >
                          <span>✍️</span> Solution & Practice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs font-bold text-slate-400">
                  No questions matched your filter criteria.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REPEATED QUESTIONS INTELLIGENCE */}
          {activeTab === "repeated" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                    Repeated Question Intelligence
                  </h4>
                  <p className="text-[11px] text-amber-900 font-normal leading-relaxed">
                    Identifies exact duplicate and modified variant questions across different academic years. Categorized separately from simple keyword matches.
                  </p>
                </div>
              </div>

              {repeatedGroups && (
                <div className="space-y-6">
                  {/* Category 1: Exact Matches */}
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span>🎯</span> Exact Repeated Questions ({repeatedGroups.exactMatches?.length || 0})
                    </h4>
                    <div className="space-y-2.5">
                      {repeatedGroups.exactMatches?.map((q) => (
                        <div
                          key={q._id}
                          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Appeared {q.repeatCount} times: {q.repeatedYears?.join(", ")}
                              </span>
                              <span className="text-xs font-bold text-slate-400">Unit {q.unitNumber}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-900 leading-snug">{q.questionText}</p>
                          </div>
                          <button
                            onClick={() => setSelectedQuestion(q)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 shrink-0"
                          >
                            Solve →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category 2: Modified Variants */}
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span>🔄</span> Modified Variants & Variations ({repeatedGroups.modifiedVariants?.length || 0})
                    </h4>
                    <div className="space-y-2.5">
                      {repeatedGroups.modifiedVariants?.map((q) => (
                        <div
                          key={q._id}
                          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200">
                                Concept Variation: {q.repeatedYears?.join(", ")}
                              </span>
                              <span className="text-xs font-bold text-slate-400">{q.topicTitle}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-900 leading-snug">{q.questionText}</p>
                          </div>
                          <button
                            onClick={() => setSelectedQuestion(q)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 shrink-0"
                          >
                            Solve →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: IMPORTANT TOPICS PRIORITY */}
          {activeTab === "important" && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 space-y-1">
                <p className="font-black uppercase tracking-wider text-[11px] text-indigo-900">
                  Explainable AI Priority Engine
                </p>
                <p className="font-normal text-slate-600">
                  Ranking computed dynamically based on historical appearance frequency, recency, marks weightage, and university exam blueprint coverage.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions
                  .filter((q) => q.priorityLevel === "High Priority")
                  .slice(0, 8)
                  .map((q) => (
                    <div
                      key={q._id}
                      className="p-4 rounded-2xl bg-white border border-rose-100 shadow-xs space-y-2 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                          HIGH HISTORICAL RELEVANCE
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          Score: {q.priorityScore}/100
                        </span>
                      </div>
                      <p className="text-xs font-black text-slate-900 leading-snug">{q.questionText}</p>
                      <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl">
                        <span className="font-bold text-slate-700">Why recommended: </span>
                        {q.priorityReason}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-indigo-600">
                          Unit {q.unitNumber}: {q.topicTitle} ({q.marks} Marks)
                        </span>
                        <button
                          onClick={() => setSelectedQuestion(q)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                        >
                          Prepare Solution →
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 5: UNIT & TOPIC ANALYTICS CHARTS */}
          {activeTab === "analytics" && analyticsData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Unit-wise Marks Distribution */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Unit-wise Marks & Question Distribution
                  </h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.unitStats || []}>
                        <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: "bold" }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="totalMarks" name="Total Marks" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="questionCount" name="Questions" fill="#a855f7" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Difficulty Distribution Donut */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Difficulty Breakdown
                  </h4>
                  <div className="h-64 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.difficultyDistribution || []}
                          dataKey="count"
                          nameKey="difficulty"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={45}
                          label
                        >
                          {(analyticsData.difficultyDistribution || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MODALS & DRAWERS ── */}
      <UploadPaperModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => loadData()}
      />

      <QuestionDetailModal
        question={selectedQuestion}
        isOpen={!!selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
        onUpdateStatus={handleUpdateStudyStatus}
      />

      <MockPaperModal
        isOpen={isMockModalOpen}
        onClose={() => setIsMockModalOpen(false)}
        defaultSubject={selectedSubject === "all" ? "dsa" : selectedSubject}
      />

      <PYQChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        selectedSubject={selectedSubject === "all" ? "dsa" : selectedSubject}
      />
    </div>
  );
};

export default PYQIntelligencePage;

