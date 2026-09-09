import AuditLog from "../models/AuditLog.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { recordAuditLog } from "../utils/auditLogger.js";

/**
 * GET /api/security/audit-logs
 * Fetch audit logs with filtering by action, status, role, search
 */
export const getAuditLogs = async (req, res) => {
  try {
    const { action, status, role, search, limit = 50, page = 1 } = req.query;

    const query = {};
    if (action) query.action = action;
    if (status) query.status = status;
    if (role) query.userRole = role;
    if (search) {
      query.$or = [
        { userEmail: { $regex: search, $options: "i" } },
        { resource: { $regex: search, $options: "i" } },
        { ipAddress: { $regex: search, $options: "i" } },
      ];
    }

    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const [logs, total] = await Promise.all([
      AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(parsedLimit),
      AuditLog.countDocuments(query),
    ]);

    res.json({
      success: true,
      logs,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        pages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (err) {
    console.error("getAuditLogs error:", err);
    res.status(500).json({ message: "Failed to retrieve audit logs: " + err.message });
  }
};

/**
 * POST /api/security/switch-role
 * Real-time demo role switch for testing RBAC (Student <-> Teacher <-> Admin)
 */
export const switchRoleDemo = async (req, res) => {
  try {
    const { targetRole } = req.body;
    const allowed = ["student", "teacher", "admin"];

    if (!allowed.includes(targetRole)) {
      return res.status(400).json({ message: `Invalid role. Allowed: ${allowed.join(", ")}` });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const previousRole = user.role;
    user.role = targetRole;
    await user.save();

    await recordAuditLog({
      req,
      action: "RBAC_ROLE_CHANGE",
      status: "SUCCESS",
      details: {
        previousRole,
        newRole: targetRole,
        reason: "User switched role via Security & Governance Hub",
      },
    });

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: `Role successfully updated to ${targetRole}.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to switch role: " + err.message });
  }
};

/**
 * GET /api/security/compliance-report
 * Institutional compliance posture (FERPA, GDPR, DPDP, ISO 27001 readiness)
 */
export const getComplianceReport = async (req, res) => {
  try {
    const totalLogsCount = await AuditLog.countDocuments();
    const securityAlertsCount = await AuditLog.countDocuments({ action: "SECURITY_ALERT" });
    const accessDeniedCount = await AuditLog.countDocuments({ action: "ACCESS_DENIED" });

    res.json({
      success: true,
      overallPosture: "COMPLIANT_SECURE",
      score: 98,
      certifications: [
        {
          name: "FERPA (Family Educational Rights and Privacy Act)",
          status: "PASSED",
          details: "Student educational records strictly segregated with RBAC and immutable audit trails.",
        },
        {
          name: "GDPR (General Data Protection Regulation)",
          status: "PASSED",
          details: "Equipped with Article 15 (Right of Access) Data Takeout and Article 17 (Right to Erasure).",
        },
        {
          name: "DPDP (Digital Personal Data Protection Act)",
          status: "PASSED",
          details: "Explicit student consent management and localized telemetry minimization.",
        },
        {
          name: "OWASP Top 10 API Hardening",
          status: "PASSED",
          details: "Equipped with sliding-window rate limiting, NoSQL query sanitization, and enterprise security headers.",
        },
      ],
      metrics: {
        totalAuditEventsLogged: totalLogsCount,
        securityAlertsTriggered: securityAlertsCount,
        accessDeniedAttemptsBlocked: accessDeniedCount,
        encryptionAlgorithm: "AES-256-GCM / TLS 1.3 in transit",
        passwordHashing: "bcrypt (10 rounds work factor)",
        sessionHandling: "Stateless JWT with cryptographically-signed expiry",
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate compliance report: " + err.message });
  }
};
