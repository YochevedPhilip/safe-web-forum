import styles from './Home.module.css';
import RandomDuck from '../../components/RandomDuck/RandomDuck.jsx';
import { Link } from "react-router";

const Home = () => {
  return (
    <div className={styles.home}>
      <h1 className={styles.headline}>Duck It</h1>
      <RandomDuck />
      <Link to="/create-post">
        <button>Create New Post</button>
      </Link> 
    </div>
  );
};

export default Home;
