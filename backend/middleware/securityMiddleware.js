import { recordAuditLog } from "../utils/auditLogger.js";

/**
 * Applies strict enterprise security headers on all responses
 */
export const enterpriseSecurityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  res.setHeader("Permissions-Policy", "geolocation=(), camera=(), microphone=()");
  res.removeHeader("X-Powered-By");
  next();
};

/**
 * Sliding-window in-memory Rate Limiter to prevent brute force & DoS attacks
 */
const rateLimitBuckets = new Map();

// Periodic cleanup of stale rate-limit buckets every 5 minutes
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitBuckets.entries()) {
    if (now - data.windowStart > 60000 * 2) {
      rateLimitBuckets.delete(ip);
    }
  }
}, 60000 * 5);
cleanupTimer.unref?.();

export const rateLimiter = ({ maxRequests = 120, windowMs = 60000, message = "Rate limit exceeded. Please retry shortly." } = {}) => {
  return async (req, res, next) => {
    const ip =
      req.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress ||
      "127.0.0.1";

    const now = Date.now();
    let record = rateLimitBuckets.get(ip);

    if (!record || now - record.windowStart > windowMs) {
      record = { windowStart: now, count: 1 };
      rateLimitBuckets.set(ip, record);
    } else {
      record.count += 1;
    }

    res.setHeader("X-RateLimit-Limit", maxRequests);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - record.count));
    res.setHeader("X-RateLimit-Reset", Math.ceil((record.windowStart + windowMs) / 1000));

    if (record.count > maxRequests) {
      await recordAuditLog({
        req,
        action: "SECURITY_ALERT",
        status: "WARNING",
        statusCode: 429,
        details: {
          threat: "RATE_LIMIT_EXCEEDED",
          requestsCount: record.count,
          threshold: maxRequests,
          ip,
        },
      });

      res.setHeader("Retry-After", Math.ceil((record.windowStart + windowMs - now) / 1000));
      return res.status(429).json({
        message,
        retryAfterSeconds: Math.ceil((record.windowStart + windowMs - now) / 1000),
      });
    }

    next();
  };
};

/**
 * Data Sanitizer to prevent NoSQL query injection and XSS payloads in request bodies
 */
export const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    const sanitize = (obj) => {
      for (const key of Object.keys(obj)) {
        if (key.startsWith("$") || key.includes(".")) {
          delete obj[key];
          continue;
        }
        if (typeof obj[key] === "string") {
          obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          sanitize(obj[key]);
        }
      }
    };
    sanitize(req.body);
  }
  next();
};
