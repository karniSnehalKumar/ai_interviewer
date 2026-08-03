// rateLimiter.js — Centralised rate-limiting middleware for the AI Interview Prepper API.
//
// Each limiter is a named export so individual route files can import only what
// they need.  All limiters share the same response shape so the frontend can
// handle 429s uniformly:
//
//   { success: false, message: "...", retryAfter: <seconds> }
//
// Middleware order note:
//   Rate limiters should be placed BEFORE isAuth in every route chain.
//   This way abusive IPs are blocked at the gate — before the server spends
//   time verifying JWTs or hitting the database.
//
// Production note:
//   If your server sits behind a reverse proxy (Render, Railway, Nginx, etc.)
//   you MUST add `app.set("trust proxy", 1)` in index.js so Express reads the
//   real client IP from the X-Forwarded-For header instead of the proxy's IP.
//   Without it, every request appears to come from the same IP and the limits
//   will fire for ALL users simultaneously.

import rateLimit from "express-rate-limit";

// ---------------------------------------------------------------------------
// Shared handler — returns a consistent JSON error on every 429.
// `retryAfter` tells the client exactly how many seconds to wait.
// ---------------------------------------------------------------------------
const buildHandler = (message) => (req, res, next, options) => {
  const retryAfter = Math.ceil(options.windowMs / 1000); // convert ms → seconds
  return res.status(429).json({
    success: false,
    message,
    retryAfter,
  });
};

// ---------------------------------------------------------------------------
// 1. AUTH LIMITER
//    Applied to: POST /api/auth/google
//    Prevents brute-force credential stuffing against the sign-in endpoint.
//    5 attempts per 15 minutes per IP is tight enough to stop bots while
//    never bothering a legitimate user (who only signs in once per session).
// ---------------------------------------------------------------------------
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                   // max 5 requests per window per IP
  standardHeaders: true,    // send RateLimit-* headers (RFC 6585)
  legacyHeaders: false,     // disable old X-RateLimit-* headers
  handler: buildHandler(
    "Too many sign-in attempts. Please wait 15 minutes before trying again."
  ),
});

// ---------------------------------------------------------------------------
// 2. AI / QUESTION-GENERATION LIMITER
//    Applied to: POST /api/interview/generate-questions
//                POST /api/interview/submit-answer
//    AI calls are expensive (Gemini API tokens + latency).
//    10 requests per minute per IP keeps costs under control while supporting
//    a normal back-and-forth interview session (typically 5–8 questions).
// ---------------------------------------------------------------------------
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 10,              // max 10 AI requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: buildHandler(
    "Too many AI requests. You have exceeded 10 requests per minute. Please wait a moment."
  ),
});

// ---------------------------------------------------------------------------
// 3. UPLOAD LIMITER
//    Applied to: POST /api/interview/resume
//    File uploads consume disk I/O and trigger PDF-parsing + AI analysis.
//    5 uploads per 10 minutes per IP prevents abuse while letting a user
//    retry with a corrected resume a couple of times.
// ---------------------------------------------------------------------------
export const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,                    // max 5 uploads per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: buildHandler(
    "Too many resume uploads. You can upload up to 5 resumes per 10 minutes. Please try again later."
  ),
});

// ---------------------------------------------------------------------------
// 4. GENERAL API LIMITER
//    Applied globally to: all /api/* routes in index.js
//    Acts as a safety net for any endpoint that doesn't have a tighter limiter.
//    100 requests per 15 minutes is generous enough for normal app usage but
//    stops scrapers and runaway frontend loops.
// ---------------------------------------------------------------------------
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // max 100 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: buildHandler(
    "Too many requests from this IP. Please try again after 15 minutes."
  ),
});
