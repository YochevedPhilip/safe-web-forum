import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // אופציונלי: אם אתם שומרים username ב-localStorage אחרי login
  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    let isMounted = true;

    const fetchTopics = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:5000/api/topics");
        if (!res.ok) throw new Error("Failed to fetch topics");
        const data = await res.json();

        // תומך בכמה פורמטים נפוצים:
        // 1) מערך ישיר: [{id,title}, ...]
        // 2) עטיפה: { topics: [...] }
        // 3) עטיפה אחרת: { data: [...] }
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.topics)
          ? data.topics
          : Array.isArray(data?.data)
          ? data.data
          : [];

        if (!isMounted) return;
        setTopics(list);
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Something went wrong");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTopics();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading topics...</p>;
  if (error) return <p style={{ padding: 20 }}>Error: {error}</p>;

  return (
    <div style={{ padding: 20 }}>
      {/* Avatar בסיסי (כמו בדיזיין) */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div
          aria-label="avatar"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "1px solid #ccc",
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
          }}
        >
          {String(username).charAt(0).toUpperCase()}
        </div>

        <h2 style={{ margin: 0 }}>Welcome, {username}!</h2>
      </div>

      <h3 style={{ marginTop: 0 }}>Trending topics</h3>

      {topics.length === 0 ? (
        <p>No topics yet</p>
      ) : (
        <ul style={{ paddingLeft: 18 }}>
          {topics.map((t) => {
            const id = String(t.id ?? t._id ?? t.topicId ?? "");
            const title = t.title ?? t.name ?? "Topic";

            return (
              <li key={id || title} style={{ marginBottom: 10 }}>
                <button
                  onClick={() => navigate(`/topics/${id}`)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: 16,
                  }}
                >
                  {title}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default HomePage;
