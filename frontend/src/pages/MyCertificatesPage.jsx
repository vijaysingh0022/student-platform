import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import LearnXCertificateTemplate from "../components/certificate/LearnXCertificateTemplate.jsx";

const AVAILABLE_COURSES = [
  {
    id: "web-dev-beginner",
    name: "Web Development – Beginner Level",
    duration: "40 Hours",
    skills: ["HTML & CSS", "JavaScript", "Responsive Design", "Web Projects"],
    category: "Full Stack Track",
    level: "Beginner",
    totalModules: 12,
  },
  {
    id: "data-structures-algorithms",
    name: "Data Structures & Algorithms Mastery",
    duration: "60 Hours",
    skills: ["Arrays & Linked Lists", "Trees & Graphs", "Dynamic Programming", "Time Complexity"],
    category: "CSE Core",
    level: "Intermediate",
    totalModules: 18,
  },
  {
    id: "database-management-systems",
    name: "Database Management & SQL Systems",
    duration: "35 Hours",
    skills: ["Relational Modeling", "Advanced SQL", "Indexing & Optimization", "ACID Transactions"],
    category: "CSE Core",
    level: "Intermediate",
    totalModules: 10,
  },
  {
    id: "system-design-architecture",
    name: "High-Level System Design & Cloud",
    duration: "50 Hours",
    skills: ["Microservices", "Load Balancing", "Caching Systems", "Distributed Systems"],
    category: "Placement Advanced",
    level: "Advanced",
    totalModules: 15,
  },
];

export const MyCertificatesPage = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const [claimingCourseId, setClaimingCourseId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [shareCopied, setShareCopied] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4500);
  };

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/certificates/my");
      if (data && data.certificates) {
        setCertificates(data.certificates);
        if (data.certificates.length > 0 && !selectedCert) {
          setSelectedCert(data.certificates[0]);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch student certificates:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleClaimCertificate = async (course) => {
    setClaimingCourseId(course.id);
    try {
      const { data } = await api.post("/certificates/claim", {
        courseId: course.id,
        courseName: course.name,
        courseDuration: course.duration,
        skills: course.skills,
      });

      if (data && data.certificate) {
        showToast("🎉 Congratulations! Your verified Certificate has been generated!");
        await fetchCertificates();
        setSelectedCert(data.certificate);
      }
    } catch (err) {
      showToast("Could not claim certificate: " + (err.response?.data?.message || err.message));
    } finally {
      setClaimingCourseId(null);
    }
  };

  const handleCopyShareLink = (cert) => {
    const link = `${window.location.origin}/verify/${cert.verificationToken || cert.certificateId}`;
    navigator.clipboard.writeText(link);
    setShareCopied(true);
    showToast("📋 Public Verification Link copied to clipboard!");
    setTimeout(() => setShareCopied(false), 3000);
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

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#061c47] via-[#0d3b85] to-[#1e64cc] p-6 sm:p-8 text-white shadow-xl shadow-blue-950/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <span>🎓</span> LearnX Official Credentials & Badges
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              My Earned Certificates
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Every course completion credential is cryptographically verifiable, backed by our unique QR verification standard, and recognized across universities and hiring partners.
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

        {/* Ambient background blur */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Grid: Left Side Certificates List / Available Courses, Right Side Live Certificate Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Certificates List & Course Claiming (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section 1: Issued Certificates */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span>🏅</span> Your Issued Credentials
              </h2>
              <span className="text-xs font-bold text-slate-500 font-mono">
                {certificates.length} Available
              </span>
            </div>

            {loading ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                <div className="w-6 h-6 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mx-auto mb-2" />
                Loading certificates...
              </div>
            ) : certificates.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200 p-4">
                <span className="text-2xl block mb-1">📜</span>
                You haven&apos;t earned any certificates yet.
                <p className="text-[11px] text-slate-400 mt-1">
                  Complete any of the courses below to claim your personalized verified certificate.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {certificates.map((cert) => {
                  const isSelected = selectedCert?._id === cert._id;
                  const isRevoked = cert.status === "Revoked";

                  return (
                    <div
                      key={cert._id}
                      onClick={() => setSelectedCert(cert)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-indigo-50/80 border-indigo-400 shadow-xs ring-1 ring-indigo-400"
                          : "bg-white hover:bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#061c47] to-[#1e64cc] flex items-center justify-center text-amber-300 font-bold shrink-0 shadow-2xs">
                          🎓
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-slate-900 truncate">
                            {cert.courseName}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-mono text-slate-500">
                              {cert.certificateId}
                            </span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span
                              className={`text-[9.5px] font-extrabold uppercase px-1.5 py-0.2 rounded-md ${
                                isRevoked
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {cert.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCert(cert);
                        }}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 shrink-0"
                      >
                        View →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Complete & Claim Eligible Certificates */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span>⚡</span> Eligible Courses & Claim
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Complete modules and practice tests to unlock your official LearnX credentials.
              </p>
            </div>

            <div className="space-y-3">
              {AVAILABLE_COURSES.map((course) => {
                const alreadyClaimed = certificates.some(
                  (c) => c.courseId === course.id && c.status === "Valid"
                );
                const isClaiming = claimingCourseId === course.id;

                return (
                  <div
                    key={course.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col gap-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                            {course.category}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {course.duration}
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 mt-1">
                          {course.name}
                        </h3>
                      </div>

                      {alreadyClaimed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg shrink-0">
                          <span>✓</span> Earned
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleClaimCertificate(course)}
                          disabled={isClaiming}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xs flex items-center gap-1.5 shrink-0 transition-all disabled:opacity-50"
                        >
                          {isClaiming ? "Issuing..." : "Claim Certificate"}
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {course.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] font-medium text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live High-Resolution Certificate Preview & Verification Actions (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedCert ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6">
              {/* Certificate Metadata Header */}
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

                {/* Share Link Button */}
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

              {/* Status Warning if Revoked */}
              {selectedCert.status === "Revoked" && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                  <span className="text-base">⚠️</span>
                  <div>
                    <span className="font-bold">This certificate has been administratively revoked.</span>
                    {selectedCert.revocationReason && (
                      <p className="text-[11px] text-rose-600 mt-0.5">
                        Reason: {selectedCert.revocationReason}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Certificate Template Component */}
              <div className="w-full flex justify-center">
                <LearnXCertificateTemplate
                  certificate={selectedCert}
                  onDownloadComplete={() => showToast("✅ High-Quality PDF downloaded successfully!")}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <span className="text-4xl block mb-2">📜</span>
              <p className="text-sm font-semibold text-slate-600">Select a certificate to preview</p>
              <p className="text-xs text-slate-400 mt-1">
                Or click &ldquo;Claim Certificate&rdquo; from the eligible courses list on the left.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCertificatesPage;
