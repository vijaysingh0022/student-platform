import mongoose from "mongoose";
import Question from "../models/Question.js";
import User from "../models/User.js";
import { Subject, Unit, Chapter, Topic } from "../models/Curriculum.js";
import TopicQuestion from "../models/TopicQuestion.js";
import { PLACEMENT_QUESTIONS } from "../seed/placementQuestionsData.js";
import {
  CURRICULUM_SUBJECTS,
  CURRICULUM_UNITS,
  CURRICULUM_CHAPTERS,
  CURRICULUM_TOPICS,
} from "../seed/curriculumData.js";
import { TOPIC_QUESTIONS } from "../seed/topicQuestionsData.js";

let isConnected = false;
let connectionPromise = null;

export const autoSeed = async () => {
  try {
    // 1. Placement assessment questions
    const qCount = await Question.countDocuments();
    if (qCount < PLACEMENT_QUESTIONS.length) {
      await Question.deleteMany({});
      await Question.insertMany(PLACEMENT_QUESTIONS);
      console.log(`✅ Auto-seeded ${PLACEMENT_QUESTIONS.length} assessment questions across CSE domains`);
    }

    // 2. Demo Student User
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create({
        name: "Demo Student",
        email: "demo@example.com",
        password: "password123",
        course: "B.Tech CSE",
        department: "Computer Science & Engineering",
        batch: "2022-2026",
        rollNo: "CSE-2201",
        attendanceRate: 85,
        role: "student",
      });
      console.log("✅ Auto-seeded demo student (demo@example.com)");
    }

    // 3. Curriculum Subjects, Units, Chapters, Topics
    const subjectCount = await Subject.countDocuments();
    if (subjectCount < CURRICULUM_SUBJECTS.length) {
      await Subject.deleteMany({});
      await Subject.insertMany(CURRICULUM_SUBJECTS);
      console.log(`✅ Auto-seeded ${CURRICULUM_SUBJECTS.length} curriculum subjects`);
    }

    const unitCount = await Unit.countDocuments();
    if (unitCount < CURRICULUM_UNITS.length) {
      await Unit.deleteMany({});
      await Unit.insertMany(CURRICULUM_UNITS);
      console.log(`✅ Auto-seeded ${CURRICULUM_UNITS.length} curriculum units`);
    }

    const chapterCount = await Chapter.countDocuments();
    if (chapterCount < CURRICULUM_CHAPTERS.length) {
      await Chapter.deleteMany({});
      await Chapter.insertMany(CURRICULUM_CHAPTERS);
      console.log(`✅ Auto-seeded ${CURRICULUM_CHAPTERS.length} curriculum chapters`);
    }

    const topicCount = await Topic.countDocuments();
    if (topicCount < CURRICULUM_TOPICS.length) {
      await Topic.deleteMany({});
      await Topic.insertMany(CURRICULUM_TOPICS);
      console.log(`✅ Auto-seeded ${CURRICULUM_TOPICS.length} curriculum topics`);
    }

    // 4. Topic-specific concept questions
    const topicQCount = await TopicQuestion.countDocuments();
    if (topicQCount < TOPIC_QUESTIONS.length) {
      await TopicQuestion.deleteMany({});
      await TopicQuestion.insertMany(TOPIC_QUESTIONS);
      console.log(`✅ Auto-seeded ${TOPIC_QUESTIONS.length} topic-specific diagnostic questions`);
    }
  } catch (err) {
    console.warn("Auto-seed info:", err.message);
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.warn("⚠️ MONGO_URI is not set. Please add it to your Render Environment Variables.");
  }

  connectionPromise = (async () => {
    if (mongoURI) {
      try {
        console.log("Connecting to MongoDB Atlas...");
        const conn = await mongoose.connect(mongoURI, {
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000,
          maxPoolSize: 10,
        });
        console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
        if (!isConnected) {
          await autoSeed();
          isConnected = true;
        }
        return conn;
      } catch (error) {
        console.error(`⚠️ MongoDB Atlas connection error (${error.message}).`);
        connectionPromise = null;
        if (process.env.NODE_ENV === "production" || process.env.RENDER) {
          throw error;
        }
      }
    }

    // Local development fallback
    if (process.env.NODE_ENV !== "production" && !process.env.RENDER) {
      try {
        const { MongoMemoryServer } = await import("mongodb-memory-server");
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const conn = await mongoose.connect(uri);
        console.log(`✅ Embedded Local MongoDB connected at ${uri}`);
        if (!isConnected) {
          await autoSeed();
          isConnected = true;
        }
        return conn;
      } catch (memErr) {
        console.error("Local memory server failed:", memErr.message);
      }
    }

    connectionPromise = null;
    throw new Error("MONGO_URI is required to connect to MongoDB.");
  })();

  return connectionPromise;
};

export default connectDB;
