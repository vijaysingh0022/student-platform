import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Question from "../models/Question.js";
import { ALL_COMPREHENSIVE_QUESTIONS } from "./questions/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student_platform";
    console.log("Connecting to MongoDB:", mongoUri ? "URI found" : "No URI");
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully.");

    console.log(`Clearing old questions and inserting ${ALL_COMPREHENSIVE_QUESTIONS.length} comprehensive questions...`);
    await Question.deleteMany({});
    const res = await Question.insertMany(ALL_COMPREHENSIVE_QUESTIONS);
    console.log(`Successfully seeded ${res.length} questions into Question collection!`);

    // Verify counts per subject
    const counts = await Question.aggregate([
      { $group: { _id: "$subject", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    console.log("Questions per subject in Database:");
    counts.forEach(c => console.log(`  - ${c._id}: ${c.count} questions`));

    const total = await Question.countDocuments();
    console.log(`Total questions in DB: ${total}`);

    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
