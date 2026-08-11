import generateToken from "../config/generateToken.js";
import { User } from "../models/user.model.js";
import { getAuth } from "../config/firebaseAdmin.js";


const isProduction = process.env.NODE_ENV === "production";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const googleSignIn = async (req, res) => {
  try {
   
    const  IDtoken  = req.body.IDtoken;
    const decodedToken = await getAuth().verifyIdToken(IDtoken);
    const name = decodedToken.name;
    const email = decodedToken.email;
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
    res.clearCookie("token", COOKIE_OPTIONS);
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Logout failed: ${error.message}` });
  }
};

export { googleSignIn, logOutUser };