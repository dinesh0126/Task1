import mongoose from "mongoose";
import { z } from "zod";

const objectIdField = (fieldName) =>
  z
    .string()
    .refine((value) => mongoose.Types.ObjectId.isValid(value), `${fieldName} is invalid`);

export const createPostSchema = z.object({
  body: z
    .object({
      text: z.string().trim().max(1000).optional().default(""),
      imageUrl: z.string().trim().url().optional().or(z.literal("")).default("")
    })
    .refine((value) => value.text || value.imageUrl, {
      message: "Either text or imageUrl is required",
      path: ["text"]
    }),
  params: z.object({}).default({}),
  query: z.object({}).default({})
});

export const listPostsSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(20).default(10)
  })
});

export const postIdParamSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    postId: objectIdField("postId")
  }),
  query: z.object({}).default({})
});

export const commentCreateSchema = z.object({
  body: z.object({
    text: z.string().trim().min(1).max(300)
  }),
  params: z.object({
    postId: objectIdField("postId")
  }),
  query: z.object({}).default({})
});

export const commentDeleteSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    postId: objectIdField("postId"),
    commentId: objectIdField("commentId")
  }),
  query: z.object({}).default({})
});
