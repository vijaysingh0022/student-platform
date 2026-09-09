import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    userEmail: { type: String, default: "anonymous@system" },
    userRole: { type: String, default: "guest" },
    action: {
      type: String,
      required: true,
      index: true,
      enum: [
        "AUTH_LOGIN",
        "AUTH_REGISTER",
        "AUTH_LOGOUT",
        "SSO_LOGIN",
        "RBAC_ROLE_CHANGE",
        "DATA_EXPORT",
        "DATA_PURGE",
        "QUIZ_GENERATED",
        "QUIZ_EVALUATED",
        "SECURITY_ALERT",
        "ACCESS_DENIED",
        "CONSENT_UPDATED",
      ],
    },
    resource: { type: String, default: "/" },
    method: { type: String, default: "GET" },
    statusCode: { type: Number, default: 200 },
    ipAddress: { type: String, default: "127.0.0.1" },
    userAgent: { type: String, default: "Internal/Platform" },
    status: {
      type: String,
      enum: ["SUCCESS", "WARNING", "FAILED"],
      default: "SUCCESS",
      index: true,
    },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Auto-expire raw logs after 90 days for GDPR compliance and storage hygiene
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
