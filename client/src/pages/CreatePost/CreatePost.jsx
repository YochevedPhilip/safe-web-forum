import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CreatePost = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const API_BASE_URL = import.meta.env.VITE_SERVER_API_URL;


  const handlePublish = async () => {
    if (title.length < 3) {
      navigate("/error", { state: { message: "Title is too short." } });
      return;
    }

    if (text.length < 10) {
      navigate("/error", { state: { message: "Content is too short." } });
      return;
    }

    setLoading(true);
    setProgress(10);

    try {

      // סימולציה של טעינה מדורגת
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 300);

      const res = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publisherId: "64c1f1d2a5e8b3a1f2c4d5e6",
          topicId,
          title,
          content: text,
          anonymous: isAnonymous,
        }),
      });

      clearInterval(interval);
      setProgress(100);

      const data = await res.json();

      setTimeout(() => {
        if (res.status === 201) {
          navigate("/post-published", {
            state: { title, text, anonymous: isAnonymous },
          });
        } else {
          navigate("/error", {
            state: { message: data.messageToUser || "Error publishing post" },
          });
        }
      }, 500);
    } catch (err) {
      alert("Error publishing post: " + err.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Create a Post</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter post title..."
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
      />

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write something here..."
        rows={8}
        style={{ padding: "10px", width: "100%" }}
      />

      <div style={{ marginTop: "10px" }}>
        <label>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />{" "}
          Publish anonymously
        </label>
      </div>

      {loading && (
        <div style={{ marginTop: "15px" }}>
          <div
            style={{
              height: "10px",
              width: "100%",
              backgroundColor: "#e0e0e0",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                height: "10px",
                width: `${progress}%`,
                backgroundColor: "#4caf50",
                borderRadius: "5px",
                transition: "width 0.3s",
              }}
            />
          </div>
          <p style={{ textAlign: "center", marginTop: "5px" }}>
            Loading... {progress}%
          </p>
        </div>
      )}

      <button
        onClick={handlePublish}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Publishing..." : "Publish Post"}
      </button>
    </div>
  );
};

export default CreatePost;
