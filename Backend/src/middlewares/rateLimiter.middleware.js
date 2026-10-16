import rateLimit from "express-rate-limit";

/**
 * Helper to build rich, machine-readable and user-friendly rate limit responses
 */
const createRateLimitHandler = (scopeName, defaultMessageFn) => (req, res, next, options) => {
  const resetTime = req.rateLimit?.resetTime ? new Date(req.rateLimit.resetTime) : new Date(Date.now() + options.windowMs);
  const retryAfterSec = Math.max(1, Math.ceil((resetTime.getTime() - Date.now()) / 1000));
  const retryAfterMin = Math.ceil(retryAfterSec / 60);

  res.status(options.statusCode || 429).json({
    success: false,
    statusCode: options.statusCode || 429,
    message: defaultMessageFn(retryAfterSec, retryAfterMin),
    rateLimit: {
      scope: scopeName,
      limit: options.max,
      current: req.rateLimit?.current || options.max,
      remaining: 0,
      retryAfter: retryAfterSec,
      retryAfterMinutes: retryAfterMin,
      resetTime: resetTime.toISOString(),
    },
  });
};

/**
 * Global rate limiter across all /api routes
 * Prevents overall server denial-of-service and high-frequency crawling
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1500, // 1500 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    "GLOBAL_API",
    (sec, min) => `Too many requests from your IP. Please try again in ${min} minute(s) (${sec}s).`
  ),
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
  handler: createRateLimitHandler(
    "AUTH_SECURITY",
    (sec, min) => `Too many authentication attempts. Security cooldown active for ${min} minute(s) (${sec}s).`
  ),
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
  handler: createRateLimitHandler(
    "SUPER_ADMIN",
    (sec, min) => `Administrative action rate limit exceeded. Please try again in ${min} minute(s).`
  ),
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
  handler: createRateLimitHandler(
    "PUBLIC_FORMS",
    (sec, min) => `Too many form submissions received from your connection. Please wait ${min} minute(s) (${sec}s).`
  ),
});
