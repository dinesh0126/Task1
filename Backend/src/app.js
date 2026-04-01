import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultAllowedOrigins = [
  "http://localhost:5173",
  "https://task1-orcin-iota.vercel.app"
];
const allowedOrigins =
  env.clientUrls.length > 0 ? env.clientUrls : defaultAllowedOrigins;

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(morgan(env.isProduction ? "combined" : "dev"));
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server running successfully",
    data: {
      status: "ok",
      docs: "/api/v1/health"
    }
  });
});

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy"
  });
});

app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/posts", postRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
