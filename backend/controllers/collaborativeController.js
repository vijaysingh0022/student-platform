import StudyGroup from "../models/StudyGroup.js";
import DiscussionThread from "../models/DiscussionThread.js";
import PeerNotification from "../models/PeerNotification.js";
import User from "../models/User.js";
import { CODING_PROBLEMS } from "../data/codingProblems.js";
import { getAIClient, getAIModel } from "../config/ai.js";
import crypto from "crypto";

/**
 * 1. STUDY GROUPS CONTROLLER
 */

// @desc Get all discoverable groups & user joined groups with search/tags
// @route GET /api/community/groups
export const getGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const { subject, search, tag } = req.query;

    const filter = {};
    if (subject && subject !== "ALL") filter.subject = subject;
    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const allGroups = await StudyGroup.find(filter)
      .sort({ weeklyLearningPoints: -1, createdAt: -1 })
      .lean();

    const myGroups = [];
    const discoverGroups = [];

    allGroups.forEach((g) => {
      const isMember = g.members?.some((m) => String(m.user) === String(userId));
      const isPending = g.pendingJoinRequests?.some((p) => String(p.user) === String(userId));
      const groupData = {
        ...g,
        memberCount: g.members?.length || 0,
        isMember,
        isPending,
      };

      if (isMember) {
        myGroups.push(groupData);
      } else {
        discoverGroups.push(groupData);
      }
    });

    res.status(200).json({
      success: true,
      myGroups,
      discoverGroups,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create a new study group
// @route POST /api/community/groups
export const createGroup = async (req, res) => {
  try {
    const {
      name,
      description,
      subject = "DSA",
      tags = [],
      learningGoals = [],
      weeklyTargetHours = 5,
      isPrivate = false,
    } = req.body;
    const userId = req.user._id;
    const userName = req.user.name || "Student";
    const userEmail = req.user.email || "";
    const isFaculty = req.user.role === "faculty" || req.user.role === "admin";

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Group name is required." });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now().toString().slice(-4);
    const inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    const newGroup = await StudyGroup.create({
      name: name.trim(),
      slug,
      description,
      subject,
      tags: Array.isArray(tags) ? tags : [subject.toLowerCase()],
      learningGoals,
      weeklyTargetHours,
      isPrivate,
      inviteCode,
      isOfficialFacultyGroup: isFaculty,
      facultyMentor: isFaculty ? userId : null,
      creator: userId,
      members: [
        {
          user: userId,
          name: userName,
          email: userEmail,
          role: isFaculty ? "faculty_mentor" : "creator",
          reputationPoints: 50,
          contributionsCount: 1,
        },
      ],
      resources: [],
      challenges: [],
      activities: [
        {
          type: "member_joined",
          user: userId,
          userName,
          description: `Created study group "${name.trim()}"`,
        },
      ],
      announcements: [
        {
          title: "Welcome to " + name.trim() + "!",
          message: "Group created. Check weekly study targets and discuss tough concepts here.",
          authorName: userName,
          authorId: userId,
        },
      ],
    });

    res.status(201).json({ success: true, group: newGroup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single group details with authorization
// @route GET /api/community/groups/:id
export const getGroupDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: "Study group not found." });
    }

    const memberRecord = group.members?.find((m) => String(m.user) === String(userId));
    const isMember = !!memberRecord;
    const userRole = memberRecord?.role || (String(group.creator) === String(userId) ? "creator" : "guest");

    if (group.isPrivate && !isMember && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        isPrivate: true,
        message: "This is a private study group. Please request access or join via an invite link.",
      });
    }

    res.status(200).json({ success: true, group, isMember, userRole });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Join group directly (public or via invite code) or request access (private)
// @route POST /api/community/groups/:id/join
export const joinGroup = async (req, res) => {
  try {
    const userId = req.user._id;
    const userName = req.user.name || "Student";
    const userEmail = req.user.email || "";
    const { inviteCode } = req.body;

    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: "Group not found." });

    const alreadyMember = group.members.some((m) => String(m.user) === String(userId));
    if (alreadyMember) return res.status(400).json({ success: false, message: "Already a member of this group." });

    const isInviteCodeValid = inviteCode && group.inviteCode && inviteCode.trim().toUpperCase() === group.inviteCode;

    // Private group without valid invite code -> pending request
    if (group.isPrivate && !isInviteCodeValid) {
      const alreadyPending = group.pendingJoinRequests.some((p) => String(p.user) === String(userId));
      if (!alreadyPending) {
        group.pendingJoinRequests.push({ user: userId, name: userName, email: userEmail });
        await group.save();

        await PeerNotification.create({
          recipient: group.creator,
          sender: userId,
          senderName: userName,
          type: "join_request",
          title: "New Join Request",
          message: `${userName} requested to join private group "${group.name}".`,
          groupId: group._id,
        });
      }
      return res.status(200).json({ success: true, message: "Join request submitted to group admin." });
    }

    // Join directly
    group.members.push({
      user: userId,
      name: userName,
      email: userEmail,
      role: "member",
      reputationPoints: 20,
    });
    group.weeklyLearningPoints += 25;
    group.activities.push({
      type: "member_joined",
      user: userId,
      userName,
      description: `${userName} joined the group.`,
    });
    await group.save();

    res.status(200).json({ success: true, message: "Joined group successfully!", group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Leave a study group
// @route POST /api/community/groups/:id/leave
export const leaveGroup = async (req, res) => {
  try {
    const userId = req.user._id;
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: "Group not found." });

    if (String(group.creator) === String(userId)) {
      return res.status(400).json({ success: false, message: "Group owner cannot leave. Transfer ownership or delete group." });
    }

    group.members = group.members.filter((m) => String(m.user) !== String(userId));
    await group.save();

    res.status(200).json({ success: true, message: "Left group successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Manage group membership (accept/reject pending, promote/demote role, remove member)
// @route POST /api/community/groups/:id/members/manage
export const manageGroupMember = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetUserId, action, newRole } = req.body;
    // action: 'accept_request' | 'reject_request' | 'update_role' | 'remove_member'

    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: "Group not found." });

    const requesterMember = group.members.find((m) => String(m.user) === String(userId));
    const isOwnerOrAdmin = String(group.creator) === String(userId) || requesterMember?.role === "admin";

    if (!isOwnerOrAdmin && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only group creator or admins can manage members." });
    }

    if (action === "accept_request") {
      const reqIndex = group.pendingJoinRequests.findIndex((p) => String(p.user) === String(targetUserId));
      if (reqIndex === -1) return res.status(404).json({ success: false, message: "Join request not found." });

      const pending = group.pendingJoinRequests[reqIndex];
      group.pendingJoinRequests.splice(reqIndex, 1);
      group.members.push({
        user: pending.user,
        name: pending.name,
        email: pending.email,
        role: "member",
        reputationPoints: 20,
      });
      group.activities.push({
        type: "member_joined",
        user: pending.user,
        userName: pending.name,
        description: `Join request approved for ${pending.name}.`,
      });
      await group.save();

      return res.status(200).json({ success: true, message: "Member accepted into group.", group });
    }

    if (action === "reject_request") {
      group.pendingJoinRequests = group.pendingJoinRequests.filter((p) => String(p.user) !== String(targetUserId));
      await group.save();
      return res.status(200).json({ success: true, message: "Join request rejected.", group });
    }

    if (action === "update_role" && newRole) {
      const member = group.members.find((m) => String(m.user) === String(targetUserId));
      if (!member) return res.status(404).json({ success: false, message: "Member not found." });
      member.role = newRole;
      group.activities.push({
        type: "role_updated",
        user: targetUserId,
        userName: member.name,
        description: `${member.name}'s role updated to ${newRole}.`,
      });
      await group.save();
      return res.status(200).json({ success: true, message: "Member role updated.", group });
    }

    if (action === "remove_member") {
      if (String(targetUserId) === String(group.creator)) {
        return res.status(400).json({ success: false, message: "Cannot remove the group creator." });
      }
      group.members = group.members.filter((m) => String(m.user) !== String(targetUserId));
      await group.save();
      return res.status(200).json({ success: true, message: "Member removed from group.", group });
    }

    res.status(400).json({ success: false, message: "Invalid action." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Post shared notes, PDF, or resources
// @route POST /api/community/groups/:id/resources
export const addGroupResource = async (req, res) => {
  try {
    const { title, type = "notes", urlOrSnippet, tags = [] } = req.body;
    const userId = req.user._id;
    const userName = req.user.name || "Peer";

    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: "Group not found." });

    const isMember = group.members.some((m) => String(m.user) === String(userId));
    if (!isMember) return res.status(403).json({ success: false, message: "Must be a member to share resources." });

    group.resources.push({
      title,
      type,
      urlOrSnippet,
      tags,
      sharedBy: userId,
      sharedByName: userName,
    });
    group.weeklyLearningPoints += 15;

    // Track contribution
    const member = group.members.find((m) => String(m.user) === String(userId));
    if (member) {
      member.contributionsCount = (member.contributionsCount || 0) + 1;
      member.reputationPoints += 15;
    }

    group.activities.push({
      type: "resource_shared",
      user: userId,
      userName,
      description: `Shared resource: "${title}" (${type})`,
    });

    await group.save();
    res.status(200).json({ success: true, resources: group.resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Post an announcement to group bulletin
// @route POST /api/community/groups/:id/announcements
export const addGroupAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;
    const userId = req.user._id;
    const userName = req.user.name || "Admin";

    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: "Group not found." });

    const member = group.members.find((m) => String(m.user) === String(userId));
    const isAuthorized = String(group.creator) === String(userId) || member?.role === "admin" || member?.role === "faculty_mentor";

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: "Only group creator or admins can post announcements." });
    }

    group.announcements.unshift({
      title,
      message,
      authorName: userName,
      authorId: userId,
      createdAt: new Date(),
    });

    group.activities.push({
      type: "announcement_posted",
      user: userId,
      userName,
      description: `Posted announcement: "${title}"`,
    });

    await group.save();
    res.status(200).json({ success: true, announcements: group.announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. COLLABORATIVE CODING CHALLENGES
 */

// @desc Assign a coding problem to study group
// @route POST /api/community/groups/:id/challenges
export const assignGroupChallenge = async (req, res) => {
  try {
    const { problemId, deadline } = req.body;
    const userId = req.user._id;
    const userName = req.user.name || "Peer";
    const group = await StudyGroup.findById(req.params.id);

    if (!group) return res.status(404).json({ success: false, message: "Group not found." });

    const problem = CODING_PROBLEMS.find((p) => p.id === problemId) || CODING_PROBLEMS[0];

    const challenge = {
      problemId: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      category: problem.category,
      assignedBy: userId,
      deadline: deadline ? new Date(deadline) : new Date(Date.now() + 7 * 86400000),
      completions: [],
      status: "active",
    };

    group.challenges.push(challenge);
    group.activities.push({
      type: "challenge_assigned",
      user: userId,
      userName,
      description: `Assigned challenge: "${problem.title}" (${problem.difficulty})`,
    });
    await group.save();

    for (const m of group.members) {
      if (String(m.user) !== String(userId)) {
        await PeerNotification.create({
          recipient: m.user,
          sender: userId,
          senderName: userName,
          type: "group_challenge",
          title: "New Team Challenge",
          message: `Group "${group.name}" has a new challenge: "${problem.title}"`,
          groupId: group._id,
        });
      }
    }

    res.status(200).json({ success: true, challenges: group.challenges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. DISCUSSIONS CONTROLLER
 */

export const getDiscussions = async (req, res) => {
  try {
    const { subject, search, tag } = req.query;
    const filter = {};
    if (subject && subject !== "ALL") filter.subject = subject;
    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const threads = await DiscussionThread.find(filter)
      .sort({ upvotes: -1, createdAt: -1 })
      .limit(30)
      .lean();

    res.status(200).json({ success: true, threads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDiscussion = async (req, res) => {
  try {
    const { title, content, subject = "DSA", tags = [], codeSnippet, groupId } = req.body;
    const userId = req.user._id;
    const userName = req.user.name || "Student";

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required." });
    }

    const thread = await DiscussionThread.create({
      title,
      content,
      subject,
      tags,
      codeSnippet: codeSnippet || "",
      groupId: groupId || null,
      author: userId,
      authorName: userName,
      replies: [],
    });

    res.status(201).json({ success: true, thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const replyToDiscussion = async (req, res) => {
  try {
    const { content, codeSnippet } = req.body;
    const userId = req.user._id;
    const userName = req.user.name || "Peer";

    const thread = await DiscussionThread.findById(req.params.id);
    if (!thread) return res.status(404).json({ success: false, message: "Thread not found." });

    const reply = {
      author: userId,
      authorName: userName,
      content,
      codeSnippet: codeSnippet || "",
      upvotes: 0,
      createdAt: new Date(),
    };

    thread.replies.push(reply);
    await thread.save();

    if (String(thread.author) !== String(userId)) {
      await PeerNotification.create({
        recipient: thread.author,
        sender: userId,
        senderName: userName,
        type: "discussion_reply",
        title: "New Reply to Your Discussion",
        message: `${userName} replied: "${content.slice(0, 80)}..."`,
        threadId: thread._id,
      });
    }

    res.status(200).json({ success: true, replies: thread.replies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const upvoteDiscussion = async (req, res) => {
  try {
    const userId = req.user._id;
    const thread = await DiscussionThread.findById(req.params.id);
    if (!thread) return res.status(404).json({ success: false, message: "Thread not found." });

    const alreadyUpvoted = thread.upvotedBy.some((id) => String(id) === String(userId));
    if (alreadyUpvoted) {
      thread.upvotedBy = thread.upvotedBy.filter((id) => String(id) !== String(userId));
      thread.upvotes = Math.max(0, thread.upvotes - 1);
    } else {
      thread.upvotedBy.push(userId);
      thread.upvotes += 1;
    }

    await thread.save();
    res.status(200).json({ success: true, upvotes: thread.upvotes, upvoted: !alreadyUpvoted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. AI GROUP ASSISTANT
 */

export const aiCommunityAssistant = async (req, res) => {
  try {
    const { action, threadId, prompt: userPrompt } = req.body;
    const openai = getAIClient();
    const model = getAIModel();

    if (!openai) {
      return res.status(200).json({
        success: true,
        answer: "AI Group Assistant is ready. Connect OpenAI API key for live summarization and concept tutoring.",
      });
    }

    let prompt = "";
    if (action === "summarize_thread" && threadId) {
      const thread = await DiscussionThread.findById(threadId);
      if (!thread) return res.status(404).json({ success: false, message: "Thread not found." });

      prompt = `Summarize this peer academic discussion into 3 key takeaways and a definitive solution:
Title: "${thread.title}"
Question: "${thread.content}"
Replies:
${thread.replies.map((r) => `- ${r.authorName}: ${r.content}`).join("\n")}`;
    } else {
      prompt = `You are the LearnX AI Community Tutor. Provide an encouraging, crystal-clear explanation for students:
Query: "${userPrompt}"`;
    }

    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const answer = completion.choices[0]?.message?.content || "";
    res.status(200).json({ success: true, answer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 5. LEADERBOARD & NOTIFICATIONS
 */

export const getLeaderboards = async (req, res) => {
  try {
    const topGroups = await StudyGroup.find({ isPrivate: false })
      .sort({ weeklyLearningPoints: -1 })
      .limit(5)
      .select("name subject weeklyLearningPoints totalChallengesCompleted members bannerColor")
      .lean();

    const topStudents = await User.find({ role: "student" })
      .sort({ xp: -1 })
      .limit(10)
      .select("name course department xp level streak")
      .lean();

    res.status(200).json({
      success: true,
      topGroups: topGroups.map((g, idx) => ({
        rank: idx + 1,
        ...g,
        memberCount: g.members?.length || 0,
      })),
      topStudents: topStudents.map((s, idx) => ({
        rank: idx + 1,
        ...s,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await PeerNotification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
