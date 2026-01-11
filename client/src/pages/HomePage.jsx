/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const HomePageDemo = ({ searchQuery = "" }) => {
  const navigate = useNavigate(); 
  const { user } = useContext(AuthContext);
  const username = user?.username;

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_SERVER_API_URL;

  const getTopicImage = (title, index) => {
    const images = {
      "כלים להרגעה וחוסן נפשי": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800",
      "תחושת בדידות": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=800",
      "יחסים עם הורים ומשפחה": "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?q=80&w=800",
      "עתיד, חלומות וקריירה": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800",
      "חברות וקשרים חברתיים": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800",
      "דימוי עצמי וביטחון": "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800"
    };
    return images[title] || `https://picsum.photos/seed/${index}/800/600?grayscale`;
  };

  useEffect(() => {
    let isMounted = true;
    const fetchTopics = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}api/topics`); // TODO: decide where is the /
        if (!res.ok) throw new Error("Failed to fetch topics");
        const data = await res.json();
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
    return () => { isMounted = false; };
  }, []);

  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="mainContainer" style={{ textAlign: 'center' }}>טוען חוויה...</div>;
  if (error) return <div className="mainContainer"><div className="message-card"><h2>אופס!</h2><p>{error}</p></div></div>;

  return (
    <div className="mainContainer">
      {username && (
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
            {username.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ margin: 0 }}>שלום, {username}!</h2>
        </div>
      )}

      <h1 className="heroTitle">מה שעל <b>הלב שלך</b> היום?</h1>

      {filteredTopics.length === 0 ? (
        <div className="message-card">
          <p>{searchQuery ? `לא נמצאו נושאים שתואמים ל-"${searchQuery}"` : "עדיין אין נושאים להצגה."}</p>
        </div>
      ) : (
        <div className="topicsGrid">
          {filteredTopics.map((t, index) => {
            const id = t.id ?? t._id ?? index;
            return (
              <div 
                key={id} 
                className="topicCard" 
                onClick={() => navigate(`/topics/${id}`)}
              >
                <img src={getTopicImage(t.title, index)} alt={t.title} />
                <div className="topicOverlay">
                  <h3 className="topicTitle">{t.title}</h3>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomePageDemo;
