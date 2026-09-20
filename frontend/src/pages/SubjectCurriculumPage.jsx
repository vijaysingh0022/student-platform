import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSubjectCurriculum } from "../services/api.js";
import { useAppState } from "../context/AppStateContext.jsx";

const SubjectCurriculumPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { learningVersion } = useAppState();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedUnits, setExpandedUnits] = useState({});

  useEffect(() => {
    let isMounted = true;
    const fetchCurriculum = async () => {
      setLoading(true);
      try {
        const res = await getSubjectCurriculum(subjectId);
        if (isMounted) {
          setData(res.data);
          // Default expand all units
          const expanded = {};
          (res.data.units || []).forEach((u) => {
            expanded[u.unitId] = true;
          });
          setExpandedUnits(expanded);
        }
      } catch (err) {
        console.error("Error loading subject curriculum:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCurriculum();
    return () => {
      isMounted = false;
    };
  }, [subjectId, learningVersion]);

  const toggleUnit = (unitId) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  const getStatusBadge = (topic) => {
    if (topic.masteryStatus === "strong") {
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
          <span>🟢</span>
          <span>Strong ({topic.masteryPercentage}%)</span>
        </span>
      );
    }
    if (topic.masteryStatus === "needs_practice") {
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
          <span>🟡</span>
          <span>Needs Practice ({topic.masteryPercentage}%)</span>
        </span>
      );
    }
    if (topic.masteryStatus === "weak") {
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
          <span>🔴</span>
          <span>Weak Topic ({topic.masteryPercentage}%)</span>
        </span>
      );
    }
    if (topic.isCompleted) {
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-violet-100 text-violet-800 border border-violet-200 flex items-center gap-1">
          <span>✓</span>
          <span>Completed</span>
        </span>
      );
    }
    if (topic.isRead) {
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1">
          <span>📖</span>
          <span>Read</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
        🔵 Not Started
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-600">Loading curriculum hierarchy...</p>
      </div>
    );
  }

  if (!data || !data.subject) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="text-4xl">📚</div>
        <h2 className="text-xl font-bold text-slate-900">Subject Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm">The requested subject could not be located in the curriculum database.</p>
        <Link to="/learn" className="btn-gradient px-4 py-2 rounded-xl text-xs font-bold text-white">
          Back to All Subjects
        </Link>
      </div>
    );
  }

  const { subject, units, stats } = data;

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link to="/learn" className="hover:text-violet-600 transition-colors">
            All Subjects
          </Link>
          <span>/</span>
          <span className="text-slate-900">{subject.name}</span>
        </div>

        {/* Main Grid: Left Sidebar & Right Units/Chapters Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT SIDEBAR: Subject Overview, Progress & Navigation */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xl shadow-xs">
                    {subject.icon}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-violet-100 text-violet-800 border border-violet-200">
                    {subject.badge || subject.code}
                  </span>
                </div>

                <h1 className="text-xl font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {subject.name}
                </h1>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {subject.description}
                </p>
              </div>

              {/* Progress Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500 uppercase">Overall Progress</span>
                  <span className="text-violet-700 font-black">{stats.progressPercent}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500"
                    style={{ width: `${stats.progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>{stats.completedTopics} Completed</span>
                  <span>{stats.totalTopics} Total Topics</span>
                </div>
              </div>

              {/* Quick Unit Navigation List */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Units Menu</div>
                <div className="space-y-1">
                  {units.map((u) => (
                    <button
                      key={u.unitId}
                      onClick={() => toggleUnit(u.unitId)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                        expandedUnits[u.unitId]
                          ? "bg-violet-50 text-violet-900 border border-violet-200/80"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="truncate">Unit {u.unitNumber}: {u.title.split("—")[1] || u.title}</span>
                      <span className="text-[10px] font-black text-slate-400">{u.completedTopics}/{u.totalTopics}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Illustration Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 via-sky-50 to-blue-50 border border-indigo-100 text-center space-y-2">
                <div className="text-3xl">🎓</div>
                <div className="text-xs font-black text-slate-900">A better version of you is loading...</div>
                <div className="text-[10px] font-medium text-slate-500">Keep learning one topic every day!</div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Units & Chapters Accordion */}
          <div className="space-y-6 lg:col-span-3">
            {units.map((unit) => {
              const isExpanded = !!expandedUnits[unit.unitId];

              return (
                <div
                  key={unit.unitId}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-200"
                >
                  {/* Unit Header Bar */}
                  <div
                    onClick={() => toggleUnit(unit.unitId)}
                    className="p-5 sm:p-6 bg-slate-50/70 hover:bg-slate-100/60 cursor-pointer flex items-center justify-between gap-4 select-none border-b border-slate-200/60"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-slate-900 text-white shadow-xs">
                          UNIT {unit.unitNumber}
                        </span>
                        <h3 className="text-base font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {unit.title}
                        </h3>
                      </div>
                      {unit.description && (
                        <p className="text-xs text-slate-500 font-medium pl-1">{unit.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-extrabold text-slate-900">
                          {unit.completedTopics}/{unit.totalTopics} Topics Completed
                        </div>
                        <div className="text-[10px] font-semibold text-slate-400">
                          {unit.progressPercent}% Finished
                        </div>
                      </div>

                      <div
                        className={`w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Unit Chapters & Topics Content */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 space-y-6 bg-white">
                      {unit.chapters.map((chapter) => (
                        <div key={chapter.chapterId} className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h4 className="text-xs font-black text-violet-800 uppercase tracking-wider flex items-center gap-2">
                              <span>📖</span>
                              <span>Chapter {chapter.chapterNumber}: {chapter.title}</span>
                            </h4>
                            <span className="text-[11px] font-bold text-slate-400">
                              {chapter.completedTopics}/{chapter.totalTopics} Completed
                            </span>
                          </div>

                          {/* Topics List */}
                          <div className="grid grid-cols-1 gap-2.5">
                            {chapter.topics.map((topic) => (
                              <div
                                key={topic.topicId}
                                className="group p-4 rounded-2xl border border-slate-100 hover:border-violet-200 bg-slate-50/40 hover:bg-violet-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                              >
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-black text-slate-400">
                                      #{topic.topicNumber}
                                    </span>
                                    <Link
                                      to={`/learn/${subject.subjectId}/${topic.topicId}`}
                                      className="text-sm font-black text-slate-900 group-hover:text-violet-700 transition-colors"
                                    >
                                      {topic.title}
                                    </Link>
                                  </div>
                                  <p className="text-xs text-slate-500 font-medium line-clamp-1">
                                    {topic.summary || topic.subtopics?.join(" • ")}
                                  </p>
                                </div>

                                {/* Topic Badges & Action CTA */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="text-[11px] font-semibold text-slate-400 hidden md:inline">
                                    ⏱️ {topic.estimatedMinutes}m
                                  </span>

                                  {getStatusBadge(topic)}

                                  <Link
                                    to={`/learn/${subject.subjectId}/${topic.topicId}`}
                                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors shadow-xs"
                                  >
                                    Study →
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectCurriculumPage;
