import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export const signupSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(50),
    email: z.string().trim().email().toLowerCase(),
    password: z
      .string()
      .min(8)
      .regex(
        passwordRegex,
        "Password must include uppercase, lowercase, number and special character"
      )
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({})
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(8)
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({})
});
