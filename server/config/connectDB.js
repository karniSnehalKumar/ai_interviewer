// Establishes a connection to MongoDB using the MONGODB_URL environment variable.
// Called once at server startup. Exits the process on failure.

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;