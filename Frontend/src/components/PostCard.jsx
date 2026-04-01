import { useAuthStore } from "../store/authStore";
import { usePostStore } from "../store/postStore";
import CommentSection from "./CommentSection";

function PostCard({ post }) {
  const currentUser = useAuthStore((state) => state.user);
  const toggleLike = usePostStore((state) => state.toggleLike);
  const deletePost = usePostStore((state) => state.deletePost);

  return (
    <article className="post-card">
      <div className="post-card-header">
        <div className="post-author">
          {post.author.profileImage ? (
            <img
              alt={post.author.name}
              className="avatar"
              src={post.author.profileImage}
            />
          ) : (
            <div className="avatar avatar-fallback">
              {post.author.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3>{post.author.name}</h3>
            <p>{new Date(post.createdAt).toLocaleString()}</p>
          </div>
        </div>
        {currentUser?.id === post.author.id && (
          <button className="text-button" onClick={() => deletePost(post.id)} type="button">
            Delete
          </button>
        )}
      </div>

      {post.text && <p className="post-text">{post.text}</p>}

      {post.imageUrl && (
        <img
          alt={`${post.author.name}'s post`}
          className="post-image"
          src={post.imageUrl}
        />
      )}

      <div className="post-meta">
        <span>{post.likesCount} likes</span>
        <span>{post.commentsCount} comments</span>
      </div>

      {post.likesCount > 0 && (
        <p className="muted-text">Liked by: {post.likes.map((like) => like.username).join(", ")}</p>
      )}

      <div className="post-actions">
        <button
          className={post.isLikedByCurrentUser ? "primary-button" : "secondary-button"}
          onClick={() => toggleLike(post.id)}
          type="button"
        >
          {post.isLikedByCurrentUser ? "Unlike" : "Like"}
        </button>
      </div>

      <CommentSection post={post} />
    </article>
  );
}

export default PostCard;
