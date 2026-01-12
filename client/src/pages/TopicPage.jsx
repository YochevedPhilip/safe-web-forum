/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import PostCard from "../components/PostCard";
import { topicsService } from "../services/topicsService";
import { postsService } from "../services/postsService";
import { likesService } from "../services/likesService";

const LIMIT = 10;

const TopicPage = ({ searchQuery }) => {
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

  const fetchPostsPage = useCallback(async (nextPage, { replace = false } = {}) => {
    const res = await postsService.getTopicPosts(topicId, nextPage, LIMIT);
    const list = normalizePosts(res.data);
    setPosts((prev) => (replace ? list : [...prev, ...list]));
    setPage(nextPage);
    setHasMore(list.length === LIMIT);
  }, [topicId]);

  useEffect(() => {
    let isMounted = true;
    const fetchTopicAndFirstPage = async () => {
      try {
        setLoading(true);
        setError(null);
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
    return () => { isMounted = false; };
  }, [topicId, fetchPostsPage]);

  const toggleLike = async (post) => {
    const postId = String(post.id ?? post._id);
    const wasLiked = Boolean(post._localLiked);

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
      if (wasLiked) await likesService.unlikePost(postId);
      else await likesService.likePost(postId);
    } catch (err) {
      // Rollback אם נכשל
      setPosts((prev) =>
        prev.map((p) => {
          const pid = String(p.id ?? p._id);
          if (pid !== postId) return p;
          return { ...p, _localLiked: wasLiked, likes: Math.max(0, (p.likes ?? 0) + (wasLiked ? 1 : -1)) };
        })
      );
      setError(err?.message || "Failed to toggle like");
    }
  };

  const loadMore = async () => {
    if (loadingMore || loading || !hasMore) return;
    try {
      setLoadingMore(true);
      await fetchPostsPage(page + 1);
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title?.toLowerCase().includes(query) ||
      post.content?.toLowerCase().includes(query)
    );
  });

  if (loading) return <div className="mainContainer"><div className="loading-state">טוען פוסטים...</div></div>;
  if (error) return <div className="mainContainer"><div className="message-card"><h2>אופס!</h2><p>{error}</p></div></div>;

  return (
    <div className="mainContainer page-bottom-padding">
      <div className="page-header">
        <h1 className="page-title">{topicTitle || "נושא"}</h1>
        <button className="btn-pink btn-small" onClick={() => navigate(`/topics/${topicId}/create-post`)}>
          + פוסט חדש
        </button>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="message-card">
          <p>{searchQuery ? `לא נמצאו פוסטים שתואמים ל-"${searchQuery}"` : "עדיין אין פוסטים בנושא זה."}</p>
        </div>
      ) : (
        <>
          <div className="posts-stack">
            {filteredPosts.map((post) => (
              <PostCard
                key={String(post.id ?? post._id)}
                post={post}
                onOpen={() => navigate(`/posts/${post.id ?? post._id}`)}
                onToggleLike={toggleLike}
              />
            ))}
          </div>

          {!searchQuery && hasMore && (
            <div className="load-more-wrapper">
              <button className="btn-mint" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "טוען עוד..." : "טען פוסטים נוספים"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TopicPage;
