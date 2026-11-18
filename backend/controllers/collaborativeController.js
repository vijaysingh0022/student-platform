import StudyGroup from "../models/StudyGroup.js";
import DiscussionThread from "../models/DiscussionThread.js";
import PeerNotification from "../models/PeerNotification.js";
import User from "../models/User.js";
import { CODING_PROBLEMS } from "../data/codingProblems.js";
import { getAIClient, getAIModel } from "../config/ai.js";

/**
 * 1. STUDY GROUPS CONTROLLER
 */

// @desc Get all discoverable groups & user joined groups
// @route GET /api/community/groups
export const getGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const { subject, search } = req.query;

    const filter = {};
    if (subject && subject !== "ALL") filter.subject = subject;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
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
    const { name, description, subject = "DSA", learningGoals = [], weeklyTargetHours = 5, isPrivate = false } = req.body;
    const userId = req.user._id;
    const userName = req.user.name || "Student";
    const userEmail = req.user.email || "";
    const isFaculty = req.user.role === "faculty" || req.user.role === "admin";

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Group name is required." });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now().toString().slice(-4);

    const newGroup = await StudyGroup.create({
      name: name.trim(),
      slug,
      description,
      subject,
      learningGoals,
      weeklyTargetHours,
      isPrivate,
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
        },
      ],
      resources: [],
      challenges: [],
      announcements: [
        {
          title: "Welcome to " + name.trim() + "!",
          message: "Group created. Check weekly study targets and discuss tough concepts here.",
          authorName: userName,
        },
      ],
    });

    res.status(201).json({ success: true, group: newGroup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single group details with resources, challenges & leaderboard
// @route GET /api/community/groups/:id
export const getGroupDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: "Study group not found." });
    }

    const isMember = group.members?.some((m) => String(m.user) === String(userId));
    if (group.isPrivate && !isMember && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        isPrivate: true,
        message: "This is a private study group. Please request access to view workspace.",
      });
    }

    res.status(200).json({ success: true, group, isMember });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Join public group or request access to private group
// @route POST /api/community/groups/:id/join
export const joinGroup = async (req, res) => {
  try {
    const userId = req.user._id;
    const userName = req.user.name || "Student";
    const userEmail = req.user.email || "";
    const group = await StudyGroup.findById(req.params.id);

    if (!group) return res.status(404).json({ success: false, message: "Group not found." });

    const alreadyMember = group.members.some((m) => String(m.user) === String(userId));
    if (alreadyMember) return res.status(400).json({ success: false, message: "Already a member." });

    if (group.isPrivate) {
      // Pending request
      const alreadyPending = group.pendingJoinRequests.some((p) => String(p.user) === String(userId));
      if (!alreadyPending) {
        group.pendingJoinRequests.push({ user: userId, name: userName, email: userEmail });
        await group.save();

        // Notify group creator
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

    // Public join
    group.members.push({
      user: userId,
      name: userName,
      email: userEmail,
      role: "member",
    });
    group.weeklyLearningPoints += 25; // group bonus
    await group.save();

    res.status(200).json({ success: true, message: "Joined group successfully!", group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Post an announcement or shared resource to group
// @route POST /api/community/groups/:id/resources
export const addGroupResource = async (req, res) => {
  try {
    const { title, type = "notes", urlOrSnippet } = req.body;
    const userId = req.user._id;
    const userName = req.user.name || "Peer";

    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: "Group not found." });

    group.resources.push({
      title,
      type,
      urlOrSnippet,
      sharedBy: userId,
      sharedByName: userName,
    });
    group.weeklyLearningPoints += 15;
    await group.save();

    res.status(200).json({ success: true, resources: group.resources });
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
    await group.save();

    // Notify all members
    for (const m of group.members) {
      if (String(m.user) !== String(userId)) {
        await PeerNotification.create({
          recipient: m.user,
          sender: userId,
          senderName: group.name,
          type: "challenge_assigned",
          title: `New Team Challenge: ${problem.title}`,
          message: `Your study group was assigned a new ${problem.difficulty} coding challenge.`,
          link: `/coding-lab?problem=${problem.id}`,
          groupId: group._id,
        });
      }
    }

    res.status(200).json({ success: true, challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. DISCUSSION SYSTEM CONTROLLER
 */

// @desc Get discussion threads with search and tag filters
// @route GET /api/community/discussions
export const getDiscussions = async (req, res) => {
  try {
    const { subject, tag, search, groupId } = req.query;
    const filter = { isReported: false };

    if (groupId) filter.group = groupId;
    if (subject && subject !== "ALL") filter.subject = subject;
    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const threads = await DiscussionThread.find(filter)
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(30)
      .lean();

    res.status(200).json({ success: true, threads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create a new discussion thread
// @route POST /api/community/discussions
export const createDiscussion = async (req, res) => {
  try {
    const { title, content, subject = "DSA", topic = "General", codeSnippet = "", codeLanguage = "javascript", tags = [], groupId } = req.body;
    const userId = req.user._id;
    const userName = req.user.name || "Student";
    const userRole = req.user.role || "student";

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required." });
    }

    const thread = await DiscussionThread.create({
      title: title.trim(),
      content: content.trim(),
      subject,
      topic,
      codeSnippet,
      codeLanguage,
      tags,
      group: groupId || null,
      author: userId,
      authorName: userName,
      authorRole: userRole,
    });

    res.status(201).json({ success: true, thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Reply to a discussion thread
// @route POST /api/community/discussions/:id/replies
export const replyToDiscussion = async (req, res) => {
  try {
    const { content, codeSnippet = "", codeLanguage = "javascript" } = req.body;
    const userId = req.user._id;
    const userName = req.user.name || "Student";
    const userRole = req.user.role || "student";

    const thread = await DiscussionThread.findById(req.params.id);
    if (!thread) return res.status(404).json({ success: false, message: "Thread not found." });

    const reply = {
      author: userId,
      authorName: userName,
      authorRole: userRole,
      content: content.trim(),
      codeSnippet,
      codeLanguage,
      upvotes: [],
    };

    thread.replies.push(reply);
    await thread.save();

    // Notify author if not self
    if (String(thread.author) !== String(userId)) {
      await PeerNotification.create({
        recipient: thread.author,
        sender: userId,
        senderName: userName,
        type: "new_reply",
        title: "New Response on your Question",
        message: `${userName} replied to "${thread.title}".`,
        link: `/community?thread=${thread._id}`,
      });
    }

    res.status(200).json({ success: true, replies: thread.replies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Upvote discussion or reply
// @route POST /api/community/discussions/:id/upvote
export const upvoteDiscussion = async (req, res) => {
  try {
    const userId = req.user._id;
    const thread = await DiscussionThread.findById(req.params.id);
    if (!thread) return res.status(404).json({ success: false, message: "Thread not found." });

    const alreadyUpvoted = thread.upvotes.some((u) => String(u) === String(userId));
    if (alreadyUpvoted) {
      thread.upvotes = thread.upvotes.filter((u) => String(u) !== String(userId));
    } else {
      thread.upvotes.push(userId);
    }

    await thread.save();
    res.status(200).json({ success: true, upvotesCount: thread.upvotes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. AI GROUP ASSISTANT
 */

// @desc Ask AI to summarize group discussion or explain complex query
// @route POST /api/community/ai-assistant
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

// @desc Get community weekly & challenge leaderboards
// @route GET /api/community/leaderboards
export const getLeaderboards = async (req, res) => {
  try {
    // 1. Top Study Groups
    const topGroups = await StudyGroup.find({ isPrivate: false })
      .sort({ weeklyLearningPoints: -1 })
      .limit(5)
      .select("name subject weeklyLearningPoints totalChallengesCompleted members bannerColor")
      .lean();

    // 2. Individual Peer Rankings
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

// @desc Get current student peer notifications
// @route GET /api/community/notifications
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

