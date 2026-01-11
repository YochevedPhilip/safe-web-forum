import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
      const res = await fetch(
        `http://localhost:5000/api/posts/${postId}?limit=10`
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

  const content = newComment.trim();
  if (!content) {
    setMsg("Comment cannot be empty");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        content,
        publisherId: user.id, // כמו שיש לך עכשיו
      }),
    });

    const data = await res.json();

    if (res.status === 403 && data?.messageToUser) {
      setMsg(data.messageToUser); // ← ההודעה היפה מה-AI
      return;
    }

    if (!res.ok) {
      setMsg(data?.message || `Error ${res.status}`);
      return;
    }

    // הצלחה
    setNewComment("");
    // await loadPostPage(); // או להוסיף לרשימה מקומית
    const createdComment = data.comment || data;
    setComments((prev) => [createdComment, ...prev]);
    } catch {
      setMsg("Failed to add comment. Please try again.");
    }};


  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (!post) return <div style={{ padding: 16 }}>{msg || "Post not found"}</div>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      <h2 style={{ marginBottom: 6 }}>{post.title || "Post"}</h2>

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
