import { useLocation, Link } from "react-router-dom";

const PostPublished = () => {
  const location = useLocation();
  const { title, text, anonymous, aiMessage } = location.state || {};

  const isSensitive = Boolean(aiMessage);
  
  // צבעים עקביים - כתום אפרסק עדין
  const sensitiveColor = "#f39c12"; 
  const sensitiveBg = "rgba(243, 156, 18, 0.07)"; // רקע דקיק כמעט שקוף

  return (
    <div className="mainContainer" style={{ direction: "rtl" }}>
      <div className="message-card">
        
        <h1 style={{ 
          fontSize: "2.8rem", 
          color: isSensitive ? sensitiveColor : "var(--mint-soft)", 
          fontWeight: "800",
          marginBottom: "10px"
          ,fontSize:"35px"
        }}>
          {isSensitive ? "הפוסט פורסם" : "הפוסט פורסם בהצלחה"}
        </h1>

        {/* הודעת AI - גרסה קטנה וקומפקטית */}
        {aiMessage && (
          <div style={{
            background: sensitiveBg,
            borderRight: `3px solid ${sensitiveColor}`,
            padding: "8px 15px", // פדינג מינימלי
            borderRadius: "6px",
            marginBottom: "15px", // רווח קטן לפוסט
            textAlign: "right",
            display: "inline-block", // גורם לתיבה להתאים לאורך הטקסט ולא להימתח לכל הרוחב
            maxWidth: "100%"
          }}>
            <p style={{ 
              margin: 0, 
              color: "#a35d00", 
              fontSize: "0.85rem", // פונט קטן משמעותית
              fontWeight: "500",
              lineHeight: "1.4"
              ,fontSize:"18px"

            }}>
              <span style={{ marginLeft: "5px" }}>💡</span>
              {aiMessage}
            </p>
          </div>
        )}

        {/* תיבת הפוסט - חוזרת לגודל המקורי (המרשים) שלך */}
        <div style={{ 
          textAlign: "right", 
          background: isSensitive ? sensitiveBg : "#ffffff", 
          padding: "30px", 
          borderRadius: "24px", 
          marginBottom: "40px",
          border: isSensitive ? `1px solid ${sensitiveColor}33` : "1px solid #f0f0f0",
          boxShadow: isSensitive ? "0 4px 20px rgba(243, 156, 18, 0.05)" : "0 4px 20px rgba(0,0,0,0.02)",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* הפס העליון */}
          <div style={{ 
            position: "absolute", 
            top: 0, 
            left: 0, 
            right: 0, 
            height: "6px", 
            background: isSensitive ? sensitiveColor : "var(--mint-soft)" 
          }}></div>
          
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
               color: anonymous ? "#999" : (isSensitive ? sensitiveColor : "var(--peach-soft)"),
               fontWeight: "700",
               background: anonymous ? "#f5f5f5" : (isSensitive ? "rgba(243, 156, 18, 0.1)" : "rgba(255, 154, 139, 0.1)"),
               padding: "5px 15px",
               borderRadius: "20px"
             }}>
               {anonymous ? "פורסם בעילום שם" : "פורסם באופן ציבורי"}
             </span>
          </div>
        </div>

        <Link 
          to="/" 
          className="btn-pink" 
          style={{ 
            textDecoration: "none", 
            padding: "16px 60px",
            fontSize: "1.1rem",
            borderRadius: "50px"
          }}
        >
          חזרה לפיד
        </Link>
      </div>
    </div>
  );
};
export default PostPublished;