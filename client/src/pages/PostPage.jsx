import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LikeButton from "../components/likeButton.jsx";
import { postsService } from "../services/postsService.js";


export default function PostPage() {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  

  const loadPostPage = async () => {
    setLoading(true);
    setMsg("");

    try {
      // use postsService (axios) so token is injected consistently
      const res = await postsService.getPost(postId, 10);
      const data = res.data;

      // handle errors from server
      if (!res || res.status >= 400) {
        setMsg(data?.message || `Error ${res?.status}`);
        setPost(null);
        setComments([]);
        return;
      }

      // ✅ normalize for LikeButton usage
      const p = data.post;
      setPost({
        ...p,
        likes: p?.likes ?? p?.stats?.likeCount ?? p?.stats?.like_count ?? 0,
        _localLiked: Boolean(p?.likedByMe ?? p?._localLiked ?? p?.liked ?? data?.likedByMe),

      });

      setComments(data.comments || []);
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

  const handleAddComment = async (e) => {
    e.preventDefault();
    setMsg("");

    const content = newComment.trim();
    if (!content) {
      setMsg("Comment cannot be empty");
      return;
    }

    // TEMP DEV MODE (no authMiddleware):
    if (!user?.id) {
      // setMsg("You must be logged in to comment");
      // return;
      return <div style={{ padding: 16 }}>You must be logged in to comment</div>;
    }

    try {
      const res = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          content,
          publisherId: user.id, // temp until authMiddleware exists
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || `Error ${res.status}`);
        return;
      }

      setNewComment("");
      await loadPostPage();
    } catch (err) {
      setMsg(`Failed to add comment: ${err.message}`);
    }
  };

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (!post) return <div style={{ padding: 16 }}>{msg || "Post not found"}</div>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      <h2 style={{ marginBottom: 6 }}>{post.title || "Post"}</h2>

      {/* ✅ Like button */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <LikeButton
          postId={String(post._id ?? post.id)}
          liked={post._localLiked}
          likes={post.likes}
          onChange={({ liked, likes }) =>
            setPost((prev) => ({
              ...prev,
              _localLiked: liked,
              likes,
            }))
          }
          onError={(err) => setMsg(err?.message || "Failed to toggle like")}
        />
      </div>

      <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>

      <hr style={{ margin: "18px 0" }} />

      <h3>Comments ({comments.length})</h3>

      <form onSubmit={handleAddComment} style={{ marginBottom: 12 }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          style={{ width: "100%", padding: 10 }}
        />
        <button type="submit" style={{ marginTop: 8 }}>
          Add comment
        </button>
      </form>

      {msg && <p style={{ color: "crimson" }}>{msg}</p>}

      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {comments.map((c) => (
            <li
              key={c._id || c.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>
                {c.publisherId?.username || "Anonymous"}
              </div>
              <div style={{ whiteSpace: "pre-wrap" }}>{c.content}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
