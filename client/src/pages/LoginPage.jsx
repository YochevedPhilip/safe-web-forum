//import styles from './Home.module.css';
import {useState} from "react";
//import { useNavigate } from "react-router-dom";


//Forum Login page
const Login = () => {
  const [msg, setMsg] = useState("");
  return (
    <div>
        <h1>Login to your account or create a new one!</h1>
        <input placeholder="username" />
        <br />
        <input placeholder="password" />
        <br />
        <button type="button" onClick={()=>{
          fetch("http://localhost:5000/login", {method: "POST"}).then((r) => r.text()).then(setMsg);
        }}>Submit</button>
        <p>{msg}</p>
    </div>
    // <div>Login Page Renders</div>
  );
};

export default Login;