import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/App.module.css";


const PostPublished = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { title, text, anonymous, aiMessage, riskLevel, categories } = location.state || {};

  const isSensitive = riskLevel === "SENSITIVE";
  // תנאי חדש: האם הפוסט ארוך מספיק כדי להציע עזרה (למשל מעל 50 תווים)
  const isLongEnoughForHelp = text && text.length > 50;

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

        {/* הצגת הסבר על הרגישות - רק אם הפוסט רגיש */}
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

        {/* כפתור ער"ן - מופיע רק אם הפוסט רגיש וגם מספיק ארוך/עמוק */}
        {isSensitive && isLongEnoughForHelp && (
          <div className={styles.supportSectionSmall}>
            <p className={styles.supportLabel}>פרקת הרבה מהלב... אולי תרצה/י לדבר עם מישהו?</p>
            <a href="tel:1201" className={styles.warmHelpButton}>
              <span className={styles.phoneIcon}>📞</span>
              <span>קו חם ער"ן - 1201</span>
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