import { useEffect } from "react";
import PostComposer from "../components/PostComposer";
import PostCard from "../components/PostCard";
import { useAuthStore } from "../store/authStore";
import { usePostStore } from "../store/postStore";

function FeedPage() {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const posts = usePostStore((state) => state.posts);
  const page = usePostStore((state) => state.page);
  const totalPages = usePostStore((state) => state.totalPages);
  const isFeedLoading = usePostStore((state) => state.isFeedLoading);
  const feedError = usePostStore((state) => state.feedError);
  const fetchFeed = usePostStore((state) => state.fetchFeed);

  useEffect(() => {
    restoreSession();
    fetchFeed(1);
  }, [restoreSession, fetchFeed]);

  return (
    <div className="feed-layout">
      <PostComposer />

      {feedError && <div className="status-card error-card">{feedError}</div>}

      {isFeedLoading ? (
        <div className="status-card">Loading feed...</div>
      ) : posts.length === 0 ? (
        <div className="status-card">No posts yet. Create the first one.</div>
      ) : (
        <section className="feed-list">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      )}

      <div className="pagination">
        <button
          className="secondary-button"
          disabled={page <= 1}
          onClick={() => fetchFeed(page - 1)}
          type="button"
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.max(totalPages, 1)}
        </span>
        <button
          className="secondary-button"
          disabled={page >= totalPages}
          onClick={() => fetchFeed(page + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default FeedPage;
