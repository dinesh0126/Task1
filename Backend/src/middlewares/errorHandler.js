import mongoose from "mongoose";
import { env } from "../config/env.js";

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  if (error instanceof mongoose.Error) {
    return res.status(400).json({
      success: false,
      message: "Database error",
      errors: [{ field: "database", message: error.message }]
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Something went wrong",
    errors: error.errors || [],
    ...(env.isProduction ? {} : { stack: error.stack })
  });
};
