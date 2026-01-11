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
      navigate("/error", { state: { message: "הכותרת קצרה מדי." } });
      return;
    }
    if (text.length < 10) {
      navigate("/error", { state: { message: "התוכן קצר מדי." } });
      return;
    }


      const token = localStorage.getItem("token");
      console.log("token:", token);

  if (!token) {
    navigate("/error", { state: { message: "צריך להתחבר כדי לפרסם פוסט." } });
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
        headers: { "Content-Type": "application/json", 
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
          navigate("/post-published", {
            state: { title, text, anonymous: isAnonymous },
          });
        } else {
          navigate("/error", {
            state: { message: data.messageToUser || "שגיאה בפרסום הפוסט" },
          });
        }
      }, 500);
    } catch (err) {
      alert("שגיאה בחיבור לשרת: " + err.message);
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
          יצירת פוסט חדש
        </h2>

        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="מה הכותרת שלך?"
        />

        <textarea
          className="form-control"
          style={{ height: "180px", resize: "none" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="שתפו אותנו במחשבות שלכם..."
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <input
            type="checkbox"
            id="anon"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <label htmlFor="anon" style={{ cursor: 'pointer', fontWeight: '500' }}>
            פרסם בעילום שם
          </label>
        </div>

        {loading && (
          <div className="progress-wrapper">
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-text">טוען... {progress}%</p>
          </div>
        )}

        <button
          className="btn-pink"
          onClick={handlePublish}
          disabled={loading}
        >
          {loading ? "מפרסם כרגע..." : "פרסם פוסט עכשיו"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
