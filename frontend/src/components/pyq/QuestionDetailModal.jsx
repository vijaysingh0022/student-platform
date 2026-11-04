import React, { useState } from "react";
import { generatePYQAnswer, generatePYQSimilarPractice } from "../../services/api.js";

export const QuestionDetailModal = ({ question, isOpen, onClose, onUpdateStatus }) => {
  const [selectedMarks, setSelectedMarks] = useState(question?.marks || 5);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [answerData, setAnswerData] = useState(null);
  const [similarPractice, setSimilarPractice] = useState(null);
  const [loadingPractice, setLoadingPractice] = useState(false);
  const [activeTab, setActiveTab] = useState("exam_answer"); // "exam_answer" | "practice" | "metadata"

  if (!isOpen || !question) return null;

  const handleFetchAnswer = async (marks = selectedMarks) => {
    setSelectedMarks(marks);
    setLoadingAnswer(true);
    try {
      const res = await generatePYQAnswer(question._id, { marks });
      if (res.data?.success) {
        setAnswerData(res.data.answer);
      }
    } catch (err) {
      console.error("Failed to generate answer:", err);
    } finally {
      setLoadingAnswer(false);
    }
  };

  const handleGeneratePractice = async () => {
    setLoadingPractice(true);
    try {
      const res = await generatePYQSimilarPractice(question._id);
      if (res.data?.success) {
        setSimilarPractice(res.data);
      }
    } catch (err) {
      console.error("Failed to generate practice:", err);
    } finally {
      setLoadingPractice(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100">
                {question.questionNumber}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                Unit {question.unitNumber}: {question.unitName || question.topicTitle}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                {question.marks} Marks
              </span>
              {question.isRepeated && (
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span>🔥</span> Repeated ({question.repeatCount}x)
                </span>
              )}
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
              {question.questionText}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Source: {question.paperTitle} • Session: {question.examSession} ({question.academicYear})
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center px-6 border-b border-slate-100 bg-white gap-2 pt-2">
          <button
            onClick={() => setActiveTab("exam_answer")}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "exam_answer"
                ? "border-indigo-600 text-indigo-700 font-black"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>✍️</span> AI Answer Studio
          </button>
          <button
            onClick={() => {
              setActiveTab("practice");
              if (!similarPractice) handleGeneratePractice();
            }}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "practice"
                ? "border-indigo-600 text-indigo-700 font-black"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>🎯</span> AI Generated Practice (3)
          </button>
          <button
            onClick={() => setActiveTab("metadata")}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "metadata"
                ? "border-indigo-600 text-indigo-700 font-black"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>📊</span> Historical Appearances & Mapping
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/30">
          {/* TAB 1: AI EXAM-ORIENTED ANSWER */}
          {activeTab === "exam_answer" && (
            <div className="space-y-4">
              {/* Answer Length selector */}
              <div className="flex items-center justify-between flex-wrap gap-2 p-3 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
                <div>
                  <p className="text-xs font-black text-slate-800">Target Marking Scheme</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Answer calibrated for university exam scoring criteria
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {[2, 5, 7, 10].map((m) => (
                    <button
                      key={m}
                      onClick={() => handleFetchAnswer(m)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                        selectedMarks === m
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {m} Marks
                    </button>
                  ))}
                  <button
                    onClick={() => handleFetchAnswer(selectedMarks)}
                    disabled={loadingAnswer}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-all flex items-center gap-1"
                  >
                    <span>🔄</span> Regenerate
                  </button>
                </div>
              </div>

              {/* Answer Content */}
              {loadingAnswer ? (
                <div className="py-12 text-center space-y-3">
                  <span className="text-2xl animate-spin inline-block">⏳</span>
                  <p className="text-xs font-bold text-slate-600">
                    Generating academic university solution for {selectedMarks} marks...
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Formatting definitions, derivations, formulas, and structural outline.
                  </p>
                </div>
              ) : answerData ? (
                <div className="space-y-4 animate-fadeIn">
                  {/* Intuition Box */}
                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                    <p className="text-[11px] font-black text-indigo-900 uppercase tracking-wider mb-1">
                      💡 Intuitive Understanding (Simple Language)
                    </p>
                    <p className="text-xs text-indigo-950 leading-relaxed font-medium">
                      {answerData.simpleExplanation}
                    </p>
                  </div>

                  {/* Main Exam Answer Markdown */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <p className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        📝 University Scoring Structure ({selectedMarks} Marks)
                      </p>
                      <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded">
                        {answerData.expectedStructure}
                      </span>
                    </div>

                    <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-normal space-y-2">
                      {answerData.examOrientedAnswer}
                    </div>

                    {/* Step-by-Step Points */}
                    {answerData.stepByStepSolution && answerData.stepByStepSolution.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 space-y-1.5">
                        <p className="text-[11px] font-black text-slate-800 uppercase tracking-wide">
                          Step-by-Step Solution Breakdown:
                        </p>
                        <ol className="list-decimal pl-4 text-xs text-slate-700 space-y-1">
                          {answerData.stepByStepSolution.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Formulas / Numerical if present */}
                    {answerData.relevantFormulas && answerData.relevantFormulas.length > 0 && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <p className="text-[10px] font-black text-slate-600 uppercase mb-1">
                          Key Formulas / Boundary Constraints:
                        </p>
                        <div className="font-mono text-indigo-700 font-bold">
                          {answerData.relevantFormulas.join(" • ")}
                        </div>
                      </div>
                    )}

                    {/* Key points to remember */}
                    {answerData.keyPointsToRemember && (
                      <div className="pt-2 text-[11px] text-slate-500 font-medium">
                        <span className="font-bold text-slate-700">Exam Tip: </span>
                        {answerData.keyPointsToRemember.join(" • ")}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center p-8 bg-white rounded-2xl border border-slate-200">
                  <div className="text-3xl mb-2">📖</div>
                  <p className="text-xs font-bold text-slate-700">
                    Ready to generate university standard answers for this question
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                    Click below to generate academic explanations, step-by-step steps, and diagrams tailored for {selectedMarks} marks.
                  </p>
                  <button
                    onClick={() => handleFetchAnswer(selectedMarks)}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
                  >
                    Generate {selectedMarks}-Mark Answer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI SIMILAR PRACTICE */}
          {activeTab === "practice" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <p className="text-xs font-black text-slate-900">
                  Similar Practice Questions (Clearly Distinguishable from Real PYQs)
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Conceptually identical variants generated by AI to test your deep understanding under altered parameters.
                </p>
              </div>

              {loadingPractice ? (
                <div className="py-10 text-center space-y-2">
                  <span className="text-2xl animate-spin inline-block">⏳</span>
                  <p className="text-xs font-bold text-slate-600">Generating similar practice variants...</p>
                </div>
              ) : similarPractice?.practiceQuestions ? (
                <div className="space-y-3">
                  {similarPractice.practiceQuestions.map((pq, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2 hover:border-indigo-200 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                          AI Generated Practice #{idx + 1}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          Target: {pq.marks} Marks • {pq.difficulty}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 leading-snug">{pq.text}</p>
                      <p className="text-[10px] text-slate-400 italic">
                        Objective: {pq.learningObjective}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 3: HISTORICAL & REPEATED DETAILS */}
          {activeTab === "metadata" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Syllabus Mapping Evidence
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Mapped Unit</p>
                    <p className="font-bold text-slate-800">Unit {question.unitNumber}: {question.unitName}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Mapped Topic</p>
                    <p className="font-bold text-slate-800">{question.topicTitle}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Confidence & Status</p>
                    <p className="font-bold text-slate-800">
                      {Math.round(question.mappingConfidence * 100)}% ({question.verificationStatus})
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Priority Rating</p>
                    <p className="font-bold text-indigo-700">{question.priorityLevel} (Score: {question.priorityScore})</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 bg-indigo-50/40 p-2.5 rounded-xl border border-indigo-100/60">
                  <span className="font-bold text-indigo-900">Evidence: </span>
                  {question.mappingEvidence}
                </p>
              </div>

              {/* Similar Historical Appearances */}
              {question.similarQuestionReferences && question.similarQuestionReferences.length > 0 && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Past Examination Appearances ({question.similarQuestionReferences.length})
                  </h4>
                  <div className="space-y-1.5">
                    {question.similarQuestionReferences.map((ref, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">📅</span>
                          <span className="font-bold text-slate-800">Year {ref.year}</span>
                          <span className="text-slate-400">• Q# {ref.questionNumber}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-indigo-700 border border-slate-200">
                          {ref.similarityType} ({Math.round(ref.similarityScore * 100)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer: Preparation Status Picker */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Preparation Status:</span>
            {["Not Started", "Learning", "Revised", "Confident"].map((status) => (
              <button
                key={status}
                onClick={() => onUpdateStatus && onUpdateStatus(question._id, status)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                  question.studyStatus === status
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailModal;

