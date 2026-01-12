import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { likesService } from "../services/likesService";
import styles from "../styles/PostPage.module.css";

export default function PostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const API_BASE_URL = import.meta.env.VITE_SERVER_API_URL || "http://localhost:5000";

  const loadPostPage = async () => {
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/posts/${postId}?limit=10`
      );

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || `Error ${res.status}`);
        setPost(null);
        setComments([]);
        return;
      }

      setPost(data.post);
      setComments(data.comments || []);
      setLikesCount(data.post?.likes || 0);
      setIsLiked(data.post?.isLiked || false);
    } catch (err) {
      setMsg(`Failed to load post: ${err.message}`);
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

  // const handleAddComment = async (e) => {
  //   e.preventDefault();
  //   setMsg("");

  //   const content = newComment.trim();
  //   if (!content) {
  //     setMsg("Comment cannot be empty");
  //     return;
  //   }

  //   // TEMP DEV MODE (no authMiddleware):
  //   if (!user?.id) {
  //   //   setMsg("You must be logged in to comment");
  //   //   return;
  //       return <div style={{padding:16}}>You must be logged in to comment</div>
  //   }

  //   try {
  //     const res = await fetch("http://localhost:5000/api/comments", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         postId,
  //         content,
  //         publisherId: user.id, // temp until authMiddleware exists
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       setMsg(data.message || `Error ${res.status}`);
  //       return;
  //     }

  //     setNewComment("");
  //     await loadPostPage();
  //   } catch (err) {
  //     setMsg(`Failed to add comment: ${err.message}`);
  //   }
  // };

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

    try {
      const res = await fetch(`${API_BASE_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          content,
          publisherId: user.id,
        }),
      });

      const data = await res.json();

      if (res.status === 403 && data?.messageToUser) {
        setMsg(data.messageToUser);
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        setMsg(data?.message || `Error ${res.status}`);
        setSubmitting(false);
        return;
      }

      // Success
      setNewComment("");
      const createdComment = data.comment || data;
      setComments((prev) => [createdComment, ...prev]);
      setMsg("");
    } catch {
      setMsg("Failed to add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async () => {
    if (!user) {
      setMsg("You must be logged in to like posts");
      return;
    }

    try {
      if (isLiked) {
        await likesService.unlikePost(postId);
        setIsLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        await likesService.likePost(postId);
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch {
      setMsg("Failed to update like. Please try again.");
    }
  };


  if (loading) {
    return (
      <div className={`mainContainer ${styles.loadingContainer}`}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          טוען...
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={`mainContainer ${styles.errorContainer}`}>
        <div className={styles.errorCard}>
          <h2 className={styles.errorTitle}>
            {msg || "הפוסט לא נמצא"}
          </h2>
          <button
            onClick={() => navigate("/")}
            className={styles.backButton}
          >
            חזרה לדף הבית
          </button>
        </div>
      </div>
    );
  }

  const postDate = post.createdAt || post.date;
  const formattedDate = postDate ? new Date(postDate).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  return (
    <div className="mainContainer" style={{ direction: "rtl" }}>
      {/* Post Card */}
      <div className={styles.postCard}>
        {/* Top accent bar */}
        <div className={styles.postAccentBar}></div>

        {/* Post Header */}
        <div className={styles.postHeader}>
          <h1 className={styles.postTitle}>
            {post.title || "Post"}
          </h1>
          
          <div className={styles.postMetadata}>
            <span className={styles.metadataItem}>
              <span className={styles.metadataIcon}>👤</span>
              {post.author || post.publisherId?.username || "אנונימי"}
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

        {/* Post Content */}
        <div className={styles.postContent}>
          {post.content}
        </div>

        {/* Post Actions */}
        <div className={styles.postActions}>
          <button
            type="button"
            onClick={handleToggleLike}
            className={`${styles.likeButton} ${isLiked ? styles.likeButtonLiked : ""}`}
          >
            <span className={styles.likeIcon}>{isLiked ? "❤️" : "🤍"}</span>
            <span>{likesCount}</span>
          </button>

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
          תגובות ({comments.length})
        </h2>

        {/* Comment Form */}
        {user && (
          <form onSubmit={handleAddComment} className={styles.commentForm}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="כתוב תגובה..."
              rows={4}
              className={styles.commentTextarea}
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className={styles.commentSubmitButton}
            >
              {submitting ? "שולח..." : "פרסם תגובה"}
            </button>
          </form>
        )}

        {!user && (
          <div className={styles.loginPrompt}>
            <p className={styles.loginPromptText}>
              עליך להתחבר כדי להוסיף תגובה
            </p>
          </div>
        )}

        {/* Error Message */}
        {msg && (
          <div className={`${styles.errorMessage} ${
            msg.includes("נחסם") || msg.includes("blocked")
              ? styles.errorMessageModeration
              : styles.errorMessageGeneric
          }`}>
            {msg}
          </div>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className={styles.commentsEmpty}>
            <div className={styles.commentsEmptyIcon}>💭</div>
            <p className={styles.commentsEmptyText}>
              עדיין אין תגובות. היה הראשון להגיב!
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
                      {c.publisherId?.username || "אנונימי"}
                    </div>
                    {c.createdAt && (
                      <div className={styles.commentDate}>
                        {new Date(c.createdAt).toLocaleDateString('he-IL', {
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
                <div className={styles.commentContent}>
                  {c.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
