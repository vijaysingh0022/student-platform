import React from "react";
import { Link, Navigate } from "react-router-dom";
import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { LearnXLogo } from "../components/LearnXLogo.jsx";

const clerkAppearance = {
  variables: {
    colorPrimary: "#7c3aed",
    colorBackground: "#0f172a",
    colorText: "#f8fafc",
    colorTextSecondary: "#94a3b8",
    colorInputBackground: "#1e293b",
    colorInputText: "#f8fafc",
    borderRadius: "1rem",
    fontFamily: "'Space Grotesk', system-ui, -apple-system, sans-serif",
  },
  elements: {
    card: "bg-slate-900/90 backdrop-blur-2xl border border-slate-700/60 shadow-2xl rounded-3xl p-6 sm:p-8",
    headerTitle: "text-2xl font-black text-white tracking-tight font-space",
    headerSubtitle: "text-xs text-slate-400 font-medium mt-1",
    socialButtonsBlockButton:
      "bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-violet-500/50 text-slate-200 text-xs font-semibold rounded-xl py-2.5 transition-all duration-200 shadow-sm",
    socialButtonsBlockButtonText: "text-slate-200 font-semibold text-xs",
    formButtonPrimary:
      "bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 hover:from-violet-500 hover:to-sky-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]",
    formFieldLabel: "text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5",
    formFieldInput:
      "bg-slate-800/90 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl py-2.5 px-3 transition-all",
    footerActionLink: "text-violet-400 hover:text-violet-300 font-bold transition-colors",
    footerActionText: "text-xs text-slate-400",
    dividerLine: "bg-slate-800",
    dividerText: "text-[11px] font-bold text-slate-500 uppercase tracking-widest",
    identityPreviewText: "text-slate-200 font-medium text-xs",
    identityPreviewEditButtonIcon: "text-violet-400",
    formFieldSuccessText: "text-xs text-emerald-400",
    formFieldErrorText: "text-xs text-rose-400 font-semibold",
    alert: "bg-slate-800/90 border border-slate-700 text-slate-200 rounded-xl text-xs",
    alertText: "text-xs text-slate-200",
  },
};

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden flex flex-col justify-between selection:bg-violet-500 selection:text-white">
      {/* Background ambient lighting */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5 blur-[140px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #ec4899 0%, transparent 70%)" }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top Header Navigation */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-2">
          <LearnXLogo size="md" showTagline={false} />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/admin-login"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-violet-300 bg-violet-950/60 hover:bg-violet-900/60 border border-violet-700/50 hover:border-violet-500 transition-all shadow-xs"
          >
            <span>🔐</span>
            <span className="hidden sm:inline">Faculty / Admin Portal</span>
            <span className="sm:hidden">Admin</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors px-2 py-1"
          >
            <span>←</span> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Split Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-6 lg:py-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Hero & Value Prop */}
          <div className="lg:col-span-6 space-y-6 hidden lg:block">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-bold shadow-glow-purple">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span>AI-POWERED CSE GROWTH ECOSYSTEM</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1
                className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Learn. Practice. <br />
                <span className="bg-gradient-to-r from-violet-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                  Grow. Succeed.
                </span>
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
                Unlock your academic and placement potential with personalized diagnostic testing, 24/7 intelligent tutoring, and predictive career engineering.
              </p>
            </div>

            {/* Key Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-violet-500/40 transition-all group">
                <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center text-base mb-2 group-hover:scale-110 transition-transform">
                  🧠
                </div>
                <h3 className="text-xs font-bold text-white mb-0.5">24/7 AI Tutor</h3>
                <p className="text-[11px] text-slate-400 leading-snug">Instant Socratic doubt resolution & step-by-step explanations</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-sky-500/40 transition-all group">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-base mb-2 group-hover:scale-110 transition-transform">
                  📈
                </div>
                <h3 className="text-xs font-bold text-white mb-0.5">Placement AI</h3>
                <p className="text-[11px] text-slate-400 leading-snug">Predict CTC & analyze tech interview readiness score</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-emerald-500/40 transition-all group">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-base mb-2 group-hover:scale-110 transition-transform">
                  🎯
                </div>
                <h3 className="text-xs font-bold text-white mb-0.5">Skill Gap Radar</h3>
                <p className="text-[11px] text-slate-400 leading-snug">Diagnostic assessments across 12 CSE engineering areas</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-amber-500/40 transition-all group">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-base mb-2 group-hover:scale-110 transition-transform">
                  📡
                </div>
                <h3 className="text-xs font-bold text-white mb-0.5">Offline Learning</h3>
                <p className="text-[11px] text-slate-400 leading-snug">Zero-bandwidth assessment caching and background sync</p>
              </div>
            </div>

            {/* Social Proof Footer */}
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex -space-x-2">
                <img
                  className="w-7 h-7 rounded-full border-2 border-slate-950 object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Student 1"
                />
                <img
                  className="w-7 h-7 rounded-full border-2 border-slate-950 object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt="Student 2"
                />
                <img
                  className="w-7 h-7 rounded-full border-2 border-slate-950 object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                  alt="Student 3"
                />
              </div>
              <p className="text-slate-300 font-medium text-[11px]">
                Trusted by <span className="font-bold text-white">25,000+</span> engineers across 120+ colleges
              </p>
            </div>
          </div>

          {/* Right Column: Clerk Form & Faculty Link */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
              {children}

              {/* Faculty & Admin Portal Banner */}
              <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-r from-violet-950/50 via-slate-900/80 to-sky-950/50 border border-violet-800/40 backdrop-blur-xl text-center shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-sm">🛡️</span>
                  <span className="text-xs font-bold text-white">Faculty & Institutional Access</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">
                  Instructors, TPOs and Deans manage student batches via the dedicated Admin Portal.
                </p>
                <Link
                  to="/admin-login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/50 text-violet-200 hover:text-white text-xs font-bold transition-all"
                >
                  <span>Go to Admin Portal Login</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 text-center text-[11px] text-slate-500 border-t border-slate-900">
        © {new Date().getFullYear()} LearnX Platform • More Than Learning, A Brighter You
      </footer>
    </div>
  );
};

export const ClerkSignInPage = () => {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout title="Sign In" subtitle="Welcome back">
      <SignIn
        routing="path"
        path="/sign-in"
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
        signUpUrl="/sign-up"
        appearance={clerkAppearance}
      />
    </AuthLayout>
  );
};

export const ClerkSignUpPage = () => {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout title="Sign Up" subtitle="Get started today">
      <SignUp
        routing="path"
        path="/sign-up"
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
        signInUrl="/sign-in"
        appearance={clerkAppearance}
      />
    </AuthLayout>
  );
};

export default ClerkSignInPage;
