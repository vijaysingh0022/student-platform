import React, { useState, useEffect } from "react";
import { offlineDB } from "../../services/indexedDBService.js";

const OfflineQuickToolsModal = ({ isOpen, onClose, initialTab = "notes" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [notes, setNotes] = useState([]);
  const [cheatSheets, setCheatSheets] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [practiceAnswers, setPracticeAnswers] = useState({});

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      const [n, cs, q] = await Promise.all([
        offlineDB.getNotes(),
        offlineDB.getCheatSheets(),
        offlineDB.getQuestions(),
      ]);
      setNotes(n || []);
      setCheatSheets(cs || []);
      setQuestions(q || []);
      if (n && n.length > 0) setSelectedNote(n[0]);
      if (cs && cs.length > 0) setSelectedSheet(cs[0]);
    };

    loadData();
  }, [isOpen]);

  if (!isOpen) return null;

  const TABS = [
    { id: "notes", label: "Notes", icon: "📄", count: notes.length },
    { id: "practice", label: "Practice", icon: "🎯", count: questions.length },
    { id: "pyqs", label: "PYQs", icon: "📑", count: "48+" },
    { id: "cheatsheets", label: "Cheat Sheets", icon: "⚡", count: cheatSheets.length },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-600 text-white text-base">📁</span>
            <div>
              <h3 className="text-base font-bold text-white">Quick Offline Revision Tools</h3>
              <p className="text-xs text-slate-400">100% Offline Access • Zero Data Consumption</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-3 bg-slate-50 border-b border-slate-200 flex gap-2 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
                  isActive
                    ? "bg-white text-blue-600 border-blue-600 shadow-sm"
                    : "text-slate-600 border-transparent hover:text-slate-900"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    isActive ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {/* TAB 1: NOTES */}
          {activeTab === "notes" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
              {/* Note List */}
              <div className="space-y-2 border-r border-slate-100 pr-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                  Downloaded Notes
                </h4>
                {notes.map((note) => {
                  const isSel = selectedNote?.id === note.id;
                  return (
                    <button
                      key={note.id}
                      onClick={() => setSelectedNote(note)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                        isSel
                          ? "bg-blue-50/80 border-blue-500 text-blue-900 font-bold shadow-sm"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-bold">
                          {note.subjectCode}
                        </span>
                        <span className="text-[10px] text-slate-400">{note.readTime}</span>
                      </div>
                      <div className="line-clamp-2 leading-relaxed">{note.title}</div>
                    </button>
                  );
                })}
              </div>

              {/* Note Viewer */}
              <div className="md:col-span-2 overflow-y-auto pr-2">
                {selectedNote ? (
                  <div className="space-y-4">
                    <div className="border-b border-slate-200 pb-3">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
                        {selectedNote.subjectCode} • {selectedNote.unit}
                      </span>
                      <h2 className="text-lg font-black text-slate-900 mt-2">
                        {selectedNote.title}
                      </h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-slate-800 whitespace-pre-wrap leading-relaxed text-xs">
                      {selectedNote.content}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">Select a note to read.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRACTICE */}
          {activeTab === "practice" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700">
                  {questions.length} Offline Practice Questions
                </span>
                <span className="text-xs text-slate-500">Instant answers & explanations</span>
              </div>
              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const revealed = practiceAnswers[q.id];
                  return (
                    <div
                      key={q.id || idx}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-blue-600">
                          {q.subjectCode} • {q.unit}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-semibold text-[11px]">
                          {q.difficulty}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 leading-snug">
                        {idx + 1}. {q.questionText}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options?.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                              revealed && optIdx === q.correctAnswerIndex
                                ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold"
                                : "bg-white border-slate-200 text-slate-700"
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() =>
                            setPracticeAnswers((prev) => ({
                              ...prev,
                              [q.id]: !prev[q.id],
                            }))
                          }
                          className="text-xs font-bold text-blue-600 hover:text-blue-800"
                        >
                          {revealed ? "Hide Explanation" : "Reveal Answer & Explanation"}
                        </button>
                      </div>

                      {revealed && q.explanation && (
                        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-950 text-xs border border-emerald-200 leading-relaxed animate-fade-in">
                          <strong>Correct: {q.options[q.correctAnswerIndex]}</strong>
                          <p className="mt-1 text-slate-700">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PYQS */}
          {activeTab === "pyqs" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-3">
                <span className="text-xl">📑</span>
                <div>
                  <div className="font-bold">Offline Previous Year Exam Questions</div>
                  <div className="text-amber-800">
                    Compiled from major university exams (Semester 3 to 6) and top placement exams.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { subject: "Data Structures & Algorithms", year: "2024 End-Sem", qCount: 14, tag: "Trees, Graphs & DP" },
                  { subject: "Database Management Systems", year: "2024 End-Sem", qCount: 12, tag: "BCNF, Transactions & SQL" },
                  { subject: "Operating Systems", year: "2023 End-Sem", qCount: 10, tag: "Deadlocks & Virtual Memory" },
                  { subject: "Computer Networks", year: "2023 End-Sem", qCount: 12, tag: "Subnetting, TCP/IP & OSI" },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-black text-slate-900">{item.subject}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                        {item.year}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">{item.tag}</div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-600 font-semibold">{item.qCount} Questions</span>
                      <button
                        onClick={() => setActiveTab("practice")}
                        className="font-bold text-blue-600 hover:text-blue-800"
                      >
                        Solve Offline →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CHEAT SHEETS */}
          {activeTab === "cheatsheets" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
              <div className="space-y-2 border-r border-slate-100 pr-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                  Subjects
                </h4>
                {cheatSheets.map((cs) => {
                  const isSel = selectedSheet?.subjectCode === cs.subjectCode;
                  return (
                    <button
                      key={cs.subjectCode}
                      onClick={() => setSelectedSheet(cs)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all ${
                        isSel
                          ? "bg-blue-50/80 border-blue-500 text-blue-900 shadow-sm"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>⚡</span>
                        <span>{cs.subjectCode} Revision</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="md:col-span-3 overflow-y-auto pr-2 space-y-4">
                {selectedSheet ? (
                  <div>
                    <h3 className="text-base font-black text-slate-900 mb-4">
                      {selectedSheet.title}
                    </h3>
                    <div className="space-y-4">
                      {selectedSheet.sections?.map((sec, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5"
                        >
                          <div className="text-xs font-extrabold text-blue-700 uppercase tracking-wide">
                            {sec.heading}
                          </div>
                          <div className="text-xs text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
                            {sec.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">Select a cheat sheet.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>✓ Stored locally in device memory</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfflineQuickToolsModal;
