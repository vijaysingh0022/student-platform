import AuditLog from "../models/AuditLog.js";

/**
 * Persist an immutable audit log entry in MongoDB
 */
export const recordAuditLog = async ({
  req = null,
  userId = null,
  userEmail = null,
  userRole = null,
  action,
  status = "SUCCESS",
  statusCode = 200,
  resource = null,
  method = null,
  details = {},
}) => {
  try {
    const ipAddress =
      req?.headers["x-forwarded-for"]?.split(",")[0] ||
      req?.socket?.remoteAddress ||
      req?.ip ||
      "127.0.0.1";

    const userAgent = req?.headers["user-agent"] || "System/Client";
    const resolvedResource = resource || req?.originalUrl || "/";
    const resolvedMethod = method || req?.method || "GET";

    const resolvedUserId = userId || req?.user?._id || null;
    const resolvedEmail = userEmail || req?.user?.email || "anonymous@system";
    const resolvedRole = userRole || req?.user?.role || "guest";

    await AuditLog.create({
      userId: resolvedUserId,
      userEmail: resolvedEmail,
      userRole: resolvedRole,
      action,
      resource: resolvedResource,
      method: resolvedMethod,
      statusCode,
      ipAddress,
      userAgent,
      status,
      details,
    });
  } catch (err) {
    // Audit logging should never bring down the primary API workflow
    console.error("Audit log creation error:", err.message);
  }
};
