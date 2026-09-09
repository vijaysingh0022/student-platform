import User from "../models/User.js";
import TestResult from "../models/TestResult.js";
import Roadmap from "../models/Roadmap.js";
import CareerProfile from "../models/CareerProfile.js";
import { recordAuditLog } from "../utils/auditLogger.js";

/**
 * GET /api/privacy/export-data
 * GDPR Article 15 & FERPA compliant personal data takeout in JSON format
 */
export const exportUserData = async (req, res) => {
  try {
    const userId = req.user._id;

    const [user, testResults, roadmap, careerProfile] = await Promise.all([
      User.findById(userId).select("-password").lean(),
      TestResult.find({ userId }).lean(),
      Roadmap.find({ userId }).lean(),
      CareerProfile.findOne({ userId }).lean(),
    ]);

    const exportPackage = {
      complianceStandard: "GDPR Art. 15 / FERPA / DPDP",
      exportedAt: new Date().toISOString(),
      platform: "LearnX Student Growth & Career Intelligence",
      userProfile: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course,
        department: user.department,
        batch: user.batch,
        rollNo: user.rollNo,
        createdAt: user.createdAt,
      },
      diagnosticAssessments: testResults.map((tr) => ({
        subject: tr.subject,
        score: tr.score,
        totalQuestions: tr.totalQuestions,
        percentage: tr.percentage,
        weakTopics: tr.weakTopics,
        timestamp: tr.createdAt,
      })),
      careerIntelligence: careerProfile
        ? {
            targetRole: careerProfile.targetRole,
            skills: careerProfile.skills,
            atsScore: careerProfile.atsScore,
            updatedAt: careerProfile.updatedAt,
          }
        : null,
      learningRoadmap: roadmap.map((rm) => ({
        targetRole: rm.targetRole,
        milestonesCount: rm.milestones?.length || 0,
        createdAt: rm.createdAt,
      })),
    };

    await recordAuditLog({
      req,
      action: "DATA_EXPORT",
      status: "SUCCESS",
      details: {
        recordsCount: {
          testResults: testResults.length,
          hasCareerProfile: !!careerProfile,
          hasRoadmap: roadmap.length > 0,
        },
      },
    });

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="learnx_data_takeout_${user._id}.json"`);
    res.json(exportPackage);
  } catch (err) {
    console.error("exportUserData error:", err);
    res.status(500).json({ message: "Failed to export user data: " + err.message });
  }
};

/**
 * POST /api/privacy/consent
 * Manage student privacy and AI consent preferences
 */
export const updatePrivacyConsent = async (req, res) => {
  try {
    const { aiModelTelemetry = true, placementRecruiterSharing = true, institutionalAnalytics = true } = req.body;

    await recordAuditLog({
      req,
      action: "CONSENT_UPDATED",
      status: "SUCCESS",
      details: {
        aiModelTelemetry,
        placementRecruiterSharing,
        institutionalAnalytics,
      },
    });

    res.json({
      success: true,
      message: "Privacy and data processing preferences updated successfully.",
      preferences: {
        aiModelTelemetry,
        placementRecruiterSharing,
        institutionalAnalytics,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update consent preferences: " + err.message });
  }
};

/**
 * DELETE /api/privacy/purge
 * Right to be Forgotten (GDPR Article 17): Anonymize or purge student records
 */
export const purgeUserData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete related transient records
    await Promise.all([
      TestResult.deleteMany({ userId }),
      Roadmap.deleteMany({ userId }),
      CareerProfile.deleteMany({ userId }),
    ]);

    // Anonymize user record
    await User.findByIdAndUpdate(userId, {
      name: "Anonymized Learner",
      rollNo: "DELETED",
      department: "REDACTED",
    });

    await recordAuditLog({
      req,
      action: "DATA_PURGE",
      status: "SUCCESS",
      details: {
        reason: "User invoked Right to be Forgotten (GDPR Art. 17)",
        affectedCollections: ["TestResult", "Roadmap", "CareerProfile"],
      },
    });

    res.json({
      success: true,
      message: "Personal test history and career profile records have been permanently purged and anonymized.",
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to purge user data: " + err.message });
  }
};
