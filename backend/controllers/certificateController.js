import Certificate from "../models/Certificate.js";
import User from "../models/User.js";
import CourseRequirement from "../models/CourseRequirement.js";
import StudentCourseTracking from "../models/StudentCourseTracking.js";
import {
  DEFAULT_COURSE_SPECS,
  getOrSeedCourseRequirement,
  generateCertificateId,
  generateVerificationQRCode,
  evaluateStrictEligibility,
  autoGenerateCertificateIfEligible,
} from "../utils/strictCertificateValidator.js";

// @desc Get student's earned certificates
// @route GET /api/certificates/my
// @access Private (Student/Teacher/Admin)
export const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, certificates });
  } catch (error) {
    console.error("getMyCertificates error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get student's course certificate status and strict remaining requirements
// @route GET /api/certificates/status/:courseId
// @access Private (Student)
export const getCourseCertificateStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const spec = await getOrSeedCourseRequirement(courseId);

    let tracking = await StudentCourseTracking.findOne({ user: userId, courseId });
    if (!tracking) {
      tracking = await StudentCourseTracking.create({
        user: userId,
        courseId,
      });
    }

    // Check if certificate was already issued
    let existingCert = null;
    if (tracking.certificate) {
      existingCert = await Certificate.findById(tracking.certificate);
    }
    if (!existingCert) {
      existingCert = await Certificate.findOne({ user: userId, courseId, status: "Valid" });
    }

    const evaluation = evaluateStrictEligibility(tracking, spec);

    // If eligible but not yet generated, automatically trigger generation
    let autoResult = null;
    if (evaluation.isEligible && !existingCert) {
      autoResult = await autoGenerateCertificateIfEligible(req.user, courseId, req);
      if (autoResult?.certificate) {
        existingCert = autoResult.certificate;
      }
    }

    res.json({
      success: true,
      courseId: spec.courseId,
      courseName: spec.courseName,
      courseDuration: spec.courseDuration,
      status: existingCert ? "Certificate Issued" : evaluation.status,
      isEligible: evaluation.isEligible,
      progressPercentage: evaluation.verifiedProgressPercentage,
      criteria: evaluation.criteria,
      remainingCount: existingCert ? 0 : evaluation.remainingCount,
      certificate: existingCert,
      spec: {
        totalLessons: spec.totalLessons,
        totalModules: spec.totalModules,
        totalAssignments: spec.totalAssignments,
        minPassingScore: spec.minPassingScore,
        totalProjects: spec.totalProjects,
      },
      tracking: {
        completedLessons: tracking.completedLessons,
        completedModules: tracking.completedModules,
        submittedAssignments: tracking.submittedAssignments,
        finalAssessmentScore: tracking.finalAssessmentScore,
        submittedProjects: tracking.submittedProjects,
      },
    });
  } catch (error) {
    console.error("getCourseCertificateStatus error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Record progress & trigger automatic certificate generation when 100% complete
// @route POST /api/certificates/progress
// @access Private (Student)
export const recordCourseProgress = async (req, res) => {
  try {
    const {
      courseId,
      completedLessons,
      completedModules,
      submittedAssignments,
      finalAssessmentScore,
      submittedProjects,
    } = req.body;
    const user = req.user;

    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course ID is required." });
    }

    const spec = await getOrSeedCourseRequirement(courseId);

    let tracking = await StudentCourseTracking.findOne({ user: user._id, courseId });
    if (!tracking) {
      tracking = new StudentCourseTracking({
        user: user._id,
        courseId,
      });
    }

    // Update tracking records monotonically (cannot regress completed tasks)
    if (completedLessons !== undefined) {
      tracking.completedLessons = Math.min(spec.totalLessons, Math.max(tracking.completedLessons, completedLessons));
    }
    if (completedModules !== undefined) {
      tracking.completedModules = Math.min(spec.totalModules, Math.max(tracking.completedModules, completedModules));
    }
    if (submittedAssignments !== undefined) {
      tracking.submittedAssignments = Math.min(spec.totalAssignments, Math.max(tracking.submittedAssignments, submittedAssignments));
    }
    if (submittedProjects !== undefined) {
      tracking.submittedProjects = Math.min(spec.totalProjects, Math.max(tracking.submittedProjects, submittedProjects));
    }
    if (finalAssessmentScore !== undefined) {
      tracking.finalAssessmentScore = finalAssessmentScore;
      tracking.finalAssessmentPassed = finalAssessmentScore >= spec.minPassingScore;
      tracking.finalAssessmentAttemptedAt = new Date();
    }

    await tracking.save();

    // STRICT AUTOMATIC GENERATION CHECK:
    // If all 6 conditions are met, automatically generate certificate right now!
    const autoGenResult = await autoGenerateCertificateIfEligible(user, courseId, req);

    res.json({
      success: true,
      message: autoGenResult.generated
        ? "Congratulations! Your course completion certificate is ready."
        : "Course progress updated successfully.",
      certificateReady: Boolean(autoGenResult.certificate),
      isNewlyGenerated: autoGenResult.generated,
      certificate: autoGenResult.certificate,
      evaluation: autoGenResult.evaluation,
    });
  } catch (error) {
    console.error("recordCourseProgress error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Strict Claim Endpoint: Validates ALL 6 backend conditions before issuing
// @route POST /api/certificates/claim
// @access Private (Student)
export const claimCertificateStrict = async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = req.user;

    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course ID is required." });
    }

    const spec = await getOrSeedCourseRequirement(courseId);
    let tracking = await StudentCourseTracking.findOne({ user: user._id, courseId });

    if (!tracking) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course or have not begun required lessons.",
      });
    }

    const evaluation = evaluateStrictEligibility(tracking, spec);

    // STRICT RESTRICTION: Reject if any requirement is not satisfied!
    if (!evaluation.isEligible) {
      return res.status(403).json({
        success: false,
        message: "Ineligible for Certificate: All lessons, modules, assignments, projects, and passing assessment score are strictly required.",
        criteria: evaluation.criteria,
        status: evaluation.status,
      });
    }

    // Auto-generate or retrieve existing
    const autoResult = await autoGenerateCertificateIfEligible(user, courseId, req);

    res.json({
      success: true,
      message: autoResult.generated
        ? "Congratulations! Your course completion certificate is ready."
        : "Certificate already issued.",
      certificate: autoResult.certificate,
      alreadyIssued: autoResult.alreadyIssued,
    });
  } catch (error) {
    console.error("claimCertificateStrict error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Public QR verification endpoint (No auth required)
// @route GET /api/certificates/verify/:tokenOrId
// @access Public
export const verifyCertificate = async (req, res) => {
  try {
    const { tokenOrId } = req.params;

    const certificate = await Certificate.findOne({
      $or: [
        { verificationToken: tokenOrId },
        { certificateId: tokenOrId.toUpperCase().trim() },
      ],
    }).populate("user", "name email college course department");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        isValid: false,
        message: "No certificate found matching this verification code or Certificate ID.",
      });
    }

    res.json({
      success: true,
      isValid: certificate.status === "Valid",
      certificate: {
        certificateId: certificate.certificateId,
        verificationToken: certificate.verificationToken,
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        courseDuration: certificate.courseDuration,
        skills: certificate.skills,
        completionDate: certificate.completionDate,
        issueDate: certificate.issueDate,
        status: certificate.status,
        revocationReason: certificate.revocationReason,
        revokedAt: certificate.revokedAt,
        issuedBy: certificate.issuedBy,
        qrCodeDataUrl: certificate.qrCodeDataUrl,
      },
    });
  } catch (error) {
    console.error("verifyCertificate error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── ADMIN CERTIFICATE MANAGEMENT CONTROLLERS ─────────────────────────────────

// @desc Get all course eligibility rules & specs
// @route GET /api/certificates/admin/rules
// @access Private (Admin only)
export const getAdminCourseRules = async (req, res) => {
  try {
    // Seed defaults if needed
    for (const def of DEFAULT_COURSE_SPECS) {
      await getOrSeedCourseRequirement(def.courseId);
    }
    const rules = await CourseRequirement.find().sort({ createdAt: 1 });
    res.json({ success: true, rules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update course eligibility rule / minimum passing marks
// @route PUT /api/certificates/admin/rules/:courseId
// @access Private (Admin only)
export const updateAdminCourseRule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      minPassingScore,
      totalLessons,
      totalModules,
      totalAssignments,
      totalProjects,
      courseDuration,
    } = req.body;

    const rule = await CourseRequirement.findOneAndUpdate(
      { courseId },
      {
        $set: {
          ...(minPassingScore !== undefined && { minPassingScore: Number(minPassingScore) }),
          ...(totalLessons !== undefined && { totalLessons: Number(totalLessons) }),
          ...(totalModules !== undefined && { totalModules: Number(totalModules) }),
          ...(totalAssignments !== undefined && { totalAssignments: Number(totalAssignments) }),
          ...(totalProjects !== undefined && { totalProjects: Number(totalProjects) }),
          ...(courseDuration !== undefined && { courseDuration }),
        },
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: "Course eligibility rules updated successfully.", rule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc View all student course completion & eligibility tracking records
// @route GET /api/certificates/admin/students-progress
// @access Private (Admin only)
export const getAdminStudentsProgress = async (req, res) => {
  try {
    const trackings = await StudentCourseTracking.find()
      .populate("user", "name email rollNo college department")
      .populate("certificate", "certificateId status issueDate")
      .sort({ updatedAt: -1 });

    const specs = await CourseRequirement.find();
    const specMap = {};
    specs.forEach((s) => {
      specMap[s.courseId] = s;
    });

    const students = trackings.map((t) => {
      const spec = specMap[t.courseId] || {
        totalLessons: 10,
        totalModules: 5,
        totalAssignments: 3,
        minPassingScore: 70,
        totalProjects: 2,
        courseName: t.courseId,
      };
      const evalResult = evaluateStrictEligibility(t, spec);

      return {
        _id: t._id,
        user: t.user,
        courseId: t.courseId,
        courseName: spec.courseName || t.courseId,
        status: t.certificate ? "Certificate Issued" : evalResult.status,
        isEligible: evalResult.isEligible,
        progressPercentage: evalResult.verifiedProgressPercentage,
        completedLessons: t.completedLessons,
        totalLessons: spec.totalLessons,
        submittedAssignments: t.submittedAssignments,
        totalAssignments: spec.totalAssignments,
        finalAssessmentScore: t.finalAssessmentScore,
        minPassingScore: spec.minPassingScore,
        submittedProjects: t.submittedProjects,
        totalProjects: spec.totalProjects,
        certificate: t.certificate,
      };
    });

    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all issued certificates with search & filter
// @route GET /api/certificates/admin/all
// @access Private (Admin only)
export const getAllCertificatesAdmin = async (req, res) => {
  try {
    const { search = "", status = "All", course = "All" } = req.query;

    const query = {};
    if (status && status !== "All") query.status = status;
    if (course && course !== "All") query.courseName = course;

    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { studentName: { $regex: q, $options: "i" } },
        { studentEmail: { $regex: q, $options: "i" } },
        { certificateId: { $regex: q, $options: "i" } },
        { courseName: { $regex: q, $options: "i" } },
      ];
    }

    const certificates = await Certificate.find(query).sort({ createdAt: -1 });

    const totalIssued = await Certificate.countDocuments();
    const validCount = await Certificate.countDocuments({ status: "Valid" });
    const revokedCount = await Certificate.countDocuments({ status: "Revoked" });

    res.json({
      success: true,
      certificates,
      metrics: {
        totalIssued,
        validCount,
        revokedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin Manual Override Issuance with Audit Record
// @route POST /api/certificates/admin/issue
// @access Private (Admin only)
export const adminIssueCertificate = async (req, res) => {
  try {
    const {
      studentEmail,
      studentName,
      courseName,
      courseDuration = "40 Hours",
      skills,
      completionDate,
      auditReason = "Authorized faculty manual override",
    } = req.body;

    if (!studentEmail || !courseName) {
      return res.status(400).json({ success: false, message: "Student Email and Course Name are required." });
    }

    let user = await User.findOne({ email: studentEmail.toLowerCase().trim() });
    if (!user) {
      user = await User.create({
        name: studentName || studentEmail.split("@")[0],
        email: studentEmail.toLowerCase().trim(),
        role: "student",
      });
    }

    const courseId = courseName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Prevent duplicate certificates
    let existing = await Certificate.findOne({ user: user._id, courseId, status: "Valid" });
    if (existing) {
      return res.json({
        success: true,
        message: "Valid certificate already exists for this student and course.",
        certificate: existing,
      });
    }

    const certificateId = await generateCertificateId();
    const verificationToken = crypto.randomBytes(16).toString("hex");
    const { qrDataUrl } = await generateVerificationQRCode(verificationToken, req);

    const skillsArray = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : ["HTML & CSS", "JavaScript", "Responsive Design", "Web Projects"];

    const cert = await Certificate.create({
      certificateId,
      verificationToken,
      user: user._id,
      studentName: studentName || user.name,
      studentEmail: user.email,
      courseId,
      courseName,
      courseDuration,
      skills: skillsArray.length > 0 ? skillsArray : ["HTML & CSS", "JavaScript", "Responsive Design", "Web Projects"],
      issueDate: new Date(),
      completionDate: completionDate ? new Date(completionDate) : new Date(),
      completionPercentage: 100,
      score: 95,
      status: "Valid",
      isManualIssue: true,
      issuedBy: `${req.user.name || "Administrator"} (Audit: ${auditReason})`,
      qrCodeDataUrl,
    });

    // Update tracking
    await StudentCourseTracking.findOneAndUpdate(
      { user: user._id, courseId },
      {
        $set: {
          isEligibleForCertificate: true,
          certificateGenerated: true,
          certificate: cert._id,
          verifiedProgressPercentage: 100,
        },
      },
      { upsert: true }
    );

    res.status(201).json({
      success: true,
      message: "Certificate manually issued and recorded in audit log.",
      certificate: cert,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Revoke certificate with reason
// @route POST /api/certificates/admin/:id/revoke
// @access Private (Admin only)
export const adminRevokeCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = "Administrative revocation" } = req.body;

    const cert = await Certificate.findById(id);
    if (!cert) {
      return res.status(404).json({ success: false, message: "Certificate not found." });
    }

    cert.status = "Revoked";
    cert.revocationReason = reason;
    cert.revokedAt = new Date();
    await cert.save();

    res.json({
      success: true,
      message: `Certificate ${cert.certificateId} has been revoked.`,
      certificate: cert,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Reissue / Reinstate certificate
// @route POST /api/certificates/admin/:id/reissue
// @access Private (Admin only)
export const adminReissueCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentName, courseName } = req.body;

    const cert = await Certificate.findById(id);
    if (!cert) {
      return res.status(404).json({ success: false, message: "Certificate not found." });
    }

    cert.status = "Valid";
    cert.revocationReason = "";
    cert.revokedAt = null;
    if (studentName) cert.studentName = studentName.trim();
    if (courseName) cert.courseName = courseName.trim();
    await cert.save();

    res.json({
      success: true,
      message: `Certificate ${cert.certificateId} has been reinstated and updated.`,
      certificate: cert,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
