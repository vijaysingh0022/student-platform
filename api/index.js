import app from "../backend/server.js";
import connectDB from "../backend/config/db.js";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error("Vercel DB Connection Error:", err.message);
    if (req.url.startsWith("/api/") && req.url !== "/api/health" && req.url !== "/api") {
      return res.status(503).json({
        error: "Database Connection Error",
        message: "Could not connect to MongoDB Atlas. Please ensure '0.0.0.0/0' (Allow Access from Anywhere) is added to Network Access in your MongoDB Atlas Dashboard.",
        details: err.message,
      });
    }
  }
  return app(req, res);
}
