import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LearnXLogo } from "../components/LearnXLogo.jsx";

// Admin credentials — change these as needed
const ADMIN_EMAIL = "admin@learnx.ai";
const ADMIN_PASSWORD = "LearnX@Admin2024";
const ADMIN_SESSION_KEY = "learnx_admin_session";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (session === "authenticated") {
      setAlreadyLoggedIn(true);
    }
  }, []);

  const handleSignOutAdmin = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAlreadyLoggedIn(false);
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
        navigate("/teacher-dashboard", { replace: true });
      } else {
        setError("Invalid admin credentials. Please try again.");
        setLoading(false);
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background glow orbs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #0ea5e9, transparent)" }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div
          className={`bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl shadow-2xl p-8 transition-all ${
            shake ? "animate-shake" : ""
          }`}
          style={{ boxShadow: "0 25px 60px -15px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)" }}
        >
          {alreadyLoggedIn ? (
            /* Active Session View */
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl shadow-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  🛡️
                </div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">Active Admin Session</h1>
                <p className="text-slate-400 text-xs mt-2 max-w-xs">
                  You are already authenticated as an administrator (<span className="text-violet-300 font-mono font-semibold">{ADMIN_EMAIL}</span>).
                </p>
                <div className="mt-4 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Session Authenticated & Ready
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  id="admin-continue-btn"
                  onClick={() => navigate("/teacher-dashboard")}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #0ea5e9)",
                    boxShadow: "0 4px 20px rgba(124, 58, 237, 0.4)",
                  }}
                >
                  <span>Continue to Command Center →</span>
                </button>

                <button
                  type="button"
                  id="admin-signout-btn"
                  onClick={handleSignOutAdmin}
                  className="w-full py-3 rounded-xl font-bold text-xs text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>🔒 Sign Out / Re-enter Password</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-800 text-center">
                <a href="/" className="text-xs text-slate-500 hover:text-slate-300 font-medium transition-colors">
                  ← Return to Student Portal
                </a>
              </div>
            </div>
          ) : (
            /* Login Form View */
            <>
              {/* Header */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-lg"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}>
                  🛡️
                </div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Portal</h1>
                <p className="text-slate-400 text-sm mt-1 text-center">
                  Restricted access — Faculty & Administration only
                </p>
                <div className="mt-3 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  LearnX Institution Panel
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Admin Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@learnx.ai"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/70 border border-slate-700/60 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500/60 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Admin Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="admin-password"
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-800/70 border border-slate-700/60 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500/60 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPass ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm animate-fade-in">
                    <svg className="w-4 h-4 flex-shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  id="admin-login-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden group"
                  style={{
                    background: loading
                      ? "linear-gradient(135deg, #5b21b6, #0369a1)"
                      : "linear-gradient(135deg, #7c3aed, #0ea5e9)",
                    boxShadow: loading ? "none" : "0 4px 20px rgba(124, 58, 237, 0.4)",
                  }}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying credentials…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Access Admin Portal
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 pt-5 border-t border-slate-700/50 text-center">
                <p className="text-xs text-slate-600">
                  Not an admin?{" "}
                  <a href="/" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                    Return to Student Portal
                  </a>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Security notice */}
        <p className="text-center text-xs text-slate-700 mt-4">
          🔒 All admin access is logged and audited · LearnX Platform v2.4
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.6s ease-in-out; }
      `}</style>
    </div>
  );
};

export { ADMIN_SESSION_KEY };
export default AdminLogin;
