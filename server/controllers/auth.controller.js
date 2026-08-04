import generateToken from "../config/generateToken.js";
import { User } from "../models/user.model.js";

// SameSite=None + Secure=true is required for cross-origin cookie sending.
// Client and server are on different domains (e.g. Vercel + Render),
// so we always need these settings — regardless of NODE_ENV.
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const googleSignIn = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

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

const logOutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Logout failed: ${error.message}` });
  }
};

export { googleSignIn, logOutUser };