import express from "express";
import { getMe, login, signup } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { uploadProfileImage } from "../middlewares/upload.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, signupSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/signup", uploadProfileImage, validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getMe);

export default router;
