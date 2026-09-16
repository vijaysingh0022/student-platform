import mongoose from "mongoose";
import Question from "../models/Question.js";
import User from "../models/User.js";
import { PLACEMENT_QUESTIONS } from "../seed/placementQuestionsData.js";

let isConnected = false;
let connectionPromise = null;

export const autoSeed = async () => {
  try {
    const qCount = await Question.countDocuments();
    if (qCount < PLACEMENT_QUESTIONS.length) {
      await Question.deleteMany({});
      await Question.insertMany(PLACEMENT_QUESTIONS);
      console.log(`✅ Auto-seeded ${PLACEMENT_QUESTIONS.length} assessment questions across CSE domains`);
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
      console.log("✅ Auto-seeded demo student (demo@example.com)");
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
