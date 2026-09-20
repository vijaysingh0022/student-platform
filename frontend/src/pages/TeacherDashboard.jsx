import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getFacultyLearningStats } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import SecurityGovernance from "./SecurityGovernance.jsx";
import { ADMIN_SESSION_KEY } from "./AdminLogin.jsx";

const RISK_BADGES = {
  "Critical Risk": "bg-rose-100 text-rose-800 border-rose-300",
  "High Risk": "bg-orange-100 text-orange-800 border-orange-300",
  "Moderate Risk": "bg-amber-100 text-amber-800 border-amber-300",
};

const SEV_BADGES = {
  "Critical Gap": "bg-rose-100 text-rose-800 border-rose-300",
  "Moderate Gap": "bg-amber-100 text-amber-800 border-amber-300",
  "Mastered": "bg-emerald-100 text-emerald-800 border-emerald-300",
};

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState("All");

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [weakTopicsData, setWeakTopicsData] = useState(null);
  const [atRiskData, setAtRiskData] = useState(null);
  const [studentDirectory, setStudentDirectory] = useState(null);
  const [institutionAnalytics, setInstitutionAnalytics] = useState(null);
  const [facultyLearningStats, setFacultyLearningStats] = useState(null);
  const [aiReport, setAiReport] = useState(null);
  const [generatingAiReport, setGeneratingAiReport] = useState(false);

  // Filters for tabs
  const [topicSubjectFilter, setTopicSubjectFilter] = useState("All");
  const [atRiskFilter, setAtRiskFilter] = useState("All");
  const [studentStatusFilter, setStudentStatusFilter] = useState("All");
  const [studentSortBy, setStudentSortBy] = useState("scoreDesc");

  // Student Drilldown Modal & Tabs
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loadingStudentDetails, setLoadingStudentDetails] = useState(false);
  const [drilldownTab, setDrilldownTab] = useState("strengths-gaps"); // "strengths-gaps" | "tests" | "subjects" | "ai-mentor"
  const [studentAiAnalysis, setStudentAiAnalysis] = useState(null);
  const [generatingStudentAi, setGeneratingStudentAi] = useState(false);

  // Intervention Modal
  const [interventionStudent, setInterventionStudent] = useState(null);
  const [interventionText, setInterventionText] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // AI Remedial Plan Modal
  const [remedialModalTopic, setRemedialModalTopic] = useState(null);
  const [remedialPlanData, setRemedialPlanData] = useState(null);
  const [generatingRemedialPlan, setGeneratingRemedialPlan] = useState(false);

  // Search in Student Directory
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const queryParams = `?department=${encodeURIComponent(selectedDept)}&batch=${encodeURIComponent(selectedBatch)}`;

      const [ovRes, wtRes, arRes, sdRes, iaRes, learningRes] = await Promise.all([
        api.get(`/institution/overview${queryParams}`),
        api.get(`/institution/weak-topics${queryParams}`),
        api.get(`/institution/at-risk${queryParams}`),
        api.get(`/institution/students${queryParams}&search=${encodeURIComponent(searchQuery)}`),
        api.get("/institution/analytics"),
        getFacultyLearningStats().catch(() => ({ data: null })),
      ]);

      setOverview(ovRes.data);
      setWeakTopicsData(wtRes.data);
      setAtRiskData(arRes.data);
      setStudentDirectory(sdRes.data);
      setInstitutionAnalytics(iaRes.data);
      if (learningRes?.data) setFacultyLearningStats(learningRes.data);
    } catch (err) {
      console.error("Failed to load teacher dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDept, selectedBatch]);

  // Handle Search input
  const handleSearchSubmit = async (e) => {
    e?.preventDefault();
    try {
      const queryParams = `?department=${encodeURIComponent(selectedDept)}&batch=${encodeURIComponent(selectedBatch)}&search=${encodeURIComponent(searchQuery)}`;
      const sdRes = await api.get(`/institution/students${queryParams}`);
      setStudentDirectory(sdRes.data);
    } catch (err) {
      console.error("Failed to search students:", err);
    }
  };

  // Generate AI Executive Report
  const handleGenerateAiReport = async () => {
    setGeneratingAiReport(true);
    try {
      const { data: res } = await api.post("/institution/generate-ai-report", {
        department: selectedDept,
        batch: selectedBatch,
      });
      setAiReport(res);
      setActiveTab("reports");
      showToast("Executive AI Dean's Report generated successfully!");
    } catch (err) {
      alert("Failed to generate AI executive report: " + (err.response?.data?.message || err.message));
    } finally {
      setGeneratingAiReport(false);
    }
  };

  // Open AI Remedial Plan Modal
  const handleOpenRemedialPlan = async (topic) => {
    setRemedialModalTopic(topic);
    setGeneratingRemedialPlan(true);
    setRemedialPlanData(null);
    try {
      const { data: res } = await api.post("/institution/generate-remedial-plan", {
        topic: topic.topic,
        subject: topic.subject,
        errorRate: topic.errorRate,
      });
      setRemedialPlanData(res);
    } catch (err) {
      alert("Failed to generate remedial plan.");
    } finally {
      setGeneratingRemedialPlan(false);
    }
  };

  // Open Student Drilldown Modal
  const handleOpenStudentDrilldown = async (studentId) => {
    setSelectedStudentId(studentId);
    setLoadingStudentDetails(true);
    setStudentAiAnalysis(null);
    setDrilldownTab("strengths-gaps");
    try {
      const { data: res } = await api.get(`/institution/students/${studentId}`);
      setStudentDetails(res);
    } catch (err) {
      alert("Failed to load student details.");
    } finally {
      setLoadingStudentDetails(false);
    }
  };

  // Generate Student AI Analysis
  const handleGenerateStudentAiAnalysis = async (studentId) => {
    setGeneratingStudentAi(true);
    try {
      const { data: res } = await api.post(`/institution/students/${studentId}/ai-analysis`);
      setStudentAiAnalysis(res);
      setDrilldownTab("ai-mentor");
      showToast("Personalized AI Student Analysis synthesized!");
    } catch (err) {
      alert("Failed to generate student AI analysis: " + (err.response?.data?.message || err.message));
    } finally {
      setGeneratingStudentAi(false);
    }
  };

  // Open Intervention Generator
  const handleOpenIntervention = (student) => {
    setInterventionStudent(student);
    const draft = `Subject: Academic Support & Remedial Action Plan - ${student.name} (${student.rollNo || "Student"})

Dear ${student.name},

Our institutional diagnostic system has flagged potential challenges in your recent coursework:
- Current Academic Average: ${student.avgScore}%
- Weakest Area: ${student.weakestSubject}
- Attendance: ${student.attendanceRate}%

Action Required:
1. Schedule a 1-on-1 tutorial session with your course mentor this week.
2. Complete the assigned adaptive diagnostic quizzes on the platform.
3. Review foundational modules in DBMS and DSA.

We are committed to helping you succeed. Please reach out to your faculty mentor immediately.

Best regards,
Department Academic Coordinator
${student.department || "Computer Science & Engineering"}`;
    setInterventionText(draft);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!studentDirectory?.students) return;
    const headers = ["Name", "Roll No", "Email", "Department", "Batch", "Attendance %", "Tests Taken", "Average Score %", "ATS Score %", "Target Role", "Job Readiness Score %", "Status"];
    const rows = studentDirectory.students.map((s) => [
      `"${s.name}"`,
      `"${s.rollNo}"`,
      `"${s.email}"`,
      `"${s.department}"`,
      `"${s.batch}"`,
      s.attendanceRate,
      s.testsCount,
      s.averageScore,
      s.atsScore,
      `"${s.targetRole}"`,
      s.readinessScore,
      `"${s.status.replace(/[^a-zA-Z ]/g, "").trim()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Class_Performance_Report_${selectedDept.replace(/\s+/g, "_")}_${selectedBatch}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Class CSV downloaded successfully!");
  };

  // Tab definitions
  const TABS = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "curriculum-analytics", label: "Curriculum Analytics", icon: "📚" },
    { id: "weak-topics", label: "Weak Topics in Class", icon: "⚠️" },
    { id: "at-risk", label: "At-Risk Alerts", icon: "🚨", count: atRiskData?.atRiskCount },
    { id: "students", label: "Student Progress", icon: "👥" },
    { id: "institution", label: "Institution Analytics", icon: "🏛️" },
    { id: "reports", label: "Output: Insights & Reports", icon: "📋" },
    { id: "security", label: "Security & Governance", icon: "🛡️" },
  ];

  // Filtered lists
  const filteredWeakTopics = (weakTopicsData?.weakTopics || []).filter((t) => {
    if (topicSubjectFilter === "All") return true;
    return t.subject === topicSubjectFilter;
  });

  const filteredAtRisk = (atRiskData?.students || []).filter((s) => {
    if (atRiskFilter === "All") return true;
    return s.riskLevel === atRiskFilter;
  });

  const filteredStudents = (studentDirectory?.students || [])
    .filter((s) => {
      if (studentStatusFilter === "All") return true;
      if (studentStatusFilter === "Job Ready") return s.readinessScore >= 75;
      if (studentStatusFilter === "Developing") return s.readinessScore >= 55 && s.readinessScore < 75;
      if (studentStatusFilter === "Action Needed") return s.readinessScore < 55;
      return true;
    })
    .sort((a, b) => {
      if (studentSortBy === "scoreDesc") return b.averageScore - a.averageScore;
      if (studentSortBy === "scoreAsc") return a.averageScore - b.averageScore;
      if (studentSortBy === "attendanceDesc") return b.attendanceRate - a.attendanceRate;
      if (studentSortBy === "readinessDesc") return b.readinessScore - a.readinessScore;
      if (studentSortBy === "nameAsc") return a.name.localeCompare(b.name);
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-indigo-600" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">Aggregating Institutional Analytics...</h3>
          <p className="text-xs text-slate-500">Processing class diagnostic results, topic failure heatmaps & at-risk flags</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6" id="teacher-dashboard-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <span>✅</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── HEADER & GLOBAL CONTROLS ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200">
              🎓 TEACHER + INSTITUTION DASHBOARD
            </span>
            <span className="text-xs font-bold text-slate-500">Academic Year 2025–26</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Faculty & Institution <span className="gradient-text">Command Center</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time cohort performance, at-risk detection, weak topic diagnostics & Outcome-Based Education (OBE) analytics.
          </p>
        </div>

        {/* Global Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
          {/* Dept Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              {(overview?.availableDepts || ["All", "Computer Science & Engineering", "Information Technology"]).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Batch Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Batch:</span>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              {(overview?.availableBatches || ["All", "2022-2026", "2023-2027"]).map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            title="Download CSV report"
            className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center gap-1.5 transition-all"
          >
            <span>📥</span>
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* AI Report Trigger Button */}
          <button
            onClick={handleGenerateAiReport}
            disabled={generatingAiReport}
            className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold btn-gradient text-white flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            {generatingAiReport ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span>✨</span>}
            <span>{generatingAiReport ? "Analyzing..." : "Generate AI Report"}</span>
          </button>

          {/* Sign Out Admin Button */}
          <button
            id="admin-signout-header-btn"
            onClick={() => {
              sessionStorage.removeItem(ADMIN_SESSION_KEY);
              navigate("/admin-login");
            }}
            title="End admin session and lock portal"
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span>🔒</span>
            <span className="hidden sm:inline">Sign Out Admin</span>
          </button>
        </div>
      </div>

      {/* ── TAB NAVIGATION ── */}
      <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 1: CLASS PERFORMANCE OVERVIEW ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Class Average", value: `${overview?.classAvgScore || 0}%`, icon: "📈", sub: "Overall test mean", color: "text-indigo-600" },
              { label: "Passing Rate", value: `${overview?.passRate || 0}%`, icon: "✅", sub: "Score ≥ 60%", color: "text-emerald-600" },
              { label: "Enrolled Students", value: overview?.totalStudents || 0, icon: "🎓", sub: `${selectedDept}`, color: "text-slate-900" },
              { label: "Active Test Takers", value: overview?.activeTestTakers || 0, icon: "⚡", sub: `${Math.round(((overview?.activeTestTakers || 0) / (overview?.totalStudents || 1)) * 100)}% participation`, color: "text-sky-600" },
              { label: "Tests Submitted", value: overview?.totalTestsTaken || 0, icon: "📝", sub: "Assessments logged", color: "text-violet-600" },
              { label: "Avg Attendance", value: `${overview?.avgAttendance || 0}%`, icon: "🗓️", sub: "Lecture presence", color: "text-amber-600" },
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-1">
                <div className="text-xl">{kpi.icon}</div>
                <div className={`text-2xl font-extrabold ${kpi.color}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {kpi.value}
                </div>
                <div className="text-xs font-bold text-slate-800">{kpi.label}</div>
                <div className="text-[10px] text-slate-400 font-medium truncate">{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* Subject Mastery Grid + Grade Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Subject Mastery Breakdown */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">📚 Subject Mastery Breakdown</h2>
                  <p className="text-xs text-slate-500">Core Computer Science assessment performance</p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Target: 75%+
                </span>
              </div>

              <div className="space-y-4">
                {(overview?.subjectBreakdown || []).map((subj, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                          {subj.subject}
                        </span>
                        <div>
                          <div className="text-xs font-extrabold text-slate-900">
                            {subj.subject === "DBMS" ? "Database Management Systems" : subj.subject === "DSA" ? "Data Structures & Algorithms" : "Operating Systems"}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium">
                            {subj.testsCount} tests taken · {subj.passRate}% pass rate
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-extrabold text-slate-900">{subj.avgScore}%</div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${subj.avgScore >= 75 ? "bg-emerald-100 text-emerald-800" : subj.avgScore >= 60 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"}`}>
                          {subj.avgScore >= 75 ? "🟢 Strong" : subj.avgScore >= 60 ? "🟡 Average" : "🔴 Remedial Needed"}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${subj.avgScore}%`,
                          backgroundColor: subj.avgScore >= 75 ? "#059669" : subj.avgScore >= 60 ? "#d97706" : "#dc2626",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grade Distribution & Quick Alerts */}
            <div className="lg:col-span-5 space-y-6">
              {/* Grade Distribution */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">📊 Grade Distribution</h3>
                <div className="space-y-3">
                  {(overview?.gradeDistribution || []).map((gd, idx) => {
                    const total = overview?.totalStudents || 1;
                    const pct = Math.round((gd.count / total) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>{gd.grade}</span>
                          <span>{gd.count} students ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: idx === 0 ? "#059669" : idx === 1 ? "#3b82f6" : idx === 2 ? "#d97706" : "#dc2626",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Action Alerts */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-900 flex items-center gap-1.5">
                    <span>🚨</span> Action Needed Alerts
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    {atRiskData?.criticalCount || 0} Critical Students
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  {atRiskData?.criticalCount || 0} students have fallen below the 45% threshold. Review the At-Risk Alert tab to dispatch targeted interventions.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setActiveTab("at-risk")}
                    className="py-2 rounded-xl text-xs font-extrabold bg-indigo-600 text-white hover:bg-indigo-700 text-center shadow-sm"
                  >
                    View At-Risk Roster →
                  </button>
                  <button
                    onClick={() => setActiveTab("weak-topics")}
                    className="py-2 rounded-xl text-xs font-extrabold bg-white text-slate-800 border border-slate-200 hover:bg-slate-100 text-center"
                  >
                    Weak Topics →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB NEW: CURRICULUM ANALYTICS (Learning System) ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "curriculum-analytics" && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 mb-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  <span>Live Curriculum Engagement</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  📚 Class Curriculum Analytics
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Aggregated view of how students engage with the structured learning modules — topic completion, mastery scores, and concept weak spots.
                </p>
              </div>
              <Link
                to="/learn"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span>Go to Curriculum →</span>
              </Link>
            </div>

            {/* Class-Level KPIs */}
            {facultyLearningStats ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
                  {[
                    { label: "Students Active", value: facultyLearningStats.activeStudents || 0, sub: "engaged with 1+ topic", color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200" },
                    { label: "Topics Completed", value: facultyLearningStats.totalCompletions || 0, sub: "across all students", color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
                    { label: "Quizzes Taken", value: facultyLearningStats.totalQuizAttempts || 0, sub: "topic assessments", color: "text-sky-600", bg: "bg-sky-50 border-sky-200" },
                    { label: "Avg Mastery Score", value: `${facultyLearningStats.avgMasteryScore || 0}%`, sub: "across all quizzes", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
                  ].map((kpi) => (
                    <div key={kpi.label} className={`p-4 rounded-2xl border ${kpi.bg} flex flex-col gap-1`}>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
                      <p className={`text-2xl font-extrabold ${kpi.color}`}>{kpi.value}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{kpi.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Class Weak Topics */}
                {facultyLearningStats.classWeakTopics && facultyLearningStats.classWeakTopics.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                      <span>🔴</span> Most Struggled Topics Across Class
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {facultyLearningStats.classWeakTopics.slice(0, 6).map((wt) => (
                        <div key={wt.topicId || wt.topicTitle} className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold text-slate-900">{wt.topicTitle}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{wt.subjectName} • {wt.studentsStruggling || 0} students</p>
                            {wt.topWeakConcept && (
                              <span className="mt-1 inline-block text-[9px] font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                                🎯 Concept Gap: {wt.topWeakConcept}
                              </span>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-extrabold text-rose-700">{wt.avgScore || 0}%</p>
                            <p className="text-[9px] text-slate-400 font-medium">avg score</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subject Completion Breakdown */}
                {facultyLearningStats.subjectCompletion && facultyLearningStats.subjectCompletion.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                      <span>📊</span> Subject Completion Rates
                    </h3>
                    <div className="space-y-3">
                      {facultyLearningStats.subjectCompletion.map((sub) => (
                        <div key={sub.subjectName} className="flex items-center gap-4">
                          <div className="w-32 shrink-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{sub.subjectName}</p>
                            <p className="text-[10px] text-slate-400">{sub.completedTopics}/{sub.totalTopics} topics</p>
                          </div>
                          <div className="flex-1 bg-slate-100 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full transition-all duration-700 ${
                                sub.completionRate >= 70 ? "bg-emerald-500" :
                                sub.completionRate >= 40 ? "bg-amber-500" : "bg-rose-500"
                              }`}
                              style={{ width: `${sub.completionRate || 0}%` }}
                            />
                          </div>
                          <p className={`text-xs font-extrabold w-12 text-right ${
                            sub.completionRate >= 70 ? "text-emerald-700" :
                            sub.completionRate >= 40 ? "text-amber-700" : "text-rose-700"
                          }`}>
                            {sub.completionRate || 0}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Students Needing Attention */}
                {facultyLearningStats.studentsNeedingAttention && facultyLearningStats.studentsNeedingAttention.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                      <span>⚠️</span> Students Needing Learning Attention
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-2 px-3 text-slate-500 font-semibold">Student</th>
                            <th className="text-center py-2 px-3 text-slate-500 font-semibold">Topics Done</th>
                            <th className="text-center py-2 px-3 text-slate-500 font-semibold">Avg Mastery</th>
                            <th className="text-center py-2 px-3 text-slate-500 font-semibold">Weak Topics</th>
                          </tr>
                        </thead>
                        <tbody>
                          {facultyLearningStats.studentsNeedingAttention.slice(0, 5).map((s) => (
                            <tr key={s.userId} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                              <td className="py-2 px-3 font-semibold text-slate-800">{s.name || s.email || "Student"}</td>
                              <td className="py-2 px-3 text-center text-slate-600">{s.completedTopics || 0}</td>
                              <td className="py-2 px-3 text-center">
                                <span className={`font-bold ${(s.avgMastery || 0) < 40 ? "text-rose-700" : "text-amber-700"}`}>
                                  {s.avgMastery || 0}%
                                </span>
                              </td>
                              <td className="py-2 px-3 text-center">
                                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                                  {s.weakTopicsCount || 0}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-indigo-100">
                  📚
                </div>
                <p className="text-sm font-bold text-slate-700">No Curriculum Data Yet</p>
                <p className="text-xs text-slate-400 mt-1">Students haven't started learning modules yet. Share the <strong>/learn</strong> page with them to get started.</p>
                <Link
                  to="/learn"
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
                >
                  Preview Curriculum →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 2: WEAK TOPICS IN CLASS ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "weak-topics" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                ⚠️ Class-Wide Topic Diagnostics & Failure Heatmap
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Aggregated error rates across all diagnostic assessments for <strong>{selectedDept}</strong> ({selectedBatch})
              </p>
            </div>
            {/* Subject Filters */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
              {["All", "DBMS", "DSA", "OS"].map((s) => (
                <button
                  key={s}
                  onClick={() => setTopicSubjectFilter(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                    topicSubjectFilter === s ? "bg-white text-indigo-700 shadow-sm border border-slate-200" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Topics Grid */}
          {filteredWeakTopics.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 space-y-3">
              <div className="text-4xl">📝</div>
              <h3 className="text-base font-extrabold text-slate-900">No Assessment Data Logged Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                No diagnostic test submissions recorded for {selectedDept} ({topicSubjectFilter} filter). When students complete tests on the platform, live topic-level error rates and remedial recommendations will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWeakTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-200 text-slate-800">
                        {topic.subject}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${SEV_BADGES[topic.severity] || "bg-slate-100 text-slate-700"}`}>
                        {topic.severity}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900">{topic.topic}</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-rose-600">Error Rate: {topic.errorRate}%</span>
                        <span className="text-slate-500">Accuracy: {topic.accuracy}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${topic.errorRate}%`,
                            backgroundColor: topic.errorRate >= 50 ? "#dc2626" : topic.errorRate >= 30 ? "#d97706" : "#059669",
                          }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium pt-0.5">
                        Based on {topic.totalQuestionsAnswered} student response submissions
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="text-[11px] text-slate-700 font-medium">
                      <strong className="text-indigo-900">💡 Recommended Action:</strong> {topic.recommendedAction}
                    </div>
                    <button
                      onClick={() => handleOpenRemedialPlan(topic)}
                      className="w-full py-2 rounded-xl text-xs font-extrabold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all text-center flex items-center justify-center gap-1"
                    >
                      <span>✨ Generate AI Remedial Lecture Plan</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Curriculum Tip Banner */}
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-extrabold text-indigo-950">Curriculum Remedial Action Recommendation</h4>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Automatically sync weak topics with student personalized roadmaps and schedule automated revision quizzes.
              </p>
            </div>
            <Link
              to={`/tutor?q=${encodeURIComponent(`Generate a comprehensive 2-week remedial curriculum for ${selectedDept} covering: ${weakTopicsData?.weakTopics?.map(t => t.topic).slice(0, 3).join(", ")}. Include laboratory assignments and milestone quizzes.`)}`}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-indigo-600 text-white hover:bg-indigo-700 shrink-0 shadow-sm text-center"
            >
              📅 Schedule 2-Week Remedial Track
            </Link>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 3: AT-RISK STUDENTS ALERT ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "at-risk" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                🚨 At-Risk Students Early-Warning System
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated multi-factor identification based on assessment averages, attendance, and subject mastery
              </p>
            </div>

            {/* Risk Filters */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
              {["All", "Critical Risk", "High Risk", "Moderate Risk"].map((r) => (
                <button
                  key={r}
                  onClick={() => setAtRiskFilter(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                    atRiskFilter === r ? "bg-white text-indigo-700 shadow-sm border border-slate-200" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Roster of At-Risk Students */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAtRisk.map((student) => (
              <div
                key={student.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">{student.name}</h3>
                      <div className="text-xs text-slate-500 font-medium">{student.rollNo} · {student.email}</div>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shrink-0 ${RISK_BADGES[student.riskLevel] || "bg-slate-100"}`}>
                      {student.riskLevel}
                    </span>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Avg Score</div>
                      <div className={`text-sm font-extrabold ${student.avgScore < 45 ? "text-rose-600" : student.avgScore < 60 ? "text-orange-600" : "text-amber-600"}`}>
                        {student.avgScore}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Attendance</div>
                      <div className={`text-sm font-extrabold ${student.attendanceRate < 60 ? "text-rose-600" : "text-slate-800"}`}>
                        {student.attendanceRate}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Tests</div>
                      <div className="text-sm font-extrabold text-slate-800">{student.testsTaken}</div>
                    </div>
                  </div>

                  {/* Root Causes */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Identified Risk Factors:</div>
                    <div className="flex flex-wrap gap-1">
                      {student.riskReasons.map((r, i) => (
                        <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          • {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Weakest Subject */}
                  <div className="text-xs text-slate-700 font-medium">
                    <strong className="text-slate-900">Weakest Focus:</strong> <span className="text-rose-700 font-bold">{student.weakestSubject}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenIntervention(student)}
                    className="py-2 rounded-xl text-xs font-extrabold bg-indigo-600 text-white hover:bg-indigo-700 text-center shadow-sm"
                  >
                    ✉️ Draft Notice
                  </button>
                  <button
                    onClick={() => handleOpenStudentDrilldown(student.id)}
                    className="py-2 rounded-xl text-xs font-extrabold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 text-center"
                  >
                    🔍 Full Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 4: STUDENT-WISE PROGRESS ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "students" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in-up">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                👥 Comprehensive Student Directory & Progress
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed diagnostic history, placement readiness, and individual scores for <strong>{selectedDept}</strong> ({selectedBatch})
              </p>
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <select
                value={studentStatusFilter}
                onChange={(e) => setStudentStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-indigo-600"
              >
                <option value="All">All Statuses</option>
                <option value="Job Ready">Job Ready (≥75%)</option>
                <option value="Developing">Developing (55-74%)</option>
                <option value="Action Needed">Action Needed (&lt;55%)</option>
              </select>

              {/* Sort By */}
              <select
                value={studentSortBy}
                onChange={(e) => setStudentSortBy(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-indigo-600"
              >
                <option value="scoreDesc">Highest Score</option>
                <option value="scoreAsc">Lowest Score</option>
                <option value="readinessDesc">Highest Readiness</option>
                <option value="attendanceDesc">Highest Attendance</option>
                <option value="nameAsc">Name (A-Z)</option>
              </select>

              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student..."
                  className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-600 w-44 sm:w-56"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Roll No</th>
                  <th className="py-3.5 px-4">Attendance</th>
                  <th className="py-3.5 px-4">Tests Taken</th>
                  <th className="py-3.5 px-4">Academic Avg</th>
                  <th className="py-3.5 px-4">🌟 Strong Topic (क्या सही है)</th>
                  <th className="py-3.5 px-4">⚠️ Needs Focus (क्या सुधारें)</th>
                  <th className="py-3.5 px-4">Job Readiness</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900">{student.name}</div>
                      <div className="text-[11px] text-slate-400">{student.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{student.rollNo}</td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold ${student.attendanceRate < 75 ? "text-rose-600" : "text-slate-800"}`}>
                        {student.attendanceRate}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold">{student.testsCount}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">{student.averageScore}%</span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 hidden sm:block">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${student.averageScore}%`,
                              backgroundColor: student.averageScore >= 75 ? "#059669" : student.averageScore >= 55 ? "#d97706" : "#dc2626",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {student.topStrength ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                          <span>✅</span>
                          <span className="truncate max-w-[130px]" title={student.topStrength.topic}>
                            {student.topStrength.topic}
                          </span>
                          <span className="text-[10px] text-emerald-600">({student.topStrength.accuracy}%)</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {student.criticalGap ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold">
                          <span>⚠️</span>
                          <span className="truncate max-w-[130px]" title={student.criticalGap.topic}>
                            {student.criticalGap.topic}
                          </span>
                          <span className="text-[10px] text-rose-600">({student.criticalGap.errorRate}% err)</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${student.readinessScore >= 75 ? "bg-emerald-100 text-emerald-800" : student.readinessScore >= 55 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"}`}>
                        {student.readinessScore}% · {student.status.replace(/[^a-zA-Z ]/g, "").trim()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenStudentDrilldown(student.id)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-sm transition-all"
                      >
                        🔍 Deep Dive 360°
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 5: INSTITUTION ANALYTICS & BENCHMARKS ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "institution" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                🏛️ Institutional Quality & Accreditation Metrics
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Outcome-Based Education (OBE), NIRF & NBA compliance benchmarks
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 self-start">
              Annual Audit Roster
            </span>
          </div>

          {/* Department Comparison Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">🏢 Departmental Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(institutionAnalytics?.departmentComparison || []).map((dept, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-slate-900">{dept.department}</h4>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      {dept.enrolledStudents} Enrolled
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white border border-slate-200 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Avg Score</div>
                      <div className="text-base font-extrabold text-slate-900">{dept.averageScore}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Pass Rate</div>
                      <div className="text-base font-extrabold text-emerald-600">{dept.passRate}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Tests Done</div>
                      <div className="text-base font-extrabold text-indigo-600">{dept.testsCompleted}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Placement Readiness & Accreditation Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Placement Readiness Tiers */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">🎯 Placement Readiness Tiers</h3>
              <div className="space-y-3">
                {(institutionAnalytics?.readinessTiers || []).map((tier, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{tier.tier}</span>
                      <span>{tier.count} students</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${((tier.count / (institutionAnalytics?.totalEnrolled || 1)) * 100)}%`,
                          backgroundColor: i === 0 ? "#059669" : i === 1 ? "#d97706" : "#dc2626",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accreditation & OBE Metrics */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">📜 Accreditation Benchmarks (NBA / NAAC)</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: "Course Outcome (CO) Attainment", value: institutionAnalytics?.accreditationMetrics?.courseOutcomeAttainment || "78.4%", target: "Target: ≥70%" },
                  { label: "Continuous Diagnostic Index", value: institutionAnalytics?.accreditationMetrics?.continuousAssessmentIndex || "84.2%", target: "Target: ≥80%" },
                  { label: "AI Remedial Intervention Coverage", value: institutionAnalytics?.accreditationMetrics?.remedialInterventionCoverage || "91.0%", target: "Target: ≥85%" },
                ].map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{m.label}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{m.target}</div>
                    </div>
                    <div className="text-base font-extrabold text-emerald-600 font-mono">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 6: OUTPUT: INSIGHTS & REPORTS ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "reports" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in-up" id="printable-report">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200 mb-1.5">
                📋 EXECUTIVE ACADEMIC AUDIT
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Dean & HoD Executive Intelligence Report
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                AI synthesis of class diagnostics, curriculum risk areas, and faculty action items for <strong>{selectedDept}</strong> ({selectedBatch})
              </p>
            </div>

            <div className="flex items-center gap-2 self-start">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center gap-1.5 transition-all"
              >
                <span>🖨️</span><span>Print Report</span>
              </button>
              <button
                onClick={handleGenerateAiReport}
                disabled={generatingAiReport}
                className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {generatingAiReport ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span>🔄</span>}
                <span>Refresh AI Audit</span>
              </button>
            </div>
          </div>

          {aiReport ? (
            <div className="space-y-6 animate-fade-in">
              {/* Executive Header Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 via-slate-50 to-violet-50 border border-indigo-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-800">Academic Health Status</div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Cohort Performance & Syllabus Mastery Index
                  </h3>
                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    {aiReport.executiveSummary}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 p-4 bg-white rounded-2xl border border-indigo-100 shadow-sm text-center">
                  <div>
                    <div className="text-3xl font-extrabold text-indigo-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {aiReport.academicHealthScore}<span className="text-sm font-normal text-slate-400">/100</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-extrabold uppercase">Health Score</div>
                  </div>
                </div>
              </div>

              {/* Strengths & Critical Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Strengths */}
                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                  <h4 className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <span>🌟</span> Key Institutional Strengths
                  </h4>
                  <ul className="space-y-2">
                    {(aiReport.keyStrengths || []).map((s, i) => (
                      <li key={i} className="text-xs text-emerald-900 font-medium flex items-start gap-2 bg-white p-3 rounded-xl border border-emerald-100">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span className="leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Critical Risks */}
                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                  <h4 className="text-xs font-extrabold text-rose-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <span>⚠️</span> Critical Academic Risks
                  </h4>
                  <ul className="space-y-2">
                    {(aiReport.criticalRisks || []).map((r, i) => (
                      <li key={i} className="text-xs text-rose-900 font-medium flex items-start gap-2 bg-white p-3 rounded-xl border border-rose-100">
                        <span className="text-rose-600 font-bold shrink-0">!</span>
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Faculty Action Items */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>🧑‍🏫</span> Immediate Faculty Intervention Plan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(aiReport.facultyActionItems || []).map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curriculum Recommendations */}
              {aiReport.curriculumRecommendations && (
                <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2">
                  <h4 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider">
                    📚 Board of Studies (BoS) Curriculum Update Recommendation
                  </h4>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {aiReport.curriculumRecommendations}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 space-y-4">
              <div className="text-4xl">📋</div>
              <h3 className="text-base font-extrabold text-slate-900">No Report Generated Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                Click the button below to synthesize class diagnostic scores, at-risk rosters, and syllabus metrics with AI.
              </p>
              <button
                onClick={handleGenerateAiReport}
                disabled={generatingAiReport}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold btn-gradient text-white shadow-sm inline-flex items-center gap-2 disabled:opacity-50"
              >
                {generatingAiReport ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span>✨</span>}
                <span>Generate Executive AI Report</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 7: SECURITY, AUDIT & COMPLIANCE GOVERNANCE ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "security" && (
        <div className="space-y-6 animate-fade-in-up">
          <SecurityGovernance />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── MODAL 1: COMPREHENSIVE 360° STUDENT DEEP DIVE & AUDIT ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {selectedStudentId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-4xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 space-y-6 shadow-2xl animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-black text-lg flex items-center justify-center shadow-md shrink-0">
                  {studentDetails?.student?.name ? studentDetails.student.name.charAt(0).toUpperCase() : "S"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {studentDetails?.student?.name || "Student Profile"}
                    </h3>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      studentDetails?.metrics?.readinessScore >= 75
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : studentDetails?.metrics?.readinessScore >= 55
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-rose-100 text-rose-800 border-rose-300"
                    }`}>
                      {studentDetails?.metrics?.status || "Developing"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    <strong>{studentDetails?.student?.rollNo}</strong> · {studentDetails?.student?.email} · {studentDetails?.student?.department} ({studentDetails?.student?.batch})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-sm shrink-0 transition-colors"
              >
                ✕
              </button>
            </div>

            {loadingStudentDetails ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-10 h-10 mx-auto border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-slate-700">Synthesizing 360° Academic & Career Profile...</p>
                <p className="text-[11px] text-slate-400">Loading topic accuracy, diagnostic histories, strengths and skill gap telemetry</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Top Metrics Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="p-2 rounded-xl bg-white border border-slate-100 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Academic Avg</div>
                    <div className="text-base font-extrabold text-indigo-700">{studentDetails?.metrics?.averageScore || 0}%</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-100 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Overall Accuracy</div>
                    <div className="text-base font-extrabold text-emerald-700">{studentDetails?.metrics?.overallAccuracy || 0}%</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-100 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Tests Taken</div>
                    <div className="text-base font-extrabold text-slate-900">{studentDetails?.metrics?.testsCompleted || 0} tests</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-100 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Attendance</div>
                    <div className="text-base font-extrabold text-slate-900">{studentDetails?.student?.attendanceRate || 85}%</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-100 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">ATS Resume</div>
                    <div className="text-base font-extrabold text-sky-700">{studentDetails?.metrics?.atsScore || 68}%</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-100 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Placement Odds</div>
                    <div className="text-base font-extrabold text-violet-700">{studentDetails?.metrics?.placementOdds || 75}%</div>
                  </div>
                </div>

                {/* Modal Inner Tab Navigation */}
                <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
                  <button
                    onClick={() => setDrilldownTab("strengths-gaps")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      drilldownTab === "strengths-gaps"
                        ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span>🌟</span>
                    <span>Strengths & Weaknesses (क्या सही है vs क्या सुधारें)</span>
                  </button>

                  <button
                    onClick={() => setDrilldownTab("tests")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      drilldownTab === "tests"
                        ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span>📝</span>
                    <span>All Tests & Quizzes ({studentDetails?.tests?.length || 0})</span>
                  </button>

                  <button
                    onClick={() => setDrilldownTab("subjects")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      drilldownTab === "subjects"
                        ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span>📊</span>
                    <span>Subject Mastery & Placement</span>
                  </button>

                  <button
                    onClick={() => setDrilldownTab("ai-mentor")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      drilldownTab === "ai-mentor"
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm"
                        : "text-violet-700 hover:bg-violet-50"
                    }`}
                  >
                    <span>🤖</span>
                    <span>AI Mentorship Audit</span>
                  </button>
                </div>

                {/* ── TAB 1: STRENGTHS & WEAKNESSES ── */}
                {drilldownTab === "strengths-gaps" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in-up">
                    {/* Left Column: Strengths (Kya Sahi Hai) */}
                    <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">✅</span>
                          <div>
                            <h4 className="text-sm font-extrabold text-emerald-950">
                              Strong Topics & Mastered Concepts (क्या सही है)
                            </h4>
                            <p className="text-[11px] text-emerald-700 font-medium">
                              High accuracy areas where student shows solid foundation
                            </p>
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                          {studentDetails?.strengths?.length || 0} Mastered
                        </span>
                      </div>

                      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                        {(studentDetails?.strengths || []).map((s, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-xs text-slate-900">{s.topic}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                  {s.subject}
                                </span>
                              </div>
                              <span className="text-xs font-black text-emerald-700">{s.accuracy}% Accuracy</span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-emerald-100 rounded-full h-1.5">
                              <div className="h-1.5 rounded-full bg-emerald-600" style={{ width: `${s.accuracy}%` }} />
                            </div>

                            <p className="text-[11px] text-slate-500 font-medium leading-tight">
                              {s.commendation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Weaknesses & Gaps (Kya Improve Karna Chahiye) */}
                    <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-rose-200/80">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">⚠️</span>
                          <div>
                            <h4 className="text-sm font-extrabold text-rose-950">
                              Areas to Improve & Critical Gaps (क्या सुधारें)
                            </h4>
                            <p className="text-[11px] text-rose-700 font-medium">
                              Sub-optimal concepts requiring remedial practice
                            </p>
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold">
                          {studentDetails?.weaknesses?.length || 0} Action Needed
                        </span>
                      </div>

                      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                        {(studentDetails?.weaknesses || []).map((w, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-white border border-rose-200 shadow-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-xs text-slate-900">{w.topic}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                  {w.subject}
                                </span>
                              </div>
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                w.severity === "Critical Gap" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                              }`}>
                                {w.errorRate}% Error Rate
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-rose-100 rounded-full h-1.5">
                              <div
                                className="h-1.5 rounded-full bg-rose-500"
                                style={{ width: `${w.errorRate}%` }}
                              />
                            </div>

                            <p className="text-[11px] text-slate-600 font-medium leading-snug">
                              💡 <strong>Action:</strong> {w.remedialAdvice}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 2: ALL TESTS & QUIZZES ── */}
                {drilldownTab === "tests" && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-slate-900">
                        📝 Complete Assessment Log ({studentDetails?.tests?.length || 0} Assessments Attempted)
                      </h4>
                      <span className="text-xs text-slate-500 font-medium">
                        Total Questions Answered: <strong>{studentDetails?.metrics?.totalQuestionsAttempted}</strong> ({studentDetails?.metrics?.totalQuestionsCorrect} Correct)
                      </span>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {(studentDetails?.tests || []).map((test, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                              <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 font-extrabold text-xs flex items-center justify-center">
                                {test.subject}
                              </span>
                              <div>
                                <div className="text-xs font-extrabold text-slate-900">
                                  {test.subject === "DBMS" ? "Database Management Systems" : test.subject === "DSA" ? "Data Structures & Algorithms" : "Operating Systems"} Diagnostic
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium">
                                  Submitted on {new Date(test.createdAt).toLocaleDateString()} at {new Date(test.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-extrabold text-slate-800">
                                {test.correctAnswers}/{test.totalQuestions} ({test.scorePercent}%)
                              </span>
                              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                test.scorePercent >= 75 ? "bg-emerald-100 text-emerald-800" : test.scorePercent >= 60 ? "bg-indigo-100 text-indigo-800" : "bg-rose-100 text-rose-800"
                              }`}>
                                {test.scorePercent >= 60 ? "Passed" : "Remedial Needed"}
                              </span>
                            </div>
                          </div>

                          {/* Topic Accuracy Badges for this Test */}
                          {test.topicBreakdown && typeof test.topicBreakdown === "object" && (
                            <div className="space-y-1.5">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Topic Accuracy Breakdown:</div>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(test.topicBreakdown).map(([top, st], i) => {
                                  const acc = st.total > 0 ? Math.round((st.correct / st.total) * 100) : 0;
                                  return (
                                    <span
                                      key={i}
                                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${
                                        acc >= 75
                                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                          : acc >= 50
                                          ? "bg-amber-50 text-amber-800 border-amber-200"
                                          : "bg-rose-50 text-rose-800 border-rose-200"
                                      }`}
                                    >
                                      <span>{acc >= 75 ? "✅" : acc >= 50 ? "🟡" : "❌"}</span>
                                      <span>{top}</span>
                                      <span className="font-mono text-[10px] font-bold">({st.correct}/{st.total})</span>
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── TAB 3: SUBJECT MASTERY & PLACEMENT ── */}
                {drilldownTab === "subjects" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in-up">
                    {/* Subject Mastery Progress Bars */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                      <div className="pb-2 border-b border-slate-100">
                        <h4 className="text-sm font-extrabold text-slate-900">📚 Subject Mastery Aggregates</h4>
                        <p className="text-[11px] text-slate-500">Curriculum performance across engineering subjects</p>
                      </div>

                      <div className="space-y-4">
                        {(studentDetails?.subjectBreakdown || []).map((sb, idx) => (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-extrabold text-slate-900">{sb.subject}</span>
                              <span className="font-bold text-indigo-700">{sb.avgScore}% Avg ({sb.testsCount} tests)</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width: `${sb.avgScore}%`,
                                  backgroundColor: sb.avgScore >= 75 ? "#059669" : sb.avgScore >= 55 ? "#d97706" : "#dc2626",
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Placement & Career Readiness */}
                    <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-200 space-y-4">
                      <div className="pb-2 border-b border-indigo-200/80">
                        <h4 className="text-sm font-extrabold text-indigo-950">💼 Placement & Career Intelligence</h4>
                        <p className="text-[11px] text-indigo-700">Interview readiness, ATS keywords and project portfolios</p>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="p-3 rounded-xl bg-white border border-indigo-100 flex items-center justify-between">
                          <span className="font-bold text-slate-700">Target Role:</span>
                          <span className="font-extrabold text-indigo-700">{studentDetails?.careerProfile?.targetRole}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="p-2.5 rounded-xl bg-white border border-indigo-100">
                            <div className="text-[10px] text-slate-400 font-bold uppercase">ATS Resume Match</div>
                            <div className="text-base font-extrabold text-emerald-600">{studentDetails?.careerProfile?.atsScore}%</div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-indigo-100">
                            <div className="text-[10px] text-slate-400 font-bold uppercase">Mock Interview Score</div>
                            <div className="text-base font-extrabold text-indigo-700">{studentDetails?.careerProfile?.mockInterviewScore}%</div>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-indigo-100 space-y-1.5">
                          <div className="font-bold text-slate-800 text-[11px]">Key Technical Projects:</div>
                          <div className="space-y-1">
                            {(studentDetails?.careerProfile?.savedProjects || []).map((p, i) => (
                              <div key={i} className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-600">• {p.title}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">{p.status}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 4: AI MENTORSHIP AUDIT ── */}
                {drilldownTab === "ai-mentor" && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200">
                      <div>
                        <h4 className="text-sm font-extrabold text-violet-950 flex items-center gap-1.5">
                          <span>🤖</span> AI Pedagogical Mentor & Remedial Synthesizer
                        </h4>
                        <p className="text-[11px] text-violet-700 font-medium mt-0.5">
                          DeepSeek & GPT-4o-mini academic diagnosis of strengths, weaknesses, and weekly roadmap
                        </p>
                      </div>
                      <button
                        onClick={() => handleGenerateStudentAiAnalysis(studentDetails.student.id)}
                        disabled={generatingStudentAi}
                        className="px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-sm flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                      >
                        {generatingStudentAi ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span>✨</span>}
                        <span>{studentAiAnalysis ? "Re-synthesize AI Report" : "Generate AI Student Report"}</span>
                      </button>
                    </div>

                    {studentAiAnalysis ? (
                      <div className="space-y-4 text-xs">
                        {/* Executive Headline */}
                        <div className="p-4 rounded-2xl bg-white border border-violet-200 shadow-xs">
                          <div className="font-extrabold text-violet-900 text-sm mb-1">Executive Summary:</div>
                          <p className="text-slate-700 font-medium leading-relaxed">{studentAiAnalysis.studentHeadline}</p>
                        </div>

                        {/* Strengths vs Weaknesses Analysis */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                            <div className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
                              <span>✅</span> Strengths Verified (क्या सही है):
                            </div>
                            <ul className="space-y-1 text-slate-700 font-medium">
                              {(studentAiAnalysis.strengthsAnalysis || []).map((s, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-emerald-600 font-bold">•</span>
                                  <span>{s}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
                            <div className="font-extrabold text-rose-950 text-xs flex items-center gap-1.5">
                              <span>⚠️</span> Target Remediation (क्या सुधारें):
                            </div>
                            <ul className="space-y-1 text-slate-700 font-medium">
                              {(studentAiAnalysis.weaknessesAnalysis || []).map((w, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-rose-600 font-bold">•</span>
                                  <span>{w}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* 4-Week Step-by-Step Study Roadmap */}
                        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                          <div className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                            🗓️ 4-Week Personalized Improvement Roadmap:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                            {(studentAiAnalysis.personalizedFourWeekRoadmap || []).map((r, i) => (
                              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-100 text-indigo-800">
                                  {r.week}
                                </span>
                                <div className="font-bold text-slate-900 text-[11px]">{r.focus}</div>
                                <p className="text-[11px] text-slate-600 leading-snug">{r.tasks}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Placement Guidance */}
                        {studentAiAnalysis.placementAdvice && (
                          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-medium leading-relaxed">
                            <strong>💼 Placement Advice:</strong> {studentAiAnalysis.placementAdvice}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 space-y-2">
                        <div className="text-3xl">🤖</div>
                        <p className="text-xs font-bold text-slate-700">No AI Student Report Generated Yet</p>
                        <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                          Click "Generate AI Student Report" to synthesize an instant personalized 4-week study roadmap and placement advice.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-400">
                    Department: <strong>{studentDetails?.student?.department}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedStudentId(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        const s = studentDetails?.student;
                        if (s) {
                          setSelectedStudentId(null);
                          handleOpenIntervention({
                            ...s,
                            avgScore: studentDetails?.metrics?.averageScore,
                            weakestSubject: studentDetails?.weaknesses?.[0]?.topic || "Core CS",
                          });
                        }
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-extrabold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all"
                    >
                      ✉️ Dispatch Remedial Notice
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── MODAL 2: INTERVENTION DRAFT ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {interventionStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  Remedial Intervention Notice
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  Drafting Notice for {interventionStudent.name}
                </h3>
              </div>
              <button
                onClick={() => setInterventionStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Review and dispatch this automated remedial notice to the student and faculty mentor:
            </p>

            <textarea
              value={interventionText}
              onChange={(e) => setInterventionText(e.target.value)}
              rows={9}
              className="w-full p-4 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 bg-slate-50 focus:outline-none focus:border-indigo-600"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setInterventionStudent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast(`Remedial notice dispatched to ${interventionStudent.name}!`);
                  setInterventionStudent(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-extrabold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              >
                🚀 Dispatch Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── MODAL 3: AI REMEDIAL TEACHING PLAN ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {remedialModalTopic && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  AI Lesson Blueprint
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {remedialModalTopic.topic} ({remedialModalTopic.subject})
                </h3>
              </div>
              <button
                onClick={() => setRemedialModalTopic(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {generatingRemedialPlan ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-10 h-10 mx-auto border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <h4 className="text-sm font-extrabold text-slate-800">Synthesizing Pedagogical Blueprint...</h4>
                <p className="text-xs text-slate-500 font-medium">Generating step-by-step lecture outline, intuition analogy & practice drills</p>
              </div>
            ) : remedialPlanData ? (
              <div className="space-y-4 text-xs">
                {/* Title & Objectives */}
                <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                  <div className="font-extrabold text-indigo-950 text-sm">{remedialPlanData.lectureTitle}</div>
                  <div className="text-[11px] text-indigo-800 font-bold">Duration: {remedialPlanData.duration}</div>
                  <div className="space-y-1 pt-1">
                    <span className="font-extrabold text-indigo-900 uppercase text-[10px]">Learning Objectives:</span>
                    <ul className="list-disc list-inside text-slate-700 space-y-0.5 font-medium">
                      {(remedialPlanData.learningObjectives || []).map((o, i) => <li key={i}>{o}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Intuitive Analogy */}
                {remedialPlanData.intuitiveAnalogy && (
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                    <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider">💡 Real-World Teaching Analogy:</span>
                    <p className="text-slate-800 font-medium leading-relaxed">{remedialPlanData.intuitiveAnalogy}</p>
                  </div>
                )}

                {/* Common Misconceptions */}
                {remedialPlanData.commonMisconceptions && (
                  <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1">
                    <span className="text-[10px] font-extrabold text-rose-900 uppercase tracking-wider">⚠️ Key Student Misconception:</span>
                    <p className="text-slate-800 font-medium leading-relaxed">{remedialPlanData.commonMisconceptions}</p>
                  </div>
                )}

                {/* 45-Min Lecture Roadmap */}
                <div className="space-y-2">
                  <span className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider">⏱️ 45-Minute Lesson Schedule:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(remedialPlanData.remedialSteps || []).map((step, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-100 text-indigo-800 shrink-0">{step.min}</span>
                        <span className="text-[11px] text-slate-700 font-medium leading-relaxed">{step.focus}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formative Practice Problems */}
                <div className="space-y-1.5">
                  <span className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider">📝 Practice & Exit Ticket Problems:</span>
                  <ul className="space-y-1">
                    {(remedialPlanData.practiceProblems || []).map((prob, i) => (
                      <li key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium flex items-start gap-2">
                        <span className="text-indigo-600 font-bold shrink-0">#{i + 1}</span>
                        <span>{prob}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setRemedialModalTopic(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                  >
                    Close
                  </button>
                  <Link
                    to={`/tutor?q=${encodeURIComponent(`I am preparing a lesson on "${remedialModalTopic.topic}" in ${remedialModalTopic.subject}. Give me 5 multiple choice questions with detailed explanations for a classroom exit ticket.`)}`}
                    className="px-4 py-2 rounded-xl text-xs font-extrabold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                  >
                    Open in AI Tutor →
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
