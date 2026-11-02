import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api.js";
import { LearnXLogo } from "../components/LearnXLogo.jsx";

export const VerifyCertificatePage = () => {
  const { tokenOrId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchVerification = async (queryParam) => {
    setLoading(true);
    setError("");
    try {
      const { data: res } = await api.get(`/certificates/verify/${encodeURIComponent(queryParam)}`);
      if (res && res.certificate) {
        setData(res.certificate);
      } else {
        setError(res?.message || "Certificate verification record not found.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No certificate found matching this verification code or Certificate ID."
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenOrId) {
      fetchVerification(tokenOrId);
    } else {
      setLoading(false);
    }
  }, [tokenOrId]);

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchVerification(searchQuery.trim());
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isValid = data && data.status === "Valid";

  return (
    <div className="min-h-screen bg-[#f0f6fc] text-slate-900 flex flex-col justify-between selection:bg-sky-200 selection:text-sky-900 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-40 blur-[130px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #bae6fd 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full opacity-30 blur-[110px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #c7d2fe 0%, transparent 70%)" }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#dbeafe 1px, transparent 1px), linear-gradient(90deg, #dbeafe 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />

      {/* Top Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-2">
          <LearnXLogo size="md" showTagline={false} />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white/80 hover:bg-white border border-slate-200 transition-all shadow-xs"
          >
            <span>←</span> Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-8 px-4 sm:px-6">
        <div className="w-full max-w-2xl space-y-6">
          {/* Card Shell */}
          <div className="bg-white/95 backdrop-blur-2xl border border-sky-100 rounded-3xl shadow-xl shadow-sky-950/10 p-6 sm:p-10">
            {/* Header Title */}
            <div className="text-center pb-6 border-b border-slate-100">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 mb-3">
                <span>🛡️</span> Official LearnX Public Verification Registry
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-space">
                Certificate Verification
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Confirm the authenticity, graduation status, and validity of credentials issued by LearnX Platform.
              </p>

              {/* Search by Certificate ID or Token Input */}
              <form onSubmit={handleManualSearch} className="flex items-center gap-2 max-w-md mx-auto mt-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Certificate ID (e.g. LX-2026-001)"
                  className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs rounded-xl py-2 px-3.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xs"
                >
                  Verify
                </button>
              </form>
            </div>

            {/* Verification Result */}
            {loading ? (
              <div className="py-16 text-center text-slate-400">
                <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs font-medium">Verifying credential on LearnX registry...</p>
              </div>
            ) : error ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl">
                  ✕
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Certificate Not Found or Invalid
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{error}</p>
                </div>
              </div>
            ) : data ? (
              <div className="pt-6 space-y-6">
                {/* Status Badge Banner */}
                <div
                  className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
                    isValid
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-rose-50 border-rose-200 text-rose-900"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
                      isValid ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                    }`}
                  >
                    {isValid ? "✓" : "⚠️"}
                  </div>
                  <div>
                    <div className="text-sm font-black">
                      {isValid ? "OFFICIALLY VERIFIED & VALID" : "CERTIFICATE REVOKED"}
                    </div>
                    <div className="text-xs opacity-90 mt-0.5">
                      {isValid
                        ? "This certificate is authentic, verified by LearnX Academic Council, and in good standing."
                        : `This credential has been administratively revoked. Reason: ${data.revocationReason || "Revoked by issuer"}`}
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Student Name
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                      {data.studentName}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Certificate ID
                    </span>
                    <span className="text-sm font-mono font-black text-indigo-700 mt-0.5 block">
                      {data.certificateId}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Course Completed
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                      {data.courseName}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Course Duration: {data.courseDuration}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Completion Date
                    </span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                      {formatDate(data.completionDate)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Issued By
                    </span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                      {data.issuedBy || "LearnX Academic Council"}
                    </span>
                  </div>
                </div>

                {/* Skills Acquired */}
                {data.skills && data.skills.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Verified Competencies & Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {data.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-800 flex items-center gap-1.5"
                        >
                          <span className="text-emerald-600 font-bold">✓</span>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Footer Security Notice */}
          <p className="text-center text-xs text-slate-500">
            🔒 LearnX Public Verification Registry is cryptographically protected against tampering.
          </p>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 text-center text-[11px] text-slate-500 border-t border-slate-200">
        © {new Date().getFullYear()} LearnX Platform • More Than Learning, A Brighter You
      </footer>
    </div>
  );
};

export default VerifyCertificatePage;
