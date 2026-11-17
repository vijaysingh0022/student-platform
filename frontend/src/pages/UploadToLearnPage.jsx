import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  FileText,
  File,
  Sparkles,
  Bot,
  Trash2,
  BookOpen,
  HelpCircle,
  Layers,
  ChevronRight,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  Send,
  Zap,
  Bookmark,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  X,
  FileSpreadsheet,
} from "lucide-react";
import {
  uploadLearningDocument,
  getMyDocuments,
  getDocumentDetails,
  deleteDocument,
  chatWithDocument,
  generateDocumentStudyMaterial,
} from "../services/api.js";

export const UploadToLearnPage = () => {
  // State
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loadingDoc, setLoadingDoc] = useState(false);

  // Upload state
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  // Tab: 'chat' | 'materials' | 'preview'
  const [activeTab, setActiveTab] = useState("chat");

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatScrollRef = useRef(null);

  // Study material generation state
  const [generatingType, setGeneratingType] = useState(null);
  const [customGenPrompt, setCustomGenPrompt] = useState("");

  // Search in library
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await getMyDocuments();
      if (res.data?.success) {
        setDocuments(res.data.documents || []);
        if (!selectedDocId && res.data.documents?.length > 0) {
          selectDocument(res.data.documents[0]._id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const selectDocument = async (docId) => {
    try {
      setSelectedDocId(docId);
      setLoadingDoc(true);
      const res = await getDocumentDetails(docId);
      if (res.data?.success) {
        setSelectedDoc(res.data.document);
        setChatMessages(res.data.document.chatHistory || []);
      }
    } catch (err) {
      console.error("Failed to fetch document details:", err);
    } finally {
      setLoadingDoc(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate size (25MB)
    if (file.size > 25 * 1024 * 1024) {
      setUploadError("File is too large. Maximum supported size is 25MB.");
      return;
    }

    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "docx", "pptx", "ppt", "txt"].includes(ext)) {
      setUploadError("Unsupported format. Please upload PDF, DOCX, PPT, PPTX, or TXT.");
      return;
    }

    setUploadError("");
    setIsUploading(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadProgress(50);
      const res = await uploadLearningDocument(formData);
      setUploadProgress(100);
      if (res.data?.success) {
        await fetchDocuments();
        if (res.data.document?._id) {
          selectDocument(res.data.document._id);
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError(err.response?.data?.message || "Failed to process document.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteDocument = async (e, docId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this document and its semantic embeddings?")) {
      return;
    }

    try {
      await deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d._id !== docId));
      if (selectedDocId === docId) {
        setSelectedDocId(null);
        setSelectedDoc(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isSending || !selectedDocId) return;

    const userQ = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userQ }]);
    setIsSending(true);

    try {
      const res = await chatWithDocument(selectedDocId, { question: userQ });
      if (res.data?.success) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.data.answer,
            citations: res.data.citations,
            isGrounded: res.data.isGrounded,
          },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error searching this document. Please try again.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isSending]);

  const handleGenerateMaterial = async (type) => {
    if (!selectedDocId || generatingType) return;
    try {
      setGeneratingType(type);
      const res = await generateDocumentStudyMaterial(selectedDocId, {
        type,
        topicOrQuery: customGenPrompt,
      });
      if (res.data?.success && res.data.material) {
        setSelectedDoc((prev) => ({
          ...prev,
          studyMaterials: [...(prev.studyMaterials || []), res.data.material],
        }));
        setActiveTab("materials");
      }
    } catch (err) {
      console.error("Generation error:", err);
      alert("Failed to generate study material. Please try again.");
    } finally {
      setGeneratingType(null);
      setCustomGenPrompt("");
    }
  };

  const filteredDocs = documents.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.detectedSubject && d.detectedSubject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>RAG Document Intelligence & Semantic Knowledge Retrieval</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Upload to Learn AI
              </h1>
              <p className="text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
                Turn your lecture slides, class notes, and textbooks (PDF, DOCX, PPT, PPTX, TXT) into an interactive learning environment with vector retrieval, citations, and instant study sheets.
              </p>
            </div>

            {/* Quick Upload Button */}
            <div className="shrink-0 flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.pptx,.ppt,.txt"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? "Processing Document..." : "Upload Notes / Slides"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Document Library & Drag-Drop Uploader (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center space-y-3 bg-white ${
                isDragging
                  ? "border-blue-500 bg-blue-50/50 scale-[1.01]"
                  : "border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                <Upload className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-black text-slate-800">
                  Drop PDF, DOCX, PPTX, or TXT
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Up to 25MB • Auto chunking & vector indexing
                </p>
              </div>

              {isUploading && (
                <div className="pt-2 space-y-1.5">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300 animate-pulse"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-blue-600">
                    Extracting text and building vector chunks...
                  </span>
                </div>
              )}

              {uploadError && (
                <div className="p-2 rounded-xl bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200 flex items-center gap-1.5 justify-center">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* Document Library List */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-700" />
                  <h2 className="text-sm font-black text-slate-900 tracking-tight">Your Document Library</h2>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {documents.length} Docs
                </span>
              </div>

              {/* Search documents */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter documents..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-800"
                />
              </div>

              {/* List */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar pt-1">
                {loading ? (
                  <div className="py-8 text-center text-xs font-bold text-slate-400">Loading library...</div>
                ) : filteredDocs.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <p className="text-xs text-slate-400 font-medium">No documents uploaded yet.</p>
                    <p className="text-[11px] text-slate-400">Upload your first syllabus or lecture file above.</p>
                  </div>
                ) : (
                  filteredDocs.map((doc) => {
                    const isSelected = selectedDocId === doc._id;
                    const ext = doc.fileExtension?.toUpperCase() || "DOC";

                    return (
                      <div
                        key={doc._id}
                        onClick={() => selectDocument(doc._id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                          isSelected
                            ? "bg-blue-50/70 border-blue-400 shadow-2xs"
                            : "bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/70 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-[10px] shrink-0 ${
                              ext === "PDF"
                                ? "bg-rose-100 text-rose-700"
                                : ext === "PPTX" || ext === "PPT"
                                ? "bg-amber-100 text-amber-700"
                                : ext === "DOCX"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {ext}
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                              {doc.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-2">
                              <span>{doc.pageCount} Pages</span>
                              <span>•</span>
                              <span>{doc.detectedSubject || "CS"}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleDeleteDocument(e, doc._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
                            title="Delete Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Document Workspace (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {!selectedDoc ? (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-16 text-center space-y-3 shadow-2xs">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto">
                  <Bot className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Select or Upload a Document</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
                  Choose a document from your library on the left to activate RAG grounded chat, generate instant study materials, or review chunks.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col min-h-[680px]">
                
                {/* Active Document Header */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                        {selectedDoc.detectedSubject || "CS"}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {selectedDoc.pageCount} Pages • {selectedDoc.chunks?.length || 0} Vector Chunks
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                      {selectedDoc.title}
                    </h2>
                  </div>

                  {/* Mode Tabs */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200/90 self-start sm:self-center shrink-0">
                    {[
                      { id: "chat", label: "AI RAG Chat", icon: Bot },
                      { id: "materials", label: "Study Materials", icon: Sparkles },
                      { id: "preview", label: "Chunk Explorer", icon: Layers },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isActive
                              ? "bg-slate-900 text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* TAB 1: RAG CHAT */}
                {activeTab === "chat" && (
                  <div className="flex flex-col flex-1 h-[580px]">
                    {/* Chat Messages Log */}
                    <div ref={chatScrollRef} className="flex-1 p-5 overflow-y-auto space-y-4">
                      {chatMessages.length === 0 ? (
                        <div className="py-12 text-center space-y-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                            <Bot className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-slate-900">
                              Ask anything grounded in this document
                            </h4>
                            <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                              Responses cite exact pages. Try questions in English or Hinglish!
                            </p>
                          </div>

                          {/* Quick Prompt Chips */}
                          <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto pt-2">
                            {[
                              "Explain this document in 3 paragraphs",
                              "Summarize key exam formulas and definitions",
                              "Explain this topic in Hinglish",
                              "What are the main algorithms covered?",
                              "Find high-yield questions for university exams",
                            ].map((prompt, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setChatInput(prompt);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 text-[11px] font-semibold transition-all text-left"
                              >
                                {prompt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        chatMessages.map((msg, idx) => {
                          const isUser = msg.role === "user";
                          return (
                            <div
                              key={idx}
                              className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1.5`}
                            >
                              <div
                                className={`p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed max-w-[85%] ${
                                  isUser
                                    ? "bg-blue-600 text-white rounded-br-xs"
                                    : "bg-slate-50 text-slate-800 border border-slate-200/80 rounded-bl-xs whitespace-pre-line"
                                }`}
                              >
                                {msg.content}
                              </div>

                              {/* Citations Box for Assistant messages */}
                              {!isUser && msg.citations && msg.citations.length > 0 && (
                                <div className="space-y-1 pl-2 max-w-[85%]">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                    Source Citations
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {msg.citations.map((c, cIdx) => (
                                      <div
                                        key={cIdx}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-indigo-700"
                                        title={c.snippet}
                                      >
                                        <Bookmark className="w-3 h-3" />
                                        <span>Page {c.pageNumber}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}

                      {isSending && (
                        <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-sm text-xs font-semibold text-slate-500">
                          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          <span>Searching semantic vector chunks...</span>
                        </div>
                      )}
                    </div>

                    {/* Chat Input Bar */}
                    <form
                      onSubmit={handleSendMessage}
                      className="p-3.5 border-t border-slate-100 bg-white flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask a question about this document (or ask in Hinglish)..."
                        className="flex-1 px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                      />
                      <button
                        type="submit"
                        disabled={!chatInput.trim() || isSending}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* TAB 2: AI STUDY MATERIAL GENERATOR */}
                {activeTab === "materials" && (
                  <div className="p-6 overflow-y-auto space-y-6 flex-1 max-h-[580px]">
                    {/* Generator Launcher Cards */}
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                        Instant AI Generation Suite
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { id: "short_notes", title: "Short Notes", icon: BookOpen },
                          { id: "detailed_notes", title: "Detailed Notes", icon: FileText },
                          { id: "mcqs", title: "5 Practice MCQs", icon: HelpCircle },
                          { id: "flashcards", title: "Active Recall Flashcards", icon: Zap },
                          { id: "revision_sheet", title: "Exam Revision Sheet", icon: SlidersHorizontal },
                          { id: "chapter_summary", title: "Chapter Summary", icon: Layers },
                        ].map((gen) => {
                          const Icon = gen.icon;
                          const isGenThis = generatingType === gen.id;
                          return (
                            <button
                              key={gen.id}
                              onClick={() => handleGenerateMaterial(gen.id)}
                              disabled={Boolean(generatingType)}
                              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all space-y-2 group shadow-2xs"
                            >
                              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {gen.title}
                                </h4>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {isGenThis ? "Generating..." : "Generate from text →"}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Already Generated Materials List */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Generated Study Assets ({(selectedDoc.studyMaterials || []).length})
                      </h3>

                      {(selectedDoc.studyMaterials || []).length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400 font-medium">
                          No study materials generated yet. Click any button above to generate notes, MCQs, or flashcards.
                        </div>
                      ) : (
                        (selectedDoc.studyMaterials || []).map((mat, idx) => (
                          <div
                            key={idx}
                            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4"
                          >
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <span className="text-xs font-bold text-slate-900">{mat.title}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 uppercase">
                                {mat.type.replace("_", " ")}
                              </span>
                            </div>

                            {/* Render content based on type */}
                            {mat.content?.questions && (
                              <div className="space-y-3">
                                {mat.content.questions.map((q, qIdx) => (
                                  <div key={qIdx} className="p-3 rounded-xl bg-slate-50 text-xs space-y-2">
                                    <p className="font-bold text-slate-800">
                                      Q{qIdx + 1}: {q.questionText}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                      {q.options?.map((opt, oIdx) => (
                                        <div
                                          key={oIdx}
                                          className={`p-2 rounded-lg border text-[11px] font-medium ${
                                            oIdx === q.correctAnswerIndex
                                              ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                                              : "bg-white border-slate-200 text-slate-700"
                                          }`}
                                        >
                                          {String.fromCharCode(65 + oIdx)}. {opt}
                                        </div>
                                      ))}
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium pt-1">
                                      Explanation: {q.explanation} (Page {q.pageCitation || 1})
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {mat.content?.flashcards && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {mat.content.flashcards.map((fc, fIdx) => (
                                  <div
                                    key={fIdx}
                                    className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 text-xs space-y-2"
                                  >
                                    <span className="text-[10px] font-bold text-indigo-600 block uppercase">
                                      Front: Question
                                    </span>
                                    <p className="font-bold text-slate-900">{fc.front}</p>
                                    <div className="border-t border-indigo-200/60 pt-2">
                                      <span className="text-[10px] font-bold text-emerald-700 block uppercase">
                                        Back: Definition
                                      </span>
                                      <p className="text-slate-700 font-medium">{fc.back}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {mat.content?.bulletPoints && (
                              <div className="space-y-2 text-xs">
                                {mat.content.bulletPoints.map((bp, bIdx) => (
                                  <div key={bIdx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                    <span className="font-bold text-slate-800">{bp.concept}: </span>
                                    <span className="text-slate-600 font-medium">{bp.keyTakeaway}</span>
                                    <span className="text-[10px] text-indigo-600 font-bold ml-2">
                                      (Page {bp.pageCitation || 1})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {mat.content?.sections && (
                              <div className="space-y-3 text-xs">
                                {mat.content.sections.map((sec, sIdx) => (
                                  <div key={sIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                    <div className="flex items-center justify-between">
                                      <h5 className="font-black text-slate-900">{sec.heading}</h5>
                                      <span className="text-[10px] text-indigo-600 font-bold">Page {sec.pageCitation || 1}</span>
                                    </div>
                                    <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                                      {sec.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: CHUNK EXPLORER */}
                {activeTab === "preview" && (
                  <div className="p-6 overflow-y-auto space-y-4 flex-1 max-h-[580px]">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Extracted RAG Chunks ({(selectedDoc.chunks || []).length})
                      </h3>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                        Vector Embeddings Active
                      </span>
                    </div>

                    <div className="space-y-3">
                      {(selectedDoc.chunks || []).map((chunk, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 text-xs space-y-2 shadow-2xs"
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pb-1 border-b border-slate-200/60">
                            <span>Chunk #{chunk.chunkIndex + 1} • Page {chunk.pageNumber}</span>
                            <span>~{chunk.tokenEstimate} Tokens</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed font-mono text-[11px]">
                            {chunk.text}
                          </p>
                          {chunk.keyTerms && chunk.keyTerms.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-1">
                              {chunk.keyTerms.map((term, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600"
                                >
                                  #{term}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadToLearnPage;
