import express from "express";
import { googleSignIn, logOutUser } from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const authRouter = express.Router();

authRouter.post("/google", authLimiter, googleSignIn);
authRouter.get("/logout", logOutUser);

export default authRouter;