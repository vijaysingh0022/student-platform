import mongoose from "mongoose";

const learningStreakSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    currentStreak: {
      type: Number,
      default: 1,
    },
    longestStreak: {
      type: Number,
      default: 1,
    },
    lastActiveDate: {
      type: String, // YYYY-MM-DD
      default: () => new Date().toISOString().split("T")[0],
    },
    activeDates: {
      type: [String], // Array of YYYY-MM-DD
      default: [],
    },
    weeklyGoalXP: {
      type: Number,
      default: 300,
    },
    earnedThisWeekXP: {
      type: Number,
      default: 180,
    },
    weeklyCompletedTasks: {
      type: Number,
      default: 2,
    },
    weekStartDate: {
      type: Date,
      default: () => {
        const d = new Date();
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
        return new Date(d.setDate(diff));
      },
    },
    settings: {
      showNotifications: { type: Boolean, default: true },
      playSound: { type: Boolean, default: true },
      motivationalReminders: { type: Boolean, default: true },
      weeklyGoalReminders: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const LearningStreak = mongoose.model("LearningStreak", learningStreakSchema);
export default LearningStreak;
