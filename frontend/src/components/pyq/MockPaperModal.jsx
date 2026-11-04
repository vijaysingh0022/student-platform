import React, { useState } from "react";
import { generatePYQMockPaper } from "../../services/api.js";

export const MockPaperModal = ({ isOpen, onClose, defaultSubject = "dsa" }) => {
  const [subjectId, setSubjectId] = useState(defaultSubject);
  const [selectedUnits, setSelectedUnits] = useState([1, 2, 3, 4, 5]);
  const [difficulty, setDifficulty] = useState("Standard University");
  const [generating, setGenerating] = useState(false);
  const [mockPaperResult, setMockPaperResult] = useState(null);

  if (!isOpen) return null;

  const toggleUnit = (u) => {
    setSelectedUnits((prev) =>
      prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u].sort()
    );
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await generatePYQMockPaper({
        subjectId,
        selectedUnits,
        difficulty,
        totalMarks: 100,
        durationMinutes: 180,
      });
      if (res.data?.success) {
        setMockPaperResult(res.data.mockPaper);
      }
    } catch (err) {
      console.error("Mock generation error:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-base font-black text-slate-900 leading-snug">
              University Mock Paper Generator
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Calibrated strictly on real AKTU / university paper blueprints and extracted PYQs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!mockPaperResult ? (
            <div className="space-y-5">
              {/* Blueprint Overview Banner */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
                <span className="text-2xl">📋</span>
                <div className="text-xs space-y-1 text-indigo-950">
                  <p className="font-black uppercase tracking-wider text-[11px] text-indigo-900">
                    Standard University Blueprint Calibration (100 Marks • 3 Hours)
                  </p>
                  <p className="font-normal text-slate-600">
                    • <strong>Section A (20 Marks)</strong>: 10 compulsory questions (2 Marks each) from all 5 units.<br />
                    • <strong>Section B (30 Marks)</strong>: 5 comprehensive questions (Attempt any 3, 10 Marks each).<br />
                    • <strong>Section C (50 Marks)</strong>: 5 Unit Modules with (a) OR (b) internal choices (10 Marks each).
                  </p>
                </div>
              </div>

              {/* Unit Selection */}
              <div>
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 block">
                  Select Units for Mock Paper
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((u) => {
                    const isChecked = selectedUnits.includes(u);
                    return (
                      <button
                        key={u}
                        type="button"
                        onClick={() => toggleUnit(u)}
                        className={`py-3 rounded-2xl border text-xs font-black transition-all flex flex-col items-center justify-center gap-1 ${
                          isChecked
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span>Unit {u}</span>
                        <span className="text-[10px] font-normal opacity-90">
                          {isChecked ? "Included" : "Excluded"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Mode */}
              <div>
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 block">
                  Difficulty Level Calibration
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "Standard University", desc: "Exact past year pattern distribution" },
                    { id: "Challenging", desc: "Prioritizes high-mark numericals and derivations" },
                    { id: "High-Scoring", desc: "Prioritizes highest frequency repeating questions" },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDifficulty(d.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        difficulty === d.id
                          ? "bg-indigo-50/70 border-indigo-400 text-indigo-950 shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <p className="text-xs font-black">{d.id}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{d.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={generating || selectedUnits.length === 0}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  {generating ? (
                    <>
                      <span className="animate-spin inline-block">⏳</span>
                      <span>Generating Full University Paper...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Generate Full Mock Examination Paper</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Generated Mock Paper View */
            <div className="space-y-6 animate-fadeIn">
              {/* Paper Header / University Sheet Title */}
              <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  {mockPaperResult.university}
                </p>
                <h4 className="text-base font-black text-slate-900">
                  {mockPaperResult.title}
                </h4>
                <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-600 pt-1">
                  <span>Semester: {mockPaperResult.semester}</span>
                  <span>•</span>
                  <span>Time: {mockPaperResult.durationMinutes / 60} Hours</span>
                  <span>•</span>
                  <span>Max Marks: {mockPaperResult.totalMarks}</span>
                </div>
              </div>

              {/* Sections */}
              {mockPaperResult.sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3"
                >
                  <div className="border-b border-slate-100 pb-2">
                    <h5 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                      {sec.name}
                    </h5>
                    <p className="text-[11px] text-slate-500">{sec.instructions}</p>
                  </div>

                  <div className="space-y-2.5">
                    {sec.questions.map((q, qIdx) => (
                      <div
                        key={qIdx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-indigo-700">{q.questionNumber}</span>
                            <span className="text-[10px] text-slate-400">Unit {q.unitNumber}</span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                q.sourceType === "Original PYQ"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-purple-50 text-purple-700 border border-purple-200"
                              }`}
                            >
                              {q.sourceType} {q.originalPaperYear ? `(${q.originalPaperYear})` : ""}
                            </span>
                          </div>
                          <p className="text-slate-800 font-medium leading-relaxed">{q.questionText}</p>
                        </div>
                        <span className="font-black text-slate-900 shrink-0">[{q.marks}]</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setMockPaperResult(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  ← Configure New Paper
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>🖨</span> Print / Save PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockPaperModal;
