import crypto from "crypto";
import QRCode from "qrcode";
import Certificate from "../models/Certificate.js";
import User from "../models/User.js";
import CourseRequirement from "../models/CourseRequirement.js";
import StudentCourseTracking from "../models/StudentCourseTracking.js";

// Standard Course Requirements presets (Auto-seeded if empty)
export const DEFAULT_COURSE_SPECS = [
  {
    courseId: "web-development-beginner-level",
    courseName: "Web Development – Beginner Level",
    courseDuration: "40 Hours",
    skills: ["HTML & CSS", "JavaScript", "Responsive Design", "Web Projects"],
    totalLessons: 10,
    totalModules: 5,
    totalAssignments: 3,
    minPassingScore: 70, // Requires >= 70% in final assessment
    totalProjects: 2,
  },
  {
    courseId: "data-structures-algorithms",
    courseName: "Data Structures & Algorithms Mastery",
    courseDuration: "60 Hours",
    skills: ["Arrays & Linked Lists", "Trees & Graphs", "Dynamic Programming", "Time Complexity"],
    totalLessons: 15,
    totalModules: 6,
    totalAssignments: 4,
    minPassingScore: 75, // Requires >= 75% in final assessment
    totalProjects: 2,
  },
  {
    courseId: "database-management-systems",
    courseName: "Database Management & SQL Systems",
    courseDuration: "35 Hours",
    skills: ["Relational Modeling", "Advanced SQL", "Indexing & Optimization", "ACID Transactions"],
    totalLessons: 10,
    totalModules: 4,
    totalAssignments: 2,
    minPassingScore: 70,
    totalProjects: 1,
  },
  {
    courseId: "system-design-architecture",
    courseName: "High-Level System Design & Cloud",
    courseDuration: "50 Hours",
    skills: ["Microservices", "Load Balancing", "Caching Systems", "Distributed Systems"],
    totalLessons: 12,
    totalModules: 5,
    totalAssignments: 3,
    minPassingScore: 75,
    totalProjects: 2,
  },
];

// Helper to ensure course requirement exists in DB
export const getOrSeedCourseRequirement = async (courseId) => {
  let spec = await CourseRequirement.findOne({ courseId });
  if (!spec) {
    const defaultItem = DEFAULT_COURSE_SPECS.find(
      (c) => c.courseId === courseId || c.courseId === courseId.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    ) || {
      courseId,
      courseName: courseId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      courseDuration: "40 Hours",
      skills: ["Core Concepts", "Implementation", "Problem Solving", "Final Project"],
      totalLessons: 10,
      totalModules: 5,
      totalAssignments: 3,
      minPassingScore: 70,
      totalProjects: 2,
    };
    spec = await CourseRequirement.create(defaultItem);
  }
  return spec;
};

// Unique Certificate ID generator (e.g., LX-2026-001)
export const generateCertificateId = async () => {
  const year = new Date().getFullYear();
  const count = await Certificate.countDocuments();
  const sequence = String(count + 1).padStart(3, "0");
  const randomSuffix = Math.floor(10 + Math.random() * 90);
  return `LX-${year}-${sequence}${randomSuffix}`;
};

// Generate high-resolution scannable QR verification code data URL
export const generateVerificationQRCode = async (verificationToken, req) => {
  const host = req ? (req.get("host") || "localhost:3000") : "localhost:3000";
  const protocol = req ? (req.protocol === "https" || req.headers["x-forwarded-proto"] === "https" ? "https" : "http") : "http";
  const clientOrigin = process.env.CLIENT_URL || (process.env.NODE_ENV === "production" ? `${protocol}://${host}` : "http://localhost:3000");
  const verifyUrl = `${clientOrigin}/verify/${verificationToken}`;

  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 256,
    color: { dark: "#061c47", light: "#ffffff" },
  });

  return { verifyUrl, qrDataUrl };
};

/**
 * STRICT ELIGIBILITY EVALUATOR
 * Checks ALL 6 strict criteria against database records:
 * 1. Course Progress = 100%
 * 2. Every required lesson completed (completedLessons >= totalLessons)
 * 3. All required videos / modules completed (completedModules >= totalModules)
 * 4. All mandatory assignments submitted (submittedAssignments >= totalAssignments)
 * 5. Final quiz / assessment passed with required passing marks (finalAssessmentScore >= minPassingScore)
 * 6. All mandatory practical projects completed (submittedProjects >= totalProjects)
 */
export const evaluateStrictEligibility = (tracking, spec) => {
  const lessonsMet = tracking.completedLessons >= spec.totalLessons;
  const modulesMet = tracking.completedModules >= spec.totalModules;
  const assignmentsMet = tracking.submittedAssignments >= spec.totalAssignments;
  const projectsMet = tracking.submittedProjects >= spec.totalProjects;
  
  const assessmentAttempted = tracking.finalAssessmentScore >= 0;
  const assessmentPassed = assessmentAttempted && tracking.finalAssessmentScore >= spec.minPassingScore;

  // Calculate strict progress based on curriculum lessons completed
  const progressRatio = Math.min(1, spec.totalLessons > 0 ? tracking.completedLessons / spec.totalLessons : 0);
  const verifiedProgressPercentage = Math.round(progressRatio * 100);

  // Criteria evaluation list
  const criteria = [
    {
      id: "lessons",
      title: "All Lessons Completed",
      required: `${spec.totalLessons} Lessons`,
      completed: `${tracking.completedLessons} Completed`,
      satisfied: lessonsMet,
      remaining: Math.max(0, spec.totalLessons - tracking.completedLessons),
    },
    {
      id: "modules",
      title: "All Video & Learning Modules Finished",
      required: `${spec.totalModules} Modules`,
      completed: `${tracking.completedModules} Finished`,
      satisfied: modulesMet,
      remaining: Math.max(0, spec.totalModules - tracking.completedModules),
    },
    {
      id: "assignments",
      title: "All Mandatory Assignments Submitted",
      required: `${spec.totalAssignments} Assignments`,
      completed: `${tracking.submittedAssignments} Submitted`,
      satisfied: assignmentsMet,
      remaining: Math.max(0, spec.totalAssignments - tracking.submittedAssignments),
    },
    {
      id: "projects",
      title: "Mandatory Practical Projects Submitted",
      required: `${spec.totalProjects} Projects`,
      completed: `${tracking.submittedProjects} Submitted`,
      satisfied: projectsMet,
      remaining: Math.max(0, spec.totalProjects - tracking.submittedProjects),
    },
    {
      id: "assessment",
      title: `Final Assessment Passed (≥ ${spec.minPassingScore}%)`,
      required: `Passing Score ≥ ${spec.minPassingScore}%`,
      completed: assessmentAttempted ? `${tracking.finalAssessmentScore}% Score` : "Not Attempted",
      satisfied: assessmentPassed,
      failed: assessmentAttempted && !assessmentPassed,
    },
  ];

  // All 6 conditions must be satisfied strictly
  const is100Percent = verifiedProgressPercentage === 100;
  const isEligible = is100Percent && lessonsMet && modulesMet && assignmentsMet && projectsMet && assessmentPassed;

  // Compute status label
  let status = "Not Started";
  if (tracking.certificateGenerated) {
    status = "Certificate Issued";
  } else if (isEligible) {
    status = "Eligible for Certificate";
  } else if (is100Percent && !assessmentPassed) {
    status = "Assessment Pending";
  } else if (is100Percent && (!assignmentsMet || !projectsMet)) {
    status = "Requirements Incomplete";
  } else if (tracking.completedLessons > 0 || tracking.completedModules > 0) {
    status = "In Progress";
  }

  return {
    isEligible,
    verifiedProgressPercentage,
    status,
    criteria,
    remainingCount: criteria.filter((c) => !c.satisfied).length,
  };
};

/**
 * AUTOMATIC CERTIFICATE GENERATION HELPER
 * Triggers atomic find-or-create to prevent duplicates
 */
export const autoGenerateCertificateIfEligible = async (user, courseId, req) => {
  const spec = await getOrSeedCourseRequirement(courseId);

  let tracking = await StudentCourseTracking.findOne({ user: user._id, courseId });
  if (!tracking) {
    tracking = await StudentCourseTracking.create({
      user: user._id,
      courseId,
    });
  }

  const evaluation = evaluateStrictEligibility(tracking, spec);

  // Update tracking record with verified percentage & eligibility state
  tracking.verifiedProgressPercentage = evaluation.verifiedProgressPercentage;
  tracking.isEligibleForCertificate = evaluation.isEligible;

  // Strict check: Only generate if 100% of all conditions are satisfied!
  if (!evaluation.isEligible) {
    await tracking.save();
    return {
      certificate: null,
      generated: false,
      evaluation,
    };
  }

  // Prevent duplicate certificates for the same student & course
  let existingCert = await Certificate.findOne({
    user: user._id,
    courseId,
    status: "Valid",
  });

  if (existingCert) {
    tracking.certificateGenerated = true;
    tracking.certificate = existingCert._id;
    await tracking.save();
    return {
      certificate: existingCert,
      generated: false,
      alreadyIssued: true,
      evaluation,
    };
  }

  // Generate unique certificate ID and cryptographic token
  const certificateId = await generateCertificateId();
  const verificationToken = crypto.randomBytes(16).toString("hex");
  const { qrDataUrl } = await generateVerificationQRCode(verificationToken, req);

  const newCertificate = await Certificate.create({
    certificateId,
    verificationToken,
    user: user._id,
    studentName: user.name || "Student Scholar",
    studentEmail: user.email,
    courseId: spec.courseId,
    courseName: spec.courseName,
    courseDuration: spec.courseDuration,
    skills: spec.skills,
    issueDate: new Date(),
    completionDate: new Date(),
    completionPercentage: 100,
    score: tracking.finalAssessmentScore > 0 ? tracking.finalAssessmentScore : 85,
    status: "Valid",
    isManualIssue: false,
    qrCodeDataUrl: qrDataUrl,
  });

  tracking.certificateGenerated = true;
  tracking.certificate = newCertificate._id;
  await tracking.save();

  return {
    certificate: newCertificate,
    generated: true,
    alreadyIssued: false,
    evaluation,
  };
};
