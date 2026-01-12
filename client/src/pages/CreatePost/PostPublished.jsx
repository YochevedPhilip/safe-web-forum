import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/App.module.css";

const PostPublished = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { title, text, anonymous, aiMessage, riskLevel, categories } = location.state || {};

  const isSensitive = riskLevel === "MEDIUM";

  return (
    <div className={styles.hugPageWrapper}>
      <div className={styles.hugCard}>
        
        <div className={styles.hugEmoji}>{isSensitive ? "✨" : "🎉"}</div>
        <h1 className={styles.hugTitle}>
          {isSensitive ? "הפוסט פורסם, ואנחנו כאן איתך" : "הפוסט פורסם בהצלחה!"}
        </h1>

        <div className={styles.hugMessage}>
          <p>{aiMessage || "איזה כיף לראות את השיתוף שלך בקהילה שלנו."}</p>
        </div>

        {/* הצגת הסבר על הרגישות */}
        {isSensitive && (
          <div className={styles.issuesBox}>
            <p className={styles.issuesTitle}>מה המערכת שלנו הרגישה?</p>
            <ul className={styles.issuesList}>
              {categories?.length > 0 
                ? categories.map((cat, i) => <li key={i}>• {cat}</li>)
                : <li>• זיהינו תוכן שמעלה רגישות רגשית</li>
              }
            </ul>
          </div>
        )}

        {/* כפתור פנייה למוקד - מופיע תמיד בפוסט רגיש (MEDIUM) */}
        {isSensitive && (
          <div className={styles.supportSectionSmall}>
            <p className={styles.supportLabel}>חשוב לנו שלא תישאר/י עם זה לבד:</p>
            <a href="tel:1201" className={styles.elementorLikeButton}>
              <span className="elementor-button-text">פנה למוקד {">>"}</span>
            </a>
          </div>
        )}

        <div className={styles.postPreviewInsideCard}>
          <h3 className={styles.postPreviewTitle}>{title}</h3>
          <p className={styles.postPreviewText}>{text}</p>
          <div className={styles.postPreviewFooter}>
            {anonymous ? "פורסם בעילום שם" : "פורסם באופן ציבורי"}
          </div>
        </div>

        <button 
          className={isSensitive ? styles.backHomeSoft : styles['btn-mint']} 
          onClick={() => navigate("/")}
        >
          חזרה לפיד
        </button>
      </div>
    </div>
  );
};

export default PostPublished;