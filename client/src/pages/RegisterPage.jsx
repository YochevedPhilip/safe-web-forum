import {useState} from "react";
import {Link} from "react-router-dom"

//Forum Register page
const Register = () => {
  const [msg, setMsg] = useState("");
  return (
    <div>
        <h1>Create a new account:</h1>
        <input placeholder="username" />
        <br />
        <input placeholder="mail" />
        <br />
        <input placeholder="password" />
        <br />
        <button type="button" onClick={()=>{
          fetch("http://localhost:5000/login", {method: "POST"}).then((r) => r.text()).then(setMsg);
        }}>Submit</button>
        <br />
        <Link to="/login">sign in</Link>
        <p>{msg}</p>
    </div>
  );
};

export default Register;