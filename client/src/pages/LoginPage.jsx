import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  // Prefer using environment variable instead of hardcoded address
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
        setMsg(data.message || `Error: ${res.status}`);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      // Navigate to home page after success
      navigate("/");
    } catch (err) {
      setMsg("Connection error: " + err.message);
    }
  };

  return (
    <div className="mainContainer">
      <div className="form-card">
        <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '10px' }}>
          Welcome
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Sign in to your account or create a new one
        </p>

        <form onSubmit={handleSubmit}>
          <input 
            type="email"
            className="form-control" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          
          <input 
            className="form-control" 
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />

          <button type="submit" className="btn-pink">
            Sign In
          </button>
          
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span style={{ color: '#666' }}>Don't have an account yet? </span>
            <Link to="/register" style={{ color: 'var(--mint-soft)', fontWeight: 'bold' }}>
              Sign up here
            </Link>
          </div>

          {msg && (
            <p style={{ 
              marginTop: '20px', 
              color: msg.includes('Error') || msg.includes('error') ? '#ff6b6b' : 'var(--mint-soft)',
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
