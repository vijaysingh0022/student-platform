import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  UploadCloud,
  Brain,
  Repeat,
  BarChart3,
  Sparkles,
  FileCheck,
  CheckCircle2,
  Clock,
  Layers,
  Search,
  Filter,
  Send,
  Download,
  Trash2,
  ChevronRight,
  BookOpen,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  GraduationCap,
  Loader2,
  Check,
  Flame,
  Award,
  RefreshCw,
  Eye,
} from "lucide-react";
import {
  getPYQDashboardMetrics,
  uploadPYQPaper,
  getPYQQuestions,
  updatePYQQuestion,
  getAIPYQSolution,
  getRepeatedPYQs,
  generatePYQMockPaper,
  chatWithPYQIntelligence,
  deletePYQPaper,
} from "../../services/api.js";

// Available subjects for AKTU B.Tech CSE & LearnX curriculum
const UNIVERSITY_SUBJECTS = [
  { id: "dsa", name: "Data Structures & Algorithms", code: "KCS-301", sem: 3 },
  { id: "dbms", name: "Database Management Systems", code: "KCS-401", sem: 4 },
  { id: "os", name: "Operating Systems", code: "KCS-402", sem: 4 },
  { id: "cn", name: "Computer Networks", code: "KCS-501", sem: 5 },
  { id: "oops", name: "Object Oriented Programming (Java/C++)", code: "KCS-302", sem: 3 },
  { id: "toc", name: "Theory of Computation & Automata", code: "KCS-502", sem: 5 },
  { id: "coa", name: "Computer Organization & Architecture", code: "KCS-303", sem: 3 },
  { id: "python", name: "Python Programming", code: "KCS-403", sem: 4 },
];

export const PYQIntelligence = () => {
  const navigate = useNavigate();

  // Navigation tabs matching prompt:
  // Upload Papers | AI Analysis | Important Questions | Exam Preparation | Mock Paper | Performance Report
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "upload" | "questions" | "repeated" | "analytics" | "mock" | "chat"

  // Selected subject context
  const [selectedSubject, setSelectedSubject] = useState(UNIVERSITY_SUBJECTS[0]);

  // Dashboard Data State
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    papersAnalyzed: 0,
    questionsExtracted: 0,
    repeatedQuestionsFound: 0,
    subjectsAnalyzed: 0,
    unitsCovered: 0,
    mockPapersGenerated: 0,
  });
  const [papers, setPapers] = useState([]);
  const [charts, setCharts] = useState({
    unitDistribution: [],
    topicDistribution: [],
    yearDistribution: [],
    typeDistribution: [],
  });
  const [prepBreakdown, setPrepBreakdown] = useState({
    notStarted: 0,
    learning: 0,
    revised: 0,
    confident: 0,
  });

  // Questions state
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionSearch, setQuestionSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedPrepStatus, setSelectedPrepStatus] = useState("all");

  // AI Answer Studio Modal State
  const [activeQuestionForSolution, setActiveQuestionForSolution] = useState(null);
  const [solutionMarks, setSolutionMarks] = useState(5);
  const [solutionMode, setSolutionMode] = useState("standard");
  const [generatedSolution, setGeneratedSolution] = useState("");
  const [generatingSolution, setGeneratingSolution] = useState(false);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadMeta, setUploadMeta] = useState({
    university: "AKTU",
    course: "B.Tech",
    branch: "Computer Science & Engineering",
    semester: 3,
    subjectId: UNIVERSITY_SUBJECTS[0].id,
    subjectName: UNIVERSITY_SUBJECTS[0].name,
    subjectCode: UNIVERSITY_SUBJECTS[0].code,
    academicYear: "2023-2024",
    examType: "End Semester",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusStep, setUploadStatusStep] = useState("");
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  // Repeated Questions State
  const [repeatedQuestions, setRepeatedQuestions] = useState([]);
  const [loadingRepeated, setLoadingRepeated] = useState(false);

  // Mock Paper State
  const [mockPaperData, setMockPaperData] = useState(null);
  const [generatingMock, setGeneratingMock] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: `Hello! I am your LearnX AI PYQ Exam Copilot. Ask me anything about previous year patterns, repeated topics, or question breakdowns for ${selectedSubject.name}!`,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Load Dashboard Metrics
  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await getPYQDashboardMetrics({ subjectId: selectedSubject.id });
      if (res.data?.success) {
        setMetrics(res.data.metrics || {});
        setPapers(res.data.papers || []);
        setCharts(res.data.charts || {});
        setPrepBreakdown(res.data.prepBreakdown || {});
      }
    } catch (err) {
      console.error("Error loading PYQ dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [selectedSubject]);

  // Load Questions
  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const params = { subjectId: selectedSubject.id };
      if (selectedDifficulty !== "all") params.difficulty = selectedDifficulty;
      if (selectedType !== "all") params.questionType = selectedType;
      if (selectedPriority !== "all") params.priorityLevel = selectedPriority;
      if (selectedPrepStatus !== "all") params.prepStatus = selectedPrepStatus;
      if (questionSearch) params.search = questionSearch;

      const res = await getPYQQuestions(params);
      if (res.data?.success) {
        setQuestions(res.data.questions || []);
      }
    } catch (err) {
      console.error("Error loading questions:", err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    if (activeTab === "questions" || activeTab === "analytics") {
      fetchQuestions();
    }
    if (activeTab === "repeated") {
      fetchRepeated();
    }
  }, [
    activeTab,
    selectedSubject,
    selectedDifficulty,
    selectedType,
    selectedPriority,
    selectedPrepStatus,
    questionSearch,
  ]);

  // Load Repeated Questions
  const fetchRepeated = async () => {
    setLoadingRepeated(true);
    try {
      const res = await getRepeatedPYQs({ subjectId: selectedSubject.id });
      if (res.data?.success) {
        setRepeatedQuestions(res.data.questions || []);
      }
    } catch (err) {
      console.error("Error loading repeated PYQs:", err);
    } finally {
      setLoadingRepeated(false);
    }
  };

  // Handle Paper Upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError("Please select a question paper (PDF or image).");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccessMessage("");
    setUploadProgress(15);
    setUploadStatusStep("Uploading document to secure processing engine...");

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("university", uploadMeta.university);
    formData.append("course", uploadMeta.course);
    formData.append("branch", uploadMeta.branch);
    formData.append("semester", uploadMeta.semester);
    formData.append("subjectId", uploadMeta.subjectId);
    formData.append("subjectName", uploadMeta.subjectName);
    formData.append("subjectCode", uploadMeta.subjectCode);
    formData.append("academicYear", uploadMeta.academicYear);
    formData.append("examType", uploadMeta.examType);

    try {
      setUploadProgress(45);
      setUploadStatusStep("Extracting text and running OCR on scanned diagrams...");

      const res = await uploadPYQPaper(formData);
      setUploadProgress(100);
      setUploadStatusStep("Analysis Complete! Questions segmented and mapped to syllabus.");

      if (res.data?.success) {
        setUploadSuccessMessage(
          `Successfully processed "${uploadFile.name}"! Extracted ${res.data.questionsCount} questions and mapped them to LearnX syllabus.`
        );
        setUploadFile(null);
        fetchDashboard();
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || "Paper analysis failed.");
    } finally {
      setUploading(false);
    }
  };

  // Generate Solution in AI Studio
  const handleGenerateSolution = async (question) => {
    setActiveQuestionForSolution(question);
    setSolutionMarks(question.marks || 5);
    setGeneratingSolution(true);
    setGeneratedSolution("");

    try {
      const res = await getAIPYQSolution(question._id, {
        marks: question.marks || 5,
        mode: solutionMode,
      });
      if (res.data?.success) {
        setGeneratedSolution(res.data.answer);
      }
    } catch (err) {
      setGeneratedSolution("Failed to generate answer. Please try again.");
    } finally {
      setGeneratingSolution(false);
    }
  };

  // Update Prep Status
  const handleUpdatePrepStatus = async (questionId, newStatus) => {
    try {
      await updatePYQQuestion(questionId, { prepStatus: newStatus });
      setQuestions((prev) =>
        prev.map((q) => (q._id === questionId ? { ...q, prepStatus: newStatus } : q))
      );
      fetchDashboard();
    } catch (err) {
      console.error("Error updating prep status:", err);
    }
  };

  // Generate University Mock Paper
  const handleGenerateMock = async () => {
    setGeneratingMock(true);
    try {
      const res = await generatePYQMockPaper({
        subjectId: selectedSubject.id,
        subjectName: selectedSubject.name,
        totalMarks: 70,
        durationMinutes: 180,
      });
      if (res.data?.success) {
        setMockPaperData(res.data.mockPaper);
      }
    } catch (err) {
      console.error("Mock paper generation error:", err);
    } finally {
      setGeneratingMock(false);
    }
  };

  // Handle Chat Submit
  const handleChatSend = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userText }]);
    setChatLoading(true);

    try {
      const res = await chatWithPYQIntelligence({
        query: userText,
        subjectId: selectedSubject.id,
        subjectName: selectedSubject.name,
      });
      if (res.data?.success) {
        setChatMessages((prev) => [...prev, { role: "assistant", content: res.data.response }]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to PYQ assistant. Please retry." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Delete Paper
  const handleDeletePaper = async (paperId) => {
    if (!window.confirm("Are you sure you want to delete this paper and its extracted questions?")) return;
    try {
      await deletePYQPaper(paperId);
      fetchDashboard();
    } catch (err) {
      alert("Failed to delete paper");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* ── Top Header / Breadcrumb ─────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <Link to="/test" className="hover:text-purple-600 transition-colors">
                Assessments
              </Link>
              <span>/</span>
              <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                PYQ Intelligence
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              AI PYQ Intelligence
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Understand exam patterns, identify repeated questions, discover important topics, and
              prepare smarter with AI.
            </p>
          </div>

          {/* Subject & University Dropdown */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 rounded-xl p-1.5 flex items-center border border-slate-200">
              <GraduationCap className="w-4 h-4 text-purple-600 ml-2 mr-1 shrink-0" />
              <select
                value={selectedSubject.id}
                onChange={(e) => {
                  const s = UNIVERSITY_SUBJECTS.find((sub) => sub.id === e.target.value);
                  if (s) {
                    setSelectedSubject(s);
                    setUploadMeta((prev) => ({
                      ...prev,
                      subjectId: s.id,
                      subjectName: s.name,
                      subjectCode: s.code,
                      semester: s.sem,
                    }));
                  }
                }}
                className="bg-transparent text-sm font-bold text-slate-800 outline-none pr-3 cursor-pointer"
              >
                {UNIVERSITY_SUBJECTS.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-5 flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100">
          {[
            { id: "dashboard", label: "Overview", icon: BarChart3 },
            { id: "upload", label: "Upload Papers", icon: UploadCloud },
            { id: "questions", label: "Extracted Questions", icon: FileText },
            { id: "repeated", label: "Repeated Questions", icon: Repeat },
            { id: "mock", label: "Mock Paper Generator", icon: FileCheck },
            { id: "chat", label: "AI Exam Chat", icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* ── TAB 1: OVERVIEW & DASHBOARD METRICS ───────────────────────────── */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {[
                {
                  label: "Papers Analyzed",
                  val: metrics.papersAnalyzed,
                  icon: FileText,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  label: "Questions Extracted",
                  val: metrics.questionsExtracted,
                  icon: Brain,
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
                {
                  label: "Repeated Found",
                  val: metrics.repeatedQuestionsFound,
                  icon: Repeat,
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },
                {
                  label: "Subjects Analyzed",
                  val: metrics.subjectsAnalyzed,
                  icon: GraduationCap,
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                },
                {
                  label: "Units Covered",
                  val: metrics.unitsCovered,
                  icon: Layers,
                  color: "text-indigo-600",
                  bg: "bg-indigo-50",
                },
                {
                  label: "Mock Papers",
                  val: metrics.mockPapersGenerated,
                  icon: FileCheck,
                  color: "text-rose-600",
                  bg: "bg-rose-50",
                },
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase">{c.label}</span>
                      <div className={`w-8 h-8 rounded-xl ${c.bg} ${c.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-2">{c.val}</div>
                  </div>
                );
              })}
            </div>

            {/* Preparation Momentum & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Unit-wise frequency breakdown */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" />
                    Unit-wise Question Frequency ({selectedSubject.name})
                  </h3>
                  <button
                    onClick={() => setActiveTab("questions")}
                    className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                  >
                    View All Questions <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {charts.unitDistribution.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-600">No question papers uploaded yet</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Upload previous year university papers to generate unit and topic analytics.
                    </p>
                    <button
                      onClick={() => setActiveTab("upload")}
                      className="mt-3 px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow hover:bg-purple-700"
                    >
                      Upload First Paper
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {charts.unitDistribution.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-700">{item.name}</span>
                          <span className="text-purple-700">{item.count} Questions</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                (item.count / Math.max(...charts.unitDistribution.map((d) => d.count), 1)) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Student Exam Preparation Status */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Your Preparation Progress
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Track questions you have revised vs. confident for upcoming exams.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-950">Confident</span>
                      </div>
                      <span className="text-sm font-black text-emerald-700">{prepBreakdown.confident}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100">
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-blue-950">Revised</span>
                      </div>
                      <span className="text-sm font-black text-blue-700">{prepBreakdown.revised}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100">
                      <div className="flex items-center gap-2.5">
                        <Brain className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold text-amber-950">Learning</span>
                      </div>
                      <span className="text-sm font-black text-amber-700">{prepBreakdown.learning}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2.5">
                        <HelpCircle className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-bold text-slate-700">Not Started</span>
                      </div>
                      <span className="text-sm font-black text-slate-800">{prepBreakdown.notStarted}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("mock")}
                  className="mt-4 w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md hover:from-purple-700 hover:to-indigo-700 transition flex items-center justify-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  Generate Timed Mock Exam
                </button>
              </div>
            </div>

            {/* Uploaded Papers History Table */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  Uploaded Previous-Year Papers ({papers.length})
                </h3>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
                >
                  Upload New Paper +
                </button>
              </div>

              {papers.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No papers in this subject. Upload your university paper to see analysis history.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-2.5 px-3">File / Paper Name</th>
                        <th className="py-2.5 px-3">University</th>
                        <th className="py-2.5 px-3">Year & Session</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Extracted Qs</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {papers.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3 px-3 font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                            {p.fileName}
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-semibold">{p.university}</td>
                          <td className="py-3 px-3 text-slate-600">
                            {p.academicYear} • {p.examType}
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {p.processingStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-bold text-purple-700">
                            {p.extractedQuestionCount} Questions
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDeletePaper(p._id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
                              title="Delete Paper"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: UPLOAD PAPERS ─────────────────────────────────────────── */}
        {activeTab === "upload" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <UploadCloud className="w-6 h-6 text-purple-600" />
                  Upload Previous Year Question Papers
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Supports selectable PDF, scanned PDF (OCR enabled), JPEG, and PNG images.
                </p>
              </div>

              {uploadSuccessMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Paper Processed Successfully!</div>
                    <p className="mt-0.5">{uploadSuccessMessage}</p>
                    <button
                      onClick={() => setActiveTab("questions")}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-xs hover:bg-emerald-700 shadow-sm"
                    >
                      View Extracted Questions →
                    </button>
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {/* University and Academic Profile configuration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">University</label>
                    <input
                      type="text"
                      value={uploadMeta.university}
                      onChange={(e) => setUploadMeta({ ...uploadMeta, university: e.target.value })}
                      placeholder="e.g. AKTU, DTU, IPU"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Course & Branch</label>
                    <input
                      type="text"
                      value={uploadMeta.branch}
                      onChange={(e) => setUploadMeta({ ...uploadMeta, branch: e.target.value })}
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                    <select
                      value={uploadMeta.academicYear}
                      onChange={(e) => setUploadMeta({ ...uploadMeta, academicYear: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                    >
                      <option value="2023-2024">2023-2024</option>
                      <option value="2022-2023">2022-2023</option>
                      <option value="2021-2022">2021-2022</option>
                      <option value="2020-2021">2020-2021</option>
                      <option value="2019-2020">2019-2020</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Exam Session Type</label>
                    <select
                      value={uploadMeta.examType}
                      onChange={(e) => setUploadMeta({ ...uploadMeta, examType: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                    >
                      <option value="End Semester">End Semester Regular</option>
                      <option value="Mid Semester / Sessional">Mid Semester / Sessional</option>
                      <option value="Back Paper / Carry Over">Back Paper / Carry Over</option>
                      <option value="Model Paper">University Model Paper</option>
                    </select>
                  </div>
                </div>

                {/* Drag and Drop Box */}
                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Question Paper Document
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-purple-200 hover:border-purple-500 rounded-3xl p-8 bg-purple-50/30 hover:bg-purple-50/60 cursor-pointer transition">
                    <UploadCloud className="w-12 h-12 text-purple-600 mb-2" />
                    <span className="text-sm font-bold text-slate-800">
                      {uploadFile ? uploadFile.name : "Click to select or drag and drop paper"}
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      PDF, JPG, or PNG (Max size: 25MB)
                    </span>
                    <input
                      type="file"
                      accept=".pdf,image/png,image/jpeg"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setUploadFile(e.target.files[0]);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Processing Progress Bar */}
                {uploading && (
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        {uploadStatusStep}
                      </span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-purple-600 h-2 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="w-full py-3 bg-purple-600 text-white rounded-2xl font-bold text-sm shadow-md hover:bg-purple-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Exam Paper...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      Upload & Start AI Analysis
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── TAB 3: EXTRACTED QUESTIONS & AI ANSWER STUDIO ────────────────── */}
        {activeTab === "questions" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search questions by topic or keyword..."
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
                {/* Priority Filter */}
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700"
                >
                  <option value="all">All Priorities</option>
                  <option value="High Priority">High Priority</option>
                  <option value="Medium Priority">Medium Priority</option>
                  <option value="Revision Recommended">Revision Recommended</option>
                </select>

                {/* Difficulty Filter */}
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                {/* Prep Status Filter */}
                <select
                  value={selectedPrepStatus}
                  onChange={(e) => setSelectedPrepStatus(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700"
                >
                  <option value="all">All Progress</option>
                  <option value="Not Started">Not Started</option>
                  <option value="Learning">Learning</option>
                  <option value="Revised">Revised</option>
                  <option value="Confident">Confident</option>
                </select>
              </div>
            </div>

            {/* Questions List */}
            {loadingQuestions ? (
              <div className="text-center py-16">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-bold">Loading extracted questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="text-base font-black text-slate-800">No questions found</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Try adjusting your filters, or upload a previous year examination paper to extract
                  questions.
                </p>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow"
                >
                  Upload Paper Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q) => (
                  <div
                    key={q._id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 font-black text-xs">
                          {q.questionNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                          {q.academicYear} • {q.marks} Marks
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            q.difficulty === "Hard"
                              ? "bg-rose-100 text-rose-800"
                              : q.difficulty === "Easy"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>

                      {/* Priority Badge */}
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          q.priorityLevel === "High Priority"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {q.priorityLevel === "High Priority" && <Flame className="w-3 h-3 text-rose-600" />}
                        {q.priorityLevel}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                      {q.questionText}
                    </p>

                    {/* Syllabus mapping row */}
                    <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-purple-600" />
                        <span className="font-bold text-slate-700">
                          {q.unitName || q.unitId || "General Unit"}
                        </span>
                        {q.topicTitle && (
                          <>
                            <span>›</span>
                            <span className="text-purple-700 font-semibold">{q.topicTitle}</span>
                          </>
                        )}
                      </div>

                      {/* Prep Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400">Prep Status:</span>
                        <select
                          value={q.prepStatus}
                          onChange={(e) => handleUpdatePrepStatus(q._id, e.target.value)}
                          className="px-2 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 text-slate-800 cursor-pointer"
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="Learning">Learning</option>
                          <option value="Revised">Revised</option>
                          <option value="Confident">Confident ✓</option>
                        </select>

                        <button
                          onClick={() => handleGenerateSolution(q)}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm transition"
                        >
                          <Sparkles className="w-3 h-3" />
                          AI Solution Studio
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: REPEATED QUESTIONS INTELLIGENCE ───────────────────────── */}
        {activeTab === "repeated" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-black uppercase tracking-wider mb-1">
                <Repeat className="w-4 h-4" />
                Repeated Question Intelligence
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Frequently Recurring Exam Questions
              </h2>
              <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-2xl">
                Identified through normalized lexical analysis and semantic vector matching across
                multiple examination cycles.
              </p>
            </div>

            {loadingRepeated ? (
              <div className="text-center py-16">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-bold">Analyzing duplicate patterns...</p>
              </div>
            ) : repeatedQuestions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
                <Repeat className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="text-base font-black text-slate-800">No repeated questions yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Upload multiple years of previous examination papers to detect exact and
                  conceptually similar questions.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {repeatedQuestions.map((q) => (
                  <div
                    key={q._id}
                    className="bg-white rounded-2xl p-5 border border-purple-200/80 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center gap-1.5">
                        <Repeat className="w-3.5 h-3.5" />
                        Appeared in {q.academicYear}
                      </span>
                      <span className="text-xs font-black text-rose-600 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" /> High Frequency
                      </span>
                    </div>

                    <p className="text-sm font-bold text-slate-900">{q.questionText}</p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>
                        Topic: <strong className="text-purple-700">{q.topicTitle || "Core"}</strong>
                      </span>
                      <button
                        onClick={() => handleGenerateSolution(q)}
                        className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                      >
                        View AI Model Solution →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 5: MOCK PAPER GENERATOR ──────────────────────────────────── */}
        {activeTab === "mock" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <FileCheck className="w-6 h-6 text-purple-600" />
                    University Mock Paper Generator
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Generates a balanced 70-mark university question paper using actual historical
                    patterns and syllabus blueprints.
                  </p>
                </div>

                <button
                  onClick={handleGenerateMock}
                  disabled={generatingMock}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition shrink-0"
                >
                  {generatingMock ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Generating Paper...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Generate New Mock Paper
                    </>
                  )}
                </button>
              </div>

              {mockPaperData ? (
                <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-6">
                  {/* Paper Header */}
                  <div className="text-center border-b border-slate-200 pb-4">
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">
                      {mockPaperData.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Time Allowed: 3 Hours • Maximum Marks: {mockPaperData.totalMarks}
                    </p>
                  </div>

                  {/* Sections */}
                  {mockPaperData.sections?.map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-3">
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <div className="text-sm font-black text-purple-900">{sec.sectionName}</div>
                        <div className="text-xs text-slate-500 font-semibold">{sec.instructions}</div>
                      </div>

                      <div className="space-y-2 pl-2">
                        {sec.questions?.map((sq, qIdx) => (
                          <div
                            key={qIdx}
                            className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-start justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <span className="font-black text-xs text-purple-700 mr-2">
                                {sq.questionNumber}
                              </span>
                              <span className="text-xs font-semibold text-slate-800 leading-relaxed">
                                {sq.questionText}
                              </span>
                              <div className="text-[10px] text-slate-400">
                                Topic: {sq.topicTitle || "Subject Fundamentals"}
                              </div>
                            </div>
                            <span className="text-xs font-black text-slate-600 shrink-0">
                              [{sq.marks} M]
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
                  <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <h4 className="text-sm font-black text-slate-700">No mock paper generated yet</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Click "Generate New Mock Paper" to assemble a full test based on your PYQs.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 6: AI EXAM CHAT ─────────────────────────────────────────── */}
        {activeTab === "chat" && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col h-[600px] overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <div>
                    <h3 className="text-sm font-bold">LearnX PYQ Assistant</h3>
                    <p className="text-[11px] text-slate-400">
                      Context-aware answers from your {selectedSubject.name} previous year papers
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-purple-600 text-white font-medium"
                          : "bg-white text-slate-800 border border-slate-200 shadow-sm whitespace-pre-line"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                      Analyzing uploaded paper trends...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleChatSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Which unit carries highest marks? Explain 7-mark questions from 2023..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className="px-4 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-xs hover:bg-purple-700 disabled:opacity-50 transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ── AI SOLUTION STUDIO MODAL ─────────────────────────────────────── */}
      {activeQuestionForSolution && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-slate-900">AI Exam Solution Studio</h3>
              </div>
              <button
                onClick={() => setActiveQuestionForSolution(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Question Text */}
            <div className="p-5 border-b border-slate-100 bg-purple-50/40">
              <span className="text-[11px] font-black text-purple-700 uppercase tracking-wider block mb-1">
                Question ({activeQuestionForSolution.marks} Marks • {activeQuestionForSolution.academicYear})
              </span>
              <p className="text-sm font-bold text-slate-900">
                {activeQuestionForSolution.questionText}
              </p>
            </div>

            {/* Solution Content */}
            <div className="p-5 overflow-y-auto flex-1 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3 whitespace-pre-line">
              {generatingSolution ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-bold">
                    Drafting university-standard model solution...
                  </p>
                </div>
              ) : (
                generatedSolution
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Factually grounded in computer science syllabus principles.
              </span>
              <button
                onClick={() => setActiveQuestionForSolution(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900"
              >
                Close Solution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PYQIntelligence;
