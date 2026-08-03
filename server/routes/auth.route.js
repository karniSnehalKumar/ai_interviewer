// Auth routes — no authentication required (these are the sign-in/sign-out endpoints)
// authLimiter is applied only to POST /google to throttle brute-force sign-in attempts.

import express from "express";
import { googleSignIn, logOutUser } from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const authRouter = express.Router();

// authLimiter: 5 requests per 15 minutes per IP (brute-force protection)
authRouter.post("/google", authLimiter, googleSignIn);
// No limiter on logout — it's a stateless cookie-clear, not a sensitive operation
authRouter.get("/logout", logOutUser);

export default authRouter;