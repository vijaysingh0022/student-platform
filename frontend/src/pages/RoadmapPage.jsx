import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, useLocation, Link } from "react-router-dom";
import api from "../services/api.js";
import RoadmapVisualizer from "../components/RoadmapVisualizer.jsx";
import { useAppState } from "../context/AppStateContext.jsx";

const AVAILABLE_SUBJECTS = [
  { id: "DSA", name: "Data Structures & Algorithms", icon: "⚡", color: "from-blue-600 to-indigo-600" },
  { id: "DBMS", name: "Database Management Systems", icon: "🗄️", color: "from-emerald-600 to-teal-600" },
  { id: "OS", name: "Operating Systems", icon: "💻", color: "from-violet-600 to-purple-600" },
  { id: "CN", name: "Computer Networks", icon: "🌐", color: "from-sky-600 to-blue-600" },
  { id: "Java", name: "Core Java & OOPs", icon: "☕", color: "from-amber-600 to-orange-600" },
  { id: "Python", name: "Python & Data Science", icon: "🐍", color: "from-green-600 to-emerald-600" },
  { id: "Web Dev", name: "Full Stack Web Dev", icon: "⚛️", color: "from-cyan-600 to-blue-600" },
  { id: "System Design", name: "System Design & Architecture", icon: "🏗️", color: "from-rose-600 to-pink-600" },
];

const RoadmapPage = () => {
  const { subject: routeSubject } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { testVersion, onRoadmapDayToggled, jobReadinessScore } = useAppState();

  const activeSubject =
    routeSubject ||
    location.state?.subject ||
    searchParams.get("subject") ||
    "DSA";

  const [roadmap, setRoadmap] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(null);

  // Fetch or auto-generate roadmap
  useEffect(() => {
    let isMounted = true;

    const fetchRoadmapData = async () => {
      setLoading(true);
      setGenError(null);

      try {
        // Fetch skill gap and existing roadmap in parallel
        const [skillGapRes, roadmapRes] = await Promise.all([
          api.get(`/tests/skill-gap/${activeSubject}`).catch(() => ({ data: null })),
          api.get(`/roadmap/${activeSubject}`).catch(() => ({ data: null })),
        ]);

        if (!isMounted) return;

        setSkillGap(skillGapRes.data);

        const shouldRegenerate =
          location.state?.forceRegenerate ||
          (location.state?.autoRoadmap && !roadmapRes.data);

        if (!shouldRegenerate && roadmapRes.data && roadmapRes.data.days && roadmapRes.data.days.length > 0) {
          setRoadmap(roadmapRes.data);
        } else {
          // Auto-generate fresh roadmap tailored to test results / weak topics
          const weakTopics =
            location.state?.weakTopics?.length > 0
              ? location.state.weakTopics
              : skillGapRes.data?.weakTopics || [];

          setGenerating(true);
          try {
            const { data } = await api.post("/roadmap/generate", {
              subject: activeSubject,
              weakTopics,
            });
            if (isMounted) setRoadmap(data);
          } catch (genErr) {
            console.error("Auto generate roadmap error:", genErr);
            if (isMounted) {
              if (roadmapRes.data?.days?.length > 0) {
                setRoadmap(roadmapRes.data);
              } else {
                setGenError("Failed to auto-generate roadmap. Click Regenerate below.");
              }
            }
          } finally {
            if (isMounted) setGenerating(false);
          }
        }
      } catch (err) {
        console.error("Error fetching roadmap:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRoadmapData();

    return () => {
      isMounted = false;
    };
  }, [activeSubject, testVersion, location.key]);

  const handleSubjectChange = (subjectId) => {
    setSearchParams({ subject: subjectId });
  };

  const handleRegenerate = async () => {
    setGenerating(true);
    setGenError(null);
    try {
      const weakTopics = skillGap?.weakTopics || [];
      const { data } = await api.post("/roadmap/generate", {
        subject: activeSubject,
        weakTopics,
      });
      setRoadmap(data);
    } catch (err) {
      console.error("Manual regenerate roadmap error:", err);
      setGenError(err.response?.data?.message || "Failed to regenerate roadmap.");
    } finally {
      setGenerating(false);
    }
  };

  const currentSubjectMeta =
    AVAILABLE_SUBJECTS.find((s) => s.id.toLowerCase() === activeSubject.toLowerCase()) || {
      id: activeSubject,
      name: activeSubject,
      icon: "📚",
      color: "from-violet-600 to-indigo-600",
    };

  const completedDays = roadmap?.days?.filter((d) => d.completed).length || 0;
  const totalDays = roadmap?.days?.length || 7;
  const progressPercent = Math.round((completedDays / totalDays) * 100);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-200/40 via-sky-200/30 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="space-y-3 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-black tracking-wide uppercase border border-violet-200 shadow-xs">
              <span>🗺️ 7-Day AI Remediation Blueprint</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              7-Day Personalized Learning Roadmap
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl font-medium leading-relaxed">
              Engineered by AI from your diagnostic test performance. Each day targets your diagnosed conceptual blindspots with micro-actions, pro tips, and interactive AI tutoring.
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 z-10 flex-shrink-0">
            <button
              id="roadmap-regenerate-btn"
              onClick={handleRegenerate}
              disabled={generating || loading}
              className="btn-gradient px-4 py-2.5 rounded-2xl text-xs font-black text-white flex items-center gap-2 shadow-sm disabled:opacity-50 active:scale-95 transition-all"
            >
              {generating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Plan...</span>
                </>
              ) : (
                <>
                  <span>✨ Regenerate with AI</span>
                </>
              )}
            </button>

            <Link
              to={`/test/${activeSubject}`}
              className="px-4 py-2.5 rounded-2xl text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center gap-2 active:scale-95 transition-all shadow-xs"
            >
              <span>📝 Take {activeSubject} Test</span>
            </Link>
          </div>
        </div>

        {/* Subject Navigation Tabs */}
        <div className="space-y-2">
          <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider px-1">
            Select Subject:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {AVAILABLE_SUBJECTS.map((sub) => {
              const isSelected = activeSubject.toLowerCase() === sub.id.toLowerCase();
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSubjectChange(sub.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 flex-shrink-0 transition-all duration-200 border ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100/80 hover:text-slate-900"
                  }`}
                >
                  <span className="text-sm">{sub.icon}</span>
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Diagnostic Weakness Alert if exists */}
        {skillGap?.weakTopics && skillGap.weakTopics.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-fade-in">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wide">
                  Diagnosed Weak Areas for {activeSubject}:
                </h4>
                <p className="text-xs text-amber-800 font-medium mt-0.5">
                  The AI has structured your 7-day roadmap specifically around:{" "}
                  <strong>{skillGap.weakTopics.join(", ")}</strong>.
                </p>
              </div>
            </div>
            <Link
              to="/dashboard"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 flex-shrink-0 text-center transition-colors"
            >
              View Skill Gap Analysis →
            </Link>
          </div>
        )}

        {/* Error Banner if any */}
        {genError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between gap-2">
            <span>{genError}</span>
            <button
              onClick={handleRegenerate}
              className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Roadmap Visualizer */}
        {loading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-700">Loading your 7-Day Learning Roadmap...</p>
          </div>
        ) : roadmap ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <RoadmapVisualizer
              roadmap={roadmap}
              onRoadmapUpdated={(updated) => setRoadmap(updated)}
              onRegenerate={handleRegenerate}
              generating={generating}
            />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <div className="text-4xl">🗺️</div>
            <h3 className="text-lg font-bold text-slate-800">No Roadmap Found for {activeSubject}</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Generate a tailored 7-day blueprint targeting your specific strengths and weaknesses.
            </p>
            <button
              onClick={handleRegenerate}
              disabled={generating}
              className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm"
            >
              {generating ? "Generating..." : "⚡ Generate 7-Day Roadmap"}
            </button>
          </div>
        )}

        {/* Study Tips & Best Practice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm">
              1
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
              Complete 1 Day at a Time
            </h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Dedicate 45 minutes daily. Don't rush multiple days at once; spaced repetition locks concepts into long-term memory.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm">
              2
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
              Ask AI Tutor Anytime
            </h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Hit the <strong>"Ask AI Tutor"</strong> button on any day card to get customized explanations, code snippets, and viva questions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
              3
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
              Verify with Fresh Tests
            </h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              After finishing Day 7, retake the diagnostic test to see your score improvement and unlock higher placement readiness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
