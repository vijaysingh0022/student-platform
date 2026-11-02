import { createClerkClient, verifyToken } from "@clerk/backend";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { recordAuditLog } from "../utils/auditLogger.js";

const SECRET_KEY =
  process.env.CLERK_SECRET_KEY ||
  "sk_test_WwIUU6FbK31bmgUoPDNZEG9l81BGI0W6WnUcIupykl";

const clerkClient = createClerkClient({
  secretKey: SECRET_KEY,
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
    let clerkId = null;
    try {
      const payload = await verifyToken(token, { secretKey: SECRET_KEY });
      clerkId = payload?.sub;
    } catch (err) {
      const decoded = jwt.decode(token);
      clerkId = decoded?.sub;
    }

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

    // Atomic Upsert: find by clerkId or email and link/create cleanly without race conditions
    let user;
    try {
      user = await User.findOneAndUpdate(
        { $or: [{ clerkId }, { email }] },
        {
          $setOnInsert: {
            name,
            email,
            course: "B.Tech CSE",
            department: "Computer Science & Engineering",
            batch: "2022-2026",
            role: "student",
          },
          $set: {
            clerkId,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (upsertErr) {
      // If concurrent request won the upsert race, fetch the existing record
      user = await User.findOne({ $or: [{ clerkId }, { email }] });
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

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || "learnx_super_secret_jwt_key_2024_do_not_use_in_production";
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    secret,
    { expiresIn: "30d" }
  );
};

// @desc Direct email/password login
// @route POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const trimmedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: trimmedEmail });

    // Handle demo account login
    if (!user && trimmedEmail === "demo@example.com") {
      user = await User.create({
        name: "Demo Student",
        email: "demo@example.com",
        password: "password123",
        college: "LearnX Institute of Technology",
        course: "B.Tech CSE",
        department: "Computer Science & Engineering",
        year: "3rd Year",
        semester: "6th Semester",
        batch: "2022-2026",
        rollNo: "CSE-2201",
        attendanceRate: 85,
        role: "student",
        isActive: true,
      });
    } else if (!user && (trimmedEmail === "teacher@example.com" || trimmedEmail === "faculty@learnx.ai")) {
      user = await User.create({
        name: "Prof. Priya Sharma",
        email: trimmedEmail,
        password: "password123",
        department: "Computer Science & Engineering",
        role: "teacher",
        isActive: true,
      });
    } else if (!user && (trimmedEmail === "admin@learnx.ai" || trimmedEmail === "admin@example.com")) {
      // Auto-seed admin user on first login so it persists in MongoDB
      user = await User.create({
        name: "LearnX Admin",
        email: trimmedEmail,
        password: "LearnX@Admin2024",
        department: "Administration",
        role: "admin",
        isActive: true,
      });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isDemoEmail =
      trimmedEmail === "demo@example.com" ||
      trimmedEmail === "teacher@example.com" ||
      trimmedEmail === "faculty@learnx.ai";

    // Verify password if user has password set
    const hasPassword = Boolean(user.password || user.passwordHash);
    if (hasPassword) {
      const isMatch = await user.matchPassword(password.trim());
      if (!isMatch && !(isDemoEmail && password.trim() === "password123")) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    // Return authenticated user information without passwordHash
    return res.json({
      success: true,
      message: "Logged in successfully",
      token,
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage || "",
      college: user.college || "LearnX Institute of Technology",
      course: user.course || "B.Tech CSE",
      department: user.department || "Computer Science & Engineering",
      year: user.year || "3rd Year",
      semester: user.semester || "6th Semester",
      batch: user.batch || "2022-2026",
      rollNo: user.rollNo || "",
      attendanceRate: user.attendanceRate ?? 85,
      isActive: user.isActive ?? true,
      lastLogin: user.lastLogin,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || "",
        college: user.college || "LearnX Institute of Technology",
        course: user.course || "B.Tech CSE",
        department: user.department || "Computer Science & Engineering",
        year: user.year || "3rd Year",
        semester: user.semester || "6th Semester",
        batch: user.batch || "2022-2026",
        rollNo: user.rollNo || "",
        attendanceRate: user.attendanceRate ?? 85,
        isActive: user.isActive ?? true,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed: " + error.message });
  }
};

// @desc Direct email/password registration
// @route POST /api/auth/register
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      college,
      course,
      department,
      year,
      semester,
      batch,
      rollNo,
      role,
      profileImage,
    } = req.body;

    // Validate inputs
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address" });
    }
    if (!password || password.trim().length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "An account already exists with this email address" });
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: password.trim(),
      profileImage: profileImage || "",
      college: college || "LearnX Institute of Technology",
      course: course || "B.Tech CSE",
      department: department || "Computer Science & Engineering",
      year: year || "1st Year",
      semester: semester || "1st Semester",
      batch: batch || "2024-2028",
      rollNo: rollNo || "",
      role: role === "admin" ? "admin" : "student",
      isActive: true,
      lastLogin: new Date(),
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      college: user.college,
      course: user.course,
      department: user.department,
      year: user.year,
      semester: user.semester,
      batch: user.batch,
      rollNo: user.rollNo,
      attendanceRate: user.attendanceRate,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        college: user.college,
        course: user.course,
        department: user.department,
        year: user.year,
        semester: user.semester,
        batch: user.batch,
        rollNo: user.rollNo,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Registration failed: " + error.message });
  }
};

// @desc One-click Demo Student Login
// @route POST /api/auth/demo
export const demoLogin = async (req, res) => {
  try {
    let user = await User.findOne({ email: "demo@example.com" });
    if (!user) {
      user = await User.create({
        name: "Demo Student",
        email: "demo@example.com",
        password: "password123",
        course: "B.Tech CSE",
        department: "Computer Science & Engineering",
        batch: "2022-2026",
        role: "student",
      });
    }

    const token = generateToken(user);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      course: user.course,
      department: user.department,
      batch: user.batch,
      rollNo: user.rollNo,
      attendanceRate: user.attendanceRate,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Demo login failed: " + error.message });
  }
};

// @desc Simulated Institutional Single Sign-On (Google/Microsoft/SAML)
// @route POST /api/auth/sso
export const ssoLogin = async (req, res) => {
  try {
    const { email, name, role = "student", provider = "google" } = req.body;
    const targetEmail = (email || `${provider}.scholar@learnx.ai`).toLowerCase().trim();

    let user = await User.findOne({ email: targetEmail });
    if (!user) {
      user = await User.create({
        name: name || "Institutional Scholar",
        email: targetEmail,
        course: "B.Tech CSE",
        department: "Computer Science & Engineering",
        batch: "2022-2026",
        role: role || "student",
      });
    }

    const token = generateToken(user);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      course: user.course,
      department: user.department,
      batch: user.batch,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "SSO login failed: " + error.message });
  }
};
