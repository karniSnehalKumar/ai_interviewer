// isAuth middleware validates the JWT cookie on every protected route.
// On success, it attaches req.userId so downstream controllers know who is making the request.

import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    // jwt.verify throws JsonWebTokenError / TokenExpiredError if the token is invalid
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the userId from the token payload so controllers can use it
    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    // JsonWebTokenError = tampered/malformed token
    // TokenExpiredError = token past its 7-day window
    // Both are auth failures → 401, not 500
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({ message: "Authentication token invalid or expired" });
    }

    // Unexpected server-side error
    return res.status(500).json({ message: `Authentication middleware error: ${error.message}` });
  }
};

export default isAuth;