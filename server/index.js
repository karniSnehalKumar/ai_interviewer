import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/auth.route.js";
import cors from "cors";
dotenv.config();
const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());

app.use("/api/auth" , authRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server running on port ${port}`);
    connectDB();
})
