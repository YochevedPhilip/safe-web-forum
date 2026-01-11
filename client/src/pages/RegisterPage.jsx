import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [msg, setMsg] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.message || `שגיאה: ${res.status}`);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMsg(`נרשמת בהצלחה! ברוך הבא ${data.user.username}`);
    } catch (err) {
      setMsg("שגיאה: " + err.message);
    }
  };

  return (
    <div className="mainContainer">
      <div className="form-card">
        <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '10px' }}>
          יצירת חשבון
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          הצטרפו לקהילה שלנו והתחילו לשתף
        </p>

        <form onSubmit={handleSubmit}>
          <input 
            className="form-control"
            placeholder="שם משתמש" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <input 
            type="email"
            className="form-control"
            placeholder="אימייל" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input 
            type="password"
            className="form-control"
            placeholder="סיסמה" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-pink">
            הרשמה
          </button>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span style={{ color: '#666' }}>כבר יש לכם חשבון? </span>
            <Link to="/login" style={{ color: 'var(--mint-soft)', fontWeight: 'bold' }}>
              התחברו כאן
            </Link>
          </div>

          {msg && (
            <p style={{ 
              marginTop: '20px', 
              color: msg.includes('שגיאה') ? '#ff6b6b' : 'var(--mint-soft)',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              {msg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;