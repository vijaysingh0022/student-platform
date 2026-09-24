import mongoose from "mongoose";
import { Subject } from "./backend/models/Curriculum.js";
import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env" });

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/learnx").then(async () => {
  const subjects = await Subject.find({}, "subjectId name badge semester").lean();
  console.log(subjects);
  process.exit(0);
});
