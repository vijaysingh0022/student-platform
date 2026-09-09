import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12"
      id="register-page"
    >
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-xl bg-white border border-slate-200">

        {/* Left panel — decorative */}
        <div
          className="hidden md:flex flex-col justify-center p-10 w-1/2 relative overflow-hidden bg-gradient-to-br from-violet-900 via-indigo-900 to-sky-900 text-white"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 shadow-lg p-2">
                <img src="/favicon.svg" alt="LearnX Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1
                  className="text-3xl font-black text-white tracking-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  LEARN<span className="text-sky-400">X</span>
                </h1>
                <p className="text-[11px] font-bold text-violet-200 tracking-wider uppercase">
                  Learn. Practice. Grow. Succeed.
                </p>
              </div>
            </div>

            <h2
              className="text-2xl font-bold mb-2 text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Start your journey today
            </h2>
            <p className="text-xs leading-relaxed mb-6 text-sky-100 font-medium italic">
              "More Than Learning, A Brighter You"
            </p>

            <div className="space-y-2.5">
              {[
                "📖 Personalized Learning & Diagnostic Reports",
                "🤖 24/7 AI Guidance & Doubt Resolution",
                "📝 Rigorous Technical Practice & Tests",
                "📊 Real-Time Mastery Tracking & Radar",
                "💼 Complete Career & Placement Readiness",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs font-bold text-white">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <p className="text-[10px] font-bold tracking-widest text-violet-300/80 uppercase">
                Learn Today • Grow Tomorrow • Succeed Always
              </p>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex flex-col justify-center p-8 md:p-12 w-full md:w-1/2 bg-white">
          <div className="animate-fade-in-up">
            <h2
              className="text-2xl font-extrabold text-slate-900 mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Create your account
            </h2>
            <p className="text-xs font-semibold text-slate-600 mb-8">
              Takes less than a minute
            </p>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl text-sm font-bold bg-rose-100 border border-rose-300 text-rose-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                <input
                  id="register-name"
                  name="name"
                  placeholder="Vijay Singh"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="glass-input text-slate-900 border-slate-300 focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="glass-input text-slate-900 border-slate-300 focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="glass-input text-slate-900 border-slate-300 focus:border-violet-600"
                />
              </div>

              <button
                id="register-submit-btn"
                type="submit"
                disabled={loading}
                className="btn-gradient w-full py-3 mt-2 rounded-xl font-bold text-sm text-white shadow-glow-purple disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Creating account...
                  </span>
                ) : "Create Account →"}
              </button>
            </form>

            <p className="text-xs text-center mt-6 text-slate-600 font-medium">
              Already have an account?{" "}
              <Link to="/login" id="register-login-link" className="font-bold text-violet-700 hover:underline">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
