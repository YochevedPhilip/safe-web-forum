import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LikeButton from "../components/likeButton.jsx";
import { postsService } from "../services/postsService.js";
import styles from "../styles/PostPage.module.css";

export default function PostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const API_BASE_URL =
    import.meta.env.VITE_SERVER_API_URL || "http://localhost:5000";

  const normalizePost = (p) => {
    const likes =
      p?.likes ??
      p?.stats?.likeCount ??
      p?.stats?.like_count ??
      0;

    const liked =
      Boolean(
        p?.likedByMe ??
        p?._localLiked ??
        p?.liked ??
        p?.isLiked
      );

    return { ...p, likes, _localLiked: liked };
  };

  const loadPostPage = async () => {
    setLoading(true);
    setMsg("");

    try {
      // axios: אם יש 4xx/5xx לרוב יזרוק ל-catch
      const res = await postsService.getPost(postId, 10);
      const data = res.data;

      if (!data?.post) {
        setMsg(data?.message || "Post not found");
        setPost(null);
        setComments([]);
        return;
      }

      setPost(normalizePost(data.post));
      setComments(data.comments || []);
    } catch (err) {
      const serverMsg = err?.response?.data?.message;
      setMsg(serverMsg || `Failed to load post: ${err.message}`);
      setPost(null);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    setMsg("");
    setSubmitting(true);

    const content = newComment.trim();
    if (!content) {
      setMsg("Comment cannot be empty");
      setSubmitting(false);
      return;
    }

    if (!user) {
      setMsg("עליך להתחבר כדי להוסיף תגובה");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // אם אצלך יש auth עם cookie/headers תוסיפי פה credentials/Authorization בהתאם
        body: JSON.stringify({
          postId,
          content,
          publisherId: user.id, // אם בעתיד יש authMiddleware, לא צריך לשלוח את זה
        }),
      });

      const data = await res.json();

      // מודרציה/AI: הודעה למשתמש
      if (res.status === 403 && data?.messageToUser) {
        setMsg(data.messageToUser);
        return;
      }

      if (!res.ok) {
        setMsg(data?.message || `Error ${res.status}`);
        return;
      }

      setNewComment("");

      // הוספה מיידית לרשימה (השרת שלך כבר עושה populate ל-username? אם כן מעולה)
      const created = data.comment || data;
      setComments((prev) => [created, ...prev]);
    } catch {
      setMsg("Failed to add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`mainContainer ${styles.loadingContainer}`}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          Loading...
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={`mainContainer ${styles.errorContainer}`}>
        <div className={styles.errorCard}>

          <h2 className={styles.errorTitle}>
            {msg || "Post not found"}
          </h2>
          <button
            onClick={() => navigate("/")}
            className={styles.backButton}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const postDate = post.createdAt || post.date;
  const formattedDate = postDate ? new Date(postDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  return (
    <div className="mainContainer" style={{ direction: "ltr" }}>
      {/* Post Card */}
      <div className={styles.postCard}>
        <div className={styles.postAccentBar}></div>

        <div className={styles.postHeader}>
          <h1 className={styles.postTitle}>{post.title || "Post"}</h1>

          <div className={styles.postMetadata}>
            <span className={styles.metadataItem}>
              <span className={styles.metadataIcon}>👤</span>
              {post.author || post.publisherId?.username || "Anonymous"}
            </span>

            {formattedDate && (
              <>
                <span>•</span>
                <span className={styles.metadataItem}>
                  <span className={styles.metadataIcon}>📅</span>
                  {formattedDate}
                </span>
              </>
            )}
          </div>
        </div>

        <div className={styles.postContent}>{post.content}</div>

        <div className={styles.postActions}>
          {/* ✅ Like button מאוחד */}
          <LikeButton
            postId={String(post._id ?? post.id)}
            liked={post._localLiked}
            likes={post.likes}
            onChange={({ liked, likes }) =>
              setPost((prev) => ({ ...prev, _localLiked: liked, likes }))
            }
            onError={(err) => setMsg(err?.message || "Failed to toggle like")}
          />

          <div className={styles.commentCount}>
            <span className={styles.commentCountIcon}>💬</span>
            <span>{comments.length}</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className={styles.commentsSection}>
        <h2 className={styles.commentsTitle}>
          <span>💬</span>
          Comments ({comments.length})
        </h2>

        {user ? (
          <form onSubmit={handleAddComment} className={styles.commentForm}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={4}
              className={styles.commentTextarea}
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className={styles.commentSubmitButton}
            >
              {submitting ? "Submitting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <div className={styles.loginPrompt}>

            <p className={styles.loginPromptText}>
              You must be logged in to add a comment
            </p>
          </div>
        )}

        {msg && (
          <div className={`${styles.errorMessage} ${
            msg.includes("blocked")
              ? styles.errorMessageModeration
              : styles.errorMessageGeneric
          }`}>
            {msg}
          </div>
        )}

        {comments.length === 0 ? (
          <div className={styles.commentsEmpty}>
            <div className={styles.commentsEmptyIcon}>💭</div>
            <p className={styles.commentsEmptyText}>
              No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          <div className={styles.commentsList}>
            {comments.map((c) => (
              <div key={c._id || c.id} className={styles.commentCard}>
                <div className={styles.commentHeader}>
                  <div className={styles.commentAvatar}>
                    {(c.publisherId?.username || "A").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={styles.commentAuthor}>
                      {c.publisherId?.username || "Anonymous"}
                    </div>
                    {c.createdAt && (
                      <div className={styles.commentDate}>

                        {new Date(c.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.commentContent}>{c.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
