import React from "react";
import styles from './Home.module.css';
import RandomDuck from '../../components/RandomDuck/RandomDuck.jsx';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; 

const Home = () => {
  const navigate = useNavigate();
  const [username] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if(!storedUser) return null;

    try{
      return JSON.parse(storedUser).username;
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    // remove auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    //go back to login page
    navigate("/login") 
  }

  return (
<div className={styles.home}>
  <h1 className={styles.headline}>Duck It</h1>
  <RandomDuck />

  {username ? (
    <>
      <p>Welcome, {username}!</p>
      <button onClick={handleLogout}>Logout</button>
    </>
  ) : (
    <p>You are not logged in</p>
  )}

  <Link to="/create-post">
    <button>Create New Post</button>
  </Link> 
</div>

  );
};

export default Home;
