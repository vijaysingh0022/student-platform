import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  MessageSquare,
  Trophy,
  Code2,
  Sparkles,
  Plus,
  Search,
  CheckCircle2,
  Lock,
  Globe,
  Award,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Share2,
  Send,
  Bot,
  Zap,
  Calendar,
  Layers,
  ChevronRight,
  Bell,
  ThumbsUp,
  Filter,
} from "lucide-react";
import {
  getStudyGroups,
  createStudyGroup,
  getStudyGroupDetails,
  joinStudyGroup,
  addGroupResource,
  assignGroupChallenge,
  getDiscussions,
  createDiscussionThread,
  replyToDiscussionThread,
  upvoteDiscussionThread,
  askAiCommunityAssistant,
  getCommunityLeaderboards,
  getCommunityNotifications,
} from "../services/api.js";

export const CollaborativeNetworkPage = () => {
  // Navigation tabs: 'groups' | 'discussions' | 'challenges' | 'leaderboard'
  const [activeTab, setActiveTab] = useState("groups");

  // Groups state
  const [myGroups, setMyGroups] = useState([]);
  const [discoverGroups, setDiscoverGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [isCreateGroupModal, setIsCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupSubject, setNewGroupSubject] = useState("DSA");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [newGroupIsPrivate, setNewGroupIsPrivate] = useState(false);

  // Discussions state
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [loadingDiscussions, setLoadingDiscussions] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [newThreadSubject, setNewThreadSubject] = useState("DSA");
  const [replyContent, setReplyContent] = useState("");
  const [isCreatingThread, setIsCreatingThread] = useState(false);

  // Leaderboards & Notifications
  const [leaderboards, setLeaderboards] = useState({ topGroups: [], topStudents: [] });
  const [notifications, setNotifications] = useState([]);

  // AI Assistant in Discussion
  const [aiSummary, setAiSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    fetchGroups();
    fetchDiscussions();
    fetchLeaderboards();
    fetchNotifications();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoadingGroups(true);
      const res = await getStudyGroups();
      if (res.data?.success) {
        setMyGroups(res.data.myGroups || []);
        setDiscoverGroups(res.data.discoverGroups || []);
        if (res.data.myGroups?.length > 0 && !selectedGroup) {
          setSelectedGroup(res.data.myGroups[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load study groups:", err);
    } finally {
      setLoadingGroups(false);
    }
  };

  const fetchDiscussions = async (subject = "") => {
    try {
      setLoadingDiscussions(true);
      const res = await getDiscussions(subject ? { subject } : {});
      if (res.data?.success) {
        setThreads(res.data.threads || []);
        if (res.data.threads?.length > 0 && !selectedThread) {
          setSelectedThread(res.data.threads[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load discussions:", err);
    } finally {
      setLoadingDiscussions(false);
    }
  };

  const fetchLeaderboards = async () => {
    try {
      const res = await getCommunityLeaderboards();
      if (res.data?.success) {
        setLeaderboards(res.data);
      }
    } catch (err) {
      console.error("Failed to load leaderboards:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await getCommunityNotifications();
      if (res.data?.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      const res = await createStudyGroup({
        name: newGroupName,
        subject: newGroupSubject,
        description: newGroupDesc,
        isPrivate: newGroupIsPrivate,
      });
      if (res.data?.success) {
        setIsCreateGroupModal(false);
        setNewGroupName("");
        setNewGroupDesc("");
        fetchGroups();
      }
    } catch (err) {
      console.error("Create group error:", err);
      alert(err.response?.data?.message || "Failed to create group.");
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const res = await joinStudyGroup(groupId);
      if (res.data?.success) {
        alert(res.data.message);
        fetchGroups();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join group.");
    }
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    try {
      const res = await createDiscussionThread({
        title: newThreadTitle,
        content: newThreadContent,
        subject: newThreadSubject,
      });
      if (res.data?.success) {
        setIsCreatingThread(false);
        setNewThreadTitle("");
        setNewThreadContent("");
        fetchDiscussions();
      }
    } catch (err) {
      console.error("Create thread error:", err);
    }
  };

  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedThread) return;

    try {
      const res = await replyToDiscussionThread(selectedThread._id, {
        content: replyContent,
      });
      if (res.data?.success) {
        setSelectedThread((prev) => ({
          ...prev,
          replies: res.data.replies,
        }));
        setReplyContent("");
        fetchDiscussions();
      }
    } catch (err) {
      console.error("Reply error:", err);
    }
  };

  const handleUpvoteThread = async (threadId) => {
    try {
      const res = await upvoteDiscussionThread(threadId);
      if (res.data?.success) {
        setThreads((prev) =>
          prev.map((t) =>
            t._id === threadId ? { ...t, upvotes: new Array(res.data.upvotesCount) } : t
          )
        );
        if (selectedThread?._id === threadId) {
          setSelectedThread((prev) => ({ ...prev, upvotes: new Array(res.data.upvotesCount) }));
        }
      }
    } catch (err) {
      console.error("Upvote error:", err);
    }
  };

  const handleSummarizeThread = async (threadId) => {
    try {
      setSummarizing(true);
      const res = await askAiCommunityAssistant({
        action: "summarize_thread",
        threadId,
      });
      if (res.data?.success) {
        setAiSummary(res.data.answer);
      }
    } catch (err) {
      console.error("AI summary error:", err);
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Top Banner Header */}
      <div className="bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LearnX Collaborative Learning Network</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Study Groups, Peer Discussions & Team Challenges
              </h1>
              <p className="text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
                Study together with classmates, tackle weekly coding challenges, discuss tricky interview problems, and climb the group consistency leaderboard.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsCreateGroupModal(true)}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Create Study Group</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: "groups", label: "Study Groups", icon: Users, count: myGroups.length },
              { id: "discussions", label: "Peer Discussions", icon: MessageSquare, count: threads.length },
              { id: "challenges", label: "Team Challenges", icon: Code2, count: 8 },
              { id: "leaderboard", label: "Weekly Leaderboard", icon: Trophy, count: null },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Workspace Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TAB 1: STUDY GROUPS */}
        {activeTab === "groups" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Groups List (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* My Joined Groups */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    My Study Groups ({myGroups.length})
                  </h3>
                </div>

                {myGroups.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-400">
                    You haven't joined any study groups yet. Discover one below or create your own!
                  </div>
                ) : (
                  myGroups.map((g) => {
                    const isSelected = selectedGroup?._id === g._id;
                    return (
                      <div
                        key={g._id}
                        onClick={() => setSelectedGroup(g)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                          isSelected
                            ? "bg-indigo-50/80 border-indigo-400 shadow-xs"
                            : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                            {g.subject}
                          </span>
                          <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-amber-500" />
                            <span>{g.weeklyLearningPoints || 120} Pts</span>
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 truncate">{g.name}</h4>
                        <p className="text-xs text-slate-500 font-medium line-clamp-1">
                          {g.description || "Active collaborative study group."}
                        </p>
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pt-1">
                          <span>{g.memberCount} Members</span>
                          <span>{g.weeklyTargetHours || 5}h weekly target</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Discover Public Groups */}
              <div className="space-y-3 pt-4 border-t border-slate-200/80">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Discover Groups ({discoverGroups.length})
                </h3>

                {discoverGroups.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-400">
                    No other public groups found right now.
                  </div>
                ) : (
                  discoverGroups.map((g) => (
                    <div
                      key={g._id}
                      className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {g.subject}
                        </span>
                        {g.isPrivate ? (
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Private
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Public
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">{g.name}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-2">
                          {g.description || "Collaborative learning group."}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-slate-400">{g.memberCount} Members</span>
                        <button
                          onClick={() => handleJoinGroup(g._id)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                        >
                          {g.isPrivate ? "Request Access" : "Join Group"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Selected Group Workspace (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {!selectedGroup ? (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Select a Study Group</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                    Choose a group on the left to view shared resources, collaborative coding challenges, and announcements.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-6">
                  
                  {/* Group Banner Info */}
                  <div className="pb-6 border-b border-slate-100 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700">
                          {selectedGroup.subject} Study Circle
                        </span>
                        {selectedGroup.isOfficialFacultyGroup && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                            Verified Faculty Group
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-400">
                        {selectedGroup.members?.length || 1} Active Peers
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {selectedGroup.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                      {selectedGroup.description || "Weekly problem solving and concept mastery sessions."}
                    </p>
                  </div>

                  {/* Group Announcements */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Group Bulletin & Targets
                    </h4>
                    {(selectedGroup.announcements || []).map((ann, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-indigo-950">
                          <span>{ann.title}</span>
                          <span className="text-[10px] text-slate-400">{ann.authorName}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed font-medium">{ann.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Active Team Challenges */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Assigned Coding Challenges
                      </h4>
                      <Link
                        to="/coding-lab"
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <span>Open Coding Lab</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {(selectedGroup.challenges || []).length === 0 ? (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-400 text-center">
                        No team challenges currently active. Assign one from the problem bank!
                      </div>
                    ) : (
                      selectedGroup.challenges.map((c, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="min-w-0 space-y-0.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              {c.category} • {c.difficulty}
                            </span>
                            <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {c.title}
                            </h5>
                          </div>
                          <Link
                            to={`/coding-lab?problem=${c.problemId}`}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shrink-0"
                          >
                            Solve Challenge →
                          </Link>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Shared Resources */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Peer Shared Resources
                    </h4>
                    {(selectedGroup.resources || []).length === 0 ? (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-400 text-center">
                        No resources shared yet. Share your notes or code snippets with this group!
                      </div>
                    ) : (
                      selectedGroup.resources.map((r, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-2 shadow-2xs"
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{r.title}</span>
                            <span className="text-[10px] text-slate-400 font-medium">Shared by {r.sharedByName}</span>
                          </div>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {r.type}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PEER DISCUSSIONS */}
        {activeTab === "discussions" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Discussions Feed (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Discussion Threads ({threads.length})
                </h3>
                <button
                  onClick={() => setIsCreatingThread(!isCreatingThread)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ask Question</span>
                </button>
              </div>

              {/* Thread Composer Modal/Inline */}
              {isCreatingThread && (
                <form
                  onSubmit={handleCreateThread}
                  className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-md space-y-3"
                >
                  <h4 className="text-xs font-bold text-slate-900">Start a New Discussion</h4>
                  <input
                    type="text"
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                    placeholder="Topic or Question (e.g. Why is Dijkstra greedy?)"
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200"
                    required
                  />
                  <textarea
                    rows={3}
                    value={newThreadContent}
                    onChange={(e) => setNewThreadContent(e.target.value)}
                    placeholder="Explain what you are trying to understand..."
                    className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200"
                    required
                  />
                  <div className="flex items-center justify-between pt-1">
                    <select
                      value={newThreadSubject}
                      onChange={(e) => setNewThreadSubject(e.target.value)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                    >
                      {["DSA", "DBMS", "OS", "CN", "OOP", "SYSTEM_DESIGN", "WEB_DEV"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCreatingThread(false)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                      >
                        Publish
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Threads List */}
              <div className="space-y-2.5">
                {threads.map((t) => {
                  const isSelected = selectedThread?._id === t._id;
                  return (
                    <div
                      key={t._id}
                      onClick={() => {
                        setSelectedThread(t);
                        setAiSummary("");
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? "bg-indigo-50/80 border-indigo-400 shadow-xs"
                          : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {t.subject}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          {t.replies?.length || 0} Replies
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{t.title}</h4>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2">{t.content}</p>
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pt-1">
                        <span>By {t.authorName}</span>
                        <div className="flex items-center gap-1 text-indigo-600">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{t.upvotes?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Thread Active View (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {!selectedThread ? (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-16 text-center text-xs text-slate-400">
                  Select a discussion on the left to view peer replies and ask the AI Tutor.
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-6">
                  
                  {/* Thread Question */}
                  <div className="pb-5 border-b border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700">
                        {selectedThread.subject}
                      </span>
                      <button
                        onClick={() => handleUpvoteThread(selectedThread._id)}
                        className="px-3 py-1 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-xs font-bold text-indigo-700 flex items-center gap-1.5 transition-colors"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Upvote ({selectedThread.upvotes?.length || 0})</span>
                      </button>
                    </div>

                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      {selectedThread.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                      {selectedThread.content}
                    </p>

                    <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 font-bold">
                      <span>Posted by {selectedThread.authorName}</span>
                      <button
                        onClick={() => handleSummarizeThread(selectedThread._id)}
                        disabled={summarizing}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>{summarizing ? "AI Summarizing..." : "Summarize with AI"}</span>
                      </button>
                    </div>
                  </div>

                  {/* AI Summary Box */}
                  {aiSummary && (
                    <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs space-y-2">
                      <div className="flex items-center gap-1.5 text-indigo-800 font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Discussion Synthesis</span>
                      </div>
                      <p className="text-indigo-950 font-medium leading-relaxed whitespace-pre-line">
                        {aiSummary}
                      </p>
                    </div>
                  )}

                  {/* Replies List */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Peer Replies ({(selectedThread.replies || []).length})
                    </h4>

                    {(selectedThread.replies || []).length === 0 ? (
                      <div className="p-6 rounded-2xl bg-slate-50 text-center text-xs text-slate-400 font-medium">
                        No replies yet. Be the first to share an answer or explanation!
                      </div>
                    ) : (
                      selectedThread.replies.map((rep, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between font-bold text-slate-800">
                            <span>{rep.authorName}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(rep.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                            {rep.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Reply Form */}
                  <form onSubmit={handlePostReply} className="space-y-2 pt-2 border-t border-slate-100">
                    <textarea
                      rows={3}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your explanation or code solution..."
                      className="w-full px-4 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900"
                      required
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Post Reply</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TEAM CODING CHALLENGES */}
        {activeTab === "challenges" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Weekly Team Coding Sprint
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Collaborate with peers to solve curated Data Structures & Algorithms challenges.
                  </p>
                </div>
                <Link
                  to="/coding-lab"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shrink-0"
                >
                  Open Full Coding Lab →
                </Link>
              </div>

              {/* Challenge Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {[
                  { id: "two-sum", title: "Two Sum", diff: "Easy", cat: "Arrays", points: 50 },
                  { id: "contains-duplicate", title: "Contains Duplicate", diff: "Easy", cat: "Arrays", points: 40 },
                  { id: "valid-anagram", title: "Valid Anagram", diff: "Easy", cat: "Hashing", points: 50 },
                  { id: "group-anagrams", title: "Group Anagrams", diff: "Medium", cat: "Hashing", points: 80 },
                  { id: "top-k-frequent-elements", title: "Top K Frequent Elements", diff: "Medium", cat: "Heaps", points: 90 },
                  { id: "product-of-array-except-self", title: "Product of Array Except Self", diff: "Medium", cat: "Arrays", points: 85 },
                ].map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 hover:border-indigo-300 hover:bg-white transition-all space-y-3 group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                        {p.cat}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                          p.diff === "Easy"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {p.diff}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {p.title}
                    </h4>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <span className="font-bold text-indigo-600">+{p.points} Group Pts</span>
                      <Link
                        to={`/coding-lab?problem=${p.id}`}
                        className="font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                      >
                        <span>Solve</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LEADERBOARD */}
        {activeTab === "leaderboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Top Study Circles */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-black text-slate-900">Top Study Circles</h3>
                </div>
                <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Weekly Points
                </span>
              </div>

              <div className="space-y-2.5">
                {(leaderboards.topGroups || []).map((grp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                          idx === 0
                            ? "bg-amber-400 text-amber-950 shadow-xs"
                            : idx === 1
                            ? "bg-slate-300 text-slate-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{grp.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {grp.memberCount} Peers • {grp.subject}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-indigo-600">
                      {grp.weeklyLearningPoints || 150} Pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Individual Peers */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-black text-slate-900">Peer Learning Consistency</h3>
                </div>
                <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Rankings
                </span>
              </div>

              <div className="space-y-2.5">
                {(leaderboards.topStudents || []).map((stu, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-xs">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{stu.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{stu.course || "B.Tech CSE"}</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-600">
                      {stu.xp || 450} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* CREATE GROUP MODAL */}
      {isCreateGroupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900">Create a New Study Group</h3>
            <form onSubmit={handleCreateGroup} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Group Name</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. FAANG System Design Circle"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject Focus</label>
                <select
                  value={newGroupSubject}
                  onChange={(e) => setNewGroupSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  {["DSA", "DBMS", "OS", "CN", "OOP", "SYSTEM_DESIGN", "WEB_DEV", "APTITUDE"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Target</label>
                <textarea
                  rows={2}
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Weekly goals and study schedule..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="priv"
                  checked={newGroupIsPrivate}
                  onChange={(e) => setNewGroupIsPrivate(e.target.checked)}
                />
                <label htmlFor="priv" className="font-semibold text-slate-600">
                  Private Group (requires admin approval to join)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateGroupModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold shadow-xs"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborativeNetworkPage;

