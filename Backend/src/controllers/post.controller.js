import mongoose from "mongoose";
import { Post } from "../models/Post.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/apiResponse.js";

const formatPost = (post, currentUserId = "") => ({
  id: post._id,
  text: post.text,
  imageUrl: post.imageUrl,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  author: {
    id: post.author?._id || post.author,
    name: post.author?.name || "",
    email: post.author?.email || "",
    profileImage: post.author?.profileImage || ""
  },
  likes: post.likes,
  likesCount: post.likes.length,
  comments: post.comments,
  commentsCount: post.comments.length,
  isLikedByCurrentUser: post.likes.some(
    (like) => like.user.toString() === currentUserId.toString()
  )
});

const getPostById = async (postId) => {
  const post = await Post.findById(postId).populate("author", "name email profileImage");
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  return post;
};

export const createPost = asyncHandler(async (req, res) => {
  const post = await Post.create({
    author: req.user._id,
    text: req.body.text || "",
    imageUrl: req.body.imageUrl || ""
  });

  const populatedPost = await Post.findById(post._id).populate(
    "author",
    "name email profileImage"
  );

  return sendResponse(res, 201, "Post created successfully", {
    post: formatPost(populatedPost, req.user._id)
  });
});

export const getFeed = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;

  const [posts, totalPosts] = await Promise.all([
    Post.find()
      .populate("author", "name email profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Post.countDocuments()
  ]);

  return sendResponse(
    res,
    200,
    "Feed fetched successfully",
    {
      posts: posts.map((post) => formatPost(post, req.user?._id))
    },
    {
      page,
      limit,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit)
    }
  );
});

export const getSinglePost = asyncHandler(async (req, res) => {
  const post = await getPostById(req.params.postId);
  return sendResponse(res, 200, "Post fetched successfully", {
    post: formatPost(post, req.user?._id)
  });
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can delete only your own posts");
  }

  await post.deleteOne();
  return sendResponse(res, 200, "Post deleted successfully");
});

export const toggleLike = asyncHandler(async (req, res) => {
  const post = await getPostById(req.params.postId);
  const userId = req.user._id.toString();

  const likeIndex = post.likes.findIndex((like) => like.user.toString() === userId);

  if (likeIndex >= 0) {
    post.likes.splice(likeIndex, 1);
  } else {
    post.likes.push({
      user: new mongoose.Types.ObjectId(userId),
      username: req.user.name,
      likedAt: new Date()
    });
  }

  await post.save();
  const updatedPost = await getPostById(req.params.postId);

  return sendResponse(res, 200, likeIndex >= 0 ? "Post unliked" : "Post liked", {
    post: formatPost(updatedPost, req.user._id)
  });
});

export const addComment = asyncHandler(async (req, res) => {
  const post = await getPostById(req.params.postId);

  post.comments.push({
    user: req.user._id,
    username: req.user.name,
    text: req.body.text
  });

  await post.save();
  const updatedPost = await getPostById(req.params.postId);

  return sendResponse(res, 201, "Comment added successfully", {
    post: formatPost(updatedPost, req.user._id)
  });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const post = await getPostById(req.params.postId);
  const comment = post.comments.id(req.params.commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can delete only your own comments");
  }

  comment.deleteOne();
  await post.save();

  const updatedPost = await getPostById(req.params.postId);

  return sendResponse(res, 200, "Comment deleted successfully", {
    post: formatPost(updatedPost, req.user._id)
  });
});
