import mongoose from "mongoose";

const studentCourseTrackingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    // Requirement 1 & 2: Lessons completed count
    completedLessons: {
      type: Number,
      default: 0,
    },
    // Requirement 3: Videos / learning modules completed count
    completedModules: {
      type: Number,
      default: 0,
    },
    // Requirement 4: Submitted assignments count
    submittedAssignments: {
      type: Number,
      default: 0,
    },
    // Requirement 5: Final assessment score achieved (-1 if not taken)
    finalAssessmentScore: {
      type: Number,
      default: -1,
    },
    finalAssessmentPassed: {
      type: Boolean,
      default: false,
    },
    finalAssessmentAttemptedAt: {
      type: Date,
      default: null,
    },
    // Requirement 6: Submitted practical projects count
    submittedProjects: {
      type: Number,
      default: 0,
    },
    // Overall verified progress percentage (0 - 100%) calculated strictly by backend
    verifiedProgressPercentage: {
      type: Number,
      default: 0,
    },
    // Calculated eligibility
    isEligibleForCertificate: {
      type: Boolean,
      default: false,
    },
    certificateGenerated: {
      type: Boolean,
      default: false,
    },
    certificate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
      default: null,
    },
  },
  { timestamps: true }
);

// Compound index so a student has exactly one tracking doc per course
studentCourseTrackingSchema.index({ user: 1, courseId: 1 }, { unique: true });

const StudentCourseTracking = mongoose.model(
  "StudentCourseTracking",
  studentCourseTrackingSchema
);
export default StudentCourseTracking;

