// Generates a signed JWT for the given userId.
// The token is valid for 7 days and is used to authenticate API requests via cookies.
// Throws if JWT_SECRET is not set or signing fails — do NOT silently swallow errors here,
// because a missing/undefined token would break all subsequent auth checks.

import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

export default generateToken;
