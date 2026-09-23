import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    <div className="min-h-screen flex flex-col justify-between bg-[#f0f6fc] text-slate-900 px-4 relative overflow-hidden selection:bg-sky-200 selection:text-sky-900">
      {/* Background ambient lighting */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-40 blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #bae6fd 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-30 blur-[120px] pointer-events-none"
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
        <Link
          to="/"
          className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-xl bg-white/80 border border-sky-100 shadow-xs"
        >
          <span>←</span> Back to Student Portal
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div
            className={`bg-white/90 backdrop-blur-2xl border border-sky-100 rounded-3xl shadow-xl shadow-sky-950/5 p-8 transition-all ${
              shake ? "animate-shake" : ""
            }`}
          >
            {alreadyLoggedIn ? (
              /* Active Session View */
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl shadow-sm bg-emerald-50 border border-emerald-200 text-emerald-600">
                    🛡️
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-space">Active Admin Session</h1>
                  <p className="text-slate-500 text-xs mt-2 max-w-xs">
                    You are already authenticated as an administrator (<span className="text-sky-700 font-mono font-semibold">{ADMIN_EMAIL}</span>).
                  </p>
                  <div className="mt-4 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Session Authenticated & Ready
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    id="admin-continue-btn"
                    onClick={() => navigate("/teacher-dashboard")}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500"
                  >
                    <span>Continue to Command Center →</span>
                  </button>

                  <button
                    type="button"
                    id="admin-signout-btn"
                    onClick={handleSignOutAdmin}
                    className="w-full py-3 rounded-xl font-bold text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span>🔒 Sign Out / Re-enter Password</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100 text-center">
                  <Link to="/" className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors">
                    ← Return to Student Portal
                  </Link>
                </div>
              </div>
            ) : (
              /* Login Form View */
              <>
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-md bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-sky-500/20">
                    🛡️
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-space">Admin Portal</h1>
                  <p className="text-slate-500 text-sm mt-1 text-center">
                    Restricted access — Faculty & Administration only
                  </p>
                  <div className="mt-3 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                    LearnX Institution Panel
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                      Admin Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
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
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                      Admin Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
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
                        className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
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
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm animate-fade-in">
                      <svg className="w-4 h-4 flex-shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden group shadow-lg shadow-sky-500/25 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500"
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
                <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-500">
                    Not an admin?{" "}
                    <Link to="/" className="text-sky-600 hover:text-sky-700 font-semibold transition-colors">
                      Return to Student Portal
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Security notice */}
          <p className="text-center text-xs text-slate-500 mt-4">
            🔒 All admin access is logged and audited · LearnX Platform v2.4
          </p>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 text-center text-[11px] text-slate-500 border-t border-slate-200">
        © {new Date().getFullYear()} LearnX Platform • More Than Learning, A Brighter You
      </footer>

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
