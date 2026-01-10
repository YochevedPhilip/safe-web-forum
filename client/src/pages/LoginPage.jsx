//import styles from './Home.module.css';
import {useState} from "react";
import {Link, useNavigate} from "react-router"
//import { useNavigate } from "react-router-dom";


//Forum Login page
const Login = () => {
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");  //use email for login
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async(e) => {e.preventDefault();
    try{
      const res = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password}),
      });

      const data= await res.json() //expecting {token, user} or {message}
      if(!res.ok) {
        setMsg(data.message || 'status: ${res.status}');
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMsg('Welcome back ${data.user.username}!');

      //move to homepage after login
      navigate("/");
    }catch(err) {
      setMsg("error: " + err.message);
    }
  };

  return (
    // <div>
    <form onSubmit={handleSubmit}>
        <h1>Login to your account or create a new one!</h1>
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />
        <input placeholder="password" type="password" value={password} onChange= {(e) => setPassword(e.target.value)} />
        <br />
        <button type="submit">Submit</button>
        <br />
        <Link to="/register">register</Link>
        <p>{msg}</p>
    </form>
    // </div>
  );
};

export default Login;