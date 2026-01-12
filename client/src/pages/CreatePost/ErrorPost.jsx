import { useLocation, Link } from "react-router-dom";

const ErrorPost = () => {
  const location = useLocation();
  const message = location.state?.message || "Your post cannot be published.";

  return (
    <div className="mainContainer">
      <div className="message-card" style={{ maxWidth: "700px", margin: "40px auto", lineHeight: 1.6 }}>
        {/* Small icon for illustration */}
        <div style={{ fontSize: "3rem", marginBottom: "15px" }}>⚠️</div>

        <h2 style={{ color: "#d73b43", marginBottom: "20px" }}>We cannot publish your post</h2>
        <p>{message}</p>

        <Link to="/" className="btn-back">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPost;
