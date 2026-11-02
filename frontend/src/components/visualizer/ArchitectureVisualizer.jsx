import React, { useState } from "react";

const ARCHITECTURE_LEVELS = [
  {
    id: "external",
    title: "1. External Level (View Level)",
    badge: "User Specific Views",
    color: "from-blue-500 to-indigo-600",
    border: "border-blue-300",
    bg: "bg-blue-50/60",
    textColor: "text-blue-900",
    icon: "👥",
    description:
      "Describes what individual users actually see. Different user groups have different tailored views and permissions.",
    example:
      "Student sees only Attendance & Grades (View 1); Accounts Department sees Fee Balance & Payment Portal (View 2).",
    components: ["View 1 (Student Portal)", "View 2 (Accounts Portal)", "View 3 (Faculty Admin)"],
    analogy:
      "Like viewing a bank account: The mobile app shows your balance; the ATM screen shows quick cash; the branch manager sees internal audit logs — all over the same core data!",
  },
  {
    id: "conceptual",
    title: "2. Conceptual Level (Logical Level)",
    badge: "Entire Database Community View",
    color: "from-violet-500 to-purple-600",
    border: "border-violet-300",
    bg: "bg-violet-50/60",
    textColor: "text-violet-900",
    icon: "🏛️",
    description:
      "Describes WHAT data is stored in the entire database and the relationships among the data. Defines tables, entities, data types, constraints, and security rules.",
    example:
      "Tables: STUDENT(ID, Name, Branch), ENROLLMENT(ID, CourseID), COURSE(CourseID, Credits). Foreign keys and constraints.",
    components: ["Relational Schemas", "Foreign Key Constraints", "Security & Integrity Rules"],
    analogy:
      "Like the architectural blueprint of a hospital: It maps all rooms, beds, and departments, without worrying about the exact physical brand of cement used in the walls.",
  },
  {
    id: "internal",
    title: "3. Internal Level (Physical Level)",
    badge: "Storage Engine & Hardware Interface",
    color: "from-amber-500 to-orange-600",
    border: "border-amber-300",
    bg: "bg-amber-50/60",
    textColor: "text-amber-900",
    icon: "💾",
    description:
      "Describes HOW data is physically saved on persistent disks or SSDs. Covers record formats, block sizes, indexing mechanisms, data compression, and byte offsets.",
    example:
      "B+ Tree index on StudentID (Clustered), sequential block storage in 8KB disk pages, AES-256 encrypted tablespaces.",
    components: ["B+ Tree Secondary Index", "8KB Clustered Disk Blocks", "WAL Transaction Log"],
    analogy:
      "Like the physical file cabinet, drawers, folders, and electronic barcode tags inside the warehouse archive.",
  },
];

const ArchitectureVisualizer = () => {
  const [activeLevel, setActiveLevel] = useState("all"); // "all" | "external" | "conceptual" | "internal"
  const [activeIndependence, setActiveIndependence] = useState(null); // null | "logical" | "physical"
  const [showAnalogy, setShowAnalogy] = useState(false);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-indigo-100 text-indigo-800 border border-indigo-200">
              Interactive Architectural Lab
            </span>
            <span className="text-xs font-semibold text-slate-400">ANSI/SPARC 3-Schema Model</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            DBMS 3-Schema Architecture & Data Independence
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Explore the 3 levels of database abstraction, mappings, and why Data Independence protects your applications.
          </p>
        </div>

        {/* View Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl flex-wrap">
          {[
            { id: "all", label: "Full Stack" },
            { id: "external", label: "External" },
            { id: "conceptual", label: "Conceptual" },
            { id: "internal", label: "Internal" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveLevel(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeLevel === btn.id
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* DATA INDEPENDENCE CONTROLS */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-indigo-200 space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
            <span>🛡️</span> Test Data Independence
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            Click to simulate schema modifications
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() =>
              setActiveIndependence(activeIndependence === "logical" ? null : "logical")
            }
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              activeIndependence === "logical"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                : "bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-50"
            }`}
          >
            <span>🔄</span>
            <span>Test Logical Data Independence</span>
          </button>
          <button
            onClick={() =>
              setActiveIndependence(activeIndependence === "physical" ? null : "physical")
            }
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              activeIndependence === "physical"
                ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                : "bg-white text-amber-800 border-amber-200 hover:bg-amber-50"
            }`}
          >
            <span>⚡</span>
            <span>Test Physical Data Independence</span>
          </button>
          <button
            onClick={() => setShowAnalogy(!showAnalogy)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors ml-auto"
          >
            {showAnalogy ? "Hide Analogy" : "💡 Real-Life Analogy"}
          </button>
        </div>

        {/* Data Independence Feedback Banner */}
        {activeIndependence === "logical" && (
          <div className="p-3.5 rounded-xl bg-white border border-indigo-300 text-xs text-indigo-950 space-y-1 animate-fade-in">
            <span className="font-black text-indigo-900 flex items-center gap-1">
              <span>✅</span> Logical Data Independence Active:
            </span>
            <p className="leading-relaxed">
              Suppose you add a new column <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-bold">AadhaarNumber</code> or split a table at the <strong>Conceptual Level</strong>.
              Because of <em>External-to-Conceptual Mapping</em>, existing user views (Student Portal, Faculty Portal) do <strong>NOT break</strong>! They continue reading their standard view schema unchanged.
            </p>
          </div>
        )}

        {activeIndependence === "physical" && (
          <div className="p-3.5 rounded-xl bg-white border border-amber-300 text-xs text-amber-950 space-y-1 animate-fade-in">
            <span className="font-black text-amber-900 flex items-center gap-1">
              <span>✅</span> Physical Data Independence Active:
            </span>
            <p className="leading-relaxed">
              Suppose the database administrator migrates tables from HDDs to high-speed NVMe SSDs, creates a new B+ Tree index, or changes disk block sizes at the <strong>Internal Level</strong>.
              Because of <em>Conceptual-to-Internal Mapping</em>, the <strong>Conceptual Schema and user SQL queries do NOT change</strong> at all!
            </p>
          </div>
        )}

        {showAnalogy && (
          <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 text-xs text-amber-950 space-y-1 animate-fade-in">
            <span className="font-black text-amber-900 flex items-center gap-1">
              <span>💡</span> Real-World Smartphone Analogy:
            </span>
            <p className="leading-relaxed">
              Think of your phone: You interact with the <strong>App Icons & Touch UI (External Level)</strong>.
              The operating system manages contacts, permissions, and accounts logically in <strong>Android/iOS framework (Conceptual Level)</strong>.
              The flash memory controller writes bits into NAND transistors <strong>(Internal Level)</strong>.
              If the phone upgrades its flash storage speed, you do not have to rewrite your apps! That is exact data independence.
            </p>
          </div>
        )}
      </div>

      {/* 3-SCHEMA INTERACTIVE DIAGRAM */}
      <div className="space-y-4">
        {ARCHITECTURE_LEVELS.filter(
          (lvl) => activeLevel === "all" || activeLevel === lvl.id
        ).map((lvl, idx) => (
          <div key={lvl.id} className="space-y-2">
            {/* Level Card */}
            <div
              className={`p-5 rounded-2xl border-2 ${lvl.border} ${lvl.bg} transition-all shadow-xs space-y-3`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{lvl.icon}</span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{lvl.title}</h3>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {lvl.badge}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {lvl.components.map((comp, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2.5 py-1 rounded-lg bg-white/90 border border-slate-200 text-slate-700 text-[11px] font-bold shadow-2xs"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {lvl.description}
              </p>

              <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/80 text-[11px] space-y-1">
                <span className="font-black text-slate-800 block">📌 Concrete Example:</span>
                <span className="text-slate-600">{lvl.example}</span>
              </div>
            </div>

            {/* Connecting Mapping Arrows */}
            {activeLevel === "all" && idx === 0 && (
              <div className="flex items-center justify-center py-1">
                <div
                  className={`px-4 py-1.5 rounded-full text-[11px] font-black border transition-all flex items-center gap-2 ${
                    activeIndependence === "logical"
                      ? "bg-indigo-600 text-white border-indigo-700 shadow-md scale-105"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  <span>↕️</span>
                  <span>External / Conceptual Mapping (Logical Data Independence)</span>
                </div>
              </div>
            )}

            {activeLevel === "all" && idx === 1 && (
              <div className="flex items-center justify-center py-1">
                <div
                  className={`px-4 py-1.5 rounded-full text-[11px] font-black border transition-all flex items-center gap-2 ${
                    activeIndependence === "physical"
                      ? "bg-amber-600 text-white border-amber-700 shadow-md scale-105"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  <span>↕️</span>
                  <span>Conceptual / Internal Mapping (Physical Data Independence)</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Physical Database Base */}
        {activeLevel === "all" && (
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between border border-slate-800 shadow-inner">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💽</span>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                  Physical Storage (Disks, SSDs, OS Blocks)
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">
                  Actual magnetic or flash bits managed by OS file systems and disk drivers
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 font-mono text-xs font-bold">
              RAID / NVMe Active
            </span>
          </div>
        )}
      </div>

      {/* Summary Matrix for Semester Exam */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
          🎓 Quick Exam Comparison: Logical vs Physical Data Independence
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-2.5 font-black">Type</th>
                <th className="p-2.5 font-black">Mapping Level</th>
                <th className="p-2.5 font-black">What changes?</th>
                <th className="p-2.5 font-black">What remains unaffected?</th>
                <th className="p-2.5 font-black">Difficulty to achieve</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
              <tr>
                <td className="p-2.5 font-bold text-indigo-700">Logical Independence</td>
                <td className="p-2.5">External ↔ Conceptual</td>
                <td className="p-2.5">Adding/splitting conceptual tables or attributes</td>
                <td className="p-2.5">External views and application programs</td>
                <td className="p-2.5 text-amber-700 font-bold">High (Harder to achieve)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-amber-700">Physical Independence</td>
                <td className="p-2.5">Conceptual ↔ Internal</td>
                <td className="p-2.5">Indexes, compression, disk paths, SSD migration</td>
                <td className="p-2.5">Conceptual schema & user SQL queries</td>
                <td className="p-2.5 text-emerald-700 font-bold">Moderate (Easier to achieve)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureVisualizer;
