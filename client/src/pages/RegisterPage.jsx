import {useState} from "react";
import {Link} from "react-router-dom"

//Forum Register page
const Register = () => {
  const [msg, setMsg] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, email, password}),
      });
      // const text = await res.text();
      // setMsg(text||'status: ${res.status}');
      const data = await res.json(); //read json
      if(!res.ok) {
        // backend should send {message:"..."} on errors
        setMsg(data.message || 'status: ${res.status}');
        return;
      }

      //save auth info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMsg(`Registered! Welcome ${data.user.username}`);
    } catch (err) {
      setMsg("error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        <h1>Create a new account:</h1>
        <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
        <br />
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <br />
        <input placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <br />
        <button type="submit">Submit</button> 
        {/* onClick={()=>{
          // fetch("http://localhost:5000/register", {method: "POST"}).then((r) => r.text()).then(setMsg);
          fetch("http://localhost:5000/register", {
            method: "POST", 
            headers:{ "Content-Type": "application/json"},
              body: JSON.stringify({username, email, password}),
            });
        }}>Submit</button> */}
        <br />
        <Link to="/login">sign in</Link>
        <p>{msg}</p>
    </form>
  );
};

export default Register;