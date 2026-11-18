import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Search,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  CheckCircle2,
  Clock,
  Sparkles,
  Bot,
  Filter,
  Code2,
  Paperclip,
  Share2,
  Flag,
  ChevronRight,
  User,
  Award,
  Flame,
  HelpCircle,
  TrendingUp,
  X,
  FileText,
  Image as ImageIcon,
  Send,
  Eye,
  CornerDownRight,
  ExternalLink,
} from "lucide-react";
import {
  getDiscussions,
  getDiscussionById,
  createDiscussionThread,
  replyToDiscussionThread,
  voteDiscussionThread,
  voteDiscussionReply,
  bookmarkDiscussionThread,
  acceptDiscussionAnswer,
  reportDiscussionThread,
  getUserCommunityProfile,
  askAiCommunityAssistant,
} from "../services/api.js";
import { CodeBlock } from "./MarkdownRenderer.jsx";

const SUBJECT_LIST = [
  "ALL",
  "DSA",
  "DBMS",
  "OS",
  "CN",
  "OOP",
  "SYSTEM_DESIGN",
  "WEB_DEV",
  "APTITUDE",
  "PROGRAMMING",
  "GENERAL",
];

const POPULAR_TAGS = [
  "DSA",
  "DBMS",
  "OS",
  "CN",
  "Java",
  "React",
  "Python",
  "SQL",
  "Dynamic Programming",
  "Trees & Graphs",
  "Deadlocks",
  "TCP/IP",
  "System Architecture",
  "Indexes",
  "Async JS",
];

export const PeerDiscussionForum = () => {
  const navigate = useNavigate();

  // Filter & Search states
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("latest"); // 'latest' | 'popular' | 'unanswered' | 'trending'
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState(null);

  // Data states
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState(null);
  const [threadLoading, setThreadLoading] = useState(false);

  // Creation & Editing states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newSubject, setNewSubject] = useState("DSA");
  const [newTopic, setNewTopic] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newCodeSnippet, setNewCodeSnippet] = useState("");
  const [newCodeLanguage, setNewCodeLanguage] = useState("javascript");
  const [newAttachments, setNewAttachments] = useState([]);
  const [creatingSubmitting, setCreatingSubmitting] = useState(false);

  // Reply states
  const [replyText, setReplyText] = useState("");
  const [replyCode, setReplyCode] = useState("");
  const [replyCodeLang, setReplyCodeLang] = useState("javascript");
  const [replyAttachments, setReplyAttachments] = useState([]);
  const [replyingToParentId, setReplyingToParentId] = useState(null);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [showReplyCodeBox, setShowReplyCodeBox] = useState(false);

  // AI Assistant in Thread
  const [aiSummarizing, setAiSummarizing] = useState(false);
  const [aiSummaryResult, setAiSummaryResult] = useState("");

  // Report Modal
  const [reportModalThreadId, setReportModalThreadId] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  // User Profile Drawer
  const [viewingProfileUserId, setViewingProfileUserId] = useState(null);
  const [userProfileData, setUserProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Feedback Notification banner
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch threads list
  const fetchThreads = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        sort: sortOption,
      };
      if (subjectFilter !== "ALL") params.subject = subjectFilter;
      if (selectedTag) params.tag = selectedTag;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (bookmarkedOnly) params.bookmarkedOnly = "true";

      const res = await getDiscussions(params);
      if (res?.data?.success) {
        setThreads(res.data.threads || []);
        setPaginationMeta(res.data.pagination || null);
        setCurrentPage(page);

        // If a thread was previously selected, refresh it from current list or fetch detail
        if (selectedThread) {
          const match = (res.data.threads || []).find((t) => t._id === selectedThread._id);
          if (match) {
            setSelectedThread((prev) => ({ ...prev, ...match }));
          }
        } else if (res.data.threads?.length > 0 && window.innerWidth >= 1024) {
          // Auto select first on desktop if none selected
          loadThreadDetails(res.data.threads[0]._id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch discussions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads(1);
  }, [subjectFilter, selectedTag, sortOption, bookmarkedOnly]);

  // Load individual thread details with view increment and replies
  const loadThreadDetails = async (threadId) => {
    setThreadLoading(true);
    try {
      const res = await getDiscussionById(threadId);
      if (res?.data?.success) {
        setSelectedThread(res.data.thread);
        setAiSummaryResult(res.data.thread.aiSummary || "");
      }
    } catch (err) {
      console.error("Failed to fetch discussion detail:", err);
    } finally {
      setThreadLoading(false);
    }
  };

  // Upvote / Downvote Thread
  const handleVoteThread = async (e, threadId, voteType) => {
    e.stopPropagation();
    try {
      const res = await voteDiscussionThread(threadId, voteType);
      if (res?.data?.success) {
        const { score, upvoteCount, downvoteCount, hasUpvoted, hasDownvoted } = res.data;
        setThreads((prev) =>
          prev.map((t) =>
            t._id === threadId
              ? { ...t, score, upvoteCount, downvoteCount, hasUpvoted, hasDownvoted }
              : t
          )
        );
        if (selectedThread && selectedThread._id === threadId) {
          setSelectedThread((prev) => ({
            ...prev,
            score,
            upvoteCount,
            downvoteCount,
            hasUpvoted,
            hasDownvoted,
          }));
        }
      }
    } catch (err) {
      console.error("Failed to vote on thread:", err);
    }
  };

  // Upvote / Downvote Reply
  const handleVoteReply = async (replyId, voteType) => {
    if (!selectedThread) return;
    try {
      const res = await voteDiscussionReply(selectedThread._id, replyId, voteType);
      if (res?.data?.success) {
        const { score, upvoteCount, downvoteCount, hasUpvoted, hasDownvoted } = res.data;
        setSelectedThread((prev) => ({
          ...prev,
          replies: (prev.replies || []).map((r) =>
            r._id === replyId
              ? { ...r, score, upvoteCount, downvoteCount, hasUpvoted, hasDownvoted }
              : r
          ),
        }));
      }
    } catch (err) {
      console.error("Failed to vote reply:", err);
    }
  };

  // Bookmark Thread
  const handleBookmark = async (e, threadId) => {
    e.stopPropagation();
    try {
      const res = await bookmarkDiscussionThread(threadId);
      if (res?.data?.success) {
        const { isBookmarked, bookmarkCount } = res.data;
        setThreads((prev) =>
          prev.map((t) =>
            t._id === threadId ? { ...t, isBookmarked, bookmarkCount } : t
          )
        );
        if (selectedThread && selectedThread._id === threadId) {
          setSelectedThread((prev) => ({ ...prev, isBookmarked, bookmarkCount }));
        }
        showToast(isBookmarked ? "Thread saved to bookmarks" : "Thread removed from bookmarks");
      }
    } catch (err) {
      console.error("Failed to bookmark thread:", err);
    }
  };

  // Accept Answer
  const handleAcceptAnswer = async (replyId) => {
    if (!selectedThread) return;
    try {
      const res = await acceptDiscussionAnswer(selectedThread._id, replyId);
      if (res?.data?.success) {
        setSelectedThread((prev) => ({
          ...prev,
          isResolved: res.data.isResolved,
          replies: res.data.replies,
        }));
        showToast("Accepted solution updated! Solution author credited +50 XP.");
      }
    } catch (err) {
      console.error("Failed to accept answer:", err);
      showToast(err.response?.data?.message || "Could not mark answer as accepted.");
    }
  };

  // AI Discussion Digest
  const handleTriggerAISummary = async () => {
    if (!selectedThread) return;
    setAiSummarizing(true);
    try {
      const res = await askAiCommunityAssistant({
        action: "summarize_thread",
        threadId: selectedThread._id,
      });
      if (res?.data?.success) {
        setAiSummaryResult(res.data.answer);
        showToast("AI Discussion Summary generated successfully!");
      }
    } catch (err) {
      console.error("AI Summary generation failed:", err);
      showToast("AI Summary generation failed.");
    } finally {
      setAiSummarizing(false);
    }
  };

  // Report Thread
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportModalThreadId || !reportReason.trim()) return;
    setSubmittingReport(true);
    try {
      await reportDiscussionThread(reportModalThreadId, reportReason.trim());
      showToast("Post reported for moderation. Thank you for keeping LearnX safe!");
      setReportModalThreadId(null);
      setReportReason("");
    } catch (err) {
      console.error("Failed to report thread:", err);
      showToast("Failed to submit report.");
    } finally {
      setSubmittingReport(false);
    }
  };

  // Attachment handler for creation
  const handleFileUpload = (e, target = "new") => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`File "${file.name}" exceeds 5MB limit.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const item = {
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
          fileSize: file.size,
          dataUrl: reader.result,
        };
        if (target === "new") {
          setNewAttachments((prev) => [...prev.slice(0, 2), item]);
        } else {
          setReplyAttachments((prev) => [...prev.slice(0, 2), item]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Create Discussion Thread
  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      showToast("Title and question details are required.");
      return;
    }
    setCreatingSubmitting(true);
    try {
      const parsedTags = newTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await createDiscussionThread({
        title: newTitle.trim(),
        content: newContent.trim(),
        subject: newSubject,
        topic: newTopic.trim() || "Core Technical Discussion",
        tags: parsedTags.length > 0 ? parsedTags : [newSubject],
        codeSnippet: newCodeSnippet.trim(),
        codeLanguage: newCodeLanguage,
        attachments: newAttachments,
      });

      if (res?.data?.success) {
        showToast("Discussion question posted successfully!");
        setIsCreateModalOpen(false);
        setNewTitle("");
        setNewContent("");
        setNewTopic("");
        setNewTags("");
        setNewCodeSnippet("");
        setNewAttachments([]);
        fetchThreads(1);
        if (res.data.thread?._id) {
          loadThreadDetails(res.data.thread._id);
        }
      }
    } catch (err) {
      console.error("Failed to create thread:", err);
      showToast(err.response?.data?.message || "Failed to create discussion.");
    } finally {
      setCreatingSubmitting(false);
    }
  };

  // Post Reply (with optional nested reply)
  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!selectedThread || !replyText.trim()) return;
    setSubmittingReply(true);
    try {
      const res = await replyToDiscussionThread(selectedThread._id, {
        content: replyText.trim(),
        codeSnippet: replyCode.trim(),
        codeLanguage: replyCodeLang,
        parentReplyId: replyingToParentId,
        attachments: replyAttachments,
      });

      if (res?.data?.success) {
        showToast("Your reply has been posted (+15 XP)!");
        setReplyText("");
        setReplyCode("");
        setShowReplyCodeBox(false);
        setReplyAttachments([]);
        setReplyingToParentId(null);
        loadThreadDetails(selectedThread._id);
      }
    } catch (err) {
      console.error("Failed to post reply:", err);
      showToast("Failed to post reply.");
    } finally {
      setSubmittingReply(false);
    }
  };

  // View User Profile
  const handleOpenUserProfile = async (userId) => {
    if (!userId) return;
    setViewingProfileUserId(userId);
    setLoadingProfile(true);
    try {
      const res = await getUserCommunityProfile(userId);
      if (res?.data?.success) {
        setUserProfileData(res.data.profile);
      }
    } catch (err) {
      console.error("Failed to fetch user community profile:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-slate-800 flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Peer Discussion Forum</h2>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200/80 text-[10px] font-black text-indigo-700 uppercase">
                Academic Q&A
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Ask deep engineering questions, debug code snippets, and review accepted solutions with peer learners.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setBookmarkedOnly(!bookmarkedOnly);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                bookmarkedOnly
                  ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                  : "bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarkedOnly ? "fill-white" : ""}`} />
              <span>Bookmarks</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ask Question</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Strip */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-100 items-center">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchThreads(1)}
              placeholder="Search by keywords, author, or code concept..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200/90 bg-slate-50/70 text-xs text-slate-800 placeholder-slate-400 font-medium focus:bg-white focus:border-indigo-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  fetchThreads(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Subject Filter */}
          <div className="md:col-span-3">
            <select
              value={subjectFilter}
              onChange={(e) => {
                setSubjectFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200/90 bg-slate-50/70 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none transition-all"
            >
              {SUBJECT_LIST.map((subj) => (
                <option key={subj} value={subj}>
                  {subj === "ALL" ? "All Subjects" : subj}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Tabs */}
          <div className="md:col-span-4 flex items-center bg-slate-100/90 p-1 rounded-xl">
            {[
              { id: "latest", label: "Latest", icon: Clock },
              { id: "popular", label: "Popular", icon: Flame },
              { id: "unanswered", label: "Unanswered", icon: HelpCircle },
              { id: "trending", label: "Trending", icon: TrendingUp },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSortOption(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-black transition-all flex items-center justify-center gap-1 ${
                    sortOption === tab.id
                      ? "bg-white text-indigo-600 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Popular Tags Quick Filters */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[10px] font-black uppercase text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-2.5 h-2.5" /> Popular Tags:
          </span>
          {POPULAR_TAGS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTag(isSelected ? null : tag);
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                #{tag}
              </button>
            );
          })}
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-[10px] font-bold text-rose-600 underline ml-1"
            >
              Clear tag
            </button>
          )}
        </div>
      </div>

      {/* Main Forum Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Thread Listings */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Discussions ({paginationMeta?.total || threads.length})
            </span>
            {paginationMeta && paginationMeta.totalPages > 1 && (
              <span className="text-[11px] text-slate-500 font-bold">
                Page {currentPage} of {paginationMeta.totalPages}
              </span>
            )}
          </div>

          {loading ? (
            <div className="p-10 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-medium">Loading academic discussions...</p>
            </div>
          ) : threads.length === 0 ? (
            <div className="p-10 bg-white rounded-3xl border border-slate-200/90 text-center space-y-3">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-black text-slate-800">No discussions match your filter.</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Be the first to post a question on this subject or clear your search criteria!
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                + Ask Question
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {threads.map((th) => {
                const isSelected = selectedThread?._id === th._id;
                return (
                  <div
                    key={th._id}
                    onClick={() => loadThreadDetails(th._id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative space-y-2.5 ${
                      isSelected
                        ? "bg-indigo-50/70 border-indigo-300 shadow-sm ring-1 ring-indigo-200"
                        : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                  >
                    {th.isPinned && (
                      <span className="absolute -top-2 left-4 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider">
                        📌 Pinned
                      </span>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md">
                          {th.subject}
                        </span>
                        {th.isResolved && (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Solved
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {th.viewCount || 0}
                        </span>
                        <span className="flex items-center gap-1 text-slate-700">
                          <MessageSquare className="w-3 h-3 text-indigo-600" /> {th.replyCount || 0}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 line-clamp-2 leading-snug">
                      {th.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2 font-medium leading-relaxed">
                      {th.content}
                    </p>

                    {/* Tags */}
                    {th.tags && th.tags.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap pt-0.5">
                        {th.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                        {th.tags.length > 3 && (
                          <span className="text-[9px] text-slate-400 font-bold">
                            +{th.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Author & Voting footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 text-[11px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenUserProfile(th.author);
                        }}
                        className="flex items-center gap-1.5 text-slate-700 hover:text-indigo-600 font-bold truncate max-w-[160px]"
                      >
                        <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[9px] font-black">
                          {th.authorName?.charAt(0) || "U"}
                        </div>
                        <span className="truncate">{th.authorName}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {/* Vote score */}
                        <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg font-black text-slate-700">
                          <button
                            onClick={(e) => handleVoteThread(e, th._id, "upvote")}
                            className={`p-0.5 rounded hover:text-indigo-600 ${
                              th.hasUpvoted ? "text-indigo-600 font-black" : ""
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <span>{th.score || 0}</span>
                          <button
                            onClick={(e) => handleVoteThread(e, th._id, "downvote")}
                            className={`p-0.5 rounded hover:text-rose-600 ${
                              th.hasDownvoted ? "text-rose-600 font-black" : ""
                            }`}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => handleBookmark(e, th._id)}
                          className={`p-1 rounded-md text-slate-400 hover:text-amber-500 ${
                            th.isBookmarked ? "text-amber-500" : ""
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${th.isBookmarked ? "fill-amber-500" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pagination controls */}
              {paginationMeta && paginationMeta.totalPages > 1 && (
                <div className="flex items-center justify-between p-2 bg-white rounded-2xl border border-slate-200 text-xs font-bold text-slate-700">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => fetchThreads(currentPage - 1)}
                    className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {paginationMeta.totalPages}
                  </span>
                  <button
                    disabled={!paginationMeta.hasMore}
                    onClick={() => fetchThreads(currentPage + 1)}
                    className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Discussion View */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-6">
          {threadLoading ? (
            <div className="p-16 text-center space-y-2">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-medium">Opening discussion thread...</p>
            </div>
          ) : !selectedThread ? (
            <div className="p-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">Select a Discussion</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click on any thread on the left to read full explanations, copy code snippets, and review accepted answers.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Question Header */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-lg">
                      {selectedThread.subject}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      • {selectedThread.topic || "Core Concept"}
                    </span>
                    {selectedThread.isResolved && (
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Accepted Solution Found
                      </span>
                    )}
                  </div>

                  {/* Actions: AI Digest, Bookmark, Report */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTriggerAISummary}
                      disabled={aiSummarizing}
                      className="px-3 py-1 rounded-xl bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 text-xs font-black flex items-center gap-1.5 transition-all"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>{aiSummarizing ? "Synthesizing..." : "AI Digest"}</span>
                    </button>

                    <button
                      onClick={(e) => handleBookmark(e, selectedThread._id)}
                      className={`p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 ${
                        selectedThread.isBookmarked ? "text-amber-500" : "text-slate-400"
                      }`}
                      title="Bookmark Question"
                    >
                      <Bookmark className={`w-4 h-4 ${selectedThread.isBookmarked ? "fill-amber-500" : ""}`} />
                    </button>

                    <button
                      onClick={() => setReportModalThreadId(selectedThread._id)}
                      className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Report Inappropriate Content"
                    >
                      <Flag className="w-4 h-4" />
                    </button>

                    {/* Integration with LearnX AI Tutor */}
                    <Link
                      to={`/tutor?prompt=${encodeURIComponent(
                        `Help me solve this question from LearnX Discussion: "${selectedThread.title}". Context: ${selectedThread.content}`
                      )}`}
                      className="px-3 py-1 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1 hover:bg-slate-800"
                    >
                      <span>Open in AI Tutor</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <h1 className="text-xl font-black text-slate-900 leading-snug">
                  {selectedThread.title}
                </h1>

                {/* Author Strip */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <button
                    onClick={() => handleOpenUserProfile(selectedThread.author)}
                    className="flex items-center gap-2 hover:text-indigo-600 font-bold"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs">
                      {selectedThread.authorName?.charAt(0) || "U"}
                    </div>
                    <span>{selectedThread.authorName}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-bold uppercase">
                      {selectedThread.authorRole || "student"}
                    </span>
                  </button>

                  <div className="flex items-center gap-3 text-slate-400 font-medium">
                    <span>Asked {new Date(selectedThread.createdAt).toLocaleDateString()}</span>
                    <span>{selectedThread.viewCount || 1} views</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-wrap pt-2">
                  {selectedThread.content}
                </div>

                {/* Code Snippet with Syntax Highlighting & Copy */}
                {selectedThread.codeSnippet && (
                  <div className="pt-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      Code Snippet ({selectedThread.codeLanguage || "javascript"})
                    </span>
                    <CodeBlock
                      code={selectedThread.codeSnippet}
                      language={selectedThread.codeLanguage || "javascript"}
                    />
                  </div>
                )}

                {/* Attachments */}
                {selectedThread.attachments && selectedThread.attachments.length > 0 && (
                  <div className="space-y-1 pt-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">
                      Attachments ({selectedThread.attachments.length})
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedThread.attachments.map((att, idx) => (
                        <a
                          key={idx}
                          href={att.dataUrl}
                          download={att.fileName}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-2"
                        >
                          {att.fileType.includes("image") ? (
                            <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-indigo-600" />
                          )}
                          <span className="truncate max-w-[150px]">{att.fileName}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Question Tags */}
                {selectedThread.tags && selectedThread.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-2">
                    {selectedThread.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Question Vote Counter */}
                <div className="flex items-center gap-3 pt-3">
                  <div className="flex items-center gap-2 bg-slate-100/90 px-3 py-1 rounded-xl text-xs font-black text-slate-800">
                    <button
                      onClick={(e) => handleVoteThread(e, selectedThread._id, "upvote")}
                      className={`flex items-center gap-1 hover:text-indigo-600 ${
                        selectedThread.hasUpvoted ? "text-indigo-600 font-black" : ""
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{selectedThread.upvoteCount || 0}</span>
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={(e) => handleVoteThread(e, selectedThread._id, "downvote")}
                      className={`flex items-center gap-1 hover:text-rose-600 ${
                        selectedThread.hasDownvoted ? "text-rose-600 font-black" : ""
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{selectedThread.downvoteCount || 0}</span>
                    </button>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    Net Score: {selectedThread.score || 0}
                  </span>
                </div>
              </div>

              {/* AI Discussion Summary Box */}
              {aiSummaryResult && (
                <div className="p-4 rounded-2xl bg-violet-50/80 border border-violet-200/90 space-y-2">
                  <div className="flex items-center gap-2 text-violet-800 font-black text-xs">
                    <Bot className="w-4 h-4 text-violet-600" />
                    <span>AI Discussion Synthesis & Key Takeaway</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                    {aiSummaryResult}
                  </p>
                </div>
              )}

              {/* Peer Replies List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Answers & Discussion ({selectedThread.replies?.length || 0})
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold">
                    Marking an answer as accepted rewards the contributor +50 XP
                  </span>
                </div>

                {(!selectedThread.replies || selectedThread.replies.length === 0) ? (
                  <div className="p-8 text-center bg-slate-50/60 rounded-2xl border border-slate-200/80 space-y-2">
                    <p className="text-xs font-bold text-slate-600">No replies yet.</p>
                    <p className="text-[11px] text-slate-400">
                      Know the answer or have a debugging suggestion? Help your peer below!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {selectedThread.replies.map((reply) => {
                      const isNested = !!reply.parentReplyId;
                      return (
                        <div
                          key={reply._id}
                          className={`p-4 rounded-2xl border transition-all space-y-3 ${
                            reply.isAcceptedSolution
                              ? "bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-200"
                              : isNested
                              ? "bg-slate-50/50 border-slate-200 ml-6"
                              : "bg-slate-50/80 border-slate-200/90"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => handleOpenUserProfile(reply.author)}
                              className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-indigo-600"
                            >
                              <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-black">
                                {reply.authorName?.charAt(0) || "P"}
                              </div>
                              <span>{reply.authorName}</span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-600 uppercase">
                                {reply.authorRole || "student"}
                              </span>
                            </button>

                            <div className="flex items-center gap-2">
                              {reply.isAcceptedSolution && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center gap-1 shadow-2xs">
                                  <CheckCircle2 className="w-3 h-3" /> Accepted Solution
                                </span>
                              )}

                              {/* Toggle Accepted Solution Button (for author) */}
                              <button
                                onClick={() => handleAcceptAnswer(reply._id)}
                                className={`text-[10px] font-black px-2.5 py-1 rounded-lg border transition-all ${
                                  reply.isAcceptedSolution
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700"
                                }`}
                              >
                                {reply.isAcceptedSolution ? "Unmark Solution" : "Mark as Accepted"}
                              </button>
                            </div>
                          </div>

                          {/* Reply Content */}
                          <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                            {reply.content}
                          </p>

                          {/* Code Snippet in Reply */}
                          {reply.codeSnippet && (
                            <CodeBlock
                              code={reply.codeSnippet}
                              language={reply.codeLanguage || "javascript"}
                            />
                          )}

                          {/* Attachments in Reply */}
                          {reply.attachments && reply.attachments.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap pt-1">
                              {reply.attachments.map((att, idx) => (
                                <a
                                  key={idx}
                                  href={att.dataUrl}
                                  download={att.fileName}
                                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-700 flex items-center gap-1.5"
                                >
                                  <Paperclip className="w-3 h-3 text-indigo-600" />
                                  <span>{att.fileName}</span>
                                </a>
                              ))}
                            </div>
                          )}

                          {/* Footer: Votes & Nested Reply Trigger */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleVoteReply(reply._id, "upvote")}
                                className={`flex items-center gap-1 font-bold ${
                                  reply.hasUpvoted ? "text-indigo-600" : "text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span>{reply.upvoteCount || 0}</span>
                              </button>
                              <span className="text-slate-300">|</span>
                              <button
                                onClick={() => handleVoteReply(reply._id, "downvote")}
                                className={`flex items-center gap-1 font-bold ${
                                  reply.hasDownvoted ? "text-rose-600" : "text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                <ThumbsDown className="w-3 h-3" />
                                <span>{reply.downvoteCount || 0}</span>
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                setReplyingToParentId(reply._id);
                                showToast(`Replying directly to ${reply.authorName}`);
                              }}
                              className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 font-bold"
                            >
                              <CornerDownRight className="w-3 h-3" />
                              <span>Reply</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Reply Submission Box */}
              <form
                onSubmit={handlePostReply}
                className="bg-slate-50/90 rounded-2xl border border-slate-200 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">
                    {replyingToParentId ? "Write a Nested Reply" : "Post Your Answer / Reply"}
                  </span>
                  {replyingToParentId && (
                    <button
                      type="button"
                      onClick={() => setReplyingToParentId(null)}
                      className="text-[10px] font-bold text-rose-600 hover:underline"
                    >
                      Cancel nested reply
                    </button>
                  )}
                </div>

                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Explain your approach or provide step-by-step resolution..."
                  required
                  rows="3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:border-indigo-400 focus:outline-none transition-all"
                />

                {/* Toggle Code Snippet */}
                {showReplyCodeBox ? (
                  <div className="space-y-2 p-3 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <select
                        value={replyCodeLang}
                        onChange={(e) => setReplyCodeLang(e.target.value)}
                        className="text-xs font-bold px-2 py-1 rounded border border-slate-200"
                      >
                        <option value="javascript">JavaScript / TypeScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="sql">SQL</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowReplyCodeBox(false)}
                        className="text-[10px] text-slate-400 font-bold hover:text-slate-600"
                      >
                        Remove code box
                      </button>
                    </div>
                    <textarea
                      value={replyCode}
                      onChange={(e) => setReplyCode(e.target.value)}
                      placeholder="// Paste syntax-highlighted code here..."
                      rows="4"
                      className="w-full font-mono text-xs p-2 rounded bg-slate-900 text-slate-100"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowReplyCodeBox(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>+ Add Code Snippet</span>
                  </button>
                )}

                {/* Attachments preview */}
                {replyAttachments.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {replyAttachments.map((att, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded bg-white border border-slate-200 text-[10px] font-bold flex items-center gap-1"
                      >
                        <Paperclip className="w-3 h-3 text-indigo-600" />
                        <span className="truncate max-w-[120px]">{att.fileName}</span>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <label className="cursor-pointer text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Attach Image/File</span>
                    <input
                      type="file"
                      accept="image/*,.pdf,.txt,.zip"
                      onChange={(e) => handleFileUpload(e, "reply")}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={submittingReply}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-3 h-3" />
                    <span>{submittingReply ? "Posting..." : "Submit Reply"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Ask Question / Create Discussion Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h3 className="text-base font-black text-slate-900">Ask a Question / Start Discussion</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Be specific so university peers and faculty mentors can provide targeted solutions.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Question Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. How to prevent deadlock in Dining Philosophers problem using resource hierarchy?"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                    Subject *
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    {SUBJECT_LIST.filter((s) => s !== "ALL").map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                    Topic / Sub-area
                  </label>
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="e.g. Concurrency & Semaphores"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Problem Description & Context *
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe your current approach, edge cases encountered, and what you've tried..."
                  required
                  rows="4"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. OS, Concurrency, Deadlocks, Java"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                />
              </div>

              {/* Optional Code Snippet */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-indigo-600" /> Optional Code Snippet
                  </span>
                  <select
                    value={newCodeLanguage}
                    onChange={(e) => setNewCodeLanguage(e.target.value)}
                    className="text-xs font-bold px-2 py-0.5 rounded border border-slate-200 bg-white"
                  >
                    <option value="javascript">JavaScript / TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="sql">SQL</option>
                  </select>
                </div>
                <textarea
                  value={newCodeSnippet}
                  onChange={(e) => setNewCodeSnippet(e.target.value)}
                  placeholder="// Paste your code implementation here..."
                  rows="4"
                  className="w-full font-mono text-xs p-2.5 rounded-xl bg-slate-900 text-slate-100"
                />
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="cursor-pointer text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Upload Screenshot or PDF (max 5MB)</span>
                    <input
                      type="file"
                      accept="image/*,.pdf,.txt,.zip"
                      onChange={(e) => handleFileUpload(e, "new")}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {newAttachments.length}/3 attached
                  </span>
                </div>

                {newAttachments.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {newAttachments.map((att, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 flex items-center gap-1.5"
                      >
                        <FileText className="w-3 h-3" />
                        <span className="truncate max-w-[140px]">{att.fileName}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-xs disabled:opacity-50"
                >
                  {creatingSubmitting ? "Publishing..." : "Post Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Moderation Report Modal */}
      {reportModalThreadId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmitReport}
            className="bg-white rounded-3xl border border-slate-200 w-full max-w-md p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5 text-rose-600">
                <Flag className="w-4 h-4" /> Report Inappropriate Post
              </h3>
              <button
                type="button"
                onClick={() => setReportModalThreadId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Please specify why this question or reply violates LearnX academic community guidelines.
            </p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="e.g. Offensive language, plagiarism, or unrelated spam..."
              required
              rows="3"
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-rose-400 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReportModalThreadId(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingReport}
                className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold disabled:opacity-50"
              >
                {submittingReport ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* User Community Profile Drawer */}
      {viewingProfileUserId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-md p-6 overflow-y-auto space-y-5 shadow-2xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-black uppercase text-slate-400">Contributor Profile</span>
              <button
                onClick={() => {
                  setViewingProfileUserId(null);
                  setUserProfileData(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loadingProfile ? (
              <div className="p-12 text-center space-y-2">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Loading contributor statistics...</p>
              </div>
            ) : userProfileData ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-black">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Community Contributor</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase">
                        Verified Learner
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Questions</span>
                    <span className="text-xl font-black text-slate-900">{userProfileData.questionsAsked}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Answers</span>
                    <span className="text-xl font-black text-slate-900">{userProfileData.repliesGiven}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-[10px] font-black uppercase text-emerald-600 block">Accepted Solutions</span>
                    <span className="text-xl font-black text-emerald-700">{userProfileData.acceptedSolutions}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[10px] font-black uppercase text-amber-600 block">Reputation XP</span>
                    <span className="text-xl font-black text-amber-700">{userProfileData.reputationScore}</span>
                  </div>
                </div>

                {/* Recent questions asked */}
                {userProfileData.recentQuestions && userProfileData.recentQuestions.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                      Recent Questions
                    </span>
                    <div className="space-y-2">
                      {userProfileData.recentQuestions.map((q) => (
                        <div
                          key={q._id}
                          onClick={() => {
                            setViewingProfileUserId(null);
                            loadThreadDetails(q._id);
                          }}
                          className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer space-y-1 text-xs"
                        >
                          <span className="text-[9px] font-black uppercase text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {q.subject}
                          </span>
                          <h5 className="font-bold text-slate-800 line-clamp-1">{q.title}</h5>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default PeerDiscussionForum;
