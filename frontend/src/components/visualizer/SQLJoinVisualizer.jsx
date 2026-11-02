import React, { useState } from "react";

const TABLE_A = [
  { empId: 1, name: "Aarav", deptId: "D1" },
  { empId: 2, name: "Priya", deptId: "D2" },
  { empId: 3, name: "Rohan", deptId: "D1" },
  { empId: 4, name: "Ananya", deptId: "D4" }, // No matching dept
];

const TABLE_B = [
  { deptId: "D1", deptName: "Engineering", location: "Block A" },
  { deptId: "D2", deptName: "Marketing", location: "Block B" },
  { deptId: "D3", deptName: "Finance", location: "Block C" }, // No employee assigned
];

const SQLJoinVisualizer = () => {
  const [joinType, setJoinType] = useState("inner"); // "inner" | "left" | "right" | "full"

  // Compute join rows dynamically
  let joinedRows = [];
  if (joinType === "inner") {
    TABLE_A.forEach((a) => {
      const b = TABLE_B.find((dept) => dept.deptId === a.deptId);
      if (b) joinedRows.push({ ...a, ...b });
    });
  } else if (joinType === "left") {
    TABLE_A.forEach((a) => {
      const b = TABLE_B.find((dept) => dept.deptId === a.deptId);
      joinedRows.push({
        ...a,
        deptName: b ? b.deptName : "NULL",
        location: b ? b.location : "NULL",
      });
    });
  } else if (joinType === "right") {
    TABLE_B.forEach((b) => {
      const matchedEmployees = TABLE_A.filter((a) => a.deptId === b.deptId);
      if (matchedEmployees.length > 0) {
        matchedEmployees.forEach((a) => joinedRows.push({ ...a, ...b }));
      } else {
        joinedRows.push({
          empId: "NULL",
          name: "NULL",
          deptId: b.deptId,
          deptName: b.deptName,
          location: b.location,
        });
      }
    });
  } else if (joinType === "full") {
    // Left side
    TABLE_A.forEach((a) => {
      const b = TABLE_B.find((dept) => dept.deptId === a.deptId);
      joinedRows.push({
        ...a,
        deptName: b ? b.deptName : "NULL",
        location: b ? b.location : "NULL",
      });
    });
    // Right side non-matches
    TABLE_B.forEach((b) => {
      const exists = TABLE_A.some((a) => a.deptId === b.deptId);
      if (!exists) {
        joinedRows.push({
          empId: "NULL",
          name: "NULL",
          deptId: b.deptId,
          deptName: b.deptName,
          location: b.location,
        });
      }
    });
  }

  const joinDefinitions = {
    inner: {
      title: "INNER JOIN",
      desc: "Returns only the records that have matching values in both tables (Common Intersection).",
      sql: "SELECT * FROM Employees E INNER JOIN Departments D ON E.deptId = D.deptId;",
      venn: "Intersection only (Rows where both tables match)",
    },
    left: {
      title: "LEFT (OUTER) JOIN",
      desc: "Returns ALL records from Table A (Left), and the matched records from Table B. If no match, NULL is returned for Table B columns.",
      sql: "SELECT * FROM Employees E LEFT JOIN Departments D ON E.deptId = D.deptId;",
      venn: "All of Table A + intersection with Table B",
    },
    right: {
      title: "RIGHT (OUTER) JOIN",
      desc: "Returns ALL records from Table B (Right), and the matched records from Table A. If no match, NULL is returned for Table A columns.",
      sql: "SELECT * FROM Employees E RIGHT JOIN Departments D ON E.deptId = D.deptId;",
      venn: "All of Table B + intersection with Table A",
    },
    full: {
      title: "FULL (OUTER) JOIN",
      desc: "Returns all records when there is a match in either Table A or Table B. Records without matches contain NULL on the missing side.",
      sql: "SELECT * FROM Employees E FULL OUTER JOIN Departments D ON E.deptId = D.deptId;",
      venn: "Complete Union of Table A and Table B",
    },
  };

  const curr = joinDefinitions[joinType];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
              Interactive SQL Lab
            </span>
            <span className="text-xs font-semibold text-slate-400">Relational Algebra Joins</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            SQL JOIN Interactive Visualizer
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Switch between INNER, LEFT, RIGHT, and FULL outer joins to observe matching tuples and NULL generation.
          </p>
        </div>

        {/* Join Type Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl flex-wrap">
          {["inner", "left", "right", "full"].map((t) => (
            <button
              key={t}
              onClick={() => setJoinType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                joinType === t
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t} JOIN
            </button>
          ))}
        </div>
      </div>

      {/* SQL QUERY BANNER */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
            {curr.title} Query
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Join Condition: E.deptId = D.deptId</span>
        </div>
        <div className="font-mono text-xs sm:text-sm text-emerald-300 font-semibold bg-black/40 p-2.5 rounded-xl border border-slate-800">
          {curr.sql}
        </div>
        <p className="text-xs text-slate-300 font-medium">{curr.desc}</p>
      </div>

      {/* TWO SOURCE TABLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Table A */}
        <div className="border border-slate-200 rounded-2xl p-4 bg-blue-50/30 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-blue-900 uppercase">Table A: Employees (Left)</h4>
            <span className="text-[10px] text-slate-400 font-semibold">4 rows</span>
          </div>
          <table className="w-full text-xs text-left border-collapse bg-white rounded-xl overflow-hidden border border-slate-200">
            <thead>
              <tr className="bg-blue-100/60 text-blue-950 font-bold border-b border-blue-200">
                <th className="p-2">empId</th>
                <th className="p-2">name</th>
                <th className="p-2 text-indigo-700">deptId (FK)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {TABLE_A.map((r) => (
                <tr key={r.empId} className="hover:bg-blue-50/50">
                  <td className="p-2">{r.empId}</td>
                  <td className="p-2 font-sans font-medium">{r.name}</td>
                  <td className="p-2 font-bold text-indigo-700">{r.deptId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table B */}
        <div className="border border-slate-200 rounded-2xl p-4 bg-purple-50/30 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-purple-900 uppercase">Table B: Departments (Right)</h4>
            <span className="text-[10px] text-slate-400 font-semibold">3 rows</span>
          </div>
          <table className="w-full text-xs text-left border-collapse bg-white rounded-xl overflow-hidden border border-slate-200">
            <thead>
              <tr className="bg-purple-100/60 text-purple-950 font-bold border-b border-purple-200">
                <th className="p-2 text-indigo-700">deptId (PK)</th>
                <th className="p-2">deptName</th>
                <th className="p-2">location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {TABLE_B.map((r) => (
                <tr key={r.deptId} className="hover:bg-purple-50/50">
                  <td className="p-2 font-bold text-indigo-700">{r.deptId}</td>
                  <td className="p-2 font-sans font-medium">{r.deptName}</td>
                  <td className="p-2 font-sans">{r.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESULT OF JOIN */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <span>📊</span> Resulting Output Table ({joinedRows.length} tuples generated)
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">Notice rows with NULL values</span>
        </div>

        <div className="overflow-x-auto border border-emerald-300 rounded-2xl shadow-2xs">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-emerald-50 text-emerald-950 font-black border-b border-emerald-200">
                <th className="p-2.5">empId</th>
                <th className="p-2.5">name</th>
                <th className="p-2.5 text-indigo-700">deptId</th>
                <th className="p-2.5">deptName</th>
                <th className="p-2.5">location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {joinedRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-emerald-50/40 transition-colors">
                  <td className={`p-2.5 ${row.empId === "NULL" ? "text-rose-500 font-bold" : ""}`}>{row.empId}</td>
                  <td className={`p-2.5 font-sans ${row.name === "NULL" ? "text-rose-500 font-bold" : "font-medium"}`}>{row.name}</td>
                  <td className="p-2.5 font-bold text-indigo-700">{row.deptId}</td>
                  <td className={`p-2.5 font-sans ${row.deptName === "NULL" ? "text-rose-500 font-bold" : ""}`}>{row.deptName}</td>
                  <td className={`p-2.5 font-sans ${row.location === "NULL" ? "text-rose-500 font-bold" : ""}`}>{row.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SQLJoinVisualizer;
