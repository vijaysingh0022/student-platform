import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useLocation, Link } from "react-router-dom";
import api, { generateStudyPlan, getStudyPlan, rescheduleStudyPlan } from "../services/api.js";
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
  const { testVersion } = useAppState();

  const activeSubject =
    routeSubject ||
    location.state?.subject ||
    searchParams.get("subject") ||
    "DSA";

  const [roadmap, setRoadmap] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [genError, setGenError] = useState(null);

  // Setup Modal State for Inputting Exam / Goal Details
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupForm, setSetupForm] = useState({
    examGoal: "Placement & GATE Preparation",
    examDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    availableHoursPerDay: 2,
    skillLevel: "Intermediate",
    targetScore: "90%",
    preferredStudyTime: "Evening",
  });

  // Fetch or auto-generate study plan
  useEffect(() => {
    let isMounted = true;

    const fetchPlannerData = async () => {
      setLoading(true);
      setGenError(null);

      try {
        const [skillGapRes, roadmapRes] = await Promise.all([
          api.get(`/tests/skill-gap/${activeSubject}`).catch(() => ({ data: null })),
          getStudyPlan(activeSubject).catch(() => ({ data: null })),
        ]);

        if (!isMounted) return;

        setSkillGap(skillGapRes.data);

        const shouldRegenerate =
          location.state?.forceRegenerate ||
          (location.state?.autoRoadmap && !roadmapRes.data);

        if (!shouldRegenerate && roadmapRes.data && roadmapRes.data.days && roadmapRes.data.days.length > 0) {
          setRoadmap(roadmapRes.data);
          // Populate form with existing plan settings
          setSetupForm((prev) => ({
            ...prev,
            examGoal: roadmapRes.data.examGoal || prev.examGoal,
            examDate: roadmapRes.data.examDate
              ? new Date(roadmapRes.data.examDate).toISOString().split("T")[0]
              : prev.examDate,
            availableHoursPerDay: roadmapRes.data.availableHoursPerDay || prev.availableHoursPerDay,
            skillLevel: roadmapRes.data.skillLevel || prev.skillLevel,
            targetScore: roadmapRes.data.targetScore || prev.targetScore,
            preferredStudyTime: roadmapRes.data.preferredStudyTime || prev.preferredStudyTime,
          }));
        } else {
          // Trigger setup modal if no existing plan found or auto generate
          handleGeneratePlanner();
        }
      } catch (err) {
        console.error("Error fetching roadmap:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPlannerData();

    return () => {
      isMounted = false;
    };
  }, [activeSubject, testVersion, location.key]);

  const handleSubjectChange = (subjectId) => {
    setSearchParams({ subject: subjectId });
  };

  const handleGeneratePlanner = async (customPayload = null) => {
    setGenerating(true);
    setGenError(null);
    setShowSetupModal(false);

    try {
      const payload = customPayload || {
        subject: activeSubject,
        ...setupForm,
      };

      const { data } = await generateStudyPlan(payload);
      setRoadmap(data);
    } catch (err) {
      console.error("Generate study planner error:", err);
      setGenError(err.response?.data?.message || "Failed to generate dynamic study plan.");
    } finally {
      setGenerating(false);
    }
  };

  const handleReschedule = async () => {
    if (!roadmap?._id) return;
    setRescheduling(true);
    try {
      const { data } = await rescheduleStudyPlan(roadmap._id);
      setRoadmap(data);
    } catch (err) {
      console.error("Reschedule error:", err);
      setGenError("Failed to reschedule study plan.");
    } finally {
      setRescheduling(false);
    }
  };

  const currentSubjectMeta =
    AVAILABLE_SUBJECTS.find((s) => s.id.toLowerCase() === activeSubject.toLowerCase()) || {
      id: activeSubject,
      name: activeSubject,
      icon: "📚",
      color: "from-violet-600 to-indigo-600",
    };

  // Calculate Time Remaining until Exam Date
  const calculateDaysRemaining = () => {
    if (!roadmap?.examDate) return null;
    const diffTime = new Date(roadmap.examDate).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-200/40 via-sky-200/30 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="space-y-3 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-black tracking-wide uppercase border border-violet-200 shadow-xs">
              <span>⚡ Dynamic AI Study Planner</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {activeSubject} Adaptive Study Planner
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl font-medium leading-relaxed">
              AI-analyzed study blueprint matching your exam date, mastery level, and daily availability. Automatically reschedules missed days, accelerates mastered topics, and reinforces weak concepts.
            </p>
          </div>

          {/* Quick Header CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 z-10 flex-shrink-0">
            <button
              onClick={() => setShowSetupModal(true)}
              className="px-4 py-2.5 rounded-2xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 border border-slate-900 flex items-center gap-2 active:scale-95 transition-all shadow-sm"
            >
              <span>⚙️ Plan Setup & Goals</span>
            </button>

            <button
              id="roadmap-regenerate-btn"
              onClick={() => handleGeneratePlanner()}
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
                  <span>✨ Re-Generate Plan</span>
                </>
              )}
            </button>
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
                  Diagnosed Critical Weak Areas ({activeSubject}):
                </h4>
                <p className="text-xs text-amber-800 font-medium mt-0.5">
                  The AI study planner is dynamically adjusting your practice sessions around:{" "}
                  <strong>{skillGap.weakTopics.join(", ")}</strong>.
                </p>
              </div>
            </div>
            <Link
              to="/skill-graph"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 flex-shrink-0 text-center transition-colors"
            >
              View Skill Graph →
            </Link>
          </div>
        )}

        {/* Error Banner */}
        {genError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between gap-2">
            <span>{genError}</span>
            <button
              onClick={() => handleGeneratePlanner()}
              className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Roadmap Visualizer Component */}
        {loading ? (
          <div className="min-h-[350px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-700">Analyzing mastery, remaining syllabus & generating study plan...</p>
          </div>
        ) : roadmap ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <RoadmapVisualizer
              roadmap={roadmap}
              onRoadmapUpdated={(updated) => setRoadmap(updated)}
              onRegenerate={() => handleGeneratePlanner()}
              onReschedule={handleReschedule}
              onOpenSetup={() => setShowSetupModal(true)}
              generating={generating}
              rescheduling={rescheduling}
              daysRemaining={daysRemaining}
            />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <div className="text-4xl">🎯</div>
            <h3 className="text-lg font-bold text-slate-800">Create Your Dynamic AI Study Plan</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Set your target exam date, daily hours, and current skill level to generate an adaptive day-by-day plan.
            </p>
            <button
              onClick={() => setShowSetupModal(true)}
              disabled={generating}
              className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm"
            >
              🚀 Setup Study Plan
            </button>
          </div>
        )}
      </div>

      {/* Setup & Goal Configuration Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  ⚙️ Dynamic AI Planner Setup
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Configure your exam goals and daily availability for {activeSubject}.
                </p>
              </div>
              <button
                onClick={() => setShowSetupModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGeneratePlanner();
              }}
              className="space-y-4"
            >
              {/* Exam Goal / Target */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Exam / Target Goal
                </label>
                <input
                  type="text"
                  value={setupForm.examGoal}
                  onChange={(e) => setSetupForm({ ...setupForm, examGoal: e.target.value })}
                  placeholder="e.g. GATE CSE, Technical Interview, Semester Exams"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              {/* Exam Date & Available Hours per Day */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    value={setupForm.examDate}
                    onChange={(e) => setSetupForm({ ...setupForm, examDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-violet-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Available Hours / Day
                  </label>
                  <select
                    value={setupForm.availableHoursPerDay}
                    onChange={(e) => setSetupForm({ ...setupForm, availableHoursPerDay: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-violet-500"
                  >
                    <option value={1}>1 Hour / Day</option>
                    <option value={2}>2 Hours / Day</option>
                    <option value={3}>3 Hours / Day</option>
                    <option value={4}>4 Hours / Day</option>
                    <option value={6}>6 Hours / Day</option>
                  </select>
                </div>
              </div>

              {/* Skill Level & Target Score */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Current Skill Level
                  </label>
                  <select
                    value={setupForm.skillLevel}
                    onChange={(e) => setSetupForm({ ...setupForm, skillLevel: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-violet-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Target Score / Goal
                  </label>
                  <input
                    type="text"
                    value={setupForm.targetScore}
                    onChange={(e) => setSetupForm({ ...setupForm, targetScore: e.target.value })}
                    placeholder="e.g. 90%, A+ Grade, Top 1%"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Preferred Study Time */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Preferred Study Time
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["Morning", "Afternoon", "Evening", "Night"].map((timeSlot) => (
                    <button
                      type="button"
                      key={timeSlot}
                      onClick={() => setSetupForm({ ...setupForm, preferredStudyTime: timeSlot })}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        setupForm.preferredStudyTime === timeSlot
                          ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {timeSlot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSetupModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="btn-gradient px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-2"
                >
                  {generating ? "Generating..." : "⚡ Generate AI Study Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;
