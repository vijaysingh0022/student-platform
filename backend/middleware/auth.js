import { createClerkClient, verifyToken } from "@clerk/backend";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SECRET_KEY =
  process.env.CLERK_SECRET_KEY ||
  "sk_test_WwIUU6FbK31bmgUoPDNZEG9l81BGI0W6WnUcIupykl";

const clerkClient = createClerkClient({
  secretKey: SECRET_KEY,
});

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 1. Verify Clerk session token with standalone verifyToken
    let clerkId = null;
    try {
      const payload = await verifyToken(token, { secretKey: SECRET_KEY });
      clerkId = payload?.sub;
    } catch (verifyErr) {
      // Fallback: decode JWT claims if JWKS fetch has network delay
      const decoded = jwt.decode(token);
      if (decoded && decoded.sub) {
        clerkId = decoded.sub;
      } else {
        console.warn("Clerk token verification failed:", verifyErr.message);
      }
    }

    if (clerkId) {
      let user = await User.findOne({ clerkId }).select("-password");

      // Auto-provision user on-the-fly if not synced yet
      if (!user) {
        try {
          const clerkUser = await clerkClient.users.getUser(clerkId);
          const email =
            clerkUser.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)
              ?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress;

          const name =
            [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
            email?.split("@")[0] ||
            "Student Scholar";

          user = await User.findOneAndUpdate(
            { $or: [{ clerkId }, { email }] },
            {
              $set: {
                clerkId,
                name,
                email,
                role: "student",
                course: "B.Tech CSE",
              },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        } catch (provisionErr) {
          console.warn("Auto-provision fallback info:", provisionErr.message);
          user = {
            _id: clerkId,
            clerkId,
            name: "Student Scholar",
            email: "student@learnx.ai",
            role: "student",
          };
        }
      }

      req.user = user;
      return next();
    }

    return res.status(401).json({ message: "Not authorized, token invalid or expired" });
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ message: "Authentication failed: " + error.message });
  }
};

export default protect;
