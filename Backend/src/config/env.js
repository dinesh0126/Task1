import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "../../");
const envPath = path.join(backendRoot, ".env");
const envExamplePath = path.join(backendRoot, ".env.example");

let loadedEnvFile = null;

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  loadedEnvFile = envPath;
} else if (fs.existsSync(envExamplePath)) {
  dotenv.config({ path: envExamplePath });
  loadedEnvFile = envExamplePath;
} else {
  dotenv.config();
}

console.log("[env] backend root:", backendRoot);
console.log("[env] loaded file:", loadedEnvFile || "default dotenv resolution");
console.log("[env] MONGODB_URI present:", Boolean(process.env.MONGODB_URI));
console.log("[env] JWT_SECRET present:", Boolean(process.env.JWT_SECRET));

const requiredEnv = ["MONGODB_URI", "JWT_SECRET"];
const missingKeys = requiredEnv.filter((key) => !process.env[key]);

if (missingKeys.length > 0) {
  console.log("[env] missing variables:", missingKeys.join(", "));
  throw new Error(
    `Missing required environment variable: ${missingKeys.join(", ")}`
  );
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  isProduction: process.env.NODE_ENV === "production"
};
