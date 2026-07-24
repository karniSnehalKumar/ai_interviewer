import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
    console.log("hello world");
    res.send("hello world");
})

app.listen(port, () => {
    console.log(`server running on port ${port}`);
    connectDB();
})
