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

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
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
