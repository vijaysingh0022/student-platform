import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import tutorRoutes from "./routes/tutorRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import institutionRoutes from "./routes/institutionRoutes.js";
import offlineRoutes from "./routes/offlineRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Student Growth & Career Intelligence Platform API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/prediction", predictionRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/institution", institutionRoutes);
app.use("/api/offline", offlineRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
