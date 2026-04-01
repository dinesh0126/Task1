import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/apiResponse.js";
import { generateToken } from "../utils/token.js";

const buildAuthPayload = (user) => ({
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage
  },
  token: generateToken({ userId: user._id })
});

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const profileImage = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/profile-images/${req.file.filename}`
    : "";

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    profileImage
  });

  return sendResponse(res, 201, "Account created successfully", buildAuthPayload(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  return sendResponse(res, 200, "Login successful", buildAuthPayload(user));
});

export const getMe = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, "Current user fetched successfully", {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profileImage: req.user.profileImage
    }
  });
});
