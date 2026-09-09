import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getAuditLogs,
  switchRole,
  getComplianceReport,
  exportUserData,
  updatePrivacyConsent,
  purgeUserData,
  getSystemHealth,
  getInteropSpec,
  ssoLogin,
} from "../services/api.js";

export default function SecurityGovernance() {
  const { user, login } = useAuth();

  const [activeTab, setActiveTab] = useState("audit"); // "audit" | "rbac" | "sso" | "privacy" | "health"
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logFilter, setLogFilter] = useState({ action: "", role: "", status: "", search: "" });
  const [compliance, setCompliance] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [interop, setInterop] = useState(null);
  
  // Role switcher state
  const [switchingRole, setSwitchingRole] = useState(false);
  const [roleMessage, setRoleMessage] = useState("");

  // Privacy states
  const [consent, setConsent] = useState({
    aiModelTelemetry: true,
    placementRecruiterSharing: true,
    institutionalAnalytics: true,
  });
  const [savingConsent, setSavingConsent] = useState(false);
  const [consentSaved, setConsentSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [purging, setPurging] = useState(false);

  // SSO Test state
  const [ssoFeedback, setSsoFeedback] = useState("");
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const demoRef = React.useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (demoRef.current && !demoRef.current.contains(e.target)) {
        setDemoDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    fetchLogs();
    fetchCompliance();
    fetchHealth();
    fetchInterop();
  }, []);

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await getAuditLogs(logFilter);
      if (res.data?.logs) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      console.error("fetchLogs error:", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchCompliance = async () => {
    try {
      const res = await getComplianceReport();
      if (res.data) setCompliance(res.data);
    } catch (err) {
      // ignore
    }
  };

  const fetchHealth = async () => {
    try {
      const res = await getSystemHealth();
      if (res.data) setSystemHealth(res.data);
    } catch (err) {
      // ignore
    }
  };

  const fetchInterop = async () => {
    try {
      const res = await getInteropSpec();
      if (res.data) setInterop(res.data);
    } catch (err) {
      // ignore
    }
  };

  const handleSwitchRole = async (targetRole) => {
    setSwitchingRole(true);
    setRoleMessage("");
    try {
      const res = await switchRole(targetRole);
      if (res.data?.user) {
        login(res.data.user);
        setRoleMessage(`Role switched to ${targetRole.toUpperCase()} successfully.`);
        fetchLogs();
      }
    } catch (err) {
      setRoleMessage("Role switch failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSwitchingRole(false);
    }
  };

  const handleSSOLoginDemo = async (provider, email, name, role) => {
    setSsoFeedback("");
    try {
      const res = await ssoLogin({ provider, email, name, role });
      if (res.data?._id) {
        login(res.data);
        setSsoFeedback(`Authenticated via ${provider.toUpperCase()} SSO as ${res.data.email}`);
        fetchLogs();
      }
    } catch (err) {
      setSsoFeedback("SSO handshake error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const res = await exportUserData();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const dlAnchorElem = document.createElement("a");
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", `learnx_privacy_takeout_${user?._id || "user"}.json`);
      dlAnchorElem.click();
      fetchLogs();
    } catch (err) {
      alert("Failed to export data: " + (err.response?.data?.message || err.message));
    } finally {
      setExporting(false);
    }
  };

  const handleSaveConsent = async () => {
    setSavingConsent(true);
    try {
      await updatePrivacyConsent(consent);
      setConsentSaved(true);
      setTimeout(() => setConsentSaved(false), 2500);
      fetchLogs();
    } catch (err) {
      alert("Failed to update preferences");
    } finally {
      setSavingConsent(false);
    }
  };

  const handlePurgeData = async () => {
    const confirmPurge = window.confirm(
      "WARNING: This will permanently delete your test diagnostic history and career profiles to satisfy GDPR Article 17 Right to Erasure. Proceed?"
    );
    if (!confirmPurge) return;

    setPurging(true);
    try {
      await purgeUserData();
      alert("Personal test history and career data successfully purged and anonymized.");
      fetchLogs();
    } catch (err) {
      alert("Purge failed: " + (err.response?.data?.message || err.message));
    } finally {
      setPurging(false);
    }
  };

  const currentRole = user?.role || "student";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <span>🛡️</span> Zero-Trust Security & Institutional Governance
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Security, RBAC & Compliance Hub
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Enterprise role-based access control, SSO federation, immutable audit trails, and FERPA/GDPR compliance.
          </p>
        </div>

        {/* Exact Signout & Profile Bar matching user design */}
        <div className="relative" ref={demoRef}>
          <div className="flex items-center gap-3.5 bg-white border border-slate-200/90 rounded-2xl px-4 py-2 shadow-sm hover:shadow transition-all">
            {/* Mail Icon */}
            <button
              type="button"
              title="Messages"
              onClick={() => alert("Messages: 0 unread")}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Bell Icon with Dot */}
            <button
              type="button"
              title="Notifications"
              onClick={() => alert("Notifications: All systems operational")}
              className="relative text-slate-400 hover:text-slate-700 transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
            </button>

            <div className="w-px h-5 bg-slate-200" />

            {/* User Profile Trigger */}
            <div
              onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className="text-right leading-tight">
                <p className="text-xs font-bold text-slate-800 tracking-tight group-hover:text-violet-700 transition-colors">
                  {user?.name || "Calvin Matthews"}
                </p>
                <p className="text-[10px] font-semibold text-slate-400 capitalize">
                  {currentRole === "teacher" ? "Faculty" : currentRole}
                </p>
              </div>

              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt={user?.name || "Calvin Matthews"}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-violet-300 transition-all shadow-xs"
                />
              </div>

              <svg
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  demoDropdownOpen ? "rotate-180 text-violet-600" : "group-hover:text-slate-600"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Floating Dropdown with Tooltip Triangle */}
          {demoDropdownOpen && (
            <div
              className="absolute right-0 top-full mt-3 w-44 bg-white rounded-2xl border border-slate-100 py-2 z-50 animate-fade-in-up"
              style={{
                boxShadow: "0 16px 36px -4px rgba(0,0,0,0.12), 0 4px 14px -2px rgba(0,0,0,0.06)",
              }}
            >
              {/* Tooltip Triangle Notch */}
              <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white rotate-45 border-t border-l border-slate-100" />

              <button
                type="button"
                onClick={() => {
                  setDemoDropdownOpen(false);
                  window.location.href = "/dashboard";
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setDemoDropdownOpen(false);
                  setActiveTab("rbac");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Settings
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={() => {
                  setDemoDropdownOpen(false);
                  if (window.confirm("Sign out of current session?")) {
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 transition-colors text-left group"
              >
                <svg className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Signout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl p-2 gap-1.5 shadow-xs overflow-x-auto">
        {[
          { id: "audit", label: "Audit Logs", icon: "📋" },
          { id: "rbac", label: "RBAC Matrix & Switcher", icon: "🔑" },
          { id: "sso", label: "SSO Federation", icon: "🌐" },
          { id: "privacy", label: "Data Privacy & GDPR", icon: "🔒" },
          { id: "health", label: "Cloud Health & LTI", icon: "☁️" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-violet-50 text-violet-800 border border-violet-200 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents Card */}
      <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 p-6 shadow-sm mb-12">
        {/* ─── TAB 1: AUDIT LOGS ──────────────────────────────────── */}
        {activeTab === "audit" && (
          <div className="space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Immutable Audit Trail</h3>
                <p className="text-xs text-slate-500">
                  Cryptographically track all authorization handshakes, SSO logins, role alterations, and data operations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchLogs}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                >
                  <span>🔄</span> Refresh
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <input
                type="text"
                placeholder="Search email, IP, resource..."
                value={logFilter.search}
                onChange={(e) => setLogFilter({ ...logFilter, search: e.target.value })}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
              />
              <select
                value={logFilter.action}
                onChange={(e) => setLogFilter({ ...logFilter, action: e.target.value })}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
              >
                <option value="">All Actions</option>
                <option value="AUTH_LOGIN">AUTH_LOGIN</option>
                <option value="SSO_LOGIN">SSO_LOGIN</option>
                <option value="RBAC_ROLE_CHANGE">RBAC_ROLE_CHANGE</option>
                <option value="DATA_EXPORT">DATA_EXPORT</option>
                <option value="DATA_PURGE">DATA_PURGE</option>
                <option value="ACCESS_DENIED">ACCESS_DENIED</option>
                <option value="SECURITY_ALERT">SECURITY_ALERT</option>
              </select>
              <select
                value={logFilter.status}
                onChange={(e) => setLogFilter({ ...logFilter, status: e.target.value })}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="WARNING">WARNING</option>
                <option value="FAILED">FAILED</option>
              </select>
              <button
                type="button"
                onClick={fetchLogs}
                className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-bold"
              >
                Filter Logs
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Resource / IP</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingLogs ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-500 font-medium">
                        Loading audit logs...
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-500 font-medium">
                        No audit events match current query parameters.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleTimeString()} • {new Date(log.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{log.userEmail}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                              log.userRole === "admin"
                                ? "bg-rose-100 text-rose-800"
                                : log.userRole === "teacher"
                                ? "bg-violet-100 text-violet-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {log.userRole}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{log.action}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                          {log.method} {log.resource} ({log.ipAddress})
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              log.status === "SUCCESS"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : log.status === "WARNING"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 2: RBAC MATRIX & SWITCHER ───────────────────────── */}
        {activeTab === "rbac" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Role-Based Access Control (RBAC)</h3>
              <p className="text-xs text-slate-500">
                Multi-tier privilege segregation enforced by backend middleware (`authorizeRoles`) and frontend route guards.
              </p>
            </div>

            {/* Live Role Switcher Card */}
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>⚡</span> 1-Click Interactive Role Switcher
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Switch your active session role instantly to experience the platform from student, faculty, or institutional administrator perspectives.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {["student", "teacher", "admin"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      disabled={switchingRole || currentRole === r}
                      onClick={() => handleSwitchRole(r)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold capitalize transition-all ${
                        currentRole === r
                          ? "bg-violet-700 text-white shadow-xs ring-2 ring-violet-300"
                          : "bg-white text-slate-700 border border-slate-200 hover:border-violet-300"
                      }`}
                    >
                      {r === "teacher" ? "Faculty" : r}
                    </button>
                  ))}
                </div>
              </div>

              {roleMessage && (
                <div className="mt-3 text-xs font-bold text-violet-800 bg-white/80 p-2.5 rounded-xl border border-violet-200">
                  {roleMessage}
                </div>
              )}
            </div>

            {/* Permission Matrix Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Feature / Resource</th>
                    <th className="py-3 px-4 text-center">Student</th>
                    <th className="py-3 px-4 text-center">Faculty (Teacher)</th>
                    <th className="py-3 px-4 text-center">Institution Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { feature: "Diagnostic Assessments (DSA, OS, DBMS)", student: "Full Access", teacher: "Inspect & Assign", admin: "Full Access" },
                    { feature: "AI Quiz & MCQ Generator (Files/Video)", student: "Full Access", teacher: "Author & Publish", admin: "Full Access" },
                    { feature: "24/7 AI Academic Tutor", student: "Full Access", teacher: "Monitor & Curate", admin: "Full Access" },
                    { feature: "Career Readiness & Resume ATS Engine", student: "Full Access", teacher: "Cohort Review", admin: "Full Access" },
                    { feature: "Faculty & Cohort At-Risk Analytics", student: "Restricted ❌", teacher: "Full Access ✅", admin: "Full Access ✅" },
                    { feature: "Institutional AI Remedial Plan Generator", student: "Restricted ❌", teacher: "Full Access ✅", admin: "Full Access ✅" },
                    { feature: "System Audit Logs & Security Hub", student: "Personal Takeout Only", teacher: "View Audit Trail ✅", admin: "Full Governance ✅" },
                    { feature: "FERPA & GDPR Compliance Controls", student: "Self-Service", teacher: "Departmental", admin: "Institutional Root" },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-4 font-semibold text-slate-800">{row.feature}</td>
                      <td className="py-2.5 px-4 text-center font-medium text-slate-600">{row.student}</td>
                      <td className="py-2.5 px-4 text-center font-bold text-violet-700">{row.teacher}</td>
                      <td className="py-2.5 px-4 text-center font-extrabold text-slate-900">{row.admin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 3: SSO FEDERATION ───────────────────────────────── */}
        {activeTab === "sso" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Single Sign-On (SSO) Federation</h3>
              <p className="text-xs text-slate-500">
                Institutional OAuth 2.0 / OpenID Connect and SAML 2.0 Identity Provider (IdP) federation for universities and colleges.
              </p>
            </div>

            {/* Supported Identity Providers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: "google",
                  name: "Google Workspace for Education",
                  protocol: "OIDC / OAuth 2.0",
                  status: "ACTIVE",
                  icon: "🌐",
                  demoEmail: "sarah.connor@stanford.edu",
                  role: "student",
                },
                {
                  id: "microsoft",
                  name: "Microsoft 365 / Azure AD",
                  protocol: "SAML 2.0 / MSAL",
                  status: "ACTIVE",
                  icon: "🏢",
                  demoEmail: "prof.williams@mit.edu",
                  role: "teacher",
                },
                {
                  id: "institution_edu",
                  name: "University Shibboleth / Edu SAML",
                  protocol: "SAML 2.0 WebSSO",
                  status: "ACTIVE",
                  icon: "🎓",
                  demoEmail: "dean.sharma@iit.edu",
                  role: "admin",
                },
              ].map((provider) => (
                <div key={provider.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-violet-300 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{provider.icon}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {provider.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{provider.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Protocol: {provider.protocol}</p>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleSSOLoginDemo(provider.id, provider.demoEmail, provider.name.split(" ")[0], provider.role)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-violet-100 hover:text-violet-800 text-xs font-bold text-slate-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>🔑</span> Simulate 1-Click SSO ({provider.role})
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {ssoFeedback && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                {ssoFeedback}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 4: DATA PRIVACY & GDPR ──────────────────────────── */}
        {activeTab === "privacy" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Student Data Privacy & GDPR/FERPA Compliance</h3>
              <p className="text-xs text-slate-500">
                Self-service data sovereignty controls adhering to GDPR Article 15 (Access), Article 17 (Erasure), and India DPDP Act.
              </p>
            </div>

            {/* GDPR Takeout & Export Card */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Download My Data (GDPR Article 15 Takeout)</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-xl">
                  Export an archive containing your full diagnostic assessments, quiz attempts, skill profiles, and AI roadmap telemetry in open JSON format.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportData}
                disabled={exporting}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>📦</span> {exporting ? "Generating Package..." : "Download JSON Archive"}
              </button>
            </div>

            {/* Consent Controls */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Consent & Processing Preferences</h4>
              
              {[
                {
                  key: "aiModelTelemetry",
                  label: "AI Tutor & Quiz Telemetry",
                  desc: "Allow anonymized interaction patterns to improve pedagogical question generation.",
                },
                {
                  key: "placementRecruiterSharing",
                  label: "Placement Intelligence Match",
                  desc: "Allow campus placement drives and verified recruiters to review verified skill scores.",
                },
                {
                  key: "institutionalAnalytics",
                  label: "Faculty Departmental Analytics",
                  desc: "Aggregate diagnostic mastery scores into anonymized class curriculum gap reports.",
                },
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{item.label}</span>
                    <span className="text-xs text-slate-500">{item.desc}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={consent[item.key]}
                    onChange={(e) => setConsent({ ...consent, [item.key]: e.target.checked })}
                    className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 mt-1 cursor-pointer"
                  />
                </div>
              ))}

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-emerald-600 font-bold">
                  {consentSaved ? "Preferences updated in immutable audit log." : ""}
                </span>
                <button
                  type="button"
                  onClick={handleSaveConsent}
                  disabled={savingConsent}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-xs"
                >
                  {savingConsent ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </div>

            {/* Right to be Forgotten (Purge) */}
            <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-rose-950 text-sm">Right to be Forgotten (GDPR Article 17)</h4>
                <p className="text-xs text-rose-800 mt-1 max-w-xl">
                  Permanently wipe all diagnostic scores, quiz evaluations, and career telemetry from the database.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePurgeData}
                disabled={purging}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all whitespace-nowrap"
              >
                {purging ? "Purging..." : "Purge My Records"}
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB 5: CLOUD HEALTH & LTI ───────────────────────────── */}
        {activeTab === "health" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Cloud Readiness & Interoperability</h3>
              <p className="text-xs text-slate-500">
                Continuous health probes, container metrics, and 1EdTech LTI 1.3 LMS interoperability specs.
              </p>
            </div>

            {/* Health Metrics Grid */}
            {systemHealth && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-xs text-slate-500 font-medium block">Service Status</span>
                  <span className="text-base font-extrabold text-emerald-600 uppercase mt-0.5 block">
                    ● {systemHealth.status}
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-xs text-slate-500 font-medium block">Database Latency</span>
                  <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                    {systemHealth.database?.latencyMs} ms
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-xs text-slate-500 font-medium block">Memory Footprint</span>
                  <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                    {systemHealth.system?.memoryUsageMb?.heapUsed} MB
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-xs text-slate-500 font-medium block">System Uptime</span>
                  <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                    {Math.floor(systemHealth.uptimeSeconds / 60)} min
                  </span>
                </div>
              </div>
            )}

            {/* Interoperability Specifications */}
            {interop?.specs && (
              <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                <h4 className="text-sm font-bold text-slate-900">LMS & Institutional Standards (1EdTech)</h4>
                <div className="space-y-3">
                  {interop.specs.map((spec, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4 text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block">{spec.name}</span>
                        <span className="text-slate-500">{spec.description || `Supported: ${spec.supportedLMS?.join(", ")}`}</span>
                      </div>
                      <span className="font-extrabold text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {spec.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
