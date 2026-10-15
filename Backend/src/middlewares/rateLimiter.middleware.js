import rateLimit from "express-rate-limit";

/**
 * Global rate limiter across all /api routes
 * Prevents overall server denial-of-service and high-frequency crawling
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1500, // 1500 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
});

/**
 * Strict authentication limiter for login, OTP verification, and password resets
 * Protects against credential stuffing and brute-force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 15 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please wait 15 minutes before trying again.",
  },
});

/**
 * Super Admin operations rate limiter
 * Protects sensitive administrative management endpoints
 */
export const superAdminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 120, // 120 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Rate limit exceeded for administrative actions. Please try again later.",
  },
});

/**
 * Public form submission limiter
 * Protects registration and contact submission forms against automated bot flooding
 */
export const publicSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 submissions per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many submissions received from your connection. Please wait a few minutes.",
  },
});
