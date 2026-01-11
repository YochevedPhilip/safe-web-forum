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

  const handlePublish = async () => {
    // בדיקות תקינות
    if (title.length < 3) {
      navigate("/error", { state: { message: "הכותרת קצרה מדי." } });
      return;
    }

    if (text.length < 10) {
      navigate("/error", { state: { message: "התוכן קצר מדי." } });
      return;
    }

    setLoading(true);
    setProgress(10);

    try {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 300);

      const res = await fetch("http://localhost:5001/api/posts", {
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
          <div style={{ marginBottom: "20px" }}>
            <div style={{ height: '8px', background: '#eee', borderRadius: '10px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${progress}%`, 
                  height: '100%', 
                  background: 'var(--mint-soft)', 
                  transition: 'width 0.3s' 
                }} 
              />
            </div>
            <p style={{ textAlign: "center", fontSize: "0.8rem", marginTop: "5px" }}>טוען... {progress}%</p>
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