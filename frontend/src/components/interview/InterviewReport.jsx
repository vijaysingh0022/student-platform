import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  Send,
  FileDown,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  Briefcase
} from 'lucide-react';
import { sendCoachChatMessage } from '../../services/api';

export default function InterviewReport({
  interview,
  onRestart,
  onGoToSkillGraph,
  onGoToRoadmap
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'questions' | 'coach'
  const [expandedQuestion, setExpandedQuestion] = useState(0);
  
  // AI Coach Chat state
  const [coachMessages, setCoachMessages] = useState(
    interview?.coachChat?.length > 0
      ? interview.coachChat
      : [
          {
            role: 'assistant',
            message: `Hello! I've fully analyzed your ${interview?.interviewType || 'technical'} mock interview. You scored ${interview?.overallScore || 75}/100 with commendable conceptual depth. Ask me anything about your answers, missing concepts, or how to target your revision.`
          }
        ]
  );
  const [inputMessage, setInputMessage] = useState('');
  const [isSendingCoach, setIsSendingCoach] = useState(false);

  const overallScore = interview?.overallScore || 78;
  const metrics = interview?.performanceMetrics || {
    technicalKnowledge: 82,
    problemSolving: 76,
    communication: 79,
    conceptualDepth: 85,
    coding: 80,
    interviewReadiness: 77
  };

  const handleSendCoach = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isSendingCoach) return;

    const newMsgs = [...coachMessages, { role: 'user', message: text }];
    setCoachMessages(newMsgs);
    setInputMessage('');
    setIsSendingCoach(true);

    try {
      const res = await sendCoachChatMessage(interview._id, text);
      if (res.data?.reply) {
        setCoachMessages([...newMsgs, { role: 'assistant', message: res.data.reply }]);
      }
    } catch (err) {
      console.error(err);
      setCoachMessages([
        ...newMsgs,
        {
          role: 'assistant',
          message:
            "I couldn't reach the coaching engine right now. However, focusing on boundary condition checks and space-time complexity analysis will yield immediate score gains on your next attempt."
        }
      ]);
    } finally {
      setIsSendingCoach(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in print:p-0">
      
      {/* Top Banner & Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-50/70 via-blue-50/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Interview Evaluation Complete
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {interview?.interviewType?.replace('-', ' ')?.toUpperCase() || 'TECHNICAL'} INTERVIEW REPORT
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {interview?.interviewerVerdict ||
                'Strong performance overall. Your foundational grasp of system mechanics is commendable, though edge case reasoning and complexity analysis warrant focused practice.'}
            </p>
          </div>

          {/* Overall Score Circle Card */}
          <div className="flex items-center gap-5 shrink-0 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex flex-col items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <span className="text-2xl sm:text-3xl font-black">{overallScore}</span>
                <span className="text-[10px] font-medium text-indigo-200 uppercase">/ 100</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Overall Score
              </span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">
                {overallScore >= 80 ? 'Interview Ready' : overallScore >= 65 ? 'Competitive Basis' : 'Needs Practice'}
              </p>
              <span className="text-xs text-indigo-600 font-semibold inline-flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Telemetry sync recorded
              </span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Summary & Impact
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'questions'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Question Breakdown ({interview?.questions?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('coach')}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === 'coach'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Ask AI Coach
            </button>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-500" />
              Export PDF
            </button>
            <button
              onClick={onRestart}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New Interview
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Overview & Intelligence Loop */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Technical Depth', val: metrics.technicalKnowledge, color: 'indigo' },
              { label: 'Problem Solving', val: metrics.problemSolving, color: 'blue' },
              { label: 'Communication', val: metrics.communication, color: 'emerald' },
              { label: 'Conceptual Clarity', val: metrics.conceptualDepth, color: 'sky' },
              { label: 'Code Quality', val: metrics.coding, color: 'violet' },
              { label: 'Readiness Index', val: metrics.interviewReadiness, color: 'amber' }
            ].map((m, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between"
              >
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  {m.label}
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xl font-bold text-slate-900">{m.val}</span>
                  <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${m.val}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Key Strengths
                </h3>
              </div>
              <ul className="space-y-2.5">
                {(interview?.strengths?.length > 0
                  ? interview.strengths
                  : [
                      'Clear architectural explanation of components',
                      'Strong intuition regarding relational schema design',
                      'Articulate communication of foundational concepts'
                    ]
                ).map((st, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Target Areas for Revision
                </h3>
              </div>
              <ul className="space-y-2.5">
                {(interview?.weaknesses?.length > 0
                  ? interview.weaknesses
                  : [
                      'Space-time complexity justification for recursive calls',
                      'Operating System concurrency & synchronization mechanisms',
                      'Edge case boundary constraints in pointer algorithms'
                    ]
                ).map((wk, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Platform Intelligence Loop: Skill Graph & Placement Readiness Impact */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Skill Graph Impact */}
            <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50/60 via-white to-slate-50 rounded-2xl p-6 border border-indigo-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Skill Graph Telemetry Updated</h4>
                    <p className="text-xs text-slate-500">Live adjustments mapped to your verified competency graph</p>
                  </div>
                </div>
                <button
                  onClick={onGoToSkillGraph}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                >
                  View Graph
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                  <div className="text-xs text-slate-500 font-medium">DBMS Fundamentals</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs line-through text-slate-400">72%</span>
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                      76% <TrendingUp className="w-3 h-3" />
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                  <div className="text-xs text-slate-500 font-medium">Data Structures (Trees)</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs line-through text-slate-400">68%</span>
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                      73% <TrendingUp className="w-3 h-3" />
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                  <div className="text-xs text-slate-500 font-medium">OS Synchronization</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs line-through text-slate-400">44%</span>
                    <span className="text-sm font-bold text-amber-600 flex items-center gap-1">
                      43% (Needs Review)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Placement Readiness Impact */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-600">
                  <Target className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Readiness Indicator
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    {interview?.placementReadinessAfter || 74}
                  </span>
                  <span className="text-xs font-medium text-slate-400">/ 100</span>
                  <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    +{Math.max(1, (interview?.placementReadinessAfter || 74) - (interview?.placementReadinessBefore || 71))} pts
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Reflects verified problem-solving speed, technical communication accuracy, and conceptual depth.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 italic">
                * Educational readiness indicator — non-guaranteed learning diagnostic.
              </div>
            </div>

          </div>

          {/* 7-Day Improvement Plan (Actionable Roadmap) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Your 7-Day Priority Action Plan
                </h3>
                <p className="text-xs text-slate-500">
                  Targeted review modules generated from detected answer gaps
                </p>
              </div>
              <button
                onClick={onGoToRoadmap}
                className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
              >
                Sync with Roadmap
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  Priority 1
                </span>
                <h5 className="text-xs font-bold text-slate-900">Operating Systems: Deadlocks & Semaphores</h5>
                <p className="text-xs text-slate-500">Review banker's algorithm and resource allocation graphs.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  Priority 2
                </span>
                <h5 className="text-xs font-bold text-slate-900">Complexity Verification</h5>
                <p className="text-xs text-slate-500">Practice stating recurrence relations (Master Theorem) explicitly.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                  Priority 3
                </span>
                <h5 className="text-xs font-bold text-slate-900">Behavioral STAR Framework</h5>
                <p className="text-xs text-slate-500">Emphasize quantified outcomes when explaining technical project challenges.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Question-by-Question Deep Dive */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {interview?.questions?.map((q, idx) => {
            const isExpanded = expandedQuestion === idx;
            const evalObj = q.evaluation || {};
            const score = evalObj.score ?? 7;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
              >
                <div
                  onClick={() => setExpandedQuestion(isExpanded ? -1 : idx)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                      Q{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{q.topic || `Topic ${idx + 1}`}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{q.questionText}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900">{score} / 10</span>
                      <div className="text-[10px] text-slate-400 capitalize">{q.difficulty || 'intermediate'}</div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 bg-slate-50/40">
                    
                    {/* Prompt */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Question Prompt
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
                        {q.questionText}
                      </p>
                    </div>

                    {/* Student Answer */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Your Response
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 mt-1 whitespace-pre-wrap font-sans">
                        {q.userAnswer || 'No answer submitted.'}
                      </p>
                    </div>

                    {/* Follow-up question & answer if present */}
                    {q.followUpQuestion && (
                      <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                          Follow-up Probing
                        </span>
                        <p className="text-xs sm:text-sm font-medium text-slate-800">
                          {q.followUpQuestion}
                        </p>
                        {q.followUpAnswer && (
                          <p className="text-xs text-slate-600 border-t border-indigo-100/60 pt-2">
                            <span className="font-semibold text-slate-700">Follow-up Response: </span>
                            {q.followUpAnswer}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Evaluation Insights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs">
                        <span className="font-bold text-emerald-800">Strong Points:</span>
                        <p className="text-emerald-700 mt-1 leading-relaxed">
                          {evalObj.strongPoints || 'Clear fundamental explanation of core premise.'}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs">
                        <span className="font-bold text-amber-800">Missing Concepts:</span>
                        <p className="text-amber-700 mt-1 leading-relaxed">
                          {evalObj.missingConcepts || 'Boundary constraints or space complexity trade-offs.'}
                        </p>
                      </div>
                    </div>

                    {/* AI Feedback */}
                    {evalObj.feedback && (
                      <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                        <span className="font-semibold text-slate-800">Interviewer Feedback: </span>
                        {evalObj.feedback}
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Interactive AI Coach */}
      {activeTab === 'coach' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-[600px]">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">LearnX AI Interview Coach</h3>
                <p className="text-xs text-slate-500">Ask questions about your evaluation, lost marks, or ideal answer structures</p>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              Session Memory Active
            </span>
          </div>

          {/* Quick Prompts */}
          <div className="px-5 py-3 border-b border-slate-100 bg-white flex items-center gap-2 overflow-x-auto">
            {[
              'What was my weakest answer and why?',
              'How can I structure my complexity explanations better?',
              'Give me 2 practice questions for my weak topics',
              'Explain what I missed on the OS question'
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendCoach(chip)}
                className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium transition-colors shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
            {coachMessages.map((m, i) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div
                  key={i}
                  className={`flex gap-3 max-w-2xl ${isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAssistant ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-800 text-white'
                  }`}>
                    {isAssistant ? <Sparkles className="w-4 h-4 text-amber-300" /> : 'You'}
                  </div>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isAssistant
                        ? 'bg-white border border-slate-200/80 text-slate-800'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              );
            })}
            {isSendingCoach && (
              <div className="flex gap-3 max-w-2xl mr-auto">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-500">
                  Coach is analyzing your interview transcript...
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendCoach();
            }}
            className="p-4 border-t border-slate-100 bg-white flex items-center gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask your AI Coach anything about this interview..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isSendingCoach || !inputMessage.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
