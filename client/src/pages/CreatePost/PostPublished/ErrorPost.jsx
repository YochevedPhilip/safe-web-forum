import { useLocation, Link } from "react-router-dom";

const ErrorPost = () => {
  const location = useLocation();
  const message = location.state?.message || "הפוסט שלך לא ניתן לפרסום.";

  return (
    <div className="mainContainer">
      <div className="message-card">
        {/* אייקון קטן להמחשה */}
        <div style={{ fontSize: "3rem", marginBottom: "10px" }}>⚠️</div>
        
        <h2>לא נוכל לפרסם את הפוסט</h2>
        <p>{message}</p>
        
        <Link to="/" className="btn-back">
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
};

export default ErrorPost;