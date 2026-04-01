import express from "express";
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  getFeed,
  getSinglePost,
  toggleLike
} from "../controllers/post.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  commentCreateSchema,
  commentDeleteSchema,
  createPostSchema,
  listPostsSchema,
  postIdParamSchema
} from "../validations/post.validation.js";

const router = express.Router();

router.get("/", validate(listPostsSchema), getFeed);
router.post("/", protect, validate(createPostSchema), createPost);
router.get("/:postId", validate(postIdParamSchema), getSinglePost);
router.delete("/:postId", protect, validate(postIdParamSchema), deletePost);
router.patch("/:postId/like", protect, validate(postIdParamSchema), toggleLike);
router.post("/:postId/comments", protect, validate(commentCreateSchema), addComment);
router.delete(
  "/:postId/comments/:commentId",
  protect,
  validate(commentDeleteSchema),
  deleteComment
);

export default router;
