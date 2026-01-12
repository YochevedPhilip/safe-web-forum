import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../styles/App.module.css";

const ErrorPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || "חשוב לנו שתדעו שאתם לא לבד, ויש מי שמחכה להקשיב לכם.";

  return (
    <div className={styles.hugPageWrapper}>
      <div className={styles.hugCard}>
        {/* איור עדין או אימוג'י מחבק */}
        
        <h1 className={styles.hugTitle}>רצינו לעצור רגע ולחבק...</h1>
        
        <div className={styles.hugMessage}>
          <p>{message}</p>
        </div>

        <div className={styles.supportSection}>
          <p className={styles.supportLabel}>מישהו מחכה לדבר איתך עכשיו:</p>
          <a href="tel:1201" className={styles.warmHelpButton}>
            <span className={styles.phoneIcon}>📞</span>
            <span>שיחה חמה עם ער"ן (1201)</span>
          </a>
          <a href="https://www.eran.org.il/" target="_blank" rel="noopener noreferrer" className={styles.softLink}>
            מעדיף/ה להתכתב בצ'אט? לחצ/י כאן
          </a>
        </div>

        <button 
          className={styles.backHomeSoft} 
          onClick={() => navigate("/")}
        >
          חזרה למקום בטוח
        </button>
      </div>
    </div>
  );
};

export default ErrorPost;