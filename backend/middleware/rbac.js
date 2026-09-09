import { recordAuditLog } from "../utils/auditLogger.js";

/**
 * RBAC Middleware to restrict access based on user role
 * @param  {...string} roles - e.g. "admin", "teacher", "student"
 */
export const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required before role verification." });
    }

    const userRole = req.user.role || "student";

    if (!roles.includes(userRole)) {
      await recordAuditLog({
        req,
        action: "ACCESS_DENIED",
        status: "FAILED",
        statusCode: 403,
        details: {
          requiredRoles: roles,
          actualRole: userRole,
          reason: "RBAC authorization failure: Insufficient privileges",
        },
      });

      return res.status(403).json({
        message: `Forbidden: Access requires [${roles.join(", ")}] role privilege. Your current role is [${userRole}].`,
        requiredRoles: roles,
        yourRole: userRole,
      });
    }

    next();
  };
};

export default authorizeRoles;
