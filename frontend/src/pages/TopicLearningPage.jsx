import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getTopicDetails, markTopicAsCompleted } from "../services/api.js";
import { useAppState } from "../context/AppStateContext.jsx";
import CodePlayground from "../components/CodePlayground.jsx";
import SortingVisualizer from "../components/SortingVisualizer.jsx";
import PracticePanel from "../components/PracticePanel.jsx";
import NoteEditor from "../components/NoteEditor.jsx";
import AITutorPanel from "../components/AITutorPanel.jsx";

const TopicLearningPage = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();
  const { onTopicCompleted } = useAppState();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [markingCompleted, setMarkingCompleted] = useState(false);
  const [completedState, setCompletedState] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchTopic = async () => {
      setLoading(true);
      try {
        const res = await getTopicDetails(topicId);
        if (isMounted) {
          setData(res.data);
          setCompletedState(!!res.data.progress?.isCompleted);

          // Set default code tab based on available snippets
          const snippets = res.data.topic?.content?.codeSnippets || [];
          if (snippets.length > 0) {
            setSelectedLanguage(snippets[0].language);
          }
        }
      } catch (err) {
        console.error("Error loading topic:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTopic();
    return () => {
      isMounted = false;
    };
  }, [topicId]);

  const handleMarkComplete = async () => {
    setMarkingCompleted(true);
    try {
      await markTopicAsCompleted(topicId);
      setCompletedState(true);
      onTopicCompleted(topicId, subjectId);
    } catch (err) {
      console.error("Error marking topic as completed:", err);
    } finally {
      setMarkingCompleted(false);
    }
  };

  const handleAskTutor = () => {
    if (!data?.topic) return;
    const prompt = `I am currently studying the ${data.topic.title} module in ${data.breadcrumbs?.subject?.name || subjectId}. Can you explain ${data.topic.concepts?.slice(0, 3).join(", ") || data.topic.title} using a simple analogy and viva questions?`;
    navigate(`/tutor?q=${encodeURIComponent(prompt)}&subject=${encodeURIComponent(data.breadcrumbs?.subject?.name || subjectId)}`);
  };

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-600">Loading topic module...</p>
      </div>
    );
  }

  if (!data || !data.topic) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="text-4xl">📄</div>
        <h2 className="text-xl font-bold text-slate-900">Topic Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm">The requested learning topic could not be located.</p>
        <Link to={`/learn/${subjectId}`} className="btn-gradient px-4 py-2 rounded-xl text-xs font-bold text-white">
          Back to Subject
        </Link>
      </div>
    );
  }

  const { topic, breadcrumbs, navigation, progress } = data;
  const content = topic.content || {};
  const codeSnippets = content.codeSnippets || [];
  const codeMap = codeSnippets.reduce((acc, snippet) => {
    if (snippet.language && snippet.code) {
      acc[snippet.language] = snippet.code;
    }
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        {/* Breadcrumb Navigation Bar */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 flex-wrap">
          <Link to="/learn" className="hover:text-violet-600 transition-colors">
            All Subjects
          </Link>
          <span>/</span>
          <Link to={`/learn/${subjectId}`} className="hover:text-violet-600 transition-colors">
            {breadcrumbs.subject.name}
          </Link>
          <span>/</span>
          <span className="text-slate-400">{breadcrumbs.unit.title}</span>
          <span>/</span>
          <span className="text-slate-900">{topic.title}</span>
        </div>

        {/* Topic Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-violet-100 text-violet-800 border border-violet-200">
                  Topic #{topic.topicNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  ⏱️ {topic.estimatedMinutes} Mins
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {topic.difficulty}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {topic.title}
              </h1>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
              <button
                onClick={handleAskTutor}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>🤖 Ask AI Tutor</span>
              </button>

              <Link
                to={`/learn/${subjectId}/${topicId}/quiz`}
                className="btn-gradient px-4 py-2 rounded-xl text-xs font-black text-white flex items-center gap-1.5 shadow-xs"
              >
                <span>⚡ Topic Quiz</span>
              </Link>
            </div>
          </div>

          {/* Subtopics Tags */}
          {topic.subtopics && topic.subtopics.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase mr-1">
                Concepts:
              </span>
              {topic.subtopics.map((sub, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200/80"
                >
                  {sub}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Grid Layout: Main Learning Content & Right Action Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* ─── 6 TOPIC LEARNING TABS NAVIGATION ───────────────────────────────────── */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              {[
                { id: "content", label: "Content" },
                { id: "examples", label: "Examples" },
                { id: "code", label: "Code" },
                { id: "visualisation", label: "Visualisation" },
                { id: "practice", label: "Practice" },
                { id: "notes", label: "Notes" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex-shrink-0 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

        {/* ─── TAB 1: CONTENT ──────────────────────────────────────────────────────── */}
        {activeTab === "content" && (
          <div className="space-y-6 animate-fade-in">
            {/* Introduction Card */}
            {content.introduction && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>📌</span>
                  <span>Introduction & Overview</span>
                </h3>
                <p className="text-sm leading-relaxed text-slate-700 font-medium">
                  {content.introduction}
                </p>
              </div>
            )}

            {/* Core Concepts Breakdown */}
            {content.concepts && content.concepts.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-violet-800 uppercase tracking-wider flex items-center gap-2">
                  <span>📚</span>
                  <span>Core Concepts to Master</span>
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {content.concepts.map((concept, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-violet-50/40 border border-violet-100 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                        {concept}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Algorithm Steps & Mechanics */}
            {content.algorithmSteps && content.algorithmSteps.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>⚙️</span>
                  <span>Algorithm & Execution Mechanics</span>
                </h3>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs text-slate-800 leading-relaxed">
                  {content.algorithmSteps.map((step, sIdx) => (
                    <div key={sIdx}>{step}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Complexity Grid */}
            {(content.timeComplexity || content.spaceComplexity) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    ⏱️ Time Complexity
                  </span>
                  <p className="text-sm font-black text-violet-800 font-mono">
                    {content.timeComplexity}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    💾 Space Complexity
                  </span>
                  <p className="text-sm font-black text-sky-800 font-mono">
                    {content.spaceComplexity}
                  </p>
                </div>
              </div>
            )}

            {/* Key Takeaways & Common Mistakes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.keyTakeaways && content.keyTakeaways.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-emerald-200/80 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>✅</span>
                    <span>Key Exam & Interview Takeaways</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 font-medium">
                    {content.keyTakeaways.map((takeaway, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {content.commonMistakes && content.commonMistakes.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-rose-200/80 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>Common Traps & Pitfalls</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 font-medium">
                    {content.commonMistakes.map((mistake, mIdx) => (
                      <li key={mIdx} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 2: EXAMPLES ────────────────────────────────────────────────────── */}
        {activeTab === "examples" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>💡</span>
                <span>Step-by-Step Practical Examples & Dry Run</span>
              </h3>

              {content.examples && content.examples.length > 0 ? (
                <div className="space-y-4">
                  {content.examples.map((ex, eIdx) => (
                    <div key={eIdx} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="text-xs font-black text-violet-700 uppercase tracking-wider">Example #{eIdx + 1}</div>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">{ex}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                  <p className="font-bold text-slate-900">Sample Dry Run for {topic.title}:</p>
                  <p>Given Array: [10, 7, 8, 9, 1, 5]</p>
                  <p>1. Pivot chosen: 5</p>
                  <p>2. Elements less than 5 moved left ([1]), elements greater moved right ([10, 7, 8, 9])</p>
                  <p>3. Recursively partition left and right sub-arrays until sorted: [1, 5, 7, 8, 9, 10].</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 3: CODE ────────────────────────────────────────────────────────── */}
        {activeTab === "code" && (
          <div className="space-y-6 animate-fade-in">
            <CodePlayground codeExamples={codeMap} />
          </div>
        )}

        {/* ─── TAB 4: VISUALISATION ───────────────────────────────────────────────── */}
        {activeTab === "visualisation" && (
          <div className="space-y-6 animate-fade-in">
            <SortingVisualizer topicTitle={topic.title} />
          </div>
        )}

        {/* ─── TAB 5: PRACTICE ────────────────────────────────────────────────────── */}
        {activeTab === "practice" && (
          <div className="space-y-6 animate-fade-in">
            <PracticePanel topicId={topicId} subjectId={subjectId} />
          </div>
        )}

        {/* ─── TAB 6: NOTES ───────────────────────────────────────────────────────── */}
        {activeTab === "notes" && (
          <div className="space-y-6 animate-fade-in">
            <NoteEditor topicId={topicId} topicTitle={topic.title} />
          </div>
        )}

          </div>

          {/* Right Action Sidebar (1 col) matching reference screenshot */}
          <div className="space-y-6 lg:col-span-1">
            {/* Card 1: Mark your progress */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 sticky top-24">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Mark your progress</h4>

              {!completedState ? (
                <button
                  id="mark-topic-completed-btn-side"
                  onClick={handleMarkComplete}
                  disabled={markingCompleted}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>✓ Mark as Read</span>
                </button>
              ) : (
                <div className="w-full py-2 px-4 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs text-center border border-emerald-200">
                  ✓ Marked as Read
                </div>
              )}

              <p className="text-[11px] text-slate-500 font-medium text-center">
                After reading, test your understanding.
              </p>

              <Link
                to={`/learn/${subjectId}/${topicId}/quiz`}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>📝 Start Questions</span>
              </Link>
            </div>

            {/* Card 2: Quick Links */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Quick Links</h4>
              <div className="space-y-2 text-xs font-bold text-slate-700">
                <button
                  onClick={() => window.print()}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-center gap-2 transition-colors"
                >
                  <span>📥</span>
                  <span>Download Notes (PDF)</span>
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-center gap-2 transition-colors"
                >
                  <span>📓</span>
                  <span>Add to My Notes</span>
                </button>
                <button
                  onClick={handleAskTutor}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-center gap-2 transition-colors"
                >
                  <span>🤖</span>
                  <span>Ask AI Tutor</span>
                </button>
                <Link
                  to="/tutor"
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-center gap-2 transition-colors"
                >
                  <span>💬</span>
                  <span>View Discussions</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ─── COMPLETION & QUIZ CTA FOOTER ───────────────────────────────── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {completedState
                  ? "🎉 You have completed this study module!"
                  : "Done reading? Mark this topic as completed."}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {completedState
                  ? "Now test your understanding with the topic quiz to earn verified subject mastery."
                  : "Marking as completed tracks your study streak and unlocks topic quizzes."}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {!completedState ? (
                <button
                  id="mark-topic-completed-btn"
                  onClick={handleMarkComplete}
                  disabled={markingCompleted}
                  className="px-5 py-2.5 rounded-2xl text-xs font-black text-white bg-slate-900 hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-2 shadow-sm"
                >
                  {markingCompleted ? "Saving..." : "✓ Mark as Completed"}
                </button>
              ) : (
                <span className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                  <span>✓</span>
                  <span>Completed</span>
                </span>
              )}

              <Link
                to={`/learn/${subjectId}/${topicId}/quiz`}
                className="btn-gradient px-5 py-2.5 rounded-2xl text-xs font-black text-white active:scale-95 transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Start Topic Quiz</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Next & Previous Topic Navigation Bar */}
        <div className="flex items-center justify-between gap-4 pt-2">
          {navigation?.prev ? (
            <Link
              to={`/learn/${subjectId}/${navigation.prev.topicId}`}
              className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <span>←</span>
              <span>Prev: {navigation.prev.title}</span>
            </Link>
          ) : (
            <div />
          )}

          {navigation?.next ? (
            <Link
              to={`/learn/${subjectId}/${navigation.next.topicId}`}
              className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2 ml-auto"
            >
              <span>Next: {navigation.next.title}</span>
              <span>→</span>
            </Link>
          ) : (
            <Link
              to={`/learn/${subjectId}`}
              className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2 ml-auto"
            >
              <span>Back to Subject Units</span>
              <span>→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicLearningPage;
