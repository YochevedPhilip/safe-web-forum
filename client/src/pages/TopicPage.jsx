import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import PostCard from "../components/PostCard";
import { topicsService } from "../services/topicsService";
import { postsService } from "../services/postsService";
import { likesService } from "../services/likesService";

const LIMIT = 10;

const TopicPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [topicTitle, setTopicTitle] = useState("");
  const [posts, setPosts] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true); 
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const normalizePosts = (list) =>
    (Array.isArray(list) ? list : []).map((p) => ({
      ...p,
      _localLiked: Boolean(p.likedByMe),
      likes: p.likes ?? p.stats?.likeCount ?? 0,
    }));

  const fetchPostsPage = async (nextPage, { replace = false } = {}) => {
    const res = await postsService.getTopicPosts(topicId, nextPage, LIMIT);
    const list = normalizePosts(res.data);

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

        const topicRes = await topicsService.getTopic(topicId);
        const topicData = topicRes.data;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // ⭐ TOGGLE LIKE (Post)
  const toggleLike = async (post) => {
    const postId = String(post.id ?? post._id);
    const wasLiked = Boolean(post._localLiked);

    // optimistic UI
    setPosts((prev) =>
      prev.map((p) => {
        const pid = String(p.id ?? p._id);
        if (pid !== postId) return p;

        return {
          ...p,
          _localLiked: !wasLiked,
          likes: Math.max(0, (p.likes ?? 0) + (wasLiked ? -1 : 1)),
        };
      })
    );

    try {
      if (wasLiked) {
        await likesService.unlikePost(postId);
      } else {
        await likesService.likePost(postId);
      }
    } catch (err) {
      // rollback
      setPosts((prev) =>
        prev.map((p) => {
          const pid = String(p.id ?? p._id);
          if (pid !== postId) return p;

          return {
            ...p,
            _localLiked: wasLiked,
            likes: Math.max(0, (p.likes ?? 0) + (wasLiked ? 1 : -1)),
          };
        })
      );

      setError(err?.message || "Failed to toggle like");
    }
  };

  if (loading) return <p>טוען פוסטים...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px", paddingBottom: "140px" }}>
      <h1>{topicTitle || "Topic"}</h1>

      <button
        onClick={() => navigate(`/topics/${topicId}/create-post`)}
        style={{ marginBottom: "20px" }}
      >
        + יצירת פוסט חדש
      </button>

      {posts.length === 0 ? (
        <p>עדיין לא נכתבו פוסטים תחת נושא זה</p>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={String(post.id ?? post._id)}
              post={post}
              onOpen={(id) => navigate(`/posts/${id}`)}
              onToggleLike={toggleLike}
            />
          ))}

          <div style={{ marginTop: 16 }}>
            {hasMore ? (
              <button onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "טוען..." : "טען עוד"}
              </button>
            ) : (
              <p style={{ opacity: 0.7 }}>אין פוסטים נוספים</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TopicPage;
