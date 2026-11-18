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
  FileText,
  Link2,
  Clock,
  Shield,
  UserCheck,
  UserX,
  Copy,
  LogOut,
  Target,
} from "lucide-react";
import {
  getStudyGroups,
  createStudyGroup,
  getStudyGroupDetails,
  joinStudyGroup,
  leaveStudyGroup,
  manageGroupMember,
  addGroupResource,
  addGroupAnnouncement,
  assignGroupChallenge,
  getDiscussions,
  createDiscussionThread,
  replyToDiscussionThread,
  upvoteDiscussionThread,
  askAiCommunityAssistant,
  getCommunityLeaderboards,
  getCommunityNotifications,
} from "../services/api.js";
import { PeerDiscussionForum } from "../components/PeerDiscussionForum.jsx";

export const CollaborativeNetworkPage = () => {
  // Navigation tabs: 'groups' | 'discussions' | 'challenges' | 'leaderboard'
  const [activeTab, setActiveTab] = useState("groups");

  // Groups state
  const [myGroups, setMyGroups] = useState([]);
  const [discoverGroups, setDiscoverGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("ALL");

  // Group Detail Tabs: 'overview' | 'members' | 'discussions' | 'resources' | 'challenges'
  const [groupDetailTab, setGroupDetailTab] = useState("overview");

  // Create group modal state
  const [isCreateGroupModal, setIsCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupSubject, setNewGroupSubject] = useState("DSA");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [newGroupGoals, setNewGroupGoals] = useState("");
  const [newGroupTargetHours, setNewGroupTargetHours] = useState(5);
  const [newGroupIsPrivate, setNewGroupIsPrivate] = useState(false);
  const [newGroupTags, setNewGroupTags] = useState("");

  // Resource sharing state
  const [isResourceModal, setIsResourceModal] = useState(false);
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceType, setResourceType] = useState("notes");
  const [resourceUrl, setResourceUrl] = useState("");

  // Announcement state
  const [isAnnouncementModal, setIsAnnouncementModal] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");

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
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    fetchGroups();
    fetchLeaderboards();
    fetchNotifications();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoadingGroups(true);
      const res = await getStudyGroups({ subject: subjectFilter, search: searchQuery });
      if (res.data?.success) {
        setMyGroups(res.data.myGroups || []);
        setDiscoverGroups(res.data.discoverGroups || []);
        if (!selectedGroup && res.data.myGroups?.length > 0) {
          fetchSingleGroup(res.data.myGroups[0]._id);
        }
      }
    } catch (err) {
      console.error("Failed to load study groups:", err);
    } finally {
      setLoadingGroups(false);
    }
  };

  const fetchSingleGroup = async (groupId) => {
    try {
      const res = await getStudyGroupDetails(groupId);
      if (res.data?.success && res.data?.group) {
        setSelectedGroup(res.data.group);
      }
    } catch (err) {
      console.error("Failed to load group details:", err);
    }
  };

  const fetchDiscussions = async () => {
    try {
      setLoadingDiscussions(true);
      const res = await getDiscussions({ subject: subjectFilter });
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
        setLeaderboards({
          topGroups: res.data.topGroups || [],
          topStudents: res.data.topStudents || [],
        });
      }
    } catch (err) {}
  };

  const fetchNotifications = async () => {
    try {
      const res = await getCommunityNotifications();
      if (res.data?.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {}
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      const goalsArr = newGroupGoals.split(",").map((g) => g.trim()).filter(Boolean);
      const tagsArr = newGroupTags.split(",").map((t) => t.trim()).filter(Boolean);

      const res = await createStudyGroup({
        name: newGroupName.trim(),
        subject: newGroupSubject,
        description: newGroupDesc.trim(),
        learningGoals: goalsArr,
        weeklyTargetHours: Number(newGroupTargetHours) || 5,
        isPrivate: newGroupIsPrivate,
        tags: tagsArr,
      });

      if (res.data?.success && res.data?.group) {
        setIsCreateGroupModal(false);
        setNewGroupName("");
        setNewGroupDesc("");
        setNewGroupGoals("");
        setNewGroupTags("");
        await fetchGroups();
        setSelectedGroup(res.data.group);
      }
    } catch (err) {
      console.error("Failed to create study group:", err);
    }
  };

  const handleJoinGroup = async (groupId, inviteCode = "") => {
    try {
      const res = await joinStudyGroup(groupId, { inviteCode });
      if (res.data?.success) {
        await fetchGroups();
        if (res.data.group) setSelectedGroup(res.data.group);
      }
    } catch (err) {
      console.error("Failed to join group:", err);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to leave this study group?")) return;
    try {
      const res = await leaveStudyGroup(groupId);
      if (res.data?.success) {
        setSelectedGroup(null);
        await fetchGroups();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to leave group.");
    }
  };

  const handleMemberAction = async (targetUserId, action, newRole = "") => {
    if (!selectedGroup) return;
    try {
      const res = await manageGroupMember(selectedGroup._id, {
        targetUserId,
        action,
        newRole,
      });
      if (res.data?.success && res.data?.group) {
        setSelectedGroup(res.data.group);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Action failed.");
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!selectedGroup || !resourceTitle.trim() || !resourceUrl.trim()) return;

    try {
      const res = await addGroupResource(selectedGroup._id, {
        title: resourceTitle.trim(),
        type: resourceType,
        urlOrSnippet: resourceUrl.trim(),
      });
      if (res.data?.success) {
        setIsResourceModal(false);
        setResourceTitle("");
        setResourceUrl("");
        fetchSingleGroup(selectedGroup._id);
      }
    } catch (err) {
      console.error("Add resource error:", err);
    }
  };

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!selectedGroup || !announcementTitle.trim() || !announcementMessage.trim()) return;

    try {
      const res = await addGroupAnnouncement(selectedGroup._id, {
        title: announcementTitle.trim(),
        message: announcementMessage.trim(),
      });
      if (res.data?.success) {
        setIsAnnouncementModal(false);
        setAnnouncementTitle("");
        setAnnouncementMessage("");
        fetchSingleGroup(selectedGroup._id);
      }
    } catch (err) {
      console.error("Add announcement error:", err);
    }
  };

  const copyInviteLink = () => {
    if (!selectedGroup) return;
    const url = `${window.location.origin}/community?group=${selectedGroup._id}&code=${selectedGroup.inviteCode || ""}`;
    navigator.clipboard.writeText(url);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 font-sans text-slate-900">
      
      {/* ── TOP HEADER ── */}
      <div className="bg-white border-b border-slate-200/90 shadow-2xs sticky top-0 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>LearnX Collaborative Learning Management System</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Peer Study Circles & Collaborative Network
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Team problem-solving, shared resources, peer code challenges, and academic Q&A bulletin.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsCreateGroupModal(true)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create Study Circle</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 border-t border-slate-100 pt-3">
            {[
              { id: "groups", label: "Study Groups", icon: Users },
              { id: "discussions", label: "Peer Discussions", icon: MessageSquare },
              { id: "challenges", label: "Team Challenges", icon: Code2 },
              { id: "leaderboard", label: "Consistency Leaderboard", icon: Trophy },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === "discussions") fetchDiscussions();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7">
        
        {/* ── 1. STUDY GROUPS TAB ── */}
        {activeTab === "groups" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            
            {/* Left: Study Groups List (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Search & Subject Filters */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchGroups()}
                    placeholder="Search groups, subjects, goals..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                  {["ALL", "DSA", "DBMS", "OS", "CN", "SYSTEM_DESIGN"].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSubjectFilter(s);
                        setTimeout(fetchGroups, 50);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                        subjectFilter === s ? "bg-slate-900 text-white shadow-2xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* My Joined Groups */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  My Enrolled Circles ({myGroups.length})
                </h3>

                {myGroups.length === 0 ? (
                  <p className="text-xs text-slate-400 p-3 bg-white rounded-2xl border border-slate-200/80">
                    You haven't joined any study circles yet. Discover open circles below!
                  </p>
                ) : (
                  myGroups.map((g) => {
                    const isSelected = selectedGroup?._id === g._id;
                    return (
                      <div
                        key={g._id}
                        onClick={() => fetchSingleGroup(g._id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? "bg-indigo-50/80 border-indigo-400 shadow-2xs"
                            : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                            {g.subject}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">
                            {g.memberCount} Members
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 truncate">{g.name}</h4>
                        <p className="text-xs text-slate-500 font-medium line-clamp-2">{g.description}</p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Discoverable Public/Private Circles */}
              <div className="space-y-2.5 pt-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Discover Open Circles ({discoverGroups.length})
                </h3>

                {discoverGroups.map((g) => (
                  <div
                    key={g._id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
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

                    <h4 className="text-sm font-black text-slate-900">{g.name}</h4>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2">{g.description}</p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-slate-400">{g.memberCount} Members</span>
                      <button
                        onClick={() => handleJoinGroup(g._id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                      >
                        {g.isPrivate ? "Request Access" : "Join Group"}
                      </button>
                    </div>
                  </div>
                ))}
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
                    Choose an enrolled circle on the left or create a new circle to begin collaborating.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-6">
                  
                  {/* Group Header Banner */}
                  <div className="pb-5 border-b border-slate-100 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700">
                          {selectedGroup.subject} Study Circle
                        </span>
                        {selectedGroup.isPrivate ? (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Private Circle
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Public Circle
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={copyInviteLink}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
                          title="Copy secure invitation link"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedInvite ? "Copied Link!" : "Invite Members"}</span>
                        </button>
                        <button
                          onClick={() => handleLeaveGroup(selectedGroup._id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Leave Group"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {selectedGroup.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                      {selectedGroup.description || "Weekly problem solving and concept mastery sessions."}
                    </p>

                    {/* Tags & Weekly Targets */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(selectedGroup.learningGoals || []).map((goal, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600">
                            🎯 {goal}
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md">
                        Weekly Target: {selectedGroup.weeklyTargetHours || 5} Hours
                      </span>
                    </div>
                  </div>

                  {/* Group Detail Inner Tabs */}
                  <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3 overflow-x-auto no-scrollbar">
                    {[
                      { id: "overview", label: "Overview & Bulletin" },
                      { id: "members", label: `Members (${selectedGroup.members?.length || 0})` },
                      { id: "resources", label: `Shared Resources (${selectedGroup.resources?.length || 0})` },
                      { id: "challenges", label: `Challenges (${selectedGroup.challenges?.length || 0})` },
                      { id: "activity", label: "Activity Timeline" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setGroupDetailTab(tab.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                          groupDetailTab === tab.id
                            ? "bg-slate-900 text-white shadow-2xs"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* ── TAB: OVERVIEW & BULLETIN ── */}
                  {groupDetailTab === "overview" && (
                    <div className="space-y-6">
                      {/* KPI Summary */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center">
                          <span className="text-[10px] font-bold text-indigo-600 block uppercase">Weekly Points</span>
                          <span className="text-xl font-black text-indigo-700">{selectedGroup.weeklyLearningPoints || 120}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                          <span className="text-[10px] font-bold text-emerald-600 block uppercase">Solved Challenges</span>
                          <span className="text-xl font-black text-emerald-700">{selectedGroup.totalChallengesCompleted || 4}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 text-center">
                          <span className="text-[10px] font-bold text-amber-600 block uppercase">Study Target</span>
                          <span className="text-xl font-black text-amber-700">{selectedGroup.weeklyTargetHours || 5}h/wk</span>
                        </div>
                      </div>

                      {/* Announcements */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                            Group Announcements & Bulletin
                          </h4>
                          <button
                            onClick={() => setIsAnnouncementModal(true)}
                            className="text-xs font-bold text-indigo-600 hover:underline"
                          >
                            + Post Announcement
                          </button>
                        </div>

                        {(selectedGroup.announcements || []).map((ann, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs space-y-1">
                            <div className="flex items-center justify-between font-bold text-indigo-950">
                              <span>{ann.title}</span>
                              <span className="text-[10px] text-slate-400">{ann.authorName}</span>
                            </div>
                            <p className="text-slate-600 font-medium leading-relaxed">{ann.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── TAB: MEMBERS MANAGEMENT ── */}
                  {groupDetailTab === "members" && (
                    <div className="space-y-5">
                      {/* Pending Join Requests (If Private & Admin) */}
                      {selectedGroup.pendingJoinRequests?.length > 0 && (
                        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2.5">
                          <span className="text-xs font-black uppercase tracking-wider text-amber-800 block">
                            Pending Join Requests ({selectedGroup.pendingJoinRequests.length})
                          </span>
                          <div className="space-y-2">
                            {selectedGroup.pendingJoinRequests.map((req, idx) => (
                              <div key={idx} className="p-3 rounded-xl bg-white border border-amber-200 flex items-center justify-between text-xs">
                                <div>
                                  <span className="font-bold text-slate-900 block">{req.name}</span>
                                  <span className="text-[10px] text-slate-400">{req.email}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleMemberAction(req.user, "accept_request")}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleMemberAction(req.user, "reject_request")}
                                    className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[10px]"
                                  >
                                    Decline
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Active Members Roster */}
                      <div className="space-y-2">
                        {(selectedGroup.members || []).map((m) => (
                          <div
                            key={m._id}
                            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                                {m.name?.charAt(0) || "U"}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-900">{m.name}</span>
                                  <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                                    {m.role}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400">
                                  Reputation: {m.reputationPoints || 20} pts • {m.contributionsCount || 0} contributions
                                </span>
                              </div>
                            </div>

                            {/* Admin Controls */}
                            {m.role !== "creator" && (
                              <div className="flex items-center gap-1">
                                {m.role === "member" ? (
                                  <button
                                    onClick={() => handleMemberAction(m.user, "update_role", "admin")}
                                    className="px-2 py-1 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold"
                                  >
                                    Promote
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleMemberAction(m.user, "update_role", "member")}
                                    className="px-2 py-1 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold"
                                  >
                                    Demote
                                  </button>
                                )}
                                <button
                                  onClick={() => handleMemberAction(m.user, "remove_member")}
                                  className="p-1 text-slate-400 hover:text-rose-600"
                                  title="Remove Member"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── TAB: SHARED RESOURCES ── */}
                  {groupDetailTab === "resources" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                          Shared Notes & Learning Materials
                        </span>
                        <button
                          onClick={() => setIsResourceModal(true)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Share Resource</span>
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {(selectedGroup.resources || []).length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-8">No shared resources yet. Share study notes or PDFs with your circle!</p>
                        ) : (
                          selectedGroup.resources.map((res) => (
                            <div
                              key={res._id}
                              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                                    {res.type}
                                  </span>
                                  <h5 className="font-bold text-slate-900">{res.title}</h5>
                                </div>
                                <p className="text-[11px] text-slate-500 font-mono truncate max-w-md">{res.urlOrSnippet}</p>
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium">Shared by {res.sharedByName}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── TAB: CODING CHALLENGES ── */}
                  {groupDetailTab === "challenges" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                          Team Coding Challenges
                        </span>
                        <Link
                          to="/coding-lab"
                          className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          <span>Open Coding Lab</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      <div className="space-y-2.5">
                        {(selectedGroup.challenges || []).length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-8">No assigned challenges. Challenges can be assigned by team members from Coding Lab.</p>
                        ) : (
                          selectedGroup.challenges.map((c) => (
                            <div key={c._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                              <div>
                                <span className="font-bold text-slate-900 block">{c.title}</span>
                                <span className="text-[10px] text-slate-400">{c.difficulty} • {c.category}</span>
                              </div>
                              <Link
                                to={`/coding-lab?problem=${c.problemId}`}
                                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                              >
                                Solve
                              </Link>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── TAB: ACTIVITY TIMELINE ── */}
                  {groupDetailTab === "activity" && (
                    <div className="space-y-3">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                        Recent Group Activity Timeline
                      </span>
                      <div className="space-y-2">
                        {(selectedGroup.activities || []).slice(0, 10).map((act, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                            <span className="text-slate-700 font-medium">{act.description}</span>
                            <span className="text-[10px] text-slate-400">{new Date(act.createdAt).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

          </div>
        )}

        {/* ── 2. DISCUSSIONS TAB ── */}
        {activeTab === "discussions" && (
          <PeerDiscussionForum />
        )}

        {/* ── 3. TEAM CHALLENGES TAB ── */}
        {activeTab === "challenges" && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Collaborative Coding Challenges</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Solve LeetCode-style algorithmic challenges assigned by your study circles to climb weekly group consistency rankings.
            </p>
            <Link
              to="/coding-lab"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
            >
              <span>Launch Coding Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* ── 4. LEADERBOARD TAB ── */}
        {activeTab === "leaderboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Top Weekly Study Circles</span>
              </h3>
              <div className="space-y-2">
                {leaderboards.topGroups.map((g, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-black text-[11px] text-slate-700">
                        {g.rank}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 block">{g.name}</span>
                        <span className="text-[10px] text-slate-400">{g.subject} • {g.memberCount} Members</span>
                      </div>
                    </div>
                    <span className="font-black text-indigo-600">{g.weeklyLearningPoints} pts</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Top Active Peers</span>
              </h3>
              <div className="space-y-2">
                {leaderboards.topStudents.map((s, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-black text-[11px] text-slate-700">
                        {s.rank}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 block">{s.name}</span>
                        <span className="text-[10px] text-slate-400">{s.department || "CSE"}</span>
                      </div>
                    </div>
                    <span className="font-black text-emerald-600">{s.xp || 450} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── CREATE GROUP MODAL ── */}
      {isCreateGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">Create Study Circle</h3>
            <form onSubmit={handleCreateGroup} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Group Name</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Distributed Systems & DBMS Study Circle"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject Focus</label>
                <select
                  value={newGroupSubject}
                  onChange={(e) => setNewGroupSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  {["DSA", "DBMS", "OS", "CN", "OOP", "SYSTEM_DESIGN", "WEB_DEV"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Goals, meeting rhythm, and curriculum topics..."
                  rows="2"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Learning Goals (comma-separated)</label>
                <input
                  type="text"
                  value={newGroupGoals}
                  onChange={(e) => setNewGroupGoals(e.target.value)}
                  placeholder="e.g. 3NF Normalization, Transaction ACID, Concurrency"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Private Circle</span>
                  <span className="text-[11px] text-slate-400">Requires invitation code or admin approval</span>
                </div>
                <input
                  type="checkbox"
                  checked={newGroupIsPrivate}
                  onChange={(e) => setNewGroupIsPrivate(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateGroupModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── SHARE RESOURCE MODAL ── */}
      {isResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">Share Study Resource</h3>
            <form onSubmit={handleAddResource} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  placeholder="e.g. DBMS Normalization Cheatsheet"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Type</label>
                <select
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  <option value="notes">Notes / Summary</option>
                  <option value="pdf">PDF Document Link</option>
                  <option value="link">Web Resource Link</option>
                  <option value="code">Code Repository / Snippet</option>
                  <option value="cheatsheet">Formula Cheatsheet</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">URL or Note Content</label>
                <textarea
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                  placeholder="Paste URL, markdown notes, or code snippet..."
                  required
                  rows="3"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResourceModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Share With Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── POST ANNOUNCEMENT MODAL ── */}
      {isAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">Post Group Announcement</h3>
            <form onSubmit={handleAddAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="e.g. Saturday 6PM Mock OA Practice Session"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Message</label>
                <textarea
                  value={announcementMessage}
                  onChange={(e) => setAnnouncementMessage(e.target.value)}
                  placeholder="Share details and expectations..."
                  required
                  rows="3"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAnnouncementModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Post Bulletin
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
