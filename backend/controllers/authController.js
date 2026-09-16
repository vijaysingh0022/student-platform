import { createClerkClient } from "@clerk/backend";
import User from "../models/User.js";
import { recordAuditLog } from "../utils/auditLogger.js";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// @desc  Sync Clerk user with MongoDB — find-or-create on first sign-in
// @route POST /api/auth/sync
// @access Requires valid Clerk Bearer token
export const syncUser = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No Clerk token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { sub: clerkId } = await clerkClient.verifyToken(token);

    if (!clerkId) {
      return res.status(401).json({ message: "Invalid Clerk token" });
    }

    // Fetch the full Clerk user record to get email, name, etc.
    const clerkUser = await clerkClient.users.getUser(clerkId);

    const email =
      clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ||
      clerkUser.emailAddresses[0]?.emailAddress;

    const name =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      email?.split("@")[0] ||
      "LearnX User";

    // Upsert: find by clerkId or email (handles migration of pre-Clerk accounts)
    let user = await User.findOne({ $or: [{ clerkId }, { email }] });

    if (!user) {
      user = await User.create({
        clerkId,
        name,
        email,
        course: "B.Tech CSE",
        department: "Computer Science & Engineering",
        batch: "2022-2026",
        role: "student",
      });

      await recordAuditLog({
        req,
        userId: user._id,
        userEmail: user.email,
        userRole: user.role,
        action: "AUTH_CLERK_PROVISION",
        status: "SUCCESS",
        statusCode: 201,
        details: { clerkId, source: "clerk_sync" },
      });
    } else if (!user.clerkId) {
      // Link existing account (pre-Clerk user signing in with same email)
      user.clerkId = clerkId;
      await user.save();

      await recordAuditLog({
        req,
        userId: user._id,
        userEmail: user.email,
        userRole: user.role,
        action: "AUTH_CLERK_LINK",
        status: "SUCCESS",
        statusCode: 200,
        details: { clerkId, source: "clerk_link_existing" },
      });
    }

    return res.json({
      _id: user._id,
      clerkId: user.clerkId,
      name: user.name,
      email: user.email,
      role: user.role,
      course: user.course,
      department: user.department,
      batch: user.batch,
      rollNo: user.rollNo,
      attendanceRate: user.attendanceRate,
    });
  } catch (error) {
    console.error("syncUser error:", error);
    return res.status(500).json({ message: "Sync failed: " + error.message });
  }
};

// @desc Get current authenticated user session
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
