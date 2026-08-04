import rateLimit from "express-rate-limit";

const buildHandler = (message) => (req, res, next, options) => {
  const retryAfter = Math.ceil(options.windowMs / 1000);
  return res.status(429).json({
    success: false,
    message,
    retryAfter,
  });
};

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: buildHandler(
    "Too many sign-in attempts. Please wait 15 minutes before trying again."
  ),
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: buildHandler(
    "Too many AI requests. You have exceeded 10 requests per minute. Please wait a moment."
  ),
});

export const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: buildHandler(
    "Too many resume uploads. You can upload up to 5 resumes per 10 minutes. Please try again later."
  ),
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: buildHandler(
    "Too many requests from this IP. Please try again after 15 minutes."
  ),
});
