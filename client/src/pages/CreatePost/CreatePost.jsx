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
      alert("Title is too short.");
      return;
    }
    
    if (text.length < 10) {
      alert("Content is too short.");
      return;
    }
    
      const token = localStorage.getItem("token");
      console.log("token:", token);

  if (!token) {
    navigate("/error", { state: { message: "You must be logged in to publish a post." } });
    return;
  }

    setLoading(true);
    setProgress(10);

    try {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 300);

      const res = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
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
          // הצלחה: הפוסט עלה (כולל מצב MEDIUM עם תמיכה)
          console.log("*****");
          console.log(res);
          navigate("/post-published", {
            state: { 
              title, 
              text, 
              riskLevel: data.riskLevel, 
              categories: data.categories,
              aiMessage: data.aiMessage 
            },
          });
        } else {

          // Ensure user sees a meaningful message
          const errorMessage = data.messageToUser || data.error || "Something went wrong, please try again";
          navigate("/error", {
            state: { message: errorMessage },
          });
        }
      }, 500);
    } catch (err) {
      alert("Server connection error: " + err.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <div className="mainContainer">
      <div className="form-card">
        <h2 style={{ textAlign: 'center', color: 'var(--luxury-dark)', marginBottom: '20px' }}>
          Create New Post
        </h2>

        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's your title?"
        />

        <textarea
          className="form-control"
          style={{ height: "180px", resize: "none" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts with us..."
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <input
            type="checkbox"
            id="anon"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <label htmlFor="anon" style={{ cursor: 'pointer', fontWeight: '500' }}>
            Publish anonymously
          </label>
        </div>

        {loading && (
          <div className="progress-wrapper">
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>

            <p className="progress-text">Loading... {progress}%</p>
          </div>
        )}

        <button
          className="btn-pink"
          onClick={handlePublish}
          disabled={loading}
        >
          {loading ? "Publishing..." : "Publish Post Now"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;