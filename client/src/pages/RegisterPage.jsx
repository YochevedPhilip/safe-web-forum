import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [msg, setMsg] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  // Prefer using environment variable
  const API_BASE_URL = import.meta.env.VITE_SERVER_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
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
      setMsg("Error: " + err.message);
    }
  };

  return (
    <div className="mainContainer">
      <div className="form-card">
        <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '10px' }}>
          Create Account
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Join our community and start sharing
        </p>

        <form onSubmit={handleSubmit}>
          <input 
            className="form-control"
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <input 
            type="email"
            className="form-control"
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input 
            type="password"
            className="form-control"
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-pink">
            Sign Up
          </button>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span style={{ color: '#666' }}>Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--mint-soft)', fontWeight: 'bold' }}>
              Sign in here
            </Link>
          </div>

          {msg && (
            <p style={{ 
              marginTop: '20px', 
              color: msg.includes('Error') || msg.includes('error') ? '#ff6b6b' : 'var(--mint-soft)',
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
