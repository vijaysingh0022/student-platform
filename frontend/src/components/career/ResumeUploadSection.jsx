import React, { useState, useRef } from "react";
import { uploadAndAnalyzeFullResume } from "../../services/api.js";

export const ResumeUploadSection = ({
  targetRole,
  onAnalysisSuccess,
  currentFileName = "",
  currentFileSize = 0,
  isAnalyzed = false,
  onRemoveResume,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);

  const allowedExtensions = ["pdf", "docx", "doc", "txt"];
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB

  const validateFile = (file) => {
    if (!file) return "No file selected.";
    const ext = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return `Invalid format (.${ext}). Supported formats: PDF, DOCX, DOC, TXT.`;
    }
    if (file.size > maxSizeBytes) {
      return `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 10MB limit.`;
    }
    return null;
  };

  const handleProcessFile = async (file) => {
    setErrorMessage("");
    setSuccessMessage("");
    const validationError = validateFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setSelectedFile(file);
    setUploading(true);
    setUploadProgress(15);

    const formData = new FormData();
    formData.append("resumeFile", file);
    formData.append("targetRole", targetRole || "Full Stack Software Engineer");

    // Simulated stepped progress for transparent UX feedback
    const progressTimer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressTimer);
          return 88;
        }
        return prev + 18;
      });
    }, 280);

    try {
      const res = await uploadAndAnalyzeFullResume(formData);
      clearInterval(progressTimer);
      setUploadProgress(100);

      if (res.data?.success && res.data?.analysis) {
        setSuccessMessage(`Resume "${file.name}" successfully parsed & evaluated for ${targetRole}!`);
        if (onAnalysisSuccess) {
          onAnalysisSuccess(res.data.analysis, file.name);
        }
      } else {
        throw new Error(res.data?.message || "Analysis returned an incomplete response.");
      }
    } catch (err) {
      clearInterval(progressTimer);
      console.error("Resume upload error:", err);
      setErrorMessage(
        err.response?.data?.message || err.message || "Failed to analyze resume. Please try again with a valid document."
      );
      setSelectedFile(null);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1200);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-pulse" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              {isAnalyzed ? "Active Resume & Live ATS Diagnostic Engine" : "Upload Resume For ATS & Career Diagnostics"}
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Calibrated specifically for <strong className="text-slate-800">{targetRole}</strong>. PDF & DOCX up to 10MB.
          </p>
        </div>

        {isAnalyzed && currentFileName && (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span>✅</span>
              <span className="truncate max-w-[180px]">{currentFileName}</span>
            </span>
            {onRemoveResume && (
              <button
                onClick={onRemoveResume}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:underline px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                title="Remove resume and clear scores"
              >
                Delete / Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative p-7 sm:p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center text-center ${
          isDragging
            ? "border-violet-500 bg-violet-50/70 scale-[0.99]"
            : uploading
            ? "border-violet-300 bg-violet-50/30 cursor-wait"
            : "border-slate-200 hover:border-violet-400 bg-slate-50/60 hover:bg-violet-50/30"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          onChange={onFileInputChange}
          className="sr-only"
          disabled={uploading}
        />

        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-3xl mb-3">
          {uploading ? (
            <div className="w-7 h-7 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
          ) : isDragging ? (
            "📥"
          ) : (
            "📄"
          )}
        </div>

        <h4 className="text-sm font-extrabold text-slate-900 mb-1">
          {uploading
            ? "Extracting Text & Analyzing with AI..."
            : isDragging
            ? "Drop your resume file right here!"
            : isAnalyzed
            ? "Upload New Version or Replace Resume"
            : "Drag & Drop Resume or Click to Choose"}
        </h4>

        <p className="text-xs text-slate-500 max-w-sm font-medium mb-3">
          {uploading
            ? "Scoring ATS keywords, section impact, power verbs and role fit..."
            : "Supports PDF, DOCX, DOC and TXT formats (Max 10MB). Automatically extracted and analyzed in real-time."}
        </p>

        {!uploading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-2 transition-all hover:scale-102 active:scale-98"
          >
            <span>📁</span>
            <span>{isAnalyzed ? "Choose New Resume File" : "Choose Resume File"}</span>
          </button>
        )}

        {/* Selected file preview during upload */}
        {selectedFile && (
          <div className="mt-4 p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center gap-3 shadow-xs">
            <span className="text-base">📎</span>
            <span className="font-bold text-slate-800 truncate max-w-[200px]">{selectedFile.name}</span>
            <span className="text-slate-400 font-medium">({formatFileSize(selectedFile.size)})</span>
          </div>
        )}

        {/* Upload Progress Bar */}
        {uploading && (
          <div className="w-full max-w-md mt-4 space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-violet-700">
              <span>Deep Multi-Section Analysis</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 animate-fade-in">
          <span className="text-sm shrink-0">⚠️</span>
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage("")}
            className="text-rose-500 hover:text-rose-800 font-bold ml-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800 animate-fade-in">
          <span className="text-sm shrink-0">🎉</span>
          <div className="flex-1 font-medium">{successMessage}</div>
          <button
            onClick={() => setSuccessMessage("")}
            className="text-emerald-600 hover:text-emerald-800 font-bold ml-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeUploadSection;

