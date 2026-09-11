import app from "../backend/server.js";
import connectDB from "../backend/config/db.js";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error("Vercel DB Connection Warning:", err.message);
  }
  return app(req, res);
}
