import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { ApiError } from "../utils/apiError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../../uploads/profile-images");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const imageFileFilter = (_req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new ApiError(400, "Only image files are allowed"));
    return;
  }

  cb(null, true);
};

export const uploadProfileImage = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: imageFileFilter
}).single("profileImage");
