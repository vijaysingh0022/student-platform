import mongoose from "mongoose";

const courseRequirementSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    courseDuration: {
      type: String,
      default: "40 Hours",
    },
    skills: {
      type: [String],
      default: ["HTML & CSS", "JavaScript", "Responsive Design", "Web Projects"],
    },
    // Requirement 1 & 2: Total required lessons/topics to complete (must be 100%)
    totalLessons: {
      type: Number,
      required: true,
      default: 10,
    },
    // Requirement 3: Total required video/learning modules to finish
    totalModules: {
      type: Number,
      required: true,
      default: 5,
    },
    // Requirement 4: Total mandatory assignments that must be submitted
    totalAssignments: {
      type: Number,
      required: true,
      default: 3,
    },
    // Requirement 5: Final assessment required passing marks (%)
    minPassingScore: {
      type: Number,
      required: true,
      default: 70, // 70% passing threshold
    },
    // Requirement 6: Total mandatory practical projects required
    totalProjects: {
      type: Number,
      required: true,
      default: 2,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const CourseRequirement = mongoose.model("CourseRequirement", courseRequirementSchema);
export default CourseRequirement;

