import React, { useState } from "react";

const INITIAL_UNNORMALIZED = [
  { studentId: 101, studentName: "Aarav Sharma", courseId: "CS501", courseName: "DBMS", instructor: "Dr. Raman", department: "CSE", fee: 12000 },
  { studentId: 101, studentName: "Aarav Sharma", courseId: "CS502", courseName: "OS", instructor: "Prof. Mehra", department: "CSE", fee: 11000 },
  { studentId: 102, studentName: "Priya Patel", courseId: "CS501", courseName: "DBMS", instructor: "Dr. Raman", department: "CSE", fee: 12000 },
  { studentId: 103, studentName: "Rohan Verma", courseId: "CS503", courseName: "CN", instructor: "Dr. Rao", department: "IT", fee: 11500 },
  { studentId: 104, studentName: "Ananya Roy", courseId: "CS502", courseName: "OS", instructor: "Prof. Mehra", department: "CSE", fee: 11000 },
];

const NormalizationVisualizer = () => {
  const [currentStage, setCurrentStage] = useState("unnormalized"); // "unnormalized" | "1nf" | "2nf" | "3nf"
  const [activeAnomaly, setActiveAnomaly] = useState(null); // "insertion" | "deletion" | "update"
  const [stepMode, setStepMode] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    {
      title: "Step 1: Identify Redundancies & Anomalies",
      stage: "unnormalized",
      desc: "Notice how 'Dr. Raman' and 'CSE' are duplicated across multiple rows. If Dr. Raman changes department, all rows must be updated (Update Anomaly).",
    },
    {
      title: "Step 2: Ensure 1NF (Atomic Attributes)",
      stage: "1nf",
      desc: "All attribute values are atomic and single-valued. Primary Key is Composite: (StudentID, CourseID).",
    },
    {
      title: "Step 3: Eliminate Partial Dependency (2NF)",
      stage: "2nf",
      desc: "StudentName depends only on StudentID, not CourseID. CourseName depends only on CourseID. We decompose into separate STUDENT, COURSE, and ENROLLMENT tables.",
    },
    {
      title: "Step 4: Eliminate Transitive Dependency (3NF)",
      stage: "3nf",
      desc: "Department depends on Instructor, which depends on CourseID. We separate INSTRUCTOR into its own table so every non-key attribute depends only on the primary key.",
    },
  ];

  const handleStep = (idx) => {
    setStepIndex(idx);
    setCurrentStage(steps[idx].stage);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-200">
              Interactive Schema Lab
            </span>
            <span className="text-xs font-semibold text-slate-400">DBMS Normalization</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Database Normalization Visualizer
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Step through 1NF, 2NF, and 3NF decomposition to observe anomaly elimination in real-time.
          </p>
        </div>

        {/* Stage Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl flex-wrap">
          {[
            { id: "unnormalized", label: "Unnormalized" },
            { id: "1nf", label: "1NF" },
            { id: "2nf", label: "2NF" },
            { id: "3nf", label: "3NF" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setCurrentStage(tab.id);
                setStepMode(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentStage === tab.id
                  ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Show Me Mode Step Controller */}
      <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setStepMode(!stepMode);
              if (!stepMode) handleStep(0);
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>✨</span>
            <span>{stepMode ? "Exit 'Show Me' Mode" : "Start 'Show Me' Walkthrough"}</span>
          </button>
          <span className="text-xs font-bold text-blue-900">
            {stepMode ? steps[stepIndex].title : "Click to view step-by-step visual walkthrough"}
          </span>
        </div>

        {stepMode && (
          <div className="flex items-center gap-2">
            <button
              disabled={stepIndex === 0}
              onClick={() => handleStep(stepIndex - 1)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="text-xs font-bold text-blue-700">
              {stepIndex + 1} / {steps.length}
            </span>
            <button
              disabled={stepIndex === steps.length - 1}
              onClick={() => handleStep(stepIndex + 1)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {stepMode && (
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 font-medium">
          💡 <strong>What's happening:</strong> {steps[stepIndex].desc}
        </div>
      )}

      {/* Anomaly Testing Filters (Only in Unnormalized / 1NF) */}
      {(currentStage === "unnormalized" || currentStage === "1nf") && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <span>⚠️ Anomaly Simulator (Click to see what breaks):</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveAnomaly(activeAnomaly === "insertion" ? null : "insertion")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                activeAnomaly === "insertion"
                  ? "bg-rose-100 text-rose-800 border-rose-300"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              🔴 Insertion Anomaly
            </button>
            <button
              onClick={() => setActiveAnomaly(activeAnomaly === "deletion" ? null : "deletion")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                activeAnomaly === "deletion"
                  ? "bg-rose-100 text-rose-800 border-rose-300"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              🔴 Deletion Anomaly
            </button>
            <button
              onClick={() => setActiveAnomaly(activeAnomaly === "update" ? null : "update")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                activeAnomaly === "update"
                  ? "bg-rose-100 text-rose-800 border-rose-300"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              🔴 Update Anomaly
            </button>
          </div>

          {activeAnomaly && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 animate-fade-in font-medium leading-relaxed">
              {activeAnomaly === "insertion" && (
                <p>
                  <strong>Insertion Anomaly:</strong> We cannot add a new course (e.g. CS504 "Machine Learning") until at least one student enrolls in it, because <code>StudentID</code> is part of the primary key and cannot be NULL!
                </p>
              )}
              {activeAnomaly === "deletion" && (
                <p>
                  <strong>Deletion Anomaly:</strong> If Rohan Verma (Student 103) cancels his admission and we delete row #4, we accidentally lose all information about course CS503 ("CN") and Instructor "Dr. Rao"!
                </p>
              )}
              {activeAnomaly === "update" && (
                <p>
                  <strong>Update Anomaly:</strong> If Dr. Raman changes his department or room number, we have to search and update multiple rows across the entire database. If one row is missed, data becomes inconsistent!
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Dynamic Tables Rendering based on Stage */}
      {currentStage === "unnormalized" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Single Monolithic Table: <code>STUDENT_COURSE_INFO</code>
            </span>
            <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-100">
              High Redundancy & Anomalies
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">StudentID 🔑</th>
                  <th className="p-3">StudentName</th>
                  <th className="p-3">CourseID 🔑</th>
                  <th className="p-3">CourseName</th>
                  <th className="p-3">Instructor</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {INITIAL_UNNORMALIZED.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      activeAnomaly === "deletion" && row.studentId === 103
                        ? "bg-rose-50 text-rose-900 line-through"
                        : activeAnomaly === "update" && row.instructor === "Dr. Raman"
                        ? "bg-amber-50"
                        : ""
                    }`}
                  >
                    <td className="p-3 font-mono font-bold text-blue-700">{row.studentId}</td>
                    <td className="p-3 font-semibold">{row.studentName}</td>
                    <td className="p-3 font-mono font-bold text-indigo-700">{row.courseId}</td>
                    <td className="p-3 font-medium">{row.courseName}</td>
                    <td className="p-3 font-medium text-slate-800">{row.instructor}</td>
                    <td className="p-3">{row.department}</td>
                    <td className="p-3 font-mono">₹{row.fee.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentStage === "1nf" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              1NF: Atomic Values Only (Composite Key: StudentID + CourseID)
            </span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
              1NF Satisfied, Partial Dependencies Still Exist
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
            <p><strong>Functional Dependencies in 1NF:</strong></p>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-600 font-mono text-[11px]">
              <li>(StudentID, CourseID) → (StudentName, CourseName, Instructor, Dept, Fee) [Full Key]</li>
              <li><span className="text-rose-600 font-bold">StudentID → StudentName</span> (Partial Dependency ⚠️)</li>
              <li><span className="text-rose-600 font-bold">CourseID → (CourseName, Instructor, Dept, Fee)</span> (Partial Dependency ⚠️)</li>
            </ul>
          </div>
        </div>
      )}

      {currentStage === "2nf" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              2NF: Decomposed into 3 Tables (No Partial Dependencies)
            </span>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
              2NF Satisfied
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* STUDENT */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="text-xs font-black text-blue-800 uppercase">STUDENT (StudentID 🔑, Name)</div>
              <table className="w-full text-[11px]">
                <thead><tr className="border-b border-slate-200 text-slate-500"><th className="text-left pb-1">ID</th><th className="text-left pb-1">Name</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  <tr><td className="py-1 font-mono font-bold">101</td><td>Aarav Sharma</td></tr>
                  <tr><td className="py-1 font-mono font-bold">102</td><td>Priya Patel</td></tr>
                  <tr><td className="py-1 font-mono font-bold">103</td><td>Rohan Verma</td></tr>
                  <tr><td className="py-1 font-mono font-bold">104</td><td>Ananya Roy</td></tr>
                </tbody>
              </table>
            </div>

            {/* COURSE */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="text-xs font-black text-indigo-800 uppercase">COURSE (CourseID 🔑, Name, Instructor, Dept)</div>
              <table className="w-full text-[11px]">
                <thead><tr className="border-b border-slate-200 text-slate-500"><th className="text-left pb-1">CID</th><th className="text-left pb-1">Course</th><th className="text-left pb-1">Instructor</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  <tr><td className="py-1 font-mono font-bold">CS501</td><td>DBMS</td><td>Dr. Raman</td></tr>
                  <tr><td className="py-1 font-mono font-bold">CS502</td><td>OS</td><td>Prof. Mehra</td></tr>
                  <tr><td className="py-1 font-mono font-bold">CS503</td><td>CN</td><td>Dr. Rao</td></tr>
                </tbody>
              </table>
            </div>

            {/* ENROLLMENT */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="text-xs font-black text-emerald-800 uppercase">ENROLLMENT (StudentID 🔑, CourseID 🔑)</div>
              <table className="w-full text-[11px]">
                <thead><tr className="border-b border-slate-200 text-slate-500"><th className="text-left pb-1">SID</th><th className="text-left pb-1">CID</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  <tr><td className="py-1 font-mono">101</td><td className="font-mono">CS501</td></tr>
                  <tr><td className="py-1 font-mono">101</td><td className="font-mono">CS502</td></tr>
                  <tr><td className="py-1 font-mono">102</td><td className="font-mono">CS501</td></tr>
                  <tr><td className="py-1 font-mono">103</td><td className="font-mono">CS503</td></tr>
                  <tr><td className="py-1 font-mono">104</td><td className="font-mono">CS502</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {currentStage === "3nf" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              3NF: Clean Normalized Relational Architecture
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
              ✓ 3NF Golden State: Zero Anomalies & Minimal Storage
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-1.5">
              <div className="text-xs font-black text-emerald-800">1. STUDENT</div>
              <p className="text-[11px] text-slate-500">StudentID (PK), Name</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-1.5">
              <div className="text-xs font-black text-emerald-800">2. COURSE</div>
              <p className="text-[11px] text-slate-500">CourseID (PK), CourseName, Fee, InstructorID (FK)</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-1.5">
              <div className="text-xs font-black text-emerald-800">3. INSTRUCTOR</div>
              <p className="text-[11px] text-slate-500">InstructorID (PK), Name, Department</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-1.5">
              <div className="text-xs font-black text-emerald-800">4. ENROLLMENT</div>
              <p className="text-[11px] text-slate-500">StudentID (PK, FK), CourseID (PK, FK)</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <p className="font-bold">🎉 Mastery Achievement:</p>
            <p className="text-[11px] leading-relaxed">
              Every non-key attribute now depends directly on the primary key, the whole key, and nothing but the key. Lossless Join and Dependency Preservation are both satisfied!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NormalizationVisualizer;
