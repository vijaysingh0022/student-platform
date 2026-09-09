import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import tutorRoutes from "./routes/tutorRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import institutionRoutes from "./routes/institutionRoutes.js";
import offlineRoutes from "./routes/offlineRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import securityRoutes from "./routes/securityRoutes.js";
import privacyRoutes from "./routes/privacyRoutes.js";
import systemRoutes from "./routes/systemRoutes.js";

import {
  enterpriseSecurityHeaders,
  rateLimiter,
  sanitizeInput,
} from "./middleware/securityMiddleware.js";

dotenv.config();
connectDB();

const app = express();

// 1. Enterprise Security Headers (HSTS, CSP, No-Sniff, X-Frame)
app.use(enterpriseSecurityHeaders);

// 2. Global CORS
app.use(cors());

// 3. Body parsers with payload limits
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// 4. Input sanitization (XSS & NoSQL query protection)
app.use(sanitizeInput);

// 5. Sliding-window rate limiting (150 requests / minute)
app.use(rateLimiter({ maxRequests: 150, windowMs: 60000 }));

// Root health check
app.get("/", (req, res) => {
  res.send("Student Growth & Career Intelligence Platform API is running");
});

// Mount Platform APIs
app.use("/api/auth", authRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/privacy", privacyRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/prediction", predictionRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/institution", institutionRoutes);
app.use("/api/offline", offlineRoutes);
app.use("/api/career", careerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
