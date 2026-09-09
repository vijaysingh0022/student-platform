import mongoose from "mongoose";
import Question from "../models/Question.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { PLACEMENT_QUESTIONS } from "../seed/placementQuestionsData.js";
import TestResult from "../models/TestResult.js";
import CareerProfile from "../models/CareerProfile.js";

export const autoSeed = async () => {
  try {
    const qCount = await Question.countDocuments();
    if (qCount < PLACEMENT_QUESTIONS.length) {
      await Question.deleteMany({});
      await Question.insertMany(PLACEMENT_QUESTIONS);
      console.log(`✅ Auto-seeded ${PLACEMENT_QUESTIONS.length} comprehensive assessment questions across all 8 CSE placement domains`);
    }

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
      console.log("✅ Auto-seeded demo student (demo@example.com / password123)");
    }

    const facultyUser = await User.findOne({ email: "faculty@example.com" });
    if (!facultyUser) {
      await User.create({
        name: "Prof. Rajesh Sharma",
        email: "faculty@example.com",
        password: "password123",
        course: "Faculty / HoD",
        department: "Computer Science & Engineering",
        batch: "Faculty",
        rollNo: "FAC-01",
        attendanceRate: 100,
        role: "teacher",
      });
      console.log("✅ Auto-seeded faculty account (faculty@example.com / password123)");
    }
  } catch (err) {
    console.error("Auto-seed error:", err.message);
  }
};

const connectDB = async () => {
  if (process.env.MONGO_URI) {
    try {
      console.log("Connecting to MongoDB Atlas...");
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
      await autoSeed();
      return;
    } catch (error) {
      console.warn(`⚠️ Atlas connection failed (${error.message}).`);
      console.log("🚀 Starting embedded Local MongoDB instance automatically so all features work immediately...");
    }
  }

  // Fallback to in-memory Mongo server
  try {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`✅ Embedded Local MongoDB connected successfully at ${uri}`);
    await autoSeed();
  } catch (err) {
    console.error("Critical MongoDB connection error:", err.message);
  }
};

export default connectDB;
