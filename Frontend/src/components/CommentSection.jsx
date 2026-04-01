import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { usePostStore } from "../store/postStore";

function CommentSection({ postId }) {
  const [commentText, setCommentText] = useState("");
  const currentUser = useAuthStore((state) => state.user);
  const post = usePostStore((state) =>
    state.posts.find((storedPost) => storedPost.id === postId)
  );
  const addComment = usePostStore((state) => state.addComment);
  const deleteComment = usePostStore((state) => state.deleteComment);

  if (!post) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) {
      return;
    }

    const result = await addComment(post.id, trimmed);
    if (result.success) {
      setCommentText("");
    }
  };

  return (
    <div className="comment-section">
      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          onChange={(event) => setCommentText(event.target.value)}
          placeholder="Write a comment..."
          type="text"
          value={commentText}
        />
        <button className="secondary-button" type="submit">
          Comment
        </button>
      </form>

      <div className="comment-list">
        {post.comments.length === 0 ? (
          <p className="muted-text">No comments yet.</p>
        ) : (
          post.comments.map((comment) => (
            <article className="comment-item" key={comment._id}>
              <div>
                <strong>{comment.username}</strong>
                <p>{comment.text}</p>
              </div>
              {currentUser?.id === comment.user && (
                <button
                  className="text-button"
                  onClick={() => deleteComment(post.id, comment._id)}
                  type="button"
                >
                  Delete
                </button>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;
