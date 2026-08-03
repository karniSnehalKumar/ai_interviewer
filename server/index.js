import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import interviewRouter from "./routes/interview.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { generalLimiter } from "./middleware/rateLimiter.js";

dotenv.config();
const app = express();

// Trust reverse proxy (Render, Railway, Nginx, etc.) for correct rate limiting and client IP detection
app.set("trust proxy", 1);

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// General rate limiter — safety net for all /api routes (100 req / 15 min per IP).
app.use("/api", generalLimiter);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interview", interviewRouter);

const port = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer();

