// User controllers handle fetching user profile data.
// All routes here require the isAuth middleware to be applied first.

import { User } from "../models/user.model.js";

// GET /api/user/current-user
// Returns the full user document for the currently authenticated user.
// req.userId is set by the isAuth middleware after verifying the JWT cookie.
export const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to fetch current user: ${error.message}` });
  }
};