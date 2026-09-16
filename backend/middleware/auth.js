import { createClerkClient } from "@clerk/backend";
import User from "../models/User.js";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify Clerk session token
    const { sub: clerkId } = await clerkClient.verifyToken(token);

    if (!clerkId) {
      return res.status(401).json({ message: "Not authorized, invalid Clerk token" });
    }

    // Find the user in our MongoDB by clerkId
    const user = await User.findOne({ clerkId }).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not synced. Please call /api/auth/sync after sign-in.",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error("Clerk token verification error:", error.message);
    return res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};

export default protect;
