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

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/certificates/my");
      if (data?.certificates) {
        setCertificates(data.certificates);
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

        {/* Right Column (7 cols): High-Resolution Certificate Preview & QR Code Details */}
        <div className="lg:col-span-7 space-y-4">
          {selectedCert ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-slate-900">
                      {selectedCert.courseName}
                    </h2>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        selectedCert.status === "Revoked"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {selectedCert.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Issued to <strong>{selectedCert.studentName}</strong> • ID:{" "}
                    <code className="text-indigo-600 font-bold font-mono">
                      {selectedCert.certificateId}
                    </code>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyShareLink(selectedCert)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>🔗</span>
                    <span>{shareCopied ? "Link Copied!" : "Share Link"}</span>
                  </button>

                  <Link
                    to={`/verify/${selectedCert.verificationToken || selectedCert.certificateId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all flex items-center gap-1.5"
                  >
                    <span>🛡️</span>
                    <span>Public Verify</span>
                  </Link>
                </div>
              </div>

              {/* Certificate Template Component */}
              <div className="w-full flex justify-center">
                <LearnXCertificateTemplate
                  certificate={selectedCert}
                  onDownloadComplete={() => showToast("✅ High-Quality PDF downloaded successfully!")}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
              <span className="text-4xl block">📜</span>
              <p className="text-sm font-bold text-slate-700">No Certificate Earned Yet</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Certificates are strictly non-claimable until every single lesson, assignment, module, project, and exam meets the 100% threshold. Complete your course track on the left to automatically unlock your credential.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCertificatesPage;
