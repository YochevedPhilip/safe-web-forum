import styles from './Home.module.css';
import RandomDuck from '../../components/RandomDuck/RandomDuck.jsx';


const Home = () => {
  return (
    <div className={styles.home}>
      <h1 className={styles.headline}>Duck It</h1>
      <RandomDuck />
    </div>
  );
};

//Forum homepage
// const Forum = () => {
//   return (
//     <div>
//       <h1>Welcome to our Forum!</h1>
//     </div>
//   );
// };

export default Home;
