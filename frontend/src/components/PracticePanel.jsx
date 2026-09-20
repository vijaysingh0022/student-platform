import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function PracticePanel({ topicId, subjectId, questions = [] }) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [diffFilter, setDiffFilter] = useState("all");

  const filterTypes = [
    { id: "all", label: "All Questions" },
    { id: "mcq", label: "MCQ" },
    { id: "conceptual", label: "Conceptual" },
    { id: "output", label: "Output Based" },
    { id: "coding", label: "Coding" },
  ];

  const filterDiffs = [
    { id: "all", label: "All Difficulties" },
    { id: "easy", label: "Easy" },
    { id: "medium", label: "Medium" },
    { id: "hard", label: "Hard" },
  ];

  const samplePractice = [
    {
      _id: "p1",
      questionText: "What is the worst-case time complexity of Quick Sort, and when does it occur?",
      type: "mcq",
      difficulty: "medium",
      options: ["O(n log n) when pivot is median", "O(n²) when array is already sorted and pivot is extreme", "O(n) always", "O(log n) worst case"],
      explanation: "Quick sort degenerates to O(n²) when partition splits elements into 0 and n-1 elements each time, typical with sorted input and first/last element pivot.",
    },
    {
      _id: "p2",
      questionText: "Which partitioning scheme generally performs fewer swaps on average: Lomuto or Hoare?",
      type: "conceptual",
      difficulty: "easy",
      options: ["Lomuto Partitioning", "Hoare Partitioning", "Both require identical swaps", "Neither uses swaps"],
      explanation: "Hoare's scheme performs 3x fewer swaps on average than Lomuto's scheme because it works from both ends towards the center.",
    },
    {
      _id: "p3",
      questionText: "Given arr = [4, 1, 3, 9, 7], what is the array after first Lomuto partition with pivot = 7?",
      type: "output",
      difficulty: "hard",
      options: ["[4, 1, 3, 7, 9]", "[1, 3, 4, 7, 9]", "[4, 1, 3, 9, 7]", "[7, 4, 1, 3, 9]"],
      explanation: "Elements less than 7 ([4, 1, 3]) are placed left, pivot 7 is placed at index 3, and 9 stays at index 4.",
    },
  ];

  const qList = questions.length > 0 ? questions : samplePractice;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      {/* Header & Launch Quiz CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>📝</span>
            <span>Practice & Diagnostic Assessment</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Test your conceptual grasp with topic-specific questions mapped to diagnostic subtopics.
          </p>
        </div>

        <Link
          to={`/quiz/${subjectId}/${topicId}`}
          className="btn-gradient px-5 py-2.5 rounded-2xl text-xs font-black text-white shadow-md hover:scale-105 transition-all text-center"
        >
          <span>🎯 Launch Full Diagnostic Quiz (10 Qs)</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
        {/* Question Type Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 mr-1">Type:</span>
          {filterTypes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTypeFilter(tf.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                typeFilter === tf.id
                  ? "bg-violet-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 mr-1">Difficulty:</span>
          {filterDiffs.map((df) => (
            <button
              key={df.id}
              onClick={() => setDiffFilter(df.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                diffFilter === df.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {df.label}
            </button>
          ))}
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {qList.map((q, idx) => (
          <div key={q._id || idx} className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-100 text-violet-800 border border-violet-200">
                  {q.type || "MCQ"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    q.difficulty === "easy"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : q.difficulty === "hard"
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {q.difficulty || "medium"}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-400">Q{idx + 1}</span>
            </div>

            <h4 className="text-sm sm:text-base font-black text-slate-900 leading-relaxed">
              {q.questionText}
            </h4>

            {/* Options */}
            {q.options && q.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 font-medium text-slate-700">
                    <span className="font-bold mr-1.5 text-violet-700">{String.fromCharCode(65 + oIdx)}.</span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Explanation Note */}
            {q.explanation && (
              <div className="p-3 rounded-xl bg-violet-50/60 border border-violet-100 text-xs text-slate-700 leading-relaxed">
                <strong className="text-violet-800 block mb-0.5">💡 Conceptual Insight:</strong>
                {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
