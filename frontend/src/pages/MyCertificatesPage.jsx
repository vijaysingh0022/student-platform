import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import LearnXCertificateTemplate from "../components/certificate/LearnXCertificateTemplate.jsx";

const COURSES_CATALOG = [
  {
    id: "web-development-beginner-level",
    name: "Web Development – Beginner Level",
    category: "Full Stack Track",
    duration: "40 Hours",
    skills: ["HTML & CSS", "JavaScript", "Responsive Design", "Web Projects"],
  },
  {
    id: "data-structures-algorithms",
    name: "Data Structures & Algorithms Mastery",
    category: "CSE Core",
    duration: "60 Hours",
    skills: ["Arrays & Linked Lists", "Trees & Graphs", "Dynamic Programming", "Time Complexity"],
  },
  {
    id: "database-management-systems",
    name: "Database Management & SQL Systems",
    category: "CSE Core",
    duration: "35 Hours",
    skills: ["Relational Modeling", "Advanced SQL", "Indexing & Optimization", "ACID Transactions"],
  },
  {
    id: "system-design-architecture",
    name: "High-Level System Design & Cloud",
    category: "Placement Advanced",
    duration: "50 Hours",
    skills: ["Microservices", "Load Balancing", "Caching Systems", "Distributed Systems"],
  },
];

export const MyCertificatesPage = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isCertificatePreviewOpen, setIsCertificatePreviewOpen] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState("web-development-beginner-level");
  const [courseStatus, setCourseStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [shareCopied, setShareCopied] = useState(false);

  // Simulation controls for testing/demoing progress
  const [simulating, setSimulating] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4500);
  };

  // Close modal handler — restores scroll and clears overflow lock
  const handleCloseCertPreview = () => {
    setIsCertificatePreviewOpen(false);
    document.body.style.overflow = "";
  };

  // Lock body scroll when modal is open; restore on close / unmount
  useEffect(() => {
    if (isCertificatePreviewOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCertificatePreviewOpen]);

  // ESC key listener — only active while modal is open
  useEffect(() => {
    if (!isCertificatePreviewOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleCloseCertPreview();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCertificatePreviewOpen]);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/certificates/my");
      if (data?.certificates) {
        setCertificates(data.certificates);
        // Auto-select first cert metadata but do NOT open modal on load
        if (data.certificates.length > 0 && !selectedCert) {
          setSelectedCert(data.certificates[0]);
        }
      }
    } catch (err) {
      console.warn("Error fetching certificates:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseStatus = async (courseId) => {
    setLoadingStatus(true);
    try {
      const { data } = await api.get(`/certificates/status/${courseId}`);
      if (data?.success) {
        setCourseStatus(data);
        // Auto-select cert metadata but do NOT open modal on load
        if (data.certificate) {
          setSelectedCert(data.certificate);
        }
      }
    } catch (err) {
      console.warn("Error fetching course certificate status:", err.message);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
    fetchCourseStatus(activeCourseId);
  }, [activeCourseId]);

  // Interactive Demo Progress Simulation helper
  const handleSimulateProgress = async (lessons, modules, assignments, projects, assessmentScore) => {
    setSimulating(true);
    try {
      const { data } = await api.post("/certificates/progress", {
        courseId: activeCourseId,
        completedLessons: lessons,
        completedModules: modules,
        submittedAssignments: assignments,
        submittedProjects: projects,
        finalAssessmentScore: assessmentScore,
      });

      if (data?.isNewlyGenerated) {
        showToast("🎉 Congratulations! All 6 conditions met — Certificate automatically generated!");
        await fetchCertificates();
        if (data.certificate) {
          setSelectedCert(data.certificate);
          setIsCertificatePreviewOpen(true);
        }
      } else {
        showToast("Progress updated. Review remaining requirements below.");
      }

      await fetchCourseStatus(activeCourseId);
    } catch (err) {
      showToast("Progress update failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSimulating(false);
    }
  };

  const handleCopyShareLink = (cert) => {
    const link = `${window.location.origin}/verify/${cert.verificationToken || cert.certificateId}`;
    navigator.clipboard.writeText(link);
    setShareCopied(true);
    showToast("📋 Public Verification Link copied to clipboard!");
    setTimeout(() => setShareCopied(false), 3000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Certificate Issued":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Eligible for Certificate":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Assessment Pending":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Requirements Incomplete":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "In Progress":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#061c47] via-[#0d3b85] to-[#1e64cc] p-6 sm:p-8 text-white shadow-xl shadow-blue-950/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <span>🛡️</span> Strict Automatic Academic Certification
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              My Certificates & Course Eligibility
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Certificates are automatically issued <strong>only when all 6 completion criteria</strong> are satisfied: 100% course progress, all lessons, all modules, all mandatory assignments, final projects, and passing the final assessment.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Earned</div>
              <div className="text-xl font-extrabold text-white">{certificates.length}</div>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Verified</div>
              <div className="text-xl font-extrabold text-amber-300">
                {certificates.filter((c) => c.status === "Valid").length}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): Course Tabs, Strict Checklist & Progress Simulation */}
        <div className="lg:col-span-5 space-y-6">
          {/* Select Course Track */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span>📚</span> Select Course Track
              </h2>
              <span className="text-[11px] text-slate-400">4 Active Tracks</span>
            </div>

            <div className="space-y-2">
              {COURSES_CATALOG.map((course) => {
                const isActive = activeCourseId === course.id;
                const hasCert = certificates.some((c) => c.courseId === course.id && c.status === "Valid");

                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => setActiveCourseId(course.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isActive
                        ? "bg-indigo-50/90 border-indigo-500 shadow-2xs ring-1 ring-indigo-400"
                        : "bg-white hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-indigo-700 uppercase">{course.category}</div>
                      <div className="text-xs font-black text-slate-900 truncate">{course.name}</div>
                    </div>
                    {hasCert ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800 shrink-0">
                        ✓ Issued
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 shrink-0">→</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Strict Eligibility Tracker Card for Active Course */}
          {courseStatus && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Certificate Eligibility Status
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${getStatusBadge(
                        courseStatus.status
                      )}`}
                    >
                      {courseStatus.status === "Certificate Issued" && "✓ "}
                      {courseStatus.status}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Verified Progress</span>
                  <div className="text-base font-black text-slate-900">
                    {courseStatus.progressPercentage}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${
                      courseStatus.progressPercentage === 100 ? "bg-emerald-500" : "bg-indigo-600"
                    }`}
                    style={{ width: `${courseStatus.progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>Enrolled</span>
                  <span>{courseStatus.remainingCount === 0 ? "All requirements completed" : `${courseStatus.remainingCount} requirements remaining`}</span>
                  <span>100% Target</span>
                </div>
              </div>

              {/* Strict 6-Condition Checklist */}
              <div className="space-y-2.5 pt-2">
                <div className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                  Mandatory Academic Conditions
                </div>

                {courseStatus.criteria?.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                      item.satisfied
                        ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                        : item.failed
                        ? "bg-rose-50/70 border-rose-200 text-rose-950"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-sm mt-0.5">
                        {item.satisfied ? "✅" : item.failed ? "❌" : "⏳"}
                      </span>
                      <div>
                        <div className="text-xs font-bold leading-tight">{item.title}</div>
                        <div className="text-[10px] opacity-75 mt-0.5">
                          Requirement: {item.required} • Current: <strong>{item.completed}</strong>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shrink-0 ${
                        item.satisfied
                          ? "bg-emerald-200/80 text-emerald-900"
                          : item.failed
                          ? "bg-rose-200/80 text-rose-900"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {item.satisfied ? "Passed" : item.failed ? "Failed" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick Academic Test Simulator: Test all 6 strict scenarios from the requirements */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>🧪 Test / Progress Simulator</span>
                  <span className="text-indigo-600 font-semibold">Strict Backend Validation</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    disabled={simulating}
                    onClick={() => handleSimulateProgress(2, 1, 0, 0, -1)}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 text-left transition-colors"
                  >
                    Scenario 1: 20% (2/10)
                    <div className="text-[9px] text-slate-400">No certificate</div>
                  </button>

                  <button
                    type="button"
                    disabled={simulating}
                    onClick={() => handleSimulateProgress(5, 2, 1, 0, -1)}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 text-left transition-colors"
                  >
                    Scenario 2: 50% (5/10)
                    <div className="text-[9px] text-slate-400">No certificate</div>
                  </button>

                  <button
                    type="button"
                    disabled={simulating}
                    onClick={() => handleSimulateProgress(9, 5, 3, 2, -1)}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 text-left transition-colors"
                  >
                    Scenario 3: 90% (9/10)
                    <div className="text-[9px] text-slate-400">Lessons incomplete</div>
                  </button>

                  <button
                    type="button"
                    disabled={simulating}
                    onClick={() => handleSimulateProgress(10, 5, 3, 2, 45)}
                    className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-[11px] font-semibold text-rose-800 text-left transition-colors"
                  >
                    Scenario 4: 100% (Fail Exam 45%)
                    <div className="text-[9px] text-rose-600">Failed passing mark</div>
                  </button>

                  <button
                    type="button"
                    disabled={simulating}
                    onClick={() => handleSimulateProgress(10, 5, 1, 2, 85)}
                    className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[11px] font-semibold text-amber-800 text-left transition-colors"
                  >
                    Scenario 5: 100% (1/3 Assign.)
                    <div className="text-[9px] text-amber-600">Assignments pending</div>
                  </button>

                  <button
                    type="button"
                    disabled={simulating}
                    onClick={() => handleSimulateProgress(10, 5, 3, 2, 88)}
                    className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[11px] font-bold text-emerald-800 text-left transition-colors"
                  >
                    Scenario 6: 100% Completed!
                    <div className="text-[9px] text-emerald-600">Auto-Generates Cert</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (7 cols): Earned Certificates List */}
        <div className="lg:col-span-7 space-y-4">
          {/* Earned Certificates Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span>🏆</span> Earned Certificates
              </h2>
              <span className="text-[11px] text-slate-400 font-semibold">{certificates.length} credential{certificates.length !== 1 ? "s" : ""}</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10 text-slate-400 text-sm gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Loading certificates…
              </div>
            ) : certificates.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <span className="text-4xl block">📜</span>
                <p className="text-sm font-bold text-slate-700">No Certificate Earned Yet</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Certificates are strictly non-claimable until every single lesson, assignment, module, project, and exam meets the 100% threshold. Complete your course track on the left to automatically unlock your credential.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div
                    key={cert._id || cert.certificateId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white hover:shadow-sm transition-all"
                  >
                    {/* Cert Info */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-extrabold text-slate-900 truncate">{cert.courseName}</span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shrink-0 ${
                            cert.status === "Revoked"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {cert.status === "Valid" ? "✓ Valid" : cert.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Issued to <strong>{cert.studentName}</strong> •{" "}
                        <code className="text-indigo-600 font-bold font-mono">{cert.certificateId}</code>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : ""}
                        {cert.courseDuration ? ` • ${cert.courseDuration}` : ""}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyShareLink(cert)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center gap-1.5 shadow-2xs"
                        title="Copy share link"
                      >
                        <span>🔗</span>
                        <span className="hidden sm:inline">{shareCopied ? "Copied!" : "Share"}</span>
                      </button>

                      <Link
                        to={`/verify/${cert.verificationToken || cert.certificateId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all flex items-center gap-1.5"
                        title="Public verification page"
                      >
                        <span>🛡️</span>
                        <span className="hidden sm:inline">Verify</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCert(cert);
                          setIsCertificatePreviewOpen(true);
                        }}
                        className="px-4 py-1.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[#061c47] to-[#1e64cc] hover:from-[#0d3b85] hover:to-[#2563eb] transition-all flex items-center gap-1.5 shadow-sm"
                        title="View full certificate"
                      >
                        <span>👁️</span> View →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hint card when cert is selected but modal is closed */}
          {selectedCert && !isCertificatePreviewOpen && (
            <div className="flex items-center justify-between gap-4 bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-3">
              <div className="text-xs text-indigo-700 font-semibold">
                <span className="font-black">{selectedCert.courseName}</span> is ready to view
              </div>
              <button
                type="button"
                onClick={() => setIsCertificatePreviewOpen(true)}
                className="px-4 py-1.5 rounded-xl text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm shrink-0"
              >
                Open Certificate ↗
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────
          CERTIFICATE PREVIEW MODAL
          - Full-screen overlay with blur backdrop
          - Click outside → close
          - ESC → close (via useEffect above)
          - Floating prominent circular Close (✕) button at top-right
          - Sticky top bar with ← Back + actions + prominent Close button
      ─────────────────────────────────────────────────────────────── */}
      {isCertificatePreviewOpen && selectedCert && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center overflow-y-auto p-3 sm:p-6"
          onClick={handleCloseCertPreview}
          aria-modal="true"
          role="dialog"
          aria-label="Certificate Preview"
        >
          {/* Floating Close Button at top-right of screen/viewport for guaranteed accessibility */}
          <button
            type="button"
            onClick={handleCloseCertPreview}
            title="Close Certificate"
            aria-label="Close Certificate"
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[60] w-12 h-12 rounded-full bg-slate-900/90 hover:bg-rose-600 text-white flex items-center justify-center transition-all duration-200 shadow-2xl border-2 border-white/20 hover:scale-110 cursor-pointer group"
          >
            <span className="text-2xl font-black leading-none group-hover:rotate-90 transition-transform">✕</span>
          </button>

          <div
            className="relative my-4 sm:my-8 mx-auto w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Control Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 rounded-t-3xl shadow-md">
              {/* ← Back to Certificates button */}
              <button
                type="button"
                onClick={handleCloseCertPreview}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-all border border-slate-200 cursor-pointer shadow-xs"
                title="Back to Certificates"
              >
                <span>←</span>
                <span>Back to Certificates</span>
              </button>

              {/* Right-side actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => handleCopyShareLink(selectedCert)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center gap-1.5 shadow-2xs border border-slate-200"
                  title="Copy share link"
                >
                  <span>🔗</span>
                  <span className="hidden sm:inline">{shareCopied ? "Copied!" : "Share Link"}</span>
                </button>

                <Link
                  to={`/verify/${selectedCert.verificationToken || selectedCert.certificateId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all flex items-center gap-1.5"
                  title="Open public verification page"
                >
                  <span>🛡️</span>
                  <span className="hidden sm:inline">Public Verify</span>
                </Link>

                {/* Top-Right Modal Close (✕) Button */}
                <button
                  type="button"
                  onClick={handleCloseCertPreview}
                  title="Close Certificate"
                  aria-label="Close Certificate"
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-700 flex items-center justify-center transition-all font-black text-xl leading-none shadow-sm border border-slate-300 cursor-pointer ml-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Certificate modal body */}
            <div className="bg-white rounded-b-3xl p-4 sm:p-6 overflow-x-auto shadow-2xl border-x border-b border-slate-200">
              {/* Cert ID / title strip */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">{selectedCert.courseName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Issued to <strong>{selectedCert.studentName}</strong> •{" "}
                    <code className="text-indigo-600 font-bold font-mono">{selectedCert.certificateId}</code>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg ${
                      selectedCert.status === "Revoked"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {selectedCert.status === "Valid" ? "✓ Valid & Verified" : selectedCert.status}
                  </span>
                </div>
              </div>

              {/* The certificate template with onClose prop wired */}
              <div className="w-full flex justify-center">
                <LearnXCertificateTemplate
                  certificate={selectedCert}
                  onClose={handleCloseCertPreview}
                  onDownloadComplete={() => showToast("✅ High-Quality PDF downloaded successfully!")}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCertificatesPage;
