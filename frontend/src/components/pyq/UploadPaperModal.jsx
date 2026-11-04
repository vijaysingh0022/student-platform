import React, { useState } from "react";
import { uploadPYQPapers } from "../../services/api.js";

const UNIVERSITIES = [
  "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
  "Delhi Technological University (DTU)",
  "Guru Gobind Singh Indraprastha University (GGSIPU)",
  "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV)",
  "Anna University",
  "Visvesvaraya Technological University (VTU)",
  "Jawaharlal Nehru Technological University (JNTU)",
  "Other State / Central University",
];

const LEARNX_SUBJECTS = [
  { id: "dsa", name: "Data Structures & Algorithms", code: "KCS-401" },
  { id: "dbms", name: "Database Management Systems", code: "KCS-501" },
  { id: "os", name: "Operating Systems", code: "KCS-402" },
  { id: "cn", name: "Computer Networks", code: "KCS-601" },
  { id: "oops", name: "Object Oriented Programming (Java/C++)", code: "KCS-302" },
  { id: "coa", name: "Computer Organization & Architecture", code: "KCS-301" },
  { id: "daa", name: "Design & Analysis of Algorithms", code: "KCS-503" },
  { id: "toc", name: "Theory of Computation & Automata", code: "KCS-502" },
  { id: "se", name: "Software Engineering", code: "KCS-603" },
  { id: "compiler-design", name: "Compiler Design", code: "KCS-701" },
  { id: "ai", name: "Artificial Intelligence", code: "KCS-702" },
  { id: "python", name: "Python Programming", code: "BCC-301" },
  { id: "discrete-math", name: "Discrete Mathematics", code: "KCS-303" },
  { id: "engg-math", name: "Engineering Mathematics", code: "KAS-103" },
];

export const UploadPaperModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Configuration Form State
  const [university, setUniversity] = useState(UNIVERSITIES[0]);
  const [course, setCourse] = useState("B.Tech");
  const [branch, setBranch] = useState("Computer Science & Engineering (CSE)");
  const [semester, setSemester] = useState(4);
  const [selectedSubjectId, setSelectedSubjectId] = useState("dsa");
  const [subjectCode, setSubjectCode] = useState("KCS-401");
  const [academicYear, setAcademicYear] = useState("2023-24");
  const [examSession, setExamSession] = useState("End Semester");
  const [totalMarks, setTotalMarks] = useState(100);

  if (!isOpen) return null;

  const handleSubjectChange = (subId) => {
    setSelectedSubjectId(subId);
    const found = LEARNX_SUBJECTS.find((s) => s.id === subId);
    if (found) setSubjectCode(found.code);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles) => {
    setErrorMsg("");
    const valid = [];
    for (const f of newFiles) {
      if (f.size > 20 * 1024 * 1024) {
        setErrorMsg(`"${f.name}" exceeds the 20MB file size limit.`);
        continue;
      }
      const isAllowed =
        f.type.includes("pdf") ||
        f.type.includes("image") ||
        f.name.match(/\.(pdf|png|jpg|jpeg|webp)$/i);
      if (!isAllowed) {
        setErrorMsg(`"${f.name}" is not a supported file type (PDF/JPG/PNG).`);
        continue;
      }
      valid.push(f);
    }
    setFiles((prev) => [...prev, ...valid]);
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setErrorMsg("Please select or drop at least one question paper file.");
      return;
    }

    setUploading(true);
    setErrorMsg("");

    try {
      const selectedSubObj = LEARNX_SUBJECTS.find((s) => s.id === selectedSubjectId);
      const formData = new FormData();
      formData.append("university", university);
      formData.append("course", course);
      formData.append("branch", branch);
      formData.append("semester", semester);
      formData.append("subjectId", selectedSubjectId);
      formData.append("subjectName", selectedSubObj?.name || "Computer Science Subject");
      formData.append("subjectCode", subjectCode);
      formData.append("academicYear", academicYear);
      formData.append("examSession", examSession);
      formData.append("totalMarks", totalMarks);

      files.forEach((file) => {
        formData.append("papers", file);
      });

      const res = await uploadPYQPapers(formData);
      if (res.data?.success) {
        if (onUploadSuccess) onUploadSuccess(res.data.papers);
        onClose();
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setErrorMsg(err.response?.data?.message || "Failed to upload question paper files.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="text-base font-black text-slate-900 leading-snug">Upload Previous Year Papers</h3>
            <p className="text-xs text-slate-500 font-medium">
              OCR enabled for scanned papers. Automatic question extraction & syllabus mapping.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={uploading}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Config Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* University */}
            <div className="sm:col-span-2">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1 block">
                University / Autonomous Institute
              </label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
              >
                {UNIVERSITIES.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            {/* Subject Selection */}
            <div>
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1 block">
                LearnX Subject
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
              >
                {LEARNX_SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Code */}
            <div>
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1 block">
                Subject Code
              </label>
              <input
                type="text"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="e.g. KCS-401"
                className="w-full px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Academic Year */}
            <div>
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1 block">
                Academic Year / Exam Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
              >
                {["2024-25", "2023-24", "2022-23", "2021-22", "2020-21", "2019-20"].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Exam Session */}
            <div>
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1 block">
                Examination Session
              </label>
              <select
                value={examSession}
                onChange={(e) => setExamSession(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
              >
                {["End Semester", "Mid Semester", "Carry Over / Special", "Class Test"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
              dragActive
                ? "border-indigo-500 bg-indigo-50/50"
                : "border-slate-200 hover:border-indigo-400 bg-slate-50/50"
            }`}
            onClick={() => document.getElementById("pyqFileInput")?.click()}
          >
            <input
              id="pyqFileInput"
              type="file"
              multiple
              accept=".pdf,image/png,image/jpeg,image/jpg"
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-xl mx-auto mb-2">
              📄
            </div>
            <p className="text-xs font-black text-slate-800">
              Drag & Drop your question paper PDF or images here
            </p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Supports searchable PDFs, scanned camera captures, or JPGs (Up to 20MB per file)
            </p>
            <button
              type="button"
              className="mt-3 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-100"
            >
              Browse Files
            </button>
          </div>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                Selected Papers ({files.length})
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="text-sm">📎</span>
                      <span className="font-bold text-slate-800 truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(i);
                      }}
                      className="text-slate-400 hover:text-rose-600 font-bold px-2 py-0.5 rounded-lg hover:bg-rose-50"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || files.length === 0}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <span className="animate-spin inline-block">⏳</span>
                  <span>Uploading & Queuing Pipeline...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Start AI Extraction ({files.length} Papers)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPaperModal;
