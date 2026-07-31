// Auth routes — no authentication required (these are the sign-in/sign-out endpoints)

import express from "express";
import { googleSignIn, logOutUser } from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/google", googleSignIn);
authRouter.get("/logout", logOutUser);

export default authRouter;