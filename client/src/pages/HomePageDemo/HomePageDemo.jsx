import { useEffect, useState } from "react";
const HomePageDemo = ({ searchQuery = "" }) => { // הוסיפי את ה-searchQuery בתוך הסוגריים  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const fetchTopics = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/topics");
        const data = await res.json();
        setTopics(Array.isArray(data) ? data : data?.topics || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchTopics();
  }, []);
  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (loading) return <div className="mainContainer" style={{textAlign:'center'}}>טוען חוויה...</div>;

  return (
    <div className="mainContainer">
      <h1 className="heroTitle">מה שעל <b>הלב שלך</b> היום?</h1>
      
      <div className="topicsGrid">
      {filteredTopics.map((t, index) => (  
                <div key={index} className="topicCard" onClick={() => navigate(`/topics/${t.id || t._id}`)}>
            <img src={getTopicImage(t.title, index)} alt={t.title} />
            <div className="topicOverlay">
              <h3 className="topicTitle">{t.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePageDemo;