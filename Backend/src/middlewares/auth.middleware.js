import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token is required");
  }

  const token = header.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  req.user = user;
  next();
});
