import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    username: {
      type: String,
      required: true,
      trim: true
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    username: {
      type: String,
      required: true,
      trim: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ""
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ""
    },
    likes: {
      type: [likeSchema],
      default: []
    },
    comments: {
      type: [commentSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const Post = mongoose.model("Post", postSchema);
