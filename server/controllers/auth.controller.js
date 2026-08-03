// Auth controllers handle sign-in and sign-out.
// googleSignIn: finds or creates a user by email, issues a JWT cookie.
// logOutUser:   clears the JWT cookie, ending the session.

import generateToken from "../config/generateToken.js";
import { User } from "../models/user.model.js";

// Cookie options used when setting AND clearing the token cookie.
// Both must match exactly so clearCookie removes the right cookie.
const COOKIE_OPTIONS = {
  httpOnly: true,           // JS on the client cannot read this cookie (XSS protection)
  secure: process.env.NODE_ENV === "production", // Set to true in production (requires HTTPS)
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // cross-site cookie handling in prod
  path: "/",                // Must be explicit so clearCookie targets the same cookie
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

// POST /api/auth/google
// Receives { name, email } from the client after Firebase Google sign-in.
// Creates the user in MongoDB if they don't exist yet, then sets a session cookie.
const googleSignIn = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Find the user by email, or create a new record if this is their first sign-in
    let existingUser = await User.findOne({ email });
    if (!existingUser) {
      existingUser = await User.create({ name, email });
    }

    const token = generateToken(existingUser._id);

    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(200).json(existingUser);
  } catch (error) {
    return res.status(500).json({ message: `Google sign-in failed: ${error.message}` });
  }
};

// GET /api/auth/logout
// Clears the session cookie, logging the user out.
const logOutUser = (req, res) => {
  try {
    // Pass the same path/options so Express targets the exact cookie that was set
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Logout failed: ${error.message}` });
  }
};

export { googleSignIn, logOutUser };