import React, { useState } from "react";

const SAMPLE_RELATIONS = {
  student: {
    name: "STUDENT_RECORD (RollNo, Name, Department, HOD)",
    pk: ["RollNo"],
    attributes: ["RollNo", "Name", "Department", "HOD"],
    fds: [
      { lhs: "RollNo", rhs: "Name", type: "Full Dependency (Key)" },
      { lhs: "RollNo", rhs: "Department", type: "Full Dependency (Key)" },
      { lhs: "Department", rhs: "HOD", type: "Transitive Dependency (Non-Key)" },
    ],
    rows: [
      { RollNo: 101, Name: "Aarav", Department: "CSE", HOD: "Dr. Raman" },
      { RollNo: 102, Name: "Priya", Department: "CSE", HOD: "Dr. Raman" },
      { RollNo: 103, Name: "Rohan", Department: "IT", HOD: "Dr. Rao" },
      { RollNo: 104, Name: "Ananya", Department: "ECE", HOD: "Dr. Gupta" },
    ],
  },
  course: {
    name: "STUDENT_COURSE (RollNo, CourseID, StudentName, CourseFee)",
    pk: ["RollNo", "CourseID"],
    attributes: ["RollNo", "CourseID", "StudentName", "CourseFee"],
    fds: [
      { lhs: "RollNo, CourseID", rhs: "CourseFee", type: "Full Functional Dependency" },
      { lhs: "RollNo", rhs: "StudentName", type: "Partial Dependency (Violates 2NF!)" },
    ],
    rows: [
      { RollNo: 101, CourseID: "CS501", StudentName: "Aarav", CourseFee: 12000 },
      { RollNo: 101, CourseID: "CS502", StudentName: "Aarav", CourseFee: 11000 },
      { RollNo: 102, CourseID: "CS501", StudentName: "Priya", CourseFee: 12000 },
      { RollNo: 103, CourseID: "CS503", StudentName: "Rohan", CourseFee: 11500 },
    ],
  },
};

const FunctionalDependencyVisualizer = () => {
  const [selectedPreset, setSelectedPreset] = useState("student");
  const [activeFDIndex, setActiveFDIndex] = useState(0);
  const [testLHS, setTestLHS] = useState("Department");
  const [closureResult, setClosureResult] = useState(null);

  const currentRel = SAMPLE_RELATIONS[selectedPreset];
  const activeFD = currentRel.fds[activeFDIndex] || currentRel.fds[0];

  const handleComputeClosure = () => {
    const attr = testLHS.trim();
    if (!attr) return;

    if (attr.toLowerCase() === "rollno") {
      setClosureResult({
        attr: "RollNo",
        closure: ["RollNo", "Name", "Department", "HOD"],
        isKey: true,
        explanation: "RollNo determines all attributes in the relation! Therefore, RollNo is a Super Key & Candidate Key.",
      });
    } else if (attr.toLowerCase() === "department") {
      setClosureResult({
        attr: "Department",
        closure: ["Department", "HOD"],
        isKey: false,
        explanation: "Department determines HOD, but NOT RollNo or Name. Department is NOT a candidate key (Causes Transitive Dependency in 3NF!).",
      });
    } else {
      setClosureResult({
        attr,
        closure: [attr],
        isKey: false,
        explanation: `Only trivial closure {${attr}} can be derived from the available FDs.`,
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-violet-100 text-violet-800 border border-violet-200">
              Relational Theory Lab
            </span>
            <span className="text-xs font-semibold text-slate-400">Functional Dependencies & Closures</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Functional Dependency & Attribute Closure Visualizer
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Visually observe Determinants (X) functionally determining Dependents (Y) across database records.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => {
              setSelectedPreset("student");
              setActiveFDIndex(0);
              setClosureResult(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedPreset === "student" ? "bg-white text-violet-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Student Record (3NF Demo)
          </button>
          <button
            onClick={() => {
              setSelectedPreset("course");
              setActiveFDIndex(0);
              setClosureResult(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedPreset === "course" ? "bg-white text-violet-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Composite Key (2NF Demo)
          </button>
        </div>
      </div>

      {/* CORE FORMULA BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-violet-300 uppercase tracking-wider">Formal Invariant</span>
          <div className="font-mono text-base sm:text-lg font-black tracking-wide text-white">
            X → Y (X functionally determines Y)
          </div>
          <p className="text-[11px] text-slate-300">
            For any two tuples t1, t2: If <span className="text-emerald-400 font-bold">t1[X] == t2[X]</span>, then it must strictly hold that <span className="text-emerald-400 font-bold">t1[Y] == t2[Y]</span>.
          </p>
        </div>
        <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center sm:text-right">
          <span className="text-[10px] uppercase font-bold text-violet-300 block">Active FD</span>
          <span className="font-mono text-xs sm:text-sm font-extrabold text-amber-300">
            {activeFD.lhs} ➔ {activeFD.rhs}
          </span>
        </div>
      </div>

      {/* ACTIVE FDs SELECTION */}
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500">
          Select Functional Dependency to Highlight on Table:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {currentRel.fds.map((fd, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFDIndex(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                activeFDIndex === idx
                  ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span className="font-mono">{fd.lhs} → {fd.rhs}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                activeFDIndex === idx ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
              }`}>{fd.type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* VISUAL TABLE WITH HIGHLIGHTED DETERMINANT & DEPENDENT */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Table: <strong className="text-slate-800">{currentRel.name}</strong></span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500 inline-block" /> Determinant (LHS)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500 inline-block" /> Dependent (RHS)</span>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                {currentRel.attributes.map((col) => {
                  const isLHS = activeFD.lhs.includes(col);
                  const isRHS = activeFD.rhs.includes(col);
                  return (
                    <th
                      key={col}
                      className={`p-3 font-black transition-colors ${
                        isLHS
                          ? "bg-blue-100 text-blue-900 border-b-2 border-blue-500"
                          : isRHS
                          ? "bg-amber-100 text-amber-900 border-b-2 border-amber-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span>{col}</span>
                        {isLHS && <span className="text-[9px] px-1 bg-blue-600 text-white rounded">LHS</span>}
                        {isRHS && <span className="text-[9px] px-1 bg-amber-600 text-white rounded">RHS</span>}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {currentRel.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                  {currentRel.attributes.map((col) => {
                    const isLHS = activeFD.lhs.includes(col);
                    const isRHS = activeFD.rhs.includes(col);
                    return (
                      <td
                        key={col}
                        className={`p-3 font-mono ${
                          isLHS ? "bg-blue-50/70 text-blue-950 font-bold" : isRHS ? "bg-amber-50/70 text-amber-950 font-bold" : "text-slate-700"
                        }`}
                      >
                        {row[col]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INTERACTIVE ATTRIBUTE CLOSURE (X+) COMPUTATION */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <span>⚡</span> Interactive Attribute Closure (X+) Calculator
          </span>
          <span className="text-[11px] text-slate-400">Armstrong's Axioms in Action</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={testLHS}
            onChange={(e) => setTestLHS(e.target.value)}
            placeholder="Enter attribute (e.g., RollNo, Department)..."
            className="px-3.5 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 font-semibold flex-1 max-w-xs"
          />
          <button
            onClick={handleComputeClosure}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            Compute Closure (X+)
          </button>
        </div>

        {closureResult && (
          <div className="p-3.5 rounded-xl bg-white border border-violet-200 text-xs space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-violet-900">
                ({closureResult.attr})+ = &#123; {closureResult.closure.join(", ")} &#125;
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                closureResult.isKey ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}>
                {closureResult.isKey ? "✓ Candidate Key" : "⚠️ Non-Key Determinant"}
              </span>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">{closureResult.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FunctionalDependencyVisualizer;
