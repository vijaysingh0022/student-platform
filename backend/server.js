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

const app = express();

// 1. Enterprise Security Headers
app.use(enterpriseSecurityHeaders);

// 2. Global CORS — allow requests from any origin (Vercel frontend domain included)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. Body parsers with payload limits
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// 4. Input sanitization (XSS & NoSQL query protection)
app.use(sanitizeInput);

// 5. Sliding-window rate limiting (150 requests / minute)
app.use(rateLimiter({ maxRequests: 150, windowMs: 60000 }));

// Root health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "LearnX Student Platform API",
    version: "1.0.0",
  });
});

app.get("/api", (req, res) => {
  res.json({ status: "ok", service: "LearnX API", version: "1.0.0" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
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

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled API Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// Connect DB then start server (only for standalone server execution, not Vercel serverless)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5001;

  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`✅ LearnX API running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to database:", err.message);
    });
}

export default app;
