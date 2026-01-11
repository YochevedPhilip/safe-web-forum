import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  // עדיף להשתמש במשתנה סביבתי במקום כתובת קשיחה
  const API_BASE_URL = import.meta.env.VITE_SERVER_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {  //TODO: decide where is the /
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json(); 
      if (!res.ok) {
        setMsg(data.message || `שגיאה: ${res.status}`);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      // מעבר לדף הבית לאחר הצלחה
      navigate("/");
    } catch (err) {
      setMsg("שגיאה בחיבור: " + err.message);
    }
  };

  return (
    <div className="mainContainer">
      <div className="form-card">
        <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '10px' }}>
          ברוכים הבאים
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          התחברו לחשבון שלכם או צרו אחד חדש
        </p>

        <form onSubmit={handleSubmit}>
          <input 
            type="email"
            className="form-control" 
            placeholder="אימייל" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          
          <input 
            className="form-control" 
            placeholder="סיסמה" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />

          <button type="submit" className="btn-pink">
            התחברות
          </button>
          
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span style={{ color: '#666' }}>עדיין אין לכם חשבון? </span>
            <Link to="/register" style={{ color: 'var(--mint-soft)', fontWeight: 'bold' }}>
              הרשמה כאן
            </Link>
          </div>

          {msg && (
            <p style={{ 
              marginTop: '20px', 
              color: msg.includes('שגיאה') ? '#ff6b6b' : 'var(--mint-soft)',
              fontWeight: '600'
            }}>
              {msg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
