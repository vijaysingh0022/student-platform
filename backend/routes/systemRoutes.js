import express from "express";
import mongoose from "mongoose";

const router = express.Router();
const startTime = Date.now();

/**
 * GET /api/system/health
 * Cloud-native Liveness & Readiness probe
 */
router.get("/health", async (req, res) => {
  try {
    const t0 = Date.now();
    const dbState = mongoose.connection.readyState;
    const dbStatusMap = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
    
    // Quick ping test on db
    let dbPingMs = 0;
    if (dbState === 1 && mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
      dbPingMs = Date.now() - t0;
    }

    const mem = process.memoryUsage();
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

    const isHealthy = dbState === 1;

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? "healthy" : "degraded",
      service: "learnx-platform-api",
      version: "2.4.0",
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      database: {
        status: dbStatusMap[dbState] || "unknown",
        latencyMs: dbPingMs,
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        memoryUsageMb: {
          rss: Math.round(mem.rss / 1024 / 1024),
          heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
          heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
        },
      },
      cloudReadiness: {
        containerized: true,
        clusterReady: true,
        probes: {
          liveness: "/api/system/health",
          readiness: "/api/system/health",
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "unhealthy",
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/system/interop-spec
 * Institutional LMS & Academic interoperability specifications
 */
router.get("/interop-spec", (req, res) => {
  res.json({
    standard: "1EdTech Consortium / IMS Global",
    specs: [
      {
        name: "LTI 1.3 Advantage (Learning Tools Interoperability)",
        status: "ENABLED",
        endpoints: {
          oidcAuth: "/api/lti/auth",
          launchUrl: "/api/lti/launch",
          jwksUrl: "/api/lti/jwks",
        },
        supportedLMS: ["Canvas by Instructure", "Blackboard Learn", "Moodle LMS", "D2L Brightspace"],
      },
      {
        name: "IMS QTI 2.1 (Question and Test Interoperability)",
        status: "SUPPORTED",
        description: "Enables programmatic export and ingestion of calibrated placement assessments and AI quizzes into university exam portals.",
      },
      {
        name: "OneRoster v1.2",
        status: "COMPATIBLE",
        description: "Automated student directory synchronization with institutional Student Information Systems (SIS).",
      },
      {
        name: "xAPI (Experience API / Tin Can)",
        status: "ACTIVE",
        description: "Standardized learning statement emission: [Student] [Completed] [Assessment: DSA] with [Score: 92%].",
      },
    ],
  });
});

export default router;
