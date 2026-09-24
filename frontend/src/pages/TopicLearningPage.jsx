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
      setActiveTab("content");
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

  // Determine if this topic requires/supports algorithm or data structure visualization
  const hasVisualization = Boolean(
    topic?.hasVisualization ||
    content?.hasVisualization ||
    (() => {
      const title = (topic?.title || "").toLowerCase();
      const subId = (subjectId || "").toLowerCase();
      const subtopics = (topic?.subtopics || []).join(" ").toLowerCase();
      const concepts = (content?.concepts || []).join(" ").toLowerCase();
      const combined = `${title} ${subtopics} ${concepts}`;

      const visualKeywords = [
        "sort", "search", "tree", "graph", "stack", "queue", "array", "linked list",
        "heap", "traversal", "binary search", "bfs", "dfs", "dijkstra", "scheduling",
        "round robin", "page replacement", "fifo", "lru", "sliding window", "two pointer",
        "hashing", "hash table", "matrix", "recursion", "trie", "pathfinding", "visualizer",
        "partition", "bubble", "quick", "merge sort", "insertion sort"
      ];

      return visualKeywords.some(keyword => combined.includes(keyword)) || subId === "dsa";
    })()
  );

  const tabs = [
    { id: "content", label: "Content" },
    { id: "examples", label: "Examples & Dry Run" },
    { id: "code", label: "Code" },
    ...(hasVisualization ? [{ id: "visualisation", label: "Visualisation" }] : []),
    { id: "exam-prep", label: "Exam Prep" },
    { id: "practice", label: "Practice & Interview" },
    { id: "notes", label: "Notes" },
  ];

  return (
    <div className="min-h-screen bg-[#f0f6fc] py-8 px-4 sm:px-6 lg:px-8">
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
            <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0 flex-wrap">
              <button
                onClick={handleMarkComplete}
                disabled={markingCompleted || completedState}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                  completedState
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default"
                    : "bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300"
                }`}
              >
                <span>{completedState ? "✓ Completed" : "Mark as Complete"}</span>
              </button>

              <button
                onClick={() => setActiveTab("practice")}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>📝 Practice This Topic</span>
              </button>

              <button
                onClick={handleAskTutor}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>🤖 Ask AI Tutor</span>
              </button>

              <Link
                to={`/learn/${subjectId}/${topicId}/quiz`}
                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 flex items-center gap-1.5 shadow-xs"
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
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-100"
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
            {/* ─── TOPIC LEARNING TABS NAVIGATION ───────────────────────────────────── */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none p-1.5 rounded-2xl bg-white border border-sky-100 shadow-xs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex-shrink-0 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
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
            {/* Short Explanation / Overview Card */}
            {(content.shortExplanation || content.introduction) && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-xs space-y-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>📌</span>
                  <span>Introduction & Short Summary</span>
                </h3>
                <p className="text-sm leading-relaxed text-slate-700 font-medium">
                  {content.shortExplanation || content.introduction}
                </p>
              </div>
            )}

            {/* Simple Explanation Card */}
            {content.simpleExplanation && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-xs space-y-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>👶</span>
                  <span>Explain Like I'm 5</span>
                </h3>
                <p className="text-sm leading-relaxed text-slate-700 font-medium">
                  {content.simpleExplanation}
                </p>
              </div>
            )}

            {/* Real World Example Card */}
            {content.realWorldExample && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-xs space-y-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>🌍</span>
                  <span>Real-World Application</span>
                </h3>
                <p className="text-sm leading-relaxed text-slate-700 font-medium">
                  {content.realWorldExample}
                </p>
              </div>
            )}

            {/* In-Depth Academic Theory Card */}
            {(content.detailedExplanation || content.explanationMarkdown) && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-xs space-y-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>📖</span>
                  <span>Detailed Academic Explanation</span>
                </h3>
                <div className="text-sm leading-relaxed text-slate-700 font-medium whitespace-pre-line space-y-2">
                  {content.detailedExplanation || content.explanationMarkdown}
                </div>
              </div>
            )}

            {/* Visual Diagram Section */}
            {content.visualDiagram && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-xs space-y-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>📐</span>
                  <span>Visual Representation & System Diagram</span>
                </h3>
                <div className="p-4 rounded-2xl bg-slate-900 text-sky-300 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                  {content.visualDiagram}
                </div>
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

          </div>
        )}

        {/* ─── TAB: EXAM PREP ─────────────────────────────────────────────────── */}
        {activeTab === "exam-prep" && (
          <div className="space-y-6 animate-fade-in">
            {/* Exam Notes */}
            {content.examNotes && content.examNotes.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-amber-900 uppercase tracking-wider flex items-center gap-2">
                  <span>📝</span>
                  <span>Quick Exam Notes</span>
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 font-medium">
                  {content.examNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Takeaways & Common Mistakes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.keyTakeaways && content.keyTakeaways.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-emerald-200/80 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>✅</span>
                    <span>Key Takeaways</span>
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

            {/* Important Questions */}
            {content.importantQuestions && content.importantQuestions.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-indigo-100 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-indigo-900 uppercase tracking-wider flex items-center gap-2">
                  <span>⭐</span>
                  <span>Important University Questions</span>
                </h3>
                <div className="space-y-3">
                  {content.importantQuestions.map((iq, iIdx) => (
                    <div key={iIdx} className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-black text-slate-900 leading-snug">Q: {iq.question}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-indigo-700 border border-indigo-200 flex-shrink-0">
                          {iq.marks} Marks
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white/80 p-3 rounded-xl border border-indigo-100/60">
                        <strong className="text-indigo-900">Answer:</strong> {iq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PYQs */}
            {content.pyqs && content.pyqs.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-blue-100 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-blue-900 uppercase tracking-wider flex items-center gap-2">
                  <span>📜</span>
                  <span>Previous Year Questions (PYQs)</span>
                </h3>
                <div className="space-y-3">
                  {content.pyqs.map((pyq, iIdx) => (
                    <div key={iIdx} className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-black text-slate-900 leading-snug">Q: {pyq.question}</h4>
                        <div className="flex gap-1 flex-shrink-0">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-blue-700 border border-blue-200">
                            {pyq.year} - {pyq.exam}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white/80 p-3 rounded-xl border border-blue-100/60">
                        <strong className="text-blue-900">Answer:</strong> {pyq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 2: EXAMPLES & DRY RUN ────────────────────────────────────────── */}
        {activeTab === "examples" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>💡</span>
                <span>Step-by-Step Practical Examples</span>
              </h3>

              {content.examples && content.examples.length > 0 && (
                <div className="space-y-4">
                  {content.examples.map((ex, eIdx) => (
                    <div key={eIdx} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="text-xs font-black text-violet-700 uppercase tracking-wider">Example #{eIdx + 1}</div>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">{ex}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {content.dryRunSteps && content.dryRunSteps.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-xs space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>👣</span>
                  <span>Dry Run Steps</span>
                </h3>
                <div className="space-y-4">
                  {content.dryRunSteps.map((step, sIdx) => (
                    <div key={sIdx} className="p-3 rounded-xl bg-sky-50/50 border border-sky-100 text-sm text-slate-800">
                      <strong>Step {sIdx + 1}:</strong> {step}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {content.dryRunTable && content.dryRunTable.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>📊</span>
                  <span>Dry Run State Table</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left text-slate-700 border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-900 font-bold">
                      <tr>
                        <th className="px-4 py-2 border-b border-slate-200">Step</th>
                        <th className="px-4 py-2 border-b border-slate-200">Line</th>
                        <th className="px-4 py-2 border-b border-slate-200">State / Variables</th>
                        <th className="px-4 py-2 border-b border-slate-200">Explanation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.dryRunTable.map((row, rIdx) => (
                        <tr key={rIdx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-2">{row.step}</td>
                          <td className="px-4 py-2 font-mono text-xs">{row.line}</td>
                          <td className="px-4 py-2 font-mono text-xs text-sky-700">{row.state}</td>
                          <td className="px-4 py-2 text-xs">{row.explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: CODE ────────────────────────────────────────────────────────── */}
        {activeTab === "code" && (
          <div className="space-y-6 animate-fade-in">
            <CodePlayground codeExamples={codeMap} />
          </div>
        )}

        {/* ─── TAB 4: VISUALISATION (Only when relevant) ─────────────────────────── */}
        {hasVisualization && activeTab === "visualisation" && (
          <div className="space-y-6 animate-fade-in">
            <SortingVisualizer topicTitle={topic.title} />
          </div>
        )}

        {/* ─── TAB 5: PRACTICE & INTERVIEW ──────────────────────────────────────── */}
        {activeTab === "practice" && (
          <div className="space-y-6 animate-fade-in">
            {content.interviewQuestions && content.interviewQuestions.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-indigo-100 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-indigo-900 uppercase tracking-wider flex items-center gap-2">
                  <span>💼</span>
                  <span>Top Tech & FAANG Interview Questions</span>
                </h3>
                <div className="space-y-3">
                  {content.interviewQuestions.map((iq, iIdx) => (
                    <div key={iIdx} className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-black text-slate-900 leading-snug">Q: {iq.question}</h4>
                        <div className="flex gap-1 flex-shrink-0">
                          {(iq.companyTags || ["Google", "Amazon"]).map((comp, cIdx) => (
                            <span key={cIdx} className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-indigo-700 border border-indigo-200">
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white/80 p-3 rounded-xl border border-indigo-100/60">
                        <strong className="text-indigo-900">Answer:</strong> {iq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {content.codingPractice && content.codingPractice.title && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                  <span>💻</span>
                  <span>Coding Practice: {content.codingPractice.title}</span>
                </h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-sm font-bold text-slate-800">Problem Statement:</p>
                  <p className="text-sm text-slate-700">{content.codingPractice.problemStatement}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto">
                    <p className="font-bold text-sky-400 mb-1">Input:</p>
                    {content.codingPractice.sampleInput}
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto">
                    <p className="font-bold text-emerald-400 mb-1">Output:</p>
                    {content.codingPractice.sampleOutput}
                  </div>
                </div>
                {content.codingPractice.starterCode && (
                  <div>
                     <p className="text-xs font-bold text-slate-600 mb-2">Starter Code:</p>
                     <div className="p-4 rounded-xl bg-slate-900 text-sky-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                       {content.codingPractice.starterCode}
                     </div>
                  </div>
                )}
              </div>
            )}

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
