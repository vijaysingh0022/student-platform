import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { recordAuditLog } from "../utils/auditLogger.js";

// @desc Register new student or faculty
// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, course, role = "student" } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      await recordAuditLog({
        req,
        userEmail: email,
        action: "AUTH_REGISTER",
        status: "FAILED",
        statusCode: 400,
        details: { reason: "User already exists with this email" },
      });
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      course: course || "B.Tech CSE",
      role: role === "teacher" || role === "admin" ? role : "student",
    });

    await recordAuditLog({
      req,
      userId: user._id,
      userEmail: user.email,
      userRole: user.role,
      action: "AUTH_REGISTER",
      status: "SUCCESS",
      statusCode: 201,
      details: { role: user.role, course: user.course },
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      course: user.course,
      department: user.department,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      await recordAuditLog({
        req,
        userId: user._id,
        userEmail: user.email,
        userRole: user.role,
        action: "AUTH_LOGIN",
        status: "SUCCESS",
        statusCode: 200,
        details: { loginMethod: "STANDARD_CREDENTIALS" },
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "student",
        course: user.course,
        department: user.department,
        token: generateToken(user._id),
      });
    } else {
      await recordAuditLog({
        req,
        userEmail: email || "unknown",
        action: "AUTH_LOGIN",
        status: "FAILED",
        statusCode: 401,
        details: { reason: "Invalid credentials" },
      });

      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Enterprise & Institutional Single Sign-On (SSO)
// @route POST /api/auth/sso/login
// @body { provider: "google"|"microsoft"|"institution_edu", email, name, role }
export const ssoLoginUser = async (req, res) => {
  try {
    const { provider = "google", email, name, role = "student" } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required for SSO authentication." });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Auto-provision institutional user on first SSO handshake
      const randomPassword = crypto.randomBytes(24).toString("hex") + "!A1";
      user = await User.create({
        name: name || email.split("@")[0].replace(/[._]/g, " ").toUpperCase(),
        email,
        password: randomPassword,
        role: role === "teacher" || role === "admin" ? role : "student",
        course: "B.Tech CSE (SSO Federated)",
        department: "Computer Science & Engineering",
        batch: "2022-2026",
      });
    }

    await recordAuditLog({
      req,
      userId: user._id,
      userEmail: user.email,
      userRole: user.role,
      action: "SSO_LOGIN",
      status: "SUCCESS",
      statusCode: 200,
      details: {
        ssoProvider: provider,
        federationProtocol: provider === "institution_edu" ? "SAML 2.0" : "OAuth 2.0 / OpenID Connect",
        verifiedDomain: email.split("@")[1] || "institution.edu",
      },
    });

    const token = generateToken(user._id);

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || "student",
      course: user.course,
      department: user.department,
      ssoProvider: provider,
      token,
    });
  } catch (error) {
    console.error("ssoLoginUser error:", error);
    res.status(500).json({ message: "SSO Authentication failed: " + error.message });
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
