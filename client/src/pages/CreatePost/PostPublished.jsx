import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/App.module.css";

const PostPublished = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    title,
    text,
    anonymous,
    aiMessage,
    riskLevel,
    categories
  } = location.state || {};

  const isSensitive = riskLevel === "MEDIUM";

  // colors for sensitive posts
  const sensitiveColor = "#f39c12";
  const sensitiveBg = "rgba(243, 156, 18, 0.07)";

  return (
    <div className={styles.hugPageWrapper}>
      <div className={styles.hugCard}>

        {/* Emoji */}
        <div className={styles.hugEmoji}>
          {isSensitive ? "✨" : "🎉"}
        </div>

        {/* Title */}
        <h1
          className={styles.hugTitle}
          style={{ color: isSensitive ? sensitiveColor : undefined }}
        >
          {isSensitive
            ? "הפוסט פורסם, ואנחנו כאן איתך"
            : "הפוסט פורסם בהצלחה!"}
        </h1>

        {/* AI Message */}
        {aiMessage && (
          <div
            style={{
              background: sensitiveBg,
              borderLeft: `4px solid ${sensitiveColor}`,
              padding: "10px 16px",
              borderRadius: "8px",
              marginBottom: "20px"
            }}
          >
            <p style={{ margin: 0, fontSize: "0.9rem" }}>
              💡 {aiMessage}
            </p>
          </div>
        )}

        {/* Sensitive explanation */}
        {isSensitive && (
          <div className={styles.issuesBox}>
            <p className={styles.issuesTitle}>
              מה המערכת שלנו זיהתה?
            </p>
            <ul className={styles.issuesList}>
              {categories?.length > 0 ? (
                categories.map((cat, i) => (
                  <li key={i}>• {cat}</li>
                ))
              ) : (
                <li>• זיהינו רגישות רגשית בתוכן</li>
              )}
            </ul>
          </div>
        )}

        {/* Support button */}
        {isSensitive && (
          <div className={styles.supportSectionSmall}>
            <p className={styles.supportLabel}>
              חשוב לנו שלא תישאר/י עם זה לבד
            </p>
            <a href="tel:1201" className={styles.elementorLikeButton}>
              פנייה למוקד 1201 »
            </a>
          </div>
        )}

        {/* Post Preview */}
        <div
          style={{
            background: isSensitive ? sensitiveBg : "#fff",
            borderRadius: "20px",
            padding: "28px",
            marginTop: "30px",
            border: isSensitive
              ? `1px solid ${sensitiveColor}33`
              : "1px solid #eee"
          }}
        >
          <h3 className={styles.postPreviewTitle}>{title}</h3>
          <p className={styles.postPreviewText}>{text}</p>

          <div className={styles.postPreviewFooter}>
            {anonymous
              ? "פורסם בעילום שם"
              : "פורסם באופן ציבורי"}
          </div>
        </div>

        {/* Back button */}
        <button
          className={isSensitive ? styles.backHomeSoft : styles["btn-mint"]}
          onClick={() => navigate("/")}
        >
          חזרה לפיד
        </button>

      </div>
    </div>
  );
};

export default PostPublished;
