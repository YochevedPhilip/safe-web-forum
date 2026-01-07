import React from "react";
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
      fontFamily: "Arial, sans-serif",
      lineHeight: "1.6"
    }}>
      <h2 style={{ color: "#d8000c", marginBottom: "20px" }}>⚠️ פוסט נדחה</h2>
      <p style={{ fontSize: "16px", color: "#333" }}>{message}</p>
    </div>
  );
};

export default ErrorPost;
