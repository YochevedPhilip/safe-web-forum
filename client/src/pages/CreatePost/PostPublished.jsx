import { useLocation, Link } from "react-router-dom";

const PostPublished = () => {
  const location = useLocation();
  const { title, text, anonymous } = location.state || {};

  return (
    <div className="mainContainer" style={{ direction: "rtl" }}>
      <div className="message-card">
        {/* כותרת מודרנית ונקייה */}
        <h1 style={{ 
          fontSize: "2.8rem", 
          color: "var(--mint-soft)", 
          fontWeight: "800",
          letterSpacing: "-1px",
          marginBottom: "10px",
          lineHeight: "1"
        }}>
          הפוסט שלך פורסם בהצלחה 
          </h1>
        
        <h2 style={{ color: "var(--luxury-dark)", fontSize: "1.3rem", fontWeight: "400", marginBottom: "40px" }}>
        </h2>

        {/* תצוגה מקדימה מינימליסטית של הפוסט */}
        <div style={{ 
          textAlign: "right", 
          background: "#ffffff", 
          padding: "30px", 
          borderRadius: "24px", 
          marginBottom: "40px",
          border: "1px solid #f0f0f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* פס עיצובי עליון דק בצבע המנטה */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "6px", background: "var(--mint-soft)" }}></div>
          
          <h3 style={{ margin: "0 0 15px 0", fontSize: "1.4rem", color: "var(--luxury-dark)" }}>{title}</h3>
          <p style={{ fontSize: "1.1rem", color: "#555", lineHeight: "1.8", marginBottom: "20px" }}>{text}</p>
          
          <div style={{ 
            paddingTop: "20px", 
            borderTop: "1px solid #f5f5f5", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center" 
          }}>
             <span style={{ 
               fontSize: "0.85rem", 
               color: anonymous ? "#999" : "var(--peach-soft)",
               fontWeight: "700",
               background: anonymous ? "#f5f5f5" : "rgba(255, 154, 139, 0.1)",
               padding: "5px 15px",
               borderRadius: "20px"
             }}>
               {anonymous ? "פורסם בעילום שם" : "פורסם באופן ציבורי"}
             </span>
          </div>
        </div>

        {/* כפתור חזרה בעיצוב רחב ומודרני */}
        <Link 
          to="/" 
          className="btn-pink" 
          style={{ 
            textDecoration: "none", 
            display: "inline-block", 
            width: "auto", 
            padding: "16px 60px",
            fontSize: "1.1rem",
            borderRadius: "50px",
            boxShadow: "0 10px 25px rgba(255, 154, 139, 0.25)"
          }}
        >
          חזרה לפיד
        </Link>
      </div>
    </div>
  );
};

export default PostPublished;