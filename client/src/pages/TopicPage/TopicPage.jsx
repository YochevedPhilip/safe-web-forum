import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const LIMIT = 10;

const TopicPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [topicTitle, setTopicTitle] = useState("");
  const [posts, setPosts] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true); // טעינה ראשונית
  const [loadingMore, setLoadingMore] = useState(false); // טעינה של "עוד"
  const [error, setError] = useState(null);
  

  const fetchPostsPage = async (nextPage, { replace = false } = {}) => {
    const res = await fetch(
      `http://localhost:5000/api/posts/topics/${topicId}/posts?page=${nextPage}&limit=${LIMIT}`
    );
    if (!res.ok) throw new Error("Failed to fetch posts");
    const data = await res.json();

    const list = Array.isArray(data) ? data : [];
    setPosts((prev) => (replace ? list : [...prev, ...list]));
    setPage(nextPage);

    setHasMore(list.length === LIMIT);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchTopicAndFirstPage = async () => {
      try {
        setLoading(true);
        setError(null);

        // reset
        setPosts([]);
        setPage(1);
        setHasMore(true);

        const topicRes = await fetch(`http://localhost:5000/api/topics/${topicId}`);
        if (!topicRes.ok) throw new Error("Failed to fetch topic");
        const topicData = await topicRes.json();
        const title = topicData?.title ?? topicData?.topic?.title ?? "";

        if (!isMounted) return;
        setTopicTitle(title);

        await fetchPostsPage(1, { replace: true });
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Something went wrong");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTopicAndFirstPage();
    return () => {
      isMounted = false;
    };
  }, [topicId]);

  const loadMore = async () => {
    if (loadingMore || loading || !hasMore) return;
    try {
      setLoadingMore(true);
      setError(null);
      await fetchPostsPage(page + 1);
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px", paddingBottom: "140px" }}>
      <h1>{topicTitle || "Topic"}</h1>

      <button
        onClick={() => navigate(`/topics/${topicId}/create-post`)}
        style={{ marginBottom: "20px" }}
      >
        + Create Post
      </button>

      {posts.length === 0 ? (
        <p>No posts yet</p>
      ) : (
        <>
          {posts.map((post) => {
            const postId = String(post.id);

            return (
              <div
                key={postId}
                onClick={() => navigate(`/posts/${postId}`)}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "12px",
                  cursor: "pointer",
                }}
              >
                <h3>{post.title}</h3>
                <p>{post.content}</p>

                <small>
                  By {post.author ?? "Anonymous"} ·{" "}
                  {post.date ? new Date(post.date).toLocaleDateString() : ""}
                </small>

                <div style={{ marginTop: "8px" }}>
                  ❤️ {post.likes ?? 0} &nbsp; 💬 {post.comments ?? 0}
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: 16 }}>
            {hasMore ? (
              <button onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            ) : (
              <p style={{ opacity: 0.7 }}>No more posts</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TopicPage;
