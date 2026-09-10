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

// 6. Resilient Database Connection Middleware for Serverless & Long-running instances
app.use(async (req, res, next) => {
  // Allow health check without waiting for DB if needed
  if (req.path === "/" || req.path === "/api" || req.path === "/api/health") {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection failure:", err.message);
    res.status(503).json({
      error: "Database unavailable. Please ensure MONGO_URI is configured correctly.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Root & API Health Checks
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "LearnX Student Platform API",
    version: "1.0.0",
    environment: process.env.VERCEL ? "vercel-serverless" : "standalone",
  });
});

app.get("/api", (req, res) => {
  res.json({
    status: "ok",
    service: "LearnX Student Platform API",
    version: "1.0.0",
    environment: process.env.VERCEL ? "vercel-serverless" : "standalone",
  });
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

// Only listen directly when running standalone (not when imported as a serverless handler)
const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT ||
  (process.argv[1] && (process.argv[1].includes("api/index") || process.argv[1].endsWith("api/index.js")))
);

if (!isServerless) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Pre-connect database in standalone dev mode
    connectDB().catch((err) => console.warn("Initial DB pre-connect:", err.message));
  });
}

export default app;
