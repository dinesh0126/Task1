import { ZodError } from "zod";
import { ApiError } from "../utils/apiError.js";

export const validate = (schema) => (req, _res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    req.body = parsed.body;
    req.params = parsed.params;
    req.query = parsed.query;

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return next(
        new ApiError(
          400,
          "Validation failed",
          error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        )
      );
    }

    next(error);
  }
};
