import mongoose from "mongoose";
import dotenv from "dotenv";
import { Subject, Unit, Chapter, Topic } from "../models/Curriculum.js";
import TopicQuestion from "../models/TopicQuestion.js";
import { CURRICULUM_SUBJECTS, CURRICULUM_UNITS, CURRICULUM_CHAPTERS, CURRICULUM_TOPICS } from "./curriculumData.js";
import { TOPIC_QUESTIONS } from "./topicQuestionsData.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/student-platform";

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB for curriculum seeding...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully.");

    console.log("Clearing existing curriculum collection data...");
    await Promise.all([
      Subject.deleteMany({}),
      Unit.deleteMany({}),
      Chapter.deleteMany({}),
      Topic.deleteMany({}),
      TopicQuestion.deleteMany({}),
    ]);
    console.log("Cleared old data.");

    console.log(`Seeding ${CURRICULUM_SUBJECTS.length} Subjects...`);
    await Subject.insertMany(CURRICULUM_SUBJECTS);

    console.log(`Seeding ${CURRICULUM_UNITS.length} Units...`);
    await Unit.insertMany(CURRICULUM_UNITS);

    console.log(`Seeding ${CURRICULUM_CHAPTERS.length} Chapters...`);
    await Chapter.insertMany(CURRICULUM_CHAPTERS);

    console.log(`Seeding ${CURRICULUM_TOPICS.length} Topics...`);
    await Topic.insertMany(CURRICULUM_TOPICS);

    console.log(`Seeding ${TOPIC_QUESTIONS.length} Diagnostic Topic Questions...`);
    await TopicQuestion.insertMany(TOPIC_QUESTIONS);

    console.log("✅ All Curriculum subjects, units, chapters, topics, and diagnostic questions successfully seeded!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding curriculum data:", err);
    process.exit(1);
  }
}

seedDatabase();
