import { useLocation } from "react-router";

const ErrorPost = () => {
  const location = useLocation();
  const message = location.state?.message || "הפוסט שלך לא ניתן לפרסום.";

  return (
    <div style={{
      padding: "30px",
      backgroundColor: "#fff3f0",
      borderRadius: "15px",
      border: "1px solid #ffbaba",
      maxWidth: "700px",
      margin: "40px auto",
      lineHeight: "1.6"
    }}>
      <h2 style={{ color: "#d73b43", marginBottom: "20px" }}>לא נוכל לפרסם את הפוסט</h2>
      <p>{message}</p>
    </div>
  );
};

export default ErrorPost;
