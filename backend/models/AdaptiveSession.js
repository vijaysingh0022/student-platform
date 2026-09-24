import mongoose from "mongoose";

const questionAttemptSchema = new mongoose.Schema({
  questionText: String,
  options: [String],
  correctAnswer: String,
  userAnswer: String,
  isCorrect: Boolean,
  difficulty: { type: String, enum: ["easy", "medium", "hard", "interview"] },
  timeTakenSeconds: Number,
  mistakePattern: String,
});

const adaptiveSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subjectId: { type: String, required: true },
    topicId: { type: String, required: true },
    
    status: { type: String, enum: ["active", "completed"], default: "active" },
    currentDifficulty: { type: String, enum: ["easy", "medium", "hard", "interview"], default: "easy" },
    
    attempts: [questionAttemptSchema],
    
    // Summary Fields
    accuracy: { type: Number, default: 0 },
    speedAvgSeconds: { type: Number, default: 0 },
    masteryPercentage: { type: Number, default: 0 },
    weakTopics: [String],
    mistakePatterns: [String],
    recommendations: [String],
    recommendedNextTopic: String,
  },
  { timestamps: true }
);

const AdaptiveSession = mongoose.model("AdaptiveSession", adaptiveSessionSchema);
export default AdaptiveSession;
