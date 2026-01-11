import { useLocation, Link } from "react-router-dom";

const ErrorPost = () => {
  const location = useLocation();
  const message = location.state?.message || "הפוסט שלך לא ניתן לפרסום.";

  return (
    <div className="mainContainer">
      <div className="message-card" style={{ maxWidth: "700px", margin: "40px auto", lineHeight: 1.6 }}>
        {/* אייקון קטן להמחשה */}
        <div style={{ fontSize: "3rem", marginBottom: "15px" }}>⚠️</div>

        <h2 style={{ color: "#d73b43", marginBottom: "20px" }}>לא נוכל לפרסם את הפוסט</h2>
        <p>{message}</p>

        <Link to="/" className="btn-back">
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
};

export default ErrorPost;
