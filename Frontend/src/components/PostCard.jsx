import { useAuthStore } from "../store/authStore";
import { usePostStore } from "../store/postStore";
import CommentSection from "./CommentSection";

function PostCard({ post }) {
  const currentUser = useAuthStore((state) => state.user);
  const livePost = usePostStore((state) =>
    state.posts.find((storedPost) => storedPost.id === post.id)
  );
  const toggleLike = usePostStore((state) => state.toggleLike);
  const deletePost = usePostStore((state) => state.deletePost);
  const activePost = livePost || post;

  return (
    <article className="post-card">
      <div className="post-card-header">
        <div className="post-author">
          {activePost.author.profileImage ? (
            <img
              alt={activePost.author.name}
              className="avatar"
              src={activePost.author.profileImage}
            />
          ) : (
            <div className="avatar avatar-fallback">
              {activePost.author.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3>{activePost.author.name}</h3>
            <p>{new Date(activePost.createdAt).toLocaleString()}</p>
          </div>
        </div>
        {currentUser?.id === activePost.author.id && (
          <button className="text-button" onClick={() => deletePost(activePost.id)} type="button">
            Delete
          </button>
        )}
      </div>

      {activePost.text && <p className="post-text">{activePost.text}</p>}

      {activePost.imageUrl && (
        <img
          alt={`${activePost.author.name}'s post`}
          className="post-image"
          src={activePost.imageUrl}
        />
      )}

      <div className="post-meta">
        <span>{activePost.likesCount} likes</span>
        <span>{activePost.commentsCount} comments</span>
      </div>

      {activePost.likesCount > 0 && (
        <p className="muted-text">
          Liked by: {activePost.likes.map((like) => like.username).join(", ")}
        </p>
      )}

      <div className="post-actions">
        <button
          className={activePost.isLikedByCurrentUser ? "primary-button" : "secondary-button"}
          onClick={() => toggleLike(activePost.id)}
          type="button"
        >
          {activePost.isLikedByCurrentUser ? "Unlike" : "Like"}
        </button>
      </div>

      <CommentSection postId={activePost.id} />
    </article>
  );
}

export default PostCard;
