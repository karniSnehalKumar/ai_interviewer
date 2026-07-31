import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import interviewRouter from "./routes/interview.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth" , authRouter);
app.use("/api/user" , userRouter);
app.use ("/api/interview" , interviewRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server running on port ${port}`);
    connectDB();
})
