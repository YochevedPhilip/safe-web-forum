import styles from './Home.module.css';
import RandomDuck from '../../components/RandomDuck/RandomDuck.jsx';

import {useState, useEffect} from "react";
const Home = () => {
  const [username] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if(!storedUser) return null;

    try{
      return JSON.parse(storedUser).username;
    } catch {
      return null;
    }
  });
  // const [username, setUsername] = useState(null);
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if(storedUser) {
  //     const user = JSON.parse(storedUser);
  // //     setUsername(user.username);
  //   const [username] = useState(() => {
  //     const storedUser = localStorage.getItem("user");
  //     return storedUser ? JSON.parse(storedUser).username : null;
  //   });
  //   }
  // }, []);
  return (
    <div className={styles.home}>
      <h1>Home Page</h1>
      {username ? (<p>Welcome, {username}!</p>) : (<p>You are not logged in</p>)}
      {/* <h1 className={styles.headline}>Duck It</h1>
      <RandomDuck /> */}
    </div>
  );
};

export default Home;
